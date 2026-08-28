'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { EVENTOS, registrarEvento } from '@/lib/eventos'

const UMBRALES = [25, 50, 75, 90] as const

/**
 * Primer peldaño del árbol de diagnóstico "CTR alto y conversión baja": saber
 * si la gente llega al CTA o abandona antes del argumento. Sin este evento esa
 * pregunta no se puede contestar, solo opinar.
 *
 * Sin librería y sin dependencias: un listener pasivo con `requestAnimationFrame`,
 * el mismo patrón que ya usa la cabecera. Cada umbral se dispara una sola vez
 * por página, y el conjunto se reinicia al navegar.
 */
export default function ProfundidadScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const disparados = new Set<number>()
    let pendiente = false

    function medir() {
      pendiente = false
      const alcanzable = document.documentElement.scrollHeight - window.innerHeight
      // Página que no da scroll: no hay profundidad que medir.
      if (alcanzable <= 0) return
      const porcentaje = (window.scrollY / alcanzable) * 100

      for (const umbral of UMBRALES) {
        if (porcentaje >= umbral && !disparados.has(umbral)) {
          disparados.add(umbral)
          registrarEvento(EVENTOS.scrollDepth, { params: { percent: umbral } })
        }
      }
    }

    function alHacerScroll() {
      if (pendiente) return
      pendiente = true
      window.requestAnimationFrame(medir)
    }

    window.addEventListener('scroll', alHacerScroll, { passive: true })
    return () => window.removeEventListener('scroll', alHacerScroll)
  }, [pathname])

  return null
}
