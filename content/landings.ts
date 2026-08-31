import { SERVICIOS, type Servicio } from '@/content/servicios'
import type { ServicioId } from '@/lib/tipos'

/**
 * Landings de campaña de `/lp/<slug>/`.
 *
 * No son páginas nuevas ni copy nuevo: son las de servicio recompuestas. Cada
 * una es el mismo `Servicio` del catálogo con tres campos opcionales puestos,
 * y `PaginaServicio.tsx` los respeta. Clonar la plantilla habría garantizado
 * que la landing y la página de servicio dijeran cosas distintas en un mes,
 * que es exactamente lo que `design/04` §2 prohíbe.
 *
 * Lo que cambia respecto de la página de servicio, y por qué:
 *
 * - **Fuera la ficha técnica.** Los seis servicios la llenan de `<DatoPendiente>`
 *   —impreso 2 corchetes, pulido 4, microcemento 5, lavado 3—, y una landing de
 *   pago con un corchete es dinero quemado. No se rellena: se quita la sección.
 * - **CTA de llamada y WhatsApp** en el hero y en el cierre, en `tinta` y
 *   `contorno`. Nunca en ocre.
 * - **El cierre sin `<Aparece>`**: es el bloque de conversión y no debe depender
 *   de que hidrate un `IntersectionObserver`.
 *
 * **El JSON-LD viaja tal cual, y es una decisión tomada, no un descuido.** El
 * spread deja `servicio.ruta` apuntando a la página de servicio, así que la
 * landing emite un nodo `Service` con el `@id` y el `url` **canónicos**, más una
 * copia de la `FAQPage`. Se queda así: un `@id` identifica la entidad, no la
 * página, y que dos URLs afirmen la misma entidad es justo para lo que existe.
 * Además la landing es `noindex,follow`, o sea que ese marcado no compite en el
 * índice con nada. Lo que NO se puede hacer es lo contrario —apuntar `ruta` a
 * `/lp/…`—, porque entonces el `url` del `Service` señalaría una página que el
 * propio sitio pide no indexar. Si algún día molesta, la salida limpia es un
 * cuarto campo opcional `sinSchema` en la misma línea que `ocultarSecciones`.
 *
 * 🔴 **`fratasado` y `desactivado` no tienen landing, y no es un olvido**: son
 * los dos únicos servicios sin `usosCalculadora`, o sea sin rango de precio
 * aprobado. Sin precio no hay landing de Ads. Es dato del dueño.
 */
const DE_CAMPANA: ServicioId[] = ['impreso', 'pulido', 'lavado', 'microcemento']

function recomponer(id: ServicioId): Servicio {
  return {
    ...SERVICIOS[id],
    ocultarSecciones: ['seccion-ficha'],
    ctaContacto: true,
    sinAparece: true,
  }
}

/**
 * El slug de la landing es el de la página de servicio, sin barras:
 * `/hormigon-impreso/` → `hormigon-impreso` → `/lp/hormigon-impreso/`. Derivarlo
 * y no escribirlo evita que un día la landing viva en un slug que ya no existe
 * como servicio.
 */
export const LANDINGS: Record<string, Servicio> = Object.fromEntries(
  DE_CAMPANA.map((id) => [SERVICIOS[id].ruta.replace(/\//g, ''), recomponer(id)]),
)

export const slugsLanding = Object.keys(LANDINGS)
