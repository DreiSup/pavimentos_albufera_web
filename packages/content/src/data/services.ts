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
  // The EHE-08 was repealed by the Código Estructural (Real Decreto 470/2021,
  // in force since 10-11-2021). HA-25 keeps the same designation under it.
  { label: { es: 'HORMIGÓN' }, value: { es: 'HA-25 según Código Estructural' } },
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
    title: { es: 'Hormigón impreso en Valencia: modelos y colores' },
    description: {
      es: 'Hormigón impreso para patios, entradas de garaje y piscinas: modelos de piedra, adoquín y espiga, colores y obras reales. Visita y presupuesto sin compromiso.',
    },
    h1: { es: 'Hormigón impreso en Valencia, Castellón y Alicante' },
    intro: {
      es: 'Textura de piedra natural, adoquín o madera sobre una solera continua. Sin juntas donde crezca la hierba, sin baldosas que se levanten y con un mantenimiento que se reduce a barrer.',
    },
    heroLabelLines: [{ es: 'IMPRESO' }, { es: 'ESPESOR 10 CM · HA-25' }],
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
    guide: {
      kicker: { es: 'Cómo se hace' },
      title: { es: 'Cómo se hace el hormigón impreso' },
      intro: {
        es: 'Es una solera de hormigón a la que, todavía fresca, se le da color y se le imprime un molde: piedra, adoquín o ladrillo en espiga. Queda un pavimento continuo con el aspecto de una pieza, sin las juntas de una baldosa donde crece la hierba.',
      },
      blocks: [
        {
          title: { es: 'El proceso, paso a paso' },
          paragraphs: [
            {
              es: 'Se prepara y compacta la base, se coloca el mallazo y se vierte el hormigón con fibra, con el espesor que pide el uso: 10 cm para paso de personas y de 12 a 15 cm donde entran coches. Con el hormigón fresco se aplica el color y el desmoldeante, y se imprime el molde.',
            },
            {
              es: 'Después se cortan las juntas, se lava la superficie y se sella con resina acrílica, que es la que protege el color del sol y de las manchas. Las grietas aparecen cuando falta alguna de esas piezas: mallazo, espesor o juntas.',
            },
          ],
        },
        {
          title: { es: 'Modelos y colores' },
          paragraphs: [
            {
              es: 'El dibujo lo pone el molde y el color, la carta de pigmentos. Cada modelo está fotografiado sobre obra real en el [muestrario de acabados](/acabados/): [espiga](/acabados/espiga/), [adoquín irregular](/acabados/adoquin-irregular/), [adoquín pequeño](/acabados/adoquin-pequeno/), [piedra inglesa](/acabados/piedra-inglesa/), [sillería grande](/acabados/silleria-grande/) o [manta roca de montaña](/acabados/manta/).',
            },
            {
              es: 'El color arena es el del [adoquín pequeño de Moraira](/proyectos/moraira-impreso-adoquin-arena/); el 117, el de la [entrada en espiga de Moncada](/proyectos/moncada-impreso-espiga-117/).',
            },
          ],
        },
        {
          title: { es: 'Mantenimiento' },
          paragraphs: [
            {
              es: 'Se barre y se friega. Cada pocos años hay que volver a sellarlo —antes donde pasan coches o junto a una piscina— y nosotros volvemos a resellar cuando toca: es parte de los 10 años de garantía.',
            },
          ],
        },
      ],
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
    faqRefs: ['walkable', 'cracking', 'overExistingFloor', 'resealing', 'priceFactors'],
  },

  {
    id: 'pulido',
    path: { es: '/hormigon-pulido/' },
    name: { es: 'Hormigón pulido' },
    title: { es: 'Hormigón pulido en Valencia: interior y exterior' },
    description: {
      es: 'Hormigón pulido para naves, garajes, viviendas y terrazas. Dónde funciona en exterior y dónde resbala, ficha técnica y obra real. Presupuesto sin compromiso.',
    },
    h1: { es: 'Hormigón pulido en Valencia, Castellón y Alicante' },
    intro: { es: 'Superficie lisa y brillante. De la nave industrial al salón de casa, y también en terrazas y porches.' },
    heroLabelLines: [{ es: 'PULIDO' }, { es: 'HA-25 · CÓDIGO ESTRUCTURAL' }],
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
    guide: {
      kicker: { es: 'Qué es' },
      title: { es: 'Qué es el hormigón pulido' },
      intro: {
        es: 'Una solera de hormigón que, después del fratasado a máquina, se sigue puliendo hasta que la superficie queda lisa, cerrada y con brillo. Es un suelo continuo, sin las juntas de una baldosa, con la resistencia del hormigón que tiene debajo: el mismo sirve para una nave que para un salón.',
      },
      blocks: [
        {
          title: { es: 'En interior: naves, garajes y vivienda' },
          paragraphs: [
            {
              es: 'Es su terreno natural. En naves, talleres y parkings, por cómo aguanta el tránsito y lo fácil que es de limpiar, como en la [planta de aparcamiento de Ribarroja](/proyectos/ribarroja-pulido/). En vivienda, por el aspecto de suelo continuo de pared a pared.',
            },
            {
              es: 'Pide solera nueva. Para renovar un suelo sin levantarlo, la opción es el [microcemento](/microcemento/).',
            },
          ],
        },
        {
          title: { es: 'Hormigón pulido en exterior: dónde sí' },
          paragraphs: [
            {
              es: 'También lo hacemos fuera: terrazas, porches, patios y accesos de vivienda donde se anda con calzado. El hormigón aguanta la intemperie como cualquier solera; lo que hay que cuidar fuera es el agarre: {{cómo dejáis el pulido en exterior: grado de pulido o tratamiento antideslizante}}.',
            },
          ],
        },
        {
          title: { es: 'Y dónde no' },
          paragraphs: [
            {
              es: 'Donde se anda descalzo y mojado —el borde de una piscina, una ducha de jardín— una superficie pulida resbala, y ahí no lo recomendamos. Van mejor el [hormigón lavado](/hormigon-lavado/), el [desactivado](/hormigon-desactivado/) o el [impreso](/hormigon-impreso/) con acabado antideslizante. Tampoco en una rampa con pendiente que se moja: necesita un acabado con textura.',
            },
          ],
        },
        {
          title: { es: 'Pulido o fratasado' },
          paragraphs: [
            {
              es: 'Los dos parten de la misma solera fratasada a máquina. El [fratasado](/hormigon-fratasado/) se queda ahí, liso y mate; el pulido sigue hasta sacar brillo.',
            },
          ],
        },
      ],
    },
    applications: {
      intro: {
        es: 'Dentro es el acabado de gran superficie: continuo, sin juntas donde se acumule suciedad y con la resistencia de una solera de hormigón. Fuera, terrazas y porches donde se anda con calzado.',
      },
      list: [
        SPACE.interior,
        SPACE.warehouse,
        SPACE.garage,
        { name: { es: 'Terraza, porche y patio' }, text: { es: 'En exterior, donde se anda con calzado. Junto a la piscina, no.' } },
      ],
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
    faqRefs: ['polishedOutdoor', ...SLAB_FAQ_REFS, 'priceFactors'],
  },

  {
    id: 'microcemento',
    path: { es: '/microcemento/' },
    name: { es: 'Microcemento' },
    title: { es: 'Microcemento en Valencia | Sin obra ni escombros' },
    description: {
      es: 'Renueva suelos, baños y paredes sin picar lo que ya tienes: microcemento de 2 a 3 mm, continuo y sin juntas, aplicado sobre azulejo, terrazo o gres.',
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
    guide: {
      kicker: { es: 'Qué es' },
      title: { es: 'Qué es el microcemento' },
      intro: {
        es: 'Un revestimiento continuo de 2 a 3 milímetros que se aplica en capas finas sobre el suelo o la pared que ya tienes —azulejo, gres, terrazo o una solera— sin levantar nada. Por eso es la forma de renovar sin obra ni escombro.',
      },
      blocks: [
        {
          title: { es: 'Suelos, paredes y baños' },
          paragraphs: [
            {
              es: 'Se aplica igual en horizontal que en vertical, así que un baño puede quedar entero en el mismo material: suelo, paredes y encimera, sin juntas entre piezas, como en la [muestra en tono crema](/acabados/microcemento-crema/).',
            },
          ],
        },
        {
          title: { es: 'Microcemento o hormigón pulido' },
          paragraphs: [
            {
              es: 'A la vista se parecen, y no son lo mismo. El [hormigón pulido](/hormigon-pulido/) es una solera nueva, de centímetros, pulida en su sitio: pide obra. El microcemento es una capa de milímetros sobre lo que ya hay: no la pide, pero copia lo que haga el soporte, así que necesita un suelo firme y seco.',
            },
          ],
        },
      ],
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
      es: 'Hormigón lavado con árido visto, antideslizante de clase 3, para piscinas, patios y caminos. Cómo se hace, en qué se diferencia del desactivado y obra real.',
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
    guide: {
      kicker: { es: 'Qué es' },
      title: { es: 'Qué es el hormigón lavado' },
      intro: {
        es: 'Un pavimento de hormigón al que, con la masa todavía fresca, se le retira con agua el mortero de la superficie para dejar a la vista el árido —la grava— que lleva dentro. Queda una superficie rugosa y antideslizante, de clase 3, la que piden las zonas donde se anda mojado.',
      },
      blocks: [
        {
          title: { es: 'Cómo se hace: en fresco y sin retardante' },
          paragraphs: [
            {
              es: 'Se vierte la solera y, cuando el hormigón empieza a fraguar, se cepilla y se lava la capa de arriba con agua hasta descubrir la piedra. Se hace el mismo día y sin productos que retrasen el fraguado: el momento lo marca el propio hormigón, y acertar con él es el oficio.',
            },
          ],
        },
        {
          title: { es: 'Lavado o desactivado' },
          paragraphs: [
            {
              es: 'El [hormigón desactivado](/hormigon-desactivado/) llega a un aspecto parecido por otro camino: se pulveriza un retardante sobre la superficie y el lavado se hace después, a presión. Los dos dejan la piedra vista; en la visita vemos cuál encaja con tu superficie.',
            },
          ],
        },
        {
          title: { es: 'El color lo pone la piedra' },
          paragraphs: [
            {
              es: 'En el lavado no hay molde que dibuje nada: el aspecto lo da sobre todo el árido. En la foto de arriba hay dos paños contiguos, uno de árido oscuro y otro dorado; en el [paseo de Godella](/proyectos/godella-lavado-arido-visto/), un árido gris. Áridos con los que trabajamos: {{tamaños y colores disponibles}}.',
            },
          ],
        },
      ],
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
    faqRefs: ['washedVsExposed', ...SLAB_FAQ_REFS, 'priceFactors'],
  },

  {
    id: 'fratasado',
    path: { es: '/hormigon-fratasado/' },
    name: { es: 'Hormigón fratasado' },
    title: { es: 'Suelo de hormigón fratasado en Valencia' },
    description: {
      es: 'Suelo de hormigón fratasado fino y mate, interior y exterior: patios, porches, garajes y naves. Colores como el arena, obra real y visita sin coste.',
    },
    h1: { es: 'Hormigón fratasado en Valencia, Castellón y Alicante' },
    intro: { es: 'Acabado fino y mate sobre una solera de hormigón. Sobrio, moderno y económico, dentro y fuera de casa.' },
    heroLabelLines: [{ es: 'FRATASADO' }, { es: 'HA-25 · CÓDIGO ESTRUCTURAL' }],
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
    guide: {
      kicker: { es: 'Qué es' },
      title: { es: 'Qué es el hormigón fratasado' },
      intro: {
        es: 'Es el acabado que se da a una solera de hormigón mientras todavía está fresca: una fratasadora mecánica —el «helicóptero»— pasa sus palas sobre la superficie, la compacta y le cierra el poro. Queda un suelo continuo, plano y mate, liso al tacto, sin el brillo del pulido ni el dibujo del impreso.',
      },
      blocks: [
        {
          title: { es: 'Fratasado fino, el acabado decorativo de vivienda' },
          paragraphs: [
            {
              es: 'Cuantas más pasadas, más cerrada y fina queda la superficie. Ese fratasado fino es el que se deja visto en casas: porches, patios, terrazas y caminos donde se quiere un suelo de cemento limpio y sobrio, que no compita con la arquitectura ni con el jardín.',
            },
          ],
        },
        {
          title: { es: 'Suelo fratasado en exterior' },
          paragraphs: [
            {
              es: 'Aguanta la intemperie y, con el espesor y el armado adecuados, el paso de coches: por eso sirve igual para un patio que para una entrada de garaje o un aparcamiento.',
            },
            {
              es: 'Donde se anda mojado o hay pendiente —una rampa, el borde de una piscina— hay que pensar el agarre: un fratasado muy cerrado puede resbalar mojado, y ahí conviene un acabado con más textura, como el [hormigón lavado](/hormigon-lavado/) o el [desactivado](/hormigon-desactivado/).',
            },
          ],
        },
        {
          title: { es: 'Suelo fratasado en interior' },
          paragraphs: [
            {
              es: 'Dentro de casa da un suelo continuo y mate, con el aspecto del hormigón tal cual. Pide solera nueva, así que encaja en obra nueva o en una reforma que levanta el suelo. Si lo quieres con brillo, eso es el [hormigón pulido](/hormigon-pulido/); si quieres renovar sin levantar lo que tienes, el [microcemento](/microcemento/).',
            },
            {
              es: 'Como todo hormigón visto, conviene protegerlo para que no absorba manchas: {{tratamiento o sellado que aplicáis en interior}}.',
            },
          ],
        },
        {
          title: { es: 'Colores del suelo fratasado' },
          paragraphs: [
            {
              es: 'Puede quedarse en el gris natural del hormigón o ir en color. El arena es el de la [obra de Corbera](/proyectos/corbera-fratasado-arena/), un patio fratasado alrededor de un olivo, y lo tienes como [muestra de fratasado fino](/acabados/fratasado-arena/). Otros colores: {{carta de colores disponible para fratasado}}.',
            },
          ],
        },
        {
          title: { es: 'Fratasado, pulido o impreso' },
          paragraphs: [
            {
              es: 'Los tres parten de la misma solera de hormigón. El fratasado se queda en el acabado de máquina: liso y mate. El [pulido](/hormigon-pulido/) sigue puliendo hasta sacar brillo. El [impreso](/hormigon-impreso/), en vez de alisar, marca un molde de piedra, adoquín o madera.',
            },
          ],
        },
      ],
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
        {
          name: { es: 'Interior de vivienda' },
          text: { es: 'Suelo continuo y mate, en obra nueva o en una reforma con solera nueva.' },
        },
      ],
    },
    specs: [
      { label: { es: 'ACABADO' }, value: { es: 'Fratasado mecánico, fino y mate' } },
      ...SLAB_BASE_SPECS,
      ...SLAB_SCHEDULE_SPECS,
    ],
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
    faqRefs: ['troweledSlip', 'troweledInterior', 'troweledExisting', ...SLAB_FAQ_REFS, 'priceFactors'],
  },

  {
    id: 'desactivado',
    path: { es: '/hormigon-desactivado/' },
    name: { es: 'Hormigón desactivado' },
    title: { es: 'Hormigón desactivado en Valencia: piedra vista' },
    description: {
      es: 'Hormigón desactivado con piedra vista para caminos, patios y bordes de piscina. Qué es, cómo se hace con retardante y en qué se diferencia del lavado.',
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
    guide: {
      kicker: { es: 'Qué es' },
      title: { es: 'Qué es el hormigón desactivado' },
      intro: {
        es: 'Un pavimento de hormigón con la piedra a la vista, conseguido con un retardante de superficie. Se pulveriza un desactivante que retrasa el fraguado de la capa más superficial y, unas horas después, un lavado a presión retira ese mortero y descubre el árido.',
      },
      blocks: [
        {
          title: { es: 'Por qué con retardante' },
          paragraphs: [
            {
              es: 'El retardante separa el vertido del lavado. En vez de tener que descubrir la piedra en el momento justo del fraguado, el lavado se hace después, con el hormigón de debajo ya firme. Eso da margen para trabajar superficies grandes y deja una profundidad de árido pareja en todo el paño.',
            },
          ],
        },
        {
          title: { es: 'Desactivado o lavado' },
          paragraphs: [
            {
              es: 'Esa es la diferencia con el [hormigón lavado](/hormigon-lavado/), que se descubre en fresco, con agua y cepillo, sin retardante. El aspecto final se parece —piedra vista y superficie rugosa—; cambia cómo se llega a él.',
            },
          ],
        },
        {
          title: { es: 'Piedra vista: el árido manda' },
          paragraphs: [
            {
              es: 'La piedra que se ve es la del propio hormigón, no un añadido ni un molde: el aspecto se elige al elegir el árido de la mezcla. Áridos con los que trabajamos: {{tamaños y colores disponibles}}.',
            },
          ],
        },
      ],
    },
    applications: {
      intro: {
        es: 'Funciona donde se anda a pie, también descalzo y mojado: la superficie rugosa da paso firme, y debajo hay la resistencia de una solera de hormigón.',
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
    faqRefs: ['washedVsExposed', ...SLAB_FAQ_REFS, 'priceFactors'],
  },
] satisfies Service[]
