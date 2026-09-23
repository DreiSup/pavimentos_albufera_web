import { business } from '../data/business.ts'
import { pickLocalized } from '../schemas/localized.ts'
import type { Locale } from '../schemas/localized.ts'

/**
 * Deliberately its own module — nothing else in `data/` imports it, so a
 * client bundle that only needs business identity never drags in
 * services/projects data (see this package's README, "one export per
 * file"). No separate `getBusiness()` export: `Business` carries
 * `Localized<T>` fields now, so a raw unresolved read would violate the
 * `Localized<T>` rule the moment something used it — `resolveBusiness()`
 * below is the only read API.
 *
 * Mirrors `apps/web/src/lib/config.ts`'s `nap` exactly: no invented
 * `addressLine`/`phoneInternational` (Pavivasa computes those; this repo's
 * source object never did), no WhatsApp-defaults-to-phone fallback (this
 * repo's `nap.whatsapp` is independently sourced from its own env var).
 */
export type BusinessOverrides = {
  phone?: string
  whatsapp?: string
  address?: string
}

export type ResolvedBusiness = {
  name: string
  email: string
  phone?: string
  /** `phone`, or the placeholder text rendered via `<DatoPendiente>` when unset. */
  displayPhone: string
  phoneHref?: string
  whatsapp?: string
  whatsappHref?: string
  address?: string
  /** `address`, or the placeholder text rendered via `<DatoPendiente>` when unset. */
  displayAddress: string
  town: string
  postalCode: string
  province: string
  country: string
}

/**
 * Pure: computes the derived NAP values (phone href, WhatsApp href with its
 * greeting text, display fallbacks) the same way `lib/config.ts` did before
 * this migration. Takes no env dependency itself — the caller (the legacy
 * adapter, reading `@site/config`'s public env) passes any override already
 * resolved. `locale` resolves the WhatsApp greeting's `Localized<string>`
 * like every other query.
 */
export function resolveBusiness(overrides: BusinessOverrides, locale: Locale): ResolvedBusiness {
  const { phone, whatsapp, address } = overrides

  return {
    name: business.name,
    email: business.email,
    ...(phone !== undefined ? { phone } : {}),
    displayPhone: phone ?? pickLocalized(business.phonePlaceholder, locale) ?? '',
    ...(phone !== undefined ? { phoneHref: `tel:+34${phone.replace(/\D/g, '')}` } : {}),
    ...(whatsapp !== undefined ? { whatsapp } : {}),
    ...(whatsapp !== undefined
      ? {
          whatsappHref: `https://wa.me/34${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(pickLocalized(business.whatsappMessage, locale) ?? '')}`,
        }
      : {}),
    ...(address !== undefined ? { address } : {}),
    displayAddress: address ?? pickLocalized(business.addressPlaceholder, locale) ?? '',
    town: business.town,
    postalCode: business.postalCode,
    province: business.province,
    country: business.country,
  }
}
