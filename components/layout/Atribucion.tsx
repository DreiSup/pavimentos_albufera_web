'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import {
  COOKIE_ATRIBUCION,
  COOKIE_CONSENTIMIENTO,
  COOKIE_REFERENCIA,
  generarReferencia,
  leerCookie,
} from '@/lib/cookies'

/**
 * ⚠️ La misma lista está en `app/api/atribucion/route.ts`, que es quien decide
 * qué entra en la cookie. Duplicada a conciencia: un `'use client'` no puede
 * exportar una constante a un módulo de servidor. Si se toca una, se toca la otra.
 */
const CLAVES = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

type Pendiente = {
  atribucion: Record<string, string>
  fbclid?: string
  indice: number
  visto: number
}

/**
 * Reescribe el mensaje prellenado de todos los enlaces `wa.me` de la página.
 *
 * Se recompone **siempre desde la base original**, guardada en `data-mensaje-base`
 * la primera vez. Antes había una guarda de idempotencia —«si ya está parcheado,
 * sáltalo»— y hacía justo lo contrario de lo que pretendía: congelaba la página
 * de origen del primer render, así que un visitante que aterrizaba en la home y
 * escribía desde `/hormigon-pulido/` mandaba un mensaje diciendo que venía de la
 * home. Sin la base guardada, recomponer desde el `href` ya parcheado acumularía
 * ruta y código dentro del propio mensaje.
 */
function parchearEnlaces(referencia: string, ruta: string) {
  if (!referencia) return
  for (const enlace of document.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me"]')) {
    const url = new URL(enlace.href)
    const base =
      enlace.dataset.mensajeBase ?? url.searchParams.get('text') ?? 'Hola, quiero presupuesto para '
    enlace.dataset.mensajeBase = base
    url.searchParams.set('text', `${base}(página: ${ruta} · ref ${referencia})`)
    enlace.href = url.toString()
    enlace.dataset.referencia = referencia
  }
}

/**
 * Identidad del lead antes de que haya lead. Hace dos cosas, y las dos van
 * juntas porque las dos existen para lo mismo: que una conversación que empieza
 * fuera del navegador se pueda atribuir a lo que la originó.
 *
 * 1. **Atribución.** Lee `gclid`/`gbraid`/`wbraid`/`utm_*`/`fbclid` de la URL y
 *    los deja **en memoria**. No escribe nada aquí: quien escribe es
 *    `app/api/atribucion/route.ts`, por `Set-Cookie` de primera parte, que es lo
 *    único que escapa al recorte de caducidad que el ITP de Safari le aplica a
 *    todo lo que sale de `document.cookie` —7 días, y 24 h si la llegada venía
 *    decorada con `?gclid=`—. Primer toque gana, y quien lo comprueba es el
 *    servidor.
 *
 *    🔴 **`pa_attr` no se escribe sin la casilla de publicidad aceptada.** Hasta
 *    ahora se escribía siempre. Si la decisión llega después —el caso normal: se
 *    aterriza con el `gclid` y se acepta al segundo—, lo capturado espera en
 *    memoria a que el banner se conteste; si se rechaza, se descarta y no se
 *    vuelve a mirar.
 *
 * 2. **Código de referencia.** Un código de 6 caracteres inyectado en el mensaje
 *    prellenado de todos los enlaces `wa.me` de la página, junto con la página de
 *    origen. El sitio es estático y los CTA son componentes de servidor, así que
 *    el href no puede llevar un código por visitante: se parchea aquí, tras
 *    hidratar, y se vuelve a parchear con cada navegación y con cada enlace que
 *    aparezca después —el menú móvil, que se monta al abrirlo y hasta hoy nunca
 *    llevaba código—.
 *
 * Se lee de `window.location.search` en un efecto, no con `useSearchParams`,
 * para no sacar de renderizado estático a todas las páginas del sitio.
 */
export default function Atribucion() {
  const pathname = usePathname()
  const referencia = useRef('')
  const pendiente = useRef<Pendiente | null>(null)
  const ruta = useRef(pathname)

  useEffect(() => {
    // La cookie manda. Si no hay, se genera ya —no se espera a la respuesta del
    // servidor— para que los enlaces salgan parcheados desde el primer pintado;
    // el handler la sella con `Set-Cookie` y devuelve la que quede vigente.
    const guardada = leerCookie(COOKIE_REFERENCIA)
    referencia.current = guardada ?? generarReferencia()

    if (!leerCookie(COOKIE_ATRIBUCION)) {
      const params = new URLSearchParams(window.location.search)
      const encontrado: Record<string, string> = {}
      for (const clave of CLAVES) {
        const valor = params.get(clave)
        if (valor) encontrado[clave] = valor.slice(0, 200)
      }
      const fbclid = params.get('fbclid')?.slice(0, 200) || undefined
      if (fbclid) encontrado.fbclid = fbclid

      if (Object.keys(encontrado).length > 0) {
        encontrado.landing = window.location.pathname
        encontrado.ts = new Date().toISOString().slice(0, 10)
        pendiente.current = {
          atribucion: encontrado,
          fbclid,
          // El índice del `_fbc` es el número de puntos del dominio donde se
          // posa la cookie: `com` 0, `ejemplo.com` 1, `www.ejemplo.com` 2. Se
          // deriva, no se escribe a mano, porque la tarea 2.4 —¿apex o `www`?—
          // sigue sin contestar y derivarlo lo hace autocorrectivo.
          indice: window.location.hostname.split('.').length - 1,
          // El instante en que se observó el `fbclid`. Meta pide ese, no el del
          // momento de escribir: entre aterrizar y aceptar pasan minutos.
          visto: Date.now(),
        }
      }
    }

    let enviando = false

    function enviar() {
      const aceptado = leerCookie(COOKIE_CONSENTIMIENTO) === 'aceptado'
      const hayPublicidad = aceptado && pendiente.current !== null
      // El componente vive en el layout raíz. Sin esta guarda, cada visita a un
      // sitio estático se convertiría en una invocación de función servidor.
      if (enviando) return
      if (leerCookie(COOKIE_REFERENCIA) && !hayPublicidad) return

      enviando = true
      fetch('/api/atribucion/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        // Barra final: con `trailingSlash: true` la versión sin barra es un 308
        // de más. `keepalive` para que sobreviva a una navegación inmediata.
        keepalive: true,
        body: JSON.stringify({
          referencia: referencia.current,
          ...(hayPublicidad ? pendiente.current : {}),
        }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((datos: { referencia?: string } | null) => {
          enviando = false
          if (hayPublicidad) pendiente.current = null
          if (datos?.referencia && datos.referencia !== referencia.current) {
            referencia.current = datos.referencia
            parchearEnlaces(referencia.current, ruta.current)
          }
          // El «Aceptar» puede caer con esta petición en vuelo, y es el caso
          // normal: se aterriza con el `gclid`, sale el envío que sella `pa_ref`
          // y se acepta el banner encima. Esa llamada se encontró la guarda
          // puesta y no envió nada, así que se reintenta aquí. Solo en el camino
          // de éxito: en el de error un fallo repetido daría vueltas para siempre.
          if (
            !hayPublicidad &&
            pendiente.current &&
            leerCookie(COOKIE_CONSENTIMIENTO) === 'aceptado'
          ) {
            enviar()
          }
        })
        .catch(() => {
          enviando = false
          // Sin red no hay cookie duradera, pero el mensaje de WhatsApp de esta
          // sesión sigue llevando su código: no se degrada nada que se pueda
          // salvar aquí.
        })
    }

    enviar()

    // Si el banner ya está contestado no hay nada que esperar.
    if (leerCookie(COOKIE_CONSENTIMIENTO)) return

    // El consentimiento solo cambia por un clic. En fase de burbuja y sobre
    // `document`: el `onClick` de React corre antes y escribe la cookie de forma
    // síncrona, así que aquí ya se lee el valor nuevo. En captura se leería el viejo.
    function alDecidir() {
      const estado = leerCookie(COOKIE_CONSENTIMIENTO)
      if (!estado) return
      if (estado === 'aceptado') enviar()
      // Rechazado: lo capturado se suelta. No se retiene en memoria por si acaso.
      else pendiente.current = null
      document.removeEventListener('click', alDecidir)
    }

    document.addEventListener('click', alDecidir)
    return () => document.removeEventListener('click', alDecidir)
  }, [])

  useEffect(() => {
    ruta.current = pathname
    parchearEnlaces(referencia.current, pathname)

    // El menú móvil se monta al abrirlo, mucho después de este efecto, y sus dos
    // CTA salían sin código. Se observa el árbol para parchear lo que aparezca.
    // Sin `attributes`: parchear escribe `href` y `data-*`, y observarlos sería
    // un bucle.
    const observador = new MutationObserver((cambios) => {
      // Solo cuando entra un elemento nuevo. Un `querySelectorAll` en cada
      // repintado de React no lo paga nadie.
      for (const cambio of cambios) {
        for (const nodo of cambio.addedNodes) {
          if (nodo.nodeType === Node.ELEMENT_NODE) {
            parchearEnlaces(referencia.current, pathname)
            return
          }
        }
      }
    })
    observador.observe(document.body, { childList: true, subtree: true })
    return () => observador.disconnect()
  }, [pathname])

  return null
}
