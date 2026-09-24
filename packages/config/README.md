# @site/config

Public env, server env y ajustes de URL/locale del sitio, más el `check-env`
que corre como `prebuild` de `apps/web`. No React, no Next.

## Layout

```
src/
  env.schema.ts         Zod shape del env público (NEXT_PUBLIC_*) — se importa como VALOR
                        solo desde check-env.ts; env.ts solo importa su TIPO inferido
                        (`import type`, se borra en compilación, sin runtime de zod),
                        que es lo que mantiene zod fuera del grafo alcanzable desde cliente
  env.ts                publicEnv — lecturas planas `process.env.NEXT_PUBLIC_X`, una por
                        variable, siempre en forma literal (Next solo sustituye esa forma).
                        Semántica preservada exacta de `lib/config.ts` pre-migración, campo
                        a campo (no un `clean()` uniforme sobre las 8): TELEFONO/WHATSAPP/
                        DIRECCION recortan y una cadena en blanco se vuelve `undefined`;
                        GA_ID/ADS_ID/ADS_ETIQUETA_LLAMADA/META_PIXEL_ID se exponen en crudo
                        — una variable declarada pero en blanco tiene que llegar en blanco,
                        o el modo no-op de sus consumidores se rompe con un valor `undefined`
                        en vez de `''`
  server-env.schema.ts   Zod shape de los 6 secretos de servidor — mismo split, misma razón
  server.ts             ("@site/config/server") serverEnv — lecturas planas de los secretos,
                        cada una recortada (`trim() || undefined`); importar solo desde
                        código server-only
  site.ts                site.url (cae al fijo `https://pavimentos-albufera.com` cuando
                        NEXT_PUBLIC_SITE_URL no está puesta), defaultLocale, supportedLocales,
                        publishedLocales (hoy solo `['es']`)
scripts/
  check-env.ts           la tarea `check-env` — parsea los dos shapes, avisa (no rompe el
                        build) si NEXT_PUBLIC_SITE_URL falta en un deploy de producción o si
                        un valor público no cumple su formato
```

## Split en dos archivos (schema vs. lecturas)

Mismo patrón en `env`/`env.schema` y en `server`/`server-env.schema`:
construir un `z.object(...)` ejecuta código real del paquete `zod`. `env.ts`
es alcanzable desde componentes cliente (a través del adaptador legacy
`apps/web/src/lib/config.ts`, que lo importa por subpath —
`@site/config/env`, nunca el barrel principal `@site/config` ni
`@site/config/server`), así que su schema vive en un archivo hermano;
`env.ts` (y `server.ts`) solo importan el TIPO inferido de ese hermano
(`import type`, borrado en compilación — sin zod en tiempo de ejecución), y
solo `check-env.ts` importa el schema en sí como valor.

## Server subpath

`"@site/config/server"` solo se importa desde código server-only (un Server
Action, un route handler, `@site/tracking/server`) — nunca desde
`"@site/config"` (la entrada principal) y nunca desde un módulo que un
componente `'use client'` pueda alcanzar. `EMAIL_DESTINO` (destino real del
email del formulario de presupuesto) se lee solo en
`apps/web/src/app/presupuesto/actions.ts`, con el mismo fallback fijo que
antes de la migración (`'comercial@pavimentos-albufera.com'`, no
`nap.email`) si la variable no está puesta — desacoplado a propósito del
email público del NAP, que ese mismo `lib/config.ts` resuelve solo de
`@site/content`, sin override de entorno — y, siendo client-reachable,
nunca importa este subpath.

## `check-env`

Wireado como `prebuild` de `apps/web` (`package.json`'s `scripts.prebuild`)
— corre por ese hook únicamente, sin cableado aparte: pnpm/npm siempre
ejecutan el hook `pre<script>` antes de `<script>` para
`pnpm run <script>`/`pnpm --filter <pkg> <script>`, y `turbo run <task>`
también (Turborepo invoca cada tarea a través de `pnpm run`, no
reimplementa la ejecución de scripts) — así que `check-env` corre antes de
`next build` tanto con `pnpm --filter web build`/`pnpm build` como con
`turbo run build --filter=web`. Corre sobre el soporte nativo de
TypeScript de Node (`node --experimental-strip-types`, Node ≥ 22.6); no lee
archivos `.env*` por sí mismo, solo variables de entorno reales del
proceso (exactamente lo que Vercel le da a `next build` también).

Dos avisos, ninguno rompe el build por defecto, cada uno con su interruptor
de una línea documentado en el propio `check-env.ts`:

- **`NEXT_PUBLIC_SITE_URL` ausente con `VERCEL_ENV=production`**: avisa por
  consola y cae al fijo de `site.ts`. Interruptor:
  `FAIL_IF_SITE_URL_MISSING_IN_PRODUCTION`.
- **Un valor público con formato inválido** (`NEXT_PUBLIC_GA_ID`,
  `NEXT_PUBLIC_ADS_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, o
  `NEXT_PUBLIC_SITE_URL` no absoluta): avisa por consola. Interruptor:
  `FAIL_ON_MALFORMED_PUBLIC_ENV`.

`ServerEnvSchema` no valida formato hoy (son secretos opacos, el paquete no
puede saber si un valor real es válido); si alguna vez se le añade una
comprobación, esa sí rompe el build siempre, sin interruptor — un secreto
de servidor con un problema real de formato no es una degradación
aceptable de un deploy de producción, a diferencia de un id público
mal escrito.
