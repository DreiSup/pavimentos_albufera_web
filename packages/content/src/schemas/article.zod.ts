import { z } from 'zod'
import { localizedText } from './localized.zod.ts'
import { siteImageSchema } from './image.zod.ts'
import { serviceIdSchema } from './service.zod.ts'

export const articleBlockSchema: z.ZodTypeAny = z.discriminatedUnion('type', [
  z.object({ type: z.literal('paragraph'), text: localizedText }),
  z.object({ type: z.literal('heading'), text: localizedText, id: z.string().min(1) }),
  z.object({ type: z.literal('orderedList'), items: z.array(localizedText).min(1) }),
  z.object({ type: z.literal('projectCallout'), slug: z.string().min(1) }),
  z.object({ type: z.literal('pending'), text: localizedText }),
])

export const articleSchema = z.object({
  slug: localizedText,
  title: localizedText,
  excerpt: localizedText.optional(),
  date: localizedText.optional(),
  service: serviceIdSchema,
  body: z.array(articleBlockSchema).min(1).optional(),
  openingImage: siteImageSchema.optional(),
})
