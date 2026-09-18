import type { Metadata } from 'next'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Migas from '@/components/layout/Migas'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
import { proyectos } from '@/lib/datos'

export const metadata: Metadata = {
  title: 'Proyectos ejecutados',
  description:
    'Obras de hormigón impreso, pulido y microcemento en Valencia, Alicante y Castellón.',
  alternates: { canonical: '/proyectos/' },
}

export default function Proyectos() {
  /**
   * Sin filtros no queda ni un gancho de cliente en esta pantalla: la rejilla
   * entera se arma aquí y el HTML sale con las 9 tarjetas, sus fotos y sus
   * enlaces, como ya salía. Lo que se va son los bytes de JS del filtro.
   *
   * Un enlace antiguo con `?servicio=…` sigue llegando a la misma página: los
   * parámetros ya no los lee nadie y se ven todas las obras, que es el estado
   * al que llevaba su chip «Todos».
   */
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
            Todas las fotos de esta web son trabajos nuestros.
          </p>
        </div>
      </section>

      <div className="px-[18px] md:px-lat-desktop pb-9 md:pb-22">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {proyectos.map((p) => (
            <TarjetaProyecto key={p.slug} proyecto={p} />
          ))}
        </div>
      </div>
    </>
  )
}
