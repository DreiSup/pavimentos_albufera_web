// Single source of truth for the sentinel values `secrets-scan.mjs` needs a
// build made with (see that script's own comment for why: never real
// secrets, but a value distinctive and long enough that finding it in
// `.next/static` or `.next/server/app` is unambiguous proof of a leak).
//
// Both a local run (`pnpm verify:secrets`, via `build-and-scan-secrets.mjs`
// below) and CI (`.github/workflows/ci.yml`, which calls that same pnpm
// script) read the values from here — there is exactly one copy, so a
// value can't drift out of sync between a build step and a scan step the
// way two separate hand-written `env:` blocks could.
//
// The var NAMES themselves are read straight out of
// `packages/config/src/server-env.schema.ts` by `secrets-scan.mjs` (never
// hardcoded here or anywhere else) — this file only supplies values for
// whatever that schema currently lists, and a name with no value here still
// fails loudly (see `secrets-scan.mjs`'s `missing-sentinel-value` code), it
// never gets silently skipped. This site's schema has SIX names (Pavivasa's
// has five — no `META_CAPI_TEST_EVENT_CODE` there), all mirrored here.
export const SENTINEL_ENV = {
  EMAIL_DESTINO: 'sentinel-ci-email-destino@example.invalid',
  RESEND_API_KEY: 'sentinel-ci-resend-api-key-000000',
  TELEGRAM_BOT_TOKEN: 'sentinel-ci-telegram-bot-token-000000',
  TELEGRAM_CHAT_ID: 'sentinel-ci-telegram-chat-id-000000',
  META_CAPI_ACCESS_TOKEN: 'sentinel-ci-meta-capi-access-token-000000',
  META_CAPI_TEST_EVENT_CODE: 'sentinel-ci-meta-capi-test-event-code-000000',
}
