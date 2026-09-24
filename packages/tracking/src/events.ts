/**
 * Single exit point towards GA4 and the Meta Pixel. Safe no-op if the
 * underlying script never loaded (no consent, or no id configured).
 *
 * Positional arguments, not an options object: measured against this
 * migration's zero-residual JS budget (DECISIONS D26), an
 * `{params, metaStandardEvent, metaEventId}` literal built at the call
 * site costs real bytes a minifier can't mangle away (property names
 * survive minification) on EVERY route that reaches this function through
 * the app-level adapter (`apps/web/src/lib/eventos.ts`'s `registrarEvento`,
 * itself reached from the root layout on every page). D26 outranks
 * Pavivasa's own `{params, metaStandardEvent, metaEventId}`-shaped
 * `trackEvent` (the shape this file first shipped with, and the shape
 * that failed the gate) — see the package README for the measurement.
 *
 * No `adsConversion` parameter either, for the same budget reason: this
 * repo has no live Google Ads conversion call site (confirmed by reading
 * `lib/eventos.ts` in full — no `gtag('event','conversion',...)`
 * anywhere). Session-once dedup and page/device auto-params stay in the
 * app-level adapter: this repo's own contract, not generic package
 * behaviour.
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export function trackEvent(
  name: string,
  params?: Record<string, unknown>,
  metaStandardEvent?: string,
  metaEventId?: string,
): void {
  if (typeof window === 'undefined') return

  window.gtag?.('event', name, params)

  const event = metaStandardEvent ?? name
  const method = metaStandardEvent ? 'track' : 'trackCustom'
  if (metaEventId) {
    window.fbq?.(method, event, params, { eventID: metaEventId })
  } else {
    window.fbq?.(method, event, params)
  }
}
