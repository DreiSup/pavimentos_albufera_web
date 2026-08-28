import type { ReactNode } from 'react'
import DatoPendiente from '@/components/datos/DatoPendiente'
import type { OpcionUso } from '@/components/secciones/Calculadora'
import type { PreguntaFAQ } from '@/components/secciones/Acordeon'
import { PREGUNTAS } from '@/content/faq'
import type { ServicioId } from '@/lib/tipos'

/**
 * Contenido de las seis páginas de servicio. Antes solo existía `/hormigon-impreso/`,
 * con todo esto incrustado en sus 283 líneas de JSX; las otras cinco estaban
 * especificadas en `design/04` §1 y nunca se construyeron, y por eso seis
 * redirecciones 301 de la migración aterrizaban en un 404.
 *
 * ⚠️ **Regla de este archivo, heredada de `design/05` §B7: cero copy inventado.**
 * Los textos salen de sitios ya aprobados — la tabla de metadatos del §7.5 del
 * documento maestro, la lista de espacios y la de servicios de la home, y la
 * tabla de precios. Lo que no tiene fuente va entre corchetes con
 * `<DatoPendiente>`, no se rellena a ojo.
 *
 * Es TSX y no JSON precisamente por eso: los `<DatoPendiente>` van dentro de
 * los valores de la ficha técnica.
 */

type Aplicacion = { nombre: string; texto: string }

export type Servicio = {
  id: ServicioId
  ruta: string
  nombre: string
  title: string
  description: string
  h1: string
  entradilla: string
  etiquetaHero: string[]
  /** Solo donde hay copy aprobado que lo respalde. Si no, la sección no se renderiza. */
  aplicaciones?: { intro: string; lista: Aplicacion[] }
  fichaTecnica: { etiqueta: string; valor: ReactNode }[]
  cuandoNo?: { titulo: string; texto: string; alternativas: { href: string; texto: string }[] }
  /** Sin rango de precio aprobado no hay calculadora. Inventar cifras es peor que no darlas. */
  usosCalculadora?: OpcionUso[]
  /** Sin preguntas aplicables no hay sección de FAQ ni marcado `FAQPage`. */
  faq?: PreguntaFAQ[]
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
    usosCalculadora: [
      { id: 'peatonal', etiqueta: 'Peatonal (patios, porches, jardines)', rango: [28, 38] },
      { id: 'vehicular', etiqueta: 'Paso de vehículos (entradas, rampas)', rango: [35, 48] },
    ],
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
    usosCalculadora: [
      { id: 'interior', etiqueta: 'Interior de vivienda', rango: [30, 45] },
      { id: 'industrial', etiqueta: 'Nave o parking', rango: [22, 35] },
    ],
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
    usosCalculadora: [
      { id: 'sobre-existente', etiqueta: 'Sobre suelo existente', rango: [55, 85] },
    ],
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
    usosCalculadora: [{ id: 'lavado', etiqueta: 'Hormigón lavado', rango: [30, 42] }],
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
    faq: FAQ_SOLERA,
    fichaTecnica: [
      { etiqueta: 'ESPESOR', valor: <><DatoPendiente>espesor</DatoPendiente> cm</> },
      ...FICHA_SOLERA.slice(0, 3),
      { etiqueta: 'ÁRIDO', valor: <DatoPendiente>tipo y calibre</DatoPendiente> },
      ...FICHA_SOLERA.slice(3),
    ],
  },
}
