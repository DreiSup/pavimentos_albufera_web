import type { ServiceId } from './service.ts'

/** Proper noun: plain, not translated. */
export type Province = 'Valencia' | 'Castellón' | 'Alicante'

/**
 * A `/zonas/[municipio]/` SEO landing page keyed by town, with its own
 * coverage-tier ring. NOT Pavivasa's `Project.district` (a free-text
 * "urbanización" label with no page of its own, no independent content
 * object) — this is a different, higher-level, page-bearing entity (D4
 * override: `zona` → `ServiceArea`, `anillo` → `ring`, never `district`).
 */
export type ServiceArea = {
  slug: string
  /** Town — proper noun: plain. */
  town: string
  province: Province
  /** Coverage-tier used only in the "zona de servicio" copy paragraph — internal prioritization, never shown as a raw number. */
  ring: 1 | 2 | 3
  /**
   * Project slugs in this area — foreign keys, always `Project.slug.es`
   * (the stable identifier a project was authored under), never
   * locale-resolved. See the README's `Localized<T>` rule for why this
   * array stays pinned to `es` while `Project.slug` itself is
   * `Localized<T>`.
   */
  projects: string[]
  services: ServiceId[]
}

/**
 * `content/zonas.json`'s trailing element is NOT a `ServiceArea` — it's
 * undocumented town metadata (towns with claimed work but no documented
 * project yet, kept out of `/zonas/` to avoid Google's "doorway abuse"
 * policy). Modelled as its own typed export (D5: editorial metadata is
 * preserved as typed data, never lost, never invented, and never exposed
 * where it isn't rendered today) instead of a runtime filter over a mixed
 * array — `content:validate` guards its shape directly.
 */
export type UnconfirmedServiceAreaTowns = {
  comment: string
  towns: string[]
  headquartersTown: string
}
