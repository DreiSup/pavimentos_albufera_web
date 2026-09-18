/**
 * Los dos únicos iconos del sitio. → `design/01` §3.16
 *
 * **SVG en línea, dibujados aquí, sin librería.** CLAUDE.md prohíbe librerías de
 * iconos y `design/01` §2.1 dice que no hay ningún archivo `.svg` en el repo:
 * ninguna de las dos cosas cambia. Esto es JSX, viaja dentro del HTML que ya se
 * iba a servir y no añade ni una petición ni una dependencia.
 *
 * Los dos comparten caja (`viewBox` de 24), construcción (silueta maciza en
 * `currentColor`, sin trazo) y auricular: el de WhatsApp es el mismo auricular
 * del de teléfono, al 72 %, calado dentro de la burbuja con `fill-rule="evenodd"`.
 * Se ven juntos en la barra fija de móvil, así que tenían que parecer de la
 * misma familia, y lo son literalmente.
 *
 * `aria-hidden` en los dos, siempre: en todos los sitios donde se usan el botón
 * ya dice «Llamar» o «WhatsApp» en texto. El icono acompaña al rótulo, no lo
 * sustituye.
 */

type PropsIcono = {
  /**
   * Tamaño y color. **Por defecto 20 px, y son dos tamaños a propósito: 20 aquí,
   * 24 solo en la barra fija de móvil.** Se intentó dejar uno y los dos intentos
   * se cayeron con la cifra delante — el 2026-09-18, medido en el navegador:
   *
   * - **Subir a 24 en todas partes no lo paga el cierre de la portada.** Entre
   *   768 y 847 px esa fila mete los dos botones en una columna de 304–344 px, y
   *   con el icono a 24 `Llamar al 627 663 146` pasa de tres líneas a **cuatro**
   *   y la fila de 78,8 a **104,4 px**. Son 32 px (24 del dibujo más 8 de `gap`)
   *   en el sitio donde no sobra ninguno.
   * - **Bajar la barra fija a 20 tampoco se sostiene:** el argumento para
   *   agrandar era que a 20 px se cierra el calado del auricular, y **no se
   *   cierra**. Capturado a 1× y ampliado con vecino más próximo, la ranura que
   *   separa el auricular del borde de la burbuja mide **1 px a 20 y 2 px a 24**.
   *   Estrecha, pero continua.
   *
   * Así que el tamaño lo decide el ancho de la columna, no el gusto: 24 px donde
   * el rótulo es una palabra y el botón ocupa media pantalla —la barra fija—, y
   * 20 px dentro de `Boton`, que es el que sale en filas de dos con rótulos
   * largos. → `design/01` §3.16
   */
  className?: string
}

/**
 * `shrink-0` va siempre, y no es precaución de manual: el botón es un
 * `inline-flex` y el icono es un hijo flexible más. Medido en el cierre de la
 * portada a 768 px, donde la columna es estrecha, el `<svg>` se aplastaba a
 * **10,6 × 20** —la mitad de ancho, el alto intacto— y el auricular salía
 * deformado. Encoge el rótulo, que para eso puede partir línea, no el dibujo.
 */
const BASE = 'shrink-0 '

/** Auricular clásico. Reconocible a 24 px y a 20. */
export function IconoTelefono({ className = 'w-5 h-5' }: PropsIcono) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={BASE + className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 3H8.2L9.8 8 7 9.9C8.6 12.2 10.6 14.2 12.8 15.7L14.7 12.9 19.7 14.5V19.7C10.5 19.7 3 12.2 3 3Z" />
    </svg>
  )
}

/**
 * Burbuja de conversación con el auricular calado, que es la marca de WhatsApp.
 *
 * Va sobre `--verde-whatsapp` en `currentColor` = `--tinta`, así que sale en
 * negativo respecto al logotipo oficial (burbuja oscura, auricular verde). Es
 * lo que impone el contraste AA del rótulo: → `design/01` §2.1.
 */
export function IconoWhatsApp({ className = 'w-5 h-5' }: PropsIcono) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={BASE + className}
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.28 15.52 2.2 21.8 8.08 19.32A9.2 9.2 0 1 0 4.28 15.52ZM6.39 5.19H10.13L11.29 8.79 9.27 10.16C10.42 11.82 11.86 13.26 13.45 14.33L14.81 12.32 18.41 13.47V17.21C11.79 17.21 6.39 11.81 6.39 5.19Z" />
    </svg>
  )
}
