# CLAUDE.md — Pavimentos Albufera

**Lee primero `ARCHITECTURE.md`** para el contexto general del repo (mapa, capas, paquetes, rutas, flujos, contratos externos) antes de tocar nada aquí.

Rediseño y migración de pavimentos-albufera.com de WordPress a Next.js 15.
La especificación completa está en `design/`. **Léela antes de escribir código.**

Desde esta fase, además, el repo es un monorepo pnpm + Turborepo (`apps/web`
+ paquetes `@site/*`) — ver la sección "Monorepo" más abajo.

- `design/README.md` — panorama, stack, orden de trabajo
- `design/01-sistema-de-diseno.md` — tokens y los 17 componentes base, con valores exactos
- `design/02-pantallas.md` — pantalla por pantalla, móvil y escritorio
- `design/03-modelo-de-contenido.md` — tipos, catálogo real, datos de obra
- `design/04-desarrollo-y-deploy.md` — rutas, redirecciones 301, schema, despliegue
- `design/05-pendientes-y-decisiones.md` — datos sin confirmar y decisiones tomadas
- `design/06-plan-rendimiento-y-medicion.md` — plan por olas: velocidad, medición y landings
- `design/07-auditoria-decisiones-y-veredictos.md` — el porqué del 06
- `design/Pavimentos Albufera.dc.html` — prototipo. **Referencia visual, no código a copiar**

## Reglas de este proyecto

**Diseño**

- Tokens: `#E9EAE6` fondo · `#DADCD6` fondo alterno · `#1B1E1C` tinta · `#5C625E` tinta media ·
  `#D9A441` pigmento · `#41535C` acero. No añadir colores.
- **Única excepción, y no se extiende: el logotipo.** Desde el 2026-09-01 la identidad es un
  archivo del dueño con dos azules propios (`#000D2A` y `#014BA2`), más `#8FB4D6` derivado para
  la variante clara. Empieza y acaba en `apps/web/public/marca/`: ningún texto, borde, fondo ni estado
  del sitio usa esos valores. → `design/01` §2.1
- **Segunda y última excepción: el verde de WhatsApp.** Desde el 2026-09-18, `#25D366` (y su
  `:hover` `#20B859`) son el fondo de los botones cuyo `href` abre WhatsApp, con el rótulo en
  `--tinta` — **8,48 : 1**, porque con blanco mide 1,98 y no pasa AA. Empieza y acaba ahí: ni
  texto, ni borde ajeno al botón, ni fondo, ni estado, ni foco. Lo decide `esEnlaceWhatsApp()`
  en `apps/web/src/lib/config.ts`, el mismo predicado con el que se cuenta un `whatsapp_click`.
  → `design/01` §2.1 y §3.16
- `border-radius: 0` en todo (regla sobre superficies; el dibujo de un icono o del logotipo
  puede llevar curvas). Una sola sombra en toda la web: la de la barra fija de móvil.
- Escala tipográfica cerrada: 12 / 14 / 16 / 20 / 26 / 34 / 46 / 64 / 88. Nada intermedio.
- Tres familias: Archivo Expanded (display), Instrument Sans (texto), Martian Mono (datos).
  Todo dato del oficio va en monoespaciada, en versalitas, con formato de etiqueta de
  especificación. Suelo absoluto de la monoespaciada: 10 px.
- **Regla del ocre:** dos roles por pantalla, un CTA primario y el estado activo. Nada más.
  El ocre nunca como texto pequeño sobre fondo claro.
- Layout siempre con flex/grid y `gap`. Nunca márgenes por elemento.

**Contenido**

- Copy solo del documento maestro. **No inventar texto, datos, testimonios ni reseñas.**
- Los datos sin confirmar se renderizan con `<DatoPendiente>` y se ven entre corchetes
  atenuados. Es intencionado: no maquillar un dato que no existe.
- Cero fotos de stock de personas. Sin originales, `<BloquePosicion>`.
- El nombre de archivo de una imagen no aparece nunca en pantalla.
- Un solo teléfono y una sola dirección en todo el sitio, desde configuración.

**Técnica**

- Componentes de servidor por defecto. `'use client'` solo donde hay estado real.
- **Presupuesto de JS inicial — unidad fijada el 2026-08-30.** Se mide en **brotli q11**, sumando
  archivo a archivo los `<script src>` sin `noModule` del HTML prerenderizado de cada ruta. **No es
  la columna de `next build`:** esa es gzip ‑9 y se calcula sobre `app-build-manifest.json`, que
  omite `chunks/444` y `chunks/app/layout` —7,5 kB brotli por ruta que las 45 páginas sí descargan.
  Tampoco se concatenan los archivos antes de comprimir: cada chunk es una respuesta HTTP
  independiente. El payload RSC en línea (`self.__next_f.push`, 68,9 kB crudos en la home) son
  bytes de HTML y quedan fuera de este número a propósito.
  - Suelo del framework con 0 B propios: **86,5 kB**. Suelo real del sitio, con `chunks/444` y
    `chunks/app/layout`, que las 45 rutas piden: **94,0 kB**.
  - Hoy: 97,1 kB las tres legales · 99,3 `/precios` · 105,7 la home · 107,1 las seis de servicio
    (máximo del sitio).
  - **Techo duro, rompe el build: 112 kB por ruta. Objetivo informativo: 105 kB.**
  - El presupuesto viejo de **cien kilobytes queda retirado**: con 94,0 kB de suelo dejaba 6 kB
    para todo el código propio del proyecto.
  - El **JS de terceros va aparte** y hoy es 0. `gtag.js` (146,9 kB br) y `fbevents.js`
    (110,1 kB br) no entran nunca en este número.
  - El techo es un detector de regresión determinista sobre nuestro bundle, no una afirmación
    sobre los bytes que entrega el CDN: Vercel no documenta su calidad de brotli. Con un preview
    desplegado se contrasta el `content-length` de
    `curl -sI -H 'Accept-Encoding: br' <preview>/_next/static/chunks/4bd1b696-*.js` contra 46.749.
- Sin librerías de animación, de iconos ni de formularios. Los dos iconos del sitio son SVG en
  línea, escritos a mano, en `apps/web/src/components/ui/Iconos.tsx`. → `design/01` §3.16
- `trailingSlash: true` fijo.
- Sin `AggregateRating` mientras no haya reseñas verificables.
- 44 px de objetivo táctil, foco de teclado visible siempre, contraste AA,
  `prefers-reduced-motion` respetado.
- Cada `[corchete]` sustituido por un dato real es un commit que además elimina su tratamiento
  visual.

## Estado — actualizado 2026-08-30

### 🆕 Auditoría de rendimiento y medición → `design/06`

El repo se ha auditado entero contra el encargo de velocidad + Google Ads + Facebook Ads.
**61 agentes, 132 hallazgos (24 críticos), 502 veredictos adversariales.** El plan ejecutable
está en `design/06-plan-rendimiento-y-medicion.md` y el porqué de sus decisiones en `design/07`.

🔴 **Nada del plan está ejecutado todavía, y el dueño no ha visto ni un hallazgo.** Antes de
tocar código, leer la sección «Cómo se hizo este plan» del 06: dice qué no está verificado.
La prueba 1.25 en un iPhone real es lo primero, porque si falla se cae el mecanismo primario
de toda la arquitectura de medición.

Los cuatro hallazgos que reordenan el trabajo:

- 🔴 **`/proyectos/` y `/acabados/` sirven un HTML sin contenido.** `useSearchParams()` en los
  filtros bota la frontera a cliente: **0 `<img>`** en su HTML frente a 23 en la home. Las 9
  tarjetas de obra y las 16 muestras, con sus 25 enlaces internos, no existen hasta que hidratan
  ~124 kB. De esos dos índices cuelgan 17 de las 47 rutas.
- 🔴 **El hash del teléfono que va a Meta CAPI no lleva prefijo de país.** Empareja **0 % en el
  100 % de los envíos**. Es el único dato fuerte que este negocio captura siempre.
- 🔴 **Todo lo que mide llamadas y WhatsApp vive en `useEffect`**, y los CTA se pintan en servidor.
  En esa ventana un toque pierde el evento, el `reference_code` y el `gclid`. Decisión tomada:
  se mide con el atributo HTML **`ping`** contra `app/api/evento/route.ts`, que **funciona sin
  hidratar**; `sendBeacon` queda de respaldo. → `design/07`
- 🔴 **El honeypot fabrica las conversiones falsas que debía evitar:** devuelve éxito y el cliente
  dispara `form_submit` y `Lead` desde ahí. Y el `catch` de Resend hace `return`, así que un fallo
  de email cancela también Telegram y CAPI, sin ningún punto previo donde el lead quede grabado.

⚠️ **El presupuesto de cien kilobytes queda retirado por inalcanzable** y se sustituye por brotli
q11 con techo duro de 112 kB por ruta. Nadie había fijado la unidad: se llevaba meses midiendo
contra un número que no existía. → `design/07`

---

### Estado anterior — 2026-08-29

Auditoría del repo contra el plan de medición, y su implementación. Build, lint y `tsc` limpios;
**47 rutas, todas estáticas** — cifra de aquella sesión. Tras la ola 1 son **51 estáticas
(49 HTML + `robots.txt` + `sitemap.xml`) y 1 dinámica, `/api/atribucion/`**: 1.28 añade las
cuatro landings `/lp/` y 1.19 el primer route handler del repo.

**Las seis páginas de servicio existen ya.** `design/04` §1 especificaba seis y solo se había
construido `/hormigon-impreso/`. Las otras cinco faltaban, y por eso **10 de las 33 redirecciones
301 aterrizaban en un 404**. Ahora hay una plantilla única —`apps/web/src/components/secciones/PaginaServicio.tsx`
+ `apps/web/src/content/servicios.tsx`— que consume impreso también: una plantilla, no seis copias.

🔴 **`next build` NO valida los destinos de `redirects()`.** Un build limpio convive perfectamente
con treinta y tres redirecciones de las que diez son 404. Por eso existe
`apps/web/scripts/verificar-redirecciones.mjs`, que corre encadenado en el `build` de `apps/web`
(D3 de la migración a monorepo — antes corría como `postbuild`, ese hook se retiró para que no
corriera dos veces) y **falla el build** si un destino no está entre las rutas realmente
generadas. Contrasta contra rutas concretas, no contra patrones dinámicos: es la diferencia entre
saber que existe `/zonas/[municipio]` y saber que existe `/zonas/alicante` — que no existe, y no
debe existir.

**Medición.** El contrato de eventos vive entero en `apps/web/src/lib/eventos.ts`: nombres y
parámetros en inglés `snake_case`, contenido en español. Si un nombre no está ahí, no se manda.
Desde la migración a monorepo, el envío en sí (`gtag`/`fbq`) sale de `@site/tracking`'s
`trackEvent`; este archivo sigue siendo el único punto de entrada de `apps/web`, con la
deduplicación por sesión (`EVENTOS_UNA_VEZ_POR_SESION`, prefijo `pa_evt_`) igual que antes.

- `phone_click` · `whatsapp_click` · `email_click` · `form_submit` · `calculator_use` ·
  `samples_filter` · `scroll_depth` · `faq_open`
- **`click_location` viaja en `data-ubicacion`** sobre cada CTA. `EventosGlobales.tsx` delega el
  clic en `document` y lo lee de ahí, así que `Pie`, `BarraMovil` y las páginas siguen siendo
  componentes de servidor. `Boton` ya hace spread de props, no hay que tocarlo.
- ⚠️ **Cada parámetro nuevo necesita su dimensión personalizada registrada en GA4 ANTES del
  primer tráfico.** GA4 no rellena dimensiones hacia atrás; lo que llegue antes se pierde.

**Consent Mode v2 avanzado.** Los cuatro permisos arrancan `denied` y pasan a `granted` al aceptar.
El estado vive en **cookie de primera parte**, no en `localStorage`, porque el Server Action tiene
que leerlo. ⚠️ **El bloque `consent default` está en `apps/web/src/app/layout.tsx` y carga `gtag.js`
él mismo, en su última línea, a propósito**: al dejárselo a `next/script` Next colocaba gtag.js
antes que el bloque, y un `consent default` que llega después de que gtag.js vacíe la cola de
`dataLayer` no sirve de nada. El Pixel de Meta sigue con bloqueo duro: no tiene equivalente de
Consent Mode. Desde la migración a monorepo, la plantilla exacta del script sale de
`buildConsentDefaultScript` (`@site/tracking/consent-mode`); `layout.tsx` solo la invoca — mismo
byte a byte que antes, comprobado en la migración.

**Atribución.** `Atribucion.tsx` guarda `gclid`/`gbraid`/`wbraid`/`utm_*` en cookie (primer toque
gana) y genera un `reference_code` de 6 caracteres que inyecta en el mensaje prellenado de los
enlaces `wa.me`, junto con la página de origen. El sitio es estático y los CTA son componentes de
servidor, así que el href no puede llevar un código por visitante: se parchea tras hidratar.

**Formulario.** Tres cosas que estaban mal y ahora no:

- La foto adjunta se descartaba en silencio. ⚠️ El tope son **4 MB, no los 10 de `design/04` §6**:
  Vercel corta el cuerpo de una función en 4,5 MB y los Server Actions se ejecutan como función.
- La casilla de privacidad no se validaba en servidor y **no existía en la variante corta**, que
  recoge nombre y teléfono igual que la larga.
- La CAPI de Meta se disparaba sin comprobar el consentimiento. El email y el aviso de Telegram sí
  salen siempre: son la ejecución del servicio pedido, no publicidad.

**FAQ.** Estaba copiada literalmente en tres archivos; ahora el catálogo está en
`apps/web/src/content/faq.ts` con `tema` obligatorio en el tipo (desde la migración a monorepo, el
pool de preguntas en sí vive en `packages/content/src/data/faq.ts`, y este archivo es el adaptador
legacy que lo recompone). ⚠️ **Cada servicio compone su propia lista en
`apps/web/src/content/servicios.tsx`, y no hay una compartida**: `grietas` y `sobreExistente`
nombran el hormigón impreso dentro del texto,
y al ponerlas en las seis páginas `/microcemento/` acababa preguntando si se agrieta el hormigón
impreso. `/microcemento/` no lleva FAQ porque ninguna pregunta del catálogo le aplica sin
reescribirla, y reescribirla es copy nuevo.

**Fotografía. La web ya se ve.** `apps/web/src/components/contenido/Foto.tsx` envuelve `next/image`
y **cae en `<BloquePosicion>` cuando no hay imagen**: ninguna pantalla decide entre foto y hueco,
pide la foto y el componente resuelve. Por eso el tratamiento de pendiente sigue apareciendo solo
donde falta el original de verdad —`xabia-pulido`, el hueco `ANTES`, seis de los dieciséis
acabados— y no hay que acordarse de quitarlo.

Los datos viven en los campos que el modelo de contenido ya tenía: `Proyecto.imagenes[]`,
`Acabado.muestra` (ampliado de `string` a `Imagen`, para que el `alt` no sea opcional),
`Articulo.imagenApertura`, más `Servicio.imagenHero`/`imagenTarjeta` en
`apps/web/src/content/servicios.tsx` y `apps/web/src/content/modelos.ts` para el hero de
`/acabados/[modelo]/`. La zona deriva la suya del primer proyecto: no hay dato nuevo. (Estos son
los nombres de tipo/campo de cuando el contenido vivía en JSON, en la fecha de esta entrada; desde
la migración a monorepo el contenido real vive en `packages/content/src/data/*.ts` en inglés —
`Project.images`, `Finish.sample`, `Article.openingImage`… — y estos archivos de `apps/web/src/content/`
son los adaptadores que conservan los nombres de aquí para el resto de `apps/web`.)

- Las **125 fotos se han abierto una a una** y los 14 `alt` de la raíz están reescritos
  describiendo la foto, no el proyecto. **15 no se usan y no se borran**: 6 de stock, 8 de pistas
  de pádel —otro negocio— y un collage. Todo anotado en `apps/web/public/obras/INVENTARIO.md`.
- Las de `_sin-atribuir/` se citan **con su nombre original**. Renombrarlas al patrón de la raíz
  afirmaría municipio y año que nadie ha confirmado; el nombre no se ve en pantalla.
- 🔴 **`next build` tampoco valida el `src` de `next/image`.** Un `src` mal escrito compila limpio
  y en producción es un hueco vacío. `apps/web/scripts/verificar-imagenes.mjs` corre encadenado en
  el `build` de `apps/web`, junto al de las redirecciones (ver nota de D3 más arriba), y falla el
  build.
- ✅ **El umbral fotográfico ya no es una cifra inalcanzable.** `design/05` §C #13 (2026-08-29)
  retira los 2400 px —que **ninguna de las 164 originales cumple**— y pone tres, verificados
  midiendo el archivo: **suelo 800 px** y **1600 px a sangre** fallan el build; **objetivo 1600 px**
  solo informa. La etiqueta del bloque de posición dice ahora «ORIGINAL A 1600 PX».
- 🔴 **Y el número que hay que mirar no es cuántas cumplen, sino cuáles no.** Las 19 de 35 que no
  llegan al objetivo son **las de obra documentada** —898 a 1200 px, salvo Denia a 2048— y son
  justo las que `apps/web/src/app/proyectos/[slug]/page.tsx:61` sirve **a sangre**, `sizes="100vw"` en 21/9.
  Las de 1600+ son casi todas de `_sin-atribuir/`: **la foto que mejor se ve es la que menos se
  puede afirmar.** Eso, y no el umbral, es lo que justifica una sesión nueva.
- El presupuesto de JS sube de **111 a 116 kB** en la home —de los que `next/image` pone ~5—, pero
  esa cifra es **ámbito de la tabla de `next build`**: gzip ‑9 sobre `app-build-manifest.json`, sin
  `chunks/444` ni `chunks/app/layout`. Las tres cifras de ese build, según `design/07`: **407,4 kB
  crudos / 124,2 kB gzip ‑9 / 105,7 kB brotli q11**, dentro del techo de 112 kB.

### Pendiente, y no es código

- 🔴 **Propiedad GA4 propia** (no la de la web viva: es otro negocio) + dimensiones registradas.
- 🔴 **Sesión fotográfica de las 8 obras documentadas, a 1600 px o más.** Ya no es «revisar el
  umbral» —eso está decidido—, es material que falta y tiene destinatario concreto: las fotos que
  van a sangre en `/proyectos/[slug]/`.
- 🔴 **`xabia-pulido` está publicado sin ninguna foto**, y no hay ninguna candidata en la mediateca.
  **Decidido el 2026-08-29: se queda con el hueco honesto de `<BloquePosicion>`.** Retirarlo no era
  borrar una entrada de `proyectos.json`: `/zonas/xabia/` cuelga solo de él y es destino de la 301
  de `/hormigon-pulido-en-xabia/`, así que quitarlo degradaba una URL de zona a una de servicio.
- 🔴 **Pistas de pádel en la mediateca de Pavimentos:** las 8 fotos más nuevas de la web viva son de
  Padel Albufera. No se usan aquí. Es del dueño saber por qué están ahí.
- ⚠️ **`impreso-manta-gris`:** sus dos fotos no enseñan la textura de roca de montaña que anuncia el
  modelo. Contrastar el modelo con el dueño.
- ⚠️ **Ninguna foto de ANTES** en las 125. El hueco de la galería de proyecto se queda pendiente.
- ⚠️ **`/microcemento/` y `/hormigon-desactivado/` siguen sin un solo proyecto documentado**, aunque
  ya tengan foto de portada.
- ⚠️ **Decisión 6 de `design/05` §C sin contestar** (¿caucho como «Obra pública» o se retira?).
  `/pavimentos-de-caucho/` va provisionalmente a `/`.

## Comandos

Desde la migración a monorepo (ver "Monorepo" más abajo), este repo usa pnpm + Turborepo, no
`npm`. Ver el `README.md` de la raíz para la lista completa; el resumen para trabajar en `apps/web`:

```bash
pnpm dev                # turbo run dev
pnpm build               # turbo run build — apps/web encadena next build con sus 5
                          # verificadores (redirecciones, imágenes, presupuesto de JS,
                          # LCP visible, landings) en su propio `build`, no en un `postbuild`
pnpm lint
pnpm typecheck
pnpm content:validate      # Zod sobre packages/content — corre solo, o como parte de
                            # `pnpm build`/`turbo run build` (no de `pnpm --filter web build` a secas)
pnpm verify                  # verificadores raíz (D29) sobre un build ya hecho
```

Gates antes de cada commit: `content:validate` → `lint` → `typecheck` → `build` → `verify` (y
`verify:secrets` si se tocó algo de tracking/env) — debe pasar sin warnings.

Para probar la medición en local hace falta `apps/web/.env.local` con `NEXT_PUBLIC_TELEFONO`,
`NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_GA_ID` y `NEXT_PUBLIC_META_PIXEL_ID` (ver "Desarrollo local"
en el `README.md` de la raíz para cómo crearlo). **Con las variables vacías no se renderiza ni un
solo `tel:` o `wa.me`** y `trackEvent` (`@site/tracking`, vía `apps/web/src/lib/eventos.ts`) es un no-op
silencioso para lo que dependa de esos IDs: todo parece funcionar sin hacer nada.

## Monorepo

Migración a pnpm + Turborepo (misma plantilla que `pavivasa`): la app pasó de la raíz a
`apps/web`, y el contenido/SEO/tracking/entorno se extrajeron a paquetes `@site/*`
(`packages/content`, `packages/seo`, `packages/tracking`, `packages/config`). Ver el
`README.md` de la raíz para estructura, comandos y despliegue en Vercel, y
`ARCHITECTURE.md` para el mapa completo. Reglas específicas de esta fase, además de todo
lo de arriba (que sigue vigente sin cambios):

- **Frontend congelado.** `apps/web/src/app/**` y `apps/web/src/components/**` no se tocan
  mientras dure esta fase: la salida pública tiene que seguir siendo byte-idéntica a la de
  antes de migrar. Un fix real ahí va a `scripts/verify/known-issues.json` con su motivo, no
  al código.
- **Los adaptadores legacy** de `apps/web/src/lib/` y `apps/web/src/content/` (comentario
  `legacy adapter, delete when a new design consumes @site/* directly`) se borran cuando el
  rediseño consuma `@site/*` directamente. Hasta entonces, mismas formas y valores en
  español que antes de migrar — no renombrar ni "limpiar" su API aunque parezca redundante.
  Ver "Adaptadores legacy" en el `README.md` de la raíz para la lista.
- **Contenido solo por `@site/content`.** Todo dato del negocio (servicios, acabados,
  modelos, zonas, proyectos, artículos, FAQ, landings, hechos legales) vive en
  `packages/content/src/data/*.ts` y se lee a través de `packages/content/src/queries/*.ts`
  — nunca `data/` directo desde `apps/web`, salvo los subpaths de datos-solo documentados en
  el README de `@site/content` para los adaptadores alcanzables desde cliente. Después de
  cualquier cambio de contenido: `pnpm content:validate`.
- **Un export por archivo en todo módulo alcanzable desde cliente.** Un módulo que un
  componente `'use client'` importa no se separa por *función* (dos funciones en el mismo
  archivo siguen tirando del árbol entero) — se separa por **archivo**; un `index.ts`
  reexporta cada pieza desde su propio módulo hermano. Encontrado y medido durante esta
  migración (ver `packages/tracking/README.md`'s "Layout").
- **Import por subpath de datos, nunca por el barrel, en un adaptador alcanzable desde
  cliente.** `apps/web/src/lib/config.ts` y `apps/web/src/lib/tipos.ts` importan hojas de
  datos concretas (`@site/content/business-data`, `@site/config/env`…), no `@site/content`
  ni `@site/config` a secas: el barrel arrastra un resolver genérico (`pickLocalized`,
  Zod…) que no se puede eliminar del bundle aunque no haga falta — coste medido durante la
  migración (~+320 B por ruta, en las 52 rutas del sitio, antes de este mismo ajuste), no
  hipotético.
- **`NEXT_PUBLIC_*` solo como literal exacto** (`process.env.NEXT_PUBLIC_X`), nunca dinámico
  (`process.env[nombre]`) — es la única forma que Next.js sustituye en build para el bundle
  cliente. Ver `packages/config/src/env.ts`.
- **Secretos de servidor, solo a través de `@site/config/server`** — nunca `process.env`
  directo fuera de ese paquete, y nunca desde un módulo que un componente `'use client'`
  pueda alcanzar. `EMAIL_DESTINO` (destino del lead) se lee solo en
  `apps/web/src/app/presupuesto/actions.ts`; el email público del NAP
  (`apps/web/src/lib/config.ts`) sale solo de `@site/content`, sin override de entorno — son
  dos cosas distintas a propósito.
- **Identificadores, nombres de archivo y comentarios de `packages/*` y del código nuevo, en
  inglés.** Contenido, copy y slugs de URL, en su idioma real (español hoy). Prosa de
  documentación para humanos (READMEs, este archivo) puede ir en español; los identificadores
  citados dentro se dejan tal cual están en el código.
- **Gates antes de cada commit**, en este orden: `content:validate` → `lint` → `typecheck` →
  `build` → `verify` (y `verify:secrets` si se tocó algo de tracking/env). Ver "Comandos"
  arriba y el `README.md` de la raíz.
- **Cualquier variable de entorno nueva que lea el código** va también a
  `apps/web/.env.example` (con comentario) y a `globalEnv` en `turbo.json`.

## Si algo no encaja

Si un componente aprobado no aguanta en un contexto nuevo, **no improvises una excepción**:
créalo en el mismo lenguaje, añádelo a `design/01-sistema-de-diseno.md` y dilo en el commit.
El sistema tiene que seguir siendo describible al terminar.
