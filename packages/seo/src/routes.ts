/**
 * Public route prefixes for this site's four dynamic collections — one
 * detail page per item (finishes, projects, service areas, articles), plus
 * a listing page for three of the four (finishes/`/acabados/`,
 * projects/`/proyectos/`, articles/`/blog/`; service areas have no
 * `/zonas/` index, only `/zonas/[municipio]/`) — this site's values since
 * before the migration. `buildSitemapEntries` takes these through an
 * optional `routes` field and falls back to `DEFAULT_ROUTES` when it's
 * omitted, so a caller that doesn't pass one (`apps/web/src/app/sitemap.ts`
 * doesn't) keeps building the exact same URLs. A different client passes
 * its own `routes` instead of forking the builder.
 *
 * Mirrors Pavivasa's `RoutePrefixes`/`DEFAULT_ROUTES` pattern
 * (`pavivasa/packages/seo/src/routes.ts`), adapted to this site's own
 * collections (`finishes`/`projects`/`serviceAreas`/`articles`, not
 * Pavivasa's `projects`/`articles`) and order — see `sitemap.ts`'s own
 * header for why the static routes block stays fully composed by the
 * caller instead of getting a prefix here too.
 */
export type RoutePrefixes = {
  /** Leading and trailing slash, e.g. `/acabados/`. */
  finishes: string
  /** Leading and trailing slash, e.g. `/proyectos/`. */
  projects: string
  /** Leading and trailing slash, e.g. `/zonas/`. */
  serviceAreas: string
  /** Leading and trailing slash, e.g. `/blog/`. */
  articles: string
}

export const DEFAULT_ROUTES: RoutePrefixes = {
  finishes: '/acabados/',
  projects: '/proyectos/',
  serviceAreas: '/zonas/',
  articles: '/blog/',
}
