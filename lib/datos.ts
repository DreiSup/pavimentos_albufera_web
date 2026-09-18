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

/**
 * ⚠️ El valor por defecto es el CATÁLOGO ENTERO, no lo publicado, y es
 * deliberado: la portada cuenta hoy sobre las dieciséis y eso es suyo, no de
 * aquí. Quien cuente lo que se pinta pasa `acabadosPublicados` o, mejor, usa
 * `recuentoAcabadosPublicados()`.
 */
export function contarDocumentados(lista: Acabado[] = acabados): number {
  return lista.filter(estaDocumentado).length
}

/**
 * Un acabado se publica cuando tiene muestra fotográfica. Decisión del dueño del
 * 2026-09-17 (`design/02` §A3): la muestra lleva el código de color impreso al
 * lado, así que exige una foto que enseñe ese modelo **en ese color**; se buscó
 * original para los seis que no la tienen en `public/obras/INVENTARIO.md` y
 * ninguno hizo match. Sin foto, la tarjeta no se pinta.
 *
 * Es un filtro de presentación, **no un borrado**: las dieciséis entradas siguen
 * en `content/acabados.json` y el día que llegue la foto la muestra vuelve sola.
 */
export function estaPublicado(acabado: Acabado): boolean {
  return Boolean(acabado.muestra)
}

/**
 * El catálogo que de verdad se pinta, y el único origen del que debe salir una
 * rejilla de muestras.
 *
 * 🔴 **Por qué vive aquí y no en la pantalla.** La regla se aplicó primero solo
 * en `app/acabados/page.tsx`, y los seis huecos rayados siguieron saliendo en
 * las seis páginas de servicio (seis de las doce tarjetas de `/hormigon-impreso/`
 * a 390 px), en las cuatro landings de `/lp/`, en seis fichas de
 * `/acabados/[modelo]/` y en `/zonas/denia/`. Una pantalla que se acuerda es una
 * pantalla que se olvida: `acabadosPorServicio`, `acabadosPorModelo`,
 * `acabadosPorProyectos` y `tecnicasEnUso` salen todas de esta lista, así que
 * heredan la misma verdad sin decidir nada.
 *
 * `acabados` —las dieciséis— se queda para lo que sí necesita el catálogo
 * entero: las rutas de `/acabados/[modelo]/` y el sitemap.
 */
export const acabadosPublicados = acabados.filter(estaPublicado)

/**
 * El recuento de lo **PUBLICADO**, no del catálogo: `publicados` son los que
 * tienen muestra y se pintan, y `documentados`, los que además tienen obra con
 * municipio confirmado. Hoy 10 y 7, contra 16 y 8 del catálogo entero.
 *
 * Existe para que ninguna pantalla vuelva a escribir `acabados.length` al lado
 * de una rejilla que enseña otra cosa: un contador que no cuadra con lo que hay
 * debajo es el mismo error del bloque de posición, contado con números.
 */
export function recuentoAcabadosPublicados(): { publicados: number; documentados: number } {
  return {
    publicados: acabadosPublicados.length,
    documentados: contarDocumentados(acabadosPublicados),
  }
}

export function acabadosPorServicio(servicio: ServicioId): Acabado[] {
  return acabadosPublicados.filter((a) => a.servicio === servicio)
}

export function acabadosPorModelo(modelo: ModeloId): Acabado[] {
  return acabadosPublicados.filter((a) => a.modelo === modelo)
}

/** Los acabados publicados que se ejecutaron en alguno de esos proyectos. Lo usa
 *  la ficha de zona, que antes filtraba `acabados` por su cuenta y por eso
 *  `/zonas/denia/` pintaba `piedra-inglesa-crema` con el bloque de posición. */
export function acabadosPorProyectos(slugsProyecto: string[]): Acabado[] {
  return acabadosPublicados.filter((a) => a.proyectos.some((s) => slugsProyecto.includes(s)))
}

export function proyectosPorServicio(servicio: ServicioId, excluir?: string): Proyecto[] {
  return proyectos.filter((p) => p.servicio === servicio && p.slug !== excluir)
}

export function proyectosPorModelo(modelo: ModeloId, excluir?: string): Proyecto[] {
  return proyectos.filter((p) => p.modelo === modelo && p.slug !== excluir)
}

/**
 * Las técnicas con acabado publicado: las cinco opciones de la única fila de
 * chips del muestrario. Sale de `acabadosPublicados` y no del catálogo porque
 * una opción de filtro que no puede dar resultados es una promesa incumplida
 * —`desactivado` tiene ficha de servicio pero ni un acabado con muestra—.
 *
 * ⚠️ Y es también el contrato que valida `?tecnica=` en `FiltrosAcabados`: la
 * URL es tan interfaz como el chip, así que las dos puertas leen esta lista.
 *
 * Sin parámetro: aceptaba una lista mientras la regla vivía en la pantalla, y
 * ningún llamador se la pasaba ya. Un parámetro que nadie usa es la puerta por
 * la que vuelve a entrar el catálogo entero.
 */
export function tecnicasEnUso(): ServicioId[] {
  const set = new Set(acabadosPublicados.map((a) => a.servicio))
  return Array.from(set)
}

/**
 * Los modelos que el catálogo nombra, **publicados o no**, y por eso ya no se
 * llama `modelosEnUso`: es la lista de RUTAS de `/acabados/[modelo]/`, no la de
 * muestras que se pintan. `piedra-silleria` y `piedra-rodena` cuelgan solo de
 * variantes sin muestra; sus fichas se quedan —tienen hero propio en
 * `content/modelos.ts`, que solo exige que coincida el molde— y `app/sitemap.ts`
 * las sigue declarando. Filtrarlas aquí las dejaría en 404 declarado en el
 * sitemap, sin que ningún gate del `postbuild` lo viera.
 */
export function modelosDelCatalogo(): ModeloId[] {
  const set = new Set(acabados.map((a) => a.modelo).filter((m): m is ModeloId => Boolean(m)))
  return Array.from(set)
}

export function articuloPorSlug(slug: string): Articulo | undefined {
  return articulos.find((a) => a.slug === slug)
}

export function articuloQueExplica(servicio: ServicioId): Articulo | undefined {
  return articulos.find((a) => a.servicio === servicio)
}
