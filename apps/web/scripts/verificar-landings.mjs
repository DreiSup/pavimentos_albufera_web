#!/usr/bin/env node
/**
 * Impide que un despliegue de producción salga con el teléfono y el WhatsApp de
 * reserva, es decir, sin ningún camino de contacto real.
 *
 * Por qué existe. `lib/config.ts` deriva `nap.telefonoMostrado` de
 * `NEXT_PUBLIC_TELEFONO` y, si la variable está vacía, cae en la reserva
 * `96X XXX XXX`. Ese valor es intencionadamente falso —CLAUDE.md lo pinta entre
 * corchetes con `<DatoPendiente>` para que se vea que no existe—, pero
 * `next build` compila igual de limpio con la variable puesta que sin ella:
 * los cuatro verificadores del `postbuild` pasan en verde y nada impide
 * publicar una campaña de pago cuyo botón de llamar no llama a ninguna parte.
 * Hasta ahora lo único que lo separaba de producción era un comentario dentro
 * de `components/secciones/PaginaServicio.tsx` pidiendo que no se desplegara.
 *
 * Qué comprueba, y con qué severidad:
 *
 *   producción   (`VERCEL_ENV=production`)  → EXIT 1. El build se cae.
 *   cualquier otro entorno                  → aviso en consola, EXIT 0.
 *
 * La asimetría es deliberada. En local y en `preview` construir sin
 * `.env.local` es el modo de trabajo normal de este repo —CLAUDE.md lo
 * documenta— y romper ahí el build haría imposible desarrollar. En producción
 * no hay ningún caso legítimo: si el número no está, la campaña no se lanza.
 *
 * Se mira el HTML generado y no `process.env`, porque lo que importa no es qué
 * variable había, sino qué cadena acabó impresa en la página que ve el
 * visitante. Se recorre `.next/server/app` entero con `find`, no el glob
 * `*.html`, que solo alcanza 17 de los 49 archivos.
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const APP = resolve(import.meta.dirname, '..', '.next/server/app')
// Las mismas reservas que declara `lib/config.ts`. Si allí cambian, aquí también.
const RESERVAS = ['96X XXX XXX']

if (!existsSync(APP)) {
  console.error(`✗ No existe ${APP}. Este script corre en el postbuild, tras next build.`)
  process.exit(1)
}

const htmls = []
;(function recorre(dir) {
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada)
    if (statSync(ruta).isDirectory()) recorre(ruta)
    else if (entrada.endsWith('.html')) htmls.push(ruta)
  }
})(APP)

const infractoras = []
for (const archivo of htmls) {
  const html = readFileSync(archivo, 'utf8')
  const encontradas = RESERVAS.filter((reserva) => html.includes(reserva))
  if (encontradas.length > 0) infractoras.push({ archivo, encontradas })
}

const enProduccion = process.env.VERCEL_ENV === 'production'

if (infractoras.length === 0) {
  console.log(`✓ Ninguna de las ${htmls.length} rutas sirve un dato de contacto de reserva.`)
  process.exit(0)
}

// Las de campaña primero: son las que cuestan dinero por visita.
const campana = infractoras.filter((i) => i.archivo.includes('/lp/'))
const cabecera = `${infractoras.length} de ${htmls.length} rutas sirven el teléfono de reserva ${RESERVAS.join(', ')}`
const detalle = [
  campana.length > 0
    ? `  ${campana.length} son landings de campaña: ${campana.map((i) => i.archivo).join(', ')}`
    : '  ninguna es landing de campaña',
  '  Causa: NEXT_PUBLIC_TELEFONO vacía o sin declarar en el entorno del build.',
].join('\n')

if (enProduccion) {
  console.error(`✗ ${cabecera}\n${detalle}\n  Un despliegue de producción sin teléfono real no sale.`)
  process.exit(1)
}

console.warn(
  `⚠ ${cabecera}\n${detalle}\n  Aviso, no error: fuera de producción construir sin .env.local es lo normal.\n  En VERCEL_ENV=production esto rompe el build.`,
)
process.exit(0)
