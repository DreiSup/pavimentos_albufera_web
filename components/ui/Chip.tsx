import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

/**
 * 01-sistema-de-diseno.md §3.6. Tres formas de renderizarse, misma pieza visual:
 *
 * - `<button>` (por defecto) — control de filtro con `onClick`. Es la API de
 *   siempre y no ha cambiado: `FiltrosAcabados` y `FiltrosProyectos` la usan tal cual.
 * - `<a>` con `href` — navegación al muestrario ya filtrado. Marca el estado con
 *   `aria-current`, no con `aria-pressed`: no es un interruptor, es un enlace.
 * - `<span>` con `etiqueta` — dato, no control. Para cuando el chip solo informa
 *   («16 acabados») y no hay nada que pulsar. Un `<button>` sin `onClick`
 *   prometía una interacción que no existía.
 *
 * Sin `'use client'`: el componente no tiene estado propio. Donde lo importa un
 * componente de cliente se empaqueta con él; donde lo importa uno de servidor,
 * se queda en el servidor y no añade JavaScript a la ruta.
 */

type Comun = {
  activo?: boolean
  sobreOscuro?: boolean
  children: ReactNode
  className?: string
}

const base =
  'inline-flex items-center min-h-tactil px-[14px] md:px-[18px] whitespace-nowrap font-mono text-d-11 md:text-d-12'

function clasesChip(activo?: boolean, sobreOscuro?: boolean, className = '') {
  const inactivo = sobreOscuro
    ? 'bg-transparent text-fondo border border-sobre-tinta'
    : 'bg-transparent text-tinta border border-tinta-media'

  return `${base} ${
    activo ? 'bg-pigmento text-tinta border border-pigmento' : inactivo
  } ${className}`
}

type ComoBoton = Comun &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; etiqueta?: false }
type ComoEnlace = Comun &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string; etiqueta?: false }
type ComoEtiqueta = Comun &
  HTMLAttributes<HTMLSpanElement> & { href?: undefined; etiqueta: true }

export default function Chip(props: ComoBoton | ComoEnlace | ComoEtiqueta) {
  const { activo, sobreOscuro, children, className = '', href, etiqueta, ...resto } = props
  const clases = clasesChip(activo, sobreOscuro, className)

  if (etiqueta) {
    return (
      <span className={clases} {...(resto as HTMLAttributes<HTMLSpanElement>)}>
        {children}
      </span>
    )
  }

  if (href) {
    return (
      <Link
        href={href}
        aria-current={activo ? 'true' : undefined}
        className={`${clases} no-underline`}
        {...(resto as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>)}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type="button"
      aria-pressed={Boolean(activo)}
      className={clases}
      {...(resto as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}
