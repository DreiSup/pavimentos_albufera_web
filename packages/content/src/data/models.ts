import type { Model } from '../schemas/model.ts'

/**
 * Per-model display name (`lib/tipos.ts`'s `NOMBRE_MODELO`) + hero photo for
 * `/acabados/[modelo]/` (`content/modelos.ts`'s `IMAGEN_MODELO`). The
 * model's own name can differ from a `Finish.name` that shares the same
 * model (e.g. `'manta'`'s display name spells out "imitación roca de
 * montaña"; the one finish using it is named "Manta roca de montaña") — two
 * real, independently-authored strings, not a duplicate to collapse.
 */
export const models: Model[] = [
  {
    id: 'espiga',
    name: { es: 'Espiga' },
    heroImage: {
      src: '/obras/moncada-impreso-espiga-117-2025-3.jpg',
      alt: { es: 'Calzada y acera de hormigón impreso en espiga frente a un bloque de viviendas de ladrillo.' },
      kind: 'final',
    },
  },
  {
    id: 'adoquin-irregular',
    name: { es: 'Adoquín irregular' },
    heroImage: {
      src: '/obras/alzira-impreso-adoquin-irregular-107-2.jpg',
      alt: { es: 'Explanada de hormigón impreso en adoquín irregular de tono rojizo, entre pinos.' },
      kind: 'final',
    },
  },
  {
    id: 'adoquin-pequeno',
    name: { es: 'Adoquín pequeño' },
    heroImage: {
      src: '/obras/moraira-impreso-adoquin-pequeno-arena-2025.jpg',
      alt: {
        es: 'Rampa de acceso de hormigón impreso en adoquín pequeño de tono arena, entre un muro encalado y otro de mampostería.',
      },
      kind: 'final',
    },
  },
  {
    id: 'manta',
    name: { es: 'Manta (imitación roca de montaña)' },
    heroImage: {
      src: '/obras/impreso-manta-gris-2.jpg',
      alt: { es: 'Pavimento de hormigón impreso gris con despiece rectangular y cenefa de adoquín en el borde.' },
      kind: 'final',
    },
  },
  {
    id: 'silleria-grande',
    name: { es: 'Sillería grande' },
    heroImage: {
      src: '/obras/_sin-atribuir/WhatsApp-Image-2021-07-23-at-10.36.09-3.jpeg',
      alt: {
        es: 'Solárium de hormigón impreso en sillería grande alrededor de una piscina, con un olivo plantado en un alcorque.',
      },
      kind: 'final',
    },
  },
  {
    id: 'piedra-silleria',
    name: { es: 'Piedra sillería' },
    heroImage: {
      src: '/obras/_sin-atribuir/WhatsApp-Image-2021-07-23-at-10.33.34-1.jpeg',
      alt: {
        es: 'Gran explanada de hormigón impreso en piedra sillería gris ante una vivienda con porche y pérgola.',
      },
      kind: 'final',
    },
  },
  {
    id: 'piedra-rodena',
    name: { es: 'Piedra rodena' },
    heroImage: {
      src: '/obras/_sin-atribuir/WhatsApp-Image-2021-07-23-at-10.32.11-2.jpeg',
      alt: {
        es: 'Patio de hormigón impreso en piedra rodena de tono anaranjado alrededor de un olivo, con la obra aún en curso al fondo.',
      },
      kind: 'final',
    },
  },
  {
    id: 'piedra-inglesa',
    name: { es: 'Piedra inglesa' },
    heroImage: {
      src: '/obras/denia-impreso-piedra-inglesa-gris.jpg',
      alt: { es: 'Patio de hormigón impreso en piedra inglesa de tono gris ante una vivienda blanca con palmeras.' },
      kind: 'final',
    },
  },
]
