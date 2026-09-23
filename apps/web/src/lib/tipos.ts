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

export const NOMBRE_SERVICIO: Record<ServicioId, string> = {
  impreso: 'Hormigón impreso',
  pulido: 'Hormigón pulido',
  microcemento: 'Microcemento',
  lavado: 'Hormigón lavado',
  fratasado: 'Hormigón fratasado',
  desactivado: 'Hormigón desactivado',
}

export const RUTA_SERVICIO: Record<ServicioId, string> = {
  impreso: '/hormigon-impreso/',
  pulido: '/hormigon-pulido/',
  microcemento: '/microcemento/',
  lavado: '/hormigon-lavado/',
  fratasado: '/hormigon-fratasado/',
  desactivado: '/hormigon-desactivado/',
}

export const NOMBRE_MODELO: Record<ModeloId, string> = {
  espiga: 'Espiga',
  'adoquin-irregular': 'Adoquín irregular',
  'adoquin-pequeno': 'Adoquín pequeño',
  manta: 'Manta (imitación roca de montaña)',
  'silleria-grande': 'Sillería grande',
  'piedra-silleria': 'Piedra sillería',
  'piedra-rodena': 'Piedra rodena',
  'piedra-inglesa': 'Piedra inglesa',
}

export const CODIGO_COLOR: Record<ColorId, string> = {
  '117': 'C-117',
  '113': 'C-113',
  '109': 'C-109',
  '107': 'C-107',
  gris: 'GRIS',
  arena: 'ARENA',
  crema: 'CREMA',
}
