/**
 * Public env: values baked into client bundles by Next.js's build-time
 * replacement of the literal `process.env.NEXT_PUBLIC_X` member expression.
 * That replacement only fires on the exact literal form below — never read
 * these dynamically (`process.env[name]`).
 *
 * ⚠️ Semantics preserved EXACTLY from the pre-migration `lib/config.ts`,
 * field by field — NOT a uniform `clean()` sweep like Pavivasa's `env.ts`:
 *
 * - `NEXT_PUBLIC_TELEFONO`/`WHATSAPP`/`DIRECCION`: `trim() || undefined` —
 *   blank/whitespace-only becomes unset (matches `lib/config.ts`'s
 *   `telefonoEnv`/`whatsappEnv`/`direccionEnv`).
 * - `NEXT_PUBLIC_GA_ID`/`ADS_ID`/`ADS_ETIQUETA_LLAMADA`/`META_PIXEL_ID`: the
 *   RAW value, untouched. `lib/config.ts`'s own comment is explicit: "una
 *   variable declarada pero en blanco tiene que llegar en blanco a quien la
 *   consume, o el modo no-op se rompe con una cadena vacía" — trimming
 *   these would change behaviour (an intentionally-blank tag id must stay
 *   `''`, not become `undefined`).
 * - `NEXT_PUBLIC_SITE_URL`: read raw here too; `site.ts` applies the `??`
 *   default exactly as `lib/config.ts` did (no trim, no slash strip).
 */
import type { PublicEnv } from './env.schema.ts'

function clean(value: string | undefined): string | undefined {
  return value?.trim() || undefined
}

export const publicEnv: PublicEnv = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_TELEFONO: clean(process.env.NEXT_PUBLIC_TELEFONO),
  NEXT_PUBLIC_WHATSAPP: clean(process.env.NEXT_PUBLIC_WHATSAPP),
  NEXT_PUBLIC_DIRECCION: clean(process.env.NEXT_PUBLIC_DIRECCION),
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  NEXT_PUBLIC_ADS_ID: process.env.NEXT_PUBLIC_ADS_ID,
  NEXT_PUBLIC_ADS_ETIQUETA_LLAMADA: process.env.NEXT_PUBLIC_ADS_ETIQUETA_LLAMADA,
  NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
}

export type { PublicEnv }
