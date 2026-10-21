import type { Question } from '../schemas/faq.ts'

/**
 * Single question pool, from `apps/web/src/content/faq.ts`'s `PREGUNTAS`.
 * Every surface (home, service pages, service-area pages) composes its own
 * subset by key — see `homeFaqRefs`/`serviceAreaFaqRefs` below and each
 * service's `faqRefs` in `data/services.ts`. `walkable`/`cracking` name
 * hormigón impreso inside their text on purpose (source comment): they must
 * never be composed into `/microcemento/`'s subset.
 *
 * The 5 `micro*` entries are copy authorized by the owner specifically for
 * microcemento material facts (thickness, joints, moisture, cleaning —
 * sourced from Topciment's own published technical copy), not this
 * business's own claims (no day counts, no products, no warranty terms).
 */
export const faq: Record<string, Question> = {
  walkable: {
    question: { es: '¿Cuánto tarda en poder pisarse?' },
    answer: {
      es: 'Entre 24 y 48 horas para pisar y una semana para muebles o coches. El curado completo del hormigón son 28 días, pero puedes hacer vida normal mucho antes.',
    },
    topic: 'plazo',
  },
  cracking: {
    question: { es: '¿Se agrieta el hormigón impreso?' },
    answer: {
      es: 'Bien ejecutado, no. Las grietas aparecen cuando falta mallazo, cuando la solera tiene menos de 10 cm o cuando no se han hecho las juntas de dilatación. Nosotros hacemos las tres cosas siempre.',
    },
    topic: 'garantia',
  },
  overExistingFloor: {
    question: { es: '¿Se puede poner encima del suelo que ya tengo?' },
    answer: {
      es: 'En hormigón impreso, no lo recomendamos: la adherencia y el espesor no quedan garantizados. En microcemento sí, y ahí está su gran ventaja: se aplica sobre azulejo, terrazo o gres sin picar nada.',
    },
    topic: 'terreno',
  },
  resealing: {
    question: { es: '¿Cada cuánto hay que resellar?' },
    answer: {
      es: 'Cada 2 o 3 años en entradas de coche y zonas de piscina. Cada 5 o 6 en terrazas y jardines de uso peatonal. Nosotros te avisamos.',
    },
    topic: 'mantenimiento',
  },
  businessClients: {
    question: { es: '¿Trabajáis para empresas y constructoras?' },
    answer: {
      es: 'Sí. Naves industriales, parkings, urbanizaciones y obra civil. Pídenos referencias del sector.',
    },
    topic: 'sector',
  },

  /*
   * Added with the SEO recipe of 2026-10-21 (`design/seo/receta-paginas-servicio.md`),
   * under the owner's order to improve the service pages. General technical
   * facts about each technique and this business's own stated policy (visit,
   * closed quote, no prices on the web) — no figures, no products, no claims
   * the owner hasn't made. Whatever only the owner knows stays pending in the
   * page's guide, never here: an FAQ answer is plain text and also travels in
   * the `FAQPage` JSON-LD.
   */
  priceFactors: {
    question: { es: '¿Cuánto cuesta el metro cuadrado?' },
    answer: {
      es: 'No publicamos un precio por metro cuadrado, porque el mismo acabado cambia mucho de una obra a otra: la superficie, el espesor y el armado que pide el uso, si hay que demoler o preparar el terreno y el acceso para el camión. Vamos a verlo sin coste y te damos un precio cerrado y desglosado: lo que pone es lo que se paga.',
    },
    topic: 'precio',
  },
  troweledSlip: {
    question: { es: '¿El hormigón fratasado resbala?' },
    answer: {
      es: 'Seco, no más que cualquier suelo liso. Mojado, un fratasado muy cerrado puede resbalar, sobre todo en rampa o donde se anda descalzo. Por eso en exterior el agarre se decide con el uso delante, y donde se anda descalzo y mojado, como el borde de una piscina, va mejor un acabado con más textura: el lavado o el desactivado.',
    },
    topic: 'proceso',
  },
  troweledInterior: {
    question: { es: '¿Se puede poner dentro de casa?' },
    answer: {
      es: 'Sí, como suelo continuo y mate, siempre que se haga una solera nueva: en obra nueva o en una reforma que levanta el suelo. Si lo quieres con brillo, eso es el hormigón pulido; si quieres renovar sin levantar lo que tienes, el microcemento.',
    },
    topic: 'proceso',
  },
  troweledExisting: {
    question: { es: '¿Se puede fratasar el suelo que ya tengo?' },
    answer: {
      es: 'No. El fratasado se da a máquina sobre el hormigón todavía fresco, así que necesita una solera nueva. Para renovar un suelo sin levantarlo, la opción es el microcemento.',
    },
    topic: 'terreno',
  },
  polishedOutdoor: {
    question: { es: '¿Se puede poner hormigón pulido en exterior?' },
    answer: {
      es: 'Sí. Lo hacemos en terrazas, porches, patios y accesos donde se anda con calzado. Donde se anda descalzo y mojado, como el borde de una piscina, no lo recomendamos: una superficie pulida resbala, y ahí van mejor el lavado, el desactivado o el impreso con acabado antideslizante.',
    },
    topic: 'proceso',
  },
  washedVsExposed: {
    question: { es: '¿Qué diferencia hay entre el hormigón lavado y el desactivado?' },
    answer: {
      es: 'El resultado se parece: los dos dejan a la vista la piedra del propio hormigón. Cambia cómo se consigue. En el lavado, el mortero de la superficie se retira con agua y cepillo con el hormigón todavía fresco, en el momento justo del fraguado y sin productos añadidos. En el desactivado se pulveriza antes un retardante que frena el fraguado solo de esa capa, y el lavado a presión se hace después, con más margen de tiempo.',
    },
    topic: 'proceso',
  },

  microSupport: {
    question: { es: '¿Sobre qué suelos se puede aplicar?' },
    answer: {
      es: 'Sobre azulejo, gres, terrazo, baldosa hidráulica o una solera de hormigón, sin levantar nada. Lo que decide no es el material de debajo, es que esté firme: con piezas sueltas o un mortero que se deshace, el microcemento no tiene a qué agarrarse.',
    },
    topic: 'terreno',
  },
  microThickness: {
    question: { es: '¿Cuánto sube el suelo?' },
    answer: {
      es: 'Entre 2 y 3 milímetros. Se extiende en capas de menos de un milímetro y el sistema entero no pasa de cuatro. Esa es su razón de ser: renovar sin obra y sin apenas ganar altura.',
    },
    topic: 'proceso',
  },
  microJoints: {
    question: { es: '¿Lleva juntas?' },
    answer: {
      es: 'No. Es un revestimiento continuo: no hay piezas, así que no hay juntas donde se acumule la suciedad ni corte entre una estancia y la siguiente.',
    },
    topic: 'juntas',
  },
  microMoisture: {
    question: { es: '¿Y si el suelo tiene humedad?' },
    answer: {
      es: 'Entonces todavía no se aplica: el soporte tiene que estar seco, por debajo del 5 %. Y con las fisuras pasa igual que con el agua, porque el microcemento no se agrieta solo, pero copia lo que haga el suelo que tiene debajo.',
    },
    topic: 'terreno',
  },
  microCleaning: {
    question: { es: '¿Cómo se limpia?' },
    answer: {
      es: 'Agua y jabón neutro, y solo agua las primeras semanas. Lo que no admite son los ácidos, el amoniaco, los estropajos metálicos ni las lijas: eso sí lo estropea, y es lo único que hay que tener en cuenta.',
    },
    topic: 'mantenimiento',
  },
}

/** Home page's FAQ accordion — `faqHome` in `apps/web/src/content/faq.ts`. */
export const homeFaqRefs = ['walkable', 'cracking', 'overExistingFloor', 'resealing', 'businessClients']

/** `/zonas/[municipio]/`'s FAQ accordion — `faqZona`. Service pages do NOT share one list: each composes its own (see `data/services.ts`). */
export const serviceAreaFaqRefs = ['walkable', 'resealing', 'businessClients']
