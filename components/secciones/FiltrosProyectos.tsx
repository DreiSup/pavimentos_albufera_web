'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import Chip from '../ui/Chip'
import Boton from '../ui/Boton'
import { BotonEtiqueta } from '../ui/EnlaceEtiqueta'
import EstadoVacio from '../ui/EstadoVacio'

export type ClaveFiltro = 'servicio' | 'modelo' | 'municipio' | 'anio'

/** Un grupo de la barra, con la etiqueta visible de cada opción ya resuelta en servidor. */
export type GrupoFiltro = {
  clave: ClaveFiltro
  etiqueta: string
  opciones: { valor: string; nombre: string }[]
}

/**
 * Una obra ya renderizada en servidor (`tarjeta`) más los cuatro valores por los
 * que se filtra. La tarjeta viaja como nodo, no como dato: así `TarjetaProyecto`
 * —y con él `next/image` y `content/proyectos.json`— se quedan fuera del bundle
 * de cliente, que solo decide cuáles de las tarjetas ya hechas se enseñan.
 *
 * La `key` se pone al crear el nodo en la página, no aquí: si se envolviera cada
 * tarjeta en un `<div key>` ese div pasaría a ser el hijo de la rejilla y las
 * tarjetas dejarían de igualarse en altura.
 */
export type ObraFiltrable = {
  clave: string
  valores: Record<ClaveFiltro, string | null>
  tarjeta: ReactNode
}

type Seleccion = Record<ClaveFiltro, string | null>

const SIN_FILTROS: Seleccion = { servicio: null, modelo: null, municipio: null, anio: null }
const CLAVES = Object.keys(SIN_FILTROS) as ClaveFiltro[]

export default function FiltrosProyectos({
  obras,
  grupos,
}: {
  obras: ObraFiltrable[]
  grupos: GrupoFiltro[]
}) {
  const [filtros, setFiltros] = useState<Seleccion>(SIN_FILTROS)
  const [hojaAbierta, setHojaAbierta] = useState(false)

  /**
   * El estado manda y la URL lo sigue, nunca al revés. Leer la URL en el render
   * con `useSearchParams` es lo que sacaba la rejilla entera del HTML estático:
   * las 9 tarjetas y sus enlaces no existían hasta que hidrataba el cliente.
   * Aquí se lee una sola vez, al montar, para que un enlace compartido con
   * `?municipio=…` siga aplicando su filtro.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const inicial = { ...SIN_FILTROS }
    for (const clave of CLAVES) inicial[clave] = params.get(clave)
    if (CLAVES.some((clave) => inicial[clave])) setFiltros(inicial)
  }, [])

  function aplicar(siguiente: Seleccion) {
    setFiltros(siguiente)

    const params = new URLSearchParams()
    for (const clave of CLAVES) {
      const valor = siguiente[clave]
      if (valor) params.set(clave, valor)
    }
    const cadena = params.toString()
    // `replaceState` y no `router.push`: aquí no se cambia de página, y cada
    // navegación del App Router contaba como un `page_view` más en GA4.
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${cadena ? `?${cadena}` : ''}`,
    )
  }

  function actualizar(clave: ClaveFiltro, valor: string | null) {
    aplicar({ ...filtros, [clave]: valor })
  }

  function quitarFiltros() {
    aplicar(SIN_FILTROS)
    setHojaAbierta(false)
  }

  const filtradas = useMemo(
    () => obras.filter((o) => CLAVES.every((c) => !filtros[c] || o.valores[c] === filtros[c])),
    [obras, filtros],
  )

  const numFiltros = CLAVES.filter((clave) => filtros[clave]).length
  const resumen = `${filtradas.length} OBRA${filtradas.length === 1 ? '' : 'S'}`

  return (
    <div className="flex flex-col gap-6">
      {/* Escritorio. Desde `xl` y no desde `md`, medido: con las filas envueltas
          la barra anclada mide 466 px entre 768 y 1279 —MODELO son 16 chips— y
          310 px a partir de 1280, donde solo envuelve MODELO. Medio viewport de
          barra fija encima de la rejilla que se quiere comparar es exactamente
          lo que `design/02` §B3 rechaza al elegir la hoja inferior, y el motivo
          que da —«cuatro grupos con hasta 16 municipios no caben»— sigue siendo
          cierto a 960 px. Por debajo de 1280 manda la hoja, que además es el
          mismo punto donde la cabecera y la barra de contacto siguen en móvil. */}
      <div className="hidden xl:flex sticky [top:var(--cabecera-actual)] z-10 bg-fondo border-t border-b border-tinta py-3 flex-col gap-2">
        {/* Esta barra es solo de escritorio —en móvil manda la hoja de abajo—,
            así que aquí no hay carril que conservar: la fila envuelve y ya. El
            `overflow-x-auto` que había pintaba una barra de scroll clásica bajo
            cada una de las cuatro filas; la de MODELO desbordaba incluso a
            1366 px (contenido 1699 px en una caja de 1255). Los chips se apilan
            con `flex-wrap` y `gap`, igual que en `HojaFiltros` de este mismo
            archivo, que es el tratamiento aprobado para estos grupos.

            `items-start` y no `items-center`: al envolver, centrar dejaba la
            etiqueta a media altura del bloque en vez de junto a la primera
            línea de chips. Los 44 px de la etiqueta la alinean con ellos. */}
        {grupos.map((grupo) => (
          <div key={grupo.clave} className="flex gap-3 items-start">
            <span className="font-mono text-d-11 text-acero w-[84px] shrink-0 min-h-tactil flex items-center">
              {grupo.etiqueta.toUpperCase()}
            </span>
            <div className="flex flex-wrap gap-2">
              <Chip activo={!filtros[grupo.clave]} onClick={() => actualizar(grupo.clave, null)}>
                Todos
              </Chip>
              {grupo.opciones.map((o) => (
                <Chip
                  key={o.valor}
                  activo={filtros[grupo.clave] === o.valor}
                  onClick={() => actualizar(grupo.clave, o.valor)}
                >
                  {o.nombre}
                </Chip>
              ))}
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
      <div className="xl:hidden sticky [top:var(--cabecera-actual)] z-10 bg-fondo border-t border-b border-tinta py-3 flex items-center justify-between gap-3">
        <Boton variante="contorno" type="button" onClick={() => setHojaAbierta(true)} className="!min-h-tactil">
          {numFiltros > 0 ? `Filtrar (${numFiltros})` : 'Filtrar'}
        </Boton>
        <span className="font-mono text-d-12 text-tinta">{resumen}</span>
      </div>

      {hojaAbierta ? (
        <HojaFiltros
          grupos={grupos}
          filtros={filtros}
          resumen={resumen}
          onActualizar={actualizar}
          onQuitar={quitarFiltros}
          onCerrar={() => setHojaAbierta(false)}
        />
      ) : null}

      {filtradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtradas.map((o) => o.tarjeta)}
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
  resumen,
  onActualizar,
  onQuitar,
  onCerrar,
}: {
  grupos: GrupoFiltro[]
  filtros: Seleccion
  resumen: string
  onActualizar: (clave: ClaveFiltro, valor: string | null) => void
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
      className="fixed inset-0 z-40 bg-fondo border-t border-tinta flex flex-col xl:hidden"
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
              {grupo.opciones.map((o) => (
                <Chip
                  key={o.valor}
                  activo={filtros[grupo.clave] === o.valor}
                  onClick={() => onActualizar(grupo.clave, o.valor)}
                >
                  {o.nombre}
                </Chip>
              ))}
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
