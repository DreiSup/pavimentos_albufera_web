/**
 * El logotipo, en un único sitio.
 *
 * Hasta ahora el texto estaba copiado a mano en la cabecera, en el menú móvil y en el
 * pie, con tres juegos de clases ligeramente distintos. `04-desarrollo-y-deploy.md §2`
 * pide lo contrario: un componente por concepto de diseño, y las variantes por prop.
 * Este es además el único punto de cambio cuando entre el logotipo definitivo.
 *
 * El color NO se decide aquí: se hereda del contexto (`currentColor`). Así la misma
 * marca vale sobre `--fondo` en la cabecera y sobre `--tinta` en el pie y en el menú,
 * sin duplicar variantes de color ni añadir tokens.
 *
 * Variantes:
 *   apilado   dos líneas, PAVIMENTOS / ALBUFERA — cabecera en reposo y pie
 *   compacto  una línea en monoespaciada — cabecera tras hacer scroll (§B9)
 *   linea     una línea en display — cabecera del menú móvil
 */
export type VarianteLogo = 'apilado' | 'compacto' | 'linea'

const NOMBRE = 'Pavimentos Albufera'

export default function Logo({
  variante = 'apilado',
  className = '',
}: {
  variante?: VarianteLogo
  className?: string
}) {
  if (variante === 'compacto') {
    return (
      <span className={`font-mono text-d-12 uppercase tracking-[0.05em] ${className}`}>
        {NOMBRE}
      </span>
    )
  }

  if (variante === 'linea') {
    return (
      <span className={`font-display font-extrabold fs-logo text-16 tracking-[0.02em] ${className}`}>
        {NOMBRE.toUpperCase()}
      </span>
    )
  }

  return (
    <span
      className={`font-display font-extrabold fs-logo text-16 tracking-[0.02em] leading-[1.15] block ${className}`}
    >
      PAVIMENTOS
      <br />
      ALBUFERA
    </span>
  )
}
