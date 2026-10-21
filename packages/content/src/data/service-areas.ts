import type { ServiceArea, UnconfirmedServiceAreaTowns } from '../schemas/service-area.ts'

/** `_note` (from `content/zonas.json`'s `_nota`): editorial metadata, preserved (D5) but never exposed by `queries/`. */
export type ServiceAreaRecord = ServiceArea & { _note?: string }

/**
 * The documented `/zonas/[municipio]/` pages, from `content/zonas.json`.
 *
 * `region`/`description`/`lead`/`body` (added 2026-10-21, owner's SEO order):
 * each area's own text, written from what its documented jobs show (photos,
 * model, colour, execution data) plus verifiable geography (the comarca).
 * No m², years, prices or claims about the town that can't be checked — see
 * `design/seo/receta-paginas-zona.md`. Two areas never share a paragraph:
 * the anti-doorway line is "a page that only differs by the town name".
 */
export const serviceAreas: ServiceAreaRecord[] = [
  {
    slug: { es: 'moraira' },
    town: 'Moraira',
    province: 'Alicante',
    ring: 1,
    // Order matters: the first project's first photo is the page hero. The
    // sillería one is 2048 px wide; the ramp, 900.
    projects: ['moraira-impreso-silleria-grande-113', 'moraira-impreso-adoquin-arena'],
    services: ['impreso'],
    region: 'Marina Alta',
    description: {
      es: 'Hormigón impreso en Moraira (Teulada): un contorno de piscina en sillería grande C-113 y una rampa de acceso en adoquín pequeño color arena. Fotos reales.',
    },
    lead: {
      es: 'Dos obras de hormigón impreso en Moraira, con dos moldes y dos colores distintos: el contorno de una piscina y una rampa de acceso.',
    },
    body: [
      {
        es: 'Moraira pertenece al término municipal de Teulada, en la Marina Alta. Aquí hemos hecho dos trabajos de impreso que se parecen poco entre sí, y por eso sirven para comparar.',
      },
      {
        es: 'El primero es el contorno de una piscina en sillería grande, color C-113, un tono ocre: el pavimento rodea el vaso y deja abierto un alcorque para un olivo, con el pinar alrededor.',
      },
      {
        es: 'El segundo es una rampa de acceso en adoquín pequeño, color arena, terminada en 2025: una franja estrecha que sube encajada entre un muro encalado y otro de mampostería.',
      },
      {
        es: 'Es la misma técnica —una solera de hormigón coloreada e impresa con molde— con dos resultados distintos. Lo que cambia es el molde y el color, y los dos tienen su muestra en el muestrario.',
      },
    ],
    _note: 'Página de zona normativa. Perfil de cliente extranjero y segunda residencia, distinto al del área metropolitana de Valencia.',
  },
  {
    slug: { es: 'denia' },
    town: 'Denia',
    province: 'Alicante',
    ring: 1,
    projects: ['denia-impreso-piedra-inglesa'],
    services: ['impreso'],
    region: 'Marina Alta',
    description: {
      es: 'Hormigón impreso en Denia: piedra inglesa en gris mate y en crema en la misma vivienda, con la ficha de ejecución completa (HM-20, 10 cm, mallazo y fibra).',
    },
    lead: {
      es: 'Una vivienda en Denia con piedra inglesa en dos acabados, gris mate y crema, y la ficha de ejecución completa de la obra.',
    },
    body: [
      {
        es: 'La obra de Denia, en la Marina Alta, es una explanada de hormigón impreso en piedra inglesa delante de una vivienda blanca, entre palmeras y un murete encalado. En la misma casa conviven dos acabados del mismo molde: piedra inglesa en gris mate y piedra inglesa en crema.',
      },
      {
        es: 'Es también la obra de la que publicamos la ficha de ejecución entera: hormigón HM-20, 10 cm de espesor, árido de 12 mm, mallazo de 20×30 de 4 mm, fibra de polipropileno y 4 kg/m² de color. Son los datos que conviene ver escritos en cualquier presupuesto de impreso.',
      },
    ],
  },
  {
    slug: { es: 'ribarroja' },
    town: 'Ribarroja',
    province: 'Valencia',
    ring: 1,
    projects: ['ribarroja-pulido'],
    services: ['pulido'],
    region: 'Camp de Túria',
    description: {
      es: 'Hormigón pulido en Riba-roja de Túria: solera pulida en gris en la planta cubierta de un aparcamiento, entre pilares. Fotos de la obra y presupuesto.',
    },
    lead: {
      es: 'Hormigón pulido gris en la planta cubierta de un aparcamiento en Riba-roja de Túria.',
    },
    body: [
      {
        es: 'La obra de Riba-roja de Túria, en el Camp de Túria, es una planta de aparcamiento cubierta: la solera de hormigón pulido en gris corre continua entre los pilares, sin juntas de baldosa.',
      },
      {
        es: 'Es el terreno del pulido fuera de casa —naves, parkings y locales—, donde se pide un suelo que resista el tránsito pesado. En exterior con paso descalzo, en cambio, una superficie pulida resbala: ahí van el impreso con acabado antideslizante o el lavado.',
      },
    ],
  },
  {
    slug: { es: 'xabia' },
    town: 'Xàbia',
    province: 'Alicante',
    ring: 1,
    projects: ['xabia-pulido'],
    services: ['pulido'],
    region: 'Marina Alta',
    description: {
      es: 'Obra de hormigón pulido en Xàbia, en la Marina Alta. Todavía sin fotografía publicable de la obra terminada.',
    },
    lead: {
      es: 'Obra de hormigón pulido en Xàbia de la que todavía no tenemos fotografía publicable.',
    },
    body: [],
  },
  {
    slug: { es: 'godella' },
    town: 'Godella',
    province: 'Valencia',
    ring: 1,
    projects: ['godella-lavado-arido-visto'],
    services: ['lavado'],
    region: 'Horta Nord',
    description: {
      es: 'Hormigón lavado con árido visto en Godella: el entorno de una fuente y un paseo entre césped, con superficie antideslizante de clase 3. Fotos de la obra.',
    },
    lead: {
      es: 'Hormigón lavado con árido visto en dos espacios peatonales de Godella: el entorno de una fuente y un paseo entre césped.',
    },
    body: [
      {
        es: 'En Godella, en l’Horta Nord, el trabajo es de hormigón lavado: se retira la lechada superficial para dejar el árido a la vista. En esta obra rodea una fuente circular, junto a un zócalo de azulejo, y forma un paseo entre dos franjas de césped.',
      },
      {
        es: 'La superficie rugosa que deja el lavado es de clase 3 de resistencia al deslizamiento, la que piden las zonas donde se anda descalzo o mojado: junto al agua de una fuente, como aquí, o alrededor de una piscina.',
      },
    ],
  },
  {
    slug: { es: 'moncada' },
    town: 'Moncada',
    province: 'Valencia',
    ring: 1,
    projects: ['moncada-impreso-espiga-117'],
    services: ['impreso'],
    region: 'Horta Nord',
    description: {
      es: 'Hormigón impreso en Moncada: despiece en espiga, color C-117, ejecutado en 2025 ante un bloque de viviendas y con alcorque para el arbolado. Fotos reales.',
    },
    lead: {
      es: 'Hormigón impreso en espiga, color C-117, ejecutado en 2025 en Moncada.',
    },
    body: [
      {
        es: 'En Moncada, en l’Horta Nord, el impreso va en espiga y en color C-117, un tono ocre claro. Las fotos enseñan el pavimento ante un bloque de viviendas, con un alcorque circular para el arbolado, y el mismo despiece siguiendo por calzada y acera.',
      },
      {
        es: 'Es la obra en espiga que tenemos documentada: la muestra del modelo en el muestrario, con su código C-117, es una foto de esta misma obra.',
      },
    ],
  },
  {
    slug: { es: 'alzira' },
    town: 'Alzira',
    province: 'Valencia',
    ring: 1,
    projects: ['alzira-impreso-adoquin-irregular-107'],
    services: ['impreso'],
    region: 'Ribera Alta',
    description: {
      es: 'Hormigón impreso en Alzira: adoquín irregular color C-107, de tono rojizo, en una explanada entre pinos y un camino junto a un muro de piedra. Fotos reales.',
    },
    lead: {
      es: 'Adoquín irregular en color C-107 entre pinos, en Alzira.',
    },
    body: [
      {
        es: 'Alzira es la capital de la Ribera Alta. La obra de aquí es de hormigón impreso en adoquín irregular, color C-107, de tono rojizo: una explanada abierta entre pinos y un camino que bordea un muro de piedra a la sombra de los árboles.',
      },
      {
        es: 'Pavimentar entre arbolado grande tiene una condición: la base. Si hay raíces cerca, primero se resuelve eso, porque el mejor pavimento se agrieta sobre una base que se mueve.',
      },
    ],
  },
  {
    slug: { es: 'corbera' },
    town: 'Corbera',
    province: 'Valencia',
    ring: 1,
    projects: ['corbera-fratasado-arena'],
    services: ['fratasado'],
    region: 'Ribera Baixa',
    description: {
      es: 'Hormigón fratasado color arena en Corbera: un patio alrededor de un olivo y un paso junto a la fachada de piedra de una masía. Fotos de la obra.',
    },
    lead: {
      es: 'Hormigón fratasado color arena en una masía de Corbera, en la Ribera Baixa.',
    },
    body: [
      {
        es: 'Corbera está en la Ribera Baixa, la misma comarca que nuestra sede en Sollana. La obra es de hormigón fratasado en color arena: un patio que rodea un olivo, con el paisaje abierto al fondo, y un paso junto a la fachada de piedra de una masía.',
      },
      {
        es: 'El fratasado se cierra a máquina sobre el hormigón fresco y queda liso y mate, sin dibujo. En esta obra eso deja el protagonismo a la piedra de la fachada y al olivo.',
      },
    ],
  },
]

/**
 * `content/zonas.json`'s trailing element — see `schemas/service-area.ts`'s
 * `UnconfirmedServiceAreaTowns` doc comment. Not a `ServiceArea`, never
 * merged into `serviceAreas` above, so no runtime filter is needed to keep
 * it out of `/zonas/` pages: it's simply a different export.
 */
export const unconfirmedServiceAreaTowns: UnconfirmedServiceAreaTowns = {
  comment:
    'Municipios con obra citada por el cliente pero SIN proyecto documentado todavía. No generar ruta hasta que tengan al menos un proyecto con foto: Google lo llama «doorway abuse» y es política de spam, no una penalización discrecional. https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse',
  towns: ['Torrent (Vedat)', 'Ollería', 'Carlet', 'Catadau', 'Turís', 'Alfafar', 'Benissa', 'Sollana'],
  headquartersTown: 'Sollana',
}
