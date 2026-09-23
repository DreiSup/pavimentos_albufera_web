/**
 * `@site/content` — the single read API for the business's facts. Everything
 * here is safe to import from anywhere, including client-reachable code: no
 * zod runtime, no validation side effects. Validation happens once, in
 * `scripts/validate.ts` (the `content:validate` task) — see this package's
 * README.
 *
 * Explicit named re-exports, not `export * from './queries/index.ts'` — see
 * the README's "Client-bundle rule" for why a star export is avoided for
 * anything client-reachable.
 *
 * ⚠️ NOT YET WIRED INTO `apps/web` (phase 2a of the migration): this package
 * exists on its own, validated by `content:validate`, but nothing in
 * `apps/web` imports from it yet. That wiring — and the legacy adapters
 * that keep the old Spanish API frontend components already use — is
 * phase 2b.
 */

export { resolveBusiness } from './queries/business.ts'
export type { BusinessOverrides, ResolvedBusiness } from './queries/business.ts'

export {
  getServices,
  getService,
  getServiceCatalog,
  getServicePathMap,
  getLandingServiceIds,
  getLandingService,
  getLandingSlug,
} from './queries/services.ts'
export type { ResolvedService, ResolvedLandingService, ResolvedServiceCatalogEntry } from './queries/services.ts'

export {
  getFinishes,
  getFinish,
  getPublishedFinishes,
  getFinishesByService,
  getFinishesByModel,
  getFinishesByProjects,
  getCatalogModels,
  getServicesInUse,
  isFinishDocumented,
  countDocumentedFinishes,
  getFinishesSummary,
} from './queries/finishes.ts'
export type { ResolvedFinish } from './queries/finishes.ts'

export { getModels, getModel } from './queries/models.ts'
export type { ResolvedModel } from './queries/models.ts'

export { getServiceAreas, getServiceArea, getServiceAreaFaq } from './queries/service-areas.ts'
export type { ResolvedServiceArea } from './queries/service-areas.ts'

export {
  getProjects,
  getProject,
  getProjectsByService,
  getProjectsByModel,
  getFeaturedProjects,
} from './queries/projects.ts'
export type { ResolvedProject, ResolvedExecutionSpecs } from './queries/projects.ts'

export { getArticles, getArticle, getArticleForService } from './queries/articles.ts'
export type { ResolvedArticle, ResolvedArticleBlock } from './queries/articles.ts'

export { getLegalFacts } from './queries/legal.ts'
export type { ResolvedLegalFacts, ResolvedLegalFactRow, ResolvedCookieFact, ResolvedRecipientFact } from './queries/legal.ts'

export { homeFaqRefs } from './data/faq.ts'
export type { ResolvedImage, ResolvedQuestion, Locale } from './queries/resolve.ts'

export { pickLocalized, pickLocalizedList, LOCALES } from './schemas/localized.ts'
export type {
  Localized,
  SiteImage,
  ImageKind,
  Business,
  ServiceId,
  ServiceSection,
  SpecRow,
  ServiceApplications,
  WhenNotTo,
  Service,
  LandingService,
  ModelId,
  ColorId,
  Finish,
  Model,
  Province,
  ServiceArea,
  UnconfirmedServiceAreaTowns,
  ExecutionSpecs,
  Project,
  Article,
  ArticleBlock,
  ParagraphBlock,
  HeadingBlock,
  OrderedListBlock,
  ProjectCalloutBlock,
  PendingBlock,
  Question,
  LegalFactRow,
  CookieFact,
  RecipientFact,
  LegalFacts,
} from './schemas/index.ts'
