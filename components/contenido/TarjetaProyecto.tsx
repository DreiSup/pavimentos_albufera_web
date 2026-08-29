import Link from 'next/link'
import { CODIGO_COLOR, NOMBRE_MODELO, NOMBRE_SERVICIO } from '@/lib/tipos'
import type { Proyecto } from '@/lib/tipos'
import Foto from './Foto'
import DatoPendiente from '../datos/DatoPendiente'

export default function TarjetaProyecto({
  proyecto,
  fondo = 'alt',
}: {
  proyecto: Proyecto
  fondo?: 'alt' | 'base'
}) {
  const modelo = proyecto.modelo ? NOMBRE_MODELO[proyecto.modelo] : '—'
  const color = proyecto.color ? CODIGO_COLOR[proyecto.color] : null

  return (
    <Link
      href={`/proyectos/${proyecto.slug}/`}
      className={`flex flex-col no-underline ${fondo === 'alt' ? 'bg-fondo-alt' : 'bg-fondo'}`}
    >
      <Foto
        imagen={proyecto.imagenes[0]}
        proporcion="4/3"
        tamanos="(min-width: 768px) 30vw, 88vw"
      />
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
