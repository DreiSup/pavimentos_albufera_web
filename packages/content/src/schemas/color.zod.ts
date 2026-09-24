import { z } from 'zod'
import { colorIdSchema } from './finish.zod.ts'

export const colorCatalogEntrySchema = z.object({
  id: colorIdSchema,
  code: z.string().min(1),
})
