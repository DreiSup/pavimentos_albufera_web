import type { ReactNode } from 'react'
import Aparece from '../ui/Aparece'
import AntetituloSeccion from '../ui/AntetituloSeccion'
import Boton from '../ui/Boton'
import { EnlaceEtiqueta } from '../ui/EnlaceEtiqueta'
import BloquePosicion from '../contenido/BloquePosicion'
import EtiquetaTecnica from '../datos/EtiquetaTecnica'
import DatoPendiente from '../datos/DatoPendiente'
import MuestraAcabado from '../contenido/MuestraAcabado'
import TarjetaProyecto from '../contenido/TarjetaProyecto'
import Calculadora, { type OpcionUso } from './Calculadora'
import FormularioPresupuesto from './FormularioPresupuesto'
import { NOMBRE_SERVICIO, type Acabado, type Articulo, type Proyecto, type ServicioId } from '@/lib/tipos'

/**
 * Piezas compartidas por las seis páginas de servicio (02-pantallas.md §A2).
 * La de hormigón impreso está escrita a mano porque es la única con copy propio
 * (§7.2 del documento maestro); las otras cinco se componen con estas secciones
 * y omiten las que no tienen sustancia real que enseñar.
 *
 * Regla de contenido: aquí no se escribe copy nuevo. O es texto aprobado del
 * documento maestro, o es dato del catálogo real, o va marcado como pendiente.
 */

/**
 * Copy aprobado del §7.1 · 05 «Servicios»: una línea por servicio, la misma que
 * publica la rejilla de la home. Es el único texto descriptivo que existe para
 * los cinco servicios que no son impreso.
 *
 * Debería vivir en `lib/tipos.ts` junto a NOMBRE_SERVICIO y RUTA_SERVICIO.
 */
export const DESCRIPCION_SERVICIO: Record<ServicioId, string> = {
  impreso:
    'Textura de piedra, adoquín o madera sobre una solera continua. El más pedido para exteriores.',
  pulido: 'Superficie lisa y brillante. De la nave industrial al salón de casa.',
  microcemento: 'Renueva suelos y paredes sin levantar lo que ya tienes.',
  lavado: 'Árido visto, antideslizante. Ideal para zonas de paso y piscinas.',
  fratasado: 'Acabado fino y mate. Sobrio, moderno y económico.',
  desactivado: 'Piedra vista con la resistencia de una solera.',
}

/**
 * Prosa que el cliente todavía no ha escrito. Mismo tratamiento que la plantilla
 * legal y que los bloques de narrativa de la ficha de proyecto (02-pantallas.md
 * §A4): borde discontinuo y texto atenuado, con el encargo de qué debe contar.
 * No se maquilla con texto inventado ni con la prosa de otro servicio.
 */
export function TextoPendiente({ children }: { children: ReactNode }) {
  return (
    <div className="border border-dashed border-tinta-media p-4 md:p-6">
      <p className="pendiente text-16 m-0">{children}</p>
    </div>
  )
}

export function HeroServicio({
  titulo,
  entradilla,
  lineasEtiqueta,
  secundario,
}: {
  titulo: string
  entradilla: ReactNode
  lineasEtiqueta: ReactNode[]
  secundario?: { href: string; texto: string }
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-[1fr_560px] gap-8 md:gap-16 px-[18px] md:px-lat-desktop pb-8 md:pb-14">
      <div className="flex flex-col justify-center gap-5 order-2 md:order-1">
        <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
          {titulo}
        </h1>
        <p className="text-16 md:text-20 text-tinta-media max-w-[52ch] m-0">{entradilla}</p>
        <div className="flex flex-col md:flex-row gap-3">
          <Boton variante="primario" href="/presupuesto/">
            Pedir presupuesto
          </Boton>
          {secundario ? (
            <Boton variante="contorno" href={secundario.href}>
              {secundario.texto}
            </Boton>
          ) : null}
        </div>
      </div>
      <div className="order-1 md:order-2">
        <BloquePosicion proporcion="4/3" etiqueta={<EtiquetaTecnica lineas={lineasEtiqueta} />} />
      </div>
    </section>
  )
}

export type Aplicacion = { nombre: string; texto?: string }

export function SeccionAplicaciones({
  numero,
  aplicaciones,
}: {
  numero: string
  aplicaciones: Aplicacion[]
}) {
  return (
    <Aparece
      as="section"
      id="seccion-aplicaciones"
      className="px-[18px] md:px-lat-desktop py-9 md:py-22"
    >
      <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
        <div className="flex flex-col gap-4">
          <AntetituloSeccion numero={numero}>Aplicaciones</AntetituloSeccion>
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            Dónde tiene sentido ponerlo
          </h2>
        </div>
        <div className="flex flex-col">
          {aplicaciones.map((a) => (
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
  )
}

export function SeccionMuestrario({
  numero,
  servicio,
  acabados,
}: {
  numero: string
  servicio: ServicioId
  acabados: Acabado[]
}) {
  return (
    <Aparece
      as="section"
      id="seccion-muestrario"
      className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-4">
            <AntetituloSeccion numero={numero}>Muestrario del servicio</AntetituloSeccion>
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
              Elige el acabado antes de que empecemos
            </h2>
          </div>
          <EnlaceEtiqueta href={`/acabados/?tecnica=${servicio}`}>
            Ver todos los acabados de {NOMBRE_SERVICIO[servicio].toLowerCase()} →
          </EnlaceEtiqueta>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px_10px] md:gap-[32px_24px]">
          {acabados.map((a) => (
            <MuestraAcabado key={a.slug} acabado={a} />
          ))}
        </div>
      </div>
    </Aparece>
  )
}

export type FilaPrecio = { uso: string; rango: string | null }

/**
 * Las mismas filas y los mismos rangos que publica `/precios/`, con el rango
 * entre corchetes mientras el cliente no lo valide (05-pendientes §A1, bloqueante 4).
 * Sin rango confirmado no hay calculadora: solo la fila pendiente y el enlace a la tabla.
 */
export function SeccionPrecio({
  numero,
  filas,
  usos,
}: {
  numero: string
  filas: FilaPrecio[]
  usos?: OpcionUso[]
}) {
  return (
    <Aparece as="section" id="seccion-precio" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <AntetituloSeccion numero={numero}>Precio orientativo · sin IVA</AntetituloSeccion>
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            Te decimos lo que cuesta antes de que preguntes
          </h2>
        </div>
        <div className="flex flex-col">
          {filas.map((fila) => (
            <div
              key={fila.uso}
              className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-1 md:gap-6 py-4 border-b border-fondo-alt"
            >
              <span className="text-16 md:text-20 text-tinta-media">{fila.uso}</span>
              <span className="font-mono text-20">
                <DatoPendiente>{fila.rango ?? 'pendiente'}</DatoPendiente>
                {fila.rango ? ' €/m²' : ''}
              </span>
            </div>
          ))}
        </div>
        <EnlaceEtiqueta href="/precios/">Ver la tabla completa de precios →</EnlaceEtiqueta>
        {usos && usos.length > 0 ? <Calculadora usos={usos} reducida={usos.length === 1} /> : null}
      </div>
    </Aparece>
  )
}

/**
 * 02-pantallas.md §A2 · 04. La sección que más vende de toda la web, y la única
 * cuyo copy no existe para estos cinco servicios: el §7.2 solo desarrolla impreso
 * y el propio documento lo deja para una iteración posterior. Se maqueta con el
 * encargo a la vista en vez de omitirla o de copiar la comparativa de impreso,
 * que diría algo técnicamente falso de otro material.
 */
export function SeccionCuandoNo({ numero, titulo }: { numero: string; titulo: string }) {
  return (
    <Aparece
      as="section"
      id="seccion-cuando-no"
      className="px-[18px] md:px-lat-desktop py-9 md:py-22"
    >
      <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
        <AntetituloSeccion numero={numero}>{titulo}</AntetituloSeccion>
        <TextoPendiente>
          Comparativa pendiente de redacción. Debe decir en qué casos conviene otro pavimento
          antes que este y qué hay que resolver en el soporte antes de ejecutarlo. No se copia la
          del hormigón impreso: cambiaría el significado técnico.
        </TextoPendiente>
      </div>
    </Aparece>
  )
}

const pasos = [
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
        Te lo enviamos en <DatoPendiente>48 horas</DatoPendiente>, desglosado. Lo que pone es lo
        que se paga.
      </>
    ),
  },
  {
    numero: '03',
    titulo: 'Ejecución',
    texto: (
      <>
        <DatoPendiente>Equipo propio</DatoPendiente>. Una superficie de 80-100 m² se ejecuta en 2 o
        3 días. Después necesita entre 24 y 48 horas sin pisar y 28 días para curar del todo.
      </>
    ),
  },
  {
    numero: '04',
    titulo: 'Garantía y mantenimiento',
    texto: '10 años. Y volvemos a resellar cuando toque.',
  },
]

export function SeccionComoTrabajamos({ numero }: { numero: string }) {
  return (
    <Aparece
      as="section"
      id="seccion-como"
      className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <AntetituloSeccion numero={numero}>Cómo trabajamos</AntetituloSeccion>
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            Cuatro pasos, sin sorpresas
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {pasos.map((p) => (
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
  )
}

export function SeccionObra({ numero, proyectos }: { numero: string; proyectos: Proyecto[] }) {
  return (
    <Aparece as="section" id="seccion-obra" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <AntetituloSeccion numero={numero}>Obra ejecutada</AntetituloSeccion>
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            Obra hecha, no catálogo de proveedor
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {proyectos.map((p) => (
            <TarjetaProyecto key={p.slug} proyecto={p} />
          ))}
        </div>
        <EnlaceEtiqueta href="/proyectos/">Ver todos los proyectos →</EnlaceEtiqueta>
      </div>
    </Aparece>
  )
}

/** Enlace cruzado al artículo que explica la técnica (02-pantallas.md §B6). */
export function SeccionComoSeHace({ articulo }: { articulo: Articulo }) {
  return (
    <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
      <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
        <AntetituloSeccion>Cómo se hace</AntetituloSeccion>
        <EnlaceEtiqueta href={`/blog/${articulo.slug}/`}>{articulo.titulo} →</EnlaceEtiqueta>
      </div>
    </Aparece>
  )
}

export function SeccionCierre() {
  return (
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
        <FormularioPresupuesto variante="corto" />
      </div>
    </Aparece>
  )
}
