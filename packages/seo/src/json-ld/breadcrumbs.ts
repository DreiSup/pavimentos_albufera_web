/**
 * Breadcrumbs node. Unlike Pavivasa's version, this builder does NOT drop
 * intermediate items with no `route`: `components/layout/Migas.tsx`'s own
 * call sites rely on that — `/zonas/[municipio]/` passes a first item
 * (`{ nombre: 'Zonas' }`) with no href on purpose, and it has to keep its
 * `position: 1`. No `@id` on the list itself: a `BreadcrumbList` has no
 * natural edge to the business node, and no call site here knows its own
 * canonical URL to supply one either — see `schema.tsx`'s longer comment on
 * why that's a decision, not a gap.
 */
export type BreadcrumbItem = { name: string; route?: string }

export function buildBreadcrumbsJsonLd(siteUrl: string, items: readonly BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.route ? { item: `${siteUrl}${item.route}` } : {}),
    })),
  }
}
