import { articles } from '../data/articles.ts'
import type { Article, ArticleBlock } from '../schemas/article.ts'
import type { ServiceId } from '../schemas/service.ts'
import { pickLocalized, resolveImage } from './resolve.ts'
import type { Locale, ResolvedImage } from './resolve.ts'

export type ResolvedArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string; id: string }
  | { type: 'orderedList'; items: string[] }
  | { type: 'projectCallout'; slug: string }
  | { type: 'pending'; text: string }

export type ResolvedArticle = {
  slug: string
  title: string
  excerpt?: string
  date?: string
  service: ServiceId
  body?: ResolvedArticleBlock[]
  openingImage?: ResolvedImage
}

function resolveBlock(block: ArticleBlock, locale: Locale): ResolvedArticleBlock | undefined {
  switch (block.type) {
    case 'paragraph': {
      const text = pickLocalized(block.text, locale)
      return text !== undefined ? { type: 'paragraph', text } : undefined
    }
    case 'heading': {
      const text = pickLocalized(block.text, locale)
      return text !== undefined ? { type: 'heading', text, id: block.id } : undefined
    }
    case 'orderedList': {
      const items = block.items.map((item) => pickLocalized(item, locale)).filter((item): item is string => item !== undefined)
      return items.length > 0 ? { type: 'orderedList', items } : undefined
    }
    case 'projectCallout':
      return { type: 'projectCallout', slug: block.slug }
    case 'pending': {
      const text = pickLocalized(block.text, locale)
      return text !== undefined ? { type: 'pending', text } : undefined
    }
  }
}

function resolveArticle(article: Article, locale: Locale): ResolvedArticle | undefined {
  const slug = pickLocalized(article.slug, locale)
  const title = pickLocalized(article.title, locale)
  if (slug === undefined || title === undefined) return undefined

  const excerpt = pickLocalized(article.excerpt, locale)
  const date = pickLocalized(article.date, locale)
  const body = article.body?.map((block) => resolveBlock(block, locale)).filter((block): block is ResolvedArticleBlock => block !== undefined)

  return {
    slug,
    title,
    ...(excerpt !== undefined ? { excerpt } : {}),
    ...(date !== undefined ? { date } : {}),
    service: article.service,
    ...(body !== undefined && body.length > 0 ? { body } : {}),
    ...(article.openingImage ? { openingImage: resolveImage(article.openingImage, locale) } : {}),
  }
}

/** All 3 articles, resolved for `locale`. */
export function getArticles(locale: Locale): ResolvedArticle[] {
  const out: ResolvedArticle[] = []
  for (const article of articles) {
    const resolved = resolveArticle(article, locale)
    if (resolved) out.push(resolved)
  }
  return out
}

export function getArticle(slug: string, locale: Locale): ResolvedArticle | undefined {
  return getArticles(locale).find((a) => a.slug === slug)
}

/** The article that explains a given service, if one exists — `articuloQueExplica` in `lib/datos.ts`. */
export function getArticleForService(service: ServiceId, locale: Locale): ResolvedArticle | undefined {
  return getArticles(locale).find((a) => a.service === service)
}
