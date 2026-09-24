# @site/content

Single source of truth for the business's facts: NAP, services, finishes,
models, service areas, projects, articles, FAQ and legal facts. No React, no
Next. `apps/web`'s server-only code reads through `src/queries/`, the
locale-aware API; a handful of client-reachable adapters instead import a
few data-only leaves straight out of `src/data/` through their own subpath
exports — see "Client-bundle rule" below for which, and why.

**Wired into `apps/web`** via the legacy adapters under `apps/web/src/lib`
and `apps/web/src/content` that keep the old Spanish API the frontend
components already use — most of them (`lib/datos.ts`,
`content/servicios.tsx`, `content/faq.ts`, `content/landings.ts`,
`content/legal.tsx`, `content/modelos.ts`) read `getServices`,
`getFinishes`, `getProjects`… through the main barrel (`.`, i.e.
`src/queries/`); the two that are client-reachable (`lib/tipos.ts`,
`lib/config.ts`) read the data-only subpaths instead — see "Client-bundle
rule" below. `apps/web/src/app/sitemap.ts` also reads from it, through
`lib/datos.ts` and `content/servicios.tsx`. Run `pnpm turbo run
content:validate` before any build that doesn't already depend on it;
`turbo run build` does depend on it
(`turbo.json`'s `build` task lists `content:validate`/`^content:validate`),
but the plain `pnpm --filter web build` command does not invoke it by
itself — run `content:validate` first, as the gate does.

## Layout

```
src/
  schemas/    Zod shapes (*.zod.ts) + the plain TS types data/queries use (*.ts)
  data/       The actual content, typed via `satisfies`/explicit types — no runtime validation here
  queries/    The locale-aware read API — resolves Localized<T> for a locale (see
              "Client-bundle rule" for the few data-only leaves read a different way)
  legal/      Unrendered source texts for the legal pages (not imported anywhere — see its own README)
scripts/
  validate.ts Parses everything with Zod + checks referential integrity
```

## The `Localized<T>` rule

Every field a visitor reads as text — names, descriptions, FAQ Q&A, image
alts, spec rows, CTAs — **and every URL path/slug** — is
`{ es: T; en?: T; fr?: T; de?: T }`. `es` is mandatory; the rest fill in as
translations land. The only fields that stay **plain** (not `Localized`):

- Internal identifiers used as lookup keys (`ServiceId`, `ModelId`,
  `ColorId`, `ImageKind` — including its *values*, kept in their original
  Spanish spelling; see `schemas/image.ts`), a `projectCallout` block's
  `slug` reference, an `href`.
- Foreign-key references to a project: `Finish.projects` and
  `ServiceArea.projects` are `string[]` holding `Project.slug.es` — the
  stable identifier a project was authored under, not resolved for the
  caller's locale. They name WHICH project, they don't display it; nothing
  reads them as visible text. `Project.slug` itself stays `Localized<T>`
  (it's a URL path), so these two arrays are pinned to its `es` value on
  purpose — see `schemas/finish.ts`/`schemas/service-area.ts`'s field
  comments.
- Proper nouns: town, province, the business name, a legal recipient's
  company name.
- Numbers (`surfaceArea`, `year`, `ring`) and internal codes (`taxId`,
  `domain`, a finish's `code`).

`queries/` resolves a `Localized<T>` for a given `locale` via
`pickLocalized`/`pickLocalizedList` and **never** falls back to Spanish for
another locale — a missing translation surfaces as `undefined`, or the item
is dropped from a list. Only `es` is populated today; every other locale's
fields are simply absent, which is exactly what "missing translation"
should look like.

## Adapted from Pavivasa, not copied

This package mirrors `pavivasa/packages/content`'s structure (`Localized<T>`,
the schema/zod split, the queries style, the `content:validate` approach —
Node's `--experimental-strip-types`, no `tsx`), but this business's content
model genuinely differs in several places, confirmed by reading both
codebases in full:

- **`ServiceId`'s 6 values are short internal codes**, not the URL slug
  (Pavivasa's `ServiceId` values ARE the slug). They're also the literal
  `?tecnica=` query-param contract, so they don't translate either.
- **`Finish`, `Model`, `ServiceArea` are new top-level entities** with no
  Pavivasa equivalent. `ServiceArea` is explicitly NOT Pavivasa's
  `Project.district` — see `schemas/service-area.ts`'s doc comment.
- **`SiteImage` is not Pavivasa's `ImageContent`.** Every image in this
  repo's source data already exists (`src`/`alt` are never optional); there
  is no "photo hasn't arrived yet" placeholder shape to preserve, unlike
  Pavivasa's `label`-first `ImageContent`. Forcing that shape here would
  mean inventing a `label` field this business has no content for.
  `ImageKind`'s values stay in Spanish on purpose — see `schemas/image.ts`.
- **No `claims` data.** Pavivasa's `lib/config.ts` has a `claims` object
  (years of experience, warranty…); this repo's `lib/config.ts`/`content/`
  have no such block anywhere. Not invented.
- **Per-service FAQ composition is content**, not code: `data/faq.ts` holds
  the full question pool, and each service's `faqRefs: string[]` in
  `data/services.ts` picks a named subset — mirrors the source's own
  `FAQ_SOLERA` pattern, generalized.
- **Campaign landings (`/lp/`) are a pure function of `services` + a fixed
  id list** (`data/campaign-landings.ts`), recomposed by
  `queries/services.ts`'s `getLandingService` — not their own content type.
- **Legal facts (D6, option b): plain-string rows only.** The ~9 rows that
  are JSX in `apps/web/src/content/legal.tsx` (`<DatoPendiente>` markers,
  external links, one mixed fragment) are NOT in `data/legal.ts` — they
  stay hand-written in that adapter, unchanged in this phase. See
  `schemas/legal-facts.ts` and `data/legal.ts`'s own comments for exactly
  which rows moved and which didn't.
- **Editorial metadata is preserved, typed, and kept out of the public
  schema.** `content/proyectos.json`'s `_pendiente`/`_nota` and
  `content/acabados.json`'s `_nota` survive as `_pending`/`_note` on
  `ProjectRecord`/`FinishRecord`/`ServiceAreaRecord` (`data/*.ts`), never
  resolved by `queries/`. `content/zonas.json`'s trailing
  non-`ServiceArea` object survives as its own typed export,
  `unconfirmedServiceAreaTowns` — never merged into the `serviceAreas`
  array, so no runtime filter is needed to keep it out of `/zonas/` pages.

## Adding content

- **A new service**: add an entry to `src/data/services.ts` (in menu order)
  and a matching one to `src/data/service-catalog.ts` (kept in sync by
  `content:validate`).
- **A new finish**: add an entry to `src/data/finishes.ts`. `service` must
  match a real `ServiceId`; `model` (if set) a real `ModelId`; every slug in
  `projects` a real project. It becomes "published" automatically the
  moment it gets a `sample` photo — no screen decides that.
- **A new project**: add an entry to `src/data/projects.ts`. Only set the
  fields you actually know; never invent a value. `_pending`/`_note` are for
  editorial tracking only.

Run `pnpm content:validate` after any content change (wired into
`turbo run content:validate`, and into `turbo run build` as a dependency —
see this README's intro for the plain `pnpm --filter web build` caveat).

## Client-bundle rule

`src/queries/` is the locale-aware read API and the right import for any
server-only code. A `'use client'` component's bundle can only reach a
handful of `apps/web/src/lib` adapters, though, and those import a few
**data-only leaves** straight out of `src/data/` through their own subpath
exports (`@site/content/business-data`, `@site/content/color-data`,
`@site/content/service-catalog-data`, `@site/content/models-data` — see
`package.json`'s `exports`) instead of going through `queries/` or the main
barrel (`.`). This is deliberate, not a shortcut: `queries/`'s resolvers
(`pickLocalized` dispatch, conditional-spread field building for N locales)
are real, non-dead code the moment any field is read, so webpack can't
tree-shake them away, and importing them from a client-reachable module
costs real bytes on every route that module reaches — measured and fixed
during this migration by diffing compiled `.next` chunks byte-for-byte
against the phase-1 build. Each of those four subpaths exports one runtime
value — a plain object or array literal, no zod, no locale resolution, no
generic dispatch (`service-catalog-data` also exports its type, erased at
compile time, so nothing at runtime) — so there is nothing left for a
bundler to keep once the importing adapter re-derives just the fields it
needs. Add a new such
subpath only for another data-only leaf a client adapter genuinely needs
this way; everything else — including every server-only adapter — reads
through `queries/` or the main barrel as usual.

The main barrel (`src/index.ts`) itself only ever re-exports names
explicitly, never `export * from './queries/index.ts'`: a star export
would silently widen the package's public surface with whatever `queries/`
happens to add later, with no line in `index.ts` to review. Explicit names
keep this package's entire public API — what any consumer, client-reachable
or not, can import from `.` — readable as one flat list in this one file.

## Why `schemas/*.zod.ts` are separate from `schemas/*.ts`

`data/` and `queries/` use only the plain `*.ts` type files — zero zod
runtime. The `*.zod.ts` siblings hold the actual `z.object(...)` schemas and
are imported only by `scripts/validate.ts`. Constructing a Zod schema
executes real code from the `zod` package; keeping it out of `data/`/
`queries/` keeps it out of every client bundle those data-only leaves and
adapters reach today, not just a hypothetical future one.
