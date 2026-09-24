/**
 * `@site/seo` — JSON-LD builders, sitemap/robots builders and canonical/
 * alternates helpers. No React, no Next — everything here takes plain data
 * in and returns plain objects/strings. Explicit named re-exports, not
 * `export * from`, matching `@site/content`'s barrel.
 *
 * Adapted from Pavivasa's `@site/seo` for this site's actual shipped
 * output, not a byte-for-byte port: see each module's own comment for the
 * specific divergences (business `logo`, service `description`/`areaServed`
 * shape, FAQ `publisher`, breadcrumbs' no-filter rule, robots' single `*`
 * group). Wired into `apps/web` via the legacy adapter
 * `apps/web/src/lib/schema.tsx` and `apps/web/src/app/{sitemap,robots}.ts`.
 */
export { businessJsonLdId, buildLocalBusinessJsonLd } from './json-ld/business.ts'
export type { LocalBusinessInput } from './json-ld/business.ts'

export { buildServiceJsonLd } from './json-ld/service.ts'
export type { ServiceInput } from './json-ld/service.ts'

export { buildFaqJsonLd } from './json-ld/faq.ts'
export type { FaqQuestion } from './json-ld/faq.ts'

export { buildBreadcrumbsJsonLd } from './json-ld/breadcrumbs.ts'
export type { BreadcrumbItem } from './json-ld/breadcrumbs.ts'

export { buildSitemapEntries } from './sitemap.ts'
export type { SitemapEntry, SitemapInput } from './sitemap.ts'

export { DEFAULT_ROUTES } from './routes.ts'
export type { RoutePrefixes } from './routes.ts'

export { buildRobots } from './robots.ts'
export type { RobotsRules } from './robots.ts'

export { buildCanonical, buildAlternates } from './canonical.ts'
