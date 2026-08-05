import type { ReactNode } from 'react'

const proporciones = {
  '21/9': 'aspect-[21/9]',
  '4/3': 'aspect-[4/3]',
  '16/10': 'aspect-[16/10]',
  '16/9': 'aspect-[16/9]',
  '1': 'aspect-square',
  '3/4': 'aspect-[3/4]',
} as const

/**
 * Sustituye a cualquier imagen provisional mientras no haya originales
 * (01-sistema-de-diseno.md §3.11). Nunca se usa una foto de stock en su lugar.
 */
export default function BloquePosicion({
  proporcion,
  fina = false,
  etiqueta,
  className = '',
  children,
}: {
  proporcion: keyof typeof proporciones
  fina?: boolean
  etiqueta?: ReactNode
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      className={`relative trama ${fina ? 'trama-fina' : ''} ${proporciones[proporcion]} ${className}`}
    >
      <span className="absolute top-3 left-3 font-mono text-d-11 tracking-[0.05em] text-tinta-media">
        PENDIENTE · ORIGINAL A 2400 PX
      </span>
      {etiqueta ? <div className="absolute bottom-0 right-0">{etiqueta}</div> : null}
      {children}
    </div>
  )
}
