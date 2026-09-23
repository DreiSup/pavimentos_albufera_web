#!/usr/bin/env node
/**
 * Comprueba que ninguna ruta sirva su candidato a LCP escondido dentro de una
 * sección `.aparece`, es decir, con `opacity: 0` hasta que React hidrate.
 *
 * Por qué existe este script. `app/globals.css:109` declara `.aparece` con
 * `opacity: 0`, y solo `Aparece.tsx` —un componente de cliente con un
 * `IntersectionObserver`— le añade `aparece--visible`. En el HTML servido el
 * atributo sale siempre como `class="aparece "`, sin el modificador: hasta que
 * el JavaScript hidrata, esa sección **no se ve**. Si dentro cae el `<h1>` o la
 * imagen de portada, el visitante mira una pantalla en blanco durante toda la
 * hidratación y, peor, la métrica sale buena: el LCP se resuelve contra lo
 * primero que sí es visible, normalmente un texto de cabecera.
 *
 * `next build` no tiene forma de verlo. El CSS es correcto, el componente es
 * correcto, el HTML es correcto; lo que está mal es la combinación de los tres
 * en una jerarquía concreta, y eso solo se ve recorriendo el árbol de etiquetas
 * del HTML ya generado.
 *
 * Las dos reglas, y por qué son esas dos:
 *
 *   <h1>                          Nunca puede tener un ancestro `.aparece`.
 *                                 Es el candidato a LCP de toda página sin
 *                                 foto a sangre.
 *   <img> sin `loading="lazy"`    Tampoco. La imagen no perezosa es la que
 *                                 `next/image` marca con `priority`, es decir,
 *                                 exactamente la que alguien declaró como LCP.
 *                                 Una imagen perezosa está por debajo del
 *                                 pliegue por definición y no se mide aquí.
 *
 * ⚠️ Ancestro quiere decir ancestro: la clase se comprueba **antes** de apilar
 * el propio elemento, así que un `<h1 class="aparece">` no es su propio
 * ancestro. Y el reconocimiento de la clase va por tokens, no por subcadena:
 * `aparece--visible` contiene «aparece» y no es la clase que apaga nada.
 *
 * El numerador son RUTAS, no elementos: una página con tres `<h1>` dentro de
 * `.aparece` cuenta una vez. El denominador lo cuenta el propio script
 * recorriendo el directorio, no una cifra congelada: hoy son 45 rutas y con las
 * landings de la tarea 1.28 dentro serán 49.
 *
 * Uso: node scripts/verificar-lcp-visible.mjs   (se ejecuta solo en `postbuild`)
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const raiz = resolve(import.meta.dirname, '..')
const APP = resolve(raiz, '.next/server/app')

/** La clase que apaga la sección. `app/globals.css:109`. */
const CLASE = 'aparece'

/** Elementos sin cierre: no se apilan nunca o el árbol queda desalineado. */
const VACIOS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

/**
 * Contenido en crudo, que NO se parsea. Es la parte que más importa: los
 * `self.__next_f.push` del payload de Flight llevan marcado serializado, y sin
 * saltárselo el recorrido cuenta etiquetas que no existen en el documento.
 */
const CRUDOS = new Set(['script', 'style'])

/**
 * Una etiqueta. Los valores entrecomillados se consumen enteros para que un
 * `>` dentro de un atributo no la corte —los `srcSet` de `next/image` pasan de
 * 2.000 caracteres— y la alternativa suelta excluye las comillas a propósito:
 * sin esa exclusión el motor tiene dos formas de leer cada carácter y el
 * retroceso se dispara sobre un HTML de 200 kB en una sola línea.
 */
const ETIQUETA = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g

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

/** El `class` de una cadena de atributos, o cadena vacía si no lo lleva. */
function claseDe(atributos) {
  const encontrado = atributos.match(/\bclass=("([^"]*)"|'([^']*)')/i)
  return encontrado ? (encontrado[2] ?? encontrado[3] ?? '') : ''
}

/** `true` si la lista de clases contiene el token exacto, no la subcadena. */
function apaga(clase) {
  return clase.split(/\s+/).includes(CLASE)
}

/**
 * Un atributo cualquiera con un valor concreto, sin distinguir mayúsculas.
 * Se aceptan las tres formas —comilla doble, simple y valor suelto— aunque
 * React solo emite la primera: aquí no se lee lo que React escribe, se lee lo
 * que haya en el HTML, y un `loading=lazy` sin comillas colado por un embebido
 * de terceros contaría como imagen no perezosa y rompería el build sin motivo.
 */
function atributoEs(atributos, nombre, valor) {
  const encontrado = atributos.match(new RegExp(`\\b${nombre}=("([^"]*)"|'([^']*)'|([^\\s>]*))`, 'i'))
  const leido = encontrado ? (encontrado[2] ?? encontrado[3] ?? encontrado[4] ?? '') : null
  return leido !== null && leido.toLowerCase() === valor
}

/**
 * Recorre un HTML siguiendo la jerarquía y devuelve las infracciones, más los
 * totales de elementos vistos para poder comprobar que el recorrido es sano.
 */
function recorrer(html) {
  const pila = [] // { etiqueta, apaga }
  let bajoAparece = 0 // ancestros abiertos con la clase, para no rehacer la pila
  const infracciones = []
  let h1 = 0
  let imagenes = 0
  let noPerezosas = 0

  ETIQUETA.lastIndex = 0
  let encontrado
  while ((encontrado = ETIQUETA.exec(html)) !== null) {
    const [entera, cierre, crudo, atributos] = encontrado
    const etiqueta = crudo.toLowerCase()

    if (cierre) {
      // Se busca hacia atrás y se descarta lo que quede abierto por el camino:
      // un cierre huérfano no debe vaciar la pila entera.
      const desde = pila.findLastIndex((nodo) => nodo.etiqueta === etiqueta)
      if (desde !== -1) {
        for (const nodo of pila.splice(desde)) if (nodo.apaga) bajoAparece--
      }
      continue
    }

    // El ancestro se mira ANTES de apilar el elemento: nadie es ancestro de sí mismo.
    if (etiqueta === 'h1') {
      h1++
      if (bajoAparece > 0) infracciones.push(['<h1>', entera, [...pila]])
    } else if (etiqueta === 'img') {
      imagenes++
      if (!atributoEs(atributos, 'loading', 'lazy')) {
        noPerezosas++
        if (bajoAparece > 0) infracciones.push(['<img> no perezosa', entera, [...pila]])
      }
    }

    const seCierraSola = /\/\s*$/.test(atributos)
    if (VACIOS.has(etiqueta) || seCierraSola) continue

    if (CRUDOS.has(etiqueta)) {
      // Texto en crudo: se salta hasta su cierre sin leer nada de dentro.
      const fin = html.toLowerCase().indexOf(`</${etiqueta}`, ETIQUETA.lastIndex)
      ETIQUETA.lastIndex = fin === -1 ? html.length : fin
      continue
    }

    const clase = claseDe(atributos)
    const nodo = { etiqueta, apaga: apaga(clase), clase }
    if (nodo.apaga) bajoAparece++
    pila.push(nodo)
  }

  return { infracciones, h1, imagenes, noPerezosas }
}

/** Recorta una etiqueta larga para que el informe siga siendo legible. */
const corta = (texto, largo = 90) =>
  texto.length > largo ? `${texto.slice(0, largo)}…` : texto

const archivos = existsSync(APP) ? htmlsDe(APP).sort() : []
if (archivos.length === 0) {
  console.error('✗ No hay HTML en .next/server/app. Ejecuta `npm run build` antes.')
  process.exit(1)
}

const infractoras = [] // [ruta, infracciones]
let totalH1 = 0
let totalImagenes = 0
let totalNoPerezosas = 0
let rutasConH1 = 0
let rutasConImagen = 0

for (const archivo of archivos) {
  const { infracciones, h1, imagenes, noPerezosas } = recorrer(readFileSync(archivo, 'utf8'))
  totalH1 += h1
  totalImagenes += imagenes
  totalNoPerezosas += noPerezosas
  if (infracciones.length > 0) {
    infractoras.push([rutaDe(archivo), infracciones])
    if (infracciones.some(([regla]) => regla === '<h1>')) rutasConH1++
    if (infracciones.some(([regla]) => regla !== '<h1>')) rutasConImagen++
  }
}

/** Una línea de diagnóstico, no un umbral: prueba que el recorrido es sano. */
const recorrido =
  `  (${totalH1} <h1> y ${totalImagenes} <img> recorridos en ${archivos.length} rutas; ` +
  `no perezosas: ${totalNoPerezosas})`

if (infractoras.length > 0) {
  console.error(
    `\n✗ ${infractoras.length} de ${archivos.length} rutas sirven su LCP dentro de \`.aparece\`,` +
      ' es decir con `opacity: 0` hasta que hidrate React:\n',
  )
  for (const [ruta, infracciones] of infractoras) {
    console.error(`   ${ruta}`)
    for (const [regla, etiqueta, pila] of infracciones) {
      const ancestro = pila.findLast((nodo) => nodo.apaga)
      console.error(`      ${regla} bajo <${ancestro.etiqueta} class="${corta(ancestro.clase, 60)}">`)
      console.error(`         ${corta(etiqueta)}`)
    }
  }
  console.error(
    `\nReparto: ${rutasConH1} rutas por el <h1>, ${rutasConImagen} por una imagen no perezosa.\n` +
      'El elemento que decide el LCP no puede depender de la hidratación: sale invisible,\n' +
      'y la métrica encima sale buena porque se resuelve contra lo primero que sí se ve.\n' +
      'El arreglo es sacar el elemento del envoltorio <Aparece>, no tocar `.aparece`.\n',
  )
  console.error(recorrido)
  process.exit(1)
}

console.log(`✓ ${infractoras.length} de ${archivos.length} rutas sirven el LCP dentro de \`.aparece\`.`)
console.log(recorrido)
