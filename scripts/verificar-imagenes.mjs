#!/usr/bin/env node
/**
 * Comprueba que TODA foto referenciada desde el contenido existe de verdad en
 * `public/`, y que ninguna se queda sin `alt`.
 *
 * Por qué existe este script, igual que su hermano de las redirecciones:
 * `next build` NO valida el `src` de `next/image` cuando es una cadena. Una
 * ruta mal escrita compila limpia, pasa `tsc`, pasa `lint`, y en producción
 * devuelve un 404 dentro de un hueco vacío que nadie ve hasta que lo ve un
 * cliente. La comprobación es de un segundo y cierra ese agujero.
 *
 * Uso: node scripts/verificar-imagenes.mjs   (se ejecuta solo en `postbuild`)
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const raiz = resolve(import.meta.dirname, '..')

/** Todo `src` que empieza por `/obras/`, `/acabados/`, `/blog/` o `/marca/`. */
const PATRON = /["'](\/(?:obras|acabados|blog|marca)\/[^"'\s]+?\.(?:jpg|jpeg|png|svg|webp|avif))["']/gi

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

const fuentes = [
  ...archivosDe(resolve(raiz, 'content'), ['.ts', '.tsx', '.json']),
  ...archivosDe(resolve(raiz, 'app'), ['.ts', '.tsx']),
  ...archivosDe(resolve(raiz, 'components'), ['.ts', '.tsx']),
]

const referencias = new Map() // src -> [archivos que la nombran]

for (const archivo of fuentes) {
  const texto = readFileSync(archivo, 'utf8')
  for (const [, src] of texto.matchAll(PATRON)) {
    const relativo = archivo.slice(raiz.length + 1)
    referencias.set(src, [...(referencias.get(src) ?? []), relativo])
  }
}

const rotas = []
for (const [src, donde] of referencias) {
  if (!existsSync(resolve(raiz, 'public', src.slice(1)))) rotas.push([src, donde])
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

if (rotas.length > 0 || sinAlt.length > 0) {
  for (const [src, donde] of rotas) {
    console.error(`\n✗ No existe public${src}\n     citada en ${donde.join(', ')}`)
  }
  for (const [src, donde] of sinAlt) {
    console.error(`\n✗ Sin alt: ${src}   (${donde})`)
  }
  console.error('\nUn `src` mal escrito compila limpio y en producción es un hueco vacío.\n')
  process.exit(1)
}

console.log(`✓ ${referencias.size} fotos verificadas contra public/.`)
