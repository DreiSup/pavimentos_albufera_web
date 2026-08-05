import type { Metadata } from 'next'
import PlantillaLegal from '@/components/secciones/PlantillaLegal'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  alternates: { canonical: '/politica-de-privacidad/' },
}

export default function PoliticaPrivacidad() {
  return (
    <PlantillaLegal
      titulo="Política de privacidad"
      ultimaActualizacion="pendiente"
      secciones={[
        'Responsable del tratamiento',
        'Finalidad del tratamiento',
        'Legitimación',
        'Destinatarios',
        'Derechos de las personas interesadas',
        'Conservación de los datos',
      ]}
    />
  )
}
