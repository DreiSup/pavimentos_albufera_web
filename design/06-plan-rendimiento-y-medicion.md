# Plan ejecutable — Pavimentos Albufera
### Velocidad, medición y landings de campaña · 2026-08-30 · rama `trabajo/auditoria-medicion-y-servicios`

## BLUF

El sitio es rápido en lo que ya está resuelto —47 rutas prerenderizadas, 103 kB de suelo de chunk compartido que Next 15.5 no permite recortar— pero incumple su propio presupuesto (**105.737 B brotli q11 en la home —124.195 gz, 407.389 crudos—, contra un techo declarado de 100 kB que resulta inalcanzable: el suelo del sitio con cero código propio es 94,0 kB br11**), sirve **49 secciones con `opacity: 0`** que solo aparecen si hidrata React, y su medición es hoy una maqueta: con `NEXT_PUBLIC_TELEFONO` y `NEXT_PUBLIC_WHATSAPP` vacías **los 45 HTML generados no contienen ni un solo `tel:` ni un solo `wa.me`**, así que `phone_click` y `whatsapp_click` son estructuralmente indisparables y nada lo avisa.

El problema más grave no es de velocidad: es que **los dos canales que dan dinero —llamada y WhatsApp— no tienen ninguna pata de servidor**. `lib/meta-capi.ts:44` tiene `event_name: 'Lead'` a fuego y su `hash()` es privado, `grep -rn enviarEventoCAPI` devuelve solo el Server Action del formulario, y todo lo que instrumenta un clic saliente corre en `useEffect` (`EventosGlobales.tsx:16`, `Atribucion.tsx:53`): el lead sale del navegador y no vuelve nunca, y el único canal con círculo cerrado es el formulario, que el propio dueño declara minoritario.

El cambio de mayor retorno es **un único Route Handler `app/api/evento/route.ts` alcanzado por el atributo `ping` del ancla —renderizado en servidor, sin depender de la hidratación— con `navigator.sendBeacon` como respaldo, más generalizar `lib/meta-capi.ts` para que sepa emitir `Contact` y no solo `Lead`**: eso convierte los tres canales en filas de servidor con `event_id` compartido, y es el único cambio del que cuelgan la CAPI de llamada y WhatsApp, la deduplicación con el Pixel y cualquier importación offline futura.

---

## Lo que ya está bien y no hay que tocar

- **El bloque de `consent default` de `app/layout.tsx:53-59` y su autoinyección de `gtag.js` en la última línea.** Está así a propósito: con `next/script`, Next colocaba `gtag.js` antes del `consent default`, y un default que llega después de que gtag.js vacíe la cola de `dataLayer` no sirve de nada. Consent Mode v2 avanzado bien resuelto.
- **El bloqueo duro del Pixel de Meta** (`Consentimiento.tsx:29-30`). Meta no tiene equivalente de Consent Mode; el bloqueo duro es la práctica correcta y está documentada por la AEPD.
- **Los dos verificadores de `postbuild`** — `scripts/verificar-redirecciones.mjs` y `scripts/verificar-imagenes.mjs`. Rompen el build sobre cosas que `next build` no valida. El patrón es correcto y se replica, no se sustituye.
- **Las 33 redirecciones y `next.config.ts`.** No se tocan: `verificar-redirecciones.mjs` lee `.next/routes-manifest.json` y moverlas a un `vercel.json` lo dejaría ciego. (Nota de precisión: `permanent: true` emite **308**, no 301.)
- **`components/contenido/Foto.tsx` cayendo en `<BloquePosicion>`** cuando no hay imagen. Ninguna pantalla decide entre foto y hueco.
- **`lib/eventos.ts` como catálogo único tipado**, con `tipoDispositivo()` basado en `pointer: coarse` (`:91`) y no en user-agent. Es exactamente el criterio que hace falta para no contar un `tel:` de escritorio.
- **`components/secciones/PaginaServicio.tsx`**: ya es una landing parametrizada con secciones opcionales. Se extiende, no se clona.
- **`<Cabecera />` en el layout raíz.** Sacarla rompe `--cabecera-actual` (que solo actualiza `Cabecera.tsx:31`) para `BarraConfianza`, `SubmenuServicio`, `FiltrosAcabados` y `FiltrosProyectos`, y destruye el punto único de render del teléfono que el DNI de Google Ads necesita para el swap. Ver «Lo que NO recomiendo».
- **El eje `axes: ['wdth']` de Archivo.** Se usa de verdad (`app/globals.css:132-142`, cuatro reglas `font-stretch` 115–125 %), y quitarlo no ahorra nada: se reconstruyó el repo con el eje comentado y salió **el mismo hash y los mismos 90.096 B**.
- **`@vercel/speed-insights`**: ~8 kB comprimidos en total, es el único tercero con retorno hoy y encaja en la exención de consentimiento (hay que documentarlo, no quitarlo).
- **Las 90 fotos huérfanas de `public/obras/`** (37,00 MB de 51 MB). `fotos-origen/` está en `.gitignore`: moverlas ahí las borra del repositorio, y de ellas cuelgan tres decisiones abiertas del dueño (xabia-pulido, las 7 obras identificables sin confirmar, Padel Albufera).
- **`xabia-pulido` publicado con el hueco honesto de `<BloquePosicion>`.** Decidido el 2026-08-29; `/zonas/xabia/` cuelga solo de él.
- **La cookie `pa_consent` de primera parte** en vez de `localStorage`: es lo que permite al Server Action leer el consentimiento.
- **El Server Action** en lo estructural: validación con zod, honeypot, límite por IP, cookie legible en servidor. Los fallos son puntuales y están listados abajo, pero el esqueleto no se rehace.
- **Quedarse en Next 15.5.22** y en `typescript: ^5.7.3`. Next 16 elimina las métricas de tamaño de `next build` y TypeScript 7 rompe el build de 15.5.

---

## Hallazgos confirmados, ordenados por impacto

Solo lo que quedó **CONFIRMADO** o **MATIZADO**. Donde hubo matización, la fila enuncia la versión **corregida**. Se recorren las 12 dimensiones. Donde no hay cifra, dice «no medido»: es un resultado, no una laguna que suavizar.

### Bloque A · Los dos canales que dan dinero (dimensiones 7, 9, 4)

| Hallazgo | Evidencia | Impacto cuantificado | Esfuerzo | Riesgo |
|---|---|---|---|---|
| Sin las dos variables de entorno el sitio publica 45 páginas con CERO caminos de teléfono y WhatsApp | `lib/config.ts:19-23`; 45 HTML de `.next/server/app` con 0 `href="tel:` y 0 `wa.me` | **186 anclas degradadas, 94 de ellas muertas**; `phone_click`/`whatsapp_click` indisparables por construcción | trivial (poner variables) | ninguno |
| No existe gate de `postbuild` que impida publicar sin teléfono ni WhatsApp | `scripts/` solo tiene `verificar-redirecciones.mjs` y `verificar-imagenes.mjs` | El patrón ya está montado para dos cosas y falta para la tercera; hoy un despliegue sin canal pasa limpio | trivial | ninguno |
| Llamada y WhatsApp no tienen evento de servidor: `Contact` vive solo en el navegador y sin `event_id` | `lib/meta-capi.ts:44` (`event_name:'Lead'` a fuego) y `:3-5` (`hash()` privado); `EventosGlobales.tsx:24-41` no pasa `metaEventId`; no existe `app/api`, ni `middleware.ts`, ni `sendBeacon` en el repo | 2 de los 3 canales sin contraparte de servidor; `lib/eventos.ts:116` cae en `fbq(...)` sin `{eventID}` | moderado | medio: es el cimiento del que cuelga todo lo demás |
| El teléfono se hashea sin prefijo de país: el 100 % de los hashes que recibe Meta son inservibles | `lib/meta-capi.ts:29` sobre `actions.ts:25-26` (`.replace(/^34/,'')` + `/^\d{9}$/`) | Ejecutado: `612345678` → `d500e1b5…` vs `34612345678` → `11f976ff…`. **Fallo sistemático al 100 %**, no ocasional | trivial | bajo — no tocar el `^34` de `actions.ts:25`, alimenta el `refine`, el email y Telegram |
| Teléfono, WhatsApp y email colapsan en un `Contact` indistinguible | `EventosGlobales.tsx:26`, `:31`, `:39` pasan los tres `metaEstandar:'Contact'`; `lib/eventos.ts:111` descarta el nombre interno | Meta no puede optimizar al canal que da dinero. WhatsApp se separa solo de forma frágil (lleva `reference_code`, `:34`); tel y email son indistinguibles | trivial | ninguno |
| La captura del `gclid` está gateada por la hidratación, y se pierde por un camino concreto | `Atribucion.tsx:37-51` (**primer** `useEffect`, dependencias `[]`; el `:53` es el otro, el del `reference_code` con dep `[pathname]`) | Un clic pre-hidratación sobre un `<Link>` interno —el CTA de héroe `/presupuesto/` está en el **byte 7.265**, visible en el primer viewport móvil— o sobre un `wa.me` navega a una URL estática sin `?gclid=`: **`pa_attr` no se escribe nunca**. El clic en «Llamar» no es uno de esos casos | moderado | medio |
| El `href` de `wa.me` se sirve SIN código de referencia y solo se parchea tras hidratar | `Atribucion.tsx:60`, `:69` | El ancla de WhatsApp de la barra fija está en el **byte 78.478** (bloque `sticky bottom-0` en el 78.201): la barra se pinta antes de lo estimado, la ventana de carrera es **más ancha** de lo que decía la auditoría | moderado | medio |
| El CTA de WhatsApp del menú móvil NUNCA lleva `reference_code` | `MenuMovil.tsx:106` se monta desde `Cabecera.tsx:98` **después** del parche de `Atribucion.tsx:53` (`useEffect` con dep `[pathname]`), y `Cabecera.tsx:34-36` cierra el menú justo al cambiar `pathname` | Fallo permanente por construcción (latente mientras la variable esté vacía) | trivial | ninguno |
| Los dos CTA de WhatsApp del layout están rotos, cada uno de forma distinta | `BarraMovil.tsx:15` (sin reference_code) y `MenuMovil.tsx:106` (nunca parcheado) | 2 de los 3 caminos globales de WhatsApp | trivial | ninguno |
| **Seis** `href='#'` muertos cuando falta el teléfono: cuatro de teléfono y **dos de WhatsApp** | `Pie.tsx:23`, `Cabecera.tsx:76`, `app/presupuesto/page.tsx:42` y `:56` (teléfono); `app/presupuesto/page.tsx:45` y `:59` (WhatsApp, `nap.whatsappHref ?? '#'`) | 6 enlaces muertos que `EventosGlobales` ni siquiera captura — **94 ocurrencias de `href="#"` medidas** en los 45 HTML. Los **seis** que sí degradan bien a `/presupuesto/` son `BarraMovil.tsx:8` y `:15`, `MenuMovil.tsx:103` y `:106`, `app/page.tsx:488` y `:491` | trivial | ninguno |
| 43 de las 45 páginas no tienen ningún CTA de contacto propio de la página | Solo los tres caminos globales: cabecera, pie y barra fija | **6 de las 15 `UBICACIONES` no se emiten jamás**: `hero`, `section_mid`, `faq_end`, `project_detail`, `samples`, `pricing`. (`quote_page` y `service_close` sí viajan, como `form_location`; `mobile_menu` como `click_location`) | moderado | medio: toca pantallas especificadas en `design/02` §A2 (línea 56) |
| `'unmarked'`, que existe como alarma de CTA sin marcar, no puede dispararse nunca | Las tres ramas de `EventosGlobales.tsx`; 0 anclas `tel:`/`wa.me`/`mailto:` sin `data-ubicacion` en el HTML | La alarma está apagada. Nota: desde `actions.ts:36` tampoco es alcanzable — el `<input type="hidden" name="origen">` de `FormularioPresupuesto.tsx:114` sí se renderiza con su valor; el campo que llega vacío sin hidratar es `evento_id` | trivial | ninguno |
| Ningún evento del repo usa `sendBeacon` ni `keepalive` | 0 ocurrencias verificadas | El riesgo real de entrega es solo `whatsapp_click` (`wa.me` es navegación https que destruye el documento). `phone_click` y `email_click` hacen traspaso al SO y dejan la página viva | trivial | bajo |
| `device_type` se calcula bien pero no limpia la señal de puja | `lib/eventos.ts:89-92` | Sirve para segmentar informes, no para separar lo que se importa a Ads: un `phone_click` de escritorio envenena la acción de conversión | trivial (panel) | ninguno |
| Cero seguimiento de conversiones de Google Ads en el repo | Sin `AW-`, sin `send_to`, sin Enhanced Conversions | Y el guard de `app/layout.tsx` **solo mira `sitio.gaId`**: si mañana se configura solo el `AW-`, gtag.js no se carga y **nada de Ads funciona**, en silencio | grande | medio |
| El `reference_code` no cierra ningún círculo | `TRAMPA 1` confirmada: nadie lo lee de vuelta | Para un lead de WhatsApp o de teléfono **nada llega jamás a un servidor**. El círculo se cierra solo si el humano que contesta lo copia | grande | alto: la parte que falta es proceso, no código |
| El mensaje prellenado de WhatsApp se congela con la primera página visitada | Guarda de idempotencia de `Atribucion.tsx:63` (`if (enlace.dataset.referencia) continue`) | La página de origen que llega por WhatsApp miente en toda navegación posterior a la primera | trivial | ninguno |
| La cabecera esconde el teléfono a los 40 px de scroll y en móvil no lo muestra nunca | `Cabecera.tsx`; el nodo cuelga de `<div class="hidden md:flex …">` | **No es un defecto: es `design/02` §B9 (línea 365)**, decisión aprobada. Cambiarlo es enmendar la especificación. El número sí es legible en móvil en el pie (`Pie.tsx:23-25`) | trivial | alto de proceso: exige actualizar `design/01` y decirlo en el commit |
| `fbclid` no se captura en ninguna parte, y `_fbc` puede no existir nunca | 0 ocurrencias en el repo | Si el usuario acepta después de navegar, la cookie `_fbc` no llega a crearse y la CAPI pierde su mejor identificador | moderado | medio (legal: hay que aplazar en memoria hasta aceptar) |
| Advanced Matching mínimo: 2 identificadores de los 7 que el código ya tiene | `lib/meta-capi.ts` | 5 identificadores desperdiciados. `external_id` con `pa_ref` es directo; `country: [hash('es')]` también; **`ct` NO** con el `hash()` actual — el municipio necesita normalización previa (minúsculas, sin espacios, sin acentos) | trivial | bajo |

### Bloque B · Velocidad, CWV y frontera cliente/servidor (dimensiones 0, 1, 2, 3, 5, 6)

| Hallazgo | Evidencia | Impacto cuantificado | Esfuerzo | Riesgo |
|---|---|---|---|---|
| `md:py-22` y `md:pb-22` se usan 51 veces y **la clase no existe** | 51 usos exactos en 12 ficheros (`app/page.tsx` 11, `PaginaServicio.tsx` 9, `zonas/[municipio]` 6, `precios` 5, `acabados/[modelo]` 4, `empresa` 4, `proyectos/[slug]` 3, `blog/[slug]` 3, `acabados` 2, `blog` 2, `proyectos` 1, `not-found` 1); `tailwind.config.ts:6` no define `22`; `grep -o 'py-22'` sobre el CSS servido = **0** | **50 de 51 secciones se quedan en `py-9` = 36 px en escritorio** (la de `not-found.tsx:12` cae en 3,5 rem). Toda la respiración vertical de escritorio está rota | trivial | ninguno: `theme.extend.spacing` alimenta las utilidades en Tailwind 3.4 |
| `/proyectos/` y `/acabados/` sirven un HTML sin contenido | `app/proyectos/page.tsx:34-42` y `app/acabados/page.tsx:45-47` con `<Suspense>` sobre `useSearchParams()` (`FiltrosProyectos.tsx:29`, `FiltrosAcabados.tsx:23`); el HTML lleva `<template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING">` | `grep -c '<img'` = **0** en ambos, frente a **23** en `index.html`. 9 tarjetas + 16 muestras invisibles hasta hidratar 123,8 / 125,5 kB. **Corrección:** Googlebot NO pierde las 17 rutas hijas (están en otros HTML y en las 44 URLs del sitemap); lo que se pierde es el enlazado interno desde el índice, el render percibido y el CLS al hidratar → **tarea 1.27** | moderado | medio: **no basta cambiar la lectura por `window.location.search`** — `router.push` cambia la URL sin remontar, hay que llevar el filtro a estado de React y sincronizar la URL desde ahí |
| `.aparece { opacity: 0 }`: el contenido se sirve invisible | `app/globals.css:109-115`, literal en el CSS compilado; `Aparece.tsx:19` `useState(false)`, `:40` | **49 secciones** en el sitio; hasta **11 por página**; **9 en una página de servicio**; en las 17 rutas de proyecto/acabado el primer `.aparece` va antes del primer `<h1>`. No hay `<noscript>` en todo el repo | trivial (local) / grande (global) | **`@media (scripting: none)` no basta**: cubre JS deshabilitado, no JS caído o hidratación rota. ⛔ ~~Y cualquier arreglo con `animation-timeline` necesita un `animation: none` explícito dentro de `prefers-reduced-motion`~~ **DEROGADO — ver «Correcciones»:** `prefers-reduced-motion` **ya se respeta hoy** (`app/globals.css:120-125`, verificado en el CSS compilado). No hay fallo de accesibilidad que arreglar |
| Ninguna de las 33 imágenes LCP lleva `fetchpriority="high"` | `Foto.tsx:49-56` pasa `priority` y nunca `fetchPriority`; 0 ocurrencias de `fetchpriority="high"` en los 45 HTML (la única es `fetchPriority="low"` del chunk de webpack, byte 1575) | **33 rutas** con preload de LCP (home + 6 servicios + 3 blog + 8 proyectos + 8 acabados + 7 zonas) y **6 puntos de uso** (`app/page.tsx:155`, `blog/[slug]:55`, `proyectos/[slug]:61`, `acabados/[modelo]:56`, `zonas/[municipio]:63`, `PaginaServicio.tsx:113`). Referencia: `fetchpriority="high"` bajó el LCP de Google Flights de 2,6 s a 1,9 s | trivial | ninguno |
| `minimumCacheTTL` sin declarar: las imágenes optimizadas caducan a los 60 s | `next.config.ts:5-7`; `.next/images-manifest.json` → `"minimumCacheTTL": 60`; medido con `next start`: `Cache-Control: public, max-age=60, must-revalidate` | Toda foto revalida cada minuto en el navegador. **Corrección:** el coste recurrente es una **revalidación**, no una recodificación (`image-optimizer.js:1000-1008` reutiliza el buffer). Vercel recomienda `2678400` | trivial | bajo |
| El hero de las 6 páginas de servicio declara `sizes="50vw"` sobre una columna FIJA de 560 px | `PaginaServicio.tsx:113` | **hasta +353 kB en el LCP** de la plantilla comercial — la que van a aterrizar los anuncios | trivial | ninguno |
| El guardián de anchos solo mira `imagenHero:` | `scripts/verificar-imagenes.mjs` | ~~**4 de los 8 heroes**~~ **7 de los 8 heroes 21/9 a sangre** salen de originales por debajo de 1600 px —**898–1200 px**, solo Denia llega a 2048— y el build pasa limpio, sirviéndolos con `sizes="100vw"` y `priority` → **tarea 1.29**. *Corregido el 2026-08-31 midiendo los ocho archivos: el 4 contaba solo el tramo de 898–960 px, pero los tres de 1200 px son la misma deuda y la misma sesión fotográfica pendiente; `HEREDADAS_A_SANGRE` exime las siete* | moderado | bajo |
| La misma foto se descarga dos y hasta tres veces en la misma página | `sizes` distintos en cada punto de uso | Bytes duplicados sin ninguna contrapartida visual → **tarea 1.30** | moderado | bajo |
| El hero de la home se sirve al **66 %** de la resolución que necesita | `app/page.tsx:155`; el `sizes` ignora el recorte `object-cover` | Imagen LCP de la página más importante, borrosa o reescalada | trivial | ninguno |
| Los seis «espacios» de la home declaran `30vw` sobre una celda de **297 px** | `app/page.tsx` | **2,85× los píxeles necesarios**; se pide el candidato 640w donde bastaba el 384w | trivial | ninguno |
| `50vw` declarado sobre columnas de **44,4vw** reales en `/empresa` y en las páginas de zona, y `100vw` sobre contenedores con padding | — | Sobrepeso sistemático en dos plantillas más | trivial | ninguno |
| La cabecera anima `height` sobre un elemento sticky en flujo | `Cabecera.tsx` | CLS en cada scroll y la **única animación no compuesta del sitio**. Además salta en hidratación en dos escenarios reales: recarga con scroll restaurado y aterrizaje externo con `#ancla` — ese segundo caso es **justo el de un anuncio** → **tarea 1.31** | moderado | medio |
| `min-w-tactil` no existe | `tailwind.config.ts` | La hamburguesa móvil y otros dos botones de icono quedan en **24 px**, contra la regla propia de **44 px** de `CLAUDE.md` | trivial | ninguno |
| El content glob de Tailwind no cubre `content/*.tsx` ni `lib/` | `tailwind.config.ts:6`; `content/servicios.tsx` es TSX **porque lleva JSX** | Cualquier clase que solo aparezca ahí no se emite. Bomba de relojería silenciosa | trivial | ninguno |
| `content/proyectos.json` y `content/zonas.json` viajan íntegros dentro del bundle JS de cliente de `/acabados` | `FiltrosAcabados.tsx` | Datos de servidor descargados por el navegador sin usarse. Se resuelve dentro de **1.27**: al llevar el filtro a estado y dejar el grid en servidor, los dos JSON dejan de cruzar la frontera | moderado | bajo |
| `Cabecera` marca toda la cabecera como cliente desde el layout raíz | `app/layout.tsx:70` | **39 % del chunk de layout en las 47 rutas**. **Corrección:** la vía NO es delegar `<Cabecera />` a cada página (caería dentro de `<main id="contenido">`, detrás del destino de «Saltar al contenido»): sería un **slot en el layout** que reciba `seccionActiva`. El esfuerzo no es «moderado» | grande | alto — ver «Lo que NO recomiendo» |
| `next/script` entero en las 47 rutas para cargar un Pixel que hoy no tiene ID | `Consentimiento.tsx` | Peso sin contrapartida en modo no-op | trivial | ninguno |
| El Pixel de Meta cuesta ~105-108 kB y ~190 ms de bloqueo del hilo principal a 4× | `fbevents.js` = **107.502 B gzip / 409.762 B sin comprimir**; Meta no sirve brotli | **Corrección:** a cambio entrega **todo** el contrato desde el instante de la aceptación (PageView, Contact ×3, Lead, 4 `trackCustom`), no un solo PageView. Mover el stub a `layout.tsx` **no recupera nada** (lo encolado antes de `fbq('init')` se descarta, medido). El valor está entero en diferir la descarga con `requestIdleCallback` → **tarea 1.26** | trivial | bajo — no toca el bloqueo duro |
| Todo evento de interacción anterior a la aceptación del banner se pierde para Meta al 100 % | Bloqueo duro | Y son justo los clics de teléfono y WhatsApp. **Corrección:** no es un fallo de medición, es la consecuencia buscada del bloqueo duro; recuperarlos exige decisión legal del dueño, no un route handler | — | — |
| El `consent update` sale de un `useEffect` y pierde la carrera de `wait_for_update: 500` | `Consentimiento.tsx:45` frente al orden de `app/layout.tsx:53-59` | **Corrección:** no es «siempre», es una carrera que se pierde en la mayoría de las cargas móviles, también para quien YA aceptó, que se registra como denegado. **Solución barata:** leer `document.cookie` en el propio bloque inline y emitir el `consent default` ya en `granted` — ~60 bytes de HTML, cero JS de cliente | trivial | bajo |
| `gtag.js` son **146.927 B en cable / 425.259 B sin comprimir** con `cache-control: private, max-age=900` | Medido con curl | Pero **NO es el problema de hilo principal que aparenta**; el hilo lo bloquea el Pixel | — | — |
| Cero `preconnect`/`dns-prefetch` a terceros | 0 ocurrencias | **Corrección:** los «200-400 ms» son estimación genérica, no medición de este sitio, y la ganancia real es menor que un handshake: el head acaba en el byte 2.878 y el inline es el primer elemento del `<body>`. Además hoy no se pide nada externo (`sitio.gaId` vacío). Añadirlo a `googletagmanager` **empeoraría la carrera del consentimiento** | trivial | medio — gatear por `sitio.gaId` |
| `@vercel/speed-insights` es el único tercero que se pide con todas las variables vacías | Escribe hoy un **404 y un aviso en consola** | Ruido en producción desde el primer día | trivial | ninguno |
| Superficie de transformación de imagen sin acotar | Sin `qualities` ni `localPatterns` | **~6·10⁵ claves de caché** alcanzables desde fuera (16 anchos × 100 calidades × 3 mime × 125 ficheros). ⚠️ En 15.5.22 declarar `qualities:[75]` **NO es un no-op con warning**: convierte cualquier `quality` fuera de lista en un **400 silencioso** en producción | trivial | medio |
| `deviceSizes` e `imageSizes` por defecto | — | Hueco de 1200 a 1920 y ocho candidatos inalcanzables. `sizes` **no** recorta la parte alta de la escalera; el único mando es `deviceSizes`. Recortar lleva el techo de 341 a **236 URLs** (−31 %), no a ~190. El recorte de 1.13 **conserva 750, 1200 y 1920** y solo retira 3840: los dispositivos que caían ahí bajan a 2048 sin pérdida visible (`denia` da el mismo sha256 en 2048 y 3840), y a cambio el peldaño nuevo de 1536 recorta el salto 1200→1920 | trivial | **alto de calendario**: la clave de caché de Vercel incluye `w`, así que recortar invalida todas las variantes |
| `quality: 75` es demasiado alto para textura de hormigón | Medido | Hay una foto cuyo «optimizado» **pesa más que el original**. ⚠️ **La tarea 1.13 NO resuelve esto**: `qualities: [75]` fija la lista de calidades *permitidas* —acota la superficie facturable—, no baja el valor efectivo. Bajarlo exige medir foto a foto y pasar `quality` desde `Foto.tsx`, y eso queda fuera de esta ola. Queda anotado como **pendiente, no como resuelto** | trivial (acotar) / moderado (bajar de verdad) | bajo |
| Recomprimir los originales no ahorra ni un byte al usuario | — | El ahorro está en el despliegue y en la codificación en frío, no en la red | moderado | bajo |
| El presupuesto declarado de 100 kB está incumplido, y se mide contra el número equivocado | `next build` imprime 116 kB en la home; la ejecución real son **121,3 kB gzip / 397,8 kB sin comprimir**; la tabla de `next build` **oculta 8,6 kB gzip por ruta** | El suelo de **103 kB** de First Load JS **no es recortable** en Next 15.5 + App Router. ⛔ ~~Y la unidad está sin decidir: a brotli q11 la home da 95,9 kB (cumple), a q4-9 da 103,5–111,9 kB (incumple), y Vercel no documenta su calidad~~ **DEROGADO — ver «Correcciones a las secciones anteriores»:** el hallazgo es de **ámbito**, no de unidad, y está decidido (brotli q11, archivo a archivo, ámbito HTML) | grande | — |
| Los ~92 kB gz de `framework-*.js` y `main-*.js` son chunks fantasma que nunca se sirven, y el polyfill de 112 kB va con `noModule` | — | Ningún navegador moderno los descarga. **No perder tiempo aquí** | — | — |
| 143.544 B de fuente precargados, idénticos en las 45 rutas | `c214ffb7…woff2` 90.096 (Archivo) + `26d0ba92…` 29.904 (Instrument Sans) + `9ae8a659…` 23.544 (Martian Mono); tres `<link rel="preload" as="font">` en 45 de 45 HTML | `/aviso-legal` paga lo mismo que la home. Los tres compiten entre sí y con el preload de imagen del hero. **Corrección:** Martian Mono **SÍ** se pide sobre el pliegue — `Cabecera.tsx:76` (el teléfono) —, pero solo en **escritorio** (`hidden md:flex`). Y **no** se compara contra el presupuesto de 100 kB: ese es de JS | trivial | medio: `preload:false` provoca swap justo en el CTA principal |
| El fallback métrico de Archivo está calibrado a `wdth 100` y el h1 se pinta a `font-stretch: 125%` | `app/globals.css:132-142`; `adjustFontFallback` sí actúa (`size-adjust: 157,02%` en Martian Mono es el caso extremo) | Reflujo horizontal del titular al llegar los 90 kB. **Magnitud no medida.** La salida NO es `adjustFontFallback:false` + `fallback` con métricas: `next/font/google` solo acepta `fallback: string[]` | moderado | medio |
| Ruta crítica de la home medida | html 21.096 + css 6.084 + JS sin polyfills 124.771 + polyfills 39.627 + fuentes 143.544 | **335.122 B gzip clavados** | — | — |
| El despliegue de producción no sirve ni una sola foto | Medido contra el sitio publicado | Lo que hay en producción **no es este build** | trivial | ninguno |
| No hay favicon | 404 en cada primera visita | La respuesta son **24.592 B** — no un HTML de error de Vercel, sino la propia `app/not-found.tsx` | trivial | ninguno |
| El prefetch de `next/link` dispara hasta **26 peticiones RSC** desde la home | 3 son enlaces legales del pie | ~130 kB gzip como cota superior (Vercel sirve brotli); el ahorro de los tres legales es **~10,8 kB gzip**, no 12 | trivial | bajo |
| Las 33 redirecciones encadenan **dos saltos** cuando la URL entra sin barra final | `next.config.ts` + `trailingSlash: true` | 308 + 308. **No se toca**: moverlas a `vercel.json` dejaría ciego a `verificar-redirecciones.mjs` | — | — |
| El JSON-LD de migas se emite **dos veces** por página en las nueve fichas de proyecto | `lib/schema.tsx` | Duplicación en 9 rutas | trivial | ninguno |
| `next.config.ts` no declara `headers()` — y hoy no compra casi nada | — | Saberlo antes de «arreglarlo» ahorra una sesión | — | — |

### Bloque C · Formulario, servidor y legal (dimensiones 10, 4, y la investigación de consentimiento)

| Hallazgo | Evidencia | Impacto cuantificado | Esfuerzo | Riesgo |
|---|---|---|---|---|
| La respuesta de Resend no se comprueba y no lleva timeout | `actions.ts:144`, sin `res.ok`, fuera del `catch` de `:171` | El lead se pierde mientras el usuario ve la pantalla de éxito | trivial | ninguno |
| El `catch` de Resend hace `return`: un fallo de email cancela también Telegram y Meta CAPI | `actions.ts:171` | No hay ningún punto donde el lead quede grabado antes | moderado | bajo |
| El honeypot devuelve éxito, y el cliente dispara desde ese éxito `form_submit` + `Lead` | `actions.ts:70-72` | **La defensa antispam fabrica exactamente las conversiones falsas que debía evitar.** Es el único caso donde no se entrega nada a nadie, y el `Lead` va solo por Pixel, sin gemelo en CAPI y con `space_type: undefined` | trivial | ninguno |
| El `Lead` se reporta a Meta aunque el aviso no se haya entregado | Sin `RESEND_API_KEY` (`actions.ts:142`, sin `else`) o con Resend en 401/422, la ejecución sigue hasta `:209` y `return {estado:'enviado'}` en `:221` | En esos dos casos Telegram sí puede haber salido, así que el lead no se pierde del todo | trivial | ninguno |
| `event_source_url` siempre dice `/presupuesto/` | `actions.ts:215` (`url: ${sitio.url}/presupuesto/`, constante) sobre 3 montajes reales: `app/page.tsx:497`, `app/presupuesto/page.tsx:52`, `PaginaServicio.tsx:278` | 7 de los 8 puntos donde se monta el formulario mienten a Meta. **Corrección:** un `<input type="hidden" name="url">` **no basta** — zod descarta en silencio las claves fuera del esquema (`:21-37`, `:77-78`); hay que añadir el campo al esquema, o usar `listaCabeceras.get('referer')`, que sí funciona sin tocarlo | trivial | bajo |
| Nadie puede saber si la CAPI funciona | `lib/meta-capi.ts:37-54`: `await fetch(...)` sin asignar la respuesta; el `catch` de `:55` solo atrapa red/abort y `fetch` no lanza con un 400; `:53` `AbortSignal.timeout(8000)` sin reintento; `:38` fija `/v21.0/` y mete el token en la query string; 0 ocurrencias de `test_event_code` | Token caducado, pixel ID erróneo o `user_data` rechazado pasan **mudos**. La Graph API vigente es **v26.0** (29/07/2026); **v21.0 expira el 21/01/2027** | trivial | bajo |
| La llamada a la CAPI se espera en línea | `actions.ts:209` | Hasta **8 s de spinner** después de que el lead ya esté entregado; con Telegram, hasta **16 s de cola de timeouts**. `after()` de `next/server` es estable desde 15.1.0. **Corrección:** sí se puede llamar a `cookies()`/`headers()` dentro de `after()` desde un Server Action; capturarlos fuera es estilo, no restricción | trivial | **medio: empeora la observabilidad** — hoy el `catch` al menos cancela |
| El límite de 3/hora vive en un `Map` de módulo y se evalúa DESPUÉS de convertir 4 MB a base64 | `actions.ts` | Por instancia de lambda, y se paga la conversión antes de rechazar | trivial | bajo |
| El adjunto de 4 MB sube íntegro por el Server Action, con espera ciega | `FormularioPresupuesto.tsx:47` y `actions.ts:95` | **Corrección:** el límite vinculante son esos **dos controles propios de 4 MB**, no un 413 de Vercel; `bodySizeLimit: '5mb'` nunca llega a aplicar. La horquilla de **6-16 s es estimación, no medición** | moderado | medio: el canvas engorda el chunk que otro hallazgo quiere adelgazar — **primero diferir, después el canvas** |
| El `reference_code` no viaja a Meta como `external_id` | `lib/meta-capi.ts` | 6 caracteres alfanuméricos, hash directo, sube el EMQ sin coste | trivial | ninguno |
| El contrato de validación no cuadra entre etiqueta, HTML y esquema | `FormularioPresupuesto.tsx:155` (asterisco en `superficie`) vs `actions.ts:29` (opcional); `:162` (`municipio` con `required` en HTML) vs `actions.ts:30` (opcional) | Hay que decidir en qué dirección se cierra. **Corrección:** los mensajes de `nombre`/`email`/`espacio`/`superficie`/`municipio` no se pintan porque son **inalcanzables salvo con un POST fabricado**, no por el camino sin JS: ahí la validación del navegador sigue activa y `form`, `telefono`, `foto` y `privacidad` sí se muestran | trivial | ninguno |
| `.replace('[teléfono]', …)` es código muerto y el mensaje de fallback dice «Llámanos» sin dar ningún número | `FormularioPresupuesto.tsx:108` hace el `replace`; los dos mensajes que lo alimentarían (`actions.ts:109` «Demasiados envíos seguidos. Llámanos o escríbenos por WhatsApp.» y `:174` «No hemos podido enviarlo. Llámanos…») **no contienen el marcador** | Fallo visible al usuario en el peor momento. **Se arregla en 1.17**, en el mismo commit que el resto de `actions.ts`: o los dos mensajes pasan a llevar «Llámanos al [teléfono]», o se borra el `replace` de `FormularioPresupuesto.tsx:108` | trivial | ninguno |
| El chunk del formulario se carga de forma anticipada en 8 rutas donde está bajo el pliegue | 9.139 B / **3.582 B gz** | **Corrección:** el ahorro de First Load JS al diferir es **2,0 kB gz por ruta**, no 2,4, y con `next/dynamic` sin `ssr:false` el chunk se pide igual al hidratar: es **ganancia de prioridad, no de peso**. El `IntersectionObserver` hay que **descartarlo**: sacaría el `<form>` del HTML estático y con él los marcadores `$ACTION_REF_1`/`$ACTION_KEY` que permiten enviar sin JS | trivial | bajo |
| `Atribucion.tsx` escribe `pa_attr` y `pa_ref` **sin mirar el consentimiento** | `Atribucion.tsx`, dos caminos de código distintos | 🔴 **Esto está infringiendo AHORA**, sin ninguna cuenta creada y sin depender del dueño. `pa_attr` (gclid, utm_*) → casilla de publicidad, sin discusión. `pa_ref` → decidir explícitamente y declararlo | trivial | ninguno |
| El banner no tiene paridad de botones, ni panel granular, ni identificación del editor | `Consentimiento.tsx` | **Corrección de gravedad:** no es solo LSSI. Un banner con Aceptar y Rechazar de peso visual distinto y sin panel granular es **art. 5.1.a RGPD** (patrón oscuro), art. 83.5.a, «muy grave» a efectos de prescripción por art. 72.1.a LOPDGDD — **el mismo cajón que la CAPI**. Son **cuatro** los elementos incumplidos de la primera capa, no tres: también a) identificación del editor | moderado | **la única variante válida es los dos botones con `variante="contorno"` sobreOscuro** — la de «los dos primario» rompe la regla del ocre |
| No hay forma de retirar el consentimiento | 180 días de Pixel y CAPI sin marcha atrás | La retirada debe ser tan fácil como el otorgamiento. Hace falta añadir `borrarCookie()` a `lib/cookies.ts` **antes** de escribir `<BotonPreferencias>`, y que borre también `pa_attr`, `pa_ref`, `_fbp` y `_fbc` | moderado | bajo |
| Los tres textos legales son plantillas vacías | `/politica-de-cookies/`, `/politica-de-privacidad/`, `/aviso-legal/` | Ninguna de las cookies propias (`pa_consent`, `pa_attr`, `pa_ref`, y las futuras `pa_fbclid`, `_fbp`, `_fbc`) está declarada en ningún sitio. Bloquea el arranque de campañas y la verificación de anunciante de Google | — | depende de la asesoría |
| El SHA-256 del teléfono es seudonimización, no anonimización | AEPD, *Introducción al hash como técnica de seudonimización*, **octubre de 2019** | Sigue siendo dato personal. Riesgo real y con precedente: **PS/00080/2023 contra CHATWITH.IO WORLDWIDE, S.L. — 12.000 €** | — | — |
| El banner se renderiza aunque no haya ni GA4 ni Pixel | `Consentimiento.tsx` | Se pide permiso para un seguimiento que no existe | trivial | ninguno |

### Bloque D · GA4, atribución y landings (dimensiones 8, 9, 11)

| Hallazgo | Evidencia | Impacto cuantificado | Esfuerzo | Riesgo |
|---|---|---|---|---|
| 17 parámetros personalizados que el código ya emite y **no están dados de alta en ningún sitio** | `lib/eventos.ts:98-99`, `EventosGlobales.tsx:27/33/39`, `:34`, `Acordeon.tsx:24`, `ProfundidadScroll.tsx:35`, `Calculadora.tsx:41-45`, `FiltrosAcabados.tsx:34`, `FormularioPresupuesto.tsx:72-74` | **GA4 no rellena dimensiones hacia atrás**: lo que llegue antes se pierde para siempre. **Cinco tienen el ámbito equivocado si se registran sin pensar**. Lista literal más abajo | moderado (panel) | 🔴 irreversible si se hace tarde |
| La macro-conversión se llama `form_submit` | `lib/eventos.ts` | Es un nombre que **GA4 usa para su propio evento de Medición mejorada**, y no es `generate_lead` | trivial | bajo |
| `form_submit` viaja sin `reference_code` y sin el `event_id` que sí tiene | `lib/eventos.ts`, `actions.ts:127` | **No hay clave de unión** entre un lead de GA4 y el lead que llega al buzón | trivial | ninguno |
| Ningún evento lleva `value` ni `currency` | `lib/eventos.ts` | **Corrección:** lo que se pierde es el valor **variable** por lead (40 m² y 400 m² pesan igual). La diferencia de peso **entre acciones** se resuelve sin código, con un valor estático por acción en el panel de Ads — y eso basta para Maximizar valor de conversión y ROAS objetivo | trivial | ninguno |
| Enhanced Conversions no existe | `user_data` aparece 3 veces en el repo, pero ninguna es la de EC: 2 son la subcadena `ad_user_data` (`Consentimiento.tsx:45`, `layout.tsx:54`) y 1 es el campo de la CAPI de Meta (`meta-capi.ts:49`). Cero `gtag('set','user_data',...)` | **El teléfono no vale solo**: EC exige email (preferido), dirección o teléfono, y con teléfono suelto no funciona. O el email pasa a obligatorio (y se añade a la variante corta), o solo convierten los leads con email, o se va por gclid + importación offline | grande | 🔴 bloqueado por banner y política de cookies aprobados |
| No se emite `page_view` propio en la navegación del App Router | `lib/eventos.ts` | **Corrección importante:** eso **no** significa una vista por sesión — «Page changes based on browser history events» viene **activada por defecto** y Next dispara `pushState` en cada navegación. Lo que falta es **control**, no datos. Severidad realista: **medio, no crítico**. Hay que elegir una vía y solo una. **La vía elegida se declara en 3.1** (fase 0 de GA4): se **conserva la Medición mejorada** y **no** se emite `page_view` propio; lo que se corrige es la fuente del ruido, no el transporte | trivial (panel) | medio |
| `router.push` de los filtros dispara `page_view` espurios | `FiltrosProyectos.tsx:57/:61`, `FiltrosAcabados.tsx` | Cada clic de filtro es un `page_view`. `router.replace` **no lo arregla** (`replaceState` también está en la lista de escucha): o se quita el filtro de la URL, o se apaga la casilla del historial y se asume el componente manual. **Se cierra en 1.27**, que saca el filtro de la URL al llevarlo a estado de React — la misma edición que arregla el `BAILOUT` | moderado | ver «orden que destruye la verificación» |
| `calculator_use` no está deduplicado por sesión, y quitar filtros no se mide | `Calculadora.tsx`, `FiltrosAcabados.tsx` | Un mismo usuario genera varios eventos por visita; poner un filtro se mide y quitarlo no | trivial | ninguno |
| El `reference_code` como dimensión no sirve para lo que se pretende | Cardinalidad | Vale para **Exploraciones y DebugView**, no para informes estándar. El puente real con la conversación es el mensaje prellenado que ya inyecta `Atribucion.tsx:67` y el aviso de Telegram. La decisión correcta es **propiedad de usuario**, no `user_id` | trivial | ninguno |
| El enlace GA4 ↔ Google Ads no está previsto de ninguna forma en el código | — | Es **trabajo de panel al 100 %** | — | — |
| Una landing sin `alternates.canonical` propio se canonicaliza a la home | El root layout lo impone por herencia; hay 21 declaraciones de canonical en 20 ficheros de página más el root layout, y esos 20 cubren las 47 rutas (6 son dinámicos) | Una landing sin canonical propio **desaparece**. Las seis páginas de servicio son destino de **10** de las 33 redirecciones 301 | trivial | ninguno |
| Las dos plantillas reutilizables no contienen ni un `tel:` ni un `wa.me` | `PaginaServicio.tsx` y `zonas/[municipio]/page.tsx` | Una landing hecha con ellas ofrece **0 caminos de llamada**. Al copiar el patrón de fallback hay que copiar el de `/presupuesto/` (`app/page.tsx:488,491`, `BarraMovil.tsx:8,15`, `MenuMovil.tsx:103,106` — **3 sitios, no 4**), nunca el `'#'` de `Cabecera.tsx:76`/`Pie.tsx:23` | moderado | medio: toca `design/02` §A2 (línea 56) |
| 9 de las secciones de una página de servicio llegan con `opacity: 0` | `PaginaServicio.tsx` | La plantilla comercial es la que peor se ve sin JS. **En las landings** se renderiza el cierre con CTA y el formulario como `<section>` normal, sin `<Aparece>`, y se anota el contexto exento en `design/rediseno-pavimentos-albufera.md:744` (⛔ **no en «`design/01` §8.6»: §8 no existe en `design/01`**, que tiene §1-§4) | trivial | bajo |
| `UBICACIONES` no tiene ningún valor de landing | `lib/eventos.ts:23-41` | **Corrección:** el bloqueo de tipos afecta **solo** al prop `origen` del formulario. `data-ubicacion` es un `data-*` suelto que `Boton` propaga por `...resto` (`Boton.tsx:34-35`) y que `EventosGlobales.tsx:22` lee con un `as Ubicacion` inerte en runtime: **hoy ya se puede escribir `data-ubicacion="lp_close"` sin tocar nada**. Las entradas nuevas siguen siendo lo correcto para que el contrato siga siendo único | trivial | ninguno |
| ~~Los 8 municipios sin documentar entrarían solos al sitemap y serían indexables~~ ⛔ **REFUTADO el 2026-08-30: la guarda ya existe.** `lib/datos.ts:11-13` filtra el objeto de metadatos de `zonas.json`, así que los 8 de `_sinDocumentar` —que son valores de una clave dentro de ese objeto, no entradas del array— **no generan ruta ni entran al sitemap**. El «verificado en `sitemap.xml.body`» de la evidencia original afirmaba una comprobación que no se había hecho | Comprobado: `.next/server/app/sitemap.xml.body` contiene **8** URLs `/zonas/` (alzira, corbera, denia, godella, moncada, moraira, ribarroja, xabia), **todas documentadas**; `generateStaticParams` (`app/zonas/[municipio]/page.tsx:17-18`) recorre ese mismo array ya filtrado | Lo único que queda en pie es que `generateMetadata` (`:29-33`) no declara `robots`: irrelevante hoy, relevante el día que alguien publique una zona sin obra | trivial | ninguno |
| Inventario de `<DatoPendiente>`: **6 de 6** fichas técnicas llevan corchetes | Medido contando `class="pendiente"` dentro de `id="seccion-ficha"`: impreso 2 · pulido 4 · microcemento 5 · lavado 3 · fratasado 3 · desactivado 3 | **No hay ninguna ficha limpia**: excluir la ficha técnica de la landing aplica a los seis servicios **sin excepción**. Impreso declara 1 propio y hereda el `[16-25]` de `FICHA_SOLERA` | trivial | ninguno |
| `dynamicParams` no está declarado en ninguna ruta | — | Un slug de landing inexistente **invocaría una función en Vercel** en vez de devolver un 404 estático | trivial | ninguno |
| ~~Suprimir cabecera y pie exige un layout intermedio con route groups~~ ⛔ **DEROGADO — ver «Correcciones»** | — | 🔴 **Un layout anidado NO puede suprimir `Cabecera`, `Pie` ni `BarraMovil`**: se renderizan en el layout raíz. Y el objetivo estaba mal planteado: la landing **necesita** el pie (legales) y la barra móvil (CTA de llamada). `app/lp/layout.tsx` existe solo para el `robots` | trivial | ninguno |
| ~~`BarraConfianza` **no** es usable «tal cual» en una landing sin cabecera~~ ⛔ **SIN PREMISA — ver «Correcciones»:** la landing **conserva la cabecera** (un layout anidado no puede suprimirla) | Su clase es `md:sticky md:[top:var(--cabecera-actual)]`, y `--cabecera-actual` lo actualiza `Cabecera.tsx:31`, que en la landing **sigue montada** | Con cabecera, `BarraConfianza` se comporta igual que en las 45 rutas actuales: **es usable tal cual**. La objeción de los 84 px de `app/globals.css:22` —y la misma para `SubmenuServicio.tsx:35`, `FiltrosAcabados.tsx:61` y `FiltrosProyectos.tsx:81,117`— solo aplicaría a una landing **sin** cabecera, escenario descartado | — | ninguno |
| `components/secciones/` tiene **8** archivos, no 9 | Acordeon, Calculadora, FiltrosAcabados, FiltrosProyectos, FormularioPresupuesto, PaginaServicio, PlantillaLegal, SubmenuServicio. (contenido 5, datos 4, ui 7, layout 10 sí eran correctos) | Inventario de bloques recomponibles | — | — |
| `lib/schema.tsx`: cuatro islas de JSON-LD sueltas | Sin `@id` que enlace `schemaServicio`/`schemaFAQ`/`schemaMigas` con el `HomeAndConstructionBusiness` del layout; sin `sameAs`, sin `image`/`logo`, sin `geo` | `sameAs` → Perfil de Empresa es justo el enlace del que cuelgan las llamadas gratis del GBP y la señal local de Ads. **Nadie lo había mirado.** Y `lib/schema.tsx:11` renderiza `telephone` en servidor, así que el JSON-LD nunca llevará el GFN — que es lo correcto | trivial | ninguno |
| `app/robots.ts`: `disallow: ['/author/']` bloquea las dos 301 de `/author/pavadmin/` → `/empresa/` | `app/robots.ts` + `next.config.ts` | **2 de 33**, archivo de autor, valor bajo. La versión sistémica sí importa: `verificar-redirecciones.mjs` valida destinos y **nada valida que el `source` sea rastreable** | trivial | ninguno |
| `.env.example` incompleto | `lib/config.ts:11` lee `NEXT_PUBLIC_DIRECCION` y no está en el fichero; `sitio.adsId` —que usan dos temas de la investigación— **no existe ni en `lib/config.ts` ni en `.env.example`** | Cualquiera que clone el repo arranca con la dirección vacía y sin sitio donde poner el AW- | trivial | ninguno |

---

## Refutados, y por qué se cayeron

- **«AVIF pesa MÁS que WebP en móvil»** — el experimento comparó q75 contra q75, una transformación que el sitio **nunca ejecuta**: Next pasa `Math.max(q-20,1)` con `effort: 3` al codificador AVIF (`image-optimizer.js:810-813`). Con los parámetros reales, el AVIF de estas fotos pesa **3-12 % MENOS** y tarda **2,8-6,5×** más en codificar, no 14×.
- **«El eje `wdth` de Archivo cuesta 55.156 B»** — se reconstruyó el repo con `axes: ['wdth']` comentado y salió **el mismo hash y los mismos 90.096 B**. El ahorro es **cero**. La única vía para adelgazar Archivo es auto-alojar una instancia subconjunto, y ese ahorro **sigue sin medir**.
- **«`resource-summary:script:size` va en bytes sin comprimir»** — no; el «103 kB de First Load JS» está en **kB gzip**.
- **«Vercel redujo un 15 % la memoria y un 10 % el TTFB p75»** — esas cifras **no están en la fuente citada**. Lo único citable del post es «~2× más rápido con ~10× menos fallos de caché» en la capa de metadatos de ruta.
- **«La sección E del código propuesto para Enhanced Conversions no compila»** — cierto en su forma (`estado.resumen?.email` no existe, `telefonoE164` no está declarada), pero el fallo real es de método: los datos hay que capturarlos **en el envío** (`onSubmit` sobre `<form action={accion}>`, `new FormData(e.currentTarget)` a un `useRef`, normalizando a E.164 en cliente). **Nunca ensanchar el retorno del Server Action para devolver email y teléfono al cliente**: eso es devolver PII por la red para un uso publicitario, y es peor que el bug.
- **«El call tracking con números de reenvío de Google está descartado»** — descartado sobre **dos premisas falsas**. España **sí** está en la tabla de países con GFN, con número local y gratuito.
- **«No se dispara `page_view` en la navegación cliente: solo se cuenta la página de entrada»** — la Medición mejorada escucha `pushState`/`popState`/`replaceState` y viene activada por defecto: **GA4 sí registra las vistas suaves**. Lo que falta es control, no datos.
- **«El 302 en `/ir/whatsapp/` es riesgo alto pero no certeza, con evidencia dividida»** — no hay evidencia dividida: **Apple dice explícitamente que no se haga**. Se descarta sin matices, y no hace falta «medirlo antes».
- **«`trailingSlash: true` mata el `sendBeacon`»** — el **308 preserva método y cuerpo**. Lo que introduce es un salto de latencia. Escribir la barra final sigue siendo lo correcto, pero por latencia, no porque el envío se pierda.
- **«Mover el stub de `fbq` a `app/layout.tsx` recupera los eventos previos»** — lo encolado antes de `fbq('init')` **se descarta sin enviarse** (medido). El snippet actual ya crea stub, cola e init en el mismo tick. Todo el valor está en diferir `fbevents.js`.
- **«El endpoint de eventos por servidor solo arregla algo si manda datos sin consentimiento»** — no: sirve para dar **durabilidad y precisión** a los eventos de quien **sí** consintió. Lo anterior al consentimiento no es un fallo, es la consecuencia buscada del bloqueo duro.
- **«`unmarked` es alcanzable desde `actions.ts:36`»** — no: el `<input type="hidden" name="origen">` de `FormularioPresupuesto.tsx:114` se renderiza en el HTML estático con su valor. El campo que llega vacío sin hidratar es **`evento_id`**.
- **«El `Lead` se puede contar dos veces en Meta si el formulario se envía sin hidratar»** — **no hay doble conteo**: en ese camino el Pixel aún no ha cargado y el `Lead` de navegador no llega a salir; queda solo el de CAPI. Y **no** generar el `event_id` en el render inicial (`useId()`/`useState(() => crypto.randomUUID())`): en una página estática publicaría **el mismo id para todos los visitantes** y Meta descartaría leads reales por deduplicación. El `eventoIdEnviado || crypto.randomUUID()` de `actions.ts:127` es lo correcto.
- **«`experimental.inlineCss` es una acción inmediata y gratuita»** — medido en **este** repo: **+12.480 B gz de HTML para ahorrar una petición de 6.085 B gz = +6.395 B gz netos**. Es cambiar un round-trip por 6,4 kB, y la bandera sigue documentada como no recomendada para producción.
- **«`images.qualities: [75]` silencia el aviso de deprecación»** — no lo dispara nadie, porque el repo nunca pasa el prop `quality`. Su único valor es dejar fijado por escrito el default de Next 16.
- **«`minimumCacheTTL` a 60 s provoca una recodificación cada minuto»** — es una **revalidación** (lectura del origen y comparación de etag). Los 461–2.597 ms de codificación se pagan solo en un fallo real de caché.
- **«Next 16 pesa +28 kB gz por ruta» y «el Pages Router daría 95,8 kB»** — ninguna de las dos mediciones se reprodujo. La conclusión (no migrar) se sostiene por otras razones.
- **«Mover las 90 fotos huérfanas a `fotos-origen/`»** — `fotos-origen/` está en `.gitignore`: eso las **borra del repositorio**, y sostienen tres decisiones abiertas del dueño.
- **«El recorte de `deviceSizes` lleva el techo a ~190 URLs»** — son **236** (−31 %). Y ojo con la segunda mitad de esa refutación, que también estaba mal: el recorte de 1.13 **conserva 750, 1200 y 1920**, y solo retira 3840. Ningún dispositivo sube de peldaño; los que pedían 3840 bajan a 2048 (`denia` da el mismo sha256 en los dos), y el peldaño nuevo de 1536 recorta el salto 1200→1920.
- **«El `phone_conversion_number` no casaría con lo pintado por formato inconsistente»** — no hay descuadre: los ocho puntos imprimen la misma cadena `nap.telefono`. El riesgo real y distinto es el **placeholder**: pasar `'96X XXX XXX'` como `phone_conversion_number` no casaría con nada y no daría ningún aviso.

> ⚠️ **Una laguna que hay que decir en voz alta:** `investigacion[9]` — «landings de campaña», el tercer pilar del encargo — **nunca se verificó adversarialmente**. Los dos bloques que debían revisarla verificaron por error `investigacion[10]` (imágenes) dos veces. La sección de landings de este plan se apoya en material **sin revisión adversarial**, mientras imágenes tiene dos pasadas. Tratar sus cifras con más reserva que el resto.

---

## La arquitectura de medición, ya decidida: cómo se implementa

Servidor primero, cliente mínimo. No se comparan opciones: esto es lo que se construye.

### El principio que resuelve el desempate

El defecto que comparten los tres canales es **la ventana de hidratación**. Solo un mecanismo **renderizado en servidor** la elimina. Por eso:

> **`ping` en el ancla como primario, `navigator.sendBeacon` como respaldo, los dos aterrizando en UN ÚNICO Route Handler `app/api/evento/route.ts`, y los dos autorizados a escribir fila, deduplicando por el `event_id`/`reference_code` que ya viaja** — una comparación de cadena, no «lógica de deduplicación».

Consecuencias que hay que escribir, no dejar implícitas:

1. **El 302 intersticial queda fuera**, sin matices. `/ir/whatsapp/` **como ruta de libro mayor alcanzada por `ping`** sí es válido; `/ir/whatsapp/` **como redirección 302 hacia `wa.me`** no, porque rompe los universal links de iOS y Apple lo desaconseja explícitamente. No confundir los dos.
2. **La URL se escribe con barra final** (`/api/evento/`). El 308 de `trailingSlash: true` preserva método y cuerpo, así que no se pierde nada, pero se ahorra un salto de latencia en el peor momento posible.
3. 🔴 **Se acaba la propiedad «47 rutas, todas estáticas».** Aparecerán **dos `ƒ`** en la salida de `next build` —`/api/evento/` (1.5) y `/api/atribucion/` (1.19)—, y las dos cuentan al reescribir esa frase. Esa propiedad es carga estructural del resto del plan y del apartado «Estado» de `CLAUDE.md`: hay que actualizarlo en el mismo commit. Un Route Handler **no** desestática al resto del sitio (Next 15 cambió el caché por defecto de GET de estático a dinámico, y eso no arrastra a las páginas).
4. 🔴 **Criterio de salida BLOQUEANTE de la Ola 1:** en un **iPhone real con WhatsApp instalado**, tocar el CTA y comprobar en los logs del servidor si llega el POST a la ruta. **Nadie lo ha verificado.** Si el `ping` no se dispara cuando iOS intercepta el universal link y manda Safari a segundo plano, `sendBeacon` pasa a primario **obligatoriamente** — y entonces vuelve la dependencia de la hidratación que este diseño dice haber eliminado. No se lanza campaña sin esta prueba hecha.
5. **Consentimiento en las dos patas.** `avisarServidor` empieza con `if (leerCookie(COOKIE_CONSENTIMIENTO) !== 'aceptado') return`, y el servidor vuelve a comprobarlo como defensa en profundidad. La rama `ping` no puede leer cookie en cliente, así que **la comprueba el servidor**: o la fila se escribe siempre pero **sin identificadores publicitarios** hasta que haya consentimiento (solo hora, ubicación, página, `device_type`), o no se escribe. Se elige explícitamente lo primero, y se declara.
6. **Límite de tasa.** Es el primer endpoint público del sitio: acepta el cuerpo que le manden. Extrae el límite a **`lib/limite.ts` (NUEVO)** —`export function limitePorIp(ip, {limite = 3, ventanaMs = 3_600_000})`, con el `Map` de módulo dentro— y consúmelo desde `app/presupuesto/actions.ts` y desde el Route Handler; trunca valores a 200 caracteres. ⚠️ **No se puede importar de `actions.ts`**: `limitePorIp` no está exportado (`actions.ts:44`) y exportarlo es imposible, porque en un módulo `'use server'` todo export tiene que ser una función asíncrona, y esta devuelve un boolean síncrono. ⛔ ~~descarta peticiones sin cookie `pa_ref` previa~~ **NO se descartan las peticiones sin `pa_ref`**: `pa_ref` depende del consentimiento (1.19) y el clic pre-consentimiento es justo el que el `ping` existe para capturar. El único discriminador antiabuso de ese camino es el límite por IP. **No se le añade nunca nada que escriba fuera de la cookie.**
7. **Código muerto que evitar:** la spec del `ping` fija `referrer: "no-referrer"`, así que el `?? peticion.headers.get('referer')` de la rama `ping` nunca se cumple. La URL de origen viaja en `Ping-From`.

### Archivos que se crean

**Inventario cerrado: si un archivo nace en alguna ola de este plan, está en esta tabla.**

| Archivo | Qué hace | Tarea |
|---|---|---|
| `app/api/evento/route.ts` | Route Handler POST único. Acepta cuerpo `PING` (cabecera `Ping-From`) y JSON de `sendBeacon`. Lee `pa_consent`, `pa_attr`, `pa_ref` de cookie de primera parte. Emite `Contact` a Meta CAPI con `event_id` compartido. Escribe la fila del libro mayor en almacén durable con fecha del clic, `device_type`, canal y `click_location`. Límite por IP. | 1.5 |
| `app/api/atribucion/route.ts` | Escribe `pa_attr` y `pa_ref` por `Set-Cookie` de primera parte en vez de `document.cookie`: es lo que escapa a ITP, 0 €/mes. **Es la segunda `ƒ`** de la salida de `next build`. | 1.19 |
| `lib/eventos-servidor.ts` | Constructor de payload genérico: `enviarEventoCAPI(nombre, userData, customData, eventId, sourceUrl, actionSource)`. Es lo que hoy `lib/meta-capi.ts` no puede ser. | 1.7 |
| `lib/limite.ts` | El límite por IP extraído de `actions.ts`, que **no se puede importar de ahí** (no está exportado, y en un módulo `'use server'` todo export debe ser función asíncrona). Lo consumen el Server Action y el Route Handler. | 1.5 |
| `lib/telefono.ts` | `atributosTelefono(ubicacion)` → `{href, 'data-ubicacion', 'data-tel', ping}` o `null`. Punto único de render del teléfono, en **servidor**. | 1.9 |
| `scripts/verificar-contacto.mjs` | `postbuild`. **Rompe el build** si alguna ancla `tel:`/`wa.me`/`mailto:` sale sin `data-ubicacion` o sin transporte; **avisa** (no rompe) si los HTML no contienen ni un `tel:` ni un `wa.me` con las variables vacías. Tercer verificador, hermano de los dos que ya existen. | 1.4 |
| `scripts/verificar-presupuesto.mjs` | `postbuild`. ⛔ ~~Avisa en gzip y en brotli a la vez y no rompe el build en ninguna~~ **DEROGADO — ver «Correcciones»: brotli q11, rompe el build por encima de 112.000 B, avisa por encima de 105.000 B.** | 1.1 |
| `scripts/verificar-lcp-visible.mjs` | `postbuild`. Rompe el build si un `<h1>` o un `<img>` no perezoso tiene un ancestro con clase `aparece`. | 1.11 |
| `lighthouserc.json` | `@lhci/cli` 0.15.1 (empaqueta lighthouse 12.6.1), **preset móvil por defecto** — sin `"settings": {"preset":"desktop"}`. | 1.24 |
| ~~`app/(campana)/layout.tsx`~~ | ⛔ **NO SE CREA — ver «Correcciones».** Un layout anidado no puede suprimir `Cabecera`, `Pie` ni `BarraMovil`, y la landing los necesita. Lo sustituye `app/lp/layout.tsx`. | — |
| `app/lp/layout.tsx` | Existe **solo para el `robots`** de las landings. No suprime chrome. | 1.28 |
| `app/lp/[slug]/page.tsx` | La landing, componiendo `PaginaServicio` con secciones desactivadas. | 1.28 |
| `content/campanas.ts` | Datos de landing de los dos servicios bloqueados por el rango de la calculadora. | 2.6 |
| `lib/llamadas.ts` | DNI de Google: el swap del número en **cliente**, tras el `consent update`. Separado a propósito de `lib/telefono.ts`. | 3.4 |

### Archivos que se tocan

- **`lib/meta-capi.ts`** — quitar `event_name: 'Lead'` de `:44`; exportar `hash()` y añadir normalizadores por campo (`ph` con prefijo `+34`, `ct`/`st` sin espacios ni acentos, `ln` **conservando el espacio entre apellidos**); subir `/v21.0/` a `/v26.0/`; comprobar `res.ok` y leer el cuerpo; soportar `test_event_code`; sacar el `access_token` de la query string; añadir `external_id` (con `pa_ref` normalizado a minúsculas **en las dos patas**, para que la normalización interna del Pixel deje de importar) y `country: [hash('es')]`.
- **`app/presupuesto/actions.ts`** — `res.ok` de Resend con timeout; que el `catch` no cancele Telegram ni CAPI; `after()` de `next/server` para Telegram y CAPI (con la advertencia de observabilidad de más abajo); honeypot que **no** devuelva un éxito del que el cliente dispare conversiones; `event_source_url` desde `listaCabeceras.get('referer')`; límite por IP **antes** del base64; guardar el consentimiento en el email y en el aviso de Telegram.
- **`components/layout/Atribucion.tsx`** — gatear `pa_attr` por la casilla de publicidad (aplazando en memoria hasta aceptar, igual que el `fbclid`); capturar `fbclid` y componer `_fbc` como `fb.1.<ms>.<fbclid>`; volver a parchear al montarse el menú móvil; `performance.mark('ref-inyectada')`.
- **`components/layout/EventosGlobales.tsx`** — separar el canal en el evento de Meta; añadir `gfn_active`; incluir `device_type` en el cuerpo del beacon y en `custom_data`.
- **`lib/eventos.ts`** — `generate_lead` en vez de `form_submit`; `reference_code` y `event_id` en el evento de lead; `value`/`currency`; entradas `lp_hero` y `lp_close` en `UBICACIONES`; deduplicar `calculator_use` por sesión; medir el quitado de filtro.
- **`app/layout.tsx`** — el guard pasa de `sitio.gaId` a `sitio.gaId || sitio.adsId`; el bloque inline **lee `document.cookie` y emite el `consent default` ya en `granted`** para quien aceptó (~60 bytes de HTML, cero JS de cliente); `preconnect` gateado por el mismo guard.
- **`components/contenido/Foto.tsx`** — `fetchPriority={prioridad ? 'high' : undefined}`.
- **`next.config.ts`** — `minimumCacheTTL: 2678400`; `qualities`; `localPatterns` con `/{obras,acabados,blog,marca}/**` (con `/obras/*` **se rompen 21 de las 35 fotos**); `deviceSizes` recortado conservando **2048** (la única foto de 2048 px del repo, Denia, va a sangre en `/proyectos/[slug]/`).
- **`lib/config.ts` y `.env.example`** — añadir `NEXT_PUBLIC_DIRECCION`, `adsId` y `adsEtiquetaLlamada`.
- **Anclas que reciben `ping`** — `BarraMovil.tsx:8` y `:15`, `MenuMovil.tsx:103` y `:106`, `app/page.tsx:488` y `:491`, `app/presupuesto/page.tsx:42`, `:45`, `:56` y `:59`. **`Pie.tsx` no lleva WhatsApp** (solo teléfono).
- **`components/ui/Boton.tsx`** — no se toca: ya hace spread de props, así que `ping` y `data-*` viajan solos.

### El recorrido de un lead, canal por canal

**1 · LLAMADA** — clic en el anuncio → aterrizaje con `?gclid=` → `Atribucion.tsx` escribe `pa_attr` → el visitante pulsa «Llamar» → `tel:` traspasa al marcador → `phone_click` a GA4 → `ping` a `/api/evento/` → `Contact` a Meta CAPI con **`action_source: 'website'`** y `event_source_url` de la página real del clic (⛔ ~~`'phone_call'`~~: se reserva a una llamada atendida e importada, camino descartado por el techo de 7 días de `event_time`) → la llamada entra en el móvil del dueño.
**Dónde se rompe hoy:** (a) el `href` es `'#'` en cuatro puntos porque falta la variable; (b) `pa_attr` solo se escribe si el visitante no navegó antes por un `<Link>` interno —el CTA de héroe está en el **byte 7.265**—; (c) el evento no existe hasta que hidratan ~126 kB gz; (d) no hay ningún transporte de servidor y `meta-capi.ts` no sabe emitir `Contact`; (e) **la llamada en sí nunca se mide**: `phone_click` cuenta clics, no llamadas.

**2 · WHATSAPP** — clic en el anuncio → aterrizaje → `Atribucion.tsx` genera `pa_ref` de 6 caracteres y lo inyecta en el mensaje prellenado → el visitante pulsa → `ping` sale antes de que el documento se destruya → fila en el libro mayor con `reference_code`, `gclid` y fecha → `Contact` a Meta CAPI → conversación en el WhatsApp del dueño **con el código de referencia dentro del primer mensaje**.
**Dónde se rompe hoy:** (a) los 45 HTML no tienen ni un `wa.me`; (b) el `href` sale sin código hasta que hidrata, y el ancla de la barra fija está en el **byte 78.478**; (c) el CTA del menú móvil **nunca** lo lleva, por construcción; (d) el mensaje prellenado se congela con la primera página visitada; (e) `wa.me` es navegación https que destruye el documento y no hay `sendBeacon` ni `keepalive` en el repo; (f) **nadie lee de vuelta el `reference_code`**.

**3 · FORMULARIO** — clic en el anuncio → aterrizaje → envío → Server Action → validación zod → email por Resend + aviso por Telegram + `Lead` por CAPI → `generate_lead` en GA4 con `event_id` y `reference_code`.
**Dónde se rompe hoy:** (a) la respuesta de Resend no se comprueba y su `catch` cancela Telegram y CAPI; (b) el honeypot devuelve éxito y **fabrica** un `form_submit` y un `Lead` falsos; (c) el teléfono se hashea sin `34` y **el 100 % de los hashes son inservibles**; (d) `event_source_url` miente en 7 de 8 puntos; (e) nadie sabe si la CAPI funciona; (f) el evento se llama `form_submit`, que colisiona con el nativo de GA4; (g) no hay clave de unión con el buzón. **Es el único canal con círculo cerrado, y el dueño lo declara minoritario.**

---

## Cerrar el círculo de llamadas y WhatsApp

### Lo que se construye

**En el repo, hoy, sin cuentas:**

1. **`scripts/verificar-contacto.mjs`** — rompe el build si se publica sin teléfono ni WhatsApp. Hoy el estado normal del repo es publicar 45 páginas con cero caminos de contacto y **nada lo avisa**.
2. **Los seis `href='#'`** —cuatro de teléfono (`Pie.tsx:23`, `Cabecera.tsx:76`, `app/presupuesto/page.tsx:42` y `:56`) y **dos de WhatsApp** (`app/presupuesto/page.tsx:45` y `:59`, con `nap.whatsappHref ?? '#'`)— se arreglan **de forma distinta según el punto**: donde el teléfono se renderiza como **texto** (`Pie.tsx:24`, `Cabecera.tsx:77`, `MenuMovil.tsx:87`) va `<DatoPendiente>`; donde es **CTA** (`BarraMovil.tsx:8` y `:15`, `MenuMovil.tsx:103` y `:106`, `app/page.tsx:488` y `:491`) se conserva el fallback a `/presupuesto/`; y en los **cuatro** de `app/presupuesto/page.tsx` (`:42`, `:45`, `:56`, `:59`) —que ya están en `/presupuesto/`— se sustituye el `'#'` por un ancla al formulario, no por un hueco. Medido: **94 ocurrencias** de `href="#"` en los 45 HTML.
3. **Punto único de render del teléfono**, en la forma que **sí** aguanta el sistema: un helper de servidor que **reparte atributos** (`{href, 'data-ubicacion', 'data-tel', ping}`) para pasarlos por spread a `<Boton>` o al `<a>` de la barra ⛔ ~~, o un `<Telefono como={Boton} variante="tinta">`~~ — **la «o» está cerrada: es `lib/telefono.ts`, no un componente** (ver «Correcciones»). **No** un wrapper `<a>` que sustituya los ocho puntos: eso no encaja en el sistema de componentes. Ese punto único es lo que el swap del DNI necesitará después.
4. **`app/api/evento/route.ts`** con `ping` primario y `sendBeacon` de respaldo, ambos escribiendo fila y deduplicando por `event_id`. El mecanismo generaliza a `tel:` **sin cambios de arquitectura** y por la decisión 3 entra en el mismo encargo, no después. 🔴 **El «libro mayor» es un almacén durable, no un `console.log`.** Un stream de logs de plataforma no se consulta por clave, no se cruza con una conversación, no se exporta y no sobrevive los plazos que este mismo plan exige (90 días con `gclid`, 63 sin él, aviso a los ~80). Tabla de Vercel Postgres/Neon, o un `POST` a la misma hoja donde la tarea 2.8 anota los códigos de WhatsApp; el `console.log` estructurado se queda **solo** como traza de depuración. Es **prerrequisito de 1.5, no un detalle**: si el libro mayor no persiste, la atribución de WhatsApp (2.8) y la subida por `gclid` (3.9) se caen con él.
5. **`lib/meta-capi.ts` generalizado** para emitir `Contact` con ⛔ ~~`action_source: 'phone_call'` (Meta lo acepta) y~~ **`'website'` en los tres canales** (ver «Correcciones»), con `event_id` compartido con el Pixel — y ese `event_id` compartido **exige que el Pixel siga emitiendo su gemelo de navegador**: sin él no hay nada que deduplicar. Ver la tarea 1.8, que fija qué evento conserva el Pixel y cuál no.
6. **`gfn_active`** en `EventosGlobales.tsx`, leído cruzado con `device_type` y `click_location='sticky_mobile'`. Mide la ventana ciega entre carga y aceptación del banner: no solo «se pierde el 40 % si acepta el 60 %», sino además la fracción de los que **sí** aceptan pero pulsan antes de aceptar, que en la barra fija de móvil **no es residual**. Si el hueco resulta grande, la palanca no es técnica: es el orden de aparición del banner respecto a la barra.
7. **CTA de contacto en el cuerpo** de las seis páginas de servicio y las ocho de zona (hero y cierre), que son las páginas de aterrizaje naturales de los anuncios. Los botones nuevos van en **`tinta`/`contorno`, nunca en ocre** (patrón de `app/page.tsx:488` y `:491`). Esto **modifica el hero especificado en `design/02` §A2 (línea 56)**, así que va con actualización de `design/01` y mención en el commit. ⚠️ **`design/02` no tiene un §56**: el archivo se organiza en §A1-§A6 y §B1-§B9, y el hero de servicio es la fila «Hero | `1fr 560px`. H1 a 64 px, entradilla, CTA ocre + contorno» de **§A2**, que cae en la línea 56. Quien escribió «§56» confundió número de línea con número de sección; corregido en las cinco apariciones. 🔴 **Y hay una disyuntiva que hay que presentarle al dueño, no resolver por él:** el hero ya tiene dos CTA (`PaginaServicio.tsx:101` «Pedir presupuesto» en ocre y `:104` «Ver acabados» en contorno). O los de contacto **se añaden** y el hero queda con cuatro botones apilados en columna en móvil, o «Ver acabados» **cede su sitio** al de llamar. Las dos opciones cumplen la verificación de 2.5 por igual, así que la verificación no decide: decide el dueño.

**Cuando exista cuenta de Ads, y solo entonces:**

8. **DNI de Google (`lib/llamadas.ts`)** — `gtag('config','AW-ID/LABEL',{phone_conversion_number, phone_conversion_css_class, phone_conversion_options})`, invocado dentro del `useEffect` de `[estado]` que ya existe en `Consentimiento.tsx`, tras el `consent update` y condicionado a `estado === 'aceptado'`. El caso del visitante que vuelve con la cookie puesta queda cubierto por el mismo camino, y el flag `activado` del módulo lo hace idempotente. El guard debe ser `sitio.adsId && sitio.adsEtiquetaLlamada && nap.telefono`: eso también cubre el placeholder `'96X XXX XXX'`, que no casaría con nada y no daría ningún aviso.
9. **Activo de llamada + call reporting con GFN** (disponible en España, número local y gratuito, propiedad de Google) y acción de conversión «Calls from ads» **con umbral de duración**. Esto no toca el repo.

### ⛔ DEROGADO · La secuencia `phone_click` primaria/secundaria

> **Estas dos viñetas están SUSTITUIDAS ENTERAS** por las FASES 0-3 de «Lo primero que hay que crear
> en los paneles» (ver «Correcciones a las secciones anteriores»). Se conservan solo como registro.
> **El disparador del swap no es «el GFN existe», es «el GFN sostiene volumen propio 30 días».**
> No implementar desde aquí.

- ~~**Antes de que exista GFN:**~~ `phone_click` **segmentado por `device_type = 'mobile'`** es acción de conversión en Google Ads. Si por falta de volumen hace falta empezar con **una sola** conversión primaria, la decisión 3 del dueño obliga a que sea esa, no `generate_lead`. La segmentación se puede hacer sin código, creando en GA4 un **evento derivado** condicionado a `device_type = mobile`, o separando el nombre (`phone_click_mobile`). Se decide al crear la propiedad.
- ~~**En cuanto exista el GFN:**~~ «Calls from ads» con umbral de duración pasa a **primaria**, y `phone_click` **baja a secundaria** — sigue en «All conversions», deja de pujar. Una llamada capturada por el **DNI de Google** en el sitio web **sí** es elegible para importación de conversiones de llamada; una llamada sin GFN, incluidas las capturadas por DNI de un tercero (Nimbata y similares), **no** lo es.

### Lo que queda fuera del alcance de la web y necesita proceso humano

Esto es lo que un plan honesto tiene que decir:

- **Quien contesta el WhatsApp tiene que copiar el `reference_code`** de cada conversación a algún sitio. El código ya viaja dentro del mensaje prellenado (`Atribucion.tsx:67`) y en el aviso de Telegram. Si nadie lo copia, **no hay atribución de WhatsApp**, por mucho libro mayor que haya. Es el eslabón que ningún código sustituye, y **no se le ha preguntado al dueño**.
- **No existe ningún registro de qué lead acabó en obra.** Sin él no hay conversión offline, ni valor por lead, ni Data Manager API. Un plan que promete valor por lead sin ese registro promete algo que no puede entregar.
- **La ventana de subida es dura y documentada:** **90 días** entre el último clic y la subida si va con `gclid`; **63 días** si se sube apoyándose solo en datos personales hasheados (ECL sin gclid). Un lead de WhatsApp cuyo `gclid` se perdió cae en la ventana de **63**, no de 90. El libro mayor guarda la fecha del clic, avisa cuando una fila supera ~80 días y descarta las muertas.
- **Un `developer token` nuevo ya no puede llamar a `UploadClickConversion` desde el 15-06-2026.** La vía es la **Data Manager API** (`POST datamanager.googleapis.com/v1/events:ingest`, scope `auth/datamanager`, 2.000 eventos, sin developer token), con `productDestinationId` apuntando a una acción de conversión de tipo `UPLOAD_CLICKS`, y OAuth **JWT-bearer con cuenta de servicio** — el quickstart oficial documenta `gcloud auth application-default login --impersonate-service-account`, que es **inservible en un Server Action**.

### Lo que NO se puede atribuir, nunca

- **Una llamada orgánica.** Reconciliarla con un `gclid` es imposible, punto. Lo que **sí** se puede hacer, gratis y desde el día uno, es **contarla**: la métrica «Calls» del Perfil de Empresa de Google y su conexión nativa a GA4 dan una serie temporal por canal, con la misma limitación que el `tel:` del sitio (cuenta pulsaciones del botón, no llamadas, y no ve a quien teclea el número).
- **Quien teclea el número a mano** desde la pantalla. Invisible en todos los sistemas.
- **Quien pulsa antes de aceptar el banner.** Para Meta se pierde el 100 %; para GA4 no, porque Consent Mode avanzado sí manda los pings. Recuperar lo de Meta exige una decisión legal del dueño, no código. **Y se pierde más de lo que parece:** como `pa_attr` y `pa_ref` quedan gateados por el consentimiento (tarea 1.19), esa fila del libro mayor va **sin `gclid`** —luego no es importable a Google Ads ni por la ventana de 90 días ni por la de 63, porque un clic de teléfono no aporta PII— y ese WhatsApp llega **sin código de referencia en el mensaje**, luego la persona de la tarea 2.8 no tiene nada que copiar. Para el tráfico pre-consentimiento el `ping` entrega un **contador** (hora, canal, página, `device_type`), no una atribución. El techo de todo el circuito es la tasa de aceptación del banner, y por eso `gfn_active` (1.8) no es opcional.
- **Una conversación de WhatsApp donde el humano no anota el código.**
- **El `ctwa_clid`**, que es la única vía limpia de Meta para WhatsApp, exige **WhatsApp Business Platform / Cloud API**: `wa.me` suelto no da acceso. Y el `referral` con el `ctwa_clid` llega en el **primer mensaje de una conversación originada en un anuncio** — no en el primer mensaje de esa persona en la vida —, así que hay que persistirlo en ese webhook o se pierde.
- **Las conversiones offline de llamada en Meta** están descartadas: `event_time` no admite más de **7 días**, y este negocio cierra obras semanas después. Los 7 días bastan por sí solos para tumbarlo.
- **Enhanced Conversions for Leads no sirve para quien solo llamó**: exige que el identificador se capture en un formulario del propio sitio.

---

## Las landings de campaña

> Recordatorio: `investigacion[9]` **nunca pasó verificación adversarial**. Esta sección es la de menor respaldo del plan.

### Rutas que se crean

**`app/lp/[slug]/page.tsx`** —⛔ no `app/(campana)/lp/[slug]/page.tsx`, ver «Correcciones»— con `generateStaticParams` y **`export const dynamicParams = false`** (hoy no está declarado en ninguna ruta: un slug inexistente **invocaría una función en Vercel** en vez de devolver un 404 estático). **No hay route group `(campana)`**: un layout anidado no puede suprimir `Cabecera`, `Pie` ni `BarraMovil`, y la landing los necesita.

**Landings viables hoy con copy aprobado:** `/lp/hormigon-impreso/`, `/lp/hormigon-pulido/`, `/lp/hormigon-lavado/`.
**Landing viable sin FAQ:** `/lp/microcemento/` — ninguna pregunta del catálogo le aplica sin reescribirla, y reescribirla es copy nuevo.
🔴 **Landings BLOQUEADAS pendientes de dato del dueño:** `/lp/hormigon-fratasado/` y `/lp/hormigon-desactivado/`. **La calculadora no tiene rango para esos dos servicios**, y una landing de Ads con un corchete es dinero quemado. La regla del proyecto prohíbe rellenarlo. Nadie lo había dicho.

### Bloques ya aprobados que se recomponen

`PaginaServicio.tsx` **se extiende, no se clona**: ya es una landing parametrizada con secciones opcionales. La landing es la misma plantilla con secciones desactivadas.

| Bloque | En la landing | Nota |
|---|---|---|
| Hero de servicio | **Sí**, + CTA de llamada y WhatsApp en `tinta`/`contorno` | Nunca ocre; `data-ubicacion="lp_hero"` |
| Ficha técnica | **NO, en los seis servicios sin excepción** | **6 de 6 llevan corchetes**: impreso 2 · pulido 4 · microcemento 5 · lavado 3 · fratasado 3 · desactivado 3 |
| Galería / muestras | Sí | Comprobar que la foto no cae en `<BloquePosicion>` |
| FAQ | Sí, salvo microcemento | Cada servicio compone su lista propia en `content/servicios.tsx`; `grietas` y `sobreExistente` nombran el hormigón impreso dentro del texto |
| Calculadora | Sí en impreso/pulido/lavado/microcemento; **bloquea** fratasado y desactivado | Sin rango no hay landing |
| Cierre con CTA + formulario | Sí, **sin `<Aparece>`** | `<section>` normal; se anota el contexto exento en `design/rediseno-pavimentos-albufera.md:744` — ⛔ **no en «`design/01` §8.6»**, que no existe |
| `BarraConfianza` | **Sí** | Como la landing **conserva la cabecera** (ver «Correcciones»), `Cabecera.tsx:31` sigue actualizando `--cabecera-actual` y el `md:sticky md:[top:var(--cabecera-actual)]` se comporta igual que en las 45 rutas actuales. ⛔ La objeción de los 84 px de `app/globals.css:22` solo aplicaría a una landing **sin** cabecera, escenario descartado; misma nota vale para `SubmenuServicio.tsx:35`, `FiltrosAcabados.tsx:61` y `FiltrosProyectos.tsx:81,117` |
| Reseñas | **NO** | Sin reseñas verificables, y sin `AggregateRating` por regla del proyecto |

### Dónde iría `<DatoPendiente>`

En el hero: **`[48 horas]`** (la promesa de respuesta, presente en tres páginas) y **`[Equipo propio]`**. Se renderizan entre corchetes atenuados, como manda la regla. **No se rellenan**, y **no se disimulan quitando el tratamiento visual**: es intencionado.

### Cómo se excluyen del índice y del sitemap

1. `robots: { index: false, follow: true }` en el `generateMetadata` de la landing.
2. **`alternates.canonical` propio.** Sin él, el root layout la canonicaliza **a la home** por herencia y la landing desaparece.
3. **`app/sitemap.ts`**: la ruta `/lp/` **no** se añade (para `/lp/` la tranquilidad de «no hace falta tocar `app/sitemap.ts`» es cierta). ⛔ ~~Pero si algún día se usan los 8 municipios sin documentar como landing de zona, `app/sitemap.ts:31` los publicaría solos…~~ **CORREGIDO: no los publicaría.** `lib/datos.ts:11-13` ya filtra el objeto de metadatos de `zonas.json`, y los 8 de `_sinDocumentar` son valores de una clave dentro de ese objeto, no entradas del array: **no generan ruta ni entran al sitemap** (comprobado: 8 URLs `/zonas/` en `sitemap.xml.body`, todas documentadas). Lo que sí queda pendiente, como red para el futuro, es que `generateMetadata` (`app/zonas/[municipio]/page.tsx:29-33`) no declara `robots`: el día que alguien publique una zona **sin ninguna obra con foto**, saldría indexable. Eso es la tarea 1.22, reducida a eso.

### 🔴 El cruce que nadie había hecho: landing sin pie = landing sin aviso legal

⛔ ~~Suprimir cabecera y pie exige un **layout intermedio con route groups** (no un segundo root layout).~~ **DEROGADO: no se puede, y no hace falta** (ver «Correcciones»). Pero el cruce sigue siendo válido y es la razón por la que no hace falta: las **Meta Business Tools Terms exigen un aviso visible en cada página que lleve píxel**, y la AEPD exige **identificación del editor**. Una landing de pago sin pie sería **la única página del sitio sin enlace legal, y justo la que lleva píxel**.

**Restricción de diseño, no opcional:** la landing **hereda el `Pie` del layout raíz**, con sus enlaces a `/aviso-legal/`, `/politica-de-privacidad/` y `/politica-de-cookies/`, **y el banner de consentimiento**. `app/lp/layout.tsx` no toca nada de eso: existe solo para el `robots`. Consecuencia de CRO que hay que asumir: el banner (`Consentimiento.tsx:74`, `fixed bottom-0 z-50 mb-[56px]`) ocupa el pliegue inferior móvil justo encima de la `BarraMovil`, y la AEPD exige mantenerlo hasta que el usuario decida. No hay salida elegante: es cumplimiento contra pliegue.

### Cómo se mide cada landing por separado

- **`click_location`**: `lp_hero` y `lp_close` en `data-ubicacion`. Funciona **hoy sin tocar nada** (`Boton.tsx:34-35` propaga por `...resto`, `EventosGlobales.tsx:22` lee con un `as Ubicacion` inerte en runtime). Aun así se **añaden las dos entradas a `UBICACIONES`**, para que el prop `origen` compile y la lista siga siendo el contrato único.
- **`form_location`** con el mismo valor, vía el prop `origen` del formulario.
- **Mapa palabra clave → landing** documentado antes de crear la primera campaña, para que `click_location` distinga tráfico de pago de tráfico orgánico desde el primer día.
- **A/B: no.** Descartado por volumen, y la alternativa (`middleware.ts`) **rompe la propiedad «todas estáticas»** y «runs globally before the cache»: se metería en el camino crítico de todos para resolver el problema de unos pocos.


---

## Plan por olas

### Correcciones a las secciones anteriores de este mismo documento

**Trece arbitrajes del 2026-08-30 derogan pasajes concretos de arriba.** Los pasajes derogados
**se han tachado en su sitio** y llevan un puntero a la fila de esta tabla: ninguna instrucción
derogada queda legible como orden vigente para quien lea el documento de arriba abajo. Las filas se
identifican por **encabezado `##` y cita literal, nunca por número de línea**, porque el número
cambia con la primera edición. Si un número de arriba contradice uno de aquí, gana el de aquí.

Y dos avisos para quien ejecute sin haber vivido la auditoría: la tarea **1.1 hay que escribirla
desde cero** con la especificación de su celda (no existe ninguna copia previa), y toda referencia a
«design/01 §8.6» del cuerpo hay que leerla como `design/rediseno-pavimentos-albufera.md:744`.

| Pasaje derogado (sección · cita) | Lo que decía | Lo que queda |
|---|---|---|
| `## BLUF` · «121,3 kB gzip / 397,8 kB sin comprimir» | La cifra del BLUF | **124.195 B gzip ‑9 · 105.737 B brotli q11 · 407.389 B crudos** en la home, contra un techo declarado de **112 kB br11 por ruta**. La cifra vieja no coincidía ni con la propia ruta crítica medida más abajo |
| `## Hallazgos confirmados` · «la unidad está sin decidir — decisión del dueño, no técnica» | Fila del presupuesto de 100 kB | El hallazgo es de **ámbito**, y está decidido: la tabla de `next build` suma `app-build-manifest.json` y **omite `chunks/444` y `chunks/app/layout`, 7,5 kB br11 por ruta que las 45 páginas sí descargan**. Unidad: brotli q11, archivo a archivo, sin concatenar |
| `## Refutados, y por qué se cayeron` · «el “103 kB de First Load JS” está en **kB gzip**» | — | Sigue siendo cierto **y además** son ámbito de manifiesto, no del HTML servido |
| `## La arquitectura de medición` · «avisa del peso de JS **en gzip y en brotli a la vez** y **no rompe el build en ninguna**» | Fila de `verificar-presupuesto.mjs` en «Archivos que se crean» | **Brotli q11. Rompe el build por encima de 112.000 B. Avisa por encima de 105.000 B.** Los 100 kB quedan RETIRADOS: el suelo real del sitio es 94,0 kB br11 y dejaban 6 kB para todo el código propio |
| `## Cerrar el círculo` · «🔴 La secuencia `phone_click` primaria/secundaria, que nadie había escrito» | Dos viñetas: antes del GFN / en cuanto exista el GFN | **Sustituida entera** por las FASES 0-3 de la sección de paneles. El disparador del swap no es «el GFN existe», es «el GFN sostiene volumen 30 días» |
| `## Cerrar el círculo` · «Lo que se construye», punto 5: `Contact` con `action_source: 'phone_call'` | — | **`action_source: 'website'` en los tres canales**, con `event_source_url` de la página real del clic. `'phone_call'` se reserva a una llamada atendida e importada, camino ya descartado por el techo de 7 días de `event_time`. Motivo: la dedup de Meta es `event_id` + `event_name`, y `action_source` **no está en la clave**. ⚠️ Esta derogación alcanza **las dos** apariciones: el punto 5 y la narración «El recorrido de un lead, canal por canal» |
| `## Cerrar el círculo` · «Lo que se construye», punto 3: «un helper que reparte atributos **o** un `<Telefono como={Boton}>`» | — | Cerrada la «o»: **`lib/telefono.ts`** con `atributosTelefono(ubicacion): Record<string,string> \| null`. No es componente, no entra en `design/01`. Separado a propósito de `lib/llamadas.ts`: uno emite atributos en **servidor**, el otro hace el swap del DNI en **cliente** |
| `## Las landings de campaña` · «Suprimir cabecera y pie exige un **layout intermedio con route groups**» (y la fila homóloga de la tabla de bloques) | — | 🔴 **Un layout anidado NO puede suprimir `Cabecera`, `Pie` ni `BarraMovil`**: se renderizan en el layout raíz. Las únicas vías serían dos root layouts hermanos (arrastra las 47 rutas a un grupo) o una envoltura `'use client'` con `usePathname`. Y el objetivo estaba mal planteado: la landing **necesita** `Pie` (enlaces legales) y **necesita** `BarraMovil` (es el CTA de llamada). `app/lp/layout.tsx` existe **solo para el `robots`**. No se promete supresión de chrome. ⚠️ Corolario: **la landing conserva la cabecera**, así que todo argumento del plan que empiece por «sin cabecera» queda sin premisa |
| Cualquier sección · «design/01 §8.6» y «§8.3» | — | 🔴 **No existe §8 en `design/01`**: el archivo tiene §1-§4 y 428 líneas. El §8.6 real es `design/rediseno-pavimentos-albufera.md:744`. Cualquier anotación de contexto exento va ahí o en `design/01 §4`, no en un §8 inventado |
| `## Las landings de campaña` · tabla de bloques, fila «Cierre con CTA + formulario»: «se anota el contexto exento en design/01 §8.6» | — | Como el `Pie` no se suprime, la **tercera variante de `design/01` §4.4 (pie de campaña) no se escribe**: se queda sin consumidor. Se reabre solo el día que alguien suprima el chrome de verdad |
| `## La arquitectura de medición` · «Archivos que se crean», fila `app/(campana)/layout.tsx` | «route group para landings: sin cabecera ni pie completos» | **No se crea.** Es `app/lp/layout.tsx` y existe **solo para el `robots`**. La supresión de chrome que esa fila promete es la que se cae dos filas más arriba de esta tabla. ⚠️ Alcanza también a `app/(campana)/lp/[slug]/page.tsx` en «Rutas que se crean»: la ruta real es `app/lp/[slug]/page.tsx` |
| `## Hallazgos confirmados` · bloque B, fila de `.aparece`: «cualquier arreglo con `animation-timeline` necesita un `animation: none` explícito dentro de `prefers-reduced-motion`» | — | Se lee como si hubiera un fallo de accesibilidad. **No lo hay: `prefers-reduced-motion` ya se respeta hoy** — `app/globals.css:120-125` declara `.aparece{opacity:1;transform:none}` con la misma especificidad y **después**, verificado en el CSS compilado `.next/static/css/9dc989264a21632c.css`. Es una refutación, no un hallazgo, y el arreglo de 1.10 no lo regresa |
| Cuatro componentes propuestos por la auditoría | `<Insignia>`, `<Telefono>`, `<FormularioDiferido>`, plantilla de landing | **Ninguno se crea.** El sistema termina con los mismos 14 componentes base de `design/01` §3. ⚠️ Desambiguación obligatoria: hay **dos «14» distintos** en el material — los 14 componentes base de `design/01` §3 (no se mueve) y los 14 archivos con `'use client'` (**baja a 13** al arreglar `Chip.tsx`). Coinciden hoy por casualidad |

---

### Ola 1 — hoy, sin cuentas, sin depender de nadie, en modo no-op

Ordenada por retorno. Todo lo de esta ola se puede hacer y verificar sin una sola cuenta creada.

⚠️ **Margen real de JS: 4,9 kB.** El gate de 1.1 rompe el build por encima de 112.000 B y el máximo
de hoy es 107,1 kB (`/hormigon-*`). Todo lo que este plan añada de cliente —en particular el panel
granular de 2.1— se mide contra ese margen **antes** de aterrizar; si no cabe, el techo se sube en el
mismo commit y con la cifra medida, **nunca se desactiva el gate**.

⚠️ **Cómo se leen las verificaciones de esta tabla.** Tres defectos recorrían la columna «cómo se
verifica» y están corregidos en todas las filas: (a) `grep -c` **cuenta líneas**, y estos HTML son de
una sola línea, así que para contar ocurrencias va `grep -o … | wc -l` y para contar rutas
`grep -l … | wc -l`; (b) el glob `.next/server/app/*.html` alcanza **17 de los 45 HTML** —deja fuera
`blog/`, `proyectos/`, `acabados/` y `zonas/`—, así que en cuanto la cifra esperada pase de 17 va
`find .next/server/app -name '*.html'`; (c) React 19 emite **`fetchPriority` en camelCase**
(`image-component.js:120-127`, «we must use camelCase prop»), nunca `fetchpriority`. Las celdas que
afirman **0** sobreviven a `grep -c` sin tocarlas.

⚠️ **Esfuerzo estimado, y es estimación, no medición: 22-30 h** de desarrollo en cuatro bloques
—canal de contacto (1.3-1.9, 1.25): 10-13 h · gates y presupuesto (1.1, 1.2, 1.11, 1.24): 4-5 h ·
rendimiento e imágenes (1.10, 1.12-1.16, 1.26, 1.29-1.31): 6-8 h · formulario, atribución y SEO
(1.17-1.23): 4-6 h—, **más 10-16 h** para las dos tareas grandes que entran al final de la ola: 1.27
(filtros a estado de React) y 1.28 (las cuatro landings). Es la única cifra del plan que no sale de
una medición, y se dice.

| # | Archivo | Qué se hace | Cómo se verifica |
|---|---|---|---|
| 1.1 | `scripts/verificar-presupuesto.mjs` (NUEVO) + `package.json:8` | Recorre `.next/server/app/**/*.html`, extrae los `<script src>` **sin `noModule`**, deduplica, comprime cada archivo con `node:zlib` brotli q11 y suma **archivo a archivo**. Techo duro 112.000 B, aviso 105.000 B. `decodeURIComponent` sobre el `src` es **obligatorio**: las rutas dinámicas emiten `%5Bmodelo%5D` y sin él revienta con ENOENT. Cero dependencias. ⚠️ **Hay que reescribirlo desde esta especificación: la copia «lista para copiar» del scratchpad NO existe** (ese directorio solo contiene `cierre.js`) | `npm run build` → `✓ 45 rutas dentro del techo, máx 107,1 kB (/hormigon-desactivado), mín 97,1 kB (/politica-de-privacidad)` + `⚠ 10 por encima del objetivo de 105,0 kB`, EXIT=0. Bajando el techo a 100.000 lista **41 rutas infractoras** y EXIT=1. ⚠️ **El script cuenta las rutas que encuentra, no compara contra 45**: con 1.28 dentro serán 49 |
| 1.2 | `CLAUDE.md:41` **y `:135`**, `design/CLAUDE.md:41` (literal duplicado), `design/04-desarrollo-y-deploy.md:238`, `design/README.md:107`, `design/rediseno-pavimentos-albufera.md:814` | Sustituir «JS inicial < 100 KB comprimido» por el bloque de unidad fijada (brotli q11, ámbito HTML, suelo 86,5/94,0, techo 112, objetivo 105, terceros aparte). ⚠️ **`CLAUDE.md:135` también se reescribe, no solo se anota**: hoy dice «Ya estaba por encima de los 100 KB» y es el **sexto** resultado de la búsqueda — con las cinco ediciones de la lista original quedaba vivo | `grep -rniE "100 ?kb" CLAUDE.md design/ --exclude=06-*.md --exclude=07-*.md` → **0 resultados**. ⚠️ **Criterio corregido el 2026-08-31:** sin las dos exclusiones devuelve 15, y los 15 están en este documento y en `design/07`, que discuten el número retirado porque su trabajo es justificar por qué se retira; no están en la lista de archivos de esta fila. Y aviso para quien lo use de guardián: **no lo es**, porque la cifra escrita en letra («cien kilobytes») lo esquiva. El guardián real es `scripts/verificar-presupuesto.mjs`, que rompe el build a 112.000 B. Hoy devuelve **6** en el ámbito de la fila (medido: `CLAUDE.md:41`, `CLAUDE.md:135`, `design/CLAUDE.md:41`, `design/README.md:107`, `design/04-desarrollo-y-deploy.md:238`, `design/rediseno-pavimentos-albufera.md:814`), no 5. Si sale 1, el debate se reabre solo desde el archivo que quedó sin tocar |
| 1.3 | `.env.local` / variables de Vercel (no es código) | Poner `NEXT_PUBLIC_TELEFONO` y `NEXT_PUBLIC_WHATSAPP` reales. 🔴 **NO es tarea de ola 1: es dato del dueño y nunca se le ha pedido.** `lib/config.ts:2-4` declara el teléfono sin confirmar (`design/05` §A1) y `.env.example` lo tiene vacío. Pasa a ser la **pregunta 0** de «Lo que hay que preguntarle al dueño». Mientras no llegue, 1.4, 1.6, 1.9 y 1.25 se escriben y se prueban con un número de pruebas en `.env.local` y **no se despliega**: sin ese dato no hay `tel:` ni `wa.me` en producción, luego no hay campaña | `find .next/server/app -name '*.html' -exec grep -o 'href="tel:' {} + \| wc -l` pasa de **0** a >0; sobre los 45 HTML, las **186 anclas degradadas y las 94 muertas** desaparecen. **Desbloquea 1.4, 1.6, 1.9, 1.25 y toda la ola 3** |
| 1.4 | `scripts/verificar-contacto.mjs` (NUEVO) + `package.json:8` | Tercer verificador de `postbuild`, **fusionando las dos propuestas del material en uno solo** (`verificar-contacto.mjs` de `:213` y el «verificador de `ping`» del arbitraje son el mismo recorrido). Falla el build si: **(b)** alguna ancla `tel:`/`wa.me`/`mailto:` sale sin `data-ubicacion`; **(c)** alguna sale sin transporte. El caso **(a)** —ni un `tel:` ni un `wa.me` en los 45 HTML— **avisa pero NO rompe cuando `NEXT_PUBLIC_TELEFONO` y `NEXT_PUBLIC_WHATSAPP` están vacías**: ese es el modo no-op que «Cómo se demuestra que funcionó» exige poder construir, y romperlo dejaría el build inservible para cualquiera que clone el repo sin el número privado, CI de preview incluido. Con las variables **puestas**, (a) sí rompe. ⚠️ **La condición (c) acepta `ping` O el marcaje de beacon, y no se activa hasta que 1.25 fije cuál es el primario**: hasta entonces el gate solo comprueba (a) y (b). ⚠️ **Dos pasadas, no una:** sobre los HTML **y** sobre el fuente, porque los dos CTA de `MenuMovil.tsx:103` y `:106` están fuera del alcance de cualquier gate de HTML —`Cabecera.tsx:98` los monta solo con el menú abierto— y son justo los que el plan documenta como fallo permanente | Con las variables vacías, EXIT=**0** y aviso nombrando el caso (a). Con variables puestas y sin transporte, EXIT=1 por (c). Con todo hecho, EXIT=0 y **11 anclas** en HTML con los tres atributos: 5 por página (`Pie.tsx:23` y `:26`, `Cabecera.tsx:76`, `BarraMovil.tsx:8` y `:15`) más 2 en la home y 4 en `/presupuesto/` — medido, `data-ubicacion="mobile_menu"` aparece **0 veces** en los 45 HTML. La cifra sube con 2.5, así que el gate se escribe con **`≥`**, nunca con un número congelado. Depende de 1.3 |
| 1.5 | `app/api/evento/route.ts` (NUEVO) | Route Handler **solo POST**, `dynamic = 'force-dynamic'`. Lee `Ping-To` (canal), `Ping-From` (`event_source_url` real) y las cookies `pa_consent`/`pa_ref`/`pa_attr`/`_fbp`/`_fbc`. Acepta cuerpo `PING` (`content-type: text/ping`) y JSON de `sendBeacon`. **Escribe SIEMPRE la fila propia en un almacén DURABLE** —tabla de Vercel Postgres/Neon, o un `POST` a la misma hoja donde 2.8 anota los códigos de WhatsApp—, con `console.log` estructurado **solo** como traza de depuración. 🔴 **Elegir el almacén es prerrequisito de esta tarea, no un detalle:** un stream de logs de plataforma no se consulta por clave, no se cruza con una conversación, no se exporta y no aguanta los plazos que el propio plan exige (90 días con `gclid`, 63 sin él, aviso a los ~80). Si el libro mayor no persiste, **2.8 y 3.9 se caen con él**. La fila va **sin identificadores publicitarios mientras no haya consentimiento**, tal como decide el punto 5 de «El principio que resuelve el desempate»: siempre hora, canal, `click_location`, `device_type` y página; **`pa_ref` y `gclid` solo con `pa_consent` aceptada**, y Meta CAPI **solo** en ese caso. `event_id` derivado en servidor = hash de (`pa_ref` **si existe**; si no, un identificador de petición propio: IP + user-agent) + `Ping-To` + cubo de 5 s. ⚠️ **Sin `pa_ref` la fórmula simple colisiona entre visitantes distintos**: dos personas pulsando «Llamar» en el mismo cubo de 5 s producirían el mismo `event_id` y la dedup borraría un clic real, justo en hora punta de campaña. **La deduplicación del libro mayor se aplica solo entre la pata `ping` y la pata `sendBeacon` de una misma petición, nunca entre filas de origen distinto.** Usa `limitePorIp` desde **`lib/limite.ts` (NUEVO)** y trunca a 200 caracteres — ⚠️ **no se puede importar de `actions.ts`**: no está exportado (`:44`) y exportarlo es imposible en un módulo `'use server'`, donde todo export debe ser función asíncrona. ⚠️ **No se descartan las peticiones sin cookie `pa_ref`**: el clic pre-consentimiento es justo el que el `ping` existe para capturar, y el único discriminador antiabuso de ese camino es el límite por IP. 🔴 **El estado de `pa_ref` frente al consentimiento sigue SIN decidir** (tarea 2.11): hasta que el dueño y la asesoría contesten, 1.5 se implementa asumiendo que `pa_ref` **puede llegar o no**, sin depender de él para nada salvo el `event_id`. ⚠️ **No se llama `/api/track` ni `/api/analytics`**: están en las listas de filtros. URL con barra final. 🔴 Aparecen **dos `ƒ`** en `next build` contando la de 1.19: hay que actualizar «47 rutas, todas estáticas» de `CLAUDE.md` en el mismo commit | `curl -X POST <preview>/api/evento/ -H 'content-type: text/ping' -H 'Ping-To: tel:+34...' -H 'Ping-From: https://…/'` devuelve 204 y **la fila aparece en el almacén**, consultable por `reference_code`. `next build` imprime **45 rutas `○` + 2 `ƒ`** (`/api/evento/` de esta tarea y `/api/atribucion/` de 1.19) — 49 `○` una vez dentro 1.28 |
| 1.6 | `components/layout/BarraMovil.tsx:16` · `Pie.tsx:26` · `MenuMovil.tsx:106` · `app/page.tsx:491` · `app/presupuesto/page.tsx:45` y `:59` | Añadir `ping="/api/evento/"` junto al `data-ubicacion` que ya existe, en los **6 puntos que NO son de teléfono** (5 de WhatsApp + el `mailto:` de `Pie.tsx:26`). ⚠️ **Los 7 puntos de ancla de teléfono reciben el `ping` desde `atributosTelefono()` en la tarea 1.9, no aquí**: editarlos en las dos tareas es tocar dos veces el mismo `href`. **1.6 → 1.9**, y entre las dos suman los 13 puntos de emisión. `ping?: string` ya existe en `AnchorHTMLAttributes` y `next/link` hace spread de `restProps`: **`components/ui/Boton.tsx` NO se toca y `design/01` NO se abre** | `find .next/server/app -name '*.html' -exec grep -o 'ping="/api/evento/"' {} + \| wc -l` > 0, y `verificar-contacto.mjs` (1.4) en verde. Depende de 1.3 y 1.5 |
| 1.7 | `lib/meta-capi.ts` + `lib/eventos-servidor.ts` (NUEVO) | Parametrizar el nombre (`:44` tiene `event_name:'Lead'` a fuego) para poder emitir `Contact`; volver `ph` **opcional** (`:8` lo tiene obligatorio y en un clic no conocemos el teléfono del visitante), compensando con `external_id` (hash de `pa_ref`), IP, UA, `_fbp` y `_fbc`. Añadir el `34` que falta en el hash. Subir `/v21.0/` → **`/v26.0/`**. Comprobar `res.ok` y leer el cuerpo, soportar `test_event_code`, sacar el token de la query string, añadir `country: [hash('es')]` | Ejecutar el hash: `612345678` daba `d500e1b5…` y `34612345678` da `11f976ff…` — hoy **el 100 % de los hashes que recibe Meta son inservibles**. Test: `curl` a Graph v26.0 con `test_event_code` y ver el evento en Test Events (esto último ya es ola 3) |
| 1.8 | `components/layout/EventosGlobales.tsx:26,31,39` | ⛔ ~~Quitar `metaEstandar:'Contact'` de las tres ramas~~ — **eso dejaba la CAPI como única fuente de `Contact` y vaciaba de sentido el `event_id` compartido del punto 5** (sin gemelo de navegador no hay nada que deduplicar), justo mientras 1.25 sigue sin ejecutar. **Lo que se hace:** el Pixel **conserva `Contact` en las ramas de teléfono (`:26`) y WhatsApp (`:31`)** y ahora sí recibe `metaEventId` con el mismo `event_id` que calcula el Route Handler, para que la dedup nativa de Meta —`event_id` + `event_name`— colapse el par; eso es lo que arregla el hallazgo «`lib/eventos.ts:116` cae en `fbq(...)` sin `{eventID}`». **El email (`:39`) baja a `trackCustom` con nombre propio**: no es canal de campaña. **Los dos canales de valor se separan por `click_location` en `custom_data`, no por nombre de evento**, porque optimizar a un `Contact` que solo fuera WhatsApp compraría tráfico que no llama —contra la decisión 3 del dueño— y partiría en dos el volumen que necesita los 50 eventos/7 días. ⚠️ **La separación por nombre solo se vuelve obligatoria si 3.3 encuentra viva la pestaña de AEM**, que prioriza por nombre: si aparece, **1.8 se revisita** y teléfono pasa a nombre propio. Además: añadir `navigator.sendBeacon` al mismo endpoint como respaldo (Firefox trae `browser.send_pings=false` por defecto y uBlock filtra `ping`), y `gfn_active` y `device_type` al cuerpo del beacon. 🔴 **El Pixel no se apaga en ningún caso hasta que 1.25 pase en un iPhone real:** hasta entonces es la única fuente garantizada de `Contact` | En DevTools, un clic en `tel:` produce **dos** peticiones a `/api/evento/` en Chrome (`ping` + `sendBeacon`) y **una** en Firefox (`browser.send_pings=false`), y en los dos casos **una sola fila** en el libro mayor y **un solo `Contact`** en Meta. Que salgan dos peticiones y una fila es la prueba de que la dedup funciona, no un defecto. Hoy los tres canales colapsan en un `Contact` indistinguible y **sin `eventID`** |
| 1.9 | `lib/telefono.ts` (NUEVO) + los 8 puntos de render (`Pie.tsx:23`, `Cabecera.tsx:76`, `MenuMovil.tsx:87` y `:103`, `BarraMovil.tsx:8`, `app/page.tsx:488`, `app/presupuesto/page.tsx:42` y `:56`) | `atributosTelefono(ubicacion)` devuelve `{href, 'data-ubicacion', 'data-tel', ping}` o `null`, para spread. **Emite también el `ping` de los 7 puntos de ancla de teléfono** (1.6 cubre los otros 6). Arregla de paso los **seis `href='#'` muertos**, cada uno como toca: `<DatoPendiente>` donde el teléfono es texto, fallback a `/presupuesto/` donde es CTA, y ancla al formulario en los **cuatro** de `app/presupuesto/page.tsx` (`:42`, `:45`, `:56`, `:59` — los dos últimos son de WhatsApp y también caen en `'#'`, así que **sin ellos quedarían dos enlaces muertos en la página de mayor intención del sitio**). Unifica el destino degradado que hoy diverge (`Cabecera.tsx:76` cae en `'#'` y `BarraMovil.tsx:8` en `/presupuesto/`) | `find .next/server/app -name '*.html' -exec grep -o 'href="#"' {} + \| wc -l` pasa de **94** (medido hoy) a **0**. `document.querySelectorAll('a[data-tel]')` devuelve los 8, que es lo que el swap del DNI necesitará en ola 3. Depende de 1.6 |
| 1.10 | `app/proyectos/[slug]/page.tsx:84` y `:141`; `app/acabados/[modelo]/page.tsx:62` y `:84` | Cambiar el **envoltorio** `<Aparece as="section">` por `<section>` (no mover el `<h1>`: en proyectos vive dentro de un `grid-cols-[1fr_420px]` y moverlo cambia la maquetación). El `import Aparece` **se queda**: ambos archivos lo siguen usando. `app/globals.css` y `Aparece.tsx` NO se tocan. `animation-timeline: view()` queda descartado por escrito | `scripts/verificar-lcp-visible.mjs` (1.11) pasa de **17 de 45** a **0 de 45**. Manual: `grep -o 'class="aparece[^"]*"' .next/server/app/proyectos/xabia-pulido.html` pasa de **3** coincidencias a **2** |
| 1.11 | `scripts/verificar-lcp-visible.mjs` (NUEVO) + `package.json:8` | Cuarto verificador de `postbuild`: recorre los HTML siguiendo la jerarquía de etiquetas y **falla el build** si algún `<h1>` o algún `<img>` sin `loading="lazy"` tiene un ancestro con clase `aparece` | HOY imprime `17 de 45`; tras 1.10 imprime `0 de N` y EXIT=0 — **el denominador lo cuenta el script**, que con 1.28 dentro son 49 |
| 1.12 | `components/secciones/PaginaServicio.tsx:114` | `tamanos="(min-width: 768px) 50vw, 100vw"` → `tamanos="(min-width: 768px) 560px, 100vw"`. El hero vive en una columna fija de 560 CSS px (`:94`) y hoy pide w=1920 en 1920 DPR2 | Medido sobre `hormigon-lavado-2.jpg`: **629,5 kB a w=1920 → 372,7 kB a w=1200, ~257 kB por hero `priority` en las SEIS páginas de servicio**. `scripts/verificar-imagenes.mjs` NO se toca: el `PATRON_HERO` sigue siendo correcto por el `100vw` de móvil |
| 1.13 | `next.config.ts`, bloque `images` | `deviceSizes: [640,750,828,1080,1200,1536,1920,2048]` (el defecto menos 3840, más 1536), `formats` sin tocar, `imageSizes` sin declarar, **`qualities: [75]` nuevo**, `minimumCacheTTL: 2678400`. Comentario citando el sha256 idéntico de 2048/3840 y el porqué de 1536 | **1536**: el hero a sangre de proyecto pasa de **334,5 kB a 252,4 kB AVIF (−82,1 kB, −25 %)** para iPhone Plus/Pro Max/tablet retina/portátil 1440. **3840**: redundante probado — `denia` da 387,4 kB y sha256 `ae53a79f134c6e60` idéntico en 2048 y 3840. **`qualities`**: la superficie facturable por foto de origen baja de **3.200 a 32** transformaciones. **`minimumCacheTTL`**: `curl -I` sobre `/_next/image?...` pasa de `max-age=60` a `max-age=2678400` |
| 1.14 | `tailwind.config.ts:6` | Definir `spacing.22` (51 usos de `md:py-22`/`md:pb-22` en 12 ficheros y la clase **no existe**), definir `min-w-tactil`, y ampliar el content glob a `content/*.tsx` y `lib/` | `grep -o 'py-22' .next/static/css/*.css` pasa de **0** a >0, y las 50 secciones que se quedaban en 36 px de escritorio recuperan su respiración. La hamburguesa móvil pasa de **24 px** a 44 |
| 1.15 | `components/ui/Chip.tsx:1` | Borrar `'use client'`; devolver `<span>` cuando no recibe `onClick`; comentario de cabecera fijando el contrato («onClick solo desde importadores cliente»), porque TypeScript no lo ve | Home: chunk de ruta **1.08 kB → 909 B**. `aria-pressed` en `index.html` pasa de **2 a 0** (los dos botones muertos) y se queda en 6/0/0 en precios/acabados/proyectos; `min-h-tactil` invariante 34/28/28. Componentes cliente **14 → 13** |
| 1.16 | `components/contenido/Foto.tsx:49-56` | `fetchPriority={prioridad ? 'high' : undefined}` | `find .next/server/app -name '*.html' -exec grep -l 'fetchPriority="high"' {} + \| wc -l` pasa de **0** a **33 rutas** con preload de LCP marcado. ⚠️ **En camelCase y con `find`, no con `grep -c` ni con `*.html`**: React 19 emite `fetchPriority` camelCase (`node_modules/next/dist/client/image-component.js:120-127`, «In React 19.0.0 or newer, we must use camelCase prop» — y el HTML de hoy lleva literalmente `fetchPriority="low"`, que es la prueba), `grep -c` cuenta líneas sobre un HTML de una sola línea, y el glob `*.html` solo alcanza 17 de los 45 |
| 1.17 | `app/presupuesto/actions.ts` | `res.ok` de Resend con timeout; que su `catch` **no** cancele Telegram ni CAPI; honeypot que **no** devuelva un éxito del que el cliente dispare `form_submit` + `Lead`; `event_source_url` desde `listaCabeceras.get('referer')` (un `<input hidden>` no basta: zod descarta las claves fuera del esquema); límite por IP **antes** del base64 de 4 MB; `after()` de `next/server` para Telegram y CAPI | Test: POST con honeypot relleno → **0** eventos de conversión emitidos (hoy fabrica exactamente las conversiones falsas que debía evitar). `event_source_url` deja de decir `/presupuesto/` en **7 de los 8** puntos de montaje |
| 1.18 | `lib/eventos.ts` | `form_submit` → **`generate_lead`** (el nombre actual colisiona con la Medición mejorada de GA4); añadir `reference_code` y `event_id` al evento de lead; `value`/`currency`; entradas `lp_hero` y `lp_close` en `UBICACIONES`; deduplicar `calculator_use` por sesión; medir el quitado de filtro. ⚠️ **El renombrado va ANTES de marcar nada como evento clave en GA4** (ola 3, fase 0) | `grep -rn "form_submit" app components lib` → **0**. Las 6 de 15 `UBICACIONES` que hoy no se emiten jamás (`hero`, `section_mid`, `faq_end`, `project_detail`, `samples`, `pricing`) siguen sin emitirse hasta la tarea 2.5 |
| 1.19 | `components/layout/Atribucion.tsx` + `app/api/atribucion/route.ts` (NUEVO) | Gatear la escritura de `pa_attr` por la casilla de publicidad (🔴 **hoy se está infringiendo, sin ninguna cuenta creada**); capturar `fbclid` y componer `_fbc` **solo con consentimiento**, o guardarlo crudo en `pa_attr` y componerlo en el servidor; derivar el índice, **no escribir `fb.1.` a mano**: `location.hostname.split('.').length - 1`; volver a parchear al montarse el menú móvil (hoy `MenuMovil.tsx:106` **nunca** lleva `reference_code`); quitar la guarda de idempotencia que congela la página de origen. Y mover la escritura de `pa_attr`/`pa_ref` de `document.cookie` a **`Set-Cookie` de primera parte** desde el nuevo route handler: eso es lo que escapa a ITP, 0 €/mes | En Safari, la cookie `pa_attr` sobrevive más de 7 días (hoy `document.cookie` se borra a los 7 días, y a las **24 h** en el caso agravado de una llegada con `?gclid=`). Sin consentimiento, `document.cookie` no contiene `pa_attr` |
| 1.20 | `app/layout.tsx` | El guard pasa de `sitio.gaId` a `sitio.gaId \|\| sitio.adsId` (hoy, si mañana solo se configura el `AW-`, **gtag.js no se carga y nada de Ads funciona, en silencio**); el bloque inline lee `document.cookie` y emite el `consent default` ya en `granted` para quien aceptó (~60 bytes de HTML, cero JS). ⛔ ~~insertar tras `alternates` el spread condicional de `facebook-domain-verification`~~ — **el `<meta>` de verificación de dominio NO se implementa en esta ola.** El método es el **TXT de DNS (tarea 2.3)**; el propio plan cierra el asunto en «Paso 3 — Meta»: producción no sirve este build y Meta rastrea la home de WordPress. El spread condicional y la variable `metaDominioVerificado` solo se escriben el día que el dominio raíz sirva este build, y entonces con su propia tarea. Hoy serían código y variable de entorno muertos | Con las variables vacías: `grep -o 'gtag' .next/server/app/index.html \| wc -l` → **0** (modo no-op preservado). Con `NEXT_PUBLIC_GA_ID` puesto, el `consent default` sigue **antes** de gtag.js: posiciones 3074 / 3318 / 3428 en el HTML |
| 1.21 | `lib/config.ts` + `.env.example` | Añadir `NEXT_PUBLIC_DIRECCION` (que `lib/config.ts:11` ya lee y no está en el fichero), `adsId` y `adsEtiquetaLlamada`. ⛔ **`metaDominioVerificado` NO se añade**: alimentaba el spread condicional que 1.20 deja de implementar, y una variable sin consumidor es deuda desde el primer día | `npm run build` con `.env.example` copiado tal cual arranca sin dirección vacía. Hoy `sitio.adsId` **no existe ni en `lib/config.ts` ni en `.env.example`**, y dos temas de la investigación lo dan por hecho |
| 1.22 | `content/zonas.json:37` y `app/zonas/[municipio]/page.tsx:29-33` | 🔴 **TAREA REDUCIDA: el hallazgo del que salía está REFUTADO.** ⛔ ~~Excluir del sitemap los 8 municipios sin documentar~~ — **no hay nada que excluir**: `lib/datos.ts:11-13` ya filtra el objeto de metadatos, el sitemap tiene **8** zonas y **las 8 están documentadas**. Ejecutar la tarea original obligaría a **borrar una zona real** para llegar a la cifra de salida. **No se toca `app/sitemap.ts` ni `generateStaticParams`.** Lo que sí se hace: (a) actualizar el comentario de `zonas.json:37` a la terminología vigente («doorway abuse») con su URL; (b) añadir en `generateMetadata` un `robots: {index:false, follow:true}` **condicionado a que la zona no tenga ningún proyecto con foto**, como red para el futuro | `node -e "const z=require('./content/zonas.json');console.log(z.filter(x=>x.slug).length)"` → **8**, y `grep -o '/zonas/' .next/server/app/sitemap.xml.body \| wc -l` → **8**: **invariante antes y después**. No hay ninguna URL que retirar |
| 1.23 | `lib/schema.tsx` | Quitar la doble emisión del JSON-LD de migas en las nueve fichas de proyecto; añadir `@id` que enlace `schemaServicio`/`schemaFAQ`/`schemaMigas` con el `HomeAndConstructionBusiness` del layout; dejar preparado `sameAs` (el valor es dato del dueño, tarea 2.9) | `grep -o 'BreadcrumbList' .next/server/app/proyectos/<slug>.html \| wc -l` pasa de **4** a **2** por archivo, en las 9. ⚠️ **La cifra «de 2 a 1» era de `grep -c`, que sobre un HTML de una sola línea devuelve 1 siempre**: las ocurrencias reales medidas hoy son **4** por archivo (dos emisiones × `@type` + `itemListElement`), y quedan **2** al eliminar la duplicación |
| 1.24 | `lighthouserc.json` (NUEVO) | `@lhci/cli` 0.15.1, **preset móvil por defecto** — sin `"settings": {"preset":"desktop"}`. ⚠️ **Se crea y se corre `npx lhci autorun` sobre el HEAD actual ANTES de aterrizar 1.1**, y el informe se guarda: es la única tarea de la ola cuyo orden lo fija la medición y no el retorno, porque después de la ola 1 ya no hay línea base que tomar | `npx lhci autorun` produce un informe móvil. Es la única medición de rendimiento posible sin tráfico (ver última sección) |
| 1.25 | — (prueba de campo, no código) | 🔴 **Criterio de salida BLOQUEANTE**: en un **iPhone real con WhatsApp instalado**, sobre un preview desplegado, tocar el CTA de WhatsApp y el de teléfono y mirar si llega el POST. Nadie lo ha verificado en iOS: la prueba que fundó la decisión se hizo en Chrome de escritorio | El POST aparece en `vercel logs` con `Ping-To: tel:…` y `Ping-To: https://wa.me/…`. **Si no llega**, `sendBeacon` pasa a primario obligatoriamente y vuelve la dependencia de la hidratación que este diseño dice haber eliminado. Depende de 1.5, 1.6 y de un despliegue. **No se lanza campaña sin esta prueba hecha** |
| 1.26 | `components/layout/Consentimiento.tsx` | Diferir la descarga de `fbevents.js` con `requestIdleCallback` (fallback `setTimeout`) **tras la aceptación**, y no renderizar `next/script` cuando no hay `NEXT_PUBLIC_META_PIXEL_ID`. Es el remedio que el hallazgo crítico del Pixel enunciaba en una línea y que ninguna ola programaba: **107.502 B gzip y ~190 ms de bloqueo del hilo principal a 4×**, todo el valor está en diferirlo. **No toca el bloqueo duro** | El hilo principal deja de bloquearse ~190 ms a 4× en el instante de aceptar. Con las variables vacías, **0** apariciones de `fbq` en los 45 HTML |
| 1.27 | `components/secciones/FiltrosProyectos.tsx` y `FiltrosAcabados.tsx` | Llevar el filtro a **estado de React** y sincronizar la URL desde ahí, para que el grid salga en el HTML estático y desaparezca el `<template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING">`. ⚠️ **No basta cambiar la lectura por `window.location.search`**: `router.push` cambia la URL sin remontar. Cierra de paso los `page_view` espurios de cada clic de filtro y saca del bundle de cliente los dos JSON de contenido. Dos hallazgos **críticos** confirmados y dos altos, misma causa. Es la tarea más grande de la ola después de 1.28 | `find .next/server/app -name '*.html' -exec grep -o '<img' {} +` sobre `/proyectos/` y `/acabados/` pasa de **0 y 0** a >0 (referencia: 23 en `index.html`) — **medido: 8 y 10**, que son las 9 obras menos `xabia-pulido` y los 16 acabados menos los 6 sin original. ⛔ ~~y `BAILOUT_TO_CLIENT_SIDE_RENDERING` desaparece de los dos~~ **CRITERIO MAL ESCRITO, corregido el 2026-08-31:** el marcador aparece **1 vez en las 49 rutas**, `aviso-legal.html` incluido, que no tiene ni un filtro. Lo emite `<SpeedInsights />` de `@vercel/speed-insights/next`, que llama `useSearchParams()` por dentro; es preexistente y ninguna edición de estos dos archivos lo puede quitar. **Probado también que envolverlo en un `<Suspense>` propio no lo quita**: el recuento sigue en 49 y solo añade un límite resuelto alrededor del que ya falla. El criterio real es que el bailout **deje de vaciar las dos rejillas**, y eso es lo que mide la cifra de `<img>` |
| 1.28 | `app/lp/[slug]/page.tsx` + `app/lp/layout.tsx` (NUEVOS) | **Las landings, y van en la ola 1 porque no necesitan ninguna cuenta ni ningún panel**: son copy ya aprobado recompuesto sobre `PaginaServicio.tsx`. Cuatro slugs: `impreso`, `pulido`, `lavado` y `microcemento` (sin FAQ). Es además la vía para poner CTA de llamada y WhatsApp en el cuerpo de una página comercial **sin** enmendar `design/02` §A2, que es lo que bloquea 2.5 tras el visto bueno del dueño. `generateStaticParams` + `export const dynamicParams = false`; `alternates.canonical: '/lp/<slug>/'` **obligatorio** con barra final, o el root layout la canonicaliza a la home y la landing desaparece; `robots: {index:false, follow:true}`; **no** se añade al sitemap. Extiende `PaginaServicio.tsx` con campos opcionales del tipo `Servicio` (`ocultarSecciones?`, `ctaContacto?`, `sinAparece?`) respetados en el `.filter()` de `:75-83`. ⚠️ **El hero de `PaginaServicio.tsx:94` ya es un `<section>` normal, no lleva `<Aparece>`: ahí no hay nada que desactivar.** Lo que sí viene dentro son los **9 `<Aparece>` de las secciones de cuerpo**, y de esos la landing solo necesita eximir el cierre con CTA + formulario (`:280`): eso es lo que gobierna `sinAparece?`. ⚠️ `PASOS` está duplicado en `PaginaServicio.tsx:35-67` y `app/page.tsx:105-110`: si se toca, se unifica. 🔴 **Última tarea de la ola: añade 4 rutas.** Todas las cifras de «45 rutas» de este plan son *antes* de 1.28; con las cuatro landings dentro son **49 `○` + 2 `ƒ`**, y los gates se escriben contando rutas, no contra 45 congelado. 🔴 **Construible hoy, NO desplegable hasta que llegue el teléfono de 1.3**: una landing sin `tel:` ni `wa.me` reproduce exactamente el problema de cero caminos de contacto que esta ola existe para cerrar | `curl <preview>/lp/hormigon-impreso/ \| grep canonical` devuelve `/lp/hormigon-impreso/` y **no** `/`. `curl <preview>/lp/inexistente/` devuelve **404 estático**, no una invocación. `grep -o '/lp/' .next/server/app/sitemap.xml.body \| wc -l` = **0**. `/lp/hormigon-fratasado/` y `/lp/hormigon-desactivado/` siguen bloqueadas por 2.6 |
| 1.29 | `scripts/verificar-imagenes.mjs` (`PATRON_HERO`) | Ampliar el guardián de anchos: hoy **solo mira `imagenHero:`**, y por eso ~~4~~ **7 de los 8 heroes 21/9 a sangre** salen de originales de **898-1200 px** con el build en verde, servidos con `sizes="100vw"` y `priority`. Cubrir también las fotos que `app/proyectos/[slug]/page.tsx:61` sirve a sangre | El script nombra las que hoy pasan limpias — **son 7, no 4**: corregido el 2026-08-31 midiendo los ocho archivos; los tres de 1200 px son la misma deuda y la misma sesión pendiente que los cuatro de 898-960, y `design/05:125` ya los describía juntos. ⚠️ **Fallar el build con ellas dejaría el repo rojo hasta la sesión fotográfica pendiente**: el gate **avisa** mientras esas 7 sigan siendo el material que hay, y pasa a romper el día que lleguen las de 1600 px |
| 1.30 | Los 6 puntos de uso de `Foto` (`app/page.tsx:155`, `blog/[slug]:55`, `proyectos/[slug]:61`, `acabados/[modelo]:56`, `zonas/[municipio]:63`, `PaginaServicio.tsx:113`) | Unificar los `sizes` divergentes que hacen que **la misma foto se descargue dos y hasta tres veces en la misma página**. Va junto con 1.12, que ya corrige el peor de ellos | Para cada página, el conjunto de URLs `/_next/image?` distintas por foto de origen baja a **1**. Depende de 1.12 y 1.13 |
| 1.31 | `components/layout/Cabecera.tsx` | Dejar de animar `height` sobre un elemento sticky en flujo: es la **única animación no compuesta del sitio**, produce CLS en cada scroll y **salta en hidratación al aterrizar con `#ancla`, que es justo el caso de un anuncio**. La vía es una altura fija con transformación compuesta, no `height` | El CLS de `npx lhci autorun` (línea base de 1.24) baja en las rutas con submenú anclado. Depende de 1.24, o no hay contra qué comparar |

**Dependencias dentro de la ola:** **1.24 → todo lo demás** (la línea base de Lighthouse se toma
sobre el HEAD actual: después de la ola 1 ya no hay línea base que tomar, y es la única medición de
rendimiento posible sin tráfico). · 1.3 → 1.4, 1.6, 1.9, 1.25, 1.28. · 1.5 → 1.6, 1.8, 1.25. ·
1.6 → 1.9 (entre las dos suman los 13 puntos de emisión; ejecutadas al revés se edita dos veces el
mismo `href`). · 1.10 → 1.11. · 1.12 y 1.13 → 1.30. · 1.24 → 1.31.
· 1.1 → 1.2 (el script primero, la documentación después, para que la cifra del texto sea la que
imprime el gate). · 1.18 → **fase 0 de la ola 3**: el renombrado a `generate_lead` tiene que estar
desplegado antes de marcar eventos clave en GA4, o se marca un nombre que va a desaparecer.
· 1.25 → 1.8 y 1.4 (mientras no se sepa si el `ping` dispara en iOS, ni el Pixel se apaga ni la
condición (c) del gate se activa).

**Lo que la ola 1 desbloquea de la ola 2:** 1.19 (gatear `pa_attr`) deja el terreno listo para que
2.1 (banner con paridad) sea lo único que falta para poder encender publicidad legalmente. ⛔ ~~1.20
(spread condicional de verificación) deja el hueco donde entra el testigo TXT de 2.3~~ — **2.3 no
depende de nada de la ola 1**: el método es el TXT de DNS y el spread condicional ya no se escribe.

---

### Ola 2 — necesita una decisión o un dato del dueño

| # | Archivo | Qué se hace | Dato que falta | Cómo se verifica |
|---|---|---|---|---|
| 2.1 | `components/layout/Consentimiento.tsx` + `lib/cookies.ts` | Paridad de botones (**la única variante válida es los dos con `variante="contorno"` sobre oscuro**: la de «los dos primario» rompe la regla del ocre), panel granular, identificación del editor, y `borrarCookie()` en `lib/cookies.ts` **antes** de escribir `<BotonPreferencias>`, que borre también `pa_attr`, `pa_ref`, `_fbp` y `_fbc` | Validación de la asesoría legal sobre el texto de la primera capa | Son **cuatro** los elementos incumplidos hoy, no tres (falta también a: identificación del editor). Riesgo real con precedente: art. 5.1.a RGPD, patrón oscuro, mismo cajón que la CAPI. **Bloquea el primer euro de campaña** |
| 2.2 | `app/politica-de-cookies/`, `app/politica-de-privacidad/`, `app/aviso-legal/` | Declarar las cookies propias: `pa_consent`, `pa_attr`, `pa_ref`, `_fbp`, `_fbc`, **y el tratamiento del endpoint `/api/evento/`**: qué se registra sin consentimiento (hora, canal, página, `click_location`, `device_type`, IP para el límite de tasa), con qué base jurídica, cuánto se conserva y cuándo se borra. 🔴 **Sin esto, la asesoría revisa el banner sin que nadie le enseñe el único tratamiento de servidor del sitio** — un endpoint que registra la IP de todo visitante que pulse un CTA, con o sin consentimiento. Es la misma vara que el plan aplica a `pa_attr` cuando dice «esto está infringiendo AHORA». Si la asesoría no da por buena la IP sin consentimiento, la fila pre-consentimiento se escribe **sin IP**, con un contador de tasa por huella efímera | Texto de la asesoría | Las tres son plantillas vacías. **Bloquea el arranque de campañas y la verificación de anunciante de Google**. Verificación: cada nombre de cookie del repo aparece literalmente en `/politica-de-cookies/`, y el endpoint tiene su párrafo propio |
| 2.3 | Registrador de DNS (no toca el repo) + `NEXT_PUBLIC_META_DOMAIN_VERIFICATION` | Registro **TXT** en `pavimentos-albufera.com` (dominio raíz, sin `www.`). Se deja puesto para siempre | **Quién controla el DNS y cuándo se corta a Vercel.** Si el DNS lo lleva un tercero que no responde, el método no cambia: se pide el TXT igual y, como puente, el meta-tag va **en la home de WordPress** que hoy sirve el dominio, no en este repo | `dig TXT pavimentos-albufera.com`. Propaga en minutos, **hasta 72 h** en el peor caso. No bloquea medición: sin él solo se pierden permisos de edición de enlaces, Commerce y la verificación de negocio sin email de dominio propio |
| 2.4 | `components/layout/Atribucion.tsx` (índice del `fbc`) | Fijar si el canónico de producción es apex o `www` | **¿`pavimentos-albufera.com` o `www.pavimentos-albufera.com`?** | Gobierna el índice del `fb.N.<ms>.<fbclid>` (apex → 1, www → 2) y el `event_source_url` que Meta espera que «match the verified domain». Verificación: el `_fbc` compuesto tiene el mismo índice que el que escribe el Pixel |
| 2.5 | `content/servicios.tsx`, `components/secciones/PaginaServicio.tsx`, `app/zonas/[municipio]/page.tsx` | CTA de contacto en el cuerpo de las **6 páginas de servicio y las 8 de zona** (hero y cierre), en `tinta`/`contorno`, **nunca en ocre** | Visto bueno: **modifica el hero especificado en `design/02` §A2 (línea 56)**. 🔴 **Y hay que presentarle la disyuntiva, no resolverla por él:** el hero ya tiene dos CTA (`PaginaServicio.tsx:101` «Pedir presupuesto» en ocre y `:104` «Ver acabados» en contorno). O los de contacto **se añaden** —hero de cuatro botones, apilados en columna en móvil— o **«Ver acabados» cede su sitio** al de llamar. Las dos opciones cumplen la verificación por igual | Hoy **43 de las 45 páginas** no tienen ningún CTA propio, y **6 de las 15 `UBICACIONES`** no se emiten jamás. Verificación: `find .next/server/app -name '*.html' -exec grep -l 'data-ubicacion="hero"' {} + \| wc -l` pasa de 0 a **14** — ⚠️ con `find`, porque el glob `*.html` no ve las 8 zonas |
| 2.6 | `content/campanas.ts` (NUEVO) — solo para dos slugs | Desbloquear `/lp/hormigon-fratasado/` y `/lp/hormigon-desactivado/` | 🔴 **El rango de precio de la calculadora para esos dos servicios.** La regla del proyecto prohíbe rellenarlo, y una landing de Ads con un corchete es dinero quemado | Sin el dato, esas dos landings **no se publican**. Las otras cuatro (`impreso`, `pulido`, `lavado`, `microcemento` sin FAQ) no dependen de esto |
| 2.7 | `components/secciones/FormularioPresupuesto.tsx` + `app/presupuesto/actions.ts` | Decidir si el email pasa a obligatorio (y se añade a la variante corta) | **¿Email obligatorio, sí o no?** | Enhanced Conversions **no funciona con teléfono suelto**: exige email (preferido), dirección o teléfono con los demás campos. Sin la decisión, o solo convierten los leads con email, o se va por `gclid` + importación offline |
| 2.8 | — (proceso humano, no código) | Quién copia el `reference_code` de cada conversación de WhatsApp, y a dónde | **Nombre de la persona y del sitio donde se anota** | 🔴 Sin esto **no hay atribución de WhatsApp**, por mucho libro mayor que haya. El código ya viaja en el mensaje prellenado (`Atribucion.tsx:67`) y en el aviso de Telegram: lo que falta es que alguien lo lea de vuelta. Verificación: una fila del libro mayor con `reference_code` cruzada con una conversación real |
| 2.9 | `lib/schema.tsx` (`sameAs`) | Rellenar `sameAs` con el Perfil de Empresa de Google | **URL del Perfil de Empresa** | `sameAs` → Perfil de Empresa es el enlace del que cuelgan las llamadas gratis del GBP y la señal local de Ads. **Nadie lo había mirado.** Verificación: el JSON-LD del layout lleva `sameAs` con esa URL |
| 2.10 | — (decisión legal) | Qué se hace con todo lo anterior a la aceptación del banner en Meta | **Decisión del dueño, no código** | Para Meta se pierde el **100 %**, y son justo los clics de teléfono y WhatsApp. Para GA4 no se pierde: Consent Mode avanzado manda los pings. Recuperarlo exige decisión legal, no un route handler |
| 2.11 | `components/layout/Atribucion.tsx` (alcance del gateado de 1.19) | **¿`pa_ref` es cookie técnica (identificador de sesión de contacto) o publicitaria?** El plan tiene decidido `pa_attr` (gclid, utm_*) → casilla de publicidad, sin discusión; **`pa_ref` quedó explícitamente sin decidir** y 1.19 no lo cierra | **Criterio de la asesoría legal** | 🔴 Si se gatea, el código de referencia **desaparece del mensaje prellenado de WhatsApp para todo el que no acepte el banner** — es decir, se rompe justo el eslabón de la pregunta 5, «el que ningún código sustituye». Hasta que llegue la respuesta, 1.5 se implementa sin depender de `pa_ref` para nada salvo el `event_id` |
| 2.12 | `app/globals.css` + `components/ui/Aparece.tsx` (o ninguno) | **¿Se borra `.aparece`?** Sin JavaScript las secciones se quedan en `opacity: 0` **para siempre** en **39 de las 45 rutas**, hasta 11 en la home. Lo único que lo arregla del todo es borrar el efecto | **Decisión del dueño, no del arquitecto** | El plan cerraba con este riesgo declarándolo decisión del dueño y **no se lo preguntaba a nadie**. Va como **pregunta 13**. Verificación si se decide borrarlo: `grep -o 'class="aparece' ` sobre los 45 HTML pasa de 49 a **0** |

---

### Ola 3 — necesita cuentas creadas o dinero

| # | Dónde | Qué se hace | Cómo se verifica |
|---|---|---|---|
| 3.1 | Panel GA4 | Fase 0 completa: crear propiedad → **registrar las 16** (12 dimensiones de evento + 3 métricas + 1 propiedad de usuario; **`page_path` NO se registra**, aunque siga viajando en el hit) → evento derivado `phone_click_mobile` → marcar eventos clave → **declarar por escrito la vía única de `page_view`: se conserva la Medición mejorada y no se emite `page_view` propio**. Detalle y orden exacto en la sección siguiente | DebugView muestra `click_location`, `device_type` y `form_location` **como dimensiones, no como parámetros crudos**. Depende de 1.18 desplegado |
| 3.2 | Panel Google Ads | Crear cuenta → enlazar con GA4 → **auto-tagging** → importar eventos clave y **promoverlos a primarios a mano** (llegan secundarios por defecto) → activar **call reporting con GFN** → añadir **recurso de llamada** → puja **Maximizar clics con tope de CPC máximo** | La columna «Conversiones» lista `generate_lead`, `phone_click_mobile` y `whatsapp_click` como primarias con **valor estático distinto**, en ese orden. Depende de 3.1 |
| 3.3 | Panel Meta Business Manager | Crear BM y Pixel, token de CAPI, comprobar en Events Manager **si sigue existiendo la pestaña «Aggregated Event Measurement»**. Campaña optimizada a **`Contact`**, no a `Lead` | Test Events recibe el `Contact` de servidor con `action_source: 'website'` y `event_source_url` de la página real. Depende de 1.7 y de 2.3 |
| 3.4 | `lib/llamadas.ts` (NUEVO) | Fase 1: DNI de Google. `gtag('config','AW-ID/LABEL',{phone_conversion_number, phone_conversion_css_class, phone_conversion_options})`, invocado tras el `consent update` dentro del `useEffect` de `Consentimiento.tsx`, gateado por `sitio.adsId && sitio.adsEtiquetaLlamada && nap.telefono` (ese guard también cubre el placeholder `'96X XXX XXX'`, que no casaría con nada y no daría ningún aviso). **Parchea los ocho puntos**, no uno. Flag `activado` de módulo para idempotencia | Con Tag Assistant: el número pintado cambia al GFN tras aceptar el banner, en los 8 puntos. `lib/telefono.ts` (1.9) es lo que hace posible el `querySelectorAll('a[data-tel]')`. 🔴 **Y hay que comprobar en producción si con `ads_data_redaction:true` y `ad_storage:'denied'` la petición de DNI devuelve GFN antes de aceptar**: hasta comprobarlo, el techo real de medición de llamadas es una hipótesis |
| 3.5 | — | ⛔ **MOVIDA A LA OLA 1 (tarea 1.28).** Las landings no necesitan ninguna cuenta ni ningún panel: son copy ya aprobado recompuesto sobre `PaginaServicio.tsx`, y cuatro de las seis son construibles hoy. Estaban enterradas dos olas por debajo de su coste real, y son además la vía para poner CTA de llamada y WhatsApp en una página comercial **sin** la enmienda de `design/02` §A2 que bloquea 2.5. Lo único que sigue aquí es la publicación: **no se despliegan hasta tener el teléfono de 1.3** | Ver 1.28. `/lp/hormigon-fratasado/` y `/lp/hormigon-desactivado/` siguen bloqueadas por 2.6 |
| 3.6 | `scripts/verificar-imagenes.mjs` | Si `content/campanas.ts` usa fotos fuera de `/obras/` o `/acabados/`, **añadir `campanas` a `PATRON`**. No hay red: hoy el script no las vería | `node scripts/verificar-imagenes.mjs` en verde con las fotos de landing citadas |
| 3.7 | Paneles | **Fase 2 — el swap.** Disparador: «Llamadas desde el sitio web» sostiene volumen propio **durante 30 días**, no una fecha | Ese día: llamadas → primarias con umbral de duración; `phone_click_mobile` → secundaria. `generate_lead` y `whatsapp_click` no se tocan. Verificación: la columna «Conversiones» no contiene a la vez la llamada real y el clic al teléfono |
| 3.8 | Paneles | **Fase 3 — puja automática.** Maximizar conversiones cuando el conjunto de primarias dé flujo estable; objetivo de CPA **solo con ≥30 conversiones/30 días** | Google **no documenta ningún mínimo** para Maximizar conversiones: el único requisito citable es «You must set up conversion tracking to use this strategy». Los 30/30 son la ventana de **evaluación** de tCPA, no de activación |
| 3.9 | Data Manager API | Rescate de valor: subir con valor real las llamadas de **>15 s** que no llegan al umbral de conversión (una de 20-59 s con umbral en 60 s **no cuenta pero sí tiene número**) | `POST datamanager.googleapis.com/v1/events:ingest`, scope `auth/datamanager`, 2.000 eventos, sin developer token, `productDestinationId` a una acción `UPLOAD_CLICKS`. ⚠️ **Un developer token nuevo ya no puede llamar a `UploadClickConversion` desde el 15-06-2026.** ⚠️ El quickstart documenta `gcloud auth ... --impersonate-service-account`, **inservible en un Server Action**: hace falta JWT-bearer con cuenta de servicio. Ventanas duras: **90 días** con `gclid`, **63 días** sin él. Depende de 2.8 |

---

## Lo primero que hay que crear en los paneles, y por qué el orden importa

**El orden no es preferencia: es que GA4 no rellena dimensiones hacia atrás.** Un evento que llegue
antes del alta de su dimensión conserva el parámetro dentro del hit pero queda **invisible en
informes para siempre**. Es el único punto de todo este plan que es literalmente irrecuperable.

### Paso 0 — antes de tocar ningún panel

Desplegar la tarea **1.18** (`form_submit` → `generate_lead`). Marcar como evento clave un nombre
que va a cambiar obliga a rehacer el marcado y deja el histórico partido en dos.

### Paso 1 — GA4 (primero, y sin prisa por lo demás)

Orden exacto, y cada flecha es una dependencia real:

> crear propiedad → **registrar las 16** (12 dimensiones de evento + 3 métricas + 1 propiedad de
> usuario; **`page_path` NO se registra**, aunque siga viajando en el hit) → crear el evento derivado
> `phone_click_mobile` (Admin > Eventos > Crear evento, condición `device_type = mobile`) → marcar
> eventos clave → enlazar con Ads.

⚠️ **Son 16, no 17.** El desglose de abajo suma 12 + 3 + 1, y el decimoséptimo —`page_path`— es
precisamente el que **se emite y NO se registra**. Que la instrucción operativa dijera «17» en la
única parte del plan que el propio documento declara «literalmente irrecuperable» era el peor sitio
posible para un número mal puesto.

**Tarda:** minutos de trabajo; las dimensiones empiezan a poblar informes en **24-48 h**.
**Bloquea:** todo lo demás. Sin la propiedad no hay eventos clave, sin eventos clave no hay
acciones de conversión que importar a Ads.

#### Las 16 dimensiones personalizadas que hay que registrar (de 17 parámetros que el código emite)

**Como DIMENSIÓN de evento (12):**

| Parámetro | Dónde se emite |
|---|---|
| `device_type` | `lib/eventos.ts:99` — en **todos** los eventos; `pointer: coarse`, no user-agent |
| `click_location` | `EventosGlobales.tsx:27`, `:33`, `:39` — 16 valores cerrados en `lib/eventos.ts:23-41` |
| `question_topic` | `Acordeon.tsx:24` — 9 valores cerrados en `lib/eventos.ts:62-72` |
| `question_id` | `Acordeon.tsx:24` — **opcional**: redundante con `question_topic` y de alta cardinalidad (el texto de la pregunta, 100 caracteres) |
| `percent` | `ProfundidadScroll.tsx:35` |
| `use_case` | `Calculadora.tsx:42` |
| `ground_state` | `Calculadora.tsx:43` |
| `filter_type` | `FiltrosAcabados.tsx:34` |
| `filter_value` | `FiltrosAcabados.tsx:34` |
| `form_location` | `FormularioPresupuesto.tsx:72` |
| `space_type` | `FormularioPresupuesto.tsx:73` |
| `municipality` | `FormularioPresupuesto.tsx:74` |

**Como MÉTRICA de evento (3)** — y esto es lo que no se puede reescribir hacia atrás: son
**numéricos**, y registrados como dimensión se convierten en cadenas que no se pueden sumar ni
promediar, y explotan en filas:

| Parámetro | Unidad | Dónde |
|---|---|---|
| `surface_m2` | estándar | `Calculadora.tsx:41` — el deslizador va de 10 a 400 con paso 5, más entrada libre |
| `estimate_min` | **moneda EUR** | `Calculadora.tsx:44` |
| `estimate_max` | **moneda EUR** | `Calculadora.tsx:45` |

**Como PROPIEDAD DE USUARIO (1):**

| Parámetro | Por qué no es dimensión de evento |
|---|---|
| `reference_code` | `EventosGlobales.tsx:34`. Alfabeto de 32 caracteres × 6 posiciones (`lib/cookies.ts:22-28`) = **32⁶ ≈ 1.070 millones** de combinaciones, prácticamente único por visitante. Como dimensión de evento es inservible en informes estándar por cardinalidad. Su sitio es **Exploraciones y BigQuery** |

**El decimoséptimo, que se emite y NO se registra:** `page_path` (`lib/eventos.ts:98`, en todos los
eventos). GA4 ya deriva «Ruta de página» de `page_location`; registrarlo solo genera dos columnas
que no cuadran. **Sigue viajando en el hit sin darlo de alta.** Si no se dice esto, la cuenta sale a
16 y parece un error.

**No hay que registrar** `value` ni `currency`: son nativos de GA4.
**Al registrar, la interfaz muestra cuántas ranuras quedan de cada tipo**: úsala como autoridad
sobre los topes exactos, en vez de fiarte de una cifra de memoria. Con 16 altas el tope de una
propiedad estándar no es la restricción; el problema es el **ámbito**.

#### Eventos clave a marcar, y con qué papel

| Marcado | Eventos |
|---|---|
| **Primarias** (columna «Conversiones», pujan) | `generate_lead` · `phone_click_mobile` · `whatsapp_click` — **cada una con valor estático distinto en el panel de Ads, en este orden: `generate_lead` > llamada > `whatsapp_click`**. El orden **es** la mitigación: `whatsapp_click` será la más frecuente y es la única sin verificación humana posterior; tres primarias con el mismo peso hacen que el algoritmo optimice hacia el evento más barato |
| **Secundarias** (columna «Todas las conversiones», solo observación) | `phone_click` crudo (para leer la proporción escritorio/móvil) · `email_click` · `calculator_use` · `scroll_depth` · `faq_open` · `samples_filter` |

⚠️ **Las acciones importadas de GA4 llegan a Ads como secundarias por defecto** —Google lo hace a
propósito, para no contar dos veces—: **hay que promoverlas a mano**.

⚠️ **El escritorio no se excluye.** `lib/eventos.ts:85-101` ya manda `device_type` en todos los
eventos; el evento derivado `phone_click_mobile` es un cambio de panel, cero código. En este oficio
se investiga en escritorio y se llama luego desde el móvil: un ajuste de puja −100 % tiraría tráfico
que convierte por otra vía.

### Paso 2 — Google Ads

🔴 **Paso 0 bis, antes de crear la cuenta: publicar ESTE build en el dominio.** Apuntar
`pavimentos-albufera.com` a Vercel, comprobar con `curl -I` que la home servida es este build —hoy
**no lo es**: el despliegue de producción no sirve ni una sola foto— y que `/api/evento/` responde
204 en el dominio real. **Ningún euro de campaña antes de esto.** El plan reconoce dos veces que
«producción no sirve este build» y que esa home es WordPress, y no tenía ni una tarea que lo
cambiara: ejecutar el Paso 2 tal como estaba escrito pone las URL finales de los anuncios en la web
vieja, **sin `ping`, sin `/api/evento/`, sin `generate_lead`, sin Consent Mode y sin landings**. Es
el único punto del plan donde alguien pierde dinero por seguirlo al pie de la letra. Depende de la
pregunta 2 (quién controla el DNS).

Después: crear cuenta → **enlazar con GA4** → **activar auto-tagging** → importar los eventos clave y
promoverlos → **activar call reporting con GFN** (España está en la tabla de países, con número
local y gratuito) → **añadir recurso de llamada** a la campaña.

**Puja de arranque: Maximizar clics con tope de CPC máximo.** El eCPC está retirado, y Google señala
Maximizar clics como la opción para quien no tiene datos de conversión. En Maximizar clics **ninguna
primaria puja**: el marcado del día 1 existe para **construir histórico limpio**, no para pujar.

**Tarda:** la cuenta es inmediata; el GFN necesita el despliegue de `lib/llamadas.ts` (3.4) para
medir llamadas *desde la web*, aunque el recurso de llamada funciona desde el minuto uno.
**Bloquea:** nada de la ola 1. Depende de 2.1 y 2.2 (verificación de anunciante).

⚠️ Se escribe «recurso de llamada», nunca «anuncio de solo llamada»: esa superficie se retiró en
febrero de 2026.

**Solapamientos que hay que tener escritos, porque nadie los había escrito:**
`{phone_click_mobile, «Llamadas desde el sitio web»}` son **el mismo lead contado dos veces** y no
pueden ser primarias a la vez. `{«Llamadas desde anuncios», «Llamadas desde el sitio web»}` no
pueden dispararse por la misma llamada. `{recurso de llamada, phone_click}` **nunca** solapan,
porque un toque en el recurso de llamada marca sin pasar por el sitio.

### Paso 3 — Meta Business Manager

**Verificación de dominio: por registro DNS TXT, en el registrador, y se deja puesto para siempre.**

El discriminador no es la elegancia en Next: **producción no sirve este build** (medido: el
despliegue actual no sirve ni una sola foto). Meta comprueba el meta-tag y el archivo HTML en la
home del **dominio raíz**, y hoy esa home es WordPress. Un `<meta>` commiteado en este repo no
existe en el dominio que Meta rastrea hasta que se corte el DNS a Vercel, y moriría en la ventana de
migración. El TXT es ortogonal a la migración y a qué build esté publicado.

Se deja puesto porque **dos páginas oficiales de Meta se contradicen** sobre si el testigo se puede
retirar (developers dice «Leave the TXT entry … as it may be checked periodically»; el Business Help
Center dice que se puede quitar). Ante contradicción, gana el método que sobrevive a quedarse puesto
eternamente con coste cero.

Dominio raíz sin prefijo: `pavimentos-albufera.com`. **Tarda** minutos, hasta **72 h** en el peor
caso. **No bloquea medición**: sin verificar solo quedan fuera los permisos de edición de enlaces de
anuncio y orgánicos, Commerce, y la verificación de negocio sin email de dominio propio. ⛔ ~~El
spread condicional de `app/layout.tsx` (tarea 1.20) se deja escrito como refuerzo opcional~~ — **no
se escribe en absoluto**: escribir código y una variable de entorno para un mecanismo que este mismo
párrafo declara inservible es deuda desde el minuto uno. Se reabre el día que el dominio raíz sirva
este build, y entonces con su propia tarea.

#### AEM: la lista ordenada de 8 eventos NO se escribe, y decirlo es la respuesta

La premisa del encargo ya no se sostiene. Meta, literal: **«You no longer need to prioritise eight
conversion events per domain for web conversion optimisation»**, **«The Aggregated Event Measurement
tab in Meta Events Manager has been removed because you no longer need to configure your web
events»**, **«You aren't required to verify your website domains for purposes related to event
configuration»** y **«You don't need to select a conversion domain when you create a campaign»**.
Congelar hoy un ranking de 8 sería congelar una lista que probablemente ni existirá en la cuenta.

Y la trampa que sí sigue viva: **«Events sent to Meta via the Conversions API may also be processed
in accordance with limits set by Aggregated Event Measurement»** — la CAPI **no** es una puerta
trasera para escapar de AEM.

**Comprobación operativa, que sí hay que dejar escrita:** al crear la cuenta, abrir Events Manager y
mirar si existe la pestaña «Aggregated Event Measurement».

- **Si NO está:** no se configura nada y este asunto se cierra.
- **Si SÍ está** (la cuenta no ha recibido el despliegue): la **única** regla aplicable es que la
  ranura 1 coincida con el evento por el que optimice la campaña de Meta — y por cuál optimiza es
  dato del dueño, no técnico. El orden de contingencia, derivado de las decisiones ya tomadas y
  **solo si la pestaña aparece**, sería: **1)** el evento de la campaña (`Contact`) · **2)** el
  nombre propio del teléfono, **que solo existe si la pestaña aparece y 1.8 se revisita para
  separarlo** · **3)** `Lead` · **4)** el nombre propio del email · **5-8)** los `trackCustom` que
  queden. Ninguna fuente
  oficial vigente enuncia hoy la semántica «solo se reporta el evento de mayor prioridad»: viene de
  terceros y de documentación retirada, así que este orden no se defiende como doctrina.

**Lo que sí es prerrequisito, exista o no la pestaña:** hoy `EventosGlobales.tsx:26`, `:31` y `:39`
mandan **los tres canales con `metaEstandar:'Contact'`** y **sin `eventID`**, así que teléfono,
WhatsApp y email colapsan en una sola entrada indistinguible y sin gemelo deduplicable. La tarea 1.8
los separa: email a nombre propio, y llamada y WhatsApp distinguidos por `click_location` dentro de
`custom_data`, con el `event_id` compartido. ⚠️ **Separarlos también por nombre solo es requisito si
AEM sigue vivo**, porque AEM prioriza por nombre de evento: por eso esta comprobación de 3.3 puede
mandar a revisitar 1.8, y por eso está escrita.

**Evento de campaña de Meta: el conjunto de contacto, no `Lead`.** ⚠️ **Y con una precisión que
cambia la decisión:** si `Contact` quedara reservado a WhatsApp, optimizar la campaña a `Contact`
optimizaría **en contra de la decisión 3 del dueño**, que pone la llamada por delante — el algoritmo
compra el tráfico que dispara el evento por el que se puja, así que Meta compraría justo el tráfico
que menos llama. Por eso la tarea 1.8 **conserva `Contact` como nombre compartido de llamada +
WhatsApp** y separa los dos canales por `click_location` en `custom_data`, no por nombre de evento.
Con los volúmenes de este negocio, agrupar es además lo que da más opciones de llegar a los 50/7
días. **La separación por nombre solo se hace si 3.3 encuentra viva la pestaña de AEM**, que prioriza
por nombre; si aparece, se revisita 1.8 y se elige entonces qué evento va en la ranura 1.

Meta exige **50 eventos de optimización por
conjunto de anuncios cada 7 días** para salir de la fase de aprendizaje. `Lead` (el formulario, que
el dueño declara minoritario) no llegará jamás a 50/semana en este negocio. Si `Contact` tampoco los
sostiene, el objetivo baja a **visitas a la página de destino** y Meta deja de ser un canal
optimizado por conversión — dicho así, sin disimularlo. `Contact` va con bloqueo duro de
consentimiento, así que su volumen está topado por la tasa de aceptación del banner.

---

## Lo que hay que preguntarle al dueño

Solo medición y campañas. Las 33 preguntas de contenido del vault de Obsidian no se repiten aquí.

0. 🔴 **¿Cuál es el teléfono de contacto y el número de WhatsApp que van publicados en la web?**
   *Desbloquea:* **todo**. `lib/config.ts:2-4` declara el teléfono como no confirmado
   (`design/05` §A1) y `.env.example` lo tiene vacío, así que hoy el sitio publica 45 páginas con
   **cero caminos de contacto**. Sin ese dato caen las tareas 1.4, 1.6, 1.9, 1.25, la ola 3 entera y
   el despliegue de las landings — es decir, los dos canales que dan dinero. **Es la primera
   pregunta y nunca se te había hecho**: la ola 1 se titulaba «sin depender de nadie» y se rompía en
   su tercera tarea esperando este número.
1. **¿Cuántas llamadas al mes esperas con el presupuesto que piensas poner?**
   *Desbloquea:* la rama entera de la puja. **Con ≥30 llamadas/mes** la secuencia recorre las cuatro
   fases y llega a Maximizar conversiones y luego a CPA objetivo. **Con 5-10 llamadas/mes la campaña
   no sale nunca de Maximizar clics**: las fases 2 y 3 no se disparan y el marcado primaria/
   secundaria **jamás llega a ser señal de puja** — sigue importando por una sola razón, construir
   el histórico limpio para el día que sí haya volumen. En ese escenario la palanca no es la puja:
   es la pregunta 5.
2. **¿Quién controla el DNS de `pavimentos-albufera.com` y cuándo se corta a Vercel?**
   *Desbloquea:* la tarea 2.3. Si tienes acceso al registrador, el TXT se pone hoy. Si lo lleva un
   tercero que no responde, el método no cambia —cambia el plazo— y como puente el meta-tag va en la
   home de WordPress, no en este repo.
3. **¿El canónico de producción es `pavimentos-albufera.com` o `www.pavimentos-albufera.com`?**
   *Desbloquea:* la tarea 2.4. Gobierna el índice del `_fbc` (`fb.1.` frente a `fb.2.`) y el
   `event_source_url` que Meta exige que coincida con el dominio verificado.
4. **¿Cuál es el rango de precio por m² del hormigón fratasado y del desactivado?**
   *Desbloquea:* la tarea 2.6, es decir `/lp/hormigon-fratasado/` y `/lp/hormigon-desactivado/`. La
   calculadora no tiene rango para esos dos, la regla del proyecto prohíbe inventarlo, y una landing
   de Ads con un corchete es dinero quemado.
5. 🔴 **¿Quién contesta el WhatsApp, y dónde va a copiar el código de referencia de cada
   conversación?**
   *Desbloquea:* la atribución de WhatsApp entera. El código de 6 caracteres ya viaja dentro del
   mensaje prellenado y en el aviso de Telegram, pero **hoy nadie lo lee de vuelta**. Si nadie lo
   copia, no hay atribución de WhatsApp por mucho libro mayor que se construya. Es el eslabón que
   ningún código sustituye, y **no se te había preguntado**.
6. **¿Existe algún registro de qué lead acabó en obra, y por cuánto?**
   *Desbloquea:* la conversión offline, el valor por lead y la Data Manager API (3.9). Sin ese
   registro, tROAS y «Maximizar valor de conversión» quedan fuera, y un plan que prometa valor por
   lead promete algo que no puede entregar. Ventanas duras: **90 días** con `gclid`, **63** sin él.
7. **¿El email pasa a obligatorio en el formulario?**
   *Desbloquea:* la tarea 2.7 y con ella Enhanced Conversions, que **no funciona con teléfono
   suelto**. Las tres salidas son: email obligatorio (y añadido a la variante corta), convertir solo
   los leads con email, o ir por `gclid` + importación offline.
8. **¿Qué hacemos con todo lo anterior a la aceptación del banner en Meta?**
   *Desbloquea:* la tarea 2.10. Hoy se pierde el **100 %**, y son justo los clics de teléfono y
   WhatsApp. Es decisión legal, no técnica: para GA4 no se pierde nada porque Consent Mode avanzado
   manda los pings.
9. **¿Cuál es la URL del Perfil de Empresa de Google?**
   *Desbloquea:* la tarea 2.9 (`sameAs` en `lib/schema.tsx`) y, con ella, las llamadas gratis del
   GBP y su serie temporal por canal, que es lo único que se puede contar de una llamada orgánica.
10. **¿Damos por buena la asesoría legal para el banner y los tres textos legales?**
    *Desbloquea:* las tareas 2.1 y 2.2, que son **bloqueantes del primer euro**: sin política de
    cookies que declare `pa_consent`, `pa_attr`, `pa_ref`, `_fbp` y `_fbc` no arranca campaña ni pasa
    la verificación de anunciante de Google.
11. **¿Aceptas que el hero de las seis páginas de servicio y las ocho de zona lleve CTA de llamada y
    WhatsApp?**
    *Desbloquea:* la tarea 2.5. **Modifica `design/02` §A2 (línea 56)**, así que es enmienda de especificación,
    no arreglo. Hoy **43 de las 45 páginas** no tienen ningún CTA propio. Y hay una disyuntiva
    dentro: el hero ya tiene dos botones («Pedir presupuesto» en ocre y «Ver acabados» en contorno).
    O los de contacto se **añaden** —cuatro botones, apilados en columna en móvil— o «Ver acabados»
    **cede su sitio** al de llamar. Las dos cumplen igual; elige tú.
12. **¿`pa_ref` es cookie técnica o publicitaria?**
    *Desbloquea:* la tarea 2.11, y con ella el alcance real del gateado de 1.19. Es criterio de la
    asesoría legal. Si se considera publicitaria, el código de referencia **deja de inyectarse en el
    mensaje de WhatsApp para todo el que no acepte el banner**, es decir se rompe el eslabón de la
    pregunta 5. `pa_attr` (gclid, utm_*) sí es publicitaria sin discusión; `pa_ref` estaba sin
    decidir y nadie lo había planteado.
13. **¿Se borra el efecto `.aparece`?**
    *Desbloquea:* la tarea 2.12. Sin JavaScript, las secciones con ese efecto se quedan invisibles
    **para siempre** en **39 de las 45 rutas**, hasta 11 en la home. No bloquea el despliegue
    —Googlebot ejecuta JS y todo eso está bajo el pliegue— pero es pérdida total de contenido si el
    chunk falla. Lo único que lo arregla del todo es borrarlo, y eso borra uno de los tres
    movimientos aprobados con el sistema declarado cerrado. **Es tu decisión, no del arquitecto**, y
    el plan la declaraba tuya sin llegar a preguntártela.

Y un dato que **no** te vamos a pedir porque se mide solo: **la tasa de aceptación del banner**, que
topa el volumen medible de llamadas por GFN y de `Contact` en Meta. Para eso existe `gfn_active`
(tarea 1.8), y por eso ese ítem deja de ser opcional.

---

## Lo que NO recomiendo hacer, y por qué

**Infraestructura de medición**

- **sGTM de pago (Stape, Addingwell) ni sGTM propio en Cloud Run.** El beneficio que se vende
  —cookies que sobreviven a Safari— **no lo entrega**: vive en un subdominio con CNAME, la
  definición literal de CNAME cloaking de WebKit, y sus cookies quedan igualmente capadas a 7 días.
  Stape lo admite en su propia documentación y **te cobra un power-up (plan Pro o superior) para
  parchearlo**. Coste evitado: **Stape 20 $/mes, Addingwell 90 €/mes, Cloud Run ~100 USD/mes** con
  el mínimo de 2 instancias que recomienda Google. ⚠️ Y no te lleves por delante la recomendación
  positiva que lo acompaña: mover la escritura de `pa_attr`/`pa_ref` a **`Set-Cookie` desde
  `app/api/atribucion/route.ts`, mismo origen, 0 €/mes**, sí se hace (tarea 1.19) — eso es lo que
  WebKit recomienda por escrito y sí escapa a ITP.
- **GTM web.** Decisión 2 del dueño, y además el contenedor se paga en el hilo principal de las 47
  rutas para orquestar 8 eventos que ya están tipados y cerrados en `lib/eventos.ts`.
- **A/B con `middleware.ts`.** «Runs globally before the cache»: se metería en el camino crítico de
  todos para resolver el problema de unos pocos, y **rompe la propiedad «todas estáticas»**. Sin
  volumen no hay potencia estadística que justifique nada. (Nota: la propiedad `proxy` de
  `vercel.json` tampoco sirve — «You can't use `proxy` with frameworks that build their own routing
  middleware, such as Next.js».)
- **Call tracking de terceros (Nimbata, CallRail).** CallRail **no vende números españoles**, y una
  llamada capturada por DNI de un tercero **no es importable** a Google Ads. El GFN de Google sí lo
  es: los requisitos son «either a call asset/call-only ad OR a website with conversion tracking
  installed and a Google forwarding number displayed».
- **Conversiones offline de llamada en Meta.** `event_time` no admite más de **7 días** y este
  negocio cierra obras semanas después. Los 7 días bastan por sí solos.

**Mecanismo del clic saliente** *(los tres descartados por el arbitraje del `ping`)*

- **Ruta intermedia `/ir/whatsapp/` con 302.** Mete un round trip completo antes de que el móvil
  marque, **rompe los universal links de iOS** —Apple lo desaconseja explícitamente, y es peor en
  iOS 18+—, la política de destino de Google Ads prohíbe «redirects from the final URL that take the
  user to a different domain» (así que esa URL **nunca** podría usarse en un anuncio), y **no tiene
  versión para `tel:`**, que es el canal mayoritario. *(No confundir: `/ir/whatsapp/` como ruta de
  libro mayor alcanzada por `ping` sí sería válida; como redirección 302 no.)*
- **`sendBeacon` como mecanismo PRIMARIO.** Exige hidratación y consentimiento previos, que es
  exactamente el agujero que hay que tapar: `EventosGlobales.tsx:16` es un `useEffect`. Sobrevive
  como **respaldo** porque Firefox trae `browser.send_pings=false` por defecto y uBlock filtra
  `ping`.
- **Beacon → CAPI directo.** Es lo anterior con otro nombre, y al saltarse el libro mayor propio
  manda a Meta lo único que no debería salir sin consentimiento **y** no deja fila para la
  importación offline por `gclid`, que es justo lo que Google necesita.
- **Middleware para capturar los clics.** Gravaría las 47 rutas para servir a un puñado de clics.

**Componentes y sistema de diseño** *(los cuatro descartados: el sistema termina en 14)*

- **`<Insignia>` como componente 15.** Duplicaría `Chip.tsx:19-21` para reproducir un átomo que
  `design/02:36-37` ya llama «chip activo del muestrario». El efecto que busca se consigue **borrando
  una línea**, medido: home **1.08 kB → 909 B**.
- **`<Telefono>` como envoltorio `<a>` de servidor.** Tres de los ocho puntos son `<Boton>` y uno es
  un `<span>`: sustituirlos obliga a reimplementar las clases de `Boton.tsx:13-27`, y **el fallback
  no es uniforme** en los ocho. Un componente que centraliza un fallback no uniforme acaba con un
  prop que dice cuál de los tres usar: un switch disfrazado de componente. *(La variante polimórfica
  `<Telefono como={Boton}>` se cae por lo mismo: tendría nombre y superficie de API, y alguien
  preguntaría en tres meses si va en §3.)*
- **`<FormularioDiferido>`.** Refutado por su propio autor («esto NO baja el First Load JS del repo
  hoy») y confirmado midiendo: la isla más grande del repo son **3.587 B gz** compartidos con la
  calculadora, y diferirla cuesta un round-trip y CLS en `/presupuesto/`, la página de mayor
  intención del sitio. Disparador para reabrirlo: **un chunk de isla propia por encima de ~10 kB
  gz**.
- **Plantilla de landing nueva.** Clonar `PaginaServicio.tsx` garantiza divergencia — es el error del
  que este repo ya salió con las seis páginas de servicio. `:75-83` construye las secciones con
  ternarios y `.filter()` y `:85` renumera sola; su propio comentario `:24-26` explica que existe
  para no clonar.
- **Extraer los diez bloques de `PaginaServicio` a diez archivos de `components/secciones/`.** Es la
  lectura más pura de la regla, pero son diez archivos nuevos para una sola landing y ninguno
  tendría entrada en `design/01` igualmente. Se reabre solo si aparece una **segunda** plantilla que
  recomponga los bloques en otro orden.

**Rendimiento**

- **Techo duro del presupuesto en 100 kB.** Probado: el gate falla **41 de 45 rutas** incluso en
  brotli q11 y el primer commit no compila. El suelo del framework con 0 B de código propio es
  **86,5 kB br11**, y el suelo real de este sitio (con `chunks/444` y `chunks/app/layout`, presentes
  en las 45) es **94,0 kB**: 6 kB para todo el código propio. No es un presupuesto exigente, es
  imposible.
- **Migrar a Pages Router o a Next 16 para ganar suelo.** Los 95,8 kB gz que se midieron para Pages
  Router son una app **vacía**; con los ~21,7 kB gz de código propio de este sitio encima quedan
  ~117 gz / ~100 br: **el mismo sitio**. Descartado por doble motivo, no solo por la decisión 2.
- **`preload: false` en Martian Mono.** No ahorra **un solo byte** —la fuente se usa sobre el pliegue
  en **43 de las 45 rutas** vía `Migas.tsx:12`, no solo en el teléfono de escritorio— y a cambio
  compra un reflow: con el fallback métrico (`size-adjust: 157,02 %`, reproducido desde
  `font-utils.js:29`) el residuo medido en versalitas y dígitos es **+12,5 % de anchura**, y a 390 px
  de viewport **6 de los 9 proyectos** pasan de 1 a 2 líneas de migas, arrastrando el `<h1>` y la
  foto a sangre unos **26 px**. El archivo lleva hash bajo `/_next/static/media/` con
  `max-age=31536000, immutable`: **una descarga por visitante, no por ruta** — el 23.544 × 45 es
  ficción. Si algún día hay que recortar bytes de fuente, el objetivo es **Archivo (90.096 B, 62,8 %
  de los 143.544)**, y eso es decisión del sistema de diseño, no de rendimiento.
- **Sacar el teléfono de la monoespaciada.** Rompería «todo dato del oficio va en monoespaciada» por
  **4·10⁻⁵ de CLS**. Con `display:'swap'` + fallback métrico el número ya es legible y clicable desde
  el primer pintado.
- **`animation-timeline: view()` con `@supports` para `.aparece`.** Cuatro clavos independientes:
  Firefox estable tiene **cero soporte** hasta la 157 (29-09-2026) y son el **4,14 %** del tráfico
  español, hasta el **14,57 %** según caniuse sumando la cola de Safari; MDN dice que la animación
  «moves forward or backward» al subir el scroll, así que **no puede cumplir el «una vez, sin
  repetir»** de `design/rediseno-pavimentos-albufera.md:744` («§8.6»); `animation-duration` no gobierna un timeline de progreso, luego el
  `animation-duration:.01ms!important` de `globals.css:97-104` **no la desactivaría** y se
  introduciría un fallo de `prefers-reduced-motion` que hoy no existe; y tocaría las 47 rutas
  dependiendo de un comportamiento que nadie del equipo puede probar en ningún motor instalado.
- **Eliminar `.aparece` del todo.** Borra uno de los tres movimientos aprobados con el sistema
  declarado cerrado, cuando un arreglo de **cuatro líneas en dos archivos** resuelve el hallazgo
  íntegro. Y no compra JS: React ya está en el chunk compartido por `BarraMovil`, `EventosGlobales`,
  `Atribucion` y la calculadora.
- **`formats: ['image/webp']` a secas.** Tirar entre un **6,2 % y un 20,9 %** de bytes en todas las
  imágenes a cambio de nada. El «AVIF pesa más» se midió a q75-contra-q75, **una transformación que
  el sitio nunca ejecuta**: Next codifica AVIF con `Math.max(quality-20,1)` y `effort:3`, o sea AVIF
  q55 contra WebP q75, y ahí AVIF gana en **los 26 pares medidos**, del thumbnail de 256 px al hero.
- **Tocar `imageSizes`.** Con el `smallestRatio` menor del repo (22vw), de los ocho valores por
  defecto solo **256 y 384** llegan a aparecer en algún srcset, y los dos sirven casos reales. Los
  seis de 16 a 128 no se emiten nunca y no cuestan nada.
- **Un guardián que falle si una foto supera el peldaño más alto.** La sesión fotográfica pendiente
  llegará con 3024-4032 px de cámara de móvil, que es material **correcto** (w=2048 simplemente lo
  reduce): ese guardián reventaría el build con la foto buena. El umbral que sí hace falta —fuentes
  demasiado **estrechas**— ya existe (`A_SANGRE`).
- **Delegar `<Cabecera />` a cada página.** Caería dentro de `<main id="contenido">`, detrás del
  destino de «Saltar al contenido», y rompe `--cabecera-actual` (que solo actualiza
  `Cabecera.tsx:31`) para `BarraConfianza`, `SubmenuServicio` y los dos filtros. La vía sería un slot
  en el layout, y el esfuerzo no es «moderado».
- **`experimental.inlineCss`.** Medido en **este** repo: **+12.480 B gz de HTML para ahorrar una
  petición de 6.085 B gz = +6.395 B gz netos**, y la bandera sigue documentada como no recomendada
  para producción.
- **Mover las 33 redirecciones a `vercel.json`.** Dejaría ciego a `verificar-redirecciones.mjs`, que
  lee `.next/routes-manifest.json`. Los dos saltos 308+308 se quedan.
- **Mover las 90 fotos huérfanas a `fotos-origen/`.** Está en `.gitignore`: eso las **borra del
  repositorio**, y de ellas cuelgan tres decisiones abiertas del dueño.

**Landings**

- **Prometer supresión de cabecera, pie y barra móvil en `/lp/`.** No se puede desde un layout
  anidado, y el objetivo está mal planteado: la landing **necesita** el pie (Meta Business Tools
  exige aviso visible en toda página con píxel, y la AEPD exige identificar al editor) y
  **necesita** la barra móvil (es el CTA de llamada, decisión 3). Lo único con caso CRO para
  desaparecer es `Cabecera`, que es precisamente lo más caro de quitar.
- ⛔ ~~**`BarraConfianza` «tal cual» en una landing sin cabecera.**~~ **RETIRADO de esta lista:** la
  landing conserva la cabecera, así que `BarraConfianza` **sí** es usable tal cual. La objeción de
  los 84 px de `app/globals.css:22` —y la misma para `SubmenuServicio.tsx:35`,
  `FiltrosAcabados.tsx:61` y `FiltrosProyectos.tsx:81,117`— se apoyaba en una premisa que la tabla
  de correcciones ya había retirado. Volvería a valer el día que alguien suprima el chrome de verdad.
- **Ficha técnica en la landing, en cualquiera de los seis servicios.** **6 de 6 llevan corchetes**
  (impreso 2 · pulido 4 · microcemento 5 · lavado 3 · fratasado 3 · desactivado 3). No hay ninguna
  ficha limpia.
- **`AggregateRating` o bloque de reseñas.** Regla del proyecto, y no hay reseñas verificables.
- **Escribir `title`/`description` nuevos para las landings.** Es copy nuevo, prohibido por la
  decisión 4. Como la landing es `noindex`, el `title` no compite en SERP: se reutiliza el de
  `SERVICIOS[servicio]` sin cambiarlo, o va con `<DatoPendiente>`.
- **Repetir sin salvedad las cuatro cifras de negocio del material** (web.dev, MIT/InsideSales,
  Unbounce, Baymard): **no verificadas**. La que más se presta a repetirse fuera de contexto es la
  regla de los 5 minutos («100× contacto, 21× cualificación»): es de **2007, B2B, EE. UU. y sin
  revisión por pares**. Si llega al dueño, llega con la salvedad pegada.

---

## Cómo se demuestra que funcionó

**El sitio no tiene tráfico. No hay ni habrá datos de campo (CrUX) durante meses.** Eso no es una
excusa para no medir: separa lo que se demuestra hoy, en el build y en laboratorio, de lo que hay
que esperar.

### Lo que se demuestra HOY, sin una sola visita

Todas las cifras «hoy» salen de mediciones sobre el build actual, no de estimaciones.

⚠️ **Cómo se leen estos comandos.** `grep -c` cuenta **líneas**, y estos HTML son de una sola línea:
para contar ocurrencias va `grep -o … | wc -l`, para contar rutas `grep -l … | wc -l`. Y el glob
`.next/server/app/*.html` solo alcanza **17 de los 45**, así que en cuanto la cifra pase de 17 va
`find .next/server/app -name '*.html'`. Las celdas que afirman **0** sobreviven a `grep -c` tal cual.

| Qué | Herramienta | HOY | Después |
|---|---|---|---|
| Caminos de contacto en el HTML | `find … -exec grep -o 'href="tel:' {} + \| wc -l` y lo mismo con `wa.me`, sobre los 45 HTML | **0 y 0.** 186 anclas degradadas, **94 muertas** (`href="#"` medido: **94 ocurrencias**) | >0 en ambos, y **≥11** anclas con `data-ubicacion` + transporte — 11 es el techo de lo que un gate de HTML puede ver, porque los 2 CTA de `MenuMovil` solo existen con el menú abierto; sube con 2.5 |
| JS de la home | `scripts/verificar-presupuesto.mjs` (brotli q11, ámbito HTML) | **105.737 B** (124.195 gz · 407.389 crudos). Máx del sitio **107,1 kB** (`/hormigon-*`), mín **97,1** (legales). **41 de 45 rutas por encima de 100 kB** incluso en brotli | Techo **112.000 B** que rompe el build; objetivo **105.000 B**. El número no baja: el gate existe para que **no suba** |
| Componentes cliente | `grep -rl "'use client'" components app` | **14** archivos; chunk de ruta de la home **1.08 kB** | **13** archivos; **909 B** |
| H1 bajo `.aparece` | `scripts/verificar-lcp-visible.mjs` | **17 de 45 rutas** (8 de `/acabados/[modelo]/` + 9 de `/proyectos/[slug]/`). `/proyectos/xabia-pulido/` es el caso agudo: **0 `<img>`** antes del primer `.aparece`, así que el LCP se resuelve pronto contra un texto de cabecera y **la métrica sale engañosamente buena con la pantalla vacía** | **0 de 45** |
| Marcado de LCP | `find … -exec grep -l 'fetchPriority="high"' {} + \| wc -l` — ⚠️ **camelCase**, que es lo que React 19 emite | **0** (la única ocurrencia es un `fetchPriority="low"` del chunk de webpack, byte 1575, y es justo la prueba del camelCase) | **33 rutas** con preload de LCP marcado |
| Peso del hero de servicio | Transformación real de `hormigon-lavado-2.jpg` | **629,5 kB** a w=1920 | **372,7 kB** a w=1200 → **~257 kB × 6 páginas** |
| Peso del hero de proyecto | Transformación real de `denia` a `100vw` | **334,5 kB** AVIF (salto 1200→1920) | **252,4 kB** con el peldaño 1536 → **−82,1 kB, −25 %** |
| Superficie de transformación facturable | `next.config.ts` | **3.200** por foto de origen (16 anchos × 2 formatos × 100 calidades) | **32** con `qualities:[75]` |
| Caché de imagen optimizada | `curl -I` sobre `/_next/image?...` | `public, max-age=60, must-revalidate` | `max-age=2678400` |
| Respiración vertical de escritorio | `grep -o 'py-22' .next/static/css/*.css` | **0** — **51 usos** en 12 ficheros y la clase no existe: 50 secciones se quedan en 36 px | >0 |
| HTML de los dos índices | `grep -o '<img' … \| wc -l` en `/proyectos/` y `/acabados/` | **0 y 0**, contra **23** en `index.html` | **>0, por la tarea 1.27** — que existe precisamente porque esta fila prometía un «después» que ninguna ola producía. El hallazgo sigue reclasificado (es HTML vacío para Googlebot y CLS, **no kB**), pero ahora tiene quien lo ejecute |
| Hash de teléfono a Meta | Ejecutar `hash()` de `lib/meta-capi.ts` | `612345678` → `d500e1b5…`, distinto de `34612345678` → `11f976ff…`: **fallo sistemático al 100 %** | Los dos hashes coinciden |
| Migas duplicadas | `grep -o 'BreadcrumbList' .next/server/app/proyectos/<slug>.html \| wc -l`, **archivo a archivo**, en las 9 fichas | **4** por archivo (medido; el «2» venía de `grep -c` sobre un HTML de una sola línea) | **2** por archivo |
| ~~Sitemap de zonas~~ | `grep -o '/zonas/' .next/server/app/sitemap.xml.body \| wc -l` | **8**, y **las 8 documentadas** — ⛔ el «15 con 8 municipios indexables» era falso: `lib/datos.ts:11-13` ya los filtra | **8: invariante.** No hay ninguna URL que retirar (ver 1.22, reducida) |
| Rendimiento en laboratorio | `npx lhci autorun` con `lighthouserc.json`, **preset móvil** | Sin línea base tomada — hay que correrlo **antes** de la ola 1 para tenerla | Comparación contra esa línea base. Ruta crítica de la home medida hoy: **335.122 B gzip** clavados (html 21.096 + css 6.084 + JS sin polyfills 124.771 + polyfills 39.627 + fuentes 143.544) |
| Brotli real del CDN | `curl -sI -H 'Accept-Encoding: br' <preview>/_next/static/chunks/4bd1b696-*.js` | No comprobado: **Vercel no documenta su calidad de brotli** | `content-length` contrastado contra **46.749**. El techo es un detector de regresión determinista sobre nuestro bundle, **no una afirmación sobre los bytes que entrega el CDN** |

### Lo que se demuestra con un despliegue de preview, sin campañas

- **El POST del `ping` llega**, o no: la fila aparece en el libro mayor con `Ping-To: tel:…` tras tocar el CTA en un
  **iPhone real** (tarea 1.25). Es la única prueba pendiente que puede tumbar la arquitectura
  elegida, y **nadie la ha hecho**: la medición que fundó la decisión se hizo en Chrome de
  escritorio, donde `ping` sí dispara sobre `tel:`, `mailto:` y `wa.me`, con las cookies de primera
  parte presentes.
- **La CAPI responde**: `test_event_code` + Test Events de Meta. Hoy **nadie puede saber si la CAPI
  funciona** — `lib/meta-capi.ts` hace `await fetch(...)` sin asignar la respuesta, y `fetch` no
  lanza con un 400: token caducado, pixel erróneo o `user_data` rechazado pasan **mudos**.
- **El orden del Consent Mode aguanta**: posiciones **3074** (`consent default`) / **3318**
  (`gtag('config')`) / **3428** (inyección de gtag.js) en el HTML con ID puesto.
- **El modo no-op sigue intacto**: con las variables vacías, **0 apariciones** de
  `gtag`/`dataLayer`/`consent`/`googletagmanager`/`fbq` en los 45 HTML y **cero peticiones
  externas**. Cualquier tarea de la ola 1 que rompa esto es un fallo, no un avance.
- **DNI de Google bajo consentimiento denegado**: con Tag Assistant, comprobar si con
  `ads_data_redaction:true` y `ad_storage:'denied'` la petición devuelve GFN **antes** de aceptar el
  banner. Hasta comprobarlo, **el techo real de medición de llamadas es una hipótesis**.

### Lo que hay que esperar, y cuánto

- **CrUX / datos de campo:** ventana móvil de 28 días y un mínimo de visitantes que este sitio no
  tiene. **No se puede prometer un antes/después de LCP de campo en esta sesión ni en la siguiente.**
- **Las dimensiones de GA4 pueblan informes en 24-48 h** desde el alta, y **solo hacia adelante**.
- **La tasa de aceptación del banner** —que topa el volumen medible de llamadas por GFN y de
  `Contact` en Meta— no se puede estimar: se mide con `gfn_active` cruzado con `device_type` y
  `click_location`, y hace falta tráfico real.
- **El disparador de la fase 2** son **30 días** de volumen propio sostenido de «Llamadas desde el
  sitio web», no una fecha del calendario.
- **La fase de aprendizaje de Meta** son **50 eventos de optimización por conjunto de anuncios cada
  7 días**. Si `Contact` no los sostiene, se dice y se baja el objetivo a visitas a la página de
  destino.

### Los gates de build, que son la demostración permanente

Un gate no mide una mejora: **impide la regresión para siempre**. `package.json:8` pasa de dos a
cinco verificadores en `postbuild`, todos hermanos del mismo patrón —«🔴 `next build` NO valida X»—
que ya salvó las 301 y las imágenes:

```json
"postbuild": "node scripts/verificar-redirecciones.mjs && node scripts/verificar-imagenes.mjs && node scripts/verificar-presupuesto.mjs && node scripts/verificar-contacto.mjs && node scripts/verificar-lcp-visible.mjs"
```

| Gate | Qué impide que vuelva a pasar | Cifra de aceptación |
|---|---|---|
| `verificar-redirecciones.mjs` (ya existe) | Que un build limpio conviva con 10 de 33 redirecciones aterrizando en 404 | 33 destinos, todos entre las rutas realmente generadas |
| `verificar-imagenes.mjs` (ya existe) | Que un `src` mal escrito compile limpio y en producción sea un hueco vacío | 35 fotos citadas, todas presentes y con `alt`; suelo 800 px y 1600 px a sangre fallan el build |
| `verificar-presupuesto.mjs` (nuevo) | Que el JS suba sin que nadie se entere, y que se vuelva a discutir contra qué número se trabaja | **Todas** las rutas ≤ 112.000 B br11; hoy 45 rutas, máx 107,1 kB. Margen sobre el máximo de hoy: **4,9 kB** |
| `verificar-contacto.mjs` (nuevo) | Publicar con un CTA sin `data-ubicacion` o sin transporte, o —con las variables puestas— con **cero caminos de contacto**, que es el estado normal del repo hoy | **≥11** anclas en HTML con los tres atributos, más una pasada sobre el fuente para los 2 de `MenuMovil`, que ningún gate de HTML puede ver. Con las variables vacías **avisa, no rompe**: el modo no-op tiene que seguir construyendo |
| `verificar-lcp-visible.mjs` (nuevo) | Un `<h1>` invisible hasta hidratar en la página donde aterriza un anuncio | 0 de N (hoy 17 de 45) |

**Un riesgo residual que ningún gate cubre, y va como ítem aparte para el dueño:** sin JavaScript,
las secciones `.aparece` se quedan en `opacity: 0` **para siempre** en **39 de las 45 rutas** (hasta
11 secciones en la home). Verificado: `grep -c noscript` en `xabia-pulido.html` da **0**, y el HTML
servido lleva `class="aparece "` sin `--visible`. No bloquea el despliegue —Googlebot ejecuta JS y
todo eso está bajo el pliegue— pero es pérdida total de contenido si el chunk falla. Lo único que lo
arregla es borrar `.aparece`, y eso borra un efecto aprobado: **es decisión del dueño, no del
arquitecto — y por eso va como pregunta 13 de «Lo que hay que preguntarle al dueño» y como tarea
2.12.** Una decisión del dueño que no se le pregunta no se toma nunca, que es exactamente lo que le
pasaba a esta.

---

## Cómo se hizo este plan

**61 agentes** en tres tandas. **12** auditaron el código real y **11** investigaron el estado del arte
con fuentes; **24 bloques verificadores** los refutaron uno a uno abriendo los archivos y reproduciendo
las cifras, emitiendo **502 veredictos** (314 confirmados, 180 matizados, 8 refutados). De **132
hallazgos** (24 críticos, 48 altos) sobrevivieron los de «Hallazgos confirmados»; **20 se cayeron** y
están arriba con su motivo, porque saber qué es falso evita que alguien lo vuelva a proponer. Un
**crítico de completitud** buscó lo que nadie había mirado; **8 árbitros** resolvieron las
contradicciones que dejó abiertas —cuatro agentes habían propuesto cuatro transportes incompatibles
para el mismo clic saliente, y ninguno se había elegido—; y **3 revisores adversariales** leyeron el
plan entero con lentes distintas (coherencia, verificable-en-el-repo, sirve-al-negocio). Dos lo
declararon NO LISTO con **11 defectos bloqueantes**, aplicados en una última pasada.

**Dos cosas salieron mal en el proceso y conviene saberlas.** Un límite de sesión mató la primera
tanda a mitad y una caída de red mató al redactor con el plan a medio escribir; se recuperó de los
journals sin perder nada. Y un **error de índice en la orquestación** hizo que el tema de imágenes se
verificara dos veces y el de **landings, cero** — lo detectó solo el crítico de completitud, cruzando
los veredictos. Se rehízo: las landings tienen hoy **27 veredictos** (18 confirmados, 9 matizados) en
[`07-auditoria-decisiones-y-veredictos.md`](07-auditoria-decisiones-y-veredictos.md).

**Lo que NO está verificado del todo, y hay que leer antes de fiarse:**

- **La prueba 1.25 en un iPhone real no se ha hecho.** Si falla, se cae el mecanismo primario de toda
  la arquitectura de medición. Es lo primero que hay que ejecutar.
- **La síntesis de 1.8 es arbitraje del editor** entre tres revisores que proponían tres cosas
  distintas. Revísese antes que nada.
- El **brotli del CDN de Vercel no es comparable** con el medido aquí en local.
- Las **horas por ola son estimación, no medición**.
- Nada de este documento lo ha visto el dueño. Son hallazgos de máquina verificados por máquina.
