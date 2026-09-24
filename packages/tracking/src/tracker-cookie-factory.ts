/**
 * `createTrackerCookieCleanup` — Pavivasa's own curried-factory shape over
 * `deleteTrackerCookies` (`tracker-cookies.ts`), kept for template
 * convergence. UNUSED by this repo's adapter (`apps/web/src/lib/cookies.ts`
 * calls `deleteTrackerCookies` directly — see `tracker-cookies.ts`'s own
 * header) and in its own leaf file so it never pulls `tracker-cookies.ts`
 * into a route that only needs the plain function.
 */
import { deleteTrackerCookies } from './tracker-cookies.ts'

export type TrackerCookieCleanupConfig = {
  prefixes: readonly string[]
  exactNames?: readonly string[]
}

export function createTrackerCookieCleanup(config: TrackerCookieCleanupConfig) {
  return () => deleteTrackerCookies(config.prefixes, config.exactNames ?? [])
}
