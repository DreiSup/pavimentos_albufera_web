#!/usr/bin/env node
// scripts/verify/index.mjs [appDir]
//
// Postbuild verifier — this repo's own permanent quality gate (D29 of the
// monorepo migration's DECISIONS.md; ported from Pavivasa's scripts/verify,
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
// as one explicit list so a run's `relevantChecks` (and therefore its
// staleness scope) always matches reality, and so `--skip-server` (which
// runs neither `checkLive` nor its 'redirects'/'internal-links' issues, and
// no 'sitemap:url-not-200'/'metadata-route-not-200' from it either) doesn't
// make an unrelated baseline entry look stale.
const ALL_CHECK_NAMES = ['build', 'sitemap', 'metadata', 'jsonld', 'images', 'cta', 'robots', 'internal-links', 'redirects']
// Checks that only `checkLive` (the live-server half) can report — excluded
// from `relevantChecks` under `--skip-server`.
const LIVE_ONLY_CODES = new Set(['internal-links', 'redirects'])

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
  const relevantChecks = args.skipServer ? ALL_CHECK_NAMES.filter((c) => !LIVE_ONLY_CODES.has(c)) : ALL_CHECK_NAMES
  // failOnStale: true — D29 requires a stale baseline entry to fail the
  // build here, not just print (unlike Pavivasa's index.mjs, which only
  // prints it; secrets-scan.mjs's own reasoning for turning this on
  // applies just as much here: a stale entry almost always means the
  // underlying issue got fixed and nobody removed its baseline line, and
  // that's worth catching before something reintroduces it silently.
  const reporter = new Reporter(knownIssues, relevantChecks, { failOnStale: true })

  // -- read + parse every page once, tag noindex (header OR <meta robots>).
  const pages = []
  for (const p of build.pages) {
    const html = await readHtml(p, reporter)
    if (html === null) continue
    const parsed = parsePage(html)
    const noindex = isNoindexByHeader(p.publicPath, build.noindexHeaderRules) || isNoindexMeta(parsed.robotsMeta)
    pages.push({ ...p, parsed, noindex })
  }

  const siteUrl = (
    args.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    pages.find((p) => p.route === '/')?.parsed.canonical ||
    'https://pavimentos-albufera.com'
  ).replace(/\/+$/, '')

  // Whole-build facts, not per-page: does AT LEAST ONE page carry a real
  // tel:/wa.me link? See checks/images-cta.mjs's header comment for why
  // this — not `process.env.NEXT_PUBLIC_TELEFONO`/`_WHATSAPP` (a plain
  // `node` process here never sees `.env.local`'s values the way `next
  // build` does) — is how "contact data configured" is determined, and why
  // it has to be build-wide rather than derived from `process.env`.
  const phoneConfigured = pages.some((p) => p.parsed.links.some((l) => (l.href || '').startsWith('tel:')))
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
