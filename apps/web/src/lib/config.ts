/**
 * legacy adapter, delete when a new design consumes @site/* directly
 *
 * NAP único del sitio. Mismos nombres, misma forma, mismos valores que antes
 * de la migración — ahora construidos sobre `@site/content` (datos del
 * negocio, locale 'es') y `@site/config` (entorno). El teléfono y la
 * dirección no están confirmados por el cliente (05-pendientes-y-decisiones.md
 * §A1): mientras no lleguen por variable de entorno se muestran entre
 * corchetes con <DatoPendiente>, nunca escritos a mano en una plantilla.
 *
 * Client-reachable (Cabecera, MenuMovil, Consentimiento, EventosGlobales,
 * FormularioPresupuesto…): solo importa `resolveBusiness` de `@site/content`
 * (barrel principal) y `publicEnv`/`site` de `@site/config` (nunca
 * `@site/config/server`). No hay `claims` en este negocio (a diferencia de
 * Pavivasa) así que este archivo sigue siendo un único módulo, sin el
 * split `nap.ts`/`claims.ts` de Pavivasa.
 */
import { publicEnv, site } from '@site/config'
import { resolveBusiness } from '@site/content'

const resolved = resolveBusiness(
  {
    phone: publicEnv.NEXT_PUBLIC_TELEFONO,
    whatsapp: publicEnv.NEXT_PUBLIC_WHATSAPP,
    address: publicEnv.NEXT_PUBLIC_DIRECCION,
  },
  'es',
)

export const nap = {
  nombre: resolved.name,
  email: resolved.email,
  telefono: resolved.phone,
  telefonoMostrado: resolved.displayPhone,
  telefonoHref: resolved.phoneHref,
  whatsapp: resolved.whatsapp,
  whatsappHref: resolved.whatsappHref,
  direccion: resolved.address,
  direccionMostrada: resolved.displayAddress,
  municipio: resolved.town,
  codigoPostal: resolved.postalCode,
  provincia: resolved.province,
  pais: resolved.country,
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
