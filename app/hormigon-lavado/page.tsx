import type { Metadata } from 'next'
import Aparece from '@/components/ui/Aparece'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import TablaFichaTecnica from '@/components/datos/TablaFichaTecnica'
import Migas from '@/components/layout/Migas'
import SubmenuServicio from '@/components/secciones/SubmenuServicio'
import {
  DESCRIPCION_SERVICIO,
  HeroServicio,
  SeccionAplicaciones,
  SeccionCierre,
  SeccionComoTrabajamos,
  SeccionCuandoNo,
  SeccionMuestrario,
  SeccionObra,
  SeccionPrecio,
} from '@/components/secciones/ServicioPlantilla'
import { JsonLd, schemaServicio } from '@/lib/schema'
import { acabadosPorServicio, proyectosPorServicio } from '@/lib/datos'

export const metadata: Metadata = {
  title: 'Hormigón lavado y árido visto en Valencia',
  description:
    'Pavimento antideslizante de clase 3 para zonas peatonales, piscinas y accesos. Ficha técnica, acabados y precio orientativo.',
  alternates: { canonical: '/hormigon-lavado/' },
}

const anclas = [
  { id: 'seccion-aplicaciones', texto: '01 · Aplicaciones' },
  { id: 'seccion-muestrario', texto: '02 · Muestrario' },
  { id: 'seccion-ficha', texto: '03 · Ficha técnica' },
  { id: 'seccion-precio', texto: '04 · Precio' },
  { id: 'seccion-cuando-no', texto: '05 · Cuándo NO' },
  { id: 'seccion-como', texto: '06 · Cómo trabajamos' },
  { id: 'seccion-obra', texto: '07 · Obra ejecutada' },
]

/** Los tres espacios que nombra la meta descripción aprobada del §7.5, coherentes
 *  con la fila de precio «Zonas de paso y piscinas» del §03 · 5. */
const aplicaciones = [{ nombre: 'Zonas peatonales' }, { nombre: 'Piscinas' }, { nombre: 'Accesos' }]

/**
 * El único registro técnico real que tenía la web antigua y que el documento
 * maestro manda conservar y extender (§2.3 y 03-modelo-de-contenido §3):
 * HA-25, fibra de polipropileno, EHE-08 y clase 3 con Rd > 45. Los dos últimos
 * tiempos son los del §7.1 · 12, válidos para cualquier solera de hormigón.
 * Sin corchetes: aquí no hay ni una fila inventada.
 */
const fichaTecnica = [
  { etiqueta: 'HORMIGÓN', valor: 'HA-25 según EHE-08' },
  { etiqueta: 'FIBRA', valor: 'Polipropileno' },
  { etiqueta: 'RESISTENCIA AL DESLIZAMIENTO', valor: 'Clase 3, Rd > 45' },
  { etiqueta: 'TRÁNSITO PEATONAL', valor: '24-48 h' },
  { etiqueta: 'CURADO COMPLETO', valor: '28 días' },
]

const acabados = acabadosPorServicio('lavado')
const proyectos = proyectosPorServicio('lavado').slice(0, 3)

export default function HormigonLavado() {
  return (
    <>
      <JsonLd data={schemaServicio('lavado', 'Hormigón lavado', '/hormigon-lavado/')} />
      <Migas items={[{ nombre: 'Servicios' }, { nombre: 'Hormigón lavado' }]} />

      <HeroServicio
        titulo="Hormigón lavado en Valencia, Castellón y Alicante"
        entradilla={DESCRIPCION_SERVICIO.lavado}
        lineasEtiqueta={['LAVADO', 'HA-25 · EHE-08 · CLASE 3 Rd>45']}
        secundario={{ href: '#seccion-ficha', texto: 'Ver la ficha técnica' }}
      />

      <SubmenuServicio anclas={anclas} />

      <SeccionAplicaciones numero="01" aplicaciones={aplicaciones} />
      <SeccionMuestrario numero="02" servicio="lavado" acabados={acabados} />

      <Aparece as="section" id="seccion-ficha" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
          <AntetituloSeccion numero="03">Ficha técnica</AntetituloSeccion>
          <TablaFichaTecnica filas={fichaTecnica} />
        </div>
      </Aparece>

      <SeccionPrecio
        numero="04"
        filas={[{ uso: 'Zonas de paso y piscinas', rango: '30-42' }]}
        usos={[{ id: 'peatonal', etiqueta: 'Zonas de paso y piscinas', rango: [30, 42] }]}
      />
      <SeccionCuandoNo numero="05" titulo="Cuándo NO elegir lavado" />
      <SeccionComoTrabajamos numero="06" />
      <SeccionObra numero="07" proyectos={proyectos} />
      <SeccionCierre />
    </>
  )
}
