import { faq } from '../data/faq.ts'
import type { Question } from '../schemas/faq.ts'
import { resolveQuestions } from './resolve.ts'
import type { Locale, ResolvedQuestion } from './resolve.ts'

/**
 * Looks up a set of question-pool keys (`data/faq.ts`) and resolves them
 * for `locale`, in `refs` order. A ref with no matching entry is dropped,
 * not invented — same pattern as `queries/services.ts`'s internal
 * `resolveFaqRefs` and `queries/service-areas.ts`'s `getServiceAreaFaq`,
 * generalized here (phase 2b) so the `apps/web/src/content/faq.ts` legacy
 * adapter can resolve `faqHome`'s (and, by key, `PREGUNTAS`'s) refs without
 * either re-implementing this loop or reaching into the package's internal
 * `data/faq.ts` module directly.
 */
export function getQuestionsByRefs(refs: readonly string[], locale: Locale): ResolvedQuestion[] {
  const questions: Question[] = []
  for (const ref of refs) {
    const question = faq[ref]
    if (question) questions.push(question)
  }
  return resolveQuestions(questions, locale)
}
