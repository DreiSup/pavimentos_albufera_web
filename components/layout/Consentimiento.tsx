'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { sitio } from '@/lib/config'
import {
  borrarCookiesRastreo,
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

  /**
   * Visibilidad del aviso, aparte de `estado`. En la primera visita coincide
   * con `estado === 'pendiente'`, pero el botón «Configurar cookies» del pie
   * (`Pie.tsx`) tiene que poder reabrirlo sin tocar la decisión ya guardada
   * —si se reutilizara `estado` para eso, reabrir sin haber decidido nada
   * todavía desmontaría el Pixel de Meta que ya estuviera cargado—.
   */
  const [bannerOpen, setBannerOpen] = useState(false)

  useEffect(() => {
    const guardado = leerCookie(COOKIE_CONSENTIMIENTO)
    const valido = guardado === 'aceptado' || guardado === 'rechazado'
    setEstado(valido ? guardado : 'pendiente')
    if (!valido) setBannerOpen(true)
  }, [])

  /**
   * Delegado en `document`, igual que `EventosGlobales.tsx`, para que
   * `Pie.tsx` —un componente de servidor— solo tenga que escribir el
   * atributo `data-configurar-cookies` sobre el botón del pie.
   */
  useEffect(() => {
    function alClic(evento: MouseEvent) {
      if ((evento.target as HTMLElement).closest('[data-configurar-cookies]')) setBannerOpen(true)
    }
    document.addEventListener('click', alClic)
    return () => document.removeEventListener('click', alClic)
  }, [])

  /**
   * `data-consentimiento="pendiente"` en el `<html>`: el único sitio del que el
   * CSS puede enterarse de que este aviso está ocupando la parte baja de la
   * ventana. Lo pone ya el script en línea de `app/layout.tsx` —antes del primer
   * pintado, para que el hero no se redimensione al hidratar—, y aquí se
   * mantiene al día: quien decide lo pierde en el mismo gesto y el hero recupera
   * su alto completo. → `app/globals.css`, `--banda-consentimiento`
   */
  useEffect(() => {
    if (estado === null) return
    const raiz = document.documentElement
    if (estado === 'pendiente') raiz.setAttribute('data-consentimiento', 'pendiente')
    else raiz.removeAttribute('data-consentimiento')
  }, [estado])

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
    const eraAceptado = estado === 'aceptado'
    escribirCookie(COOKIE_CONSENTIMIENTO, valor, DIAS)
    setEstado(valor)
    setBannerOpen(false)

    // Retirada de un consentimiento ya concedido, no un rechazo de entrada.
    // gtag.js y —si tocaba— el Pixel de Meta llevan corriendo en esta pestaña
    // desde que se aceptó, y ninguno de los dos se puede "desinyectar". El
    // `consent update` que manda el efecto de más arriba corre en el próximo
    // repintado, y `location.reload()` no le da tiempo a llegar: se manda
    // aquí, a mano, antes de borrar las cookies que esos scripts ya hubieran
    // escrito y de recargar, para que la pestaña vuelva a nacer sin ellos.
    if (valor === 'rechazado' && eraAceptado) {
      window.gtag?.('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      })
      window.fbq?.('consent', 'revoke')
      borrarCookiesRastreo()
      window.location.reload()
    }
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

      {bannerOpen ? (
        /* 🔴 `cabecera-ancha:mb-0`, NO `md:mb-0`. El margen inferior de 56 px es
           el hueco de `BarraMovil`, y esa barra se apaga en 1180 px, no en 768:
           con `md:mb-0` el aviso se montaba ENCIMA de «Llamar» y «WhatsApp» en
           toda la banda de 768 a 1179 px —medido a 768, 900 y 1024—, tapando en
           la primera visita los dos únicos CTA fijos del sitio. Es el mismo
           punto de ruptura mal espejado que `--barra-movil` ya documenta en
           `globals.css`: las tres cosas se mueven juntas o no se mueven. */
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-tinta text-fondo px-[18px] py-4 md:px-lat-desktop md:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-[56px] cabecera-ancha:mb-0">
          {/* 🔴 **Esta frase es la primera capa del art. 22.2 de la LSSI**, y hasta
              el 2026-09-18 decía «hasta que aceptes no se guarda ninguna cookie de
              analítica ni de publicidad». El código la desmentía por dos sitios,
              los dos comprobados en ejecución llegando con `?gclid=&fbclid=` y sin
              tocar ningún botón:

              1. `app/api/atribucion/route.ts` escribe `pa_ref` —90 días, código de
                 seguimiento que además viaja a Google como `reference_code`— sin
                 mirar el consentimiento, en la primera visita.
              2. `app/layout.tsx` carga `gtag.js` con la única condición de que
                 haya identificador. Con los cuatro permisos del Consent Mode en
                 `denied` Google no puede usar almacenamiento, pero sí recibe la
                 página, la IP y el navegador.

              Lo que sí es cierto, y por eso se conserva: el Pixel de Meta tiene
              bloqueo duro y las cookies publicitarias propias (`pa_attr`, `_fbc`)
              solo se escriben con «Aceptar». Eso es «lo demás espera a tu
              respuesta».

              ⚠️ **Es texto, no mecanismo.** Arreglar el mecanismo —que `pa_ref` no
              se escriba antes de decidir— es `09-instrucciones-legales.md` §6.3 y
              es otro encargo. Mientras la cookie se escriba, la frase tiene que
              decirlo: la política de cookies que hay detrás ya lo dice, y una
              primera capa que la contradice es peor que no tenerla. Cuando el §6.3
              se ejecute, esta frase se vuelve a escribir. */}
          <p className="text-14 md:text-16 text-sobre-tinta m-0 max-w-[68ch]">
            Usamos analítica y publicidad para entender cómo se usa esta web y mostrarte anuncios
            relevantes. Antes de que decidas ya se guarda una cookie propia con un código de visita y
            Google recibe qué página ves, sin poder guardar nada en tu dispositivo; lo demás espera a
            tu respuesta.
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
