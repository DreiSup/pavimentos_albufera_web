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
import TarjetaProyecto, { TAMANOS_TARJETA_PROYECTO } from '@/components/contenido/TarjetaProyecto'
import Chip from '@/components/ui/Chip'
import BarraConfianza from '@/components/layout/BarraConfianza'
import Acordeon from '@/components/secciones/Acordeon'
import FormularioPresupuesto from '@/components/secciones/FormularioPresupuesto'
import { JsonLd, schemaFAQ } from '@/lib/schema'
import { acabados, contarDocumentados, proyectos } from '@/lib/datos'
import { faqHome } from '@/content/faq'
import { PASOS, SERVICIOS } from '@/content/servicios'
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

const proyectoHero = proyectos.find((p) => p.slug === 'moncada-impreso-espiga-117')!
const muestraHome = acabados.filter((a) => a.proyectos.length > 0).slice(0, 4)
const proyectosHome = [...proyectos].sort((a, b) => Number(b.destacado) - Number(a.destacado)).slice(0, 6)

// Cuatro secciones de la home pueden enseñar la MISMA foto de origen: el hero y
// la tarjeta de obra de Moncada; una muestra de acabado y la tarjeta de la obra
// que la ejecutó; y la miniatura de un espacio y la tarjeta de su servicio. Dos
// `sizes` distintos sobre un mismo JPEG son dos peticiones a `/_next/image?` en
// la misma pantalla, y no una petición grande y otra barata: son dos ficheros
// enteros. Con la MISMA URL el navegador reutiliza incluso el mapa de bits ya
// descodificado, así que la miniatura de 76 px no paga nada por recibir el
// archivo grande que la página se estaba descargando de todas formas.
//
// El orden de precedencia es el del hueco más ancho, nunca al revés: degradar
// el `sizes` de un hero para hacerlo coincidir con una tarjeta serviría una
// imagen corta sobre el LCP. Y la regla se aplica **solo a la foto que se
// repite**: las otras cinco miniaturas de espacio siguen pidiendo 76 px, que es
// lo que miden.
const TAMANOS_HERO_HOME = '(min-width: 768px) 50vw, 100vw'
const TAMANOS_TARJETA_SERVICIO = '(min-width: 768px) 30vw, 100vw'
const TAMANOS_MINIATURA_ESPACIO = '(min-width: 768px) 30vw, 76px'
const fotoHero = proyectoHero.imagenes[0]?.src
const fotosDeObra = new Set(proyectosHome.map((p) => p.imagenes[0]?.src).filter(Boolean))
const fotosDeServicio = new Set(servicios.map((s) => SERVICIOS[s.id].imagenTarjeta?.src).filter(Boolean))

function tamanosCompartidos(src?: string) {
  if (!src) return undefined
  if (src === fotoHero) return TAMANOS_HERO_HOME
  if (fotosDeObra.has(src)) return TAMANOS_TARJETA_PROYECTO
  if (fotosDeServicio.has(src)) return TAMANOS_TARJETA_SERVICIO
  return undefined
}
const totalAcabados = acabados.length
const documentados = contarDocumentados()

export default function Home() {
  return (
    <>
      {/* 01 · Hero.
          Las dos maquetas de `02-pantallas.md §A1` son distintas —en móvil el titular
          va encima de la foto y el texto debajo; en escritorio el titular ocupa su
          columna junto al `4/3`— pero el nodo es uno solo: la diferencia la resuelve la
          rejilla. En móvil la columna única apila titular, foto y texto; en escritorio
          la foto salta a la segunda columna y ocupa las cuatro filas.
          Dos decisiones que no se pueden deshacer sin romper algo:
          - **Un solo <h1>** (README §9). Duplicarlo con `md:hidden` no lo quita del
            DOM: el rastreador y el lector de pantalla siguen viendo dos.
          - **El titular nunca SOBRE la foto.** Antes se superponía porque debajo había
            un bloque de posición plano; sobre fotografía real el contraste deja de ser
            comprobable y el sistema no tiene velo. Va delante, en su fila. */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-16 md:gap-y-6 md:grid-rows-[1fr_auto_auto_1fr] px-[18px] md:px-lat-desktop pt-8 md:pt-14">
        <h1 className="col-start-1 row-start-1 md:row-start-2 font-display font-extrabold fs-hero text-46 md:text-88 leading-[1.05] md:leading-[1.02] text-tinta m-0">
          Hormigón que se ve bien 20 años después
        </h1>

        {/* Una sola imagen para los dos anchos: `display:none` no evita la descarga,
            así que dos <Image> serían dos descargas. La 4/3 de escritorio es el hueco
            grande y la foto apaisada (1200×900) encaja sin recorte; en móvil se
            recorta a 3/4. */}
        <Foto
          imagen={proyectoHero.imagenes[0]}
          proporcion="3/4"
          prioridad
          tamanos={TAMANOS_HERO_HOME}
          className="col-start-1 row-start-2 md:col-start-2 md:row-start-1 md:row-end-5 md:aspect-[4/3] md:min-h-[660px] md:h-full"
          etiqueta={
            <EtiquetaTecnica
              lineas={['MONCADA · VALENCIA', 'IMPRESO · MODELO ESPIGA · COLOR 117', <>
                <DatoPendiente>180</DatoPendiente> m² · 2025
              </>]}
            />
          }
        />

        <div className="col-start-1 row-start-3 md:row-start-3 flex flex-col gap-4 md:gap-6">
          <p className="text-16 md:text-20 text-tinta-media md:max-w-[46ch] m-0">
            Pavimentos de hormigón impreso, pulido, lavado y microcemento en Valencia, Castellón y
            Alicante. 17 años ejecutando obra propia, con 10 años de garantía y mantenimiento
            incluido.
          </p>
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Regla del ocre: en escritorio este es el CTA primario; en móvil baja a
                contorno para no competir con la barra fija, que es la acción persistente.
                Mismo nodo, la variante la da el punto de ruptura. `btn-primario` solo
                cambia el color del foco (tinta), que es el que hace contraste sobre ocre. */}
            <Boton
              variante="contorno"
              href="/acabados/"
              anchoCompleto
              className="btn-primario md:w-auto md:bg-pigmento md:border-pigmento md:hover:bg-pigmento-hover md:hover:text-tinta"
            >
              Ver acabados
            </Boton>
            <Boton variante="contorno" href="/presupuesto/" anchoCompleto className="md:w-auto">
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
                  tamanos={tamanosCompartidos(e.imagen?.src) ?? TAMANOS_MINIATURA_ESPACIO}
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
        {/* El enlace-etiqueta también era un nodo duplicado (arriba en escritorio,
            al final en móvil). Ahora es uno solo y lo coloca la rejilla. */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-6 md:gap-x-16">
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

          {/* Contador del inventario, no filtros: aquí no hay nada que seleccionar.
              Se renderizan como etiqueta (`<span>`), que es lo que de verdad son.
              El ocre marca la cifra total, el segundo rol de la pantalla según
              `02-pantallas.md §A1` («CTA del hero + chip activo del muestrario»). */}
          <div className="flex gap-2 overflow-x-auto md:col-span-2">
            <Chip activo>
              Todas ({totalAcabados})
            </Chip>
            <Chip>{documentados} con obra documentada</Chip>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px_10px] md:gap-[32px_24px] md:col-span-2">
            {muestraHome.map((a) => (
              <MuestraAcabado
                key={a.slug}
                acabado={a}
                tamanos={tamanosCompartidos(a.muestra?.src)}
              />
            ))}
          </div>

          <EnlaceEtiqueta href="/acabados/" className="md:col-start-2 md:row-start-1 md:justify-self-end">
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
                  tamanos={
                    tamanosCompartidos(SERVICIOS[s.id].imagenTarjeta?.src) ?? TAMANOS_TARJETA_SERVICIO
                  }
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

      {/* 08 · Proyectos */}
      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-6 md:gap-x-16">
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

          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto -mx-[18px] px-[18px] md:mx-0 md:px-0 md:col-span-2">
            {proyectosHome.map((p) => (
              <div key={p.slug} className="min-w-[220px] shrink-0 md:min-w-0 md:shrink">
                <TarjetaProyecto
                  proyecto={p}
                  fondo="base"
                  tamanos={p.imagenes[0]?.src === fotoHero ? TAMANOS_HERO_HOME : undefined}
                />
              </div>
            ))}
          </div>

          <EnlaceEtiqueta href="/proyectos/" className="md:col-start-2 md:row-start-1 md:justify-self-end">
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
              <Boton
                variante="tinta"
                href={nap.telefonoHref ?? '/presupuesto/'}
                data-ubicacion="home_close"
                className="sobre-oscuro"
              >
                Llamar al {nap.telefono ?? <DatoPendiente>{nap.telefonoMostrado}</DatoPendiente>}
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
