import type { FilaTablaTecnica } from '@/components/datos/TablaFichaTecnica'
import DatoPendiente from '@/components/datos/DatoPendiente'
import { nap } from '@/lib/config'

/**
 * Datos y fichas que comparten las tres páginas legales.
 *
 * ⚠️ **Dónde vive el texto publicado.** `lib/legal/` guarda los `.md` que trajo
 * el dueño y las instrucciones de la revisión, pero esa carpeta **no está bajo
 * control de versiones**: es material suyo, no una fuente que el build pueda
 * importar. Así que el texto publicado vive donde ya vivía —el JSX de cada
 * ruta— y aquí solo lo que comparten dos o más páginas: la ficha del titular,
 * la del responsable, el inventario de cookies y la fecha. Eso cierra el
 * `[PENDIENTE]` que dejaba abierto `09-instrucciones-legales.md` §8.
 *
 * ⚠️ El teléfono y el domicilio salen de `lib/config.ts`, nunca escritos aquí:
 * un solo teléfono y una sola dirección en todo el sitio. Y se leen de
 * `nap.telefono` y `nap.direccion`, **no** de `telefonoMostrado` ni de
 * `direccionMostrada`, que son las reservas falsas (`96X XXX XXX`, `CALLE Y
 * NÚMERO…`). Dos razones, y la segunda basta: publicar una dirección inventada
 * en la página que existe para identificar a la empresa es justo lo contrario
 * de lo que hace esa página, y `scripts/verificar-landings.mjs` rompe el build
 * en cuanto el teléfono de reserva asoma en el HTML de cualquier ruta.
 *
 * 🔴 **Ningún dato del titular se inventa.** Lo que no ha confirmado el dueño
 * sale en la página como marcador visible `[PENDIENTE: …]`, con
 * `<DatoPendiente>`, que es como este sitio entero trata lo que no existe. Un
 * domicilio o un tomo registral «de ejemplo» en la página que sirve para
 * identificar a la empresa ante quien reclama es peor que un hueco.
 */

/**
 * Fecha que encabeza los tres documentos. Vive aquí y no en cada página por lo
 * mismo que el teléfono vive en `lib/config.ts`: es un dato único del sitio, y
 * tres copias son tres oportunidades de que digan cosas distintas.
 *
 * **Qué afirma esta línea, y qué ha cambiado.** Hasta ahora fechaba a
 * 2026-09-18 un texto heredado de la web anterior que se apoyaba en la LOPD de
 * 1999 —derogada en 2018—, prometía que los datos no se ceden a terceros
 * teniendo cinco destinos y decía que las cookies caducan al cerrar el
 * navegador durando 90 y 180 días: lo peor de los dos mundos, revisión reciente
 * aparente sobre texto viejo. Los tres documentos se han **rehecho** contra
 * `lib/legal/09-instrucciones-legales.md`, y la fecha pasa a decir lo que
 * siempre tuvo que decir: cuándo se revisó el texto que hay debajo.
 *
 * Se mueve el día en que se publique una revisión posterior, no antes.
 */
export const ultimaRevisionLegal = '18 de septiembre de 2026'

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
 *
 * La letra b) pasa de «en su caso» a obligatoria en cuanto el titular es una
 * sociedad limitada: una S.L. adquiere personalidad jurídica por la
 * inscripción, luego está inscrita.
 */
export const identificacion: FilaTablaTecnica[] = [
  { etiqueta: 'TITULAR DEL SITIO WEB', valor: nap.nombre },
  { etiqueta: 'RAZÓN SOCIAL', valor: 'Pavimentos Albufera Sociedad Limitada' },
  { etiqueta: 'NIF O CIF', valor: 'B02882090' },
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
  {
    etiqueta: 'ACTIVIDAD',
    valor:
      'Pavimentos de hormigón: impreso, pulido, lavado, fratasado, desactivado y microcemento',
  },
  { etiqueta: 'DOMINIO', valor: 'pavimentos-albufera.com' },
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
 *
 * Sin datos registrales —eso es LSSI, no RGPD— y con una fila que la otra tabla
 * no tiene: el delegado. El artículo 37 del RGPD solo lo exige en tres
 * supuestos y ninguno encaja con esta actividad, pero decidirlo no es de esta
 * tarea: sale como marcador.
 */
export const responsable: FilaTablaTecnica[] = [
  { etiqueta: 'RESPONSABLE', valor: 'Pavimentos Albufera Sociedad Limitada' },
  { etiqueta: 'NIF O CIF', valor: 'B02882090' },
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
 *
 * 🔴 **La fila «¿NECESITA CONSENTIMIENTO?» no describe lo que el sitio hace,
 * sino lo que el artículo 22.2 de la LSSI exige**, y en `pa_ref` las dos cosas
 * no coinciden hoy: la cookie se escribe en la primera visita, antes de que
 * nadie haya contestado al aviso. Está dicho así, y no maquillado, porque esa
 * diferencia se arregla en `app/api/atribucion/route.ts` y no escribiendo aquí
 * una frase más amable. → `09-instrucciones-legales.md` §6.3.
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
      {
        etiqueta: '¿NECESITA CONSENTIMIENTO?',
        valor:
          'No. Guardar tu decisión es la forma de cumplir el artículo 22.2 de la LSSI, así que está exenta.',
      },
    ],
  },
  {
    nombre: 'pa_ref',
    filas: [
      { etiqueta: 'QUIÉN LA PONE', valor: 'Esta web, desde su servidor' },
      {
        etiqueta: 'PARA QUÉ SIRVE',
        valor:
          'Guarda un código de seis caracteres que se añade al mensaje de WhatsApp, para poder relacionar esa conversación con la visita que la originó. Ese mismo código viaja a Google como reference_code cuando se envía el formulario.',
      },
      {
        etiqueta: 'CUÁNDO SE ESCRIBE',
        valor: 'En la primera visita, antes de que contestes al aviso de cookies.',
      },
      { etiqueta: 'DURACIÓN', valor: '90 días' },
      { etiqueta: 'TIPO', valor: 'Propia, de seguimiento' },
      {
        etiqueta: '¿NECESITA CONSENTIMIENTO?',
        valor:
          'Sí: es un identificador único y no está exenta. Hoy se escribe en la primera visita, antes de que puedas decidir. Si la borras se genera un código nuevo en la visita siguiente: para que no llegue a escribirse hay que bloquear las cookies de este sitio en el navegador.',
      },
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
      {
        etiqueta: '¿NECESITA CONSENTIMIENTO?',
        valor: 'Sí, y solo se escribe con tu consentimiento.',
      },
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
      {
        etiqueta: 'CUÁNDO SE ESCRIBE',
        valor: 'Solo si aceptas, y solo si venías de un anuncio de Meta.',
      },
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
      { etiqueta: 'TIPO', valor: 'Propia de dominio, con finalidad publicitaria de Meta' },
      {
        etiqueta: '¿NECESITA CONSENTIMIENTO?',
        valor: 'Sí, y solo se escribe con tu consentimiento.',
      },
    ],
  },
]

export const cookiesTerceros: FichaCookie[] = [
  {
    nombre: 'Google · gtag.js',
    filas: [
      { etiqueta: 'QUIÉN LA PONE', valor: 'Google Ireland Limited, a través de la etiqueta gtag.js' },
      {
        etiqueta: 'PARA QUÉ SIRVE',
        valor:
          'Analítica de Google Analytics 4 —cuántas personas entran, por dónde y qué hacen— y medición de las conversiones de Google Ads.',
      },
      {
        etiqueta: 'CUÁNDO SE ESCRIBE',
        valor:
          'La etiqueta se carga en todas las páginas desde la primera visita, con los cuatro permisos del Consent Mode v2 de Google denegados mientras no aceptes. En ese estado Google recibe avisos de tu navegación —la página, tu dirección IP y tu navegador— y esta web le indica que no puede usar almacenamiento en tu dispositivo. Qué hace Google con esa señal lo determina Google.',
      },
      {
        etiqueta: 'NOMBRES',
        valor: (
          <DatoPendiente>PENDIENTE: lista de cookies que instala Google</DatoPendiente>
        ),
      },
      {
        etiqueta: 'DURACIÓN',
        valor: <DatoPendiente>PENDIENTE: duración de las cookies de Google</DatoPendiente>,
      },
      { etiqueta: 'TIPO', valor: 'De tercero, analítica y publicitaria' },
      {
        etiqueta: '¿NECESITA CONSENTIMIENTO?',
        valor:
          'Sí. Google Analytics 4 no entra en la exención de las cookies de medición de audiencia, porque los datos no se tratan en exclusiva para este sitio ni se quedan en estadísticas anónimas.',
      },
      {
        etiqueta: 'MÁS INFORMACIÓN',
        valor: (
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            policies.google.com/privacy
          </a>
        ),
      },
    ],
  },
  {
    nombre: 'Meta · _fbp y fbevents.js',
    filas: [
      {
        etiqueta: 'QUIÉN LA PONE',
        valor: 'Meta Platforms Ireland Limited, a través de la etiqueta fbevents.js',
      },
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
            _fbp y _fbc, más{' '}
            <DatoPendiente>PENDIENTE: resto de cookies que instala Meta</DatoPendiente>
          </>
        ),
      },
      {
        etiqueta: 'DURACIÓN',
        valor: <DatoPendiente>PENDIENTE: duración de las cookies de Meta</DatoPendiente>,
      },
      { etiqueta: 'TIPO', valor: 'De tercero, publicitaria' },
      { etiqueta: '¿NECESITA CONSENTIMIENTO?', valor: 'Sí, y solo se cargan con tu consentimiento.' },
      {
        etiqueta: 'MÁS INFORMACIÓN',
        valor: (
          <a
            href="https://www.facebook.com/privacy/policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            facebook.com/privacy/policy
          </a>
        ),
      },
    ],
  },
]

/**
 * Destinatarios de los datos del formulario, artículo 13.1.e del RGPD.
 *
 * Verificado en `app/presupuesto/actions.ts` y `lib/meta-capi.ts`: qué recibe
 * cada uno y detrás de qué condición. Ni uno solo está aquí por costumbre.
 *
 * ⚠️ **No son «cesiones».** Resend, Telegram y Vercel son encargados del
 * tratamiento del artículo 28: tratan los datos por cuenta de la empresa y con
 * sus instrucciones, no para lo suyo. Google y Meta, en la parte publicitaria,
 * no encajan ahí, y por eso su fila dice consentimiento y las otras no.
 *
 * 🔴 **Que sean encargados es el encuadre correcto; que exista el contrato del
 * artículo 28.3 no lo sabe nadie.** Esa afirmación va con marcador visible en la
 * prosa de `app/politica-de-privacidad/page.tsx`, no aquí: es una sola decisión
 * del dueño sobre los cinco, no cinco filas de tabla.
 *
 * 🔴 **Qué recibe Meta y qué recibe Google: son dos patas, no una.** Hasta el
 * 2026-09-18 la fila de Meta solo contaba la del servidor —los hashes de la
 * CAPI— y se dejaba fuera todo lo que manda el navegador, que va **en claro**.
 * Informar de menos es la dirección mala del art. 13.1.e, así que las dos filas
 * se han reescrito leyendo las tres fuentes:
 *
 * - `lib/meta-capi.ts` — `user_data` de la CAPI. Hashea `ph`, `em`, `ct` y dos
 *   que la ficha no nombraba: `country`, que es el hash de «es» y **se añade
 *   siempre** aunque ninguna pantalla pregunte el país, y `external_id`, que es
 *   el hash del código de referencia. `fn`, `ln` y `st` existen en el módulo
 *   pero **no se informan**: `app/presupuesto/actions.ts` no los rellena en la
 *   llamada, así que hoy no viajan, y anunciar un dato que no sale es el mismo
 *   error en la otra dirección.
 * - `components/secciones/FormularioPresupuesto.tsx` — el `params` del `Lead`:
 *   `form_location`, `space_type`, `municipality`, `event_id`, `reference_code`
 *   y `currency`.
 * - `lib/eventos.ts` — `paramsComunes()` añade `page_path` y `device_type`, y
 *   `registrarEvento` pasa **el mismo objeto** a `gtag` y a `fbq`. De ahí que
 *   las dos filas enumeren casi lo mismo: no es copia, es que es el mismo envío.
 *   Lo que las separa es que Meta suma los hashes de la CAPI y las cookies
 *   `_fbp`/`_fbc`.
 */
export type FilaDestinatario = { destino: string; filas: FilaTablaTecnica[] }

export const destinatarios: FilaDestinatario[] = [
  {
    destino: 'Resend',
    filas: [
      { etiqueta: 'PARA QUÉ', valor: 'Entregar en nuestro buzón el correo con tu solicitud' },
      {
        etiqueta: 'QUÉ RECIBE',
        valor:
          'Todo el formulario, incluida la foto que adjuntes, el código de referencia, el origen de la visita y qué habías contestado al aviso de cookies al enviarlo',
      },
      { etiqueta: 'DÓNDE TRATA LOS DATOS', valor: 'Estados Unidos' },
      { etiqueta: 'EN QUÉ CONDICIÓN', valor: 'Encargado del tratamiento (art. 28 RGPD)' },
    ],
  },
  {
    destino: 'Telegram',
    filas: [
      {
        etiqueta: 'PARA QUÉ',
        valor: 'Avisarnos al momento en el móvil de que ha entrado una solicitud',
      },
      {
        etiqueta: 'QUÉ RECIBE',
        valor:
          'Nombre, teléfono, correo, qué quieres pavimentar, municipio, origen de la visita, código de referencia y qué habías contestado al aviso de cookies. No recibe la foto',
      },
      { etiqueta: 'DÓNDE TRATA LOS DATOS', valor: 'Emiratos Árabes Unidos (Telegram FZ-LLC, Dubái)' },
      { etiqueta: 'EN QUÉ CONDICIÓN', valor: 'Encargado del tratamiento (art. 28 RGPD)' },
    ],
  },
  {
    destino: 'Vercel',
    filas: [
      { etiqueta: 'PARA QUÉ', valor: 'Alojar esta web y servirla' },
      {
        etiqueta: 'QUÉ RECIBE',
        valor:
          'Los datos técnicos de cada petición —dirección IP, navegador y página pedida— y, al enviar el formulario, su contenido, que se procesa en el servidor',
      },
      { etiqueta: 'DÓNDE TRATA LOS DATOS', valor: 'Estados Unidos' },
      { etiqueta: 'EN QUÉ CONDICIÓN', valor: 'Encargado del tratamiento (art. 28 RGPD)' },
    ],
  },
  {
    destino: 'Meta',
    filas: [
      {
        etiqueta: 'PARA QUÉ',
        valor: 'Medir y segmentar la publicidad de Facebook e Instagram',
      },
      {
        etiqueta: 'QUÉ RECIBE',
        valor:
          'Cifrados con SHA-256: teléfono, correo, municipio, el código de referencia de tu visita y el país «es», que no te preguntamos en ninguna pantalla. Sin cifrar: dirección IP, navegador, página desde la que envías, las cookies _fbp y _fbc, y —desde tu navegador— otra vez el municipio y el código de referencia en texto legible, qué quieres pavimentar, en qué punto de la web estaba el formulario, la página, el tipo de dispositivo, un identificador de este envío y la moneda',
      },
      {
        etiqueta: 'DÓNDE TRATA LOS DATOS',
        valor:
          'Meta Platforms Ireland Limited, con transferencia a Estados Unidos según declara el propio proveedor',
      },
      { etiqueta: 'EN QUÉ CONDICIÓN', valor: 'Solo con tu consentimiento (art. 6.1.a RGPD)' },
    ],
  },
  {
    destino: 'Google',
    filas: [
      {
        etiqueta: 'PARA QUÉ',
        valor: 'Analítica de Google Analytics 4 y medición de las conversiones de Google Ads',
      },
      {
        etiqueta: 'QUÉ RECIBE',
        valor:
          'Los avisos de navegación y de contacto: página, tipo de dispositivo, dónde pulsaste y, al enviar el formulario, qué quieres pavimentar, el municipio que hayas escrito, el código de referencia de tu visita, en qué punto de la web estaba el formulario, un identificador de este envío y la moneda. Y, como en cualquier petición a un servidor, tu dirección IP y tu navegador',
      },
      {
        etiqueta: 'DÓNDE TRATA LOS DATOS',
        valor:
          'Google Ireland Limited, con transferencia a Estados Unidos según declara el propio proveedor',
      },
      {
        etiqueta: 'EN QUÉ CONDICIÓN',
        valor:
          'Consentimiento (art. 6.1.a RGPD) para las cookies y la publicidad personalizada. La etiqueta se carga desde la primera visita, y los avisos de navegación y de contacto le llegan aunque no hayas aceptado; lo que tu decisión gobierna es si Google puede usar almacenamiento en tu dispositivo.',
      },
    ],
  },
]
