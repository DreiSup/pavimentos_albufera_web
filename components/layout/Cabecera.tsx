'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { nap } from '@/lib/config'
import Boton from '../ui/Boton'
import MenuMovil from './MenuMovil'

const enlaces = [
  { href: '/acabados/', texto: 'Acabados' },
  { href: '/proyectos/', texto: 'Proyectos' },
  { href: '/precios/', texto: 'Precios' },
  { href: '/empresa/', texto: 'Empresa' },
  { href: '/blog/', texto: 'Blog' },
]

export default function Cabecera() {
  const pathname = usePathname()
  const [conScroll, setConScroll] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const onScroll = () => setConScroll(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--cabecera-actual', conScroll ? '60px' : '84px')
  }, [conScroll])

  useEffect(() => {
    setMenuAbierto(false)
  }, [pathname])

  return (
    <header
      className={`sticky top-0 z-30 bg-fondo border-b border-tinta transition-[height] duration-cabecera ease-out flex items-center px-[18px] md:px-lat-desktop ${
        conScroll ? 'h-[60px]' : 'h-[70px] md:h-cabecera'
      }`}
    >
      <div className="flex items-center justify-between w-full max-w-contenido mx-auto">
        <Link href="/" className="no-underline text-tinta">
          {conScroll ? (
            <span className="font-mono text-d-12 uppercase tracking-[0.05em]">Pavimentos Albufera</span>
          ) : (
            <span className="font-display font-extrabold fs-logo text-16 tracking-[0.02em] leading-[1.15] block">
              PAVIMENTOS
              <br />
              ALBUFERA
            </span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {enlaces.map((enlace) => {
            const activo = pathname?.startsWith(enlace.href)
            return (
              <Link
                key={enlace.href}
                href={enlace.href}
                className={`min-h-tactil inline-flex items-center font-sans text-16 no-underline ${
                  activo ? 'font-semibold border-b-2 border-tinta' : 'font-medium'
                }`}
              >
                {enlace.texto}
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          {!conScroll && (
            <a href={nap.telefonoHref ?? '#'} className="font-mono text-d-12 text-tinta-media no-underline">
              {nap.telefono ?? `[${nap.telefonoMostrado}]`}
            </a>
          )}
          <Boton variante="contorno" href="/presupuesto/" className={conScroll ? '!min-h-tactil' : ''}>
            Pedir presupuesto
          </Boton>
        </div>

        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto(true)}
          className="md:hidden inline-flex items-center justify-center min-w-tactil min-h-tactil"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="#1B1E1C" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {menuAbierto ? <MenuMovil onCerrar={() => setMenuAbierto(false)} enlaces={enlaces} /> : null}
    </header>
  )
}
