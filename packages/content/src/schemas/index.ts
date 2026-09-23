/** Type-only barrel: safe to import from anywhere, including client-reachable code — no zod runtime here. See each `*.zod.ts` sibling for the runtime shape, used only by `scripts/validate.ts`. */
export type { Localized, Locale } from './localized.ts'
export { pickLocalized, pickLocalizedList, LOCALES } from './localized.ts'
export type { SiteImage, ImageKind } from './image.ts'
export type { Business } from './business.ts'
export type {
  ServiceId,
  ServiceSection,
  SpecRow,
  ServiceApplications,
  WhenNotTo,
  Service,
  LandingService,
} from './service.ts'
export type { ModelId, ColorId, Finish } from './finish.ts'
export type { Model } from './model.ts'
export type { Province, ServiceArea, UnconfirmedServiceAreaTowns } from './service-area.ts'
export type { ExecutionSpecs, Project } from './project.ts'
export type {
  Article,
  ArticleBlock,
  ParagraphBlock,
  HeadingBlock,
  OrderedListBlock,
  ProjectCalloutBlock,
  PendingBlock,
} from './article.ts'
export type { Question } from './faq.ts'
export type { LegalFactRow, CookieFact, RecipientFact, LegalFacts } from './legal-facts.ts'
