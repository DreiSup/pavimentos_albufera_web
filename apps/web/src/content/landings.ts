import { getLandingService, getLandingServiceIds, getLandingSlug } from '@site/content'
import { aServicioDeLanding, type Servicio } from '@/content/servicios'

/**
 * legacy adapter, delete when a new design consumes @site/* directly
 *
 * Landings de campaña de `/lp/<slug>/`. Mismos exports, misma forma, mismos
 * valores que antes de la migración — construidos ahora sobre
 * `@site/content`'s `getLandingService`/`getLandingServiceIds` (locale
 * 'es'), que reproduce exactamente la recomposición que antes hacía
 * `recomponer()` aquí: el mismo `Servicio` del catálogo con
 * `ocultarSecciones: ['seccion-ficha']`, `ctaContacto: true`,
 * `sinAparece: true`. La lista de servicios de campaña
 * (`impreso`/`pulido`/`lavado`/`microcemento`, sin `fratasado` ni
 * `desactivado`) vive ahora en `@site/content`'s `data/campaign-landings.ts`
 * en vez de escrita aquí a mano — mismo valor, misma fuente única.
 *
 * El slug de la landing sigue derivándose de la ruta del servicio
 * (`getLandingSlug`), nunca escrito a mano.
 */
export const LANDINGS: Record<string, Servicio> = Object.fromEntries(
  getLandingServiceIds()
    .map((id) => {
      const landing = getLandingService(id, 'es')
      const slug = getLandingSlug(id, 'es')
      if (!landing || !slug) return undefined
      return [slug, aServicioDeLanding(landing)] as const
    })
    .filter((entry): entry is readonly [string, Servicio] => entry !== undefined),
)

export const slugsLanding = Object.keys(LANDINGS)
