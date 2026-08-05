import type { ReactNode } from 'react'

export const claseInput =
  'min-h-campo w-full px-[14px] bg-transparent border border-tinta-media font-sans text-16 text-tinta focus-visible:border-tinta aria-[invalid=true]:border-2 aria-[invalid=true]:border-error'

export const claseInputOscuro =
  'min-h-campo w-full px-[14px] bg-transparent border border-sobre-tinta font-sans text-16 text-fondo focus-visible:border-fondo aria-[invalid=true]:border-2 aria-[invalid=true]:border-error'

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
