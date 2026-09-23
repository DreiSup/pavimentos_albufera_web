import type { ReactNode } from 'react'

/**
 * Aparición suave de secciones al entrar en pantalla, una sola vez (§8.6).
 *
 * Componente de servidor: no manda ni un byte de JavaScript al cliente. Toda la
 * animación vive en la clase `.aparece` de `app/globals.css`, resuelta con
 * `animation-timeline: view()` dentro de un `@supports`. La consecuencia que
 * importa: **el contenido es visible siempre**, también con el JS desactivado,
 * caído o todavía sin descargar. La animación es un extra, nunca el interruptor
 * de la visibilidad.
 *
 * La API (`as`, `id`, `className`) es la misma de antes: las páginas que ya lo
 * usan no cambian.
 */
export default function Aparece({
  children,
  className = '',
  as: Componente = 'div',
  id,
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'section'
  id?: string
}) {
  const Tag = Componente as 'div'

  return (
    <Tag id={id} className={`aparece ${className}`}>
      {children}
    </Tag>
  )
}
