/**
 * This site's sitemap order (kept exactly, pre-migration): the static
 * routes block — home, the six service routes spliced in after `/` and
 * before `/acabados/`, then the section index pages and the three legal
 * pages, all in `staticRoutes`, order owned by the caller (`app/sitemap.ts`)
 * — then finish routes, then projects, then service areas, then articles.
 * No `lastModified`, no `noindex` filter: nothing here is excluded except
 * by the caller simply not including it (see `app/sitemap.ts`'s own
 * comment on why the four `/lp/` landings never appear here at all).
 *
 * The four dynamic collections' URL prefixes come from `routes` (see
 * `routes.ts`), defaulting to `DEFAULT_ROUTES` — this site's own values —
 * when the caller omits it, so `app/sitemap.ts` (doesn't pass `routes`)
 * keeps building the exact same URLs.
 * `staticRoutes` stays fully composed by the caller: it mixes home, the
 * service catalog and section/legal pages in an order this package has no
 * business owning, unlike the four collections below, which are each a
 * fixed prefix + slug.
 */
import { DEFAULT_ROUTES, type RoutePrefixes } from './routes.ts'

export type SitemapEntry = { url: string }

export type SitemapInput = {
  siteUrl: string
  /** Home, service routes (in the site's own order), section indexes and legal pages — already fully composed by the caller. */
  staticRoutes: readonly string[]
  /** `rutasDeAcabado()`'s output verbatim: model ids and finish-without-model slugs, mixed. Not re-derived here. */
  finishRoutes: readonly string[]
  projectSlugs: readonly string[]
  zoneSlugs: readonly string[]
  articleSlugs: readonly string[]
  /** Prefixes for the four collections above. Defaults to `DEFAULT_ROUTES` — this site's own values — when omitted. */
  routes?: RoutePrefixes
}

export function buildSitemapEntries(input: SitemapInput): SitemapEntry[] {
  const routes = input.routes ?? DEFAULT_ROUTES
  return [
    ...input.staticRoutes.map((route) => ({ url: `${input.siteUrl}${route}` })),
    ...input.finishRoutes.map((slug) => ({ url: `${input.siteUrl}${routes.finishes}${slug}/` })),
    ...input.projectSlugs.map((slug) => ({ url: `${input.siteUrl}${routes.projects}${slug}/` })),
    ...input.zoneSlugs.map((slug) => ({ url: `${input.siteUrl}${routes.serviceAreas}${slug}/` })),
    ...input.articleSlugs.map((slug) => ({ url: `${input.siteUrl}${routes.articles}${slug}/` })),
  ]
}
