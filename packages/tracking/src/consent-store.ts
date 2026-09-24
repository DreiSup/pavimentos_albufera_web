/**
 * Cookie-backed consent store, built on `cookie-storage.ts`'s generic
 * primitives — same shape as Pavivasa's `localStorage`-backed
 * `createConsentStore` (`key`/`read`/`write`, configurable key and the
 * exact two stored values), a cookie-backed sibling factory (D7).
 *
 * NOT wired into this repo's adapter: `apps/web/src/lib/cookies.ts` keeps
 * `leerCookie`/`escribirCookie` as plain generic functions (used for the
 * consent cookie AND the reference/attribution cookies alike), not a
 * store object — rewriting that shape is a frontend/adapter decision this
 * migration doesn't make. Kept here, unimported by any adapter leaf, for
 * template convergence (costs nothing: an unimported leaf module ships to
 * no route).
 */
import { readCookie } from './read-cookie.ts'
import { writeCookie } from './write-cookie.ts'

export const DEFAULT_CONSENT_COOKIE = 'pa_consent'
export const DEFAULT_CONSENT_COOKIE_MAX_AGE_DAYS = 180

export type CookieConsentStoreConfig<T extends string> = {
  cookieName?: string
  /** [grantedValue, deniedValue] — the exact two values considered valid. */
  values: readonly [T, T]
  maxAgeDays?: number
}

export function createCookieConsentStore<T extends string>(config: CookieConsentStoreConfig<T>) {
  const cookieName = config.cookieName ?? DEFAULT_CONSENT_COOKIE
  const maxAgeDays = config.maxAgeDays ?? DEFAULT_CONSENT_COOKIE_MAX_AGE_DAYS
  const [granted, denied] = config.values

  function read(): T | null {
    const value = readCookie(cookieName)
    return value === granted || value === denied ? (value as T) : null
  }

  function write(value: T): void {
    writeCookie(cookieName, value, maxAgeDays)
  }

  return { key: cookieName, read, write }
}
