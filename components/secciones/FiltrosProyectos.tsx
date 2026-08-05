'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ModeloId, Proyecto, ServicioId } from '@/lib/tipos'
import { NOMBRE_MODELO, NOMBRE_SERVICIO } from '@/lib/tipos'
import Chip from '../ui/Chip'
import Boton from '../ui/Boton'
import { BotonEtiqueta } from '../ui/EnlaceEtiqueta'
import TarjetaProyecto from '../contenido/TarjetaProyecto'
import EstadoVacio from '../ui/EstadoVacio'

type Grupo = { clave: 'servicio' | 'modelo' | 'municipio' | 'anio'; etiqueta: string; opciones: string[] }

export default function FiltrosProyectos({
  proyectos,
  servicios,
  modelos,
  municipios,
  anios,
}: {
  proyectos: Proyecto[]
  servicios: ServicioId[]
  modelos: ModeloId[]
  municipios: string[]
  anios: number[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [hojaAbierta, setHojaAbierta] = useState(false)

  const filtros = {
    servicio: searchParams.get('servicio'),
    modelo: searchParams.get('modelo'),
    municipio: searchParams.get('municipio'),
    anio: searchParams.get('anio'),
  }

  const grupos: Grupo[] = [
    { clave: 'servicio', etiqueta: 'Servicio', opciones: servicios.map((s) => NOMBRE_SERVICIO[s]) },
    { clave: 'modelo', etiqueta: 'Modelo', opciones: modelos.map((m) => NOMBRE_MODELO[m]) },
    { clave: 'municipio', etiqueta: 'Municipio', opciones: municipios },
    { clave: 'anio', etiqueta: 'Año', opciones: anios.map(String) },
  ]

  const valorDe: Record<Grupo['clave'], (o: string) => string> = {
    servicio: (etiqueta) => servicios.find((s) => NOMBRE_SERVICIO[s] === etiqueta) ?? etiqueta,
    modelo: (etiqueta) => modelos.find((m) => NOMBRE_MODELO[m] === etiqueta) ?? etiqueta,
    municipio: (etiqueta) => etiqueta,
    anio: (etiqueta) => etiqueta,
  }

  function actualizar(clave: Grupo['clave'], valor: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (valor) params.set(clave, valor)
    else params.delete(clave)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  function quitarFiltros() {
    router.push('?', { scroll: false })
    setHojaAbierta(false)
  }

  const filtrados = useMemo(() => {
    return proyectos.filter((p) => {
      if (filtros.servicio && p.servicio !== filtros.servicio) return false
      if (filtros.modelo && p.modelo !== filtros.modelo) return false
      if (filtros.municipio && p.municipio !== filtros.municipio) return false
      if (filtros.anio && String(p.anio) !== filtros.anio) return false
      return true
    })
  }, [proyectos, filtros.servicio, filtros.modelo, filtros.municipio, filtros.anio])

  const numFiltros = Object.values(filtros).filter(Boolean).length
  const resumen = `${filtrados.length} OBRA${filtrados.length === 1 ? '' : 'S'}`

  return (
    <div className="flex flex-col gap-6">
      {/* Escritorio */}
      <div className="hidden md:flex sticky [top:var(--cabecera-actual)] z-10 bg-fondo border-t border-b border-tinta py-3 flex-col gap-2">
        {grupos.map((grupo) => (
          <div key={grupo.clave} className="flex gap-3 overflow-x-auto items-center">
            <span className="font-mono text-d-11 text-acero w-[84px] shrink-0">
              {grupo.etiqueta.toUpperCase()}
            </span>
            <div className="flex gap-2">
              <Chip activo={!filtros[grupo.clave]} onClick={() => actualizar(grupo.clave, null)}>
                Todos
              </Chip>
              {grupo.opciones.map((o) => {
                const valor = valorDe[grupo.clave](o)
                return (
                  <Chip
                    key={o}
                    activo={filtros[grupo.clave] === valor}
                    onClick={() => actualizar(grupo.clave, valor)}
                  >
                    {o}
                  </Chip>
                )
              })}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-4 pt-1">
          <span className="font-mono text-d-12 text-tinta">{resumen}</span>
          {numFiltros > 0 ? (
            <BotonEtiqueta onClick={quitarFiltros} className="border-b-0">
              Quitar filtros ×
            </BotonEtiqueta>
          ) : null}
        </div>
      </div>

      {/* Móvil: fila única con hoja inferior (01 §3.15) */}
      <div className="md:hidden sticky [top:var(--cabecera-actual)] z-10 bg-fondo border-t border-b border-tinta py-3 flex items-center justify-between gap-3">
        <Boton variante="contorno" type="button" onClick={() => setHojaAbierta(true)} className="!min-h-tactil">
          {numFiltros > 0 ? `Filtrar (${numFiltros})` : 'Filtrar'}
        </Boton>
        <span className="font-mono text-d-12 text-tinta">{resumen}</span>
      </div>

      {hojaAbierta ? (
        <HojaFiltros
          grupos={grupos}
          filtros={filtros}
          valorDe={valorDe}
          resumen={resumen}
          onActualizar={actualizar}
          onQuitar={quitarFiltros}
          onCerrar={() => setHojaAbierta(false)}
        />
      ) : null}

      {filtrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtrados.map((p) => (
            <TarjetaProyecto key={p.slug} proyecto={p} />
          ))}
        </div>
      ) : (
        <EstadoVacio
          titulo="No hay obras con esta combinación"
          texto="Solo enseñamos obra ejecutada de verdad. Quita un filtro o pregúntanos directamente."
          onQuitarFiltros={quitarFiltros}
        />
      )}
    </div>
  )
}

function HojaFiltros({
  grupos,
  filtros,
  valorDe,
  resumen,
  onActualizar,
  onQuitar,
  onCerrar,
}: {
  grupos: Grupo[]
  filtros: Record<Grupo['clave'], string | null>
  valorDe: Record<Grupo['clave'], (o: string) => string>
  resumen: string
  onActualizar: (clave: Grupo['clave'], valor: string | null) => void
  onQuitar: () => void
  onCerrar: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const primerFoco = panelRef.current?.querySelector<HTMLElement>('button')
    primerFoco?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onCerrar])

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Filtrar proyectos"
      className="fixed inset-0 z-40 bg-fondo border-t border-tinta flex flex-col md:hidden"
    >
      <div className="flex items-center justify-between px-[18px] py-4 border-b border-tinta">
        <span className="font-mono text-d-12 uppercase tracking-[0.05em]">Filtrar</span>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onCerrar}
          className="min-w-tactil min-h-tactil inline-flex items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 4l16 16M20 4L4 20" stroke="#1B1E1C" strokeWidth="2" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-[18px] py-4 flex flex-col gap-6">
        {grupos.map((grupo) => (
          <div key={grupo.clave} className="flex flex-col gap-2">
            <span className="font-mono text-d-11 text-acero">{grupo.etiqueta.toUpperCase()}</span>
            <div className="flex flex-wrap gap-2">
              <Chip activo={!filtros[grupo.clave]} onClick={() => onActualizar(grupo.clave, null)}>
                Todos
              </Chip>
              {grupo.opciones.map((o) => {
                const valor = valorDe[grupo.clave](o)
                return (
                  <Chip
                    key={o}
                    activo={filtros[grupo.clave] === valor}
                    onClick={() => onActualizar(grupo.clave, valor)}
                  >
                    {o}
                  </Chip>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-tinta px-[18px] py-4 flex gap-3">
        <Boton variante="contorno" type="button" onClick={onQuitar} className="flex-1">
          Quitar filtros
        </Boton>
        <Boton variante="primario" type="button" onClick={onCerrar} className="flex-1">
          Ver {resumen.toLowerCase()}
        </Boton>
      </div>
    </div>
  )
}
