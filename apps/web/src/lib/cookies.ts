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

/**
 * Cookies de rastreo que la retirada del consentimiento (`Consentimiento.tsx`)
 * tiene que apagar: las que gtag.js y fbevents.js ya hubieran escrito en este
 * navegador, más `pa_attr`. Deliberadamente NO incluye `pa_ref` —código de
 * referencia, no de publicidad, y se vuelve a escribir solo con entrar— ni
 * `pa_consent` —la cookie que guarda la propia decisión que se acaba de tomar—.
 */
const PREFIJOS_RASTREO = ['_ga', '_gcl']
const EXACTAS_RASTREO: string[] = ['_fbp', '_fbc', COOKIE_ATRIBUCION]

/**
 * Todos los sufijos de dominio de `host` con al menos dos etiquetas, el host
 * entero incluido: `www.ejemplo.com` → `['www.ejemplo.com', 'ejemplo.com']`.
 * Un navegador rechaza en silencio un `Domain` que sea un sufijo público
 * (`.com`, `.vercel.app`) o que tenga menos etiquetas que el propio host, así
 * que no hace falta filtrarlo aquí: sobra intentarlo y no pasa nada si falla.
 * Un host de una sola etiqueta (`localhost`) no tiene ningún sufijo que
 * probar y se queda solo con el borrado sin `Domain`.
 */
function sufijosDominio(host: string): string[] {
  if (/^[\d.]+$/.test(host) || host.includes(':')) return [] // IP o localhost:puerto
  const etiquetas = host.split('.')
  const sufijos: string[] = []
  for (let i = 0; i < etiquetas.length - 1; i++) sufijos.push(etiquetas.slice(i).join('.'))
  return sufijos
}

/**
 * Borra, en este navegador, las cookies de rastreo que gtag.js y fbevents.js
 * ya hubieran escrito, más `pa_attr`. Ninguno de los dos se puede
 * "desinyectar" una vez cargado —de ahí que quien llama a esto también
 * recargue la página después—, así que lo único que se puede hacer es apagar
 * lo que ya escribieron.
 *
 * Se borra sin `Domain` (cookie de solo-host) y, además, con cada sufijo de
 * `sufijosDominio()`: gtag.js decide él solo dónde posa cada cookie —en el
 * host exacto o en el dominio registrable, `.ejemplo.com`— y desde aquí no se
 * puede leer cuál usó, así que se prueban las dos formas.
 */
export function borrarCookiesRastreo() {
  if (typeof document === 'undefined') return
  const nombres = new Set<string>()
  for (const par of document.cookie.split('; ')) {
    const separador = par.indexOf('=')
    if (separador === -1) continue
    const nombre = par.slice(0, separador)
    if (PREFIJOS_RASTREO.some((prefijo) => nombre.startsWith(prefijo)) || EXACTAS_RASTREO.includes(nombre)) {
      nombres.add(nombre)
    }
  }
  if (nombres.size === 0) return
  const dominios = sufijosDominio(window.location.hostname)
  for (const nombre of nombres) {
    document.cookie = `${nombre}=; Path=/; Max-Age=0`
    for (const dominio of dominios) {
      document.cookie = `${nombre}=; Path=/; Max-Age=0; Domain=${dominio}`
    }
  }
}
