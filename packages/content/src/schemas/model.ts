import type { Localized } from './localized.ts'
import type { SiteImage } from './image.ts'
import type { ModelId } from './finish.ts'

/**
 * Per-model display name + hero photo for `/acabados/[modelo]/`. Kept
 * separate from `Finish` on purpose: that route exists even for a model
 * with no finish that has a sample (`piedra-silleria`/`piedra-rodena`), so
 * the hero is keyed by model, not by finish.
 */
export type Model = {
  id: ModelId
  name: Localized<string>
  heroImage?: SiteImage
}
