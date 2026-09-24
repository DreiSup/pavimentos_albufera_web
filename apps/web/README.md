# web

App Next.js 15 (App Router) del monorepo. Ver el `README.md` de la raíz
para comandos, estructura completa, variables de entorno y despliegue en
Vercel; `CLAUDE.md` (raíz) para las reglas de diseño/contenido/técnica.

```bash
pnpm --filter web dev
pnpm --filter web build   # corre check-env como prebuild (packages/config/README.md), luego
                          # next build y los 5 verificadores encadenados — ver más abajo
pnpm --filter web lint
pnpm --filter web typecheck
```

`src/app/**` y `src/components/**` están **congelados** durante la
migración a monorepo: no se editan hasta el rediseño (excepción explícita:
`src/app/presupuesto/actions.ts`, `src/app/api/atribucion/route.ts`,
`src/app/layout.tsx`, `src/app/sitemap.ts` y `src/app/robots.ts`, los 5
únicos archivos que esta migración tocó, siempre para delegar en un
paquete `@site/*` con la misma salida). `src/lib/` y `src/content/` son en
su mayoría adaptadores legacy sobre los paquetes `@site/*` (ver
"Adaptadores legacy" en el README raíz); el contenido real vive en
`@site/content`, no aquí.

## `build` — qué corre, y en qué orden

```
prebuild  → packages/config/scripts/check-env.ts (pnpm --filter @site/config run check-env)
build     → next build
          → node scripts/verificar-redirecciones.mjs
          → node scripts/verificar-imagenes.mjs
          → node scripts/verificar-presupuesto.mjs
          → node scripts/verificar-lcp-visible.mjs
          → node scripts/verificar-landings.mjs
```

Los 5 verificadores están encadenados aquí, en el `build` de esta app — no
en un hook `postbuild` (se retiró para que no corrieran dos veces, D3 de la
migración) — así que corren siempre, con `pnpm --filter web build`, `turbo
run build --filter=web`, o desde Vercel. Cada uno falla el build si
encuentra un problema; ver la cabecera de cada `scripts/verificar-*.mjs`
para el porqué de cada uno (destinos de las 301, `src`/`alt`/ancho de cada
foto, presupuesto de JS por ruta, LCP no escondido tras `.aparece`, y
`tel:` real —no el marcador de reserva— cuando `VERCEL_ENV=production`;
`verificar-landings.mjs` solo mira el teléfono, no WhatsApp — ver el
README de la raíz).

`content:validate` (Zod sobre `packages/content`) **no** es parte de este
`build` — corre como dependencia de la tarea `build` de `turbo.json`
(`turbo run build`/`pnpm build` desde la raíz), pero `pnpm --filter web
build` a secas no la dispara. Correrla a mano primero si se usa ese atajo.

## `next.config.ts`

- `outputFileTracingRoot` apunta a la raíz del monorepo (no a `apps/web`):
  necesario para que el tracing de archivos de Next encuentre el resto del
  workspace pnpm.
- `transpilePackages: ['@site/content', '@site/config', '@site/seo',
  '@site/tracking']` — los 4 paquetes publican `.ts` sin transpilar
  (`exports: {".": "./src/index.ts"}`), así que Next tiene que compilarlos
  con su propio pipeline, igual que a este mismo app.
- `trailingSlash: true` fijo (regla de `CLAUDE.md`).
- `redirects()` — las 301 heredadas de la web en WordPress; validadas
  contra rutas reales por `scripts/verificar-redirecciones.mjs` (ver
  arriba), no por `next build`.
- El resto (`images`, `experimental.serverActions.bodySizeLimit`) no ha
  cambiado con esta migración — ver los comentarios del propio archivo
  para el porqué de cada valor.

## Estructura

```
src/
  app/          rutas — home, 6 páginas de servicio, /acabados + [modelo], /proyectos + [slug],
                /zonas/[municipio], /empresa, /presupuesto, /blog + [slug], legales, /lp/[slug],
                /api/atribucion, sitemap.ts, robots.ts
  components/    layout · ui · contenido · datos · secciones
  content/       adaptadores legacy sobre @site/content (ver README raíz)
  lib/           adaptadores legacy sobre @site/content, @site/seo, @site/tracking, @site/config
                (más lib/limite.ts, que NO es un adaptador — ver README raíz)
scripts/         los 5 verificadores encadenados en `build` (arriba)
public/          fotos y activos estáticos — ver public/README.md
lighthouserc.json  configuración de Lighthouse CI (no se ejecuta como parte de ningún gate —
                  ver el README raíz)
```

Ver el README de la raíz para "Cómo añadir…" contenido (siempre por
`@site/content`, nunca escribiendo aquí) y la tabla de variables de
entorno completa (`.env.example` en este mismo directorio).
