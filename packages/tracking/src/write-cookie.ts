/**
 * Generic first-party cookie write, `document.cookie`-based. One export
 * per file — see `read-cookie.ts`'s header for why this split matters
 * here (docs/migration/DECISIONS.md D17(final)/D26).
 *
 * Byte-for-byte port of the pre-migration `lib/cookies.ts`'s
 * `escribirCookie`.
 */
export function writeCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Expires=${expires}; SameSite=Lax${secure}`
}
