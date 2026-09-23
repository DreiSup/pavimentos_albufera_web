import type { Project } from '../schemas/project.ts'

/**
 * `_pending`/`_note` (from `content/proyectos.json`'s `_pendiente`/`_nota`):
 * editorial metadata, preserved (D5) but never part of the public `Project`
 * shape `queries/` resolves — see `schemas/project.zod.ts`'s
 * `projectRecordSchema` for the validated shape.
 */
export type ProjectRecord = Project & { _pending?: string[]; _note?: string }

/**
 * The 9 documented jobs, from `content/proyectos.json`. `null` in the
 * source ("not yet confirmed") is normalized to an absent key here (D5 —
 * package-plan's `?:` convention), never to an invented value.
 * `xabia-pulido` genuinely has zero photos yet (`images: []`) — unlike
 * Pavivasa's `Project.images`, this is not `min(1)`.
 */
export const projects: ProjectRecord[] = [
  {
    slug: { es: 'moncada-impreso-espiga-117' },
    title: { es: 'Entrada y porche en Moncada' },
    town: 'Moncada',
    province: 'Valencia',
    service: 'impreso',
    model: 'espiga',
    color: '117',
    year: 2025,
    images: [
      {
        src: '/obras/moncada-impreso-espiga-117-2025.jpg',
        alt: {
          es: 'Plaza pavimentada en hormigón impreso con despiece en espiga, con un alcorque circular y arbolado alrededor.',
        },
        kind: 'final',
      },
      {
        src: '/obras/moncada-impreso-espiga-117-2025-2.jpg',
        alt: { es: 'Pavimento de hormigón impreso en espiga de tono ocre claro ante un bloque de viviendas.' },
        kind: 'final',
      },
      {
        src: '/obras/moncada-impreso-espiga-117-2025-3.jpg',
        alt: { es: 'Calzada y acera de hormigón impreso en espiga frente a un bloque de viviendas de ladrillo.' },
        kind: 'final',
      },
    ],
    featured: true,
    _pending: ['superficie 180 sin confirmar', 'plazoDias', 'encargo', 'ejecucion', 'fotos a 2400 px', 'foto ANTES'],
  },
  {
    slug: { es: 'alzira-impreso-adoquin-irregular-107' },
    title: { es: 'Adoquín irregular en Alzira' },
    town: 'Alzira',
    province: 'Valencia',
    service: 'impreso',
    model: 'adoquin-irregular',
    color: '107',
    images: [
      {
        src: '/obras/alzira-impreso-adoquin-irregular-107-2.jpg',
        alt: {
          es: 'Explanada de hormigón impreso en adoquín irregular de tono rojizo, entre pinos, con el terreno natural al fondo.',
        },
        kind: 'final',
      },
      {
        src: '/obras/alzira-impreso-adoquin-irregular-107.jpg',
        alt: {
          es: 'Camino de hormigón impreso en adoquín irregular rojizo bordeando un muro de piedra, a la sombra de los árboles.',
        },
        kind: 'final',
      },
    ],
    featured: true,
    _pending: ['superficie', 'anio', 'plazoDias', 'encargo', 'ejecucion', 'fotos a 2400 px'],
  },
  {
    slug: { es: 'moraira-impreso-adoquin-arena' },
    title: { es: 'Adoquín pequeño en Moraira' },
    town: 'Moraira',
    province: 'Alicante',
    service: 'impreso',
    model: 'adoquin-pequeno',
    color: 'arena',
    year: 2025,
    images: [
      {
        src: '/obras/moraira-impreso-adoquin-pequeno-arena-2025.jpg',
        alt: {
          es: 'Rampa de acceso de hormigón impreso en adoquín pequeño de tono arena, entre un muro encalado y otro de mampostería.',
        },
        kind: 'final',
      },
    ],
    featured: true,
    _pending: ['superficie', 'plazoDias', 'encargo', 'ejecucion', 'fotos a 2400 px'],
  },
  {
    slug: { es: 'corbera-fratasado-arena' },
    title: { es: 'Fratasado en Corbera' },
    town: 'Corbera',
    province: 'Valencia',
    service: 'fratasado',
    color: 'arena',
    images: [
      {
        src: '/obras/corbera-fratasado-arena.jpg',
        alt: { es: 'Patio de hormigón fratasado de tono arena alrededor de un olivo, con el paisaje al fondo.' },
        kind: 'final',
      },
      {
        src: '/obras/corbera-fratasado-arena-2.jpg',
        alt: { es: 'Paso de hormigón fratasado de tono arena junto a la fachada de piedra de una masía.' },
        kind: 'final',
      },
    ],
    featured: false,
    _pending: ['superficie', 'anio', 'encargo', 'ejecucion', 'fotos a 2400 px'],
  },
  {
    slug: { es: 'impreso-manta-gris' },
    title: { es: 'Manta imitación roca de montaña' },
    service: 'impreso',
    model: 'manta',
    color: 'gris',
    images: [
      {
        src: '/obras/impreso-manta-gris-2.jpg',
        alt: { es: 'Pavimento de hormigón impreso gris con despiece rectangular y cenefa de adoquín en el borde.' },
        kind: 'final',
      },
      {
        src: '/obras/impreso-manta-gris.jpg',
        alt: { es: 'Paso lateral de hormigón gris continuo entre la fachada de una vivienda y el muro de la parcela.' },
        kind: 'final',
      },
    ],
    featured: false,
    _pending: ['municipio', 'provincia', 'superficie', 'anio', 'encargo', 'ejecucion', 'fotos a 2400 px'],
    _note:
      '⚠️ Las dos fotos no muestran la textura de roca de montaña que anuncia el modelo: una tiene despiece rectangular y la otra es hormigón continuo sin estampar. Contrastar el modelo con el dueño antes de darlo por bueno.',
  },
  {
    slug: { es: 'denia-impreso-piedra-inglesa' },
    title: { es: 'Dos acabados de piedra inglesa en Denia' },
    town: 'Denia',
    province: 'Alicante',
    service: 'impreso',
    model: 'piedra-inglesa',
    color: 'gris',
    images: [
      {
        src: '/obras/denia-impreso-piedra-inglesa-gris.jpg',
        alt: { es: 'Patio de hormigón impreso en piedra inglesa de tono gris ante una vivienda blanca con palmeras.' },
        kind: 'final',
      },
    ],
    featured: true,
    executionSpecs: {
      concrete: { es: 'HM-20' },
      thickness: { es: '10 cm' },
      aggregate: { es: '12 mm' },
      mesh: { es: '20×30 de 4 mm' },
      fiber: { es: 'polipropileno' },
      color: { es: '4 kg/m²' },
      finishes: [{ es: 'piedra inglesa en gris mate' }, { es: 'piedra inglesa en crema' }],
    },
    _note: 'Única obra con ficha técnica real completa. Dos acabados en la misma vivienda: argumento de venta que la web actual no usa.',
    _pending: ['superficie', 'anio', 'encargo', 'ejecucion', 'fotos a 2400 px'],
  },
  {
    slug: { es: 'ribarroja-pulido' },
    title: { es: 'Hormigón pulido en Ribarroja' },
    town: 'Ribarroja',
    province: 'Valencia',
    service: 'pulido',
    color: 'gris',
    images: [
      {
        src: '/obras/ribarroja-pulido-gris.jpg',
        alt: { es: 'Planta de aparcamiento cubierta con solera de hormigón pulido gris entre pilares.' },
        kind: 'final',
      },
    ],
    featured: false,
    _pending: ['superficie', 'anio', 'encargo', 'ejecucion', 'fotos a 2400 px'],
  },
  {
    slug: { es: 'xabia-pulido' },
    title: { es: 'Hormigón pulido en Xàbia' },
    town: 'Xàbia',
    province: 'Alicante',
    service: 'pulido',
    images: [],
    featured: false,
    _pending: ['color', 'superficie', 'anio', 'encargo', 'ejecucion', 'fotos'],
  },
  {
    slug: { es: 'godella-lavado-arido-visto' },
    title: { es: 'Hormigón lavado en Godella' },
    town: 'Godella',
    province: 'Valencia',
    service: 'lavado',
    color: 'gris',
    images: [
      {
        src: '/obras/godella-lavado-gris.jpg',
        alt: { es: 'Fuente circular rodeada de hormigón lavado con árido visto, con un zócalo de azulejo al fondo.' },
        kind: 'final',
      },
      {
        src: '/obras/godella-lavado-gris-2.jpg',
        alt: { es: 'Paseo de hormigón lavado con árido visto entre dos franjas de césped.' },
        kind: 'final',
      },
    ],
    featured: false,
    _note: 'El lavado añade clase 3, Rd > 45 de resistencia al deslizamiento.',
    _pending: ['superficie', 'anio', 'encargo', 'ejecucion', 'fotos a 2400 px'],
  },
]
