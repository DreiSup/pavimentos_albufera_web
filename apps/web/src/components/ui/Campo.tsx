import { cva } from 'class-variance-authority'
import { cloneElement, isValidElement, type ReactNode } from 'react'

/**
 * 01-sistema-de-diseno.md §3.7. La base es común y solo el borde y el color del
 * texto cambian sobre fondo oscuro, así que la variante emite una sola vez cada
 * propiedad: nada que fusionar ni que marcar como `!important`.
 */
const input = cva(
  'min-h-campo w-full px-[14px] bg-transparent font-sans text-16 aria-[invalid=true]:border-2 aria-[invalid=true]:border-error',
  {
    variants: {
      sobreOscuro: {
        false: 'border border-tinta-media text-tinta focus-visible:border-tinta',
        true: 'border border-sobre-tinta text-fondo focus-visible:border-fondo',
      },
    },
    defaultVariants: { sobreOscuro: false },
  },
)

export const claseInput = input()

export const claseInputOscuro = input({ sobreOscuro: true })

type Props = {
  etiqueta: string
  htmlFor: string
  obligatorio?: boolean
  ayuda?: string
  error?: string
  children: ReactNode
  className?: string
}

/** Lo único que este componente le añade al control que envuelve. */
type ConDescripcion = { 'aria-describedby'?: string }

/**
 * Cuelga del control los `id` de la ayuda y del error.
 *
 * Va aquí y no en cada llamada porque el defecto era de todos los campos a la
 * vez: el `<input>` salía con `aria-invalid="true"` y `aria-describedby` a
 * `null`, el `<p>` del error sin `id`, y `FormularioPresupuesto` mueve el foco
 * al campo rechazado por programa. El lector de pantalla anunciaba «Email,
 * inválido» y se callaba el motivo, que es justo lo que hay que corregir.
 *
 * **Fusiona, no pisa:** si el control ya traía su propio `aria-describedby`, el
 * suyo va primero. Y solo se listan los `id` que de verdad se pintan: un idref
 * que apunta a un elemento inexistente no se anuncia y no se ve desde fuera.
 */
function describir(children: ReactNode, ids: string): ReactNode {
  if (!ids || !isValidElement<ConDescripcion>(children)) return children
  const propio = children.props['aria-describedby']
  return cloneElement(children, { 'aria-describedby': propio ? `${propio} ${ids}` : ids })
}

export default function Campo({ etiqueta, htmlFor, obligatorio, ayuda, error, children, className = '' }: Props) {
  const idAyuda = `${htmlFor}-ayuda`
  const idError = `${htmlFor}-error`
  const descripcion = [ayuda ? idAyuda : '', error ? idError : ''].filter(Boolean).join(' ')

  return (
    <div className={`flex flex-col gap-[6px] ${className}`}>
      <label
        htmlFor={htmlFor}
        className="font-mono text-d-11 tracking-[0.06em] uppercase text-acero"
      >
        {etiqueta}
        {obligatorio ? ' *' : ''}
      </label>
      {describir(children, descripcion)}
      {ayuda ? (
        <p id={idAyuda} className="font-sans text-14 text-tinta-media">
          {ayuda}
        </p>
      ) : null}
      {error ? (
        // El `aria-live` se queda, a sabiendas de que en los dos campos que
        // reciben el foco por programa —teléfono y email— el motivo puede
        // leerse dos veces. El error de la foto no mueve el foco a ningún
        // sitio: sin región viva, quien no ve la pantalla se queda sin saber
        // que el archivo se ha descartado. Repetir es peor que callar solo
        // cuando callar no cuesta nada, y aquí cuesta un adjunto.
        <p id={idError} className="font-sans text-14 font-semibold text-error" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  )
}
