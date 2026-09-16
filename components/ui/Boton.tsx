import Link from 'next/link'
import { cva } from 'class-variance-authority'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variante = 'primario' | 'contorno' | 'tinta'

/**
 * 01-sistema-de-diseno.md §3.1–3.4.
 *
 * Las variantes de color viven enteras en `compoundVariants`, de modo que cada
 * combinación emite **un solo** juego de `bg` / `text` / `border`. Al no haber dos
 * utilidades compitiendo por la misma propiedad no hace falta ni `!important` ni
 * fusionar clases en cliente (tailwind-merge pesa 7,5 KB gzip: descartado).
 */
const boton = cva(
  'inline-flex items-center justify-center min-h-campo md:min-h-boton px-6 md:px-[30px] font-sans font-semibold text-16 no-underline transition-colors',
  {
    variants: {
      variante: { primario: '', contorno: '', tinta: '' },
      sobreOscuro: { true: '', false: '' },
      anchoCompleto: { true: 'w-full', false: '' },
      deshabilitado: { true: 'cursor-not-allowed', false: '' },
    },
    compoundVariants: [
      // §3.1 Botón primario (ocre)
      {
        variante: 'primario',
        deshabilitado: false,
        class: 'btn-primario bg-pigmento text-tinta border border-pigmento hover:bg-pigmento-hover',
      },
      // §3.3 Botón de relleno en tinta
      {
        variante: 'tinta',
        deshabilitado: false,
        class: 'bg-tinta text-fondo border border-tinta hover:bg-acero',
      },
      // §3.2 Botón de contorno, sobre fondo claro y sobre fondo oscuro
      {
        variante: 'contorno',
        sobreOscuro: false,
        deshabilitado: false,
        class: 'bg-transparent text-tinta border border-tinta hover:bg-tinta hover:text-fondo',
      },
      {
        variante: 'contorno',
        sobreOscuro: true,
        deshabilitado: false,
        class: 'bg-transparent text-fondo border border-sobre-tinta hover:bg-fondo hover:text-tinta',
      },
      // §3.4 Estado deshabilitado: un único tratamiento, gane la variante que gane
      {
        deshabilitado: true,
        class: 'bg-fondo-alt text-tinta-media border border-fondo-alt',
      },
    ],
    defaultVariants: {
      variante: 'primario',
      sobreOscuro: false,
      anchoCompleto: false,
      deshabilitado: false,
    },
  },
)

type Comun = {
  variante?: Variante
  sobreOscuro?: boolean
  anchoCompleto?: boolean
  children: ReactNode
  className?: string
}

type ComoBoton = Comun & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

/** `disabled` no existe en un `<a>`: se prohíbe en vez de derramarlo como atributo inválido. */
type ComoEnlace = Comun & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; disabled?: never }

export default function Boton(props: ComoBoton | ComoEnlace) {
  const {
    variante = 'primario',
    sobreOscuro = false,
    anchoCompleto = false,
    children,
    className = '',
    ...resto
  } = props

  if ('href' in props && props.href) {
    const { href, ...anchorRest } = resto as ComoEnlace
    return (
      <Link
        href={href}
        className={boton({ variante, sobreOscuro, anchoCompleto, class: className })}
        {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    )
  }

  const botonRest = resto as ButtonHTMLAttributes<HTMLButtonElement>

  return (
    <button
      className={boton({
        variante,
        sobreOscuro,
        anchoCompleto,
        deshabilitado: Boolean(botonRest.disabled),
        class: className,
      })}
      {...botonRest}
    >
      {children}
    </button>
  )
}
