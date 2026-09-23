import type { ReactNode } from 'react'

export type FilaFichaObra = { etiqueta: string; valor: ReactNode }

/**
 * `''` cuenta como ausencia; `0` no, que es un dato. Un `<DatoPendiente>` es un
 * nodo y sobrevive al filtro: las fichas técnicas de `/acabados/` y de los seis
 * servicios siguen enseñando su corchete, que ahí sí es lo acordado.
 */
function tieneDato(valor: ReactNode): boolean {
  return valor !== null && valor !== undefined && valor !== false && valor !== ''
}

/**
 * 01-sistema-de-diseno.md §3.8, segunda variante: ficha de obra completa,
 * barra lateral de la ficha de proyecto y de la ficha de presupuesto.
 *
 * Una fila sin dato no se pinta, y una ficha a la que se le caen todas las filas
 * no se pinta tampoco: ni el título encabezando la nada, ni la caja. Decide el
 * componente, no la pantalla —el mismo reparto que `Foto` y `BloquePosicion`—,
 * así que ninguna página tiene que acordarse de comprobar si el dato existe.
 *
 * Es un filtro de presentación, **no un borrado**: los campos siguen en
 * `content/proyectos.json` y el día que llegue el dato la fila vuelve sola. Por
 * eso el criterio mira el valor y no una lista de etiquetas ocultas.
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
  const visibles = filas.filter((fila) => tieneDato(fila.valor))
  if (visibles.length === 0) return null

  return (
    <div
      className={`sobre-oscuro bg-tinta text-fondo p-[26px] ${sticky ? 'md:sticky md:top-[100px]' : ''} ${className}`}
    >
      <p className="font-mono text-d-11 tracking-[0.08em] uppercase text-sobre-tinta pb-[14px]">
        {titulo}
      </p>
      {visibles.map((fila, i) => (
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
