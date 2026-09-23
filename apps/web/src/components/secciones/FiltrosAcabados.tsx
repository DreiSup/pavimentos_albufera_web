'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Chip from '../ui/Chip'
import { BotonEtiqueta } from '../ui/EnlaceEtiqueta'
import EstadoVacio from '../ui/EstadoVacio'
import { EVENTOS, registrarEvento } from '@/lib/eventos'

export type ClaveAcabado = 'tecnica'

/**
 * La única fila de la barra. `todos` es el texto del chip que quita el filtro y
 * sigue en el dato, no en el componente, porque es copy del muestrario.
 *
 * Aquí había dos filas —técnica y color— hasta el 2026-09-17. La de color se
 * retiró: el visitante llega al muestrario a ver qué colores hay, y filtrar por
 * pigmento le pedía justo el dato que viene a buscar. → `design/02` §A3
 */
export type GrupoAcabados = {
  clave: ClaveAcabado
  etiqueta: string
  todos: string
  opciones: { valor: string; nombre: string }[]
}

/**
 * Una muestra ya renderizada en servidor más el valor por el que se filtra. La
 * muestra viaja como nodo, no como dato: así `MuestraAcabado` —y con él
 * `next/image` y los JSON de `lib/datos`, que importa para resolver el
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

/**
 * Escribe el estado del filtro en la URL **sin tocar el resto de la query**.
 *
 * 🔴 Antes se reconstruía la URL entera —`` `${pathname}${valor ? `?…` : ''}` ``—
 * y eso borraba cualquier otro parámetro. En una pantalla cualquiera sería un
 * detalle; en esta no: el tráfico de pago aterriza en `/acabados/?gclid=…` desde
 * los anuncios de modelo, `Atribucion.tsx` lee `gclid`/`gbraid`/`wbraid`/`utm_*`
 * de `window.location.search` en su propio efecto, y el orden entre dos efectos
 * de cliente no está garantizado. Un clic en un chip —o, desde hoy, un
 * `?tecnica=` inventado— llegaba a dejar la URL sin el identificador de campaña
 * antes de que nadie lo hubiera guardado en cookie.
 *
 * `replaceState` y no `router.push`: aquí no se cambia de página, y cada
 * navegación del App Router contaba como un `page_view` más en GA4.
 */
function escribirUrl(clave: string, valor: string | null) {
  const url = new URL(window.location.href)
  if (valor) url.searchParams.set(clave, valor)
  else url.searchParams.delete(clave)
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
}

export default function FiltrosAcabados({
  muestras,
  grupo,
}: {
  muestras: AcabadoFiltrable[]
  grupo: GrupoAcabados
}) {
  const [filtro, setFiltro] = useState<string | null>(null)

  /**
   * El estado manda y la URL lo sigue, nunca al revés. Leer la URL en el render
   * con `useSearchParams` es lo que sacaba las 16 muestras del HTML estático.
   * Aquí se lee una sola vez, al montar, para que `?tecnica=impreso` —el enlace
   * compartible que pide 02-pantallas §A3, y el que `PaginaServicio` usa para
   * mandar aquí desde cada técnica— siga funcionando.
   *
   * 🔴 **Y se valida contra `grupo.opciones`, porque la URL es interfaz aunque
   * el chip no exista.** Medido antes de esta línea:
   * `/acabados/?tecnica=desactivado` servía «0 ACABADOS · DESACTIVADO», rejilla
   * vacía y estado vacío, mientras cuatro sitios del repo afirmaban que con un
   * solo eje eso ya no podía pasar. Un valor que no está en la barra no se
   * aplica, y además se borra de la URL con el mismo `escribirUrl()` que usa
   * `aplicar()`: un enlace compartible que dice una cosa y enseña otra miente.
   */
  useEffect(() => {
    const valor = new URLSearchParams(window.location.search).get(grupo.clave)
    if (!valor) return
    if (grupo.opciones.some((o) => o.valor === valor)) setFiltro(valor)
    else escribirUrl(grupo.clave, null)
  }, [grupo.clave, grupo.opciones])

  function aplicar(valor: string | null) {
    setFiltro(valor)
    escribirUrl(grupo.clave, valor)
  }

  function actualizar(valor: string | null) {
    aplicar(valor)
    registrarEvento(EVENTOS.samplesFilter, {
      params: { filter_type: grupo.clave, filter_value: valor ?? 'todos' },
    })
  }

  function quitarFiltros() {
    aplicar(null)
    // Poner un filtro se medía y quitarlo no, así que el embudo de filtrado
    // quedaba cojo por un lado. Mismo vocabulario del contrato: no hay nombre ni
    // parámetro nuevo que registrar en GA4.
    registrarEvento(EVENTOS.samplesFilter, {
      params: { filter_type: 'todos', filter_value: 'todos' },
    })
  }

  const filtrados = useMemo(
    () => muestras.filter((m) => !filtro || m.valores[grupo.clave] === filtro),
    [muestras, filtro, grupo.clave],
  )

  const nombreFiltro = grupo.opciones.find((o) => o.valor === filtro)?.nombre ?? filtro
  const resumen = [
    `${filtrados.length} ACABADO${filtrados.length === 1 ? '' : 'S'}`,
    ...(nombreFiltro ? [nombreFiltro.toUpperCase()] : []),
  ].join(' · ')

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky [top:var(--cabecera-actual)] z-10 bg-fondo border-t border-b border-tinta py-3 flex flex-col gap-2">
        {/* Móvil, carril deslizante; escritorio, la fila envuelve. Las dos mitades
            son literalmente lo que pide `design/02` §A3: «Fila 1: TÉCNICA …» en
            escritorio y «carril de chips deslizante» en móvil. Lo que había era
            el carril en los dos, y de 768 px para arriba eso pintaba una barra de
            scroll clásica de 15 px bajo cada fila (medido a 960: contenido
            1093 px en una caja de 849).

            Envolver y no ensanchar el carril: los chips ya se apilan así en la
            hoja de filtros de `FiltrosProyectos`, que es el tratamiento aprobado
            para estos mismos grupos. Sale con `flex-wrap` y `gap`, sin un solo
            margen por elemento, y el `row-gap` viene del mismo `gap-2`.

            `items-start` en la fila y `min-h-tactil` en la etiqueta: al envolver
            en dos o tres líneas, `items-center` centraba la etiqueta contra el
            bloque entero en vez de contra la primera línea de chips. */}
        <div className="flex gap-3 items-start overflow-x-auto md:overflow-x-visible">
          <span className="font-mono text-d-11 text-acero w-[84px] shrink-0 min-h-tactil flex items-center">
            {grupo.etiqueta.toUpperCase()}
          </span>
          <div className="flex gap-2 md:flex-wrap">
            <Chip activo={!filtro} onClick={() => actualizar(null)}>
              {grupo.todos}
            </Chip>
            {grupo.opciones.map((o) => (
              <Chip key={o.valor} activo={filtro === o.valor} onClick={() => actualizar(o.valor)}>
                {o.nombre}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 pt-1">
          <span className="font-mono text-d-12 text-tinta">{resumen}</span>
          {filtro ? (
            <BotonEtiqueta onClick={quitarFiltros} className="border-b-0">
              Quitar filtros ×
            </BotonEtiqueta>
          ) : null}
        </div>
      </div>

      {/* Qué puede dejar esto a cero, ahora que hay dos puertas y las dos leen la
          misma lista: ninguna técnica, porque las opciones salen del mismo
          catálogo que se pinta, y ningún `?tecnica=` inventado, porque el efecto
          de arriba lo descarta. Queda un solo caso, y es el que justifica que el
          componente siga aquí: que `muestras` llegue vacío, es decir, que ningún
          acabado del catálogo tenga muestra. Manda el contenido, y un catálogo
          que cambie no debe dejar la rejilla en blanco sin decirlo. */}
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
