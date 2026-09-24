/**
 * Generic short random code generator over a caller-supplied alphabet.
 * One export per file — see `read-cookie.ts`'s header for why this split
 * matters here (DECISIONS D17(final)/D26).
 *
 * Byte-for-byte port of the pre-migration `lib/cookies.ts`'s
 * `generarReferencia` (6 bytes, `crypto.getRandomValues`), parameterized
 * by alphabet and length so this repo's `ALFABETO` (no `0`/`O`/`1`/`I` —
 * someone has to type or read it aloud) stays a literal in the app-level
 * adapter, per D18.
 */
export function generateReferenceCode(alphabet: string, length: number): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')
}
