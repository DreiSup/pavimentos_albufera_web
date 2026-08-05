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
          <span className="font-display font-extrabold fs-logo text-16 tracking-[0.02em] leading-[1.15] block">
            PAVIMENTOS
            <br />
            ALBUFERA
          </span>
        </div>

        <div className="font-mono text-d-11 leading-[2.2] text-sobre-tinta flex flex-col">
          <span>{nap.direccionMostrada}</span>
          <a href={nap.telefonoHref ?? '#'} className="text-sobre-tinta no-underline">
            {nap.telefono ?? `[${nap.telefonoMostrado}]`}
          </a>
          <a href={`mailto:${nap.email}`} className="text-sobre-tinta no-underline">
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
        </nav>
      </div>

      <p className="max-w-contenido mx-auto mt-8 font-mono text-d-11 text-acero">
        © {anio} Pavimentos Albufera
      </p>
    </footer>
  )
}
