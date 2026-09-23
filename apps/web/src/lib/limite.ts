/**
 * Límite de tasa por IP, en la memoria del proceso.
 *
 * Vive en su propio módulo porque lo necesitan dos sitios distintos: el Server
 * Action del formulario y los Route Handlers. ⚠️ **No se puede importar de
 * `app/presupuesto/actions.ts`**, que tiene hoy su propia copia privada: en un
 * módulo `'use server'` todo export tiene que ser una función asíncrona, y esta
 * devuelve un boolean síncrono. Unificar las dos copias es tarea 1.5.
 *
 * Lo que NO es: se reinicia con cada despliegue y no se comparte entre
 * instancias de la función. No es una defensa contra un atacante decidido —para
 * eso está la validación de cada valor en el propio handler—, es un tope de
 * coste.
 */

const marcas = new Map<string, number[]>()

/**
 * Sin esto el `Map` crece con cada IP nueva y no suelta ninguna jamás, que es
 * justo el defecto de la copia de `actions.ts`. La purga es perezosa: solo se
 * paga cuando el mapa ya ha crecido.
 */
const MAX_CLAVES = 10_000

export function limitePorIp(
  ip: string,
  { limite = 3, ventanaMs = 3_600_000 }: { limite?: number; ventanaMs?: number } = {},
): boolean {
  const ahora = Date.now()

  if (marcas.size > MAX_CLAVES) {
    // La ventana con la que se purga es la de quien llama. Con dos consumidores
    // de ventanas distintas eso deja fuera alguna entrada aún viva del más
    // largo: se acepta, porque el fallo es permitir de más, nunca bloquear.
    for (const [clave, tiempos] of marcas) {
      if (tiempos.every((t) => ahora - t >= ventanaMs)) marcas.delete(clave)
    }
    // Si tras purgar sigue lleno es que todas son recientes. Se vacía entero
    // antes que crecer sin techo: cuesta una ventana de permisividad, no memoria.
    if (marcas.size > MAX_CLAVES) marcas.clear()
  }

  const previos = (marcas.get(ip) ?? []).filter((t) => ahora - t < ventanaMs)
  if (previos.length >= limite) return false
  previos.push(ahora)
  marcas.set(ip, previos)
  return true
}
