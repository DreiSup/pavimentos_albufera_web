'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
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

/**
 * Altura de la cabecera, en un único sitio y en CSS (01-sistema-de-diseno.md §4.1 y
 * 02-pantallas.md §B9). De `--cabecera-actual` cuelgan la propia cabecera y todas las
 * barras pegajosas que se anclan bajo ella —barra de confianza, filtros del muestrario,
 * índice de proyectos y submenú de servicio—, así que no pueden desajustarse.
 *
 *   móvil       44 px de objetivo táctil + 14 px de padding arriba y abajo (§2.5) = 72
 *   escritorio  84 px (§4.1)
 *   compacta    60 px tras hacer scroll (§B9), con el ancla de sección a 130 px
 *
 * Va en CSS y no en JS para que valga ya en el primer pintado y en cada punto de ruptura
 * sin medir nada. `html:root` gana por especificidad al valor de arranque de globals.css
 * sea cual sea el orden en que se sirvan las hojas de estilo.
 */
const ALTURAS = `
html:root{--cabecera-actual:72px}
@media (min-width:768px){html:root{--cabecera-actual:84px}}
html:root[data-cabecera='compacta']{--cabecera-actual:60px;--ancla-offset:130px}
`

export default function Cabecera() {
  const pathname = usePathname()
  const [conScroll, setConScroll] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const disparadorRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setConScroll(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // El estado compacto se publica como atributo: la aritmética de alturas es de CSS.
  useEffect(() => {
    const raiz = document.documentElement
    if (conScroll) raiz.dataset.cabecera = 'compacta'
    else delete raiz.dataset.cabecera
  }, [conScroll])

  useEffect(() => {
    setMenuAbierto(false)
  }, [pathname])

  const cerrarMenu = useCallback(() => setMenuAbierto(false), [])

  return (
    <header className="sticky top-0 z-30 h-[var(--cabecera-actual)] bg-fondo border-b border-tinta transition-[height] duration-cabecera ease-out flex items-center px-[18px] md:px-lat-desktop">
      <style href="pa-cabecera-alturas" precedence="default">
        {ALTURAS}
      </style>

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
                aria-current={activo ? 'page' : undefined}
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

        {/* Solo abre: mientras el panel está delante, este botón queda debajo y es el
            panel quien tiene su propio «Cerrar menú». Por eso la etiqueta no cambia;
            el estado lo lleva aria-expanded. */}
        <button
          ref={disparadorRef}
          type="button"
          aria-label="Abrir menú"
          aria-haspopup="dialog"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto(true)}
          className="md:hidden inline-flex items-center justify-center min-w-tactil min-h-tactil"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="#1B1E1C" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {menuAbierto ? (
        <MenuMovil onCerrar={cerrarMenu} enlaces={enlaces} disparadorRef={disparadorRef} />
      ) : null}
    </header>
  )
}
