import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PaginaServicio from '@/components/secciones/PaginaServicio'
import { LANDINGS, slugsLanding } from '@/content/landings'

/**
 * `dynamicParams = false` hace que `/lp/loquesea/` sea un 404 **estático**. Sin
 * declararlo, un slug inventado —y en tráfico de pago los hay: enlaces mal
 * pegados, rastreadores, gente probando— invoca una función en Vercel para
 * acabar devolviendo lo mismo. Es la única ruta dinámica del repo que lo
 * declara porque es la única que va a recibir slugs de fuera.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return slugsLanding.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const landing = LANDINGS[slug]
  if (!landing) return {}
  return {
    title: landing.title,
    description: landing.description,
    /**
     * ⚠️ Obligatorio, y **con barra final**. El layout raíz declara
     * `alternates.canonical: '/'`, y la metadata se hereda campo a campo: sin
     * este, las cuatro landings se canonicalizarían a la home y desaparecerían.
     */
    alternates: { canonical: `/lp/${slug}/` },
    /**
     * Repetido a propósito: `app/lp/layout.tsx` ya lo declara para todo el
     * segmento y la herencia lo aplicaría igual. Pero de esto depende que
     * cuatro casi duplicados de las páginas de servicio no entren al índice, y
     * una garantía que solo se cumple por herencia es una garantía que nadie ve
     * al leer esta página. `follow: true`: no se indexa, pero sus enlaces
     * internos sí se siguen.
     */
    robots: { index: false, follow: true },
  }
}

export default async function Landing({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const landing = LANDINGS[slug]
  if (!landing) notFound()
  return <PaginaServicio servicio={landing} />
}
