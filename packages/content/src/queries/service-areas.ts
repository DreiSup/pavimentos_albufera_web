import { serviceAreas } from '../data/service-areas.ts'
import { faq, serviceAreaFaqRefs } from '../data/faq.ts'
import type { Question } from '../schemas/faq.ts'
import type { ServiceArea } from '../schemas/service-area.ts'
import type { ServiceId } from '../schemas/service.ts'
import { resolveQuestions } from './resolve.ts'
import type { Locale, ResolvedQuestion } from './resolve.ts'

export type ResolvedServiceArea = {
  slug: string
  town: string
  province: ServiceArea['province']
  ring: ServiceArea['ring']
  projects: string[]
  services: ServiceId[]
}

function resolveServiceArea(area: ServiceArea): ResolvedServiceArea {
  return {
    slug: area.slug,
    town: area.town,
    province: area.province,
    ring: area.ring,
    projects: area.projects,
    services: area.services,
  }
}

/** All 8 documented service areas, in `data/service-areas.ts` order. */
export function getServiceAreas(): ResolvedServiceArea[] {
  return serviceAreas.map(resolveServiceArea)
}

export function getServiceArea(slug: string): ResolvedServiceArea | undefined {
  const area = serviceAreas.find((a) => a.slug === slug)
  return area ? resolveServiceArea(area) : undefined
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
