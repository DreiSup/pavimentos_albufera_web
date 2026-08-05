'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Acabado, ColorId, ServicioId } from '@/lib/tipos'
import { CODIGO_COLOR, NOMBRE_SERVICIO } from '@/lib/tipos'
import Chip from '../ui/Chip'
import { BotonEtiqueta } from '../ui/EnlaceEtiqueta'
import MuestraAcabado from '../contenido/MuestraAcabado'
import EstadoVacio from '../ui/EstadoVacio'

export default function FiltrosAcabados({
  acabados,
  tecnicas,
  colores,
}: {
  acabados: Acabado[]
  tecnicas: ServicioId[]
  colores: ColorId[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const tecnica = searchParams.get('tecnica') as ServicioId | null
  const color = searchParams.get('color') as ColorId | null

  function actualizar(clave: 'tecnica' | 'color', valor: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (valor) params.set(clave, valor)
    else params.delete(clave)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  function quitarFiltros() {
    router.push('?', { scroll: false })
  }

  const filtrados = useMemo(() => {
    return acabados.filter((a) => {
      if (tecnica && a.servicio !== tecnica) return false
      if (color && a.color !== color) return false
      return true
    })
  }, [acabados, tecnica, color])

  const hayFiltro = Boolean(tecnica || color)
  const resumen = [
    `${filtrados.length} ACABADO${filtrados.length === 1 ? '' : 'S'}`,
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
            <Chip activo={!tecnica} onClick={() => actualizar('tecnica', null)}>
              Todas
            </Chip>
            {tecnicas.map((t) => (
              <Chip key={t} activo={tecnica === t} onClick={() => actualizar('tecnica', t)}>
                {NOMBRE_SERVICIO[t]}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto">
          <span className="font-mono text-d-11 text-acero w-[84px] shrink-0 flex items-center">COLOR</span>
          <div className="flex gap-2">
            <Chip activo={!color} onClick={() => actualizar('color', null)}>
              Todos
            </Chip>
            {colores.map((c) => (
              <Chip key={c} activo={color === c} onClick={() => actualizar('color', c)}>
                {CODIGO_COLOR[c]}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 pt-1">
          <span className="font-mono text-d-12 text-tinta">{resumen}</span>
          {hayFiltro ? (
            <BotonEtiqueta onClick={quitarFiltros} className="border-b-0">
              Quitar filtros ×
            </BotonEtiqueta>
          ) : null}
        </div>
      </div>

      {filtrados.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px_10px] md:gap-[32px_24px]">
          {filtrados.map((a) => (
            <MuestraAcabado key={a.slug} acabado={a} />
          ))}
        </div>
      ) : (
        <EstadoVacio
          titulo="No hay acabados con esta combinación"
          texto="Solo enseñamos acabados con obra ejecutada de verdad. Quita un filtro o pregúntanos por este acabado directamente."
          onQuitarFiltros={quitarFiltros}
        />
      )}
    </div>
  )
}
