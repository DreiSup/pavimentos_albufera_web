import type { Metadata } from 'next'
import Link from 'next/link'
import PlantillaLegal from '@/components/secciones/PlantillaLegal'
import TablaFichaTecnica from '@/components/datos/TablaFichaTecnica'
import DatoPendiente from '@/components/datos/DatoPendiente'
import { cookiesPropias, cookiesTerceros, type FichaCookie } from '@/content/legal'

export const metadata: Metadata = {
  title: 'Política de cookies',
  alternates: { canonical: '/politica-de-cookies/' },
}

/**
 * Bloque con subtítulo dentro de una sección legal: el subtítulo en mono y
 * versalitas, como toda etiqueta del sitio, pegado a lo suyo con un hueco menor
 * que el que separa los bloques entre sí. Es lo único que agrupa seis
 * definiciones seguidas en una columna de 68ch.
 */
function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-mono text-d-12 tracking-[0.05em] uppercase text-acero">{titulo}</h3>
      {children}
    </div>
  )
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
 * El texto de las definiciones es el que trajo el dueño, palabra por palabra.
 *
 * **La sección «Cookies que utiliza esta web» es el encargo que él mismo dejó
 * escrito dentro de su documento**: avisar de todas las cookies de las que haya
 * que avisar, además de las que su texto ya enumera, ahora que la web nueva
 * lleva Consent Mode v2 y el píxel de Meta. Ese encargo no se publica —es una
 * nota para quien maqueta, no texto legal—, se atiende.
 *
 * El inventario está levantado leyendo el código de este repositorio, y solo el
 * código: qué cookie escribe cada archivo, con qué caducidad y detrás de qué
 * condición. Lo que decide Google o Meta y no consta aquí —los nombres de sus
 * cookies y su duración— va entre corchetes, porque afirmarlo sería copiarlo de
 * algún sitio sin haberlo comprobado. Las fuentes archivo por archivo están en
 * `content/legal.tsx`.
 */
export default function PoliticaCookies() {
  return (
    <PlantillaLegal
      titulo="Política de cookies"
      ultimaActualizacion={<DatoPendiente>fecha</DatoPendiente>}
      entradilla={
        <>
          <p>
            Las Cookies son ficheros que se descargan en su ordenador al acceder a determinadas
            páginas web. Las cookies permiten a una página web, entre otras cosas, almacenar y
            recuperar información sobre los hábitos de navegación de un usuario o de su equipo y,
            dependiendo de la información que contengan y de la forma en que utilice su equipo,
            pueden utilizarse para reconocer al usuario.. El navegador del usuario memoriza cookies
            en el disco duro solamente durante la sesión actual ocupando un espacio de memoria mínimo
            y no perjudicando al ordenador. Las cookies no contienen ninguna clase de información
            personal específica, y la mayoría de las mismas se borran del disco duro al finalizar la
            sesión de navegador (las denominadas cookies de sesión).
          </p>
          <p>
            La mayoría de los navegadores aceptan como estándar a las cookies y, con independencia de
            las mismas, permiten o impiden en los ajustes de seguridad las cookies temporales o
            memorizadas. Sin su expreso consentimiento mediante la activación de las cookies en su
            navegador, no enlazará en las cookies los datos memorizados con sus datos personales
            proporcionados en el momento del registro o la compra.
          </p>
        </>
      }
      secciones={[
        {
          titulo: 'Tipos de Cookies que puede utilizar este sitio web',
          contenido: (
            <>
              <Bloque titulo="Cookies técnicas">
                <p>
                  Son aquéllas que permiten al usuario la navegación a través de una página web,
                  plataforma o aplicación y la utilización de las diferentes opciones o servicios que
                  en ella existan como, por ejemplo, controlar el tráfico y la comunicación de datos,
                  identificar la sesión, acceder a partes de acceso restringido, recordar los elementos
                  que integran un pedido, realizar el proceso de compra de un pedido, realizar la
                  solicitud de inscripción o participación en un evento, utilizar elementos de
                  seguridad durante la navegación, almacenar contenidos para la difusión de videos o
                  sonido o compartir contenidos a través de redes sociales.
                </p>
              </Bloque>

              <Bloque titulo="Cookies de personalización">
                <p>
                  Son aquéllas que permiten al usuario acceder al servicio con algunas características
                  de carácter general predefinidas en función de una serie de criterios en el terminal
                  del usuario como por ejemplo serian el idioma, el tipo de navegador a través del cual
                  accede al servicio, la configuración regional desde donde accede al servicio, etc
                </p>
              </Bloque>

              <Bloque titulo="Cookies de análisis">
                <p>
                  Son aquéllas que bien tratadas por nosotros o por terceros, nos permiten cuantificar
                  el número de usuarios y así realizar la medición y análisis estadístico de la
                  utilización que hacen los usuarios del servicio ofertado. Para ello se analiza su
                  navegación en nuestra página web con el fin de mejorar la oferta de productos o
                  servicios que le ofrecemos
                </p>
              </Bloque>

              <Bloque titulo="Cookies publicitarias">
                <p>
                  Son aquéllas que, bien tratadas por nosotros o por terceros, nos permiten gestionar
                  de la forma más eficaz posible la oferta de los espacios publicitarios que hay en la
                  página web, adecuando el contenido del anuncio al contenido del servicio solicitado o
                  al uso que realice de nuestra página web. Para ello podemos analizar sus hábitos de
                  navegación en Internet y podemos mostrarle publicidad relacionada con su perfil de
                  navegación.
                </p>
              </Bloque>

              <Bloque titulo="Cookies de publicidad comportamental">
                <p>
                  Son aquéllas que permiten la gestión, de la forma más eficaz posible, de los espacios
                  publicitarios que, en su caso, el editor haya incluido en una página web, aplicación
                  o plataforma desde la que presta el servicio solicitado. Estas cookies almacenan
                  información del comportamiento de los usuarios obtenida a través de la observación
                  continuada de sus hábitos de navegación, lo que permite desarrollar un perfil
                  específico para mostrar publicidad en función del mismo.
                </p>
              </Bloque>

              <Bloque titulo="Cookies de terceros">
                <p>
                  Este sito web puede utilizar servicios de terceros que, por cuenta del propio sitio,
                  recopilaran información con fines estadísticos, de uso del Site por parte del usuario
                  y para la prestación de otros servicios relacionados con la actividad del sitio web y
                  otros servicios de Internet. En particular, este sitio Web utiliza Google Analytics,
                  un servicio analítico de web prestado por Google, Inc. con domicilio en los Estados
                  Unidos con sede central en 1600 Amphitheatre Parkway, Mountain View, California
                  94043. Para la prestación de estos servicios, estos utilizan cookies que recopilan la
                  información, incluida la dirección IP del usuario, que será transmitida, tratada y
                  almacenada por Google en los términos fijados en la Web Google.com. Incluyendo la
                  posible transmisión de dicha información a terceros por razones de exigencia legal o
                  cuando dichos terceros procesen la información por cuenta de Google
                </p>
              </Bloque>
            </>
          ),
        },
        {
          titulo: 'Cookies que utiliza esta web',
          contenido: (
            <>
              <p>
                Esta es la lista de las cookies que esta web instala o lee, con lo que hace cada una
                y cuánto dura. Mientras no aceptes, no se guarda ninguna cookie de analítica ni de
                publicidad: los cuatro permisos del Consent Mode de Google arrancan denegados y la
                etiqueta de Meta no llega a cargarse.
              </p>
              <p>
                De las cookies que ponen Google y Meta, esta web decide cuándo pueden cargarse, pero
                no sus nombres ni su duración: los fija cada proveedor. Lo que no se puede afirmar
                está entre corchetes, a la espera de confirmarlo con ellos.
              </p>

              <Bloque titulo="Cookies propias">
                <div className="flex flex-col gap-6">
                  {cookiesPropias.map((ficha) => (
                    <Cookie key={ficha.nombre} ficha={ficha} />
                  ))}
                </div>
              </Bloque>

              <Bloque titulo="Cookies de terceros">
                <div className="flex flex-col gap-6">
                  {cookiesTerceros.map((ficha) => (
                    <Cookie key={ficha.nombre} ficha={ficha} />
                  ))}
                </div>
              </Bloque>
            </>
          ),
        },
        {
          titulo: 'Cómo desactivarlas',
          contenido: (
            <>
              <p>
                El Usuario acepta expresamente, por la utilización del sitio web, el tratamiento de
                la información recabada en la forma y con los fines anteriormente mencionados. Y
                asimismo reconoce conocer la posibilidad de rechazar el tratamiento de tales datos o
                información rechazando el uso de Cookies mediante la selección de la configuración
                apropiada a tal fin en su navegador. Si bien esta opción de bloqueo de Cookies en su
                navegador puede no permitirle el uso pleno de todas las funcionalidades del sitio
                web.
              </p>
              <p>
                Puede usted permitir, bloquear o eliminar las cookies instaladas en su equipo
                mediante la configuración de las opciones del navegador instalado en su dispositivo.
                Si tiene dudas sobre esta política de cookies, puede contactar con nosotros a través
                de la{' '}
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
