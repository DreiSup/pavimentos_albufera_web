# Replicar en Pavivasa los cambios de la sesión de Pavimentos Albufera

**Para:** Claude Code, trabajando en el repositorio de Pavivasa.
**Origen:** `dreisup/pavimentos_albufera_web`, sesión del 2026-09-30 al 2026-10-08. Todo está en `main`
(último commit `b8a978e`). Si tienes acceso a ese repo, **lee los commits citados**: este documento
explica el qué y el porqué; el diff exacto está allí.

---

## 0. Antes de tocar nada (obligatorio)

1. **Lee `CLAUDE.md` y `ARCHITECTURE.md` de Pavivasa.** Pavimentos Albufera se migró a monorepo con
   «la misma plantilla que pavivasa» (pnpm + Turborepo, `apps/web`, paquetes `@site/content`,
   `@site/config`, `@site/tracking`, `@site/seo`). Se parecen, **pero no asumas que son iguales**:
   antes de cada cambio, localiza el archivo equivalente en Pavivasa y confirma que el problema existe
   allí. Si no existe, no lo «arregles».
2. **No copies datos del negocio.** Ni el teléfono, ni la base (Sollana), ni las zonas, ni los códigos
   postales de la zona A, ni los textos. Todo eso es de Pavimentos Albufera. Lo que se replica es el
   **mecanismo**; los datos los da el dueño de Pavivasa (ver §5).
3. **Copy:** no inventes texto visible. Si un texto nuevo es necesario, propónlo marcado
   `[pendiente de aprobar]` en la spec de pantallas y dilo en el resumen.
4. **Git:** trabaja en una rama, un cambio lógico por commit, y **no hagas push a `main` sin que el
   dueño lo pida explícitamente**. Antes de empujar a `main`: `git fetch` y comprobar que es
   fast-forward (`git merge-base --is-ancestor origin/main HEAD`).
5. **Puertas antes de cada commit** (las del repo origen; usa las de Pavivasa si difieren):
   `pnpm content:validate` → `pnpm lint` → `pnpm typecheck` → `pnpm test` (si existe) →
   build de `apps/web` con sus verificadores → `pnpm verify`.

### Trampas del entorno que costaron tiempo

- `pnpm build` vía turbo puede fallar al descargar Google Fonts por TLS en el contenedor. Compila desde
  `apps/web` con `NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt NEXT_TELEMETRY_DISABLED=1 pnpm exec next build`
  y las `NEXT_PUBLIC_*` mínimas; luego ejecuta los `scripts/verificar-*.mjs` a mano.
- **Nunca** `pkill -f`/`pgrep -f` con un patrón que aparezca en tu propia línea de comandos: mata tu
  shell (exit 144). Guarda el PID al arrancar (`echo $! > server.pid`) y mata ese PID y sus hijos.
- El usuario no ve `localhost`: verifica con Playwright (Chromium en `/opt/pw-browsers/`) y envíale
  capturas.
- El límite de envíos del formulario (3/hora por IP, en memoria) bloquea las pruebas. En Playwright
  manda una cabecera `x-forwarded-for` distinta por caso.

---

## 1. Resumen de lo hecho

| # | Cambio | Commits (origen) | ¿Aplica a Pavivasa? |
|---|---|---|---|
| A | Teléfono visible con espacios (`622 067 884`) | `60c968d` | Probablemente: comprobar formato actual |
| B | Muestrario de la home: carril horizontal con todas las muestras | `49561cd` | Solo si tiene esa sección y el mismo defecto |
| C | Ocultar en la home las obras sin foto (sin borrarlas) | `86d923c` | Comprobar si hay obras sin foto |
| D | Sección 03 de la home: tarjetas enlazadas a obra o servicio | `1e79450` | Solo si existe esa sección |
| E | Scroll horizontal a 320 px por una palabra larga en un `h2` | `8e4f311` | Medir; la causa será otra |
| F | Tarjeta de proyecto con la estructura del handoff de diseño | `7b821d7`, `b8a978e` | Solo si el dueño aporta el handoff |
| G | **Filtro de solicitudes por zona (código postal + superficie)** | `16f569c` … `ddb893c` | **Sí, el cambio grande.** Datos propios |

El «municipio obligatorio» de `60c968d` se **retiró después** (G.6): no lo repliques.

---

## 2. Cambios pequeños (A–F)

### A. Teléfono con espacios

- **Qué:** el número se veía `622067884`; ahora `622 067 884` en todo texto visible (botones, `<p>`).
  El `href="tel:…"` y el `wa.me` siguen con los dígitos sin espacios.
- **Cómo:** en el adaptador de configuración (`apps/web/src/lib/config.ts` en origen), una función de
  presentación aplicada solo a los campos que se pintan:

  ```ts
  /** Solo presentación: 622067884 → 622 067 884. El href tel: sigue usando los dígitos sin espacios. */
  function formatearTelefono(valor: string | undefined) {
    if (!valor) return undefined
    const digitos = valor.replace(/\D/g, '').replace(/^34(?=\d{9}$)/, '')
    return digitos.length === 9 ? digitos.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') : valor
  }
  ```
- **Verifica:** `grep` en el HTML del build de que ningún `href="tel:` lleva espacios y de que el
  texto visible sí.

### B. Muestrario: carril horizontal

- **Problema en origen:** el contador decía 10 y se pintaban 4; además, un chip «N con obra
  documentada» parecía un botón y no hacía nada.
- **Qué:** se quitó el chip, se enseñan todas las muestras con obra y el contador cuenta lo que se pinta.
  La lista pasa a ser un carril con scroll horizontal que sangra hasta los bordes y deja asomar la
  siguiente tarjeta:

  ```tsx
  <ul className="flex items-start gap-[14px] md:gap-6 overflow-x-auto snap-x snap-proximity
                 scroll-pl-[18px] md:scroll-pl-lat-desktop -mx-[18px] px-[18px]
                 md:-mx-lat-desktop md:px-lat-desktop pb-4 list-none my-0 min-w-0">
    <li className="w-[160px] md:w-[300px] shrink-0 snap-start">…</li>
  ```
- **Claves:** `min-w-0` en el carril (si no, ensancha la celda de la rejilla y vuelve el scroll
  horizontal a toda la página). `scroll-pl-*` igual al margen lateral para que el snap lo respete. Snap
  de proximidad, no obligatorio.

### C. Ocultar obras sin foto en la home

- Filtro de **presentación**, no borrado: el proyecto sigue en el catálogo, en su ficha, en
  `/proyectos/` y en las zonas que cuelgan de él (puede haber una 301 apuntando allí).

  ```ts
  const proyectosHome = proyectos
    .filter((p) => p.imagenes.length > 0)
    .sort((a, b) => Number(b.destacado) - Number(a.destacado))
  ```

### D. Sección 03 de la home: tarjetas enlazadas

- La retícula se convirtió en tarjetas separadas (fondo alterno, sin borde, sombra ni radio): 2 columnas
  en móvil con `gap` 14 px y 3 en escritorio con 24 px. Cada tarjeta es **un único enlace**, a su obra
  si hay una que la ilustre o a la página del servicio. Rótulo de acción («Ver obra →»), nunca pie de foto.
- El build **falla** si un slug de obra enlazado no existe (comprobación en el propio `page.tsx`).
- `sizes` de cada imagen ajustado al ancho real de la tarjeta.
- Se documentó la variante en la spec del sistema de diseño (`design/01` §3.12) y en la de pantallas.

### E. Scroll horizontal a 320 px

- **Lección:** se culpó al carril del Muestrario y no era. La causa real fue la palabra
  «mantenimiento» en un `h2` de 34 px (306 px de ancho en una caja de 284 px).
  **Mide antes de arreglar**: recorre los elementos y busca cuál tiene `getBoundingClientRect().right`
  mayor que el ancho de la ventana.
- **Arreglo:** guion blando `manteni&shy;miento`, no `hyphens:auto`, que depende del diccionario del
  navegador. La escala tipográfica es cerrada, así que no se reduce el tamaño.

### F. Tarjeta de proyecto (handoff de diseño)

- Se tomó **solo la estructura** del diseño entregado; los datos, de la web:
  foto 4/3 → fila «ubicación · año» → título → «modelo · color» → pie con técnica (y m² si existen) +
  «Ver proyecto →». Lo que no existe no se pinta (nada de texto de ejemplo del handoff).
- Detalles: espacio de no separación delante del `·` para que no abra línea;
  `aria-labelledby` = título + rótulo, no la tarjeta entera; `justify-between` en lugar de `ml-auto`;
  ancho fijo de 260 px por tarjeta en el carril móvil; el pie corto alinea las líneas entre tarjetas de
  una fila.

---

## 3. G — Filtro de solicitudes por zona (el cambio grande)

### 3.1 Qué quería el dueño (reglas de Pavimentos Albufera)

| Zona | Dónde | Se acepta | Al dueño le llega | El cliente ve |
|---|---|---|---|---|
| A | Polígono alrededor de la base (por tiempo de coche) | Cualquier superficie | Correo + Telegram | «Recibido» |
| B | Resto de la Comunitat Valenciana (CP 03, 12, 46) | **Más de** 500 m² | Correo + Telegram si cumple; **solo Telegram** si no | «Recibido» o aviso «Fuera de zona» |
| C | Resto de España | **Más de** 1000 m² | Ídem | Ídem |
| ? | CP con prefijo inexistente | Se acepta (ante la duda no se pierde el lead) | Correo + Telegram | «Recibido» |

- «Más de»: 500 justos se rechazan; 501 entran.
- **Solicitud rechazada:** llega igual al dueño **por Telegram** (para que pueda llamar y «rascar» más
  obra), **no** por correo, y el formulario se sustituye por un aviso. Si Telegram falla, cae al correo
  con el asunto `[Fuera de filtro]`: nunca se pierde un lead.
- **No cuenta como conversión:** ni Meta CAPI ni `generate_lead`/Pixel, que solo disparan con el
  estado `'enviado'`. Así las campañas no aprenden a traer más leads de ese tipo.

**Para Pavivasa:** pregunta al dueño la base, los vértices del polígono, los umbrales, si quiere el
aviso al cliente y sus textos (§5). No reutilices los de Albufera.

### 3.2 Arquitectura

```
packages/content/
  data-raw/ES.txt                          ← GeoNames, NO se commitea (.gitignore)
  scripts/build-lead-zones.ts              ← genera zonas (polígono → CP de la zona A)
  scripts/build-postal-code-names.ts       ← genera CP → nombre de población
  src/data/lead-zones.ts                   ← generado: ZONE_A_POSTAL_CODES, umbrales, prefijos
  src/data/postal-code-names.ts            ← generado: 11.150 CP de 52 provincias
  src/queries/lead-routing.ts (+ .test.ts) ← classifyLead, parseSquareMeters (puras)
  src/queries/postal-code-names.ts (+ .test.ts)
  scripts/validate.ts                      ← + comprobaciones de las zonas
apps/web/src/app/presupuesto/actions.ts   ← Server Action: clasifica y reparte avisos
apps/web/src/app/api/cp/[provincia]/route.ts ← JSON estático por provincia (CDN)
apps/web/src/components/secciones/FormularioPresupuesto.tsx ← campos + población + aviso
docs/zonas-cp.md, docs/zonas-cp.csv       ← informe generado para revisión humana
scripts/verify/lib/manifest.mjs           ← ignora rutas estáticas que no son HTML
```

**Principios:** todo el filtro corre en servidor. La lista de CP y los nombres **nunca** llegan al JS del
navegador (comprobado con `grep` sobre `.next/static/chunks`). Coste medido: +0,3 kB de JS por ruta
(máximo 109,2 kB con techo de 112 kB brotli).

### 3.3 Paso 1 — Datos: zonas por código postal

**Fuente:** GeoNames postal codes (`https://download.geonames.org/export/zip/ES.zip`, CC BY 4.0).
`ES.txt` es TSV: `0 país · 1 CP · 2 localidad · 5 provincia · 7 municipio · 8 código INE ·
9 lat · 10 lon · 11 precisión (1 estimada, 3/4 buena)`. Unos 37.900 filas, 11.150 CP únicos.
Si la red del contenedor bloquea el dominio, pide al usuario que suba el ZIP (no lo inventes).
Guárdalo con `cp -p` para conservar la fecha (el informe la usa como fecha de descarga).

**`build-lead-zones.ts`** (Node ≥ 22.6, `node --experimental-strip-types`, sin dependencias):

1. `LEAD_ZONE_VERTICES`: lista ordenada y editable de vértices `{ name, lat, lon, verified }`. En
   origen, 14 vértices en «media elipse» por tiempo de coche, más dos **puntos en el mar** para cerrar
   la costa. Regenerar = editar la lista y volver a ejecutar.
2. Point-in-polygon escrito a mano (ray casting en lat/lon).
3. **Clasificación de cada CP por la mediana de sus puntos más precisos.** Si un CP solo tiene puntos
   de precisión < 3, usa la mediana de los puntos fiables de **su municipio** (código INE).
4. `FORCE_ZONE_A_POSTAL_CODES`: CP forzados a mano a la zona A, con comentario del motivo.
5. Escribe `src/data/lead-zones.ts` (cabecera «generated … do not edit»), `docs/zonas-cp.csv` y
   `docs/zonas-cp.md` (metodología, vértices, recuentos, **municipios a menos de 10 km del borde**,
   CP mixtos, CP con coordenada estimada, CP forzados).
6. Comprobaciones **antes** de escribir: los CP forzados existen en la fuente y la base está en A.

🔴 **Errores reales que aparecieron y cómo se resolvieron:**

- La regla ingenua «si **alguna** localidad del CP cae dentro, es A» metía **Alicante (03540) y Sant
  Joan d'Alacant (03550)** en la zona A, porque GeoNames sitúa mal algunas localidades («Cabo de las
  Huertas» en el mar frente a Benidorm). → Mediana de los puntos más precisos.
- **Los municipios que son vértice caen en el borde** y sus CP salen fuera por cientos de metros
  (Benidorm, Utiel, Villena, Chelva, Cofrentes…). → Forzarlos a A por lista explícita.
- **Algún CP no tiene municipio en GeoNames** (03508 Benidorm) y se escapa de una búsqueda por nombre.
  Lo detectó la validación, no la vista.
- **Etiquetas de municipio erróneas** (12530 Burriana etiquetado «Benicarló»; 12400 Segorbe como
  «Castellón»). No afectan a la zona, que va por coordenadas, pero sí a los informes por nombre.
- Un vértice puede ser de **otra comunidad** (Almansa, Albacete, prefijo 02): queda en zona C aunque
  esté dentro del dibujo. Díselo al dueño.

**Validación** (añadir a `scripts/validate.ts`): CP de la zona A de 5 dígitos, únicos, ordenados y con
prefijo de la comunidad; la base en A; los municipios ancla, buscados **por nombre en el CSV** (no
escritos a mano), con al menos un CP en A. Prueba la validación rompiéndola a propósito (quita los CP
de un ancla y comprueba que falla).

Añade `"$TURBO_ROOT$/docs/zonas-cp.csv"` a los `inputs` de `content:validate` en `turbo.json`; si no,
la caché de turbo no se invalida cuando cambia el CSV.

### 3.4 Paso 2 — Lógica pura (`packages/content/src/queries/lead-routing.ts`)

```ts
export type LeadZone = 'A' | 'B' | 'C' | 'unknown'
export type LeadClassification = { zone: LeadZone; accepted: boolean; minSquareMeters: number | null }

export function classifyLead({ postalCode, squareMeters }: { postalCode: string; squareMeters: number | null }): LeadClassification {
  const zone = zoneOf(postalCode) // A si está en ZONE_A_POSTAL_CODES; B si prefijo ∈ ZONE_B_PREFIXES; C si prefijo 01–52; si no, unknown
  const minSquareMeters = zone === 'B' ? ZONE_B_MIN_M2 : zone === 'C' ? ZONE_C_MIN_M2 : null
  const accepted = minSquareMeters === null || squareMeters === null || squareMeters > minSquareMeters
  return { zone, accepted, minSquareMeters }
}
```

`parseSquareMeters(raw)` es **conservadora**: acepta `80`, `80 m2`, `80m²`, `80 metros cuadrados`,
`120,5`, `1.5`, `1.200` (punto de miles español) y `10x5` / `10 × 5` / `10*5,5` (la ayuda del campo dice
«Largo × ancho»). Devuelve `null` con «unos 80», «0», «80-100» o vacío: lo que no se entiende **se
pregunta, no se adivina**.

Umbrales y prefijos, siempre como **constantes exportadas** del archivo de datos, nunca números sueltos.
Tests con `node --test --experimental-strip-types` (sin dependencias nuevas): bordes 499/500/501 y
999/1000/1001, prefijos 00/53/99, CP con espacios y la tabla de `parseSquareMeters`. Script
`"test": "node --experimental-strip-types --test 'src/**/*.test.ts'"`, tarea `test` en `turbo.json` y
`"test": "turbo run test"` en la raíz.

Exporta desde el barrel de `@site/content` con un comentario «server-only». Solo lo importa el Server
Action: un componente `'use client'` que importa el Action solo recibe la referencia, no el código.

### 3.5 Paso 3 — Server Action (`apps/web/src/app/presupuesto/actions.ts`)

1. **Esquema zod:** `superficie` obligatoria y legible (`parseSquareMeters(v) !== null`);
   `codigo_postal` normalizado (sin espacios) y `^\d{5}$`. El municipio **no** se pide.
2. Tras validar:
   ```ts
   const clasificacion = classifyLead({ postalCode: codigoPostal, squareMeters: parseSquareMeters(superficie) })
   const filtrada = !clasificacion.accepted
   const municipio = getPostalCodeName(codigoPostal) ?? '' // deducido, para avisos, CAPI y GA4
   ```
3. Correo y Telegram en dos funciones locales (`enviarEmail()`, `enviarTelegram(emailEntregado | null)`):
   ```ts
   if (filtrada) {
     telegramEntregado = await enviarTelegram(null)            // solo Telegram…
     if (!telegramEntregado) emailEntregado = await enviarEmail() // …salvo que falle: correo «[Fuera de filtro]»
   } else {
     emailEntregado = await enviarEmail()
     telegramEntregado = await enviarTelegram(emailEntregado)    // detrás, para decir si la foto salió en el correo
   }
   if (filtrada) return { estado: 'rechazado', errores: {}, aviso: avisoRechazo(clasificacion) }
   ```
   `'rechazado'` se devuelve **antes** del bloque de CAPI, así que no se manda la conversión.
4. **Aviso de Telegram de una filtrada:** primera línea `🟡 Fuera de filtro · solo Telegram`, luego la
   zona y el mínimo, y **«Al cliente se le ha dicho que no se acepta.»** En todos los avisos:
   `Población · CP 46440` y la zona.
5. **Superficie en los avisos** como la entendió el filtro, con lo escrito al lado si difiere:
   `50 m² (escrito: «10x5»)`. El resumen del panel «Recibido» usa el número (si no, sale «80 m2 m²»).
6. `avisoRechazo()` con **espacio de no separación** entre cifra y unidad (` m²`): sin él, «1000» y
   «m²» acaban en líneas distintas en móvil.
7. Una foto adjunta a una solicitud filtrada no llega a ningún sitio (Telegram recibe solo texto): el
   aviso lo dice para que el dueño se la pida al cliente.

### 3.6 Paso 4 — Población bajo el código postal

- **`build-postal-code-names.ts`** genera `src/data/postal-code-names.ts`, agrupado por provincia:
  `{ '46': { '440': 'Almussafes', … }, … }`. Reglas del dueño: **un nombre por CP** (el pueblo
  principal, no las aldeas que comparten código) y **solo la primera forma** de los nombres dobles
  («Alicante/Alacant» → «Alicante»). Si una localidad coincide con su municipio, se usa la grafía del
  municipio (lleva tildes); si no, la localidad más precisa. «Pobla Tornesa, la» → «La Pobla Tornesa».
  Ojo: GeoNames pone primero la forma valenciana en unos pocos («Peníscola», «Calp»).
- **Ruta estática** `app/api/cp/[provincia]/route.ts`: `dynamic = 'force-static'`,
  `dynamicParams = false`, `generateStaticParams()` con las 52 provincias. El build emite un JSON por
  provincia (2–4 kB brotli) que sirve la CDN, sin función. El CP **no sale hacia ningún tercero** (se
  descartaron Zippopotam, GeoAPI.es y Google Places por privacidad, coste y dependencia).
- **Cliente** (`FormularioPresupuesto.tsx`):
  - caché a nivel de módulo de **promesas** por provincia (dos teclas no lanzan dos peticiones; un fallo
    de red se olvida para reintentar);
  - se pide la provincia al teclear la segunda cifra, así que el nombre aparece al instante con la quinta;
  - una referencia `codigoBuscado` descarta respuestas viejas;
  - `buscarPoblacion` en `useCallback([])` (si no, el lint de `exhaustive-deps` protesta);
  - `<p id="codigo_postal-poblacion" aria-live="polite" className="… min-h-[1lh]">` **siempre presente**:
    la línea reservada evita que el formulario salte y la región viva lo anuncia a lectores de pantalla;
    el input lo referencia con `aria-describedby`;
  - tras un rechazo del servidor el campo se repuebla y el nombre se recalcula;
  - **un CP que no está en la tabla no pinta nada y no bloquea el envío** (Correos no publica una
    lista abierta; GeoNames no es exhaustivo).
  - Usa `Object.hasOwn` al buscar en el objeto (un CP como `toString` o `__proto__` no debe colarse).
- **`scripts/verify/lib/manifest.mjs`:** el verificador de la raíz trataba cada ruta prerenderizada como
  página HTML y fallaba con 52 «missing-html-file». Se saltan las entradas de
  `prerender-manifest.json` cuyo `initialHeaders['content-type']` no es `text/html`.

### 3.7 Paso 5 — Formulario

- Campos en las dos variantes (corta y completa): superficie (texto, no `type="number"`, para admitir
  `10x5`) con la ayuda «Un cálculo aproximado nos vale. Largo × ancho.», y código postal
  (`inputMode="numeric"`, `autoComplete="postal-code"`, `maxLength={5}`, `required`). Ambos con `error`,
  `aria-invalid` y foco al primer campo rechazado.
- Estado nuevo `'rechazado'` en `EstadoEnvio` (con `aviso?: string`). El componente sustituye el
  formulario por el aviso, igual que con «Recibido», para que no se reenvíe subiendo los metros:
  ```tsx
  <div role="alert" className="border-2 border-error p-[26px] flex flex-col gap-5">
    <p className="font-mono text-d-11 tracking-[0.08em] uppercase text-error m-0">Fuera de zona</p>
    <p className="font-display font-bold fs-h2 text-26 text-tinta m-0">{estado.aviso}</p>
  </div>
  ```
  Solo tokens existentes (`--error`, `--tinta`), sin colores nuevos.

### 3.8 Paso 6 — Documentación y legal

- Spec de pantallas: tabla de campos, enmiendas fechadas, y **todos** los mensajes nuevos en la lista
  cerrada de microcopy, marcados `[pendiente de aprobar]` los no aprobados.
- Política de privacidad: campos que se piden; el municipio se deduce del CP; Telegram recibe superficie,
  CP y población, y es el **único** canal de las solicitudes filtradas.
- Aviso legal: atribución de GeoNames (CC BY 4.0) con enlace a la licencia.
- Si el repo tiene un documento de instrucciones legales con la tabla de encargados, actualízalo.

### 3.9 Cómo se probó de punta a punta sin enviar nada real

Servidor de producción con `fetch` simulado mediante un preload (`NODE_OPTIONS=--import mock-fetch.mjs`)
que intercepta `api.telegram.org` y `api.resend.com`, registra cada envío en un archivo y puede
simular la caída de Telegram con un archivo bandera:

```js
const real = globalThis.fetch
globalThis.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input.url
  const canal = url.includes('api.telegram.org') ? 'telegram' : url.includes('api.resend.com') ? 'email' : null
  if (!canal) return real(input, init)
  const fail = canal === 'telegram' && existsSync(process.env.MOCK_TG_FAIL_FLAG)
  appendFileSync(process.env.MOCK_LOG, JSON.stringify({ canal, fail, body: JSON.parse(init.body) }) + '\n')
  return new Response(fail ? '{"ok":false}' : '{"ok":true}', { status: fail ? 400 : 200 })
}
```

Arranque: `RESEND_API_KEY=test TELEGRAM_BOT_TOKEN=test TELEGRAM_CHAT_ID=1 pnpm exec next start -p 3100`.
Luego Playwright rellena el formulario por cada caso y compara lo que ve el visitante con el registro de
envíos. Casos mínimos: zona A pequeña; B con 499/500/501; C con 999/1000/1001; `10x60`; prefijo
inexistente; Telegram caído en una filtrada; superficie ilegible; CP de 4 cifras; repoblado tras error.

---

## 4. Checklist final

- [ ] Cada cambio confirmado en Pavivasa antes de hacerlo (el defecto existe, el archivo equivale).
- [ ] Ningún dato de Albufera copiado (teléfono, base, polígono, CP, textos).
- [ ] `content:validate`, `lint`, `typecheck`, `test`, build + verificadores y `verify` en verde.
- [ ] JS por ruta dentro del techo de Pavivasa; ningún CP ni nombre de población en `.next/static/chunks`.
- [ ] Capturas a 320, 375/390 y 1280 px sin scroll horizontal.
- [ ] Pruebas del filtro con el `fetch` simulado (§3.9).
- [ ] Textos nuevos en la spec, marcados como pendientes si el dueño no los ha aprobado.
- [ ] Rama empujada; `main` solo con permiso explícito y en fast-forward.
- [ ] En producción, tras el despliegue: claves de Telegram y Resend en el entorno *Production* y una
      prueba real de cada camino.

## 5. Preguntas para el dueño de Pavivasa (antes del cambio G)

1. ¿Dónde está la base y qué zona acepta cualquier obra? Mejor por tiempo de coche con municipios
   vértice (en Albufera: norte 105 min, oeste 60 min, sur 73 min). ¿Hay municipios que quiera dentro
   aunque queden fuera del dibujo?
2. ¿Qué umbrales para el resto de su comunidad y para el resto de España? ¿«Más de» o «a partir de»?
3. ¿Quiere que el cliente vea un aviso de rechazo, o que vea «Recibido» igualmente? Si es el aviso, ¿qué
   texto exacto por zona?
4. ¿Quiere quitar el campo municipio y deducirlo del código postal? ¿Nombres en castellano?
5. ¿Las solicitudes filtradas deben contar como conversión en Google Ads y Meta? (En Albufera: no.)
6. Revisión de la lista de municipios cerca del borde que genera `docs/zonas-cp.md`.
