import type { FilaTablaTecnica } from '@/components/datos/TablaFichaTecnica'
import DatoPendiente from '@/components/datos/DatoPendiente'
import { nap } from '@/lib/config'

/**
 * Datos del titular, en los dos sitios donde la ley los pide: el aviso legal
 * (art. 10 LSSI-CE) y el responsable del tratamiento de la política de
 * privacidad.
 *
 * El texto que trajo el dueño dice «la empresa» de principio a fin y no llega a
 * nombrarla: razón social, CIF y domicilio no estaban en ninguna parte del
 * documento. El 2026-09-18 el dueño confirmó los dos primeros —«Pavimentos
 * Albufera Sociedad Limitada» y «B02882090», escritos aquí tal como él los
 * dictó— y siguen sin confirmar el domicilio social y la fecha de última
 * actualización. Lo que falta se queda entre corchetes atenuados, que es justo
 * lo que significan — un dato que falta, no un dato que se maquilla.
 *
 * ⚠️ El teléfono y el domicilio salen de `lib/config.ts`, nunca escritos aquí:
 * un solo teléfono y una sola dirección en todo el sitio. Y se leen de
 * `nap.telefono` y `nap.direccion`, **no** de `telefonoMostrado` ni de
 * `direccionMostrada`, que son las reservas falsas (`96X XXX XXX`, `CALLE Y
 * NÚMERO…`). Dos razones, y la segunda basta: publicar una dirección inventada
 * en la página que existe para identificar a la empresa es justo lo contrario
 * de lo que hace esa página, y `scripts/verificar-landings.mjs` rompe el build
 * en cuanto el teléfono de reserva asoma en el HTML de cualquier ruta.
 */
/**
 * Fecha que encabeza los tres documentos. Vive aquí y no en cada página por lo
 * mismo que el teléfono vive en `lib/config.ts`: es un dato único del sitio, y
 * tres copias son tres oportunidades de que digan cosas distintas.
 *
 * ⚠️ **Lo que esta línea afirma no es cuándo se publicó la página, sino cuándo
 * se revisó el texto que hay debajo.** El dueño la fija el 2026-09-18 a
 * sabiendas: los tres documentos son una plantilla que él heredó de la web
 * anterior, se apoyan en la LOPD de 1999 —derogada en 2018— y la política de
 * privacidad afirma que los datos no se ceden a terceros cuando cada formulario
 * viaja a Resend, a Telegram y, con consentimiento, a la CAPI de Meta. Está
 * encargada una revisión a fondo; **cuando llegue, esta fecha se mueve con
 * ella**, y no antes ni después.
 */
export const ultimaRevisionLegal = '18 de septiembre de 2026'

export const identificacion: FilaTablaTecnica[] = [
  { etiqueta: 'TITULAR DEL SITIO WEB', valor: nap.nombre },
  { etiqueta: 'RAZÓN SOCIAL', valor: 'Pavimentos Albufera Sociedad Limitada' },
  { etiqueta: 'NIF O CIF', valor: 'B02882090' },
  {
    etiqueta: 'DOMICILIO',
    valor: nap.direccion ?? <DatoPendiente>domicilio social</DatoPendiente>,
  },
  {
    etiqueta: 'TELÉFONO',
    valor: nap.telefono ?? <DatoPendiente>teléfono</DatoPendiente>,
  },
  { etiqueta: 'CORREO ELECTRÓNICO', valor: nap.email },
]

export type FichaCookie = { nombre: string; filas: FilaTablaTecnica[] }

/**
 * Inventario de cookies, levantado leyendo el código de este repositorio y solo
 * el código de este repositorio. Es el encargo que el dueño dejó escrito dentro
 * de su propio documento de cookies: «avisar de todas las cookies que sea
 * necesario avisar, además de las que estén escritas a continuación».
 *
 * Fuentes de cada línea, para que la próxima revisión no tenga que adivinar:
 * `lib/cookies.ts` (nombres), `components/layout/Consentimiento.tsx`
 * (`pa_consent`, 180 días, y la carga del píxel de Meta),
 * `app/api/atribucion/route.ts` (`pa_ref`, `pa_attr` y `_fbc`, 90 días),
 * `components/layout/Atribucion.tsx` (qué se captura de la URL),
 * `app/presupuesto/actions.ts` (lectura de `_fbp` y `_fbc`) y `app/layout.tsx`
 * (Consent Mode v2 y la carga de `gtag.js`).
 *
 * 🔴 **Lo que no se puede leer en el código no se afirma.** Ni los nombres ni
 * la duración de las cookies que instalan Google y Meta con sus propias
 * etiquetas están en este repositorio: los decide cada proveedor y hay que
 * confirmarlos con él. Por eso van entre corchetes. Los dos nombres de tercero
 * que sí aparecen aquí, `_fbp` y `_fbc`, están porque este sitio los LEE —al
 * enviar el formulario a la API de conversiones de Meta—, no porque se haya
 * dado por buena una lista de fuera.
 */
export const cookiesPropias: FichaCookie[] = [
  {
    nombre: 'pa_consent',
    filas: [
      { etiqueta: 'QUIÉN LA PONE', valor: 'Esta web, desde el navegador' },
      {
        etiqueta: 'PARA QUÉ SIRVE',
        valor:
          'Recuerda si has aceptado o rechazado las cookies de analítica y publicidad. Sin ella el aviso volvería a salir en cada página.',
      },
      {
        etiqueta: 'CUÁNDO SE ESCRIBE',
        valor: 'Al pulsar «Aceptar» o «Rechazar». Antes de que decidas no existe.',
      },
      { etiqueta: 'DURACIÓN', valor: '180 días' },
      { etiqueta: 'TIPO', valor: 'Propia, técnica' },
    ],
  },
  {
    nombre: 'pa_ref',
    filas: [
      { etiqueta: 'QUIÉN LA PONE', valor: 'Esta web, desde su servidor' },
      {
        etiqueta: 'PARA QUÉ SIRVE',
        valor:
          'Guarda un código de seis caracteres que se añade al mensaje de WhatsApp, para poder relacionar esa conversación con la visita que la originó.',
      },
      {
        etiqueta: 'CUÁNDO SE ESCRIBE',
        valor: 'En la primera visita, antes de que contestes al aviso de cookies.',
      },
      { etiqueta: 'DURACIÓN', valor: '90 días' },
      { etiqueta: 'TIPO', valor: 'Propia' },
    ],
  },
  {
    nombre: 'pa_attr',
    filas: [
      { etiqueta: 'QUIÉN LA PONE', valor: 'Esta web, desde su servidor' },
      {
        etiqueta: 'PARA QUÉ SIRVE',
        valor:
          'Guarda de qué anuncio o campaña procede la visita: los parámetros gclid, gbraid, wbraid, utm_ y fbclid de la dirección de entrada, la página de llegada y la fecha. Solo se guarda el primer origen.',
      },
      {
        etiqueta: 'CUÁNDO SE ESCRIBE',
        valor: 'Solo si aceptas, y solo si has llegado desde un anuncio.',
      },
      { etiqueta: 'DURACIÓN', valor: '90 días' },
      { etiqueta: 'TIPO', valor: 'Propia, publicitaria' },
    ],
  },
  {
    nombre: '_fbc',
    filas: [
      { etiqueta: 'QUIÉN LA PONE', valor: 'Esta web, o la etiqueta de Meta si llega antes' },
      {
        etiqueta: 'PARA QUÉ SIRVE',
        valor:
          'Guarda el identificador del clic en un anuncio de Facebook o Instagram, para que Meta pueda atribuir el contacto al anuncio del que salió.',
      },
      { etiqueta: 'CUÁNDO SE ESCRIBE', valor: 'Solo si aceptas, y solo si venías de un anuncio de Meta.' },
      {
        etiqueta: 'DURACIÓN',
        valor: (
          <>
            90 días cuando la escribe esta web. Cuando la escribe la etiqueta de Meta,{' '}
            <DatoPendiente>duración</DatoPendiente>
          </>
        ),
      },
      { etiqueta: 'TIPO', valor: 'Propia de dominio, con finalidad publicitaria de Meta' },
    ],
  },
]

export const cookiesTerceros: FichaCookie[] = [
  {
    nombre: 'Google · gtag.js',
    filas: [
      { etiqueta: 'QUIÉN LA PONE', valor: 'Google, a través de la etiqueta gtag.js' },
      {
        etiqueta: 'PARA QUÉ SIRVE',
        valor:
          'Analítica de Google Analytics 4 —cuántas personas entran, por dónde y qué hacen— y medición de las conversiones de Google Ads.',
      },
      {
        etiqueta: 'CUÁNDO SE ESCRIBE',
        valor:
          'La etiqueta se carga siempre, pero con los cuatro permisos de Consent Mode v2 denegados: hasta que aceptas no guarda cookies, solo envía una señal sin identificar.',
      },
      { etiqueta: 'NOMBRES', valor: <DatoPendiente>lista de cookies de Google</DatoPendiente> },
      { etiqueta: 'DURACIÓN', valor: <DatoPendiente>duración</DatoPendiente> },
      { etiqueta: 'TIPO', valor: 'De tercero, analítica y publicitaria' },
    ],
  },
  {
    nombre: 'Meta · _fbp y fbevents.js',
    filas: [
      { etiqueta: 'QUIÉN LA PONE', valor: 'Meta, a través de la etiqueta fbevents.js' },
      {
        etiqueta: 'PARA QUÉ SIRVE',
        valor:
          'Identifica el navegador para Meta. Esta web lee _fbp y _fbc al enviar el formulario de presupuesto, para mandarlos a la API de conversiones de Meta junto con el aviso del contacto.',
      },
      {
        etiqueta: 'CUÁNDO SE ESCRIBE',
        valor:
          'Solo si aceptas: la etiqueta de Meta no se carga hasta entonces, porque Meta no tiene equivalente del Consent Mode de Google.',
      },
      {
        etiqueta: 'NOMBRES',
        valor: (
          <>
            _fbp y _fbc, más <DatoPendiente>resto de cookies de Meta</DatoPendiente>
          </>
        ),
      },
      { etiqueta: 'DURACIÓN', valor: <DatoPendiente>duración</DatoPendiente> },
      { etiqueta: 'TIPO', valor: 'De tercero, publicitaria' },
    ],
  },
]
