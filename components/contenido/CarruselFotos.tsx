import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'
import type { Imagen } from '@/lib/tipos'
import { PROPORCIONES } from './BloquePosicion'

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
 * El `id` del interruptor de pausa, y la razón de que sea una constante.
 *
 * El `<label>` visible y el `<input>` que de verdad para el pase **no pueden ser
 * hermanos adyacentes**: el input tiene que ir el PRIMERO de todos los hijos del
 * marco, porque el selector que para la animación es
 * `.carrusel__interruptor:checked ~ .carrusel__paso`, y el combinador `~` solo
 * alcanza hacia delante. El control visible, en cambio, va el ÚLTIMO, para
 * pintarse por encima de las dos capas de pasadas sin inventar un `z-index`.
 * Separados así, la asociación solo puede ser por `for`/`id`, no envolviendo.
 *
 * Y un `id` es único por documento, de modo que **este componente es de uno por
 * página**. Hoy lo es: solo lo usa el hero de la home. Se deja como constante
 * documentada, igual que el `@keyframes` de cuatro diapositivas, en vez de
 * fingir una generalidad que nadie usa; si algún día hacen falta dos carruseles
 * en la misma página, el `id` pasa a ser una prop obligatoria y se dice aquí.
 */
const ID_INTERRUPTOR = 'pausa-carrusel'

/**
 * Carrusel de fotografía de obra (01-sistema-de-diseno.md §3.15).
 *
 * **El pase es CSS puro, cero bytes de JavaScript**, y desde el 2026-09-18 el
 * control de pausa también: el componente entero, marco, fotos, etiquetas y
 * control, es de servidor. Vive en las clases `.carrusel*` de `app/globals.css`,
 * con dos `@keyframes` de opacidad y un `animation-delay` escalonado por
 * diapositiva. No hay estado de React, no hay `IntersectionObserver` y no hay
 * librería de animación —el proyecto no admite ninguna—.
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
 *  - **El pase se puede parar desde el primer pintado.** WCAG 2.2.2, nivel A.
 *    Ver `ID_INTERRUPTOR` y §3.15: el control es un `<input type="checkbox"
 *    role="switch">` y un `<label>`, sin una línea de JavaScript, así que no hay
 *    ventana —ni con el JS desactivado— en la que algo se mueva solo y no se
 *    pueda parar.
 *
 * **Dos capas de pasadas, y el velo en medio.** El orden de pintado es fotos →
 * `children` → etiquetas → control, y no es cosmético: el velo del titular llega
 * como `children`, y cuando la etiqueta técnica iba dentro de la misma pasada
 * que su foto el velo le caía ENCIMA y la dejaba en 2,64 : 1 —AA pide 4,5— en
 * móvil, mientras en escritorio, sin velo, estaba en 13,9. El velo tiene que
 * oscurecer la foto, no el texto que va sobre ella. Las dos capas llevan el
 * mismo `--carrusel-i`, así que cada etiqueta se funde con su foto aunque no
 * sea su hermana.
 *
 * ⚠️ **Las dos capas NO comparten `@keyframes`.** El fundido cruzado es correcto
 * para las fotos y no lo es para el texto: durante los 0,72 s del cruce se
 * pintaban dos etiquetas monoespaciadas encima —medido, opacidades 0,83 y 0,17,
 * se leía «C-117SA · GRIS»—. La capa de etiquetas lleva `carrusel-etiqueta`, que
 * relevea en vez de cruzar: la que sale llega a 0 en el mismo instante en que la
 * que entra empieza a subir. → `globals.css` y §3.15
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
     propósito: el velo, las etiquetas y el control también son hijos de este
     marco, y un selector posicional los contaría. Por el mismo motivo la
     diapositiva activa por defecto se marca con su clase y no con
     `:first-child`: la primera etiqueta no es el primer hijo de nada. */
  const pasada = (i: number, modificador = '') =>
    `carrusel__paso${modificador} absolute inset-0${i === 0 ? ' carrusel__paso--primera' : ''}`
  const indice = (i: number) => ({ '--carrusel-i': i }) as CSSProperties

  return (
    <div
      className={`carrusel relative overflow-hidden bg-fondo-alt ${PROPORCIONES[proporcion]} ${className}`}
    >
      {/* EL PRIMER HIJO, Y NO ES UN DETALLE DE ORDEN: `~` solo mira hacia
          delante, así que el interruptor tiene que preceder a todo lo que para.
          Es el control real —el que recibe el foco y el que guarda el estado—;
          el `<label>` del final es su caja visible. Mide 1×1 y está recortado,
          no `display: none`: un control oculto de verdad no es tabulable, y el
          teclado tiene que llegar a este. */}
      <input
        id={ID_INTERRUPTOR}
        type="checkbox"
        role="switch"
        className="carrusel__interruptor"
        /* Nombre FIJO y en sustantivo, no en verbo. Un interruptor se anuncia
           siempre con su estado —«…, interruptor, desactivado»—, y un nombre que
           fuera una acción («Pausar el pase de fotos») sonaba a contradicción en
           una de las dos posiciones. El estado lo pone `checked` y lo lee el
           lector; el nombre solo dice de qué es el interruptor. */
        aria-label="Pausa del pase de fotos"
      />

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
            className={`${pasada(i, ' carrusel__paso--etiqueta')} pointer-events-none`}
            style={indice(i)}
          >
            {/* La etiqueta sigue abajo a la derecha, pero ya no se pega al
                borde izquierdo: los 44 px de `pl-11` son la banda del control de
                pausa. Sin ella, a 768 px —donde la columna del carrusel mide
                304 px y la etiqueta los llena enteros— el control se le montaba
                encima; medido, y la única anchura del sitio en que pasaba.
                Reservar la banda es lo que ya proponía §3.15 para el titular a
                320 px: se le quita sitio a la etiqueta, que se reparte en una
                línea más, no se mueve el control a otra esquina según el ancho. */}
            <div className="absolute inset-x-0 bottom-0 flex justify-end pl-11">{d.etiqueta}</div>
          </div>
        ) : null,
      )}

      {/* EL ÚLTIMO HIJO: así se pinta por encima de las dos capas de pasadas sin
          `z-index`. Es la caja visible del interruptor, no un control aparte —el
          clic y el toque los recoge el `for`—, y por eso no repite el nombre: el
          glifo va `aria-hidden` y quien lo anuncia es el `<input>`.
          `sobre-oscuro bg-tinta text-fondo` es el mismo recuadro opaco de la
          etiqueta técnica (§3.8): 13,9 : 1 sobre su propio fondo, así que el
          contraste no depende de qué foto haya debajo ni de que el velo exista
          —en escritorio no existe—. 44 px de objetivo táctil por `min-*-tactil`,
          y el anillo de foco lo pinta `globals.css` hacia DENTRO, porque el marco
          recorta y en esta esquina se comían dos de sus cuatro lados. */}
      <label
        htmlFor={ID_INTERRUPTOR}
        className="carrusel__pausa absolute bottom-0 left-0 inline-flex items-center justify-center min-w-tactil min-h-tactil sobre-oscuro bg-tinta text-fondo cursor-pointer"
      >
        {/* El estado se entiende sin color: lo dice la forma —dos barras contra
            un triángulo—, no el pigmento. Los dos glifos viajan en el HTML y es
            el CSS, no JavaScript, quien enseña uno u otro según `:checked`. */}
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path className="carrusel__glifo carrusel__glifo--pausar" d="M4 2h3v12H4zM9 2h3v12H9z" fill="currentColor" />
          <path className="carrusel__glifo carrusel__glifo--reanudar" d="M4 2l10 6-10 6z" fill="currentColor" />
        </svg>
      </label>
    </div>
  )
}
