import { projects } from '../data/projects.ts'
import type { ServiceId } from '../schemas/service.ts'
import type { ExecutionSpecs, Project } from '../schemas/project.ts'
import { pickLocalized, pickLocalizedList, resolveImage } from './resolve.ts'
import type { Locale, ResolvedImage } from './resolve.ts'

export type ResolvedExecutionSpecs = {
  concrete?: string
  thickness?: string
  aggregate?: string
  mesh?: string
  fiber?: string
  color?: string
  finishes?: string[]
}

export type ResolvedProject = {
  slug: string
  title: string
  town?: string
  province?: Project['province']
  service: ServiceId
  model?: Project['model']
  color?: Project['color']
  surfaceArea?: number
  year?: number
  executionDays?: number
  brief?: string
  execution?: string
  images: ResolvedImage[]
  featured: boolean
  executionSpecs?: ResolvedExecutionSpecs
}

/** Only includes a key when the source data has it — see `resolveImage`'s comment on why. */
function resolveExecutionSpecs(specs: ExecutionSpecs, locale: Locale): ResolvedExecutionSpecs | undefined {
  const concrete = pickLocalized(specs.concrete, locale)
  const thickness = pickLocalized(specs.thickness, locale)
  const aggregate = pickLocalized(specs.aggregate, locale)
  const mesh = pickLocalized(specs.mesh, locale)
  const fiber = pickLocalized(specs.fiber, locale)
  const color = pickLocalized(specs.color, locale)
  const finishes = specs.finishes ? pickLocalizedList(specs.finishes, locale) : undefined
  const result: ResolvedExecutionSpecs = {
    ...(concrete !== undefined ? { concrete } : {}),
    ...(thickness !== undefined ? { thickness } : {}),
    ...(aggregate !== undefined ? { aggregate } : {}),
    ...(mesh !== undefined ? { mesh } : {}),
    ...(fiber !== undefined ? { fiber } : {}),
    ...(color !== undefined ? { color } : {}),
    ...(finishes !== undefined && finishes.length > 0 ? { finishes } : {}),
  }
  return Object.keys(result).length > 0 ? result : undefined
}

/** `_pending`/`_note` (editorial metadata) are deliberately never read here — see `data/projects.ts`'s `ProjectRecord`. */
function resolveProject(project: Project, locale: Locale): ResolvedProject | undefined {
  const slug = pickLocalized(project.slug, locale)
  const title = pickLocalized(project.title, locale)
  if (slug === undefined || title === undefined) return undefined

  const brief = pickLocalized(project.brief, locale)
  const execution = pickLocalized(project.execution, locale)
  const executionSpecs = project.executionSpecs ? resolveExecutionSpecs(project.executionSpecs, locale) : undefined

  return {
    slug,
    title,
    ...(project.town !== undefined ? { town: project.town } : {}),
    ...(project.province !== undefined ? { province: project.province } : {}),
    service: project.service,
    ...(project.model !== undefined ? { model: project.model } : {}),
    ...(project.color !== undefined ? { color: project.color } : {}),
    ...(project.surfaceArea !== undefined ? { surfaceArea: project.surfaceArea } : {}),
    ...(project.year !== undefined ? { year: project.year } : {}),
    ...(project.executionDays !== undefined ? { executionDays: project.executionDays } : {}),
    ...(brief !== undefined ? { brief } : {}),
    ...(execution !== undefined ? { execution } : {}),
    images: project.images
      .map((image) => resolveImage(image, locale))
      .filter((image): image is ResolvedImage => image !== undefined),
    featured: project.featured,
    ...(executionSpecs !== undefined ? { executionSpecs } : {}),
  }
}

/** All projects, resolved for `locale`, in their `data/projects.ts` order. */
export function getProjects(locale: Locale): ResolvedProject[] {
  const out: ResolvedProject[] = []
  for (const project of projects) {
    const resolved = resolveProject(project, locale)
    if (resolved) out.push(resolved)
  }
  return out
}

export function getProject(slug: string, locale: Locale): ResolvedProject | undefined {
  return getProjects(locale).find((p) => p.slug === slug)
}

export function getProjectsByService(service: ServiceId, locale: Locale, excludeSlug?: string): ResolvedProject[] {
  return getProjects(locale).filter((p) => p.service === service && p.slug !== excludeSlug)
}

export function getProjectsByModel(model: NonNullable<Project['model']>, locale: Locale, excludeSlug?: string): ResolvedProject[] {
  return getProjects(locale).filter((p) => p.model === model && p.slug !== excludeSlug)
}

export function getFeaturedProjects(locale: Locale): ResolvedProject[] {
  return getProjects(locale).filter((p) => p.featured)
}
