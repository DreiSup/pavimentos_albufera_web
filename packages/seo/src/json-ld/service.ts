/**
 * Service node. Deliberately NOT Pavivasa's shape: this site's live output
 * has no `description` key at all (the pre-migration call site passes the
 * service *name* under a `nombre` argument, never a real description — see
 * `arquitectura-plantilla-monorepo.md`'s migration notes / docs/migration/DECISIONS.md D10:
 * a mechanical migration keeps that gap, it doesn't fix it), and
 * `areaServed` is published as plain province-name strings, not
 * `AdministrativeArea` nodes — unlike the business node above. Both are
 * this site's actual shipped output, reproduced as-is.
 */
export type ServiceInput = {
  siteUrl: string
  /** Route, including leading/trailing slash (e.g. `/hormigon-impreso/`). */
  route: string
  /** Service name — published as `serviceType`. */
  name: string
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
    provider: { '@id': input.businessId },
    areaServed: [...input.areaServed],
    url: `${input.siteUrl}${input.route}`,
  }
}
