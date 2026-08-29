import type { Imagen, ModeloId } from '@/lib/tipos'

/**
 * Hero de cada `/acabados/[modelo]/`. La pantalla solo afirma el **modelo**
 * —su etiqueta técnica dice `IMPRESO · MODELO X`, sin color ni municipio—, así
 * que aquí basta con que la foto sea de ese molde. Es una condición más floja
 * que la de `Acabado.muestra`, que sí va junto al código de color impreso en
 * pantalla y por eso exige que coincidan modelo **y** color.
 *
 * El modelo de las cuatro fotos sin proyecto sale del `title` de la mediateca
 * de la web viva, no del dueño. Está anotado en `public/obras/INVENTARIO.md`.
 */
export const IMAGEN_MODELO: Partial<Record<ModeloId, Imagen>> = {
  espiga: {
    src: '/obras/moncada-impreso-espiga-117-2025-3.jpg',
    alt: 'Calzada y acera de hormigón impreso en espiga frente a un bloque de viviendas de ladrillo.',
    tipo: 'final',
  },
  'adoquin-irregular': {
    src: '/obras/alzira-impreso-adoquin-irregular-107-2.jpg',
    alt: 'Explanada de hormigón impreso en adoquín irregular de tono rojizo, entre pinos.',
    tipo: 'final',
  },
  'adoquin-pequeno': {
    src: '/obras/moraira-impreso-adoquin-pequeno-arena-2025.jpg',
    alt: 'Rampa de acceso de hormigón impreso en adoquín pequeño de tono arena, entre un muro encalado y otro de mampostería.',
    tipo: 'final',
  },
  manta: {
    src: '/obras/impreso-manta-gris-2.jpg',
    alt: 'Pavimento de hormigón impreso gris con despiece rectangular y cenefa de adoquín en el borde.',
    tipo: 'final',
  },
  'silleria-grande': {
    src: '/obras/_sin-atribuir/WhatsApp-Image-2021-07-23-at-10.36.09-3.jpeg',
    alt: 'Solárium de hormigón impreso en sillería grande alrededor de una piscina, con un olivo plantado en un alcorque.',
    tipo: 'final',
  },
  'piedra-silleria': {
    src: '/obras/_sin-atribuir/WhatsApp-Image-2021-07-23-at-10.33.34-1.jpeg',
    alt: 'Gran explanada de hormigón impreso en piedra sillería gris ante una vivienda con porche y pérgola.',
    tipo: 'final',
  },
  'piedra-rodena': {
    src: '/obras/_sin-atribuir/WhatsApp-Image-2021-07-23-at-10.32.11-2.jpeg',
    alt: 'Patio de hormigón impreso en piedra rodena de tono anaranjado alrededor de un olivo, con la obra aún en curso al fondo.',
    tipo: 'final',
  },
  'piedra-inglesa': {
    src: '/obras/denia-impreso-piedra-inglesa-gris.jpg',
    alt: 'Patio de hormigón impreso en piedra inglesa de tono gris ante una vivienda blanca con palmeras.',
    tipo: 'final',
  },
}
