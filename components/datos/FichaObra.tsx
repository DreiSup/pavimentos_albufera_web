import type { ReactNode } from 'react'

export type FilaFichaObra = { etiqueta: string; valor: ReactNode }

/**
 * 01-sistema-de-diseno.md §3.8, segunda variante: ficha de obra completa,
 * barra lateral de la ficha de proyecto y de la ficha de presupuesto.
 */
export default function FichaObra({
  titulo,
  filas,
  className = '',
  sticky = false,
}: {
  titulo: string
  filas: FilaFichaObra[]
  className?: string
  sticky?: boolean
}) {
  return (
    <div
      className={`sobre-oscuro bg-tinta text-fondo p-[26px] ${sticky ? 'md:sticky md:top-[100px]' : ''} ${className}`}
    >
      <p className="font-mono text-d-11 tracking-[0.08em] uppercase text-sobre-tinta pb-[14px]">
        {titulo}
      </p>
      {filas.map((fila, i) => (
        <div
          key={i}
          className="flex justify-between gap-4 py-[11px] border-t border-acero font-mono text-d-11"
        >
          <span className="text-sobre-tinta">{fila.etiqueta}</span>
          <span className="text-fondo text-right">{fila.valor}</span>
        </div>
      ))}
    </div>
  )
}
