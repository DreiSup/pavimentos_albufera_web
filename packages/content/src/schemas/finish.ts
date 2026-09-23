import type { Localized } from './localized.ts'
import type { SiteImage } from './image.ts'
import type { ServiceId } from './service.ts'

/** A stamped-concrete pattern (mould), e.g. "espiga" (herringbone). Values kept as internal codes — not translated. */
export type ModelId =
  | 'espiga'
  | 'adoquin-irregular'
  | 'adoquin-pequeno'
  | 'manta'
  | 'silleria-grande'
  | 'piedra-silleria'
  | 'piedra-rodena'
  | 'piedra-inglesa'

/** A factory color code, e.g. "117". Values kept as internal codes — not translated. */
export type ColorId = '117' | '113' | '109' | '107' | 'gris' | 'arena' | 'crema'

/**
 * A catalog entry: model + color + technique + sample photo. No Pavivasa
 * equivalent — new top-level content entity. `code`/`color`/`model` are
 * internal identifiers (lookup keys), so they stay plain, like `ServiceId`.
 */
export type Finish = {
  slug: string
  name: Localized<string>
  model?: ModelId
  color: ColorId
  /** Printed color code, e.g. `'C-117'` — a `data/models.ts`-adjacent lookup value, kept per-entry as authored. */
  code: string
  service: ServiceId
  /**
   * A finish is PUBLISHED (has a card painted for it) exactly when it has a
   * sample photo — see `queries/finishes.ts`'s `getPublishedFinishes`. This
   * field is `undefined`, never omitted-with-a-lie, when there's no photo
   * yet: the entry stays in the catalog either way.
   */
  sample?: SiteImage
  /** Project slugs this finish was executed on. */
  projects: string[]
}
