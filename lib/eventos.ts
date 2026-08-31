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
  /**
   * Landings de campaña. En runtime ya funcionaban sin estar aquí —`Boton`
   * propaga los `data-*` y `EventosGlobales` lee el atributo con un `as`
   * inerte—, pero el prop `origen` del formulario sí está tipado y esta lista
   * es el contrato único: un valor que se emite y no está escrito aquí es un
   * valor que nadie encuentra al montar el informe.
   */
  'lp_hero',
  'lp_close',
  /** El enlace no llevaba `data-ubicacion`. Si aparece en los informes, falta marcar un CTA. */
  'unmarked',
] as const

export type Ubicacion = (typeof UBICACIONES)[number]

export const EVENTOS = {
  phoneClick: 'phone_click',
  whatsappClick: 'whatsapp_click',
  emailClick: 'email_click',
  /**
   * La macro-conversión del sitio. Se llamaba `form_submit`, que es el nombre
   * que GA4 usa para su PROPIO evento de Medición mejorada: el envío del
   * formulario quedaba mezclado con cualquier `<form>` que GA4 detecte solo.
   * ⚠️ El renombrado tiene que estar desplegado ANTES de marcar nada como
   * evento clave en GA4: un evento clave apunta a un nombre, y el histórico no
   * se reescribe hacia atrás.
   */
  generateLead: 'generate_lead',
  calculatorUse: 'calculator_use',
  samplesFilter: 'samples_filter',
  scrollDepth: 'scroll_depth',
  faqOpen: 'faq_open',
} as const

export type NombreEvento = (typeof EVENTOS)[keyof typeof EVENTOS]

/**
 * Moneda de todo importe que viaje en un evento. GA4 la trata como parámetro
 * nativo: no hay que darla de alta como dimensión personalizada.
 *
 * **No la acompaña ningún `value`, y es deliberado.** El peso relativo entre
 * acciones se resuelve sin código, con un valor estático por acción en el panel
 * de Ads. El valor variable por lead exigiría saber cuántos euros vale un
 * formulario antes de la visita, y ese dato no existe: nadie ha registrado qué
 * lead acabó en obra. Y un `value: 0` de relleno sería peor que no mandar
 * nada — una acción de conversión importada de GA4 se puede configurar para
 * tomar el valor del evento, y ese cero pisaría el valor estático del panel del
 * que depende toda la puja.
 */
export const MONEDA = 'EUR'

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

/**
 * Eventos que se mandan UNA sola vez por sesión de navegador.
 *
 * `calculator_use` se dispara con cada cambio del deslizador —con 800 ms de
 * espera, pero cada cambio—, así que un mismo visitante producía decenas por
 * visita: el recuento medía el nerviosismo del dedo, no el interés.
 *
 * Gana el primero, no el último: sale la primera estimación que se estabiliza,
 * no la definitiva. Cerrar esa diferencia pediría vaciar el último valor al
 * abandonar la página, y eso se escribe en `Calculadora.tsx`, no aquí.
 */
const EVENTOS_UNA_VEZ_POR_SESION: readonly NombreEvento[] = [EVENTOS.calculatorUse]

const PREFIJO_SESION = 'pa_evt_'

function claveDeSesion(nombre: NombreEvento): string | null {
  return EVENTOS_UNA_VEZ_POR_SESION.includes(nombre) ? PREFIJO_SESION + nombre : null
}

/**
 * ⚠️ `sessionStorage` no siempre está: en navegación privada y con los datos de
 * sitio bloqueados el acceso **lanza**, no devuelve vacío. Si falla, el evento
 * se manda. Una guarda de deduplicación no puede tragarse un evento porque el
 * almacenamiento esté cerrado.
 */
function yaEmitidoEnEstaSesion(nombre: NombreEvento): boolean {
  const clave = claveDeSesion(nombre)
  if (!clave) return false
  try {
    return window.sessionStorage.getItem(clave) !== null
  } catch {
    return false
  }
}

/** Marcar va separado de comprobar a propósito. Ver `registrarEvento`. */
function marcarEmitidoEnSesion(nombre: NombreEvento) {
  const clave = claveDeSesion(nombre)
  if (!clave) return
  try {
    window.sessionStorage.setItem(clave, '1')
  } catch {
    // Sin `sessionStorage` no hay deduplicación posible, y se prefiere contar
    // de más a no contar.
  }
}

/** Dispara a GA4 y Meta Pixel a la vez. No-op seguro si el script no cargó (sin consentimiento o sin ID). */
export function registrarEvento(nombre: NombreEvento, opciones?: OpcionesEvento) {
  if (typeof window === 'undefined') return
  if (yaEmitidoEnEstaSesion(nombre)) return

  const params = { ...paramsComunes(), ...opciones?.params }

  window.gtag?.('event', nombre, params)

  const evento = opciones?.metaEstandar ?? nombre
  const metodo = opciones?.metaEstandar ? 'track' : 'trackCustom'
  if (opciones?.metaEventId) {
    window.fbq?.(metodo, evento, params, { eventID: opciones.metaEventId })
  } else {
    window.fbq?.(metodo, evento, params)
  }

  // La ranura de sesión se quema DESPUÉS, y solo si había a quién mandarlo. Sin
  // consentimiento o sin ID no existen `gtag` ni `fbq` y la llamada entera es
  // un no-op: marcarla ahí dejaría sin un solo `calculator_use` en toda la
  // visita a quien juega con la calculadora antes de contestar al banner.
  if (window.gtag || window.fbq) marcarEmitidoEnSesion(nombre)
}
