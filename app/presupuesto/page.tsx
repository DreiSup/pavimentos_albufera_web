import type { Metadata } from 'next'
import Boton from '@/components/ui/Boton'
import DatoPendiente from '@/components/datos/DatoPendiente'
import EtiquetaTecnica from '@/components/datos/EtiquetaTecnica'
import Migas from '@/components/layout/Migas'
import FormularioPresupuesto from '@/components/secciones/FormularioPresupuesto'
import { nap } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Pide presupuesto sin compromiso',
  description:
    'Cuéntanos qué quieres pavimentar. Vamos a verlo sin coste y te damos un precio cerrado en 48 horas.',
  alternates: { canonical: '/presupuesto/' },
}

export default function Presupuesto() {
  return (
    <>
      <Migas items={[{ nombre: 'Presupuesto' }]} />

      <section className="px-[18px] md:px-lat-desktop py-9 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="flex flex-col gap-6 order-2 md:order-1 md:sticky md:top-[100px] md:self-start">
            <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
              Pide presupuesto
            </h1>
            <p className="text-16 md:text-20 text-tinta-media m-0">
              Cuéntanos qué quieres pavimentar. Vamos a verlo sin coste y te damos un precio
              cerrado en <DatoPendiente>48 horas</DatoPendiente>.
            </p>
            <EtiquetaTecnica
              lineas={[
                '17 AÑOS DE OFICIO',
                'GARANTÍA DE 10 AÑOS CON MANTENIMIENTO',
                'VALENCIA, CASTELLÓN Y ALICANTE',
                'MÁS DE 3 DE CADA 10 CLIENTES VUELVEN A LLAMARNOS',
              ]}
            />
            <div className="hidden md:flex flex-col gap-3">
              <Boton variante="tinta" href={nap.telefonoHref ?? '#'}>
                Llamar al {nap.telefono ?? nap.telefonoMostrado}
              </Boton>
              <Boton variante="contorno" href={nap.whatsappHref ?? '#'}>
                WhatsApp
              </Boton>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <FormularioPresupuesto variante="completo" />
          </div>

          <div className="md:hidden order-3 flex flex-col gap-3">
            <Boton variante="tinta" href={nap.telefonoHref ?? '#'}>
              Llamar al {nap.telefono ?? nap.telefonoMostrado}
            </Boton>
            <Boton variante="contorno" href={nap.whatsappHref ?? '#'}>
              WhatsApp
            </Boton>
          </div>
        </div>
      </section>
    </>
  )
}
