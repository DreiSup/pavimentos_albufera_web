/**
 * `@site/content` — the locale-aware read API for the business's facts.
 * Nothing here has a zod runtime or a validation side effect (validation
 * happens once, in `scripts/validate.ts`, the `content:validate` task — see
 * this package's README), so importing it never leaks a secret or pulls in
 * a dependency a bundle shouldn't have. That is NOT the same as it being
 * the right import for a client-reachable module, though: `queries/`'s
 * resolvers are real, non-dead code webpack can't tree-shake away, and cost
 * real bytes wherever they're reachable — see the README's "Client-bundle
 * rule" for why the handful of client-reachable adapters that need content
 * import a few data-only leaves through their own subpath exports instead
 * of this barrel.
 *
 * Explicit named re-exports, not `export * from './queries/index.ts'` — see
 * the README's "Client-bundle rule" for why: a star export would silently
 * widen this package's public surface with whatever `queries/` adds later.
 *
 * Wired into `apps/web` via the legacy adapters under `apps/web/src/lib`
 * and `apps/web/src/content` that keep the old Spanish API the frontend
 * components already use.
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

export { colorCatalog } from './data/colors.ts'
export type { ColorCatalogEntry } from './schemas/color.ts'

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
export { getQuestionsByRefs } from './queries/faq.ts'
export type { ResolvedImage, ResolvedQuestion, Locale } from './queries/resolve.ts'

export { pickLocalized, pickLocalizedList, LOCALES } from './schemas/localized.ts'
export type { ProjectId } from './schemas/ids.ts'
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
