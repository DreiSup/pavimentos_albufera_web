'use client'

import { EVENTOS, registrarEvento, type TemaFAQ } from '@/lib/eventos'

export type PreguntaFAQ = { pregunta: string; respuesta: string; tema: TemaFAQ }

/**
 * README §7: uno abierto de inicio, el resto cerrados; al abrir uno se cierra el anterior.
 *
 * Acordeón exclusivo nativo (`<details name>`): el navegador cierra el anterior él solo,
 * sin estado en React y sin `aria-controls` apuntando a un nodo que todavía no existe.
 * Lo que se gana frente a montar y desmontar el panel: **las respuestas están siempre en
 * el HTML**. Con el acordeón de estado solo viajaba la abierta, así que cuatro de las
 * cinco respuestas no estaban ni para el rastreador ni para el buscador de la página, y
 * eso en un bloque de FAQ es justo el contenido que se quiere indexar.
 *
 * Sigue siendo `'use client'` por una sola razón: medir. Cada apertura es una objeción
 * declarada sin coste, y el ranking de temas abiertos es material directo para el copy de
 * anuncios y para el guion de WhatsApp. Por eso `tema` es obligatorio en el tipo — sin él
 * el evento llega, pero no dice nada. Lo único que cruza la frontera es el manejador: no
 * hay `useState`, así que el componente nunca se vuelve a renderizar.
 *
 * Donde el acordeón exclusivo aún no esté soportado degrada a varios paneles abiertos a
 * la vez, nunca a ninguno. `nombre` solo hace falta si una misma pantalla monta dos
 * acordeones independientes.
 */
export default function Acordeon({
  preguntas,
  nombre = 'faq',
}: {
  preguntas: PreguntaFAQ[]
  nombre?: string
}) {
  return (
    <div className="flex flex-col">
      {preguntas.map((item, i) => (
        <details
          key={item.pregunta}
          name={nombre}
          open={i === 0}
          onToggle={(e) => {
            // Solo al abrir. Cerrar no es una señal de intención.
            if (!e.currentTarget.open) return
            registrarEvento(EVENTOS.faqOpen, {
              params: { question_topic: item.tema, question_id: item.pregunta.slice(0, 100) },
            })
          }}
          className="group border-t border-tinta last:border-b"
        >
          <summary className="min-h-[56px] flex items-center justify-between gap-4 text-left cursor-pointer list-none [&::-webkit-details-marker]:hidden font-sans font-semibold text-16 md:text-20 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pigmento">
            <span>{item.pregunta}</span>
            <span aria-hidden="true" className="font-mono text-16 shrink-0">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <div className="pb-4 text-16 text-tinta-media max-w-lectura">{item.respuesta}</div>
        </details>
      ))}
    </div>
  )
}
