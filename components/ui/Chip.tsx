'use client'

import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  activo?: boolean
  sobreOscuro?: boolean
}

export default function Chip({ activo, sobreOscuro, className = '', children, ...resto }: Props) {
  const inactivo = sobreOscuro
    ? 'bg-transparent text-fondo border border-sobre-tinta'
    : 'bg-transparent text-tinta border border-tinta-media'

  return (
    <button
      type="button"
      aria-pressed={Boolean(activo)}
      className={`inline-flex items-center min-h-tactil px-[14px] md:px-[18px] whitespace-nowrap font-mono text-d-11 md:text-d-12 ${
        activo ? 'bg-pigmento text-tinta border border-pigmento' : inactivo
      } ${className}`}
      {...resto}
    >
      {children}
    </button>
  )
}
