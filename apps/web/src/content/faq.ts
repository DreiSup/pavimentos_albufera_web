import type { PreguntaFAQ } from '@/components/secciones/Acordeon'
import { getQuestionsByRefs, getServiceAreaFaq, homeFaqRefs, type ResolvedQuestion } from '@site/content'

/**
 * legacy adapter, delete when a new design consumes @site/* directly
 *
 * Catálogo de preguntas. Mismos exports, misma forma, mismos valores que
 * antes de la migración — construidos ahora sobre `@site/content`'s
 * `data/faq.ts` pool (locale 'es') en vez de escritos a mano. Las claves
 * españolas de `PREGUNTAS` (usadas antes por `content/servicios.tsx`, que
 * ahora compone su `faq` directamente desde `getServices()`) se conservan
 * aquí solo porque siguen siendo parte de la API heredada de este módulo.
 */

function aPreguntaFAQ(q: ResolvedQuestion): PreguntaFAQ {
  return { pregunta: q.question, respuesta: q.answer ?? '', tema: q.topic as PreguntaFAQ['tema'] }
}

/** Claves españolas de `PREGUNTAS` → claves inglesas de `@site/content`'s `data/faq.ts`. */
const CLAVES = {
  pisar: 'walkable',
  grietas: 'cracking',
  sobreExistente: 'overExistingFloor',
  resellar: 'resealing',
  empresas: 'businessClients',
  microSoporte: 'microSupport',
  microEspesor: 'microThickness',
  microJuntas: 'microJoints',
  microHumedad: 'microMoisture',
  microLimpieza: 'microCleaning',
} as const

const clavesEs = Object.keys(CLAVES) as (keyof typeof CLAVES)[]
const resueltas = getQuestionsByRefs(Object.values(CLAVES), 'es')

export const PREGUNTAS: Record<keyof typeof CLAVES, PreguntaFAQ> = Object.fromEntries(
  clavesEs.map((clave, i) => [clave, aPreguntaFAQ(resueltas[i])]),
) as Record<keyof typeof CLAVES, PreguntaFAQ>

export const faqHome: PreguntaFAQ[] = getQuestionsByRefs(homeFaqRefs, 'es').map(aPreguntaFAQ)

// Las páginas de servicio NO tienen una lista compartida: cada una compone la
// suya en `@site/content`'s `data/services.ts` (`faqRefs`), porque dos de las
// preguntas nombran el hormigón impreso y no pueden salir en /microcemento/
// ni en /hormigon-pulido/.

export const faqZona: PreguntaFAQ[] = getServiceAreaFaq('es').map(aPreguntaFAQ)
