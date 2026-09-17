import Link from 'next/link'
import { estaDocumentado, proyectoPorSlug } from '@/lib/datos'
import type { Acabado } from '@/lib/tipos'
import Foto from './Foto'
import DatoPendiente from '../datos/DatoPendiente'

/**
 * El `sizes` de la rejilla de cuatro columnas del muestrario. Igual que en
 * `TarjetaProyecto`: se exporta para que una pantalla que sepa que esta muestra
 * y otro hueco suyo comparten foto de origen pueda igualarlos y ahorrar la
 * segunda petición a `/_next/image?`.
 */
export const TAMANOS_MUESTRA_ACABADO = '(min-width: 768px) 22vw, 45vw'

/** 01-sistema-de-diseno.md §3.10. Cuadrada, sin sombra, sin radio. Etiqueta fuera de la muestra. */
export default function MuestraAcabado({
  acabado,
  seleccionada = false,
  tamanos = TAMANOS_MUESTRA_ACABADO,
}: {
  acabado: Acabado
  seleccionada?: boolean
  /** Solo se pasa para hacerlo coincidir con otro hueco de la misma pantalla. */
  tamanos?: string
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
      <Foto
        imagen={acabado.muestra}
        proporcion="1"
        fina
        tamanos={tamanos}
        className={seleccionada ? 'outline outline-2 outline-pigmento -outline-offset-2' : ''}
      />
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
