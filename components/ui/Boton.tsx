import Link from 'next/link'
import { cva } from 'class-variance-authority'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { esEnlaceWhatsApp } from '@/lib/config'
import { IconoWhatsApp } from '@/components/ui/Iconos'

type Variante = 'primario' | 'contorno' | 'tinta'

/**
 * 01-sistema-de-diseno.md §3.1–3.4 y §3.16.
 *
 * Las variantes de color viven enteras en `compoundVariants`, de modo que cada
 * combinación emite **un solo** juego de `bg` / `text` / `border`. Al no haber dos
 * utilidades compitiendo por la misma propiedad no hace falta ni `!important` ni
 * fusionar clases en cliente (tailwind-merge pesa 7,5 KB gzip: descartado).
 *
 * ⚠️ Por eso `whatsapp` es un eje más de `variants` y **los cuatro compuestos de
 * color llevan `whatsapp: false`**: si se apilara encima de `contorno` habría un
 * `bg-transparent` y un `bg-verde-whatsapp` en la misma cadena y quién gana lo
 * decidiría el orden en que Tailwind emite el CSS, no el orden de la cadena.
 * Eso se ve bien un día y mal al siguiente.
 */
const boton = cva(
  'inline-flex items-center justify-center min-h-campo md:min-h-boton px-6 md:px-[30px] font-sans font-semibold text-16 no-underline transition-colors',
  {
    variants: {
      variante: { primario: '', contorno: '', tinta: '' },
      sobreOscuro: { true: '', false: '' },
      anchoCompleto: { true: 'w-full', false: '' },
      deshabilitado: { true: 'cursor-not-allowed', false: '' },
      whatsapp: { true: '', false: '' },
    },
    compoundVariants: [
      // §3.1 Botón primario (ocre)
      {
        variante: 'primario',
        whatsapp: false,
        deshabilitado: false,
        class: 'btn-primario bg-pigmento text-tinta border border-pigmento hover:bg-pigmento-hover',
      },
      // §3.3 Botón de relleno en tinta
      {
        variante: 'tinta',
        whatsapp: false,
        deshabilitado: false,
        class: 'bg-tinta text-fondo border border-tinta hover:bg-acero',
      },
      // §3.2 Botón de contorno, sobre fondo claro y sobre fondo oscuro
      {
        variante: 'contorno',
        sobreOscuro: false,
        whatsapp: false,
        deshabilitado: false,
        class: 'bg-transparent text-tinta border border-tinta hover:bg-tinta hover:text-fondo',
      },
      {
        variante: 'contorno',
        sobreOscuro: true,
        whatsapp: false,
        deshabilitado: false,
        class: 'bg-transparent text-fondo border border-sobre-tinta hover:bg-fondo hover:text-tinta',
      },
      // §3.16 Botón de WhatsApp. Gana a la variante que traiga el sitio de llamada,
      // y solo lo hace en enlaces que de verdad abren WhatsApp. El `gap` vive
      // aquí y no en la clase base: hay botones cuyo rótulo son dos nodos
      // —«Llamar al» + <DatoPendiente>— y un `gap` general los separaría.
      {
        whatsapp: true,
        deshabilitado: false,
        class:
          'gap-2 bg-verde-whatsapp text-tinta border border-verde-whatsapp hover:bg-verde-whatsapp-hover',
      },
      // §3.4 Estado deshabilitado: un único tratamiento, gane la variante que gane
      {
        deshabilitado: true,
        class: 'bg-fondo-alt text-tinta-media border border-fondo-alt',
      },
    ],
    defaultVariants: {
      variante: 'primario',
      sobreOscuro: false,
      anchoCompleto: false,
      deshabilitado: false,
      whatsapp: false,
    },
  },
)

type Comun = {
  variante?: Variante
  sobreOscuro?: boolean
  anchoCompleto?: boolean
  children: ReactNode
  className?: string
}

type ComoBoton = Comun & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

/** `disabled` no existe en un `<a>`: se prohíbe en vez de derramarlo como atributo inválido. */
type ComoEnlace = Comun & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; disabled?: never }

export default function Boton(props: ComoBoton | ComoEnlace) {
  const {
    variante = 'primario',
    sobreOscuro = false,
    anchoCompleto = false,
    children,
    className = '',
    ...resto
  } = props

  if ('href' in props && props.href) {
    const { href, ...anchorRest } = resto as ComoEnlace
    /**
     * El verde y el icono **no se piden con un prop: se deducen del destino.**
     * El dueño pidió el 2026-09-18 que TODOS los botones de WhatsApp del sitio
     * salgan en verde, y son seis repartidos por cinco archivos. Con un prop
     * habría que acordarse en cada sitio de llamada nuevo, y el que se olvide
     * no falla ningún build: se queda gris y nadie lo ve.
     *
     * El predicado es el mismo que usa `EventosGlobales` para decidir si ese
     * clic es un `whatsapp_click`, así que la regla real es: **si se cuenta
     * como WhatsApp, se ve como WhatsApp.** → `lib/config.ts`
     *
     * Con `NEXT_PUBLIC_WHATSAPP` vacía los `href` caen a `/presupuesto/` y el
     * botón vuelve solo a su variante normal, que es lo correcto: sin número no
     * hay WhatsApp que anunciar.
     */
    const whatsapp = esEnlaceWhatsApp(href)
    return (
      <Link
        href={href}
        className={boton({ variante, sobreOscuro, anchoCompleto, whatsapp, class: className })}
        {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {whatsapp && <IconoWhatsApp />}
        {children}
      </Link>
    )
  }

  const botonRest = resto as ButtonHTMLAttributes<HTMLButtonElement>

  return (
    <button
      className={boton({
        variante,
        sobreOscuro,
        anchoCompleto,
        deshabilitado: Boolean(botonRest.disabled),
        class: className,
      })}
      {...botonRest}
    >
      {children}
    </button>
  )
}
