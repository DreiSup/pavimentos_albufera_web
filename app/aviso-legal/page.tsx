import type { Metadata } from 'next'
import Link from 'next/link'
import PlantillaLegal from '@/components/secciones/PlantillaLegal'
import TablaFichaTecnica from '@/components/datos/TablaFichaTecnica'
import DatoPendiente from '@/components/datos/DatoPendiente'
import { identificacion } from '@/content/legal'

export const metadata: Metadata = {
  title: 'Aviso legal',
  alternates: { canonical: '/aviso-legal/' },
  robots: { index: true, follow: true },
}

/**
 * El texto es el que trajo el dueño, palabra por palabra. Aquí no se redacta
 * nada: lo único que se hace es maquetarlo con los componentes del sistema.
 *
 * Dos cosas que sí son decisión de esta página, y por qué:
 *
 * 1. **«Datos identificativos» no está en el documento del dueño.** Su texto
 *    dice «la empresa» de principio a fin y nunca la nombra, y el art. 10 de la
 *    LSSI-CE que él mismo cita obliga a publicar esos datos. La sección se añade
 *    con los huecos entre corchetes; el teléfono y el domicilio salen de
 *    `lib/config.ts`, que es el único sitio del proyecto donde viven.
 * 2. **Los párrafos largos se parten en varios.** No se cambia ni una palabra ni
 *    el orden: se corta por final de frase. A 390 px un bloque de nueve frases
 *    seguidas no se lee, y el ritmo vertical es justo lo que más importa en un
 *    documento largo.
 */
export default function AvisoLegal() {
  return (
    <PlantillaLegal
      titulo="Aviso legal"
      ultimaActualizacion={<DatoPendiente>fecha</DatoPendiente>}
      secciones={[
        {
          titulo: 'Datos identificativos',
          contenido: <TablaFichaTecnica filas={identificacion} />,
        },
        {
          titulo: 'Aviso legal y privacidad',
          contenido: (
            <>
              <p>
                Este sitio web pone a disposición de los usuarios el presente documento con el que
                pretende dar cumplimiento a las obligaciones dispuestas en la Ley 34/2002, de
                Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), así
                como informar a todos los usuarios respecto a cuáles son las condiciones de uso.
              </p>
              <p>
                Toda persona que acceda a este sitio asume el papel de usuario, comprometiéndose a la
                observancia y cumplimiento riguroso de las disposiciones aquí dispuestas, así como a
                cualesquiera otra disposición legal que fuera de aplicación. La empresa se reserva el
                derecho a modificar cualquier tipo de información que pudiera aparecer en el sitio
                web, sin que exista obligación de preavisar o poner en conocimiento de los usuarios
                dichas obligaciones, entendiéndose como suficiente con la publicación pertinente. La
                empresa garantiza a los usuarios que el sitio web cumple con la legislación vigente y
                se encuentra sometido a todas las obligaciones dispuestas en dicho código.
              </p>
              <p>
                La empresa se exime de cualquier tipo de responsabilidad derivada de la información
                publicada en su sitio web, siempre que esta información haya sido manipulada o
                introducida por un tercero ajeno al mismo.
              </p>
              <p>
                El sitio web puede utilizar cookies (pequeños archivos de información que el servidor
                envía al ordenador de quien accede a la página) para llevar a cabo determinadas
                funciones que son consideradas imprescindibles para el correcto funcionamiento y
                visualización del sitio. Las cookies utilizadas en el sitio web tienen, en todo caso,
                carácter temporal con la única finalidad de hacer más eficaz su transmisión ulterior
                y desaparecen al terminar la sesión del usuario.
              </p>
              <p>
                Es posible que se redirija a contenidos de terceros sitios web. Dado que el prestador
                no puede controlar siempre los contenidos introducidos por los terceros en sus sitios
                web, éste no asume ningún tipo de responsabilidad respecto a dichos contenidos. En
                todo caso, la empresa manifiesta que procederá a la retirada inmediata de cualquier
                contenido que pudiera contravenir la legislación nacional o internacional, la moral o
                el orden público, procediendo a la retirada inmediata de la redirección a dicho sitio
                web, poniendo en conocimiento de las autoridades competentes el contenido en
                cuestión.
              </p>
              <p>
                La empresa no se hace responsable de la información y contenidos almacenados, a
                título enunciativo pero no limitativo, en foros, chat´s, generadores de blogs,
                comentarios, redes sociales o cualesquiera otro medio que permita a terceros publicar
                contenidos de forma independiente en la página web del prestador. No obstante y en
                cumplimiento de lo dispuesto en el art. 11 y 16 de la LSSI-CE, el sitio web se pone a
                disposición de todos los usuarios, autoridades y fuerzas de seguridad, y colaborando
                de forma activa en la retirada o en su caso bloqueo de todos aquellos contenidos que
                pudieran afectar o contravenir la legislación nacional, o internacional, derechos de
                terceros o la moral y el orden público. En caso de que el usuario considere que
                existe en el sitio web algún contenido que pudiera ser susceptible de esta
                clasificación, se ruega lo notifique de forma inmediata al administrador del sitio
                web.
              </p>
              <p>
                Este sitio web ha sido revisado y probado para que funcione correctamente. En
                principio, puede garantizarse el correcto funcionamiento los 365 días del año, 24
                horas al día. No obstante, el prestador no descarta la posibilidad de que existan
                ciertos errores de programación, o que acontezcan causas de fuerza mayor, catástrofes
                naturales, huelgas, o circunstancias semejantes que hagan imposible el acceso a la
                página web.
              </p>
            </>
          ),
        },
        {
          titulo: 'Ley de protección de datos personales',
          contenido: (
            <>
              <p>
                Esta empresa se encuentra profundamente comprometido con el cumplimiento de la
                normativa española de protección de datos de carácter personal, y garantiza el
                cumplimiento íntegro de las obligaciones dispuestas, así como la implementación de
                las medidas de seguridad dispuestas en el art. 9 de la Ley 15/1999, de Protección de
                Datos de Carácter Personal (LOPD) y en el Reglamento de Desarrollo de la LOPD.
              </p>
              <p>
                Este sitio web pone a disposición de los usuarios la{' '}
                <Link href="/politica-de-privacidad/" className="text-tinta">
                  Política de Privacidad
                </Link>{' '}
                de la entidad informando a los usuarios respecto a los siguientes aspectos:
              </p>
              <ul>
                <li>Datos del Responsable del tratamiento.</li>
                <li>Datos tratados.</li>
                <li>Fichero en el que se almacenan.</li>
                <li>Finalidad del tratamiento.</li>
                <li>
                  Obligatoriedad o no de facilitarlos, así como las consecuencias en caso de no
                  facilitarlos.
                </li>
                <li>
                  Sobre los derechos que asisten a todo usuario y el procedimiento para ejercitarlos.
                </li>
              </ul>
            </>
          ),
        },
        {
          titulo: 'Ley de propiedad intelectual',
          contenido: (
            <>
              <p>
                Este sitio web, incluyendo a título enunciativo pero no limitativo su programación,
                edición, compilación y demás elementos necesarios para su funcionamiento, los
                diseños, logotipos, texto y/o gráficos son propiedad del mismo o en su caso dispone
                de licencia o autorización expresa por parte de los autores. Todos los contenidos del
                sitio web se encuentran debidamente protegidos por la normativa de propiedad
                intelectual e industrial, así como inscritos en los registros públicos
                correspondientes.
              </p>
              <p>
                Independientemente de la finalidad para la que fueran destinados, la reproducción
                total o parcial, uso, explotación, distribución y comercialización, requiere en todo
                caso de la autorización escrita previa por parte de la empresa. Cualquier uso no
                autorizado previamente será considerado un incumplimiento grave de los derechos de
                propiedad intelectual o industrial del autor.
              </p>
              <p>
                Los diseños, logotipos, texto y/o gráficos ajenos al prestador y que pudieran
                aparecer en el sitio web, pertenecen a sus respectivos propietarios, siendo ellos
                mismos responsables de cualquier posible controversia que pudiera suscitarse respecto
                a los mismos. En todo caso, esta empresa cuenta con la autorización expresa y previa
                por parte de los mismos y autoriza expresamente a que terceros puedan redirigir
                directamente a los contenidos concretos del sitio web, debiendo en todo caso
                redirigir al sitio web principal.
              </p>
              <p>
                Se reconoce a favor de sus titulares los correspondientes derechos de propiedad
                industrial e intelectual, no implicando su sola mención o aparición en el sitio web
                la existencia de derechos o responsabilidad alguna del prestador sobre los mismos,
                como tampoco respaldo, patrocinio o recomendación por parte del mismo. Para realizar
                cualquier tipo de observación respecto a posibles incumplimientos de los derechos de
                propiedad intelectual o industrial, así como sobre cualquiera de los contenidos del
                sitio web, puede hacerlo a través de la{' '}
                <Link href="/presupuesto/" className="text-tinta">
                  página de contacto
                </Link>{' '}
                o a través de los datos habilitados para tal efecto en el propio sitio web.
              </p>
            </>
          ),
        },
      ]}
    />
  )
}
