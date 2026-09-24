# scripts/verify

Postbuild verifiers for `apps/web` — this repo's own permanent quality gate
(D29 of the monorepo migration). Ported from Pavivasa's `scripts/verify`
and adapted to this site's own routes, `trailingSlash`, noindex rules,
redirects, JSON-LD shapes and robots.txt (single `*` group) — see each
`checks/*.mjs` and `lib/*.mjs` file's own header comment for the specific
divergence and why. Not the migration's scratchpad `buildcheck` toolkit
(that one proves a build matches an *old* build byte-for-byte); this one
proves a build is *correct* on its own terms: SEO metadata, JSON-LD,
sitemap, robots, internal links, redirect status codes, images, conversion
CTAs, page count, and that no server secret leaks into the client bundle.

Zero new runtime or build dependencies. Plain Node (>=22.6) ESM, no HTML
parser library — see `lib/html.mjs`'s comment for why a small regex
tokenizer is enough for React's SSR output specifically. `>=22.6` (not
`>=20`): `checks/page-count.mjs` imports `@site/content`'s query functions
directly from their `.ts` source (same reasoning as `content:validate`/
`check-env`), so `index.mjs` needs `--experimental-strip-types` — `pnpm
verify` already passes it.

## Usage

```bash
# 1. build first (this is a POSTbuild check, it never builds anything itself)
pnpm --filter web build

# 2. run every check
pnpm verify
# or directly:
node --experimental-strip-types scripts/verify/index.mjs apps/web
```

Flags (all optional):

| Flag | Default | Meaning |
|---|---|---|
| `--next-dir <path>` | `<appDir>/.next` | Where to read HTML/manifests from. The **live server always runs from the real `appDir`**, regardless of this flag — see "Defect-planting" below. |
| `--site-url <url>` | `NEXT_PUBLIC_SITE_URL` env, else the homepage's own canonical, else `https://pavimentos-albufera.com` | Expected absolute origin for canonicals/og:url/sitemap. |
| `--port <n>` | a free port near 4173 | Port for the `next start` instance used by the HTTP-based checks. |
| `--skip-server` | off | Skip (a)'s "returns 200", (b) and (c) — the checks that need a live server. Useful for a fast local content check. |
| `--known-issues <path>` | `scripts/verify/known-issues.json` | Baseline allowlist file. |

Exit code is non-zero if any **new** (non-baselined) issue is found, or if
a baseline entry has gone **stale** (see "known-issues.json" below — unlike
Pavivasa's `index.mjs`, this one fails on stale too, per D29).

### `pnpm verify:secrets` — its own build, with sentinel secrets

```bash
pnpm verify:secrets
# == node scripts/verify/build-and-scan-secrets.mjs apps/web
```

Two steps, both with the sentinel values from `scripts/verify/sentinels.mjs`
(never real secrets) injected into the environment: (1) `pnpm --filter web
build` — its **own** build, made with those sentinel values baked into the
server-only env vars (`packages/config/src/server-env.schema.ts`, 6 names on
this site — Pavivasa's has 5, no `META_CAPI_TEST_EVENT_CODE` there); never
point this at a build made with real production secrets. (2) `node
scripts/verify/secrets-scan.mjs apps/web` — the actual scan, covering
`apps/web/.next/static` and `apps/web/.next/server/app` for both sentinel
**values** and env var **names**. See `secrets-scan.mjs`'s own header
comment for the full mechanics (identical to Pavivasa's — nothing
project-specific there beyond the schema path, which is the same in both
repos).

## What each check does

| # | Check module | What it verifies |
|---|---|---|
| a | `checks/sitemap.mjs` + `checks/live.mjs` | Every indexable prerendered page is in `sitemap.xml`; every sitemap URL is a real page; every sitemap URL returns 200. |
| b | `checks/live.mjs` | No internal `<a href>` (same-origin or relative) leads to a 404 or a redirect. |
| c | `checks/live.mjs` | Every `next.config` redirect (33 of them) returns **308** — narrower than Pavivasa's, which also resolves the destination; see the overlap table below for why. |
| d | `checks/jsonld.mjs` | Every `<script type="application/ld+json">` parses; no `AggregateRating`/`Review`; every `@id` reference resolves; required fields on the business (`#negocio`), `Service`, `FAQPage` (`publisher` + non-empty `mainEntity` — NEW vs. Pavivasa) and `BreadcrumbList` nodes — `telephone` only required when this build actually has a phone configured (see `lib/jsonld.mjs`'s header), and `BreadcrumbList` does NOT require `item`/href on non-last entries (this site's `Migas`/`buildBreadcrumbsJsonLd` deliberately keeps a hrefless intermediate crumb — relaxed vs. Pavivasa). |
| e | `checks/metadata.mjs` | Exactly one `<h1>`; non-empty `<title>`/description, unique across indexable pages; absolute self canonical (trailing slash, `trailingSlash: true`); `og:url` present (see known-issues.json — this one's baselined site-wide today). |
| f | `checks/robots.mjs` | `robots.txt` exists, references the sitemap, and doesn't disallow GPTBot/OAI-SearchBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot on any sitemap path — checked with RFC 9309 longest-match semantics. Pavivasa's ALSO demands a named `User-agent:` group per AI crawler; this site's `robots.txt` is one `User-agent: *` group with `Disallow: /author/` by design (DECISIONS.md D10 — `packages/seo/src/robots.ts`), so that half is not ported: nothing disallows the AI crawlers, so the check passes. |
| g | `checks/images-cta.mjs` | Every RENDERED `<img>` has an `alt` attribute (empty `alt=""` is informational, not a failure) and either `width`+`height` or a `fill` container. Different layer than `verificar-imagenes.mjs` — see the overlap table. |
| h | `checks/images-cta.mjs` | At least one `tel:` link and at least one `wa.me` link on every page — conditional on whether THIS build has contact data configured at all (see below and the file's own comment). |
| i | `secrets-scan.mjs` | No server secret names/values in `.next/static` or `.next/server/app` — run separately, see above. |
| j | `checks/page-count.mjs` | The number of indexable prerendered pages is at least what `@site/content` should produce (static routes + services + finishes + projects + service areas + articles, minus documented noindex routes) and never zero. |

## `<DatoPendiente>` and the CTA/JSON-LD checks

This site's phone and WhatsApp number are pending client data
(`CLAUDE.md`'s `<DatoPendiente>`, `packages/content/src/data/business.ts`'s
`phonePlaceholder`). Without `NEXT_PUBLIC_TELEFONO`/`NEXT_PUBLIC_WHATSAPP`
set at build time, **every** `tel:`/`wa.me` link on **every** page falls
back to a non-CTA href (`apps/web/src/lib/config.ts`), and the business
JSON-LD omits `telephone` entirely — a real, whole-build state, not a
per-page bug, already gated for `VERCEL_ENV=production` by
`apps/web/scripts/verificar-landings.mjs`. `index.mjs` detects this itself
instead of reading `process.env` (a plain `node` process never sees
`.env.local`'s values the way `next build` does) or baselining it in
`known-issues.json` (which would either fail-as-new or go stale depending
on which of the two builds — local, with `apps/web/.env.local`, or CI's
clean clone, without it — last ran):

- **`phoneConfigured`**: does ANY page's raw HTML contain the phone
  RESERVE-PLACEHOLDER text (`business.ts`'s `phonePlaceholder.es`) — the
  same signal `verificar-landings.mjs` keys its own check on. Deliberately
  NOT "does some page have a `tel:` link": that reads false even when the
  env IS set, if `telefonoHref` breaks build-wide some other way (every
  link would fall back to `#`/`/presupuesto/`, same as the env being
  unset) — which would wrongly turn a real regression into an
  informational note. The placeholder text has no such blind spot: it's
  shown precisely when, and only when, `telefonoHref` is absent.
- **`whatsappConfigured`**: no equivalent placeholder text exists for
  WhatsApp (`whatsappHref` is simply omitted, nothing renders in its
  place), so this stays the coarser "does at least one page carry a real
  `wa.me` link" — which HAS the same blind spot the old phone heuristic
  did: it can't tell "WhatsApp env unset" apart from "env set but every
  `wa.me` link broke build-wide some other way". Left as a known
  limitation for lack of a comparable signal to key off.

A build-wide gap only informs (`pnpm verify` stays green in CI without
env); a page missing the link inside an otherwise-configured build still
fails.

## How pages and noindex are determined

Pages are enumerated from `prerender-manifest.json` (`lib/manifest.mjs`),
never by walking the filesystem — same reasoning as Pavivasa's version.
`lib/manifest.mjs`'s `METADATA_ROUTES` matches THIS site's actual metadata
routes (`icon.svg`, not `favicon.ico`; `opengraph-image.png` instead of
`.jpg`) — verified against a real build's `prerender-manifest.json`, not
copied from Pavivasa's list.

A page counts as noindex if its rendered HTML has `<meta name="robots"
content="...noindex...">` (this site's `next.config.ts` has no
`X-Robots-Tag` header rule at all — noindex is set entirely through
per-route `robots: { index: false }` metadata). Today that's the 4
`/lp/*/` campaign landings (`app/lp/layout.tsx`) and `/zonas/xabia/` (no
project photo yet — `app/zonas/[municipio]/page.tsx`'s `sinFoto`, a
per-item dynamic condition, unlike Pavivasa's fully-static noindex set).
Unlike Pavivasa's 3 legal pages, THIS site's `/aviso-legal/`,
`/politica-de-cookies/` and `/politica-de-privacidad/` are indexable
(`aviso-legal/page.tsx` sets `robots: { index: true }` explicitly).

**Not enforced, reported to the user instead:** `/zonas/xabia/` is
noindex yet still listed in `sitemap.xml` (`app/sitemap.ts` spreads every
service area's slug unconditionally) — a real, pre-existing gap. Neither
Pavivasa's original sitemap check nor this port asserts "no noindex page
in the sitemap", so it isn't a new failing check here; see
`checks/sitemap.mjs`'s header comment.

## Defect-planting / testing this toolkit itself

Same mechanism as Pavivasa's: `--next-dir` runs the static checks (d, e, g,
h, half of a) against a **copy** of `.next` with a defect planted in it.
The live-server checks (b, c, the other half of a) always start `next
start` from the real `appDir` — a copy's planted `<a href>`/redirect source
is still read from the copy and then probed over real HTTP.

This port was verified this way before being committed: 11 defects planted
on throwaway `.next` copies (never the real build), every one caught with
the correct check/code and cleaned up before commit —

- a second `<h1>` → `metadata:h1-count`
- a broken internal link → `internal-links:broken-or-redirecting`
- an injected `AggregateRating` JSON-LD node → `jsonld:forbidden-type`
- a removed canonical `<link>` → `metadata:missing-canonical`
- an indexable page removed from `sitemap.xml` → `sitemap:missing-from-sitemap` (+ `sitemap:not-a-real-page` for the still-listed-but-now-foreign URL)
- a server secret's NAME leaked into a static JS chunk → `secrets:name-leak`
- a server secret's real sentinel VALUE leaked into a static JS chunk → `secrets:value-leak`
- the same VALUE leaked into a rendered HTML file → `secrets:rendered-value-leak`
- `.next/static` deleted entirely → `secrets:missing-surface`
- every scannable file removed from `.next/server/app` (directory kept) → `secrets:empty-surface`
- a stale `known-issues.json` entry (planted for a route that never
  existed) → reported under "stale baseline entries" AND fails the run
  (exit 1), both in a full `index.mjs` run and (for a live-only code) NOT
  falsely in a `--skip-server` run of the same known-issues file — see
  `lib/reporter.mjs`'s `excludeCodes`.

A 12th check proves `phoneConfigured`'s own fix (see "`<DatoPendiente>`"
above): on a copy with every `tel:` href stripped from every page but the
reserve-placeholder text left untouched (so `phoneConfigured` correctly
stays `true`), `cta:missing-tel` fires on every page — the OLD "does some
page have a tel: link" heuristic would have silently read this as
"phone not configured" and downgraded the whole thing to an info note.

## `known-issues.json` — the baseline allowlist

Frontend under `apps/web/src/app/**` and `apps/web/src/components/**` is
frozen for the current migration phase (byte-identical output required).
When this toolkit finds a genuine pre-existing issue there, it goes in
`known-issues.json` with a `reason`, **not** a code fix. Any issue that
doesn't match an entry here still fails the build.

Two structural, site-wide pre-existing gaps are baselined today, one entry
per affected route (54 entries total — see the file for the full list):

- **`metadata:missing-og-url`** on all 51 pages. `app/layout.tsx`'s shared
  `openGraph` block never sets `openGraph.url` (its own comment explains
  why — title/description/image are meant to cascade, `url` was simply
  never added), so Next never emits `<meta property="og:url">` anywhere.
- **`metadata:duplicate-description`** on the 3 legal pages. They set no
  page-specific `description`, so Next falls back to the root layout's
  (the homepage's) description, producing an exact duplicate.

Both are reported to the user as SEO improvements (same policy as D10/D27's
other documented SEO divergences from Pavivasa) — not fixed here, since
public output must stay byte-identical for this migration phase.

Format (strict JSON, matching key `(check, code, route, detail)` —
`detail` optional, see the file's own `$comment`). A report run also prints
any baseline entry that **didn't** fire ("stale") — and unlike Pavivasa's
`index.mjs` (which only prints it), **this one fails the run on a stale
entry, same as `secrets-scan.mjs`** (D29 requires it): a stale entry
silently matching a future, different issue on the same key is exactly the
failure mode staleness-checking exists to catch.

## Overlap with `apps/web/scripts/verificar-*.mjs`

D29 requires NOT duplicating what those 5 verifiers (chained into `apps/web`'s
own `build` script, D3) already check. Read before assuming this list is
identical to Pavivasa's — it isn't; several of Pavivasa's checks were
narrowed or dropped here specifically because of this overlap:

| Topic | `apps/web/scripts/verificar-*.mjs` | `scripts/verify` (this port) | Resolution |
|---|---|---|---|
| Redirect destinations exist | `verificar-redirecciones.mjs`: STATIC check against `prerender-manifest.json`/`routes-manifest.json` — does every `next.config` redirect's destination correspond to a real built route? | `checks/live.mjs` (c): LIVE check — does every redirect return the right STATUS CODE (308)? | **Kept both, narrowed the new one.** Same topic (redirects), different assertion — destination existence vs. status code. Pavivasa's original ALSO re-checks the destination resolves to 200 in one hop; that half is dropped here (verificar-redirecciones.mjs already owns it) so the two don't re-verify the same fact two different ways. |
| Image `alt` / size | `verificar-imagenes.mjs`: TEXTUAL check of `packages/content/src/data/*.ts` SOURCE literals (`alt`, real pixel width via file-header reading, against 3 photography thresholds) | `checks/images-cta.mjs` (g): checks the RENDERED `<img alt>`/`width`/`height`/`fill` attributes in the built HTML | **Kept both — different layer, not a duplicate.** verificar-imagenes.mjs never looks at rendered markup, so it can't catch a component bug that drops/mismatches an attribute between data and output; this check never looks at pixel dimensions or the content source, so it can't catch a genuinely narrow photo. Together they cover "the data is right" and "the data made it to the page right". |
| CTA (`tel:`/`wa.me`) presence | `verificar-landings.mjs`: checks the phone-RESERVE-PLACEHOLDER TEXT (`96X XXX XXX`) is absent, fatal only in `VERCEL_ENV=production` | `checks/images-cta.mjs` (h): checks tel:/wa.me LINK presence — phone gated on that SAME reserve-placeholder text (build-wide), WhatsApp gated on "does at least one page carry a real wa.me link" for lack of an equivalent placeholder (see "`<DatoPendiente>`" above for why the two use different signals) | **Kept both — different signal, same underlying gap, compatible severity models.** verificar-landings.mjs catches the VISIBLE placeholder text; this check catches the missing LINK (a page could plausibly have a working link with no placeholder text visible, or vice versa in a future redesign). Both stay silent (informational only) on a whole-build "no contact data configured" state and only fail on a genuine anomaly, matching CLAUDE.md's own severity policy for this specific gap. |
| JS budget (112 kB brotli ceiling) | `verificar-presupuesto.mjs` | *(not ported)* | Pavivasa's `scripts/verify` has no JS-budget check at all — nothing to overlap with. Not in scope here either. |
| LCP visible (`.aparece` hiding the LCP candidate) | `verificar-lcp-visible.mjs` | *(not ported)* | Same — Pavivasa's `scripts/verify` has no equivalent check. |
| Landing/contact-placeholder gate | `verificar-landings.mjs` | *(see CTA row above)* | — |

Everything else in the table above ((a) sitemap, (d) JSON-LD, (e) metadata
uniqueness/canonical/h1, (f) robots AI-crawler allow, (i) secrets, (j) page
count) has no equivalent in `apps/web/scripts/verificar-*.mjs` at all —
ported without narrowing.
