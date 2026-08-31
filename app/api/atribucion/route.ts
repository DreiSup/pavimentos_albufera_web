import { NextResponse, type NextRequest } from 'next/server'
import {
  COOKIE_ATRIBUCION,
  COOKIE_CONSENTIMIENTO,
  COOKIE_REFERENCIA,
  generarReferencia,
} from '@/lib/cookies'
import { limitePorIp } from '@/lib/limite'

/**
 * Escritor único de `pa_attr`, `pa_ref` y `_fbc`.
 *
 * **Por qué existe.** Hasta ahora las tres se escribían con `document.cookie`
 * desde `Atribucion.tsx`, y ese es exactamente el escritor al que el ITP de
 * Safari le recorta la caducidad a **7 días** —y a **24 h** en el caso agravado
 * de una llegada decorada con `?gclid=`—. Una cookie de atribución que caduca
 * antes que el ciclo de decisión de una obra no atribuye nada. Un `Set-Cookie`
 * de primera parte, del mismo origen, no está sujeto a ese recorte. Cuesta 0 €
 * al mes y es lo que WebKit recomienda por escrito.
 *
 * **La puerta del consentimiento está aquí, no en el cliente.** El cliente dice
 * lo que quiere guardar; quien decide es este handler, leyendo `pa_consent` de
 * la propia petición. `pa_attr` y `_fbc` solo se escriben con la casilla de
 * publicidad aceptada. `pa_ref` no: es el puente entre una conversación de
 * WhatsApp y el lead, y su estado frente al consentimiento sigue sin decidir
 * (tarea 2.11). El día que se decida, es un `if` en este archivo.
 *
 * ⚠️ Ninguna cookie va `HttpOnly`, y es a propósito: `FormularioPresupuesto.tsx`
 * lee `pa_ref` desde el navegador, y `fbevents.js` lee `_fbc` de
 * `document.cookie`. Ponerlo rompería las dos en silencio.
 *
 * Es la primera ruta dinámica del sitio: añade una `ƒ` a la salida de
 * `next build`.
 */
export const dynamic = 'force-dynamic'

const DIAS = 90

/** Tope por valor que pide el plan. */
const MAX_VALOR = 200

/**
 * Techo del JSON de `pa_attr` ya codificado. El límite real por cookie ronda
 * los 4096 B contando nombre y atributos, y un navegador que lo pasa **descarta
 * la cookie entera sin avisar**: la atribución se perdería en silencio.
 */
const MAX_COOKIE = 3800

/**
 * Las mismas claves que captura `components/layout/Atribucion.tsx`. Están
 * duplicadas a conciencia: su sitio natural sería `lib/cookies.ts`, pero un
 * `'use client'` no puede exportar una constante a un módulo de servidor —Next
 * sustituye sus exports por referencias de cliente— y `lib/cookies.ts` es de
 * otra tarea. Si se toca una lista, se toca la otra.
 */
const CLAVES = [
  'gclid',
  'gbraid',
  'wbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'landing',
  'ts',
]

/** El alfabeto de `generarReferencia()`: sin `0`, `O`, `1` ni `I`. */
const REFERENCIA = /^[A-Z2-9]{6}$/

/** Lo que Meta admite dentro de un `fbclid`. Deja fuera todo lo demás. */
const FBCLID = /^[A-Za-z0-9_-]{1,255}$/

/**
 * Un valor con retorno de carro parte la cabecera `Set-Cookie` en dos. No se
 * escapa: se descarta el valor entero.
 */
function limpio(valor: unknown): string | undefined {
  if (typeof valor !== 'string') return undefined
  if (/[\r\n]/.test(valor)) return undefined
  const recortado = valor.slice(0, MAX_VALOR).trim()
  return recortado || undefined
}

/** Deja pasar solo las claves conocidas, ya limpias y recortadas. */
function atribucionValida(bruto: unknown): Record<string, string> | undefined {
  if (typeof bruto !== 'object' || bruto === null || Array.isArray(bruto)) return undefined
  const salida: Record<string, string> = {}
  for (const clave of CLAVES) {
    const valor = limpio((bruto as Record<string, unknown>)[clave])
    if (valor) salida[clave] = valor
  }
  if (Object.keys(salida).length === 0) return undefined
  if (encodeURIComponent(JSON.stringify(salida)).length > MAX_COOKIE) return undefined
  return salida
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonimo'
  // Generoso a propósito: no son los 3/hora del formulario. Aquí una oficina o
  // un CGNAT comparten IP entre visitantes distintos, y quedarse fuera del
  // límite no es «no puedes enviar otro formulario», es perder la atribución de
  // todos ellos. Solo tiene que frenar un bucle.
  if (!limitePorIp(ip, { limite: 30, ventanaMs: 60_000 })) {
    return new NextResponse(null, { status: 429, headers: { 'cache-control': 'no-store' } })
  }

  let cuerpo: Record<string, unknown> = {}
  try {
    const leido: unknown = await request.json()
    if (typeof leido === 'object' && leido !== null && !Array.isArray(leido)) {
      cuerpo = leido as Record<string, unknown>
    }
  } catch {
    // Cuerpo ausente o ilegible. Se sigue: la petición todavía sirve para
    // sellar `pa_ref` por `Set-Cookie`.
  }

  const cookies = request.cookies
  const aceptado = cookies.get(COOKIE_CONSENTIMIENTO)?.value === 'aceptado'
  const seguro = request.nextUrl.protocol === 'https:'
  const opciones = {
    path: '/',
    maxAge: DIAS * 24 * 60 * 60,
    sameSite: 'lax' as const,
    httpOnly: false,
    secure: seguro,
  }

  // Primer toque gana, y la comprobación se hace aquí: la del cliente corre
  // carreras entre pestañas.
  const propuesta = limpio(cuerpo.referencia)
  const referencia =
    cookies.get(COOKIE_REFERENCIA)?.value ??
    (propuesta && REFERENCIA.test(propuesta) ? propuesta : generarReferencia())

  const respuesta = NextResponse.json({ referencia }, { headers: { 'cache-control': 'no-store' } })

  // `ResponseCookies` no codifica el valor. `escribirCookie` y `leerCookie` de
  // `lib/cookies.ts` sí, y `cookies()` del servidor decodifica al leer: se
  // codifica aquí para que las dos caras hablen el mismo formato. `pa_ref` y
  // `_fbc` no lo necesitan —su alfabeto ya es seguro— y `_fbc` además **no debe**
  // codificarse: `fbevents.js` lo lee crudo.
  respuesta.cookies.set(COOKIE_REFERENCIA, referencia, opciones)

  if (aceptado && !cookies.get(COOKIE_ATRIBUCION)) {
    const atribucion = atribucionValida(cuerpo.atribucion)
    if (atribucion) {
      respuesta.cookies.set(
        COOKIE_ATRIBUCION,
        encodeURIComponent(JSON.stringify(atribucion)),
        opciones,
      )
    }
  }

  // `_fbc` solo cubre el hueco que el Pixel no puede: cuando el consentimiento
  // llega después de que el `fbclid` haya desaparecido de la URL. Si la cookie
  // ya existe la escribió el Pixel, y esa manda.
  if (aceptado && !cookies.get('_fbc')) {
    const fbclid = limpio(cuerpo.fbclid)
    // `fb.<índice>.<ms>.<fbclid>`, formato literal de la CAPI. El índice es el
    // número de puntos del dominio donde se posa la cookie —`com` 0,
    // `ejemplo.com` 1, `www.ejemplo.com` 2— y lo deriva el cliente con
    // `location.hostname.split('.').length - 1`, no se escribe a mano: hasta que
    // la tarea 2.4 fije si el canónico es apex o `www`, escribirlo a mano sería
    // apostar. Se valida el rango; fuera de él no se compone nada, no se inventa
    // un índice.
    const indice = cuerpo.indice
    // Meta pide el instante en que se **observó** el `fbclid`, no el de ahora:
    // entre la llegada y el «Aceptar» pueden pasar minutos.
    const visto = cuerpo.visto
    const ahora = Date.now()
    const marca =
      typeof visto === 'number' && Number.isFinite(visto) && visto > 0 && visto <= ahora
        ? Math.round(visto)
        : ahora
    const indiceValido = Number.isInteger(indice) && (indice as number) >= 0 && (indice as number) <= 4
    if (fbclid && FBCLID.test(fbclid) && indiceValido) {
      respuesta.cookies.set('_fbc', `fb.${indice}.${marca}.${fbclid}`, opciones)
    }
  }

  return respuesta
}
