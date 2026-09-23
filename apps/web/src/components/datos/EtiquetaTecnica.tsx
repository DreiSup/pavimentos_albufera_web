import type { ReactNode } from 'react'

/**
 * 01-sistema-de-diseno.md §3.8, primera variante: etiqueta sobre imagen o
 * como bloque destacado. Una línea por dato.
 */
export default function EtiquetaTecnica({
  lineas,
  className = '',
}: {
  lineas: ReactNode[]
  className?: string
}) {
  return (
    <div className={`sobre-oscuro bg-tinta text-fondo px-[18px] py-[14px] font-mono text-d-11 md:text-d-12 leading-[1.9] tracking-[0.03em] ${className}`}>
      {lineas.map((linea, i) => (
        <p key={i}>{linea}</p>
      ))}
    </div>
  )
}
