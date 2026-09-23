import { pickLocalized, pickLocalizedList } from '../schemas/localized.ts'
import type { Locale } from '../schemas/localized.ts'
import type { SiteImage } from '../schemas/image.ts'
import type { Question } from '../schemas/faq.ts'

export { pickLocalized, pickLocalizedList }
export type { Locale }

export type ResolvedImage = { src: string; alt: string; kind: SiteImage['kind'] }
export type ResolvedQuestion = { question: string; answer?: string; topic?: string }

/**
 * Every image in this repo's content already has a real `src` — unlike
 * Pavivasa's `resolveImage` (which may omit `src`/`alt` for a photo that
 * hasn't arrived yet), there is nothing to omit here: `kind` stays plain
 * (never resolved through `pickLocalized`, see `schemas/image.ts`).
 */
export function resolveImage(image: SiteImage, locale: Locale): ResolvedImage | undefined {
  const alt = pickLocalized(image.alt, locale)
  if (alt === undefined) return undefined // no translation at all for this locale: never a silent Spanish fallback
  return { src: image.src, alt, kind: image.kind }
}

/**
 * Only includes a key when the source data has it — an explicit `undefined`
 * and an omitted key look the same in plain JS, but not once this crosses
 * an RSC boundary or gets `JSON.stringify`'d for a facts-ledger comparison.
 */
export function resolveQuestions(questions: readonly Question[], locale: Locale): ResolvedQuestion[] {
  const out: ResolvedQuestion[] = []
  for (const q of questions) {
    const question = pickLocalized(q.question, locale)
    if (question === undefined) continue // no translation at all for this locale: drop it, never fall back to Spanish
    const answer = pickLocalized(q.answer, locale)
    out.push({
      question,
      ...(answer !== undefined ? { answer } : {}),
      ...(q.topic !== undefined ? { topic: q.topic } : {}),
    })
  }
  return out
}
