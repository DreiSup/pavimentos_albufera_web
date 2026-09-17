'use client'

import { useEffect } from 'react'
import { EVENTOS, registrarEvento, type Ubicacion } from '@/lib/eventos'

/**
 * Delegación de clic sobre tel:/wa.me/mailto: en todo el documento. Así Pie,
 * BarraMovil y las páginas siguen siendo componentes de servidor — no hace
 * falta convertir ninguno a 'use client' para medir estos clics.
 *
 * La zona de la página viaja en el atributo `data-ubicacion` del propio enlace,
 * que un componente de servidor sí puede escribir. Sin él, todos los CTA
 * dispararían el mismo evento indistinguible y no se sabría cuál convierte.
 */
export default function EventosGlobales() {
  useEffect(() => {
    function alClic(evento: MouseEvent) {
      const enlace = (evento.target as HTMLElement).closest('a')
      if (!enlace) return

      const href = enlace.getAttribute('href') ?? ''
      const ubicacion = (enlace.dataset.ubicacion ?? 'unmarked') as Ubicacion

      if (href.startsWith('tel:')) {
        registrarEvento(EVENTOS.phoneClick, {
          metaEstandar: 'Contact',
          params: { click_location: ubicacion },
        })
      } else if (href.includes('wa.me')) {
        registrarEvento(EVENTOS.whatsappClick, {
          metaEstandar: 'Contact',
          params: {
            click_location: ubicacion,
            reference_code: enlace.dataset.referencia ?? '',
          },
        })
      } else if (href.startsWith('mailto:')) {
        registrarEvento(EVENTOS.emailClick, {
          metaEstandar: 'Contact',
          params: { click_location: ubicacion },
        })
      }
    }

    document.addEventListener('click', alClic)
    return () => document.removeEventListener('click', alClic)
  }, [])

  return null
}
