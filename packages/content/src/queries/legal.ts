import { legal } from '../data/legal.ts'
import type { CookieFact, LegalFactRow, RecipientFact } from '../schemas/legal-facts.ts'
import { pickLocalized } from './resolve.ts'
import type { Locale } from './resolve.ts'

export type ResolvedLegalFactRow = { label: string; value: string }
export type ResolvedCookieFact = { name: string; rows: ResolvedLegalFactRow[] }
export type ResolvedRecipientFact = { recipient: string; rows: ResolvedLegalFactRow[] }

export type ResolvedLegalFacts = {
  companyName: string
  taxId: string
  domain: string
  activity: string
  lastLegalReview: string
  ownCookies: ResolvedCookieFact[]
  thirdPartyCookies: ResolvedCookieFact[]
  recipients: ResolvedRecipientFact[]
}

function resolveRow(row: LegalFactRow, locale: Locale): ResolvedLegalFactRow | undefined {
  const label = pickLocalized(row.label, locale)
  const value = pickLocalized(row.value, locale)
  return label !== undefined && value !== undefined ? { label, value } : undefined
}

function resolveRows(rows: readonly LegalFactRow[], locale: Locale): ResolvedLegalFactRow[] {
  return rows.map((row) => resolveRow(row, locale)).filter((row): row is ResolvedLegalFactRow => row !== undefined)
}

function resolveCookieFact(fact: CookieFact, locale: Locale): ResolvedCookieFact {
  return { name: fact.name, rows: resolveRows(fact.rows, locale) }
}

function resolveRecipientFact(fact: RecipientFact, locale: Locale): ResolvedRecipientFact {
  return { recipient: fact.recipient, rows: resolveRows(fact.rows, locale) }
}

/**
 * Only the plain-string legal facts (D6, option b) — the rows and fields
 * `content/legal.tsx` renders as JSX (`<DatoPendiente>` markers, external
 * links, and `nap.*` live reads) are NOT here and stay hand-written in that
 * adapter. This is package data feeding one input among several the
 * adapter composes, not a drop-in replacement for it.
 */
export function getLegalFacts(locale: Locale): ResolvedLegalFacts {
  return {
    companyName: legal.companyName,
    taxId: legal.taxId,
    domain: legal.domain,
    activity: pickLocalized(legal.activity, locale) ?? '',
    lastLegalReview: pickLocalized(legal.lastLegalReview, locale) ?? '',
    ownCookies: legal.ownCookies.map((fact) => resolveCookieFact(fact, locale)),
    thirdPartyCookies: legal.thirdPartyCookies.map((fact) => resolveCookieFact(fact, locale)),
    recipients: legal.recipients.map((fact) => resolveRecipientFact(fact, locale)),
  }
}
