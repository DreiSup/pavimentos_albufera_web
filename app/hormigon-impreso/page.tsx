import type { Metadata } from 'next'
import Aparece from '@/components/ui/Aparece'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Boton from '@/components/ui/Boton'
import { EnlaceEtiqueta } from '@/components/ui/EnlaceEtiqueta'
import BloquePosicion from '@/components/contenido/BloquePosicion'
import EtiquetaTecnica from '@/components/datos/EtiquetaTecnica'
import DatoPendiente from '@/components/datos/DatoPendiente'
import TablaFichaTecnica from '@/components/datos/TablaFichaTecnica'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
import Migas from '@/components/layout/Migas'
import SubmenuServicio from '@/components/secciones/SubmenuServicio'
import Calculadora from '@/components/secciones/Calculadora'
import Acordeon from '@/components/secciones/Acordeon'
import FormularioPresupuesto from '@/components/secciones/FormularioPresupuesto'
import { JsonLd, schemaFAQ, schemaServicio } from '@/lib/schema'
import { acabadosPorServicio, proyectosPorServicio } from '@/lib/datos'
import MuestraAcabado from '@/components/contenido/MuestraAcabado'

export const metadata: Metadata = {
  title: 'Hormigón impreso Valencia | Precio y acabados',
  description:
    'Hormigón impreso para patios, entradas y piscinas. Mira los acabados reales, consulta el precio por m² y pide presupuesto sin compromiso.',
  alternates: { canonical: '/hormigon-impreso/' },
}

const anclas = [
  { id: 'seccion-aplicaciones', texto: '01 · Aplicaciones' },
  { id: 'seccion-muestrario', texto: '02 · Muestrario' },
  { id: 'seccion-ficha', texto: '03 · Ficha técnica' },
  { id: 'seccion-cuando-no', texto: '04 · Cuándo NO' },
  { id: 'seccion-precio', texto: '05 · Precio' },
  { id: 'seccion-como', texto: '06 · Cómo trabajamos' },
  { id: 'seccion-obra', texto: '07 · Obra ejecutada' },
]

const aplicaciones = [
  { nombre: 'Entradas de garaje y rampas', texto: 'Con espesor y armado reforzados.' },
  { nombre: 'Porches, patios y terrazas', texto: 'El uso más habitual.' },
  { nombre: 'Contornos de piscina', texto: 'Con acabado antideslizante.' },
  { nombre: 'Caminos y accesos de parcela', texto: '' },
  { nombre: 'Muros y fachadas', texto: 'La misma técnica en vertical, con la misma gama.' },
]

const fichaTecnica = [
  { etiqueta: 'ESPESOR USO PEATONAL', valor: '10 cm' },
  { etiqueta: 'ESPESOR PASO DE VEHÍCULOS', valor: '12-15 cm' },
  { etiqueta: 'ARMADO', valor: 'Mallazo electrosoldado + fibra de polipropileno' },
  { etiqueta: 'HORMIGÓN', valor: 'HA-25 según EHE-08' },
  { etiqueta: 'JUNTAS DE DILATACIÓN', valor: <>Cada <DatoPendiente>16-25</DatoPendiente> m²</> },
  { etiqueta: 'SELLADO', valor: <>Resina acrílica, <DatoPendiente>2</DatoPendiente> manos</> },
  { etiqueta: 'TRÁNSITO PEATONAL', valor: '24-48 h' },
  { etiqueta: 'CURADO COMPLETO', valor: '28 días' },
]

const pasos = [
  { numero: '01', titulo: 'Visita y medición', texto: 'Vamos a verlo. Sin coste y sin compromiso. Medimos, comprobamos el estado del terreno y el acceso para el camión.' },
  { numero: '02', titulo: 'Presupuesto cerrado', texto: <>Te lo enviamos en <DatoPendiente>48 horas</DatoPendiente>, desglosado. Lo que pone es lo que se paga.</> },
  { numero: '03', titulo: 'Ejecución', texto: <><DatoPendiente>Equipo propio</DatoPendiente>. Una superficie de 80-100 m² se ejecuta en 2 o 3 días. Después necesita entre 24 y 48 horas sin pisar y 28 días para curar del todo.</> },
  { numero: '04', titulo: 'Garantía y mantenimiento', texto: '10 años. Y volvemos a resellar cuando toque.' },
]

const faqServicio = [
  {
    pregunta: '¿Cuánto tarda en poder pisarse?',
    respuesta:
      'Entre 24 y 48 horas para pisar y una semana para muebles o coches. El curado completo del hormigón son 28 días, pero puedes hacer vida normal mucho antes.',
  },
  {
    pregunta: '¿Se agrieta el hormigón impreso?',
    respuesta:
      'Bien ejecutado, no. Las grietas aparecen cuando falta mallazo, cuando la solera tiene menos de 10 cm o cuando no se han hecho las juntas de dilatación. Nosotros hacemos las tres cosas siempre.',
  },
  {
    pregunta: '¿Se puede poner encima del suelo que ya tengo?',
    respuesta:
      'En hormigón impreso, no lo recomendamos: la adherencia y el espesor no quedan garantizados. En microcemento sí, y ahí está su gran ventaja: se aplica sobre azulejo, terrazo o gres sin picar nada.',
  },
  {
    pregunta: '¿Cada cuánto hay que resellar?',
    respuesta:
      'Cada 2 o 3 años en entradas de coche y zonas de piscina. Cada 5 o 6 en terrazas y jardines de uso peatonal. Nosotros te avisamos.',
  },
  {
    pregunta: '¿Qué pasa si el presupuesto que tengo es de 18 €/m²?',
    respuesta:
      'Que revises qué incluye. A ese precio no salen los materiales de una solera de 10 cm con mallazo y fibra. Normalmente falta el hormigón, el armado o el sellado, y aparece en la factura final.',
  },
]

const acabadosImpreso = acabadosPorServicio('impreso')
const proyectosImpreso = proyectosPorServicio('impreso').slice(0, 3)

export default function HormigonImpreso() {
  return (
    <>
      <JsonLd data={schemaServicio('impreso', 'Hormigón impreso', '/hormigon-impreso/')} />
      <Migas items={[{ nombre: 'Servicios' }, { nombre: 'Hormigón impreso' }]} />

      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-[1fr_560px] gap-8 md:gap-16 px-[18px] md:px-lat-desktop pb-8 md:pb-14">
        <div className="flex flex-col justify-center gap-5 order-2 md:order-1">
          <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
            Hormigón impreso en Valencia, Castellón y Alicante
          </h1>
          <p className="text-16 md:text-20 text-tinta-media max-w-[52ch] m-0">
            Textura de piedra natural, adoquín o madera sobre una solera continua. Sin juntas donde
            crezca la hierba, sin baldosas que se levanten y con un mantenimiento que se reduce a
            barrer.
          </p>
          <div className="flex flex-col md:flex-row gap-3">
            <Boton variante="primario" href="/presupuesto/">
              Pedir presupuesto
            </Boton>
            <Boton variante="contorno" href="#seccion-muestrario">
              Ver acabados de impreso
            </Boton>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <BloquePosicion
            proporcion="4/3"
            etiqueta={<EtiquetaTecnica lineas={['IMPRESO', 'ESPESOR 10 CM · HA-25 · EHE-08']} />}
          />
        </div>
      </section>

      <SubmenuServicio anclas={anclas} />

      {/* 01 Aplicaciones */}
      <Aparece as="section" id="seccion-aplicaciones" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
          <div className="flex flex-col gap-4">
            <AntetituloSeccion numero="01">Aplicaciones</AntetituloSeccion>
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
              Dónde tiene sentido ponerlo
            </h2>
            <p className="text-16 text-tinta-media m-0">
              El impreso es el acabado que mejor funciona en exterior. Es impermeable, aguanta el
              paso de coches, resiste manchas de grasa y aceite y no se decolora con el sol si lleva
              el sellado adecuado.
            </p>
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

      {/* 02 Muestrario del servicio */}
      <Aparece
        as="section"
        id="seccion-muestrario"
        className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <AntetituloSeccion numero="02">Muestrario del servicio</AntetituloSeccion>
            <EnlaceEtiqueta href="/acabados/?tecnica=impreso">Ver todos los acabados de impreso →</EnlaceEtiqueta>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px_10px] md:gap-[32px_24px]">
            {acabadosImpreso.map((a) => (
              <MuestraAcabado key={a.slug} acabado={a} />
            ))}
          </div>
        </div>
      </Aparece>

      {/* 03 Ficha técnica */}
      <Aparece as="section" id="seccion-ficha" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
          <AntetituloSeccion numero="03">Ficha técnica</AntetituloSeccion>
          <TablaFichaTecnica filas={fichaTecnica} />
        </div>
      </Aparece>

      {/* 04 Cuándo NO elegir impreso */}
      <Aparece
        as="section"
        id="seccion-cuando-no"
        className="sobre-oscuro bg-tinta text-fondo px-[18px] md:px-lat-desktop py-9 md:py-22"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="flex flex-col gap-4">
            <AntetituloSeccion numero="04" sobreOscuro>Cuándo NO elegir impreso</AntetituloSeccion>
            <p className="text-16 md:text-20 text-sobre-tinta m-0">
              Preferimos decírtelo antes. Si vas a pavimentar un interior, el pulido o el
              microcemento quedan mejor y son más fáciles de mantener. Si el terreno tiene
              humedades sin resolver o raíces de arbolado grande cerca, primero hay que solucionar
              eso: el mejor pavimento del mundo se agrieta sobre una base que se mueve.
            </p>
          </div>
          <div className="flex flex-col gap-3 justify-center">
            <Boton variante="contorno" sobreOscuro href="/hormigon-pulido/">
              Ver hormigón pulido
            </Boton>
            <Boton variante="contorno" sobreOscuro href="/microcemento/">
              Ver microcemento
            </Boton>
          </div>
        </div>
      </Aparece>

      {/* 05 Precio */}
      <Aparece as="section" id="seccion-precio" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-6">
          <AntetituloSeccion numero="05">Precio</AntetituloSeccion>
          <Calculadora
            reducida={false}
            usos={[
              { id: 'peatonal', etiqueta: 'Peatonal (patios, porches, jardines)', rango: [28, 38] },
              { id: 'vehicular', etiqueta: 'Paso de vehículos (entradas, rampas)', rango: [35, 48] },
            ]}
          />
        </div>
      </Aparece>

      {/* 06 Cómo trabajamos */}
      <Aparece as="section" id="seccion-como" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-8">
          <AntetituloSeccion numero="06">Cómo trabajamos</AntetituloSeccion>
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

      {/* 07 Obra ejecutada */}
      <Aparece as="section" id="seccion-obra" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-6">
          <AntetituloSeccion numero="07">Obra ejecutada</AntetituloSeccion>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proyectosImpreso.map((p) => (
              <TarjetaProyecto key={p.slug} proyecto={p} />
            ))}
          </div>
        </div>
      </Aparece>

      {/* 08 FAQ */}
      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <JsonLd data={schemaFAQ(faqServicio)} />
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
          <AntetituloSeccion numero="08">Preguntas frecuentes</AntetituloSeccion>
          <Acordeon preguntas={faqServicio} />
        </div>
      </Aparece>

      {/* 09 Cierre */}
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
    </>
  )
}
