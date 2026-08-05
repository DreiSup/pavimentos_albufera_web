import type { Metadata } from 'next'
import PlantillaLegal from '@/components/secciones/PlantillaLegal'

export const metadata: Metadata = {
  title: 'Política de cookies',
  alternates: { canonical: '/politica-de-cookies/' },
}

export default function PoliticaCookies() {
  return (
    <PlantillaLegal
      titulo="Política de cookies"
      ultimaActualizacion="pendiente"
      secciones={['Qué son las cookies', 'Cookies que utilizamos', 'Cómo desactivarlas']}
    />
  )
}
