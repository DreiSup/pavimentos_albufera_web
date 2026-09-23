import type { Localized } from './localized.ts'

/**
 * Structured legal facts for the three legal pages. NEW package content, no
 * Pavivasa equivalent: Pavivasa's `src/legal/*.md` are unverified,
 * UNRENDERED source documents; `apps/web/src/content/legal.tsx` here is
 * live, RENDERED structured data.
 *
 * D6 (option b, this migration): only rows whose value is a plain string in
 * the source move here. Rows that are JSX in `content/legal.tsx` —
 * `<DatoPendiente>` markers, external `<a>` links, and the one row mixing
 * plain text with a `<DatoPendiente>` fragment (`_fbc`'s duration) — are
 * NOT represented here at all; they stay hand-written JSX in the
 * `apps/web/src/content/legal.tsx` adapter (proven identical in phase 2b,
 * not this one). Rows whose value is a *reference* to `nap` (phone,
 * address, email, business name — already content elsewhere, in
 * `data/business.ts`) are likewise not duplicated here: they are read
 * live from `@site/content`'s business data by the adapter, not frozen as
 * a second copy.
 */
export type LegalFactRow = { label: Localized<string>; value: Localized<string> }

/** `name` is the cookie's own literal name, e.g. `'pa_consent'` — an external contract: plain. */
export type CookieFact = { name: string; rows: LegalFactRow[] }

/** `recipient` is a company name — proper noun: plain. */
export type RecipientFact = { recipient: string; rows: LegalFactRow[] }

export type LegalFacts = {
  /** Proper noun: plain. Shared value for "RAZÓN SOCIAL" (aviso legal) and "RESPONSABLE" (privacidad) — identical text in both source tables. */
  companyName: string
  /** Tax id — plain, not translated. Shared value for both tables' "NIF O CIF" row. */
  taxId: string
  /** Domain name — plain, not translated. */
  domain: string
  activity: Localized<string>
  lastLegalReview: Localized<string>
  /**
   * The plain-string rows of `content/legal.tsx`'s `identificacion` table
   * (RAZÓN SOCIAL, NIF O CIF, ACTIVIDAD, DOMINIO), WITH their original
   * labels — unlike `companyName`/`taxId`/`activity`/`domain` above (kept
   * for query convenience), this preserves the row's label text too, since
   * the label is as much a fact of this legal table as its value. The rows
   * whose value is dynamic (`nap.nombre`, `nap.email`) or JSX are NOT here
   * — see `data/legal.ts`'s comment.
   */
  identificationRows: LegalFactRow[]
  /** The plain-string rows of the `responsable` table (RESPONSABLE, NIF O CIF) — same rule as `identificationRows`. */
  controllerRows: LegalFactRow[]
  ownCookies: CookieFact[]
  thirdPartyCookies: CookieFact[]
  recipients: RecipientFact[]
}
