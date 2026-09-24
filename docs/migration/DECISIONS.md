# Decisiones de la migración a monorepo (histórico)

Copia en el repo de las decisiones vinculantes que el orquestador fue tomando durante la
migración a monorepo de pavimentos-albufera (2026-09-23/24), citadas por su D-número (D1-D30) en
comentarios, READMEs y `ARCHITECTURE.md` de todo el repo. Es un documento **histórico**: si algo
de lo que dice aquí choca hoy con el código o con `ARCHITECTURE.md`, **ganan el código y
`ARCHITECTURE.md`** — este archivo describe lo que se decidió entonces, no necesariamente el
estado actual.

Las rutas relativas que aparecen en el cuerpo de abajo (`snapshots/`, `js/`, `facts/`, `leak/`,
`notes/`, `buildcheck/`, `inventory/`, `design/package-plan.md`, `design/infra-plan.md`,
`inventory/glossary.json`…) **no son de este repo**: son del `<scratchpad de la migración>`, el
directorio de trabajo temporal de la sesión que hizo la migración — temporal, no versionado en
este repo, fuera de su control de versiones. Ojo en particular con `design/`: el `design/` que
citan esas rutas es el del scratchpad (los planes WF1 de la migración); el `design/` real de este
repo — la especificación de diseño y contenido del sitio, `design/01-sistema-de-diseno.md` y el
resto (ver D16 más abajo) — es un directorio distinto, con contenido distinto, que la migración no
tocó y sigue existiendo.

Copia verbatim del original salvo la línea marcada "(addendum, 2026-09-24)" bajo D27, añadida
después de cerrar la migración y ausente del original. El original no contenía ningún valor de
entorno ni ninguna ruta absoluta `/tmp/...` que hubiera que ocultar aquí.

---

# Orchestrator decisions — pavimentos-albufera monorepo migration (2026-09-23)

Binding for every WF2/WF3 agent. Where a WF1 plan (design/package-plan.md, design/infra-plan.md,
inventory/glossary.json) disagrees with this file, THIS FILE WINS.

## Reference state
- D1. Reference "before" = branch `fix/tracking-consent` @ `cf2e0c5` (main@537ced8 + 3 fixes).
  Snapshot `snapshots/01-ref-cf2e0c5`; JS table `js/ref.tsv`; leak baseline `leak/ref.json`;
  facts `facts/ledger-01-ref.json`, `facts/jsx-01-ref.json`, `facts/*-hashes-01-ref.json`.
- D2. The reference build read the repo-root `.env.local` (NEXT_PUBLIC_* only). In P1, COPY it
  (`cp -p`, never print or read values) to `apps/web/.env.local` (gitignored, never committed) so
  post-P1 builds are comparable and local dev keeps working. The root `.env.local` stays untouched.
  Every gate must confirm tel:/wa.me links are present in the built HTML (non-empty contact data).

## Structure / tooling
- D3. `scripts/verificar-*.mjs` → `apps/web/scripts/` (minimal path fixes; make
  verificar-landings resolve paths from `import.meta.dirname`). `lighthouserc.json` → `apps/web/`.
  The 5 verifiers must run on EVERY build (local, turbo, CI, Vercel) and fail it: chain them
  explicitly in apps/web `build` (`next build && node scripts/... && ...`, same order as today) and
  remove the `postbuild` hook so they never run twice. When content moves to packages (P2), update
  verificar-imagenes (and any other verifier reading content/lib files) so it checks exactly the
  same things from the new locations.
- D14. pnpm 9.15.9: `pnpm import` from package-lock.json, then `pnpm install`; delete
  package-lock.json. Record a before/after table of the resolved version of EVERY direct dependency
  (must be identical). Only new dependency: `turbo` 2.11.3 at root (same as Pavivasa).
- D15. `.gitignore`: Pavivasa's un-anchored monorepo patterns + keep this repo's entries
  (/fotos-origen/, /img/, /.claude/, .lighthouseci, informes-lighthouse, .env*.local, .vercel…).
- D16. `design/` stays at repo root unchanged; `CLAUDE.md` stays at root (rewritten in WF3, not now);
  `public/README.md` moves with public → `apps/web/public/README.md`. lib/legal/*.md (tracked on
  purpose, commit 537ced8) → `packages/content/src/legal/` unchanged + README note.

## Naming (glossary approved with these overrides)
- D4. zona → `ServiceArea` (anillo → `ring`); acabado → `Finish`; modelo → `Model` (`ModelId`);
  color code → `ColorId`; landing → `Landing`; pa_ref code → `referenceCode`; plazoDias →
  `executionDays`; fichaTecnica → `specs: SpecRow[]` (no Pavivasa envelope); FAQ topic → `FaqTopic`.
  Shared concepts reuse Pavivasa names (town, district, quote, project, service, about…).
  Reuse Pavivasa's package API names wherever the concept exists.
- D5. Content data as `.ts` modules in packages/content/src/data (convert the JSON files; values
  untouched). Editorial metadata (`_pendiente`, `_nota`, zonas.json trailing non-zone object) is
  PRESERVED as typed data (never lost, never invented) and is not exposed where it is not rendered
  today. content:validate guards it.

## Content split
- D6. JSX: option (b). content/legal.tsx → plain-string facts go to `@site/content` (legal facts,
  Localized where human-readable); rows with JSX (DatoPendiente, links, mixed fragments) stay as JSX
  in the adapter `apps/web/src/content/legal.tsx`. content/servicios.tsx → data to the package; the 2
  JSX fragments in PASOS become plain strings ONLY if rendered HTML is identical, otherwise they stay
  in the adapter. Prove with facts/jsx-render-compare + HTML compare.
- Legacy adapters keep EXACT old export names/shapes/values (frontend untouched). Header comment in
  each adapter: legacy adapter, delete when a new design consumes @site/* directly.

## Tracking / SEO / behaviour (outputs and behaviour identical)
- D7. Consent stays in cookie `pa_consent`. @site/tracking gets a cookie-backed consent store
  (names configurable, defaults pa_*) alongside Pavivasa's localStorage store. The inline consent
  bootstrap in app/layout.tsx: the package exports a builder reproducing the EXACT current string;
  app/layout.tsx may be edited ONLY to call it and ONLY if a literal byte comparison of the rendered
  inline script and the HTML compare are both identical. If in doubt, leave layout.tsx untouched and
  document the deviation.
- D8. Attribution: keep today's stricter behaviour (whole pa_attr bundle, utm included, needs
  consent). Package option e.g. `utmRequiresConsent` (true here; Pavivasa false). Server attribution
  writer (/api/atribucion logic) → `@site/tracking/server`.
- D9. Env var NAMES unchanged (NEXT_PUBLIC_ADS_ID, NEXT_PUBLIC_ADS_ETIQUETA_LLAMADA → accessor
  `adsCallConversionLabel`, META_CAPI_TEST_EVENT_CODE, …). NEXT_PUBLIC_* only via literal reads.
  Server secrets only via `@site/config/server`, never reachable from client graphs.
- D10. SEO output identical: keep hardcoded areaServed, robots.txt as-is (no AI-crawler groups),
  no new BlogPosting, JSON-LD @id fragments stay Spanish. Site-url normalization may converge with
  Pavivasa only if output identical. Observed SEO bugs (e.g. schemaServicio description) → report as
  findings, do NOT fix.
- D11. Tracking behaviour identical: keep calculator_use dedup, no new Ads conversions; this repo's
  Meta CAPI normalizer is the package implementation (do not change behaviour).
- D12. Rate-limiter duplication (lib/limite.ts vs actions.ts): DEFER, document as pending.
- D13. P3 frontend allowlist (the only files under app/** or components/** that may change, and
  only to delegate logic with identical output/behaviour): app/presupuesto/actions.ts,
  app/api/atribucion/route.ts, app/layout.tsx (only per D7), app/sitemap.ts, app/robots.ts.
  Prefer delegating through apps/web/src/lib adapters so these need no edit at all.
  P1 and P2: NO file under app/** or components/** may change (pure git mv).
- D17. JS budget: per-route compare vs js/ref.tsv, tolerance 64 B. Larger increase = blocking unless
  explained and approved. Leak check: probes found in client chunks must not increase; in P2 extend
  probes with strings reachable from client components through the new packages.
- D18. Non-exported literals must survive byte-for-byte (grep sweep in P3): 'pa_evt_' prefix,
  EVENTOS_UNA_VEZ_POR_SESION, PREFIJOS_RASTREO, EXACTAS_RASTREO, ALFABETO, cookie names, event names.

## Git / Vercel
- D19. Production = `main` on the current Vercel project (user confirmed). Nothing on Vercel changes
  during the migration. Docs (WF3) explain testing the branch in a SEPARATE Vercel project with Root
  Directory apps/web before any merge.
- D20. Branch `monorepo-migration` from `fix/tracking-consent` @cf2e0c5. Local commits only, never
  push, never touch main or fix/tracking-consent. Spanish imperative subject in the repo's style +
  the Co-Authored-By trailer the harness instructs.

## Addenda (orchestrator, before WF2)
- D2 (updated). Done by the orchestrator: `apps/web/.env.local` already exists as a RELATIVE SYMLINK
  → `../../.env.local` (untracked, gitignored). Do not replace it, do not read it. `git mv` into
  apps/web works with the directory already present. Gates must still check tel:/wa.me presence.
- D21. REFERENCE WORKTREE: `<repo>/.claude/worktrees/ref-cf2e0c5` = detached checkout of cf2e0c5
  with its own node_modules (hardlinked copy of the npm install) and `.env.local` symlink. Use it as
  the "before" side of EVERY module-evaluation check (facts ledger, jsx-render, deep equality of
  adapters vs old modules) and for any "before" build. Never modify it. After P1 the repo root
  node_modules becomes pnpm's: always `rm -rf node_modules` before the first `pnpm install`.
- D14 (updated). Pin EXACT versions (no ^/~) of every direct dependency in apps/web/package.json and
  packages/*/package.json, matching what npm had installed.
- D17 (updated for P1). Moving to src/ and to pnpm paths can change module ids by a few bytes: in P1
  a JS delta above tolerance must be INSPECTED and explained (not auto-repaired); only unexplained
  or content-caused growth is blocking.
- D22. Snapshot blind spot: buildcheck strips every non-JSON-LD <script>. WF2 prep adds an
  inline-scripts aspect (consent default, data-consentimiento pre-hydration script, any other inline
  non-flight script) and re-snapshots the reference; P3 must be 0 on that aspect too.

## Addenda (orchestrator, after WF2 run 1 — P1 passed, P2 stopped after 3 rounds)
- D17 (final). JS parity baseline for P2/P3 = `js/10-p1.tsv` (P1's -100..-143 B shrink vs ref.tsv is
  explained in notes/p1-js-budget-delta.md and accepted). Target: every route within ±64 B of
  10-p1.tsv. Rule to get there: client-reachable adapters (lib/config.ts, lib/tipos.ts, and anything
  imported from a 'use client' graph) import ONLY data-only leaf modules through package subpath
  exports (no Zod, no query layer, no barrels, no resolvers with generic code); tiny derivations
  (phone href, wa.me href…) may be re-implemented inline in the adapter exactly as the old
  lib/config.ts did. Server-only adapters may use queries freely. PRE-APPROVED residual: ≤ 200 B per
  route ONLY with a byte-level explanation (which exact code, which chunk) and a clean leak check.
  Any SHRINK above tolerance (e.g. /acabados −1181 B) must be explained at chunk level: a shrink
  can mean lost client behaviour, which is a defect.
- D23 ACCEPTED (do not re-raise): (a) lib/datos.ts adapter no longer carries _pendiente/_nota at
  runtime — no code ever read them, TS never declared them, data preserved in the package (D5 wins
  over D6 here). (b) projects' null→optional in the package is fine as long as adapters return the
  exact old values (null where it was null). (c) extra internal helper exports in the servicios
  adapter are fine (not client-reachable). (d) ImageKind/section values keep their Spanish spelling
  (they are data values). (e) LEEME.txt and 09-instrucciones-legales.md moved with lib/legal.
  (f) @site/config check-env script and a `server-only` guard are deferred to WF3.
- D24. Slugs/refs: ServiceArea.slug (URL segment of /zonas/[municipio]/) becomes Localized<string>
  (es only) like every other slug. Cross-entity references (Finish.projects, ServiceArea.projects,
  project→service…) are typed IDs (e.g. ProjectId = the stable es slug string), documented as IDs,
  resolved to localized slugs by queries. Color codes (ColorId → code/name) become a data module in
  @site/content; the tipos adapter builds CODIGO_COLOR from it (identical values).
- D25. Review blocking scope: `spec-violation` blocks only when it violates DECISIONS.md, an external
  contract, or an explicit rule written in the package READMEs/architecture doc — and it must not
  re-raise an item listed in D23. Everything else is deferred to WF3 cleanup.

## Addenda (orchestrator, P2 closed at HEAD 9411da6)
- D26. P2 ACCEPTED by the orchestrator. Every P2 check passes except the JS parity band, whose
  residual is explained at chunk level in notes/p2-js-parity.md and ACCEPTED: +160 B uniform
  (single typed publicEnv accessor), ≈+550..+690 B on the 13 form-bearing routes (webpack
  splitChunks duplicating the UNCHANGED lib/cookies.ts across layout + quote-form chunks), /acabados
  −1341 B (proven benign). Versus the production reference (js/ref.tsv) 38/52 routes are within
  ±64 B and every route stays far below the 112 kB hard ceiling. Do NOT re-raise it.
  NEW JS PARITY BASELINE for P3 and later: js/26-p2-r2.tsv, tolerance ±64 B (no pre-approved
  residual: any P3 growth beyond 64 B on any route is blocking unless it is the same webpack
  chunking artifact moving by a few bytes and is explained at chunk level).
  An optional, non-blocking attempt to remove the lib/cookies.ts duplication may be made in WF3.

## Addenda (orchestrator, P3 passed at HEAD 9427a6a; E2E parity PASS)
- D27. Accepted from P3: server secrets are trimmed by @site/config/server (a whitespace-padded
  secret is a misconfiguration); trackEvent positional args without adsConversion (D26 wins over
  the plan); consent-store.ts / attribution-client.ts stay unwired but documented for the future
  design; SEO divergences from Pavivasa that reproduce today's output (no Service description,
  mixed areaServed shapes, breadcrumbs not filtering, FAQ publisher) stay (D10) and are REPORTED to
  the user as SEO improvements, not fixed.
- D27 (addendum, 2026-09-24). tracker-cookie-factory.ts is also accepted as unwired (same status
  as consent-store.ts / attribution-client.ts).
- D28. WF3 scope: (a) app/presupuesto/actions.ts switches its server env reads to
  @site/config/server (D13 allowlist; same fallback 'comercial@pavimentos-albufera.com' for
  EMAIL_DESTINO; behaviour otherwise identical) so the package docs become true; (b) @site/seo
  sitemap takes route prefixes from a caller-supplied route config like Pavivasa's
  RoutePrefixes/DEFAULT_ROUTES (output identical); (c) @site/config check-env (from Pavivasa:
  server-side, prebuild, WARN by default with a documented one-line switch to fail;
  NEXT_PUBLIC_SITE_URL missing in VERCEL_ENV=production → loud warning); (d) all deferred doc
  inaccuracies fixed; (e) rate limiter duplication stays deferred (D12) and is documented as pending;
  (f) no `server-only` dependency (no new deps) — the secrets scan in CI covers it.
- D29. Verifiers: keep the 5 app verifiers chained in apps/web build (they are this site's own
  gates, incl. the 112 kB budget). ADD Pavivasa's root scripts/verify (sitemap/links/redirects/
  JSON-LD/metadata/robots/images-CTA/page-count/live) adapted to this site WITHOUT duplicating what
  the 5 already check, with a documented known-issues baseline (e.g. /lp/* noindex landings not in
  the sitemap by design) so CI is green today and any NEW issue fails; `pnpm verify` and
  `pnpm verify:secrets` (sentinel build + scan, sentinels in one source). GitHub Actions CI as in
  Pavivasa. Lighthouse CI stays out of CI (lighthouserc kept in apps/web, documented).
- D30. Docs: root README (structure, commands, content editing via @site/content, env table, Vercel
  for the monorepo INCLUDING the separate test project step — production keeps deploying main from
  the current project until the user merges; local dev: apps/web/.env.local symlink/copy; switching
  back to main needs `npm ci`), root CLAUDE.md = the CURRENT CLAUDE.md with every rule preserved
  (design tokens, exceptions, typography, JS budget, content rules…) and paths updated + a monorepo
  section (packages in English, frontend frozen, one export per file for client-reachable modules,
  subpath/data-only imports in client adapters, literal NEXT_PUBLIC_* reads, secrets only via
  @site/config/server, content only via @site/content, gates before committing) and line 3
  "Lee primero ARCHITECTURE.md"; ARCHITECTURE.md from the template, facts-checked; package READMEs
  and apps/web/README accurate; .env.example complete. design/ untouched.
