/**
 * Zod counterpart of `localized.ts`'s `Localized<T>`, used only by
 * `scripts/validate.ts` (a Node script, never bundled into the app). Kept in
 * its own file, like `packages/config`'s `*.schema.ts` split, so nothing in
 * `data/` or `queries/` — which the client-reachable legacy adapters import —
 * pulls the zod runtime in just to describe a shape `data/` already satisfies
 * by construction by using `satisfies`.
 */
import { z } from 'zod'

export function localizedSchema<Value extends z.ZodTypeAny>(value: Value) {
  return z.object({
    es: value,
    en: value.optional(),
    fr: value.optional(),
    de: value.optional(),
  })
}

export const localizedText = localizedSchema(z.string().min(1))
