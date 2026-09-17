import type { MetadataRoute } from 'next'
import { sitio } from '@/lib/config'
import { acabados, articulos, proyectos, zonas } from '@/lib/datos'
import { SERVICIOS } from '@/content/servicios'

// Las seis rutas de servicio salen del propio catálogo: añadir un servicio no
// puede dejarlo fuera del sitemap por olvido.
const rutasServicio = Object.values(SERVICIOS).map((s) => s.ruta)

// ⚠️ Las cuatro landings de `/lp/<slug>/` NO entran aquí, y su ausencia es la
// decisión, no un olvido: son páginas de campaña con `robots: index:false`, y
// un sitemap que declara lo que se pide no indexar se contradice a sí mismo.
// `content/landings.ts` las deriva del mismo catálogo que estas seis rutas, así
// que la tentación de mapearlas también aquí va a volver: no se hace.

const rutasEstaticas = [
  '/',
  ...rutasServicio,
  '/acabados/',
  '/proyectos/',
  '/precios/',
  '/empresa/',
  '/presupuesto/',
  '/blog/',
  '/aviso-legal/',
  '/politica-de-privacidad/',
  '/politica-de-cookies/',
]

export default function sitemap(): MetadataRoute.Sitemap {
  // Las mismas dos formas que genera `app/acabados/[modelo]/page.tsx`: los
  // acabados con molde por modelo, y los de las técnicas sin molde por su slug.
  const modelos = Array.from(new Set(acabados.map((a) => a.modelo).filter(Boolean)))
  const sinModelo = acabados.filter((a) => !a.modelo).map((a) => a.slug)

  return [
    ...rutasEstaticas.map((ruta) => ({ url: `${sitio.url}${ruta}` })),
    ...modelos.map((m) => ({ url: `${sitio.url}/acabados/${m}/` })),
    ...sinModelo.map((s) => ({ url: `${sitio.url}/acabados/${s}/` })),
    ...proyectos.map((p) => ({ url: `${sitio.url}/proyectos/${p.slug}/` })),
    ...zonas.map((z) => ({ url: `${sitio.url}/zonas/${z.slug}/` })),
    ...articulos.map((a) => ({ url: `${sitio.url}/blog/${a.slug}/` })),
  ]
}
