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
  SeccionPrecio,
} from '@/components/secciones/ServicioPlantilla'
import { JsonLd, schemaServicio } from '@/lib/schema'
import { articuloQueExplica } from '@/lib/datos'

/** El §7.5 no trae metadatos para fratasado ni desactivado: la descripción es la
 *  línea aprobada del §7.1 · 05 más la cobertura real, sin frase nueva. */
export const metadata: Metadata = {
  title: 'Hormigón desactivado en Valencia, Castellón y Alicante',
  description:
    'Hormigón desactivado en Valencia, Castellón y Alicante. Piedra vista con la resistencia de una solera.',
  alternates: { canonical: '/hormigon-desactivado/' },
}

const anclas = [
  { id: 'seccion-precio', texto: '01 · Precio' },
  { id: 'seccion-cuando-no', texto: '02 · Cuándo NO' },
  { id: 'seccion-como', texto: '03 · Cómo trabajamos' },
]

const articulo = articuloQueExplica('desactivado')

export default function HormigonDesactivado() {
  return (
    <>
      <JsonLd
        data={schemaServicio('desactivado', 'Hormigón desactivado', '/hormigon-desactivado/')}
      />
      <Migas items={[{ nombre: 'Servicios' }, { nombre: 'Hormigón desactivado' }]} />

      <HeroServicio
        titulo="Hormigón desactivado en Valencia, Castellón y Alicante"
        entradilla={DESCRIPCION_SERVICIO.desactivado}
        lineasEtiqueta={['DESACTIVADO']}
        secundario={{ href: '/acabados/', texto: 'Ver el muestrario' }}
      />

      <SubmenuServicio anclas={anclas} />

      {/* La página más corta de las seis, y a propósito: el desactivado no tiene ni
          un acabado en el muestrario ni una obra documentada en `content/`, así que
          no hay sección de muestrario ni de obra ejecutada que enseñar. Existe porque
          la redirección 301 del artículo antiguo aterriza aquí y porque el pie la
          enlaza en todas las páginas. */}

      <SeccionPrecio numero="01" filas={[{ uso: 'Peatonal y accesos', rango: null }]} />
      <SeccionCuandoNo numero="02" titulo="Cuándo NO elegir desactivado" />
      <SeccionComoTrabajamos numero="03" />
      {articulo ? <SeccionComoSeHace articulo={articulo} /> : null}
      <SeccionCierre />
    </>
  )
}
