'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { enviarPresupuesto, type EstadoEnvio } from '@/app/presupuesto/actions'
import Campo, { claseInput } from '../ui/Campo'
import Boton from '../ui/Boton'
import DatoPendiente from '../datos/DatoPendiente'
import { nap } from '@/lib/config'
import { EVENTOS, MONEDA, registrarEvento, type Ubicacion } from '@/lib/eventos'
import { COOKIE_REFERENCIA, leerCookie } from '@/lib/cookies'

const estadoInicial: EstadoEnvio = { estado: 'inicial', errores: {} }

const ESPACIOS = [
  'Entrada de garaje',
  'Porche o terraza',
  'Contorno de piscina',
  'Interior de vivienda',
  'Patio o jardín',
  'Nave, parking o local',
  'Otro',
]

/**
 * `design/02` §B1: el aviso del adjunto perdido. Vive aquí y no en el Server
 * Action porque no describe nada que haya pasado en el servidor —el archivo
 * llegó y era válido—, sino lo que el navegador no deja hacer al repintar.
 */
const FOTO_NO_CONSERVADA = 'Vuelve a adjuntar la foto: por seguridad, el navegador no conserva el archivo.'

/**
 * Pinta el mensaje de error de envío poniendo el teléfono en el hueco que el
 * Server Action deja marcado.
 *
 * Antes era un `.replace('[teléfono]', nap.telefono ?? nap.telefonoMostrado)`, y
 * `telefonoMostrado` **nunca** es indefinido: con `NEXT_PUBLIC_TELEFONO` sin
 * rellenar, el visitante leía «Llámanos al 96X XXX XXX» en un mensaje de error
 * de verdad. Un número inventado presentado como real, que es peor que el hueco.
 *
 * Ahora el hueco se trata como en el resto del sitio —`app/page.tsx:603`,
 * `app/presupuesto/page.tsx:48`—: con el número si lo hay, y con
 * `<DatoPendiente>` si no. El microcopy no cambia ni una letra; lo que cambia es
 * que el marcador se ve como lo que es. Los mensajes sin marcador —el del límite
 * de envíos— pasan tal cual.
 */
function conTelefono(mensaje: string) {
  const [antes, despues] = mensaje.split('[teléfono]')
  if (despues === undefined) return mensaje
  return (
    <>
      {antes}
      {nap.telefono ?? <DatoPendiente>{nap.telefonoMostrado}</DatoPendiente>}
      {despues}
    </>
  )
}

export default function FormularioPresupuesto({
  variante = 'completo',
  origen = 'unmarked',
}: {
  variante?: 'completo' | 'corto'
  /**
   * Zona de la web desde la que se envía. Sin esto, `generate_lead` —que es la
   * macro-conversión del sitio— no dice qué página convierte, y el mismo
   * formulario se monta hoy en tres sitios distintos.
   */
  origen?: Ubicacion
}) {
  const [estado, accion, enviando] = useActionState(enviarPresupuesto, estadoInicial)
  const telefonoRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const [eventoId, setEventoId] = useState('')
  const [errorFoto, setErrorFoto] = useState('')
  const eventoDisparado = useRef(false)

  /**
   * Lo que se escribió en el envío que el servidor rechazó.
   *
   * React resetea el formulario al terminar una acción, y el reseteo devuelve
   * cada control a su `defaultValue`. Ese es justo el mecanismo que repuebla:
   * el reseteo se coordina con el repintado del nuevo estado, así que los
   * `defaultValue` de abajo ya son los del envío rechazado cuando ocurre. Sin
   * ellos —que es como estaba— el reseteo vaciaba los siete campos y
   * `design/02` §B1, estado 2, pide lo contrario.
   *
   * Los controles siguen siendo NO controlados: no hay `value` ni `onChange`,
   * así que teclear no repinta nada y el formulario no gana estado por campo.
   */
  const escrito = estado.valores

  // Comprobación en cliente además de la del servidor. Una foto de móvil pasa
  // de 4 MB con facilidad, y sin esto el usuario espera a que suba para que le
  // rebote — o se topa con el corte de plataforma, que no da mensaje ninguno.
  function comprobarFoto(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0]
    if (!archivo) return setErrorFoto('')
    if (archivo.size > 4 * 1024 * 1024) {
      setErrorFoto('Esta foto pasa de 4 MB. Elige otra o redúcela antes de enviarla.')
      evento.target.value = ''
      return
    }
    setErrorFoto('')
  }

  useEffect(() => {
    setEventoId(crypto.randomUUID())
  }, [])

  // `design/02` §B1, estado 2: el foco va al campo rechazado. Estaba escrito
  // solo para el teléfono porque era el único error que se pintaba; ahora que
  // el del email también se ve, el foco tiene que poder llegar a él o el
  // mensaje aparece en un sitio al que el teclado no lleva. El teléfono manda
  // cuando fallan los dos: es el dato por el que se llama.
  useEffect(() => {
    if (estado.estado !== 'error') return
    if (estado.errores.telefono) telefonoRef.current?.focus()
    else if (estado.errores.email) emailRef.current?.focus()
  }, [estado])

  useEffect(() => {
    if (estado.estado === 'enviado' && !eventoDisparado.current) {
      eventoDisparado.current = true
      registrarEvento(EVENTOS.generateLead, {
        metaEstandar: 'Lead',
        metaEventId: eventoId,
        params: {
          form_location: origen,
          space_type: estado.resumen?.espacio,
          // `|| undefined` para que el parámetro no viaje cuando no se ha
          // recogido. La variante corta no pide municipio y el resumen traía
          // un guion de relleno: GA4 y Meta estaban recibiendo `—` como
          // municipio en todos los leads de la portada y de las seis páginas de
          // servicio. Una dimensión personalizada no se rellena hacia atrás, así
          // que ese valor basura no se limpia después.
          municipality: estado.resumen?.municipio || undefined,
          // Las dos claves de unión con el lead que llega al buzón. `event_id`
          // es el mismo que el Server Action manda a Meta CAPI; `reference_code`
          // el que viaja dentro del mensaje de WhatsApp y del aviso de Telegram.
          // Sin ellas, una fila de GA4 no se puede cruzar con ningún lead real:
          // se sabe que alguien convirtió, no quién.
          event_id: eventoId,
          reference_code: leerCookie(COOKIE_REFERENCIA) ?? '',
          currency: MONEDA,
        },
      })
    }
  }, [estado, eventoId, origen])

  if (estado.estado === 'enviado') {
    return (
      <div className="sobre-oscuro bg-tinta text-fondo p-[26px] flex flex-col gap-5">
        <p className="font-mono text-d-11 tracking-[0.08em] uppercase text-sobre-tinta m-0">Recibido</p>
        <p className="font-display font-bold fs-h2 text-26 m-0">
          Te llamamos hoy mismo si nos escribes antes de las 18:00, y mañana a primera hora si no.
        </p>
        {/* `design/02` §B1, estado 4: «el resumen de lo enviado». Lo enviado,
            no la plantilla del formulario largo. La variante corta no pide ni
            superficie ni municipio, y el panel pintaba sus dos líneas con un
            guion: un estado vacío que no dice nada y que además hace dudar de
            si el dato se perdió por el camino. */}
        <div className="font-mono text-d-11 leading-[1.9] text-sobre-tinta">
          <p className="m-0">{estado.resumen?.espacio}</p>
          {estado.resumen?.superficie ? <p className="m-0">{estado.resumen.superficie} m²</p> : null}
          {estado.resumen?.municipio ? <p className="m-0">{estado.resumen.municipio}</p> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Boton variante="contorno" sobreOscuro href="/acabados/">
            Ver el muestrario
          </Boton>
          <Boton variante="contorno" sobreOscuro href="/proyectos/">
            Ver proyectos
          </Boton>
        </div>
      </div>
    )
  }

  return (
    <form action={accion} className="flex flex-col gap-4" aria-busy={enviando}>
      {estado.errores.form ? (
        <p className="font-sans text-14 font-semibold text-error" aria-live="polite">
          {conTelefono(estado.errores.form)}
        </p>
      ) : null}

      <input type="text" name="empresa_web" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="evento_id" value={eventoId} />
      <input type="hidden" name="origen" value={origen} />

      {/* La fila se reparte por el ancho REAL de la columna, no por el del
          documento. `md:grid-cols-2` miraba la ventana, y este formulario se
          monta en ocho sitios dentro de columnas de anchos distintos: a 768 px
          la columna del cierre mide 296,5 px, cada pista salía a 140,3 px y
          «NOMBRE Y APELLIDOS *» —167,2 px de ancho intrínseco— partía en dos
          líneas, bajando su input 20,9 px respecto al del teléfono. Con
          `auto-fit` la fila se parte sola por debajo de 376 px de columna y a
          1024 px sigue dando dos pistas de 204,3 px, como hasta ahora.
          → `design/02` §B1 */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        <Campo etiqueta="Nombre y apellidos" htmlFor="nombre" obligatorio>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            defaultValue={escrito?.nombre ?? ''}
            readOnly={enviando}
            className={claseInput}
          />
        </Campo>
        <Campo etiqueta="Teléfono" htmlFor="telefono" obligatorio error={estado.errores.telefono}>
          <input
            ref={telefonoRef}
            id="telefono"
            name="telefono"
            type="tel"
            required
            defaultValue={escrito?.telefono ?? ''}
            readOnly={enviando}
            aria-invalid={Boolean(estado.errores.telefono)}
            className={claseInput}
          />
        </Campo>
      </div>

      {/* Fuera del condicional, como la casilla de privacidad: el dueño pide
          nombre, teléfono y correo en todo formulario de contacto. Sigue siendo
          OPCIONAL en las dos —un campo obligatorio de más en el cierre de la
          home cuesta conversión, y `design/02` §B1 lo marca «no»—, así que en
          la corta añade una vía de respuesta sin añadir una barrera.

          `error` no es defensa preventiva: `type="email"` acepta `juan@empresa`
          y `juan@empresa.c`, que zod rechaza. Sin esta línea el servidor
          devolvía el error y el formulario se repintaba mudo. */}
      <Campo etiqueta="Email" htmlFor="email" error={estado.errores.email}>
        <input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          defaultValue={escrito?.email ?? ''}
          readOnly={enviando}
          aria-invalid={Boolean(estado.errores.email)}
          className={claseInput}
        />
      </Campo>

      <Campo etiqueta="¿Qué quieres pavimentar?" htmlFor="espacio" obligatorio>
        {/* El `key` es lo que hace que este campo se repueble, y es el único
            que lo necesita. Medido en React 19.0.0: el reseteo del formulario
            es un `form.reset()` nativo, que devuelve cada control a su valor
            POR DEFECTO DEL DOM. En un `<input>` y en un `<textarea>` React
            escribe ese valor por defecto en cada repintado, así que el reseteo
            ya encuentra el nuevo. En un `<select>` no: `defaultValue` solo
            marca `defaultSelected` en el montaje —`react-dom` lo aplica al
            crear el nodo y no vuelve a mirarlo—, y sin remontar, el reseteo
            devolvía el desplegable a «Entrada de garaje» con lo escrito en los
            otros seis campos intacto. Cambiar el `key` lo remonta, y el
            remontaje ocurre antes del reseteo dentro del mismo commit. */}
        <select
          key={escrito?.espacio ?? ''}
          id="espacio"
          name="espacio"
          required
          defaultValue={escrito?.espacio || ESPACIOS[0]}
          disabled={enviando}
          className={claseInput}
        >
          {ESPACIOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </Campo>

      {variante === 'completo' ? (
        <>
          <Campo
            etiqueta="Superficie aproximada en m²"
            htmlFor="superficie"
            obligatorio
            ayuda="Un cálculo aproximado nos vale. Largo × ancho."
          >
            <input
              id="superficie"
              name="superficie"
              type="text"
              defaultValue={escrito?.superficie ?? ''}
              readOnly={enviando}
              className={claseInput}
            />
          </Campo>

          <Campo etiqueta="Municipio" htmlFor="municipio" obligatorio>
            <input
              id="municipio"
              name="municipio"
              type="text"
              required
              defaultValue={escrito?.municipio ?? ''}
              readOnly={enviando}
              className={claseInput}
            />
          </Campo>

          <Campo etiqueta="Cuéntanos algo más" htmlFor="mensaje">
            <textarea
              id="mensaje"
              name="mensaje"
              rows={4}
              defaultValue={escrito?.mensaje ?? ''}
              readOnly={enviando}
              className={claseInput}
            />
          </Campo>

          <Campo
            etiqueta="Sube una foto del espacio"
            htmlFor="foto"
            ayuda="Con una foto podemos darte un rango antes incluso de la visita. Máximo 4 MB."
            /* El único campo que no se puede repoblar: ningún sitio puede
               colocar un archivo en el `<input type="file">` de quien lo
               visita. Así que en vez de fingir que sigue ahí —el adjunto se
               perdería en silencio y el correo diría «Foto adjunta: no»—, se
               dice. Va por el hueco de `error` y no por el de `ayuda` porque
               es lo único de esta pantalla que hay que rehacer antes de volver
               a enviar, y porque `Campo` solo anuncia el de `error`. Los dos
               mensajes de foto rechazada mandan sobre este: describen un
               archivo que además no valía. */
            error={errorFoto || estado.errores.foto || (escrito?.foto ? FOTO_NO_CONSERVADA : '')}
          >
            <input
              id="foto"
              name="foto"
              type="file"
              accept="image/*"
              onChange={comprobarFoto}
              disabled={enviando}
              className={claseInput}
            />
          </Campo>
        </>
      ) : null}

      {/* Fuera del condicional a propósito: la variante corta también recoge
          nombre y teléfono, así que necesita el mismo consentimiento. Antes
          solo la llevaba el formulario largo. */}
      {/* `min-h-tactil` sobre el `<label>`, que es el elemento que recibe el
          toque: el `<input type="checkbox">` mide 13 × 13 px —el tamaño por
          defecto del navegador— y el label envolvente se quedaba en 22,4 px de
          alto cuando el texto cabía en una línea. Los 44 px que pide CLAUDE.md
          se consiguen sin tocar la casilla, que es lo que se ve.
          `items-center` en vez de `items-start` + `mt-1`: con la altura mínima,
          alinear arriba dejaba 21 px muertos debajo de un texto de una línea, y
          el margen por elemento está prohibido. */}
      <label className="flex items-center gap-3 min-h-tactil font-sans text-14 text-tinta-media">
        <input
          type="checkbox"
          name="privacidad"
          required
          defaultChecked={escrito?.privacidad ?? false}
          disabled={enviando}
          aria-invalid={Boolean(estado.errores.privacidad)}
          aria-describedby={estado.errores.privacidad ? 'privacidad-error' : undefined}
        />
        <span>
          He leído y acepto la{' '}
          <Link href="/politica-de-privacidad/" className="text-tinta">
            política de privacidad
          </Link>
          . *
        </span>
      </label>
      {/* Esta casilla no pasa por `Campo`, así que su mensaje se asocia a mano.
          Aquí el foco no se mueve: el `aria-live` es la única vía. */}
      {estado.errores.privacidad ? (
        <p id="privacidad-error" className="font-sans text-14 font-semibold text-error m-0" aria-live="polite">
          {estado.errores.privacidad}
        </p>
      ) : null}

      <Boton type="submit" variante="primario" anchoCompleto disabled={enviando}>
        {enviando ? 'Enviando…' : variante === 'completo' ? 'Enviar y que me llamen' : 'Enviar'}
      </Boton>
    </form>
  )
}
