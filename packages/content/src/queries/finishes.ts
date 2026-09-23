import { finishes } from '../data/finishes.ts'
import { projects } from '../data/projects.ts'
import type { Finish, ModelId } from '../schemas/finish.ts'
import type { ServiceId } from '../schemas/service.ts'
import { pickLocalized, resolveImage } from './resolve.ts'
import type { Locale, ResolvedImage } from './resolve.ts'

export type ResolvedFinish = {
  slug: string
  name: string
  model?: ModelId
  color: Finish['color']
  code: string
  service: ServiceId
  sample?: ResolvedImage
  projects: string[]
}

function resolveFinish(finish: Finish, locale: Locale): ResolvedFinish | undefined {
  const name = pickLocalized(finish.name, locale)
  if (name === undefined) return undefined

  return {
    slug: finish.slug,
    name,
    ...(finish.model !== undefined ? { model: finish.model } : {}),
    color: finish.color,
    code: finish.code,
    service: finish.service,
    ...(finish.sample ? { sample: resolveImage(finish.sample, locale) } : {}),
    projects: finish.projects,
  }
}

/** The full 16-entry catalog, resolved for `locale`. */
export function getFinishes(locale: Locale): ResolvedFinish[] {
  const out: ResolvedFinish[] = []
  for (const finish of finishes) {
    const resolved = resolveFinish(finish, locale)
    if (resolved) out.push(resolved)
  }
  return out
}

export function getFinish(slug: string, locale: Locale): ResolvedFinish | undefined {
  const finish = finishes.find((f) => f.slug === slug)
  return finish ? resolveFinish(finish, locale) : undefined
}

/**
 * A finish is PUBLISHED exactly when it has a sample photo — decision of
 * 2026-09-17 (`design/02` §A3), read from `lib/datos.ts`'s own comment: a
 * screen that re-derives this filter is a screen that forgets it, which is
 * why it lives here and nowhere else. `getFinishesByService`/
 * `getFinishesByModel`/`getFinishesByProjects` all read FROM this list, not
 * from the full catalog, so they inherit the rule without deciding
 * anything themselves.
 */
export function getPublishedFinishes(locale: Locale): ResolvedFinish[] {
  return getFinishes(locale).filter((f) => f.sample !== undefined)
}

export function getFinishesByService(service: ServiceId, locale: Locale): ResolvedFinish[] {
  return getPublishedFinishes(locale).filter((f) => f.service === service)
}

export function getFinishesByModel(model: ModelId, locale: Locale): ResolvedFinish[] {
  return getPublishedFinishes(locale).filter((f) => f.model === model)
}

/** Published finishes that were executed on any of the given project slugs. */
export function getFinishesByProjects(projectSlugs: readonly string[], locale: Locale): ResolvedFinish[] {
  return getPublishedFinishes(locale).filter((f) => f.projects.some((slug) => projectSlugs.includes(slug)))
}

/** The `ModelId`s the catalog names, published or not (route list for `/acabados/[modelo]/`), from the FULL catalog — not just published finishes. */
export function getCatalogModels(): ModelId[] {
  const set = new Set<ModelId>()
  for (const finish of finishes) {
    if (finish.model) set.add(finish.model)
  }
  return Array.from(set)
}

/** The `ServiceId`s with at least one published finish — the sample-filter chip row's option list, and the `?tecnica=` contract. */
export function getServicesInUse(locale: Locale): ServiceId[] {
  const set = new Set(getPublishedFinishes(locale).map((f) => f.service))
  return Array.from(set)
}

/**
 * A finish has DOCUMENTED work when it's linked to a project whose town is
 * confirmed — `estaDocumentado` in `lib/datos.ts`. Not `finish.projects.length
 * > 0`: that would count a project whose town the design itself declares
 * unconfirmed (e.g. `impreso-manta-gris`).
 */
export function isFinishDocumented(finish: Finish): boolean {
  return finish.projects.some((slug) => Boolean(projects.find((p) => p.slug.es === slug)?.town))
}

/**
 * ⚠️ Defaults to the WHOLE catalog, not just published — mirrors
 * `contarDocumentados`'s own warning in `lib/datos.ts`: the home page counts
 * over all 16 on purpose. Whoever counts what's actually painted passes
 * `getPublishedFinishes(locale)`, or better, `getFinishesSummary`.
 */
export function countDocumentedFinishes(list: readonly Finish[] = finishes): number {
  return list.filter(isFinishDocumented).length
}

/** `{ published, documented }` over the PUBLISHED subset — `recuentoAcabadosPublicados` in `lib/datos.ts`. */
export function getFinishesSummary(locale: Locale): { published: number; documented: number } {
  const publishedSlugs = new Set(getPublishedFinishes(locale).map((f) => f.slug))
  const publishedRaw = finishes.filter((f) => publishedSlugs.has(f.slug))
  return { published: publishedRaw.length, documented: countDocumentedFinishes(publishedRaw) }
}
