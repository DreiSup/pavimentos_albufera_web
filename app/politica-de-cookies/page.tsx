import type { Metadata } from 'next'
import Link from 'next/link'
import PlantillaLegal, { BloqueLegal } from '@/components/secciones/PlantillaLegal'
import TablaFichaTecnica from '@/components/datos/TablaFichaTecnica'
import { cookiesPropias, cookiesTerceros, type FichaCookie, ultimaRevisionLegal } from '@/content/legal'

export const metadata: Metadata = {
  title: 'Política de cookies',
  alternates: { canonical: '/politica-de-cookies/' },
}

/**
 * Ficha de una cookie.
 *
 * ⚠️ El nombre va en monoespaciada pero **no en versalitas**, que es la única
 * excepción a la regla de `design/01` §2.4 en toda la página, y no es
 * estilística: `pa_consent` y `PA_CONSENT` son cookies distintas. Poner en
 * mayúsculas el nombre de una cookie en el documento que sirve para buscarla en
 * el navegador la haría imposible de encontrar.
 */
function Cookie({ ficha }: { ficha: FichaCookie }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-mono text-d-14 text-tinta">{ficha.nombre}</h3>
      <TablaFichaTecnica filas={ficha.filas} />
    </div>
  )
}

/**
 * Política de cookies rehecha contra `lib/legal/09-instrucciones-legales.md`
 * §4, que recorre el contenido obligatorio del apartado 3.1.1 de la **Guía
 * sobre el uso de las cookies de la AEPD, versión de mayo de 2024**.
 *
 * **Lo que se retira del texto heredado, y por qué no se podía matizar:**
 *
 * 1. **«El Usuario acepta expresamente, por la utilización del sitio web, el
 *    tratamiento de la información recabada».** Seguir navegando no es una
 *    forma válida de prestar el consentimiento, y la inactividad no lo implica
 *    en ningún caso. La frase se elimina; no se suaviza.
 * 2. **«La mayoría se borran del disco duro al finalizar la sesión».** Falso
 *    aquí: 180 días la que guarda la decisión y 90 las otras tres.
 * 3. **Las seis definiciones genéricas de tipos de cookies**, que ocupaban la
 *    página entera sin nombrar una sola cookie de este sitio —cookies de
 *    personalización y de compra que esta web no tiene—. Se sustituyen por una
 *    explicación corta y por el inventario real.
 * 4. **Google Analytics como «servicio prestado por Google, Inc.» de Mountain
 *    View.** El responsable para el EEE es Google Ireland Limited.
 *
 * 🔴 **Lo que esta página NO puede arreglar.** La guía exige que retirar el
 * consentimiento sea tan fácil como prestarlo, y da el criterio operativo:
 * acceso sencillo y permanente al panel de configuración. Hoy ese panel no
 * existe, y tampoco hay elección granular por finalidad. Esta página dice la
 * verdad —borrar la cookie en el navegador— porque es lo único que hoy
 * funciona; lo que falta es código, no texto. → `09-instrucciones-legales.md`
 * §6.1 y §6.4.
 *
 * El inventario sigue levantado leyendo el código de este repositorio, y solo
 * el código. Lo que decide Google o Meta y no consta aquí —los nombres de sus
 * cookies y su duración— va como marcador, porque afirmarlo sería copiarlo de
 * algún sitio sin haberlo comprobado. Las fuentes archivo por archivo están en
 * `content/legal.tsx`.
 */
export default function PoliticaCookies() {
  return (
    <PlantillaLegal
      titulo="Política de cookies"
      ultimaActualizacion={ultimaRevisionLegal}
      entradilla={
        <>
          <p>
            Una cookie es un pequeño archivo que una web guarda en tu dispositivo cuando la visitas,
            y que puede volver a leer después. Sirve para recordar algo entre una página y la
            siguiente —por ejemplo, una decisión que ya has tomado— y también, según quién la ponga y
            para qué, para reconocer tu navegador y seguir tu actividad de una visita a otra.
          </p>
          <p>
            Aquí tienes las que usa pavimentos-albufera.com, una a una, con quién las pone, para qué
            sirven, cuánto duran y si hace falta tu permiso. Para lo demás —qué datos personales
            tratamos, a quién se los enviamos y qué derechos tienes— está la{' '}
            <Link href="/politica-de-privacidad/">
              política de privacidad
            </Link>
            .
          </p>
        </>
      }
      secciones={[
        {
          titulo: 'Cómo te pedimos permiso, y qué pasa con cada opción',
          contenido: (
            <>
              <p>
                En la primera visita aparece abajo un aviso con dos botones del mismo tamaño y al
                mismo nivel: <strong>Aceptar</strong> y <strong>Rechazar</strong>. Ninguna opción
                viene marcada de antemano, y no hace falta aceptar para usar la web: rechazando
                funciona igual. Hoy la elección es conjunta: aceptar o rechazar cubre a la vez la
                analítica y la publicidad, sin poder elegir una y no la otra.
              </p>
              <p>
                Si <strong>aceptas</strong>, se cargan la etiqueta de Google —Google Analytics 4 y
                Google Ads— y la de Meta, y se guardan las cookies de analítica y de publicidad que
                figuran más abajo.
              </p>
              <p>
                Si <strong>rechazas</strong>, la etiqueta de Meta no llega a cargarse, no se guardan
                las cookies de publicidad de esta web y a Google se le indica, mediante el Consent
                Mode v2, que no puede usar almacenamiento en tu dispositivo.
              </p>
              <p>
                Dos precisiones que no vienen en las plantillas al uso y que aquí sí, porque es lo
                que hace este sitio. La primera: la etiqueta de Google se carga en todas las páginas
                desde la primera visita, aceptes o no, y en el estado denegado Google recibe
                igualmente el aviso de qué página estás viendo, con tu dirección IP y tu navegador.
                La segunda: la cookie <span className="font-mono text-d-14">pa_ref</span>, que guarda
                el código de referencia, se escribe en la primera visita, antes de que hayas
                contestado al aviso. Si no quieres ninguna de las dos cosas, más abajo se explica
                cómo bloquearlas y borrarlas desde el navegador.
              </p>
              <p>
                Navegar por la web, desplazarte o cerrar el aviso <strong>no</strong> equivale a
                aceptar. Mientras no pulses uno de los dos botones, el aviso sigue ahí.
              </p>
            </>
          ),
        },
        {
          titulo: 'Cookies que utiliza esta web',
          contenido: (
            <>
              <p>
                De las cookies que ponen Google y Meta, esta web decide cuándo pueden cargarse, pero
                no sus nombres ni su duración: los fija cada proveedor. Lo que no se puede afirmar
                está entre corchetes, a la espera de confirmarlo con ellos.
              </p>

              <BloqueLegal titulo="Cookies propias">
                <div className="flex flex-col gap-6">
                  {cookiesPropias.map((ficha) => (
                    <Cookie key={ficha.nombre} ficha={ficha} />
                  ))}
                </div>
              </BloqueLegal>

              <BloqueLegal titulo="Cookies de terceros">
                <div className="flex flex-col gap-6">
                  {cookiesTerceros.map((ficha) => (
                    <Cookie key={ficha.nombre} ficha={ficha} />
                  ))}
                </div>
              </BloqueLegal>

              <BloqueLegal titulo="Cookies exentas de permiso">
                <p>
                  Hay cookies que la ley no obliga a consentir porque sin ellas el servicio que has
                  pedido no puede prestarse. En esta web solo hay una:{' '}
                  <span className="font-mono text-d-14">pa_consent</span>, la que guarda tu propia
                  decisión sobre las demás. Todas las otras necesitan tu permiso.
                </p>
              </BloqueLegal>
            </>
          ),
        },
        {
          titulo: 'Cuánto duran',
          contenido: (
            <>
              <p>
                Cada cookie caduca sola en el plazo que figura en su ficha: <strong>180 días</strong>{' '}
                la que guarda tu decisión, <strong>90 días</strong> las de referencia, atribución y
                clic de anuncio. Las que instalan Google y Meta duran lo que decida cada uno, y por
                eso su duración aparece entre corchetes hasta poder confirmarla.
              </p>
              <p>
                La decisión que tomas en el aviso se conserva 180 días y no se te vuelve a preguntar
                durante ese tiempo. La Agencia Española de Protección de Datos considera buena
                práctica que ese plazo no pase de 24 meses.
              </p>
            </>
          ),
        },
        {
          titulo: 'Quién más recibe estos datos, y dónde',
          contenido: (
            <>
              <p>
                Los terceros que operan cookies en este sitio son dos, y son estos:{' '}
                <strong>Google Ireland Limited</strong>, para la analítica de Google Analytics 4 y la
                medición de Google Ads, y <strong>Meta Platforms Ireland Limited</strong>, para la
                medición y la segmentación de los anuncios de Facebook e Instagram. Cada uno trata
                esos datos según su propia política, enlazada en su ficha de arriba.
              </p>
              <p>
                Ambos tratan datos también en <strong>Estados Unidos</strong>. Esa transferencia se
                ampara en la decisión de adecuación de la Comisión Europea de 10 de julio de 2023
                —el <em>EU-US Data Privacy Framework</em>—, que solo alcanza a las entidades
                certificadas; lo que no cubra necesita una garantía del artículo 46 del RGPD. El
                detalle, con los enlaces oficiales y lo que queda por comprobar de cada proveedor,
                está en la{' '}
                <Link href="/politica-de-privacidad/">
                  política de privacidad
                </Link>
                .
              </p>
            </>
          ),
        },
        {
          titulo: 'Publicidad segmentada',
          contenido: (
            <p>
              Si aceptas, los datos que recogen estas cookies los usan Google y Meta para medir sus
              anuncios y para decidir qué anuncios ver. Esta web no toma ninguna decisión automática
              sobre ti: los presupuestos los hace y los contesta una persona. Cómo se describe
              exactamente esa segmentación está detallado en la{' '}
              <Link href="/politica-de-privacidad/">
                política de privacidad
              </Link>
              .
            </p>
          ),
        },
        {
          titulo: 'Cómo cambiar de idea y cómo borrarlas',
          contenido: (
            <>
              <BloqueLegal titulo="Para volver a elegir">
                <p>
                  Esta web todavía no tiene un panel donde cambiar tu decisión después de haberla
                  tomado, y lo decimos en lugar de dar un rodeo. Mientras no lo tenga, la forma de
                  volver a elegir es borrar la cookie{' '}
                  <span className="font-mono text-d-14">pa_consent</span> de este sitio en tu
                  navegador: al hacerlo, el aviso vuelve a aparecer en la siguiente visita y puedes
                  contestar otra cosa.
                </p>
                <p>
                  Si borras todas las cookies de pavimentos-albufera.com se van también{' '}
                  <span className="font-mono text-d-14">pa_ref</span>,{' '}
                  <span className="font-mono text-d-14">pa_attr</span> y{' '}
                  <span className="font-mono text-d-14">_fbc</span>, y con ellas el código de
                  referencia y los datos de qué anuncio te trajo. Ojo con una:{' '}
                  <span className="font-mono text-d-14">pa_ref</span> se vuelve a escribir, con un
                  código nuevo, la próxima vez que entres. Si lo que quieres es que no se escriba,
                  no basta con borrarla: hay que bloquear las cookies de este sitio.
                </p>
              </BloqueLegal>

              <BloqueLegal titulo="Dónde está eso en cada navegador">
                <p>
                  Todos los navegadores permiten ver, borrar y bloquear las cookies de un sitio
                  concreto, y también bloquear las de terceros para todos los sitios. La opción suele
                  estar en los ajustes, dentro de privacidad:
                </p>
                <ul>
                  <li>
                    <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros
                    datos de sitios.
                  </li>
                  <li>
                    <strong>Safari:</strong> Ajustes → Safari → Avanzado → Datos de sitios web, en
                    iPhone y iPad; Safari → Ajustes → Privacidad, en Mac.
                  </li>
                  <li>
                    <strong>Firefox:</strong> Ajustes → Privacidad y seguridad → Cookies y datos del
                    sitio.
                  </li>
                  <li>
                    <strong>Edge:</strong> Configuración → Cookies y permisos del sitio.
                  </li>
                </ul>
                <p>
                  Si bloqueas las cookies de este sitio, la web sigue funcionando: lo único que
                  pierdes es que recordemos tu decisión, y el aviso volverá a salirte.
                </p>
              </BloqueLegal>
            </>
          ),
        },
        {
          titulo: 'Más información',
          contenido: (
            <p>
              Quién es el responsable, qué datos personales se tratan, a quién se envían, cuánto se
              conservan y cómo ejercer tus derechos está en la{' '}
              <Link href="/politica-de-privacidad/">
                política de privacidad
              </Link>
              . Esta política de cookies puede cambiar cuando cambien las cookies del sitio; la fecha
              de la última revisión encabeza la página.
            </p>
          ),
        },
      ]}
    />
  )
}
