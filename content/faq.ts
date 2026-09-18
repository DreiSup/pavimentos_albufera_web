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
 *
 * ⛔ **`presupuestoBarato` se retira el 2026-09-18, por decisión expresa del dueño.**
 * Era «¿Qué pasa si el presupuesto que tengo es de 18 €/m²?», y es el último
 * precio que quedaba en el sitio después de que el 2026-09-17 se retirase
 * `/precios/` y el 2026-09-18 la calculadora. Viajaba además dentro del JSON-LD
 * de `FAQPage`, que es lo que lee Google. `'precio'` se queda en `TEMAS_FAQ`
 * (`lib/eventos.ts`): ese vocabulario ya tenía temas sin pregunta —`juntas`,
 * `zona`, `proceso`— y es el catálogo de objeciones posibles, no el de las
 * publicadas.
 *
 * ⚠️ **Al irse, el catálogo heredado baja a 5 preguntas y ninguna de sus listas
 * puede cumplir ya lo que `design/02` especifica.** No se rellena con una
 * pregunta inventada: eso sería copy nuevo. El hueco está medido en el informe.
 *
 * ✅ **Excepción autorizada el 2026-09-18, y solo esta.** El dueño contesta
 * expresamente «escribe información verdadera sobre microcemento, si hace falta
 * busca en otras webs», y con eso entran las cinco `micro*` de abajo. La
 * autorización es del MATERIAL, no del negocio: se puede afirmar a qué espesor
 * se aplica el microcemento, no cuántas manos da esta empresa, con qué producto
 * ni en cuántos días. Cada afirmación sale de una página de fabricante o de
 * normativa citada en el commit —Topciment y el CTE DB-SUA—, porque estas
 * respuestas viajan dentro del JSON-LD de `FAQPage` y ahí una frase de folleto
 * es una afirmación falsa ante Google.
 *
 * ⚠️ **La excepción no se extiende.** Las 5 heredadas siguen siendo del
 * documento maestro y no se reescriben, y `faqHome` y `faqZona` no cambian: una
 * pregunta de microcemento no es una objeción de portada.
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
  empresas: {
    pregunta: '¿Trabajáis para empresas y constructoras?',
    respuesta:
      'Sí. Naves industriales, parkings, urbanizaciones y obra civil. Pídenos referencias del sector.',
    tema: 'sector',
  },

  /*
   * Las cinco de microcemento. `/microcemento/` era la única de las seis
   * páginas de servicio sin acordeón, porque las de arriba hablan de una solera
   * de hormigón —curado, resellado de exterior, agrietado de 10 cm— y el
   * microcemento no lleva solera.
   *
   * Fuentes, una por afirmación:
   * - Soporte, estabilidad, humedad y fisuras → Topciment, «Condiciones y
   *   soporte idóneos para la aplicación de microcemento».
   * - Espesor de 2-3 mm, capas de menos de 1 mm y continuidad sin juntas →
   *   Topciment, «Microcement flooring: application, types, advantages».
   * - Limpieza → Topciment, «How to clean microcement».
   */

  microSoporte: {
    pregunta: '¿Sobre qué suelos se puede aplicar?',
    respuesta:
      'Sobre azulejo, gres, terrazo, baldosa hidráulica o una solera de hormigón, sin levantar nada. Lo que decide no es el material de debajo, es que esté firme: con piezas sueltas o un mortero que se deshace, el microcemento no tiene a qué agarrarse.',
    tema: 'terreno',
  },
  microEspesor: {
    pregunta: '¿Cuánto sube el suelo?',
    respuesta:
      'Entre 2 y 3 milímetros. Se extiende en capas de menos de un milímetro y el sistema entero no pasa de cuatro. Esa es su razón de ser: renovar sin obra y sin apenas ganar altura.',
    tema: 'proceso',
  },
  microJuntas: {
    pregunta: '¿Lleva juntas?',
    respuesta:
      'No. Es un revestimiento continuo: no hay piezas, así que no hay juntas donde se acumule la suciedad ni corte entre una estancia y la siguiente. Donde el suelo de debajo tenga una junta estructural, esa se respeta y se deja pasar.',
    tema: 'juntas',
  },
  microHumedad: {
    pregunta: '¿Y si el suelo tiene humedad?',
    respuesta:
      'Entonces no se aplica todavía. El soporte tiene que estar seco, por debajo del 5 %, y una filtración hay que resolverla antes. El microcemento no tapa la humedad, la hereda: y lo mismo con las fisuras, porque él no se agrieta solo, pero copia lo que hace el suelo que tiene debajo.',
    tema: 'terreno',
  },
  microLimpieza: {
    pregunta: '¿Cómo se limpia?',
    respuesta:
      'Agua y jabón neutro, y solo agua las primeras semanas. Lo que no admite son los ácidos, el amoniaco, los estropajos metálicos ni las lijas: eso sí lo estropea, y es lo único que hay que tener en cuenta.',
    tema: 'mantenimiento',
  },
} satisfies Record<string, PreguntaFAQ>

export const faqHome: PreguntaFAQ[] = [
  PREGUNTAS.pisar,
  PREGUNTAS.grietas,
  PREGUNTAS.sobreExistente,
  PREGUNTAS.resellar,
  PREGUNTAS.empresas,
]

// Las páginas de servicio NO tienen una lista compartida: cada una compone la
// suya en `content/servicios.tsx`, porque dos de las preguntas nombran el
// hormigón impreso y no pueden salir en /microcemento/ ni en /hormigon-pulido/.

export const faqZona: PreguntaFAQ[] = [PREGUNTAS.pisar, PREGUNTAS.resellar, PREGUNTAS.empresas]
