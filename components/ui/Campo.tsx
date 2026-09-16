import { cva } from 'class-variance-authority'
import type { ReactNode } from 'react'

/**
 * 01-sistema-de-diseno.md §3.7. La base es común y solo el borde y el color del
 * texto cambian sobre fondo oscuro, así que la variante emite una sola vez cada
 * propiedad: nada que fusionar ni que marcar como `!important`.
 */
const input = cva(
  'min-h-campo w-full px-[14px] bg-transparent font-sans text-16 aria-[invalid=true]:border-2 aria-[invalid=true]:border-error',
  {
    variants: {
      sobreOscuro: {
        false: 'border border-tinta-media text-tinta focus-visible:border-tinta',
        true: 'border border-sobre-tinta text-fondo focus-visible:border-fondo',
      },
    },
    defaultVariants: { sobreOscuro: false },
  },
)

export const claseInput = input()

export const claseInputOscuro = input({ sobreOscuro: true })

type Props = {
  etiqueta: string
  htmlFor: string
  obligatorio?: boolean
  ayuda?: string
  error?: string
  children: ReactNode
  className?: string
}

export default function Campo({ etiqueta, htmlFor, obligatorio, ayuda, error, children, className = '' }: Props) {
  return (
    <div className={`flex flex-col gap-[6px] ${className}`}>
      <label
        htmlFor={htmlFor}
        className="font-mono text-d-11 tracking-[0.06em] uppercase text-acero"
      >
        {etiqueta}
        {obligatorio ? ' *' : ''}
      </label>
      {children}
      {ayuda ? <p className="font-sans text-14 text-tinta-media">{ayuda}</p> : null}
      {error ? (
        <p className="font-sans text-14 font-semibold text-error" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  )
}
