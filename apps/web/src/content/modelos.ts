import { getModels } from '@site/content'
import type { Imagen, ModeloId } from '@/lib/tipos'

/**
 * legacy adapter, delete when a new design consumes @site/* directly
 *
 * Hero de cada `/acabados/[modelo]/`. Mismo export, misma forma, mismos
 * valores que antes de la migración — construido ahora sobre
 * `@site/content`'s `getModels` (locale 'es') en vez de escrito a mano.
 */
export const IMAGEN_MODELO: Partial<Record<ModeloId, Imagen>> = Object.fromEntries(
  getModels('es')
    .filter((m) => m.heroImage)
    .map((m) => [m.id, { src: m.heroImage!.src, alt: m.heroImage!.alt, tipo: m.heroImage!.kind as Imagen['tipo'] }]),
)
