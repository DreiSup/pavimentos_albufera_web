/**
 * legacy adapter, delete when a new design consumes @site/* directly
 *
 * Tipos sin cambios; los tres catálogos de nombre/ruta se construyen ahora
 * sobre `@site/content` (locale 'es') en vez de estar escritos a mano dos
 * veces (aquí y en `content/servicios.tsx`/`content/modelos.ts`). No
 * client-reachable (solo lo importa `components/layout/Pie.tsx`, componente
 * de servidor), así que una llamada de nivel superior al paquete no supone
 * riesgo de bundle.
 *
 * `CODIGO_COLOR` (D24) se construye ahora desde `@site/content`'s
 * `colorCatalog` — mismos valores que el literal que tenía antes de la
 * migración, ya no escritos a mano dos veces (aquí y en
 * `packages/content/src/data/colors.ts`).
 */
import { colorCatalog, getModels, getServiceCatalog } from '@site/content'

export type ServicioId =
  | 'impreso'
  | 'pulido'
  | 'microcemento'
  | 'lavado'
  | 'fratasado'
  | 'desactivado'

export type Provincia = 'Valencia' | 'Castellón' | 'Alicante'

export type ModeloId =
  | 'espiga'
  | 'adoquin-irregular'
  | 'adoquin-pequeno'
  | 'manta'
  | 'silleria-grande'
  | 'piedra-silleria'
  | 'piedra-rodena'
  | 'piedra-inglesa'

export type ColorId = '117' | '113' | '109' | '107' | 'gris' | 'arena' | 'crema'

export type TipoImagen = 'final' | 'proceso' | 'detalle' | 'antes'

export type Imagen = {
  src: string
  alt: string
  tipo: TipoImagen
}

export type FichaTecnicaObra = {
  hormigon?: string
  espesor?: string
  arido?: string
  mallazo?: string
  fibra?: string
  color?: string
  acabados?: string[]
}

export type Proyecto = {
  slug: string
  titulo: string
  municipio: string | null
  provincia: Provincia | null
  servicio: ServicioId
  modelo?: ModeloId
  color?: ColorId
  superficie?: number | null
  anio?: number | null
  plazoDias?: number | null
  encargo?: string | null
  ejecucion?: string | null
  imagenes: Imagen[]
  destacado: boolean
  fichaTecnica?: FichaTecnicaObra
}

export type Acabado = {
  slug: string
  nombre: string
  modelo?: ModeloId
  color: ColorId
  codigo: string
  servicio: ServicioId
  muestra?: Imagen
  proyectos: string[]
}

export type Zona = {
  slug: string
  municipio: string
  provincia: Provincia
  anillo: 1 | 2 | 3
  proyectos: string[]
  servicios: ServicioId[]
}

export type Articulo = {
  slug: string
  titulo: string
  entradilla: string | null
  fecha: string | null
  servicio: ServicioId
  cuerpo: string | null
  imagenApertura?: Imagen
}

const catalogoServicios = getServiceCatalog('es')

export const NOMBRE_SERVICIO: Record<ServicioId, string> = Object.fromEntries(
  catalogoServicios.map((s) => [s.id, s.name]),
) as Record<ServicioId, string>

export const RUTA_SERVICIO: Record<ServicioId, string> = Object.fromEntries(
  catalogoServicios.map((s) => [s.id, s.path]),
) as Record<ServicioId, string>

export const NOMBRE_MODELO: Record<ModeloId, string> = Object.fromEntries(
  getModels('es').map((m) => [m.id, m.name]),
) as Record<ModeloId, string>

export const CODIGO_COLOR: Record<ColorId, string> = Object.fromEntries(
  colorCatalog.map((c) => [c.id, c.code]),
) as Record<ColorId, string>
