import acabadosJson from '@/content/acabados.json'
import articulosJson from '@/content/articulos.json'
import proyectosJson from '@/content/proyectos.json'
import zonasJson from '@/content/zonas.json'
import type { Acabado, Articulo, ModeloId, Proyecto, ServicioId, Zona } from './tipos'

export const proyectos = proyectosJson as unknown as Proyecto[]
export const acabados = acabadosJson as unknown as Acabado[]
export const articulos = articulosJson as unknown as Articulo[]
// El último elemento de zonas.json es metadatos de municipios sin documentar, no una Zona.
export const zonas = (zonasJson as unknown as Record<string, unknown>[]).filter(
  (z): z is Zona => typeof z.slug === 'string' && typeof z.municipio === 'string',
)

export function proyectoPorSlug(slug: string): Proyecto | undefined {
  return proyectos.find((p) => p.slug === slug)
}

export function acabadoPorSlug(slug: string): Acabado | undefined {
  return acabados.find((a) => a.slug === slug)
}

export function zonaPorSlug(slug: string): Zona | undefined {
  return zonas.find((z) => z.slug === slug)
}

export function proyectosDe(slugs: string[]): Proyecto[] {
  return slugs.map((s) => proyectoPorSlug(s)).filter((p): p is Proyecto => Boolean(p))
}

/**
 * Un acabado tiene obra documentada cuando está asociado a un proyecto cuyo
 * municipio está confirmado. Normativo: 03-modelo-de-contenido.md §1.1.
 * No usar `acabado.proyectos.length > 0`: eso cuenta proyectos con municipio
 * sin confirmar, que el propio diseño declara pendiente.
 */
export function estaDocumentado(acabado: Acabado): boolean {
  return acabado.proyectos.some((slug) => Boolean(proyectoPorSlug(slug)?.municipio))
}

export function contarDocumentados(lista: Acabado[] = acabados): number {
  return lista.filter(estaDocumentado).length
}

export function acabadosPorServicio(servicio: ServicioId): Acabado[] {
  return acabados.filter((a) => a.servicio === servicio)
}

export function acabadosPorModelo(modelo: ModeloId): Acabado[] {
  return acabados.filter((a) => a.modelo === modelo)
}

export function proyectosPorServicio(servicio: ServicioId, excluir?: string): Proyecto[] {
  return proyectos.filter((p) => p.servicio === servicio && p.slug !== excluir)
}

export function proyectosPorModelo(modelo: ModeloId, excluir?: string): Proyecto[] {
  return proyectos.filter((p) => p.modelo === modelo && p.slug !== excluir)
}

/**
 * Las técnicas presentes en una lista de acabados. Acepta la lista, como
 * `contarDocumentados`, porque el muestrario solo publica los acabados con
 * muestra y sus chips tienen que salir de lo que de verdad se pinta: una opción
 * de filtro que no puede dar resultados es una promesa incumplida.
 */
export function tecnicasEnUso(lista: Acabado[] = acabados): ServicioId[] {
  const set = new Set(lista.map((a) => a.servicio))
  return Array.from(set)
}

export function modelosEnUso(): ModeloId[] {
  const set = new Set(acabados.map((a) => a.modelo).filter((m): m is ModeloId => Boolean(m)))
  return Array.from(set)
}

export function articuloPorSlug(slug: string): Articulo | undefined {
  return articulos.find((a) => a.slug === slug)
}

export function articuloQueExplica(servicio: ServicioId): Articulo | undefined {
  return articulos.find((a) => a.servicio === servicio)
}
