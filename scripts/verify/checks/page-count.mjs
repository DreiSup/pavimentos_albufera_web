// (j) Indexable page count sanity check: the number of indexable prerendered
// pages must be at least what `@site/content` should produce (never zero,
// and never below static routes + finishes + projects + service areas +
// articles, minus the routes documented as intentionally noindex) — an
// independent cross-check against a second source of truth, so a build
// that silently drops a whole content collection fails loudly here even if
// every OTHER check above has nothing to complain about.
//
// Adapted from Pavivasa's scripts/verify/checks/page-count.mjs for this
// site's own collections (finishes/projects/serviceAreas/articles, not
// Pavivasa's projects/articles) — reads `@site/content`'s query functions
// directly from their `.ts` source (same reasoning as `content:validate`/
// `check-env`: `index.mjs` runs on `node --experimental-strip-types`).
//
// The 4 `/lp/*/` campaign landings are deliberately NOT modeled here (same
// as Pavivasa's page-count check has no notion of a landing collection):
// they're noindex by design and absent from the sitemap (see `app/
// sitemap.ts`'s own comment), so they don't belong in an "indexable count"
// formula at all — counting them in `expectedTotal` and then subtracting
// them in `DOCUMENTED_NOINDEX_ROUTES` would double-book the same 4 pages
// for no benefit.
import { getFinishes, getCatalogModels } from '../../../packages/content/src/queries/finishes.ts'
import { getProjects } from '../../../packages/content/src/queries/projects.ts'
import { getServiceAreas } from '../../../packages/content/src/queries/service-areas.ts'
import { getArticles } from '../../../packages/content/src/queries/articles.ts'

// Routes that don't come from a @site/content collection — home, the 6
// service pages (each its own static `app/<slug>/page.tsx`, content pulled
// from `@site/content`'s `services.ts` but the ROUTE itself is static, not
// generated from a dynamic segment), the 4 section indexes and the 3 legal
// pages. Frozen for this migration phase (CLAUDE.md's "Frontend congelado")
// — this list only changes if a route is deliberately added/removed there,
// and that's a visible one-line diff here too.
const STATIC_ROUTES = [
  '/',
  '/hormigon-impreso/',
  '/hormigon-pulido/',
  '/hormigon-lavado/',
  '/hormigon-desactivado/',
  '/hormigon-fratasado/',
  '/microcemento/',
  '/acabados/',
  '/proyectos/',
  '/empresa/',
  '/presupuesto/',
  '/blog/',
  '/aviso-legal/',
  '/politica-de-cookies/',
  '/politica-de-privacidad/',
]

// Routes documented as intentionally noindex, that WOULD otherwise be
// counted by the formula below (the 4 `/lp/*/` landings are excluded from
// the formula entirely instead — see this file's header comment, so they
// don't belong here too). Kept in sync by hand: a future deliberate
// noindex route needs adding here too, or this check will demand more
// indexable pages than the build can ever produce.
const DOCUMENTED_NOINDEX_ROUTES = [
  // `/zonas/[municipio]/`'s own `generateMetadata`: a service area with no
  // project photographed yet (`sinFoto`) sets `robots: { index: false }` —
  // "doorway abuse" per Google's own term. Today that's `xabia` alone (see
  // `apps/web/src/app/zonas/[municipio]/page.tsx`'s comment). NOTE: this
  // page is still listed in `sitemap.xml` (a separate, real, pre-existing
  // gap — see checks/sitemap.mjs's header comment) — that doesn't change
  // its status here, which is about the page-count formula only.
  '/zonas/xabia/',
]

export function checkPageCount({ pages, reporter }) {
  reporter.startCheck('(j) indexable page count: at least what @site/content should produce')

  const finishRouteCount = getCatalogModels().length + getFinishes('es').filter((f) => !f.model).length
  const projects = getProjects('es')
  const serviceAreas = getServiceAreas('es')
  const articles = getArticles('es')

  const expectedTotal = STATIC_ROUTES.length + finishRouteCount + projects.length + serviceAreas.length + articles.length
  const expectedIndexable = expectedTotal - DOCUMENTED_NOINDEX_ROUTES.length
  const breakdown = `static ${STATIC_ROUTES.length} + finishes ${finishRouteCount} + projects ${projects.length} + service areas ${serviceAreas.length} + articles ${articles.length} − documented noindex ${DOCUMENTED_NOINDEX_ROUTES.length}`

  const actualIndexable = pages.filter((p) => !p.noindex).length

  if (actualIndexable === 0) {
    reporter.report({
      check: 'build',
      code: 'no-indexable-pages',
      route: null,
      message: `0 indexable pages in the build (${pages.length} total prerendered) — expected ${expectedIndexable} (${breakdown})`,
    })
  } else if (actualIndexable < expectedIndexable) {
    reporter.report({
      check: 'build',
      code: 'page-count-below-expected',
      route: null,
      detail: String(actualIndexable),
      message: `only ${actualIndexable} indexable page(s) in the build, expected at least ${expectedIndexable} (${breakdown}); ${pages.length} total prerendered pages`,
    })
  }

  reporter.endCheck()
}
