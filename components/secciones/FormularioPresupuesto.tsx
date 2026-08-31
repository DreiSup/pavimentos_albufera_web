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

  useEffect(() => {
    if (estado.estado === 'error' && estado.errores.telefono) {
      telefonoRef.current?.focus()
    }
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
          municipality: estado.resumen?.municipio,
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
        <div className="font-mono text-d-11 leading-[1.9] text-sobre-tinta">
          <p className="m-0">{estado.resumen?.espacio}</p>
          <p className="m-0">{estado.resumen?.superficie} m²</p>
          <p className="m-0">{estado.resumen?.municipio}</p>
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

      {variante === 'completo' ? (
        <Campo etiqueta="Email" htmlFor="email">
          <input id="email" name="email" type="email" readOnly={enviando} className={claseInput} />
        </Campo>
      ) : null}

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
      <label className="flex items-start gap-3 font-sans text-14 text-tinta-media">
        <input type="checkbox" name="privacidad" required disabled={enviando} className="mt-1" />
        <span>
          He leído y acepto la{' '}
          <Link href="/politica-de-privacidad/" className="text-tinta">
            política de privacidad
          </Link>
          . *
        </span>
      </label>
      {estado.errores.privacidad ? (
        <p className="font-sans text-14 font-semibold text-error m-0" aria-live="polite">
          {estado.errores.privacidad}
        </p>
      ) : null}

      <Boton type="submit" variante="primario" anchoCompleto disabled={enviando}>
        {enviando ? 'Enviando…' : variante === 'completo' ? 'Enviar y que me llamen' : 'Enviar'}
      </Boton>
    </form>
  )
}
