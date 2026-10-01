/**
 * NAP único del sitio. El teléfono y la dirección no están confirmados por el
 * cliente (05-pendientes-y-decisiones.md §A1): mientras no lleguen por variable
 * de entorno se muestran entre corchetes con <DatoPendiente>, nunca escritos a mano
 * en una plantilla.
 */

const telefonoEnv = process.env.NEXT_PUBLIC_TELEFONO?.trim() || undefined
const whatsappEnv = process.env.NEXT_PUBLIC_WHATSAPP?.trim() || undefined
const direccionEnv = process.env.NEXT_PUBLIC_DIRECCION?.trim() || undefined

/** Solo presentación: 622067884 → 622 067 884. El href tel: sigue usando los dígitos sin espacios. */
function formatearTelefono(valor: string | undefined) {
  if (!valor) return undefined
  const digitos = valor.replace(/\D/g, '').replace(/^34(?=\d{9}$)/, '')
  return digitos.length === 9 ? digitos.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') : valor
}

const telefonoVisible = formatearTelefono(telefonoEnv)

export const nap = {
  nombre: 'Pavimentos Albufera',
  email: 'comercial@pavimentos-albufera.com',
  telefono: telefonoVisible,
  telefonoMostrado: telefonoVisible ?? '96X XXX XXX',
  telefonoHref: telefonoEnv ? `tel:+34${telefonoEnv.replace(/\D/g, '')}` : undefined,
  whatsapp: whatsappEnv,
  whatsappHref: whatsappEnv
    ? `https://wa.me/34${whatsappEnv.replace(/\D/g, '')}?text=${encodeURIComponent(
        'Hola, quiero presupuesto para ',
      )}`
    : undefined,
  direccion: direccionEnv,
  direccionMostrada: direccionEnv ?? 'CALLE Y NÚMERO, Sollana · 46430 · Valencia',
  municipio: 'Sollana',
  codigoPostal: '46430',
  provincia: 'Valencia',
  pais: 'ES',
}

export const sitio = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pavimentos-albufera.com',
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
}
