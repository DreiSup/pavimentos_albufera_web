---
titulo: Arquitectura — Pavimentos Albufera
empresa: Pavimentos Albufera
dominio: pavimentos-albufera.com
repo: https://github.com/DreiSup/pavimentos_albufera_web
rama: monorepo-migration
stack: "Next.js 15 (App Router) + React 19 + Tailwind 3 + TypeScript + pnpm + Turborepo + Zod"
actualizado: 2026-09-24
estado: "P1 (pnpm+turbo), P2 (@site/content, @site/config, adaptadores) y P3 (@site/seo, @site/tracking) cerradas y verificadas (paridad HTML/JS con la referencia, ledger de hechos, E2E). WF3 (D28-D30: gates permanentes, docs) aplicado. apps/web/src/app/** y src/components/** siguen congelados. Rama local, no subida a origin."
fuente_de_verdad: "el código; este documento lo resume"
---

# Arquitectura — Pavimentos Albufera

> Para una IA: qué leer primero, reglas que no se rompen, dónde está cada cosa.

- **El código manda.** Si este documento, un README o `arquitectura-plantilla-monorepo.md` (fuera de este repo) dicen algo distinto de lo que hace el código, el código gana — la discrepancia se documenta, no se "corrige" en silencio.
- **`apps/web/src/app/**` y `apps/web/src/components/**` están congelados**: salida pública byte-idéntica a la de antes de migrar a monorepo. Solo puede tocarse el allowlist de §16 (delegar lógica sin cambiar comportamiento); cualquier otro cambio espera al rediseño.
- **Contenido solo desde `@site/content`**, vía `packages/content/src/queries/*.ts` o, desde `apps/web`, vía los adaptadores legacy de `src/lib/`/`src/content/` — nunca `data/*.ts` directo. Nunca se inventa texto/dato/cifra: lo no confirmado es `<DatoPendiente>` o un campo `_pending`.
- **Los subpaths server (`@site/config/server`, `@site/tracking/server`) nunca se importan desde un módulo alcanzable por `'use client'`.** Los secretos de servidor solo salen de ahí.
- **Un export de valor por fichero para todo módulo alcanzable desde cliente.** Excepción conocida y sin arreglar: `@site/config/site.ts` (4 exports de valor), alcanzable vía `lib/config.ts` — ver §4.
- **No renombrar contratos externos**: cookies `pa_consent`/`pa_attr`/`pa_ref`, nombres de eventos GA4/Meta, nombres de variables de entorno, `trailingSlash: true`, los 33 redirects (308), los fragmentos `@id` `#negocio`/`#servicio` del JSON-LD. Ver §10.
- **`NEXT_PUBLIC_*` se lee solo como literal exacto** (`process.env.NEXT_PUBLIC_X`, nunca `process.env[nombre]`) — es la única forma que Next sustituye en build para el bundle cliente.
- Antes de commitear: `pnpm content:validate && pnpm lint && pnpm typecheck && pnpm build && pnpm verify` (+ `pnpm verify:secrets` si se tocó tracking/env). Ver §11.

---

## 1. Resumen

Pavimentos Albufera es una empresa de pavimentos de hormigón decorativo (impreso, pulido, lavado, fratasado, desactivado, microcemento) en la comarca de la Albufera (Valencia). El repo es su web de marketing/captación: 6 servicios, 9 obras, 16 acabados, 8 zonas de servicio, 3 artículos, formulario de presupuesto con entrega por Resend/Telegram y Meta CAPI. Next.js 15 (App Router), 100% estático salvo una ruta dinámica (`/api/atribucion/`) y el Server Action del formulario. Migración de app Next.js plana (WordPress → Next.js 15 fue la migración anterior) a monorepo pnpm + Turborepo: la app se movió a `apps/web`, la lógica reutilizable se extrajo a 4 paquetes `@site/*` (`content`, `config`, `seo`, `tracking`) consumidos por `apps/web` a través de adaptadores legacy en español que se borran cuando el rediseño consuma `@site/*` directo. Las fases P1-P3 de esta migración están cerradas y verificadas (paridad de HTML/JS frente a la referencia pre-monorepo, E2E); WF3 añadió gates permanentes (`scripts/verify`, CI) y esta documentación. Rama local, nunca subida a `origin`.

### 1.1 Ramas / worktrees activos

De 50 refs locales+remotas comparadas contra `monorepo-migration` (`git rev-list --count`), 47 están totalmente contenidas (0 commits propios). Las 3 excepciones:

| Rama/worktree | Commit | Commits que `monorepo-migration` no tiene | Qué es | ¿Toca zona congelada? |
|---|---|---|---|---|
| `trabajo/auditoria-medicion-y-servicios` (local, no en `origin`) | `09af74a` | 1 | Trabajo real sobre una base ~136 commits detrás de `main`, nunca fusionado ni descartado. Toca `app/layout.tsx`, `app/page.tsx`, `app/sitemap.ts`, `app/proyectos/[slug]/`, `app/zonas/[municipio]/`, `app/empresa/`, `app/blog/` y **dos ficheros que no existen hoy**: `app/zonas/page.tsx` (índice de zonas, 146 líneas) y `app/zonas/publicadas.ts` | **Sí** — 20 ficheros, +389/−38, en la ruta pre-monorepo equivalente a `apps/web/src/app/**`/`src/components/**` |
| `origin/claude/frontend-web-changes-9vgg92` | `a2c0bf0` | 1 | Solo añade `design/encargo-hero-carrusel.md` | No |
| `origin/claude/pavivasa-base-structure-yy7wwv` | `19f02b3` | 1 | Solo añade un doc de referencia de la plantilla Pavivasa | No |

`.claude/worktrees/ref-cf2e0c5` es la referencia de solo lectura (checkout detached de `fix/tracking-consent@cf2e0c5`, con su propio `node_modules`): el "antes" de toda comparación de la migración. Nunca se escribe ahí. `origin/HEAD` apunta simbólicamente a una rama de handoff, no a `main` — artefacto de cómo se creó el remoto, no una señal de que esa sea la rama de producción (producción = `main` en Vercel, sin cambios).

## 2. Mapa del repositorio

```
.
├── package.json, pnpm-workspace.yaml, pnpm-lock.yaml, turbo.json,
│   tsconfig.base.json, .npmrc, .gitignore     # raíz del monorepo
├── .github/workflows/ci.yml                    # único workflow de CI
├── CLAUDE.md                                    # reglas del proyecto, remite aquí primero
├── README.md                                    # arranque, comandos, adaptadores legacy, Vercel
├── design/                                      # spec de diseño/contenido original, sin tocar
├── scripts/verify/                              # gate raíz nuevo (WF3): index.mjs, checks/*, lib/*,
│                                                 #   build-and-scan-secrets.mjs, known-issues.json
├── apps/
│   └── web/                                     # única app Next.js
│       ├── package.json, next.config.ts, tsconfig.json, .eslintrc.json,
│       │   tailwind.config.ts, postcss.config.mjs, lighthouserc.json, .env.example
│       ├── scripts/                             # 5 verificadores postbuild (verificar-*.mjs)
│       ├── public/                               # estáticos servidos
│       └── src/
│           ├── app/                              # rutas App Router — congelado, §6
│           ├── components/                       # componentes — congelado, §6.4
│           ├── content/                          # adaptadores legacy (faq, landings, legal, modelos, servicios)
│           └── lib/                               # adaptadores legacy (config, cookies, datos, eventos, limite,
│                                                    #   meta-capi, schema, tipos)
└── packages/
    ├── config/    # @site/config  — env público/servidor, config de sitio
    ├── content/   # @site/content — modelo de contenido del negocio
    ├── seo/       # @site/seo     — JSON-LD, sitemap, robots, canonical
    └── tracking/  # @site/tracking — eventos, cookies, consentimiento, CAPI
```

Recuentos (`git ls-files <dir> | wc -l`, solo `src/`): `content/src/`: `data/` 13, `queries/` 10, `schemas/` 27, `legal/` 6. `config/src/`: 6 ficheros. `seo/src/`: `json-ld/` (4) + 5 ficheros sueltos. `tracking/src/`: 11 ficheros planos, sin subcarpetas.

## 3. Stack y versiones

| Pieza | Versión exacta | Fichero:línea |
|---|---|---|
| Gestor de paquetes | pnpm `9.15.9` (pin exacto) | `package.json:5` |
| Node (`engines`) | `>=22.6` | `package.json:7` |
| Node (CI) | `22` | `.github/workflows/ci.yml` (`setup-node@v7`) |
| Node (pin de fichero) | No existe `.nvmrc`/`.node-version` en el repo | — (ausencia verificada) |
| `apps/web` `engines` | No declarado (solo el raíz) | — (`grep -n engines apps/web/package.json` sin resultado) |
| `vercel.json` | No existe — config de Vercel solo en el dashboard | — |
| Framework | Next.js `15.5.22` | `apps/web/package.json` |
| UI | React `19.0.0` / react-dom `19.0.0` | `apps/web/package.json` |
| Lenguaje | TypeScript `5.9.3` (mismo pin en apps/web + 4 paquetes) | cada `package.json` |
| Validación | Zod `3.25.76` (apps/web, `@site/config`, `@site/content`; `@site/seo`/`@site/tracking` no lo usan) | cada `package.json` |
| Estilos | Tailwind `3.4.19`, PostCSS `8.5.25`, autoprefixer `10.5.4` | `apps/web/package.json` |
| Monorepo | Turborepo `2.11.3` — única dependencia nueva de la migración | `package.json:19` |
| Workspaces | `apps/*`, `packages/*` | `pnpm-workspace.yaml` |
| Otras deps directas de `apps/web` | `@vercel/speed-insights` `2.0.0`, `class-variance-authority` `0.7.1`, `@lhci/cli` `0.15.1`, `eslint` `9.39.5`, `eslint-config-next` `15.5.22` | `apps/web/package.json` |
| `tsconfig.base.json` | `target: ES2017`, `strict: true`, `module: esnext`, `moduleResolution: bundler`, `erasableSyntaxOnly: true` | `tsconfig.base.json` |
| Scripts de paquete TS sin build | `node --experimental-strip-types scripts/check-env.ts` / `scripts/validate.ts`, requiere Node ≥ 22.6 (el mínimo de `engines`, documentado explícitamente) | `packages/config/package.json`, `packages/content/package.json` |

CI fija además `NEXT_TELEMETRY_DISABLED=1`, `COREPACK_ENABLE_DOWNLOAD_PROMPT=0`, `NEXT_PUBLIC_SITE_URL=https://pavimentos-albufera.com` — mismos valores que el comando de build documentado. `pnpm/action-setup@v6` no recibe `version:` a propósito: lee el pin de `packageManager`; pasar ambos y que difieran es error duro.

## 4. Capas y reglas de dependencia

```
apps/web/src/app/**, src/components/**   (congelado; server + 'use client')
        │  solo el allowlist de §16 (app/presupuesto/actions.ts, app/api/atribucion/route.ts,
        │  app/layout.tsx, app/sitemap.ts, app/robots.ts) importa @site/* directamente;
        │  el resto pasa por src/lib/* y src/content/*
apps/web/src/lib/*, src/content/*    (adaptadores legacy, API española heredada)
        │
@site/content   @site/config   @site/seo   @site/tracking     (paquetes compartidos)
        │               │                        │
        └── @site/tracking/server → @site/config/server (único cruce entre paquetes)
```

Verificado con grep sobre el código real, no solo declarado:

- **`@site/*` nunca importa React ni Next**: 0 resultados en los 4 paquetes.
- **`export *`**: 0 coincidencias ancladas a inicio de línea en todo el repo.
- **`sideEffects` declarado en los 5 `package.json`**: `false` en `@site/config`, `@site/content`, `@site/seo`, `@site/tracking`; `["**/*.css"]` en `apps/web` (sí importa hojas de estilo por su efecto).
- **Subpaths server-only, aislados**: `@site/config/server` solo lo importan `packages/config/src/server.ts` (donde se define), `apps/web/src/app/presupuesto/actions.ts` (Server Action) y `packages/tracking/src/server.ts`. `@site/tracking/server` solo lo importan `apps/web/src/lib/meta-capi.ts` y `apps/web/src/app/api/atribucion/route.ts`. `process.env.*` en el `src/` de los 3 paquetes sin secretos: 0 resultados — todo pasa por `@site/config`.
- **Grafo real de módulos alcanzables desde `'use client'`** (verificado importando explícitamente cada uno de los 10 ficheros `'use client'`, `@/` y relativos, 2 niveles): solo `@/lib/config`, `@/lib/cookies`, `@/lib/eventos`, `@/app/presupuesto/actions`, átomos locales de `ui/` y `components/datos/DatoPendiente.tsx` (importado directamente por `FormularioPresupuesto.tsx`; solo trae tipos de React, sin fuga de `@site/*`). **`lib/tipos.ts` no aparece en ese grafo** — corrige una nota previa de esta migración que lo daba como alcanzable "por otra vía" sin confirmarlo; con el código de hoy, ningún fichero `'use client'` lo importa directa ni transitivamente.
  - `lib/config.ts` → `@site/config/env` (`publicEnv`), `@site/config/site` (`defaultLocale`, `supportedLocales`, `publishedLocales`, `site` — 4 exports de valor) y `@site/content/business-data` (`business`).
  - `lib/cookies.ts` → `@site/tracking/{read-cookie,write-cookie,tracker-cookies,reference-code}` (1 export de valor cada uno).
  - `lib/eventos.ts` → `@site/tracking/events` (`trackEvent`).
  - **Discrepancia real, sin corregir**: `@site/config/site.ts` tiene 4 exports de valor en un fichero y es alcanzable desde `'use client'` vía `lib/config.ts` — viola literalmente la regla "un export por fichero" de más arriba. Es el único caso; todas las demás hojas de datos client-reachable cumplen 1 export de valor por fichero. `packages/tracking/src/server.ts` (7 exports de valor + 7 de tipo) NO viola la regla porque es server-only, no alcanzable desde `'use client'`.
- **Ningún fichero de `apps/web/src/components/**` importa `@site/*` directamente** — todos pasan por `src/lib/*`/`src/content/*`. Los únicos importadores directos de `@site/*` en `apps/web/src` son los 12 adaptadores de `lib/`/`content/` y los 5 ficheros del allowlist de `app/` (§16). `lib/limite.ts` es el único fichero de `lib/` que NO envuelve ningún paquete `@site/*` (rate-limiter en memoria, sin `import` propio — pendiente D12, §15).
- **Consentimiento/atribución sin cablear (aceptado, no defecto)**: `@site/tracking/consent-store`, `/attribution-client` y `/tracker-cookie-factory` tienen 0 importadores en todo el repo — documentados a propósito para el diseño futuro, los tres con el mismo estatus aceptado (`docs/migration/DECISIONS.md` D27, addendum del 2026-09-24).

## 5. Paquetes

### `@site/config`
- **API**: `.` (barrel) → `publicEnv`, `site`, `defaultLocale`, `supportedLocales`, `publishedLocales`; `./env` → `publicEnv` (8 `NEXT_PUBLIC_*`, limpieza por campo); `./site` → `site` (`{ url }`, cae a `'https://pavimentos-albufera.com'` con `??`, **sin recortar la barra final**, a diferencia de Pavivasa); `./server` (server-only) → `serverEnv` (6 secretos, todos recortados con `clean()`).
- Deps: `zod`. Sin deps a otros `@site/*`.
- Script propio: `check-env` (`scripts/check-env.ts`, prebuild de `apps/web`).

### `@site/content`
- **API** (`.` único + 4 subpaths de datos-solo `business-data`/`color-data`/`service-catalog-data`/`models-data`): el barrel reexporta explícitamente decenas de `get*`/`getX` por entidad y sus tipos — nunca `export * from`. Reexports nombrados, no barrel salvaje.
- `src/legal/` (6 ficheros): textos legales de origen, movidos tal cual, no importados por código.
- Deps: `zod`. Script: `content:validate` (Zod + integridad referencial).

### `@site/seo`
- **API** (`.` único, sin subpaths): `businessJsonLdId`, `buildLocalBusinessJsonLd`, `buildServiceJsonLd`, `buildFaqJsonLd`, `buildBreadcrumbsJsonLd`, `buildSitemapEntries`, `DEFAULT_ROUTES`/tipo `RoutePrefixes` (rutas configurables, añadido en WF3), `buildRobots`, `buildCanonical`, `buildAlternates`.
- Sin `dependencies` declaradas (lógica pura). Adaptado de Pavivasa pero NO un port byte a byte: divergencias documentadas módulo a módulo (logo, forma de `description`/`areaServed`, `publisher` de FAQ, breadcrumbs sin filtrar, robots con un solo grupo `*`) — reproducen el output actual, no se arreglan (ver §14).

### `@site/tracking`
- **API**: `.` (barrel, nunca importado en el repo — confirmado, todo import lleva subpath) + **10 subpaths**: `./server`, `./events`, `./read-cookie`, `./write-cookie`, `./tracker-cookies`, `./tracker-cookie-factory`, `./reference-code`, `./consent-store`, `./consent-mode`, `./attribution-client`.
- `./server` (server-only, importa `@site/config/server`): 7 exports de valor (`hash`, `normalize`, `sendMetaConversionEvent`, `cleanAttributionValue`, `validateAttributionBundle`, `resolveReferenceCode`, `buildAttributionCookieResponse`).
- Importadores reales por subpath: `events` 1, `read-cookie` 1, `write-cookie` 1, `tracker-cookies` 1, `tracker-cookie-factory` 0, `reference-code` 1, `consent-store` 0, `consent-mode` 1, `attribution-client` 0, `server` 2.
- Deps: `@site/config` (workspace, para `./server`).

## 6. `apps/web`

### 6.1 Rutas

20 ficheros `page.tsx` bajo `apps/web/src/app/`: 15 estáticas + 5 patrones dinámicos (`[param]`) que expanden a 36 instancias. Total de rutas prerenderizadas en el último build verificado: 15 + 36 = 51 páginas reales + `/_not-found` = 52.

| Ruta | Fichero | Fuente de datos | `generateStaticParams` | Indexable | JSON-LD |
|---|---|---|---|---|---|
| `/` | `app/page.tsx` | `@/lib/datos`, `@/content/faq`, `@/content/servicios` | — | sí | `schemaFAQ(faqHome)` |
| `/acabados/` | `app/acabados/page.tsx` | `@/lib/datos` | — | sí | `<Migas>` |
| `/acabados/[modelo]/` (12) | `app/acabados/[modelo]/page.tsx` | `@/content/modelos`, `@/content/servicios`, `@/lib/datos` | sí, `dynamicParams=false` | sí | `<Migas>` |
| `/aviso-legal/` | `app/aviso-legal/page.tsx` | `@/content/legal` | — | sí | `<Migas>` |
| `/blog/` | `app/blog/page.tsx` | `@/lib/datos` | — | sí | `<Migas>` |
| `/blog/[slug]/` (3) | `app/blog/[slug]/page.tsx` | `@/lib/datos` | sí, `dynamicParams=false` | sí | `<Migas>` |
| `/empresa/` | `app/empresa/page.tsx` | contenido en línea | — | sí | `<Migas>` |
| `/hormigon-{desactivado,fratasado,impreso,lavado,pulido}/`, `/microcemento/` (6) | `app/<servicio>/page.tsx` | `@/content/servicios`, `<PaginaServicio>` | — | sí | `schemaServicio` + `schemaFAQ` + `<Migas>` |
| `/lp/[slug]/` (4) | `app/lp/[slug]/page.tsx` | `@/content/landings` | sí, `dynamicParams=false` | **no**, `robots:{index:false}` | mismo JSON-LD que la página de servicio (reutiliza `<PaginaServicio>`, incluido `<Migas>`) |
| `/politica-de-cookies/`, `/politica-de-privacidad/` | `app/politica-de-*/page.tsx` | `@/content/legal` | — | sí | `<Migas>` |
| `/presupuesto/` | `app/presupuesto/page.tsx` | `@/lib/config` + Server Action `actions.ts` | — | sí | `<Migas>` |
| `/proyectos/` | `app/proyectos/page.tsx` | `@/lib/datos` | — | sí | `<Migas>` |
| `/proyectos/[slug]/` (9) | `app/proyectos/[slug]/page.tsx` | `@/lib/datos`, `@/lib/tipos` | sí, `dynamicParams=false` | sí | `<Migas>` |
| `/zonas/[municipio]/` (8) | `app/zonas/[municipio]/page.tsx` | `@/lib/datos`, `@/content/faq` | sí, `dynamicParams=false` | sí salvo zonas sin foto (`robots:{index:false}` condicional) | `schemaFAQ(faqZona)`, `<Migas>` |

Los 5 dinámicos fijan `dynamicParams=false`: solo los params de `generateStaticParams` existen, cualquier otro valor da 404. `app/lp/layout.tsx` (único layout anidado además del raíz) existe solo para fijar `robots:{index:false,follow:true}` a nivel de grupo — no oculta `Cabecera`/`Pie`/`BarraMovil` (un layout anidado no suprime nada del padre; la landing necesita `Pie` por el aviso legal y `BarraMovil` por el CTA móvil, exigidos por Meta/AEPD al llevar píxel). El `robots` se repite intencionalmente en el `generateMetadata` de cada `/lp/[slug]/` aunque la herencia bastaría.

Un comentario del propio `app/layout.tsx` cifra en "49 rutas" (aviso legal incluido) las que sufren el bailout de `@vercel/speed-insights` (`<template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING">`, por `useSearchParams()` interno, sin arreglo posible envolviendo en `Suspense>` propio — límite de la dependencia). Esa cifra es de un comentario fechado 2026-08-31 y no se ha recontado contra las 51 rutas reales de hoy en esta redacción — no cuadra de forma verificable con ningún subconjunto evidente; queda como hecho sin reconciliar.

### 6.2 Metadata files (convención de fichero)

`app/apple-icon.png`, `app/icon.svg`, `app/opengraph-image.png` (cascada a las rutas sin `openGraph.images` propio) + `app/opengraph-image.alt.txt`. No hay `icon.tsx`/`opengraph-image.tsx` generados por código. `app/robots.ts`/`app/sitemap.ts` son Route Handlers, no metadata files de imagen — ver §8.4.

### 6.3 Layout raíz (`app/layout.tsx`)

`metadata`: `metadataBase`, `title.default`/`template`, `alternates.canonical:'/'`, `openGraph` sin `title`/`description`/`images` propios (cascada), `twitter`. `viewport.themeColor:'#E9EAE6'`. Dos scripts inline: (1) marca `data-consentimiento="pendiente"` en `<html>` antes del primer pintado si `pa_consent` no vale `aceptado`/`rechazado` — evita un CLS medido (0,156→0,000); (2) condicional a que haya algún id de etiqueta (`gaId`/`adsId`), construye el default de Consent Mode v2 y carga `gtag.js` él mismo (orden de documento: un `consent default` que llega después de que `gtag.js` vacíe la cola de `dataLayer` no sirve). JSON-LD del negocio local. Orden de montaje en `<body>`: skip-link → `Cabecera` → `main` → `Pie` → `BarraMovil` → `Consentimiento` → `EventosGlobales` → `Atribucion` → `ProfundidadScroll` → `SpeedInsights`.

### 6.4 Componentes (`apps/web/src/components/`)

34 ficheros `.tsx` en 5 carpetas, 10 `'use client'` / 24 servidor:

| Carpeta | Total | Cliente | Contenido |
|---|---|---|---|
| `contenido/` | 6 | 0 | bloques de fotos/artículos/proyectos |
| `datos/` | 4 | 0 | `DatoPendiente` (placeholder único de dato no confirmado), `FichaObra`, `TablaFichaTecnica`, `EtiquetaTecnica` |
| `layout/` | 10 | `Atribucion`, `Cabecera`, `Consentimiento`, `EventosGlobales`, `MenuMovil`, `ProfundidadScroll` (6) | montaje global (consentimiento, eventos, atribución, scroll), navegación |
| `secciones/` | 6 | `Acordeon`, `FiltrosAcabados`, `FormularioPresupuesto`, `SubmenuServicio` (4) | `PaginaServicio` (plantilla de las 6 páginas de servicio + 4 landings, emite su propio JSON-LD, incluido `<Migas>`), `PlantillaLegal` |
| `ui/` | 8 | 0 | átomos |

### 6.5 Adaptadores legacy

Todos con la cabecera `legacy adapter, delete when a new design consumes @site/* directly`; conservan los nombres/formas/valores del frontend de siempre.

| Fichero | Envuelve | Por qué |
|---|---|---|
| `lib/config.ts` | `@site/config/env`, `@site/config/site`, `@site/content/business-data` | client-reachable: importa solo hojas de datos, nunca `queries/`, para no arrastrar un resolver genérico al bundle (~+320 B/ruta medido) |
| `lib/tipos.ts` | `@site/content/{color,service-catalog,models}-data` | mismo motivo (histórico) — ver §4 sobre su alcanzabilidad real hoy |
| `lib/datos.ts` | `./tipos` + `@site/content` (import multilínea) | NO client-reachable, puede depender de todo `@site/content` |
| `lib/cookies.ts` | `@site/tracking/{read-cookie,write-cookie,tracker-cookies,reference-code}` | nombres de cookie y alfabeto del código de referencia se quedan aquí |
| `lib/eventos.ts` | `@site/tracking/events` | vocabulario del negocio se queda aquí |
| `lib/meta-capi.ts` | `@site/tracking/server`, `@site/config/env` | server-only, mismos nombres de campo en español |
| `lib/schema.tsx` | `@site/seo` | `@site/seo` no tiene React; `<JsonLd>` se queda aquí; reproduce el output actual, no el de Pavivasa |
| `content/faq.ts`, `content/landings.ts`, `content/legal.tsx`, `content/modelos.ts`, `content/servicios.tsx` | `@site/content` (`getQuestionsByRefs`, `getLandingService*`, `getLegalFacts`, `getModels`, `getServices`) | conservan claves/JSX en español; `legal.tsx` mantiene JSX mixto porque el paquete no modela JSX |

`lib/limite.ts` NO es adaptador — rate-limiter en memoria, sin dependencias del monorepo; duplicado con la copia privada de `actions.ts` (pendiente, §15).

### 6.6 `next.config.ts`

| Bloque | Qué hace |
|---|---|
| `outputFileTracingRoot` | Raíz del repo (monorepo), no `apps/web` |
| `transpilePackages` | `['@site/content','@site/config','@site/seo','@site/tracking']` |
| `trailingSlash: true` | Fijo |
| `images.formats` | `['image/avif','image/webp']` |
| `images.deviceSizes` | `[640,750,828,1080,1200,1536,1920,2048]` — sin 3840, con 1536 añadido (−82 kB/−25% medido en el hero de `/proyectos/[slug]/`) |
| `images.qualities` | `[60,75]` — sin esta lista, 3.200 transformaciones facturables/foto; con ella, 64 |
| `images.minimumCacheTTL` | `2678400` (31 días); contrapartida: fotos reemplazadas deben cambiar de nombre |
| `experimental.serverActions.bodySizeLimit` | `'4300kb'` — por encima de los 4 MB reales del formulario, por debajo del corte de plataforma de Vercel (4,5 MB) |
| `redirects()` | 33 entradas `source:` (verificado con `grep -c`), todas `permanent: true` (Next emite **308**, no 301) |

Sin `headers()`, `rewrites()` ni flags `experimental` adicionales.

## 7. Modelo de contenido

Fuente única: `packages/content/src/data/*.ts`, leída vía `queries/*.ts` o 4 subpaths de datos-solo. Contenido ya en módulos `.ts` tipados, nunca JSON.

`Localized<T> = { es: T; en?: T; fr?: T; de?: T }` (`es` obligatorio). `pickLocalized`/`pickLocalizedList` nunca caen a español si falta la traducción: un campo ausente da `undefined`, o el ítem se cae de una lista. Hoy solo `es` está publicado.

**El README del paquete afirma que "todo slug/path de URL" es `Localized` — no es cierto de forma universal**, verificado esquema por esquema: `Project.slug`, `ServiceArea.slug`, `Article.slug`, `Service.path` **sí** son `Localized<string>`; **`Finish.slug` y `Model.id` son planos** (`string`/unión cerrada) — son también claves de búsqueda internas (`getFinish(slug)`, `getModel(id)`), el mismo carve-out que `ServiceId`/`ColorId`/`ImageKind`. Discrepancia real entre el README del paquete y el código, a reportar, no a repetir como regla universal.

Campos planos confirmados: identificadores/uniones cerradas (`ServiceId` 6, `ModelId` 8, `ColorId` 7, `ImageKind` 4), referencias cruzadas a proyecto (`Finish.projects`/`ServiceArea.projects` son `ProjectId[]` = el slug `es` estable, sin resolver al locale que llama), nombres propios (`Business.name`/`town`/`province`, `Project.town`, `LegalFacts.companyName`), números/códigos internos, `CookieFact.name`.

### Entidades (recuentos verificados)

| Entidad | Cifra |
|---|---|
| `Service` | 6 |
| `Finish` (acabado) | 16 |
| `Model` | 8 |
| `ServiceArea` (zona) | 8 |
| `Project` (obra) | 9 |
| `Article` | 3 |
| `Question` (pool FAQ) | 10 |
| Color de catálogo | 7 |
| Landing `/lp/` | 4 (`impreso`, `pulido`, `lavado`, `microcemento`; `fratasado`/`desactivado` deliberadamente ausentes) |

Estos recuentos son del contenido en `@site/content`, no de rutas realmente construidas (una `Finish` sin foto `sample` no se "publica" — `getPublishedFinishes` filtra). Metadatos editoriales preservados, nunca expuestos por `queries/`: `_note`/`_pending` en `FinishRecord`/`ServiceAreaRecord`/`ProjectRecord`, y `unconfirmedServiceAreaTowns` — nunca mezclado con `serviceAreas`.

### Cómo añadir cada tipo (validado por `pnpm content:validate`, `packages/content/scripts/validate.ts`, salvo donde se marca [convención])

- **Servicio**: editar la unión `ServiceId` [convención] + entradas en `services.ts`/`service-catalog.ts` [validado, mismo `id`/longitud]. Exige además crear una carpeta de ruta nueva bajo `apps/web/src/app/**` — **toca la zona congelada**.
- **Modelo**: unión `ModelId` [convención] + `models.ts` [validado por Zod, sin check de integridad cruzada].
- **Color**: unión `ColorId` + `colors.ts` [validado en los dos sentidos — el único caso con doble check de las 9 entidades].
- **Acabado**: `finishes.ts`; `service`/`model`/`projects` referenciales [validados]; "publicado" solo si tiene `sample` [convención].
- **Proyecto**: `projects.ts`; `service` referencial y `slug` único [validados]; `town` sin match en `ServiceArea` solo **avisa** [no bloquea].
- **Zona**: `service-areas.ts`; `projects`/`services`/`slug` [validados]; la regla "solo donde hay obra con foto" (anti-doorway) es [convención], no comprobada.
- **Artículo**: `articles.ts`; `service`/`slug` [validados]; `body`/`excerpt`/`date` se dejan `undefined` mientras no haya texto real, nunca un `pending` sintético.
- **FAQ**: entrada en `faq.ts`; sus 3 listas de referencia (`faqRefs` de servicio, `homeFaqRefs`, `serviceAreaFaqRefs`) [validadas las tres].
- **Landing `/lp/`**: añadir el `ServiceId` a `CAMPAIGN_SERVICE_IDS` [validado].

`pnpm content:validate` corre encadenado en `turbo run build` (`dependsOn`), no dentro de `pnpm --filter web build` a secas.

## 8. Flujos

### 8.1 Build / render

1. `pnpm build` → `turbo run build`, que fuerza `content:validate` antes de construir cualquier paquete que dependa de `@site/content`.
2. Dentro de `apps/web`: `prebuild` = `pnpm --filter @site/config run check-env` (hook `pre<script>` de pnpm, corre tanto invocado directo como bajo turbo); `build` = `next build && node scripts/verificar-{redirecciones,imagenes,presupuesto,lcp-visible,landings}.mjs` — los 5 verificadores corren **dentro** del `build`, no como `postbuild` separado (evita que corran dos veces bajo turbo). Cualquiera que falle, falla el build.
3. Comando de build de referencia: `env -i PATH="$PATH" HOME="$HOME" NEXT_TELEMETRY_DISABLED=1 COREPACK_ENABLE_DOWNLOAD_PROMPT=0 NEXT_PUBLIC_SITE_URL=https://pavimentos-albufera.com pnpm --filter web build`.
4. Los 5 dinámicos fijan `dynamicParams=false` (ver §6.1). Única ruta verdaderamente dinámica del sitio: `app/api/atribucion/route.ts` (`export const dynamic='force-dynamic'`) — todo lo demás es estático.

### 8.2 Lead de presupuesto → Resend / Telegram / Meta CAPI

Server Action `enviarPresupuesto` (`app/presupuesto/actions.ts`), orden real:

1. **Honeypot** (`empresa_web` relleno) → `estado:'inicial'` sin registrar nada. (Corrección anterior a esta migración: la versión antigua devolvía `'enviado'` y el cliente disparaba eventos de conversión falsos desde ese estado.)
2. Captura de valores crudos para repoblar el formulario en cualquier error.
3. Validación Zod. Si falla, `estado:'error'` con mensajes por campo.
4. **Límite 3/hora por IP** en memoria, evaluado **después** del Zod (no bloquear un typo) y **antes** de convertir la foto a base64 (no pagar esa conversión en un envío que se va a rechazar).
5. Adjunto opcional, máx. 4 MB (el límite real de plataforma en Vercel es 4,5 MB por función).
6. Lee de cookie: `pa_ref`, `pa_consent`, `pa_attr`.
7. **Telegram y Meta CAPI se registran con `after()` antes de intentar el email**, y corren tras responder al cliente — así ningún `return` posterior de la rama de email los cancela (el `catch` de Resend antiguo hacía `return` y cancelaba también Telegram/CAPI). Telegram solo si están los dos secretos; **la CAPI solo si `pa_consent==='aceptado'`** — único filtro de consentimiento del lado servidor de este sub-flujo (email y Telegram salen siempre: "ejecución del servicio pedido, no publicidad").
8. Email (Resend), sí se espera en línea (`await`) porque su resultado decide la pantalla. Sin `RESEND_API_KEY`, esta sección se salta y el envío se da por `'enviado'` igualmente.
9. Si Resend falla, `estado:'error'` — la CAPI y Telegram ya se habrán disparado igualmente vía `after()` (consecuencia asumida, documentada en el propio código).
10. Éxito: `estado:'enviado'`.

`serverEnv` se importa de `@site/config/server` desde WF3 (antes eran lecturas directas de `process.env` — el diff entre la referencia y hoy en este fichero son 5 líneas: 1 import añadido + 4 líneas de `process.env.*` reescritas a `serverEnv.*`, en dos puntos del fichero).

### 8.3 Consentimiento / atribución — gates cliente y servidor, en orden

**Bootstrap (servidor→cliente, antes de hidratar)**: script #1 marca `data-consentimiento="pendiente"` si la cookie no decide; script #2 (solo si hay algún id de etiqueta) monta el default de Consent Mode v2 y carga `gtag.js` él mismo (ver §6.3). Tras hidratar, `Consentimiento.tsx` lee `pa_consent`, decide banner/estado; al decidir: escribe la cookie (180 días), manda `gtag('consent','update',…)`, monta el snippet de Meta si hay Pixel y se aceptó (con `fbevents.js` diferido a `requestIdleCallback`, el stub `fbq` instalado ya). Al **retirar** un consentimiento ya concedido: `consent update` a `denied` a mano + `fbq('consent','revoke')` + borrado de cookies de rastreo + `location.reload()` (lo ya cargado no se "desinyecta").

**Gate servidor — `app/api/atribucion/route.ts`** (única ruta dinámica): único escritor de `pa_attr`/`pa_ref`/`_fbc` (un `Set-Cookie` de primera parte no sufre el recorte de ITP de Safari que sufría `document.cookie`). **La puerta del consentimiento está aquí, no en el cliente**: lee `pa_consent` de la propia petición y solo si vale `aceptado` deja pasar `pa_attr`/`_fbc`. `pa_ref` (código de referencia WhatsApp↔web) **siempre** se fija, con o sin consentimiento — no es publicidad. Ninguna cookie es `HttpOnly` a propósito (se leen desde JS/`fbevents.js`).

**Gate cliente — `Atribucion.tsx`**: si no hay `pa_ref`, genera una en memoria de inmediato (no espera al servidor). Si no hay `pa_attr`, captura `gclid`/`utm_*`/`fbclid` en memoria. `enviar()` decide el `POST /api/atribucion/`: solo incluye el bloque de atribución si `pa_consent==='aceptado'` **y** hay algo capturado — el gate real está partido entre este `if` de cliente (qué se incluye) y el `if` de servidor (qué hace con lo que llega); un cuerpo falsificado sin la cookie real no cuela. Reintento único si el "Aceptar" llegó con la petición en vuelo. Parchea enlaces `wa.me` siempre desde `data-mensaje-base`, nunca acumulado.

**Meta CAPI**: `sendMetaConversionEvent` no hace nada si falta `pixelId` o el token; el `pixelId` no es secreto (viaja como parámetro, no se lee dentro de `@site/config/server`). Sin segunda comprobación de consentimiento dentro de `@site/tracking/server` — el único filtro es el `if` del paso 7 de §8.2.

**Piezas exportadas sin importador en `apps/web`** (documentadas para diseño futuro, no defecto): `consent-store.ts`, `attribution-client.ts`, `tracker-cookie-factory.ts` (borrado de cookies de rastreo al retirar el consentimiento, arriba — `apps/web/src/lib/cookies.ts` llama a `deleteTrackerCookies` directo en vez de a esta factory).

### 8.4 SEO (sitemap / robots / JSON-LD)

`app/sitemap.ts` compone `rutasEstaticas` a mano (sin las 4 landings `/lp/`, exclusión deliberada: son `noindex`, y un sitemap que lista lo que pide no indexar se contradice) y llama a `buildSitemapEntries` (`@site/seo`). Los 4 prefijos de ruta dinámica (`/acabados/`, `/proyectos/`, `/zonas/`, `/blog/`) vienen de `RoutePrefixes`/`DEFAULT_ROUTES`, mecanismo añadido en WF3 al estilo Pavivasa — pero **`app/sitemap.ts` no pasa `routes` explícito**, depende del default del paquete (hecho verificable; si la intención era que el llamador pasara su propia config en vez de apoyarse en el default, falta ese cambio de una línea — ver §15). `app/robots.ts` llama `buildRobots(sitio.url, ['/author/'])` — sin grupos de crawler de IA (salida idéntica a antes de migrar). JSON-LD en `packages/seo/src/json-ld/*`: divergencias respecto al patrón Pavivasa (sin `description` en `Service`, `areaServed` mixto, breadcrumbs sin filtrar, `publisher` en FAQ) se mantienen a propósito porque reproducen la salida de hoy — reportadas como mejoras futuras, no arregladas.

## 9. Entorno y configuración

Regla general: `NEXT_PUBLIC_*` solo como literal exacto. Secretos de servidor solo dentro de `packages/config/src/server.ts` — confirmado: todo `process.env.<SECRETO>` del repo está en ese único fichero.

### Públicas (`packages/config/src/env.ts`)

| Variable | Validación | Efecto si falta |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL opcional | Cae a `https://pavimentos-albufera.com` (sin recorte de barra) |
| `NEXT_PUBLIC_TELEFONO` | presencia | `nap.telefonoMostrado` cae al placeholder de `business`; se pinta `<DatoPendiente>` |
| `NEXT_PUBLIC_WHATSAPP` | ídem | `nap.whatsappHref` queda `undefined` → ningún botón WhatsApp |
| `NEXT_PUBLIC_DIRECCION` | ídem | Cae al placeholder, `<DatoPendiente>` |
| `NEXT_PUBLIC_GA_ID` | regex `^(G\|GT\|UA)-...` | Sin ella (y sin `ADS_ID`) no carga `gtag.js` |
| `NEXT_PUBLIC_ADS_ID` | regex `^AW-\d+$` | Ídem |
| `NEXT_PUBLIC_ADS_ETIQUETA_LLAMADA` | libre | Se expone pero **nadie más la lee** en el repo hoy |
| `NEXT_PUBLIC_META_PIXEL_ID` | regex `^\d{5,20}$` | Sin ella no carga el Pixel ni viaja a la CAPI |

### Servidor (`packages/config/src/server.ts`, secretos)

| Variable | Efecto si falta |
|---|---|
| `RESEND_API_KEY` | El formulario no intenta enviar email (Telegram/CAPI siguen igual) |
| `EMAIL_DESTINO` | Cae a `comercial@pavimentos-albufera.com` |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | No se manda aviso de Telegram |
| `META_CAPI_ACCESS_TOKEN` | La CAPI no hace nada |
| `META_CAPI_TEST_EVENT_CODE` | Opcional — el evento sale en Test Events de Meta, no cuenta |

`serverEnv` recorta con `trim() || undefined` — un secreto solo de espacios se trata como misconfiguración, no como valor válido.

### Otras lecturas de entorno fuera de `@site/config`

`VERCEL_ENV`: en `check-env.ts` (WARN si falta `SITE_URL` en producción) y en `verificar-landings.mjs` (asimetría de severidad: falla el build si el teléfono de reserva sale impreso **y** `VERCEL_ENV==='production'`; en cualquier otro entorno solo avisa). `NEXT_PUBLIC_SITE_URL` también como fallback de `pnpm verify` cuando no se pasa `--site-url`. Los 6 secretos de servidor, además, los lee `scripts/verify/secrets-scan.mjs` (por nombre, vía regex sobre el schema, nunca importados) para el escaneo de fugas.

### `check-env` (WF3, ya implementado)

`packages/config/scripts/check-env.ts`, wired como `prebuild` de `apps/web`. Corre en Node nativo (`--experimental-strip-types`), no lee `.env*` (solo `process.env` real del proceso — en local no ve `apps/web/.env.local`, que es un paso posterior; en Vercel coincide con lo que ve `next build`). Un `NEXT_PUBLIC_*` malformado **solo avisa** por defecto (interruptor de una línea a fallo); los problemas de env de servidor siempre fallan, sin interruptor (aunque hoy `ServerEnvSchema` no tiene format checks, así que no dispara nada por esa vía todavía). `NEXT_PUBLIC_SITE_URL` ausente con `VERCEL_ENV=production`: WARN fuerte, mismo patrón de interruptor.

Toda variable de entorno nueva va también a `apps/web/.env.example` y a `globalEnv` de `turbo.json` (16 entradas: `VERCEL_ENV`, el comodín `NEXT_PUBLIC_*`, las 8 públicas nombradas, las 6 de servidor).

## 10. Contratos externos — no renombrar

| Contrato | Valor | Motivo |
|---|---|---|
| Cookie de consentimiento | `pa_consent` (`aceptado`/`rechazado`, 180 días) | Consentimiento de visitantes recurrentes |
| Cookie de atribución | `pa_attr` | Requiere consentimiento (§8.3) |
| Cookie de referencia | `pa_ref` (6 caracteres) | Une lead de WhatsApp con lead web; deliberadamente NO se borra al revocar consentimiento |
| Dedupe de sesión | `sessionStorage['pa_evt_<nombre>']`, prefijo `pa_evt_` | Hoy solo `calculator_use` |
| Cookies de terceros que sí se borran al revocar | `_ga*`, `_gcl*` (prefijo), `_fbp`/`_fbc`/`pa_attr` (exactas) | `pa_consent`/`pa_ref` quedan fuera a propósito |
| Nombres de eventos GA4/Meta | `phone_click`, `whatsapp_click`, `email_click`, `generate_lead`, `calculator_use`, `samples_filter`, `scroll_depth`, `faq_open` (snake_case, inglés) | `generate_lead` (no `form_submit`) es deliberado: GA4 auto-detecta `form_submit` como su propio evento de Medición mejorada — renombrarlo evita mezclar el envío real con ese evento automático |
| Parámetros de evento | `page_path`, `device_type` (automáticos), `evento_id` (también campo oculto del formulario y `metaEventId` de dedupe Pixel/CAPI), `MONEDA='EUR'` (sin `value`) | Registrados como dimensiones personalizadas en GA4 |
| `data-ubicacion` | 18 valores (`header`, `hero`, `sticky_mobile`, …, `unmarked` = fallback de CTA sin marcar) | Contrato de reporting |
| Fragmentos `@id` de JSON-LD | `<url>#negocio` (81 refs), `<url-servicio>#servicio` (6 nodos propios, uno por página de servicio) | Español a propósito, la URL varía, el fragmento no |
| Campos del formulario | honeypot `empresa_web`; ocultos `evento_id`, `origen`; visibles `nombre`, `telefono`, `email`, `espacio`, `superficie`, `municipio`, `mensaje`, `foto`, `privacidad` | Contrato cliente↔Server Action |
| Redirecciones | 33 `source:` en `redirects()`, todas `permanent:true` → **308**, no 301 (documentarlo como "301" sería incorrecto) | Backlinks reales de WordPress |
| Variables de entorno | nombres de §9 | Vercel ya configurado con esos nombres |

## 11. Calidad: comandos, gates, verificadores, CI, known-issues

**Comandos** (raíz): `pnpm dev`/`build`/`lint`/`typecheck`/`content:validate` (todos `turbo run <task>`), `pnpm verify` (`scripts/verify/index.mjs apps/web`), `pnpm verify:secrets` (`scripts/verify/build-and-scan-secrets.mjs apps/web`).

**Orden real del gate**: (1) `check-env` (prebuild de `apps/web`, warn-only hoy); (2) `next build`; (3) los 5 verificadores de `apps/web`, encadenados en el mismo `build`; (4) `pnpm verify` (raíz, WF3) — postbuild, capa aparte, NO encadenada en `next build`, corre en CI y a mano, no en un deploy de Vercel; (5) `pnpm verify:secrets` — su propio segundo build con secretos centinela + escaneo, solo en CI y a mano.

**Los 5 verificadores de `apps/web`**: `verificar-redirecciones.mjs` (destinos resuelven a ruta real), `verificar-imagenes.mjs` (src/alt/ancho de cada foto citada en `@site/content`), `verificar-presupuesto.mjs` (presupuesto de JS por ruta, brotli q11, techo duro 112 kB), `verificar-lcp-visible.mjs` (ningún candidato a LCP escondido tras `.aparece`), `verificar-landings.mjs` (`tel:` sin el marcador de reserva cuando `VERCEL_ENV=production`, fatal solo en producción).

**`scripts/verify` (raíz, WF3, checks a-j)**: (a) sitemap↔páginas reales; (b) enlaces internos sin 404; (c) redirects devuelven 308 (vivo, HTTP); (d) JSON-LD válido y `@id` resuelven; (e) metadata (H1 único, canonical, título/desc únicos); (f) robots.txt permite rastreadores de IA; (g) `<img>` con `alt`+tamaño; (h) presencia de `tel:`/`wa.me` en HTML renderizado (señal distinta a `verificar-landings.mjs`); (i) `verify:secrets` — fuga de secretos en `.next/static`/`.next/server/app`; (j) `page-count` — nº de páginas indexables ≥ mínimo esperado por `@site/content`. Solapamiento deliberado (parcial) con los 5 de arriba, detallado en `scripts/verify/README.md`.

**`known-issues.json`**: 54 entradas exactas, agrupadas en 2 claves: `(metadata, missing-og-url)` → 51 (una por página; `app/layout.tsx` nunca fija `openGraph.url`) y `(metadata, duplicate-description)` → 3 (páginas legales sin `description` propia, heredan la de home). Una entrada que deja de fallar se reporta "stale" y **hace fallar el run** (a diferencia de Pavivasa, que solo lo imprime — este repo exige fallar en stale). Cualquier issue nuevo no listado también hace fallar.

> **Inexactitud de documentación corregida**: `README.md` citaba como ejemplo de known-issue "las landings `/lp/*` fuera del sitemap por diseño". Esa exclusión sí existe (`scripts/verify/checks/sitemap.mjs` filtra por `noindex`), pero **no es una entrada de `known-issues.json`** — es una regla estructural del propio check, no un baseline. Las 54 entradas reales son solo las dos claves de arriba. El README ya cita un ejemplo real (`metadata:missing-og-url`/`metadata:duplicate-description`).

**CI** (`.github/workflows/ci.yml`, un job): checkout → `pnpm/action-setup@v6` (sin `version:`) → `setup-node@v7` (Node 22) → `pnpm install --frozen-lockfile` → `content:validate` → `lint` → `typecheck` → `pnpm --filter web build` (ya incluye los 5 verificadores) → `pnpm verify` → segundo build + `pnpm verify:secrets` con valores centinela. Sin paso de deploy — Vercel despliega por su integración Git, independiente del resultado de este workflow salvo que se configure deployment gating/branch protection aparte. **CI nunca ha corrido en un runner real**: la rama no está en `origin`.

## 12. Despliegue

Plataforma: Vercel, conectado a GitHub. **Aplicado hoy: nada** — el proyecto de producción sigue desplegando `main` (pre-monorepo) sin cambios; la rama `monorepo-migration` es local.

**Solo prescrito (README, sin probar contra un proyecto real)**:
- Proyecto Vercel separado sobre el mismo repo, apuntado a `monorepo-migration`, para probar antes de fusionar.
- Root Directory `apps/web` + "Include files outside the Root Directory".
- Build Command override manual: `cd ../.. && pnpm turbo run build --filter=web` (el default de Vercel con Root Directory en `apps/web` no invocaría turbo).
- `ENABLE_EXPERIMENTAL_COREPACK=1` (respeta `packageManager: pnpm@9.15.9`).
- Mismas env vars que producción.
- Node.js Version del proyecto → 22.x (no verificable desde el repo: sin `engines` en `apps/web/package.json` ni `.nvmrc`/`vercel.json` versionados).
- Revisar que no sobrevivan overrides de Install/Build Command de cuando era app plana con npm.
- No asignar el dominio de producción al proyecto de prueba.
- Al fusionar a `main`: aplicar los mismos ajustes al proyecto de producción a la vez que el merge.

El propio README lo marca explícitamente como prescriptivo, no probado.

## 13. Idiomas

Estado publicado hoy: solo `es` (`publishedLocales: ['es']`). El contenido ya usa `Localized<T>` con `es` obligatorio y `en`/`fr`/`de` opcionales (tipos y datos preparados); `@site/seo`'s `buildCanonical`/`buildAlternates` está construido pensando en ese futuro pero no está enganchado en ningún sitio hoy. **No existe** enrutado por idioma: sin `app/[locale]`, sin `middleware.ts`, sin `next-intl`. Desviación deliberada frente a la plantilla normativa, que pide montar `[locale]` desde la migración aunque solo se publique `es` — README: "queda deliberadamente fuera de esta migración: es tarea del rediseño".

## 14. Decisiones y desviaciones respecto a la plantilla

Documento citado: `arquitectura-plantilla-monorepo.md` (normativo). Donde choca con las decisiones vinculantes de esta migración concreta, ganan estas últimas — son las que fijaron el alcance real de P1-P3/WF3. Esas decisiones, citadas por su D-número en todo este documento, están en [`docs/migration/DECISIONS.md`](./docs/migration/DECISIONS.md) — histórico: si choca con el código o con este documento, ganan estos dos.

| Área | Qué dice la plantilla | Qué hace el código | Estado |
|---|---|---|---|
| Idiomas/URLs | `[locale]` montado desde la migración | Sin `[locale]`, solo `es`, rutas planas | Deliberado, aplazado al rediseño |
| Eventos de tracking | `phone_call`, `whatsapp_click`, `form_submit` | `phone_click`, `whatsapp_click`, `email_click`, `generate_lead`, `calculator_use`, `samples_filter`, `scroll_depth`, `faq_open` | Heredado de antes de la migración (preservado byte a byte); vocabulario real del negocio, no un gap de esta fase |
| `data-cta="phone"\|"whatsapp"` | Pide ese atributo en cada `tel:`/`wa.me` | No existe; solo `data-ubicacion` | Heredado, frontend congelado |
| `NEXT_PUBLIC_SITE_URL` en producción | Build falla si falta | `check-env` solo avisa por defecto (interruptor de una línea ya existe) | Deliberado, pendiente de decisión del usuario |
| Verificadores postbuild | Redirects 301→200, enlaces, JSON-LD, canonical/hreflang, sitemap, sin `AggregateRating`, un H1 | Todo eso existe, repartido entre los 5 de `apps/web` y `scripts/verify` — más comprobaciones propias (presupuesto JS, LCP, secretos) | Ampliación, no gap |
| Lighthouse CI | Presupuesto de rendimiento en CI | Existe (`apps/web/lighthouserc.json`) pero deliberadamente fuera de CI y de cualquier build (sus números locales no representan producción tras el CDN de Vercel) | Desviación documentada |
| robots.txt / rastreadores de IA | Grupo nombrado por cada rastreador, explícitamente permitido | Un solo grupo `User-agent:*`, sin `Disallow` para ninguno — el efecto (permitirlos) es el mismo, la forma no | Deliberado: salida idéntica a antes de migrar |
| Gate CI→deploy | Implícito: CI bloquea el despliegue | Sin gate propio; requiere configurar branch protection/deployment gating aparte | Gap documentado, §15 |
| Presupuesto de JS | "≤100 KB comprimido" | Techo duro real de 112 kB en `verificar-presupuesto.mjs` | Desviación heredada de antes de la migración, no tocada aquí |
| `@id` del negocio | Ejemplo del documento: `<url>/#business` (inglés) | `#negocio` (español) | Salida idéntica a antes de migrar; el ejemplo de la plantilla es solo eso, Pavivasa (el hermano de referencia) usa también su propio idioma |
| Parámetros `variante`/`locale` en cada evento | Exigido | `paramsComunes()` solo manda `page_path`/`device_type`; ningún evento lleva `variante` ni `locale` | Gap heredado, consecuencia de no publicar más que `es` |
| `hreflang`/`alternates.languages` | Recíproco en cada página y sitemap | Solo `alternates.canonical:'/'` en ningún lado más | Consecuencia directa de publicar solo `es` |
| `turbo-ignore` en Vercel | Pedido para no redesplegar si el cambio no afecta la app | El README de la sección Vercel no lo menciona | Gap de documentación, §15 |

**No es una discrepancia real** (evaluado y descartado): la ausencia de `_pending`/`_note` en tiempo de ejecución de `lib/datos.ts` (dato preservado en el paquete, nunca leído en runtime); `null`→opcional en el paquete con adaptadores que devuelven los mismos `null` de siempre; exports internos extra en el adaptador de servicios (no alcanzables desde cliente); valores en español de `ImageKind`/sección (son datos, no identificadores de código).

**Nota de método**: este documento normativo se aplicó primero a Pavivasa (repo hermano), cuyo propio §15 ya documenta como desviación deliberada y aceptada el aplazamiento de `[locale]` y la existencia de adaptadores legacy — las mismas dos filas de arriba, no gaps propios de este repo.

## 15. Pendientes y decisiones abiertas

| Pendiente | Detalle | Fuente |
|---|---|---|
| `trabajo/auditoria-medicion-y-servicios` sin decidir | Commit local, no fusionado, toca la zona congelada, incluye un posible índice de zonas (`zonas/page.tsx`) que hoy no existe | §1.1 |
| `sitemap.ts` no pasa `routes` explícito a `buildSitemapEntries` | El mecanismo de prefijos configurables existe en `@site/seo` desde WF3, pero el llamador se apoya en el default en vez de pasar su propia config — salida idéntica hoy; verificar si la intención exigía lo segundo | §8.4 |
| Duplicación del limitador de tasa | `apps/web/src/lib/limite.ts` (compartible) vs. copia privada en `actions.ts` — un módulo `'use server'` solo puede exportar funciones async, y el limitador es síncrono | §4, §6.5 |
| Mejoras de SEO detectadas, no corregidas | `Service` sin `description`; `areaServed` con dos formas distintas; `BreadcrumbList` no filtra tramos intermedios; `FAQPage` con `publisher`; `/zonas/xabia/` es noindex pero sigue en `sitemap.xml` | §8.4, §14 |
| Textos legales sin confirmar por el dueño | Código de conducta, DPO, datos registrales, domicilio social — `<DatoPendiente>` en `content/legal.tsx` | `packages/content/src/legal/` |
| `pa_ref` se escribe antes de que el visitante decida sobre cookies | Comportamiento heredado, fuera de esta migración | §8.3 |
| Copy del banner de cookies al reabrir | Mismo texto de primera visita al reabrir desde "Configurar cookies", aunque ya se haya decidido | Frontend congelado |
| Residual de JS por duplicación de chunk | ~+160 B uniformes + ~+550-690 B en rutas con formulario, por duplicación de `lib/cookies.ts` entre chunks de layout y formulario; un intento de forzar chunk propio empeoró todas las rutas y se revirtió | Todas las rutas quedan muy por debajo del techo de 112 kB |
| CI nunca ejecutado en un runner real | La rama no está en `origin` | §11 |
| Configuración de Vercel sin aplicar ni probar | Toda la sección §12 es prescriptiva | §12 |
| Enrutado multi-idioma | `[locale]`/`middleware.ts`/`next-intl` no montados; tipos y datos ya preparados | §13 |
| `consent-store.ts`/`attribution-client.ts`/`tracker-cookie-factory.ts` sin enganchar | Documentados para un diseño futuro (D27 addendum) | §4, §8.3 |
| `lastLegalReview` fijo en el dato | No derivado de control de versiones del texto legal — actualizar a mano | `packages/content/src/data/legal.ts` |
| `turbo-ignore` no prescrito | La plantilla lo pide para Vercel; el README no lo menciona | §14 |
| "49 rutas" del comentario de `layout.tsx` sin reconciliar | Ver §6.1 — no cuadra de forma verificable contra las 51 rutas reales de hoy | §6.1 |

## 16. Cómo trabajar en este repo

| Tarea típica | Ficheros a tocar | Comando de verificación |
|---|---|---|
| Editar contenido | `packages/content/src/data/*.ts` (nunca `apps/web/src/content/*` directo) | `pnpm content:validate`; luego `pnpm --filter web build` |
| Añadir variable de entorno pública | `packages/config/src/env.schema.ts` + `env.ts` + `.env.example` + `globalEnv` de `turbo.json` | `pnpm --filter @site/config run check-env`; `pnpm --filter web build` |
| Añadir variable de entorno de servidor | `packages/config/src/server-env.schema.ts` + `server.ts` + `.env.example` + `globalEnv` — nunca importar desde un módulo alcanzable por cliente | `pnpm verify:secrets` |
| Tocar tracking/consentimiento | `packages/tracking/src` — nunca `gtag`/`fbq` directo desde un componente | `pnpm --filter web build` + grep de literales (`pa_evt_`, nombres de cookies/eventos) |
| Tocar `app/**`/`components/**` (zona congelada) | Solo el allowlist: `app/presupuesto/actions.ts`, `app/api/atribucion/route.ts`, `app/layout.tsx` (solo la parte del builder de Consent Mode), `app/sitemap.ts`, `app/robots.ts` — cualquier otro cambio requiere levantar la congelación | `pnpm --filter web build` + `pnpm verify` (ambos en verde; salida pública cambiada fuera de este allowlist es un bug) |
| Antes de commitear | — | `content:validate → lint → typecheck → build → verify` (y `verify:secrets` si se tocó tracking/env) — sin warnings |
| Levantar la congelación del frontend (cuando el rediseño consuma `@site/*` directo) | Sustituir cada import de un adaptador legacy por el paquete `@site/*` correspondiente y borrar el adaptador; corregir los dos gaps baselineados en `known-issues.json` y **borrar sus entradas en el mismo commit** — dejarlas tras arreglar el issue las vuelve "stale" y `pnpm verify` falla por diseño | `pnpm verify` en verde, sin entradas "stale" |

## 17. Referencias

- `README.md` (raíz) — estructura, comandos, variables de entorno, verificadores, CI, Vercel, adaptadores legacy, i18n, pendientes.
- `CLAUDE.md` (raíz) — reglas del proyecto, remite a este documento como primera lectura.
- `scripts/verify/README.md` — detalle de cada check a-j, solapamiento con los 5 verificadores de `apps/web`, `known-issues.json`.
- `packages/config/README.md`, `packages/content/README.md`, `packages/seo/README.md`, `packages/tracking/README.md`, `apps/web/README.md`.
- `design/` — especificación de diseño y contenido original, no tocada por la migración.
- `arquitectura-plantilla-monorepo.md` — especificación normativa de la plantilla monorepo (citada en §14).
- `SEO-Local-Contexto-Claude-Code.md` — reglas SEO locales que complementan la plantilla.
- `.env.example` — variables documentadas.
