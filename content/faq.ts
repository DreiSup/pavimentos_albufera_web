import type { PreguntaFAQ } from '@/components/secciones/Acordeon'

/**
 * Catálogo único de preguntas. Antes estaban copiadas literalmente en
 * `app/page.tsx`, `app/hormigon-impreso/page.tsx` y `app/zonas/[municipio]/page.tsx`
 * — el mismo texto en tres sitios, que es justo el contenido duplicado que
 * `05-pendientes-y-decisiones.md` §D señala como riesgo heredado de la web actual.
 *
 * Cada página escoge su subconjunto de aquí y se lo pasa al acordeón Y al
 * `schemaFAQ()`, que es lo que exige `04-desarrollo-y-deploy.md` §5: el marcado
 * y lo que se ve tienen que salir de la misma fuente.
 *
 * El `tema` no es decorativo: es el parámetro `question_topic` del evento
 * `faq_open`, y su ranking es el mapa de objeciones reales del negocio.
 */
export const PREGUNTAS = {
  pisar: {
    pregunta: '¿Cuánto tarda en poder pisarse?',
    respuesta:
      'Entre 24 y 48 horas para pisar y una semana para muebles o coches. El curado completo del hormigón son 28 días, pero puedes hacer vida normal mucho antes.',
    tema: 'plazo',
  },
  grietas: {
    pregunta: '¿Se agrieta el hormigón impreso?',
    respuesta:
      'Bien ejecutado, no. Las grietas aparecen cuando falta mallazo, cuando la solera tiene menos de 10 cm o cuando no se han hecho las juntas de dilatación. Nosotros hacemos las tres cosas siempre.',
    tema: 'garantia',
  },
  sobreExistente: {
    pregunta: '¿Se puede poner encima del suelo que ya tengo?',
    respuesta:
      'En hormigón impreso, no lo recomendamos: la adherencia y el espesor no quedan garantizados. En microcemento sí, y ahí está su gran ventaja: se aplica sobre azulejo, terrazo o gres sin picar nada.',
    tema: 'terreno',
  },
  resellar: {
    pregunta: '¿Cada cuánto hay que resellar?',
    respuesta:
      'Cada 2 o 3 años en entradas de coche y zonas de piscina. Cada 5 o 6 en terrazas y jardines de uso peatonal. Nosotros te avisamos.',
    tema: 'mantenimiento',
  },
  presupuestoBarato: {
    pregunta: '¿Qué pasa si el presupuesto que tengo es de 18 €/m²?',
    respuesta:
      'Que revises qué incluye. A ese precio no salen los materiales de una solera de 10 cm con mallazo y fibra. Normalmente falta el hormigón, el armado o el sellado, y aparece en la factura final.',
    tema: 'precio',
  },
  empresas: {
    pregunta: '¿Trabajáis para empresas y constructoras?',
    respuesta:
      'Sí. Naves industriales, parkings, urbanizaciones y obra civil. Pídenos referencias del sector.',
    tema: 'sector',
  },
} satisfies Record<string, PreguntaFAQ>

export const faqHome: PreguntaFAQ[] = [
  PREGUNTAS.pisar,
  PREGUNTAS.grietas,
  PREGUNTAS.sobreExistente,
  PREGUNTAS.resellar,
  PREGUNTAS.presupuestoBarato,
  PREGUNTAS.empresas,
]

// Las páginas de servicio NO tienen una lista compartida: cada una compone la
// suya en `content/servicios.tsx`, porque dos de las preguntas nombran el
// hormigón impreso y no pueden salir en /microcemento/ ni en /hormigon-pulido/.

export const faqZona: PreguntaFAQ[] = [PREGUNTAS.pisar, PREGUNTAS.resellar, PREGUNTAS.empresas]
