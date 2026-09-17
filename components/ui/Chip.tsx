import type { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLElement> & {
  activo?: boolean
  sobreOscuro?: boolean
}

/**
 * Chip de filtro y de dato. Sin `onClick` sale un `<span>`; con `onClick`, un `<button>`
 * con `aria-pressed`. El estado activo se pinta igual en los dos, así que un chip que solo
 * cuenta —«Todas (16)»— no se anuncia como botón ni ocupa un tabulador.
 *
 * Contrato que TypeScript no ve: `onClick` solo desde importadores cliente. El tipo lo
 * acepta desde cualquiera, así que el compilador no distingue quién lo pasa.
 */
export default function Chip({ activo, sobreOscuro, className = '', children, onClick, ...resto }: Props) {
  const inactivo = sobreOscuro
    ? 'bg-transparent text-fondo border border-sobre-tinta'
    : 'bg-transparent text-tinta border border-tinta-media'

  const clases = `inline-flex items-center min-h-tactil px-[14px] md:px-[18px] whitespace-nowrap font-mono text-d-11 md:text-d-12 ${
    activo ? 'bg-pigmento text-tinta border border-pigmento' : inactivo
  } ${className}`

  if (!onClick) {
    return (
      <span className={clases} {...resto}>
        {children}
      </span>
    )
  }

  return (
    <button
      type="button"
      aria-pressed={Boolean(activo)}
      className={clases}
      onClick={onClick}
      {...resto}
    >
      {children}
    </button>
  )
}
