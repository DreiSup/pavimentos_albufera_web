import { createHash } from 'crypto'

/** v21.0 caduca el 21/01/2027. La vigente desde el 29/07/2026 es v26.0. */
const VERSION_GRAPH = 'v26.0'

/**
 * SHA-256 en hexadecimal, que es lo único que Meta acepta en `user_data`.
 *
 * No normaliza nada a propósito: cada campo tiene su regla y son incompatibles
 * entre sí —ver `normalizar`—. El `trim().toLowerCase()` genérico que vivía
 * aquí dentro es lo que dejó pasar meses el teléfono sin prefijo de país:
 * parecía normalizado, y no lo estaba.
 *
 * Exportado porque cualquier otra pata de servidor que hashee para Meta tiene
 * que usar ESTA función y no una copia suya, o los hashes no casarán entre sí.
 */
export function hash(valor: string) {
  return createHash('sha256').update(valor).digest('hex')
}

/** Quita los diacríticos: `Alcàsser` → `Alcasser`, `ñ` → `n`. */
function sinAcentos(valor: string) {
  return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Minúsculas, sin puntuación y **conservando el espacio interior**:
 * `Pérez García` es un apellido compuesto, no dos campos. Comprimirlo a
 * `perezgarcia` produce un hash que no existe en ningún otro sitio.
 * Los acentos se quedan: Meta acepta UTF-8 en `fn` y `ln`.
 */
function nombrePersona(valor: string) {
  return valor
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Normalización campo a campo. No hay una regla común: lo que vale para el
 * municipio destruye el apellido, y por eso un `hash()` que normalizara solo
 * podía servir a uno de los dos.
 *
 * Se exporta junto a `hash()` y no por separado: hashear con esta función sin
 * normalizar antes es exactamente el fallo que traía el teléfono. Quien las
 * necesite, se lleva las dos.
 */
export const normalizar = {
  /** Minúsculas y sin espacios sobrantes. */
  em: (valor: string) => valor.trim().toLowerCase(),

  /**
   * Solo dígitos y SIEMPRE con prefijo de país. Un móvil español de 9 cifras
   * hasheado tal cual no empareja con nada: `612345678` da `d500e1b5…` y
   * `34612345678` da `11f976ff…`. Hasta ahora salía la primera forma, así que
   * el 100 % de los `ph` que ha recibido Meta eran inservibles.
   *
   * ⚠️ El `.replace(/^34/, '')` de `app/presupuesto/actions.ts` se queda donde
   * está: alimenta el `refine` de 9 cifras, el email y el aviso de Telegram.
   * El prefijo se repone aquí, que es el único sitio que lo necesita.
   */
  ph: (valor: string) => {
    const digitos = valor.replace(/\D/g, '').replace(/^00/, '')
    return digitos.length === 9 ? `34${digitos}` : digitos
  },

  fn: nombrePersona,
  ln: nombrePersona,

  /**
   * Municipio y provincia: minúsculas, sin acentos y **sin espacios**.
   * `El Perelló` → `elperello`. Es la regla contraria a la de los apellidos.
   */
  ct: (valor: string) => sinAcentos(valor).toLowerCase().replace(/[^a-z]/g, ''),
  st: (valor: string) => sinAcentos(valor).toLowerCase().replace(/[^a-z]/g, ''),
}

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
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const token = process.env.META_CAPI_ACCESS_TOKEN
  if (!pixelId || !token) return

  const userData: Record<string, unknown> = {
    client_ip_address: evento.ip,
    client_user_agent: evento.userAgent,
    // La clientela de este negocio es española y ninguna pantalla pregunta el
    // país. Es un identificador más para el emparejamiento, gratis.
    country: [hash('es')],
  }
  if (evento.telefono) userData.ph = [hash(normalizar.ph(evento.telefono))]
  if (evento.email) userData.em = [hash(normalizar.em(evento.email))]
  if (evento.nombrePila) userData.fn = [hash(normalizar.fn(evento.nombrePila))]
  if (evento.apellidos) userData.ln = [hash(normalizar.ln(evento.apellidos))]
  if (evento.municipio) userData.ct = [hash(normalizar.ct(evento.municipio))]
  if (evento.provincia) userData.st = [hash(normalizar.st(evento.provincia))]
  // El código de referencia ya se genera para el mensaje de WhatsApp: usarlo
  // aquí sube la calidad del emparejamiento sin pedir ni un dato nuevo. En
  // minúsculas SIEMPRE, en esta pata y en la del Pixel, para que la
  // normalización interna de Meta deje de importar.
  if (evento.referencia) userData.external_id = [hash(evento.referencia.toLowerCase())]
  if (evento.fbp) userData.fbp = evento.fbp
  if (evento.fbc) userData.fbc = evento.fbc

  // Con la variable puesta, el evento aparece en Test Events y NO cuenta como
  // conversión. Nunca se define en producción.
  const codigoDePrueba = process.env.META_CAPI_TEST_EVENT_CODE?.trim()

  try {
    const respuesta = await fetch(`https://graph.facebook.com/${VERSION_GRAPH}/${pixelId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // El token va en cabecera, no en la query: una URL con el token dentro
        // acaba en los registros de la plataforma y en cualquier traza de red.
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: [
          {
            event_name: evento.nombreEvento ?? 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            event_id: evento.eventoId,
            // `'website'` en los tres canales. `action_source` NO forma parte
            // de la clave de deduplicación de Meta —que es `event_id` +
            // `event_name`—, así que declarar `'phone_call'` en el clic dejaría
            // el valor que Meta registra a merced de una carrera de red contra
            // el Pixel. `'phone_call'` se reserva a una llamada atendida e
            // importada. Ver `design/07`.
            action_source: 'website',
            event_source_url: evento.url,
            user_data: userData,
            ...(evento.datosPersonalizados ? { custom_data: evento.datosPersonalizados } : {}),
          },
        ],
        ...(codigoDePrueba ? { test_event_code: codigoDePrueba } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    })

    // `fetch` no lanza con un 400. Sin esto, un token caducado, un pixel ID
    // equivocado o un `user_data` rechazado pasan mudos y la CAPI puede llevar
    // meses sin entregar nada sin que nadie pueda saberlo.
    if (!respuesta.ok) {
      const cuerpo = await respuesta.text()
      console.error(`Meta CAPI ${respuesta.status}: ${cuerpo.slice(0, 500)}`)
    }
  } catch (error) {
    // No bloquea el envío del presupuesto por un fallo de Meta, pero tampoco
    // se traga el motivo: aquí caen la red caída y el timeout de 8 s.
    console.error('Meta CAPI sin respuesta:', error)
  }
}
