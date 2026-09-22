import type { ReactNode } from 'react'
import { EnlaceEtiqueta } from '../ui/EnlaceEtiqueta'
import Migas from '../layout/Migas'

export type SeccionLegal = { titulo: string; contenido: ReactNode }

/**
 * Subtítulo dentro de una sección legal: mono, versalitas y acero, como toda
 * etiqueta del sitio, pegado a lo suyo con un hueco menor que el que separa los
 * bloques entre sí. Es lo único que agrupa seis definiciones seguidas en una
 * columna de 68ch.
 *
 * Vivía suelto dentro de `app/politica-de-cookies/page.tsx`. Al rehacerse los
 * tres documentos lo necesitan también privacidad —finalidades, destinatarios,
 * transferencias— y aquí no hay nada de la política de cookies: es el tercer
 * nivel de la plantilla, y su sitio es la plantilla.
 */
export function BloqueLegal({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-mono text-d-12 tracking-[0.05em] uppercase text-acero">{titulo}</h3>
      {children}
    </div>
  )
}

/**
 * 02-pantallas.md §B7: una sola plantilla para aviso legal, privacidad y
 * cookies. Sin hero, sin CTA, sin imágenes y sin ocre — la única página del
 * sitio sin acento.
 *
 * **Qué cambia respecto de la versión anterior.** `secciones` era una lista de
 * títulos y la plantilla pintaba debajo de cada uno el mismo bloque de relleno
 * entre corchetes. Ahora cada sección trae su texto, porque el texto ya existe:
 * lo trajo el dueño. El resto de la pantalla —migas, H1 a 46, fecha en mono 11,
 * índice de enlaces-etiqueta, columna de 68ch y `h2` a 26 con `border-top`— es
 * el mismo §B7 de antes.
 *
 * ⚠️ Los anclajes siguen siendo `#seccion-<i>` por índice y no un slug del
 * título: `app/globals.css` cuelga el `scroll-margin-top` de
 * `[id^='seccion-']`, y sin ese margen el destino queda debajo de la cabecera
 * fija. Cambiar el patrón de id rompe el salto en las tres páginas sin romper
 * el build.
 *
 * `entradilla` es para el párrafo de arranque que en el documento original va
 * bajo un encabezado que repite el título de la página. Ese encabezado no se
 * publica —ya es el `<h1>`—, así que su texto necesita un sitio donde vivir que
 * no sea una sección con título duplicado.
 *
 * Componente de servidor: son tres documentos de texto, no hay un solo estado.
 */
export default function PlantillaLegal({
  titulo,
  ultimaActualizacion,
  entradilla,
  secciones,
}: {
  titulo: string
  /** `ReactNode` y no `string`: mientras el dueño no fije la fecha, es un `<DatoPendiente>`. */
  ultimaActualizacion: ReactNode
  entradilla?: ReactNode
  secciones: SeccionLegal[]
}) {
  return (
    <>
      <Migas items={[{ nombre: titulo }]} />

      <section className="px-[18px] md:px-lat-desktop pb-8 flex flex-col items-center">
        <div className="w-full max-w-lectura flex flex-col gap-2">
          <h1 className="font-display font-bold fs-h2 text-46 m-0">{titulo}</h1>
          <span className="font-mono text-d-11 text-tinta-media">
            Última actualización: {ultimaActualizacion}
          </span>
          {entradilla ? (
            <div className="texto-legal text-16 flex flex-col gap-4 pt-4">{entradilla}</div>
          ) : null}
        </div>
      </section>

      <section className="px-[18px] md:px-lat-desktop pb-8 flex flex-col items-center">
        <nav aria-label="Índice" className="w-full max-w-lectura flex flex-col gap-1">
          {secciones.map((seccion, i) => (
            <EnlaceEtiqueta key={seccion.titulo} href={`#seccion-${i}`} className="border-b-0">
              {seccion.titulo}
            </EnlaceEtiqueta>
          ))}
        </nav>
      </section>

      <section className="px-[18px] md:px-lat-desktop py-9 flex flex-col items-center">
        <div className="w-full max-w-lectura flex flex-col gap-8">
          {secciones.map((seccion, i) => (
            <article
              key={seccion.titulo}
              id={`seccion-${i}`}
              className="flex flex-col gap-4 border-t border-tinta pt-6"
            >
              <h2 className="font-display font-bold fs-h3 text-26 m-0">{seccion.titulo}</h2>
              <div className="texto-legal text-16 flex flex-col gap-4">{seccion.contenido}</div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
