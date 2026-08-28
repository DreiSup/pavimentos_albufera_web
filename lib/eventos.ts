/**
 * Contrato de eventos de medición. Fuente única: si un nombre o un parámetro no
 * está aquí, no se manda.
 *
 * Convención, sin excepciones: nombre de evento y nombre de parámetro en inglés
 * `snake_case`; el CONTENIDO de los parámetros en español. Es lo que permite
 * reutilizar el mismo panel de GA4 entre clientes — esta web es la primera
 * plantilla del generador, no un encargo suelto.
 *
 * ⚠️ Cada parámetro de esta lista tiene que estar registrado como DIMENSIÓN
 * PERSONALIZADA en GA4 antes de mandar el primer tráfico. GA4 no rellena
 * dimensiones hacia atrás: lo que llegue antes de registrarlas se pierde.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

/** Zona de la página desde la que se pulsa un CTA. Va en `data-ubicacion`. */
export const UBICACIONES = [
  'header',
  'hero',
  'sticky_mobile',
  'mobile_menu',
  'footer',
  'home_close',
  'service_close',
  'quote_page',
  'quote_aside',
  'quote_below_form',
  'section_mid',
  'faq_end',
  'project_detail',
  'samples',
  'pricing',
  /** El enlace no llevaba `data-ubicacion`. Si aparece en los informes, falta marcar un CTA. */
  'unmarked',
] as const

export type Ubicacion = (typeof UBICACIONES)[number]

export const EVENTOS = {
  phoneClick: 'phone_click',
  whatsappClick: 'whatsapp_click',
  emailClick: 'email_click',
  formSubmit: 'form_submit',
  calculatorUse: 'calculator_use',
  samplesFilter: 'samples_filter',
  scrollDepth: 'scroll_depth',
  faqOpen: 'faq_open',
} as const

export type NombreEvento = (typeof EVENTOS)[keyof typeof EVENTOS]

/**
 * Temas de las preguntas del acordeón. Sirve para leer el ranking de objeciones
 * reales: cada apertura es una objeción declarada sin coste.
 */
export const TEMAS_FAQ = [
  'precio',
  'plazo',
  'garantia',
  'mantenimiento',
  'terreno',
  'juntas',
  'zona',
  'proceso',
  'sector',
] as const

export type TemaFAQ = (typeof TEMAS_FAQ)[number]

type OpcionesEvento = {
  params?: Record<string, unknown>
  /** Nombre de evento estándar de Meta (Lead, Contact...). Sin esto, se manda como trackCustom. */
  metaEstandar?: string
  /** Para deduplicar con Meta CAPI en el mismo evento (event_id compartido). */
  metaEventId?: string
}

/**
 * Escritorio vs. móvil. No es cosmético: un clic en `tel:` desde escritorio rara
 * vez produce una llamada, así que contarlo como conversión en Google Ads deja
 * el CPA artificialmente bajo. Se segmenta siempre por este parámetro.
 */
export function tipoDispositivo(): 'mobile' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  return window.matchMedia('(pointer: coarse)').matches ? 'mobile' : 'desktop'
}

/** Los parámetros que lleva todo evento. Se fusionan con los propios de cada uno. */
function paramsComunes() {
  if (typeof window === 'undefined') return {}
  return {
    page_path: window.location.pathname,
    device_type: tipoDispositivo(),
  }
}

/** Dispara a GA4 y Meta Pixel a la vez. No-op seguro si el script no cargó (sin consentimiento o sin ID). */
export function registrarEvento(nombre: NombreEvento, opciones?: OpcionesEvento) {
  if (typeof window === 'undefined') return

  const params = { ...paramsComunes(), ...opciones?.params }

  window.gtag?.('event', nombre, params)

  const evento = opciones?.metaEstandar ?? nombre
  const metodo = opciones?.metaEstandar ? 'track' : 'trackCustom'
  if (opciones?.metaEventId) {
    window.fbq?.(metodo, evento, params, { eventID: opciones.metaEventId })
  } else {
    window.fbq?.(metodo, evento, params)
  }
}
