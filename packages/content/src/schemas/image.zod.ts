import { z } from 'zod'
import { localizedText } from './localized.zod.ts'

export const imageKindSchema = z.enum(['final', 'proceso', 'detalle', 'antes'])

export const siteImageSchema = z.object({
  src: z.string().min(1),
  alt: localizedText,
  kind: imageKindSchema,
})
