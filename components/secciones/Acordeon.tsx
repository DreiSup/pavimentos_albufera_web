'use client'

import { useState } from 'react'
import { EVENTOS, registrarEvento, type TemaFAQ } from '@/lib/eventos'

export type PreguntaFAQ = { pregunta: string; respuesta: string; tema: TemaFAQ }

/**
 * Uno abierto de inicio, el resto cerrados. Al abrir uno se cierra el anterior.
 *
 * Cada apertura se mide: es una objeción declarada sin coste, y el ranking de
 * temas abiertos es material directo para el copy de anuncios y para el guion
 * de WhatsApp. Por eso `tema` es obligatorio en el tipo — sin él el evento
 * llega, pero no dice nada.
 */
export default function Acordeon({ preguntas }: { preguntas: PreguntaFAQ[] }) {
  const [abierta, setAbierta] = useState(0)

  function alternar(i: number, abierto: boolean, item: PreguntaFAQ) {
    setAbierta(abierto ? -1 : i)
    // Solo al abrir. Cerrar no es una señal de intención.
    if (!abierto) {
      registrarEvento(EVENTOS.faqOpen, {
        params: { question_topic: item.tema, question_id: item.pregunta.slice(0, 100) },
      })
    }
  }

  return (
    <div className="flex flex-col">
      {preguntas.map((item, i) => {
        const abierto = abierta === i
        return (
          <div key={item.pregunta} className="border-t border-tinta last:border-b">
            <button
              type="button"
              aria-expanded={abierto}
              aria-controls={`faq-panel-${i}`}
              onClick={() => alternar(i, abierto, item)}
              className="w-full min-h-[56px] flex items-center justify-between gap-4 text-left font-sans font-semibold text-16 md:text-20 py-3"
            >
              <span>{item.pregunta}</span>
              <span aria-hidden="true" className="font-mono text-16 shrink-0">
                {abierto ? '−' : '+'}
              </span>
            </button>
            {abierto ? (
              <div id={`faq-panel-${i}`} className="pb-4 text-16 text-tinta-media max-w-lectura">
                {item.respuesta}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
