import Link from 'next/link'
import { CODIGO_COLOR, NOMBRE_MODELO, NOMBRE_SERVICIO } from '@/lib/tipos'
import type { Proyecto } from '@/lib/tipos'
import Foto from './Foto'
import DatoPendiente from '../datos/DatoPendiente'

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
  const modelo = proyecto.modelo ? NOMBRE_MODELO[proyecto.modelo] : '—'
  const color = proyecto.color ? CODIGO_COLOR[proyecto.color] : null

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
          {proyecto.municipio ?? <DatoPendiente>municipio</DatoPendiente>}
          {' · '}
          {proyecto.provincia ?? <DatoPendiente>provincia</DatoPendiente>}
          <br />
          {NOMBRE_SERVICIO[proyecto.servicio]}
          {proyecto.modelo ? ` · ${modelo}` : ''}
          {color ? ` · ${color}` : ''}
          <br />
          {proyecto.superficie ? `${proyecto.superficie} m²` : <DatoPendiente>m²</DatoPendiente>}
          {' · '}
          {proyecto.anio ?? <DatoPendiente>año</DatoPendiente>}
        </p>
      </div>
    </Link>
  )
}
