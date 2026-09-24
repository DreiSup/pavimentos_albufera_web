/**
 * Generic first-party cookie read, `document.cookie`-based. One export per
 * file (docs/migration/DECISIONS.md D17(final)/D26): `apps/web/src/lib/cookies.ts` re-exports
 * this as a local `const` binding, not an `export { x }` of the imported
 * name — a plain re-export rewires every client component that imports
 * `leerCookie` to import THIS module directly, which stops webpack from
 * concatenating it into the single-importer adapter module and costs real,
 * measured bytes on every route (see the package README). A `const`
 * binding assigned from the import is still just this function, but it
 * keeps `lib/cookies.ts` as the one and only importer.
 *
 * Byte-for-byte port of the pre-migration `lib/cookies.ts`'s `leerCookie`.
 */
export function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const pairs = document.cookie.split('; ')
  for (const pair of pairs) {
    const separator = pair.indexOf('=')
    if (separator === -1) continue
    if (pair.slice(0, separator) === name) {
      return decodeURIComponent(pair.slice(separator + 1))
    }
  }
  return undefined
}
