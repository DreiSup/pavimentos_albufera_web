import type { Localized } from './localized.ts'
import type { SiteImage } from './image.ts'

/**
 * One of the 8 services: the 6 decorative techniques (printed, polished,
 * washed concrete…) plus 2 placement services with no decorative finish
 * (`bombeo`: concrete pumping and pouring; `autonivelante`: self-levelling
 * screed). Values are
 * SHORT INTERNAL CODES, unlike Pavivasa's `ServiceId` (whose literal values
 * ARE the URL slug, e.g. `'hormigon-impreso'`): here the codes are also the
 * literal values of the public `?tecnica=` query param read by the sample
 * and project filters, so they don't translate either (D4 — glossary
 * override).
 */
export type ServiceId =
  | 'impreso'
  | 'pulido'
  | 'microcemento'
  | 'lavado'
  | 'fratasado'
  | 'desactivado'
  | 'bombeo'
  | 'autonivelante'

/**
 * A numbered section of a service page. A union, not `string`, so a typo in
 * `hiddenSections` fails to compile instead of silently hiding nothing.
 * Values kept in their original Spanish spelling ("every value verbatim") —
 * they are internal ids, not copy.
 */
export type ServiceSection =
  | 'seccion-guia'
  | 'seccion-aplicaciones'
  | 'seccion-galeria'
  | 'seccion-muestrario'
  | 'seccion-ficha'
  | 'seccion-cuando-no'
  | 'seccion-como'
  | 'seccion-obra'

/**
 * One row of a service's spec table. `value` may carry `{{what is missing}}`
 * (rendered as `<DatoPendiente>`, same markup as `RichText`) for a figure only
 * the owner can give — and nothing else: a `[text](/path/)` link inside a
 * spec cell is rejected by `content:validate`. Plain values render exactly as
 * before the markup existed.
 */
export type SpecRow = { label: Localized<string>; value: Localized<string> }

export type ServiceApplications = {
  intro: Localized<string>
  list: { name: Localized<string>; text: Localized<string> }[]
}

/**
 * Prose with a deliberately tiny inline markup, so a paragraph can carry an
 * internal link or a pending datum without inventing a rich-text model:
 *
 *   - `[visible text](/internal/path/)` → an internal link. Internal only:
 *     the path must start and end with `/` (`trailingSlash: true`), checked by
 *     `content:validate`; `pnpm verify` (b) then checks it doesn't 404.
 *   - `{{what is missing}}` → a datum only the owner can give, rendered as
 *     `<DatoPendiente>` (bracketed, dimmed). Never filled with a guess.
 *
 * Nothing else is parsed: no bold, no lists, no external links.
 */
export type RichText = string

/** One H3 block of a service guide: a heading and one or more paragraphs. */
export type ServiceGuideBlock = {
  title: Localized<string>
  paragraphs: Localized<RichText>[]
}

/**
 * The "what it is / how it's done" band of a service page (SEO recipe of
 * 2026-10-21, `design/seo/receta-paginas-servicio.md`): the text that answers
 * the main search intent of the page — what the technique is, how it's
 * applied, where it works (inside/outside), colours, and how it differs from
 * its neighbours. Optional: a service without approved text simply doesn't
 * render the band.
 */
export type ServiceGuide = {
  /** Small mono label above the H2 (antetítulo, no number). */
  kicker: Localized<string>
  /** The band's H2. */
  title: Localized<string>
  /** Lead paragraph next to the H2: the direct answer, first. */
  intro: Localized<RichText>
  blocks: ServiceGuideBlock[]
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
  /** Two-line hero label chip, e.g. `['IMPRESO', 'ESPESOR 10 CM · HA-25']`. */
  heroLabelLines: Localized<string>[]
  /** Hero photo. Optional: when absent, the page falls back to a placeholder block. */
  heroImage?: SiteImage
  /** Service-card photo on the home page — deliberately distinct from `heroImage`. */
  cardImage?: SiteImage
  /**
   * One-line pitch under the service name on the home page's service grid.
   * Optional: absent, the card shows photo and name only (never a made-up
   * line). The 6 original services still carry theirs hard-coded in
   * `apps/web/src/app/page.tsx` (frozen-phase copy); a value here wins.
   */
  cardText?: Localized<string>
  /**
   * `false` for a service that has no decorative finish BY NATURE (pumping,
   * self-levelling screed) — not for one whose finishes just lack photos yet.
   * Its page then skips the sample section ("Muestrario") and the hero's
   * "see finishes" button, skips "Cómo trabajamos" (its four steps describe
   * laying a decorative slab — own crew, curing times, 10-year warranty and
   * resealing — none of it confirmed for these services), and shows "Obra
   * ejecutada" only once it has a project. Omitted means `true`: the 6 decorative techniques never set it,
   * and an empty sample section there stays an honest empty state.
   * `content:validate` rejects a finish pointing at a service set to `false`.
   */
  hasFinishes?: boolean
  /**
   * Photos of the service being carried out, shown as a numbered "Galería"
   * band after "Aplicaciones". Optional: absent or empty, the band isn't
   * rendered. Today only the two services with no client photo at all use it,
   * with provisional AI-generated images (`design/05` §C #15) — never project
   * or place photos, which belong to `Project.images`.
   */
  gallery?: SiteImage[]
  /** "What it is / how it's done" band, right after the hero. See `ServiceGuide`. */
  guide?: ServiceGuide
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
