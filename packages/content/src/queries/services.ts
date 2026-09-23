import { services } from '../data/services.ts'
import { serviceCatalog } from '../data/service-catalog.ts'
import { CAMPAIGN_SERVICE_IDS } from '../data/campaign-landings.ts'
import { faq } from '../data/faq.ts'
import type { Service, ServiceId } from '../schemas/service.ts'
import type { Question } from '../schemas/faq.ts'
import { pickLocalized, pickLocalizedList, resolveImage, resolveQuestions } from './resolve.ts'
import type { Locale, ResolvedImage, ResolvedQuestion } from './resolve.ts'

export type ResolvedService = {
  id: ServiceId
  path: string
  name: string
  title: string
  description: string
  h1: string
  intro: string
  heroLabelLines: string[]
  heroImage?: ResolvedImage
  cardImage?: ResolvedImage
  applications?: { intro: string; list: { name: string; text: string }[] }
  specs: { label: string; value: string }[]
  whenNotTo?: { title: string; text: string; alternatives: { href: string; text: string }[] }
  faq: ResolvedQuestion[]
}

export type ResolvedLandingService = ResolvedService & {
  hiddenSections: readonly string[]
  ctaContact: boolean
  noAppear: boolean
}

/** Looks a `faqRefs` key up in the shared pool. A ref with no matching entry is dropped, not invented. */
function resolveFaqRefs(refs: readonly string[], locale: Locale): ResolvedQuestion[] {
  const questions: Question[] = []
  for (const ref of refs) {
    const question = faq[ref]
    if (question) questions.push(question)
  }
  return resolveQuestions(questions, locale)
}

function resolveService(service: Service, locale: Locale): ResolvedService | undefined {
  const name = pickLocalized(service.name, locale)
  const path = pickLocalized(service.path, locale)
  if (name === undefined || path === undefined) return undefined // no translation at all: not publishable in this locale

  return {
    id: service.id,
    path,
    name,
    title: pickLocalized(service.title, locale) ?? '',
    description: pickLocalized(service.description, locale) ?? '',
    h1: pickLocalized(service.h1, locale) ?? '',
    intro: pickLocalized(service.intro, locale) ?? '',
    heroLabelLines: pickLocalizedList(service.heroLabelLines, locale),
    ...(service.heroImage ? { heroImage: resolveImage(service.heroImage, locale) } : {}),
    ...(service.cardImage ? { cardImage: resolveImage(service.cardImage, locale) } : {}),
    ...(service.applications
      ? {
          applications: {
            intro: pickLocalized(service.applications.intro, locale) ?? '',
            list: service.applications.list.map((item) => ({
              name: pickLocalized(item.name, locale) ?? '',
              text: pickLocalized(item.text, locale) ?? '',
            })),
          },
        }
      : {}),
    specs: service.specs.map((row) => ({
      label: pickLocalized(row.label, locale) ?? '',
      value: pickLocalized(row.value, locale) ?? '',
    })),
    ...(service.whenNotTo
      ? {
          whenNotTo: {
            title: pickLocalized(service.whenNotTo.title, locale) ?? '',
            text: pickLocalized(service.whenNotTo.text, locale) ?? '',
            alternatives: service.whenNotTo.alternatives.map((alt) => ({
              href: alt.href,
              text: pickLocalized(alt.text, locale) ?? '',
            })),
          },
        }
      : {}),
    faq: resolveFaqRefs(service.faqRefs, locale),
  }
}

/** All 6 services, in menu order, resolved for `locale`. A service without a translation for `locale` is dropped (never a silent Spanish fallback). */
export function getServices(locale: Locale): ResolvedService[] {
  const out: ResolvedService[] = []
  for (const service of services) {
    const resolved = resolveService(service, locale)
    if (resolved) out.push(resolved)
  }
  return out
}

export function getService(id: ServiceId, locale: Locale): ResolvedService | undefined {
  const service = services.find((s) => s.id === id)
  return service ? resolveService(service, locale) : undefined
}

export type ResolvedServiceCatalogEntry = { id: ServiceId; path: string; name: string }

/** Light per-service lookup (id, path, name) — deliberately without the heavy content, for client-reachable code (menus, header, footer). See `data/service-catalog.ts`. */
export function getServiceCatalog(locale: Locale): ResolvedServiceCatalogEntry[] {
  const out: ResolvedServiceCatalogEntry[] = []
  for (const entry of serviceCatalog) {
    const path = pickLocalized(entry.path, locale)
    const name = pickLocalized(entry.name, locale)
    if (path === undefined || name === undefined) continue
    out.push({ id: entry.id, path, name })
  }
  return out
}

/** `{ id -> path }` for every service with a translation in `locale`. */
export function getServicePathMap(locale: Locale): Record<string, string> {
  const map: Record<string, string> = {}
  for (const entry of getServiceCatalog(locale)) map[entry.id] = entry.path
  return map
}

/** The `ServiceId`s that get a `/lp/<slug>/` campaign landing — an explicit owner list, see `data/campaign-landings.ts`. */
export function getLandingServiceIds(): ServiceId[] {
  return CAMPAIGN_SERVICE_IDS
}

/**
 * Recomposes an existing service into its campaign-landing form — not
 * separate content (mirrors `content/landings.ts`'s `recomponer`). Returns
 * `undefined` when `id` isn't a landing id or has no translation for
 * `locale`.
 */
export function getLandingService(id: ServiceId, locale: Locale): ResolvedLandingService | undefined {
  if (!CAMPAIGN_SERVICE_IDS.includes(id)) return undefined
  const resolved = getService(id, locale)
  if (!resolved) return undefined
  return {
    ...resolved,
    hiddenSections: ['seccion-ficha'],
    ctaContact: true,
    noAppear: true,
  }
}

/** The landing's slug is the service path without slashes — derived, never hand-written, so a landing can't outlive its service. */
export function getLandingSlug(id: ServiceId, locale: Locale): string | undefined {
  const path = getServicePathMap(locale)[id]
  return path?.replaceAll('/', '')
}
