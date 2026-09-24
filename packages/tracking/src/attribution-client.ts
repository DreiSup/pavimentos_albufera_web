/**
 * Client-side landing-param capture. This repo's policy is stricter than
 * Pavivasa's (D8): the WHOLE captured bundle — UTM params included, not
 * just click ids — needs marketing consent before it leaves the browser,
 * hence `utmRequiresConsent = true` (Pavivasa: `false`).
 *
 * NOT wired into `components/layout/Atribucion.tsx` in this migration:
 * that component is frozen (P3 frontend allowlist, DECISIONS D13) and its
 * capture-in-memory + POST-to-`/api/atribucion` design is this repo's own
 * mechanism (the cookie itself is written server-side, by
 * `@site/tracking/server`'s `buildAttributionCookieResponse`, not from
 * here) — rewiring `Atribucion.tsx` to call this generic shape is a
 * frontend change out of scope for a zero-behaviour-change phase. Kept
 * for template convergence; unimported by any adapter leaf, so it ships
 * to no route.
 */
export const utmRequiresConsent = true

export type AttributionCaptureConfig = {
  paramKeys: readonly string[]
  maxValueLength?: number
}

/** Pure: takes `location.search` as a string so it doesn't reach into `window` itself. */
export function captureLandingParams(
  search: string,
  config: AttributionCaptureConfig,
): Record<string, string> | undefined {
  const maxValueLength = config.maxValueLength ?? 200
  const params = new URLSearchParams(search)
  const captured: Record<string, string> = {}
  for (const key of config.paramKeys) {
    const value = params.get(key)
    if (value) captured[key] = value.slice(0, maxValueLength)
  }
  return Object.keys(captured).length > 0 ? captured : undefined
}
