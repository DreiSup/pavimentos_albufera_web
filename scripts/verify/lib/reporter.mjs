// Collects issues from every check, matches them against the baseline
// allowlist (scripts/verify/known-issues.json), and prints one human report.
// Ported verbatim from Pavivasa's scripts/verify/lib/reporter.mjs — nothing
// project-specific here.
import { readJSONIfExists } from './fs-util.mjs'

// `detail` is an extra free-text discriminator (e.g. the exact duplicated
// title, or the offending file) baked INTO the matching key on top of
// (check, code, route) — so a baseline entry only allow-lists the specific
// collision it documents, never every future issue that happens to share
// the same (check, code, route) triple. Omitted (`undefined`/`null`)
// entries key the same as before this field existed, so every pre-existing
// baseline entry without a `detail` keeps matching exactly what it matched.
function keyOf(issue) {
  return `${issue.check}|${issue.code}|${issue.route ?? '(global)'}|${issue.detail ?? '(none)'}`
}

export async function loadKnownIssues(filePath) {
  const data = await readJSONIfExists(filePath, { entries: [] })
  const entries = Array.isArray(data.entries) ? data.entries : []
  return new Map(entries.map((e) => [keyOf({ check: e.check, code: e.code, route: e.route, detail: e.detail }), e]))
}

export class Reporter {
  /**
   * `relevantChecks`: the check names this invocation actually runs (e.g.
   * index.mjs's checks, or just `['secrets']` for secrets-scan.mjs). Baseline
   * entries for OTHER checks are ignored for staleness — they belong to a
   * different script's run, not to "no longer reproducing here".
   *
   * `excludeCodes`: finer-grained than `relevantChecks` — a set of
   * `"check:code"` strings for issues this invocation could never produce
   * even though the wider check IS relevant (e.g. `index.mjs
   * --skip-server` still runs `checkSitemapStatic`'s own
   * `sitemap:missing-from-sitemap`/`sitemap:not-a-real-page`, but not
   * `checkLive`'s `sitemap:url-not-200`/`sitemap:metadata-route-not-200` —
   * excluding the whole `sitemap` check from `relevantChecks` would wrongly
   * un-stale-check the codes it DOES still produce). A key whose
   * `"check:code"` is in this set is never counted as stale, regardless of
   * `relevantChecks`.
   *
   * `failOnStale`: when true, a stale baseline entry (scoped to
   * `relevantChecks`/`excludeCodes`, same as above) also fails the run, not
   * just prints as informational.
   */
  constructor(knownIssues, relevantChecks = null, { failOnStale = false, excludeCodes = null } = {}) {
    this.knownIssues = knownIssues // Map from loadKnownIssues
    this.relevantChecks = relevantChecks ? new Set(relevantChecks) : null
    this.excludeCodes = excludeCodes ? new Set(excludeCodes) : null
    this.failOnStale = failOnStale
    this.matchedBaselineKeys = new Set()
    this.newIssues = []
    this.baselineHits = []
    this.checkSummaries = []
    this.infoNotes = []
  }

  info(note) {
    this.infoNotes.push(note)
  }

  /** issue: { check, code, route, detail?, message } — route is a public path or null for a site-wide issue. */
  report(issue) {
    const key = keyOf(issue)
    const baseline = this.knownIssues.get(key)
    if (baseline) {
      this.matchedBaselineKeys.add(key)
      this.baselineHits.push({ ...issue, reason: baseline.reason })
    } else {
      this.newIssues.push(issue)
    }
  }

  startCheck(name) {
    this._currentCheckName = name
  }

  endCheck() {
    this.checkSummaries.push(this._currentCheckName)
  }

  print() {
    console.log('\n=== verify report ===\n')
    for (const name of this.checkSummaries) {
      console.log(`  ${name}`)
    }

    if (this.baselineHits.length > 0) {
      console.log(`\n-- ${this.baselineHits.length} known pre-existing issue(s), allowed by scripts/verify/known-issues.json --`)
      for (const i of this.baselineHits) {
        console.log(`  [baseline] [${i.check}:${i.code}] ${i.route ?? '(global)'} — ${i.message} (reason: ${i.reason})`)
      }
    }

    const staleKeys = this.staleKeys
    if (staleKeys.length > 0) {
      console.log(`\n-- ${staleKeys.length} stale baseline entr(y/ies) — no longer reproducing, safe to remove --`)
      for (const k of staleKeys) console.log(`  [stale] ${k}`)
    }

    if (this.newIssues.length > 0) {
      console.log(`\n-- ${this.newIssues.length} FAILING issue(s) --`)
      for (const i of this.newIssues) {
        console.log(`  [FAIL] [${i.check}:${i.code}] ${i.route ?? '(global)'} — ${i.message}`)
      }
    }

    if (this.infoNotes.length > 0) {
      console.log(`\n-- ${this.infoNotes.length} informational note(s) (not failures) --`)
      for (const n of this.infoNotes) console.log(`  ${n}`)
    }

    console.log(`\nTotal: ${this.newIssues.length} failing, ${this.baselineHits.length} baseline-allowed, ${staleKeys.length} stale baseline entries.\n`)
  }

  get staleKeys() {
    return [...this.knownIssues.keys()].filter((k) => {
      if (this.matchedBaselineKeys.has(k)) return false
      const [check, code] = k.split('|')
      if (this.relevantChecks && !this.relevantChecks.has(check)) return false
      if (this.excludeCodes && this.excludeCodes.has(`${check}:${code}`)) return false
      return true
    })
  }

  get exitCode() {
    if (this.newIssues.length > 0) return 1
    if (this.failOnStale && this.staleKeys.length > 0) return 1
    return 0
  }
}
