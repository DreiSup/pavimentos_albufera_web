import type { Metadata } from 'next'
import { sitio } from '@/lib/config'
import { JsonLd, schemaNegocioLocal } from '@/lib/schema'
import Cabecera from '@/components/layout/Cabecera'
import Pie from '@/components/layout/Pie'
import BarraMovil from '@/components/layout/BarraMovil'
import Consentimiento from '@/components/layout/Consentimiento'
import EventosGlobales from '@/components/layout/EventosGlobales'
import Atribucion from '@/components/layout/Atribucion'
import ProfundidadScroll from '@/components/layout/ProfundidadScroll'
import { SpeedInsights } from '@vercel/speed-insights/next'
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
        {/*
          Consent Mode v2: los cuatro permisos arrancan DENEGADOS.

          ⚠️ Este script CARGA gtag.js él mismo, en la última línea y a propósito.
          La versión anterior dejaba el `<Script src>` a next/script y confiaba en
          el orden del documento — y al comprobarlo sobre el HTML generado, Next
          colocaba gtag.js en la posición 1451 y este bloque en la 2180. Un
          `consent default` que llega después de que gtag.js vacíe la cola de
          dataLayer no es un consent default. Inyectándolo aquí el orden deja de
          depender de dónde decida Next poner cada etiqueta.

          El `update` a 'granted' lo manda Consentimiento.tsx cuando el usuario acepta.
        */}
        {sitio.gaId ? (
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
gtag('js',new Date());
gtag('config','${sitio.gaId}');
(function(){var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id=${sitio.gaId}';document.head.appendChild(s)})();`,
            }}
          />
        ) : null}
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
        <Atribucion />
        <ProfundidadScroll />
        <SpeedInsights />
      </body>
    </html>
  )
}
