/**
 * A translatable field. `es` is mandatory; the rest are filled in as
 * translations land. Only `es` is published today (`publishedLocales`
 * would be `['es']` once `@site/config` exists) — every other locale's
 * fields are simply absent, which is exactly what "missing translation"
 * should look like.
 *
 * Every reader in `queries/` must resolve a `Localized<T>` through
 * `pickLocalized`/`pickLocalizedList` and never reach into `.es` directly as
 * a fallback for another locale — a missing translation surfaces as
 * `undefined` (or the item is dropped from a list), never silently in
 * Spanish.
 */
export type Localized<T> = {
  es: T
  en?: T
  fr?: T
  de?: T
}

export type Locale = 'es' | 'en' | 'fr' | 'de'

export const LOCALES: readonly Locale[] = ['es', 'en', 'fr', 'de']

export function pickLocalized<T>(value: Localized<T> | undefined, locale: Locale): T | undefined {
  if (!value) return undefined
  return locale === 'es' ? value.es : value[locale]
}

/** Resolves a list of `Localized<T>`, dropping any item without a translation for `locale`. */
export function pickLocalizedList<T>(values: readonly Localized<T>[] | undefined, locale: Locale): T[] {
  if (!values) return []
  const out: T[] = []
  for (const value of values) {
    const picked = pickLocalized(value, locale)
    if (picked !== undefined) out.push(picked)
  }
  return out
}
