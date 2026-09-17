import { nap } from '@/lib/config'

/**
 * 01-sistema-de-diseno.md §4.3. Único elemento con sombra en todo el sitio.
 *
 * Se esconde en `xl`, no en `md`, para seguir a `Cabecera`: la cabecera de
 * escritorio necesita 1108 px de contenido (medido, ver el comentario de
 * `Cabecera.tsx`) y por debajo de 1280 vale la de móvil. Si esta barra siguiera
 * en `md:hidden`, entre 768 y 1279 no habría ni nav visible ni barra de CTA.
 */
export default function BarraMovil() {
  return (
    <div className="xl:hidden sticky bottom-0 z-20 grid grid-cols-2 gap-[1px] bg-tinta shadow-barra">
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
