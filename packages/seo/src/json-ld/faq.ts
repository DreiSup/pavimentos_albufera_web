/**
 * FAQ node. Unlike Pavivasa's version, this site's live output: (a) always
 * carries a `publisher: {'@id': businessId}` block between `@type` and
 * `mainEntity` — the only honest link a `FAQPage` (a `CreativeWork`) has
 * back to the business, since `BreadcrumbList` has no such field; (b) never
 * filters unanswered questions and never returns `null` — every call site
 * on this repo only ever passes fully-answered lists already.
 */
export type FaqQuestion = { question: string; answer: string }

export function buildFaqJsonLd(businessId: string, questions: readonly FaqQuestion[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    publisher: { '@id': businessId },
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  }
}
