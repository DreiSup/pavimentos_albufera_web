'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import type { ModeloId, ServicioId } from '@/lib/tipos'
import { NOMBRE_MODELO, NOMBRE_SERVICIO } from '@/lib/tipos'
import Chip from '../ui/Chip'
import Boton from '../ui/Boton'
import { BotonEtiqueta } from '../ui/EnlaceEtiqueta'
import EstadoVacio from '../ui/EstadoVacio'
import { useFiltrosDeRejilla } from './filtros-en-url'
import type { Filtros } from './filtros-en-url'

/** Los cuatro ejes del índice de obras (README §8). Constante de módulo: identidad estable. */
const CLAVES = ['servicio', 'modelo', 'municipio', 'anio'] as const

type Clave = (typeof CLAVES)[number]
type Grupo = { clave: Clave; etiqueta: string; opciones: string[] }

export default function FiltrosProyectos({
  servicios,
  modelos,
  municipios,
  anios,
  total,
  children,
}: {
  servicios: ServicioId[]
  modelos: ModeloId[]
  municipios: string[]
  anios: number[]
  total: number
  /**
   * Las obras, renderizadas en servidor por `app/proyectos/page.tsx`: una tarjeta por
   * hijo, envuelta en `[data-filtrable]` con sus valores de filtro. Llegan como
   * `children` para que `TarjetaProyecto` siga siendo de servidor.
   */
  children: ReactNode
}) {
  const { filtros, actualizar, quitar, rejilla, visibles, numFiltros } = useFiltrosDeRejilla(
    CLAVES,
    total,
  )
  const [hojaAbierta, setHojaAbierta] = useState(false)
  // El elemento que abrió la hoja, para devolverle el foco al cerrarla.
  const abridor = useRef<HTMLElement | null>(null)

  const grupos: Grupo[] = [
    { clave: 'servicio', etiqueta: 'Servicio', opciones: servicios.map((s) => NOMBRE_SERVICIO[s]) },
    { clave: 'modelo', etiqueta: 'Modelo', opciones: modelos.map((m) => NOMBRE_MODELO[m]) },
    { clave: 'municipio', etiqueta: 'Municipio', opciones: municipios },
    { clave: 'anio', etiqueta: 'Año', opciones: anios.map(String) },
  ]

  const valorDe: Record<Clave, (o: string) => string> = {
    servicio: (etiqueta) => servicios.find((s) => NOMBRE_SERVICIO[s] === etiqueta) ?? etiqueta,
    modelo: (etiqueta) => modelos.find((m) => NOMBRE_MODELO[m] === etiqueta) ?? etiqueta,
    municipio: (etiqueta) => etiqueta,
    anio: (etiqueta) => etiqueta,
  }

  function abrirHoja(evento: MouseEvent<HTMLButtonElement>) {
    abridor.current = evento.currentTarget
    setHojaAbierta(true)
  }

  // Identidad estable: la hoja la usa como dependencia de su efecto, y si cambiara en
  // cada render el foco volvería al principio cada vez que se pulsa un chip.
  const cerrarHoja = useCallback(() => {
    setHojaAbierta(false)
    abridor.current?.focus()
  }, [])

  function quitarFiltros() {
    quitar()
    if (hojaAbierta) cerrarHoja()
  }

  const vacio = visibles === 0
  const resumen = `${visibles} OBRA${visibles === 1 ? '' : 'S'}`

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
          <span className="font-mono text-d-12 text-tinta" aria-live="polite">
            {resumen}
          </span>
          {numFiltros > 0 ? (
            <BotonEtiqueta onClick={quitarFiltros} className="border-b-0">
              Quitar filtros ×
            </BotonEtiqueta>
          ) : null}
        </div>
      </div>

      {/* Móvil: fila única con hoja inferior (01 §3.15) */}
      <div className="md:hidden sticky [top:var(--cabecera-actual)] z-10 bg-fondo border-t border-b border-tinta py-3 flex items-center justify-between gap-3">
        <Boton variante="contorno" type="button" onClick={abrirHoja} className="!min-h-tactil">
          {numFiltros > 0 ? `Filtrar (${numFiltros})` : 'Filtrar'}
        </Boton>
        <span className="font-mono text-d-12 text-tinta" aria-live="polite">
          {resumen}
        </span>
      </div>

      {hojaAbierta ? (
        <HojaFiltros
          grupos={grupos}
          filtros={filtros}
          valorDe={valorDe}
          resumen={resumen}
          onActualizar={actualizar}
          onQuitar={quitarFiltros}
          onCerrar={cerrarHoja}
        />
      ) : null}

      {/* La rejilla no se desmonta al filtrar: se ocultan las tarjetas ya pintadas. */}
      <div ref={rejilla} className={vacio ? 'hidden' : 'grid grid-cols-1 md:grid-cols-3 gap-6'}>
        {children}
      </div>

      {vacio ? (
        <EstadoVacio
          titulo="No hay obras con esta combinación"
          texto="Solo enseñamos obra ejecutada de verdad. Quita un filtro o pregúntanos directamente."
          onQuitarFiltros={quitarFiltros}
        />
      ) : null}
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
  filtros: Filtros<Clave>
  valorDe: Record<Clave, (o: string) => string>
  resumen: string
  onActualizar: (clave: Clave, valor: string | null) => void
  onQuitar: () => void
  onCerrar: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const primerFoco = panelRef.current?.querySelector<HTMLElement>('a, button')
    primerFoco?.focus()

    // Mismo patrón de trampa de foco que `components/layout/MenuMovil.tsx`.
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCerrar()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const focables = panelRef.current.querySelectorAll<HTMLElement>('a, button')
      if (focables.length === 0) return
      const primero = focables[0]
      const ultimo = focables[focables.length - 1]
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
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
