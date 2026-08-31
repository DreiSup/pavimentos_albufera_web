import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Aparece from '@/components/ui/Aparece'
import Boton from '@/components/ui/Boton'
import { EnlaceEtiqueta } from '@/components/ui/EnlaceEtiqueta'
import Foto from '@/components/contenido/Foto'
import FichaObra from '@/components/datos/FichaObra'
import DatoPendiente from '@/components/datos/DatoPendiente'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
import Migas from '@/components/layout/Migas'
import { acabados, articuloQueExplica, proyectoPorSlug, proyectos, proyectosPorServicio } from '@/lib/datos'
import { CODIGO_COLOR, NOMBRE_MODELO, NOMBRE_SERVICIO } from '@/lib/tipos'

export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const proyecto = proyectoPorSlug(slug)
  if (!proyecto) return {}
  const modelo = proyecto.modelo ? NOMBRE_MODELO[proyecto.modelo] : null
  const color = proyecto.color ? CODIGO_COLOR[proyecto.color] : null
  const detalle = [modelo, color].filter(Boolean).join(' · ')
  return {
    title: `${NOMBRE_SERVICIO[proyecto.servicio]} en ${proyecto.municipio ?? 'obra sin municipio confirmado'}${detalle ? ` · ${detalle}` : ''}`,
    description: `${proyecto.titulo}. ${NOMBRE_SERVICIO[proyecto.servicio]} ejecutado por Pavimentos Albufera.`,
    alternates: { canonical: `/proyectos/${proyecto.slug}/` },
  }
}

export default async function FichaProyecto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const proyecto = proyectoPorSlug(slug)
  if (!proyecto) notFound()

  const acabado = acabados.find(
    (a) => a.modelo === proyecto.modelo && a.color === proyecto.color && a.servicio === proyecto.servicio,
  )
  const articulo = articuloQueExplica(proyecto.servicio)
  const similares = proyectosPorServicio(proyecto.servicio, proyecto.slug).slice(0, 3)

  return (
    <>
      <Migas items={[{ nombre: 'Proyectos', href: '/proyectos/' }, { nombre: proyecto.titulo }]} />

      {/* Galería */}
      <section className="px-[18px] md:px-lat-desktop pb-3 flex flex-col gap-2">
        <Foto imagen={proyecto.imagenes[0]} proporcion="21/9" prioridad tamanos="100vw" />
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2].map((i) => (
            <Foto
              key={i}
              imagen={proyecto.imagenes[i]}
              proporcion="4/3"
              // La miniatura 0 es EL MISMO archivo que el hero a sangre de arriba.
              // Dos `sizes` distintos sobre una misma foto son dos peticiones a
              // `/_next/image?`: el navegador resuelve cada `sizes` por su cuenta y
              // elige un `w=` distinto. Con la cadena idéntica a la del hero elige
              // el mismo, así que la miniatura sale de la caché de una descarga que
              // ya se está haciendo —y encima con `priority`— y no cuesta un byte.
              // Las miniaturas 1 y 2 son fotos distintas: esas sí piden su 25vw.
              tamanos={i === 0 ? '100vw' : '25vw'}
              className={i === 0 ? 'outline outline-2 outline-tinta -outline-offset-2' : ''}
            />
          ))}
          {/* Ninguna de las 125 fotos de la mediateca de la web viva es un ANTES.
              Mientras no la haya, este hueco se queda en bloque de posición: una
              foto de proceso reetiquetada como ANTES sería un dato falso. */}
          <Foto
            imagen={proyecto.imagenes.find((img) => img.tipo === 'antes')}
            proporcion="4/3"
            tamanos="25vw"
            etiqueta={<span className="absolute bottom-2 right-2 font-mono text-d-10 text-tinta-media bg-fondo px-1">ANTES</span>}
          />
        </div>
      </section>

      {/* Envoltorio sin Aparece: la clase .aparece arranca en opacity:0, así que
          el contenido de esta sección —el h1 incluido— no se pintaba hasta que
          hidrataba. Queda descartado también animation-timeline: view() como
          sustituto. Las demás secciones de la página sí siguen apareciendo. */}
      <section className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-8 md:gap-16">
          <div className="flex flex-col gap-8 order-2 md:order-1">
            <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
              {proyecto.titulo}
            </h1>

            <div className="flex flex-col gap-2">
              <h2 className="font-display font-bold fs-h3 text-20 md:text-26 m-0">El encargo</h2>
              {proyecto.encargo ? (
                <p className="text-16 md:text-20 text-tinta-media m-0">{proyecto.encargo}</p>
              ) : (
                <div className="border border-dashed border-tinta-media p-4">
                  <p className="pendiente text-14 m-0">
                    [Qué había antes, qué problema tenía y con qué condición llegó el cliente.]
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-display font-bold fs-h3 text-20 md:text-26 m-0">La ejecución</h2>
              {proyecto.ejecucion ? (
                <p className="text-16 md:text-20 text-tinta-media m-0">{proyecto.ejecucion}</p>
              ) : (
                <div className="border border-dashed border-tinta-media p-4">
                  <p className="pendiente text-14 m-0">[Qué se hizo y qué dificultad concreta tuvo esta obra.]</p>
                </div>
              )}
            </div>
          </div>

          <div className="order-1 md:order-2 flex flex-col gap-4">
            <FichaObra
              titulo="Ficha de obra"
              sticky
              filas={[
                { etiqueta: 'MUNICIPIO', valor: proyecto.municipio ?? <DatoPendiente>municipio</DatoPendiente> },
                { etiqueta: 'PROVINCIA', valor: proyecto.provincia ?? <DatoPendiente>provincia</DatoPendiente> },
                { etiqueta: 'SERVICIO', valor: NOMBRE_SERVICIO[proyecto.servicio] },
                { etiqueta: 'MODELO', valor: proyecto.modelo ? NOMBRE_MODELO[proyecto.modelo] : '—' },
                { etiqueta: 'COLOR', valor: proyecto.color ? CODIGO_COLOR[proyecto.color] : '—' },
                { etiqueta: 'SUPERFICIE', valor: proyecto.superficie ? `${proyecto.superficie} m²` : <DatoPendiente>m²</DatoPendiente> },
                { etiqueta: 'AÑO', valor: proyecto.anio ?? <DatoPendiente>año</DatoPendiente> },
                { etiqueta: 'PLAZO', valor: proyecto.plazoDias ? `${proyecto.plazoDias} días` : <DatoPendiente>días</DatoPendiente> },
              ]}
            />
            {acabado ? (
              <EnlaceEtiqueta href={`/acabados/${acabado.modelo ?? acabado.slug}/`}>
                Ver el acabado empleado →
              </EnlaceEtiqueta>
            ) : null}
            {articulo ? (
              <EnlaceEtiqueta href={`/blog/${articulo.slug}/`}>Cómo se hace →</EnlaceEtiqueta>
            ) : null}
          </div>
        </div>
      </section>

      {similares.length > 0 ? (
        <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
          <div className="flex flex-col gap-6">
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">Proyectos similares</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similares.map((p) => (
                <TarjetaProyecto key={p.slug} proyecto={p} fondo="base" />
              ))}
            </div>
          </div>
        </Aparece>
      ) : null}

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">¿Quieres algo parecido?</h2>
          <Boton variante="primario" href="/presupuesto/">
            Pedir presupuesto
          </Boton>
        </div>
      </Aparece>
    </>
  )
}
