import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import Aparece from '@/components/ui/Aparece'
import Boton from '@/components/ui/Boton'
import { EnlaceEtiqueta } from '@/components/ui/EnlaceEtiqueta'
import EstadoVacio from '@/components/ui/EstadoVacio'
import BloquePosicion from '@/components/contenido/BloquePosicion'
import EtiquetaTecnica from '@/components/datos/EtiquetaTecnica'
import DatoPendiente from '@/components/datos/DatoPendiente'
import FichaObra from '@/components/datos/FichaObra'
import MuestraAcabado from '@/components/contenido/MuestraAcabado'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
import Migas from '@/components/layout/Migas'
import { DESCRIPCION_SERVICIO } from '@/components/secciones/ServicioPlantilla'
import {
  acabadoPorSlug,
  acabados,
  acabadosPorModelo,
  articuloQueExplica,
  modelosEnUso,
  proyectosDe,
  proyectosPorModelo,
} from '@/lib/datos'
import {
  NOMBRE_MODELO,
  NOMBRE_SERVICIO,
  RUTA_SERVICIO,
  type Acabado,
  type ModeloId,
  type Proyecto,
  type ServicioId,
} from '@/lib/tipos'

/**
 * Ficha de acabado (02-pantallas.md §B2). La ruta cubre dos casos, porque el
 * catálogo tiene dos formas de identificar un acabado:
 *
 * - **Modelo**: `/acabados/espiga/` agrupa todos los colores de un molde. Solo
 *   existe en impreso, que es donde hay moldes (03-modelo-de-contenido §2.2).
 * - **Acabado suelto**: `/acabados/pulido-gris/` para las técnicas sin molde
 *   —pulido, lavado, fratasado y microcemento—, cuyo acabado se identifica por
 *   su slug. Sin esto, las cuatro muestras del muestrario que no tienen `modelo`
 *   enlazan a una ruta que no se genera.
 *
 * La segunda alternativa —mandar esas cuatro muestras a su página de servicio—
 * se descartó: el muestrario promete la ficha de un acabado concreto con la obra
 * en la que se ejecutó, y la página de servicio no da eso; además dejaría cuatro
 * acabados del catálogo sin ruta indexable propia.
 */

const slugsSinModelo = acabados.filter((a) => !a.modelo).map((a) => a.slug)

export function generateStaticParams() {
  return [...modelosEnUso(), ...slugsSinModelo].map((modelo) => ({ modelo }))
}

type Ficha = {
  esModelo: boolean
  servicio: ServicioId
  titulo: string
  descripcion: string
  lineasEtiqueta: string[]
  tituloFicha: string
  codigo?: string
  variantes: Acabado[]
  proyectos: Proyecto[]
}

function resolver(param: string): Ficha | null {
  const nombreModelo = NOMBRE_MODELO[param as ModeloId]

  if (nombreModelo) {
    const variantes = acabadosPorModelo(param as ModeloId)
    if (variantes.length === 0) return null
    const servicio = variantes[0].servicio
    return {
      esModelo: true,
      servicio,
      titulo: `Modelo ${nombreModelo.toLowerCase()}`,
      descripcion:
        servicio === 'impreso'
          ? 'Molde grabado sobre hormigón impreso. Funciona en los mismos espacios que el resto de acabados de impreso: entradas, porches, terrazas y contornos de piscina.'
          : DESCRIPCION_SERVICIO[servicio],
      lineasEtiqueta: [
        NOMBRE_SERVICIO[servicio].toUpperCase(),
        `MODELO ${nombreModelo.toUpperCase()}`,
      ],
      tituloFicha: 'Ficha técnica del modelo',
      variantes,
      proyectos: proyectosPorModelo(param as ModeloId).slice(0, 3),
    }
  }

  const acabado = acabadoPorSlug(param)
  // Un acabado con modelo se sirve en la ruta del modelo, no en la suya.
  if (!acabado || acabado.modelo) return null

  return {
    esModelo: false,
    servicio: acabado.servicio,
    titulo: `${acabado.nombre} en ${acabado.codigo.toLowerCase()}`,
    descripcion: DESCRIPCION_SERVICIO[acabado.servicio],
    lineasEtiqueta: [NOMBRE_SERVICIO[acabado.servicio].toUpperCase(), acabado.codigo],
    tituloFicha: 'Ficha técnica del acabado',
    codigo: acabado.codigo,
    variantes: [],
    proyectos: proyectosDe(acabado.proyectos).slice(0, 3),
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ modelo: string }>
}): Promise<Metadata> {
  const { modelo } = await params
  const ficha = resolver(modelo)
  if (!ficha) return {}

  const tecnica = NOMBRE_SERVICIO[ficha.servicio].toLowerCase()
  return {
    title: ficha.esModelo
      ? `${ficha.titulo} | Muestrario de ${tecnica}`
      : `${ficha.titulo} | Muestrario de acabados`,
    description: ficha.esModelo
      ? `${ficha.titulo} de ${tecnica}: colores disponibles y obra real ejecutada con este modelo.`
      : `Acabado de ${tecnica} en ${ficha.codigo}: ficha técnica y obra real donde se ha ejecutado.`,
    alternates: { canonical: `/acabados/${modelo}/` },
  }
}

/** Datos del oficio que solo están confirmados para algunas técnicas. El resto
 *  se pinta pendiente: extender el registro técnico a los seis servicios es
 *  justamente lo que pide el §2.3 del documento maestro. */
function filasTecnicas(ficha: Ficha) {
  const espesor: ReactNode =
    ficha.servicio === 'impreso' ? '10 cm' : <DatoPendiente>pendiente</DatoPendiente>
  const antideslizamiento: ReactNode =
    ficha.servicio === 'lavado' ? 'Clase 3, Rd > 45' : <DatoPendiente>pendiente</DatoPendiente>
  const usos: ReactNode =
    ficha.servicio === 'impreso' ? (
      'Peatonal y paso de vehículos'
    ) : (
      <DatoPendiente>pendiente</DatoPendiente>
    )

  return [
    { etiqueta: 'TÉCNICA', valor: NOMBRE_SERVICIO[ficha.servicio] },
    ...(ficha.codigo ? [{ etiqueta: 'COLOR', valor: ficha.codigo }] : []),
    { etiqueta: 'ESPESOR RECOMENDADO', valor: espesor },
    { etiqueta: 'ANTIDESLIZAMIENTO', valor: antideslizamiento },
    { etiqueta: 'USOS', valor: usos },
  ]
}

export default async function FichaAcabado({ params }: { params: Promise<{ modelo: string }> }) {
  const { modelo } = await params
  const ficha = resolver(modelo)
  if (!ficha) notFound()

  const articulo = articuloQueExplica(ficha.servicio)

  return (
    <>
      <Migas items={[{ nombre: 'Acabados', href: '/acabados/' }, { nombre: ficha.titulo }]} />

      <section className="px-[18px] md:px-lat-desktop pb-8 md:pb-14">
        <BloquePosicion
          proporcion="4/3"
          etiqueta={<EtiquetaTecnica lineas={ficha.lineasEtiqueta} />}
        />
      </section>

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-8 md:gap-16">
          <div className="flex flex-col gap-4 items-start">
            <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
              {ficha.titulo}
            </h1>
            <p className="text-16 md:text-20 text-tinta-media max-w-[52ch] m-0">
              {ficha.descripcion}
            </p>
            <EnlaceEtiqueta href={RUTA_SERVICIO[ficha.servicio]}>
              Ver {NOMBRE_SERVICIO[ficha.servicio].toLowerCase()} →
            </EnlaceEtiqueta>
          </div>
          <FichaObra titulo={ficha.tituloFicha} sticky filas={filasTecnicas(ficha)} />
        </div>
      </Aparece>

      {ficha.esModelo ? (
        <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
          <div className="flex flex-col gap-6">
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
              Colores disponibles en este modelo
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px_10px] md:gap-[32px_24px]">
              {ficha.variantes.map((v) => (
                <MuestraAcabado key={v.slug} acabado={v} />
              ))}
            </div>
          </div>
        </Aparece>
      ) : null}

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-6">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            Obras donde se ha ejecutado
          </h2>
          {ficha.proyectos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ficha.proyectos.map((p) => (
                <TarjetaProyecto key={p.slug} proyecto={p} />
              ))}
            </div>
          ) : (
            <EstadoVacio
              titulo="Aún no hay obra documentada con este acabado"
              texto="Lo hemos ejecutado, pero todavía no tenemos la ficha fotográfica lista. Pregúntanos directamente."
            />
          )}
          {articulo ? (
            <EnlaceEtiqueta href={`/blog/${articulo.slug}/`}>Cómo se hace →</EnlaceEtiqueta>
          ) : null}
        </div>
      </Aparece>

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            ¿Quieres este acabado en tu obra?
          </h2>
          <div className="flex gap-3">
            <Boton variante="primario" href="/presupuesto/">
              Pedir presupuesto
            </Boton>
            <Boton variante="contorno" href="/acabados/">
              Volver al muestrario
            </Boton>
          </div>
        </div>
      </Aparece>
    </>
  )
}
