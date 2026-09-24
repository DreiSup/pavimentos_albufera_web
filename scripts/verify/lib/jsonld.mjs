// JSON-LD validation for one page's combined set of <script type=
// "application/ld+json"> blocks (this codebase emits one script per block —
// business, service, breadcrumbs, FAQ — not one @graph; see
// apps/web/src/lib/schema.tsx). Everything here is plain-object graph
// walking, no schema.org SDK.
//
// Adapted from Pavivasa's scripts/verify/lib/jsonld.mjs for this site's own
// shapes (packages/seo/src/json-ld/*.ts — read before editing this file):
//
//  - LocalBusiness (`HomeAndConstructionBusiness`, `#negocio`): `telephone`
//    is only required when this BUILD actually has a phone configured — see
//    `checkRequiredFields`'s `phoneConfigured` param. Unlike Pavivasa, this
//    site's `buildLocalBusinessJsonLd` omits `telephone` entirely when no
//    `NEXT_PUBLIC_TELEFONO` is set (`<DatoPendiente>` state, pending client
//    data — see `packages/content/src/data/business.ts`), which is a real,
//    documented, non-production-blocking state (`apps/web/scripts/
//    verificar-landings.mjs` already gates it for `VERCEL_ENV=production`).
//    Demanding it unconditionally would fail every CI run built without
//    `apps/web/.env.local` (exactly the clean-clone situation CI runs in).
//  - Service: unchanged from Pavivasa's rule (name/serviceType + provider);
//    this site's Service node has no `description` at all by design (D10 —
//    reported to the user as an SEO improvement, not fixed here).
//  - FAQPage: NEW required-field check (Pavivasa's has none for FAQPage) —
//    this site's `buildFaqJsonLd` always emits a `publisher: {'@id':
//    businessId}` link and a non-empty `mainEntity`; both are asserted.
//  - BreadcrumbList: relaxed vs. Pavivasa. This site's `buildBreadcrumbsJsonLd`
//    deliberately keeps an intermediate item with no `item`/href (e.g.
//    `/zonas/[municipio]/`'s first crumb, `{ name: 'Zonas' }` with no
//    route) — see that module's own comment. So `breadcrumb-missing-item`
//    is NOT ported: only position-sequence and a non-empty `name` are
//    checked on every item.

const FORBIDDEN_TYPES = new Set(['AggregateRating', 'Review'])

function typesOf(node) {
  if (!node || typeof node !== 'object') return []
  const t = node['@type']
  if (!t) return []
  return Array.isArray(t) ? t : [t]
}

function isReference(node) {
  // A plain `{ "@id": "..." }` link to another node, vs. a node defined here.
  return node && typeof node === 'object' && !Array.isArray(node) && '@id' in node && Object.keys(node).length === 1
}

/** Walks a parsed JSON-LD value, calling `visit(node)` for every object encountered. */
function walk(value, visit) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit)
    return
  }
  if (value && typeof value === 'object') {
    visit(value)
    for (const key of Object.keys(value)) walk(value[key], visit)
  }
}

function checkRequiredFields(node, errors, { phoneConfigured }) {
  const types = typesOf(node)
  const typeLabel = types.join('/')
  const isBusiness = types.some((t) => /Business$/.test(t) || t === 'LocalBusiness')
  if (isBusiness) {
    const requiredFields = phoneConfigured ? ['name', 'url', 'telephone', 'address'] : ['name', 'url', 'address']
    for (const field of requiredFields) {
      if (node[field] === undefined || node[field] === null || node[field] === '') {
        errors.push({
          code: 'missing-required-field',
          detail: `${typeLabel}:${field}`,
          message: `${typeLabel} node missing required field "${field}"`,
        })
      }
    }
  }
  if (types.includes('Service')) {
    if (!node.name && !node.serviceType) {
      errors.push({ code: 'missing-required-field', detail: 'Service:name', message: 'Service node missing "name"/"serviceType"' })
    }
    if (!node.provider) {
      errors.push({ code: 'missing-required-field', detail: 'Service:provider', message: 'Service node missing "provider"' })
    }
  }
  if (types.includes('FAQPage')) {
    if (!node.publisher || typeof node.publisher !== 'object' || !node.publisher['@id']) {
      errors.push({ code: 'missing-required-field', detail: 'FAQPage:publisher', message: 'FAQPage node missing "publisher" (expected {"@id": businessId})' })
    }
    if (!Array.isArray(node.mainEntity) || node.mainEntity.length === 0) {
      errors.push({ code: 'missing-required-field', detail: 'FAQPage:mainEntity', message: 'FAQPage node missing a non-empty "mainEntity"' })
    }
  }
  if (types.includes('BreadcrumbList')) {
    const items = Array.isArray(node.itemListElement) ? node.itemListElement : []
    if (items.length === 0) {
      errors.push({ code: 'breadcrumb-empty', detail: null, message: 'BreadcrumbList node has no itemListElement' })
    } else {
      items.forEach((item, i) => {
        if (item.position !== i + 1) {
          errors.push({
            code: 'breadcrumb-position',
            detail: `index-${i}`,
            message: `BreadcrumbList position out of sequence at index ${i} (got ${item.position}, expected ${i + 1})`,
          })
        }
        if (!item.name) {
          errors.push({ code: 'breadcrumb-missing-name', detail: `index-${i}`, message: `BreadcrumbList item ${i + 1} missing "name"` })
        }
        // NOTE: no "item"/href check on non-last items — this site's
        // BreadcrumbList intentionally keeps a hrefless intermediate item
        // (see this file's header comment). That's expected, not a defect.
      })
    }
  }
}

/**
 * Validates every ld+json script body found on one page.
 * @param {string[]} bodies raw script text, one per <script type="application/ld+json">.
 * @param {{ phoneConfigured: boolean }} context whether this build has a real phone configured.
 * @returns {{ errors: { code: string, detail: string|null, message: string }[] }}
 */
export function validatePageJsonLd(bodies, context) {
  const errors = []
  const definedIds = new Set()
  const referencedIds = new Set()

  const parsed = []
  bodies.forEach((body, i) => {
    try {
      parsed.push(JSON.parse(body))
    } catch (err) {
      errors.push({ code: 'invalid-json', detail: `script-${i + 1}`, message: `script #${i + 1} is not valid JSON: ${err.message}` })
    }
  })

  for (const doc of parsed) {
    walk(doc, (node) => {
      if (isReference(node)) {
        referencedIds.add(node['@id'])
        return
      }
      if (typeof node['@id'] === 'string') definedIds.add(node['@id'])
      for (const type of typesOf(node)) {
        if (FORBIDDEN_TYPES.has(type)) errors.push({ code: 'forbidden-type', detail: type, message: `forbidden type "${type}" present` })
      }
      checkRequiredFields(node, errors, context)
    })
  }

  for (const id of referencedIds) {
    if (!definedIds.has(id)) {
      errors.push({ code: 'unresolved-id', detail: id, message: `@id reference "${id}" does not resolve to any node defined on the page` })
    }
  }

  return { errors }
}
