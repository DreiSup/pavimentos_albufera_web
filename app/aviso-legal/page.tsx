import type { Metadata } from 'next'
import PlantillaLegal from '@/components/secciones/PlantillaLegal'

export const metadata: Metadata = {
  title: 'Aviso legal',
  alternates: { canonical: '/aviso-legal/' },
  robots: { index: true, follow: true },
}

export default function AvisoLegal() {
  return (
    <PlantillaLegal
      titulo="Aviso legal"
      ultimaActualizacion="pendiente"
      secciones={[
        'Datos identificativos',
        'Objeto',
        'Condiciones de uso',
        'Propiedad intelectual',
        'Legislación aplicable y jurisdicción',
      ]}
    />
  )
}
