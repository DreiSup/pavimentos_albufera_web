import type { Metadata } from 'next'
import { Suspense } from 'react'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Migas from '@/components/layout/Migas'
import FiltrosProyectos from '@/components/secciones/FiltrosProyectos'
import { aniosEnUso, modelosEnUso, municipiosEnUso, proyectos, tecnicasEnUso } from '@/lib/datos'

export const metadata: Metadata = {
  title: 'Proyectos ejecutados | Pavimentos Albufera',
  description:
    'Obras de hormigón impreso, pulido y microcemento en Valencia, Alicante y Castellón. Filtra por acabado, espacio o municipio.',
  alternates: { canonical: '/proyectos/' },
}

export default function Proyectos() {
  return (
    <>
      <Migas items={[{ nombre: 'Proyectos' }]} />

      <section className="px-[18px] md:px-lat-desktop pb-8 md:pb-14">
        <div className="flex flex-col gap-4">
          <AntetituloSeccion>{proyectos.length} obras documentadas</AntetituloSeccion>
          <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
            Proyectos ejecutados
          </h1>
          <p className="text-16 md:text-20 text-tinta-media max-w-[52ch] m-0">
            Todas las fotos de esta web son trabajos nuestros. Filtra por servicio, modelo,
            municipio o año.
          </p>
        </div>
      </section>

      <div className="px-[18px] md:px-lat-desktop pb-9 md:pb-22">
        <Suspense>
          <FiltrosProyectos
            proyectos={proyectos}
            servicios={tecnicasEnUso()}
            modelos={modelosEnUso()}
            municipios={municipiosEnUso()}
            anios={aniosEnUso()}
          />
        </Suspense>
      </div>
    </>
  )
}
