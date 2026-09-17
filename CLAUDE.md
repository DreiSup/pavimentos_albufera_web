# CLAUDE.md — Pavimentos Albufera

Rediseño y migración de pavimentos-albufera.com de WordPress a Next.js 15.
La especificación completa está en `design/`. **Léela antes de escribir código.**

- `design/README.md` — panorama, stack, orden de trabajo
- `design/01-sistema-de-diseno.md` — tokens y los 14 componentes base, con valores exactos
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
  la variante clara. Empieza y acaba en `public/marca/`: ningún texto, borde, fondo ni estado
  del sitio usa esos valores. → `design/01` §2.1
- `border-radius: 0` en todo. Una sola sombra en toda la web: la de la barra fija de móvil.
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
- Sin librerías de animación, de iconos ni de formularios.
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
301 aterrizaban en un 404**. Ahora hay una plantilla única —`components/secciones/PaginaServicio.tsx`
+ `content/servicios.tsx`— que consume impreso también: una plantilla, no seis copias.

🔴 **`next build` NO valida los destinos de `redirects()`.** Un build limpio convive perfectamente
con treinta y tres redirecciones de las que diez son 404. Por eso existe
`scripts/verificar-redirecciones.mjs`, que corre como `postbuild` y **falla el build** si un destino
no está entre las rutas realmente generadas. Contrasta contra rutas concretas, no contra patrones
dinámicos: es la diferencia entre saber que existe `/zonas/[municipio]` y saber que existe
`/zonas/alicante` — que no existe, y no debe existir.

**Medición.** El contrato de eventos vive entero en `lib/eventos.ts`: nombres y parámetros en
inglés `snake_case`, contenido en español. Si un nombre no está ahí, no se manda.

- `phone_click` · `whatsapp_click` · `email_click` · `form_submit` · `calculator_use` ·
  `samples_filter` · `scroll_depth` · `faq_open`
- **`click_location` viaja en `data-ubicacion`** sobre cada CTA. `EventosGlobales.tsx` delega el
  clic en `document` y lo lee de ahí, así que `Pie`, `BarraMovil` y las páginas siguen siendo
  componentes de servidor. `Boton` ya hace spread de props, no hay que tocarlo.
- ⚠️ **Cada parámetro nuevo necesita su dimensión personalizada registrada en GA4 ANTES del
  primer tráfico.** GA4 no rellena dimensiones hacia atrás; lo que llegue antes se pierde.

**Consent Mode v2 avanzado.** Los cuatro permisos arrancan `denied` y pasan a `granted` al aceptar.
El estado vive en **cookie de primera parte**, no en `localStorage`, porque el Server Action tiene
que leerlo. ⚠️ **El bloque `consent default` está en `app/layout.tsx` y carga `gtag.js` él mismo, en
su última línea, a propósito**: al dejárselo a `next/script` Next colocaba gtag.js antes que el
bloque, y un `consent default` que llega después de que gtag.js vacíe la cola de `dataLayer` no
sirve de nada. El Pixel de Meta sigue con bloqueo duro: no tiene equivalente de Consent Mode.

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

**FAQ.** Estaba copiada literalmente en tres archivos; ahora el catálogo está en `content/faq.ts` con
`tema` obligatorio en el tipo. ⚠️ **Cada servicio compone su propia lista en `content/servicios.tsx`,
y no hay una compartida**: `grietas` y `sobreExistente` nombran el hormigón impreso dentro del texto,
y al ponerlas en las seis páginas `/microcemento/` acababa preguntando si se agrieta el hormigón
impreso. `/microcemento/` no lleva FAQ porque ninguna pregunta del catálogo le aplica sin
reescribirla, y reescribirla es copy nuevo.

**Fotografía. La web ya se ve.** `components/contenido/Foto.tsx` envuelve `next/image` y **cae en
`<BloquePosicion>` cuando no hay imagen**: ninguna pantalla decide entre foto y hueco, pide la foto
y el componente resuelve. Por eso el tratamiento de pendiente sigue apareciendo solo donde falta el
original de verdad —`xabia-pulido`, el hueco `ANTES`, seis de los dieciséis acabados— y no hay que
acordarse de quitarlo.

Los datos viven en los campos que el modelo de contenido ya tenía: `Proyecto.imagenes[]`,
`Acabado.muestra` (ampliado de `string` a `Imagen`, para que el `alt` no sea opcional),
`Articulo.imagenApertura`, más `Servicio.imagenHero`/`imagenTarjeta` en `content/servicios.tsx` y
`content/modelos.ts` para el hero de `/acabados/[modelo]/`. La zona deriva la suya del primer
proyecto: no hay dato nuevo.

- Las **125 fotos se han abierto una a una** y los 14 `alt` de la raíz están reescritos
  describiendo la foto, no el proyecto. **15 no se usan y no se borran**: 6 de stock, 8 de pistas
  de pádel —otro negocio— y un collage. Todo anotado en `public/obras/INVENTARIO.md`.
- Las de `_sin-atribuir/` se citan **con su nombre original**. Renombrarlas al patrón de la raíz
  afirmaría municipio y año que nadie ha confirmado; el nombre no se ve en pantalla.
- 🔴 **`next build` tampoco valida el `src` de `next/image`.** Un `src` mal escrito compila limpio
  y en producción es un hueco vacío. `scripts/verificar-imagenes.mjs` corre en `postbuild`, junto al
  de las redirecciones, y falla el build.
- ✅ **El umbral fotográfico ya no es una cifra inalcanzable.** `design/05` §C #13 (2026-08-29)
  retira los 2400 px —que **ninguna de las 164 originales cumple**— y pone tres, verificados
  midiendo el archivo: **suelo 800 px** y **1600 px a sangre** fallan el build; **objetivo 1600 px**
  solo informa. La etiqueta del bloque de posición dice ahora «ORIGINAL A 1600 PX».
- 🔴 **Y el número que hay que mirar no es cuántas cumplen, sino cuáles no.** Las 19 de 35 que no
  llegan al objetivo son **las de obra documentada** —898 a 1200 px, salvo Denia a 2048— y son
  justo las que `app/proyectos/[slug]/page.tsx:61` sirve **a sangre**, `sizes="100vw"` en 21/9.
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

```bash
npm run dev
npm run build       # debe pasar sin warnings antes de cada commit
                    # incluye postbuild: verifica los destinos de las 301
                    # y que toda foto citada exista en public/ con alt
npm run lint
node scripts/verificar-redirecciones.mjs   # suelto, tras un build
node scripts/verificar-imagenes.mjs        # suelto, no necesita build
```

Para probar la medición en local hace falta un `.env.local` con `NEXT_PUBLIC_TELEFONO`,
`NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_GA_ID` y `NEXT_PUBLIC_META_PIXEL_ID`. **Con las variables
vacías no se renderiza ni un solo `tel:` o `wa.me`** y `registrarEvento` es un no-op silencioso:
todo parece funcionar sin hacer nada.

## Si algo no encaja

Si un componente aprobado no aguanta en un contexto nuevo, **no improvises una excepción**:
créalo en el mismo lenguaje, añádelo a `design/01-sistema-de-diseno.md` y dilo en el commit.
El sistema tiene que seguir siendo describible al terminar.
