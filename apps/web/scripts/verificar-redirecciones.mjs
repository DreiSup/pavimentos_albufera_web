#!/usr/bin/env node
/**
 * Comprueba que TODA redirección declarada en `next.config.ts` aterriza en una
 * ruta que existe de verdad.
 *
 * Por qué existe este script: `next build` NO valida los destinos de
 * `redirects()`. Se puede tener un build limpio, sin un warning, y treinta y
 * tres redirecciones de las cuales diez devuelven 404 — que es exactamente lo
 * que tenía este repo. `04-desarrollo-y-deploy.md` §3 ya pedía comprobarlas
 * "una a una tras el despliegue"; a mano eso no se hace nunca.
 *
 * Se contrasta contra las rutas CONCRETAS que el build ha generado, no contra
 * los patrones dinámicos. Es la diferencia entre saber que `/zonas/[municipio]`
 * existe y saber que `/zonas/alicante` existe — que no existe.
 *
 * Uso: node scripts/verificar-redirecciones.mjs   (se ejecuta solo en `postbuild`)
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const raiz = resolve(import.meta.dirname, '..')

function leerJson(ruta) {
  try {
    return JSON.parse(readFileSync(resolve(raiz, ruta), 'utf8'))
  } catch {
    console.error(`✗ No se encuentra ${ruta}. Ejecuta \`npm run build\` antes.`)
    process.exit(1)
  }
}

const rutas = leerJson('.next/routes-manifest.json')
const prerender = leerJson('.next/prerender-manifest.json')

/** Sin barra final, salvo la raíz. Las dos fuentes usan convenciones distintas. */
const normalizar = (r) => (r.length > 1 && r.endsWith('/') ? r.slice(0, -1) : r)

const existentes = new Set([
  ...Object.keys(prerender.routes ?? {}).map(normalizar),
  ...(rutas.staticRoutes ?? []).map((r) => normalizar(r.page)),
])

const rotas = []
const omitidas = []

for (const redir of rutas.redirects ?? []) {
  // Las que añade Next por su cuenta (normalización de barra final, etc.).
  if (redir.internal) continue

  const destino = redir.destination

  if (/^https?:\/\//.test(destino)) {
    omitidas.push([redir.source, destino, 'externa'])
    continue
  }
  if (destino.includes(':')) {
    omitidas.push([redir.source, destino, 'con parámetro, no comprobable aquí'])
    continue
  }

  if (!existentes.has(normalizar(destino))) {
    rotas.push([redir.source, destino])
  }
}

const total = (rutas.redirects ?? []).filter((r) => !r.internal).length

if (rotas.length > 0) {
  console.error(`\n✗ ${rotas.length} de ${total} redirecciones apuntan a rutas que NO existen:\n`)
  for (const [origen, destino] of rotas) {
    console.error(`   ${origen}\n      → ${destino}   ⟵ 404\n`)
  }
  console.error('Arregla el destino o construye la ruta. Un 301 a un 404 tira el SEO que venías a conservar.\n')
  process.exit(1)
}

console.log(`✓ ${total - omitidas.length} redirecciones verificadas contra ${existentes.size} rutas construidas.`)
if (omitidas.length > 0) {
  console.log(`  (${omitidas.length} no comprobables: ${omitidas.map(([, d, m]) => `${d} — ${m}`).join('; ')})`)
}
