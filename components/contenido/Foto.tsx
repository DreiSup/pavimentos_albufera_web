import Image from 'next/image'
import type { ReactNode } from 'react'
import type { Imagen } from '@/lib/tipos'
import BloquePosicion, { PROPORCIONES } from './BloquePosicion'

/**
 * Fotografía de obra (01-sistema-de-diseno.md §3.11).
 *
 * Sin `imagen` cae en `<BloquePosicion>`: la ausencia de original sigue siendo
 * visible, no se maquilla. Por eso todas las pantallas usan este componente y
 * ninguna decide por su cuenta si hay foto o no.
 */
export default function Foto({
  imagen,
  proporcion,
  fina = false,
  etiqueta,
  className = '',
  tamanos,
  prioridad = false,
  children,
}: {
  imagen?: Imagen
  proporcion: keyof typeof PROPORCIONES
  fina?: boolean
  etiqueta?: ReactNode
  className?: string
  /** `sizes` de next/image. Sin él asume 100vw y sirve un original de más. */
  tamanos: string
  /**
   * Solo en la imagen sobre el pliegue de cada pantalla. Una por pantalla.
   * `priority` de next/image emite el preload, pero no marca el `<img>`: por eso
   * va además `fetchPriority="high"`, que es lo que ordena la cola de descarga.
   */
  prioridad?: boolean
  children?: ReactNode
}) {
  if (!imagen) {
    return (
      <BloquePosicion
        proporcion={proporcion}
        fina={fina}
        etiqueta={etiqueta}
        className={className}
      >
        {children}
      </BloquePosicion>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-fondo-alt ${PROPORCIONES[proporcion]} ${className}`}>
      <Image
        src={imagen.src}
        alt={imagen.alt}
        fill
        sizes={tamanos}
        priority={prioridad}
        fetchPriority={prioridad ? 'high' : undefined}
        className="object-cover"
      />
      {etiqueta ? <div className="absolute bottom-0 right-0">{etiqueta}</div> : null}
      {children}
    </div>
  )
}
