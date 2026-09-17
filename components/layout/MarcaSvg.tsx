import { AZULES_MARCA } from '@/lib/marca'

/**
 * La marca: un camino de baldosas que se aleja. Recreación en SVG del logotipo
 * de la empresa mientras no llegue el original vectorial (ver `design/01-sistema-de-diseno.md §2.7`).
 *
 * Cada baldosa lleva **un solo azul plano**: el degradado lo hace la escala entre
 * baldosas, nunca dentro de una. Es decisión de marca, no un efecto.
 *
 * Los datos son geometría generada, no dibujo a mano: fila, cx, cy, rx, ry e índice
 * en `AZULES_MARCA`. Guardarlos así en vez de 62 elementos JSX deja el fichero legible
 * y permite derivar las dos variantes de la misma fuente:
 *
 *   completa  las 16 filas — pie y cabecera en reposo
 *   mini      las 10 primeras — cabecera compacta de 60 px, donde la estela lejana
 *             ya no se resuelve y solo aporta ruido
 *
 * Sobre fondo oscuro la rampa sube dos pasos (`sobreOscuro`): los azules del frente
 * son casi negros y se perderían contra `--tinta`. Comprobado en maqueta.
 *
 * Decorativa: siempre va junto al nombre en texto, que es quien da el nombre
 * accesible. Por eso `aria-hidden`.
 */
type Baldosa = [fila: number, cx: number, cy: number, rx: number, ry: number, azul: number]

const BALDOSAS: Baldosa[] = [
  [0, -89.1, 0, 18.4, 7.4, 0],
  [0, -44.5, 0, 18.4, 7.4, 0],
  [0, 0, 0, 18.4, 7.4, 0],
  [0, 44.5, 0, 18.4, 7.4, 0],
  [0, 89.1, 0, 18.4, 7.4, 0],
  [1, -68.8, -17.2, 16.7, 6.7, 0],
  [1, -28.5, -17.2, 16.7, 6.7, 0],
  [1, 11.9, -17.2, 16.7, 6.7, 0],
  [1, 52.2, -17.2, 16.7, 6.7, 0],
  [1, 92.6, -17.2, 16.7, 6.7, 0],
  [2, -68.7, -32.7, 15, 6, 1],
  [2, -32.3, -32.7, 15, 6, 1],
  [2, 4, -32.7, 15, 6, 1],
  [2, 40.3, -32.7, 15, 6, 1],
  [2, 76.7, -32.7, 15, 6, 1],
  [3, -51.8, -46.7, 13.4, 5.4, 4],
  [3, -19.3, -46.7, 13.4, 5.4, 1],
  [3, 13.2, -46.7, 13.4, 5.4, 1],
  [3, 45.7, -46.7, 13.4, 5.4, 1],
  [3, 78.2, -46.7, 13.4, 5.4, 1],
  [4, -51.3, -59.1, 11.9, 4.8, 2],
  [4, -22.4, -59.1, 11.9, 4.8, 2],
  [4, 6.4, -59.1, 11.9, 4.8, 2],
  [4, 35.2, -59.1, 11.9, 4.8, 2],
  [4, 64, -59.1, 11.9, 4.8, 2],
  [5, -37.8, -70, 10.5, 4.2, 2],
  [5, -12.4, -70, 10.5, 4.2, 2],
  [5, 12.9, -70, 10.5, 4.2, 2],
  [5, 38.2, -70, 10.5, 4.2, 5],
  [5, 63.5, -70, 10.5, 4.2, 2],
  [6, -37.4, -79.6, 9.1, 3.6, 3],
  [6, -15.4, -79.6, 9.1, 3.6, 3],
  [6, 6.6, -79.6, 9.1, 3.6, 3],
  [6, 28.7, -79.6, 9.1, 3.6, 3],
  [6, 50.7, -79.6, 9.1, 3.6, 3],
  [7, -18, -87.9, 7.8, 3.1, 3],
  [7, 0.9, -87.9, 7.8, 3.1, 3],
  [7, 19.8, -87.9, 7.8, 3.1, 3],
  [7, 38.7, -87.9, 7.8, 3.1, 3],
  [8, -19.7, -95, 6.6, 2.6, 3],
  [8, -3.7, -95, 6.6, 2.6, 3],
  [8, 12.4, -95, 6.6, 2.6, 3],
  [8, 28.4, -95, 6.6, 2.6, 3],
  [9, -14.6, -100.9, 5.5, 2.2, 4],
  [9, -1.2, -100.9, 5.5, 2.2, 4],
  [9, 12.1, -100.9, 5.5, 2.2, 4],
  [9, 25.4, -100.9, 5.5, 2.2, 4],
  [10, -11.4, -105.8, 4.5, 1.8, 4],
  [10, -0.5, -105.8, 4.5, 1.8, 4],
  [10, 10.4, -105.8, 4.5, 1.8, 4],
  [11, -10.5, -109.8, 3.6, 1.4, 5],
  [11, -1.8, -109.8, 3.6, 1.4, 5],
  [11, 6.9, -109.8, 3.6, 1.4, 5],
  [12, -14.4, -112.9, 2.8, 1.1, 5],
  [12, -7.7, -112.9, 2.8, 1.1, 5],
  [12, -0.9, -112.9, 2.8, 1.1, 5],
  [13, -13.2, -115.4, 2.1, 0.9, 6],
  [13, -8, -115.4, 2.1, 0.9, 6],
  [14, -18.4, -117.2, 1.7, 0.7, 6],
  [14, -14.4, -117.2, 1.7, 0.7, 6],
  [15, -21.9, -118.7, 1.4, 0.6, 7],
  [15, -18.5, -118.7, 1.4, 0.6, 7],
]

const CORTE_MINI = 10
const CAJA_COMPLETA = '-109 -120.8 219.8 129.7'
const CAJA_MINI = '-109 -104.6 219.8 113.5'

export default function MarcaSvg({
  variante = 'completa',
  sobreOscuro = false,
  className = '',
}: {
  variante?: 'completa' | 'mini'
  sobreOscuro?: boolean
  className?: string
}) {
  const mini = variante === 'mini'
  const baldosas = mini ? BALDOSAS.filter((b) => b[0] < CORTE_MINI) : BALDOSAS
  const desplazamiento = sobreOscuro ? 2 : 0

  return (
    <svg
      viewBox={mini ? CAJA_MINI : CAJA_COMPLETA}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {baldosas.map(([, cx, cy, rx, ry, azul], i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill={AZULES_MARCA[Math.min(AZULES_MARCA.length - 1, azul + desplazamiento)]}
        />
      ))}
    </svg>
  )
}
