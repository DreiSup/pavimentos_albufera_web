/**
 * `@site/tracking` — client-safe analytics/consent/attribution
 * primitives. No secrets here; see `"@site/tracking/server"` for Meta
 * CAPI. Explicit named re-exports, not `export * from`, so a consumer
 * that only needs `trackEvent` doesn't pull in the rest too.
 *
 * This repo's own adapters (`apps/web/src/lib/*`) import each leaf
 * subpath directly (`@site/tracking/events`, `.../read-cookie`, …),
 * never this barrel — see D17(final)/the package-plan's no-barrels rule
 * for client-reachable modules. This entry exists for a future consumer
 * that genuinely wants the whole surface, and for parity with Pavivasa's
 * own `@site/tracking` barrel.
 */
export { trackEvent } from './events.ts'

export { readCookie } from './read-cookie.ts'
export { writeCookie } from './write-cookie.ts'
export { deleteTrackerCookies } from './tracker-cookies.ts'
export { createTrackerCookieCleanup } from './tracker-cookie-factory.ts'
export type { TrackerCookieCleanupConfig } from './tracker-cookie-factory.ts'
export { generateReferenceCode } from './reference-code.ts'

export { createCookieConsentStore, DEFAULT_CONSENT_COOKIE, DEFAULT_CONSENT_COOKIE_MAX_AGE_DAYS } from './consent-store.ts'
export type { CookieConsentStoreConfig } from './consent-store.ts'

export { buildConsentDefaultScript } from './consent-mode.ts'

export { captureLandingParams, utmRequiresConsent } from './attribution-client.ts'
export type { AttributionCaptureConfig } from './attribution-client.ts'
