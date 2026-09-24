// (d) JSON-LD: every <script type="application/ld+json"> parses; no
// AggregateRating/Review types; every @id reference resolves to a node
// defined on the page; required fields present for LocalBusiness-type,
// Service, FAQPage, BreadcrumbList (positions consecutive, name on every
// item) — see lib/jsonld.mjs's header comment for the shape adaptations
// (telephone conditional on `phoneConfigured`, FAQPage publisher, relaxed
// BreadcrumbList).
import { validatePageJsonLd } from '../lib/jsonld.mjs'

export function checkJsonLd({ pages, phoneConfigured, reporter }) {
  reporter.startCheck('(d) JSON-LD: valid, no AggregateRating/Review, @id resolves, required fields')

  for (const page of pages) {
    const { publicPath, parsed } = page
    if (parsed.jsonLdBodies.length === 0) {
      reporter.report({ check: 'jsonld', code: 'no-jsonld', route: publicPath, message: 'page has no JSON-LD at all' })
      continue
    }
    const { errors } = validatePageJsonLd(parsed.jsonLdBodies, { phoneConfigured })
    for (const e of errors) {
      reporter.report({ check: 'jsonld', code: e.code, route: publicPath, detail: e.detail ?? undefined, message: e.message })
    }
  }

  reporter.endCheck()
}
