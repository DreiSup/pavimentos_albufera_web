/**
 * Local-business graph node. One stable `@id` (`#negocio`) that every other
 * JSON-LD block on the site references instead of repeating the whole
 * entity — see `apps/web/src/lib/schema.tsx`'s own comment on why.
 *
 * This site's shape, not Pavivasa's: `logo` (a field Pavivasa's own
 * business node doesn't have at all), `telephone` only when a phone href is
 * actually configured, `sameAs` only when there's at least one profile, and
 * `areaServed` as the same `{'@type': 'AdministrativeArea', name}` shape
 * this site's pre-migration `schemaNegocioLocal()` already emitted.
 */
export function businessJsonLdId(siteUrl: string): string {
  return `${siteUrl}/#negocio`
}

export type LocalBusinessInput = {
  siteUrl: string
  name: string
  /** Absolute URL of the brand logo, e.g. `${siteUrl}/marca/logo.png`. */
  logo: string
  email: string
  /** `tel:...` href — this builder strips the scheme itself. Omitted when undefined: no phone configured yet, no `telephone` key. */
  phoneHref?: string
  address: {
    streetAddress?: string
    town: string
    postalCode: string
    province: string
    country: string
  }
  /** Province names, e.g. `['Valencia', 'Castellón', 'Alicante']`. Mapped to `AdministrativeArea` nodes. */
  areaServed: readonly string[]
  /** Official profile URLs for `sameAs`. Omitted entirely when empty — an empty `sameAs` is worse than none. */
  sameAs: readonly string[]
}

export function buildLocalBusinessJsonLd(input: LocalBusinessInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': businessJsonLdId(input.siteUrl),
    name: input.name,
    url: input.siteUrl,
    logo: input.logo,
    email: input.email,
    ...(input.phoneHref ? { telephone: input.phoneHref.replace('tel:', '') } : {}),
    ...(input.sameAs.length > 0 ? { sameAs: [...input.sameAs] } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: input.address.streetAddress,
      addressLocality: input.address.town,
      postalCode: input.address.postalCode,
      addressRegion: input.address.province,
      addressCountry: input.address.country,
    },
    areaServed: input.areaServed.map((province) => ({ '@type': 'AdministrativeArea', name: province })),
  }
}
