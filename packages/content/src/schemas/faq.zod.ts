import { z } from 'zod'
import { localizedText } from './localized.zod.ts'

export const questionSchema = z.object({
  question: localizedText,
  answer: localizedText.optional(),
  topic: z.string().min(1).optional(),
})
