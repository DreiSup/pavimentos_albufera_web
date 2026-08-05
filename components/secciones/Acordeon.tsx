'use client'

import { useState } from 'react'

export type PreguntaFAQ = { pregunta: string; respuesta: string }

/** Uno abierto de inicio, el resto cerrados. Al abrir uno se cierra el anterior. */
export default function Acordeon({ preguntas }: { preguntas: PreguntaFAQ[] }) {
  const [abierta, setAbierta] = useState(0)

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
              onClick={() => setAbierta(abierto ? -1 : i)}
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
