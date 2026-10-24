/**
 * Breadcrumbs node. Intermediate items with no `route` are dropped and the
 * positions renumbered: Google requires `item` on every `ListItem` except the
 * last, and Search Console flagged `Falta el campo "item"` on the service
 * pages (2026-10-24), whose visible trail is Inicio / Servicios / <servicio>
 * with no `/servicios/` page behind «Servicios». The visible `Migas` trail
 * keeps the item; only the structured data leaves it out. The last item keeps
 * no `item` when it has no route, which Google accepts. No `@id` on the list
 * itself: a `BreadcrumbList` has no natural edge to the business node, and no
 * call site here knows its own canonical URL to supply one either — see
 * `schema.tsx`'s longer comment on why that's a decision, not a gap.
 */
export type BreadcrumbItem = { name: string; route?: string }

export function buildBreadcrumbsJsonLd(siteUrl: string, items: readonly BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
      .filter((item, i) => item.route || i === items.length - 1)
      .map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        ...(item.route ? { item: `${siteUrl}${item.route}` } : {}),
      })),
  }
}
