'use client'

import type { ReactNode } from 'react'
import type { ColorId, ServicioId } from '@/lib/tipos'
import { CODIGO_COLOR, NOMBRE_SERVICIO } from '@/lib/tipos'
import Chip from '../ui/Chip'
import { BotonEtiqueta } from '../ui/EnlaceEtiqueta'
import EstadoVacio from '../ui/EstadoVacio'
import { registrarEvento } from '@/lib/eventos'
import { useFiltrosDeRejilla } from './filtros-en-url'

/** Los dos ejes del muestrario (README §8). Constante de módulo: identidad estable. */
const CLAVES = ['tecnica', 'color'] as const

export default function FiltrosAcabados({
  tecnicas,
  colores,
  total,
  children,
}: {
  tecnicas: ServicioId[]
  colores: ColorId[]
  total: number
  /**
   * La rejilla completa, renderizada en servidor por `app/acabados/page.tsx`:
   * una muestra por hijo, envuelta en `[data-filtrable]` con sus valores de filtro.
   * Llega como `children` para que `MuestraAcabado` siga siendo de servidor y no
   * entre en el bundle de cliente.
   */
  children: ReactNode
}) {
  const { filtros, actualizar, quitar, rejilla, visibles } = useFiltrosDeRejilla(CLAVES, total)

  function cambiar(clave: (typeof CLAVES)[number], valor: string | null) {
    actualizar(clave, valor)
    registrarEvento('filtro_muestrario', { params: { [clave]: valor ?? 'todos' } })
  }

  // Para el resumen solo vale un valor que exista en el inventario; los chips, en
  // cambio, miran el valor crudo, así una URL con un valor inventado no marca ninguno.
  const tecnica = tecnicas.find((t) => t === filtros.tecnica)
  const color = colores.find((c) => c === filtros.color)

  const hayFiltro = Boolean(filtros.tecnica || filtros.color)
  const vacio = visibles === 0
  const resumen = [
    `${visibles} ACABADO${visibles === 1 ? '' : 'S'}`,
    tecnica ? NOMBRE_SERVICIO[tecnica].toUpperCase() : null,
    color ? CODIGO_COLOR[color] : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky [top:var(--cabecera-actual)] z-10 bg-fondo border-t border-b border-tinta py-3 flex flex-col gap-2">
        <div className="flex gap-3 overflow-x-auto">
          <span className="font-mono text-d-11 text-acero w-[84px] shrink-0 flex items-center">TÉCNICA</span>
          <div className="flex gap-2">
            <Chip activo={!filtros.tecnica} onClick={() => cambiar('tecnica', null)}>
              Todas
            </Chip>
            {tecnicas.map((t) => (
              <Chip key={t} activo={filtros.tecnica === t} onClick={() => cambiar('tecnica', t)}>
                {NOMBRE_SERVICIO[t]}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto">
          <span className="font-mono text-d-11 text-acero w-[84px] shrink-0 flex items-center">COLOR</span>
          <div className="flex gap-2">
            <Chip activo={!filtros.color} onClick={() => cambiar('color', null)}>
              Todos
            </Chip>
            {colores.map((c) => (
              <Chip key={c} activo={filtros.color === c} onClick={() => cambiar('color', c)}>
                {CODIGO_COLOR[c]}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 pt-1">
          <span className="font-mono text-d-12 text-tinta" aria-live="polite">
            {resumen}
          </span>
          {hayFiltro ? (
            <BotonEtiqueta onClick={quitar} className="border-b-0">
              Quitar filtros ×
            </BotonEtiqueta>
          ) : null}
        </div>
      </div>

      {/* La rejilla no se desmonta al filtrar: se ocultan los envoltorios ya pintados. */}
      <div
        ref={rejilla}
        className={
          vacio ? 'hidden' : 'grid grid-cols-2 md:grid-cols-4 gap-[14px_10px] md:gap-[32px_24px]'
        }
      >
        {children}
      </div>

      {vacio ? (
        <EstadoVacio
          titulo="No hay acabados con esta combinación"
          texto="Solo enseñamos acabados con obra ejecutada de verdad. Quita un filtro o pregúntanos por este acabado directamente."
          onQuitarFiltros={quitar}
        />
      ) : null}
    </div>
  )
}
