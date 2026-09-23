import { models } from '../data/models.ts'
import type { ModelId } from '../schemas/finish.ts'
import { pickLocalized, resolveImage } from './resolve.ts'
import type { Locale, ResolvedImage } from './resolve.ts'

export type ResolvedModel = { id: ModelId; name: string; heroImage?: ResolvedImage }

function resolveModel(id: ModelId, locale: Locale): ResolvedModel | undefined {
  const model = models.find((m) => m.id === id)
  if (!model) return undefined
  const name = pickLocalized(model.name, locale)
  if (name === undefined) return undefined
  return {
    id,
    name,
    ...(model.heroImage ? { heroImage: resolveImage(model.heroImage, locale) } : {}),
  }
}

export function getModels(locale: Locale): ResolvedModel[] {
  const out: ResolvedModel[] = []
  for (const model of models) {
    const resolved = resolveModel(model.id, locale)
    if (resolved) out.push(resolved)
  }
  return out
}

export function getModel(id: ModelId, locale: Locale): ResolvedModel | undefined {
  return resolveModel(id, locale)
}
