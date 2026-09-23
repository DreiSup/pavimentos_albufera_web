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
  // Tres líneas de datos separadas por ` · `, y cada una se compone filtrando lo
  // que falta: el dueño decidió el 2026-09-18 que los datos de obra que no tiene
  // no se ven, ni el valor ni el corchete. Se arman como lista y no interpolando
  // separadores sueltos porque con los corchetes fuera un ` · ` huérfano o una
  // línea en blanco son lo que queda a la vista. Una línea vacía no se pinta, y
  // con ella se va su salto de línea.
  const lineas = [
    [proyecto.municipio, proyecto.provincia],
    [
      NOMBRE_SERVICIO[proyecto.servicio],
      proyecto.modelo ? NOMBRE_MODELO[proyecto.modelo] : null,
      proyecto.color ? CODIGO_COLOR[proyecto.color] : null,
    ],
    [proyecto.superficie ? `${proyecto.superficie} m²` : null, proyecto.anio],
  ]
    .map((linea) => linea.filter(Boolean).join(' · '))
    .filter(Boolean)

  return (
    <Link
      href={`/proyectos/${proyecto.slug}/`}
      className={`flex flex-col no-underline ${fondo === 'alt' ? 'bg-fondo-alt' : 'bg-fondo'}`}
    >
      <Foto imagen={proyecto.imagenes[0]} proporcion="4/3" tamanos={tamanos} />
      <div className="flex flex-col gap-2 px-[14px] py-[12px] md:px-5 md:py-[18px] md:pb-[22px]">
        <h3 className="font-display font-bold fs-h3 text-16 md:text-20 leading-[1.2] text-tinta m-0">
          {proyecto.titulo}
        </h3>
        <p className="font-mono text-d-10 md:text-d-11 leading-[1.9] text-acero m-0">
          {lineas.map((linea, i) => (
            <span key={i} className="block">
              {linea}
            </span>
          ))}
        </p>
      </div>
    </Link>
  )
}
