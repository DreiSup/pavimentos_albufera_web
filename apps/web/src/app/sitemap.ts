import type { MetadataRoute } from 'next'
import { buildSitemapEntries } from '@site/seo'
import { sitio } from '@/lib/config'
import { articulos, proyectos, rutasDeAcabado, zonas } from '@/lib/datos'
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
  '/empresa/',
  '/presupuesto/',
  '/blog/',
  '/aviso-legal/',
  '/politica-de-privacidad/',
  '/politica-de-cookies/',
]

export default function sitemap(): MetadataRoute.Sitemap {
  // ⚠️ `rutasDeAcabado()`, no las dos reglas otra vez. Aquí se recalculaban —los
  // acabados con molde por modelo, los de las técnicas sin molde por su slug— y
  // coincidían con `generateStaticParams` por duplicación, no por construcción.
  // Ningún gate del `postbuild` contrasta este archivo contra las rutas que el
  // build genera, así que una copia desfasada sería un 404 declarado en el
  // sitemap sin nadie mirando. → `lib/datos.ts`
  return buildSitemapEntries({
    siteUrl: sitio.url,
    staticRoutes: rutasEstaticas,
    finishRoutes: rutasDeAcabado(),
    projectSlugs: proyectos.map((p) => p.slug),
    zoneSlugs: zonas.map((z) => z.slug),
    articleSlugs: articulos.map((a) => a.slug),
  })
}
