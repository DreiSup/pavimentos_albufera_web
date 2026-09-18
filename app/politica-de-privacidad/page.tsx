import type { Metadata } from 'next'
import Link from 'next/link'
import PlantillaLegal from '@/components/secciones/PlantillaLegal'
import TablaFichaTecnica from '@/components/datos/TablaFichaTecnica'
import DatoPendiente from '@/components/datos/DatoPendiente'
import { identificacion, ultimaRevisionLegal } from '@/content/legal'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  alternates: { canonical: '/politica-de-privacidad/' },
}

/**
 * Texto del dueño, sin reescribir. Tres decisiones de maquetación, y ninguna
 * toca una palabra:
 *
 * 1. El encabezado «Politica de privacidad» del documento original repetía el
 *    título de la página, así que no se publica: su párrafo pasa a la
 *    entradilla, debajo del H1.
 * 2. **`(INDICAR)` era un marcador de plantilla**, no texto para publicar. Donde
 *    el documento dice «y otras finalidades (INDICAR)» va un `<DatoPendiente>`:
 *    es un dato que el dueño tiene que completar, y así se ve que falta.
 * 3. «Responsable del tratamiento» no está en su documento —su propio aviso
 *    legal dice que esta política debe informar de «Datos del Responsable del
 *    tratamiento»— y se añade con la misma ficha del aviso legal, con la razón
 *    social y el CIF entre corchetes hasta que lleguen.
 */
export default function PoliticaPrivacidad() {
  return (
    <PlantillaLegal
      titulo="Política de privacidad"
      ultimaActualizacion={ultimaRevisionLegal}
      entradilla={
        <>
          <p>
            La empresa informa a los usuarios del sitio web sobre su política respecto del
            tratamiento y protección de los datos de carácter personal de los usuarios y clientes que
            puedan ser recabados por la navegación o contratación de servicios a través de su sitio
            web. En este sentido, la empresa garantiza el cumplimiento de la normativa vigente en
            materia de protección de datos personales, reflejada en la Ley Orgánica 15/1999 de 13 de
            diciembre, de Protección de Datos de Carácter Personal y en el Real Decreto 1720/2007, de
            21 de Diciembre, por el que se aprueba el Reglamento de Desarrollo de la LOPD. El uso de
            esta web implica la aceptación de esta política de privacidad.
          </p>
        </>
      }
      secciones={[
        {
          titulo: 'Responsable del tratamiento',
          contenido: <TablaFichaTecnica filas={identificacion} />,
        },
        {
          titulo: 'Recogida, finalidad y tratamiento de datos',
          contenido: (
            <>
              <p>
                Este sito web tiene el deber de informar a los usuarios de su sitio web acerca de la
                recogida de datos de carácter personal que pueden llevarse a cabo, bien sea mediante
                el envío de correo electrónico o al cumplimentar los formularios incluidos en el
                sitio web. En este sentido, la empresa será considerada como responsable de los datos
                recabados mediante los medios anteriormente descritos.
              </p>
              <p>
                A su vez, este sitio web informa a los usuarios de que la finalidad del tratamiento
                de los datos recabados contempla: La atención de solicitudes realizadas por los
                usuarios, la inclusión en la agenda de contactos, la prestación de servicios, la
                gestión de la relación comercial y otras finalidades{' '}
                <DatoPendiente>otras finalidades</DatoPendiente>.
              </p>
              <p>
                Las operaciones, gestiones y procedimientos técnicos que se realicen de forma
                automatizada o no automatizada y que posibiliten la recogida, el almacenamiento, la
                modificación, la transferencia y otras acciones sobre datos de carácter personal,
                tienen la consideración de tratamiento de datos personales.
              </p>
              <p>
                Todos los datos personales, que sean recogidos a través del sitio web, y por tanto
                tenga la consideración de tratamiento de datos de carácter personal, serán
                incorporados en los ficheros declarados ante la Agencia Española de Protección de
                Datos.
              </p>
            </>
          ),
        },
        {
          titulo: 'Comunicación de información a terceros',
          contenido: (
            <>
              <p>
                La empresa informa a los usuarios de que sus datos personales no serán cedidos a
                terceras organizaciones, con la salvedad de que dicha cesión de datos este amparada
                en una obligación legal o cuando la prestación de un servicio implique la necesidad
                de una relación contractual con un encargado de tratamiento. En este último caso,
                solo se llevará a cabo la cesión de datos al tercero cuando el sitio web disponga del
                consentimiento expreso del usuario.
              </p>
            </>
          ),
        },
        {
          titulo: 'Derechos de los usuarios',
          contenido: (
            <>
              <p>
                La Ley Orgánica 15/1999, de 13 de diciembre, de Protección de Datos de Carácter
                Personal concede a los interesados la posibilidad de ejercer una serie de derechos
                relacionados con el tratamiento de sus datos personales. En tanto en cuanto los datos
                del usuario son objeto de tratamiento por parte de la empresa. Los usuarios podrán
                ejercer los derechos de acceso, rectificación, cancelación y oposición de acuerdo con
                lo previsto en la normativa legal vigente en materia de protección de datos
                personales.
              </p>
              <p>
                Para hacer uso del ejercicio de estos derechos, el usuario deberá dirigirse mediante
                correo electrónico, aportando documentación que acredite su identidad, a través de la{' '}
                <Link href="/presupuesto/" className="text-tinta">
                  página de contacto
                </Link>{' '}
                o a través de los datos habilitados para tal efecto en el propio sitio web.
              </p>
              <p>
                Dicha comunicación deberá reflejar la siguiente información: Nombre y apellidos del
                usuario, la petición de solicitud, el domicilio y los datos acreditativos. El
                ejercicio de derechos deberá ser realizado por el propio usuario. No obstante, podrán
                ser ejecutados por una persona autorizada como representante legal del autorizado. En
                tal caso, se deberá aportar la documentación que acredite esta representación del
                interesado.
              </p>
            </>
          ),
        },
      ]}
    />
  )
}
