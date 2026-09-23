import { z } from 'zod'
import { localizedText } from './localized.zod.ts'

const legalFactRowSchema = z.object({ label: localizedText, value: localizedText })
const cookieFactSchema = z.object({ name: z.string().min(1), rows: z.array(legalFactRowSchema).min(1) })
const recipientFactSchema = z.object({ recipient: z.string().min(1), rows: z.array(legalFactRowSchema).min(1) })

export const legalFactsSchema = z.object({
  companyName: z.string().min(1),
  taxId: z.string().min(1),
  domain: z.string().min(1),
  activity: localizedText,
  lastLegalReview: localizedText,
  ownCookies: z.array(cookieFactSchema).min(1),
  thirdPartyCookies: z.array(cookieFactSchema).min(1),
  recipients: z.array(recipientFactSchema).min(1),
})
