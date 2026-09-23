import type { Localized } from './localized.ts'
import type { SiteImage } from './image.ts'
import type { ServiceId } from './service.ts'

export type ParagraphBlock = { type: 'paragraph'; text: Localized<string> }
export type HeadingBlock = { type: 'heading'; text: Localized<string>; id: string }
export type OrderedListBlock = { type: 'orderedList'; items: Localized<string>[] }
/** `slug` is an internal lookup key — plain, checked by `content:validate` against `data/projects.ts`. */
export type ProjectCalloutBlock = { type: 'projectCallout'; slug: string }
export type PendingBlock = { type: 'pending'; text: Localized<string> }
export type ArticleBlock = ParagraphBlock | HeadingBlock | OrderedListBlock | ProjectCalloutBlock | PendingBlock

/**
 * A blog article. Adapted from Pavivasa's `Article`, not copied: this
 * repo's 3 entries are entirely unwritten (`entradilla`/`fecha`/`cuerpo` are
 * all `null` in `content/articulos.json` today — only `imagenApertura`
 * exists), unlike Pavivasa's 4 (real prose, at most one `pending` block).
 * Pavivasa's `body` assumes at least one block exists; here `excerpt`,
 * `date` and `body` are simply OMITTED when unwritten — never a synthesized
 * `pending` block standing in for text nobody wrote (that would be
 * inventing content, which this migration does not do).
 */
export type Article = {
  slug: Localized<string>
  title: Localized<string>
  excerpt?: Localized<string>
  /** A publish date, once one exists — kept as authored text, not parsed. */
  date?: Localized<string>
  service: ServiceId
  body?: ArticleBlock[]
  openingImage?: SiteImage
}
