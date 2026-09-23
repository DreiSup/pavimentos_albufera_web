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
  ownCookies: CookieFact[]
  thirdPartyCookies: CookieFact[]
  recipients: RecipientFact[]
}
