import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'
import type { Imagen } from '@/lib/tipos'
import { PROPORCIONES } from './BloquePosicion'
import BotonPausaCarrusel from './BotonPausaCarrusel'

export type Diapositiva = {
  imagen: Imagen
  /** La etiqueta técnica de ESA obra. Se funde con su foto, por encima del velo. */
  etiqueta?: ReactNode
}

/**
 * Calidad de las diapositivas que NO son la primera.
 *
 * 🔴 **Las cuatro fotos del hero se descargan siempre, y eso no lo arregla
 * `loading="lazy"`.** Las tres que esperan comparten hueco con la primera, así
 * que están dentro del viewport inicial y el navegador las pide igual: medido
 * en un móvil de 390 px a DPR 1, **238,1 kB de fotos antes del primer scroll**,
 * de los que 166,2 kB son de las tres no prioritarias. Nada de esto es JS, pero
 * la portada pesa lo que pesa.
 *
 * No hay forma en CSS de aplazar una imagen que sí está en el viewport, así que
 * lo que se baja no es el número de peticiones, es el tamaño de cada una: mismo
 * ancho servido, más compresión. Next resta 15 al valor antes de pasarlo a AVIF,
 * de modo que 75 es AVIF 60 y 60 es AVIF 45.
 *
 * **La primera se queda en el 75 por defecto y no se toca**: es la candidata a
 * LCP, la única precargada y la que el visitante mira de verdad. Degradarla para
 * ahorrar bytes sería cobrarle la factura justo a la foto que decide la métrica.
 *
 * ⚠️ Todo valor nuevo hay que declararlo en `images.qualities` de
 * `next.config.ts`: fuera de esa lista `/_next/image` responde 400 en
 * producción y el build no avisa.
 */
const CALIDAD_EN_ESPERA = 60

/**
 * Carrusel de fotografía de obra (01-sistema-de-diseno.md §3.15).
 *
 * **El pase es CSS puro, cero bytes de JavaScript**, y sigue siéndolo: vive
 * entero en la clase `.carrusel` de `app/globals.css`, con un `@keyframes` de
 * opacidad y un `animation-delay` escalonado por diapositiva. No hay estado, no
 * hay `IntersectionObserver` y no hay librería de animación —el proyecto no
 * admite ninguna—. Lo único que cruza la frontera de cliente es el botón de
 * pausa, que es un control, no el pase.
 *
 * Lo que decide la accesibilidad está en el CSS base, no en la animación:
 *
 *  - Cada diapositiva arranca `opacity: 0; visibility: hidden` y **la primera
 *    visible**. Sin animación —`prefers-reduced-motion: reduce`, o un navegador
 *    que no la soporte— lo que queda es una sola foto fija, no un montón
 *    superpuesto. Ese es el mismo mecanismo que cumple «con movimiento reducido
 *    no autopasa»: la regla entera está envuelta en `prefers-reduced-motion:
 *    no-preference`, y no se delega en el `!important` global, que solo recorta
 *    duración e iteraciones y dejaría los `animation-delay` vivos.
 *  - **`visibility` viaja con `opacity`, y no es decorado.** `opacity: 0` no
 *    retira nada del árbol de accesibilidad: sin esa declaración un lector de
 *    pantalla recorría los cuatro textos alternativos y las cuatro etiquetas
 *    técnicas seguidos, con o sin movimiento reducido.
 *  - **Solo la primera foto es prioritaria.** Es la candidata a LCP y la única
 *    que se precarga; las demás salen perezosas y con más compresión
 *    (`CALIDAD_EN_ESPERA`) para no disputarle ni la cola de descarga ni el ancho
 *    de banda.
 *
 * **Dos capas de pasadas, y el velo en medio.** El orden de pintado es fotos →
 * `children` → etiquetas → botón, y no es cosmético: el velo del titular llega
 * como `children`, y cuando la etiqueta técnica iba dentro de la misma pasada
 * que su foto el velo le caía ENCIMA y la dejaba en 2,64 : 1 —AA pide 4,5— en
 * móvil, mientras en escritorio, sin velo, estaba en 13,9. El velo tiene que
 * oscurecer la foto, no el texto que va sobre ella. Las dos capas llevan el
 * mismo `--carrusel-i`, así que cada etiqueta se funde con su foto aunque no
 * sea su hermana.
 *
 * ⚠️ **El `@keyframes` está calculado para CUATRO diapositivas** —cada una
 * visible una cuarta parte del ciclo— y el escalonado divide el ciclo entre 4.
 * Con otro número el reparto deja de cuadrar. Si algún día hacen falta cinco,
 * se escribe el `@keyframes` de cinco: no hay forma de expresar «1/n» en CSS
 * sin JavaScript, y fingir que la hay sería peor que la restricción.
 */
export default function CarruselFotos({
  diapositivas,
  proporcion,
  tamanos,
  className = '',
  children,
}: {
  diapositivas: Diapositiva[]
  proporcion: keyof typeof PROPORCIONES
  /** `sizes` de next/image. El mismo para todas: comparten hueco. */
  tamanos: string
  className?: string
  /** Se pinta por encima de las fotos y por DEBAJO de las etiquetas. */
  children?: ReactNode
}) {
  /* El índice viaja como propiedad personalizada y no como `:nth-child` a
     propósito: el velo, las etiquetas y el botón también son hijos de este
     marco, y un selector posicional los contaría. Por el mismo motivo la
     diapositiva activa por defecto se marca con su clase y no con
     `:first-child`: la primera etiqueta no es el primer hijo de nada. */
  const pasada = (i: number) =>
    `carrusel__paso absolute inset-0${i === 0 ? ' carrusel__paso--primera' : ''}`
  const indice = (i: number) => ({ '--carrusel-i': i }) as CSSProperties

  return (
    <div
      className={`carrusel relative overflow-hidden bg-fondo-alt ${PROPORCIONES[proporcion]} ${className}`}
    >
      {diapositivas.map((d, i) => (
        <div key={d.imagen.src} className={pasada(i)} style={indice(i)}>
          <Image
            src={d.imagen.src}
            alt={d.imagen.alt}
            fill
            sizes={tamanos}
            priority={i === 0}
            fetchPriority={i === 0 ? 'high' : undefined}
            quality={i === 0 ? undefined : CALIDAD_EN_ESPERA}
            className="object-cover"
          />
        </div>
      ))}

      {children}

      {diapositivas.map((d, i) =>
        d.etiqueta ? (
          /* `pointer-events-none` es carga estructural, no un detalle: esta capa
             cubre el marco entero y se pinta por encima de `children`, así que
             sin ella taparía al clic cualquier cosa que el hero ponga ahí. */
          <div
            key={`etiqueta-${d.imagen.src}`}
            className={`${pasada(i)} pointer-events-none`}
            style={indice(i)}
          >
            {/* La etiqueta sigue abajo a la derecha, pero ya no se pega al
                borde izquierdo: los 44 px de `pl-11` son la banda del botón de
                pausa. Sin ella, a 768 px —donde la columna del carrusel mide
                304 px y la etiqueta los llena enteros— el botón se le montaba
                encima; medido, y la única anchura del sitio en que pasaba.
                Reservar la banda es lo que ya proponía §3.15 para el titular a
                320 px: se le quita sitio a la etiqueta, que se reparte en una
                línea más, no se mueve el control a otra esquina según el ancho. */}
            <div className="absolute inset-x-0 bottom-0 flex justify-end pl-11">{d.etiqueta}</div>
          </div>
        ) : null,
      )}

      <BotonPausaCarrusel />
    </div>
  )
}
