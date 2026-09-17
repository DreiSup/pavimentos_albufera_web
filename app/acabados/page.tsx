import type { Metadata } from 'next'
import Aparece from '@/components/ui/Aparece'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Boton from '@/components/ui/Boton'
import Migas from '@/components/layout/Migas'
import MuestraAcabado from '@/components/contenido/MuestraAcabado'
import FiltrosAcabados, {
  type AcabadoFiltrable,
  type GrupoAcabados,
} from '@/components/secciones/FiltrosAcabados'
import { acabados, contarDocumentados, tecnicasEnUso } from '@/lib/datos'
import { NOMBRE_SERVICIO } from '@/lib/tipos'

export const metadata: Metadata = {
  title: 'Muestrario de acabados de hormigón impreso',
  description:
    'Modelos y colores sobre obra real: espiga, adoquín, sillería, manta y piedra inglesa. Elige el acabado antes de pedir presupuesto.',
  alternates: { canonical: '/acabados/' },
}

const total = acabados.length
const documentados = contarDocumentados()

/**
 * Una sola fila de chips, la de técnica. La de color se retiró el 2026-09-17
 * (`design/02` §A3): filtrar por pigmento pedía al visitante el dato que viene a
 * buscar, y con un solo eje el estado vacío deja de ser alcanzable porque cada
 * opción sale del propio catálogo que se pinta.
 */
const grupoTecnica: GrupoAcabados = {
  clave: 'tecnica',
  etiqueta: 'Técnica',
  todos: 'Todas',
  opciones: tecnicasEnUso().map((t) => ({ valor: t, nombre: NOMBRE_SERVICIO[t] })),
}

export default function Acabados() {
  /**
   * Las muestras se arman aquí, en servidor, y cruzan la frontera ya hechas.
   * `FiltrosAcabados` solo elige cuáles se enseñan, así que las 16 muestras con
   * sus fotos y sus enlaces salen en el HTML estático sin esperar a hidratar.
   */
  const muestras: AcabadoFiltrable[] = acabados.map((a) => ({
    clave: a.slug,
    valores: { tecnica: a.servicio },
    muestra: <MuestraAcabado key={a.slug} acabado={a} />,
  }))

  return (
    <>
      <Migas items={[{ nombre: 'Acabados' }]} />

      <section className="px-[18px] md:px-lat-desktop pb-8 md:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-8 md:gap-16">
          <div className="flex flex-col justify-center gap-4">
            <AntetituloSeccion numero="03">
              {total} ACABADOS · {documentados} CON OBRA DOCUMENTADA
            </AntetituloSeccion>
            <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
              El muestrario
            </h1>
            <p className="text-16 md:text-20 text-tinta-media max-w-[52ch] m-0">
              Cada muestra es una obra ejecutada, con su modelo y su color reales. Filtra por
              técnica, guárdate el código y dínoslo cuando hablemos.
            </p>
          </div>
        </div>
      </section>

      <div className="px-[18px] md:px-lat-desktop">
        <FiltrosAcabados muestras={muestras} grupo={grupoTecnica} />
      </div>

      <Aparece
        as="section"
        className="mt-14 sobre-oscuro bg-tinta text-fondo px-[18px] md:px-lat-desktop py-9 md:py-22"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="flex flex-col gap-4">
            <AntetituloSeccion sobreOscuro>Cómo se lee un código</AntetituloSeccion>
            <p className="text-16 md:text-20 text-sobre-tinta m-0">
              Cada muestra lleva su técnica, su modelo y su color. El color final varía con la luz,
              el árido y el sellado; la muestra orienta, la obra manda.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <p className="font-mono text-20 tracking-[0.05em] m-0">
              IMPRESO <span className="text-acero">/</span> ESPIGA <span className="text-acero">/</span> C-117
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-mono text-d-11 text-sobre-tinta uppercase m-0 mb-1">Técnica</p>
                <p className="text-14 text-sobre-tinta m-0">Cómo se ejecuta: impreso, pulido, microcemento…</p>
              </div>
              <div>
                <p className="font-mono text-d-11 text-sobre-tinta uppercase m-0 mb-1">Modelo</p>
                <p className="text-14 text-sobre-tinta m-0">El dibujo del molde, solo aplica a impreso.</p>
              </div>
              <div>
                <p className="font-mono text-d-11 text-sobre-tinta uppercase m-0 mb-1">Color</p>
                <p className="text-14 text-sobre-tinta m-0">El pigmento aplicado sobre el hormigón.</p>
              </div>
            </div>
          </div>
        </div>
      </Aparece>

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            ¿Ya sabes qué acabado quieres?
          </h2>
          <div className="flex gap-3">
            <Boton variante="primario" href="/presupuesto/">
              Pedir presupuesto
            </Boton>
            <Boton variante="contorno" href="/proyectos/">
              Ver proyectos
            </Boton>
          </div>
        </div>
      </Aparece>
    </>
  )
}
