import type { Localized } from './localized.ts'

/**
 * A question that may not have a public answer yet (`answer` stays
 * `undefined`: rendered as pending, never invented). Adapted from
 * Pavivasa's `Question`, adding `topic` — this repo's questions carry a
 * topic tag (the `faq_open` event's `question_topic` param) that Pavivasa's
 * `Question` doesn't have. Kept additive so Pavivasa's own FAQ content stays
 * valid with `topic` simply absent.
 *
 * `topic`'s value vocabulary (`'precio'|'plazo'|'garantia'|…`) is this
 * repo's GA4 dimension contract, owned by `@site/tracking`, not this
 * package — `Question.topic` is typed as a plain `string` here, never
 * literally importing that enum (`@site/content` must not depend on
 * `@site/tracking`). Values kept in Spanish, verbatim (external contract:
 * the literal `question_topic` value shipped to GA4).
 */
export type Question = {
  question: Localized<string>
  answer?: Localized<string>
  topic?: string
}
