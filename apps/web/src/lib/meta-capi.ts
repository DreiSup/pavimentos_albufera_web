/**
 * legacy adapter, delete when a new design consumes @site/* directly
 *
 * Envío a Meta Conversions API. El cuerpo real vive ahora en
 * `@site/tracking/server` (`hash`, `normalize`, `sendMetaConversionEvent`)
 * — mismos hashes, misma normalización campo a campo, mismo orden de
 * claves en `user_data`. Este archivo sigue siendo server-only (nunca lo
 * importa un componente `'use client'`: solo `app/presupuesto/actions.ts`)
 * y sigue exportando exactamente `hash`, `normalizar`, `EventoCAPI` y
 * `enviarEventoCAPI`, con los mismos nombres de campo en español que antes
 * de la migración.
 *
 * `country: hash('es')` se queda aquí, no en el paquete: es lógica de este
 * negocio (toda su clientela es española, ninguna pantalla pregunta el
 * país), no algo que Pavivasa deba heredar implícitamente.
 */
import { hash, normalize, sendMetaConversionEvent } from '@site/tracking/server'
import { publicEnv } from '@site/config/env'

export { hash }

/**
 * Normalización campo a campo. No hay una regla común: lo que vale para el
 * municipio destruye el apellido, y por eso un `hash()` que normalizara solo
 * podía servir a uno de los dos.
 *
 * Se exporta junto a `hash()` y no por separado: hashear con esta función sin
 * normalizar antes es exactamente el fallo que traía el teléfono. Quien las
 * necesite, se lleva las dos.
 */
export const normalizar = normalize

export type EventoCAPI = {
  /**
   * Nombre estándar de Meta. `Lead` es el formulario; `Contact`, el clic en
   * teléfono o en WhatsApp. Estaba escrito a fuego, y por eso los dos canales
   * que dan dinero no tenían ninguna forma de llegar a la CAPI.
   *
   * Es opcional, con `Lead` por defecto, solo porque el único sitio de llamada
   * vivo —`app/presupuesto/actions.ts`— todavía no lo pasa.
   */
  nombreEvento?: 'Lead' | 'Contact'
  eventoId: string
  /**
   * Opcional: en un clic en `tel:` no conocemos el teléfono del visitante, solo
   * el nuestro. Se compensa con `external_id`, IP, user-agent, `_fbp` y `_fbc`.
   */
  telefono?: string
  email?: string
  nombrePila?: string
  apellidos?: string
  municipio?: string
  provincia?: string
  /** El `pa_ref` de 6 caracteres: lo que une el lead de formulario con el de WhatsApp. */
  referencia?: string
  ip: string
  userAgent: string
  /** Página real del clic. `action_source: 'website'` la exige. */
  url: string
  fbp?: string
  fbc?: string
  /** `click_location`, `device_type`… Viaja tal cual a `custom_data`. */
  datosPersonalizados?: Record<string, unknown>
}

/**
 * Manda un evento a Meta Conversions API, deduplicado con el Pixel del
 * navegador vía el mismo `event_id`. No hace nada si faltan las credenciales
 * — mismo patrón que el resto de integraciones: sin variable, sin error.
 */
export async function enviarEventoCAPI(evento: EventoCAPI) {
  await sendMetaConversionEvent({
    eventName: evento.nombreEvento,
    eventId: evento.eventoId,
    phone: evento.telefono,
    email: evento.email,
    firstName: evento.nombrePila,
    lastName: evento.apellidos,
    town: evento.municipio,
    province: evento.provincia,
    referenceCode: evento.referencia,
    // La clientela de este negocio es española y ninguna pantalla pregunta el
    // país. Es un identificador más para el emparejamiento, gratis.
    countryHash: hash('es'),
    ip: evento.ip,
    userAgent: evento.userAgent,
    url: evento.url,
    fbp: evento.fbp,
    fbc: evento.fbc,
    customData: evento.datosPersonalizados,
    pixelId: publicEnv.NEXT_PUBLIC_META_PIXEL_ID,
  })
}
