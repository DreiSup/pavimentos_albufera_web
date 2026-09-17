import type { Metadata } from 'next'
import Aparece from '@/components/ui/Aparece'
import Boton from '@/components/ui/Boton'
import { EnlaceEtiqueta } from '@/components/ui/EnlaceEtiqueta'
import Foto from '@/components/contenido/Foto'
import DatoPendiente from '@/components/datos/DatoPendiente'
import Migas from '@/components/layout/Migas'

export const metadata: Metadata = {
  title: 'Quiénes somos | Pavimentos Albufera',
  description:
    '17 años pavimentando en la Comunidad Valenciana. Equipo propio, garantía de 10 años y más de un 30 % de clientes que repiten.',
  alternates: { canonical: '/empresa/' },
}

export default function Empresa() {
  return (
    <>
      <Migas items={[{ nombre: 'Empresa' }]} />

      <section className="px-[18px] md:px-lat-desktop pb-8 md:pb-14">
        <div className="flex flex-col gap-4 max-w-[70ch]">
          <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
            17 años poniendo hormigón en la Comunidad Valenciana
          </h1>
          <p className="text-16 md:text-20 text-tinta-media m-0">
            Empezamos en Sollana en <DatoPendiente>2009</DatoPendiente>. Desde entonces hemos
            ejecutado <DatoPendiente>X.000</DatoPendiente> metros cuadrados de pavimento entre
            Valencia, Castellón y Alicante: entradas de casas, porches, contornos de piscina,
            naves, parkings y urbanizaciones enteras.
          </p>
        </div>
      </section>

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="flex flex-col gap-4">
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">Cómo trabajamos</h2>
            <p className="text-20 font-semibold text-tinta m-0">
              <DatoPendiente>Equipo propio.</DatoPendiente> El que va a verte es el que mide, y el
              que mide es del equipo que ejecuta. No subcontratamos la obra a terceros, y por eso
              podemos dar 10 años de garantía sin letra pequeña.
            </p>
            <p className="text-20 font-semibold text-tinta m-0">
              Cuidamos especialmente la parte que no se ve: la preparación del soporte. Es donde se
              decide si un pavimento aguanta 20 años o empieza a fisurarse en dos. Compactación,
              nivelación, drenaje y armado antes de que llegue el primer camión de hormigón.
            </p>
          </div>
          <Foto
            proporcion="4/3"
            tamanos="(min-width: 768px) 50vw, 100vw"
            imagen={{
              src: '/obras/_sin-atribuir/pavimentos-hormigon-valencia-precios.jpg',
              alt: 'Tres operarios reglando a mano una solera de hormigón fresco en una acera, con el encofrado todavía puesto.',
              tipo: 'proceso',
            }}
          />
        </div>
      </Aparece>

      <Aparece as="section" className="sobre-oscuro bg-tinta text-fondo px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-4 max-w-[70ch]">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            Por qué nos vuelven a llamar
          </h2>
          <p className="text-16 md:text-20 text-sobre-tinta m-0">
            Más de 3 de cada 10 trabajos que hacemos son para clientes que ya nos habían
            contratado. Alguien que te llama por segunda vez es la única recomendación que no se
            puede comprar.
          </p>
        </div>
      </Aparece>

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-3">
          <h2 className="font-display font-bold fs-h3 text-26 m-0">
            También construimos pistas de pádel y pickleball
          </h2>
          <p className="text-16 text-tinta-media max-w-lectura m-0">
            Con la misma base técnica: solera, drenaje y superficie deportiva.
          </p>
          <EnlaceEtiqueta href="https://padelalbufera.com/" target="_blank" rel="noopener noreferrer">
            Pádel &amp; Pickleball Albufera →
          </EnlaceEtiqueta>
        </div>
      </Aparece>

      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            Cuéntanos qué quieres hacer
          </h2>
          <Boton variante="primario" href="/presupuesto/">
            Pedir presupuesto
          </Boton>
        </div>
      </Aparece>
    </>
  )
}
