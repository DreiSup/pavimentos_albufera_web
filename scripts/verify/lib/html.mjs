// Zero-dependency HTML extraction for one prerendered page. Ported verbatim
// from Pavivasa's scripts/verify/lib/html.mjs — this site's App Router also
// produces plain React SSR output (double-quoted attributes, entity-escaped
// values), so the same tokenizer strategy applies unchanged.
//
// Strategy: pull out <script type="application/ld+json"> bodies FIRST (we
// need their raw text), then strip every other <script>, <style> and HTML
// comment (this also removes the RSC "flight" payload, which re-serializes
// page content — including the JSON-LD strings — as data we must not
// re-scan). What's left is plain markup, safe to scan with tag regexes.

const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  '#39': "'",
  '#x27': "'",
  nbsp: ' ',
}

export function decodeEntities(str) {
  if (!str) return str
  return str.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z0-9]+);/g, (whole, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole
    }
    return Object.prototype.hasOwnProperty.call(ENTITIES, body) ? ENTITIES[body] : whole
  })
}

function parseAttrs(attrString) {
  const attrs = {}
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*"([^"]*)"/g
  let m
  while ((m = re.exec(attrString))) {
    attrs[m[1].toLowerCase()] = decodeEntities(m[2])
  }
  return attrs
}

/** Extracts and removes every ld+json script, returning { bodies, html } (html has them removed). */
function extractLdJson(html) {
  const bodies = []
  const re = /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  const out = html.replace(re, (whole, body) => {
    bodies.push(body)
    return ''
  })
  return { bodies, html: out }
}

/** Strips every remaining <script>, <style> and HTML comment. */
function stripNoise(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
}

/**
 * Parses one prerendered HTML file into the facts the checks need. Only
 * looks at tags relevant to those checks — this is not a general HTML
 * parser.
 */
export function parsePage(rawHtml) {
  const { bodies: jsonLdBodies, html: withoutLd } = extractLdJson(rawHtml)
  const clean = stripNoise(withoutLd)

  const h1Count = (clean.match(/<h1[\s>]/gi) || []).length

  const titleMatch = clean.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const title = titleMatch ? decodeEntities(titleMatch[1]).trim() : null

  let description = null
  let robotsMeta = null
  let ogUrl = null
  const metaRe = /<meta\b([^>]*)>/gi
  let mm
  while ((mm = metaRe.exec(clean))) {
    const attrs = parseAttrs(mm[1])
    const name = (attrs.name || '').toLowerCase()
    const property = (attrs.property || '').toLowerCase()
    if (name === 'description') description = attrs.content ?? null
    if (name === 'robots') robotsMeta = attrs.content ?? null
    if (property === 'og:url') ogUrl = attrs.content ?? null
  }

  let canonical = null
  const linkRe = /<link\b([^>]*)>/gi
  let lm
  while ((lm = linkRe.exec(clean))) {
    const attrs = parseAttrs(lm[1])
    if ((attrs.rel || '').toLowerCase() === 'canonical') canonical = attrs.href ?? null
  }

  const links = []
  const aRe = /<a\b([^>]*)>/gi
  let am
  while ((am = aRe.exec(clean))) {
    const attrs = parseAttrs(am[1])
    if (attrs.href !== undefined) links.push(attrs)
  }

  const images = []
  const imgRe = /<img\b([^>]*?)\/?>/gi
  let im
  while ((im = imgRe.exec(clean))) {
    images.push(parseAttrs(im[1]))
  }

  return { title, description, robotsMeta, canonical, ogUrl, h1Count, links, images, jsonLdBodies }
}

export function isNoindexMeta(robotsMeta) {
  if (!robotsMeta) return false
  return robotsMeta
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .includes('noindex')
}
