'use client'

import { useRef, useState } from 'react'

/**
 * Control de pausa del carrusel (01-sistema-de-diseno.md §3.15).
 *
 * **Por qué existe.** La WCAG 2.2.2, nivel A, exige poder parar todo contenido
 * que se mueva solo durante más de cinco segundos, y un pase de fotos de 24 s
 * en bucle infinito lo es. `prefers-reduced-motion` cubre a quien lo lleva
 * activado, que no es lo mismo que poder pararlo. Decisión del dueño,
 * contestada expresamente: el pase se queda automático y se añade este control
 * pequeño sobre la foto.
 *
 * **Por qué es el único `'use client'` del hero, y por qué no es un checkbox.**
 * `design/01` §3.15 apuntaba la salida sin JavaScript —un `<input
 * type="checkbox">` con `:checked ~` y `animation-play-state`—, y se ha
 * descartado: un interruptor no admite `aria-pressed`, que es el estado que
 * pide un control de dos posiciones sobre contenido que ya está corriendo. Un
 * botón que alterna es estado real, que es justo lo que CLAUDE.md admite como
 * motivo para cruzar la frontera. El resto del carrusel sigue siendo servidor.
 *
 * **Cómo para el pase.** El clic escribe `data-pausa` en el marco `.carrusel`
 * más cercano y el CSS hace el resto con `animation-play-state`. Se escribe el
 * atributo en vez de resolverlo con `:has()` a propósito: `:has()` no es
 * universal y un botón de pausa que en algún navegador no pare nada es peor
 * promesa que no tenerlo. El botón es el único que escribe ese atributo, así
 * que no hay dos fuentes de verdad que puedan desincronizarse.
 *
 * **El estado se entiende sin color.** Lo dice la forma —dos barras contra un
 * triángulo—, no el pigmento: el botón es siempre tinta sobre foto. Y lo dice
 * `aria-pressed` para quien no ve ninguna de las dos.
 *
 * Con `prefers-reduced-motion: reduce` el carrusel es una foto fija y el botón
 * se retira entero desde `globals.css` (`.carrusel__pausa`): no hay movimiento
 * que parar, y `display: none` lo saca también del orden de tabulación.
 */
export default function BotonPausaCarrusel() {
  const [pausado, setPausado] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={pausado}
      aria-label={pausado ? 'Reanudar el pase de fotos' : 'Pausar el pase de fotos'}
      onClick={() => {
        const siguiente = !pausado
        const marco = ref.current?.closest('.carrusel')
        if (marco instanceof HTMLElement) marco.dataset.pausa = String(siguiente)
        setPausado(siguiente)
      }}
      /* `sobre-oscuro bg-tinta text-fondo` es el mismo recuadro opaco de la
         etiqueta técnica (§3.8): 13,9 : 1 sobre su propio fondo, así que el
         contraste no depende de qué foto haya debajo ni de que el velo exista
         —en escritorio no existe—. 44 px de objetivo táctil por `min-*-tactil`
         y el foco de teclado lo pone la regla global de `globals.css`. */
      className="carrusel__pausa absolute bottom-0 left-0 inline-flex items-center justify-center min-w-tactil min-h-tactil sobre-oscuro bg-tinta text-fondo"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        {pausado ? (
          <path d="M4 2l10 6-10 6z" fill="currentColor" />
        ) : (
          <path d="M4 2h3v12H4zM9 2h3v12H9z" fill="currentColor" />
        )}
      </svg>
    </button>
  )
}
