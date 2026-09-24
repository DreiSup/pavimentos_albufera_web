/**
 * legacy adapter, delete when a new design consumes @site/* directly
 *
 * NAP único del sitio. Mismos nombres, misma forma, mismos valores que antes
 * de la migración — ahora leídos de `@site/content`'s `business` (datos
 * puros del negocio) y `@site/config` (entorno). El teléfono y la dirección
 * no están confirmados por el cliente (05-pendientes-y-decisiones.md §A1):
 * mientras no lleguen por variable de entorno se muestran entre corchetes
 * con <DatoPendiente>, nunca escritos a mano en una plantilla.
 *
 * Client-reachable (Cabecera, MenuMovil, Consentimiento, EventosGlobales,
 * FormularioPresupuesto…): por eso NO importa `resolveBusiness` de
 * `@site/content` (el barrel principal, con `queries/`, `pickLocalized`…) —
 * eso arrastra un resolver genérico al bundle de cliente por un puñado de
 * `tel:`/`wa.me` (D17 final del runbook de migración: ~+320 B de más en
 * cada una de las 52 rutas, medido). Importa solo la hoja de datos
 * `@site/content/business-data` (un único objeto literal, sin zod, sin
 * `queries/`) y reimplementa aquí mismo la derivación tal cual la tenía
 * `lib/config.ts` antes de la migración — este sitio es solo `es`
 * (`publishedLocales`), así que lee `.es` directamente en vez de
 * `pickLocalized()`. Por la misma regla (D17 final: este archivo también
 * está nombrado explícitamente como adaptador client-reachable, "no
 * barrels"), `publicEnv`/`site` se importan por subpath
 * (`@site/config/env`, `@site/config/site`), nunca del barrel principal
 * `@site/config` ni de `@site/config/server` — ya eran datos puros y no
 * cambian de valor, solo de ruta de importación. No hay `claims` en este
 * negocio (a diferencia de Pavivasa) así que este archivo sigue siendo un
 * único módulo, sin el split `nap.ts`/`claims.ts` de Pavivasa.
 */
import { publicEnv } from '@site/config/env'
import { site } from '@site/config/site'
import { business } from '@site/content/business-data'

const telefono = publicEnv.NEXT_PUBLIC_TELEFONO
const whatsapp = publicEnv.NEXT_PUBLIC_WHATSAPP
const direccion = publicEnv.NEXT_PUBLIC_DIRECCION

export const nap = {
  nombre: business.name,
  email: business.email,
  telefono,
  telefonoMostrado: telefono ?? business.phonePlaceholder.es,
  telefonoHref: telefono ? `tel:+34${telefono.replace(/\D/g, '')}` : undefined,
  whatsapp,
  whatsappHref: whatsapp
    ? `https://wa.me/34${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(business.whatsappMessage.es)}`
    : undefined,
  direccion,
  direccionMostrada: direccion ?? business.addressPlaceholder.es,
  municipio: business.town,
  codigoPostal: business.postalCode,
  provincia: business.province,
  pais: business.country,
}

/**
 * Un enlace es de WhatsApp, o no lo es. Predicado único del sitio.
 *
 * Lo comparten los dos sitios que tienen que reconocer ese enlace sin que nadie
 * se lo diga: `EventosGlobales`, que delega el clic en `document` y decide si
 * eso es un `whatsapp_click`, y `Boton`, que decide si eso se pinta en verde de
 * WhatsApp con su icono. Antes solo existía en el primero, escrito a mano.
 *
 * Que sea el mismo predicado es lo que sostiene la regla: **el botón se ve de
 * WhatsApp exactamente cuando se mide como WhatsApp.** Ni un CTA verde que no
 * cuenta, ni un clic contado que no se anunciaba como tal.
 *
 * Deliberadamente laxo —`includes`, no `startsWith`— para seguir cubriendo
 * `api.whatsapp.com` y cualquier `wa.me` con parámetros delante.
 */
export function esEnlaceWhatsApp(href: string | undefined): boolean {
  return Boolean(href && href.includes('wa.me'))
}

/**
 * Identificadores de etiqueta. Se exponen tal cual vienen del entorno: una
 * variable declarada pero en blanco tiene que llegar en blanco a quien la
 * consume, o el modo no-op se rompe con una cadena vacía.
 *
 * El de Google Ads va partido en dos a propósito, y conviene no juntarlos al
 * rellenarlos: `adsId` es el `AW-…` a secas, que es lo que carga gtag.js y lo
 * que se configura por sí solo; `adsEtiquetaLlamada` es solo la etiqueta de
 * conversión, sin el `AW-` delante, porque quien la usa arma `AW-ID/ETIQUETA`.
 */
export const sitio = {
  url: site.url,
  gaId: publicEnv.NEXT_PUBLIC_GA_ID,
  adsId: publicEnv.NEXT_PUBLIC_ADS_ID,
  adsEtiquetaLlamada: publicEnv.NEXT_PUBLIC_ADS_ETIQUETA_LLAMADA,
  metaPixelId: publicEnv.NEXT_PUBLIC_META_PIXEL_ID,
}
