import type { Localized } from './localized.ts'

/**
 * Single NAP source for the site. Adapted from Pavivasa's `Business`, not
 * copied: this business has no `manager` and no `socials[]` (no
 * Facebook/Instagram/X links in `lib/config.ts` — genuinely absent, not
 * invented as an empty array), and a field Pavivasa's schema doesn't have
 * at all: **placeholder display values**. `lib/config.ts`'s `nap` renders
 * `telefonoMostrado`/`direccionMostrada` fallbacks (`'96X XXX XXX'`, `'CALLE
 * Y NÚMERO, Sollana · 46430 · Valencia'`) through `<DatoPendiente>` when the
 * env var is unset — Pavivasa's `resolveBusiness` never invents a fallback
 * string, it just leaves the field `undefined`. Making the placeholder text
 * a **content** field (`phonePlaceholder`/`addressPlaceholder`) instead of a
 * magic string buried in the legacy adapter keeps it translatable and
 * auditable like every other piece of copy.
 */
export type Business = {
  /** Proper noun: plain. */
  name: string
  /**
   * Required: the business always publishes one. This is the publicly-shown
   * NAP email — never overridden by `EMAIL_DESTINO` (the lead-form
   * destination is a separate, server-only concern).
   */
  email: string
  /** Town — proper noun: plain. */
  town: string
  postalCode: string
  /** Province — proper noun: plain. */
  province: string
  country: string
  /** Shown via `<DatoPendiente>` in place of the real phone until `NEXT_PUBLIC_TELEFONO` is set. */
  phonePlaceholder: Localized<string>
  /** Shown via `<DatoPendiente>` in place of the real address until `NEXT_PUBLIC_DIRECCION` is set. */
  addressPlaceholder: Localized<string>
  /** Prefilled text of the WhatsApp CTA's `?text=` param — visitor-facing copy: `Localized`. */
  whatsappMessage: Localized<string>
}
