import { z } from 'zod'
import { localizedText } from './localized.zod.ts'
import { siteImageSchema } from './image.zod.ts'
import { serviceIdSchema } from './service.zod.ts'

export const modelIdSchema = z.enum([
  'espiga',
  'adoquin-irregular',
  'adoquin-pequeno',
  'manta',
  'silleria-grande',
  'piedra-silleria',
  'piedra-rodena',
  'piedra-inglesa',
])

export const colorIdSchema = z.enum(['117', '113', '109', '107', 'gris', 'arena', 'crema'])

export const finishSchema = z.object({
  slug: z.string().min(1),
  name: localizedText,
  model: modelIdSchema.optional(),
  color: colorIdSchema,
  code: z.string().min(1),
  service: serviceIdSchema,
  sample: siteImageSchema.optional(),
  projects: z.array(z.string().min(1)),
})
