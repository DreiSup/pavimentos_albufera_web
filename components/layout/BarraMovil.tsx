import { nap } from '@/lib/config'
import { IconoTelefono, IconoWhatsApp } from '@/components/ui/Iconos'

/**
 * 01-sistema-de-diseno.md §4.3. Único elemento con sombra en todo el sitio.
 *
 * Se esconde en `cabecera-ancha` (1180 px), no en `md`, para seguir a
 * `Cabecera`: la fila completa de escritorio pide 928,4 px de hijos más 96 de
 * gutter y no cabe honestamente hasta 1180 (medido; ver el comentario de
 * `Cabecera.tsx`). Las dos se mueven siempre juntas: si esta barra se quedara
 * en `md:hidden`, la banda de en medio no tendría ni nav visible ni barra de
 * CTA. → `design/01` §4.3
 *
 * ⚠️ Los dos CTA son anclas crudas, no `Boton`, y siguen siéndolo. `Boton`
 * monta un `next/link`; esto tiene que funcionar **sin que hidrate nada**, que
 * es justo lo que el plan de medición (`design/06`) exige de los dos CTA de más
 * intención del sitio. Por eso las clases de verde se repiten a mano aquí en
 * vez de importarse: lo único compartido es el token de color, que es la fuente
 * única. → `design/01` §3.16
 */
export default function BarraMovil() {
  return (
    <div className="cabecera-ancha:hidden sticky bottom-0 z-20 grid grid-cols-2 gap-[1px] bg-tinta shadow-barra">
      <a
        href={nap.telefonoHref ?? '/presupuesto/'}
        data-ubicacion="sticky_mobile"
        className="min-h-boton flex items-center justify-center gap-2 bg-pigmento text-tinta font-sans font-semibold text-16 no-underline"
      >
        <IconoTelefono className="w-6 h-6" />
        Llamar
      </a>
      <a
        href={nap.whatsappHref ?? '/presupuesto/'}
        data-ubicacion="sticky_mobile"
        className="min-h-boton flex items-center justify-center gap-2 bg-verde-whatsapp text-tinta font-sans font-semibold text-16 no-underline"
      >
        <IconoWhatsApp className="w-6 h-6" />
        WhatsApp
      </a>
    </div>
  )
}
