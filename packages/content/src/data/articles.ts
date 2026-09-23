import type { Article } from '../schemas/article.ts'

/**
 * The 3 blog entries, from `content/articulos.json`. All 3 are entirely
 * unwritten today (`entradilla`/`fecha`/`cuerpo` are `null` in the source —
 * only `imagenApertura` exists): `excerpt`/`date`/`body` are simply omitted
 * here, never synthesized as a `pending` placeholder (see `schemas/article.ts`).
 */
export const articles: Article[] = [
  {
    slug: { es: 'hormigon-desactivado-piedra-vista' },
    title: { es: 'Hormigón desactivado con piedra vista' },
    service: 'desactivado',
    openingImage: {
      src: '/obras/_sin-atribuir/791ae455-ca8a-4ae9-a9fb-5d01ca9b554b.jpeg',
      alt: {
        es: 'Rampa de hormigón desactivado con la piedra vista, entre muros de mampostería, ante la entrada de una vivienda.',
      },
      kind: 'final',
    },
  },
  {
    slug: { es: 'hormigon-fratasado-fino-en-viviendas' },
    title: { es: 'Hormigón fratasado fino, decorativo en viviendas' },
    service: 'fratasado',
    openingImage: {
      src: '/obras/_sin-atribuir/0e00e2de-b204-4771-8217-9c8964a42066.jpeg',
      alt: { es: 'Porche de vivienda con solera de hormigón fratasado fino en tono tostado, junto a la puerta de un garaje.' },
      kind: 'final',
    },
  },
  {
    slug: { es: 'guia-hormigon-pulido' },
    title: { es: 'Brillo y elegancia: explorando el hormigón pulido' },
    service: 'pulido',
    openingImage: {
      src: '/obras/_sin-atribuir/hormigon-pulido-10.jpg',
      alt: { es: 'Patio de hormigón pulido gris recién ejecutado ante una vivienda blanca, con el terreno aún sin ajardinar.' },
      kind: 'final',
    },
  },
]
