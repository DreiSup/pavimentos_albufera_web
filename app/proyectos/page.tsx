import type { Metadata } from 'next'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Migas from '@/components/layout/Migas'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
import FiltrosProyectos, {
  type GrupoFiltro,
  type ObraFiltrable,
} from '@/components/secciones/FiltrosProyectos'
import { aniosEnUso, modelosEnUso, municipiosEnUso, proyectos, tecnicasEnUso } from '@/lib/datos'
import { NOMBRE_MODELO, NOMBRE_SERVICIO } from '@/lib/tipos'

export const metadata: Metadata = {
  title: 'Proyectos ejecutados | Pavimentos Albufera',
  description:
    'Obras de hormigón impreso, pulido y microcemento en Valencia, Alicante y Castellón. Filtra por acabado, espacio o municipio.',
  alternates: { canonical: '/proyectos/' },
}

export default function Proyectos() {
  /**
   * Las tarjetas se arman aquí, en servidor, y cruzan la frontera ya hechas.
   * `FiltrosProyectos` solo elige cuáles se enseñan, así que la rejilla entera
   * —las 9 tarjetas con sus fotos y sus enlaces— sale en el HTML estático y no
   * espera a que hidrate nada.
   */
  const grupos: GrupoFiltro[] = [
    {
      clave: 'servicio',
      etiqueta: 'Servicio',
      opciones: tecnicasEnUso().map((s) => ({ valor: s, nombre: NOMBRE_SERVICIO[s] })),
    },
    {
      clave: 'modelo',
      etiqueta: 'Modelo',
      opciones: modelosEnUso().map((m) => ({ valor: m, nombre: NOMBRE_MODELO[m] })),
    },
    {
      clave: 'municipio',
      etiqueta: 'Municipio',
      opciones: municipiosEnUso().map((m) => ({ valor: m, nombre: m })),
    },
    {
      clave: 'anio',
      etiqueta: 'Año',
      opciones: aniosEnUso().map((a) => ({ valor: String(a), nombre: String(a) })),
    },
  ]

  const obras: ObraFiltrable[] = proyectos.map((p) => ({
    clave: p.slug,
    valores: {
      servicio: p.servicio,
      modelo: p.modelo ?? null,
      municipio: p.municipio,
      anio: p.anio != null ? String(p.anio) : null,
    },
    tarjeta: <TarjetaProyecto key={p.slug} proyecto={p} />,
  }))

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
        <FiltrosProyectos obras={obras} grupos={grupos} />
      </div>
    </>
  )
}
