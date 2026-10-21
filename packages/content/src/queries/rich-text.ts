import type { RichText } from '../schemas/service.ts'

/**
 * One run of resolved `RichText` (see `schemas/service.ts`): plain text, an
 * internal link, or a datum only the owner can give (rendered pending).
 */
export type ResolvedRichTextRun =
  | { type: 'text'; text: string }
  | { type: 'link'; text: string; href: string }
  | { type: 'pending'; text: string }

/** `[text](/path/)` or `{{pending}}` — the only two markups `RichText` has. */
const MARKUP = /\[([^\]]+)\]\((\/[^)\s]*)\)|\{\{([^}]+)\}\}/g

/**
 * Splits a `RichText` string into runs. Pure and dependency-free so it can
 * also run inside `scripts/validate.ts`. Anything that isn't one of the two
 * markups stays literal text — a stray `[` is just a character.
 */
export function parseRichText(source: RichText): ResolvedRichTextRun[] {
  const runs: ResolvedRichTextRun[] = []
  let last = 0
  for (const match of source.matchAll(MARKUP)) {
    const start = match.index ?? 0
    if (start > last) runs.push({ type: 'text', text: source.slice(last, start) })
    if (match[3] !== undefined) runs.push({ type: 'pending', text: match[3] })
    else runs.push({ type: 'link', text: match[1] ?? '', href: match[2] ?? '' })
    last = start + match[0].length
  }
  if (last < source.length) runs.push({ type: 'text', text: source.slice(last) })
  return runs
}

