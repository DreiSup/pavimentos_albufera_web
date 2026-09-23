# @site/content

Single source of truth for the business's facts: NAP, services, finishes,
models, service areas, projects, articles, FAQ and legal facts. No React, no
Next. `apps/web` never imports data straight out of `src/data/`; it only
reads through `src/queries/`.

**Phase 2a of the monorepo migration**: this package exists on its own,
validated by `content:validate`, but is **not yet wired into `apps/web`** —
that wiring, and the legacy adapters that keep the old Spanish API the
frontend already uses, land in phase 2b. The `apps/web` build does not
depend on this package yet.

## Layout

```
src/
  schemas/    Zod shapes (*.zod.ts) + the plain TS types data/queries use (*.ts)
  data/       The actual content, typed via `satisfies`/explicit types — no runtime validation here
  queries/    The ONLY read API — locale-aware, resolves Localized<T> for a locale
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
`turbo run content:validate`; `apps/web build` will depend on it starting
phase 2b).

## Why `schemas/*.zod.ts` are separate from `schemas/*.ts`

`data/` and `queries/` use only the plain `*.ts` type files — zero zod
runtime. The `*.zod.ts` siblings hold the actual `z.object(...)` schemas and
are imported only by `scripts/validate.ts`. Constructing a Zod schema
executes real code from the `zod` package; keeping it out of `data/`/
`queries/` keeps it out of any future client bundle.
