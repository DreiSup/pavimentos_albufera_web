import type { Metadata } from 'next'
import PaginaServicio from '@/components/secciones/PaginaServicio'
import { SERVICIOS } from '@/content/servicios'

const servicio = SERVICIOS.impreso

export const metadata: Metadata = {
  title: servicio.title,
  description: servicio.description,
  alternates: { canonical: servicio.ruta },
}

export default function Pagina() {
  return <PaginaServicio servicio={servicio} />
}
