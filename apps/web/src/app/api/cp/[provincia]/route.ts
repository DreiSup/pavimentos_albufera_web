import { getPostalCodeProvinces, getProvincePostalCodeNames } from '@site/content'

/**
 * Nombres de población de una provincia, para el aviso bajo el código postal
 * del formulario de presupuesto (`FormularioPresupuesto.tsx`).
 *
 * Estático: se genera en el build un JSON por provincia (`/api/cp/46/`…) y lo
 * sirve la CDN, sin función. El navegador pide solo la provincia que se está
 * tecleando —2 a 4 kB comprimidos— en lugar de las ~11.000 poblaciones, y el
 * código postal no sale nunca hacia un tercero.
 */
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return getPostalCodeProvinces().map((provincia) => ({ provincia }))
}

export async function GET(_peticion: Request, { params }: { params: Promise<{ provincia: string }> }) {
  const { provincia } = await params
  return Response.json(getProvincePostalCodeNames(provincia) ?? {})
}
