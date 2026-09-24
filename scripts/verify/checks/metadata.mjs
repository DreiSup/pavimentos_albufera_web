// (e) exactly one <h1> per page; non-empty <title> and meta description,
// unique across indexable pages; absolute self canonical on EVERY page
// (trailing slash per trailingSlash:true — noindex pages get a canonical
// too, e.g. the 4 `/lp/*/` landings and `/zonas/xabia/`); og:url present.
//
// Ported verbatim in logic from Pavivasa's scripts/verify/checks/metadata.mjs
// (this site's rules are identical); only the `detail` fields are new, so a
// baseline entry pins to the exact offending value, not just the route.
export function checkMetadata({ pages, siteUrl, reporter }) {
  reporter.startCheck('(e) one <h1>, title/description present + unique, canonical, og:url')

  const titleOwners = new Map()
  const descriptionOwners = new Map()

  for (const page of pages) {
    const { publicPath, parsed, noindex } = page
    const expectedCanonical = `${siteUrl}${publicPath}`

    if (parsed.h1Count !== 1) {
      reporter.report({
        check: 'metadata',
        code: 'h1-count',
        route: publicPath,
        detail: String(parsed.h1Count),
        message: `expected exactly one <h1>, found ${parsed.h1Count}`,
      })
    }

    if (!parsed.title) {
      reporter.report({ check: 'metadata', code: 'missing-title', route: publicPath, message: '<title> is missing or empty' })
    }
    if (!parsed.description) {
      reporter.report({ check: 'metadata', code: 'missing-description', route: publicPath, message: 'meta description is missing or empty' })
    }
    if (!parsed.canonical) {
      reporter.report({ check: 'metadata', code: 'missing-canonical', route: publicPath, message: 'canonical <link> is missing' })
    } else if (parsed.canonical !== expectedCanonical) {
      reporter.report({
        check: 'metadata',
        code: 'wrong-canonical',
        route: publicPath,
        detail: parsed.canonical,
        message: `canonical is "${parsed.canonical}", expected absolute self canonical "${expectedCanonical}"`,
      })
    }
    if (!parsed.ogUrl) {
      reporter.report({ check: 'metadata', code: 'missing-og-url', route: publicPath, message: 'og:url meta tag is missing' })
    }

    // Uniqueness only matters among pages actually offered for indexing —
    // the 4 `/lp/*/` landings and `/zonas/xabia/` are excluded here.
    if (!noindex) {
      if (parsed.title) {
        const owner = titleOwners.get(parsed.title)
        if (owner) {
          reporter.report({
            check: 'metadata',
            code: 'duplicate-title',
            route: publicPath,
            // `detail` keys the baseline match to this exact title text, not just
            // this route — a future, DIFFERENT title colliding on the same route
            // is a new, undocumented issue, not a match of this one's baseline entry.
            detail: parsed.title,
            message: `title "${parsed.title}" duplicates ${owner}`,
          })
        } else {
          titleOwners.set(parsed.title, publicPath)
        }
      }
      if (parsed.description) {
        const owner = descriptionOwners.get(parsed.description)
        if (owner) {
          reporter.report({
            check: 'metadata',
            code: 'duplicate-description',
            route: publicPath,
            detail: parsed.description,
            message: `meta description duplicates ${owner}`,
          })
        } else {
          descriptionOwners.set(parsed.description, publicPath)
        }
      }
    }
  }

  reporter.endCheck()
}
