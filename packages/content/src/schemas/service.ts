import type { Localized } from './localized.ts'
import type { SiteImage } from './image.ts'

/**
 * One of the 6 techniques (printed, polished, washed concrete…). Values are
 * SHORT INTERNAL CODES, unlike Pavivasa's `ServiceId` (whose literal values
 * ARE the URL slug, e.g. `'hormigon-impreso'`): here the codes are also the
 * literal values of the public `?tecnica=` query param read by the sample
 * and project filters, so they don't translate either (D4 — glossary
 * override).
 */
export type ServiceId = 'impreso' | 'pulido' | 'microcemento' | 'lavado' | 'fratasado' | 'desactivado'

/**
 * A numbered section of a service page. A union, not `string`, so a typo in
 * `hiddenSections` fails to compile instead of silently hiding nothing.
 * Values kept in their original Spanish spelling ("every value verbatim") —
 * they are internal ids, not copy.
 */
export type ServiceSection =
  | 'seccion-aplicaciones'
  | 'seccion-muestrario'
  | 'seccion-ficha'
  | 'seccion-cuando-no'
  | 'seccion-como'
  | 'seccion-obra'

export type SpecRow = { label: Localized<string>; value: Localized<string> }

export type ServiceApplications = {
  intro: Localized<string>
  list: { name: Localized<string>; text: Localized<string> }[]
}

export type WhenNotTo = {
  title: Localized<string>
  text: Localized<string>
  alternatives: { href: string; text: Localized<string> }[]
}

/**
 * Adapted from Pavivasa's `Service`, not copied — this repo's `Servicio` has
 * fields Pavivasa's `Service` doesn't (`heroLabelLines`, a separate
 * `cardImage`, `whenNotTo`, no comparison-table `specSheet`/`specList`
 * machinery — this repo has exactly one flat spec-row style) and is missing
 * fields Pavivasa's has (`cta`, `flagship`). `faqRefs` is content, not a
 * resolved `Question[]`: each service picks a named subset of the shared
 * `data/faq.ts` pool, and that selection is itself part of the content
 * model (see `data/faq.ts`'s own comment).
 */
export type Service = {
  /** Internal identifier / record key — plain, not translated. */
  id: ServiceId
  /** Full public URL path, e.g. `/hormigon-impreso/` (kept whole, including slashes — external contract, the route folder never changes regardless of this value). */
  path: Localized<string>
  name: Localized<string>
  /** `<title>`. */
  title: Localized<string>
  /** `<meta description>`. */
  description: Localized<string>
  h1: Localized<string>
  /** Lede paragraph under the H1. */
  intro: Localized<string>
  /** Two-line hero label chip, e.g. `['IMPRESO', 'ESPESOR 10 CM · HA-25 · EHE-08']`. */
  heroLabelLines: Localized<string>[]
  /** Hero photo. Optional: when absent, the page falls back to a placeholder block. */
  heroImage?: SiteImage
  /** Service-card photo on the home page — deliberately distinct from `heroImage`. */
  cardImage?: SiteImage
  /** Only present where there's approved copy backing it — an absent section isn't rendered. */
  applications?: ServiceApplications
  specs: SpecRow[]
  whenNotTo?: WhenNotTo
  /** Keys into `data/faq.ts`'s question pool, resolved by `queries/services.ts`. */
  faqRefs: string[]
}

/**
 * A `/lp/<slug>/` campaign landing: not separate content, a pure
 * recomposition of an existing `Service` with three UI flags set — see
 * `data/campaign-landings.ts` and `queries/services.ts`'s `getLandingService`.
 */
export type LandingService = Service & {
  /** Sections this landing doesn't render. */
  hiddenSections: readonly ServiceSection[]
  /** Puts the call/WhatsApp CTAs in the hero and the closing block. */
  ctaContact: boolean
  /** Exempts the closing CTA+form block from the scroll-reveal wrapper — it's the conversion block. */
  noAppear: boolean
}
