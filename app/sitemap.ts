import type { MetadataRoute } from 'next'
import { sitio } from '@/lib/config'
import { acabados, articulos, proyectos, zonas } from '@/lib/datos'

const rutasEstaticas = [
  '/',
  '/hormigon-impreso/',
  '/hormigon-pulido/',
  '/microcemento/',
  '/hormigon-lavado/',
  '/hormigon-fratasado/',
  '/hormigon-desactivado/',
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
