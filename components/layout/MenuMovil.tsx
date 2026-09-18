'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { nap } from '@/lib/config'
import Boton from '../ui/Boton'

export default function MenuMovil({
  onCerrar,
  enlaces,
}: {
  onCerrar: () => void
  enlaces: { href: string; texto: string }[]
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const primerFoco = panelRef.current?.querySelector<HTMLElement>('a, button')
    primerFoco?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCerrar()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const focables = panelRef.current.querySelectorAll<HTMLElement>('a, button')
      if (focables.length === 0) return
      const primero = focables[0]
      const ultimo = focables[focables.length - 1]
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onCerrar])

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      className="fixed inset-0 z-40 bg-tinta text-fondo p-[18px] flex flex-col overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        {/* Wordmark en variante clara: mismo criterio que la cabecera, y aquí
            además el panel es `--tinta` a pantalla completa. El panel solo se
            monta al abrirlo, así que este archivo no entra en la carga inicial
            de ninguna ruta. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/marca/logo-texto-claro.png"
          alt="Pavimentos Albufera"
          width={230}
          height={20}
          decoding="async"
          className="h-[20px] w-[230px]"
        />
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onCerrar}
          className="inline-flex items-center justify-center min-w-tactil min-h-tactil"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 4l16 16M20 4L4 20" stroke="#E9EAE6" strokeWidth="2" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-col mt-8">
        {enlaces.map((enlace) => (
          <Link
            key={enlace.href}
            href={enlace.href}
            onClick={onCerrar}
            className="font-display font-bold fs-h3 text-34 min-h-[56px] flex items-center border-t border-acero text-fondo no-underline"
          >
            {enlace.texto}
          </Link>
        ))}
      </nav>

      <div className="mt-8 font-mono text-d-11 text-sobre-tinta leading-[2.2] flex flex-col gap-1">
        <span>{nap.direccion ?? `[${nap.direccionMostrada}]`}</span>
        {/* Entre corchetes mientras sea reserva, igual que `Pie` y `Cabecera`. */}
        <span>{nap.telefono ?? `[${nap.telefonoMostrado}]`}</span>
        <span>{nap.email}</span>
        <div className="flex gap-4 mt-2">
          <Link href="/aviso-legal/" onClick={onCerrar} className="text-sobre-tinta no-underline">
            Aviso legal
          </Link>
          <Link href="/politica-de-privacidad/" onClick={onCerrar} className="text-sobre-tinta no-underline">
            Privacidad
          </Link>
          <Link href="/politica-de-cookies/" onClick={onCerrar} className="text-sobre-tinta no-underline">
            Cookies
          </Link>
        </div>
      </div>

      <div className="mt-auto pt-8 flex flex-col gap-[1px]">
        <Boton variante="primario" href={nap.telefonoHref ?? '/presupuesto/'} data-ubicacion="mobile_menu" anchoCompleto>
          Llamar
        </Boton>
        <Boton variante="contorno" sobreOscuro href={nap.whatsappHref ?? '/presupuesto/'} data-ubicacion="mobile_menu" anchoCompleto>
          WhatsApp
        </Boton>
      </div>
    </div>
  )
}
