'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { sitio } from '@/lib/config'
import Boton from '../ui/Boton'

const CLAVE = 'pa-consentimiento'

type Decision = 'aceptado' | 'rechazado'
type Estado = Decision | 'pendiente'

function decisionGuardada(): Estado {
  try {
    const guardado = window.localStorage.getItem(CLAVE)
    return guardado === 'aceptado' || guardado === 'rechazado' ? guardado : 'pendiente'
  } catch {
    // Almacenamiento bloqueado (navegación privada): se vuelve a preguntar.
    return 'pendiente'
  }
}

export default function Consentimiento() {
  /**
   * `null` = todavía no se sabe qué decidió esta persona. Mientras no se sepa no se
   * pinta nada: ni en el servidor ni en el primer render del cliente. Así el servidor y
   * la hidratación coinciden —no hay desajuste— y el aviso deja de parpadear para quien
   * ya aceptó o rechazó. GA4 y Meta Pixel siguen sin cargarse salvo con 'aceptado'.
   */
  const [estado, setEstado] = useState<Estado | null>(null)

  useEffect(() => {
    setEstado(decisionGuardada())
  }, [])

  function decidir(valor: Decision) {
    try {
      window.localStorage.setItem(CLAVE, valor)
    } catch {
      // Sin almacenamiento la decisión vale para esta sesión y nada más.
    }
    setEstado(valor)
  }

  return (
    <>
      {estado === 'aceptado' && sitio.gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${sitio.gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${sitio.gaId}');`}
          </Script>
        </>
      ) : null}

      {estado === 'aceptado' && sitio.metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${sitio.metaPixelId}');
            fbq('track', 'PageView');`}
        </Script>
      ) : null}

      {estado === 'pendiente' ? (
        // En móvil se apoya justo encima de la barra fija (§4.3, 56 px): ni la tapa ni la
        // barra lo tapa. Desplazamiento con `bottom`, no con margen suelto.
        <div
          role="region"
          aria-label="Consentimiento de cookies"
          className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-50 bg-tinta text-fondo px-[18px] py-4 md:px-lat-desktop md:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
        >
          <p className="text-14 md:text-16 text-sobre-tinta m-0 max-w-[68ch]">
            Usamos analítica y publicidad para entender cómo se usa esta web y mostrarte anuncios
            relevantes. No se carga nada hasta que aceptas.
          </p>
          <div className="flex gap-3 shrink-0">
            <Boton variante="contorno" sobreOscuro type="button" onClick={() => decidir('rechazado')}>
              Rechazar
            </Boton>
            <Boton variante="primario" type="button" onClick={() => decidir('aceptado')}>
              Aceptar
            </Boton>
          </div>
        </div>
      ) : null}
    </>
  )
}
