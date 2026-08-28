# CLAUDE.md — Pavimentos Albufera

Rediseño y migración de pavimentos-albufera.com de WordPress a Next.js 15.
La especificación completa está en `design/`. **Léela antes de escribir código.**

- `design/README.md` — panorama, stack, orden de trabajo
- `design/01-sistema-de-diseno.md` — tokens y los 14 componentes base, con valores exactos
- `design/02-pantallas.md` — pantalla por pantalla, móvil y escritorio
- `design/03-modelo-de-contenido.md` — tipos, catálogo real, datos de obra
- `design/04-desarrollo-y-deploy.md` — rutas, redirecciones 301, schema, despliegue
- `design/05-pendientes-y-decisiones.md` — datos sin confirmar y decisiones tomadas
- `design/Pavimentos Albufera.dc.html` — prototipo. **Referencia visual, no código a copiar**

## Reglas de este proyecto

**Diseño**

- Tokens: `#E9EAE6` fondo · `#DADCD6` fondo alterno · `#1B1E1C` tinta · `#5C625E` tinta media ·
  `#D9A441` pigmento · `#41535C` acero. No añadir colores.
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
- Presupuesto de JS inicial: **100 KB comprimido**. Sin librerías de animación, de iconos ni de
  formularios.
- `trailingSlash: true` fijo.
- Sin `AggregateRating` mientras no haya reseñas verificables.
- 44 px de objetivo táctil, foco de teclado visible siempre, contraste AA,
  `prefers-reduced-motion` respetado.
- Cada `[corchete]` sustituido por un dato real es un commit que además elimina su tratamiento
  visual.

## Estado — actualizado 2026-08-27

Auditoría del repo contra el plan de medición, y su implementación. Build, lint y `tsc` limpios;
**47 rutas, todas estáticas**.

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

### Pendiente, y no es código

- 🔴 **Propiedad GA4 propia** (no la de la web viva: es otro negocio) + dimensiones registradas.
- 🔴 **Bloqueante de los 2400 px:** ninguna de las 164 fotos de la web viva lo cumple —solo 1 lo
  supera y es un fondo de plantilla; 77 están por debajo de 1200 px. Hay que revisar el umbral o
  hacer sesión nueva.
- 🔴 **`xabia-pulido` está publicado sin ninguna foto.**
- ⚠️ **`/microcemento/` y `/hormigon-desactivado/` se publican finas**: cero proyectos documentados.
- ⚠️ **Decisión 6 de `design/05` §C sin contestar** (¿caucho como «Obra pública» o se retira?).
  `/pavimentos-de-caucho/` va provisionalmente a `/`.

## Comandos

```bash
npm run dev
npm run build       # debe pasar sin warnings antes de cada commit
                    # incluye postbuild: verifica los destinos de las 301
npm run lint
node scripts/verificar-redirecciones.mjs   # suelto, tras un build
```

Para probar la medición en local hace falta un `.env.local` con `NEXT_PUBLIC_TELEFONO`,
`NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_GA_ID` y `NEXT_PUBLIC_META_PIXEL_ID`. **Con las variables
vacías no se renderiza ni un solo `tel:` o `wa.me`** y `registrarEvento` es un no-op silencioso:
todo parece funcionar sin hacer nada.

## Si algo no encaja

Si un componente aprobado no aguanta en un contexto nuevo, **no improvises una excepción**:
créalo en el mismo lenguaje, añádelo a `design/01-sistema-de-diseno.md` y dilo en el commit.
El sistema tiene que seguir siendo describible al terminar.
