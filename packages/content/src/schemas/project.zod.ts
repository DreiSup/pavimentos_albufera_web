import { z } from 'zod'
import { localizedText } from './localized.zod.ts'
import { siteImageSchema } from './image.zod.ts'
import { serviceIdSchema } from './service.zod.ts'
import { colorIdSchema, modelIdSchema } from './finish.zod.ts'
import { provinceSchema } from './service-area.zod.ts'

const executionSpecsSchema = z.object({
  concrete: localizedText.optional(),
  thickness: localizedText.optional(),
  aggregate: localizedText.optional(),
  mesh: localizedText.optional(),
  fiber: localizedText.optional(),
  color: localizedText.optional(),
  finishes: z.array(localizedText).optional(),
})

export const projectSchema = z.object({
  slug: localizedText,
  title: localizedText,
  town: z.string().min(1).optional(),
  province: provinceSchema.optional(),
  service: serviceIdSchema,
  model: modelIdSchema.optional(),
  color: colorIdSchema.optional(),
  surfaceArea: z.number().positive().optional(),
  year: z.number().int().optional(),
  executionDays: z.number().int().positive().optional(),
  brief: localizedText.optional(),
  execution: localizedText.optional(),
  images: z.array(siteImageSchema),
  featured: z.boolean(),
  executionSpecs: executionSpecsSchema.optional(),
})

/** `_pending`/`_note` editorial fields, preserved (D5) but never part of the public `Project` shape. */
export const projectRecordSchema = projectSchema.extend({
  _pending: z.array(z.string().min(1)).optional(),
  _note: z.string().min(1).optional(),
})
