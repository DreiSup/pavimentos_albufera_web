#!/usr/bin/env node
// scripts/verify/index.mjs [appDir]
//
// Postbuild verifier — this repo's own permanent quality gate (D29 of the
// monorepo migration's docs/migration/DECISIONS.md; ported from Pavivasa's scripts/verify,
// adapted to this site's own routes/shapes — see each checks/*.mjs and
// lib/*.mjs file for the specific divergence). Run this AFTER `pnpm
// --filter web build`. See scripts/verify/README.md for the full list of
// checks, flags, the overlap table against `apps/web/scripts/verificar-*
// .mjs`, and how the known-issues baseline works.
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'

import { loadBuild, isNoindexByHeader } from './lib/manifest.mjs'
import { parsePage, isNoindexMeta } from './lib/html.mjs'
import { startServer, findFreePort } from './lib/net.mjs'
import { Reporter, loadKnownIssues } from './lib/reporter.mjs'
import { business } from '../../packages/content/src/data/business.ts'

import { checkSitemapStatic } from './checks/sitemap.mjs'
import { checkMetadata } from './checks/metadata.mjs'
import { checkJsonLd } from './checks/jsonld.mjs'
import { checkImagesAndCta } from './checks/images-cta.mjs'
import { checkRobots } from './checks/robots.mjs'
import { checkPageCount } from './checks/page-count.mjs'
import { checkLive } from './checks/live.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..', '..')

// Every check name any of the checks/*.mjs modules can report under — kept
// as one explicit list so a run's `relevantChecks` scope matches reality.
const ALL_CHECK_NAMES = ['build', 'sitemap', 'metadata', 'jsonld', 'images', 'cta', 'robots', 'internal-links', 'redirects']
// `check:code` pairs only `checkLive` (the live-server half) can report —
// excluded (not the whole check, see `excludeCodes`'s own comment in
// lib/reporter.mjs) under `--skip-server`. `sitemap` itself stays fully
// relevant: `checkSitemapStatic` still runs and still reports
// `sitemap:missing-from-sitemap`/`sitemap:not-a-real-page` under
// `--skip-server`, only `checkLive`'s two `sitemap:*` codes don't run.
const LIVE_ONLY_CODES = ['sitemap:url-not-200', 'sitemap:metadata-route-not-200', 'internal-links:broken-or-redirecting', 'redirects:wrong-status']

function parseArgs(argv) {
  const args = { appDir: null, nextDir: null, siteUrl: null, port: null, skipServer: false, knownIssues: null }
  const positional = []
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--next-dir') args.nextDir = argv[++i]
    else if (a === '--site-url') args.siteUrl = argv[++i]
    else if (a === '--port') args.port = Number(argv[++i])
    else if (a === '--known-issues') args.knownIssues = argv[++i]
    else if (a === '--skip-server') args.skipServer = true
    else positional.push(a)
  }
  args.appDir = positional[0] ?? null
  return args
}

async function readHtml(page, reporter) {
  try {
    return await fs.readFile(page.htmlFile, 'utf8')
  } catch {
    reporter.report({
      check: 'build',
      code: 'missing-html-file',
      route: page.publicPath,
      message: `no prerendered HTML file at ${page.htmlFile}`,
    })
    return null
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const appDir = path.resolve(repoRoot, args.appDir ?? 'apps/web')
  const nextDir = args.nextDir ? path.resolve(process.cwd(), args.nextDir) : path.join(appDir, '.next')
  const knownIssuesPath = args.knownIssues ?? path.join(__dirname, 'known-issues.json')

  const build = await loadBuild(nextDir)
  const knownIssues = await loadKnownIssues(knownIssuesPath)
  // failOnStale: true — D29 requires a stale baseline entry to fail the
  // build here, not just print (unlike Pavivasa's index.mjs, which only
  // prints it; secrets-scan.mjs's own reasoning for turning this on
  // applies just as much here: a stale entry almost always means the
  // underlying issue got fixed and nobody removed its baseline line, and
  // that's worth catching before something reintroduces it silently.
  const reporter = new Reporter(knownIssues, ALL_CHECK_NAMES, {
    failOnStale: true,
    excludeCodes: args.skipServer ? LIVE_ONLY_CODES : null,
  })

  // -- read + parse every page once, tag noindex (header OR <meta robots>),
  // keep the raw HTML too (needed below for the reserve-phone-text check).
  const pages = []
  for (const p of build.pages) {
    const html = await readHtml(p, reporter)
    if (html === null) continue
    const parsed = parsePage(html)
    const noindex = isNoindexByHeader(p.publicPath, build.noindexHeaderRules) || isNoindexMeta(parsed.robotsMeta)
    pages.push({ ...p, html, parsed, noindex })
  }

  const siteUrl = (
    args.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    pages.find((p) => p.route === '/')?.parsed.canonical ||
    'https://pavimentos-albufera.com'
  ).replace(/\/+$/, '')

  // Whole-build facts, not per-page — see checks/images-cta.mjs's header
  // comment for why this can't be `process.env.NEXT_PUBLIC_TELEFONO`/
  // `_WHATSAPP` (a plain `node` process here never sees `.env.local`'s
  // values the way `next build` does).
  //
  // `phoneConfigured`: NOT "does some page have a tel: link" — that has a
  // false negative when the env IS set but `telefonoHref` breaks some other
  // way (a future refactor of `lib/config.ts`, say): every tel: link would
  // fall back to `#`/`/presupuesto/` on EVERY page, "some page has one"
  // would read false, and the CTA/JSON-LD `telephone` checks would wrongly
  // drop to informational instead of catching a real regression. Instead:
  // does ANY page's RAW html contain the phone RESERVE PLACEHOLDER text
  // (`packages/content/src/data/business.ts`'s `phonePlaceholder.es`,
  // `apps/web/src/lib/config.ts`'s `telefonoMostrado` fallback) — the same
  // signal `apps/web/scripts/verificar-landings.mjs` already keys its own
  // production-fatal check on. Read from the RAW html (before
  // `parsePage`'s script/style/comment stripping), matching that script's
  // own `html.includes(reserva)` — the placeholder is plain visible text,
  // never inside a script/style block, so this is equivalent, just checked
  // here without re-reading every file from disk a second time.
  const phoneConfigured = !pages.some((p) => p.html.includes(business.phonePlaceholder.es))
  // WhatsApp has no equivalent reserve-placeholder text anywhere in the
  // rendered output (`whatsappHref` is simply omitted, no fallback string
  // shown) — so this stays the coarser "does at least one page have a real
  // wa.me link" heuristic, with the SAME false-negative limitation
  // `phoneConfigured` used to have: it cannot distinguish "WhatsApp env
  // unset" from "env set but every wa.me link broke build-wide". Documented
  // in scripts/verify/README.md; not fixed here for lack of a comparable
  // signal to key off.
  const whatsappConfigured = pages.some((p) => p.parsed.links.some((l) => /wa\.me\//.test(l.href || '')))

  console.log(`verify: ${pages.length} page(s), site "${siteUrl}", build ${nextDir}`)
  console.log(`verify: contact data — phone ${phoneConfigured ? 'configured' : 'NOT configured (pending)'}, WhatsApp ${whatsappConfigured ? 'configured' : 'NOT configured (pending)'}`)

  // -- static checks (no server needed): run first, so nothing below can
  // mutate `.next` before they read it (see README.md "Why static checks run first").
  const sitemapUrls = await checkSitemapStatic({ pages, nextDir, siteUrl, reporter })
  checkMetadata({ pages, siteUrl, reporter })
  checkJsonLd({ pages, phoneConfigured, reporter })
  checkImagesAndCta({ pages, phoneConfigured, whatsappConfigured, reporter })
  await checkRobots({ nextDir, siteUrl, sitemapUrls, reporter })
  checkPageCount({ pages, reporter })

  if (!args.skipServer) {
    const port = args.port ?? (await findFreePort(4173))
    console.log(`verify: starting next start on port ${port} (from ${appDir})`)
    const server = await startServer(appDir, port, { NEXT_PUBLIC_SITE_URL: siteUrl })
    try {
      await checkLive({ pages, build, siteUrl, baseUrl: server.baseUrl, sitemapUrls, reporter })
    } finally {
      server.stop()
    }
  } else {
    console.log('verify: --skip-server passed, skipping (a)-live/(b)/(c) HTTP checks')
  }

  reporter.print()
  process.exit(reporter.exitCode)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
