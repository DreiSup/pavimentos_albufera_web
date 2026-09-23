#!/usr/bin/env node
/**
 * Comprueba que ninguna ruta publicada pase del techo de JS del proyecto.
 *
 * Por qué existe este script, y por qué no basta con mirar `next build`: la
 * tabla de «First Load JS» suma lo que declara `app-build-manifest.json` y
 * **omite `chunks/444` y `chunks/app/layout`** —7,5 kB br11 por ruta que las
 * 45 páginas sí descargan—, así que el número impreso no es el que paga el
 * visitante. Aquí el ámbito es otro: los `<script src>` que de verdad salen en
 * el HTML servido de cada ruta. Es la diferencia entre saber lo que el build
 * cree que manda y saber lo que el navegador se baja.
 *
 * La unidad, fijada en `design/06` y sin margen de interpretación:
 *
 *   BROTLI q11, ARCHIVO A ARCHIVO, SIN CONCATENAR. Cada chunk se comprime por
 *   separado, igual que viaja por la red, y se suman los tamaños. Concatenar
 *   antes de comprimir regala un diccionario compartido que no existe.
 *
 * ⚠️ Los parámetros de compresión son parte del contrato, no un detalle a
 * afinar: q11 con la ventana por defecto de Node. `design/06` cruza las cifras
 * que salen de aquí en cuatro sitios —105.737 B en la home, 107,1 / 97,1 kB de
 * máximo y mínimo del sitio, 46.749 B de `chunks/4bd1b696-*.js`— y tocar
 * `BROTLI_PARAM_*` las invalida todas en silencio, sin romper nada.
 *
 * Los dos umbrales (`design/06`, «Correcciones a las secciones anteriores»):
 *
 *   TECHO (112.000 B)   Rompe el build. Detector de regresión: el número no
 *                       tiene que bajar, tiene que NO subir. El margen sobre
 *                       el máximo de hoy es de 4,9 kB.
 *   OBJETIVO (105.000 B) Solo avisa. Hoy lo pasan 10 rutas y convertirlo en
 *                       error dejaría el repo sin poder construir.
 *
 * El presupuesto original de cien kilobytes queda RETIRADO y no vuelven: el
 * suelo del sitio con cero código propio es de 94,0 kB br11, así que dejaban
 * 6 kB para todo lo que este proyecto escriba. Se medía contra un número que
 * no existía, y encima sin unidad declarada.
 *
 * Dos precisiones de alcance:
 *
 *  - Se excluye el script con `noModule`, el bundle de polyfills: solo lo pide
 *    un navegador sin módulos ES, que no es el visitante que se está midiendo.
 *  - Los `src` de terceros (gtag.js, fbevents.js) no se cuentan aquí. Van
 *    aparte y no son bytes nuestros; se informa de cuántos se han saltado.
 *
 * Y una advertencia sobre lo que este número NO dice: el brotli del CDN de
 * Vercel no está documentado y **no es comparable** con el de aquí. Esto mide
 * nuestro bundle contra sí mismo, de forma determinista. No afirma nada sobre
 * los bytes que entrega la CDN.
 *
 * Uso: node scripts/verificar-presupuesto.mjs [techo en bytes]
 *      (se ejecuta solo en `postbuild`; el argumento es para probar el gate)
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { brotliCompressSync, constants } from 'node:zlib'

const raiz = resolve(import.meta.dirname, '..')
const APP = resolve(raiz, '.next/server/app')

const TECHO = 112000
const OBJETIVO = 105000

/**
 * El techo se puede bajar por argumento para comprobar que el gate muerde.
 * A propósito por `argv` y no por variable de entorno: una variable se cuela
 * sola desde el entorno de CI y deja pasar un build que debería haber roto.
 */
const techo = process.argv[2] === undefined ? TECHO : Number(process.argv[2])
if (!Number.isFinite(techo) || techo <= 0) {
  console.error(`✗ Techo no válido: ${process.argv[2]}. Se espera un número de bytes.`)
  process.exit(1)
}

/** Bytes a kB con coma decimal, sin `toLocaleString`: la salida es un contrato. */
const kB = (bytes) => `${(bytes / 1000).toFixed(1).replace('.', ',')} kB`

function htmlsDe(dir) {
  const salida = []
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada)
    if (statSync(ruta).isDirectory()) salida.push(...htmlsDe(ruta))
    else if (entrada.endsWith('.html')) salida.push(ruta)
  }
  return salida
}

/** `/index.html` → `/` · `/zonas/denia.html` → `/zonas/denia` */
function rutaDe(archivo) {
  const relativa = archivo.slice(APP.length).replace(/\.html$/, '').replace(/\/index$/, '')
  return relativa || '/'
}

/**
 * Ruta en disco de un `src` del HTML. `null` si es de terceros.
 *
 * ⚠️ El `decodeURIComponent` es OBLIGATORIO: las rutas dinámicas emiten su
 * chunk como `app/acabados/%5Bmodelo%5D/page-*.js` y en disco el directorio se
 * llama `[modelo]`. Sin decodificar, esto revienta con ENOENT en las cuatro
 * rutas dinámicas del sitio y en ninguna otra.
 */
function enDisco(src) {
  if (/^(https?:)?\/\//.test(src)) return null
  const limpia = decodeURIComponent(src.split('?')[0])
  if (limpia.startsWith('/_next/')) return resolve(raiz, '.next', limpia.slice('/_next/'.length))
  return resolve(raiz, 'public', limpia.replace(/^\//, ''))
}

const archivos = existsSync(APP) ? htmlsDe(APP).sort() : []
if (archivos.length === 0) {
  console.error('✗ No hay HTML en .next/server/app. Ejecuta `npm run build` antes.')
  process.exit(1)
}

const comprimidos = new Map() // src -> bytes br11, para no comprimir dos veces el mismo chunk
const externos = new Set()
const medidas = []

for (const archivo of archivos) {
  const html = readFileSync(archivo, 'utf8')

  // Un `src` por etiqueta, deduplicado: una ruta puede citar el mismo chunk dos veces.
  const fuentes = new Set()
  for (const [, atributos] of html.matchAll(/<script\b([^>]*)>/gi)) {
    if (/\bnoModule\b/i.test(atributos)) continue
    const src = atributos.match(/\bsrc="([^"]+)"/)
    if (src) fuentes.add(src[1])
  }

  let bytes = 0
  for (const src of fuentes) {
    if (!comprimidos.has(src)) {
      const ruta = enDisco(src)
      if (ruta === null) {
        externos.add(src)
        comprimidos.set(src, 0)
      } else {
        if (!existsSync(ruta)) {
          console.error(`\n✗ ${rutaDe(archivo)} carga un script que no existe en disco:\n     ${src}\n`)
          process.exit(1)
        }
        const crudo = readFileSync(ruta)
        const params = { [constants.BROTLI_PARAM_QUALITY]: 11 }
        comprimidos.set(src, brotliCompressSync(crudo, { params }).length)
      }
    }
    bytes += comprimidos.get(src)
  }

  medidas.push([rutaDe(archivo), bytes])
}

// Descendente y estable sobre una lista ya ordenada por archivo: el máximo y el
// mínimo salen siempre iguales aunque varias rutas empaten al byte, que es el
// caso de las tres legales.
medidas.sort((a, b) => b[1] - a[1])

const infractoras = medidas.filter(([, bytes]) => bytes > techo)
const sobreObjetivo = medidas.filter(([, bytes]) => bytes > OBJETIVO)

if (techo !== TECHO) {
  console.log(`  ⚠ Techo forzado por argumento a ${kB(techo)}. El del proyecto es ${kB(TECHO)}.`)
}

if (infractoras.length > 0) {
  console.error(`\n✗ ${infractoras.length} de ${medidas.length} rutas pasan del techo de ${kB(techo)} br11:\n`)
  for (const [ruta, bytes] of infractoras) {
    console.error(`   ${ruta}\n      ${kB(bytes)}   ⟵ ${kB(bytes - techo)} de más\n`)
  }
  console.error(
    'El techo no es una aspiración, es el detector de regresión del bundle: existe\n' +
      'para que el JS no suba sin que nadie se entere. El visitante que llega desde un\n' +
      'anuncio paga la diferencia entera antes de ver nada.\n',
  )
  process.exit(1)
}

const [rutaMax, bytesMax] = medidas[0]
const [rutaMin, bytesMin] = medidas[medidas.length - 1]

console.log(
  `✓ ${medidas.length} rutas dentro del techo, ` +
    `máx ${kB(bytesMax)} (${rutaMax}), mín ${kB(bytesMin)} (${rutaMin})`,
)
if (sobreObjetivo.length > 0) {
  console.log(`  ⚠ ${sobreObjetivo.length} por encima del objetivo de ${kB(OBJETIVO)}`)
}
if (externos.size > 0) {
  // Terceros: se cuentan aparte por decisión de `design/06`, no se ignoran en silencio.
  console.log(`  (${externos.size} scripts de terceros fuera del ámbito: ${[...externos].join(', ')})`)
}
