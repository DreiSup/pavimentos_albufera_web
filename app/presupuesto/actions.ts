'use server'

import { z } from 'zod'
import { cookies, headers } from 'next/headers'
import { enviarEventoCAPI } from '@/lib/meta-capi'
import { sitio } from '@/lib/config'
import { COOKIE_ATRIBUCION, COOKIE_CONSENTIMIENTO, COOKIE_REFERENCIA } from '@/lib/cookies'

export type EstadoEnvio = {
  estado: 'inicial' | 'error' | 'enviando' | 'enviado'
  errores: Record<string, string>
  resumen?: { espacio: string; superficie: string; municipio: string }
}

// 4 MB, no los 10 que pedía `design/04` §6. El tope real no lo pone el
// formulario: Vercel corta el cuerpo de una función en 4,5 MB, y los Server
// Actions se ejecutan como función. Prometer 10 MB significaría un envío que
// funciona en local y muere con un 413 opaco en producción.
const MAX_FOTO = 4 * 1024 * 1024

const esquema = z.object({
  nombre: z.string().min(1, 'Escribe tu nombre.'),
  telefono: z
    .string()
    .transform((v) => v.replace(/[\s+]/g, '').replace(/^34/, ''))
    .refine((v) => /^\d{9}$/.test(v), 'Escribe un número de 9 cifras para que podamos llamarte.'),
  email: z.string().email().optional().or(z.literal('')),
  espacio: z.string().min(1, 'Selecciona qué quieres pavimentar.'),
  superficie: z.string().optional().default(''),
  municipio: z.string().optional().default(''),
  mensaje: z.string().optional().default(''),
  // El `required` del navegador no es validación: un envío sin JS o manipulado
  // se la salta. Aquí es obligatorio de verdad.
  privacidad: z.string().min(1, 'Tienes que aceptar la política de privacidad.'),
  evento_id: z.string().optional().default(''),
  origen: z.string().optional().default('unmarked'),
})

// Límite de envíos por IP: 3 / hora. En memoria — se reinicia con cada despliegue.
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

export async function enviarPresupuesto(
  _prev: EstadoEnvio,
  formData: FormData,
): Promise<EstadoEnvio> {
  // Honeypot: campo oculto con nombre plausible. Si viene relleno, éxito falso sin enviar.
  const honeypot = formData.get('empresa_web')
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return { estado: 'enviado', errores: {} }
  }

  const foto = formData.get('foto')
  formData.delete('foto')

  const datos = Object.fromEntries(formData.entries())
  const analizado = esquema.safeParse(datos)

  if (!analizado.success) {
    const errores: Record<string, string> = {}
    for (const issue of analizado.error.issues) {
      errores[String(issue.path[0])] = issue.message
    }
    return { estado: 'error', errores }
  }

  // Adjunto opcional. Antes se renderizaba el campo y se descartaba el archivo
  // en silencio, prometiendo algo que no se cumplía (04-desarrollo-y-deploy.md §6.4).
  let adjunto: { filename: string; content: string } | undefined
  if (foto instanceof File && foto.size > 0) {
    if (!foto.type.startsWith('image/')) {
      return { estado: 'error', errores: { foto: 'La foto tiene que ser una imagen.' } }
    }
    if (foto.size > MAX_FOTO) {
      return { estado: 'error', errores: { foto: 'La foto no puede pasar de 4 MB.' } }
    }
    adjunto = {
      filename: foto.name || 'foto.jpg',
      content: Buffer.from(await foto.arrayBuffer()).toString('base64'),
    }
  }

  const listaCabeceras = await headers()
  const ip = listaCabeceras.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonimo'
  if (!limitePorIp(ip)) {
    return {
      estado: 'error',
      errores: { form: 'Demasiados envíos seguidos. Llámanos o escríbenos por WhatsApp.' },
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
  const referencia = listaCookies.get(COOKIE_REFERENCIA)?.value ?? '—'
  const atribucion = [
    `Referencia: ${referencia}`,
    ...lineasAtribucion(listaCookies.get(COOKIE_ATRIBUCION)?.value),
  ]

  const apiKey = process.env.RESEND_API_KEY
  const destino = process.env.EMAIL_DESTINO ?? 'comercial@pavimentos-albufera.com'

  if (apiKey) {
    try {
      await fetch('https://api.resend.com/emails', {
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
      })
    } catch {
      return {
        estado: 'error',
        errores: { form: 'No hemos podido enviarlo. Llámanos o escríbenos por WhatsApp y lo resolvemos ahora.' },
      }
    }
  }

  const telegramToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChat = process.env.TELEGRAM_CHAT_ID
  if (telegramToken && telegramChat) {
    try {
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChat,
          text: [
            '🔔 Nuevo presupuesto',
            `${nombre} · ${telefono}`,
            espacio,
            municipio || '—',
            '',
            `Desde: ${origen}`,
            ...atribucion,
          ].join('\n'),
        }),
        signal: AbortSignal.timeout(8000),
      })
    } catch {
      // No bloquea el envío del presupuesto por un fallo de Telegram.
    }
  }

  // El email y el aviso salen siempre: son la ejecución del servicio que el
  // usuario ha pedido. El evento a Meta es publicidad, y sin consentimiento no
  // sale — ni siquiera con el teléfono hasheado.
  if (listaCookies.get(COOKIE_CONSENTIMIENTO)?.value === 'aceptado') {
    await enviarEventoCAPI({
      eventoId,
      telefono,
      email: email || undefined,
      ip,
      userAgent: listaCabeceras.get('user-agent') ?? '',
      url: `${sitio.url}/presupuesto/`,
      fbp: listaCookies.get('_fbp')?.value,
      fbc: listaCookies.get('_fbc')?.value,
    })
  }

  return {
    estado: 'enviado',
    errores: {},
    resumen: { espacio, superficie: superficie || '—', municipio: municipio || '—' },
  }
}
