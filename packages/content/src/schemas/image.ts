import type { Localized } from './localized.ts'

/**
 * The role a photo plays on the page it's used on (hero, process shot,
 * close-up detail, before/after). Plain, not `Localized`: it's an internal
 * classification key, not copy — same carve-out as `ServiceId`/`ModelId`.
 *
 * Values kept in their original Spanish spelling on purpose ("every value
 * verbatim" — see this migration's task brief): translating an internal
 * enum's values is a real rename with no reader depending on the English
 * spelling, so there is nothing to gain and a byte-for-byte content-facts
 * ledger to keep clean. Only `'final'` and `'detalle'` are used in this
 * repo's data today; `'proceso'`/`'antes'` are declared for a photo type
 * the site doesn't have yet (see `lib/tipos.ts`'s original comment on the
 * "before" gap).
 */
export type ImageKind = 'final' | 'proceso' | 'detalle' | 'antes'

/**
 * A published photo. Unlike Pavivasa's `ImageContent` (which models a photo
 * that MAY NOT EXIST YET via a required `label` and optional `src`/`alt`),
 * every image in this repo's content is already real: there is no
 * "placeholder while we wait for the photo" object shape in the source data
 * — a missing photo is modelled by the *field itself* being absent
 * (`Servicio.imagenHero?`), not by an `Imagen` with a missing `src`. Forcing
 * Pavivasa's `label`-first shape here would mean inventing a field this
 * business has no content for, which the project's own rules forbid. See
 * this package's README for the full note on this deliberate divergence
 * from Pavivasa's `ImageContent`.
 */
export type SiteImage = {
  src: string
  alt: Localized<string>
  kind: ImageKind
}
