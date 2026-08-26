import { createHash } from 'crypto'

function hash(valor: string) {
  return createHash('sha256').update(valor.trim().toLowerCase()).digest('hex')
}

type EventoCAPI = {
  eventoId: string
  telefono: string
  email?: string
  ip: string
  userAgent: string
  url: string
  fbp?: string
  fbc?: string
}

/**
 * Manda el evento Lead a Meta Conversions API, deduplicado con el Pixel del navegador
 * vía el mismo event_id. No hace nada si faltan las credenciales — mismo patrón que
 * el resto de integraciones de este server action: sin variable, sin error.
 */
export async function enviarEventoCAPI(evento: EventoCAPI) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const token = process.env.META_CAPI_ACCESS_TOKEN
  if (!pixelId || !token) return

  const userData: Record<string, unknown> = {
    ph: [hash(evento.telefono)],
    client_ip_address: evento.ip,
    client_user_agent: evento.userAgent,
  }
  if (evento.email) userData.em = [hash(evento.email)]
  if (evento.fbp) userData.fbp = evento.fbp
  if (evento.fbc) userData.fbc = evento.fbc

  try {
    await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [
          {
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            event_id: evento.eventoId,
            action_source: 'website',
            event_source_url: evento.url,
            user_data: userData,
          },
        ],
      }),
      signal: AbortSignal.timeout(8000),
    })
  } catch {
    // No bloquea el envío del presupuesto por un fallo de Meta.
  }
}
