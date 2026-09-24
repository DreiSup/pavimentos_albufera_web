/**
 * Cleanup for first-party tracker cookies that gtag.js/fbevents.js already
 * wrote once marketing consent is withdrawn. One export per file (its own
 * concern, only ever needed together with `deleteTrackerCookies` — see
 * `read-cookie.ts`'s header for why file-per-export matters here,
 * docs/migration/DECISIONS.md D17(final)/D26).
 *
 * `deleteTrackerCookies` takes `prefixes`/`exactNames` directly, not a
 * config-object factory: `apps/web/src/lib/cookies.ts`'s
 * `borrarCookiesRastreo` has exactly one call shape, so the factory closure
 * this file first shipped with cost a closure allocation and a
 * `config.exactNames ?? []` default for zero real flexibility gained.
 * `createTrackerCookieCleanup` stays, UNUSED, in `tracker-cookie-factory.ts`
 * for template convergence (Pavivasa's own package shape) — unimported by
 * any adapter leaf, so it ships to no route.
 *
 * Byte-for-byte port of the pre-migration `lib/cookies.ts`'s
 * `borrarCookiesRastreo`, parameterized: this repo matches by PREFIX
 * (`_ga`, `_gcl`) *and* EXACT name (`_fbp`, `_fbc`, `pa_attr`) — unlike
 * Pavivasa's prefix-only factory — so `exactNames` is a real, needed
 * config field, not a speculative addition. No try/catch anywhere in this
 * module, on purpose: the pre-migration version had none either.
 */

/**
 * Every domain suffix of `host` with at least two labels, the host itself
 * included: `www.example.com` -> `['www.example.com', 'example.com']`.
 * A browser silently rejects a `Domain` that is a public suffix or has
 * fewer labels than the host itself, so this doesn't need to filter that
 * out — trying costs nothing, and nothing breaks if it's rejected. A
 * single-label host (`localhost`) has no suffix to try and is left with
 * only the no-`Domain` deletion.
 */
function domainSuffixes(host: string): string[] {
  if (/^[\d.]+$/.test(host) || host.includes(':')) return [] // IP or localhost:port
  const labels = host.split('.')
  const suffixes: string[] = []
  for (let i = 0; i < labels.length - 1; i++) suffixes.push(labels.slice(i).join('.'))
  return suffixes
}

/**
 * `exactNames` has no default value: a JS default parameter compiles to
 * `arguments.length>1&&void 0!==arguments[1]?arguments[1]:[]`-shaped
 * boilerplate under this repo's browser targets, and the one real call
 * site (`apps/web/src/lib/cookies.ts`'s `borrarCookiesRastreo`) always
 * passes both arguments anyway.
 */
export function deleteTrackerCookies(prefixes: readonly string[], exactNames: readonly string[]): void {
  if (typeof document === 'undefined') return
  const names = new Set<string>()
  for (const pair of document.cookie.split('; ')) {
    const separator = pair.indexOf('=')
    if (separator === -1) continue
    const name = pair.slice(0, separator)
    if (prefixes.some((prefix) => name.startsWith(prefix)) || exactNames.includes(name)) {
      names.add(name)
    }
  }
  if (names.size === 0) return
  const domains = domainSuffixes(window.location.hostname)
  for (const name of names) {
    document.cookie = `${name}=; Path=/; Max-Age=0`
    for (const domain of domains) {
      document.cookie = `${name}=; Path=/; Max-Age=0; Domain=${domain}`
    }
  }
}
