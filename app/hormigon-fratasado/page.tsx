import type { Metadata } from 'next'
import Migas from '@/components/layout/Migas'
import SubmenuServicio from '@/components/secciones/SubmenuServicio'
import {
  DESCRIPCION_SERVICIO,
  HeroServicio,
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

/** El §7.5 no trae metadatos para fratasado ni desactivado: la descripción es la
 *  línea aprobada del §7.1 · 05 más la cobertura real, sin frase nueva. */
export const metadata: Metadata = {
  title: 'Hormigón fratasado en Valencia, Castellón y Alicante',
  description:
    'Hormigón fratasado en Valencia, Castellón y Alicante. Acabado fino y mate. Sobrio, moderno y económico.',
  alternates: { canonical: '/hormigon-fratasado/' },
}

const anclas = [
  { id: 'seccion-muestrario', texto: '01 · Muestrario' },
  { id: 'seccion-precio', texto: '02 · Precio' },
  { id: 'seccion-cuando-no', texto: '03 · Cuándo NO' },
  { id: 'seccion-como', texto: '04 · Cómo trabajamos' },
  { id: 'seccion-obra', texto: '05 · Obra ejecutada' },
]

const acabados = acabadosPorServicio('fratasado')
const proyectos = proyectosPorServicio('fratasado').slice(0, 3)
const articulo = articuloQueExplica('fratasado')

export default function HormigonFratasado() {
  return (
    <>
      <JsonLd data={schemaServicio('fratasado', 'Hormigón fratasado', '/hormigon-fratasado/')} />
      <Migas items={[{ nombre: 'Servicios' }, { nombre: 'Hormigón fratasado' }]} />

      <HeroServicio
        titulo="Hormigón fratasado en Valencia, Castellón y Alicante"
        entradilla={DESCRIPCION_SERVICIO.fratasado}
        lineasEtiqueta={['FRATASADO']}
        secundario={{ href: '#seccion-muestrario', texto: 'Ver acabados de fratasado' }}
      />

      <SubmenuServicio anclas={anclas} />

      {/* Sin «Aplicaciones»: el documento maestro no da ni un espacio de uso para
          fratasado, y una lista de aplicaciones es exactamente el sitio donde
          inventar texto pasaría desapercibido. */}

      <SeccionMuestrario numero="01" servicio="fratasado" acabados={acabados} />
      <SeccionPrecio numero="02" filas={[{ uso: 'Peatonal', rango: null }]} />
      <SeccionCuandoNo numero="03" titulo="Cuándo NO elegir fratasado" />
      <SeccionComoTrabajamos numero="04" />
      <SeccionObra numero="05" proyectos={proyectos} />
      {articulo ? <SeccionComoSeHace articulo={articulo} /> : null}
      <SeccionCierre />
    </>
  )
}
