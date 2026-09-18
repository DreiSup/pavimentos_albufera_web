import type { Metadata } from 'next'
import Link from 'next/link'
import PlantillaLegal, { BloqueLegal } from '@/components/secciones/PlantillaLegal'
import TablaFichaTecnica from '@/components/datos/TablaFichaTecnica'
import DatoPendiente from '@/components/datos/DatoPendiente'
import { destinatarios, responsable, ultimaRevisionLegal } from '@/content/legal'
import { nap } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  alternates: { canonical: '/politica-de-privacidad/' },
}

/**
 * Política de privacidad rehecha contra `lib/legal/09-instrucciones-legales.md`
 * §3, siguiendo la lista del artículo 13 del RGPD punto por punto.
 *
 * **El texto heredado se retira entero.** Se apoyaba en la Ley Orgánica 15/1999
 * —derogada por la disposición derogatoria única de la LO 3/2018—, prometía que
 * los datos se incorporarían a «los ficheros declarados ante la Agencia
 * Española de Protección de Datos» —ese registro no existe desde el RGPD—, solo
 * enumeraba los cuatro derechos ARCO y afirmaba que los datos «no serán cedidos
 * a terceras organizaciones» teniendo cinco destinos, dos fuera del EEE. No es
 * corregible frase a frase: lo que describía no es este sitio.
 *
 * 🔴 **La casilla de privacidad del formulario NO es la base jurídica.** Es
 * cumplimiento del deber de información del artículo 13. Documentarla como
 * consentimiento significaría que quien lo retira deja a la empresa sin
 * legitimación para contestar el presupuesto que él mismo ha pedido. Atender la
 * solicitud va por el artículo 6.1.b —medidas precontractuales a petición del
 * interesado— y así está redactado.
 *
 * **Todo lo que esta página afirma sobre el comportamiento del sitio está leído
 * en el código**, no supuesto: `components/secciones/FormularioPresupuesto.tsx`
 * (campos de las dos variantes, campos ocultos y casilla),
 * `app/presupuesto/actions.ts` (validación, tope de 4 MB de la foto, límite por
 * IP, Resend, Telegram y la puerta de consentimiento de la CAPI),
 * `lib/meta-capi.ts` (qué se cifra y qué viaja en claro),
 * `app/api/atribucion/route.ts` y `lib/cookies.ts` (cookies y código de
 * referencia) y `app/layout.tsx` (Consent Mode v2 y carga de `gtag.js`).
 *
 * ⚠️ Lo que decide el dueño no lo decide esta página: plazos de conservación,
 * finalidades añadidas y cómo describir la segmentación publicitaria salen como
 * marcador `[PENDIENTE: …]` visible, no como un valor «de ejemplo».
 */
export default function PoliticaPrivacidad() {
  return (
    <PlantillaLegal
      titulo="Política de privacidad"
      ultimaActualizacion={ultimaRevisionLegal}
      entradilla={
        <>
          <p>
            Aquí se explica qué datos personales recoge pavimentos-albufera.com, para qué se usan,
            con qué amparo legal, a quién se envían, cuánto se conservan y qué puedes hacer tú al
            respecto. Está escrito según el artículo 13 del Reglamento (UE) 2016/679, el RGPD, y la
            Ley Orgánica 3/2018.
          </p>
          <p>
            Las cookies tienen su propia página, con la lista completa y sus duraciones:{' '}
            <Link href="/politica-de-cookies/" className="text-tinta">
              política de cookies
            </Link>
            .
          </p>
        </>
      }
      secciones={[
        {
          titulo: 'Quién trata tus datos',
          contenido: (
            <>
              <TablaFichaTecnica filas={responsable} />
              <p>
                Los datos entre corchetes son los que la empresa todavía no ha facilitado para su
                publicación. Están señalados a propósito, en lugar de rellenarse con un valor
                aproximado.
              </p>
            </>
          ),
        },
        {
          titulo: 'Qué datos recogemos, y por dónde',
          contenido: (
            <>
              <BloqueLegal titulo="Formulario de presupuesto">
                <p>
                  El formulario tiene dos variantes. La <strong>corta</strong>, que cierra la
                  portada, pide nombre y apellidos, teléfono, correo electrónico —opcional—, qué
                  quieres pavimentar y la casilla de haber leído esta política. La{' '}
                  <strong>larga</strong>, que está en{' '}
                  <Link href="/presupuesto/" className="text-tinta">
                    la página de presupuesto
                  </Link>{' '}
                  y al final de cada página de servicio, pide además la superficie en metros
                  cuadrados, el municipio, un mensaje libre y, si quieres,{' '}
                  <strong>una foto del espacio</strong>, que puede ser cualquier imagen de hasta
                  4 MB.
                </p>
                <p>
                  Con el envío viajan también tres campos que no ves y que no has escrito tú: un
                  identificador del envío para no contar dos veces la misma solicitud, la página
                  desde la que has enviado el formulario y un campo trampa, vacío y oculto, que sirve
                  para descartar envíos automáticos. Están aquí porque el deber de información no
                  distingue entre lo que tecleas y lo que añade el sitio.
                </p>
              </BloqueLegal>

              <BloqueLegal titulo="Datos técnicos de la visita">
                <p>
                  Como cualquier web, al servirte estas páginas nuestro alojamiento registra datos
                  técnicos de la petición: tu dirección IP, el navegador y el dispositivo, y la
                  página pedida. Al enviar el formulario, la dirección IP se usa además para limitar
                  el número de envíos seguidos desde un mismo punto.
                </p>
              </BloqueLegal>

              <BloqueLegal titulo="Código de referencia">
                <p>
                  En la primera visita el sitio genera un código de seis caracteres, lo guarda en tu
                  navegador durante 90 días y lo añade al mensaje que se escribe solo cuando pulsas
                  el botón de WhatsApp, junto con la página desde la que has pulsado. Sirve para
                  saber de qué visita salió una conversación. Ese mismo código viaja a Meta cuando
                  envías el formulario habiendo aceptado las cookies, y a Google con el aviso de que
                  has enviado el formulario.
                </p>
              </BloqueLegal>

              <BloqueLegal titulo="Llamadas y WhatsApp">
                <p>
                  Los botones de llamar y de WhatsApp te sacan de este sitio. La llamada la cursa tu
                  operador; la conversación de WhatsApp ocurre dentro de WhatsApp y se rige por las
                  condiciones y la política de privacidad de Meta, no por esta. Lo que nos cuentes
                  por esas dos vías lo tratamos igual que lo que nos llega por el formulario: para
                  atenderte.
                </p>
              </BloqueLegal>

              <BloqueLegal titulo="Cookies">
                <p>
                  Además de lo anterior, el sitio usa cookies de analítica y de publicidad si las
                  aceptas. Están todas descritas, una a una, en la{' '}
                  <Link href="/politica-de-cookies/" className="text-tinta">
                    política de cookies
                  </Link>
                  .
                </p>
              </BloqueLegal>
            </>
          ),
        },
        {
          titulo: 'Para qué los usamos, y con qué amparo legal',
          contenido: (
            <>
              <BloqueLegal titulo="Atender tu solicitud y preparar el presupuesto">
                <p>
                  Usamos lo que nos das para llamarte o escribirte, hacerte el presupuesto, medir o
                  visitar la obra si hace falta y mantener contigo esa conversación comercial.
                </p>
                <p>
                  <strong>Amparo legal:</strong> artículo 6.1.b del RGPD, medidas precontractuales
                  adoptadas a petición tuya. Marcar la casilla de esta política no es lo que nos
                  legitima para contestarte: es la forma de dejar constancia de que has recibido esta
                  información antes de enviarnos nada.
                </p>
              </BloqueLegal>

              <BloqueLegal titulo="Que el formulario no se llene de envíos automáticos">
                <p>
                  Descartamos los envíos que rellenan el campo trampa y limitamos el número de envíos
                  seguidos desde una misma dirección IP.
                </p>
                <p>
                  <strong>Amparo legal:</strong> artículo 6.1.f, interés legítimo de la empresa en
                  que el canal por el que entran sus clientes siga funcionando y no quede inutilizado
                  por envíos masivos.
                </p>
              </BloqueLegal>

              <BloqueLegal titulo="Analítica y publicidad">
                <p>
                  Si lo aceptas, medimos cómo se usa el sitio con Google Analytics 4 y medimos y
                  segmentamos los anuncios de Google Ads, Facebook e Instagram.
                </p>
                <p>
                  <strong>Amparo legal:</strong> tu consentimiento, y son dos consentimientos
                  distintos que se piden a la vez. El del artículo 22.2 de la LSSI permite guardar y
                  leer cookies en tu dispositivo; el del artículo 6.1.a del RGPD permite tratar los
                  datos que salen de ahí. Puedes retirarlo cuando quieras, sin que eso afecte a lo
                  que se hizo mientras estaba dado.
                </p>
              </BloqueLegal>

              <BloqueLegal titulo="Otras finalidades">
                <p>
                  <DatoPendiente>
                    PENDIENTE: confirmar si los datos se usan para alguna finalidad más —por ejemplo,
                    envío de comunicaciones comerciales posteriores— y con qué amparo legal
                  </DatoPendiente>
                </p>
              </BloqueLegal>
            </>
          ),
        },
        {
          titulo: '¿Tienes que darnos estos datos?',
          contenido: (
            <p>
              No estás obligado por ninguna ley a dárnoslos, pero sin ellos no podemos hacer lo que
              nos pides. El formulario marca con asterisco los campos que pide como obligatorios: el
              nombre, el teléfono, qué quieres pavimentar y, en la variante larga, la superficie y el
              municipio. Sin nombre, sin teléfono, sin elegir qué quieres pavimentar y sin aceptar
              esta política, el envío no llega a salir. El correo, el mensaje y la foto son
              opcionales, y lo único que pasa si no los pones es que el presupuesto será menos
              afinado o tendremos que preguntártelo por teléfono.
            </p>
          ),
        },
        {
          titulo: 'A quién enviamos tus datos',
          contenido: (
            <>
              <p>
                No vendemos tus datos ni los cedemos a nadie para que los use por su cuenta. Sí hay
                proveedores que los tratan <strong>por cuenta nuestra</strong> para que esto
                funcione: entregar el correo, avisarnos de que has escrito y alojar la web. En
                términos del artículo 28 del RGPD son <strong>encargados del tratamiento</strong>, no
                cesiones. Meta y Google son distinto: ahí los datos se usan también para publicidad,
                y por eso su amparo legal es tu consentimiento y no el contrato.
              </p>
              <p>
                Con precisión, porque es lo que exige informar bien: la etiqueta de Google se carga
                en todas las páginas desde la primera visita. Mientras no aceptes, esta web le indica
                que no puede usar almacenamiento en tu dispositivo, pero Google recibe igualmente el
                aviso de qué página estás viendo, con tu dirección IP y tu navegador. Si prefieres
                que no lo reciba, puedes bloquear esa etiqueta desde tu navegador, como se explica en
                la{' '}
                <Link href="/politica-de-cookies/" className="text-tinta">
                  política de cookies
                </Link>
                .
              </p>
              {destinatarios.map((proveedor) => (
                <BloqueLegal key={proveedor.destino} titulo={proveedor.destino}>
                  <TablaFichaTecnica filas={proveedor.filas} />
                </BloqueLegal>
              ))}
              <p>
                Además, tus datos pueden comunicarse a jueces, tribunales, fuerzas y cuerpos de
                seguridad o administraciones públicas cuando una norma lo exija.
              </p>
            </>
          ),
        },
        {
          titulo: 'Transferencias fuera del Espacio Económico Europeo',
          contenido: (
            <>
              <BloqueLegal titulo="Estados Unidos — Resend, Vercel, Google y Meta">
                <p>
                  Estos proveedores tratan datos en Estados Unidos. La Comisión Europea declaró el 10
                  de julio de 2023 que Estados Unidos ofrece un nivel de protección adecuado para las
                  entidades certificadas en el <em>EU-US Data Privacy Framework</em>, y esa decisión
                  sigue en vigor: el Tribunal General desestimó el recurso presentado contra ella el
                  3 de septiembre de 2025. Puedes consultarla en{' '}
                  <a
                    href="https://eur-lex.europa.eu/eli/dec_impl/2023/1795/oj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tinta"
                  >
                    eur-lex.europa.eu
                  </a>
                  , y la lista de entidades certificadas en{' '}
                  <a
                    href="https://www.dataprivacyframework.gov/list"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tinta"
                  >
                    dataprivacyframework.gov
                  </a>
                  .
                </p>
                <p>
                  La decisión solo ampara al proveedor que esté certificado; el que no lo esté
                  necesita las cláusulas contractuales tipo del artículo 46.{' '}
                  <DatoPendiente>
                    PENDIENTE: comprobar uno a uno en la lista del Data Privacy Framework si Resend,
                    Vercel, Google y Meta están certificados, y anotar aquí el resultado y, en su
                    caso, la garantía del artículo 46 que se aplique
                  </DatoPendiente>
                </p>
              </BloqueLegal>

              <BloqueLegal titulo="Emiratos Árabes Unidos — Telegram">
                <p>
                  El aviso interno que nos llega al móvil lo entrega Telegram FZ-LLC, con sede en
                  Dubái. <strong>La Comisión Europea no ha declarado adecuados los Emiratos Árabes
                  Unidos</strong>, así que esta transferencia necesita una garantía del artículo 46
                  del RGPD o una excepción del artículo 49.{' '}
                  <DatoPendiente>
                    PENDIENTE: decidir qué ampara el envío a Telegram —garantía del art. 46 o
                    excepción del art. 49— o retirar Telegram del circuito de los datos personales
                  </DatoPendiente>
                </p>
              </BloqueLegal>
            </>
          ),
        },
        {
          titulo: 'Cuánto conservamos tus datos',
          contenido: (
            <>
              <BloqueLegal titulo="Datos de tu solicitud de presupuesto">
                <p>
                  <DatoPendiente>
                    PENDIENTE: plazo de conservación de los datos del presupuesto, o el criterio para
                    calcularlo. Decisión del titular
                  </DatoPendiente>
                </p>
              </BloqueLegal>
              <BloqueLegal titulo="Foto que adjuntes">
                <p>
                  <DatoPendiente>
                    PENDIENTE: plazo de conservación de la foto adjunta, que conviene que sea más
                    corto que el del resto de la solicitud. Decisión del titular
                  </DatoPendiente>
                </p>
              </BloqueLegal>
              <BloqueLegal titulo="Cookies">
                <p>
                  Cada cookie caduca por sí sola en el plazo que figura en la{' '}
                  <Link href="/politica-de-cookies/" className="text-tinta">
                    política de cookies
                  </Link>
                  : 180 días la que guarda tu decisión y 90 las demás.
                </p>
              </BloqueLegal>
            </>
          ),
        },
        {
          titulo: 'Decisiones automatizadas y elaboración de perfiles',
          contenido: (
            <p>
              Ningún presupuesto se decide de forma automática: lo hace una persona. Lo que sí ocurre
              es que, si aceptas las cookies de publicidad, los datos que se envían a Google y a Meta
              los usan esas plataformas para segmentar anuncios.{' '}
              <DatoPendiente>
                PENDIENTE: decidir cómo se describe exactamente la segmentación publicitaria que
                hacen Meta y Google con estos datos, y si procede considerarla elaboración de
                perfiles del art. 22 del RGPD
              </DatoPendiente>
            </p>
          ),
        },
        {
          titulo: 'Tus derechos',
          contenido: (
            <>
              <p>Sobre tus datos personales puedes ejercer estos derechos:</p>
              <ul>
                <li>
                  <strong>Acceso:</strong> saber qué datos tuyos tenemos y qué hacemos con ellos.
                </li>
                <li>
                  <strong>Rectificación:</strong> corregir los que estén mal o incompletos.
                </li>
                <li>
                  <strong>Supresión:</strong> pedir que los borremos cuando ya no sean necesarios.
                </li>
                <li>
                  <strong>Limitación del tratamiento:</strong> pedir que los conservemos sin usarlos
                  mientras se resuelve una discrepancia.
                </li>
                <li>
                  <strong>Oposición:</strong> oponerte a que los tratemos por interés legítimo.
                </li>
                <li>
                  <strong>Portabilidad:</strong> recibir en un formato legible los datos que nos has
                  dado, o que se los enviemos a otro responsable.
                </li>
                <li>
                  <strong>Retirar el consentimiento</strong> en cualquier momento, para lo que se
                  basa en él, sin que eso afecte a lo que se hizo antes de retirarlo.
                </li>
              </ul>
              <p>
                Para ejercerlos, escríbenos a{' '}
                <a href={`mailto:${nap.email}`} className="text-tinta">
                  {nap.email}
                </a>{' '}
                diciendo qué derecho quieres ejercer y adjuntando algo que acredite que eres tú. Si
                actúas en nombre de otra persona, adjunta también lo que acredite la representación.
              </p>
              <p>
                Y si crees que no hemos atendido bien tu petición o que estamos tratando tus datos
                indebidamente, puedes reclamar ante la Agencia Española de Protección de Datos,{' '}
                <a
                  href="https://www.aepd.es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tinta"
                >
                  www.aepd.es
                </a>
                .
              </p>
            </>
          ),
        },
        {
          titulo: 'Cambios en esta política',
          contenido: (
            <p>
              Esta política puede cambiar si cambia lo que hace el sitio o la normativa que se le
              aplica. La versión que rige es la publicada aquí, y la fecha de la última revisión
              encabeza la página.
            </p>
          ),
        },
      ]}
    />
  )
}
