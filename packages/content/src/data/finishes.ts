import type { Finish } from '../schemas/finish.ts'

/** `_note` (from `content/acabados.json`'s `_nota`): editorial metadata, preserved (D5) but never exposed by `queries/`. */
export type FinishRecord = Finish & { _note?: string }

/**
 * The 16-entry catalog, from `content/acabados.json`. A finish is PUBLISHED
 * (has a sample card painted) exactly when it has a `sample` photo — that
 * rule is package logic (`queries/finishes.ts`'s `getPublishedFinishes`),
 * never re-derived by app code, per `lib/datos.ts`'s own comment on why it
 * leaked into 9 routes once before.
 */
export const finishes: FinishRecord[] = [
  {
    slug: 'espiga-117',
    name: { es: 'Espiga' },
    model: 'espiga',
    color: '117',
    code: 'C-117',
    service: 'impreso',
    sample: {
      src: '/obras/moncada-impreso-espiga-117-2025-2.jpg',
      alt: { es: 'Pavimento de hormigón impreso con despiece en espiga, de tono ocre claro, en una plaza con arbolado.' },
      kind: 'final',
    },
    projects: ['moncada-impreso-espiga-117'],
  },
  {
    slug: 'espiga-113',
    name: { es: 'Espiga' },
    model: 'espiga',
    color: '113',
    code: 'C-113',
    service: 'impreso',
    projects: [],
  },
  {
    slug: 'adoquin-irregular-107',
    name: { es: 'Adoquín irregular' },
    model: 'adoquin-irregular',
    color: '107',
    code: 'C-107',
    service: 'impreso',
    sample: {
      src: '/obras/alzira-impreso-adoquin-irregular-107-2.jpg',
      alt: { es: 'Explanada de hormigón impreso en adoquín irregular de tono rojizo, entre pinos.' },
      kind: 'final',
    },
    projects: ['alzira-impreso-adoquin-irregular-107'],
  },
  {
    slug: 'adoquin-irregular-gris',
    name: { es: 'Adoquín irregular' },
    model: 'adoquin-irregular',
    color: 'gris',
    code: 'GRIS',
    service: 'impreso',
    projects: [],
  },
  {
    slug: 'adoquin-pequeno-arena',
    name: { es: 'Adoquín pequeño' },
    model: 'adoquin-pequeno',
    color: 'arena',
    code: 'ARENA',
    service: 'impreso',
    sample: {
      src: '/obras/moraira-impreso-adoquin-pequeno-arena-2025.jpg',
      alt: {
        es: 'Rampa de acceso de hormigón impreso en adoquín pequeño de tono arena, entre un muro encalado y otro de piedra.',
      },
      kind: 'final',
    },
    projects: ['moraira-impreso-adoquin-arena'],
  },
  {
    slug: 'adoquin-pequeno-109',
    name: { es: 'Adoquín pequeño' },
    model: 'adoquin-pequeno',
    color: '109',
    code: 'C-109',
    service: 'impreso',
    projects: [],
  },
  {
    slug: 'manta-gris',
    name: { es: 'Manta roca de montaña' },
    model: 'manta',
    color: 'gris',
    code: 'GRIS',
    service: 'impreso',
    sample: {
      src: '/obras/impreso-manta-gris-2.jpg',
      alt: { es: 'Pavimento de hormigón impreso gris con despiece rectangular y cenefa de adoquín en el borde.' },
      kind: 'final',
    },
    projects: ['impreso-manta-gris'],
    _note:
      'Vinculado a un proyecto real, pero su municipio está sin confirmar: NO cuenta como obra documentada. Ver 03-modelo-de-contenido §1.1. ⚠️ La muestra se ve con despiece rectangular, no con la textura de roca de montaña que anuncia el nombre del modelo: contrastar con el dueño.',
  },
  {
    slug: 'silleria-grande-113',
    name: { es: 'Sillería grande' },
    model: 'silleria-grande',
    color: '113',
    code: 'C-113',
    service: 'impreso',
    sample: {
      src: '/obras/_sin-atribuir/WhatsApp-Image-2021-07-23-at-10.35.36-1.jpeg',
      alt: { es: 'Solárium de hormigón impreso en sillería grande de tono ocre junto al vaso de una piscina.' },
      kind: 'final',
    },
    projects: [],
  },
  {
    slug: 'piedra-silleria-109',
    name: { es: 'Piedra sillería' },
    model: 'piedra-silleria',
    color: '109',
    code: 'C-109',
    service: 'impreso',
    projects: [],
  },
  {
    slug: 'piedra-rodena-117',
    name: { es: 'Piedra rodena' },
    model: 'piedra-rodena',
    color: '117',
    code: 'C-117',
    service: 'impreso',
    projects: [],
  },
  {
    slug: 'piedra-inglesa-gris',
    name: { es: 'Piedra inglesa' },
    model: 'piedra-inglesa',
    color: 'gris',
    code: 'GRIS MATE',
    service: 'impreso',
    sample: {
      src: '/obras/denia-impreso-piedra-inglesa-gris.jpg',
      alt: { es: 'Patio de hormigón impreso en piedra inglesa de tono gris ante una vivienda blanca con palmeras.' },
      kind: 'final',
    },
    projects: ['denia-impreso-piedra-inglesa'],
  },
  {
    slug: 'piedra-inglesa-crema',
    name: { es: 'Piedra inglesa' },
    model: 'piedra-inglesa',
    color: 'crema',
    code: 'CREMA',
    service: 'impreso',
    projects: ['denia-impreso-piedra-inglesa'],
  },
  {
    slug: 'fratasado-arena',
    name: { es: 'Fratasado fino' },
    color: 'arena',
    code: 'ARENA',
    service: 'fratasado',
    sample: {
      src: '/obras/corbera-fratasado-arena.jpg',
      alt: { es: 'Patio de hormigón fratasado de tono arena alrededor de un olivo, con el paisaje al fondo.' },
      kind: 'final',
    },
    projects: ['corbera-fratasado-arena'],
  },
  {
    slug: 'pulido-gris',
    name: { es: 'Pulido continuo' },
    color: 'gris',
    code: 'GRIS',
    service: 'pulido',
    sample: {
      src: '/obras/ribarroja-pulido-gris.jpg',
      alt: { es: 'Planta de aparcamiento cubierta con solera de hormigón pulido gris entre pilares.' },
      kind: 'final',
    },
    projects: ['ribarroja-pulido'],
  },
  {
    slug: 'microcemento-crema',
    name: { es: 'Microcemento' },
    color: 'crema',
    code: 'CREMA',
    service: 'microcemento',
    sample: {
      src: '/obras/_sin-atribuir/microcemento-3.jpg',
      alt: { es: 'Baño con encimera y frente de microcemento en tono crema, con dos lavabos sobre encimera.' },
      kind: 'final',
    },
    projects: [],
  },
  {
    slug: 'lavado-arido-visto',
    name: { es: 'Árido visto' },
    color: 'gris',
    code: 'GRIS',
    service: 'lavado',
    sample: {
      src: '/obras/godella-lavado-gris-2.jpg',
      alt: { es: 'Paseo de hormigón lavado con árido visto gris entre dos franjas de césped.' },
      kind: 'final',
    },
    projects: ['godella-lavado-arido-visto'],
  },
]
