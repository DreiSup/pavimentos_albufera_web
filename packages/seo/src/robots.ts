/**
 * This site's live `robots.txt` is one `*` group with its own `disallow` —
 * no AI-crawler-specific groups. Per RFC 9309 §2.2.1 a crawler with its own
 * named `User-agent` group ignores `*` entirely, so a `disallow` on the
 * catch-all group does NOT reach a named group: if this is ever extended
 * with named crawler groups, `disallow` has to be mirrored into each one or
 * those crawlers see the disallowed paths as allowed. Not decided here —
 * docs/migration/DECISIONS.md D10 keeps this migration mechanical: one group, as today.
 */
export type RobotsRules = {
  rules: { userAgent: string; allow: string; disallow?: string[] }[]
  sitemap: string
}

export function buildRobots(siteUrl: string, disallow: readonly string[]): RobotsRules {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: [...disallow] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
