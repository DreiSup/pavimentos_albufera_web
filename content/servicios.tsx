import type { ReactNode } from 'react'
import DatoPendiente from '@/components/datos/DatoPendiente'
import type { PreguntaFAQ } from '@/components/secciones/Acordeon'
import { PREGUNTAS } from '@/content/faq'
import type { Imagen, ServicioId } from '@/lib/tipos'

/**
 * Contenido de las seis páginas de servicio. Antes solo existía `/hormigon-impreso/`,
 * con todo esto incrustado en sus 283 líneas de JSX; las otras cinco estaban
 * especificadas en `design/04` §1 y nunca se construyeron, y por eso seis
 * redirecciones 301 de la migración aterrizaban en un 404.
 *
 * ⚠️ **Regla de este archivo, heredada de `design/05` §B7: cero copy inventado.**
 * Los textos salen de sitios ya aprobados — la tabla de metadatos del §7.5 del
 * documento maestro, y la lista de espacios y la de servicios de la home. Lo
 * que no tiene fuente va entre corchetes con `<DatoPendiente>`, no se rellena
 * a ojo.
 *
 * ⚠️ **La tabla de precios ya no es fuente de nada aquí.** El 2026-09-18 el
 * dueño extendió a la calculadora la decisión que el 2026-09-17 retiró
 * `/precios/`: no quiere precios en la web. Con ella se fueron los rangos de
 * €/m² de los cuatro servicios que los declaraban. Siguen escritos en
 * `design/02` §A5 y `design/03` §5 como especificación histórica, y de ahí no
 * vuelven a una pantalla sin que lo pida él.
 *
 * Es TSX y no JSON precisamente por eso: los `<DatoPendiente>` van dentro de
 * los valores de la ficha técnica.
 */

type Aplicacion = { nombre: string; texto: string }

/**
 * Las secciones numeradas del cuerpo de `PaginaServicio`. Es una unión y no
 * `string` para que un `ocultarSecciones` con una errata no compile: el
 * numerado y el submenú se construyen de esta lista, y un id que no existe
 * ocultaría exactamente nada sin decirlo.
 */
export type SeccionServicio =
  | 'seccion-aplicaciones'
  | 'seccion-muestrario'
  | 'seccion-ficha'
  | 'seccion-cuando-no'
  | 'seccion-como'
  | 'seccion-obra'

export type Servicio = {
  id: ServicioId
  ruta: string
  nombre: string
  title: string
  description: string
  h1: string
  entradilla: string
  etiquetaHero: string[]
  /** Hero de la página de servicio. Sin ella el hueco vuelve a `<BloquePosicion>`. */
  imagenHero?: Imagen
  /** Tarjeta del servicio en la home. Distinta de la del hero a propósito. */
  imagenTarjeta?: Imagen
  /** Solo donde hay copy aprobado que lo respalde. Si no, la sección no se renderiza. */
  aplicaciones?: { intro: string; lista: Aplicacion[] }
  fichaTecnica: { etiqueta: string; valor: ReactNode }[]
  cuandoNo?: { titulo: string; texto: string; alternativas: { href: string; texto: string }[] }
  /** Sin preguntas aplicables no hay sección de FAQ ni marcado `FAQPage`. */
  faq?: PreguntaFAQ[]

  /*
   * Los tres campos de abajo son la recomposición de campaña. Las seis rutas de
   * servicio NO los declaran: los pone `content/landings.ts` sobre una copia del
   * servicio, para que `/lp/<slug>/` sea la misma plantilla con secciones
   * desactivadas y no una plantilla clonada que diverja en un mes.
   */

  /** Secciones que la landing no monta. Hoy solo la ficha técnica: las seis la llenan de corchetes. */
  ocultarSecciones?: readonly SeccionServicio[]
  /** Pone los CTA de llamada y WhatsApp en el hero y en el cierre, en `tinta`/`contorno`. Nunca ocre. */
  ctaContacto?: boolean
  /** Exime del `<Aparece>` el cierre con CTA + formulario, que es el bloque de conversión. */
  sinAparece?: boolean
}

/**
 * Preguntas que hablan de una solera de hormigón en general, no de un acabado
 * concreto: curado, resellado, precio por m² y clientes de empresa.
 *
 * ⚠️ **`grietas` y `sobreExistente` NO están aquí, y es deliberado**: las dos
 * nombran el hormigón impreso dentro del texto. Cuando las seis páginas
 * compartían una sola lista, `/microcemento/` preguntaba «¿se agrieta el
 * hormigón impreso?» y `/hormigon-pulido/` respondía «en microcemento sí, y ahí
 * está su gran ventaja» — mandando al lector fuera de la página en la que está.
 */
const FAQ_SOLERA: PreguntaFAQ[] = [
  PREGUNTAS.pisar,
  PREGUNTAS.resellar,
  PREGUNTAS.presupuestoBarato,
  PREGUNTAS.empresas,
]

/** Espacios tal como están redactados en la home. No se reescriben aquí. */
const ESPACIO = {
  garaje: { nombre: 'Entrada de garaje', texto: 'Aguanta el paso de coches sin agrietarse.' },
  porche: { nombre: 'Porche y terraza', texto: 'El acabado que más piden nuestros clientes.' },
  piscina: { nombre: 'Contorno de piscina', texto: 'Antideslizante y frío al sol.' },
  interior: { nombre: 'Interior de vivienda', texto: 'Continuo, sin juntas, fácil de limpiar.' },
  patio: { nombre: 'Patio y jardín', texto: 'Integrado con el entorno, sin mantenimiento.' },
  nave: { nombre: 'Nave, parking o local', texto: 'Resistente al tránsito pesado y a los ácidos.' },
} as const

/** Filas que son propiedades del hormigón, no de un acabado concreto. */
const FICHA_SOLERA: { etiqueta: string; valor: ReactNode }[] = [
  { etiqueta: 'ARMADO', valor: 'Mallazo electrosoldado + fibra de polipropileno' },
  { etiqueta: 'HORMIGÓN', valor: 'HA-25 según EHE-08' },
  { etiqueta: 'JUNTAS DE DILATACIÓN', valor: <>Cada <DatoPendiente>16-25</DatoPendiente> m²</> },
  { etiqueta: 'TRÁNSITO PEATONAL', valor: '24-48 h' },
  { etiqueta: 'CURADO COMPLETO', valor: '28 días' },
]

/**
 * Los cuatro pasos de «Cómo trabajamos». Vive aquí porque lo montan dos
 * pantallas —la home y las seis páginas de servicio— y estaba copiado en las
 * dos: `PaginaServicio.tsx` y `app/page.tsx` tenían el mismo texto escrito dos
 * veces, que es la manera segura de que dentro de un mes digan cosas distintas.
 */
export const PASOS: { numero: string; titulo: string; texto: ReactNode }[] = [
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

export const SERVICIOS: Record<ServicioId, Servicio> = {
  impreso: {
    id: 'impreso',
    ruta: '/hormigon-impreso/',
    nombre: 'Hormigón impreso',
    title: 'Hormigón impreso Valencia | Precio y acabados',
    description:
      'Hormigón impreso para patios, entradas y piscinas. Mira los acabados reales, consulta el precio por m² y pide presupuesto sin compromiso.',
    h1: 'Hormigón impreso en Valencia, Castellón y Alicante',
    entradilla:
      'Textura de piedra natural, adoquín o madera sobre una solera continua. Sin juntas donde crezca la hierba, sin baldosas que se levanten y con un mantenimiento que se reduce a barrer.',
    etiquetaHero: ['IMPRESO', 'ESPESOR 10 CM · HA-25 · EHE-08'],
    imagenHero: {
      src: '/obras/_sin-atribuir/WhatsApp-Image-2021-07-23-at-10.36.09-3.jpeg',
      alt: 'Solárium de hormigón impreso ocre alrededor de una piscina, con un olivo plantado en un alcorque y pinar al fondo.',
      tipo: 'final',
    },
    imagenTarjeta: {
      src: '/obras/_sin-atribuir/hormigon-impreso-economico-valencia.jpg',
      alt: 'Acceso de hormigón impreso de tono rojizo entre setos recortados, ante la puerta de un garaje.',
      tipo: 'final',
    },
    aplicaciones: {
      intro:
        'El impreso es el acabado que mejor funciona en exterior. Es impermeable, aguanta el paso de coches, resiste manchas de grasa y aceite y no se decolora con el sol si lleva el sellado adecuado.',
      lista: [
        { nombre: 'Entradas de garaje y rampas', texto: 'Con espesor y armado reforzados.' },
        { nombre: 'Porches, patios y terrazas', texto: 'El uso más habitual.' },
        { nombre: 'Contornos de piscina', texto: 'Con acabado antideslizante.' },
        { nombre: 'Caminos y accesos de parcela', texto: '' },
        { nombre: 'Muros y fachadas', texto: 'La misma técnica en vertical, con la misma gama.' },
      ],
    },
    fichaTecnica: [
      { etiqueta: 'ESPESOR USO PEATONAL', valor: '10 cm' },
      { etiqueta: 'ESPESOR PASO DE VEHÍCULOS', valor: '12-15 cm' },
      ...FICHA_SOLERA.slice(0, 3),
      { etiqueta: 'SELLADO', valor: <>Resina acrílica, <DatoPendiente>2</DatoPendiente> manos</> },
      ...FICHA_SOLERA.slice(3),
    ],
    cuandoNo: {
      titulo: 'Cuándo NO elegir impreso',
      texto:
        'Preferimos decírtelo antes. Si vas a pavimentar un interior, el pulido o el microcemento quedan mejor y son más fáciles de mantener. Si el terreno tiene humedades sin resolver o raíces de arbolado grande cerca, primero hay que solucionar eso: el mejor pavimento del mundo se agrieta sobre una base que se mueve.',
      alternativas: [
        { href: '/hormigon-pulido/', texto: 'Ver hormigón pulido' },
        { href: '/microcemento/', texto: 'Ver microcemento' },
      ],
    },
    // Las únicas dos preguntas del catálogo que nombran el impreso viven aquí y
    // solo aquí.
    faq: [
      PREGUNTAS.pisar,
      PREGUNTAS.grietas,
      PREGUNTAS.sobreExistente,
      PREGUNTAS.resellar,
      PREGUNTAS.presupuestoBarato,
    ],
  },

  pulido: {
    id: 'pulido',
    ruta: '/hormigon-pulido/',
    nombre: 'Hormigón pulido',
    title: 'Hormigón pulido Valencia | Interior e industrial',
    description:
      'Hormigón pulido para naves, parkings, garajes e interiores de vivienda. Precio por m², ficha técnica y obras ejecutadas.',
    h1: 'Hormigón pulido en Valencia, Castellón y Alicante',
    entradilla: 'Superficie lisa y brillante. De la nave industrial al salón de casa.',
    etiquetaHero: ['PULIDO', 'HA-25 · EHE-08'],
    imagenHero: {
      src: '/obras/_sin-atribuir/WhatsApp-Image-2023-08-22-at-09.08.17-1.jpeg',
      alt: 'Interior diáfano con solera de hormigón pulido gris que refleja el ventanal como un espejo.',
      tipo: 'final',
    },
    imagenTarjeta: {
      src: '/obras/_sin-atribuir/pavimento-hormigon-pulido-castellon-1.jpg',
      alt: 'Terraza de hormigón pulido claro ante una vivienda blanca de líneas rectas.',
      tipo: 'final',
    },
    aplicaciones: {
      intro:
        'Es el acabado de interior y de gran superficie: continuo, sin juntas donde se acumule suciedad y con la resistencia de una solera de hormigón.',
      lista: [ESPACIO.interior, ESPACIO.nave, ESPACIO.garaje],
    },
    fichaTecnica: [
      { etiqueta: 'ESPESOR', valor: <><DatoPendiente>espesor</DatoPendiente> cm</> },
      ...FICHA_SOLERA.slice(0, 3),
      { etiqueta: 'ACABADO', valor: <>Fratasado mecánico y pulido, <DatoPendiente>nº de pasadas</DatoPendiente></> },
      { etiqueta: 'SELLADO', valor: <DatoPendiente>producto y manos</DatoPendiente> },
      ...FICHA_SOLERA.slice(3),
    ],
    cuandoNo: {
      titulo: 'Cuándo NO elegir pulido',
      texto:
        'En exterior con paso descalzo — contornos de piscina, sobre todo — una superficie pulida resbala. Ahí van el impreso con acabado antideslizante o el lavado. Y si lo que quieres es renovar un suelo que ya existe sin picarlo, el pulido no sirve: eso es microcemento.',
      alternativas: [
        { href: '/hormigon-impreso/', texto: 'Ver hormigón impreso' },
        { href: '/microcemento/', texto: 'Ver microcemento' },
      ],
    },
    faq: FAQ_SOLERA,
  },

  microcemento: {
    id: 'microcemento',
    ruta: '/microcemento/',
    nombre: 'Microcemento',
    title: 'Microcemento en Valencia | Sin obra ni escombros',
    description:
      'Renueva suelos, baños y paredes sin picar lo que ya tienes. Microcemento aplicado sobre azulejo, terrazo o gres. Precio y proyectos.',
    h1: 'Microcemento en Valencia, Castellón y Alicante',
    entradilla: 'Renueva suelos y paredes sin levantar lo que ya tienes.',
    etiquetaHero: ['MICROCEMENTO', 'SOBRE SOPORTE EXISTENTE'],
    imagenHero: {
      src: '/obras/_sin-atribuir/microcemento-4.jpg',
      alt: 'Estancia con suelo y banco corrido de microcemento gris, con láminas enmarcadas en la pared.',
      tipo: 'final',
    },
    imagenTarjeta: {
      src: '/obras/_sin-atribuir/microcemento-valencia-1.jpg',
      alt: 'Encimera de baño de microcemento con dos lavabos sobre encimera y frente continuo sin juntas.',
      tipo: 'final',
    },
    aplicaciones: {
      intro:
        'Es el único de los seis que no necesita solera nueva: se aplica sobre azulejo, terrazo o gres sin picar nada, así que no hay escombro ni obra.',
      lista: [ESPACIO.interior],
    },
    fichaTecnica: [
      { etiqueta: 'SOPORTE', valor: 'Azulejo, terrazo, gres o solera existente' },
      { etiqueta: 'ESPESOR', valor: <><DatoPendiente>espesor</DatoPendiente> mm</> },
      { etiqueta: 'CAPAS', valor: <DatoPendiente>nº de capas</DatoPendiente> },
      { etiqueta: 'SELLADO', valor: <DatoPendiente>producto y manos</DatoPendiente> },
      { etiqueta: 'TRÁNSITO PEATONAL', valor: <DatoPendiente>plazo</DatoPendiente> },
      { etiqueta: 'CURADO COMPLETO', valor: <DatoPendiente>plazo</DatoPendiente> },
    ],
    cuandoNo: {
      titulo: 'Cuándo NO elegir microcemento',
      texto:
        'No es un pavimento de exterior sometido a paso de vehículos: para una entrada de garaje o una rampa, la solución es una solera de impreso o de pulido. Y si el suelo que hay debajo se mueve o tiene humedades sin resolver, el microcemento las hereda: hay que arreglar eso primero.',
      alternativas: [
        { href: '/hormigon-impreso/', texto: 'Ver hormigón impreso' },
        { href: '/hormigon-pulido/', texto: 'Ver hormigón pulido' },
      ],
    },
    // Sin FAQ a propósito. El microcemento no lleva solera, así que ninguna de
    // las preguntas del catálogo —curado del hormigón, resellado de exterior,
    // precio de una solera de 10 cm— le aplica sin reescribirla. Y reescribirla
    // es copy nuevo, que según `design/05` §B7 lo escribe el cliente.
    // 🔴 Pendiente: sus preguntas propias (soporte, espesor, baños, plazo).
  },

  lavado: {
    id: 'lavado',
    ruta: '/hormigon-lavado/',
    nombre: 'Hormigón lavado',
    title: 'Hormigón lavado y árido visto en Valencia',
    description:
      'Pavimento antideslizante de clase 3 para zonas peatonales, piscinas y accesos. Ficha técnica, acabados y precio orientativo.',
    h1: 'Hormigón lavado en Valencia, Castellón y Alicante',
    entradilla: 'Árido visto, antideslizante. Ideal para zonas de paso y piscinas.',
    etiquetaHero: ['LAVADO', 'ÁRIDO VISTO · CLASE 3'],
    imagenHero: {
      src: '/obras/_sin-atribuir/hormigon-lavado-2.jpg',
      alt: 'Dos paños contiguos de hormigón lavado, uno de árido oscuro y otro dorado, separados por una banda de piedra.',
      tipo: 'detalle',
    },
    imagenTarjeta: {
      src: '/obras/godella-lavado-gris-2.jpg',
      alt: 'Paseo de hormigón lavado con árido visto entre dos franjas de césped.',
      tipo: 'final',
    },
    faq: FAQ_SOLERA,
    aplicaciones: {
      intro:
        'Se retira la lechada superficial para dejar el árido a la vista. El resultado es una superficie rugosa de clase 3, que es la que piden las zonas donde se anda descalzo o mojado.',
      lista: [ESPACIO.piscina, ESPACIO.patio, ESPACIO.garaje],
    },
    fichaTecnica: [
      { etiqueta: 'RESISTENCIA AL DESLIZAMIENTO', valor: 'Clase 3' },
      { etiqueta: 'ESPESOR', valor: <><DatoPendiente>espesor</DatoPendiente> cm</> },
      ...FICHA_SOLERA.slice(0, 3),
      { etiqueta: 'ÁRIDO', valor: <DatoPendiente>tipo y calibre</DatoPendiente> },
      ...FICHA_SOLERA.slice(3),
    ],
  },

  fratasado: {
    id: 'fratasado',
    ruta: '/hormigon-fratasado/',
    nombre: 'Hormigón fratasado',
    title: 'Hormigón fratasado en Valencia',
    description:
      'Acabado fino y mate sobre solera de hormigón, para patios, jardines y superficies de paso. Ficha técnica, obra ejecutada y presupuesto sin compromiso.',
    h1: 'Hormigón fratasado en Valencia, Castellón y Alicante',
    entradilla: 'Acabado fino y mate. Sobrio, moderno y económico.',
    etiquetaHero: ['FRATASADO', 'HA-25 · EHE-08'],
    imagenHero: {
      src: '/obras/_sin-atribuir/5da4504f-2c7e-4fee-897b-fe0ed0a4a3a1.jpeg',
      alt: 'Porche cubierto con solera de hormigón fratasado claro, con sofás y el jardín al fondo.',
      tipo: 'final',
    },
    imagenTarjeta: {
      src: '/obras/_sin-atribuir/4d88392b-d7b1-4d77-900b-82db9f0ecd29.jpeg',
      alt: 'Contorno de piscina de hormigón fratasado en tono tostado ante una vivienda encalada.',
      tipo: 'final',
    },
    faq: FAQ_SOLERA,
    fichaTecnica: [
      { etiqueta: 'ESPESOR', valor: <><DatoPendiente>espesor</DatoPendiente> cm</> },
      ...FICHA_SOLERA.slice(0, 3),
      { etiqueta: 'ACABADO', valor: <DatoPendiente>tipo de fratasado</DatoPendiente> },
      ...FICHA_SOLERA.slice(3),
    ],
  },

  desactivado: {
    id: 'desactivado',
    ruta: '/hormigon-desactivado/',
    nombre: 'Hormigón desactivado',
    title: 'Hormigón desactivado en Valencia',
    description:
      'Piedra vista con la resistencia de una solera de hormigón, para caminos, patios y zonas de paso. Ficha técnica, obra ejecutada y presupuesto sin compromiso.',
    h1: 'Hormigón desactivado en Valencia, Castellón y Alicante',
    entradilla: 'Piedra vista con la resistencia de una solera.',
    etiquetaHero: ['DESACTIVADO', 'PIEDRA VISTA · HA-25'],
    imagenHero: {
      src: '/obras/_sin-atribuir/791ae455-ca8a-4ae9-a9fb-5d01ca9b554b.jpeg',
      alt: 'Rampa de hormigón desactivado con la piedra vista, entre muros de mampostería, ante la entrada de una vivienda.',
      tipo: 'final',
    },
    imagenTarjeta: {
      src: '/obras/_sin-atribuir/184fae6c-4c1c-464b-96dc-c44e906e2b64.jpeg',
      alt: 'Primer plano del árido de un hormigón desactivado, con los cantos rodados al descubierto.',
      tipo: 'detalle',
    },
    faq: FAQ_SOLERA,
    fichaTecnica: [
      { etiqueta: 'ESPESOR', valor: <><DatoPendiente>espesor</DatoPendiente> cm</> },
      ...FICHA_SOLERA.slice(0, 3),
      { etiqueta: 'ÁRIDO', valor: <DatoPendiente>tipo y calibre</DatoPendiente> },
      ...FICHA_SOLERA.slice(3),
    ],
  },
}
