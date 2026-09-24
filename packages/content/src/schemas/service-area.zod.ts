import { z } from 'zod'
import { serviceIdSchema } from './service.zod.ts'
import { localizedText } from './localized.zod.ts'

export const provinceSchema = z.enum(['Valencia', 'Castellón', 'Alicante'])

export const serviceAreaSchema = z.object({
  slug: localizedText,
  town: z.string().min(1),
  province: provinceSchema,
  ring: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  projects: z.array(z.string().min(1)),
  services: z.array(serviceIdSchema),
})

export const unconfirmedServiceAreaTownsSchema = z.object({
  comment: z.string().min(1),
  towns: z.array(z.string().min(1)),
  headquartersTown: z.string().min(1),
})
