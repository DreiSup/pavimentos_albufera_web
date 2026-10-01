import Link from 'next/link'
import { CODIGO_COLOR, NOMBRE_MODELO, NOMBRE_SERVICIO } from '@/lib/tipos'
import type { Proyecto } from '@/lib/tipos'
import Foto from './Foto'

/**
 * El `sizes` de la rejilla de tres columnas en la que vive la tarjeta. Se
 * exporta porque hay pantallas donde la tarjeta comparte foto de origen con
 * otro hueco —el hero de la zona, la muestra del muestrario— y dos `sizes`
 * distintos sobre la misma foto son dos peticiones a `/_next/image?` en la
 * misma pantalla. Quien conoce esa coincidencia es la pantalla, no la tarjeta.
 */
export const TAMANOS_TARJETA_PROYECTO = '(min-width: 768px) 30vw, 88vw'

export default function TarjetaProyecto({
  proyecto,
  fondo = 'alt',
  tamanos = TAMANOS_TARJETA_PROYECTO,
}: {
  proyecto: Proyecto
  fondo?: 'alt' | 'base'
  /** Solo se pasa para hacerlo coincidir con otro hueco de la misma pantalla. */
  tamanos?: string
}) {
  // Estructura del handoff «Proyectos destacados» (2026-10-01): foto, fila de
  // ubicación y año, título, y un pie con la especificación y el enlace. Solo
  // cambia la ESTRUCTURA: los datos son los de la obra, y los colores, la
  // tipografía y la ausencia de sombra y de movimiento son los del sistema
  // (`design/01` §3.12). El handoff traía además un texto breve con un dato
  // concreto: ninguna obra tiene ese texto (el encargo y la ejecución están
  // pendientes del dueño), así que no se pinta en vez de escribirlo.
  //
  // Cada dato se compone filtrando lo que falta: el dueño decidió el 2026-09-18
  // que los datos de obra que no tiene no se ven, ni el valor ni el corchete. Se
  // arman como lista y no interpolando separadores sueltos porque, con los
  // corchetes fuera, un ` · ` huérfano o una fila vacía son lo que queda a la vista.
  const ubicacion = [proyecto.municipio, proyecto.provincia].filter(Boolean).join(' · ')
  // El handoff ponía en el pie «Técnica · superficie», corto. Con los datos reales
  // la especificación completa (técnica, modelo, color) mide 40-50 caracteres y
  // empuja el enlace a una segunda línea en unas tarjetas y no en otras, con lo
  // que las líneas del pie no se alinean entre tarjetas de una misma fila. Por
  // eso el pie lleva solo lo corto (técnica y, si se conoce, superficie) y
  // modelo y color suben a una línea propia bajo el título.
  const especificacion = [
    NOMBRE_SERVICIO[proyecto.servicio],
    proyecto.superficie ? `${proyecto.superficie} m²` : null,
  ]
    .filter(Boolean)
    .join(' · ')
  const acabado = [
    proyecto.modelo ? NOMBRE_MODELO[proyecto.modelo] : null,
    proyecto.color ? CODIGO_COLOR[proyecto.color] : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <Link
      href={`/proyectos/${proyecto.slug}/`}
      className={`group flex h-full flex-col no-underline ${fondo === 'alt' ? 'bg-fondo-alt' : 'bg-fondo'}`}
    >
      <Foto imagen={proyecto.imagenes[0]} proporcion="4/3" tamanos={tamanos} />
      <div className="flex flex-1 flex-col gap-2 px-[14px] pt-3 pb-4 md:px-5 md:pt-[18px] md:pb-[22px]">
        {ubicacion || proyecto.anio ? (
          <div className="flex items-center justify-between gap-3 text-14 text-tinta-media">
            <span>{ubicacion}</span>
            {proyecto.anio ? <span className="ml-auto tabular-nums">{proyecto.anio}</span> : null}
          </div>
        ) : null}
        <h3 className="font-display font-bold fs-h3 text-16 md:text-20 leading-[1.2] text-tinta m-0">
          {proyecto.titulo}
        </h3>
        {acabado ? <p className="font-mono text-d-10 md:text-d-11 text-acero m-0">{acabado}</p> : null}
        {/* `mt-auto` empuja el pie al fondo de la tarjeta y, como el enlace se
            estira en la rejilla y el pie mide siempre una línea, los pies de una
            misma fila quedan alineados aunque los títulos ocupen distinto. */}
        <div
          className={`mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t pt-3 ${
            fondo === 'alt' ? 'border-fondo' : 'border-fondo-alt'
          }`}
        >
          <span className="font-mono text-d-10 md:text-d-11 text-acero">{especificacion}</span>
          <span className="text-14 font-semibold text-tinta underline-offset-4 group-hover:underline">
            Ver proyecto <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
