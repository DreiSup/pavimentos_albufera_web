'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Chip from '../ui/Chip'
import { BotonEtiqueta } from '../ui/EnlaceEtiqueta'
import EstadoVacio from '../ui/EstadoVacio'
import { EVENTOS, registrarEvento } from '@/lib/eventos'

export type ClaveAcabado = 'tecnica' | 'color'

/**
 * Una fila de la barra. `todos` es el texto del chip que quita el filtro, y va
 * en el dato porque la fila de técnica dice «Todas» y la de color «Todos».
 */
export type GrupoAcabados = {
  clave: ClaveAcabado
  etiqueta: string
  todos: string
  opciones: { valor: string; nombre: string }[]
}

/**
 * Una muestra ya renderizada en servidor más los dos valores por los que se
 * filtra. La muestra viaja como nodo, no como dato: así `MuestraAcabado` —y con
 * él `next/image` y los JSON de `lib/datos`, que importa para resolver el
 * municipio— se quedan fuera del bundle de cliente.
 *
 * La `key` se pone al crear el nodo en la página, no aquí: envolver cada muestra
 * en un `<div key>` haría de ese div el hijo de la rejilla.
 */
export type AcabadoFiltrable = {
  clave: string
  valores: Record<ClaveAcabado, string>
  muestra: ReactNode
}

type Seleccion = Record<ClaveAcabado, string | null>

const SIN_FILTROS: Seleccion = { tecnica: null, color: null }
const CLAVES = Object.keys(SIN_FILTROS) as ClaveAcabado[]

export default function FiltrosAcabados({
  muestras,
  grupos,
}: {
  muestras: AcabadoFiltrable[]
  grupos: GrupoAcabados[]
}) {
  const [filtros, setFiltros] = useState<Seleccion>(SIN_FILTROS)

  /**
   * El estado manda y la URL lo sigue, nunca al revés. Leer la URL en el render
   * con `useSearchParams` es lo que sacaba las 16 muestras del HTML estático.
   * Aquí se lee una sola vez, al montar, para que `?tecnica=impreso&color=gris`
   * —el enlace compartible que pide 02-pantallas §A3— siga funcionando.
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

  function actualizar(clave: ClaveAcabado, valor: string | null) {
    aplicar({ ...filtros, [clave]: valor })
    registrarEvento(EVENTOS.samplesFilter, {
      params: { filter_type: clave, filter_value: valor ?? 'todos' },
    })
  }

  function quitarFiltros() {
    aplicar(SIN_FILTROS)
    // Poner un filtro se medía y quitarlos todos de golpe no, así que el embudo
    // de filtrado quedaba cojo por un lado. Mismo vocabulario del contrato: no
    // hay nombre ni parámetro nuevo que registrar en GA4.
    registrarEvento(EVENTOS.samplesFilter, {
      params: { filter_type: 'todos', filter_value: 'todos' },
    })
  }

  const filtrados = useMemo(
    () => muestras.filter((m) => CLAVES.every((c) => !filtros[c] || m.valores[c] === filtros[c])),
    [muestras, filtros],
  )

  const hayFiltro = CLAVES.some((clave) => filtros[clave])
  const resumen = [
    `${filtrados.length} ACABADO${filtrados.length === 1 ? '' : 'S'}`,
    ...grupos.map((grupo) => {
      const valor = filtros[grupo.clave]
      if (!valor) return null
      const opcion = grupo.opciones.find((o) => o.valor === valor)
      return (opcion?.nombre ?? valor).toUpperCase()
    }),
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky [top:var(--cabecera-actual)] z-10 bg-fondo border-t border-b border-tinta py-3 flex flex-col gap-2">
        {/* Móvil, carril deslizante; escritorio, la fila envuelve. Las dos mitades
            son literalmente lo que pide `design/02` §A3: «Fila 1: TÉCNICA …» en
            escritorio y «dos carriles de chips deslizantes» en móvil. Lo que
            había era el carril en los dos, y de 768 px para arriba eso pintaba
            una barra de scroll clásica de 15 px bajo cada fila (medido a 960:
            contenido 1093 px en una caja de 849).

            Envolver y no ensanchar el carril: los chips ya se apilan así en la
            hoja de filtros de `FiltrosProyectos`, que es el tratamiento aprobado
            para estos mismos grupos. Sale con `flex-wrap` y `gap`, sin un solo
            margen por elemento, y el `row-gap` viene del mismo `gap-2`.

            `items-start` en la fila y `min-h-tactil` en la etiqueta: al envolver
            en dos o tres líneas, `items-center` centraba la etiqueta contra el
            bloque entero en vez de contra la primera línea de chips. */}
        {grupos.map((grupo) => (
          <div key={grupo.clave} className="flex gap-3 items-start overflow-x-auto md:overflow-x-visible">
            <span className="font-mono text-d-11 text-acero w-[84px] shrink-0 min-h-tactil flex items-center">
              {grupo.etiqueta.toUpperCase()}
            </span>
            <div className="flex gap-2 md:flex-wrap">
              <Chip activo={!filtros[grupo.clave]} onClick={() => actualizar(grupo.clave, null)}>
                {grupo.todos}
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
          {hayFiltro ? (
            <BotonEtiqueta onClick={quitarFiltros} className="border-b-0">
              Quitar filtros ×
            </BotonEtiqueta>
          ) : null}
        </div>
      </div>

      {filtrados.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px_10px] md:gap-[32px_24px]">
          {filtrados.map((m) => m.muestra)}
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
