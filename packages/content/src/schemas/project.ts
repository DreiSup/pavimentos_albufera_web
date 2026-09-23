import type { Localized } from './localized.ts'
import type { SiteImage } from './image.ts'
import type { ServiceId } from './service.ts'
import type { ColorId, ModelId } from './finish.ts'
import type { Province } from './service-area.ts'

/**
 * Execution data for one job (concrete grade, thickness, aggregate…). Every
 * field optional: what the site doesn't give isn't invented. Adapted from
 * Pavivasa's `ExecutionSpecs`, not copied: this repo adds `color` (dosage,
 * collides in NAME only, not meaning, with `Project.color`, a different
 * scope) and `finishes` (a PLURAL list — Pavivasa's own `finish` field is
 * singular).
 */
export type ExecutionSpecs = {
  concrete?: Localized<string>
  thickness?: Localized<string>
  aggregate?: Localized<string>
  mesh?: Localized<string>
  fiber?: Localized<string>
  color?: Localized<string>
  finishes?: Localized<string>[]
}

/**
 * Adapted from Pavivasa's `Project`, not copied. This repo's source
 * (`content/proyectos.json`) uses `| null` for "not yet confirmed"
 * (present-but-null); normalized here to Pavivasa's `?:` convention
 * (absent-means-unknown) — same "don't invent it" intent, different literal
 * encoding, and every `queries/` reader/omission rule assumes the `?:`
 * form. `images` may be EMPTY (`xabia-pulido` has none yet) — unlike
 * Pavivasa's `Project.images`, this is not `min(1)`.
 */
export type Project = {
  /** Public URL segment. */
  slug: Localized<string>
  title: Localized<string>
  /** Town — proper noun: plain. */
  town?: string
  province?: Province
  service: ServiceId
  model?: ModelId
  /** Product color code — internal identifier: plain. */
  color?: ColorId
  surfaceArea?: number
  year?: number
  /** No Pavivasa equivalent — days the job took on site. */
  executionDays?: number
  /** What the client commissioned — singular prose, not a bullet list (unlike Pavivasa's plural `brief`). */
  brief?: Localized<string>
  /** How it was executed — singular prose (unlike Pavivasa's plural `execution`). */
  execution?: Localized<string>
  images: SiteImage[]
  featured: boolean
  executionSpecs?: ExecutionSpecs
}
