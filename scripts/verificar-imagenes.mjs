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
 *   A_SANGRE (1600 px) La imagen que ocupa el ancho de la ventana —hoy los
 *                      `imagenHero` de `content/servicios.tsx`— no admite menos.
 *                      Falla el build.
 *   OBJETIVO (1600 px) Lo que se pide a toda foto nueva. NO falla: hoy no lo
 *                      cumple ni la mitad del material heredado, y convertirlo
 *                      en error dejaría la web sin galería de obra. Se informa
 *                      en una línea para que la deuda se vea en cada build.
 *
 * El ancho se lee de la cabecera del archivo, sin dependencias: el presupuesto
 * de JS de este proyecto no admite una librería de imagen ni para un script.
 *
 * Uso: node scripts/verificar-imagenes.mjs   (se ejecuta solo en `postbuild`)
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const raiz = resolve(import.meta.dirname, '..')

const SUELO = 800
const A_SANGRE = 1600
const OBJETIVO = 1600

/** Todo `src` que empieza por `/obras/`, `/acabados/`, `/blog/` o `/marca/`. */
const PATRON = /["'](\/(?:obras|acabados|blog|marca)\/[^"'\s]+?\.(?:jpg|jpeg|png|svg|webp|avif))["']/gi

/** Los `src` declarados como `imagenHero`, que se sirven a `sizes="100vw"`. */
const PATRON_HERO = /imagenHero:\s*\{\s*src:\s*'([^']+)'/g

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
  ...archivosDe(resolve(raiz, 'content'), ['.ts', '.tsx', '.json']),
  ...archivosDe(resolve(raiz, 'app'), ['.ts', '.tsx']),
  ...archivosDe(resolve(raiz, 'components'), ['.ts', '.tsx']),
]

const referencias = new Map() // src -> [archivos que la nombran]
const aSangre = new Set() // src servidos a 100vw

for (const archivo of fuentes) {
  const texto = readFileSync(archivo, 'utf8')
  const relativo = archivo.slice(raiz.length + 1)
  for (const [, src] of texto.matchAll(PATRON)) {
    referencias.set(src, [...(referencias.get(src) ?? []), relativo])
  }
  for (const [, src] of texto.matchAll(PATRON_HERO)) aSangre.add(src)
}

const rotas = []
const estrechas = [] // por debajo del suelo: error
const heroEstrechos = [] // a sangre por debajo de 1600: error
const bajoObjetivo = [] // por debajo del objetivo: aviso, no error
const ilegibles = []

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
  if (ancho < SUELO) estrechas.push([src, ancho, donde])
  else if (aSangre.has(src) && ancho < A_SANGRE) heroEstrechos.push([src, ancho, donde])
  if (ancho < OBJETIVO) bajoObjetivo.push([src, ancho])
}

/** El `alt` es obligatorio: `public/README.md`. Vacío = imagen muda para lectores. */
const sinAlt = []
for (const archivo of fuentes.filter((f) => f.endsWith('.json'))) {
  const datos = JSON.parse(readFileSync(archivo, 'utf8'))
  const recorrer = (valor) => {
    if (Array.isArray(valor)) return valor.forEach(recorrer)
    if (valor && typeof valor === 'object') {
      if (typeof valor.src === 'string' && !valor.alt?.trim()) {
        sinAlt.push([valor.src, archivo.slice(raiz.length + 1)])
      }
      Object.values(valor).forEach(recorrer)
    }
  }
  recorrer(datos)
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
if (bajoObjetivo.length) {
  const total = referencias.size
  console.log(
    `  ⚠ ${total - bajoObjetivo.length}/${total} llegan al objetivo de ${OBJETIVO} px; ` +
      `${bajoObjetivo.length} no. Reparto y detalle en public/obras/INVENTARIO.md`,
  )
}
