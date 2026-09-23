import type { Service, SpecRow } from '../schemas/service.ts'

/**
 * The 6 techniques, from `apps/web/src/content/servicios.tsx`'s `SERVICIOS`.
 * Array order is the site's menu order. Every `specs` value is a plain
 * string in the source (confirmed by reading the whole file): the only JSX
 * there is 2 of the 4 `PASOS[].texto` entries, which are a SEPARATE export
 * this migration deliberately does not move here (D6 — they stay in the
 * `apps/web/src/content/servicios.tsx` adapter, proven identical in phase
 * 2b, not this one).
 */

const SLAB_BASE_SPECS: SpecRow[] = [
  { label: { es: 'ARMADO' }, value: { es: 'Mallazo electrosoldado + fibra de polipropileno' } },
  { label: { es: 'HORMIGÓN' }, value: { es: 'HA-25 según EHE-08' } },
]

const SLAB_SCHEDULE_SPECS: SpecRow[] = [
  { label: { es: 'TRÁNSITO PEATONAL' }, value: { es: '24-48 h' } },
  { label: { es: 'CURADO COMPLETO' }, value: { es: '28 días' } },
]

const SPACE = {
  garage: { name: { es: 'Entrada de garaje' }, text: { es: 'Aguanta el paso de coches sin agrietarse.' } },
  porch: { name: { es: 'Porche y terraza' }, text: { es: 'El acabado que más piden nuestros clientes.' } },
  pool: { name: { es: 'Contorno de piscina' }, text: { es: 'Antideslizante y frío al sol.' } },
  interior: { name: { es: 'Interior de vivienda' }, text: { es: 'Continuo, sin juntas, fácil de limpiar.' } },
  patio: { name: { es: 'Patio y jardín' }, text: { es: 'Integrado con el entorno, sin mantenimiento.' } },
  warehouse: { name: { es: 'Nave, parking o local' }, text: { es: 'Resistente al tránsito pesado y a los ácidos.' } },
}

/** `FAQ_SOLERA` in the source: questions about a concrete slab in general, shared by 4 services. */
const SLAB_FAQ_REFS = ['walkable', 'resealing', 'businessClients']

export const services = [
  {
    id: 'impreso',
    path: { es: '/hormigon-impreso/' },
    name: { es: 'Hormigón impreso' },
    title: { es: 'Hormigón impreso Valencia | Acabados y obra ejecutada' },
    description: {
      es: 'Hormigón impreso para patios, entradas y piscinas. Mira los acabados reales y pide presupuesto sin compromiso.',
    },
    h1: { es: 'Hormigón impreso en Valencia, Castellón y Alicante' },
    intro: {
      es: 'Textura de piedra natural, adoquín o madera sobre una solera continua. Sin juntas donde crezca la hierba, sin baldosas que se levanten y con un mantenimiento que se reduce a barrer.',
    },
    heroLabelLines: [{ es: 'IMPRESO' }, { es: 'ESPESOR 10 CM · HA-25 · EHE-08' }],
    heroImage: {
      src: '/obras/_sin-atribuir/WhatsApp-Image-2021-07-23-at-10.36.09-3.jpeg',
      alt: {
        es: 'Solárium de hormigón impreso ocre alrededor de una piscina, con un olivo plantado en un alcorque y pinar al fondo.',
      },
      kind: 'final',
    },
    cardImage: {
      src: '/obras/_sin-atribuir/hormigon-impreso-economico-valencia.jpg',
      alt: { es: 'Acceso de hormigón impreso de tono rojizo entre setos recortados, ante la puerta de un garaje.' },
      kind: 'final',
    },
    applications: {
      intro: {
        es: 'El impreso es el acabado que mejor funciona en exterior. Es impermeable, aguanta el paso de coches, resiste manchas de grasa y aceite y no se decolora con el sol si lleva el sellado adecuado.',
      },
      list: [
        { name: { es: 'Entradas de garaje y rampas' }, text: { es: 'Con espesor y armado reforzados.' } },
        { name: { es: 'Porches, patios y terrazas' }, text: { es: 'El uso más habitual.' } },
        { name: { es: 'Contornos de piscina' }, text: { es: 'Con acabado antideslizante.' } },
        { name: { es: 'Caminos y accesos de parcela' }, text: { es: '' } },
        { name: { es: 'Muros y fachadas' }, text: { es: 'La misma técnica en vertical, con la misma gama.' } },
      ],
    },
    specs: [
      { label: { es: 'ESPESOR USO PEATONAL' }, value: { es: '10 cm' } },
      { label: { es: 'ESPESOR PASO DE VEHÍCULOS' }, value: { es: '12-15 cm' } },
      ...SLAB_BASE_SPECS,
      { label: { es: 'SELLADO' }, value: { es: 'Resina acrílica' } },
      ...SLAB_SCHEDULE_SPECS,
    ],
    whenNotTo: {
      title: { es: 'Cuándo NO elegir impreso' },
      text: {
        es: 'Preferimos decírtelo antes. Si vas a pavimentar un interior, el pulido o el microcemento quedan mejor y son más fáciles de mantener. Si el terreno tiene humedades sin resolver o raíces de arbolado grande cerca, primero hay que solucionar eso: el mejor pavimento del mundo se agrieta sobre una base que se mueve.',
      },
      alternatives: [
        { href: '/hormigon-pulido/', text: { es: 'Ver hormigón pulido' } },
        { href: '/microcemento/', text: { es: 'Ver microcemento' } },
      ],
    },
    faqRefs: ['walkable', 'cracking', 'overExistingFloor', 'resealing'],
  },

  {
    id: 'pulido',
    path: { es: '/hormigon-pulido/' },
    name: { es: 'Hormigón pulido' },
    title: { es: 'Hormigón pulido Valencia | Interior e industrial' },
    description: {
      es: 'Hormigón pulido para naves, parkings, garajes e interiores de vivienda. Ficha técnica y obras ejecutadas.',
    },
    h1: { es: 'Hormigón pulido en Valencia, Castellón y Alicante' },
    intro: { es: 'Superficie lisa y brillante. De la nave industrial al salón de casa.' },
    heroLabelLines: [{ es: 'PULIDO' }, { es: 'HA-25 · EHE-08' }],
    heroImage: {
      src: '/obras/_sin-atribuir/WhatsApp-Image-2023-08-22-at-09.08.17-1.jpeg',
      alt: { es: 'Interior diáfano con solera de hormigón pulido gris que refleja el ventanal como un espejo.' },
      kind: 'final',
    },
    cardImage: {
      src: '/obras/_sin-atribuir/pavimento-hormigon-pulido-castellon-1.jpg',
      alt: { es: 'Terraza de hormigón pulido claro ante una vivienda blanca de líneas rectas.' },
      kind: 'final',
    },
    applications: {
      intro: {
        es: 'Es el acabado de interior y de gran superficie: continuo, sin juntas donde se acumule suciedad y con la resistencia de una solera de hormigón.',
      },
      list: [SPACE.interior, SPACE.warehouse, SPACE.garage],
    },
    specs: [
      ...SLAB_BASE_SPECS,
      { label: { es: 'ACABADO' }, value: { es: 'Fratasado mecánico y pulido' } },
      ...SLAB_SCHEDULE_SPECS,
    ],
    whenNotTo: {
      title: { es: 'Cuándo NO elegir pulido' },
      text: {
        es: 'En exterior con paso descalzo — contornos de piscina, sobre todo — una superficie pulida resbala. Ahí van el impreso con acabado antideslizante o el lavado. Y si lo que quieres es renovar un suelo que ya existe sin picarlo, el pulido no sirve: eso es microcemento.',
      },
      alternatives: [
        { href: '/hormigon-impreso/', text: { es: 'Ver hormigón impreso' } },
        { href: '/microcemento/', text: { es: 'Ver microcemento' } },
      ],
    },
    faqRefs: SLAB_FAQ_REFS,
  },

  {
    id: 'microcemento',
    path: { es: '/microcemento/' },
    name: { es: 'Microcemento' },
    title: { es: 'Microcemento en Valencia | Sin obra ni escombros' },
    description: {
      es: 'Renueva suelos, baños y paredes sin picar lo que ya tienes. Microcemento aplicado sobre azulejo, terrazo o gres.',
    },
    h1: { es: 'Microcemento en Valencia, Castellón y Alicante' },
    intro: { es: 'Renueva suelos y paredes sin levantar lo que ya tienes.' },
    heroLabelLines: [{ es: 'MICROCEMENTO' }, { es: 'SOBRE SOPORTE EXISTENTE' }],
    heroImage: {
      src: '/obras/_sin-atribuir/microcemento-4.jpg',
      alt: { es: 'Estancia con suelo y banco corrido de microcemento gris, con láminas enmarcadas en la pared.' },
      kind: 'final',
    },
    cardImage: {
      src: '/obras/_sin-atribuir/microcemento-valencia-1.jpg',
      alt: { es: 'Encimera de baño de microcemento con dos lavabos sobre encimera y frente continuo sin juntas.' },
      kind: 'final',
    },
    applications: {
      intro: {
        es: 'Es el único de los seis que no necesita solera nueva: se aplica sobre azulejo, terrazo o gres sin picar nada, así que no hay escombro ni obra.',
      },
      list: [SPACE.interior],
    },
    specs: [
      { label: { es: 'SOPORTE' }, value: { es: 'Azulejo, terrazo, gres o solera existente' } },
      { label: { es: 'ESPESOR TOTAL' }, value: { es: '2-3 mm' } },
    ],
    whenNotTo: {
      title: { es: 'Cuándo NO elegir microcemento' },
      text: {
        es: 'No es un pavimento de exterior sometido a paso de vehículos: para una entrada de garaje o una rampa, la solución es una solera de impreso o de pulido. Y si el suelo que hay debajo se mueve o tiene humedades sin resolver, el microcemento las hereda: hay que arreglar eso primero.',
      },
      alternatives: [
        { href: '/hormigon-impreso/', text: { es: 'Ver hormigón impreso' } },
        { href: '/hormigon-pulido/', text: { es: 'Ver hormigón pulido' } },
      ],
    },
    faqRefs: ['microSupport', 'microThickness', 'microJoints', 'microMoisture', 'microCleaning'],
  },

  {
    id: 'lavado',
    path: { es: '/hormigon-lavado/' },
    name: { es: 'Hormigón lavado' },
    title: { es: 'Hormigón lavado y árido visto en Valencia' },
    description: {
      es: 'Pavimento antideslizante de clase 3 para zonas peatonales, piscinas y accesos. Ficha técnica y acabados.',
    },
    h1: { es: 'Hormigón lavado en Valencia, Castellón y Alicante' },
    intro: { es: 'Árido visto, antideslizante. Ideal para zonas de paso y piscinas.' },
    heroLabelLines: [{ es: 'LAVADO' }, { es: 'ÁRIDO VISTO · CLASE 3' }],
    heroImage: {
      src: '/obras/_sin-atribuir/hormigon-lavado-2.jpg',
      alt: {
        es: 'Dos paños contiguos de hormigón lavado, uno de árido oscuro y otro dorado, separados por una banda de piedra.',
      },
      kind: 'detalle',
    },
    cardImage: {
      src: '/obras/godella-lavado-gris-2.jpg',
      alt: { es: 'Paseo de hormigón lavado con árido visto entre dos franjas de césped.' },
      kind: 'final',
    },
    applications: {
      intro: {
        es: 'Se retira la lechada superficial para dejar el árido a la vista. El resultado es una superficie rugosa de clase 3, que es la que piden las zonas donde se anda descalzo o mojado.',
      },
      list: [SPACE.pool, SPACE.patio, SPACE.garage],
    },
    specs: [{ label: { es: 'RESISTENCIA AL DESLIZAMIENTO' }, value: { es: 'Clase 3' } }, ...SLAB_BASE_SPECS, ...SLAB_SCHEDULE_SPECS],
    whenNotTo: {
      title: { es: 'Cuándo NO elegir lavado' },
      text: {
        es: 'Es un acabado de intemperie. Dentro de casa el árido visto no aporta nada, y ahí el suelo continuo y liso es el pulido. Y si lo que buscas es un dibujo —piedra, adoquín, madera—, el lavado no lo hace: deja a la vista el árido que ya lleva el hormigón, sin molde que lo dibuje. Eso es impreso.',
      },
      alternatives: [
        { href: '/hormigon-pulido/', text: { es: 'Ver hormigón pulido' } },
        { href: '/hormigon-impreso/', text: { es: 'Ver hormigón impreso' } },
      ],
    },
    faqRefs: SLAB_FAQ_REFS,
  },

  {
    id: 'fratasado',
    path: { es: '/hormigon-fratasado/' },
    name: { es: 'Hormigón fratasado' },
    title: { es: 'Hormigón fratasado en Valencia' },
    description: {
      es: 'Acabado fino y mate sobre solera de hormigón, para patios, jardines y superficies de paso. Ficha técnica, obra ejecutada y presupuesto sin compromiso.',
    },
    h1: { es: 'Hormigón fratasado en Valencia, Castellón y Alicante' },
    intro: { es: 'Acabado fino y mate. Sobrio, moderno y económico.' },
    heroLabelLines: [{ es: 'FRATASADO' }, { es: 'HA-25 · EHE-08' }],
    heroImage: {
      src: '/obras/_sin-atribuir/5da4504f-2c7e-4fee-897b-fe0ed0a4a3a1.jpeg',
      alt: { es: 'Porche cubierto con solera de hormigón fratasado claro, con sofás y el jardín al fondo.' },
      kind: 'final',
    },
    cardImage: {
      src: '/obras/_sin-atribuir/4d88392b-d7b1-4d77-900b-82db9f0ecd29.jpeg',
      alt: { es: 'Contorno de piscina de hormigón fratasado en tono tostado ante una vivienda encalada.' },
      kind: 'final',
    },
    applications: {
      intro: {
        es: 'El fratasado se cierra a máquina sobre el hormigón todavía fresco: las palas de la alisadora compactan la masa y cierran el poro de la superficie. Queda lisa y mate, sin brillo, y aguanta la abrasión y el impacto.',
      },
      list: [
        {
          name: { es: 'Nave, taller y almacén' },
          text: { es: 'Donde el suelo trabaja todos los días: carretilla, tránsito y peso.' },
        },
        { name: { es: 'Parking y entrada de garaje' }, text: { es: '' } },
        {
          name: { es: 'Porche, patio y zonas de paso' },
          text: { es: 'Liso y mate, sin dibujo que compita con el resto.' },
        },
      ],
    },
    specs: [...SLAB_BASE_SPECS, ...SLAB_SCHEDULE_SPECS],
    whenNotTo: {
      title: { es: 'Cuándo NO elegir fratasado' },
      text: {
        es: 'El acabado se da a máquina sobre el hormigón fresco, así que pide solera nueva: no hay manera de fratasar un suelo que ya existe. Si lo que quieres es renovar sin picar, eso es microcemento. Y si esperabas textura —piedra, adoquín, madera—, el fratasado no la da: es liso y mate, y ahí está su gracia. La textura la pone el impreso.',
      },
      alternatives: [
        { href: '/microcemento/', text: { es: 'Ver microcemento' } },
        { href: '/hormigon-impreso/', text: { es: 'Ver hormigón impreso' } },
      ],
    },
    faqRefs: SLAB_FAQ_REFS,
  },

  {
    id: 'desactivado',
    path: { es: '/hormigon-desactivado/' },
    name: { es: 'Hormigón desactivado' },
    title: { es: 'Hormigón desactivado en Valencia' },
    description: {
      es: 'Piedra vista con la resistencia de una solera de hormigón, para caminos, patios y zonas de paso. Ficha técnica, obra ejecutada y presupuesto sin compromiso.',
    },
    h1: { es: 'Hormigón desactivado en Valencia, Castellón y Alicante' },
    intro: { es: 'Piedra vista con la resistencia de una solera.' },
    heroLabelLines: [{ es: 'DESACTIVADO' }, { es: 'PIEDRA VISTA · HA-25' }],
    heroImage: {
      src: '/obras/_sin-atribuir/791ae455-ca8a-4ae9-a9fb-5d01ca9b554b.jpeg',
      alt: {
        es: 'Rampa de hormigón desactivado con la piedra vista, entre muros de mampostería, ante la entrada de una vivienda.',
      },
      kind: 'final',
    },
    cardImage: {
      src: '/obras/_sin-atribuir/184fae6c-4c1c-464b-96dc-c44e906e2b64.jpeg',
      alt: { es: 'Primer plano del árido de un hormigón desactivado, con los cantos rodados al descubierto.' },
      kind: 'detalle',
    },
    applications: {
      intro: {
        es: 'Se pulveriza un desactivante que retrasa el fraguado de la capa más superficial y, unas horas después, un lavado a presión retira ese mortero y descubre el árido. La piedra que se ve es la del propio hormigón: no es un añadido ni un molde.',
      },
      list: [
        { name: { es: 'Caminos y accesos de parcela' }, text: { es: '' } },
        { name: { es: 'Aceras y zonas peatonales' }, text: { es: 'Superficie rugosa, con paso firme en mojado.' } },
        { name: { es: 'Contorno de piscina' }, text: { es: 'Se anda descalzo sin resbalar.' } },
        {
          name: { es: 'Patio y jardín' },
          text: { es: 'La textura de la grava con la resistencia de una solera.' },
        },
      ],
    },
    specs: [...SLAB_BASE_SPECS, ...SLAB_SCHEDULE_SPECS],
    whenNotTo: {
      title: { es: 'Cuándo NO elegir desactivado' },
      text: {
        es: 'Necesita solera nueva: el árido se descubre mientras el hormigón está fresco, así que no hay forma de hacerlo sobre un suelo que ya está puesto. Para renovar sin picar, eso es microcemento. Y en un interior de vivienda tampoco es lo suyo: el árido visto es una textura de exterior, y dentro el acabado continuo y liso es el pulido.',
      },
      alternatives: [
        { href: '/microcemento/', text: { es: 'Ver microcemento' } },
        { href: '/hormigon-pulido/', text: { es: 'Ver hormigón pulido' } },
      ],
    },
    faqRefs: SLAB_FAQ_REFS,
  },
] satisfies Service[]
