'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { enviarPresupuesto, type EstadoEnvio } from '@/app/presupuesto/actions'
import Campo, { claseInput } from '../ui/Campo'
import Boton from '../ui/Boton'
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
          {estado.errores.form.replace('[teléfono]', nap.telefono ?? nap.telefonoMostrado)}
        </p>
      ) : null}

      <input type="text" name="empresa_web" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="evento_id" value={eventoId} />
      <input type="hidden" name="origen" value={origen} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Campo etiqueta="Nombre y apellidos" htmlFor="nombre" obligatorio>
          <input id="nombre" name="nombre" type="text" required readOnly={enviando} className={claseInput} />
        </Campo>
        <Campo etiqueta="Teléfono" htmlFor="telefono" obligatorio error={estado.errores.telefono}>
          <input
            ref={telefonoRef}
            id="telefono"
            name="telefono"
            type="tel"
            required
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
          readOnly={enviando}
          aria-invalid={Boolean(estado.errores.email)}
          className={claseInput}
        />
      </Campo>

      <Campo etiqueta="¿Qué quieres pavimentar?" htmlFor="espacio" obligatorio>
        <select id="espacio" name="espacio" required disabled={enviando} className={claseInput}>
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
            <input id="superficie" name="superficie" type="text" readOnly={enviando} className={claseInput} />
          </Campo>

          <Campo etiqueta="Municipio" htmlFor="municipio" obligatorio>
            <input id="municipio" name="municipio" type="text" required readOnly={enviando} className={claseInput} />
          </Campo>

          <Campo etiqueta="Cuéntanos algo más" htmlFor="mensaje">
            <textarea id="mensaje" name="mensaje" rows={4} readOnly={enviando} className={claseInput} />
          </Campo>

          <Campo
            etiqueta="Sube una foto del espacio"
            htmlFor="foto"
            ayuda="Con una foto podemos darte un rango antes incluso de la visita. Máximo 4 MB."
            error={errorFoto || estado.errores.foto}
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
