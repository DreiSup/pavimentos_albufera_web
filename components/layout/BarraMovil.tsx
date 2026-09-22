import { nap } from '@/lib/config'

/**
 * 01-sistema-de-diseno.md §4.3. Único elemento con sombra en todo el sitio.
 *
 * Se esconde en `cabecera-ancha` (1180 px), no en `md`, para seguir a
 * `Cabecera`: la fila completa de escritorio pide 987,1 px de hijos —con el
 * logotipo en fila, remedido el 2026-09-18— más 96 de gutter y no cabe
 * honestamente hasta 1180 (medido; ver el comentario de `Cabecera.tsx`). Las
 * dos se mueven siempre juntas: si esta barra se quedara en `md:hidden`, la
 * banda de en medio no tendría ni nav visible ni barra de CTA. → `design/01`
 * §4.3
 */
export default function BarraMovil() {
  return (
    <div className="cabecera-ancha:hidden sticky bottom-0 z-20 grid grid-cols-2 gap-[1px] bg-tinta shadow-barra">
      <a
        href={nap.telefonoHref ?? '/presupuesto/'}
        data-ubicacion="sticky_mobile"
        className="min-h-boton flex items-center justify-center bg-pigmento text-tinta font-sans font-semibold text-16 no-underline"
      >
        Llamar
      </a>
      <a
        href={nap.whatsappHref ?? '/presupuesto/'}
        data-ubicacion="sticky_mobile"
        className="min-h-boton flex items-center justify-center bg-tinta text-fondo font-sans font-semibold text-16 no-underline"
      >
        WhatsApp
      </a>
    </div>
  )
}
