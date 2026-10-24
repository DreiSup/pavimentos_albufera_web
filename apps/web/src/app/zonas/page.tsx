import type { Metadata } from 'next'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Aparece from '@/components/ui/Aparece'
import Boton from '@/components/ui/Boton'
import Migas from '@/components/layout/Migas'
import TarjetaZona from '@/components/contenido/TarjetaZona'
import {
  municipiosSinDocumentar,
  proyectosDe,
  serviciosDeZona,
  zonaIndexable,
  zonas,
  zonasIndexables,
} from '@/lib/datos'
import { NOMBRE_SERVICIO, type Provincia, type ServicioId } from '@/lib/tipos'

/*
 * Índice de zonas (2026-10-21, `design/seo/receta-paginas-zona.md`). Existe
 * para que ninguna página de zona sea huérfana: el pie enlaza aquí desde las
 * 50+ rutas del sitio, y esto enlaza cada zona con obra fotografiada.
 *
 * Solo tarjeta para las zonas indexables (`zonaIndexable`). Los municipios con
 * obra sin documentar —y la zona sin foto, hoy Xàbia— se nombran en texto, sin
 * enlace: es lo que recomienda la guía anti-doorway para «también trabajamos
 * en…», y es la verdad: hay obra, pero no hay nada que enseñar.
 */

const tecnicas = Array.from(new Set(zonasIndexables.flatMap((z) => z.servicios))) as ServicioId[]
const listaTecnicas = tecnicas.map((s) => NOMBRE_SERVICIO[s].replace('Hormigón ', '').toLowerCase())

function enumerar(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`
}

export const metadata: Metadata = {
  title: 'Zonas de trabajo: obra por municipio',
  description: `Municipios de Valencia y Alicante donde hemos hecho obra de hormigón ${enumerar(listaTecnicas)}, cada uno con sus fotos, su técnica y su acabado.`,
  alternates: { canonical: '/zonas/' },
}

const ORDEN_PROVINCIAS: Provincia[] = ['Valencia', 'Alicante', 'Castellón']

export default function Zonas() {
  const porProvincia = ORDEN_PROVINCIAS.map((provincia) => ({
    provincia,
    zonas: zonasIndexables.filter((z) => z.provincia === provincia),
  })).filter((g) => g.zonas.length > 0)

  const sinFoto = zonas.filter((z) => !zonaIndexable(z)).map((z) => z.municipio)
  const tambien = [...sinFoto, ...municipiosSinDocumentar.towns.filter((t) => t !== municipiosSinDocumentar.headquartersTown)]
  const obras = zonasIndexables.reduce((n, z) => n + proyectosDe(z.proyectos).length, 0)

  return (
    <>
      <Migas items={[{ nombre: 'Zonas' }]} />

      <section className="px-[18px] md:px-lat-desktop pb-8 md:pb-14">
        <div className="flex flex-col gap-4">
          <AntetituloSeccion>
            {zonasIndexables.length} municipios · {obras} obras documentadas
          </AntetituloSeccion>
          <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
            Obra por municipio
          </h1>
          <p className="text-16 md:text-20 text-tinta-media max-w-[52ch] m-0">
            Los municipios donde tenemos obra fotografiada. Cada uno tiene su página con las fotos,
            la técnica y el acabado de lo que hicimos allí.
          </p>
        </div>
      </section>

      {porProvincia.map((grupo) => (
        <Aparece key={grupo.provincia} as="section" className="px-[18px] md:px-lat-desktop pb-9 md:pb-22">
          <div className="flex flex-col gap-6">
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">Provincia de {grupo.provincia}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {grupo.zonas.map((z) => {
                const proyectos = proyectosDe(z.proyectos)
                return (
                  <TarjetaZona
                    key={z.slug}
                    zona={z}
                    titulo={`${serviciosDeZona(z)} en ${z.municipio}`}
                    foto={proyectos[0]?.imagenes[0]}
                    numeroObras={proyectos.length}
                  />
                )
              })}
            </div>
          </div>
        </Aparece>
      ))}

      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-4 max-w-lectura">
          <h2 className="font-display font-bold fs-h3 text-26 m-0">También hemos trabajado en…</h2>
          <p className="text-16 md:text-20 text-tinta-media m-0">
            {enumerar(tambien)}. Esas obras todavía no están documentadas aquí con sus fotos y sus
            datos, y por eso no tienen página propia: la tendrán cuando lo estén. Nuestra sede está
            en{' '}
            {municipiosSinDocumentar.headquartersTown}.
          </p>
          <p className="text-16 text-tinta-media m-0">
            Valencia, Castellón y Alicante están en el anillo 1 de cobertura: cualquier superficie,
            sin recargo de desplazamiento.
          </p>
        </div>
      </Aparece>

      <Aparece as="section" className="sobre-oscuro bg-tinta text-fondo px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">¿Tu obra está cerca de alguna?</h2>
          <Boton variante="primario" href="/presupuesto/">
            Pedir presupuesto
          </Boton>
        </div>
      </Aparece>
    </>
  )
}
