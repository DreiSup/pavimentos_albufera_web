/**
 * This site's sitemap order (kept exactly, pre-migration): the static
 * routes block — home, the six service routes spliced in after `/` and
 * before `/acabados/`, then the section index pages and the three legal
 * pages, all in `staticRoutes`, order owned by the caller (`app/sitemap.ts`)
 * — then finish routes, then projects, then zones, then articles. No
 * `lastModified`, no `noindex` filter: nothing here is excluded except by
 * the caller simply not including it (see `app/sitemap.ts`'s own comment on
 * why the four `/lp/` landings never appear here at all).
 */
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
}

export function buildSitemapEntries(input: SitemapInput): SitemapEntry[] {
  return [
    ...input.staticRoutes.map((route) => ({ url: `${input.siteUrl}${route}` })),
    ...input.finishRoutes.map((slug) => ({ url: `${input.siteUrl}/acabados/${slug}/` })),
    ...input.projectSlugs.map((slug) => ({ url: `${input.siteUrl}/proyectos/${slug}/` })),
    ...input.zoneSlugs.map((slug) => ({ url: `${input.siteUrl}/zonas/${slug}/` })),
    ...input.articleSlugs.map((slug) => ({ url: `${input.siteUrl}/blog/${slug}/` })),
  ]
}
