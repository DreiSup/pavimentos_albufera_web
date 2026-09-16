import type { Metadata } from 'next'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Migas from '@/components/layout/Migas'
import FiltrosProyectos from '@/components/secciones/FiltrosProyectos'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
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
        {/*
          Las 9 obras se pintan en servidor y viajan como `children`: el HTML estático de
          /proyectos/ lleva la rejilla entera y sus enlaces a /proyectos/[slug]/.
          El componente de filtros solo las oculta; nunca las monta.
          Cada envoltorio lleva sus valores de filtro en `data-*`, y `[&[hidden]]:hidden`
          para que el atributo `hidden` gane al `display: grid` que estira la tarjeta.
        */}
        <FiltrosProyectos
          servicios={tecnicasEnUso()}
          modelos={modelosEnUso()}
          municipios={municipiosEnUso()}
          anios={aniosEnUso()}
          total={proyectos.length}
        >
          {proyectos.map((proyecto) => (
            <div
              key={proyecto.slug}
              data-filtrable=""
              data-servicio={proyecto.servicio}
              data-modelo={proyecto.modelo}
              data-municipio={proyecto.municipio ?? undefined}
              data-anio={proyecto.anio ?? undefined}
              className="grid [&[hidden]]:hidden"
            >
              <TarjetaProyecto proyecto={proyecto} />
            </div>
          ))}
        </FiltrosProyectos>
      </div>
    </>
  )
}
