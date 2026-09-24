# Pavimentos Albufera — monorepo

Sitio de Pavimentos Albufera en Next.js 15 (App Router), React 19, Tailwind 3
y TypeScript, migrado a un monorepo pnpm + Turborepo (misma plantilla que
`pavivasa`). La app vive en `apps/web`; el contenido, SEO, tracking y
configuración de entorno se han extraído a paquetes `@site/*` detrás de
adaptadores heredados que mantienen exactamente la misma API y los mismos
valores que antes de la migración — ver "Adaptadores legacy" más abajo.
`apps/web/src/app/**` y `apps/web/src/components/**` están **congelados**:
la salida pública tiene que seguir siendo idéntica a la de antes de migrar.
Ver [`CLAUDE.md`](./CLAUDE.md) para las reglas de diseño/contenido/técnica
del proyecto (vigentes desde antes de esta migración, todavía en vigor).

## Arranque

```bash
pnpm install
# apps/web/.env.local — ver "Desarrollo local" más abajo
pnpm --filter web dev
```

## Comandos

```bash
pnpm dev                # turbo run dev
pnpm build               # turbo run build
pnpm lint                 # turbo run lint
pnpm typecheck             # turbo run typecheck
pnpm content:validate       # valida packages/content con Zod (referencias, formas)
pnpm verify                  # verificadores raíz sobre apps/web/.next — scripts/verify/README.md
pnpm verify:secrets            # build propio con valores centinela + escaneo de fuga de secretos
```

`pnpm build` (vía turbo) corre `content:validate` antes de construir
(`turbo.json`, tarea `build`); `pnpm --filter web build` a secas **no**
corre `content:validate` por sí solo — correrlo antes a mano si se usa ese
atajo. `apps/web`'s propio `build` encadena `next build` con sus 5
verificadores (ver "Verificadores" abajo); eso ocurre siempre, con o sin
turbo. `pnpm verify` necesita un build previo, no construye nada por sí
mismo; `pnpm verify:secrets` sí hace su propio build, con valores centinela
para los secretos de servidor (fuente única:
`scripts/verify/sentinels.mjs`).

Gates antes de cada commit: `content:validate` → `lint` → `typecheck` →
`build` → `verify` (y `verify:secrets` si se tocó algo de tracking/env).

## Estructura

```
apps/web/                    Next.js — única app
  src/app/                   rutas (congeladas): home, 6 servicios, /acabados + [modelo],
                              /proyectos + [slug], /zonas/[municipio], /empresa, /presupuesto,
                              /blog + [slug], legales, /lp/[slug], /api/atribucion, sitemap, robots
  src/components/            layout · ui · contenido · datos · secciones (congelados)
  src/content/, src/lib/     adaptadores legacy — ver "Adaptadores legacy" más abajo
  scripts/                   los 5 verificadores encadenados en el `build` de esta app
  public/                    fotos y activos estáticos (@site/content las referencia por /ruta)
packages/
  content/    @site/content    hechos del negocio: NAP, servicios, acabados, modelos, zonas de
                                servicio, proyectos, artículos, FAQ, landings de campaña, legales
  seo/        @site/seo        JSON-LD, sitemap, robots, canonical/alternates
  tracking/   @site/tracking    consentimiento, atribución, eventos; subpath /server para Meta CAPI
  config/     @site/config      env público/servidor, URL del sitio, locales, check-env
scripts/verify/               verificadores raíz permanentes (D29) — sitemap, enlaces,
                               redirecciones, JSON-LD, metadata, robots, imágenes/CTA, nº de
                               páginas, fuga de secretos. No confundir con ningún toolkit de
                               migración: es un gate permanente del repo, no del scratchpad
                               de ninguna sesión.
design/                       especificación de diseño y contenido — no se toca en esta migración
```

Cada `packages/*` y `apps/web` tienen su propio README con más detalle.

## Cómo añadir…

Todo el contenido real vive en `packages/content/src/data/*.ts` y se lee
desde `apps/web` solo a través de `packages/content/src/queries/*.ts` (nunca
importar `data/` directamente desde `apps/web`, salvo los 4 subpaths de
datos-solo documentados en el README de `@site/content`, pensados para
adaptadores alcanzables desde cliente). Después de cualquier cambio de
contenido: `pnpm content:validate`.

- **Un servicio**: entrada en `data/services.ts` (en orden de menú) + entrada
  correspondiente en `data/service-catalog.ts` (los mantiene sincronizados
  `content:validate`, no se derivan uno de otro en runtime).
- **Un acabado (Finish)**: entrada en `data/finishes.ts`. `service` tiene que
  ser un `ServiceId` real; `model` (si se pone), un `ModelId` real; cada slug
  de `projects`, un proyecto real.
- **Un modelo (Model)**: entrada en `data/models.ts` — nombre de visualización
  y foto de portada para `/acabados/[modelo]/`.
- **Una zona/área de servicio (ServiceArea)**: entrada en `data/service-areas.ts`
  para publicar `/zonas/[municipio]/`. El objeto final del archivo,
  `unconfirmedServiceAreaTowns`, son municipios sin confirmar — nunca se
  fusiona con `serviceAreas`, no genera página.
- **Un proyecto + sus fotos**: entrada en `data/projects.ts`. `service` debe
  ser un `ServiceId` real. Solo rellenar los campos de los que se tenga
  certeza; nunca inventar un valor (`_pending`/`_note` son metadatos
  editoriales, se preservan tipados pero no se exponen en ninguna página).
  La foto en sí va a `apps/web/public/obras/` (no está congelado; solo
  `src/app/**` y `src/components/**` lo están) y se referencia por ruta
  (`/obras/<archivo>.jpg`) desde `src`/`alt`. Ver
  `apps/web/public/README.md` para nomenclatura y umbrales de ancho.
- **Un artículo**: entrada en `data/articles.ts`.
- **Una pregunta de FAQ**: entrada en `data/faq.ts` (pool único, con `topic`);
  cada superficie compone su propio subconjunto por clave
  (`faqRefs` en `data/services.ts`, `homeFaqRefs`/`serviceAreaFaqRefs`).
- **Una landing de campaña (`/lp/<slug>/`)**: son una función pura de
  `data/services.ts` + `data/campaign-landings.ts`'s `CAMPAIGN_SERVICE_IDS` —
  añadir o quitar un id ahí, no un tipo de contenido nuevo.
- **Un hecho legal**: filas de texto plano en `data/legal.ts`
  (`LegalFacts`) — las filas que llevan JSX (`<DatoPendiente>`, enlaces
  externos, un fragmento mixto) siguen escritas a mano en el adaptador
  `apps/web/src/content/legal.tsx`, no aquí (D6 de la migración). Ver el
  README de `@site/content` para la lista exacta.

Todo campo de texto que lee el visitante — y todo slug de URL — es
`Localized<T>` (`{ es, en?, fr?, de? }`, `es` obligatorio) — ver "The
`Localized<T>` rule" en el README de `@site/content` para las excepciones
(identificadores, referencias a proyecto, nombres propios, números).

## Variables de entorno

Ver `apps/web/.env.example` (todas las que lee el código, con comentario).
Resumen:

| Variable | Ámbito | Qué hace si falta | Dónde se pone en Vercel |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | pública | Cae al fijo `https://pavimentos-albufera.com` (`@site/config/site.ts`) para canonical, sitemap, JSON-LD, `og:url`. | Project → Settings → Environment Variables, entorno Production (y Preview si se quiere probar otro dominio ahí) |
| `NEXT_PUBLIC_TELEFONO` | pública | Sin ella, todo `tel:` del sitio cae al marcador `<DatoPendiente>` (entre corchetes) y el JSON-LD del negocio omite `telephone` — build entero, no por página. `verificar-landings.mjs` (encadenado en el `build` de `apps/web`) hace fallar el build si esto ocurre con `VERCEL_ENV=production`. | igual |
| `NEXT_PUBLIC_WHATSAPP` | pública | Sin ella, ningún botón de WhatsApp se pinta (no hay `wa.me` que enlazar). A diferencia del teléfono, ningún verificador falla el build en producción por esto hoy — `verificar-landings.mjs` solo mira el teléfono de reserva (`RESERVAS`); `scripts/verify`'s `whatsappConfigured` es más flojo y no bloquea (ver su propio comentario en `scripts/verify/README.md`, "`<DatoPendiente>` y las comprobaciones de CTA/JSON-LD"). | igual |
| `NEXT_PUBLIC_DIRECCION` | pública | Cae al marcador `<DatoPendiente>` de dirección. | igual |
| `NEXT_PUBLIC_GA_ID` | pública | Sin ella (y sin `NEXT_PUBLIC_ADS_ID`), no se carga `gtag.js`: sin GA4 ni Consent Mode. | igual |
| `NEXT_PUBLIC_ADS_ID` | pública | ID de conversión de Google Ads (`AW-…`). Sin ella (y sin `NEXT_PUBLIC_GA_ID`), tampoco se carga `gtag.js`. | igual |
| `NEXT_PUBLIC_ADS_ETIQUETA_LLAMADA` | pública | Etiqueta de conversión de Google Ads, sin el prefijo `AW-`. Se expone en `sitio.adsEtiquetaLlamada` (`apps/web/src/lib/config.ts`) pero hoy ningún sitio del código la lee más allá de esa asignación — no hay ninguna llamada de conversión de Google Ads en este repo (`@site/tracking`'s `trackEvent` no tiene parámetro `adsConversion`, ver su README). Puesta o no, no cambia nada todavía. | igual |
| `NEXT_PUBLIC_META_PIXEL_ID` | pública | Sin ella, no se carga el Pixel de Meta (ni el evento `PageView`). | igual |
| `EMAIL_DESTINO` | servidor | Destino real del email del formulario de presupuesto (`app/presupuesto/actions.ts`). Sin ella, cae al fijo `comercial@pavimentos-albufera.com` (D28a) — no al email público del NAP. | igual, marcar "sensitive" |
| `RESEND_API_KEY` | servidor | Sin ella, el formulario no intenta enviar el email (el Server Action sigue el resto del flujo: aviso de Telegram, evento a Meta CAPI si hay consentimiento, pantalla de "recibido"). | igual, marcar "sensitive" |
| `TELEGRAM_BOT_TOKEN` | servidor | Sin ella (o sin `TELEGRAM_CHAT_ID`), no se manda el aviso de Telegram. | igual, marcar "sensitive" |
| `TELEGRAM_CHAT_ID` | servidor | Igual que arriba. | igual |
| `META_CAPI_ACCESS_TOKEN` | servidor | Sin ella, `sendMetaConversionEvent` (`@site/tracking/server`) no hace nada aunque haya consentimiento y pixel id. | igual, marcar "sensitive" |
| `META_CAPI_TEST_EVENT_CODE` | servidor | Código de evento de prueba de Meta CAPI (Test Events); opcional, solo para depurar en el panel de Meta. | igual |
| `VERCEL_ENV` | la pone Vercel | La define Vercel automáticamente (`production`/`preview`/`development`). `check-env` (prebuild de `apps/web`) la lee para avisar si falta `NEXT_PUBLIC_SITE_URL` en producción; `verificar-landings.mjs` la lee para decidir si falla el build (producción) o solo avisa (cualquier otro valor) cuando el teléfono es el de reserva. No configurar a mano. | no aplica |

"Pública" = `NEXT_PUBLIC_*`, leída también en el navegador (Next.js la
inyecta en build solo si aparece como literal `process.env.NEXT_PUBLIC_X`,
nunca dinámico). "Servidor" = solo se lee en Server Actions/route handlers
vía `@site/config/server`, nunca llega al bundle cliente; `@site/config/server`
recorta espacios en cada secreto al leerlo (un secreto con espacios
alrededor es una mala configuración, no un valor válido) — `check-env`
valida el resultado ya recortado, no hace el recorte él mismo.

**`NEXT_PUBLIC_SITE_URL` en producción**: hoy, si falta en un deploy con
`VERCEL_ENV=production`, `check-env` (el `prebuild` de `apps/web`, en
`packages/config/scripts/check-env.ts`) **avisa por consola** pero no rompe
el build — cae al valor fijo del fallback. El interruptor de una línea para
que falle en vez de avisar está documentado en ese mismo archivo
(`FAIL_IF_SITE_URL_MISSING_IN_PRODUCTION`).

**Formato inválido en una variable pública** (`NEXT_PUBLIC_GA_ID`,
`NEXT_PUBLIC_ADS_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, o `NEXT_PUBLIC_SITE_URL`
con una URL no absoluta): igual, **avisa por consola** por defecto y no
rompe un deploy de producción — interruptor de una línea en el mismo
archivo (`FAIL_ON_MALFORMED_PUBLIC_ENV`). `server-env.schema.ts` no valida
formato en los secretos de servidor hoy (son opacos: el paquete no puede
saber si un valor real es válido).

## Verificadores

Dos capas permanentes, con alcance distinto:

1. **Los 5 verificadores de `apps/web`** (`apps/web/scripts/verificar-*.mjs`),
   encadenados en el `build` de esa app (`next build && node
   verificar-redirecciones.mjs && verificar-imagenes.mjs &&
   verificar-presupuesto.mjs && verificar-lcp-visible.mjs &&
   verificar-landings.mjs`): destinos de las 301, `src`/`alt`/ancho de cada
   foto citada, presupuesto de JS por ruta (brotli q11, techo duro 112 kB),
   ningún candidato a LCP escondido tras `.aparece`, y que `tel:` no salga
   con el marcador de reserva en `VERCEL_ENV=production`. Corren siempre que
   corre `next build` en `apps/web` — `pnpm --filter web build`, `turbo run
   build`, y también un deploy de Vercel (el `Build Command` de Vercel
   termina invocando este mismo `build`) — no en un hook aparte.
2. **`scripts/verify` en la raíz** (D29, `pnpm verify`/`pnpm verify:secrets`):
   sitemap/enlaces/redirecciones-por-código/JSON-LD/metadata/robots/
   imágenes-CTA/nº de páginas + fuga de secretos, con un baseline de
   problemas ya conocidos (`scripts/verify/known-issues.json`, p. ej. las
   landings `/lp/*` fuera del sitemap por diseño). Ver
   `scripts/verify/README.md` para el detalle de cada check y su
   solapamiento (deliberadamente parcial) con los 5 de arriba. **Esta capa
   corre en CI (`.github/workflows/ci.yml`) y a mano, pero NO en un deploy
   de Vercel** — el `Build Command` de Vercel de esta sección solo invoca
   `pnpm turbo run build --filter=web` (capa 1), no `pnpm verify`; un
   problema que solo detecte esta capa no bloquea un deploy real a menos
   que se configure aparte (deployment gating, branch protection — ver
   "CI").

**Lighthouse CI** (`apps/web/lighthouserc.json`) existe pero queda fuera de
las dos capas de arriba a propósito: no corre en CI ni en ningún build —
sus números absolutos (server-response-time de un servidor local) no se
parecen a los de producción tras el CDN de Vercel; la línea base real se
toma desplegando un preview y midiendo ahí (ver el comentario de
`.gitignore` sobre `.lighthouseci/`/`informes-lighthouse/`).

## CI

`.github/workflows/ci.yml` corre en cada push/PR: instala con
`--frozen-lockfile`, `content:validate`, `lint`, `typecheck`, `build`
(`pnpm --filter web build`, que ya incluye los 5 verificadores), `verify`, y
un segundo build + `verify:secrets` con valores centinela para los secretos
de servidor. No hay paso de deploy: Vercel despliega solo por su
integración de Git; para que un CI en rojo bloquee la promoción hace falta
configurarlo aparte (deployment gating en Vercel, o un check de branch
protection en GitHub) — ver el comentario final de `ci.yml`. Esta rama no
está en `origin` todavía, así que ningún run de este workflow se ha visto
en un runner real — ver "Pendiente" más abajo.

## Desarrollo local

`apps/web/.env.local` es un symlink relativo (`../../.env.local`,
gitignorado) al `.env.local` de la raíz del repo — así los builds de esta
migración leen exactamente las mismas variables que la app plana leía antes
de migrar. Si se prefiere una copia real en vez de un symlink (por ejemplo
para llevar valores distintos entre ramas):

```bash
rm apps/web/.env.local            # solo si ya existe como symlink
cp .env.local apps/web/.env.local  # o cp apps/web/.env.example apps/web/.env.local y rellenar
```

**Volver a `main` (o a cualquier rama previa a la migración, con `npm` y sin
`pnpm-lock.yaml`)**: hace falta `npm ci` — el `node_modules` de la raíz es
ahora el de pnpm (workspaces, symlinks internos), incompatible con lo que
espera una rama de antes del monorepo. Y en sentido inverso, al volver a
esta rama desde una de `npm`: `rm -rf node_modules && pnpm install`
(D21 del runbook de migración) antes del primer build, para no arrastrar
un `node_modules` de npm bajo un árbol que pnpm espera gestionar.

## Vercel — monorepo

**Producción no cambia con esta migración.** El proyecto Vercel actual
sigue desplegando `main` exactamente como hoy hasta que el usuario decida
fusionar esta rama. Nada se toca en el dashboard todavía.

**Para probar esta rama antes de fusionar**, sin tocar el proyecto de
producción: crear un **proyecto Vercel SEPARADO sobre el mismo repositorio
de GitHub**, apuntado a esta rama.

0. Esta rama es solo local hasta ahora (así lo pide esta fase de la
   migración) — hace falta `git push -u origin monorepo-migration` antes de
   que Vercel (o cualquier proyecto nuevo apuntado a ella) pueda verla.
1. **New Project** → importar el mismo repo → antes de darle a Deploy,
   abrir **Root Directory** y poner `apps/web`.
2. **Root Directory** → `apps/web`; activar **"Include files outside the
   Root Directory"** (para que le lleguen `pnpm-lock.yaml`, `turbo.json`,
   `pnpm-workspace.yaml` y `tsconfig.base.json` de la raíz del monorepo).
3. **Build Command** → override manual a
   `cd ../.. && pnpm turbo run build --filter=web` (con Root Directory en
   `apps/web`, el comando por defecto de Vercel correría dentro de esa
   carpeta; hace falta subir a la raíz para invocar turbo, cuya tarea
   `build` depende de `content:validate` — con `pnpm --filter web build` a
   secas ese `content:validate` previo no corre).
4. **Environment Variables** → `ENABLE_EXPERIMENTAL_COREPACK=1`, para que
   Vercel use Corepack y respete la versión de pnpm fijada en
   `packageManager` (`pnpm@9.15.9`) en vez de la que trae su imagen por
   defecto — sin esto puede resolver una versión de pnpm distinta y romper
   el lockfile.
5. Mismas variables de entorno que en producción (tabla de arriba) — si
   este proyecto de prueba se despliega con `Production Branch` apuntando a
   `monorepo-migration`, sus builds corren con `VERCEL_ENV=production`, así
   que necesita también `NEXT_PUBLIC_TELEFONO` puesta o `verificar-landings.mjs`
   hace fallar el build (`NEXT_PUBLIC_WHATSAPP` no tiene ese mismo gate hoy,
   pero conviene ponerla igual para probar el sitio de verdad).
6. **Node.js Version** del proyecto → 22.x (mínimo real `>=22.6`, igual que
   `engines.node` en el `package.json` raíz: `check-env` y
   `content:validate` corren con `node --experimental-strip-types`, una
   flag de Node ≥ 22.6).
7. Revisar que no queden overrides de **Install/Build Command** de cuando
   este proyecto era una app plana con npm (`npm install`/`npm run build`):
   si están fijados a mano sobreviven a este cambio de Root Directory y
   rompen el build. **Install Command** puede quedarse en el default
   (`pnpm install`).
8. **No** asignar el dominio de producción a este proyecto de prueba —
   déjalo en su `*.vercel.app` (o un dominio de prueba aparte).

**Al hacer push de esta rama**, el proyecto de producción actual también
intentará un deploy de Preview con sus ajustes viejos de npm/raíz plana y
fallará — es inofensivo (no toca producción, que sigue sirviendo `main`) y
desaparece en cuanto se aplican los ajustes de arriba a ese mismo proyecto
o se fusiona la rama.

**Al fusionar** `monorepo-migration` a `main`: el proyecto de producción
necesita los MISMOS ajustes de arriba (Root Directory + "Include files
outside the Root Directory", Build Command, Corepack, Node 22.x, revisar
Install/Build Command) aplicados a la vez que se fusiona — si el merge
llega primero y los ajustes después, ese deploy de producción se construye
con la configuración vieja sobre una estructura de carpetas nueva y falla.

Esta sección es prescriptiva: ningún proyecto Vercel real se ha probado
todavía contra estos pasos — ver "Pendiente" más abajo.

## Adaptadores legacy

`apps/web/src/content/{modelos,landings,servicios,legal,faq}.ts(x)` y
`apps/web/src/lib/{config,datos,tipos,schema,eventos,cookies,meta-capi}.ts(x)`
llevan el comentario `legacy adapter, delete when a new design consumes
@site/* directly`: mismas formas y valores en español que antes de la
migración a monorepo, pero ahora leyendo de `@site/content`, `@site/seo`,
`@site/tracking` y `@site/config` por debajo. Se borran cuando el rediseño
consuma los paquetes `@site/*` directamente en vez de pasar por estas capas
de compatibilidad. Hasta entonces, **no tocar** `apps/web/src/app/**` ni
`apps/web/src/components/**` (congelados; salida pública debe seguir siendo
idéntica) — ver `CLAUDE.md`.

`apps/web/src/lib/limite.ts` no lleva esa etiqueta (no envuelve ningún
`@site/*`, es un limitador de tasa propio de este repo) y no forma parte de
esta lista, pero tampoco está enganchado al Server Action del formulario,
que mantiene su propia copia privada del límite de tasa — ver "Pendiente"
(D12).

## i18n

El contenido ya está localizado (`Localized<T>` en `@site/content`, con
`es` obligatorio y `en`/`fr`/`de` opcionales), pero solo `es` está publicado
hoy (`publishedLocales` en `@site/config/site.ts`). El enrutado por idioma
(`app/[locale]`, middleware, `next-intl`) queda **deliberadamente fuera de
esta migración**: es tarea del rediseño, junto con las rutas nuevas.
`packages/seo/src/canonical.ts` (`buildCanonical`/`buildAlternates`) está
construido para ese futuro pero no está enganchado en ningún sitio hoy.

## Pendiente

Técnico, heredado de fases anteriores de esta migración:

- **Duplicación del limitador de tasa (D12)**: `apps/web/src/lib/limite.ts`
  (compartible, con purga de claves) y la copia privada dentro de
  `app/presupuesto/actions.ts` (un módulo `'use server'` solo puede
  exportar funciones asíncronas, y el limitador es una función síncrona —
  por eso no se pudo importar sin más). Unificar las dos es tarea futura,
  deliberadamente no resuelta en esta migración.
- **Mejoras de SEO detectadas, no corregidas (D27/D10)**: la migración
  reproduce el comportamiento previo byte a byte, así que estas
  divergencias se REPORTAN, no se arreglan aquí — `packages/seo`:
  - `Service`'s JSON-LD no lleva `description` (el sitio pre-migración
    nunca la mandaba — ver `packages/seo/src/json-ld/service.ts`).
  - `areaServed` sale en dos formas distintas según el nodo: cadenas planas
    en `Service`, objetos `{'@type': 'AdministrativeArea', name}` en el
    negocio (`business.ts`) — mismo campo, dos formas.
  - `BreadcrumbList` no filtra los tramos intermedios sin ruta propia (ver
    `packages/seo/src/json-ld/breadcrumbs.ts` y el README de
    `scripts/verify`).
  - `FAQPage` lleva `publisher`: este sitio lo emitía ya antes de migrar; el
    `FAQPage` de Pavivasa no lo lleva.
  - `/zonas/xabia/` es `noindex` (sin foto todavía) pero sigue listada en
    `sitemap.xml` (`app/sitemap.ts` no filtra por `noindex`).
- **Preguntas de texto legal sin resolver**: `packages/content/src/legal/09-instrucciones-legales.md`
  deja varias respuestas pendientes de que el dueño confirme (art. 10.1.g
  LSSI: código de conducta al que esté adherida la empresa, si a alguno;
  art. 13.1.b RGPD: si hace falta delegado de protección de datos —
  probablemente no, el documento apunta que ningún supuesto del art. 37
  RGPD encaja, pero sin confirmar). Estas dos, más los datos registrales y
  el domicilio social, ya se publican hoy como `<DatoPendiente>` en
  `apps/web/src/content/legal.tsx` (filas CÓDIGOS DE CONDUCTA, DELEGADO DE
  PROTECCIÓN DE DATOS, DATOS REGISTRALES, DOMICILIO SOCIAL/DOMICILIO) —
  siguen entre corchetes hasta que el dueño responda, no hace falta ningún
  cambio de código cuando lo haga. Por separado, el comentario de
  `Consentimiento.tsx` señala que la sección 6, punto 3 de ese mismo
  documento pide que `pa_ref` no se escriba antes de que el visitante
  decida sobre las cookies — arreglar eso es otro encargo, fuera de esta
  migración (comportamiento idéntico al de antes de migrar).
  `data/legal.ts`'s `lastLegalReview` (`18 de septiembre de 2026`) es un
  valor fijo, no derivado de ningún control de versiones del texto legal:
  actualizarlo a mano cada vez que el texto cambie de verdad.
- **Copy del banner de cookies al reabrir**: `Consentimiento.tsx` usa el
  mismo texto ("antes de que decidas...") tanto en la primera visita como
  al reabrir el panel desde "Configurar cookies" en el pie, aunque quien
  reabre ya haya decidido antes. No se ha escrito un segundo texto para ese
  caso — heredado de antes de la migración, no tocado aquí (frontend
  congelado).
- **Residual de JS por duplicación de chunk (D26)**: tras la migración,
  ~+160 B uniformes en toda ruta (el accesor tipado único de `publicEnv`) y
  ~+550–690 B adicionales en las 13 rutas con formulario de presupuesto,
  porque webpack duplica `apps/web/src/lib/cookies.ts` (sin cambios desde
  antes de migrar) en el chunk del layout raíz y en el del formulario en
  vez de compartirlo — diagnosticado a nivel de chunk durante la migración
  (no queda documentado en el repo, solo en el scratchpad de esa sesión).
  Un intento de forzarlo a un chunk propio (WF3, D28e) empeoró las 52 rutas
  y se revirtió. Aceptado, no corregido: todas las rutas siguen muy por
  debajo del techo duro de 112 kB.
- **CI nunca ejecutado en un runner real**: esta rama no está en `origin`
  todavía. Todo lo que aquí se documenta como verde se ha probado en local.
- **Configuración de Vercel sin aplicar ni probar**: la sección "Vercel —
  monorepo" de arriba es prescriptiva, no verificada contra un proyecto
  real.
