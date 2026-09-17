'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { sitio } from '@/lib/config'
import {
  COOKIE_CONSENTIMIENTO,
  escribirCookie,
  leerCookie,
  type EstadoConsentimiento,
} from '@/lib/cookies'
import Boton from '../ui/Boton'

const DIAS = 180

/**
 * `lib/config.ts` expone `metaPixelId` tal cual viene del entorno, sin el
 * `.trim() || undefined` que sí llevan sus vecinos. Se normaliza aquí para que
 * una variable puesta pero en blanco cuente como ausente y no se renderice el
 * `<Script>` con un ID vacío.
 */
const PIXEL_ID = sitio.metaPixelId?.trim()

/**
 * Consent Mode v2 en modo avanzado.
 *
 * Los valores por defecto (`denied` en los cuatro) se declaran en `app/layout.tsx`
 * con un `<script>` en línea, para que se ejecuten durante el parseo del HTML y
 * **antes** de que `gtag.js` procese la cola de `dataLayer`. Aquí solo se carga
 * la etiqueta y se manda el `update` cuando el usuario decide.
 *
 * Consecuencia buscada: con el consentimiento denegado Google recibe pings sin
 * cookies y puede **modelar** las conversiones perdidas. Con el bloqueo duro
 * anterior no llegaba nada y no había nada que modelar — y Google exige estas
 * señales a los anunciantes del EEE que usen audiencias y remarketing.
 *
 * ⚠️ El Pixel de Meta sigue con bloqueo duro: Meta no tiene equivalente de
 * Consent Mode, así que o hay consentimiento o no se carga.
 */
export default function Consentimiento() {
  /**
   * `null` = todavía no se sabe qué decidió esta persona, y mientras no se sepa no se
   * pinta nada. Arrancar en `'pendiente'` pintaba el aviso en el primer render del
   * cliente y lo quitaba en cuanto el efecto leía la cookie: un parpadeo del bloque
   * negro en cada visita de quien ya había aceptado o rechazado. La cookie solo se
   * puede leer en el cliente, así que el estado real no existe hasta que monta.
   */
  const [estado, setEstado] = useState<EstadoConsentimiento | 'pendiente' | null>(null)

  useEffect(() => {
    const guardado = leerCookie(COOKIE_CONSENTIMIENTO)
    setEstado(guardado === 'aceptado' || guardado === 'rechazado' ? guardado : 'pendiente')
  }, [])

  useEffect(() => {
    if (estado === null || estado === 'pendiente') return
    const concedido = estado === 'aceptado' ? 'granted' : 'denied'
    window.gtag?.('consent', 'update', {
      ad_storage: concedido,
      ad_user_data: concedido,
      ad_personalization: concedido,
      analytics_storage: concedido,
    })
  }, [estado])

  function decidir(valor: EstadoConsentimiento) {
    escribirCookie(COOKIE_CONSENTIMIENTO, valor, DIAS)
    setEstado(valor)
  }

  return (
    <>
      {/*
        Snippet oficial de Meta con **una sola** modificación: la inserción del
        `<script src=…fbevents.js>` ya no ocurre en la misma tarea que el clic de
        «Aceptar», sino en `requestIdleCallback`. `fbevents.js` son 107.502 B gzip
        y ~190 ms de hilo principal bloqueado a 4×, y hasta ahora caían justo
        encima de la interacción que los provoca.

        No se descarga menos: se descarga **más tarde**. El coste se mueve fuera
        de la ventana de la interacción, que es donde se mide y donde se nota.

        Por qué el stub sí se instala de inmediato: `registrarEvento`
        (`lib/eventos.ts`) llama a `window.fbq?.(…)`, con encadenamiento opcional.
        Si `fbq` no existe todavía, el evento no se encola: se pierde en silencio.
        El stub —que es barato— se declara ya, y `init` y `PageView` se quedan en
        `fbq.queue` hasta que la librería real la vacíe. Por lo mismo la
        estrategia sigue siendo `afterInteractive` y no `lazyOnload`: retrasar el
        stub sería retrasar la cola, que es justo lo que no queremos.

        `requestIdleCallback` no existe en Safari anterior a 17 —la mitad del
        tráfico de este negocio es iPhone—, de ahí el `setTimeout`. Y el
        `timeout: 3000` está para que en una pestaña ocupada el ocioso llegue
        igualmente. Contrapartida asumida: quien acepte y cierre dentro de esa
        ventana no manda `PageView`.
      */}
      {estado === 'aceptado' && PIXEL_ID ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s,d)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];d=function(){t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)};
            f.requestIdleCallback?f.requestIdleCallback(d,{timeout:3000}):f.setTimeout(d,1000)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');`}
        </Script>
      ) : null}

      {estado === 'pendiente' ? (
        <div className="fixed bottom-0 md:bottom-0 left-0 right-0 z-50 bg-tinta text-fondo px-[18px] py-4 md:px-lat-desktop md:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:mb-0 mb-[56px]">
          <p className="text-14 md:text-16 text-sobre-tinta m-0 max-w-[68ch]">
            Usamos analítica y publicidad para entender cómo se usa esta web y mostrarte anuncios
            relevantes. Hasta que aceptes no se guarda ninguna cookie de analítica ni de publicidad.
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
