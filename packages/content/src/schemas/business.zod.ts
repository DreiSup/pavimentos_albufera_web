import { z } from 'zod'
import { localizedText } from './localized.zod.ts'

export const businessSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  town: z.string().min(1),
  postalCode: z.string().min(1),
  province: z.string().min(1),
  country: z.string().min(1),
  phonePlaceholder: localizedText,
  addressPlaceholder: localizedText,
  whatsappMessage: localizedText,
})
