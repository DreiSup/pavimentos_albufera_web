import Link from 'next/link'
import type { Imagen, Zona } from '@/lib/tipos'
import Foto from './Foto'
import { TAMANOS_TARJETA_PROYECTO } from './TarjetaProyecto'

/**
 * Variante *zona* de la tarjeta de proyecto (`design/01` §3.12, 2026-10-21):
 * la misma caja —foto 4/3, fila de ubicación, título en Archivo, pie con
 * borde superior y rótulo de acción— para el índice `/zonas/`. Cambia lo que
 * dice, no cómo se ve: la fila de ubicación es comarca y provincia, el título
 * es la técnica en el municipio («Hormigón impreso en Moraira») y el pie
 * cuenta las obras documentadas. Sin año ni ficha: una zona no los tiene.
 *
 * La foto la elige quien llama —la primera de la primera obra de la zona—,
 * igual que el hero de la página de zona, para no decidirla dos veces.
 */
export default function TarjetaZona({
  zona,
  titulo,
  foto,
  numeroObras,
}: {
  zona: Zona
  titulo: string
  foto: Imagen | undefined
  numeroObras: number
}) {
  const idTitulo = `zona-${zona.slug}-titulo`
  const idRotulo = `zona-${zona.slug}-rotulo`

  return (
    <Link
      href={`/zonas/${zona.slug}/`}
      aria-labelledby={`${idTitulo} ${idRotulo}`}
      className="group flex h-full flex-col no-underline bg-fondo-alt"
    >
      <Foto imagen={foto} proporcion="4/3" tamanos={TAMANOS_TARJETA_PROYECTO} />
      <div className="flex flex-1 flex-col gap-2 px-[14px] pt-3 pb-4 md:px-5 md:pt-[18px] md:pb-[22px]">
        <div className="text-14 text-tinta-media">
          {zona.comarca} · {zona.provincia}
        </div>
        <h3 id={idTitulo} className="font-display font-bold fs-h3 text-16 md:text-20 leading-[1.2] text-tinta m-0">
          {titulo}
        </h3>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-fondo pt-3">
          <span className="font-mono text-d-10 md:text-d-11 text-acero">
            {numeroObras === 1 ? '1 OBRA' : `${numeroObras} OBRAS`}
          </span>
          <span className="text-14 font-semibold text-tinta underline-offset-4 group-hover:underline">
            <span id={idRotulo}>Ver zona</span> <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
