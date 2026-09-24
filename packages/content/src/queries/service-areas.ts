import { serviceAreas } from '../data/service-areas.ts'
import { faq, serviceAreaFaqRefs } from '../data/faq.ts'
import type { Question } from '../schemas/faq.ts'
import type { ServiceArea } from '../schemas/service-area.ts'
import type { ServiceId } from '../schemas/service.ts'
import type { ProjectId } from '../schemas/ids.ts'
import { pickLocalized, resolveQuestions } from './resolve.ts'
import type { Locale, ResolvedQuestion } from './resolve.ts'

export type ResolvedServiceArea = {
  slug: string
  town: string
  province: ServiceArea['province']
  ring: ServiceArea['ring']
  /** FK ids (D24: `ProjectId[]`), pinned to `es` — see `schemas/service-area.ts`'s `projects` field comment. Not locale-resolved: look each one up with `getProject(id, locale)` to get a linkable slug. */
  projects: ProjectId[]
  services: ServiceId[]
}

/** `undefined` when the area has no translation for `locale` — same "no silent Spanish fallback" rule as every other `queries/` reader. */
function resolveServiceArea(area: ServiceArea, locale: Locale): ResolvedServiceArea | undefined {
  const slug = pickLocalized(area.slug, locale)
  if (slug === undefined) return undefined
  return {
    slug,
    town: area.town,
    province: area.province,
    ring: area.ring,
    projects: area.projects,
    services: area.services,
  }
}

/** All 8 documented service areas, in `data/service-areas.ts` order, resolved for `locale`. */
export function getServiceAreas(locale: Locale): ResolvedServiceArea[] {
  const out: ResolvedServiceArea[] = []
  for (const area of serviceAreas) {
    const resolved = resolveServiceArea(area, locale)
    if (resolved) out.push(resolved)
  }
  return out
}

export function getServiceArea(slug: string, locale: Locale): ResolvedServiceArea | undefined {
  const area = serviceAreas.find((a) => a.slug.es === slug)
  return area ? resolveServiceArea(area, locale) : undefined
}

/** The shared FAQ subset every `/zonas/[municipio]/` page shows — `faqZona` in the source. */
export function getServiceAreaFaq(locale: Locale): ResolvedQuestion[] {
  const questions: Question[] = []
  for (const ref of serviceAreaFaqRefs) {
    const question = faq[ref]
    if (question) questions.push(question)
  }
  return resolveQuestions(questions, locale)
}
