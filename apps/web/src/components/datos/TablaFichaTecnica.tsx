import type { ReactNode } from 'react'

export type FilaTablaTecnica = { etiqueta: string; valor: ReactNode }

/**
 * 01-sistema-de-diseno.md §3.8, tercera variante: tabla de ficha técnica
 * sobre fondo claro (página de servicio). En móvil se apila en pares,
 * no se comprime.
 *
 * **«En pares» empieza en `xl`, no en `md`.** La pista de 340 px es fija, así
 * que la fila entera no podía medir menos de 446 px —340 + 24 de hueco + la
 * etiqueta—, y esta tabla vive dentro del `380px 1fr` de la sección: 380 + 64 +
 * 446 + 96 de gutter son **986 px de ancho de contenido**. Por debajo la tabla
 * empujaba la página, y ese era el resto del scroll horizontal de las seis
 * páginas de servicio una vez arreglado el hero: 44 px a 960 en `/hormigon-lavado/`.
 * Encima de 1280 la tabla es la de §3.8; por debajo, la apilada, que es la que
 * este mismo párrafo ya describía y la que «no se comprime».
 */
export default function TablaFichaTecnica({ filas }: { filas: FilaTablaTecnica[] }) {
  return (
    <dl className="font-mono text-d-14 tracking-[0.03em]">
      {filas.map((fila, i) => {
        const esUltima = i === filas.length - 1
        return (
          <div
            key={i}
            className={`grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-1 xl:gap-6 py-4 ${
              esUltima ? 'border-b border-tinta' : 'border-b border-fondo-alt'
            }`}
          >
            <dt className="text-acero text-d-10 xl:text-d-14">{fila.etiqueta}</dt>
            <dd className="text-tinta text-d-12 xl:text-d-14 m-0">{fila.valor}</dd>
          </div>
        )
      })}
    </dl>
  )
}
