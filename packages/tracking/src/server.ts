/**
 * Server-only tracking: Meta Conversions API and the attribution-cookie
 * writer behind `/api/atribucion`. Import only from `"@site/tracking/server"`,
 * and only from server-only code — this reads `@site/config/server`'s
 * secrets. Never from the main `"@site/tracking"` entry and never from a
 * module a `'use client'` component imports.
 */
import { createHash } from 'node:crypto'
import { serverEnv } from '@site/config/server'

/** v21.0 expires 2027-01-21; v26.0 has been current since 2026-07-29. */
const GRAPH_VERSION = 'v26.0'

/**
 * SHA-256 hex, which is all Meta accepts in `user_data`. Deliberately does
 * NOT trim/lowercase — this repo's fields each have their own,
 * incompatible normalization rule (see `normalize`); a generic
 * `trim().toLowerCase()` baked in here is what let the phone go unhashed
 * with its country prefix for months. Whoever hashes for Meta from any
 * other server module must use THIS function, or the hashes won't match.
 */
export function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

/** Strips diacritics: `Alcàsser` -> `Alcasser`, `ñ` -> `n`. */
function stripAccents(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/**
 * Lowercase, punctuation stripped, INTERIOR SPACE KEPT: `Pérez García` is
 * one compound surname, not two fields. Compressing it to `perezgarcia`
 * hashes to a value that exists nowhere else. Accents stay — Meta accepts
 * UTF-8 in `fn`/`ln`.
 */
function personName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Field-by-field normalization. There is no common rule: what's correct
 * for a town destroys a surname, so a single `hash()` that normalized
 * could only ever serve one of the two. Exported alongside `hash()`, not
 * separately: hashing with this without normalizing first is exactly the
 * bug that shipped the unprefixed phone number.
 */
export const normalize = {
  /** Lowercase, trimmed. */
  em: (value: string) => value.trim().toLowerCase(),

  /**
   * Digits only, and ALWAYS with the country prefix. A 9-digit Spanish
   * mobile hashed as-is matches nothing Meta has on file.
   */
  ph: (value: string) => {
    const digits = value.replace(/\D/g, '').replace(/^00/, '')
    return digits.length === 9 ? `34${digits}` : digits
  },

  fn: personName,
  ln: personName,

  /**
   * Town/province: lowercase, accents stripped, NO spaces. `El Perelló`
   * -> `elperello`. The opposite rule from surnames, on purpose.
   */
  ct: (value: string) => stripAccents(value).toLowerCase().replace(/[^a-z]/g, ''),
  st: (value: string) => stripAccents(value).toLowerCase().replace(/[^a-z]/g, ''),
}

export type ConversionEvent = {
  /** `Lead` is the form; `Contact` is a phone/WhatsApp click. Defaults to `Lead`. */
  eventName?: 'Lead' | 'Contact'
  eventId: string
  phone?: string
  email?: string
  firstName?: string
  lastName?: string
  town?: string
  province?: string
  /** This repo's 6-char reference code — links a form lead with a WhatsApp one. */
  referenceCode?: string
  /**
   * Pre-hashed, injected by the caller: this repo hardcodes `country:
   * hash('es')` on every event (every visitor is assumed Spanish) — that
   * literal is business logic and stays in the `apps/web` adapter, not
   * here (Pavivasa has no equivalent and shouldn't gain one implicitly).
   * Occupies the same position in `user_data` the pre-migration code used
   * (right after `client_user_agent`, before `ph`) — that position is
   * part of the JSON byte output and is preserved on purpose.
   */
  countryHash?: string
  ip: string
  userAgent: string
  url: string
  fbp?: string
  fbc?: string
  customData?: Record<string, unknown>
  /** The Meta Pixel id (public, `NEXT_PUBLIC_*`) — not a secret, so a param, not read from `serverEnv`. */
  pixelId?: string
}

/**
 * Sends an event to Meta Conversions API, deduplicated with the browser
 * Pixel via the shared `event_id`. Does nothing, and never throws, if the
 * pixel id or the access token is missing.
 */
export async function sendMetaConversionEvent(event: ConversionEvent): Promise<void> {
  const pixelId = event.pixelId
  const token = serverEnv.META_CAPI_ACCESS_TOKEN
  if (!pixelId || !token) return

  const userData: Record<string, unknown> = {
    client_ip_address: event.ip,
    client_user_agent: event.userAgent,
  }
  if (event.countryHash) userData.country = [event.countryHash]
  if (event.phone) userData.ph = [hash(normalize.ph(event.phone))]
  if (event.email) userData.em = [hash(normalize.em(event.email))]
  if (event.firstName) userData.fn = [hash(normalize.fn(event.firstName))]
  if (event.lastName) userData.ln = [hash(normalize.ln(event.lastName))]
  if (event.town) userData.ct = [hash(normalize.ct(event.town))]
  if (event.province) userData.st = [hash(normalize.st(event.province))]
  // Same reference code already generated for the WhatsApp message: reusing
  // it here raises match quality for free. ALWAYS lowercased, on this leg
  // and the Pixel's, so Meta's own internal normalization stops mattering.
  if (event.referenceCode) userData.external_id = [hash(event.referenceCode.toLowerCase())]
  if (event.fbp) userData.fbp = event.fbp
  if (event.fbc) userData.fbc = event.fbc

  // With the variable set, the event shows up in Test Events and does NOT
  // count as a conversion. Never set in production.
  const testEventCode = serverEnv.META_CAPI_TEST_EVENT_CODE?.trim()

  try {
    const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: [
          {
            event_name: event.eventName ?? 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            event_id: event.eventId,
            action_source: 'website',
            event_source_url: event.url,
            user_data: userData,
            ...(event.customData ? { custom_data: event.customData } : {}),
          },
        ],
        ...(testEventCode ? { test_event_code: testEventCode } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      const body = await response.text()
      console.error(`Meta CAPI ${response.status}: ${body.slice(0, 500)}`)
    }
  } catch (error) {
    console.error('Meta CAPI sin respuesta:', error)
  }
}

// ---------------------------------------------------------------------------
// Attribution cookie writer — /api/atribucion's own logic (DECISIONS D8).
// ---------------------------------------------------------------------------

export type CleanAttributionValueOptions = { maxValueLength: number }

/**
 * A value with a carriage return splits the `Set-Cookie` header in two —
 * not escaped: the whole value is discarded.
 */
export function cleanAttributionValue(value: unknown, options: CleanAttributionValueOptions): string | undefined {
  if (typeof value !== 'string') return undefined
  if (/[\r\n]/.test(value)) return undefined
  const trimmed = value.slice(0, options.maxValueLength).trim()
  return trimmed || undefined
}

export type ValidateAttributionBundleOptions = {
  /** Which keys to accept, in order — this repo's `CLAVES` list, supplied by the caller so its exact field names and byte order (the JSON `Set-Cookie` payload) stay in `apps/web`. */
  keys: readonly string[]
  maxValueLength: number
  /** The already-`encodeURIComponent(JSON.stringify(...))`-measured byte ceiling. A browser that receives a cookie over its real ~4096 B limit drops it whole, silently. */
  maxCookieBytes: number
}

/** Lets through only the known keys, already cleaned and truncated. */
export function validateAttributionBundle(
  raw: unknown,
  options: ValidateAttributionBundleOptions,
): Record<string, string> | undefined {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return undefined
  const out: Record<string, string> = {}
  for (const key of options.keys) {
    const value = cleanAttributionValue((raw as Record<string, unknown>)[key], {
      maxValueLength: options.maxValueLength,
    })
    if (value) out[key] = value
  }
  if (Object.keys(out).length === 0) return undefined
  if (encodeURIComponent(JSON.stringify(out)).length > options.maxCookieBytes) return undefined
  return out
}

export type ResolveReferenceCodeOptions = {
  /** The cookie's current value, if any — `undefined` only when the cookie itself is absent (matches `??`, not a truthy check: an empty-string cookie value, however unlikely, is still "existing"). */
  existingCode: string | undefined
  proposedCode: unknown
  pattern: RegExp
  maxValueLength: number
  /** Only called when there's neither an existing nor a valid proposed code — first-touch wins, and the code stays lazy. */
  generateCode: () => string
}

/** First touch wins: an existing cookie value is never replaced. */
export function resolveReferenceCode(options: ResolveReferenceCodeOptions): string {
  if (options.existingCode !== undefined) return options.existingCode
  const proposed = cleanAttributionValue(options.proposedCode, { maxValueLength: options.maxValueLength })
  if (proposed && options.pattern.test(proposed)) return proposed
  return options.generateCode()
}

export type CookieToSet = { name: string; value: string }

export type AttributionCookieRequest = {
  referenceCookieName: string
  attributionCookieName: string
  fbcCookieName: string
  attributionKeys: readonly string[]
  referenceCodePattern: RegExp
  fbclidPattern: RegExp
  maxValueLength: number
  maxCookieBytes: number
  generateReferenceCode: () => string
  consentGranted: boolean
  existingReferenceCode: string | undefined
  proposedReferenceCode: unknown
  hasAttributionCookie: boolean
  rawAttribution: unknown
  hasFbcCookie: boolean
  fbclid: unknown
  fbclidIndex: unknown
  fbclidObservedAt: unknown
  /** Injection point for `Date.now()` — kept as a parameter so this stays a pure function. */
  now?: number
}

export type AttributionCookieResult = {
  referenceCode: string
  /** In this exact order: reference code first, then the attribution bundle, then `_fbc` — matches the pre-migration route handler's own `Set-Cookie` order. */
  cookiesToSet: CookieToSet[]
}

/**
 * The whole decision `app/api/atribucion/route.ts` used to make inline:
 * which cookies to set and with what values, given the request's current
 * cookie jar and body. Pure — no `NextResponse`/cookie-jar plumbing here,
 * that stays in the route handler, along with the actual cookie NAMES
 * (`pa_ref`/`pa_attr`/`_fbc`) and the `CLAVES` list — see this file's own
 * header.
 */
export function buildAttributionCookieResponse(request: AttributionCookieRequest): AttributionCookieResult {
  const referenceCode = resolveReferenceCode({
    existingCode: request.existingReferenceCode,
    proposedCode: request.proposedReferenceCode,
    pattern: request.referenceCodePattern,
    maxValueLength: request.maxValueLength,
    generateCode: request.generateReferenceCode,
  })

  const cookiesToSet: CookieToSet[] = [{ name: request.referenceCookieName, value: referenceCode }]

  if (request.consentGranted && !request.hasAttributionCookie) {
    const attribution = validateAttributionBundle(request.rawAttribution, {
      keys: request.attributionKeys,
      maxValueLength: request.maxValueLength,
      maxCookieBytes: request.maxCookieBytes,
    })
    if (attribution) {
      cookiesToSet.push({
        name: request.attributionCookieName,
        value: encodeURIComponent(JSON.stringify(attribution)),
      })
    }
  }

  // `_fbc` only covers the gap the Pixel can't: consent arriving after the
  // `fbclid` has already left the URL. If the cookie already exists the
  // Pixel wrote it, and that one wins.
  if (request.consentGranted && !request.hasFbcCookie) {
    const fbclid = cleanAttributionValue(request.fbclid, { maxValueLength: request.maxValueLength })
    const now = request.now ?? Date.now()
    // Meta wants the instant the `fbclid` was OBSERVED, not now: minutes can
    // pass between landing and "Accept".
    const observedAt =
      typeof request.fbclidObservedAt === 'number' &&
      Number.isFinite(request.fbclidObservedAt) &&
      request.fbclidObservedAt > 0 &&
      request.fbclidObservedAt <= now
        ? Math.round(request.fbclidObservedAt)
        : now
    const indexValid =
      Number.isInteger(request.fbclidIndex) &&
      (request.fbclidIndex as number) >= 0 &&
      (request.fbclidIndex as number) <= 4
    if (fbclid && request.fbclidPattern.test(fbclid) && indexValid) {
      cookiesToSet.push({
        name: request.fbcCookieName,
        value: `fb.${request.fbclidIndex}.${observedAt}.${fbclid}`,
      })
    }
  }

  return { referenceCode, cookiesToSet }
}
