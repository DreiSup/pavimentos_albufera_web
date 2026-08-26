import type { Metadata } from 'next'
import { sitio } from '@/lib/config'
import { JsonLd, schemaNegocioLocal } from '@/lib/schema'
import Cabecera from '@/components/layout/Cabecera'
import Pie from '@/components/layout/Pie'
import BarraMovil from '@/components/layout/BarraMovil'
import Consentimiento from '@/components/layout/Consentimiento'
import EventosGlobales from '@/components/layout/EventosGlobales'
import { archivo, instrumentSans, martianMono } from './fuentes'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(sitio.url),
  title: {
    default: 'Pavimentos de hormigón en Valencia | Pavimentos Albufera',
    template: '%s | Pavimentos Albufera',
  },
  description:
    'Hormigón impreso, pulido, lavado y microcemento en Valencia, Castellón y Alicante. 17 años de obra propia y 10 de garantía. Presupuesto sin compromiso.',
  alternates: { canonical: '/' },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#E9EAE6',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${archivo.variable} ${instrumentSans.variable} ${martianMono.variable}`}>
      <body className="font-sans text-tinta bg-fondo min-h-dvh flex flex-col">
        <JsonLd data={schemaNegocioLocal()} />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-fondo focus:px-4 focus:py-2 focus:border focus:border-tinta"
        >
          Saltar al contenido
        </a>
        <Cabecera />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Pie />
        <BarraMovil />
        <Consentimiento />
        <EventosGlobales />
      </body>
    </html>
  )
}
