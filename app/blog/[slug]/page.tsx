import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Aparece from '@/components/ui/Aparece'
import Boton from '@/components/ui/Boton'
import Foto from '@/components/contenido/Foto'
import Migas from '@/components/layout/Migas'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
import { articuloPorSlug, articulos, proyectosPorServicio } from '@/lib/datos'
import { NOMBRE_SERVICIO } from '@/lib/tipos'

export function generateStaticParams() {
  return articulos.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const articulo = articuloPorSlug(slug)
  if (!articulo) return {}
  return {
    title: articulo.titulo,
    description: articulo.entradilla ?? `${articulo.titulo} — Pavimentos Albufera`,
    alternates: { canonical: `/blog/${articulo.slug}/` },
  }
}

export default async function Articulo({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const articulo = articuloPorSlug(slug)
  if (!articulo) notFound()

  const proyectosTecnica = proyectosPorServicio(articulo.servicio).slice(0, 3)

  return (
    <>
      <Migas items={[{ nombre: 'Blog', href: '/blog/' }, { nombre: articulo.titulo }]} />

      <section className="px-[18px] md:px-lat-desktop pb-8 md:pb-14 flex flex-col gap-4">
        <span className="font-mono text-d-11 text-acero uppercase">
          {NOMBRE_SERVICIO[articulo.servicio]}
          {articulo.fecha ? ` · ${articulo.fecha}` : ''}
        </span>
        <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0 max-w-[70ch]">
          {articulo.titulo}
        </h1>
      </section>

      <section className="px-[18px] md:px-lat-desktop pb-8 md:pb-14">
        <Foto
          imagen={articulo.imagenApertura}
          proporcion="21/9"
          prioridad
          tamanos="100vw"
        />
      </section>

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="max-w-lectura">
          {articulo.cuerpo ? (
            <div className="text-20 leading-[1.6] text-tinta">{articulo.cuerpo}</div>
          ) : (
            <div className="border border-dashed border-tinta-media p-6">
              <p className="pendiente text-16 m-0">
                [Contenido del artículo pendiente de redacción. El copy de este artículo no forma
                parte del documento maestro entregado.]
              </p>
            </div>
          )}
        </div>
      </Aparece>

      {proyectosTecnica.length > 0 ? (
        <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
          <div className="flex flex-col gap-6">
            <span className="font-mono text-d-11 text-acero uppercase">Esta técnica, ejecutada</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {proyectosTecnica.map((p) => (
                <TarjetaProyecto key={p.slug} proyecto={p} fondo="base" />
              ))}
            </div>
          </div>
        </Aparece>
      ) : null}

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">¿Quieres verlo en tu casa?</h2>
          <Boton variante="primario" href="/presupuesto/">
            Pedir presupuesto
          </Boton>
        </div>
      </Aparece>
    </>
  )
}
