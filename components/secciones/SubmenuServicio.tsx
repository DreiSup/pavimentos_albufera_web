'use client'

import { useEffect, useState } from 'react'

export type AnclaSubmenu = { id: string; texto: string }

/**
 * 01-sistema-de-diseno.md §4.6. Sigue el scroll con IntersectionObserver
 * (decisión 12 de 05-pendientes-y-decisiones.md): en el prototipo solo
 * respondía al clic por una limitación del entorno de previsualización.
 */
export default function SubmenuServicio({ anclas }: { anclas: AnclaSubmenu[] }) {
  const [activa, setActiva] = useState(anclas[0]?.id)

  useEffect(() => {
    const secciones = anclas
      .map((a) => document.getElementById(a.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (secciones.length === 0) return

    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas.find((e) => e.isIntersecting)
        if (visible) setActiva(visible.target.id)
      },
      { rootMargin: '-150px 0px -55% 0px' },
    )

    secciones.forEach((s) => observador.observe(s))
    return () => observador.disconnect()
  }, [anclas])

  return (
    <div className="hidden md:flex sticky [top:var(--cabecera-actual)] z-10 bg-tinta h-[56px] px-lat-desktop items-center gap-1 overflow-x-auto">
      {anclas.map((ancla) => (
        <a
          key={ancla.id}
          href={`#${ancla.id}`}
          className={`min-h-tactil inline-flex items-center px-4 font-mono text-d-11 no-underline whitespace-nowrap ${
            activa === ancla.id ? 'bg-pigmento text-tinta' : 'text-sobre-tinta'
          }`}
        >
          {ancla.texto}
        </a>
      ))}
    </div>
  )
}
