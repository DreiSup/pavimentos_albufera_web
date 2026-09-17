/**
 * Cookies de primera parte, lado cliente.
 *
 * Por qué cookie y no `localStorage`, en los dos casos que las usan:
 * - **Consentimiento**: el Server Action necesita leerlo para decidir si manda
 *   el evento a Meta CAPI. `localStorage` no viaja al servidor.
 * - **`gclid` y `utm_*`**: es requisito explícito del plan de medición. Una
 *   atribución que solo vive en el navegador no llega al lead.
 */

export const COOKIE_CONSENTIMIENTO = 'pa_consent'
export const COOKIE_ATRIBUCION = 'pa_attr'
export const COOKIE_REFERENCIA = 'pa_ref'

/**
 * Código corto que viaja dentro del mensaje prellenado de WhatsApp. Es el único
 * puente entre la sesión del navegador y una conversación que ocurre fuera de
 * él: sin esto, un lead de WhatsApp llega sin origen y no se puede atribuir.
 *
 * Sin `0`, `O`, `1` ni `I`: alguien va a tener que teclearlo o leerlo en voz alta.
 */
const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generarReferencia(): string {
  const bytes = new Uint8Array(6)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => ALFABETO[b % ALFABETO.length]).join('')
}

export type EstadoConsentimiento = 'aceptado' | 'rechazado'

export function leerCookie(nombre: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const pares = document.cookie.split('; ')
  for (const par of pares) {
    const separador = par.indexOf('=')
    if (separador === -1) continue
    if (par.slice(0, separador) === nombre) {
      return decodeURIComponent(par.slice(separador + 1))
    }
  }
  return undefined
}

export function escribirCookie(nombre: string, valor: string, dias: number) {
  if (typeof document === 'undefined') return
  const caduca = new Date(Date.now() + dias * 864e5).toUTCString()
  const seguro = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${nombre}=${encodeURIComponent(valor)}; Path=/; Expires=${caduca}; SameSite=Lax${seguro}`
}
