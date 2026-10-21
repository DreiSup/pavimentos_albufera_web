/**
 * Service node. Deliberately NOT Pavivasa's shape. The migration reproduced
 * a node with no `description` at all (docs/migration/DECISIONS.md D10); the
 * SEO recipe of 2026-10-21 adds an optional `description` (the page's meta
 * description) and `name`. Still as before:
 * `areaServed` is published as plain province-name strings, not
 * `AdministrativeArea` nodes — unlike the business node above. Both are
 * this site's actual shipped output, reproduced as-is.
 */
export type ServiceInput = {
  siteUrl: string
  /** Route, including leading/trailing slash (e.g. `/hormigon-impreso/`). */
  route: string
  /** Service name — published as `serviceType` and `name`. */
  name: string
  /**
   * Optional plain-text description (the page's meta description). Added with
   * the SEO recipe of 2026-10-21: the node had no `description` at all, which
   * ARCHITECTURE.md §15 listed as a known SEO gap. Omitted when absent, so a
   * caller that doesn't pass it keeps the old shape.
   */
  description?: string
  /** The local-business node's `@id` — see `businessJsonLdId`. */
  businessId: string
  /** Plain province-name strings, published as-is (no `AdministrativeArea` mapping). */
  areaServed: readonly string[]
}

export function buildServiceJsonLd(input: ServiceInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${input.siteUrl}${input.route}#servicio`,
    serviceType: input.name,
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    provider: { '@id': input.businessId },
    areaServed: [...input.areaServed],
    url: `${input.siteUrl}${input.route}`,
  }
}
