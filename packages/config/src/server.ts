/**
 * Server-only secrets. Import this ONLY from `"@site/config/server"`, and
 * only from server-only code (Server Actions, route handlers, server-only
 * lib modules such as `lib/meta-capi.ts`). Never from `"@site/config"` (the
 * main entry) and never from a module a `'use client'` component imports —
 * these have no `NEXT_PUBLIC_` prefix, so Next.js never inlines a value
 * into the client bundle, but they also have no business being reachable
 * from that graph at all.
 *
 * `app/presupuesto/actions.ts` reads `serverEnv.TELEGRAM_BOT_TOKEN`/
 * `TELEGRAM_CHAT_ID`/`RESEND_API_KEY`/`EMAIL_DESTINO` (previously direct
 * `process.env.*` reads — the one unavoidable frontend edit this
 * migration's package-plan calls out); `lib/meta-capi.ts` reads
 * `META_CAPI_ACCESS_TOKEN`/`META_CAPI_TEST_EVENT_CODE`. The legacy adapter
 * `lib/config.ts` never imports this subpath — it is reachable from
 * `'use client'` components, so it must stay outside this module's import
 * graph entirely.
 */
import type { ServerEnv } from './server-env.schema.ts'

function clean(value: string | undefined): string | undefined {
  return value?.trim() || undefined
}

export const serverEnv: ServerEnv = {
  EMAIL_DESTINO: clean(process.env.EMAIL_DESTINO),
  RESEND_API_KEY: clean(process.env.RESEND_API_KEY),
  TELEGRAM_BOT_TOKEN: clean(process.env.TELEGRAM_BOT_TOKEN),
  TELEGRAM_CHAT_ID: clean(process.env.TELEGRAM_CHAT_ID),
  META_CAPI_ACCESS_TOKEN: clean(process.env.META_CAPI_ACCESS_TOKEN),
  META_CAPI_TEST_EVENT_CODE: clean(process.env.META_CAPI_TEST_EVENT_CODE),
}

export type { ServerEnv }
