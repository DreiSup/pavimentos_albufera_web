import Aparece from '@/components/ui/Aparece'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Boton from '@/components/ui/Boton'
import { EnlaceEtiqueta } from '@/components/ui/EnlaceEtiqueta'
import Foto from '@/components/contenido/Foto'
import EtiquetaTecnica from '@/components/datos/EtiquetaTecnica'
import DatoPendiente from '@/components/datos/DatoPendiente'
import TablaFichaTecnica from '@/components/datos/TablaFichaTecnica'
import MuestraAcabado from '@/components/contenido/MuestraAcabado'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
import EstadoVacio from '@/components/ui/EstadoVacio'
import Migas from '@/components/layout/Migas'
import SubmenuServicio from '@/components/secciones/SubmenuServicio'
import Calculadora from '@/components/secciones/Calculadora'
import Acordeon from '@/components/secciones/Acordeon'
import FormularioPresupuesto from '@/components/secciones/FormularioPresupuesto'
import { JsonLd, schemaFAQ, schemaServicio } from '@/lib/schema'
import { acabadosPorServicio, proyectosPorServicio } from '@/lib/datos'
import type { Servicio } from '@/content/servicios'

/**
 * Plantilla única de las seis páginas de servicio.
 *
 * `04-desarrollo-y-deploy.md` §2: «un componente por concepto de diseño, no por
 * pantalla». Antes esto vivía copiado dentro de `/hormigon-impreso/`, y clonarlo
 * cinco veces habría garantizado que las seis divergieran en un mes.
 *
 * Las secciones que no tienen contenido **no se renderizan a medias**: el
 * numerado y el submenú se construyen a partir de lo que existe de verdad. Y
 * las que dependen de datos del cliente (muestrario, obra) caen a `EstadoVacio`
 * en lugar de fingir un catálogo — es la misma decisión que `design/05` §B4 tomó
 * con las reseñas.
 */

const PASOS = [
  {
    numero: '01',
    titulo: 'Visita y medición',
    texto:
      'Vamos a verlo. Sin coste y sin compromiso. Medimos, comprobamos el estado del terreno y el acceso para el camión.',
  },
  {
    numero: '02',
    titulo: 'Presupuesto cerrado',
    texto: (
      <>
        Te lo enviamos en <DatoPendiente>48 horas</DatoPendiente>, desglosado. Lo que pone es lo que
        se paga.
      </>
    ),
  },
  {
    numero: '03',
    titulo: 'Ejecución',
    texto: (
      <>
        <DatoPendiente>Equipo propio</DatoPendiente>. Una superficie de 80-100 m² se ejecuta en 2 o 3
        días. Después necesita entre 24 y 48 horas sin pisar y 28 días para curar del todo.
      </>
    ),
  },
  {
    numero: '04',
    titulo: 'Garantía y mantenimiento',
    texto: '10 años. Y volvemos a resellar cuando toque.',
  },
]

export default function PaginaServicio({ servicio }: { servicio: Servicio }) {
  const acabados = acabadosPorServicio(servicio.id)
  const proyectos = proyectosPorServicio(servicio.id).slice(0, 3)

  // El numerado sigue el orden real de las secciones presentes. Si un servicio
  // no tiene rango de precio aprobado, no hay hueco vacío ni número saltado.
  const secciones = [
    servicio.aplicaciones ? { id: 'seccion-aplicaciones', texto: 'Aplicaciones' } : null,
    { id: 'seccion-muestrario', texto: 'Muestrario' },
    { id: 'seccion-ficha', texto: 'Ficha técnica' },
    servicio.cuandoNo ? { id: 'seccion-cuando-no', texto: 'Cuándo NO' } : null,
    servicio.usosCalculadora ? { id: 'seccion-precio', texto: 'Precio' } : null,
    { id: 'seccion-como', texto: 'Cómo trabajamos' },
    { id: 'seccion-obra', texto: 'Obra ejecutada' },
  ].filter((s): s is { id: string; texto: string } => s !== null)

  const numero = (id: string) => String(secciones.findIndex((s) => s.id === id) + 1).padStart(2, '0')
  const anclas = secciones.map((s) => ({ id: s.id, texto: `${numero(s.id)} · ${s.texto}` }))

  return (
    <>
      <JsonLd data={schemaServicio(servicio.id, servicio.nombre, servicio.ruta)} />
      <Migas items={[{ nombre: 'Servicios' }, { nombre: servicio.nombre }]} />

      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-[1fr_560px] gap-8 md:gap-16 px-[18px] md:px-lat-desktop pb-8 md:pb-14">
        <div className="flex flex-col justify-center gap-5 order-2 md:order-1">
          <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
            {servicio.h1}
          </h1>
          <p className="text-16 md:text-20 text-tinta-media max-w-[52ch] m-0">{servicio.entradilla}</p>
          <div className="flex flex-col md:flex-row gap-3">
            <Boton variante="primario" href="/presupuesto/">
              Pedir presupuesto
            </Boton>
            <Boton variante="contorno" href="#seccion-muestrario">
              Ver acabados
            </Boton>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <Foto
            imagen={servicio.imagenHero}
            proporcion="4/3"
            prioridad
            tamanos="(min-width: 768px) 50vw, 100vw"
            etiqueta={<EtiquetaTecnica lineas={servicio.etiquetaHero} />}
          />
        </div>
      </section>

      <SubmenuServicio anclas={anclas} />

      {servicio.aplicaciones ? (
        <Aparece as="section" id="seccion-aplicaciones" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
          <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
            <div className="flex flex-col gap-4">
              <AntetituloSeccion numero={numero('seccion-aplicaciones')}>Aplicaciones</AntetituloSeccion>
              <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
                Dónde tiene sentido ponerlo
              </h2>
              <p className="text-16 text-tinta-media m-0">{servicio.aplicaciones.intro}</p>
            </div>
            <div className="flex flex-col">
              {servicio.aplicaciones.lista.map((a) => (
                <div
                  key={a.nombre}
                  className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-2 md:gap-6 py-4 border-t border-fondo-alt first:border-t-0 md:first:border-t md:border-t-tinta-media"
                >
                  <h3 className="font-display font-bold fs-h3 text-20 md:text-26 m-0">{a.nombre}</h3>
                  {a.texto ? <p className="text-16 text-tinta-media m-0">{a.texto}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </Aparece>
      ) : null}

      {/* Muestrario del servicio */}
      <Aparece as="section" id="seccion-muestrario" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <AntetituloSeccion numero={numero('seccion-muestrario')}>Muestrario del servicio</AntetituloSeccion>
            {acabados.length > 0 ? (
              <EnlaceEtiqueta href={`/acabados/?tecnica=${servicio.id}`}>
                Ver todos los acabados de {servicio.nombre.toLowerCase()} →
              </EnlaceEtiqueta>
            ) : null}
          </div>
          {acabados.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px_10px] md:gap-[32px_24px]">
              {acabados.map((a) => (
                <MuestraAcabado key={a.slug} acabado={a} />
              ))}
            </div>
          ) : (
            <EstadoVacio
              titulo="Todavía no hemos subido el muestrario de este acabado"
              texto="Solo enseñamos acabados con obra ejecutada de verdad. Pregúntanos y te enseñamos las muestras que tenemos."
            />
          )}
        </div>
      </Aparece>

      {/* Ficha técnica */}
      <Aparece as="section" id="seccion-ficha" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
          <AntetituloSeccion numero={numero('seccion-ficha')}>Ficha técnica</AntetituloSeccion>
          <TablaFichaTecnica filas={servicio.fichaTecnica} />
        </div>
      </Aparece>

      {servicio.cuandoNo ? (
        <Aparece
          as="section"
          id="seccion-cuando-no"
          className="sobre-oscuro bg-tinta text-fondo px-[18px] md:px-lat-desktop py-9 md:py-22"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div className="flex flex-col gap-4">
              <AntetituloSeccion numero={numero('seccion-cuando-no')} sobreOscuro>
                {servicio.cuandoNo.titulo}
              </AntetituloSeccion>
              <p className="text-16 md:text-20 text-sobre-tinta m-0">{servicio.cuandoNo.texto}</p>
            </div>
            <div className="flex flex-col gap-3 justify-center">
              {servicio.cuandoNo.alternativas.map((alt) => (
                <Boton key={alt.href} variante="contorno" sobreOscuro href={alt.href}>
                  {alt.texto}
                </Boton>
              ))}
            </div>
          </div>
        </Aparece>
      ) : null}

      {servicio.usosCalculadora ? (
        <Aparece as="section" id="seccion-precio" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
          <div className="flex flex-col gap-6">
            <AntetituloSeccion numero={numero('seccion-precio')}>Precio</AntetituloSeccion>
            <Calculadora reducida={false} usos={servicio.usosCalculadora} />
          </div>
        </Aparece>
      ) : null}

      {/* Cómo trabajamos */}
      <Aparece as="section" id="seccion-como" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-8">
          <AntetituloSeccion numero={numero('seccion-como')}>Cómo trabajamos</AntetituloSeccion>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            {PASOS.map((p) => (
              <div key={p.numero} className="flex md:flex-col gap-4">
                <span className="font-display font-bold fs-h2 text-26 md:text-34 text-acero w-[42px] md:w-auto shrink-0 md:border-t md:border-tinta md:pt-4">
                  {p.numero}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-display font-bold fs-h3 text-20 m-0">{p.titulo}</h3>
                  <p className="text-14 md:text-16 text-tinta-media m-0">{p.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Aparece>

      {/* Obra ejecutada */}
      <Aparece as="section" id="seccion-obra" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-6">
          <AntetituloSeccion numero={numero('seccion-obra')}>Obra ejecutada</AntetituloSeccion>
          {proyectos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {proyectos.map((p) => (
                <TarjetaProyecto key={p.slug} proyecto={p} />
              ))}
            </div>
          ) : (
            <EstadoVacio
              titulo="Todavía no hemos publicado obra de este acabado"
              texto="Lo hemos ejecutado, pero aún no tenemos la ficha con fotos propias montada. Pídenos referencias y te las pasamos."
            />
          )}
        </div>
      </Aparece>

      {/* FAQ — solo las preguntas que aplican a ESTE servicio. Si no hay
          ninguna, no se renderiza sección vacía ni marcado `FAQPage` de más. */}
      {servicio.faq && servicio.faq.length > 0 ? (
        <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
          <JsonLd data={schemaFAQ(servicio.faq)} />
          <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
            <AntetituloSeccion numero={String(secciones.length + 1).padStart(2, '0')}>
              Preguntas frecuentes
            </AntetituloSeccion>
            <Acordeon preguntas={servicio.faq} />
          </div>
        </Aparece>
      ) : null}

      {/* Cierre */}
      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="flex flex-col gap-6">
            <h2 className="font-display font-bold fs-hero text-34 md:text-64 m-0">
              Cuéntanos qué quieres hacer
            </h2>
            <p className="text-16 md:text-20 text-tinta-media m-0">
              Te llamamos, vamos a verlo y te damos un precio cerrado. Sin coste y sin compromiso.
            </p>
          </div>
          <FormularioPresupuesto variante="corto" origen="service_close" />
        </div>
      </Aparece>
    </>
  )
}
