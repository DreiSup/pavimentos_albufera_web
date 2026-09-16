import type { Metadata } from 'next'
import Migas from '@/components/layout/Migas'
import SubmenuServicio from '@/components/secciones/SubmenuServicio'
import {
  DESCRIPCION_SERVICIO,
  HeroServicio,
  SeccionAplicaciones,
  SeccionCierre,
  SeccionComoSeHace,
  SeccionComoTrabajamos,
  SeccionCuandoNo,
  SeccionMuestrario,
  SeccionObra,
  SeccionPrecio,
} from '@/components/secciones/ServicioPlantilla'
import { JsonLd, schemaServicio } from '@/lib/schema'
import { acabadosPorServicio, articuloQueExplica, proyectosPorServicio } from '@/lib/datos'

export const metadata: Metadata = {
  title: 'Hormigón pulido Valencia | Interior e industrial',
  description:
    'Hormigón pulido para naves, parkings, garajes e interiores de vivienda. Precio por m², ficha técnica y obras ejecutadas.',
  alternates: { canonical: '/hormigon-pulido/' },
}

const anclas = [
  { id: 'seccion-aplicaciones', texto: '01 · Aplicaciones' },
  { id: 'seccion-muestrario', texto: '02 · Muestrario' },
  { id: 'seccion-precio', texto: '03 · Precio' },
  { id: 'seccion-cuando-no', texto: '04 · Cuándo NO' },
  { id: 'seccion-como', texto: '05 · Cómo trabajamos' },
  { id: 'seccion-obra', texto: '06 · Obra ejecutada' },
]

/** Los cuatro espacios que nombra la meta descripción aprobada del §7.5, sin matiz
 *  añadido: el §7.2 solo desarrolla las aplicaciones del hormigón impreso. */
const aplicaciones = [
  { nombre: 'Naves' },
  { nombre: 'Parkings' },
  { nombre: 'Garajes' },
  { nombre: 'Interiores de vivienda' },
]

const acabados = acabadosPorServicio('pulido')
const proyectos = proyectosPorServicio('pulido').slice(0, 3)
const articulo = articuloQueExplica('pulido')

export default function HormigonPulido() {
  return (
    <>
      <JsonLd data={schemaServicio('pulido', 'Hormigón pulido', '/hormigon-pulido/')} />
      <Migas items={[{ nombre: 'Servicios' }, { nombre: 'Hormigón pulido' }]} />

      <HeroServicio
        titulo="Hormigón pulido en Valencia, Castellón y Alicante"
        entradilla={DESCRIPCION_SERVICIO.pulido}
        lineasEtiqueta={['PULIDO']}
        secundario={{ href: '#seccion-muestrario', texto: 'Ver acabados de pulido' }}
      />

      <SubmenuServicio anclas={anclas} />

      <SeccionAplicaciones numero="01" aplicaciones={aplicaciones} />
      <SeccionMuestrario numero="02" servicio="pulido" acabados={acabados} />
      <SeccionPrecio
        numero="03"
        filas={[
          { uso: 'Interior de vivienda', rango: '30-45' },
          { uso: 'Nave, parking o industrial', rango: '22-35' },
        ]}
        usos={[
          { id: 'interior', etiqueta: 'Interior de vivienda', rango: [30, 45] },
          { id: 'industrial', etiqueta: 'Nave, parking o industrial', rango: [22, 35] },
        ]}
      />
      <SeccionCuandoNo numero="04" titulo="Cuándo NO elegir pulido" />
      <SeccionComoTrabajamos numero="05" />
      <SeccionObra numero="06" proyectos={proyectos} />
      {articulo ? <SeccionComoSeHace articulo={articulo} /> : null}
      <SeccionCierre />
    </>
  )
}
