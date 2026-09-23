import Link from 'next/link'
import { nap } from '@/lib/config'
import { RUTA_SERVICIO, NOMBRE_SERVICIO } from '@/lib/tipos'

const servicios = Object.entries(NOMBRE_SERVICIO) as [keyof typeof NOMBRE_SERVICIO, string][]

export default function Pie() {
  const anio = new Date().getFullYear()

  return (
    <footer className="bg-tinta text-fondo px-[18px] py-10 md:px-lat-desktop md:py-14 md:pb-10">
      <div className="max-w-contenido mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
        <div>
          {/* El único sitio del sitio con alto para el bloque completo: senda de
              losas y wordmark. En variante clara, porque el navy del original
              mide 1,1:1 contra `--tinta` y desaparece. El claim del logotipo no
              entra: a este ancho caería a 9 px y `design/01` §2.4 fija el suelo
              de la monoespaciada en 10.

              Es el activo más pesado de los tres —27,0 kB: el degradado de las
              elipses no cuantiza bien— y por eso va `lazy`. Está bajo el pliegue
              en las 49 rutas, así que en un rebote no se descarga. Sobre por qué
              `<img>` y no `next/image`, la medición está en `Cabecera.tsx`. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/marca/logo-marca-claro.png"
            alt="Pavimentos Albufera"
            width={222}
            height={84}
            loading="lazy"
            decoding="async"
            className="h-[72px] w-[190px] md:h-[84px] md:w-[222px]"
          />
        </div>

        <div className="font-mono text-d-11 leading-[2.2] text-sobre-tinta flex flex-col">
          <span>{nap.direccion ?? `[${nap.direccionMostrada}]`}</span>
          <a href={nap.telefonoHref ?? '#'} data-ubicacion="footer" className="text-sobre-tinta no-underline">
            {nap.telefono ?? `[${nap.telefonoMostrado}]`}
          </a>
          <a href={`mailto:${nap.email}`} data-ubicacion="footer" className="text-sobre-tinta no-underline">
            {nap.email}
          </a>
        </div>

        <nav className="hidden md:flex flex-col gap-0 font-sans text-16 text-sobre-tinta">
          {servicios.map(([id, nombre]) => (
            <Link
              key={id}
              href={RUTA_SERVICIO[id]}
              className="min-h-tactil flex items-center text-sobre-tinta no-underline"
            >
              {nombre}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-row md:flex-col flex-wrap gap-x-6 gap-y-0 font-sans text-14 md:text-16 text-sobre-tinta">
          <Link href="/aviso-legal/" className="min-h-tactil flex items-center text-sobre-tinta no-underline">
            Aviso legal
          </Link>
          <Link
            href="/politica-de-privacidad/"
            className="min-h-tactil flex items-center text-sobre-tinta no-underline"
          >
            Política de privacidad
          </Link>
          <Link
            href="/politica-de-cookies/"
            className="min-h-tactil flex items-center text-sobre-tinta no-underline"
          >
            Política de cookies
          </Link>
          {/* Reabre el aviso de `Consentimiento.tsx`, que delega el clic sobre
              `document` —igual que `EventosGlobales.tsx`— leyendo este atributo.
              Así este componente sigue siendo de servidor: no hace falta
              convertirlo a 'use client' ni crear uno nuevo solo para el botón. */}
          <button
            type="button"
            data-configurar-cookies
            className="min-h-tactil flex items-center text-sobre-tinta no-underline"
          >
            Configurar cookies
          </button>
        </nav>
      </div>

      <p className="max-w-contenido mx-auto mt-8 font-mono text-d-11 text-acero">
        © {anio} Pavimentos Albufera
      </p>
    </footer>
  )
}
