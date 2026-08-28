'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  COOKIE_ATRIBUCION,
  COOKIE_REFERENCIA,
  escribirCookie,
  generarReferencia,
  leerCookie,
} from '@/lib/cookies'

const CLAVES = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
const DIAS = 90

/**
 * Identidad del lead antes de que haya lead. Hace dos cosas, y las dos van
 * juntas porque las dos existen para lo mismo: que una conversación que empieza
 * fuera del navegador se pueda atribuir a lo que la originó.
 *
 * 1. **Atribución.** Guarda `gclid`/`gbraid`/`wbraid`/`utm_*` en cookie de
 *    primera parte. Primer toque gana: quien llegó por un anuncio y vuelve dos
 *    días después por búsqueda de marca sigue siendo un lead de ese anuncio.
 *
 * 2. **Código de referencia.** Genera un código de 6 caracteres y lo inyecta en
 *    el mensaje prellenado de todos los enlaces `wa.me` de la página, junto con
 *    la página de origen. El sitio es estático y los CTA son componentes de
 *    servidor, así que el href no puede llevar un código por visitante: se
 *    parchea aquí, tras hidratar.
 *
 * Se lee de `window.location.search` en un efecto, no con `useSearchParams`,
 * para no sacar de renderizado estático a todas las páginas del sitio.
 */
export default function Atribucion() {
  const pathname = usePathname()

  useEffect(() => {
    if (!leerCookie(COOKIE_ATRIBUCION)) {
      const params = new URLSearchParams(window.location.search)
      const encontrado: Record<string, string> = {}
      for (const clave of CLAVES) {
        const valor = params.get(clave)
        if (valor) encontrado[clave] = valor.slice(0, 200)
      }
      if (Object.keys(encontrado).length > 0) {
        encontrado.landing = window.location.pathname
        encontrado.ts = new Date().toISOString().slice(0, 10)
        escribirCookie(COOKIE_ATRIBUCION, JSON.stringify(encontrado), DIAS)
      }
    }
  }, [])

  useEffect(() => {
    let referencia = leerCookie(COOKIE_REFERENCIA)
    if (!referencia) {
      referencia = generarReferencia()
      escribirCookie(COOKIE_REFERENCIA, referencia, DIAS)
    }

    for (const enlace of document.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me"]')) {
      // Idempotente: al navegar entre páginas el efecto se repite sobre enlaces
      // que ya pueden estar parcheados.
      if (enlace.dataset.referencia) continue

      const url = new URL(enlace.href)
      const base = url.searchParams.get('text') ?? 'Hola, quiero presupuesto para '
      url.searchParams.set('text', `${base}(página: ${pathname} · ref ${referencia})`)
      enlace.href = url.toString()
      enlace.dataset.referencia = referencia
    }
  }, [pathname])

  return null
}
