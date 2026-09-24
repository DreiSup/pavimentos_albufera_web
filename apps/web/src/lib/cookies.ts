/**
 * legacy adapter, delete when a new design consumes @site/* directly
 *
 * Cookies de primera parte, lado cliente.
 *
 * Por qué cookie y no `localStorage`, en los dos casos que las usan:
 * - **Consentimiento**: el Server Action necesita leerlo para decidir si manda
 *   el evento a Meta CAPI. `localStorage` no viaja al servidor.
 * - **`gclid` y `utm_*`**: es requisito explícito del plan de medición. Una
 *   atribución que solo vive en el navegador no llega al lead.
 *
 * Los nombres de cookie y el alfabeto del código de referencia siguen
 * siendo literales de este archivo (D18 de docs/migration/DECISIONS.md): son el
 * vocabulario de este negocio, no capacidad genérica. Lo genérico —lectura/
 * escritura de cookie, el algoritmo de borrado por prefijo/nombre exacto, el
 * generador de código aleatorio— viene ahora de `@site/tracking`, cada
 * pieza importada por su PROPIA subruta hoja (D17 final: un export por
 * archivo) — nunca el barrel principal.
 *
 * `leerCookie`/`escribirCookie` son bindings `const`, no
 * `export { x } from …` de un nombre importado (D26, medido): un
 * re-export literal apunta a cada componente cliente que lo usa
 * directamente al módulo del paquete, y un módulo con varios
 * importadores deja de poder concatenarse en el único módulo de este
 * adaptador — cuesta bytes reales en cada ruta. Un `const` asignado desde
 * el import es la misma función, pero deja a este archivo como su único
 * importador.
 */
import { readCookie } from '@site/tracking/read-cookie'
import { writeCookie } from '@site/tracking/write-cookie'
import { deleteTrackerCookies } from '@site/tracking/tracker-cookies'
import { generateReferenceCode } from '@site/tracking/reference-code'

export const leerCookie = readCookie
export const escribirCookie = writeCookie

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
  return generateReferenceCode(ALFABETO, 6)
}

export type EstadoConsentimiento = 'aceptado' | 'rechazado'

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
 * Borra, en este navegador, las cookies de rastreo que gtag.js y fbevents.js
 * ya hubieran escrito, más `pa_attr`. Ninguno de los dos se puede
 * "desinyectar" una vez cargado —de ahí que quien llama a esto también
 * recargue la página después—, así que lo único que se puede hacer es apagar
 * lo que ya escribieron. Mismo algoritmo que antes de la migración
 * (`@site/tracking/tracker-cookies`'s `deleteTrackerCookies`): sin `Domain`
 * (cookie de solo-host) y, además, con cada sufijo de dominio de
 * `location.hostname` — gtag.js decide él solo dónde posa cada cookie y
 * desde aquí no se puede leer cuál usó, así que se prueban las dos formas.
 */
export function borrarCookiesRastreo() {
  deleteTrackerCookies(PREFIJOS_RASTREO, EXACTAS_RASTREO)
}
