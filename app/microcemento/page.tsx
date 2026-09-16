import type { Metadata } from 'next'
import Aparece from '@/components/ui/Aparece'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Migas from '@/components/layout/Migas'
import Acordeon from '@/components/secciones/Acordeon'
import SubmenuServicio from '@/components/secciones/SubmenuServicio'
import {
  DESCRIPCION_SERVICIO,
  HeroServicio,
  SeccionAplicaciones,
  SeccionCierre,
  SeccionCuandoNo,
  SeccionMuestrario,
  SeccionPrecio,
} from '@/components/secciones/ServicioPlantilla'
import { JsonLd, schemaServicio } from '@/lib/schema'
import { acabadosPorServicio } from '@/lib/datos'

export const metadata: Metadata = {
  title: 'Microcemento en Valencia | Sin obra ni escombros',
  description:
    'Renueva suelos, baños y paredes sin picar lo que ya tienes. Microcemento aplicado sobre azulejo, terrazo o gres. Precio y proyectos.',
  alternates: { canonical: '/microcemento/' },
}

const anclas = [
  { id: 'seccion-aplicaciones', texto: '01 · Aplicaciones' },
  { id: 'seccion-muestrario', texto: '02 · Muestrario' },
  { id: 'seccion-precio', texto: '03 · Precio' },
  { id: 'seccion-cuando-no', texto: '04 · Cuándo NO' },
]

/** Las tres superficies que nombra la meta descripción aprobada del §7.5. */
const aplicaciones = [{ nombre: 'Suelos' }, { nombre: 'Baños' }, { nombre: 'Paredes' }]

/**
 * Única pregunta del §7.1 · 12 que responde de verdad sobre microcemento, literal.
 * No se marca FAQPage aquí: la misma pregunta ya va marcada en la home y duplicar
 * el schema en dos rutas no aporta nada.
 */
const faqServicio = [
  {
    pregunta: '¿Se puede poner encima del suelo que ya tengo?',
    respuesta:
      'En hormigón impreso, no lo recomendamos: la adherencia y el espesor no quedan garantizados. En microcemento sí, y ahí está su gran ventaja: se aplica sobre azulejo, terrazo o gres sin picar nada.',
  },
]

const acabados = acabadosPorServicio('microcemento')

export default function Microcemento() {
  return (
    <>
      <JsonLd data={schemaServicio('microcemento', 'Microcemento', '/microcemento/')} />
      <Migas items={[{ nombre: 'Servicios' }, { nombre: 'Microcemento' }]} />

      <HeroServicio
        titulo="Microcemento en Valencia, Castellón y Alicante"
        entradilla={DESCRIPCION_SERVICIO.microcemento}
        lineasEtiqueta={['MICROCEMENTO']}
        secundario={{ href: '#seccion-muestrario', texto: 'Ver acabados de microcemento' }}
      />

      <SubmenuServicio anclas={anclas} />

      <SeccionAplicaciones numero="01" aplicaciones={aplicaciones} />
      <SeccionMuestrario numero="02" servicio="microcemento" acabados={acabados} />
      <SeccionPrecio
        numero="03"
        filas={[{ uso: 'Sobre suelo existente', rango: '55-85' }]}
        usos={[{ id: 'sobre-existente', etiqueta: 'Sobre suelo existente', rango: [55, 85] }]}
      />
      <SeccionCuandoNo numero="04" titulo="Cuándo NO elegir microcemento" />

      {/* Sin «Cómo trabajamos»: los cuatro pasos del §7.1 · 07 describen la ejecución de
          una solera de hormigón —plazo de 2 o 3 días y 28 días de curado—, que no es lo
          que pasa en un microcemento aplicado sobre el pavimento existente. Copiarlos aquí
          sería afirmar algo falso del material. */}

      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
          <AntetituloSeccion numero="05">Preguntas frecuentes</AntetituloSeccion>
          <Acordeon preguntas={faqServicio} />
        </div>
      </Aparece>

      <SeccionCierre />
    </>
  )
}
