import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Aparece from '@/components/ui/Aparece'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Boton from '@/components/ui/Boton'
import BloquePosicion from '@/components/contenido/BloquePosicion'
import EtiquetaTecnica from '@/components/datos/EtiquetaTecnica'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
import MuestraAcabado from '@/components/contenido/MuestraAcabado'
import Migas from '@/components/layout/Migas'
import Acordeon from '@/components/secciones/Acordeon'
import { JsonLd, schemaFAQ } from '@/lib/schema'
import { acabados, proyectosDe, zonaPorSlug, zonas } from '@/lib/datos'
import { faqZona } from '@/content/faq'
import { NOMBRE_SERVICIO, RUTA_SERVICIO } from '@/lib/tipos'

export function generateStaticParams() {
  return zonas.map((z) => ({ municipio: z.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ municipio: string }>
}): Promise<Metadata> {
  const { municipio } = await params
  const zona = zonaPorSlug(municipio)
  if (!zona) return {}
  return {
    title: `Pavimentos de hormigón en ${zona.municipio}`,
    description: `Obra real de hormigón ejecutada en ${zona.municipio}, ${zona.provincia}. Servicios, acabados y proyectos documentados.`,
    alternates: { canonical: `/zonas/${zona.slug}/` },
  }
}

export default async function PaginaZona({ params }: { params: Promise<{ municipio: string }> }) {
  const { municipio } = await params
  const zona = zonaPorSlug(municipio)
  if (!zona) notFound()

  const proyectos = proyectosDe(zona.proyectos)
  const acabadosZona = acabados.filter((a) => a.proyectos.some((slug) => zona.proyectos.includes(slug)))
  const primerProyecto = proyectos[0]

  return (
    <>
      <JsonLd data={schemaFAQ(faqZona)} />
      <Migas items={[{ nombre: 'Zonas' }, { nombre: zona.municipio }]} />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 px-[18px] md:px-lat-desktop pb-8 md:pb-14">
        <div className="flex flex-col justify-center gap-4">
          <AntetituloSeccion>{zona.provincia}</AntetituloSeccion>
          <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
            Pavimentos de hormigón en {zona.municipio}
          </h1>
          <p className="text-16 md:text-20 text-tinta-media max-w-[52ch] m-0">
            Obra real ejecutada en {zona.municipio}: {zona.servicios.map((s) => NOMBRE_SERVICIO[s]).join(', ').toLowerCase()}.
          </p>
        </div>
        <BloquePosicion
          proporcion="4/3"
          etiqueta={
            primerProyecto ? (
              <EtiquetaTecnica lineas={[`${zona.municipio.toUpperCase()} · ${zona.provincia.toUpperCase()}`]} />
            ) : undefined
          }
        />
      </section>

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-6">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            Obras en {zona.municipio}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proyectos.map((p) => (
              <TarjetaProyecto key={p.slug} proyecto={p} />
            ))}
          </div>
        </div>
      </Aparece>

      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-6">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            Servicios prestados aquí
          </h2>
          <div className="flex flex-wrap gap-3">
            {zona.servicios.map((s) => (
              <a
                key={s}
                href={RUTA_SERVICIO[s]}
                className="min-h-tactil inline-flex items-center px-4 border border-tinta font-sans text-16 no-underline"
              >
                {NOMBRE_SERVICIO[s]}
              </a>
            ))}
          </div>
        </div>
      </Aparece>

      {acabadosZona.length > 0 ? (
        <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
          <div className="flex flex-col gap-6">
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
              Acabados usados en la zona
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px_10px] md:gap-[32px_24px]">
              {acabadosZona.map((a) => (
                <MuestraAcabado key={a.slug} acabado={a} />
              ))}
            </div>
          </div>
        </Aparece>
      ) : null}

      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-2">
          <h2 className="font-display font-bold fs-h3 text-26 m-0">Zona de servicio</h2>
          <p className="text-16 text-tinta-media m-0">
            {zona.provincia} está en el anillo 1 de cobertura: cualquier superficie, sin recargo
            de desplazamiento.
          </p>
        </div>
      </Aparece>

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
          <AntetituloSeccion>Preguntas frecuentes</AntetituloSeccion>
          <Acordeon preguntas={faqZona} />
        </div>
      </Aparece>

      <Aparece as="section" className="sobre-oscuro bg-tinta text-fondo px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            ¿Quieres algo parecido en {zona.municipio}?
          </h2>
          <Boton variante="primario" href="/presupuesto/">
            Pedir presupuesto
          </Boton>
        </div>
      </Aparece>
    </>
  )
}
