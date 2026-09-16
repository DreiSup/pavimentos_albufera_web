import Link from 'next/link'
import { estaDocumentado, proyectoPorSlug } from '@/lib/datos'
import type { Acabado } from '@/lib/tipos'
import BloquePosicion from './BloquePosicion'
import DatoPendiente from '../datos/DatoPendiente'

/** 01-sistema-de-diseno.md §3.10. Cuadrada, sin sombra, sin radio. Etiqueta fuera de la muestra. */
export default function MuestraAcabado({
  acabado,
  seleccionada = false,
}: {
  acabado: Acabado
  seleccionada?: boolean
}) {
  const documentado = estaDocumentado(acabado)
  const proyecto = documentado ? proyectoPorSlug(acabado.proyectos[0]) : undefined

  return (
    // Los acabados con molde se agrupan por modelo (`/acabados/espiga/`); los de
    // las técnicas sin molde van por su propio slug (`/acabados/pulido-gris/`).
    // `app/acabados/[modelo]/page.tsx` genera las dos formas.
    <Link
      href={`/acabados/${acabado.modelo ?? acabado.slug}/`}
      className="flex flex-col gap-[10px] md:gap-[14px] no-underline group"
    >
      <BloquePosicion proporcion="1" fina className={seleccionada ? 'outline outline-2 outline-pigmento -outline-offset-2' : ''} />
      <div className="flex flex-col gap-[2px]">
        <span className="font-display font-bold fs-h3 text-16 md:text-20 leading-[1.15] text-tinta">
          {acabado.nombre}
        </span>
        <span className="font-mono text-d-10 md:text-d-11 text-acero">{acabado.codigo}</span>
        <span className="font-mono text-d-10 md:text-d-11 text-tinta">
          {proyecto?.municipio ?? <DatoPendiente>municipio</DatoPendiente>}
        </span>
      </div>
    </Link>
  )
}
