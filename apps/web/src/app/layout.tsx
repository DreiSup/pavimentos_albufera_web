import type { Metadata } from 'next'
import { nap, sitio } from '@/lib/config'
import { JsonLd, schemaNegocioLocal } from '@/lib/schema'
import { COOKIE_CONSENTIMIENTO } from '@/lib/cookies'
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
  // El negocio capta por WhatsApp: cada enlace compartido tiene que salir con
  // tarjeta. A propósito no se fijan aquí `title`, `description` ni `images`:
  // Next hereda el título y la descripción de cada página (con su plantilla) y
  // la imagen la pone `app/opengraph-image.png`, que cascadea a todas las rutas.
  // Así las páginas individuales no necesitan tocar su `metadata`.
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: nap.nombre,
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#E9EAE6',
}

/**
 * gtag.js es UNA sola etiqueta para GA4 y para Google Ads: se carga una vez y se
 * configura una vez por cada identificador.
 *
 * El guard anterior solo miraba `sitio.gaId`. Con únicamente el `AW-` puesto
 * —el día que haya campaña y todavía no propiedad de GA4— no se cargaba nada:
 * ni conversiones, ni remarketing, ni Consent Mode, y sin un solo aviso. Ahora
 * basta con que exista cualquiera de los dos.
 *
 * Se recorta aquí porque `lib/config.ts` expone los identificadores tal cual
 * vienen del entorno: una variable declarada pero en blanco tiene que contar
 * como ausente, o el modo no-op se rompe con una cadena vacía.
 */
const idsEtiqueta = [sitio.gaId, sitio.adsId].filter(
  (id): id is string => typeof id === 'string' && id.trim() !== '',
)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${archivo.variable} ${instrumentSans.variable} ${martianMono.variable}`}>
      <body className="font-sans text-tinta bg-fondo min-h-dvh flex flex-col">
        {/*
          El aviso de cookies es lo primero que ocupa la parte baja de la ventana
          en una primera visita, y el hero de la portada es lo único del sitio que
          se mide contra el alto de la ventana. Este script marca el `<html>`
          ANTES DEL PRIMER PINTADO para que el hero nazca ya con su tamaño de
          primera visita. → `app/globals.css`, `--banda-consentimiento`

          🔴 Por qué en línea y no en el efecto de `Consentimiento.tsx`, que ya lee
          esta misma cookie: ese efecto corre al hidratar, y el hero encogiendo
          después del primer pintado es exactamente el redimensionado del elemento
          que decide el LCP que `.hero-pantalla` rechazó `dvh` para evitar.

          Medido, primera visita, con este script desactivado y dejando la marca
          solo en el efecto: **CLS 0,156 a 390×844** y 0,009 a 1366×768, de un
          único desplazamiento. Con el script: **0,000 en los seis tamaños**. Son
          ~150 bytes de HTML y cero bytes de JavaScript de cliente.

          ⚠️ Va SUELTO y no dentro del bloque de Consent Mode de más abajo, que
          solo se renderiza cuando hay IDs de etiqueta. El aviso sale siempre —lo
          pide el consentimiento, no la analítica—, así que su marca también.

          Con JavaScript desactivado no corre este script ni monta el aviso: no
          hay banda que reservar y el hero sale a su alto completo. Las dos cosas
          fallan juntas, que es la única forma de que no se contradigan.
        */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `if(!/(^|; )${COOKIE_CONSENTIMIENTO}=(aceptado|rechazado)/.test(document.cookie))document.documentElement.setAttribute('data-consentimiento','pendiente');`,
          }}
        />
        {/*
          Consent Mode v2: los cuatro permisos arrancan DENEGADOS —salvo para
          quien ya aceptó, que se detecta leyendo la cookie aquí mismo.

          ⚠️ Este script CARGA gtag.js él mismo, en la última línea y a propósito.
          La versión anterior dejaba el `<Script src>` a next/script y confiaba en
          el orden del documento — y al comprobarlo sobre el HTML generado, Next
          colocaba gtag.js en la posición 1451 y este bloque en la 2180. Un
          `consent default` que llega después de que gtag.js vacíe la cola de
          dataLayer no es un consent default. Inyectándolo aquí el orden deja de
          depender de dónde decida Next poner cada etiqueta.

          Por qué el default lee la cookie: para el visitante que YA aceptó, el
          `update` a 'granted' lo manda Consentimiento.tsx, y eso ocurre después
          de hidratar. Si la hidratación tarda más que `wait_for_update`, su
          primera vista se contabiliza sin consentimiento y hay que modelarla,
          teniendo el permiso guardado. Son ~60 bytes de HTML y cero JS de
          cliente: la cookie es de primera parte y el HTML es estático, así que
          se lee en el navegador, no en el servidor, y no rompe el prerenderizado.

          `wait_for_update` se queda en 500 también para el que ya aceptó: cuesta
          latencia, no datos, y evita depender de un valor que Google no documenta.

          El `update` sigue viniendo de Consentimiento.tsx en los dos casos.
        */}
        {idsEtiqueta.length > 0 ? (
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};
var paConsent=/(^|; )${COOKIE_CONSENTIMIENTO}=aceptado/.test(document.cookie)?'granted':'denied';
gtag('consent','default',{ad_storage:paConsent,ad_user_data:paConsent,ad_personalization:paConsent,analytics_storage:paConsent,wait_for_update:500});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
gtag('js',new Date());
${idsEtiqueta.map((id) => `gtag('config','${id}');`).join('\n')}
(function(){var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id=${idsEtiqueta[0]}';document.head.appendChild(s)})();`,
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
        {/* ⚠️ `@vercel/speed-insights/next` llama `useSearchParams()` por dentro
            y serializa un `<template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING">`
            en LAS 49 rutas, el aviso legal incluido. **No se arregla envolviéndolo
            en un `<Suspense>` propio**: probado el 2026-08-31, el recuento sigue
            en 49 y lo único que cambia es que aparece un límite resuelto de más
            alrededor del que ya falla —la librería ya trae el suyo—. Ese suelo de
            1 es de la dependencia, no del sitio, y no lo quita nada de este repo.
            El bailout que sí importaba, el que vaciaba las rejillas de
            `/proyectos/` y `/acabados/`, lo cerró la tarea 1.27. */}
        <SpeedInsights />
      </body>
    </html>
  )
}
