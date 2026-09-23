import { publicEnv } from './env.ts'

export type Locale = 'es' | 'en' | 'fr' | 'de'

export const defaultLocale: Locale = 'es'
export const supportedLocales: readonly Locale[] = ['es', 'en', 'fr', 'de']
/** Locales with pages actually generated and linked today. */
export const publishedLocales: readonly Locale[] = ['es']

/**
 * URL default + normalization IDENTICAL to the pre-migration
 * `lib/config.ts`'s `sitio.url` — `??`, no trim, no trailing-slash strip
 * (unlike Pavivasa's `site.ts`, which does `.replace(/\/+$/, '')`; this
 * repo's own call sites already always compose `${sitio.url}${ruta}` with a
 * leading-slash `ruta`, and byte-identity with the reference build is this
 * migration's contract, not convergence with Pavivasa — see the plan's Q3).
 * No production throw when unset, per the migration's own instruction.
 */
export const site = {
  url: publicEnv.NEXT_PUBLIC_SITE_URL ?? 'https://pavimentos-albufera.com',
}
