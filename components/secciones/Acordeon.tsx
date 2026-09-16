export type PreguntaFAQ = { pregunta: string; respuesta: string }

/**
 * README §7: uno abierto de inicio, el resto cerrados; al abrir uno se cierra el anterior.
 *
 * Acordeón exclusivo nativo (`<details name>`): el navegador cierra el anterior sin JS,
 * la respuesta está siempre en el DOM —ya no hay `aria-controls` apuntando a un nodo que
 * no existe— y el componente vuelve a ser de servidor. Donde el acordeón exclusivo aún no
 * esté soportado, degrada a varios paneles abiertos a la vez, nunca a ninguno.
 *
 * `nombre` solo hace falta si una misma pantalla monta dos acordeones independientes.
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
