import { z } from 'zod'
import { localizedText, localizedSchema } from './localized.zod.ts'
import { siteImageSchema } from './image.zod.ts'

/**
 * Some `applications.list[].text` entries are a deliberately empty string in
 * the source (`content/servicios.tsx`: `{ nombre: 'Caminos y accesos de
 * parcela', texto: '' }`) — the name alone is the whole entry, not a
 * missing translation. `localizedText`'s `min(1)` would reject that
 * legitimate value, so this field gets its own, more permissive schema.
 */
const localizedTextOrEmpty = localizedSchema(z.string())

export const serviceIdSchema = z.enum(['impreso', 'pulido', 'microcemento', 'lavado', 'fratasado', 'desactivado'])

export const serviceSectionSchema = z.enum([
  'seccion-guia',
  'seccion-aplicaciones',
  'seccion-muestrario',
  'seccion-ficha',
  'seccion-cuando-no',
  'seccion-como',
  'seccion-obra',
])

const specRowSchema = z.object({ label: localizedText, value: localizedText })

const serviceApplicationsSchema = z.object({
  intro: localizedText,
  list: z.array(z.object({ name: localizedText, text: localizedTextOrEmpty })),
})

/**
 * `RichText` (see `schemas/service.ts`): a plain string whose only markup is
 * `[text](/internal/path/)` and `{{pending}}`. Shape-checked here; the link
 * targets themselves are checked by `scripts/validate.ts`.
 */
const richText = localizedText

const serviceGuideSchema = z.object({
  kicker: localizedText,
  title: localizedText,
  intro: richText,
  blocks: z
    .array(z.object({ title: localizedText, paragraphs: z.array(richText).min(1) }))
    .min(1),
})

const whenNotToSchema = z.object({
  title: localizedText,
  text: localizedText,
  alternatives: z.array(z.object({ href: z.string().min(1), text: localizedText })),
})

export const serviceSchema = z.object({
  id: serviceIdSchema,
  path: localizedText,
  name: localizedText,
  title: localizedText,
  description: localizedText,
  h1: localizedText,
  intro: localizedText,
  heroLabelLines: z.array(localizedText),
  heroImage: siteImageSchema.optional(),
  cardImage: siteImageSchema.optional(),
  guide: serviceGuideSchema.optional(),
  applications: serviceApplicationsSchema.optional(),
  specs: z.array(specRowSchema),
  whenNotTo: whenNotToSchema.optional(),
  faqRefs: z.array(z.string().min(1)),
})
