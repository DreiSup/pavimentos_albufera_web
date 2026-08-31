import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Aparece from '@/components/ui/Aparece'
import Boton from '@/components/ui/Boton'
import { EnlaceEtiqueta } from '@/components/ui/EnlaceEtiqueta'
import EstadoVacio from '@/components/ui/EstadoVacio'
import Foto from '@/components/contenido/Foto'
import EtiquetaTecnica from '@/components/datos/EtiquetaTecnica'
import { IMAGEN_MODELO } from '@/content/modelos'
import DatoPendiente from '@/components/datos/DatoPendiente'
import FichaObra from '@/components/datos/FichaObra'
import MuestraAcabado from '@/components/contenido/MuestraAcabado'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
import Migas from '@/components/layout/Migas'
import { acabados, acabadosPorModelo, articuloQueExplica, proyectosPorModelo } from '@/lib/datos'
import { NOMBRE_MODELO, NOMBRE_SERVICIO, type ModeloId } from '@/lib/tipos'

export function generateStaticParams() {
  const modelos = new Set(acabados.map((a) => a.modelo).filter(Boolean))
  return Array.from(modelos).map((modelo) => ({ modelo }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ modelo: string }>
}): Promise<Metadata> {
  const { modelo } = await params
  const nombre = NOMBRE_MODELO[modelo as ModeloId]
  if (!nombre) return {}
  return {
    title: `Modelo ${nombre} | Muestrario de hormigón impreso`,
    description: `Modelo ${nombre} de hormigón impreso: colores disponibles y obra real ejecutada con este modelo.`,
    alternates: { canonical: `/acabados/${modelo}/` },
  }
}

export default async function FichaAcabado({ params }: { params: Promise<{ modelo: string }> }) {
  const { modelo: modeloParam } = await params
  const modelo = modeloParam as ModeloId
  const nombre = NOMBRE_MODELO[modelo]
  if (!nombre) notFound()

  const variantes = acabadosPorModelo(modelo)
  const proyectos = proyectosPorModelo(modelo).slice(0, 3)
  const articulo = articuloQueExplica('impreso')

  // `IMAGEN_MODELO` es el hero a sangre de esta pantalla, y la misma foto vuelve
  // a salir abajo como muestra de color y como tarjeta de obra. Los dos huecos
  // de abajo adoptan el `sizes` del hero para que sea UNA descarga y no tres.
  const TAMANOS_HERO = '100vw'
  const fotoHero = IMAGEN_MODELO[modelo]?.src

  return (
    <>
      <Migas items={[{ nombre: 'Acabados', href: '/acabados/' }, { nombre }]} />

      <section className="px-[18px] md:px-lat-desktop pb-8 md:pb-14">
        <Foto
          imagen={IMAGEN_MODELO[modelo]}
          proporcion="4/3"
          prioridad
          tamanos={TAMANOS_HERO}
          etiqueta={<EtiquetaTecnica lineas={['IMPRESO', `MODELO ${nombre.toUpperCase()}`]} />}
        />
      </section>

      {/* Envoltorio sin Aparece: la clase .aparece arranca en opacity:0, así que
          el contenido de esta sección —el h1 incluido— no se pintaba hasta que
          hidrataba. Queda descartado también animation-timeline: view() como
          sustituto. Las demás secciones de la página sí siguen apareciendo. */}
      <section className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-8 md:gap-16">
          <div className="flex flex-col gap-4">
            <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
              Modelo {nombre.toLowerCase()}
            </h1>
            <p className="text-16 md:text-20 text-tinta-media max-w-[52ch] m-0">
              Molde grabado sobre hormigón impreso. Funciona en los mismos espacios que el resto de
              acabados de impreso: entradas, porches, terrazas y contornos de piscina.
            </p>
          </div>
          <FichaObra
            titulo="Ficha técnica del modelo"
            sticky
            filas={[
              { etiqueta: 'TÉCNICA', valor: NOMBRE_SERVICIO.impreso },
              { etiqueta: 'ESPESOR RECOMENDADO', valor: '10 cm' },
              { etiqueta: 'ANTIDESLIZAMIENTO', valor: <DatoPendiente>pendiente</DatoPendiente> },
              { etiqueta: 'USOS', valor: 'Peatonal y paso de vehículos' },
            ]}
          />
        </div>
      </section>

      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-6">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            Colores disponibles en este modelo
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px_10px] md:gap-[32px_24px]">
            {variantes.map((v) => (
              <MuestraAcabado
                key={v.slug}
                acabado={v}
                tamanos={v.muestra?.src === fotoHero ? TAMANOS_HERO : undefined}
              />
            ))}
          </div>
        </div>
      </Aparece>

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-6">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            Obras donde se ha ejecutado
          </h2>
          {proyectos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {proyectos.map((p) => (
                <TarjetaProyecto
                  key={p.slug}
                  proyecto={p}
                  tamanos={p.imagenes[0]?.src === fotoHero ? TAMANOS_HERO : undefined}
                />
              ))}
            </div>
          ) : (
            <EstadoVacio
              titulo="Aún no hay obra documentada con este modelo"
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
