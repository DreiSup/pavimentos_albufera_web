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

  /*
   * Added 2026-10-30 with the two new services (`bombeo`, `autonivelante`).
   * New copy authorized by the project lead, pending the owner's review
   * (`docs/servicios-nuevos/copy-bombeo-y-autonivelante.md`). Only general
   * trade facts and this business's stated policy (no prices on the web,
   * closed quote): no reach, flow, minimum volume, product, thickness or
   * time of theirs — those stay `{{pending}}` in each page's guide/specs,
   * never here (an FAQ answer is plain text and travels in `FAQPage`).
   * Each question names its service, because `FAQPage` lifts it out of the
   * page. `topic` values are all from the existing GA4 vocabulary.
   */
  pumpWhen: {
    question: { es: '¿Cuándo hace falta bombear el hormigón?' },
    answer: {
      es: 'Cuando la cuba no puede acercarse a donde va el hormigón: un patio trasero, una parcela sin entrada para el camión, un sótano o una planta alta. Si el camión llega al sitio, descarga con su canaleta y la bomba sobra.',
    },
    topic: 'proceso',
  },
  pumpAggregate: {
    question: { es: '¿Qué ventaja tiene bombear con árido de 12 mm?' },
    answer: {
      es: 'Con una piedra más pequeña, el hormigón pasa por una manguera más estrecha. Pesa menos y se maneja a mano, así que entra por sitios donde una manguera gruesa no cabe. Va bien en soleras y capas de poco espesor. Si tu obra tiene proyecto y pide un árido mayor, cuéntanoslo antes de pedir el hormigón.',
    },
    topic: 'proceso',
  },
  pumpSetup: {
    question: { es: '¿Qué tiene que estar listo el día del bombeo?' },
    answer: {
      es: 'Un hueco para la bomba al que llegue la cuba, un paso libre para la manguera y la zona de vertido terminada: la base compactada, el encofrado y el armado, si lo lleva. El hormigón fresco no espera, así que todo eso tiene que estar hecho antes de que llegue el camión.',
    },
    topic: 'terreno',
  },
  pumpSmallVolume: {
    question: { es: '¿Compensa bombear poco hormigón?' },
    answer: {
      es: 'Depende del acceso. Si el camión llega, no: la bomba suma un coste que no hace falta. Si no llega, la otra opción es moverlo a carretilla, y con muy poco hormigón a veces sigue siendo lo razonable. Dinos cuánto es y por dónde hay que pasar, y te decimos qué sale mejor.',
    },
    topic: 'precio',
  },
  pumpPrice: {
    question: { es: '¿Cuánto cuesta bombear el hormigón?' },
    answer: {
      es: 'No publicamos precios. El del bombeo depende sobre todo de cuánto hormigón hay que mover, de la distancia y la altura que tiene que salvar la manguera y del tiempo que la bomba pasa en la obra. Con esos datos te damos un precio cerrado antes de empezar.',
    },
    topic: 'precio',
  },

  selfLevelWhat: {
    question: { es: '¿Para qué sirve el autonivelante?' },
    answer: {
      es: 'Para dejar un suelo interior plano y liso antes de poner el pavimento final. Corrige los desniveles y las irregularidades de la solera, que es justo lo que necesitan la tarima, el laminado, el vinílico o el microcemento para quedar bien.',
    },
    topic: 'proceso',
  },
  selfLevelSupport: {
    question: { es: '¿Sobre qué suelo se puede verter el autonivelante?' },
    answer: {
      es: 'Sobre una solera de hormigón, un recrecido o un suelo cerámico bien pegado, siempre que esté firme, limpio y seco. Antes va una imprimación que mejora la adherencia. Si el soporte se mueve, está suelto o tiene humedad, eso se arregla primero: el autonivelante no lo corrige.',
    },
    topic: 'terreno',
  },
  selfLevelFinish: {
    question: { es: '¿Se puede dejar el autonivelante visto, como suelo final?' },
    answer: {
      es: 'En una casa, no es lo suyo. El autonivelante de regularización está pensado para recibir otro pavimento encima, no para quedarse a la vista y pisarse a diario. Si quieres un suelo continuo de cemento visto, eso es microcemento sobre el suelo que tienes, o una solera de hormigón pulido o fratasado.',
    },
    topic: 'proceso',
  },
  selfLevelVsMicro: {
    question: { es: '¿Qué diferencia hay entre autonivelante y microcemento?' },
    answer: {
      es: 'Hacen trabajos distintos. El autonivelante es una base: endereza el suelo y queda tapado por otro. El microcemento es un acabado de 2 a 3 milímetros que se ve, y que sigue la forma de lo que tiene debajo. Por eso se combinan bien: primero se nivela y luego va el microcemento.',
    },
    topic: 'proceso',
  },
  selfLevelTimes: {
    question: { es: '¿Cuándo se puede pisar el autonivelante y poner el suelo encima?' },
    answer: {
      es: 'Depende del producto y del espesor, y son dos plazos distintos. El de pisar es corto. El de poner el pavimento final es más largo, porque la tarima o el vinílico piden que la base haya secado hasta una humedad concreta. Te damos los dos con el producto y el espesor de tu obra delante.',
    },
    topic: 'plazo',
  },
  selfLevelPrice: {
    question: { es: '¿Cuánto cuesta el autonivelante por metro cuadrado?' },
    answer: {
      es: 'No publicamos precios. Depende de la superficie, del espesor que hace falta para dejar el suelo a nivel —que es lo que decide cuánto material entra— y del estado del soporte: si antes hay que levantar el suelo viejo, limpiarlo o reparar grietas. Lo medimos y te damos un precio cerrado.',
    },
    topic: 'precio',
  },
}

/** Home page's FAQ accordion — `faqHome` in `apps/web/src/content/faq.ts`. */
export const homeFaqRefs = ['walkable', 'cracking', 'overExistingFloor', 'resealing', 'businessClients']

/** `/zonas/[municipio]/`'s FAQ accordion — `faqZona`. Service pages do NOT share one list: each composes its own (see `data/services.ts`). */
export const serviceAreaFaqRefs = ['walkable', 'resealing', 'businessClients']
