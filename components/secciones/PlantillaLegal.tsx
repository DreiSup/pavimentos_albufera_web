import { EnlaceEtiqueta } from '../ui/EnlaceEtiqueta'
import Migas from '../layout/Migas'

export default function PlantillaLegal({
  titulo,
  ultimaActualizacion,
  secciones,
}: {
  titulo: string
  ultimaActualizacion: string
  secciones: string[]
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
        </div>
      </section>

      <section className="px-[18px] md:px-lat-desktop pb-8 flex flex-col items-center">
        <nav aria-label="Índice" className="w-full max-w-lectura flex flex-col gap-1">
          {secciones.map((s, i) => (
            <EnlaceEtiqueta key={s} href={`#seccion-${i}`} className="border-b-0">
              {s}
            </EnlaceEtiqueta>
          ))}
        </nav>
      </section>

      <section className="px-[18px] md:px-lat-desktop py-9 flex flex-col items-center">
        <div className="w-full max-w-lectura flex flex-col gap-8">
          {secciones.map((s, i) => (
            <div key={s} id={`seccion-${i}`} className="flex flex-col gap-3 border-t border-tinta pt-6">
              <h2 className="font-display font-bold fs-h3 text-26 m-0">{s}</h2>
              <div className="border border-dashed border-tinta-media p-4">
                <p className="pendiente text-16 m-0">
                  [Texto legal pendiente de redacción y revisión por asesoría.]
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
