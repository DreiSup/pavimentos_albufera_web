import type { LegalFacts } from '../schemas/legal-facts.ts'

/**
 * Structured facts from `apps/web/src/content/legal.tsx`, PLAIN-STRING ROWS
 * ONLY (D6, option b). Rows whose `valor` is JSX in the source
 * (`<DatoPendiente>` markers, the two external `<a>` links, and the one row
 * mixing plain text with a `<DatoPendiente>` fragment — `_fbc`'s duration)
 * are NOT represented here: they stay hand-written JSX in the
 * `apps/web/src/content/legal.tsx` adapter, unchanged in this phase, and
 * are proven byte-identical in phase 2b, not this one. Rows that read
 * `nap.*` live values (phone, address, email, business name) are likewise
 * left out — the adapter reads those from `@site/content`'s business data
 * directly, not a second frozen copy.
 *
 * That's why `ownCookies`'s `_fbc` ficha has 5 rows here, not 6, and
 * `thirdPartyCookies`'s two fichas have 5 rows here, not 8 — the missing
 * rows (`NOMBRES`, `DURACIÓN`, `MÁS INFORMACIÓN`) are exactly the JSX ones.
 * `identificationRows`/`controllerRows` carry ONLY the rows whose LABEL and
 * VALUE are both plain strings (RAZÓN SOCIAL, NIF O CIF, ACTIVIDAD, DOMINIO,
 * RESPONSABLE) — not the full `identificacion`/`responsable` tables, which
 * also have TITULAR DEL SITIO WEB/CORREO ELECTRÓNICO/TELÉFONO (read `nap.*`
 * live) and DOMICILIO SOCIAL/DATOS REGISTRALES/CÓDIGOS DE CONDUCTA/DELEGADO
 * (JSX). Those stay adapter-only in this phase.
 */
export const legal: LegalFacts = {
  companyName: 'Pavimentos Albufera Sociedad Limitada',
  taxId: 'B02882090',
  domain: 'pavimentos-albufera.com',
  activity: { es: 'Pavimentos de hormigón: impreso, pulido, lavado, fratasado, desactivado y microcemento' },
  lastLegalReview: { es: '18 de septiembre de 2026' },
  identificationRows: [
    { label: { es: 'RAZÓN SOCIAL' }, value: { es: 'Pavimentos Albufera Sociedad Limitada' } },
    { label: { es: 'NIF O CIF' }, value: { es: 'B02882090' } },
    {
      label: { es: 'ACTIVIDAD' },
      value: { es: 'Pavimentos de hormigón: impreso, pulido, lavado, fratasado, desactivado y microcemento' },
    },
    { label: { es: 'DOMINIO' }, value: { es: 'pavimentos-albufera.com' } },
  ],
  controllerRows: [
    { label: { es: 'RESPONSABLE' }, value: { es: 'Pavimentos Albufera Sociedad Limitada' } },
    { label: { es: 'NIF O CIF' }, value: { es: 'B02882090' } },
  ],
  ownCookies: [
    {
      name: 'pa_consent',
      rows: [
        { label: { es: 'QUIÉN LA PONE' }, value: { es: 'Esta web, desde el navegador' } },
        {
          label: { es: 'PARA QUÉ SIRVE' },
          value: {
            es: 'Recuerda si has aceptado o rechazado las cookies de analítica y publicidad. Sin ella el aviso volvería a salir en cada página.',
          },
        },
        {
          label: { es: 'CUÁNDO SE ESCRIBE' },
          value: { es: 'Al pulsar «Aceptar» o «Rechazar». Antes de que decidas no existe.' },
        },
        { label: { es: 'DURACIÓN' }, value: { es: '180 días' } },
        { label: { es: 'TIPO' }, value: { es: 'Propia, técnica' } },
        {
          label: { es: '¿NECESITA CONSENTIMIENTO?' },
          value: { es: 'No. Guardar tu decisión es la forma de cumplir el artículo 22.2 de la LSSI, así que está exenta.' },
        },
      ],
    },
    {
      name: 'pa_ref',
      rows: [
        { label: { es: 'QUIÉN LA PONE' }, value: { es: 'Esta web, desde su servidor' } },
        {
          label: { es: 'PARA QUÉ SIRVE' },
          value: {
            es: 'Guarda un código de seis caracteres que se añade al mensaje de WhatsApp, para poder relacionar esa conversación con la visita que la originó. Ese mismo código viaja a Google como reference_code cuando se envía el formulario.',
          },
        },
        {
          label: { es: 'CUÁNDO SE ESCRIBE' },
          value: { es: 'En la primera visita, antes de que contestes al aviso de cookies.' },
        },
        { label: { es: 'DURACIÓN' }, value: { es: '90 días' } },
        { label: { es: 'TIPO' }, value: { es: 'Propia, de seguimiento' } },
        {
          label: { es: '¿NECESITA CONSENTIMIENTO?' },
          value: {
            es: 'Sí: es un identificador único y no está exenta. Hoy se escribe en la primera visita, antes de que puedas decidir. Si la borras se genera un código nuevo en la visita siguiente: para que no llegue a escribirse hay que bloquear las cookies de este sitio en el navegador.',
          },
        },
      ],
    },
    {
      name: 'pa_attr',
      rows: [
        { label: { es: 'QUIÉN LA PONE' }, value: { es: 'Esta web, desde su servidor' } },
        {
          label: { es: 'PARA QUÉ SIRVE' },
          value: {
            es: 'Guarda de qué anuncio o campaña procede la visita: los parámetros gclid, gbraid, wbraid, utm_ y fbclid de la dirección de entrada, la página de llegada y la fecha. Solo se guarda el primer origen.',
          },
        },
        { label: { es: 'CUÁNDO SE ESCRIBE' }, value: { es: 'Solo si aceptas, y solo si has llegado desde un anuncio.' } },
        { label: { es: 'DURACIÓN' }, value: { es: '90 días' } },
        { label: { es: 'TIPO' }, value: { es: 'Propia, publicitaria' } },
        { label: { es: '¿NECESITA CONSENTIMIENTO?' }, value: { es: 'Sí, y solo se escribe con tu consentimiento.' } },
      ],
    },
    {
      name: '_fbc',
      rows: [
        { label: { es: 'QUIÉN LA PONE' }, value: { es: 'Esta web, o la etiqueta de Meta si llega antes' } },
        {
          label: { es: 'PARA QUÉ SIRVE' },
          value: {
            es: 'Guarda el identificador del clic en un anuncio de Facebook o Instagram, para que Meta pueda atribuir el contacto al anuncio del que salió.',
          },
        },
        { label: { es: 'CUÁNDO SE ESCRIBE' }, value: { es: 'Solo si aceptas, y solo si venías de un anuncio de Meta.' } },
        // DURACIÓN omitted: source mixes plain text with a <DatoPendiente> fragment — stays JSX in the adapter.
        { label: { es: 'TIPO' }, value: { es: 'Propia de dominio, con finalidad publicitaria de Meta' } },
        { label: { es: '¿NECESITA CONSENTIMIENTO?' }, value: { es: 'Sí, y solo se escribe con tu consentimiento.' } },
      ],
    },
  ],
  thirdPartyCookies: [
    {
      name: 'Google · gtag.js',
      rows: [
        { label: { es: 'QUIÉN LA PONE' }, value: { es: 'Google Ireland Limited, a través de la etiqueta gtag.js' } },
        {
          label: { es: 'PARA QUÉ SIRVE' },
          value: {
            es: 'Analítica de Google Analytics 4 —cuántas personas entran, por dónde y qué hacen— y medición de las conversiones de Google Ads.',
          },
        },
        {
          label: { es: 'CUÁNDO SE ESCRIBE' },
          value: {
            es: 'La etiqueta se carga en todas las páginas desde la primera visita, con los cuatro permisos del Consent Mode v2 de Google denegados mientras no aceptes. En ese estado Google recibe avisos de tu navegación —la página, tu dirección IP y tu navegador— y esta web le indica que no puede usar almacenamiento en tu dispositivo. Qué hace Google con esa señal lo determina Google.',
          },
        },
        // NOMBRES, DURACIÓN, MÁS INFORMACIÓN omitted: <DatoPendiente>/<a> JSX rows — stay in the adapter.
        { label: { es: 'TIPO' }, value: { es: 'De tercero, analítica y publicitaria' } },
        {
          label: { es: '¿NECESITA CONSENTIMIENTO?' },
          value: {
            es: 'Sí. Google Analytics 4 no entra en la exención de las cookies de medición de audiencia, porque los datos no se tratan en exclusiva para este sitio ni se quedan en estadísticas anónimas.',
          },
        },
      ],
    },
    {
      name: 'Meta · _fbp y fbevents.js',
      rows: [
        {
          label: { es: 'QUIÉN LA PONE' },
          value: { es: 'Meta Platforms Ireland Limited, a través de la etiqueta fbevents.js' },
        },
        {
          label: { es: 'PARA QUÉ SIRVE' },
          value: {
            es: 'Identifica el navegador para Meta. Esta web lee _fbp y _fbc al enviar el formulario de presupuesto, para mandarlos a la API de conversiones de Meta junto con el aviso del contacto.',
          },
        },
        {
          label: { es: 'CUÁNDO SE ESCRIBE' },
          value: {
            es: 'Solo si aceptas: la etiqueta de Meta no se carga hasta entonces, porque Meta no tiene equivalente del Consent Mode de Google.',
          },
        },
        // NOMBRES, DURACIÓN, MÁS INFORMACIÓN omitted: JSX rows — stay in the adapter.
        { label: { es: 'TIPO' }, value: { es: 'De tercero, publicitaria' } },
        { label: { es: '¿NECESITA CONSENTIMIENTO?' }, value: { es: 'Sí, y solo se cargan con tu consentimiento.' } },
      ],
    },
  ],
  recipients: [
    {
      recipient: 'Resend',
      rows: [
        { label: { es: 'PARA QUÉ' }, value: { es: 'Entregar en nuestro buzón el correo con tu solicitud' } },
        {
          label: { es: 'QUÉ RECIBE' },
          value: {
            es: 'Todo el formulario, incluida la foto que adjuntes, el código de referencia, el origen de la visita y qué habías contestado al aviso de cookies al enviarlo',
          },
        },
        { label: { es: 'DÓNDE TRATA LOS DATOS' }, value: { es: 'Estados Unidos' } },
        { label: { es: 'EN QUÉ CONDICIÓN' }, value: { es: 'Encargado del tratamiento (art. 28 RGPD)' } },
      ],
    },
    {
      recipient: 'Telegram',
      rows: [
        { label: { es: 'PARA QUÉ' }, value: { es: 'Avisarnos al momento en el móvil de que ha entrado una solicitud' } },
        {
          label: { es: 'QUÉ RECIBE' },
          value: {
            es: 'Nombre, teléfono, correo, qué quieres pavimentar, municipio, origen de la visita, código de referencia y qué habías contestado al aviso de cookies. No recibe la foto',
          },
        },
        { label: { es: 'DÓNDE TRATA LOS DATOS' }, value: { es: 'Emiratos Árabes Unidos (Telegram FZ-LLC, Dubái)' } },
        { label: { es: 'EN QUÉ CONDICIÓN' }, value: { es: 'Encargado del tratamiento (art. 28 RGPD)' } },
      ],
    },
    {
      recipient: 'Vercel',
      rows: [
        { label: { es: 'PARA QUÉ' }, value: { es: 'Alojar esta web y servirla' } },
        {
          label: { es: 'QUÉ RECIBE' },
          value: {
            es: 'Los datos técnicos de cada petición —dirección IP, navegador y página pedida— y, al enviar el formulario, su contenido, que se procesa en el servidor',
          },
        },
        { label: { es: 'DÓNDE TRATA LOS DATOS' }, value: { es: 'Estados Unidos' } },
        { label: { es: 'EN QUÉ CONDICIÓN' }, value: { es: 'Encargado del tratamiento (art. 28 RGPD)' } },
      ],
    },
    {
      recipient: 'Meta',
      rows: [
        { label: { es: 'PARA QUÉ' }, value: { es: 'Medir y segmentar la publicidad de Facebook e Instagram' } },
        {
          label: { es: 'QUÉ RECIBE' },
          value: {
            es: 'Cifrados con SHA-256: teléfono, correo, municipio, el código de referencia de tu visita y el país «es», que no te preguntamos en ninguna pantalla. Sin cifrar: dirección IP, navegador, página desde la que envías, las cookies _fbp y _fbc, y —desde tu navegador— otra vez el municipio y el código de referencia en texto legible, qué quieres pavimentar, en qué punto de la web estaba el formulario, la página, el tipo de dispositivo, un identificador de este envío y la moneda',
          },
        },
        {
          label: { es: 'DÓNDE TRATA LOS DATOS' },
          value: { es: 'Meta Platforms Ireland Limited, con transferencia a Estados Unidos según declara el propio proveedor' },
        },
        { label: { es: 'EN QUÉ CONDICIÓN' }, value: { es: 'Solo con tu consentimiento (art. 6.1.a RGPD)' } },
      ],
    },
    {
      recipient: 'Google',
      rows: [
        {
          label: { es: 'PARA QUÉ' },
          value: { es: 'Analítica de Google Analytics 4 y medición de las conversiones de Google Ads' },
        },
        {
          label: { es: 'QUÉ RECIBE' },
          value: {
            es: 'Los avisos de navegación y de contacto: página, tipo de dispositivo, dónde pulsaste y, al enviar el formulario, qué quieres pavimentar, el municipio que hayas escrito, el código de referencia de tu visita, en qué punto de la web estaba el formulario, un identificador de este envío y la moneda. Y, como en cualquier petición a un servidor, tu dirección IP y tu navegador',
          },
        },
        {
          label: { es: 'DÓNDE TRATA LOS DATOS' },
          value: { es: 'Google Ireland Limited, con transferencia a Estados Unidos según declara el propio proveedor' },
        },
        {
          label: { es: 'EN QUÉ CONDICIÓN' },
          value: {
            es: 'Consentimiento (art. 6.1.a RGPD) para las cookies y la publicidad personalizada. La etiqueta se carga desde la primera visita, y los avisos de navegación y de contacto le llegan aunque no hayas aceptado; lo que tu decisión gobierna es si Google puede usar almacenamiento en tu dispositivo.',
          },
        },
      ],
    },
  ],
}
