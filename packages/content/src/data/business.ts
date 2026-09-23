import type { Business } from '../schemas/business.ts'

/**
 * Single NAP source. Values from `apps/web/src/lib/config.ts`'s `nap`
 * (unverified-by-the-client fallbacks kept as-is — see that file's own
 * comment: neither the phone nor the address is confirmed yet, so both stay
 * `<DatoPendiente>` placeholders in the built site until an env var lands).
 */
export const business = {
  name: 'Pavimentos Albufera',
  email: 'comercial@pavimentos-albufera.com',
  town: 'Sollana',
  postalCode: '46430',
  province: 'Valencia',
  country: 'ES',
  phonePlaceholder: { es: '96X XXX XXX' },
  addressPlaceholder: { es: 'CALLE Y NÚMERO, Sollana · 46430 · Valencia' },
  whatsappMessage: { es: 'Hola, quiero presupuesto para ' },
} satisfies Business
