import type { Metadata } from 'next'
import Link from 'next/link'
import PlantillaLegal from '@/components/secciones/PlantillaLegal'
import TablaFichaTecnica from '@/components/datos/TablaFichaTecnica'
import { identificacion, ultimaRevisionLegal } from '@/content/legal'
import { nap } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Aviso legal',
  alternates: { canonical: '/aviso-legal/' },
  robots: { index: true, follow: true },
}

/**
 * Aviso legal rehecho contra `lib/legal/09-instrucciones-legales.md` §2. No es
 * una corrección del texto heredado: el heredado se retira entero, porque
 * parchearlo dejaba contradicciones.
 *
 * **Qué manda esta página y qué no.** Manda el artículo 10.1 de la Ley 34/2002
 * (LSSI-CE): identificar al prestador. Todo lo demás —propiedad intelectual,
 * condiciones de uso, enlaces, ley aplicable— es costumbre razonable, no
 * obligación, y así se le dijo al dueño para que sepa dónde gastar asesoría.
 *
 * **Tres cosas que había y ya no están, y por qué:**
 *
 * 1. **La sección «Ley de protección de datos personales».** Duplicaba la
 *    política de privacidad y la contradecía: se apoyaba en el artículo 9 de la
 *    LOPD de 1999, derogada por la LO 3/2018. El aviso legal identifica al
 *    titular; la privacidad explica el tratamiento. Queda un enlace.
 * 2. **«Las cookies desaparecen al terminar la sesión del usuario».** Es falso:
 *    duran 90 y 180 días. Lo que dicen las cookies lo dice su propia página.
 * 3. **«Puede garantizarse el correcto funcionamiento los 365 días del año, 24
 *    horas al día»** y **«la empresa garantiza que el sitio web cumple con la
 *    legislación vigente»**. Son dos promesas que nadie puede sostener y que no
 *    pide ninguna norma. Un aviso legal no es el sitio para prometer.
 *
 * También se retira «inscritos en los registros públicos correspondientes»
 * referido a los contenidos del sitio: nadie ha comprobado ninguna inscripción,
 * y afirmarla en la página que sirve para responder de lo que se afirma es
 * exactamente el error que trajo hasta aquí.
 *
 * ⚠️ La letra f) del artículo 10.1 —precio, impuestos incluidos— **no aplica
 * hoy**: el dueño retiró los precios del sitio entero el 2026-09-18. Si vuelven
 * a publicarse, esta página vuelve a tener una obligación que hoy no tiene.
 */
export default function AvisoLegal() {
  return (
    <PlantillaLegal
      titulo="Aviso legal"
      ultimaActualizacion={ultimaRevisionLegal}
      entradilla={
        <>
          <p>
            Esta página identifica a la empresa titular de pavimentos-albufera.com y explica en qué
            condiciones se puede usar el sitio. Publicarla es una obligación del artículo 10 de la
            Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico.
          </p>
          <p>
            Cómo tratamos tus datos personales no se explica aquí, sino en la{' '}
            <Link href="/politica-de-privacidad/" className="text-tinta">
              política de privacidad
            </Link>
            , y qué cookies usamos, en la{' '}
            <Link href="/politica-de-cookies/" className="text-tinta">
              política de cookies
            </Link>
            .
          </p>
        </>
      }
      secciones={[
        {
          titulo: 'Datos identificativos',
          contenido: (
            <>
              <TablaFichaTecnica filas={identificacion} />
              <p>
                Los datos entre corchetes son los que la empresa todavía no ha facilitado para su
                publicación. Están señalados a propósito: preferimos que se vea lo que falta a
                rellenarlo con un dato aproximado.
              </p>
              <p>
                Puedes ponerte en contacto con nosotros de forma directa y efectiva por correo
                electrónico, en{' '}
                <a href={`mailto:${nap.email}`} className="text-tinta">
                  {nap.email}
                </a>
                , o por teléfono en el número de arriba.
              </p>
            </>
          ),
        },
        {
          titulo: 'Objeto del sitio y aceptación',
          contenido: (
            <>
              <p>
                Este sitio web presenta los trabajos de pavimento de hormigón que ejecuta Pavimentos
                Albufera y permite pedir un presupuesto sin compromiso. No es una tienda: no se
                venden productos ni servicios en línea, no hay carrito ni pasarela de pago, y no hay
                cuentas de usuario ni zona privada.
              </p>
              <p>
                Acceder al sitio y usarlo supone aceptar estas condiciones en la versión publicada en
                ese momento. Si no estás de acuerdo con ellas, no uses el sitio.
              </p>
              <p>
                La empresa puede modificar en cualquier momento la información publicada aquí, así
                como estas condiciones. La versión que rige es la que esté publicada en cada momento,
                y la fecha de la última revisión encabeza esta página.
              </p>
            </>
          ),
        },
        {
          titulo: 'Condiciones de uso',
          contenido: (
            <>
              <p>
                Quien accede al sitio se compromete a usarlo conforme a la ley, a estas condiciones y
                a las buenas costumbres, y a no emplearlo para fines ilícitos, para dañar el sitio o
                sus sistemas, ni para perjudicar derechos de terceros.
              </p>
              <p>
                La empresa no responde de la información publicada en su sitio web cuando esa
                información haya sido manipulada o introducida por un tercero ajeno a ella.
              </p>
              <p>
                Si detectas en este sitio un contenido que consideres ilícito o lesivo para derechos
                de terceros, comunícanoslo por correo electrónico a{' '}
                <a href={`mailto:${nap.email}`} className="text-tinta">
                  {nap.email}
                </a>{' '}
                y lo revisaremos. La empresa colabora con las autoridades y con las fuerzas y cuerpos
                de seguridad en la retirada de contenidos en los términos de los artículos 11 y 16 de
                la LSSI-CE.
              </p>
            </>
          ),
        },
        {
          titulo: 'Propiedad intelectual e industrial',
          contenido: (
            <>
              <p>
                El sitio web y sus elementos —programación, diseño, estructura, textos, fotografías,
                logotipos y gráficos— pertenecen a Pavimentos Albufera S.L. o se usan con
                autorización de sus titulares, y están protegidos por la normativa de propiedad
                intelectual e industrial.
              </p>
              <p>
                La reproducción total o parcial, el uso, la explotación, la distribución y la
                comercialización de esos contenidos requieren autorización previa y por escrito de la
                empresa, sea cual sea su finalidad. Sí se permite enlazar directamente a las páginas
                de este sitio, siempre que el enlace no dé a entender una relación, un patrocinio o
                una recomendación que no existan.
              </p>
              <p>
                Los logotipos, marcas, textos o imágenes de terceros que puedan aparecer en el sitio
                pertenecen a sus respectivos titulares, y su mera aparición aquí no implica ningún
                derecho sobre ellos ni ninguna relación con ellos.
              </p>
              <p>
                Para cualquier observación sobre propiedad intelectual o industrial, escríbenos a{' '}
                <a href={`mailto:${nap.email}`} className="text-tinta">
                  {nap.email}
                </a>
                .
              </p>
            </>
          ),
        },
        {
          titulo: 'Enlaces a otros sitios',
          contenido: (
            <>
              <p>
                Este sitio puede enlazar a páginas de terceros —por ejemplo, a la política de
                privacidad de un proveedor o a un perfil en una red social—. La empresa no controla
                esos sitios ni responde de sus contenidos, de sus condiciones ni de lo que hagan con
                tus datos: al seguir el enlace sales de pavimentos-albufera.com y pasas a regirte por
                las condiciones de quien esté al otro lado.
              </p>
              <p>
                Lo mismo vale para los enlaces de contacto: al pulsar el número de teléfono llamas
                con tu propio operador, y al pulsar el enlace de WhatsApp la conversación ocurre
                dentro de WhatsApp y se rige por las condiciones y la política de privacidad de Meta.
              </p>
            </>
          ),
        },
        {
          titulo: 'Disponibilidad del sitio',
          contenido: (
            <p>
              La empresa procura que el sitio esté disponible y funcione correctamente, pero no puede
              garantizar que no vaya a haber interrupciones, errores de programación o averías
              ajenas, ni responde de los daños que puedan derivarse de que el sitio no esté
              accesible en un momento dado.
            </p>
          ),
        },
        {
          titulo: 'Protección de datos y cookies',
          contenido: (
            <p>
              Cómo se recogen, para qué se usan, a quién se envían y cuánto se conservan tus datos
              personales se explica en la{' '}
              <Link href="/politica-de-privacidad/" className="text-tinta">
                política de privacidad
              </Link>
              . Qué cookies utiliza este sitio, cuánto duran y cómo aceptarlas, rechazarlas o
              borrarlas se explica en la{' '}
              <Link href="/politica-de-cookies/" className="text-tinta">
                política de cookies
              </Link>
              . Este aviso legal no repite ninguna de las dos cosas a propósito: dos textos que
              explican lo mismo acaban diciéndolo distinto.
            </p>
          ),
        },
        {
          titulo: 'Legislación aplicable',
          contenido: (
            <p>
              Este aviso legal se rige por la legislación española. Para resolver cualquier
              controversia serán competentes los juzgados y tribunales que determine la normativa
              aplicable; cuando el usuario tenga la condición de consumidor, los de su propio
              domicilio.
            </p>
          ),
        },
      ]}
    />
  )
}
