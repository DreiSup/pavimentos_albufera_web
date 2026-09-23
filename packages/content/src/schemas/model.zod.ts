import { z } from 'zod'
import { localizedText } from './localized.zod.ts'
import { siteImageSchema } from './image.zod.ts'
import { modelIdSchema } from './finish.zod.ts'

export const modelSchema = z.object({
  id: modelIdSchema,
  name: localizedText,
  heroImage: siteImageSchema.optional(),
})
