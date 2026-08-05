import type { MetadataRoute } from 'next'
import { sitio } from '@/lib/config'
import { acabados, articulos, proyectos, zonas } from '@/lib/datos'

const rutasEstaticas = [
  '/',
  '/hormigon-impreso/',
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
  const modelos = Array.from(new Set(acabados.map((a) => a.modelo).filter(Boolean)))

  return [
    ...rutasEstaticas.map((ruta) => ({ url: `${sitio.url}${ruta}` })),
    ...modelos.map((m) => ({ url: `${sitio.url}/acabados/${m}/` })),
    ...proyectos.map((p) => ({ url: `${sitio.url}/proyectos/${p.slug}/` })),
    ...zonas.map((z) => ({ url: `${sitio.url}/zonas/${z.slug}/` })),
    ...articulos.map((a) => ({ url: `${sitio.url}/blog/${a.slug}/` })),
  ]
}
