/**
 * Canonical/alternates helpers for a future locale rollout. Not wired into
 * any page today — this site only publishes `es`, at the bare route with no
 * locale segment, so `buildCanonical(siteUrl, route, 'es')` must keep
 * equalling `${siteUrl}${route}` for the default locale.
 */
export function buildCanonical(siteUrl: string, route: string, locale: string, defaultLocale = 'es'): string {
  return locale === defaultLocale ? `${siteUrl}${route}` : `${siteUrl}/${locale}${route}`
}

export function buildAlternates(
  siteUrl: string,
  route: string,
  locales: readonly string[],
  defaultLocale = 'es',
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const locale of locales) out[locale] = buildCanonical(siteUrl, route, locale, defaultLocale)
  return out
}
