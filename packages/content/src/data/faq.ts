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
