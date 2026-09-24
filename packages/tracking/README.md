# @site/tracking

Client-safe analytics, consent and attribution primitives, plus a server
subpath for Meta Conversions API and the `/api/atribucion` cookie writer.
No React, no Next.

## Layout

```
src/
  events.ts                 trackEvent (gtag + Meta Pixel — no adsConversion, see its own header)
  read-cookie.ts             readCookie — one export per file, see its own header (DECISIONS D26)
  write-cookie.ts            writeCookie
  tracker-cookies.ts         deleteTrackerCookies(prefixes, exactNames)
  tracker-cookie-factory.ts  createTrackerCookieCleanup — Pavivasa-shaped factory (unwired, see below)
  reference-code.ts          generateReferenceCode(alphabet, length)
  consent-store.ts          createCookieConsentStore — cookie-backed consent store (unwired, see below)
  consent-mode.ts           buildConsentDefaultScript — this repo's exact Consent Mode inline bootstrap
  attribution-client.ts     captureLandingParams / utmRequiresConsent (unwired, see below)
  server.ts                 ("@site/tracking/server") Meta CAPI + buildAttributionCookieResponse —
                             secrets only via @site/config/server
```

**Every client-reachable export lives in its own file** (`read-cookie.ts`,
`write-cookie.ts`, `tracker-cookies.ts`, `reference-code.ts`), not grouped
by theme — see `read-cookie.ts`'s own header for the measured reason: under
this migration's zero-residual JS budget (DECISIONS D17(final)/D26), a
module reachable through more than one importer can't be concatenated by
webpack into that importer's own chunk, and `apps/web/src/lib/cookies.ts`
re-exporting an imported name as `export { x }` (rather than a local
`const x = …` binding) is exactly what turns a single-importer module into
a multi-importer one — every client component that reads `leerCookie`
directly then imports the PACKAGE module instead of the adapter, and the
adapter's own thin wrapper stops shrinking away. This was found and fixed
by diffing this app's own compiled `.next` chunks byte-for-byte against a
clean pre-migration build, not by inspection alone.

## Adapted from Pavivasa, not copied

This package mirrors `pavivasa/packages/tracking`'s file layout and naming,
but every module's actual behaviour is this repo's own — confirmed by
reading `lib/eventos.ts`, `lib/cookies.ts`, `lib/meta-capi.ts` and
`app/api/atribucion/route.ts` in full and porting each byte-for-byte,
parameterized only where the pre-migration code already varied by call
site. Concretely, versus Pavivasa's package:

- **`trackEvent` takes positional arguments, not an options object, and
  has no `adsConversion` parameter.** Both are measured deviations from
  Pavivasa's shape (and from this file's own first draft), forced by this
  migration's zero-residual JS budget (DECISIONS D26): an
  `{params, metaStandardEvent, metaEventId}` literal built at every call
  site costs real, unmangleable bytes on every route reached from the
  root layout, and this repo has no live Google Ads conversion call site
  to justify `adsConversion`'s branch anyway. See `events.ts`'s own header
  for the measurement.
- **Session-once dedup and auto page/device params stay in the app-level
  adapter** (`apps/web/src/lib/eventos.ts`), not in `events.ts`, for the
  same reason — they are this repo's own contract
  (`EVENTOS_UNA_VEZ_POR_SESION`, `'pa_evt_'`), not generic package
  behaviour, and keeping their branches out of this shared function avoids
  shipping them to every route regardless of use.
- **`hash()` does not trim/lowercase.** This repo's Meta CAPI fields each
  have their own, incompatible normalization rule (`normalize.em/ph/fn/ln/
  ct/st`) — see `server.ts`'s own comment.
- **`deleteTrackerCookies(prefixes, exactNames)` takes its config as plain
  arguments, not a factory returning a curried function** (unlike
  Pavivasa's `createTrackerCookieCleanup`, kept here too but UNUSED, in its
  own file — see `tracker-cookies.ts`'s own header): `apps/web/src/lib/cookies.ts`'s
  `borrarCookiesRastreo` has exactly one call shape, so the closure
  allocation bought nothing. Matches by prefix AND exact name
  (`exactNames`), tries every domain suffix (not just the registrable
  domain), and has no try/catch — all three differ from Pavivasa's
  version and are real, needed behaviour, not embellishment.
- **`buildConsentDefaultScript` is this repo's own template**: reads the
  consent cookie to pick the default (no separate `update` call) and loads
  gtag.js itself. Byte-for-byte reproduction of the pre-migration inline
  `<script>` in `app/layout.tsx` — see its own header.
- **`buildAttributionCookieResponse` has no Pavivasa equivalent at all.**
  Pavivasa's attribution is entirely client-written; this repo writes
  `pa_ref`/`pa_attr`/`_fbc` via `Set-Cookie` from a route handler instead,
  to survive Safari ITP's cookie-lifetime cap. See `server.ts`'s own
  comments for the exact validation rules ported from
  `app/api/atribucion/route.ts`.

## Unwired package surface

`consent-store.ts` and `attribution-client.ts` are built but **not**
imported by any `apps/web` adapter in this migration:

- `createCookieConsentStore` — `apps/web/src/lib/cookies.ts` keeps
  `leerCookie`/`escribirCookie` as plain functions (also used for the
  reference/attribution cookies, not just consent), not a store object.
- `captureLandingParams`/`utmRequiresConsent` —
  `components/layout/Atribucion.tsx` is frozen (P3 frontend allowlist,
  DECISIONS D13) and has its own capture-in-memory +
  POST-to-`/api/atribucion` design; rewiring it to this generic shape is a
  frontend change out of scope for a zero-behaviour-change phase.

Both are kept for template convergence. Since neither is imported by any
adapter leaf, neither ships to any route — an unimported ES module costs
nothing in the built output.

## Byte-exact templates

`buildConsentDefaultScript` returns the exact inline `<script>` body this
site has always rendered when at least one gtag id is configured (see
`apps/web/src/app/layout.tsx`). Its whitespace is part of the output —
don't reformat this template literal; a byte comparison against the
pre-migration inline script (with dummy GA/Ads ids on both sides, since
this repo's real ones are unset) is part of the phase 3 gate.

## Server subpath

`"@site/tracking/server"` reads `META_CAPI_ACCESS_TOKEN`/
`META_CAPI_TEST_EVENT_CODE` via `@site/config/server`, never
`process.env` directly. Import it only from server-only code — a Server
Action, a route handler, or `apps/web/src/lib/meta-capi.ts` (never a
module a `'use client'` component's bundle can reach). `sendMetaConversionEvent`
does nothing without a pixel id and a token; the caller (`lib/meta-capi.ts`)
still gates on `pa_consent` itself before calling in, same as before.
`buildAttributionCookieResponse` is pure — no I/O, no secrets — and is
only under this subpath because it's this repo's other server-only
tracking concern; `app/api/atribucion/route.ts` supplies the actual
`NextResponse`/cookie-jar plumbing and this repo's cookie names.
