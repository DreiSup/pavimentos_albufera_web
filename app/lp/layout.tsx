import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/**
 * ⚠️ Este layout existe **solo para el `robots`**, y no puede existir para nada más.
 *
 * La versión anterior del plan lo quería como layout «sin cabecera ni pie». No
 * se puede: `Cabecera`, `Pie` y `BarraMovil` se renderizan en el layout raíz y
 * un layout anidado no suprime nada de su padre. Y tampoco hacía falta —la
 * landing **necesita** el `Pie`, que es donde están el aviso legal y la política
 * de privacidad, y **necesita** la `BarraMovil`, que es el CTA de llamada en
 * móvil. Una landing de pago sin pie sería la única página del sitio sin enlace
 * legal, y justo la que lleva píxel: las condiciones de Meta exigen ese aviso
 * en toda página con píxel, y la AEPD exige identificar al editor.
 *
 * El `robots` está aquí para que cualquier `/lp/` futura nazca fuera del índice
 * sin que nadie tenga que acordarse. `app/lp/[slug]/page.tsx` lo repite en su
 * `generateMetadata` a propósito: la herencia bastaría, pero de esto depende
 * que cuatro casi duplicados de las páginas de servicio no se indexen, y eso no
 * se deja escrito en un solo sitio que la página no menciona.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function LayoutLandings({ children }: { children: ReactNode }) {
  return <>{children}</>
}
