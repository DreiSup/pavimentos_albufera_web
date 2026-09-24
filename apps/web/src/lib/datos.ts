/**
 * legacy adapter, delete when a new design consumes @site/* directly
 *
 * Mismos exports, misma forma, mismos valores que antes de la migración —
 * ahora construidos sobre `@site/content` (locale 'es') en vez de los JSON
 * de `content/*.json`. No client-reachable (ninguna de las rutas
 * `'use client'` importa este módulo — confirmado en el inventario), así que
 * puede depender de todo `@site/content` sin riesgo de bundle.
 *
 * ⚠️ **`_pendiente`/`_nota` (metadatos editoriales) NO viajan aquí.** El
 * `as unknown as Proyecto[]` de antes de la migración los dejaba colgando del
 * objeto en tiempo de ejecución (el tipo `Proyecto` nunca los declaró, pero
 * el valor SÍ los llevaba, por ser un cast sobre el JSON crudo). El paquete
 * `@site/content` los preserva como datos tipados en `data/*.ts` (D5) pero
 * deliberadamente NO los expone en su API pública — `content:validate`
 * (check #13) impide que se cuelen en el esquema público precisamente para
 * que ningún adaptador los reintroduzca por accidente. Ninguna pantalla los
 * lee nunca (son metadatos de redacción, no contenido), así que esta es una
 * diferencia de forma sin efecto en la salida — documentada en las
 * "questions" del informe de esta fase, no decidida en silencio aquí.
 */
import {
  getArticles,
  getFinishes,
  getProjects,
  getServiceAreas,
  type ResolvedArticle,
  type ResolvedFinish,
  type ResolvedProject,
  type ResolvedServiceArea,
} from '@site/content'
import type { Acabado, Articulo, ModeloId, Proyecto, ServicioId, TipoImagen, Zona } from './tipos'

function aProyecto(p: ResolvedProject): Proyecto {
  return {
    slug: p.slug,
    titulo: p.title,
    municipio: p.town ?? null,
    provincia: p.province ? (p.province as Proyecto['provincia']) : null,
    servicio: p.service as ServicioId,
    ...(p.model !== undefined ? { modelo: p.model as ModeloId } : {}),
    // `color` es SIEMPRE una clave presente en el origen (`null` cuando no se
    // confirma, nunca omitida) — a diferencia de `modelo`, que sí se omite.
    // `xabia-pulido` es el único proyecto sin color confirmado; el tipo
    // heredado de `Proyecto.color` no declara `| null` (tampoco lo hacía
    // antes de esta migración, con el mismo dato en tiempo de ejecución) así
    // que se conserva el mismo cast permisivo que el `as unknown as` de antes.
    color: (p.color ?? null) as Proyecto['color'],
    superficie: p.surfaceArea ?? null,
    anio: p.year ?? null,
    plazoDias: p.executionDays ?? null,
    encargo: p.brief ?? null,
    ejecucion: p.execution ?? null,
    imagenes: p.images.map((img) => ({ src: img.src, alt: img.alt, tipo: img.kind as TipoImagen })),
    destacado: p.featured,
    ...(p.executionSpecs
      ? {
          fichaTecnica: {
            ...(p.executionSpecs.concrete !== undefined ? { hormigon: p.executionSpecs.concrete } : {}),
            ...(p.executionSpecs.thickness !== undefined ? { espesor: p.executionSpecs.thickness } : {}),
            ...(p.executionSpecs.aggregate !== undefined ? { arido: p.executionSpecs.aggregate } : {}),
            ...(p.executionSpecs.mesh !== undefined ? { mallazo: p.executionSpecs.mesh } : {}),
            ...(p.executionSpecs.fiber !== undefined ? { fibra: p.executionSpecs.fiber } : {}),
            ...(p.executionSpecs.color !== undefined ? { color: p.executionSpecs.color } : {}),
            ...(p.executionSpecs.finishes !== undefined ? { acabados: p.executionSpecs.finishes } : {}),
          },
        }
      : {}),
  }
}

function aAcabado(f: ResolvedFinish): Acabado {
  return {
    slug: f.slug,
    nombre: f.name,
    ...(f.model !== undefined ? { modelo: f.model as ModeloId } : {}),
    color: f.color as Acabado['color'],
    codigo: f.code,
    servicio: f.service as ServicioId,
    ...(f.sample ? { muestra: { src: f.sample.src, alt: f.sample.alt, tipo: f.sample.kind as TipoImagen } } : {}),
    proyectos: f.projects,
  }
}

function aZona(z: ResolvedServiceArea): Zona {
  return {
    slug: z.slug,
    municipio: z.town,
    provincia: z.province as Zona['provincia'],
    // Leído por clave partida en dos trozos, nunca escrita entera: Tailwind
    // escanea como texto plano todo archivo bajo `src/lib` en busca de
    // nombres de clase candidatos, y el nombre de este campo (en inglés, sin
    // acentos) coincide con el de una utilidad real de sombra de foco. Ni
    // este comentario ni el código de abajo pueden deletrearla entera, o
    // el build vuelve a generar una regla que la referencia no tiene.
    anillo: (z as unknown as Record<string, 1 | 2 | 3>)['ri' + 'ng'],
    proyectos: z.projects,
    servicios: z.services as ServicioId[],
  }
}

function aArticulo(a: ResolvedArticle): Articulo {
  return {
    slug: a.slug,
    titulo: a.title,
    entradilla: a.excerpt ?? null,
    fecha: a.date ?? null,
    servicio: a.service as ServicioId,
    // El paquete no modela un `body` de texto plano hoy — las 3 entradas
    // están íntegramente sin escribir (D5 / `data/articles.ts`), igual que
    // antes de la migración (`cuerpo` era siempre `null` en `articulos.json`).
    cuerpo: null,
    ...(a.openingImage
      ? { imagenApertura: { src: a.openingImage.src, alt: a.openingImage.alt, tipo: a.openingImage.kind as TipoImagen } }
      : {}),
  }
}

export const proyectos = getProjects('es').map(aProyecto)
export const acabados = getFinishes('es').map(aAcabado)
export const articulos = getArticles('es').map(aArticulo)
export const zonas = getServiceAreas('es').map(aZona)

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
 * en el catálogo (`@site/content`) y el día que llegue la foto la muestra vuelve
 * sola.
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
 * otras nueve rutas. Reparto medido sobre el HTML prerenderizado, 19 bloques:
 * seis en `/hormigon-impreso/` —seis de sus doce tarjetas—, seis en
 * `/lp/hormigon-impreso/`, uno en cada una de las seis fichas de modelo y uno en
 * `/zonas/denia/`. **Una sola página de servicio y una sola landing, no las seis
 * y las cuatro**: los seis acabados sin muestra son todos de impreso, así que
 * ninguna otra técnica los pedía.
 *
 * Una pantalla que se acuerda es una pantalla que se olvida: `acabadosPorServicio`,
 * `acabadosPorModelo`, `acabadosPorProyectos` y `tecnicasEnUso` salen todas de
 * esta lista, así que heredan la misma verdad sin decidir nada.
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

/**
 * Los parámetros de `/acabados/[modelo]/`: un valor por molde y, para las
 * técnicas sin molde, el slug del propio acabado.
 *
 * 🔴 **Origen único, y por eso existe.** `generateStaticParams` y `app/sitemap.ts`
 * escribían cada uno estas dos reglas por su cuenta. Coincidían por duplicación,
 * no por construcción, y **ningún gate del `postbuild` contrasta el sitemap
 * contra las rutas generadas**: el día que una de las dos copias cambiara, el
 * sitemap declararía un 404 y no lo vería nadie.
 */
export function rutasDeAcabado(): string[] {
  return [...modelosDelCatalogo(), ...acabados.filter((a) => !a.modelo).map((a) => a.slug)]
}

export function articuloPorSlug(slug: string): Articulo | undefined {
  return articulos.find((a) => a.slug === slug)
}

export function articuloQueExplica(servicio: ServicioId): Articulo | undefined {
  return articulos.find((a) => a.servicio === servicio)
}
