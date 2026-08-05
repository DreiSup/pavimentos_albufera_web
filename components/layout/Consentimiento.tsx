'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { sitio } from '@/lib/config'
import Boton from '../ui/Boton'

const CLAVE = 'pa-consentimiento'

export default function Consentimiento() {
  const [estado, setEstado] = useState<'pendiente' | 'aceptado' | 'rechazado'>('pendiente')

  useEffect(() => {
    const guardado = window.localStorage.getItem(CLAVE)
    if (guardado === 'aceptado' || guardado === 'rechazado') setEstado(guardado)
  }, [])

  function decidir(valor: 'aceptado' | 'rechazado') {
    window.localStorage.setItem(CLAVE, valor)
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

      {estado === 'pendiente' ? (
        <div className="fixed bottom-0 md:bottom-0 left-0 right-0 z-50 bg-tinta text-fondo px-[18px] py-4 md:px-lat-desktop md:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:mb-0 mb-[56px]">
          <p className="text-14 md:text-16 text-sobre-tinta m-0 max-w-[68ch]">
            Usamos analítica para entender cómo se usa esta web. No se carga nada hasta que aceptas.
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
