'use server'

import { z } from 'zod'
import { headers } from 'next/headers'

export type EstadoEnvio = {
  estado: 'inicial' | 'error' | 'enviando' | 'enviado'
  errores: Record<string, string>
  resumen?: { espacio: string; superficie: string; municipio: string }
}

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
  privacidad: z.string().optional(),
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

export async function enviarPresupuesto(
  _prev: EstadoEnvio,
  formData: FormData,
): Promise<EstadoEnvio> {
  // Honeypot: campo oculto con nombre plausible. Si viene relleno, éxito falso sin enviar.
  const honeypot = formData.get('empresa_web')
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return { estado: 'enviado', errores: {} }
  }

  const datos = Object.fromEntries(formData.entries())
  const analizado = esquema.safeParse(datos)

  if (!analizado.success) {
    const errores: Record<string, string> = {}
    for (const issue of analizado.error.issues) {
      errores[String(issue.path[0])] = issue.message
    }
    return { estado: 'error', errores }
  }

  const listaCabeceras = await headers()
  const ip = listaCabeceras.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonimo'
  if (!limitePorIp(ip)) {
    return {
      estado: 'error',
      errores: { form: 'Demasiados envíos seguidos. Llámanos o escríbenos por WhatsApp.' },
    }
  }

  const { nombre, telefono, email, espacio, superficie, municipio, mensaje } = analizado.data

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
          ].join('\n'),
        }),
      })
    } catch {
      return {
        estado: 'error',
        errores: { form: 'No hemos podido enviarlo. Llámanos o escríbenos por WhatsApp y lo resolvemos ahora.' },
      }
    }
  }

  return {
    estado: 'enviado',
    errores: {},
    resumen: { espacio, superficie: superficie || '—', municipio: municipio || '—' },
  }
}
