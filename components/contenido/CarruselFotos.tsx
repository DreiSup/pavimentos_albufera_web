import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'
import type { Imagen } from '@/lib/tipos'
import { PROPORCIONES } from './BloquePosicion'

export type Diapositiva = {
  imagen: Imagen
  /** La etiqueta técnica de ESA obra. Se funde con su foto, no con el carrusel. */
  etiqueta?: ReactNode
}

/**
 * Carrusel de fotografía de obra (01-sistema-de-diseno.md §3.15).
 *
 * **Componente de servidor, cero bytes de JavaScript.** El pase vive entero en
 * la clase `.carrusel` de `app/globals.css`, con un `@keyframes` de opacidad y
 * un `animation-delay` escalonado por diapositiva. No hay estado, no hay
 * `IntersectionObserver`, no hay librería de animación —el proyecto no admite
 * ninguna— y el presupuesto de JS de la ruta no se mueve ni un byte.
 *
 * Lo que decide la accesibilidad está en el CSS base, no en la animación:
 *
 *  - Cada diapositiva arranca con `opacity: 0` y **la primera con `opacity: 1`**.
 *    Sin animación —`prefers-reduced-motion: reduce`, o un navegador que no la
 *    soporte— lo que queda es una sola foto fija, no un montón superpuesto.
 *    Ese es el mismo mecanismo que cumple «con movimiento reducido no autopasa»:
 *    la regla entera está envuelta en `prefers-reduced-motion: no-preference`,
 *    y no se delega en el `!important` global, que solo recorta duración e
 *    iteraciones y dejaría los `animation-delay` vivos.
 *
 *  - **Solo la primera foto es prioritaria.** Es la candidata a LCP y la única
 *    que se precarga; las demás salen perezosas para no disputarle la cola de
 *    descarga. Que estén dentro del viewport significa que el navegador las
 *    pedirá igualmente, pero después y con menos prioridad.
 *
 * ⚠️ **El `@keyframes` está calculado para CUATRO diapositivas** —cada una
 * visible una cuarta parte del ciclo— y el escalonado divide el ciclo entre 4.
 * Con otro número el reparto deja de cuadrar. Si algún día hacen falta cinco,
 * se escribe el `@keyframes` de cinco: no hay forma de expresar «1/n» en CSS
 * sin JavaScript, y fingir que la hay sería peor que la restricción.
 */
export default function CarruselFotos({
  diapositivas,
  proporcion,
  tamanos,
  className = '',
  children,
}: {
  diapositivas: Diapositiva[]
  proporcion: keyof typeof PROPORCIONES
  /** `sizes` de next/image. El mismo para todas: comparten hueco. */
  tamanos: string
  className?: string
  /** Se pinta por encima del velo, dentro del marco del carrusel. */
  children?: ReactNode
}) {
  return (
    <div
      className={`carrusel relative overflow-hidden bg-fondo-alt ${PROPORCIONES[proporcion]} ${className}`}
    >
      {diapositivas.map((d, i) => (
        <div
          key={d.imagen.src}
          className="carrusel__paso absolute inset-0"
          /* El índice viaja como propiedad personalizada y no como `:nth-child`
             a propósito: el velo y el titular también son hijos de este marco,
             y un selector posicional los contaría. */
          style={{ '--carrusel-i': i } as CSSProperties}
        >
          <Image
            src={d.imagen.src}
            alt={d.imagen.alt}
            fill
            sizes={tamanos}
            priority={i === 0}
            fetchPriority={i === 0 ? 'high' : undefined}
            className="object-cover"
          />
          {d.etiqueta ? <div className="absolute bottom-0 right-0">{d.etiqueta}</div> : null}
        </div>
      ))}
      {children}
    </div>
  )
}
