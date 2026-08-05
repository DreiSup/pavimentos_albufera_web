import type { ReactNode } from 'react'

export type FilaTablaTecnica = { etiqueta: string; valor: ReactNode }

/**
 * 01-sistema-de-diseno.md §3.8, tercera variante: tabla de ficha técnica
 * sobre fondo claro (página de servicio). En móvil se apila en pares,
 * no se comprime.
 */
export default function TablaFichaTecnica({ filas }: { filas: FilaTablaTecnica[] }) {
  return (
    <dl className="font-mono text-d-14 tracking-[0.03em]">
      {filas.map((fila, i) => {
        const esUltima = i === filas.length - 1
        return (
          <div
            key={i}
            className={`grid grid-cols-1 md:grid-cols-[1fr_340px] gap-1 md:gap-6 py-4 ${
              esUltima ? 'border-b border-tinta' : 'border-b border-fondo-alt'
            }`}
          >
            <dt className="text-acero text-d-10 md:text-d-14">{fila.etiqueta}</dt>
            <dd className="text-tinta text-d-12 md:text-d-14 m-0">{fila.valor}</dd>
          </div>
        )
      })}
    </dl>
  )
}
