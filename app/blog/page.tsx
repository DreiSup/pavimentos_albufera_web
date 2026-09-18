import type { Metadata } from 'next'
import Aparece from '@/components/ui/Aparece'
import { EnlaceEtiqueta } from '@/components/ui/EnlaceEtiqueta'
import Migas from '@/components/layout/Migas'
import TarjetaArticulo from '@/components/contenido/TarjetaArticulo'
import { articulos } from '@/lib/datos'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artículos sobre técnicas de pavimentación: hormigón desactivado, fratasado y pulido.',
  alternates: { canonical: '/blog/' },
}

export default function Blog() {
  return (
    <>
      <Migas items={[{ nombre: 'Blog' }]} />

      <section className="px-[18px] md:px-lat-desktop pb-8 md:pb-14">
        <div className="flex flex-col gap-4 max-w-[70ch]">
          <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
            Blog
          </h1>
          <p className="text-16 md:text-20 text-tinta-media m-0">
            Artículos que explican cómo funciona cada técnica: qué es, dónde tiene sentido y qué
            cuidados necesita. Aquí no hay partes de obra — esos están en{' '}
            <EnlaceEtiqueta href="/proyectos/" className="inline-flex">
              proyectos
            </EnlaceEtiqueta>
            .
          </p>
        </div>
      </section>

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articulos.map((a) => (
            <TarjetaArticulo key={a.slug} articulo={a} />
          ))}
        </div>
      </Aparece>

      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="font-display font-bold fs-h3 text-26 md:text-34 m-0">
            ¿Buscas obra ejecutada, no artículos?
          </h2>
          <EnlaceEtiqueta href="/proyectos/">Ver proyectos →</EnlaceEtiqueta>
        </div>
      </Aparece>
    </>
  )
}
