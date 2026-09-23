#!/usr/bin/env node
/**
 * Comprueba que TODA foto referenciada desde el contenido existe de verdad en
 * `public/`, que ninguna se queda sin `alt`, y que su ancho real llega al
 * mínimo que le corresponde por cómo se renderiza.
 *
 * Por qué existe este script, igual que su hermano de las redirecciones:
 * `next build` NO valida el `src` de `next/image` cuando es una cadena. Una
 * ruta mal escrita compila limpia, pasa `tsc`, pasa `lint`, y en producción
 * devuelve un 404 dentro de un hueco vacío que nadie ve hasta que lo ve un
 * cliente. Tampoco mira el ancho: una foto de 500 px sirve a `sizes="100vw"`
 * sin una sola advertencia y se ve borrosa en cualquier portátil.
 *
 * Los tres umbrales, y por qué son tres y no uno (`design/05` §C #13):
 *
 *   SUELO (800 px)     Nada por debajo se publica. Falla el build.
 *   A_SANGRE (1600 px) La imagen que ocupa el ancho de la ventana —los
 *                      `heroImage` de `@site/content`'s `data/services.ts`
 *                      y el hero 21/9 de cada ficha de obra— no admite
 *                      menos. Falla el build,
 *                      salvo las de `HEREDADAS_A_SANGRE`, que avisan.
 *   OBJETIVO (1600 px) Lo que se pide a toda foto nueva. NO falla: hoy no lo
 *                      cumple ni la mitad del material heredado, y convertirlo
 *                      en error dejaría la web sin galería de obra. Se informa
 *                      en una línea para que la deuda se vea en cada build.
 *
 * El ancho se lee de la cabecera del archivo, sin dependencias: el presupuesto
 * de JS de este proyecto no admite una librería de imagen ni para un script.
 *
 * Uso: node scripts/verificar-imagenes.mjs   (se ejecuta solo en `postbuild`)
 *
 * ⚠️ **Fase 2b de la migración: el contenido ya no vive en `src/content/*.json`.**
 * `content/proyectos.json`/`acabados.json`/`zonas.json`/`articulos.json`
 * se han borrado — los datos viven ahora en `packages/content/src/data/*.ts`
 * (paquete `@site/content`), y `src/content/*.ts(x)` son adaptadores que los
 * recomponen en tiempo de ejecución, no literales. Este script sigue siendo
 * puramente TEXTUAL (sin importar el paquete ni evaluar TypeScript): lee
 * `packages/content/src/data/*.ts` como texto plano con los mismos patrones
 * de siempre, porque ahí es donde cada `src`/`alt`/`heroImage` sigue estando
 * escrito literalmente — igual que antes estaba en el JSON.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const raiz = resolve(import.meta.dirname, '..')

const SUELO = 800
const A_SANGRE = 1600
const OBJETIVO = 1600

/** Todo `src` que empieza por `/obras/`, `/acabados/`, `/blog/` o `/marca/`. */
const PATRON = /["'](\/(?:obras|acabados|blog|marca)\/[^"'\s]+?\.(?:jpg|jpeg|png|svg|webp|avif))["']/gi

/**
 * Los `src` declarados como `heroImage` de un servicio, que se sirven a
 * `sizes="100vw"`. Se aplica SOLO a `packages/content/src/data/services.ts`
 * (ver más abajo, donde se lee ese archivo aparte): antes de la fase 2b el patrón buscaba
 * el literal `imagenHero:` en cualquier archivo, y ese literal solo existía
 * en `content/servicios.tsx` — nunca en `content/modelos.ts` (que usa el
 * mismo campo `heroImage`/`src` pero SIN la palabra `imagenHero:` delante,
 * y nunca contó como "a sangre"). Repetir la búsqueda sin acotar a
 * `services.ts` habría sumado los 8 heroes de modelo al conjunto "a
 * sangre" y cambiado qué falla el build — exactamente el acoplamiento que
 * este script existe para no perder de vista.
 */
const PATRON_HERO_SERVICIO = /heroImage:\s*\{\s*src:\s*'([^']+)'/g

/** Primera imagen de cada proyecto (`images: [{ src: '...' `), que `PANTALLA_OBRA` sirve a sangre. */
const PATRON_HERO_PROYECTO = /images:\s*\[\s*\{\s*src:\s*'([^']+)'/g

/** `src` seguido de cerca por un `alt: { es: '...' }` Localized, en los datos del paquete. */
const PATRON_SRC_ALT = /src:\s*'([^']+)'\s*,\s*alt:\s*\{\s*es:\s*'((?:[^'\\]|\\.)*)'/g

/** La pantalla de obra, de la que sale el otro grupo de fotos a sangre. */
const PANTALLA_OBRA = 'src/app/proyectos/[slug]/page.tsx'

/** Raíz del monorepo, para citar rutas legibles en los mensajes de error. */
const REPO = resolve(raiz, '../..')

/** `packages/content/src`, raíz de todo el contenido desde la fase 2b. */
const CONTENIDO = resolve(REPO, 'packages/content/src')

/**
 * Excepción con fecha de caducidad. NO es un umbral relajado.
 *
 * Los heroes de obra que hoy se sirven a sangre por debajo de `A_SANGRE`. Son
 * el material que hay: las ocho obras documentadas están fotografiadas a
 * 898-1200 px y la sesión nueva a 1600 px sigue pendiente (`design/05` §C, «la
 * obra documentada es la peor fotografiada»). Romper el build con ellas
 * dejaría el repo rojo hasta esa sesión, así que aquí avisan en vez de fallar.
 *
 * Cada línea apunta el ancho medido hoy, y ESO es lo que le pone fecha: el día
 * que una de estas fotos se sustituya por su original nuevo el ancho dejará de
 * coincidir, la excepción no le aplicará y pasará a juzgarse por el umbral,
 * sin que nadie tenga que acordarse de tocar este archivo. Una foto a sangre
 * que no esté en esta lista falla el build desde el primer día. Cuando la
 * lista se quede vacía se borra, y el guardián queda sin excepciones.
 *
 * ⚠ La auditoría de `design/06` nombraba cuatro —las de 898-960 px—. Medidas
 * las ocho, son siete las que no llegan a 1600: las tres de 1200 px son la
 * misma deuda y la misma sesión pendiente, no un caso aparte.
 */
const HEREDADAS_A_SANGRE = new Map([
  ['/obras/corbera-fratasado-arena.jpg', 898],
  ['/obras/godella-lavado-gris.jpg', 900],
  ['/obras/moraira-impreso-adoquin-pequeno-arena-2025.jpg', 900],
  ['/obras/ribarroja-pulido-gris.jpg', 960],
  ['/obras/alzira-impreso-adoquin-irregular-107-2.jpg', 1200],
  ['/obras/impreso-manta-gris-2.jpg', 1200],
  ['/obras/moncada-impreso-espiga-117-2025.jpg', 1200],
])

function archivosDe(dir, exts) {
  const salida = []
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada)
    if (statSync(ruta).isDirectory()) {
      if (entrada === 'node_modules' || entrada === '.next') continue
      salida.push(...archivosDe(ruta, exts))
    } else if (exts.some((e) => entrada.endsWith(e))) {
      salida.push(ruta)
    }
  }
  return salida
}

/**
 * Ancho en píxeles leído de la cabecera. `null` si el formato no se sabe leer
 * —un AVIF, por ejemplo—: se informa aparte y no se da por bueno en silencio.
 */
function anchoDe(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return buf.readUInt32BE(16) // PNG
  if (buf.subarray(0, 3).toString('latin1') === 'GIF') return buf.readUInt16LE(6)
  if (
    buf.subarray(0, 4).toString('latin1') === 'RIFF' &&
    buf.subarray(8, 12).toString('latin1') === 'WEBP'
  ) {
    const tipo = buf.subarray(12, 16).toString('latin1')
    if (tipo === 'VP8 ') return buf.readUInt16LE(26) & 0x3fff
    if (tipo === 'VP8L') return (buf.readUInt32LE(21) & 0x3fff) + 1
    if (tipo === 'VP8X') return (buf.readUIntLE(24, 3) & 0xffffff) + 1
    return null
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    // JPEG: recorrer marcadores hasta el SOF, que es quien lleva las medidas.
    let i = 2
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) {
        i++
        continue
      }
      const marca = buf[i + 1]
      if (marca === 0xd8 || marca === 0x01 || (marca >= 0xd0 && marca <= 0xd7)) {
        i += 2
        continue
      }
      const largo = buf.readUInt16BE(i + 2)
      const esSOF = marca >= 0xc0 && marca <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marca)
      if (esSOF) return buf.readUInt16BE(i + 7)
      i += 2 + largo
    }
  }
  return null
}

const fuentes = [
  // `src/content` ya no lleva datos literales (fase 2b: son adaptadores
  // construidos en tiempo de ejecución sobre `@site/content`) pero se sigue
  // barriendo por si algún día vuelve a citar una ruta a mano.
  ...archivosDe(resolve(raiz, 'src/content'), ['.ts', '.tsx']),
  ...archivosDe(resolve(raiz, 'src/app'), ['.ts', '.tsx']),
  ...archivosDe(resolve(raiz, 'src/components'), ['.ts', '.tsx']),
  // `lib/` faltaba, y no era inocuo: `lib/schema.tsx` nombra el logotipo que va
  // al campo `logo` del JSON-LD, o sea la imagen que Google enseña, y era la
  // única referencia a `public/` que ningún verificador miraba. Mismo agujero
  // que `tailwind.config.ts` ya había tapado en su glob de contenido.
  ...archivosDe(resolve(raiz, 'src/lib'), ['.ts', '.tsx']),
  // Fase 2b: el contenido real (todo `src`/`alt`) vive aquí.
  ...archivosDe(resolve(CONTENIDO, 'data'), ['.ts']),
]

const referencias = new Map() // src -> [archivos que la nombran]
const aSangre = new Set() // src servidos a 100vw

for (const archivo of fuentes) {
  const texto = readFileSync(archivo, 'utf8')
  const relativo = archivo.slice(REPO.length + 1)
  for (const [, src] of texto.matchAll(PATRON)) {
    referencias.set(src, [...(referencias.get(src) ?? []), relativo])
  }
}

/**
 * Los heroes de servicio, servidos a `sizes="100vw"` — antes se buscaba el
 * literal `imagenHero:` en cualquier archivo; ahora ese objeto se construye
 * en tiempo de ejecución en el adaptador, así que la búsqueda se acota al
 * ÚNICO sitio donde `heroImage: { src: … }` sigue siendo literal: los datos
 * de servicios del paquete.
 */
const textoServicios = readFileSync(resolve(CONTENIDO, 'data/services.ts'), 'utf8')
for (const [, src] of textoServicios.matchAll(PATRON_HERO_SERVICIO)) aSangre.add(src)

/**
 * El otro grupo de fotos a sangre, que hasta ahora se colaba: `PANTALLA_OBRA`
 * renderiza `proyecto.imagenes[0]` en 21/9 con `prioridad` y `tamanos="100vw"`.
 * Nada en los datos distingue esa foto de las demás del mismo array —las
 * miniaturas 1 y 2 salen a 25vw—, así que la condición sale de la posición:
 * primer elemento de `images`, proyecto por proyecto. Se lee textualmente de
 * `packages/content/src/data/projects.ts` (antes, de `proyectos.json`): el
 * primer `src` de cada `images: [...]` literal.
 */
const textoProyectos = readFileSync(resolve(CONTENIDO, 'data/projects.ts'), 'utf8')
for (const [, src] of textoProyectos.matchAll(PATRON_HERO_PROYECTO)) aSangre.add(src)

/**
 * Ese acoplamiento es invisible desde aquí: si la pantalla deja de servir
 * `imagenes[0]` a sangre, este script seguiría exigiendo 1600 px a la foto
 * equivocada y nadie se enteraría. Aviso y no error, porque la comprobación es
 * textual y una reescritura legítima de la pantalla puede despistarla.
 *
 * Las dos condiciones van dentro de la MISMA etiqueta —de `imagenes[0]` al `>`
 * que la cierra—, y no sueltas por el archivo: la miniatura de la línea 75
 * también dice `100vw`, así que buscarlas por separado daría por vivo el
 * acoplamiento aunque el hero cambiara de `sizes`, que es justo lo que hay que
 * detectar.
 */
const rutaPantallaObra = resolve(raiz, PANTALLA_OBRA)
const textoPantallaObra = existsSync(rutaPantallaObra) ? readFileSync(rutaPantallaObra, 'utf8') : ''
const acoplamientoVivo = /imagenes\[0\][^>]*?100vw/.test(textoPantallaObra)

const rotas = []
const estrechas = [] // por debajo del suelo: error
const heroEstrechos = [] // a sangre por debajo de 1600: error
const heroHeredados = [] // a sangre por debajo de 1600, con excepción apuntada: aviso
const bajoObjetivo = [] // por debajo del objetivo: aviso, no error
const ilegibles = []
let medidas = 0 // fotos medidas: el denominador del aviso del objetivo

for (const [src, donde] of referencias) {
  const ruta = resolve(raiz, 'public', src.slice(1))
  if (!existsSync(ruta)) {
    rotas.push([src, donde])
    continue
  }
  if (src.endsWith('.svg')) continue // vectorial: el ancho no aplica
  const ancho = anchoDe(readFileSync(ruta))
  if (ancho === null) {
    ilegibles.push(src)
    continue
  }
  // El denominador del objetivo cuenta fotos, no activos de marca: si sumara
  // los cuatro del logotipo, el aviso diría «23/43 llegan» y la cifra mejoraría
  // sola sin que se hubiera fotografiado ni una obra más.
  if (!src.startsWith('/marca/')) medidas++
  if (ancho < SUELO) estrechas.push([src, ancho, donde])
  else if (aSangre.has(src) && ancho < A_SANGRE) {
    // La excepción vale solo mientras la foto siga siendo EXACTAMENTE la de
    // aquel día: mismo archivo, mismo ancho. En cuanto cambia, se juzga.
    if (HEREDADAS_A_SANGRE.get(src) === ancho) heroHeredados.push([src, ancho])
    else heroEstrechos.push([src, ancho, donde])
  }
  // El objetivo mide **deuda fotográfica**: cuánta obra documentada sigue sin
  // una toma decente. `/marca/` no es fotografía y no se juzga por su nitidez
  // sino por su caja de render, que vive en el CSS y desde aquí no se ve: el
  // logotipo de la cabecera se pinta a 276 px CSS y el archivo mide 900, o sea
  // 3× para un DPR 3. Exigirle 1600 px obligaría a servir cuatro veces los
  // píxeles que cualquier pantalla puede usar —21 kB por carga— para no ensuciar
  // un contador que habla de otra cosa. El SUELO sí le aplica y lo cumple.
  if (ancho < OBJETIVO && !src.startsWith('/marca/')) bajoObjetivo.push([src, ancho])
}

/** Excepciones que ya no aplican: la foto llegó, o dejó de servirse a sangre. */
const heredadasCaducadas = [...HEREDADAS_A_SANGRE.keys()].filter(
  (src) => !heroHeredados.some(([heredada]) => heredada === src),
)

/**
 * El `alt` es obligatorio: `public/README.md`. Vacío = imagen muda para
 * lectores. Antes de la fase 2b se comprobaba recorriendo el JSON parseado
 * de `src/content/*.json`; ahora ese contenido vive en
 * `packages/content/src/data/*.ts` como literales `{ src: '...', alt: {
 * es: '...' }, ... }` (forma `Localized<string>`), así que se localizan por
 * texto con `PATRON_SRC_ALT` — mismo alcance que antes (solo las imágenes
 * declaradas como contenido, no cualquier `src` suelto del repo).
 */
const sinAlt = []
for (const archivo of archivosDe(resolve(CONTENIDO, 'data'), ['.ts'])) {
  const texto = readFileSync(archivo, 'utf8')
  const relativo = archivo.slice(REPO.length + 1)
  for (const [, src, alt] of texto.matchAll(PATRON_SRC_ALT)) {
    if (!alt?.trim()) sinAlt.push([src, relativo])
  }
}

if (rotas.length || sinAlt.length || estrechas.length || heroEstrechos.length) {
  for (const [src, donde] of rotas) {
    console.error(`\n✗ No existe public${src}\n     citada en ${donde.join(', ')}`)
  }
  for (const [src, donde] of sinAlt) {
    console.error(`\n✗ Sin alt: ${src}   (${donde})`)
  }
  for (const [src, ancho, donde] of estrechas) {
    console.error(
      `\n✗ ${ancho} px, por debajo del suelo de ${SUELO}: ${src}\n     citada en ${donde.join(', ')}`,
    )
  }
  for (const [src, ancho, donde] of heroEstrechos) {
    console.error(
      `\n✗ ${ancho} px en una imagen a sangre, que exige ${A_SANGRE}: ${src}\n     citada en ${donde.join(', ')}`,
    )
  }
  console.error(
    '\nUn `src` mal escrito compila limpio y en producción es un hueco vacío;\n' +
      'una foto estrecha compila limpia y en producción se ve borrosa.\n',
  )
  process.exit(1)
}

console.log(`✓ ${referencias.size} fotos verificadas contra public/.`)
if (ilegibles.length) {
  console.log(`  ⚠ ${ilegibles.length} de formato no legible por este script: ${ilegibles.join(', ')}`)
}
if (heroHeredados.length) {
  console.log(
    `  ⚠ ${heroHeredados.length} fotos se sirven a sangre por debajo de ${A_SANGRE} px y avisan\n` +
      '    en vez de fallar, a la espera de la sesión fotográfica de la obra documentada:',
  )
  for (const [src, ancho] of [...heroHeredados].sort((a, b) => a[1] - b[1])) {
    console.log(`      ${String(ancho).padStart(4)} px  ${src}`)
  }
}
if (heredadasCaducadas.length) {
  console.log(
    '  ⚠ Excepciones de HEREDADAS_A_SANGRE que ya no aplican —la foto llegó, cambió\n' +
      '    o dejó de servirse a sangre—. Quita su línea de este script:\n' +
      heredadasCaducadas.map((src) => `      ${src}`).join('\n'),
  )
}
if (!acoplamientoVivo) {
  console.log(
    `  ⚠ ${PANTALLA_OBRA} ya no dice \`proyecto.imagenes[0]\` con \`100vw\`.\n` +
      '    Este script sigue exigiendo el mínimo a sangre a esa primera foto: revisa\n' +
      '    si el hero de la ficha de obra cambió de origen o de tamaño.',
  )
}
if (bajoObjetivo.length) {
  // El denominador son las MEDIDAS, no las referenciadas: un SVG o un formato que
  // este script no sabe leer no ha superado el objetivo, simplemente no cuenta.
  console.log(
    `  ⚠ ${medidas - bajoObjetivo.length}/${medidas} llegan al objetivo de ${OBJETIVO} px; ` +
      `${bajoObjetivo.length} no. Reparto y detalle en public/obras/INVENTARIO.md`,
  )
}
