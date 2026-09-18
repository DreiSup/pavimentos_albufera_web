import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Aparece from '@/components/ui/Aparece'
import Boton from '@/components/ui/Boton'
import { EnlaceEtiqueta } from '@/components/ui/EnlaceEtiqueta'
import Foto from '@/components/contenido/Foto'
import FichaObra from '@/components/datos/FichaObra'
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
  // El título se compone filtrando, igual que la ficha y la tarjeta. Sin
  // municipio decía «Hormigón impreso en obra sin municipio confirmado»: el
  // mismo corchete que el dueño ha retirado de la página, anunciado en la
  // pestaña del navegador y en el resultado de búsqueda, que es donde peor se
  // lee. Sin municipio no hay cláusula de lugar, y ya está.
  const titulo = [
    proyecto.municipio
      ? `${NOMBRE_SERVICIO[proyecto.servicio]} en ${proyecto.municipio}`
      : NOMBRE_SERVICIO[proyecto.servicio],
    modelo,
    color,
  ]
    .filter(Boolean)
    .join(' · ')
  return {
    title: titulo,
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
        {/* Tres miniaturas, no las cuatro de `design/02` §A4. La cuarta era el
            hueco etiquetado ANTES, y se retira por la misma decisión del dueño
            del 2026-09-18 que vacía la ficha: lo que no hay, no se enseña.
            Ninguna de las 125 fotos de la mediateca es un ANTES y no hay
            candidata, así que ese hueco no era una foto pendiente de llegar,
            era una promesa de la maqueta. Los huecos de las miniaturas 1 y 2 sí
            se quedan: esas fotos existen, faltan a 1600 px, y su bloque de
            posición tiene destinatario —la sesión fotográfica. */}
        <div className="grid grid-cols-3 gap-2">
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
              // Las miniaturas 1 y 2 son fotos distintas: esas sí piden su ancho,
              // que con tres columnas es 33vw y ya no el 25vw de cuatro.
              tamanos={i === 0 ? '100vw' : '33vw'}
              className={i === 0 ? 'outline outline-2 outline-tinta -outline-offset-2' : ''}
            />
          ))}
        </div>
      </section>

      {/* Envoltorio sin Aparece: la clase .aparece arranca en opacity:0, así que
          el contenido de esta sección —el h1 incluido— no se pintaba hasta que
          hidrataba. Queda descartado también animation-timeline: view() como
          sustituto. Las demás secciones de la página sí siguen apareciendo. */}
      <section className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        {/* Rejilla con colocación explícita, y no dos columnas con `order`. El H1
            vivía dentro de la columna izquierda junto a la narrativa, así que en
            móvil caía DEBAJO de la ficha: `design/02` §A4 pide H1 → ficha →
            encargo → ejecución. Mientras los dos apartados eran corchetes de
            maqueta el desorden pasaba desapercibido; sin ellos, la columna
            izquierda era un H1 solo. Ahora el H1 es hermano de la ficha y ocupa
            su celda: en móvil va primero por orden de documento y en escritorio
            sigue en la columna izquierda, sobre la narrativa. */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-8 md:gap-x-16">
          <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0 md:col-start-1 md:row-start-1">
            {proyecto.titulo}
          </h1>

          <div className="flex flex-col gap-4 md:col-start-2 md:row-start-1 md:row-span-2">
            <FichaObra
              titulo="Ficha de obra"
              sticky
              filas={[
                // Sin `<DatoPendiente>`: el dueño decidió el 2026-09-18 que los
                // datos de obra que no tiene no se ven, ni el valor ni el
                // corchete. `FichaObra` omite la fila sin valor, así que aquí
                // basta con pasar el dato tal cual está en el modelo: el día que
                // llegue, la fila vuelve sola y no hay que tocar esta página.
                { etiqueta: 'MUNICIPIO', valor: proyecto.municipio },
                { etiqueta: 'PROVINCIA', valor: proyecto.provincia },
                { etiqueta: 'SERVICIO', valor: NOMBRE_SERVICIO[proyecto.servicio] },
                // El guion largo era la misma fila vacía con otro disfraz.
                { etiqueta: 'MODELO', valor: proyecto.modelo ? NOMBRE_MODELO[proyecto.modelo] : null },
                { etiqueta: 'COLOR', valor: proyecto.color ? CODIGO_COLOR[proyecto.color] : null },
                { etiqueta: 'SUPERFICIE', valor: proyecto.superficie ? `${proyecto.superficie} m²` : null },
                { etiqueta: 'AÑO', valor: proyecto.anio },
                { etiqueta: 'PLAZO', valor: proyecto.plazoDias ? `${proyecto.plazoDias} días` : null },
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

          {/* «El encargo» y «La ejecución» se maquetaban con un recuadro
              punteado y un corchete describiendo qué debía contar cada uno. Era
              el hueco esperando copy; el dueño ha dicho el 2026-09-18 que no lo
              tiene y que no quiere verlo. Un H2 encabezando un recuadro vacío no
              informa de nada, así que sin texto se va el apartado entero, H2
              incluido, y si no hay ninguno de los dos no se pinta ni la celda.
              Hoy están en ese caso las nueve obras. */}
          {proyecto.encargo || proyecto.ejecucion ? (
            <div className="flex flex-col gap-8 md:col-start-1 md:row-start-2">
              {proyecto.encargo ? (
                <div className="flex flex-col gap-2">
                  <h2 className="font-display font-bold fs-h3 text-20 md:text-26 m-0">El encargo</h2>
                  <p className="text-16 md:text-20 text-tinta-media m-0">{proyecto.encargo}</p>
                </div>
              ) : null}
              {proyecto.ejecucion ? (
                <div className="flex flex-col gap-2">
                  <h2 className="font-display font-bold fs-h3 text-20 md:text-26 m-0">La ejecución</h2>
                  <p className="text-16 md:text-20 text-tinta-media m-0">{proyecto.ejecucion}</p>
                </div>
              ) : null}
            </div>
          ) : null}
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
