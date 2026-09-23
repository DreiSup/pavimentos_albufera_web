/**
 * `content:validate` — parses every piece of content with Zod and checks
 * referential integrity specific to this repo. Runs once, here, not on
 * every `queries/` call.
 *
 * Runs on Node's native TypeScript support (Node 22.21.1): every import
 * below is relative with an explicit `.ts` extension, no `tsx`.
 *
 * Imports the package's own source by relative path (`../src/...`), not
 * `@site/content`: this script runs standalone via `node`, outside
 * webpack/Next's module resolution.
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

import { businessSchema } from '../src/schemas/business.zod.ts'
import { serviceSchema, serviceIdSchema } from '../src/schemas/service.zod.ts'
import { finishSchema, modelIdSchema } from '../src/schemas/finish.zod.ts'
import { modelSchema } from '../src/schemas/model.zod.ts'
import { serviceAreaSchema, unconfirmedServiceAreaTownsSchema } from '../src/schemas/service-area.zod.ts'
import { projectRecordSchema } from '../src/schemas/project.zod.ts'
import { articleSchema } from '../src/schemas/article.zod.ts'
import { questionSchema } from '../src/schemas/faq.zod.ts'
import { legalFactsSchema } from '../src/schemas/legal-facts.zod.ts'
import { localizedText } from '../src/schemas/localized.zod.ts'

import { business } from '../src/data/business.ts'
import { services } from '../src/data/services.ts'
import { serviceCatalog } from '../src/data/service-catalog.ts'
import { CAMPAIGN_SERVICE_IDS } from '../src/data/campaign-landings.ts'
import { finishes } from '../src/data/finishes.ts'
import { models } from '../src/data/models.ts'
import { serviceAreas, unconfirmedServiceAreaTowns } from '../src/data/service-areas.ts'
import { projects } from '../src/data/projects.ts'
import { articles } from '../src/data/articles.ts'
import { faq, homeFaqRefs, serviceAreaFaqRefs } from '../src/data/faq.ts'
import { legal } from '../src/data/legal.ts'

import { getProjects } from '../src/queries/projects.ts'
import { getFinishes } from '../src/queries/finishes.ts'
import { getServiceAreas } from '../src/queries/service-areas.ts'

const here = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(here, '../../../apps/web/public')

const errors: string[] = []
const fail = (message: string) => errors.push(message)

function zodIssues(label: string, result: z.SafeParseReturnType<unknown, unknown>) {
  if (!result.success) {
    for (const issue of result.error.issues) {
      fail(`${label}: ${issue.path.join('.') || '(root)'} — ${issue.message}`)
    }
  }
}

// ---- 1. Shape validation ---------------------------------------------------

zodIssues('business', businessSchema.safeParse(business))

for (const service of services) {
  zodIssues(`service "${service.id}"`, serviceSchema.safeParse(service))
}

const serviceCatalogEntrySchema = z.object({ id: serviceIdSchema, path: localizedText, name: localizedText })
for (const entry of serviceCatalog) {
  zodIssues(`service catalog entry "${entry.id}"`, serviceCatalogEntrySchema.safeParse(entry))
}

for (const finish of finishes) {
  zodIssues(`finish "${finish.slug}"`, finishSchema.safeParse(finish))
}

for (const model of models) {
  zodIssues(`model "${model.id}"`, modelSchema.safeParse(model))
}

for (const area of serviceAreas) {
  zodIssues(`service area "${area.slug}"`, serviceAreaSchema.safeParse(area))
}
zodIssues('unconfirmedServiceAreaTowns', unconfirmedServiceAreaTownsSchema.safeParse(unconfirmedServiceAreaTowns))

for (const project of projects) {
  zodIssues(`project "${project.slug.es}"`, projectRecordSchema.safeParse(project))
}

for (const article of articles) {
  zodIssues(`article "${article.slug.es}"`, articleSchema.safeParse(article))
}

for (const [key, question] of Object.entries(faq)) {
  zodIssues(`faq "${key}"`, questionSchema.safeParse(question))
}

zodIssues('legal', legalFactsSchema.safeParse(legal))

// ---- 2. serviceCatalog must stay in sync with services ---------------------
// (data/service-catalog.ts intentionally duplicates a few fields out of
// data/services.ts for client-bundle-size reasons — see its own comment.)

const serviceIds = new Set(services.map((s) => s.id))
for (const entry of serviceCatalog) {
  if (!serviceIds.has(entry.id)) fail(`service catalog: "${entry.id}" has no matching entry in services.ts`)
}
for (const service of services) {
  const entry = serviceCatalog.find((e) => e.id === service.id)
  if (!entry) {
    fail(`service catalog: missing entry for service "${service.id}"`)
    continue
  }
  if (entry.path.es !== service.path.es) fail(`service catalog: "${service.id}" path.es out of sync ("${entry.path.es}" vs "${service.path.es}")`)
  if (entry.name.es !== service.name.es) fail(`service catalog: "${service.id}" name.es out of sync ("${entry.name.es}" vs "${service.name.es}")`)
}
if (serviceCatalog.length !== services.length) fail(`service catalog has ${serviceCatalog.length} entries, services.ts has ${services.length}`)

// ---- 3. Referential integrity ----------------------------------------------

// `.es` here is FK identity: finish.projects/serviceArea.projects hold
// Project.slug.es references (see schemas/finish.ts's `projects` field
// comment), not locale-resolved text — this is not a locale fallback.
const projectSlugs = new Set(projects.map((p) => p.slug.es))
const modelIds = new Set(modelIdSchema.options)

// 3a. project -> service
for (const project of projects) {
  if (!serviceIds.has(project.service)) fail(`project "${project.slug.es}": unknown service "${project.service}"`)
}

// 3b. project -> area (warn only — a project's town not matching any service area is not an error: not every documented town has a `/zonas/` page yet)
const areaTowns = new Set(serviceAreas.map((a) => a.town))
const warnings: string[] = []
for (const project of projects) {
  if (project.town && !areaTowns.has(project.town)) {
    warnings.push(`project "${project.slug.es}": town "${project.town}" has no matching service area (informational, not a failure)`)
  }
}

// 3c. area -> project (every slug in ServiceArea.projects[] must exist)
for (const area of serviceAreas) {
  for (const slug of area.projects) {
    if (!projectSlugs.has(slug)) fail(`service area "${area.slug}": references unknown project "${slug}"`)
  }
}

// 3d. area -> service
for (const area of serviceAreas) {
  for (const service of area.services) {
    if (!serviceIds.has(service)) fail(`service area "${area.slug}": unknown service "${service}"`)
  }
}

// 3e. landing -> service (the CAMPAIGN_SERVICE_IDS literal hasn't drifted after a service rename)
for (const id of CAMPAIGN_SERVICE_IDS) {
  if (!serviceIds.has(id)) fail(`campaign landings: "${id}" is not a real service id`)
}

// 3f. finish -> model
for (const finish of finishes) {
  if (finish.model !== undefined && !modelIds.has(finish.model)) fail(`finish "${finish.slug}": unknown model "${finish.model}"`)
}

// 3g. finish -> service
for (const finish of finishes) {
  if (!serviceIds.has(finish.service)) fail(`finish "${finish.slug}": unknown service "${finish.service}"`)
}

// 3h. finish -> project
for (const finish of finishes) {
  for (const slug of finish.projects) {
    if (!projectSlugs.has(slug)) fail(`finish "${finish.slug}": references unknown project "${slug}"`)
  }
}

// 3i. article -> service
for (const article of articles) {
  if (!serviceIds.has(article.service)) fail(`article "${article.slug.es}": unknown service "${article.service}"`)
}

// 3j. service -> faqRefs / home -> faqRefs / service area -> faqRefs
const faqKeys = new Set(Object.keys(faq))
for (const service of services) {
  for (const ref of service.faqRefs) {
    if (!faqKeys.has(ref)) fail(`service "${service.id}": faqRefs references unknown question "${ref}"`)
  }
}
for (const ref of homeFaqRefs) {
  if (!faqKeys.has(ref)) fail(`homeFaqRefs: references unknown question "${ref}"`)
}
for (const ref of serviceAreaFaqRefs) {
  if (!faqKeys.has(ref)) fail(`serviceAreaFaqRefs: references unknown question "${ref}"`)
}

// ---- 4. Slugs unique per locale --------------------------------------------

function checkUniqueSlugs(label: string, slugs: readonly string[]) {
  const seen = new Map<string, number>()
  for (const s of slugs) seen.set(s, (seen.get(s) ?? 0) + 1)
  for (const [value, count] of seen) {
    if (count > 1) fail(`${label}: slug "${value}" is used ${count} times`)
  }
}
checkUniqueSlugs('services', services.map((s) => s.id))
checkUniqueSlugs('finishes', finishes.map((f) => f.slug))
checkUniqueSlugs('projects', projects.map((p) => p.slug.es))
checkUniqueSlugs('articles', articles.map((a) => a.slug.es))
checkUniqueSlugs('service areas', serviceAreas.map((a) => a.slug))
// Landings derive their slug from a service path (see queries/services.ts's getLandingSlug): unique iff service paths are unique, which the service-path check below already implies for `es`.
checkUniqueSlugs(
  'service paths (landings derive their slug from these)',
  services.map((s) => s.path.es),
)

// ---- 5. Referenced image files exist under apps/web/public -----------------

function checkImageSrc(label: string, src: string | undefined) {
  if (!src) return
  const filePath = path.join(publicDir, src)
  if (!existsSync(filePath)) fail(`${label}: image src "${src}" does not exist under apps/web/public`)
}

for (const service of services) {
  checkImageSrc(`service "${service.id}".heroImage`, service.heroImage?.src)
  checkImageSrc(`service "${service.id}".cardImage`, service.cardImage?.src)
}
for (const finish of finishes) checkImageSrc(`finish "${finish.slug}".sample`, finish.sample?.src)
for (const model of models) checkImageSrc(`model "${model.id}".heroImage`, model.heroImage?.src)
for (const project of projects) {
  for (const [i, image] of project.images.entries()) checkImageSrc(`project "${project.slug.es}".images[${i}]`, image.src)
}
for (const article of articles) checkImageSrc(`article "${article.slug.es}".openingImage`, article.openingImage?.src)

// ---- 6. Editorial `_pending`/`_note`/zone-metadata fields never leak through `queries/` ----
// (D5: preserved as typed data in data/*.ts, but must never reach the public, resolved shape.)

function checkNoEditorialKeys(label: string, value: unknown) {
  if (!value || typeof value !== 'object') return
  for (const key of Object.keys(value)) {
    if (key.startsWith('_')) fail(`${label}: resolved object leaks editorial key "${key}" — queries/ must never expose it`)
  }
}
for (const project of getProjects('es')) checkNoEditorialKeys(`resolved project "${project.slug}"`, project)
for (const finish of getFinishes('es')) checkNoEditorialKeys(`resolved finish "${finish.slug}"`, finish)
for (const area of getServiceAreas()) checkNoEditorialKeys(`resolved service area "${area.slug}"`, area)

// ---- Report -----------------------------------------------------------------

if (warnings.length > 0) {
  console.warn(`content:validate — ${warnings.length} warning(s):\n`)
  for (const w of warnings) console.warn(`  ⚠ ${w}`)
}

if (errors.length > 0) {
  console.error(`\ncontent:validate — ${errors.length} problem(s):\n`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  process.exit(1)
}

console.log(
  `content:validate — OK (business, ${services.length} services, ${finishes.length} finishes, ${models.length} models, ${serviceAreas.length} service areas, ${projects.length} projects, ${articles.length} articles, ${Object.keys(faq).length} faq entries, legal facts)`,
)
