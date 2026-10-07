'use server'

import { z } from 'zod'
import { cookies, headers } from 'next/headers'
import { after } from 'next/server'
import { enviarEventoCAPI } from '@/lib/meta-capi'
import { nap, sitio } from '@/lib/config'
import { COOKIE_ATRIBUCION, COOKIE_CONSENTIMIENTO, COOKIE_REFERENCIA } from '@/lib/cookies'
import { serverEnv } from '@site/config/server'
import { classifyLead, getPostalCodeName, normalizePostalCode, parseSquareMeters } from '@site/content'
import type { LeadClassification } from '@site/content'

/**
 * Lo que el visitante escribió, tal y como lo escribió.
 *
 * `design/02` §B1, estado 2: «el resto de campos conserva lo escrito». React
 * resetea el formulario después de ejecutar una acción, así que un rechazo del
 * servidor devolvía los siete campos en blanco: en móvil, quien acaba de
 * teclear nombre, teléfono, superficie y código postal no lo vuelve a escribir. La
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
  codigo_postal: string
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
  estado: 'inicial' | 'error' | 'enviando' | 'enviado' | 'rechazado'
  errores: Record<string, string>
  /**
   * Solo en `'rechazado'`: la solicitud no llega al mínimo de su zona. Al dueño
   * le llega igual por Telegram; al visitante se le dice que no se acepta, en
   * lugar del «Recibido».
   */
  aviso?: string
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

// Lo más que puede tener al usuario esperando cada canal. Los dos se esperan
// en serie, así que el peor caso es la suma.
const RESEND_TIMEOUT_MS = 15000
const TELEGRAM_TIMEOUT_MS = 8000

// Tope de `sendMessage`. Pasado, Telegram rechaza el mensaje entero con un 400.
const TELEGRAM_MAX_CARACTERES = 4096

/** Un trozo de línea del aviso: texto tal cual, o en negrita. */
type TrozoTelegram = string | { negrita: string }

/**
 * El texto del aviso, con sus negritas, recortado al tope de Telegram.
 *
 * La negrita va en `entities` y no en `parse_mode`: el texto sigue siendo
 * plano, así que lo que escribe el visitante no hay que escaparlo (un `<` o un
 * `*` en su nombre no rompe el envío) y un recorte no puede partir una
 * etiqueta. Los desplazamientos van en unidades UTF-16, que es lo que cuenta
 * Telegram y lo que mide `.length`.
 *
 * Lo primero que se sacrifica es la procedencia (página de origen, referencia,
 * consentimiento, atribución): sin ella el aviso sigue sirviendo para llamar.
 * Si ni así cabe, se corta en seco por el final, así que lo que puede ser largo
 * —el mensaje libre— tiene que ir la última de `lineas`.
 */
function textoTelegram(
  lineas: TrozoTelegram[][],
  procedencia: string[],
): { text: string; entities: { type: 'bold'; offset: number; length: number }[] } {
  let base = ''
  const negritas: { type: 'bold'; offset: number; length: number }[] = []
  lineas.forEach((trozos, i) => {
    if (i > 0) base += '\n'
    for (const trozo of trozos) {
      if (typeof trozo === 'string') {
        base += trozo
      } else if (trozo.negrita) {
        negritas.push({ type: 'bold', offset: base.length, length: trozo.negrita.length })
        base += trozo.negrita
      }
    }
  })
  const cola = `\n\n${procedencia.join('\n')}`
  const hueco = TELEGRAM_MAX_CARACTERES - base.length
  const text = cortar(hueco > 0 ? `${base}${cola.slice(0, hueco)}` : base, TELEGRAM_MAX_CARACTERES)
  // Una negrita que se sale del texto recortado hace que Telegram rechace el
  // mensaje entero: se recortan con él.
  const entities = negritas
    .filter((n) => n.offset < text.length)
    .map((n) => ({ ...n, length: Math.min(n.length, text.length - n.offset) }))
  return { text, entities }
}

/** Una fila del email: etiqueta, valor (vacío si no lo han dejado) y si va en negrita. */
type FilaEmail = { etiqueta: string; valor: string; negrita: boolean }

/** Lo que escribe el visitante va dentro de HTML: sin escapar, un `<` rompe el correo. */
function escaparHtml(texto: string): string {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * El cuerpo del email, en HTML (con los datos en negrita) y en texto plano
 * (el que ve un cliente de correo que no pinta HTML). Un campo vacío sale como
 * `—` sin negrita, para que la ausencia se vea y no se confunda con un dato.
 */
function cuerpoEmail(
  cabecera: string,
  filas: FilaEmail[],
  procedencia: string[],
): { text: string; html: string } {
  const text = [
    cabecera,
    '',
    ...filas.map((f) => `${f.etiqueta}: ${f.valor || '—'}`),
    '',
    ...procedencia,
  ].join('\n')

  const filaHtml = (f: FilaEmail) => {
    if (!f.valor) return `${f.etiqueta}: —`
    // Los saltos de línea del mensaje se conservan.
    const valor = escaparHtml(f.valor).replace(/\r?\n/g, '<br>')
    return `${f.etiqueta}: ${f.negrita ? `<strong>${valor}</strong>` : valor}`
  }
  const html = [
    `<p>${escaparHtml(cabecera)}</p>`,
    `<p>${filas.map(filaHtml).join('<br>')}</p>`,
    `<p>${procedencia.map(escaparHtml).join('<br>')}</p>`,
  ].join('\n')

  return { text, html }
}

/**
 * La zona en palabras, para el aviso. Solo para el dueño: el visitante no la ve
 * nunca, ni sabe que existe un filtro.
 */
function etiquetaZona({ zone, minSquareMeters }: LeadClassification): string {
  if (zone === 'unknown') return 'Zona sin identificar (código postal no reconocido)'
  return minSquareMeters === null ? `Zona ${zone}` : `Zona ${zone} · solo obras de más de ${minSquareMeters} m²`
}

/**
 * Lo que ve el visitante cuando su solicitud no llega al mínimo de su zona.
 * Texto del dueño (2026-10-07) para fuera de la Comunitat Valenciana; el de la
 * zona B sigue el mismo molde. Los dos, pendientes de aprobar en `design/02` §B1.
 */
function avisoRechazo({ zone, minSquareMeters }: LeadClassification): string {
  // Espacio de no separación: «1000» y «m²» no pueden quedar en líneas distintas.
  const minimo = `${minSquareMeters}\u00a0m²`
  return zone === 'C'
    ? `No hacemos obras fuera de la Comunitat Valenciana de ${minimo} o menos. Lo sentimos.`
    : `En tu zona solo hacemos obras de más de ${minimo}. Lo sentimos.`
}

/** Día y hora del envío, en hora de España, sea cual sea la zona del servidor. */
function momentoDeEnvio(fecha: Date): { dia: string; hora: string } {
  const zona = 'Europe/Madrid'
  return {
    dia: new Intl.DateTimeFormat('es-ES', { timeZone: zona, day: '2-digit', month: '2-digit', year: 'numeric' }).format(fecha),
    hora: new Intl.DateTimeFormat('es-ES', { timeZone: zona, hour: '2-digit', minute: '2-digit' }).format(fecha),
  }
}

/**
 * `slice` sin partir un emoji. Corta por unidades UTF-16, y un par sustituto
 * partido viaja como `\udXXX` suelto, que Telegram rechaza con un 400: el aviso
 * que cabía se perdería por el último carácter.
 */
function cortar(texto: string, maximo: number): string {
  const corte = texto.slice(0, maximo)
  const ultimo = corte.charCodeAt(corte.length - 1)
  return ultimo >= 0xd800 && ultimo <= 0xdbff ? corte.slice(0, -1) : corte
}

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
  // Obligatoria en las dos variantes desde el filtro por zona (2026-10-07): sin
  // superficie no se puede decidir si la solicitud sale por correo, y si fuera
  // opcional, cualquiera de fuera la dejaría vacía y saltaría el filtro. Tiene
  // que poder leerse como número: lo que no se entiende se pregunta, no se adivina.
  superficie: z
    .string()
    .trim()
    .min(1, 'Escribe la superficie aproximada en m².')
    .refine((v) => parseSquareMeters(v) !== null, 'Escribe la superficie en metros cuadrados, por ejemplo 80.'),
  // Solo se comprueba el formato. Un prefijo que no existe (00, 53…) pasa y se
  // trata como zona desconocida, que se acepta: ante la duda no se pierde el lead.
  codigo_postal: z
    .string()
    .transform(normalizePostalCode)
    .refine((v) => /^\d{5}$/.test(v), 'Escribe tu código postal de 5 cifras.'),
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
    codigo_postal: texto(formData.get('codigo_postal')),
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
    codigo_postal: codigoPostal,
    mensaje,
    origen,
    evento_id: eventoIdEnviado,
  } = analizado.data

  // Filtro por zona y superficie (`@site/content` → `classifyLead`, zonas en
  // `docs/zonas-cp.md`). Solo decide por dónde llega el aviso: el visitante ve
  // lo mismo se acepte o no.
  const clasificacion = classifyLead({ postalCode: codigoPostal, squareMeters: parseSquareMeters(superficie) })
  const filtrada = !clasificacion.accepted

  // El municipio ya no se pide (2026-10-07): sale del código postal, con la
  // misma tabla que pinta el nombre bajo el campo. Vacío si el código no está
  // en la tabla —que no lo hace inválido—; los avisos lo enseñan como `—`.
  const municipio = getPostalCodeName(codigoPostal) ?? ''

  // El esquema ya garantiza que se puede leer. Lo escrito se conserva al lado
  // cuando no es el mismo número («10x5», «1.200 m2»): el dueño ve qué se
  // tecleó y qué ha entendido el filtro.
  const metros = parseSquareMeters(superficie) ?? 0
  const metrosTexto = metros.toLocaleString('es-ES')
  const superficieAviso = metrosTexto === superficie ? `${metrosTexto} m²` : `${metrosTexto} m² (escrito: «${superficie}»)`

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

  // Los canales se esperan antes de responder, en serie, y basta con que uno
  // entregue para dar el envío por bueno. Es la regla de Pavivasa, y cierra
  // dos defectos que había aquí:
  //
  // - Solo contaba el email. Con Resend caído el visitante veía el error aunque
  //   Telegram hubiera entregado el aviso, y sin `RESEND_API_KEY` veía
  //   «recibido» siempre, aunque el aviso de Telegram fallara o no estuviera
  //   configurado: el lead se perdía sin que nadie lo supiera.
  // - Telegram iba en `after()`, así que su resultado no podía decidir nada.
  //
  // Una solicitud aceptada sale por correo y después por Telegram: Telegram va
  // detrás para poder decir si la foto salió en el email. Una filtrada sale
  // SOLO por Telegram, para que la vea el dueño y no el buzón de los clientes;
  // y si Telegram no entrega, cae al correo marcada como filtrada, porque un
  // aviso de más es mejor que un lead perdido. El peor caso de espera sigue
  // siendo 15 s de Resend más 8 s de Telegram.
  const apiKey = serverEnv.RESEND_API_KEY
  const destino = serverEnv.EMAIL_DESTINO ?? 'comercial@pavimentos-albufera.com'
  const telegramToken = serverEnv.TELEGRAM_BOT_TOKEN
  const telegramChat = serverEnv.TELEGRAM_CHAT_ID

  const enviado = momentoDeEnvio(new Date())
  const zona = etiquetaZona(clasificacion)

  async function enviarEmail(): Promise<boolean> {
    if (!apiKey) return false
    try {
      const respuesta = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // El dominio sale de la URL canónica sin `www.`: es el que hay que
          // verificar en Resend. Si `NEXT_PUBLIC_SITE_URL` apunta a otro host,
          // el remitente cambia con él y Resend lo rechaza. Una URL que no se
          // puede analizar lanza aquí dentro y cae en el `catch`.
          from: `${nap.nombre} <presupuesto@${new URL(sitio.url).hostname.replace(/^www\./, '')}>`,
          to: destino,
          reply_to: email || undefined,
          // Solo llega aquí una filtrada si Telegram no la ha entregado.
          subject: `${filtrada ? '[Fuera de filtro] ' : ''}Presupuesto — ${nombre} · ${espacio}`,
          ...cuerpoEmail(
            filtrada
              ? `Solicitud fuera de filtro (${zona}), pedida el ${enviado.dia} a las ${enviado.hora}. Al cliente se le ha dicho que no se acepta. Llega por correo porque el aviso de Telegram no ha salido.`
              : `Tienes una nueva demanda de presupuesto, pedida el ${enviado.dia} a las ${enviado.hora}`,
            [
              { etiqueta: 'Nombre', valor: nombre, negrita: true },
              { etiqueta: 'Teléfono', valor: telefono, negrita: true },
              { etiqueta: 'Email', valor: email, negrita: true },
              { etiqueta: 'Espacio', valor: espacio, negrita: true },
              { etiqueta: 'Superficie', valor: superficieAviso, negrita: true },
              { etiqueta: 'Código postal', valor: codigoPostal, negrita: true },
              { etiqueta: 'Municipio', valor: municipio, negrita: true },
              // El mensaje puede ser largo: en negrita se lee peor, no mejor.
              { etiqueta: 'Mensaje', valor: mensaje, negrita: false },
              // El nombre del archivo, para reconocer el adjunto en el correo.
              { etiqueta: 'Foto', valor: adjunto?.filename ?? '', negrita: true },
            ],
            [`Formulario de: ${origen}`, ...atribucion],
          ),
          ...(adjunto ? { attachments: [adjunto] } : {}),
        }),
        signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
      })

      // `fetch` no lanza con un 400. Sin esto, una clave caducada o un dominio
      // sin verificar devuelven 401/422 y el envío contaría como entregado.
      if (!respuesta.ok) {
        const cuerpo = await respuesta.text()
        console.error(`Resend ${respuesta.status}: ${cuerpo.slice(0, 500)}`)
      }
      return respuesta.ok
    } catch (error) {
      // No se corta aquí: puede que Telegram sí entregue.
      console.error('Resend sin respuesta:', error)
      return false
    }
  }

  /** `emailEntregado` es `null` cuando el email no se ha intentado a propósito (solicitud filtrada). */
  async function enviarTelegram(emailEntregado: boolean | null): Promise<boolean> {
    if (!telegramToken || !telegramChat) return false
    const lineaFoto = !adjunto
      ? null
      : emailEntregado === null
        ? `Foto: ${adjunto.filename} — no reenviada: esta solicitud no sale por email, pídesela al cliente`
        : `Foto: ${adjunto.filename}${emailEntregado ? ' — adjunta en el email' : ' — SIN ENTREGAR: el email no ha salido'}`
    try {
      const respuesta = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChat,
          ...textoTelegram(
            [
              // Primera línea, la que enseña la notificación: de qué web viene
              // y, si está filtrada, que solo la ve el dueño.
              [filtrada ? `${nap.nombre} 🟡 Fuera de filtro · solo Telegram` : `${nap.nombre} 🔔 Nuevo presupuesto`],
              filtrada ? [{ negrita: zona }] : null,
              // Para que el dueño sepa qué ha leído el cliente antes de llamarle.
              filtrada ? ['Al cliente se le ha dicho que no se acepta.'] : null,
              ['nombre: ', { negrita: nombre }],
              ['teléfono: ', { negrita: telefono }],
              // El aviso es lo primero que se lee, y muchas veces lo único.
              // Con `—` cuando no lo han dejado, para que la ausencia se vea y
              // no se confunda con una línea que falta. El dato en negrita; el
              // guion, no.
              ['email: ', email ? { negrita: email } : '—'],
              [{ negrita: espacio.toLocaleUpperCase('es-ES') }],
              [{ negrita: superficieAviso }],
              [municipio ? { negrita: municipio } : '—', ` · CP ${codigoPostal}`],
              filtrada ? null : [zona],
              // Antes que el mensaje: si el texto no cabe se corta por el
              // final, y el aviso de foto sin entregar no puede ser lo que se
              // pierda.
              lineaFoto ? [lineaFoto] : null,
              mensaje ? [mensaje] : null,
            ].filter((linea): linea is TrozoTelegram[] => linea !== null),
            [`Desde: ${origen}`, ...atribucion],
          ),
        }),
        signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
      })

      // Un chat_id equivocado o un bot expulsado devuelven 400 y `fetch` no lanza.
      if (!respuesta.ok) {
        const cuerpo = await respuesta.text()
        console.error(`Telegram ${respuesta.status}: ${cuerpo.slice(0, 500)}`)
      }
      return respuesta.ok
    } catch (error) {
      console.error('Telegram sin respuesta:', error)
      return false
    }
  }

  let emailEntregado = false
  let telegramEntregado = false
  if (filtrada) {
    telegramEntregado = await enviarTelegram(null)
    if (!telegramEntregado) emailEntregado = await enviarEmail()
  } else {
    emailEntregado = await enviarEmail()
    telegramEntregado = await enviarTelegram(emailEntregado)
  }

  // Una filtrada se rechaza ante el visitante haya entregado o no algún canal:
  // la respuesta a su solicitud es la misma. Y no es un lead para la
  // publicidad —ni CAPI aquí ni `generate_lead` en el navegador, que solo
  // dispara con `'enviado'`—, así que las campañas no aprenden a traer más.
  if (filtrada) {
    if (!emailEntregado && !telegramEntregado) {
      console.error(`Solicitud fuera de filtro sin entregar a ningún canal (CP ${codigoPostal}, ${superficieAviso})`)
    }
    return { estado: 'rechazado', errores: {}, aviso: avisoRechazo(clasificacion) }
  }

  if (!emailEntregado && !telegramEntregado) {
    // Sin esta línea, un despliegue sin variables no deja rastro: ningún canal
    // se intenta y no hay respuesta de error que registrar.
    if (!apiKey && !(telegramToken && telegramChat)) {
      console.error(
        'Presupuesto sin canal configurado: faltan RESEND_API_KEY y TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID',
      )
    }
    return {
      estado: 'error',
      errores: {
        // El literal `[teléfono]` es el del microcopy de `design/02` §B1:
        // `FormularioPresupuesto` lo sustituye al pintarlo, porque el número
        // vive en configuración y el Server Action no es quien lo compone.
        // Con el número configurado se lee el número; sin él, el hueco sale en
        // `<DatoPendiente>` como en el resto del sitio.
        form: 'No hemos podido enviarlo. Llámanos al [teléfono] o escríbenos por WhatsApp y lo resolvemos ahora.',
      },
      valores,
    }
  }

  // El evento a Meta sale solo con el lead entregado —un envío que no ha
  // llegado a nadie no es un lead— y solo con consentimiento: es publicidad,
  // no la ejecución del servicio pedido. Va en `after()` porque su resultado no
  // cambia nada de lo que ve el visitante. Al salir solo con `'enviado'`, la CAPI
  // y el Pixel del navegador (`FormularioPresupuesto.tsx`, que dispara desde ese
  // mismo estado) cuentan ahora los mismos envíos.
  if (consentimiento === 'aceptado') {
    after(() =>
      enviarEventoCAPI({
        eventoId,
        telefono,
        email: email || undefined,
        // La misma referencia que viaja en el mensaje de WhatsApp. Es la clave
        // que une los dos leads.
        referencia,
        // Meta lo hashea como `ct` y sube la tasa de emparejamiento sin pedir
        // un dato nuevo. `provincia` no la recoge ningún formulario, así que
        // `normalizar.st` de `lib/meta-capi.ts` sigue sin llamada viva.
        municipio: municipio || undefined,
        ip,
        userAgent,
        url: urlOrigen,
        fbp,
        fbc,
      }),
    )
  }

  // La superficie viaja como el número que ha entendido el filtro, para que el
  // panel de «Recibido» no pinte «80 m2 m²» a quien escribió la unidad.
  //
  // El resumen no lleva relleno cuando falta un dato. El guion de relleno que había antes no era solo un hueco feo en el panel de
  // «Recibido»: `FormularioPresupuesto` lo reenvía como `municipality` a GA4 y
  // al Pixel, así que cada lead de la variante corta declaraba `—` de
  // municipio. Quién decide si un campo se enseña es quien lo pinta.
  return {
    estado: 'enviado',
    errores: {},
    resumen: { espacio, superficie: metrosTexto, municipio },
  }
}
