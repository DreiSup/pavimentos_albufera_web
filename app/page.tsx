import type { Metadata } from 'next'
import Link from 'next/link'
import Aparece from '@/components/ui/Aparece'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Boton from '@/components/ui/Boton'
import { EnlaceEtiqueta } from '@/components/ui/EnlaceEtiqueta'
import Foto from '@/components/contenido/Foto'
import CarruselFotos from '@/components/contenido/CarruselFotos'
import EtiquetaTecnica from '@/components/datos/EtiquetaTecnica'
import DatoPendiente from '@/components/datos/DatoPendiente'
import MuestraAcabado from '@/components/contenido/MuestraAcabado'
import TarjetaProyecto, { TAMANOS_TARJETA_PROYECTO } from '@/components/contenido/TarjetaProyecto'
import Chip from '@/components/ui/Chip'
import BarraConfianza from '@/components/layout/BarraConfianza'
import Acordeon from '@/components/secciones/Acordeon'
import FormularioPresupuesto from '@/components/secciones/FormularioPresupuesto'
import { JsonLd, schemaFAQ } from '@/lib/schema'
import { acabadosPublicados, proyectos, recuentoAcabadosPublicados } from '@/lib/datos'
import { faqHome } from '@/content/faq'
import { PASOS, SERVICIOS } from '@/content/servicios'
import { CODIGO_COLOR, NOMBRE_MODELO, NOMBRE_SERVICIO, RUTA_SERVICIO } from '@/lib/tipos'
import type { Proyecto } from '@/lib/tipos'
import { nap } from '@/lib/config'

/**
 * Sin `title` a propósito. `title.template` de `app/layout.tsx` **no se aplica
 * al segmento que lo declara**, y esta página vive en ese mismo segmento raíz:
 * poniendo el título aquí salía `<title>Pavimentos de hormigón en Valencia</title>`
 * a secas, la única ruta del sitio sin marca. Sin él manda `title.default`, que
 * ya es literalmente «Pavimentos de hormigón en Valencia | Pavimentos Albufera».
 * Ni una palabra nueva: el copy es el que ya estaba en el layout.
 */
export const metadata: Metadata = {
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

/**
 * Las cuatro obras del carrusel del hero, en orden de pase.
 *
 * Todas tienen municipio confirmado y foto apaisada: en el hueco `3/4` de móvil
 * una foto de 900×500 se recortaría al 42 % de su ancho y dejaría de contar lo
 * que cuenta. Por eso no están ni Godella ni Ribarroja, y por eso tres de las
 * cuatro son de impreso: es lo que hay fotografiado en horizontal. La cuarta,
 * Corbera, entra para que el pase no enseñe una sola técnica.
 *
 * `superficiePendiente` recoge el único m² que la portada afirmaba: los 180 de
 * Moncada, que `content/proyectos.json` guarda como «sin confirmar» y que ya se
 * pintaban entre corchetes. No se inventa ninguno para las otras tres; donde no
 * hay dato, se ve que no lo hay.
 */
const DIAPOSITIVAS_HERO: { slug: string; superficiePendiente?: string }[] = [
  { slug: 'moncada-impreso-espiga-117', superficiePendiente: '180' },
  { slug: 'denia-impreso-piedra-inglesa' },
  { slug: 'alzira-impreso-adoquin-irregular-107' },
  { slug: 'corbera-fratasado-arena' },
]

/**
 * Las cuatro muestras de la portada salen de `acabadosPublicados`, la misma
 * lista que el muestrario, las seis páginas de servicio y las fichas de modelo.
 * Hoy son las mismas cuatro que antes —espiga 117, adoquín irregular 107,
 * adoquín pequeño arena y manta gris—, así que es un cambio de ORIGEN, no de
 * contenido: `piedra-inglesa-crema` tiene obra y no tiene muestra, y lo único
 * que la mantenía fuera de esta rejilla era estar en la posición 12 del JSON.
 *
 * ⚠️ **El criterio de esta rejilla NO es el del chip que tiene encima**, y hay
 * que saberlo antes de tocarla. El chip cuenta `documentados`, que exige
 * municipio confirmado (`estaDocumentado`); aquí se filtra por «tiene obra
 * asociada», que es más laxo y que `lib/datos.ts` desaconseja **para contar**.
 * Para elegir qué se enseña no es lo mismo: el muestrario existe para que el
 * visitante vea el modelo y el color, y eso una muestra con obra asociada lo
 * cumple aunque el municipio siga sin confirmar. La rejilla no afirma dónde se
 * hizo; el chip sí, y por eso cuenta más fino.
 *
 * La diferencia son hoy **cuatro muestras y una sola discrepancia**: la cuarta
 * es `manta-gris`, cuya obra no tiene municipio. Con el criterio del chip saldría
 * `piedra-inglesa-gris` en su lugar. Cambiarlo **no es refactor, es contenido**
 * —`manta-gris` está en los pendientes de CLAUDE.md a la espera de que el dueño
 * confirme el modelo—, así que se deja como está y se deja dicho.
 */
const muestraHome = acabadosPublicados.filter((a) => a.proyectos.length > 0).slice(0, 4)
/**
 * Las NUEVE obras documentadas, no una selección. Solo se ordenan: las
 * destacadas delante, porque en móvil la sección es un carril horizontal
 * (`02-pantallas.md §A1`, sección de proyectos) y lo que se ve sin arrastrar
 * son las dos primeras tarjetas. En escritorio la rejilla de tres pasa de 3×2
 * a 3×3 sin tocar nada.
 */
const proyectosHome = [...proyectos].sort((a, b) => Number(b.destacado) - Number(a.destacado))

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
// repite**: las otras cinco fotos de espacio siguen pidiendo su media columna.
const TAMANOS_HERO_HOME = '(min-width: 768px) 50vw, 100vw'
const TAMANOS_TARJETA_SERVICIO = '(min-width: 768px) 30vw, 100vw'
const TAMANOS_ESPACIO = '(min-width: 768px) 30vw, 50vw'
/**
 * Las cuatro obras del hero vuelven a salir como tarjeta en la sección 07, así
 * que ahora son cuatro las fotos con dos huecos, no una. Igualarlas al `sizes`
 * del hueco ancho sigue siendo lo barato: cuatro peticiones en vez de ocho.
 */
const fotosHero = new Set(
  DIAPOSITIVAS_HERO.map(({ slug }) => proyectos.find((p) => p.slug === slug)?.imagenes[0]?.src).filter(
    Boolean,
  ),
)
const fotosDeObra = new Set(proyectosHome.map((p) => p.imagenes[0]?.src).filter(Boolean))
const fotosDeServicio = new Set(servicios.map((s) => SERVICIOS[s.id].imagenTarjeta?.src).filter(Boolean))

function tamanosCompartidos(src?: string) {
  if (!src) return undefined
  if (fotosHero.has(src)) return TAMANOS_HERO_HOME
  if (fotosDeObra.has(src)) return TAMANOS_TARJETA_PROYECTO
  if (fotosDeServicio.has(src)) return TAMANOS_TARJETA_SERVICIO
  return undefined
}

/**
 * La etiqueta técnica de una diapositiva, con la MISMA regla que
 * `TarjetaProyecto`: municipio y provincia, luego técnica, modelo y color, y
 * por último superficie y año. Nada se escribe a mano, todo sale del modelo de
 * contenido, y lo que falta se ve faltar.
 */
function etiquetaDeObra(proyecto: Proyecto, superficiePendiente?: string) {
  const modelo = proyecto.modelo ? ` · ${NOMBRE_MODELO[proyecto.modelo].toUpperCase()}` : ''
  const color = proyecto.color ? ` · ${CODIGO_COLOR[proyecto.color]}` : ''
  return [
    /* El municipio y la provincia son opcionales en el modelo de contenido, y
       la interpolación a cadena vacía que había aquí pintaba un « · » suelto en
       cuanto faltara uno: exactamente el maquillaje que prohíbe CLAUDE.md. El
       patrón es el de `TarjetaProyecto`, el mismo corchete atenuado, en
       versalitas porque toda la etiqueta lo está. */
    <>
      {proyecto.municipio?.toUpperCase() ?? <DatoPendiente>MUNICIPIO</DatoPendiente>}
      {' · '}
      {proyecto.provincia?.toUpperCase() ?? <DatoPendiente>PROVINCIA</DatoPendiente>}
    </>,
    `${NOMBRE_SERVICIO[proyecto.servicio].toUpperCase()}${modelo}${color}`,
    <>
      {proyecto.superficie ?? <DatoPendiente>{superficiePendiente ?? 'm²'}</DatoPendiente>}
      {proyecto.superficie || superficiePendiente ? ' m²' : ''} ·{' '}
      {proyecto.anio ?? <DatoPendiente>año</DatoPendiente>}
    </>,
  ]
}

const diapositivasHero = DIAPOSITIVAS_HERO.map(({ slug, superficiePendiente }) => {
  const proyecto = proyectos.find((p) => p.slug === slug)!
  return {
    imagen: proyecto.imagenes[0],
    etiqueta: <EtiquetaTecnica lineas={etiquetaDeObra(proyecto, superficiePendiente)} />,
  }
})
/**
 * El recuento de lo PUBLICADO, el mismo que imprime `/acabados/`: diez muestras
 * y siete con obra documentada. La portada contaba `acabados.length` —el
 * catálogo entero, dieciséis— al lado de una rejilla que ya solo sale de
 * `acabadosPublicados`, y el visitante que tocaba «Abrir el muestrario
 * completo» aterrizaba en diez. Un contador que no cuadra con lo que hay debajo
 * es el mismo error del bloque de posición, contado con números.
 */
const { publicados: totalAcabados, documentados } = recuentoAcabadosPublicados()

export default function Home() {
  return (
    <>
      {/* 01 · Hero.
          Las dos maquetas de `02-pantallas.md §A1` son distintas —en móvil el titular
          va encima de la foto y el texto debajo; en escritorio el titular ocupa su
          columna junto al `4/3`— pero el nodo es uno solo: la diferencia la resuelve la
          rejilla. En móvil la columna única apila titular, foto y texto; en escritorio
          la foto salta a la segunda columna y ocupa las cuatro filas.
          Tres decisiones que no se pueden deshacer sin romper algo:
          - **Un solo <h1>** (README §9). Duplicarlo con `md:hidden` no lo quita del
            DOM: el rastreador y el lector de pantalla siguen viendo dos. Por eso el
            titular no se copia para superponerlo: es la rejilla la que lo mete en la
            misma celda que la foto por debajo de 768 px y lo saca a su columna por
            encima. Un nodo, dos sitios.
          - **El titular SÍ va sobre la foto en móvil**, que es lo que siempre dijo
            `§A1`, y el sistema ya tiene con qué: el velo de `design/01 §2.8`, medido
            para que `--fondo` aguante 4,79 : 1 sobre un píxel blanco puro. Decisión
            del dueño del 2026-09-17. En escritorio el titular sigue en su columna y
            no hay velo, porque no pisa ninguna foto.
          - **La foto es un carrusel de cuatro obras** (`design/01 §3.15`), y pasa
            solo. El pase es un `@keyframes` de opacidad y su control de pausa —el que
            exige la WCAG 2.2.2— un `<input type="checkbox">` que lee el propio CSS:
            el hero entero es de servidor y no hidrata nada, así que no hay ventana en
            la que se mueva algo que no se pueda parar. Con movimiento reducido no pasa
            nada, se ve la primera foto fija y el control se retira. */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-16 md:gap-y-6 md:grid-rows-[1fr_auto_auto_1fr] px-[18px] md:px-lat-desktop pt-8 md:pt-14">
        {/* `relative z-10` porque en móvil comparte celda con el carrusel y va
            detrás en el DOM; `self-start` para que se apoye en el borde superior de
            la foto en vez de estirarse. El `p-[18px]` es el respiro DENTRO del marco
            de la foto, no separación entre cajas: en escritorio desaparece. */}
        <h1 className="col-start-1 row-start-1 md:row-start-2 relative z-10 self-start p-[18px] md:p-0 font-display font-extrabold fs-hero text-46 md:text-88 leading-[1.05] md:leading-[1.02] text-fondo md:text-tinta m-0">
          Hormigón que se ve bien 20 años después
        </h1>

        {/* Un solo marco para los dos anchos: `display:none` no evita la descarga,
            así que duplicarlo por punto de ruptura serían ocho descargas. La 4/3 de
            escritorio es el hueco grande y las fotos apaisadas encajan sin recorte;
            en móvil se recortan a 3/4.
            `w-full h-full` es lo que deja que la celda mande: si el titular midiera
            más que la foto —pasa a 320 px, donde el H1 ocupa 374 px y el `3/4` solo
            359—, la fila crece y la foto crece con ella en vez de dejar el titular
            fuera. Y las DOS dimensiones, no solo la altura: con `h-full` a secas la
            `aspect-ratio` deducía la anchura de la altura —374 × 3/4 = 281 px en una
            columna de 269— y devolvía a la portada los 19 px de scroll horizontal
            que el mismo problema ya había causado en escritorio. */}
        <CarruselFotos
          diapositivas={diapositivasHero}
          proporcion="3/4"
          tamanos={TAMANOS_HERO_HOME}
          /* `md:aspect-auto` no es adorno: en escritorio esta caja abarca las cuatro
             filas de la rejilla, así que su altura es definida y su anchura no. Con una
             `aspect-ratio` viva, el navegador deduce la anchura de la altura —4/3 × 697 =
             929 px— en vez de estirarla a su columna de 648, y la foto se salía 241 px
             por la derecha con barra de scroll horizontal en toda la home. Fijando las
             dos dimensiones la proporción deja de opinar y recorta `object-cover`. */
          className="col-start-1 row-start-1 w-full h-full md:col-start-2 md:row-start-1 md:row-end-5 md:aspect-auto md:min-h-[660px]"
        >
          {/* El velo solo existe donde el titular pisa la foto. En escritorio el
              titular tiene su columna, así que sobra y se retira: las fotos se ven
              como son.
              Va como `children` del carrusel, que lo pinta entre las fotos y las
              etiquetas técnicas: oscurece la FOTO, no el texto que va encima de
              ella. Cuando caía también sobre la etiqueta la dejaba en 2,64 : 1.
              → `design/01` §3.15 */}
          <div className="velo absolute inset-0 md:hidden" aria-hidden="true" />
        </CarruselFotos>

        <div className="col-start-1 row-start-2 md:row-start-3 flex flex-col gap-4 md:gap-6">
          <p className="text-16 md:text-20 text-tinta-media md:max-w-[46ch] m-0">
            Pavimentos de hormigón impreso, pulido, lavado y microcemento en Valencia, Castellón y
            Alicante. 17 años ejecutando obra propia, con 10 años de garantía y mantenimiento
            incluido.
          </p>
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Ocre TAMBIÉN en móvil. Excepción consciente a la regla del ocre de
                `design/01 §2.2`, decidida por el dueño el 2026-09-17 y anotada allí:
                en móvil hay dos ocres en pantalla, este y el «Llamar» de la barra
                fija. La regla decía que el CTA del hero bajara a contorno justo para
                evitarlo; el dueño prefiere que los dos botones del hero no se
                confundan entre sí a que no compitan con la barra.
                `btn-primario` viene ya dentro de la variante y es lo que cambia el
                color del foco a tinta, el único que contrasta sobre ocre. */}
            <Boton variante="primario" href="/acabados/" anchoCompleto className="md:w-auto">
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

          {/* En móvil la sección era una lista de seis filas con una miniatura
              CUADRADA de 76 px a la izquierda: un sello, no una fotografía. La
              sección existe para que el visitante reconozca su espacio —un porche,
              una entrada de garaje— y a 76 px no se reconoce nada.
              Pasa a rejilla de dos columnas con la foto a 4/3 y el texto debajo,
              la misma tarjeta que ya usaba escritorio. Dos columnas y no una:
              apiladas a ancho completo serían seis fotos de 354×265, ~1.600 px de
              scroll antes de llegar al Muestrario, y next/image pediría candidatos
              de 1080 px seis veces. A 50vw la celda mide 174 px y el candidato cae
              en 640. → `design/02` §A1, enmendado el 2026-09-17. */}
          <div className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-2 gap-[2px] bg-tinta p-[2px]">
            {espacios.map((e) => (
              <div key={e.titulo} className="bg-fondo flex flex-col gap-3">
                <Foto
                  imagen={e.imagen}
                  proporcion="4/3"
                  tamanos={tamanosCompartidos(e.imagen?.src) ?? TAMANOS_ESPACIO}
                  className="w-full"
                />
                <div className="flex flex-col gap-1 px-3 pb-3 md:px-4 md:pb-4">
                  <h3 className="font-display font-bold fs-h3 text-16 md:text-20 m-0">{e.titulo}</h3>
                  <p className="text-14 md:text-16 text-tinta-media m-0">{e.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Aparece>

      {/* 04 · Servicios */}
      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <AntetituloSeccion numero="04">Servicios</AntetituloSeccion>
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

      {/* 05 · Muestrario */}
      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        {/* El enlace-etiqueta también era un nodo duplicado (arriba en escritorio,
            al final en móvil). Ahora es uno solo y lo coloca la rejilla. */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-6 md:gap-x-16">
          <div className="flex flex-col gap-2">
            <AntetituloSeccion numero="05">Muestrario</AntetituloSeccion>
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

      {/* 06 · Cómo trabajamos */}
      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <AntetituloSeccion numero="06">Cómo trabajamos</AntetituloSeccion>
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

      {/* 07 · Proyectos */}
      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-6 md:gap-x-16">
          <div className="flex flex-col gap-2">
            <AntetituloSeccion numero="07">Proyectos</AntetituloSeccion>
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
              Obra hecha, no catálogo de proveedor
            </h2>
            {/* La frase prometía filtrar por acabado, por tipo de espacio o por
                municipio, y `/proyectos/` ya no tiene filtros: se retiraron con
                ellos los bytes de JS del cliente, y la rejilla sale entera en el
                HTML. Se queda la primera frase, literalmente la que abre
                `app/proyectos/page.tsx`: las dos pantallas dicen ya lo mismo, y
                no hace falta copy nuevo para dejar de prometer lo que no hay. */}
            <p className="text-16 md:text-20 text-tinta-media max-w-[60ch] m-0">
              Todas las fotos de esta web son trabajos nuestros.
            </p>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto -mx-[18px] px-[18px] md:mx-0 md:px-0 md:col-span-2">
            {proyectosHome.map((p) => (
              <div key={p.slug} className="min-w-[220px] shrink-0 md:min-w-0 md:shrink">
                {/* La sección vuelve a fondo base con la nueva alternancia, así que la
                    tarjeta recupera su fondo alterno: es el contraste lo que la separa
                    de la página, no un color fijo. */}
                <TarjetaProyecto
                  proyecto={p}
                  tamanos={tamanosCompartidos(p.imagenes[0]?.src) ?? TAMANOS_TARJETA_PROYECTO}
                />
              </div>
            ))}
          </div>

          <EnlaceEtiqueta href="/proyectos/" className="md:col-start-2 md:row-start-1 md:justify-self-end">
            Ver todos los proyectos →
          </EnlaceEtiqueta>
        </div>
      </Aparece>

      {/* 08 · Garantía */}
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

      {/* 09 · Zonas */}
      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
          <div className="flex flex-col gap-4">
            <AntetituloSeccion numero="09">Zonas</AntetituloSeccion>
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
            {/* «Consúltanos» era la última palabra de la frase y no llevaba a ningún
                sitio. Se saca de la prosa a un enlace-etiqueta —44 px de alto, el
                mismo componente que cierra el Muestrario y Proyectos— sin escribir
                una palabra nueva: la frase se parte por su coma.
                `data-ubicacion` sigue el contrato de `lib/eventos.ts` para que el
                enlace sea distinguible en el informe. Es INERTE hoy: EventosGlobales
                solo dispara sobre `tel:`, `wa.me` y `mailto:`, y este es un enlace
                interno. Va por coherencia de contrato, no porque mida algo. */}
            <div className="flex flex-col gap-2 border-t border-tinta pt-4 items-start">
              <p className="font-mono text-d-11 text-acero uppercase m-0">Resto de España</p>
              <p className="text-16 text-tinta-media m-0">Proyectos de volumen.</p>
              <EnlaceEtiqueta href="/presupuesto/" data-ubicacion="section_mid">
                Consúltanos →
              </EnlaceEtiqueta>
            </div>
          </div>
        </div>
      </Aparece>

      {/* 10 · FAQ */}
      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <JsonLd data={schemaFAQ(faqHome)} />
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
          <div className="flex flex-col gap-4">
            <AntetituloSeccion numero="10">Preguntas frecuentes</AntetituloSeccion>
          </div>
          <Acordeon preguntas={faqHome} />
        </div>
      </Aparece>

      {/* 11 · Cierre */}
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
