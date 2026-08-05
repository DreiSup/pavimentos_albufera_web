import { nap } from '@/lib/config'

/** 01-sistema-de-diseno.md §4.3. Único elemento con sombra en todo el sitio. */
export default function BarraMovil() {
  return (
    <div className="md:hidden sticky bottom-0 z-20 grid grid-cols-2 gap-[1px] bg-tinta shadow-barra">
      <a
        href={nap.telefonoHref ?? '/presupuesto/'}
        className="min-h-boton flex items-center justify-center bg-pigmento text-tinta font-sans font-semibold text-16 no-underline"
      >
        Llamar
      </a>
      <a
        href={nap.whatsappHref ?? '/presupuesto/'}
        className="min-h-boton flex items-center justify-center bg-tinta text-fondo font-sans font-semibold text-16 no-underline"
      >
        WhatsApp
      </a>
    </div>
  )
}
