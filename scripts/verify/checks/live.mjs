// Checks that need real HTTP semantics against a running `next start`,
// always the real app directory (never a defect-planting copy of `.next` —
// see scripts/verify/README.md):
//   (a), live half: every sitemap URL returns 200.
//   (b) no internal <a href> leads to a 404 or a redirect.
//   (c) every next.config redirect returns the expected status code, 308.
//
// (c) is NARROWED vs. Pavivasa's original, which also resolves the
// redirect's destination and asserts it returns 200 in exactly one hop.
// `apps/web/scripts/verificar-redirecciones.mjs` already owns "does every
// redirect land on a route that really exists" (a STATIC check against
// `prerender-manifest.json`/`routes-manifest.json`, no live server needed)
// — see scripts/verify/README.md's overlap table; porting the destination
// half here would duplicate it. What Pavivasa's check has and
// verificar-redirecciones.mjs does NOT is the STATUS CODE assertion: this
// site's 33 redirects (`next.config.ts`'s `redirects()`, all `permanent:
// true`) must all resolve as 308 specifically (verified against a real
// build's routes-manifest.json — Next 15's App Router always emits 308 for
// `permanent: true`, never 301), not just "some 3xx". That's the part kept.
/**
 * Resolves `href` against `base` (a full URL) the way a browser would —
 * this is what makes relative hrefs and protocol-relative ones work, and
 * what correctly rejects a same-prefix-but-different-host href.
 * Returns the resolved pathname, or `null` for anything not on `siteOrigin`
 * (external links, tel:, mailto:, wa.me...).
 */
function resolveInternalPath(href, base, siteOrigin) {
  let resolved
  try {
    resolved = new URL(href, base)
  } catch {
    return null
  }
  if (resolved.origin !== siteOrigin) return null
  return resolved.pathname
}

async function fetchStatus(baseUrl, localPath) {
  try {
    const res = await fetch(`${baseUrl}${localPath}`, { redirect: 'manual', signal: AbortSignal.timeout(10000) })
    return { status: res.status, location: res.headers.get('location') }
  } catch (err) {
    return { status: null, error: String(err) }
  }
}

/**
 * A concrete, probeable path for one `next.config` redirect `source`. Most
 * sources are already concrete (`trailingSlash: true` means every one ends
 * in `/`); the one dynamic source on this site, `/fr/:path` + a wildcard,
 * needs a real segment substituted in — probing the literal source would
 * 404 against `next start`, which doesn't match its own dynamic-segment
 * syntax.
 */
function probePathFor(source) {
  const WILDCARD = ':path' + '*' // kept out of one literal so this comment/string never contains "*/"
  if (source.includes(WILDCARD)) return source.replace(WILDCARD, 'cualquier-cosa/')
  return source
}

export async function checkLive({ pages, build, siteUrl, baseUrl, sitemapUrls, reporter }) {
  reporter.startCheck('(a) sitemap URLs -> 200 · (b) internal links -> no 404/redirect · (c) redirects -> 308')

  const siteOrigin = new URL(siteUrl).origin

  // -- (a) live: every sitemap URL returns 200, plus the metadata routes themselves.
  for (const url of sitemapUrls) {
    const local = resolveInternalPath(url, siteUrl, siteOrigin) ?? url
    const { status } = await fetchStatus(baseUrl, local)
    if (status !== 200) {
      reporter.report({ check: 'sitemap', code: 'url-not-200', route: local, detail: String(status ?? 'no-response'), message: `sitemap URL "${url}" returned ${status ?? 'no response'}, expected 200` })
    }
  }
  for (const metaPath of ['/robots.txt', '/sitemap.xml']) {
    const { status } = await fetchStatus(baseUrl, metaPath)
    if (status !== 200) {
      reporter.report({ check: 'sitemap', code: 'metadata-route-not-200', route: metaPath, message: `"${metaPath}" returned ${status ?? 'no response'}, expected 200` })
    }
  }

  // -- (b) internal links: collect unique targets, fetch once each, report per occurrence.
  const usageByPath = new Map() // localPath -> Set(page.publicPath)
  for (const page of pages) {
    const pageUrl = `${siteUrl}${page.publicPath}`
    for (const link of page.parsed.links) {
      const href = link.href || ''
      if (!href || href.startsWith('#')) continue
      const local = resolveInternalPath(href, pageUrl, siteOrigin)
      if (local === null) continue // external, tel:, mailto:, wa.me...
      if (!usageByPath.has(local)) usageByPath.set(local, new Set())
      usageByPath.get(local).add(page.publicPath)
    }
  }
  for (const [localPath, usedBy] of usageByPath) {
    const { status, location } = await fetchStatus(baseUrl, localPath)
    if (status === 200) continue
    const detail =
      status && status >= 300 && status < 400
        ? `redirects (${status}) to "${location}" — link should point at the final URL`
        : `returned ${status ?? 'no response'}`
    for (const usedByRoute of usedBy) {
      reporter.report({ check: 'internal-links', code: 'broken-or-redirecting', route: usedByRoute, detail: localPath, message: `link to "${localPath}" ${detail}` })
    }
  }

  // -- (c) redirects: status code only (308) — destination existence is
  // `apps/web/scripts/verificar-redirecciones.mjs`'s job, see this file's
  // header comment.
  for (const r of build.redirects) {
    const probePath = probePathFor(r.source)
    const { status } = await fetchStatus(baseUrl, probePath)
    if (status !== 308) {
      reporter.report({
        check: 'redirects',
        code: 'wrong-status',
        route: r.source,
        detail: String(status ?? 'no-response'),
        message: `expected a 308 redirect (this site's next.config.ts always uses permanent:true), got ${status ?? 'no response'} probing "${probePath}"`,
      })
    }
  }

  reporter.endCheck()
}
