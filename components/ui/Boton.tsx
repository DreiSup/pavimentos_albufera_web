import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variante = 'primario' | 'contorno' | 'tinta'

type Comun = {
  variante?: Variante
  sobreOscuro?: boolean
  anchoCompleto?: boolean
  children: ReactNode
  className?: string
}

const base =
  'inline-flex items-center justify-center min-h-campo md:min-h-boton px-6 md:px-[30px] font-sans font-semibold text-16 no-underline transition-colors'

function clasesVariante(variante: Variante, sobreOscuro?: boolean) {
  if (variante === 'primario') {
    return 'btn-primario bg-pigmento text-tinta border border-pigmento hover:bg-pigmento-hover'
  }
  if (variante === 'tinta') {
    return 'bg-tinta text-fondo border border-tinta hover:bg-acero'
  }
  // contorno
  return sobreOscuro
    ? 'bg-transparent text-fondo border border-sobre-tinta hover:bg-fondo hover:text-tinta'
    : 'bg-transparent text-tinta border border-tinta hover:bg-tinta hover:text-fondo'
}

type ComoBoton = Comun & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type ComoEnlace = Comun &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; disabled?: boolean }

export default function Boton(props: ComoBoton | ComoEnlace) {
  const { variante = 'primario', sobreOscuro, anchoCompleto, children, className = '', ...resto } = props
  const clases = `${base} ${clasesVariante(variante, sobreOscuro)} ${anchoCompleto ? 'w-full' : ''} ${
    resto.disabled ? '!bg-fondo-alt !text-tinta-media !border-fondo-alt !cursor-not-allowed' : ''
  } ${className}`

  if ('href' in props && props.href) {
    const { href, ...anchorRest } = resto as ComoEnlace
    return (
      <Link href={href} className={clases} {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    )
  }

  return (
    <button className={clases} {...(resto as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
