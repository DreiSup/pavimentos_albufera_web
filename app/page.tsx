import type { Metadata } from 'next'
import Link from 'next/link'
import Aparece from '@/components/ui/Aparece'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Boton from '@/components/ui/Boton'
import { EnlaceEtiqueta } from '@/components/ui/EnlaceEtiqueta'
import Foto from '@/components/contenido/Foto'
import EtiquetaTecnica from '@/components/datos/EtiquetaTecnica'
import DatoPendiente from '@/components/datos/DatoPendiente'
import MuestraAcabado from '@/components/contenido/MuestraAcabado'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
import Chip from '@/components/ui/Chip'
import BarraConfianza from '@/components/layout/BarraConfianza'
import Acordeon from '@/components/secciones/Acordeon'
import FormularioPresupuesto from '@/components/secciones/FormularioPresupuesto'
import { JsonLd, schemaFAQ } from '@/lib/schema'
import { acabados, contarDocumentados, proyectos } from '@/lib/datos'
import { faqHome } from '@/content/faq'
import { SERVICIOS } from '@/content/servicios'
import { NOMBRE_SERVICIO, RUTA_SERVICIO } from '@/lib/tipos'
import { nap } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Pavimentos de hormigón en Valencia',
  description:
    'Hormigón impreso, pulido, lavado y microcemento en Valencia, Castellón y Alicante. 17 años de obra propia y 10 de garantía. Presupuesto sin compromiso.',
  alternates: { canonical: '/' },
}

const espacios = [
  {
    titulo: 'Entrada de garaje',
    texto: 'Aguanta el paso de coches sin agrietarse.',
    imagen: {
      src: '/obras/_sin-atribuir/b8c06394-3d87-41a8-92bb-7486e9b912de.jpeg',
      alt: 'Explanada de hormigón impreso gris ante la puerta basculante de un garaje.',
      tipo: 'final' as const,
    },
  },
  {
    titulo: 'Porche y terraza',
    texto: 'El acabado que más piden nuestros clientes.',
    imagen: {
      src: '/obras/_sin-atribuir/5da4504f-2c7e-4fee-897b-fe0ed0a4a3a1.jpeg',
      alt: 'Porche cubierto con solera de hormigón fratasado claro, con sofás y el jardín al fondo.',
      tipo: 'final' as const,
    },
  },
  {
    titulo: 'Contorno de piscina',
    texto: 'Antideslizante y frío al sol.',
    imagen: {
      src: '/obras/_sin-atribuir/4d88392b-d7b1-4d77-900b-82db9f0ecd29.jpeg',
      alt: 'Contorno de piscina de hormigón continuo en tono tostado ante una vivienda encalada.',
      tipo: 'final' as const,
    },
  },
  {
    titulo: 'Interior de vivienda',
    texto: 'Continuo, sin juntas, fácil de limpiar.',
    imagen: {
      src: '/obras/_sin-atribuir/WhatsApp-Image-2023-08-22-at-09.08.18.jpeg',
      alt: 'Estancia con arcos y suelo de hormigón pulido continuo que se prolonga hasta el porche.',
      tipo: 'final' as const,
    },
  },
  {
    titulo: 'Patio y jardín',
    texto: 'Integrado con el entorno, sin mantenimiento.',
    imagen: {
      src: '/obras/_sin-atribuir/hormigon-impreso-2.jpg',
      alt: 'Jardín con olivos, césped y un pavimento de hormigón de tono ocre que rodea los alcorques.',
      tipo: 'final' as const,
    },
  },
  {
    titulo: 'Nave, parking o local',
    texto: 'Resistente al tránsito pesado y a los ácidos.',
    imagen: {
      src: '/obras/ribarroja-pulido-gris.jpg',
      alt: 'Planta de aparcamiento cubierta con solera de hormigón pulido gris entre pilares.',
      tipo: 'final' as const,
    },
  },
]

const servicios = [
  { id: 'impreso' as const, texto: 'Textura de piedra, adoquín o madera sobre una solera continua. El más pedido para exteriores.' },
  { id: 'pulido' as const, texto: 'Superficie lisa y brillante. De la nave industrial al salón de casa.' },
  { id: 'microcemento' as const, texto: 'Renueva suelos y paredes sin levantar lo que ya tienes.' },
  { id: 'lavado' as const, texto: 'Árido visto, antideslizante. Ideal para zonas de paso y piscinas.' },
  { id: 'fratasado' as const, texto: 'Acabado fino y mate. Sobrio, moderno y económico.' },
  { id: 'desactivado' as const, texto: 'Piedra vista con la resistencia de una solera.' },
]

const filasPrecios = [
  { trabajo: 'Hormigón impreso, uso peatonal (patios, porches, jardines)', rango: '28-38' },
  { trabajo: 'Hormigón impreso, paso de vehículos (entradas, rampas)', rango: '35-48' },
  { trabajo: 'Hormigón pulido, interior', rango: '30-45' },
  { trabajo: 'Hormigón pulido, nave o parking', rango: '22-35' },
  { trabajo: 'Microcemento sobre suelo existente', rango: '55-85' },
  { trabajo: 'Hormigón lavado', rango: '30-42' },
]

const pasos = [
  { numero: '01', titulo: 'Visita y medición', texto: 'Vamos a verlo. Sin coste y sin compromiso. Medimos, comprobamos el estado del terreno y el acceso para el camión.' },
  { numero: '02', titulo: 'Presupuesto cerrado', texto: <>Te lo enviamos en <DatoPendiente>48 horas</DatoPendiente>, desglosado. Lo que pone es lo que se paga.</> },
  { numero: '03', titulo: 'Ejecución', texto: <><DatoPendiente>Equipo propio</DatoPendiente>. Una superficie de 80-100 m² se ejecuta en 2 o 3 días. Después necesita entre 24 y 48 horas sin pisar y 28 días para curar del todo.</> },
  { numero: '04', titulo: 'Garantía y mantenimiento', texto: '10 años. Y volvemos a resellar cuando toque.' },
]

const proyectoHero = proyectos.find((p) => p.slug === 'moncada-impreso-espiga-117')!
const muestraHome = acabados.filter((a) => a.proyectos.length > 0).slice(0, 4)
const proyectosHome = [...proyectos].sort((a, b) => Number(b.destacado) - Number(a.destacado)).slice(0, 6)
const totalAcabados = acabados.length
const documentados = contarDocumentados()

export default function Home() {
  return (
    <>
      {/* 01 · Hero */}
      <section className="grid grid-cols-1 md:grid-cols-2 md:gap-16 px-[18px] md:px-lat-desktop pt-8 md:pt-14">
        <div className="hidden md:flex flex-col justify-center gap-6 md:min-h-[660px]">
          <h1 className="font-display font-extrabold fs-hero text-64 md:text-88 leading-[1.02] m-0">
            Hormigón que se ve bien 20 años después
          </h1>
          <p className="text-20 text-tinta-media max-w-[46ch] m-0">
            Pavimentos de hormigón impreso, pulido, lavado y microcemento en Valencia, Castellón y
            Alicante. 17 años ejecutando obra propia, con 10 años de garantía y mantenimiento
            incluido.
          </p>
          <div className="flex gap-4">
            <Boton variante="primario" href="/acabados/">
              Ver acabados
            </Boton>
            <Boton variante="contorno" href="/presupuesto/">
              Pedir presupuesto
            </Boton>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* En móvil el h1 va delante de la foto, no encima: sobre una imagen
              el contraste deja de ser comprobable y el sistema no tiene velo. */}
          <h1 className="md:hidden font-display font-extrabold fs-hero text-46 leading-[1.05] text-tinta m-0">
            Hormigón que se ve bien 20 años después
          </h1>
          {/* Una sola imagen para los dos anchos: `display:none` no evita la
              descarga, así que dos <Image> serían dos descargas. */}
          {/* La 4/3 de escritorio es el hueco grande: va la foto apaisada, que
              es 1200×900 y encaja sin recorte. En móvil se recorta a 3/4. */}
          <Foto
            imagen={proyectoHero.imagenes[0]}
            proporcion="3/4"
            prioridad
            tamanos="(min-width: 768px) 50vw, 100vw"
            className="md:aspect-[4/3] md:min-h-[660px] md:h-full"
            etiqueta={
              <EtiquetaTecnica
                lineas={['MONCADA · VALENCIA', 'IMPRESO · MODELO ESPIGA · COLOR 117', <>
                  <DatoPendiente>180</DatoPendiente> m² · 2025
                </>]}
              />
            }
          />
        </div>

        <div className="md:hidden flex flex-col gap-4 mt-6">
          <p className="text-16 text-tinta-media m-0">
            Pavimentos de hormigón impreso, pulido, lavado y microcemento en Valencia, Castellón y
            Alicante. 17 años ejecutando obra propia, con 10 años de garantía y mantenimiento
            incluido.
          </p>
          <div className="flex flex-col gap-3">
            <Boton variante="contorno" href="/acabados/" anchoCompleto>
              Ver acabados
            </Boton>
            <Boton variante="contorno" href="/presupuesto/" anchoCompleto>
              Pedir presupuesto
            </Boton>
          </div>
        </div>
      </section>

      {/* 02 · Barra de confianza */}
      <div className="mt-10 md:mt-16">
        <BarraConfianza />
      </div>

      {/* 03 · Por dónde empezar */}
      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
          <div className="flex flex-col gap-4">
            <AntetituloSeccion numero="03">Por dónde empezar</AntetituloSeccion>
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
              Empieza por el espacio, no por el material
            </h2>
            <p className="text-16 md:text-20 text-tinta-media m-0">
              Cada superficie pide un acabado distinto. Dinos qué quieres resolver y te decimos qué
              le va mejor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-[2px] bg-tinta p-[2px]">
            {espacios.map((e) => (
              <div key={e.titulo} className="bg-fondo flex md:flex-col gap-4 md:gap-3">
                <Foto
                  imagen={e.imagen}
                  proporcion="4/3"
                  tamanos="(min-width: 768px) 30vw, 76px"
                  className="w-[76px] h-[76px] md:w-full md:h-auto shrink-0"
                />
                <div className="flex flex-col gap-1 py-2 md:py-0 md:px-4 md:pb-4">
                  <h3 className="font-display font-bold fs-h3 text-16 md:text-20 m-0">{e.titulo}</h3>
                  <p className="text-14 md:text-16 text-tinta-media m-0">{e.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Aparece>

      {/* 04 · Muestrario */}
      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <AntetituloSeccion numero="04">Muestrario</AntetituloSeccion>
              <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
                Elige el acabado antes de que empecemos
              </h2>
              <p className="text-16 md:text-20 text-tinta-media max-w-[60ch] m-0">
                Estos no son renders. Cada muestra es una obra que hemos ejecutado, con su modelo y
                su color. Míralos, guárdate el código y dínoslo cuando hablemos.
              </p>
            </div>
            <EnlaceEtiqueta href="/acabados/" className="hidden md:inline-flex">
              Abrir el muestrario completo →
            </EnlaceEtiqueta>
          </div>

          <div className="flex gap-2 overflow-x-auto">
            <Chip activo>Todas ({totalAcabados})</Chip>
            <Chip>{documentados} con obra documentada</Chip>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px_10px] md:gap-[32px_24px]">
            {muestraHome.map((a) => (
              <MuestraAcabado key={a.slug} acabado={a} />
            ))}
          </div>

          <EnlaceEtiqueta href="/acabados/" className="md:hidden">
            Abrir el muestrario completo →
          </EnlaceEtiqueta>
        </div>
      </Aparece>

      {/* 05 · Servicios */}
      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <AntetituloSeccion numero="05">Servicios</AntetituloSeccion>
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
              Todo lo que se puede hacer con hormigón
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servicios.map((s) => (
              <Link key={s.id} href={RUTA_SERVICIO[s.id]} className="flex flex-col gap-3 no-underline">
                <Foto
                  imagen={SERVICIOS[s.id].imagenTarjeta}
                  proporcion="16/10"
                  tamanos="(min-width: 768px) 30vw, 100vw"
                />
                <h3 className="font-display font-bold fs-h3 text-20 md:text-26 text-tinta m-0">
                  {NOMBRE_SERVICIO[s.id]}
                </h3>
                <p className="text-16 text-tinta-media m-0">{s.texto}</p>
              </Link>
            ))}
          </div>
        </div>
      </Aparece>

      {/* 06 · Precios */}
      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="flex flex-col gap-4">
            <AntetituloSeccion numero="06">Precios</AntetituloSeccion>
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
              Te decimos lo que cuesta antes de que preguntes
            </h2>
            <p className="text-16 md:text-20 text-tinta-media m-0">
              El precio de un pavimento depende de la superficie, del uso que le vayas a dar y del
              estado en que esté el terreno. Estos son nuestros rangos habituales en la Comunidad
              Valenciana, con material y mano de obra incluidos, sin IVA.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="font-mono text-d-11 text-acero uppercase m-0 mb-2">Incluido siempre</p>
                <p className="text-14 text-tinta-media m-0">
                  Preparación del soporte, mallazo, fibra de polipropileno, hormigón de 10 cm,
                  molde, pigmento, desmoldeante y sellado final.
                </p>
              </div>
              <div>
                <p className="font-mono text-d-11 text-acero uppercase m-0 mb-2">Se presupuesta aparte</p>
                <p className="text-14 text-tinta-media m-0">
                  Demolición del pavimento anterior, movimiento de tierras, drenajes y rebajes de
                  acceso difícil.
                </p>
              </div>
            </div>
            <EnlaceEtiqueta href="/precios/">Calcular mi presupuesto →</EnlaceEtiqueta>
          </div>

          <div className="flex flex-col">
            {filasPrecios.map((fila) => (
              <div
                key={fila.trabajo}
                className="flex justify-between items-center gap-4 py-4 border-b border-tinta-media last:border-b-0"
              >
                <span className="text-14 md:text-16 text-tinta">{fila.trabajo}</span>
                <span className="font-mono text-d-14 md:text-20 shrink-0">
                  <DatoPendiente>{fila.rango}</DatoPendiente> €/m²
                </span>
              </div>
            ))}
          </div>
        </div>
      </Aparece>

      {/* 07 · Cómo trabajamos */}
      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <AntetituloSeccion numero="07">Cómo trabajamos</AntetituloSeccion>
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

      {/* 08 · Proyectos */}
      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <AntetituloSeccion numero="08">Proyectos</AntetituloSeccion>
              <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
                Obra hecha, no catálogo de proveedor
              </h2>
              <p className="text-16 md:text-20 text-tinta-media max-w-[60ch] m-0">
                Todas las fotos de esta web son trabajos nuestros. Puedes filtrarlos por acabado, por
                tipo de espacio o por municipio.
              </p>
            </div>
            <EnlaceEtiqueta href="/proyectos/" className="hidden md:inline-flex">
              Ver todos los proyectos →
            </EnlaceEtiqueta>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto -mx-[18px] px-[18px] md:mx-0 md:px-0">
            {proyectosHome.map((p) => (
              <div key={p.slug} className="min-w-[220px] shrink-0 md:min-w-0 md:shrink">
                <TarjetaProyecto proyecto={p} fondo="base" />
              </div>
            ))}
          </div>

          <EnlaceEtiqueta href="/proyectos/" className="md:hidden">
            Ver todos los proyectos →
          </EnlaceEtiqueta>
        </div>
      </Aparece>

      {/* 09 · Reseñas */}
      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
          <div className="flex flex-col gap-4">
            <AntetituloSeccion numero="09">Reseñas</AntetituloSeccion>
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
              Lo que dicen quienes ya nos han contratado
            </h2>
            <p className="text-16 text-tinta-media m-0">
              Más de 3 de cada 10 trabajos que hacemos son para clientes que ya nos habían
              contratado. Es el dato que mejor habla de nosotros mientras reunimos reseñas
              verificables.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="border border-dashed border-tinta-media p-5 flex flex-col gap-3">
                <p className="pendiente text-16 m-0">[texto de la reseña]</p>
                <p className="font-mono text-d-11 text-tinta-media m-0">
                  <DatoPendiente>NOMBRE</DatoPendiente> · <DatoPendiente>MUNICIPIO</DatoPendiente> ·{' '}
                  <DatoPendiente>AÑO</DatoPendiente>
                </p>
              </div>
            ))}
          </div>
        </div>
      </Aparece>

      {/* 10 · Garantía */}
      <Aparece as="section" className="sobre-oscuro bg-tinta text-fondo px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            10 años de garantía. Y el mantenimiento, también nuestro.
          </h2>
          <div className="flex flex-col">
            <p className="text-16 md:text-20 text-sobre-tinta py-4 border-t border-acero m-0">
              No es solo que respondamos si algo falla. Es que volvemos a resellar el pavimento
              cuando le toca, porque un hormigón impreso bien mantenido dura décadas y uno
              abandonado se ve viejo a los cinco años.
            </p>
            <p className="text-16 md:text-20 text-sobre-tinta py-4 border-t border-acero m-0">
              Más de 3 de cada 10 trabajos que hacemos son para clientes que ya nos habían
              contratado antes. Es el único indicador que nos importa.
            </p>
          </div>
        </div>
      </Aparece>

      {/* 11 · Zonas */}
      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
          <div className="flex flex-col gap-4">
            <AntetituloSeccion numero="11">Zonas</AntetituloSeccion>
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">Dónde trabajamos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 border-t border-tinta pt-4">
              <p className="font-mono text-d-11 text-acero uppercase m-0">Sin desplazamiento</p>
              <p className="text-16 text-tinta-media m-0">Valencia, Castellón y Alicante. Cualquier superficie.</p>
            </div>
            <div className="flex flex-col gap-2 border-t border-tinta pt-4">
              <p className="font-mono text-d-11 text-acero uppercase m-0">Con desplazamiento</p>
              <p className="text-16 text-tinta-media m-0">
                Murcia, Albacete, Almería, Tarragona y Teruel, a partir de <DatoPendiente>100</DatoPendiente> m².
              </p>
            </div>
            <div className="flex flex-col gap-2 border-t border-tinta pt-4">
              <p className="font-mono text-d-11 text-acero uppercase m-0">Resto de España</p>
              <p className="text-16 text-tinta-media m-0">Proyectos de volumen, consúltanos.</p>
            </div>
          </div>
        </div>
      </Aparece>

      {/* 12 · FAQ */}
      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <JsonLd data={schemaFAQ(faqHome)} />
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
          <div className="flex flex-col gap-4">
            <AntetituloSeccion numero="12">Preguntas frecuentes</AntetituloSeccion>
          </div>
          <Acordeon preguntas={faqHome} />
        </div>
      </Aparece>

      {/* 13 · Cierre */}
      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="flex flex-col gap-6">
            <h2 className="font-display font-bold fs-hero text-34 md:text-64 m-0">
              Cuéntanos qué quieres hacer
            </h2>
            <p className="text-16 md:text-20 text-tinta-media m-0">
              Te llamamos, vamos a verlo y te damos un precio cerrado. Sin coste y sin compromiso.
            </p>
            <div className="flex flex-col md:flex-row gap-3">
              <Boton variante="tinta" href={nap.telefonoHref ?? '/presupuesto/'} data-ubicacion="home_close">
                Llamar al {nap.telefono ?? nap.telefonoMostrado}
              </Boton>
              <Boton variante="contorno" href={nap.whatsappHref ?? '/presupuesto/'} data-ubicacion="home_close">
                Escribir por WhatsApp
              </Boton>
            </div>
            <p className="text-14 text-tinta-media m-0">O déjanos tus datos y te llamamos nosotros.</p>
          </div>
          <FormularioPresupuesto variante="corto" origen="home_close" />
        </div>
      </Aparece>
    </>
  )
}
