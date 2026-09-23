'use server'

import { z } from 'zod'
import { cookies, headers } from 'next/headers'
import { after } from 'next/server'
import { enviarEventoCAPI } from '@/lib/meta-capi'
import { sitio } from '@/lib/config'
import { COOKIE_ATRIBUCION, COOKIE_CONSENTIMIENTO, COOKIE_REFERENCIA } from '@/lib/cookies'

/**
 * Lo que el visitante escribió, tal y como lo escribió.
 *
 * `design/02` §B1, estado 2: «el resto de campos conserva lo escrito». React
 * resetea el formulario después de ejecutar una acción, así que un rechazo del
 * servidor devolvía los siete campos en blanco: en móvil, quien acaba de
 * teclear nombre, teléfono, superficie y municipio no lo vuelve a escribir. La
 * única forma de repoblarlos es que el estado los traiga de vuelta y que cada
 * control los declare como `defaultValue`.
 *
 * Son los valores **crudos** del `FormData`, no los de `analizado.data`: el
 * `.transform()` del teléfono quita espacios y el `34` de cabecera, así que
 * devolver el valor analizado le cambiaría `+34 961 000 000` por `961000000` a
 * quien lo escribió bien. Y en el rechazo del esquema —el camino más frecuente—
 * `analizado.data` ni siquiera existe.
 */
export type ValoresFormulario = {
  nombre: string
  telefono: string
  email: string
  espacio: string
  superficie: string
  municipio: string
  mensaje: string
  privacidad: boolean
  /**
   * Había foto adjunta y se ha perdido. Un `<input type="file">` no se puede
   * repoblar por programa —ninguna página puede colocar un archivo en el disco
   * de quien la visita—, así que esto no repuebla nada: avisa. Fingir que sigue
   * ahí es perder el adjunto en silencio, que es lo que este formulario ya hacía
   * antes de que el archivo llegara a viajar.
   */
  foto: boolean
}

export type EstadoEnvio = {
  estado: 'inicial' | 'error' | 'enviando' | 'enviado'
  errores: Record<string, string>
  resumen?: { espacio: string; superficie: string; municipio: string }
  /** Solo en `'error'`. En `'enviado'` el formulario desaparece y no hay nada que repoblar. */
  valores?: ValoresFormulario
}

/** El `FormData` devuelve `File` además de `string`; aquí solo interesa el texto. */
function texto(valor: FormDataEntryValue | null): string {
  return typeof valor === 'string' ? valor : ''
}

// 4 MB, no los 10 que pedía `design/04` §6. El tope real no lo pone el
// formulario: Vercel corta el cuerpo de una función en 4,5 MB, y los Server
// Actions se ejecutan como función. Prometer 10 MB significaría un envío que
// funciona en local y muere con un 413 opaco en producción.
const MAX_FOTO = 4 * 1024 * 1024

// Ningún proveedor externo puede tener al usuario esperando más que esto.
const TIMEOUT_MS = 8000

const esquema = z.object({
  nombre: z.string().min(1, 'Escribe tu nombre.'),
  telefono: z
    .string()
    .transform((v) => v.replace(/[\s+]/g, '').replace(/^34/, ''))
    .refine((v) => /^\d{9}$/.test(v), 'Escribe un número de 9 cifras para que podamos llamarte.'),
  // Opcional en las DOS variantes. Obligatorio es una decisión del dueño que
  // sigue abierta —`design/06`, decisión 7—, y `design/02` §B1 lo marca «no».
  //
  // Se valida con `.refine()` sobre el valor ya recortado y no con
  // `z.union([z.literal(''), z.string().email(MSG)])`: la unión emite
  // `invalid_union` y el mensaje de abajo se perdería por el camino.
  //
  // El `.trim()` no es cosmético: zod rechaza ` juan@empresa.com ` con espacio
  // alrededor, que es exactamente lo que deja un pegado desde el móvil.
  email: z
    .string()
    .trim()
    .optional()
    .default('')
    .refine(
      (v) => v === '' || z.string().email().safeParse(v).success,
      'Escribe un correo electrónico válido para que podamos escribirte, o deja el campo vacío.',
    ),
  espacio: z.string().min(1, 'Selecciona qué quieres pavimentar.'),
  superficie: z.string().optional().default(''),
  municipio: z.string().optional().default(''),
  mensaje: z.string().optional().default(''),
  // El `required` del navegador no es validación: un envío sin JS o manipulado
  // se la salta. Aquí es obligatorio de verdad.
  //
  // El mensaje decía «Tienes que aceptar…», a juego con la etiqueta vieja de la
  // casilla. La casilla ya no dice «acepto» —no es la base jurídica, ver
  // `FormularioPresupuesto.tsx`—, y este texto va con ella: si no, la
  // contradicción sobrevivía a un error de validación de distancia. La regla no
  // se toca, solo la cadena.
  privacidad: z.string().min(1, 'Tienes que confirmar que has leído la política de privacidad.'),
  evento_id: z.string().optional().default(''),
  origen: z.string().optional().default('unmarked'),
})

// Límite de envíos por IP: 3 / hora. En memoria — se reinicia con cada despliegue.
//
// Se queda aquí, sin exportar, a propósito: en un módulo `'use server'` todo
// export tiene que ser una función asíncrona, y esta devuelve un boolean
// síncrono. Sacarla a `lib/limite.ts` es tarea de 1.5, no de aquí.
const envios = new Map<string, number[]>()
const LIMITE = 3
const VENTANA_MS = 60 * 60 * 1000

function limitePorIp(ip: string) {
  const ahora = Date.now()
  const previos = (envios.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS)
  if (previos.length >= LIMITE) return false
  previos.push(ahora)
  envios.set(ip, previos)
  return true
}

/** Convierte la cookie de atribución en líneas legibles para el email y el aviso. */
function lineasAtribucion(bruto: string | undefined): string[] {
  if (!bruto) return ['Origen: directo o sin marcar']
  try {
    const datos = JSON.parse(bruto) as Record<string, string>
    return Object.entries(datos).map(([clave, valor]) => `${clave}: ${valor}`)
  } catch {
    return ['Origen: cookie ilegible']
  }
}

/**
 * Página real desde la que se envió el formulario.
 *
 * El formulario se monta en ocho sitios —la home, `/presupuesto/` y las seis
 * páginas de servicio, todas vía `PaginaServicio.tsx`— y hasta ahora los ocho
 * declaraban `/presupuesto/` a Meta: siete de cada ocho mentían.
 *
 * Va por la cabecera `Referer` y **no** por un `<input type="hidden">`: zod
 * descarta en silencio toda clave que no esté en el esquema, así que el campo
 * llegaría al servidor y se perdería sin dar ningún error.
 *
 * Del `Referer` se conserva **solo la ruta**, montada sobre el dominio propio:
 * el origen no lo pone nunca el cliente, y la query —que puede traer `gclid` o
 * cualquier otra cosa— no tiene por qué viajar a Meta.
 */
function urlDeOrigen(referer: string | null): string {
  const base = sitio.url.replace(/\/$/, '')
  if (!referer) return `${base}/presupuesto/`
  try {
    return `${base}${new URL(referer).pathname}`
  } catch {
    return `${base}/presupuesto/`
  }
}

export async function enviarPresupuesto(
  _prev: EstadoEnvio,
  formData: FormData,
): Promise<EstadoEnvio> {
  // Honeypot: campo oculto con nombre plausible. Si viene relleno, se devuelve
  // el estado inicial y no se entrega nada.
  //
  // ⚠️ Antes devolvía `'enviado'`, y `FormularioPresupuesto.tsx:66` dispara
  // `form_submit` + `Lead` justo desde ese estado: la defensa antispam
  // fabricaba exactamente las conversiones falsas que existía para evitar. Es
  // el único caso en el que no se entrega nada a nadie, así que el estado que
  // se devuelva no puede ser uno que el cliente cuente como conversión.
  const honeypot = formData.get('empresa_web')
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    // Queda registrado. Devolver `'inicial'` deja al que envía sin ninguna
    // señal —el formulario reaparece igual, sin mensaje—, y eso está bien para
    // un bot; para una persona a la que un gestor de contraseñas le haya
    // rellenado el campo oculto es un bucle mudo en la página de más intención
    // del sitio. Sin esta línea no habría forma de enterarse: no sale email, ni
    // aviso, ni evento.
    console.warn(`Honeypot relleno desde ${String(formData.get('origen') ?? 'unmarked')}`)
    return { estado: 'inicial', errores: {} }
  }

  const foto = formData.get('foto')
  formData.delete('foto')

  // Se captura antes de analizar y se devuelve en TODOS los caminos de error,
  // incluido el del esquema, que es el único donde no hay datos analizados.
  const valores: ValoresFormulario = {
    nombre: texto(formData.get('nombre')),
    telefono: texto(formData.get('telefono')),
    email: texto(formData.get('email')),
    espacio: texto(formData.get('espacio')),
    superficie: texto(formData.get('superficie')),
    municipio: texto(formData.get('municipio')),
    mensaje: texto(formData.get('mensaje')),
    privacidad: texto(formData.get('privacidad')).length > 0,
    foto: foto instanceof File && foto.size > 0,
  }

  const datos = Object.fromEntries(formData.entries())
  const analizado = esquema.safeParse(datos)

  if (!analizado.success) {
    const errores: Record<string, string> = {}
    for (const issue of analizado.error.issues) {
      errores[String(issue.path[0])] = issue.message
    }
    return { estado: 'error', errores, valores }
  }

  // El límite va ANTES de convertir la foto a base64, no después: si no, se
  // paga la conversión de 4 MB de un envío que se va a rechazar igualmente.
  // Después del esquema, eso sí: tres erratas en el teléfono no pueden dejar a
  // alguien una hora sin poder pedir presupuesto.
  const listaCabeceras = await headers()
  const ip = listaCabeceras.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonimo'
  if (!limitePorIp(ip)) {
    return {
      estado: 'error',
      errores: { form: 'Demasiados envíos seguidos. Llámanos o escríbenos por WhatsApp.' },
      valores,
    }
  }

  // Adjunto opcional. Antes se renderizaba el campo y se descartaba el archivo
  // en silencio, prometiendo algo que no se cumplía (04-desarrollo-y-deploy.md §6.4).
  let adjunto: { filename: string; content: string } | undefined
  if (foto instanceof File && foto.size > 0) {
    if (!foto.type.startsWith('image/')) {
      return { estado: 'error', errores: { foto: 'La foto tiene que ser una imagen.' }, valores }
    }
    if (foto.size > MAX_FOTO) {
      return { estado: 'error', errores: { foto: 'La foto no puede pasar de 4 MB.' }, valores }
    }
    adjunto = {
      filename: foto.name || 'foto.jpg',
      content: Buffer.from(await foto.arrayBuffer()).toString('base64'),
    }
  }

  const {
    nombre,
    telefono,
    email,
    espacio,
    superficie,
    municipio,
    mensaje,
    origen,
    evento_id: eventoIdEnviado,
  } = analizado.data

  // Si el formulario se envió antes de hidratar, el campo llega vacío. Sin un
  // id, el Pixel y la CAPI no se pueden deduplicar.
  const eventoId = eventoIdEnviado || crypto.randomUUID()

  const listaCookies = await cookies()
  // La misma referencia que se inyecta en los mensajes de WhatsApp. Que el lead
  // de formulario y el de WhatsApp compartan código es lo que permite ver en el
  // CRM que son la misma persona.
  const referencia = listaCookies.get(COOKIE_REFERENCIA)?.value
  const consentimiento = listaCookies.get(COOKIE_CONSENTIMIENTO)?.value
  const atribucion = [
    `Referencia: ${referencia ?? '—'}`,
    // Queda escrito en el buzón y en el aviso qué había contestado esta persona
    // en el momento de enviar: es el único registro de por qué su lead llegó, o
    // no llegó, a la CAPI.
    `Consentimiento: ${consentimiento ?? 'sin responder'}`,
    ...lineasAtribucion(listaCookies.get(COOKIE_ATRIBUCION)?.value),
  ]

  // Valores planos capturados antes de registrar el trabajo diferido: dentro de
  // `after()` la petición ya se ha respondido, y así no depende de nada de ella.
  const userAgent = listaCabeceras.get('user-agent') ?? ''
  const urlOrigen = urlDeOrigen(listaCabeceras.get('referer'))
  const fbp = listaCookies.get('_fbp')?.value
  const fbc = listaCookies.get('_fbc')?.value

  // Telegram y la CAPI se registran ANTES de intentar el email y salen después
  // de responder. Dos motivos, y los dos eran defectos reales:
  //
  // - El `catch` de Resend hacía `return`. Un fallo de email cancelaba también
  //   el aviso y el evento, que son los dos caminos por los que el lead podía
  //   salvarse. Registrados aquí arriba, ninguna salida posterior debería
  //   cancelarlos: `after()` cuelga del fin de la petición, no del valor que se
  //   devuelva. ⚠️ Comprobado por lectura de la semántica, no en ejecución: que
  //   se vacíen también en el `return` de error necesita un build.
  // - Esperarlos en línea son hasta 16 s de cola de timeouts que el usuario
  //   mira en el spinner, por dos entregas cuyo resultado no cambia nada de lo
  //   que va a ver.
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChat = process.env.TELEGRAM_CHAT_ID
  if (telegramToken && telegramChat) {
    after(async () => {
      try {
        const respuesta = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChat,
            text: [
              '🔔 Nuevo presupuesto',
              `${nombre} · ${telefono}`,
              // El aviso es lo primero que se lee, y muchas veces lo único: el
              // email llegaba al buzón de Resend y a la CAPI, pero no aquí, así
              // que quien atendía desde el móvil no tenía la segunda vía de
              // contacto delante. Con `—` cuando no lo han dejado, para que la
              // ausencia se vea y no se confunda con una línea que falta.
              email || '—',
              espacio,
              municipio || '—',
              '',
              `Desde: ${origen}`,
              ...atribucion,
            ].join('\n'),
          }),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        })

        // El único riesgo que traía diferir esto es que el fallo deje de verse:
        // ya no queda rastro en la respuesta, así que el registro es lo único
        // que hay. Un chat_id equivocado o un bot expulsado devuelven 400 y
        // `fetch` no lanza.
        if (!respuesta.ok) {
          const cuerpo = await respuesta.text()
          console.error(`Telegram ${respuesta.status}: ${cuerpo.slice(0, 500)}`)
        }
      } catch (error) {
        // No bloquea el envío del presupuesto por un fallo de Telegram.
        console.error('Telegram sin respuesta:', error)
      }
    })
  }

  // El email y el aviso de arriba salen siempre: son la ejecución del servicio
  // que el usuario ha pedido. El evento a Meta es publicidad, y sin
  // consentimiento no sale — ni siquiera con el teléfono hasheado.
  if (consentimiento === 'aceptado') {
    after(() =>
      enviarEventoCAPI({
        eventoId,
        telefono,
        email: email || undefined,
        // La misma referencia que viaja en el mensaje de WhatsApp. Es la clave
        // que une los dos leads, y ya estaba calculada aquí sin usarse.
        referencia,
        // El municipio ya se capturaba y solo llegaba al buzón. Meta lo hashea
        // como `ct` y sube la tasa de emparejamiento sin pedir un dato nuevo.
        // `provincia` no la recoge ningún formulario, así que `normalizar.st`
        // de `lib/meta-capi.ts` sigue sin llamada viva: es deuda, no descuido.
        municipio: municipio || undefined,
        ip,
        userAgent,
        url: urlOrigen,
        fbp,
        fbc,
      }),
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  const destino = process.env.EMAIL_DESTINO ?? 'comercial@pavimentos-albufera.com'

  if (apiKey) {
    // El email sí se espera: es lo único cuyo resultado decide qué ve el
    // usuario. Si no se ha entregado, no puede ver la pantalla de «recibido».
    //
    // ⚠️ Consecuencia asumida: en ese camino la CAPI manda su `Lead` —el lead
    // es real y Telegram puede haberlo entregado— y el Pixel del navegador no,
    // porque `FormularioPresupuesto.tsx:66` solo dispara con `'enviado'`. Meta
    // deduplica por `event_id` + `event_name`, así que el evento se cuenta una
    // vez y bien; lo que falta es la pata de navegador, no el evento.
    let entregado = false
    try {
      const respuesta = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Pavimentos Albufera <presupuesto@pavimentos-albufera.com>',
          to: destino,
          reply_to: email || undefined,
          subject: `Presupuesto — ${nombre} · ${espacio}`,
          text: [
            `Nombre: ${nombre}`,
            `Teléfono: ${telefono}`,
            `Email: ${email || '—'}`,
            `Espacio: ${espacio}`,
            `Superficie: ${superficie || '—'}`,
            `Municipio: ${municipio || '—'}`,
            `Mensaje: ${mensaje || '—'}`,
            `Foto adjunta: ${adjunto ? 'sí' : 'no'}`,
            '',
            `Formulario de: ${origen}`,
            ...atribucion,
          ].join('\n'),
          ...(adjunto ? { attachments: [adjunto] } : {}),
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      })

      // `fetch` no lanza con un 400. Sin esto, una clave caducada o un dominio
      // sin verificar devuelven 401/422 y el usuario ve igualmente la pantalla
      // de éxito mientras el lead se pierde.
      entregado = respuesta.ok
      if (!respuesta.ok) {
        const cuerpo = await respuesta.text()
        console.error(`Resend ${respuesta.status}: ${cuerpo.slice(0, 500)}`)
      }
    } catch (error) {
      console.error('Resend sin respuesta:', error)
    }

    if (!entregado) {
      return {
        estado: 'error',
        errores: {
          // El literal `[teléfono]` es el del microcopy de `design/02` §B1:
          // `FormularioPresupuesto` lo sustituye al pintarlo, porque el número
          // vive en configuración y el Server Action no es quien lo compone.
          // Sin él, esa sustitución era código muerto sobre un camino vivo y el
          // mensaje perdía la única vía de contacto que ofrece. Con el número
          // configurado se lee el número; sin él, el hueco sale en
          // `<DatoPendiente>` como en el resto del sitio, y no como el
          // `96X XXX XXX` de relleno que antes pasaba por teléfono real.
          form: 'No hemos podido enviarlo. Llámanos al [teléfono] o escríbenos por WhatsApp y lo resolvemos ahora.',
        },
        valores,
      }
    }
  }

  // El resumen viaja tal cual, con la cadena vacía cuando el campo no se pide.
  // El guion de relleno que había antes no era solo un hueco feo en el panel de
  // «Recibido»: `FormularioPresupuesto` lo reenvía como `municipality` a GA4 y
  // al Pixel, así que cada lead de la variante corta declaraba `—` de
  // municipio. Quién decide si un campo se enseña es quien lo pinta.
  return {
    estado: 'enviado',
    errores: {},
    resumen: { espacio, superficie, municipio },
  }
}
