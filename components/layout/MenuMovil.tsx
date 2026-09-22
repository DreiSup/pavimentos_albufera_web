'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { nap } from '@/lib/config'
import Boton from '../ui/Boton'
import { IconoTelefono } from '../ui/Iconos'

export default function MenuMovil({
  onCerrar,
  enlaces,
}: {
  onCerrar: () => void
  enlaces: { href: string; texto: string }[]
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const cerrarRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    /* Quién tenía el foco antes de abrir, para devolvérselo al cerrar. En la
       práctica es siempre la hamburguesa, porque es lo único que abre este
       panel, pero se guarda el elemento y no un selector: así sigue valiendo si
       algún día lo abre otra cosa. */
    const foco = document.activeElement
    /* El foco entra por la `×`, no por el primer elemento del panel. Desde que
       el logotipo es un enlace a la home, `querySelector('a, button')` devuelve
       ese enlace, y abrir un menú dejando el foco sobre «irse a otra página» es
       lo contrario de lo que se acaba de pedir. La salida va primero; el
       tabulador llega al resto en orden. */
    cerrarRef.current?.focus()

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
      /* `design/02` §B9 lo pedía desde el principio —«devuelve el foco al botón
         de hamburguesa»— y **no lo hacía nadie**: medido con teclado, al pulsar
         `Esc` el foco caía al `<body>` y había que tabular desde el principio
         del documento. Si el panel se cierra navegando, la página cambia y esto
         no llega a notarse; si se cierra con `Esc` o con la `×`, sí. */
      if (foco instanceof HTMLElement && foco.isConnected) foco.focus()
    }
  }, [onCerrar])

  /**
   * 🔴 **El panel se pinta en `document.body`, no donde lo monta `Cabecera`.**
   * Medido a 390 px en **primera visita**, con el aviso de cookies en pantalla,
   * que es el único momento en que se ve:
   *
   * - El aviso (`Consentimiento.tsx`, `z-50`) ocupaba **606,4 → 788**.
   * - El `Llamar` de este panel ocupa **729 → 777**: entero por debajo.
   * - `document.elementFromPoint` en el centro de ese botón devolvía
   *   **`BUTTON|Aceptar`**. O sea: en la primera visita, **tocar el CTA
   *   principal del menú de móvil aceptaba las cookies en vez de llamar**.
   * - Y no había forma de sacarlo de ahí: el panel es `inset-0` con `mt-auto`,
   *   y su `scrollHeight` era igual que su `clientHeight` (844 = 844). Sin
   *   scroll, el botón no se puede subir.
   *
   * Lo mismo a 360 (530,9 → 578,9 bajo un aviso de 402,4 → 584) y a 414
   * (781 → 829 bajo 658,4 → 840). A 320 el panel sí desborda y el botón cae
   * por debajo del aviso, así que ese ancho no lo enseñaba.
   *
   * ⚠️ **Subir el `z-index` del panel no lo arregla, y se probó:** con `z-[60]`
   * el `elementFromPoint` seguía devolviendo `Aceptar`. `Cabecera` es
   * `sticky top-0 z-30`, o sea un **contexto de apilamiento**, y este panel es
   * hijo suyo: dentro de él ningún número gana al `z-50` del aviso, porque los
   * dos se comparan como 30 contra 50. El `z-[60]` de abajo hace falta —el
   * portal solo lo pone al nivel del `<body>`—, pero por sí solo no sirve.
   *
   * Por qué portal y no subir el `z-index` de `Cabecera`: este panel es
   * `role="dialog" aria-modal="true"` y su trampa de foco recorre solo sus
   * hijos, así que el aviso estaba pintado encima de un modal del que el
   * tabulador no puede salir. Un diálogo modal no debe colgar de un contexto de
   * apilamiento ajeno; sacarlo al `<body>` lo arregla sin tocar la cabecera y
   * sin mover la pila del resto del sitio. El aviso vuelve entero en cuanto se
   * cierra el menú: mientras hay un diálogo abierto, se tapa.
   *
   * La escala queda: 10 contenido · 20 sticky secundarios y `BarraMovil` ·
   * 30 `Cabecera` · 50 `Consentimiento` · **60 este panel, ya en el `<body>`**.
   *
   * `createPortal` no cuesta JS nuevo: `react-dom` ya está en el bundle de
   * todas las rutas. Y no rompe el renderizado en servidor porque `Cabecera`
   * solo monta este componente tras un clic, o sea nunca en el HTML.
   */
  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      /* ⚠️ `z-[60]` **y el portal de arriba**: los dos juntos, y ninguno sirve
         solo. → ver el bloque del `createPortal`.

         🔴 **`sobre-oscuro` no es decorativo aquí, arregla el foco.** `Boton`
         primario lleva `outline: 2px solid var(--tinta)`
         (`app/globals.css` §focus), pensado para un fondo `--fondo` claro. En
         este panel el fondo ES `--tinta`: medido con `getComputedStyle` tras
         tabular hasta «Llamar», el anillo pintaba `rgb(27,30,28)` sobre un
         panel `rgb(27,30,28)`, 1,00:1 de contraste. La clase ya existe en el
         proyecto para marcar secciones de fondo oscuro (`Pie`, `FichaObra`,
         `PaginaServicio`…) y hoy solo reescribe `.pendiente`; se le añade la
         regla de foco del botón primario en vez de inventar un selector
         nuevo. → `app/globals.css`, regla `.sobre-oscuro .btn-primario`.

         🔴 **`md:px-lat-desktop`, no solo `px-[18px]`.** `Cabecera` cambia de
         18 a 48 px de hueco lateral en `md` (768); este panel se quedaba fijo
         en 18. El logotipo de la barra arranca en x=48 desde 768 y el de
         aquí seguía en x=18: 30 px de salto horizontal al abrir el menú en
         toda la banda 768-1179, medido con `getBoundingClientRect().left` en
         los dos estados. */
      className="sobre-oscuro fixed inset-0 z-[60] bg-tinta text-fondo px-[18px] md:px-lat-desktop pb-[18px] flex flex-col overflow-y-auto"
    >
      {/* `h-[69px] md:h-[83px]` y no el `p-[18px]` de antes: esta fila es la
          misma fila que la cabecera, así que mide lo mismo que ella por
          dentro, **en los dos estados que cruza**. Este panel existe en toda
          la banda de hamburguesa —320 a 1179 px, `cabecera-ancha`—, y la
          cabecera cambia de 70 a 84 px en `md` (768), a media banda. Un solo
          alto fijo aquí solo puede coincidir con uno de los dos.

          La barra son 70/84 px (`design/02` §B9) **menos el `border-b` de
          1 px** que lleva, o sea 69/83 px de caja de contenido: medido, su
          fila interior arranca en y=12,5 y no en 13. Poner 70/84 dejaba el
          logotipo medio píxel más abajo que el de la barra, que es justo el
          movimiento que este cambio viene a quitar. */}
      <div className="h-[69px] md:h-[83px] shrink-0 flex items-center justify-between">
        {/* **La misma marca que la barra, 2026-09-18.** Aquí se pintaba
            `logo-texto-claro.png`: solo el wordmark, 230 × 20. Y la cabecera,
            desde que compone en fila, pinta senda + wordmark a 239,94 × 38. En
            móvil este panel no es una pantalla aparte —es el único estado
            expandido de la barra de navegación—, así que al desplegarla la
            marca cambiaba de dibujo: la senda desaparecía, el alto caía de 38 a
            20 px y el bloque bajaba 14,5 px. Una barra que se abre no cambia de
            logotipo.

            🔴 **El arreglo del 2026-09-18 solo cubría 320-767 px.** El menú de
            hamburguesa sigue vivo hasta `cabecera-ancha` (1180), pero la
            cabecera real sube a 84 px y el logotipo a 53 px ya en `md` (768):
            medido, entre 768 y 1179 la barra pintaba el logotipo a 334,7 × 53
            y este panel seguía en 239,9 × 38, la misma talla que a 390. Por
            eso el `<img>` de aquí abajo lleva ahora el mismo `md:h-[53px]`
            que el de `Cabecera`, no solo la altura de 320-767.

            Lo que se ve ahora es **el mismo archivo en variante clara**,
            `logo-marca-fila-claro.png`, a la misma altura y en la misma
            posición: la marca no se mueve ni un píxel al abrir el menú. No hay
            duplicado en pantalla en ningún instante —el panel es opaco y cubre
            la cabecera—, y el del pie sigue fuera de vista, a 9.526 px de
            scroll.

            Por qué no se reutiliza `logo-marca-claro.png`, que ya existía y
            también lleva la senda: está **apilado**, no en fila. En esta caja
            mide 190 × 72, o sea 34 px más alto y 49,9 más estrecho que el de la
            barra, y pesa 27,0 kB contra 7,4. Seguiría siendo un cambio de
            composición al abrir, que es justo el defecto.

            Y es un enlace, que antes no lo era: el logotipo de la cabecera es
            **el único enlace a `/` de todo el sitio** —el del pie es una imagen
            suelta—, y al abrir el menú se perdía. → `design/02` §B9, enmendado. */}
        <Link href="/" onClick={onCerrar} className="no-underline flex items-center min-h-tactil">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/marca/logo-marca-fila-claro.png"
            alt="Pavimentos Albufera"
            width={1004}
            height={159}
            decoding="async"
            /* Mismas reglas que en `Cabecera`, con la misma clase de altura
               —`h-[38px] md:h-[53px]`—, no solo el tramo estrecho: este panel
               sigue vivo hasta `cabecera-ancha` (1180) y la cabecera ya está a
               84 px de barra y 53 de logotipo desde `md` (768). El ancho es
               `auto`, con `width`/`height` declarados para que el hueco se
               reserve por la proporción del archivo. Salen los mismos
               239,94 × 38 px hasta 767, y 334,66 × 53 de 768 a 1179. */
            className="h-[38px] w-auto shrink-0 md:h-[53px]"
          />
        </Link>
        <button
          type="button"
          ref={cerrarRef}
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

      {/*
        Los dos CTA del menú son el mismo par que la barra fija, apilados a 1 px
        uno del otro, así que **o llevan icono los dos o no lo lleva ninguno**:
        con uno solo se leen como dos piezas de sistemas distintos. El de
        WhatsApp se lo pone `Boton` por su `href`; el de teléfono se escribe aquí
        a mano, con su `gap-2`, y **a propósito no se deduce de `tel:`**. Si
        `Boton` antepusiera el auricular a todo `href` que empiece por `tel:`,
        los 28 px del icono caerían también en los botones que dicen
        `Llamar al 627 663 146` —cierre de portada y de las landings—, que es
        justo la fila que esta sesión viene a descongestionar: ahí el botón de
        llamar es el que ya encoge, y darle un icono lo parte una línea más.

        Los dos van a los 20 px por defecto, no a los 24 de la barra fija: la
        barra no está en pantalla con el menú abierto —este panel es
        `fixed inset-0`—, y quien sí está al lado es el `Boton` de WhatsApp de
        debajo. → `design/01` §3.16
      */}
      <div className="mt-auto pt-8 flex flex-col gap-[1px]">
        <Boton
          variante="primario"
          href={nap.telefonoHref ?? '/presupuesto/'}
          data-ubicacion="mobile_menu"
          anchoCompleto
          className="gap-2"
        >
          <IconoTelefono />
          Llamar
        </Boton>
        <Boton variante="contorno" sobreOscuro href={nap.whatsappHref ?? '/presupuesto/'} data-ubicacion="mobile_menu" anchoCompleto>
          WhatsApp
        </Boton>
      </div>
    </div>,
    document.body
  )
}
