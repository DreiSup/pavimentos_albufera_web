/**
 * `check-env` — parses `@site/config`'s public and server environment
 * shapes with Zod and reports malformed values before the app builds. A
 * malformed `NEXT_PUBLIC_*` value only warns by default (never breaks a
 * production deploy) — see `FAIL_ON_MALFORMED_PUBLIC_ENV` below for the
 * one-line switch. `ServerEnvSchema` has no format checks today (see its
 * own comment on why), so nothing there can fail this way yet; if a format
 * check is ever added to it, that one always fails the build — no switch.
 * Companion to `packages/content/scripts/validate.ts`'s `content:validate`
 * (same reasoning: runs once, here, not on every `env.ts`/`server.ts`
 * import — see those files' and `env.schema.ts`'s comments for why the zod
 * runtime is kept out of that client-reachable graph).
 *
 * Runs on Node's native TypeScript support, like `content:validate` — every
 * import below is relative with an explicit `.ts` extension, and this file
 * sticks to erasable TypeScript syntax only.
 *
 * Wired as `apps/web`'s `prebuild` script (see its `package.json`), so it
 * runs before `next build` regardless of how that's invoked — directly
 * (`pnpm --filter web build`, the deterministic build command) or through
 * `turbo run build`. pnpm/npm run pre<script> hooks automatically before
 * <script>; see pnpm's docs on `enable-pre-post-scripts` (on by default).
 *
 * Limitation: this is a plain `node` process, so — unlike `next build`
 * itself — it does NOT read `.env*` files (`@next/env`'s job, and adding
 * that dependency here just for this felt like overkill). It only sees
 * real process env vars. On Vercel that's exactly what `next build` sees
 * too (dashboard env vars are real process env, not files); the gap is a
 * local build relying on `apps/web/.env.local` for one of the vars checked
 * below — `pnpm --filter web build` sees it (Next's own loader reads it
 * for the actual build), but this script, running one step earlier as
 * `prebuild`, does not.
 */
import { z } from 'zod'

import { PublicEnvSchema } from '../src/env.schema.ts'
import { publicEnv } from '../src/env.ts'
import { ServerEnvSchema } from '../src/server-env.schema.ts'
import { serverEnv } from '../src/server.ts'

const errors: string[] = []

function zodIssues(label: string, result: z.SafeParseReturnType<unknown, unknown>) {
  const messages: string[] = []
  if (!result.success) {
    for (const issue of result.error.issues) {
      messages.push(`${label}: ${issue.path.join('.') || '(root)'} — ${issue.message}`)
    }
  }
  return messages
}

/**
 * `env.ts` deliberately keeps `NEXT_PUBLIC_GA_ID`/`ADS_ID`/
 * `ADS_ETIQUETA_LLAMADA`/`META_PIXEL_ID` RAW — no `trim() || undefined`,
 * unlike `TELEFONO`/`WHATSAPP`/`DIRECCION` — because the exact empty
 * string `''` is this quartet's own no-op value: their consumers treat a
 * declared-but-blank id as "not configured" (see `env.ts`'s own comment).
 * `PublicEnvSchema`'s regex checks on these four are FORMAT checks on a
 * real value, not presence checks — every field is already `.optional()`
 * — so validating that intentional `''` against them would warn on every
 * build that simply leaves an id unset, which is not a misconfiguration.
 * This maps exactly `''` (not whitespace — a padded id like `' '` is NOT
 * the no-op value these consumers check for: it is truthy, so it would be
 * treated as a real, garbled id, and must still warn) to `undefined` for
 * THESE FOUR FIELDS ONLY, for validation only (the exported `publicEnv`
 * that the app actually reads is never touched). `NEXT_PUBLIC_SITE_URL` is
 * NOT in this list: `env.ts` also reads it raw, but an empty
 * `NEXT_PUBLIC_SITE_URL` is not a no-op for `site.ts` the way a blank tag
 * id is — its `??` fallback only ever fires on `undefined`, so `''` would
 * silently become `site.url`, publishing canonical URLs, the sitemap and
 * JSON-LD under a relative/empty base. That has to warn, so `SITE_URL`
 * validates raw, exactly like every field this quartet's own rule doesn't
 * cover.
 */
const NOOP_WHEN_EMPTY = new Set<keyof typeof publicEnv>([
  'NEXT_PUBLIC_GA_ID',
  'NEXT_PUBLIC_ADS_ID',
  'NEXT_PUBLIC_ADS_ETIQUETA_LLAMADA',
  'NEXT_PUBLIC_META_PIXEL_ID',
])

function presence(key: keyof typeof publicEnv, value: string | undefined): string | undefined {
  return NOOP_WHEN_EMPTY.has(key) && value === '' ? undefined : value
}

const publicEnvForValidation = Object.fromEntries(
  Object.entries(publicEnv).map(([key, value]) => [key, presence(key as keyof typeof publicEnv, value)]),
) as typeof publicEnv

/**
 * A malformed `NEXT_PUBLIC_*` value (a mistyped GA/Ads/Pixel id, a
 * non-absolute `NEXT_PUBLIC_SITE_URL`…) must never break a production
 * deploy on its own — the site still builds and serves visitors with that
 * one value just not matching its expected shape. WARNS loudly by default.
 * One-line switch to make it fail the build instead: flip this constant to
 * `true`. Server-env issues (real secrets) are unaffected by this switch —
 * see below, those always fail.
 */
const FAIL_ON_MALFORMED_PUBLIC_ENV = false

const publicEnvIssues = zodIssues('public env', PublicEnvSchema.safeParse(publicEnvForValidation))
if (publicEnvIssues.length > 0) {
  if (FAIL_ON_MALFORMED_PUBLIC_ENV) errors.push(...publicEnvIssues)
  else for (const m of publicEnvIssues) console.warn(`\n⚠ check-env — ${m}\n`)
}

// Never echoes a value here: these are secrets, and a malformed one is
// still a secret. Unlike public env above, any server env issue always
// fails the build, no switch — but `ServerEnvSchema` has no format checks
// today (see its own comment: these are opaque secrets this package can't
// validate the shape of), so this never actually reports anything yet.
errors.push(...zodIssues('server env', ServerEnvSchema.safeParse(serverEnv)))

/**
 * A production build that silently falls back to the hardcoded
 * `https://pavimentos-albufera.com` in `@site/config/site.ts` would
 * publish canonical URLs, the sitemap and JSON-LD under the wrong host.
 * Pending the user's decision, this WARNS loudly instead of failing the
 * build. One-line switch to make it fail instead: flip this constant to
 * `true`.
 */
const FAIL_IF_SITE_URL_MISSING_IN_PRODUCTION = false

if (process.env.VERCEL_ENV === 'production' && !publicEnv.NEXT_PUBLIC_SITE_URL) {
  const message =
    'check-env — NEXT_PUBLIC_SITE_URL is unset in a production deployment. ' +
    'Falling back to the hardcoded default in @site/config/site.ts: canonical ' +
    'URLs, the sitemap and JSON-LD will publish under that host instead of the ' +
    'real one. Set NEXT_PUBLIC_SITE_URL in the Vercel project settings.'
  if (FAIL_IF_SITE_URL_MISSING_IN_PRODUCTION) {
    errors.push(message)
  } else {
    console.warn(`\n⚠ ${message}\n`)
  }
}

if (errors.length > 0) {
  console.error(`check-env — ${errors.length} problem(s):\n`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  process.exit(1)
}

console.log('check-env — OK')
