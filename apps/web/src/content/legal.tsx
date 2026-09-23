import type { FilaTablaTecnica } from '@/components/datos/TablaFichaTecnica'
import DatoPendiente from '@/components/datos/DatoPendiente'
import { nap } from '@/lib/config'
import { getLegalFacts } from '@site/content'

/**
 * legacy adapter, delete when a new design consumes @site/* directly
 *
 * Datos y fichas que comparten las tres páginas legales. Mismos exports,
 * misma forma, mismos valores que antes de la migración.
 *
 * D6 (opción b): las filas cuyo `valor` es una cadena plana en el origen
 * viven ahora en `@site/content` (`getLegalFacts`, locale 'es') — `nif`,
 * `razonSocial`, `dominio`, `actividad`, `ultimaRevisionLegal` y toda fila de
 * `identificacion`/`responsable`/`cookiesPropias`/`cookiesTerceros`/
 * `destinatarios` cuyo `valor` no es JSX. Las filas con JSX real
 * (`<DatoPendiente>`, los dos enlaces externos, y la fila mixta de `_fbc`) se
 * quedan escritas a mano aquí, exactamente igual que antes — no hay
 * equivalente en el paquete, que no modela React. El teléfono y el domicilio
 * siguen leyéndose en vivo de `nap.telefono`/`nap.direccion` (nunca de
 * `telefonoMostrado`/`direccionMostrada`, las reservas falsas), nunca
 * duplicados como una segunda copia congelada en `@site/content`.
 */

const legal = getLegalFacts('es')

/** `{label,value}` (paquete) → `{etiqueta,valor}` (forma heredada). */
function aFila(row: { label: string; value: string }): FilaTablaTecnica {
  return { etiqueta: row.label, valor: row.value }
}

export const ultimaRevisionLegal = legal.lastLegalReview

/** Marcador de dato del titular sin confirmar, con el texto que verá el dueño. */
export const pendienteDomicilio = (
  <DatoPendiente>PENDIENTE: calle, número, código postal y municipio del domicilio social</DatoPendiente>
)

/**
 * Ficha del **aviso legal**: artículo 10.1 de la Ley 34/2002 (LSSI-CE), letras
 * a), b) y e).
 *
 * ⚠️ **No es la misma tabla que la del responsable del tratamiento**, aunque
 * comparta filas. La letra b) obliga a publicar los datos de inscripción en el
 * Registro Mercantil, que es una obligación de la LSSI y no del RGPD: meterla
 * en la política de privacidad sería informar de lo que esa página no tiene que
 * informar, y quitarla de aquí sería incumplir. Una tabla por norma.
 */
export const identificacion: FilaTablaTecnica[] = [
  { etiqueta: 'TITULAR DEL SITIO WEB', valor: nap.nombre },
  aFila(legal.identificationRows[0]), // RAZÓN SOCIAL
  aFila(legal.identificationRows[1]), // NIF O CIF
  {
    etiqueta: 'DOMICILIO SOCIAL',
    valor: nap.direccion ?? pendienteDomicilio,
  },
  {
    etiqueta: 'DATOS REGISTRALES',
    valor: (
      <DatoPendiente>
        PENDIENTE: Registro Mercantil, tomo, folio, hoja e inscripción
      </DatoPendiente>
    ),
  },
  {
    etiqueta: 'TELÉFONO',
    valor: nap.telefono ?? <DatoPendiente>teléfono</DatoPendiente>,
  },
  { etiqueta: 'CORREO ELECTRÓNICO', valor: nap.email },
  aFila(legal.identificationRows[2]), // ACTIVIDAD
  aFila(legal.identificationRows[3]), // DOMINIO
  {
    etiqueta: 'CÓDIGOS DE CONDUCTA',
    valor: (
      <DatoPendiente>
        PENDIENTE: confirmar a qué código de conducta está adherida la empresa; si no lo está a
        ninguno, esta fila se elimina entera
      </DatoPendiente>
    ),
  },
]

/**
 * Ficha de la **política de privacidad**: artículo 13.1.a y 13.1.b del RGPD.
 * Identidad y contacto del responsable, y delegado de protección de datos.
 */
export const responsable: FilaTablaTecnica[] = [
  aFila(legal.controllerRows[0]), // RESPONSABLE
  aFila(legal.controllerRows[1]), // NIF O CIF
  {
    etiqueta: 'DOMICILIO',
    valor: nap.direccion ?? pendienteDomicilio,
  },
  { etiqueta: 'CORREO ELECTRÓNICO', valor: nap.email },
  {
    etiqueta: 'TELÉFONO',
    valor: nap.telefono ?? <DatoPendiente>teléfono</DatoPendiente>,
  },
  {
    etiqueta: 'DELEGADO DE PROTECCIÓN DE DATOS',
    valor: (
      <DatoPendiente>
        PENDIENTE: confirmar si la empresa tiene delegado de protección de datos y, si lo tiene, sus
        datos de contacto
      </DatoPendiente>
    ),
  },
]

export type FichaCookie = { nombre: string; filas: FilaTablaTecnica[] }

/**
 * Inventario de cookies. Fuentes de cada línea, para que la próxima revisión
 * no tenga que adivinar: `lib/cookies.ts` (nombres),
 * `components/layout/Consentimiento.tsx` (`pa_consent`, 180 días, y la carga
 * del píxel de Meta), `app/api/atribucion/route.ts` (`pa_ref`, `pa_attr` y
 * `_fbc`, 90 días), `components/layout/Atribucion.tsx` (qué se captura de la
 * URL), `app/presupuesto/actions.ts` (lectura de `_fbp` y `_fbc`) y
 * `app/layout.tsx` (Consent Mode v2 y la carga de `gtag.js`).
 */
export const cookiesPropias: FichaCookie[] = [
  { nombre: 'pa_consent', filas: legal.ownCookies[0].rows.map(aFila) },
  { nombre: 'pa_ref', filas: legal.ownCookies[1].rows.map(aFila) },
  { nombre: 'pa_attr', filas: legal.ownCookies[2].rows.map(aFila) },
  {
    nombre: '_fbc',
    filas: [
      aFila(legal.ownCookies[3].rows[0]), // QUIÉN LA PONE
      aFila(legal.ownCookies[3].rows[1]), // PARA QUÉ SIRVE
      aFila(legal.ownCookies[3].rows[2]), // CUÁNDO SE ESCRIBE
      {
        etiqueta: 'DURACIÓN',
        valor: (
          <>
            90 días cuando la escribe esta web. Cuando la escribe la etiqueta de Meta,{' '}
            <DatoPendiente>
              PENDIENTE: duración de _fbc cuando la escribe la etiqueta de Meta
            </DatoPendiente>
          </>
        ),
      },
      aFila(legal.ownCookies[3].rows[3]), // TIPO
      aFila(legal.ownCookies[3].rows[4]), // ¿NECESITA CONSENTIMIENTO?
    ],
  },
]

export const cookiesTerceros: FichaCookie[] = [
  {
    nombre: 'Google · gtag.js',
    filas: [
      aFila(legal.thirdPartyCookies[0].rows[0]), // QUIÉN LA PONE
      aFila(legal.thirdPartyCookies[0].rows[1]), // PARA QUÉ SIRVE
      aFila(legal.thirdPartyCookies[0].rows[2]), // CUÁNDO SE ESCRIBE
      {
        etiqueta: 'NOMBRES',
        valor: <DatoPendiente>PENDIENTE: lista de cookies que instala Google</DatoPendiente>,
      },
      {
        etiqueta: 'DURACIÓN',
        valor: <DatoPendiente>PENDIENTE: duración de las cookies de Google</DatoPendiente>,
      },
      aFila(legal.thirdPartyCookies[0].rows[3]), // TIPO
      aFila(legal.thirdPartyCookies[0].rows[4]), // ¿NECESITA CONSENTIMIENTO?
      {
        etiqueta: 'MÁS INFORMACIÓN',
        valor: (
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            policies.google.com/privacy
          </a>
        ),
      },
    ],
  },
  {
    nombre: 'Meta · _fbp y fbevents.js',
    filas: [
      aFila(legal.thirdPartyCookies[1].rows[0]), // QUIÉN LA PONE
      aFila(legal.thirdPartyCookies[1].rows[1]), // PARA QUÉ SIRVE
      aFila(legal.thirdPartyCookies[1].rows[2]), // CUÁNDO SE ESCRIBE
      {
        etiqueta: 'NOMBRES',
        valor: (
          <>
            _fbp y _fbc, más{' '}
            <DatoPendiente>PENDIENTE: resto de cookies que instala Meta</DatoPendiente>
          </>
        ),
      },
      {
        etiqueta: 'DURACIÓN',
        valor: <DatoPendiente>PENDIENTE: duración de las cookies de Meta</DatoPendiente>,
      },
      aFila(legal.thirdPartyCookies[1].rows[3]), // TIPO
      aFila(legal.thirdPartyCookies[1].rows[4]), // ¿NECESITA CONSENTIMIENTO?
      {
        etiqueta: 'MÁS INFORMACIÓN',
        valor: (
          <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">
            facebook.com/privacy/policy
          </a>
        ),
      },
    ],
  },
]

/**
 * Destinatarios de los datos del formulario, artículo 13.1.e del RGPD. Todas
 * las filas de las cinco fichas son planas en el origen, así que salen
 * completas de `@site/content`.
 */
export type FilaDestinatario = { destino: string; filas: FilaTablaTecnica[] }

export const destinatarios: FilaDestinatario[] = legal.recipients.map((r) => ({
  destino: r.recipient,
  filas: r.rows.map(aFila),
}))
