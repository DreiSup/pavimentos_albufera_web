import type { Metadata } from 'next'
import Aparece from '@/components/ui/Aparece'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Boton from '@/components/ui/Boton'
import DatoPendiente from '@/components/datos/DatoPendiente'
import Migas from '@/components/layout/Migas'
import Calculadora from '@/components/secciones/Calculadora'

export const metadata: Metadata = {
  title: 'Precio del hormigón impreso por m² en 2026',
  description:
    'Rangos reales en la Comunidad Valenciana, qué incluye cada presupuesto y por qué desconfiar de una oferta por debajo de 20 €/m².',
  alternates: { canonical: '/precios/' },
}

const filas = [
  { servicio: 'Hormigón impreso', uso: 'Peatonal (patios, porches, jardines)', rango: '28-38' },
  { servicio: 'Hormigón impreso', uso: 'Paso de vehículos (entradas, rampas)', rango: '35-48' },
  { servicio: 'Hormigón pulido', uso: 'Interior de vivienda', rango: '30-45' },
  { servicio: 'Hormigón pulido', uso: 'Nave, parking o industrial', rango: '22-35' },
  { servicio: 'Microcemento', uso: 'Sobre suelo existente', rango: '55-85' },
  { servicio: 'Hormigón lavado', uso: 'Zonas de paso y piscinas', rango: '30-42' },
  { servicio: 'Hormigón fratasado', uso: 'Peatonal', rango: 'pendiente' },
  { servicio: 'Hormigón desactivado', uso: 'Peatonal y accesos', rango: 'pendiente' },
]

export default function Precios() {
  return (
    <>
      <Migas items={[{ nombre: 'Precios' }]} />

      <section className="grid grid-cols-1 md:grid-cols-[1fr_520px] gap-8 md:gap-16 px-[18px] md:px-lat-desktop pb-8 md:pb-14">
        <div className="flex flex-col justify-center gap-4">
          <AntetituloSeccion>Precios orientativos · sin IVA</AntetituloSeccion>
          <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
            Te decimos lo que cuesta antes de que preguntes
          </h1>
          <p className="text-16 md:text-20 text-tinta-media max-w-[52ch] m-0">
            El precio de un pavimento depende de la superficie, del uso que le vayas a dar y del
            estado en que esté el terreno. Estos son nuestros rangos habituales en la Comunidad
            Valenciana, con material y mano de obra incluidos.
          </p>
        </div>
      </section>

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="hidden md:grid grid-cols-[1fr_300px_300px] gap-6 font-mono text-d-11 text-acero uppercase pb-3 border-b border-tinta">
          <span>Servicio</span>
          <span>Uso</span>
          <span>Rango habitual</span>
        </div>
        <div className="flex flex-col">
          {filas.map((fila, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[1fr_300px_300px] gap-1 md:gap-6 py-4 border-b border-fondo-alt"
            >
              <span className="font-display font-bold text-16 md:text-20">{fila.servicio}</span>
              <span className="text-14 md:text-16 text-tinta-media">{fila.uso}</span>
              <span className="font-mono text-20">
                <DatoPendiente>{fila.rango}</DatoPendiente> {fila.rango !== 'pendiente' ? '€/m²' : ''}
              </span>
            </div>
          ))}
        </div>
      </Aparece>

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        {/* Rango por uso genérico, derivado de las filas de la tabla: peatonal→impreso peatonal,
            vehículos→impreso vehicular, industrial→pulido nave/parking. */}
        <Calculadora
          usos={[
            { id: 'peatonal', etiqueta: 'Peatonal', rango: [28, 38] },
            { id: 'vehiculos', etiqueta: 'Vehículos', rango: [35, 48] },
            { id: 'industrial', etiqueta: 'Industrial', rango: [22, 35] },
          ]}
        />
      </Aparece>

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="font-mono text-d-11 text-acero uppercase m-0 mb-3">Incluido siempre</p>
            <ul className="flex flex-col gap-2 text-16 text-tinta-media m-0 pl-5">
              <li>Preparación del soporte</li>
              <li>Mallazo</li>
              <li>Fibra de polipropileno</li>
              <li>Hormigón de 10 cm</li>
              <li>Molde, pigmento y desmoldeante</li>
              <li>Sellado final</li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-d-11 text-acero uppercase m-0 mb-3">Se presupuesta aparte</p>
            <ul className="flex flex-col gap-2 text-16 text-tinta-media m-0 pl-5">
              <li>Demolición del pavimento anterior</li>
              <li>Movimiento de tierras</li>
              <li>Drenajes</li>
              <li>Rebajes de acceso difícil</li>
            </ul>
          </div>
        </div>
      </Aparece>

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="bg-fondo-alt p-6 md:p-10 flex flex-col gap-3">
          <h2 className="font-display font-bold fs-h3 text-26 m-0">
            ¿Qué pasa si el presupuesto que tienes es de 18 €/m²?
          </h2>
          <p className="text-16 md:text-20 text-tinta-media max-w-lectura m-0">
            Que revises qué incluye. A ese precio no salen los materiales de una solera de 10 cm con
            mallazo y fibra. Normalmente falta el hormigón, el armado o el sellado, y aparece en la
            factura final.
          </p>
        </div>
      </Aparece>

      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            Pide un presupuesto cerrado
          </h2>
          <Boton variante="primario" href="/presupuesto/">
            Pedir presupuesto
          </Boton>
        </div>
      </Aparece>
    </>
  )
}
