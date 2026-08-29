import Link from 'next/link'
import { NOMBRE_SERVICIO } from '@/lib/tipos'
import type { Articulo } from '@/lib/tipos'
import Foto from './Foto'

export default function TarjetaArticulo({ articulo }: { articulo: Articulo }) {
  return (
    <Link href={`/blog/${articulo.slug}/`} className="flex flex-col no-underline bg-fondo-alt">
      <Foto
        imagen={articulo.imagenApertura}
        proporcion="16/10"
        tamanos="(min-width: 768px) 30vw, 100vw"
      />
      <div className="flex flex-col gap-2 px-[14px] py-[12px] md:px-5 md:py-[18px]">
        <span className="font-mono text-d-11 text-acero">{NOMBRE_SERVICIO[articulo.servicio]}</span>
        <h3 className="font-display font-bold fs-h3 text-20 md:text-26 leading-[1.2] text-tinta m-0">
          {articulo.titulo}
        </h3>
        {articulo.entradilla ? (
          <p className="text-14 md:text-16 text-tinta-media m-0 line-clamp-2">{articulo.entradilla}</p>
        ) : null}
        {articulo.fecha ? (
          <span className="font-mono text-d-11 text-tinta-media">{articulo.fecha}</span>
        ) : null}
      </div>
    </Link>
  )
}
