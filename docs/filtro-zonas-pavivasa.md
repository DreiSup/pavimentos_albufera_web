# Filtro de solicitudes por zona — instalación idéntica en Pavivasa

**Para:** Claude Code, en el repositorio de Pavivasa.
**Encargo del dueño:** el **mismo** filtro de presupuestos que ya funciona en Pavimentos Albufera,
**idéntico**: mismas zonas (base en Sollana), mismos umbrales, mismos textos al cliente, misma tabla de
códigos postales y misma población bajo el campo. Lo único que cambia es la marca que sale en los
avisos (la de Pavivasa, desde su propia configuración).

**Fuente:** repositorio `dreisup/pavimentos_albufera_web`, commit **`b8a978e`** (rama `main`). Los
commits del filtro son `16f569c`, `c75dc61`, `bdd3b12`, `3d027f6`, `495bd62` y `ddb893c`. Cuando aquí se
dice «copiar tal cual», sale de ese commit, byte a byte.

---

## 0. Antes de empezar

1. Lee `CLAUDE.md` y `ARCHITECTURE.md` de Pavivasa. Es la misma plantilla de monorepo (pnpm +
   Turborepo, `apps/web`, `@site/content`, `@site/config`…), pero **comprueba cada ruta** antes de
   escribir: si un archivo no existe con ese nombre, busca su equivalente y dilo en el resumen.
2. Necesitas leer el repo de origen. Si no está en la sesión, añádelo en modo lectura (`add_repo`
   `dreisup` / `pavimentos_albufera_web`) y clónalo aparte, por ejemplo en `../albufera`:
   `git -C ../albufera checkout b8a978e`.
3. Crea una rama, por ejemplo `filtro-zonas`. **No hagas push a `main`** hasta que el dueño lo pida;
   entonces, `git fetch` y solo en fast-forward.
4. Un commit por paso (§2–§6). Antes de cada commit, las puertas de Pavivasa (en origen:
   `pnpm content:validate` → `pnpm lint` → `pnpm typecheck` → `pnpm test` → build de `apps/web` con sus
   verificadores → `pnpm verify`).
5. Si el formulario o el Server Action de Pavivasa difieren de los de origen, **porta el
   comportamiento (§1), no el texto del diff**. Ante cualquier choque de arquitectura, para y pregunta.

---

## 1. Comportamiento exacto (la especificación)

| Zona | Códigos postales | Se acepta | Al dueño le llega | El cliente ve |
|---|---|---|---|---|
| A | Los 456 de `ZONE_A_POSTAL_CODES` (polígono por tiempo de coche desde Sollana, más 26 forzados) | Cualquier superficie | Correo + Telegram | «Recibido» |
| B | Resto de 03, 12 y 46 (Comunitat Valenciana) | **Más de 500 m²** | Correo + Telegram; si no cumple, **solo Telegram** | «Recibido» o aviso «Fuera de zona» |
| C | Resto de prefijos 01–52 | **Más de 1000 m²** | Ídem | Ídem |
| ? | Cinco cifras con prefijo inexistente (00, 53…) | Se acepta | Correo + Telegram, «Zona sin identificar» | «Recibido» |

- «Más de»: exactamente 500 (B) y 1000 (C) **se rechazan**.
- **Rechazada:** llega **solo por Telegram** con cabecera `🟡 Fuera de filtro · solo Telegram`, la zona
  y el mínimo, y la línea `Al cliente se le ha dicho que no se acepta.` Si Telegram no entrega, sale por
  correo con asunto `[Fuera de filtro] …`: **nunca se pierde un lead**.
- **Rechazada no es conversión:** ni Meta CAPI ni `generate_lead`/Pixel. Ambos solo disparan con el
  estado `'enviado'`.
- **Formulario (las dos variantes):** superficie y código postal obligatorios. **No hay campo municipio**:
  se deduce del código postal. Al teclear las cinco cifras aparece debajo el nombre de la población
  (46440 → «Almussafes», 41001 → «Sevilla»); si el código no está en la tabla no aparece nada **y el
  envío no se bloquea**.
- **Textos al cliente**, literales:
  - Aviso zona C: `No hacemos obras fuera de la Comunitat Valenciana de 1000 m² o menos. Lo sentimos.`
  - Aviso zona B: `En tu zona solo hacemos obras de más de 500 m². Lo sentimos.`
  - Antetítulo del aviso: `Fuera de zona`.
  - Error de superficie vacía: `Escribe la superficie aproximada en m².`
  - Error de superficie ilegible: `Escribe la superficie en metros cuadrados, por ejemplo 80.`
  - Error de código postal: `Escribe tu código postal de 5 cifras.`
  - Ayuda de superficie: `Un cálculo aproximado nos vale. Largo × ancho.`
  - Entre la cifra y `m²` va un **espacio de no separación** (` `).

---

## 2. Datos y lógica pura — copiar tal cual

Copia estos archivos desde `b8a978e` sin modificarlos:

```bash
O=../albufera   # clon del repo de origen, en b8a978e
for f in \
  packages/content/scripts/build-lead-zones.ts \
  packages/content/scripts/build-postal-code-names.ts \
  packages/content/src/data/lead-zones.ts \
  packages/content/src/data/postal-code-names.ts \
  packages/content/src/queries/lead-routing.ts \
  packages/content/src/queries/lead-routing.test.ts \
  packages/content/src/queries/postal-code-names.ts \
  packages/content/src/queries/postal-code-names.test.ts \
  docs/zonas-cp.csv \
  docs/zonas-cp.md
do mkdir -p "$(dirname "$f")"; git -C "$O" show "b8a978e:$f" > "$f"; done
```

Qué es cada uno:
- `data/lead-zones.ts` (generado): `ZONE_A_POSTAL_CODES` (456), `ZONE_B_PREFIXES = ['03','12','46']`,
  `ZONE_B_MIN_M2 = 500`, `ZONE_C_MIN_M2 = 1000`, `VALID_PROVINCE_RANGE`, el polígono.
- `data/postal-code-names.ts` (generado, unos 312 kB): 11.150 CP de 52 provincias →
  `{ '46': { '440': 'Almussafes', … } }`.
- `queries/lead-routing.ts`: `classifyLead`, `parseSquareMeters`, `isValidPostalCode`,
  `normalizePostalCode`.
- `queries/postal-code-names.ts`: `getPostalCodeName`, `getProvincePostalCodeNames`,
  `getPostalCodeProvinces`.
- Los dos `scripts/build-*.ts` solo hacen falta para **regenerar**: leen `packages/content/data-raw/ES.txt`
  de GeoNames, que no se commitea. No hace falta regenerar nada para instalar el filtro.

Integración (edita, no copies):

1. **`packages/content/src/index.ts`**: añade al barrel, con su comentario «server-only»:
   ```ts
   // Server-only (carries the Zone A postal-code list): the quote Server Action is its only caller.
   export { classifyLead, isValidPostalCode, normalizePostalCode, parseSquareMeters } from './queries/lead-routing.ts'
   export type { LeadClassification, LeadZone } from './queries/lead-routing.ts'

   // Server-only (carries ~11,000 town names): the quote Server Action and the static /api/cp/ route.
   export { getPostalCodeName, getPostalCodeProvinces, getProvincePostalCodeNames } from './queries/postal-code-names.ts'
   ```
   No los añadas a los subpaths de datos del `package.json`: no deben ser alcanzables desde cliente.
2. **Tests** (Pavivasa probablemente no tiene runner; se usa el nativo de Node, sin dependencias):
   - `packages/content/package.json` → `"test": "node --experimental-strip-types --test 'src/**/*.test.ts'"`
   - `turbo.json` → tarea `"test": { "dependsOn": ["^transit"], "outputs": [] }`
   - `package.json` de la raíz → `"test": "turbo run test"`
3. **`turbo.json`**: añade `"$TURBO_ROOT$/docs/zonas-cp.csv"` a los `inputs` de `content:validate`
   (si no, la caché no se invalida cuando cambia el CSV).
4. **`.gitignore`**:
   ```
   # raw third-party datasets (e.g. GeoNames ES.txt), downloaded locally, never committed
   packages/content/data-raw/
   ```
5. **`packages/content/scripts/validate.ts`**: porta el bloque «7. Lead zones» de origen
   (`git -C $O show b8a978e:packages/content/scripts/validate.ts`). Comprueba que los CP de la zona A
   tienen 5 dígitos, no se repiten, están ordenados y empiezan por 03/12/46; que 46430 (Sollana) está en
   A; y que Sollana, Peñíscola, Utiel y Benidorm, **buscados por nombre en `docs/zonas-cp.csv`**, tienen
   al menos un CP en A. Añade además el recuento al mensaje de OK.
   **Prueba de que funciona:** quita temporalmente `'03500'…'03503', '03508'` de `lead-zones.ts`, ejecuta
   la validación (debe fallar con «none of benidorm's postal codes…») y restaura el archivo.

Verifica: `pnpm test` (9 tests, 0 fallos), `pnpm content:validate`, `pnpm typecheck`.

---

## 3. Ruta estática de poblaciones — copiar tal cual

```bash
mkdir -p "apps/web/src/app/api/cp/[provincia]"
git -C "$O" show "b8a978e:apps/web/src/app/api/cp/[provincia]/route.ts" > "apps/web/src/app/api/cp/[provincia]/route.ts"
```

Es un route handler con `dynamic = 'force-static'`, `dynamicParams = false` y `generateStaticParams()`
con las 52 provincias. El build emite un JSON estático por provincia (`/api/cp/46/`, de 2 a 4 kB
brotli) que sirve la CDN, sin función y sin terceros.

**Verificador de la raíz** (`scripts/verify/lib/manifest.mjs` o su equivalente): si trata toda ruta
prerenderizada como página HTML, fallará con 52 `missing-html-file`. En el bucle sobre
`prerender.routes`, salta las entradas que no son HTML:

```js
for (const [route, entry] of Object.entries(prerender.routes || {})) {
  if (route === '/_not-found' || METADATA_ROUTES.has(route)) continue
  // Static route handlers (e.g. the per-province JSON under /api/cp/) are
  // prerendered too, but they are data, not pages: no HTML file, no <h1>,
  // no sitemap entry. Next records their content type; pages carry none.
  const contentType = entry.initialHeaders?.['content-type']
  if (contentType && !contentType.startsWith('text/html')) continue
```

Comprueba después que el número de páginas verificadas no cambia (sin entradas «stale» en la línea base).

---

## 4. Server Action (`apps/web/src/app/presupuesto/actions.ts` o equivalente)

Referencia completa: `git -C $O show b8a978e:apps/web/src/app/presupuesto/actions.ts` y los diffs
`git -C $O show 3d027f6 495bd62 ddb893c -- apps/web/src/app/presupuesto/actions.ts`.

1. **Imports**:
   `import { classifyLead, getPostalCodeName, normalizePostalCode, parseSquareMeters } from '@site/content'`
   y `import type { LeadClassification } from '@site/content'`.
2. **Tipos**: `ValoresFormulario` gana `codigo_postal: string` y **pierde** `municipio`. `EstadoEnvio`:
   ```ts
   estado: 'inicial' | 'error' | 'enviando' | 'enviado' | 'rechazado'
   errores: Record<string, string>
   /** Solo en `'rechazado'`: la solicitud no llega al mínimo de su zona. */
   aviso?: string
   ```
3. **Esquema zod**: elimina `municipio` y añade:
   ```ts
   superficie: z
     .string()
     .trim()
     .min(1, 'Escribe la superficie aproximada en m².')
     .refine((v) => parseSquareMeters(v) !== null, 'Escribe la superficie en metros cuadrados, por ejemplo 80.'),
   codigo_postal: z
     .string()
     .transform(normalizePostalCode)
     .refine((v) => /^\d{5}$/.test(v), 'Escribe tu código postal de 5 cifras.'),
   ```
   Captura `codigo_postal` en los valores crudos que se devuelven para repoblar el formulario.
4. **Helpers** a nivel de módulo:
   ```ts
   function etiquetaZona({ zone, minSquareMeters }: LeadClassification): string {
     if (zone === 'unknown') return 'Zona sin identificar (código postal no reconocido)'
     return minSquareMeters === null ? `Zona ${zone}` : `Zona ${zone} · solo obras de más de ${minSquareMeters} m²`
   }

   function avisoRechazo({ zone, minSquareMeters }: LeadClassification): string {
     // Espacio de no separación: «1000» y «m²» no pueden quedar en líneas distintas.
     const minimo = `${minSquareMeters} m²`
     return zone === 'C'
       ? `No hacemos obras fuera de la Comunitat Valenciana de ${minimo} o menos. Lo sentimos.`
       : `En tu zona solo hacemos obras de más de ${minimo}. Lo sentimos.`
   }
   ```
5. **Tras validar y desestructurar** (`codigo_postal: codigoPostal`):
   ```ts
   const clasificacion = classifyLead({ postalCode: codigoPostal, squareMeters: parseSquareMeters(superficie) })
   const filtrada = !clasificacion.accepted
   const municipio = getPostalCodeName(codigoPostal) ?? ''   // deducido; '—' en los avisos si falta

   const metros = parseSquareMeters(superficie) ?? 0
   const metrosTexto = metros.toLocaleString('es-ES')
   const superficieAviso = metrosTexto === superficie ? `${metrosTexto} m²` : `${metrosTexto} m² (escrito: «${superficie}»)`
   const zona = etiquetaZona(clasificacion)
   ```
6. **Correo y Telegram en dos funciones locales**, `enviarEmail(): Promise<boolean>` y
   `enviarTelegram(emailEntregado: boolean | null): Promise<boolean>` (`null` = correo omitido a
   propósito). Cada una devuelve `respuesta.ok` y registra el error sin lanzar.
   - **Correo**: asunto `${filtrada ? '[Fuera de filtro] ' : ''}Presupuesto — ${nombre} · ${espacio}`. Si
     está filtrada, la cabecera es `Solicitud fuera de filtro (${zona}), pedida el … a las …. Al cliente
     se le ha dicho que no se acepta. Llega por correo porque el aviso de Telegram no ha salido.` Filas:
     Superficie = `superficieAviso`, **Código postal** = `codigoPostal`, Municipio = `municipio`.
   - **Telegram**, líneas en este orden:
     ```ts
     [filtrada ? `${nap.nombre} 🟡 Fuera de filtro · solo Telegram` : `${nap.nombre} 🔔 Nuevo presupuesto`],
     filtrada ? [{ negrita: zona }] : null,
     filtrada ? ['Al cliente se le ha dicho que no se acepta.'] : null,
     ['nombre: ', { negrita: nombre }],
     ['teléfono: ', { negrita: telefono }],
     ['email: ', email ? { negrita: email } : '—'],
     [{ negrita: espacio.toLocaleUpperCase('es-ES') }],
     [{ negrita: superficieAviso }],
     [municipio ? { negrita: municipio } : '—', ` · CP ${codigoPostal}`],
     filtrada ? null : [zona],
     lineaFoto ? [lineaFoto] : null,
     mensaje ? [mensaje] : null,
     ```
     Con `emailEntregado === null`, la línea de foto dice
     `Foto: <archivo> — no reenviada: esta solicitud no sale por email, pídesela al cliente`.
     (Si el Telegram de Pavivasa no usa `textoTelegram`/negritas, conserva su formato y añade solo
     estas líneas.)
7. **Reparto y salida**, antes del bloque de CAPI:
   ```ts
   let emailEntregado = false
   let telegramEntregado = false
   if (filtrada) {
     telegramEntregado = await enviarTelegram(null)
     if (!telegramEntregado) emailEntregado = await enviarEmail()
   } else {
     emailEntregado = await enviarEmail()
     telegramEntregado = await enviarTelegram(emailEntregado)
   }

   if (filtrada) {
     if (!emailEntregado && !telegramEntregado) {
       console.error(`Solicitud fuera de filtro sin entregar a ningún canal (CP ${codigoPostal}, ${superficieAviso})`)
     }
     return { estado: 'rechazado', errores: {}, aviso: avisoRechazo(clasificacion) }
   }
   // … a partir de aquí, lo de siempre: error si ningún canal entregó, CAPI con consentimiento, 'enviado'.
   ```
8. **CAPI y resumen**: el municipio que se manda a Meta y el `resumen` del panel «Recibido» usan el
   `municipio` deducido; la superficie del resumen es `metrosTexto`.

---

## 5. Formulario (`FormularioPresupuesto.tsx` o equivalente)

Referencia: `git -C $O show b8a978e:apps/web/src/components/secciones/FormularioPresupuesto.tsx` y los
diffs de `3d027f6`, `495bd62` y `ddb893c` sobre ese archivo.

1. **Quita el campo municipio** (input, `ref`, foco por error).
2. **Superficie en las dos variantes**: `type="text"` (no `number`: tiene que admitir `10x5`), `required`,
   ayuda `Un cálculo aproximado nos vale. Largo × ancho.`, `error={estado.errores.superficie}`,
   `aria-invalid`, `ref` y foco cuando sea el primer campo rechazado.
3. **Código postal en las dos variantes**, con la población debajo:
   ```tsx
   // a nivel de módulo
   const poblacionesPorProvincia = new Map<string, Promise<Record<string, string>>>()
   function poblacionesDe(provincia: string): Promise<Record<string, string>> {
     let pendiente = poblacionesPorProvincia.get(provincia)
     if (!pendiente) {
       pendiente = fetch(`/api/cp/${provincia}/`)
         .then((r) => (r.ok ? (r.json() as Promise<Record<string, string>>) : {}))
         .catch(() => { poblacionesPorProvincia.delete(provincia); return {} })
       poblacionesPorProvincia.set(provincia, pendiente)
     }
     return pendiente
   }

   // dentro del componente
   const [poblacion, setPoblacion] = useState('')
   const codigoBuscado = useRef('')
   const buscarPoblacion = useCallback((valor: string) => {
     const codigo = valor.replace(/\s/g, '')
     codigoBuscado.current = codigo
     if (codigo.length < 5) setPoblacion('')
     if (!/^\d{2}/.test(codigo)) return
     void poblacionesDe(codigo.slice(0, 2)).then((poblaciones) => {
       if (codigoBuscado.current !== codigo || !/^\d{5}$/.test(codigo)) return
       setPoblacion(Object.hasOwn(poblaciones, codigo.slice(2)) ? poblaciones[codigo.slice(2)] : '')
     })
   }, [])
   useEffect(() => {
     if (estado.estado === 'error') buscarPoblacion(estado.valores?.codigo_postal ?? '')
   }, [estado, buscarPoblacion])

   // JSX
   <div className="flex flex-col gap-[6px]">
     <Campo etiqueta="Código postal" htmlFor="codigo_postal" obligatorio error={estado.errores.codigo_postal}>
       <input ref={codigoPostalRef} id="codigo_postal" name="codigo_postal" type="text"
         inputMode="numeric" autoComplete="postal-code" maxLength={5} required
         defaultValue={escrito?.codigo_postal ?? ''} readOnly={enviando}
         onChange={(e) => buscarPoblacion(e.target.value)}
         aria-describedby="codigo_postal-poblacion"
         aria-invalid={Boolean(estado.errores.codigo_postal)} className={claseInput} />
     </Campo>
     <p id="codigo_postal-poblacion" aria-live="polite" className="font-sans text-14 text-tinta-media min-h-[1lh] m-0">
       {poblacion}
     </p>
   </div>
   ```
   - La línea se reserva desde el principio (`min-h-[1lh]`) para que el formulario no salte, y es región
     viva para lectores de pantalla.
   - Se pide la provincia con la 2.ª cifra, así que el nombre aparece al instante con la 5.ª.
   - `Object.hasOwn`, no `in` ni acceso directo: un código como `toString` no debe colarse.
   - Adapta clases y tokens al sistema de diseño de Pavivasa si difieren; no añadas colores.
4. **Aviso de rechazo**, antes del bloque de `'enviado'` (sustituye al formulario):
   ```tsx
   if (estado.estado === 'rechazado') {
     return (
       <div role="alert" className="border-2 border-error p-[26px] flex flex-col gap-5">
         <p className="font-mono text-d-11 tracking-[0.08em] uppercase text-error m-0">Fuera de zona</p>
         <p className="font-display font-bold fs-h2 text-26 text-tinta m-0">{estado.aviso}</p>
       </div>
     )
   }
   ```
   El efecto que dispara `generate_lead` sigue condicionado a `estado.estado === 'enviado'`: no lo toques.
5. Orden de campos en las dos variantes: nombre, teléfono, email, ¿qué quieres pavimentar?, superficie,
   código postal (y en la completa, después, mensaje y foto), privacidad.

---

## 6. Textos legales y especificación

- **Aviso legal**, sección de propiedad intelectual, un párrafo nuevo:
  > El nombre de población que aparece al escribir el código postal en el formulario de presupuesto
  > sale de los datos de códigos postales de [GeoNames](https://www.geonames.org/), publicados con
  > licencia [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es).
- **Política de privacidad**: campos que pide cada variante (superficie y código postal, sin municipio:
  «El municipio no te lo pedimos: lo deducimos del código postal»); campos obligatorios; Telegram
  recibe superficie, código postal y municipio deducido.
- **Datos legales** (`packages/content/src/data/legal.ts` o equivalente): mismas sustituciones en «qué
  recibe» Telegram y en lo que llega a Meta/Google («el municipio que corresponde a tu código postal»).
- **Spec de pantallas** (`design/02` o equivalente): tabla de campos, enmienda fechada con este
  comportamiento y los textos de §1 en la lista cerrada de microcopy. Referencia: el diff de
  `design/02-pantallas.md` en origen.

Lee primero los textos legales de Pavivasa: si su redacción difiere, cambia solo los datos (campos,
receptores), no la prosa.

---

## 7. Verificación

1. `pnpm test`, `pnpm content:validate`, `pnpm lint`, `pnpm typecheck`, build de `apps/web` con sus
   verificadores y `pnpm verify`, todo en verde.
2. Presupuesto de JS dentro del techo de Pavivasa (en origen subió +0,3 kB por ruta). Ningún CP ni
   nombre de población en el JS del navegador:
   `grep -rl "Almussafes\|ZONE_A_POSTAL" apps/web/.next/static/chunks` → sin resultados.
3. El build lista `/api/cp/[provincia]` como SSG con 52 rutas.
4. **Prueba de punta a punta sin enviar nada real.** Arranca producción con un `fetch` simulado
   (preload) que intercepta Telegram y Resend, registra cada envío en un archivo y simula la caída de
   Telegram con un archivo bandera:
   ```js
   // mock-fetch.mjs — NODE_OPTIONS="--import ./mock-fetch.mjs"
   import { appendFileSync, existsSync } from 'node:fs'
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
   `RESEND_API_KEY=test TELEGRAM_BOT_TOKEN=test TELEGRAM_CHAT_ID=1 pnpm exec next start -p 3100`. Guarda
   el PID y mátalo por PID (nunca `pkill -f` con un patrón que esté en tu propia línea de comandos). En
   Playwright, una cabecera `x-forwarded-for` distinta por caso (el límite es 3 envíos por hora y IP).

   Casos y resultado esperado:

   | CP | Superficie | Cliente ve | Envíos |
   |---|---|---|---|
   | 46440 | 10 | Recibido | correo + Telegram |
   | 46001 | 10x5 | Recibido | correo + Telegram, «50 m² (escrito: «10x5»)» |
   | 03501 | 30 | Recibido | correo + Telegram (Benidorm, forzado a A) |
   | 03001 | 500 | Aviso zona B | solo Telegram |
   | 03001 | 501 | Recibido | correo + Telegram |
   | 03203 | 1.200 | Recibido | correo + Telegram (1200) |
   | 41001 | 1000 | Aviso zona C | solo Telegram |
   | 41001 | 1001 | Recibido | correo + Telegram |
   | 08001 | 50x30 | Recibido | correo + Telegram (1500) |
   | 53001 | 100 | Recibido | correo + Telegram, «Zona sin identificar» |
   | 28001 (Telegram caído) | 100 | Aviso zona C | Telegram falla → correo «[Fuera de filtro]» |
   | 46440 | unos 80 | Error de superficie | nada |
   | 4644 | 80 | Error de código postal | nada |

   Población bajo el campo: 46440 → Almussafes · 41001 → Sevilla · 03001 → Alicante · 46300 → Utiel ·
   00123, 99999 y 4600 → nada. Tras un error, el código y la población siguen ahí.
5. Capturas a 320, 390 y 1280 px sin scroll horizontal: formulario con la población y el aviso
   «Fuera de zona» (comprueba que «1000 m²» no se parte).

---

## 8. Resumen final para el dueño

Al terminar, informa de lo siguiente:
- rama y commits;
- resultados de las puertas;
- el JS por ruta antes y después;
- la tabla de casos;
- cualquier archivo de Pavivasa que no coincidiera con el de origen y cómo lo resolviste.

Recuérdale además que:
- en Vercel, el entorno *Production* necesita `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN` y
  `TELEGRAM_CHAT_ID`;
- tras desplegar, conviene una prueba real de cada camino.

**No subas a `main` hasta que lo pida.**
