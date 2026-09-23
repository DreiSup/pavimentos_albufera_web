import type { ReactNode } from 'react'
import type { PreguntaFAQ } from '@/components/secciones/Acordeon'
import { getServices, type ResolvedLandingService, type ResolvedService } from '@site/content'
import type { Imagen, ServicioId } from '@/lib/tipos'

/**
 * legacy adapter, delete when a new design consumes @site/* directly
 *
 * Contenido de las seis páginas de servicio. Mismos exports, misma forma,
 * mismos valores que antes de la migración — construidos ahora sobre
 * `@site/content` (locale 'es') en vez de estar escritos a mano.
 *
 * ⚠️ **`PASOS` se queda escrito a mano, con sus dos fragmentos JSX (D6).**
 * `@site/content` no modela JSX — es contenido puro, sin React — y el único
 * JSX real de este archivo son 2 de los 4 `PASOS[].texto` (fragmentos `<>…</>`
 * sin marcas reales, ver el propio análisis del plan de paquetes). Moverlo
 * habría exigido inventar un modelo de "rich text" para dos fragmentos sin
 * marcas — no vale la pena el riesgo de equivalencia, y D6 lo confirma.
 */

type Aplicacion = { nombre: string; texto: string }

/**
 * Las secciones numeradas del cuerpo de `PaginaServicio`. Es una unión y no
 * `string` para que un `ocultarSecciones` con una errata no compile: el
 * numerado y el submenú se construyen de esta lista, y un id que no existe
 * ocultaría exactamente nada sin decirlo.
 */
export type SeccionServicio =
  | 'seccion-aplicaciones'
  | 'seccion-muestrario'
  | 'seccion-ficha'
  | 'seccion-cuando-no'
  | 'seccion-como'
  | 'seccion-obra'

export type Servicio = {
  id: ServicioId
  ruta: string
  nombre: string
  title: string
  description: string
  h1: string
  entradilla: string
  etiquetaHero: string[]
  /** Hero de la página de servicio. Sin ella el hueco vuelve a `<BloquePosicion>`. */
  imagenHero?: Imagen
  /** Tarjeta del servicio en la home. Distinta de la del hero a propósito. */
  imagenTarjeta?: Imagen
  /** Solo donde hay copy aprobado que lo respalde. Si no, la sección no se renderiza. */
  aplicaciones?: { intro: string; lista: Aplicacion[] }
  fichaTecnica: { etiqueta: string; valor: ReactNode }[]
  cuandoNo?: { titulo: string; texto: string; alternativas: { href: string; texto: string }[] }
  /** Sin preguntas aplicables no hay sección de FAQ ni marcado `FAQPage`. */
  faq?: PreguntaFAQ[]

  /*
   * Los tres campos de abajo son la recomposición de campaña. Las seis rutas de
   * servicio NO los declaran: los pone `content/landings.ts` sobre una copia del
   * servicio, para que `/lp/<slug>/` sea la misma plantilla con secciones
   * desactivadas y no una plantilla clonada que diverja en un mes.
   */

  /** Secciones que la landing no monta. Hoy solo la ficha técnica: las seis la llenan de corchetes. */
  ocultarSecciones?: readonly SeccionServicio[]
  /** Pone los CTA de llamada y WhatsApp en el hero y en el cierre, en `tinta`/`contorno`. Nunca ocre. */
  ctaContacto?: boolean
  /** Exime del `<Aparece>` el cierre con CTA + formulario, que es el bloque de conversión. */
  sinAparece?: boolean
}

/**
 * Los cuatro pasos de «Cómo trabajamos». Vive aquí porque lo montan dos
 * pantallas —la home y las seis páginas de servicio— y estaba copiado en las
 * dos: `PaginaServicio.tsx` y `app/page.tsx` tenían el mismo texto escrito dos
 * veces, que es la manera segura de que dentro de un mes digan cosas distintas.
 */
export const PASOS: { numero: string; titulo: string; texto: ReactNode }[] = [
  {
    numero: '01',
    titulo: 'Visita y medición',
    texto:
      'Vamos a verlo. Sin coste y sin compromiso. Medimos, comprobamos el estado del terreno y el acceso para el camión.',
  },
  {
    numero: '02',
    titulo: 'Presupuesto cerrado',
    texto: <>Te lo enviamos lo antes posible, desglosado. Lo que pone es lo que se paga.</>,
  },
  {
    numero: '03',
    titulo: 'Ejecución',
    texto: (
      <>
        Equipo propio. Una superficie de 80-100 m² se ejecuta en 2 o 3 días. Después necesita entre
        24 y 48 horas sin pisar y 28 días para curar del todo.
      </>
    ),
  },
  {
    numero: '04',
    titulo: 'Garantía y mantenimiento',
    texto: '10 años. Y volvemos a resellar cuando toque.',
  },
]

/**
 * Convierte el `ResolvedService`/`ResolvedLandingService` de `@site/content`
 * a la forma `Servicio` heredada. Exportada para que `content/landings.ts`
 * la reutilice sobre `getLandingService` sin duplicar el mapeo campo a campo.
 */
export function aServicio(s: ResolvedService): Servicio {
  return {
    id: s.id as ServicioId,
    ruta: s.path,
    nombre: s.name,
    title: s.title,
    description: s.description,
    h1: s.h1,
    entradilla: s.intro,
    etiquetaHero: s.heroLabelLines,
    ...(s.heroImage ? { imagenHero: { src: s.heroImage.src, alt: s.heroImage.alt, tipo: s.heroImage.kind as Imagen['tipo'] } } : {}),
    ...(s.cardImage ? { imagenTarjeta: { src: s.cardImage.src, alt: s.cardImage.alt, tipo: s.cardImage.kind as Imagen['tipo'] } } : {}),
    ...(s.applications
      ? {
          aplicaciones: {
            intro: s.applications.intro,
            lista: s.applications.list.map((item) => ({ nombre: item.name, texto: item.text })),
          },
        }
      : {}),
    fichaTecnica: s.specs.map((row) => ({ etiqueta: row.label, valor: row.value })),
    ...(s.whenNotTo
      ? {
          cuandoNo: {
            titulo: s.whenNotTo.title,
            texto: s.whenNotTo.text,
            alternativas: s.whenNotTo.alternatives.map((alt) => ({ href: alt.href, texto: alt.text })),
          },
        }
      : {}),
    ...(s.faq.length > 0
      ? {
          faq: s.faq.map((q) => ({
            pregunta: q.question,
            respuesta: q.answer ?? '',
            tema: q.topic as PreguntaFAQ['tema'],
          })),
        }
      : {}),
  }
}

/** Igual que `aServicio`, más los tres campos de recomposición de campaña — usada por `content/landings.ts`. */
export function aServicioDeLanding(s: ResolvedLandingService): Servicio {
  return {
    ...aServicio(s),
    ocultarSecciones: s.hiddenSections as readonly SeccionServicio[],
    ctaContacto: s.ctaContact,
    sinAparece: s.noAppear,
  }
}

export const SERVICIOS: Record<ServicioId, Servicio> = Object.fromEntries(
  getServices('es').map((s) => [s.id, aServicio(s)]),
) as Record<ServicioId, Servicio>
