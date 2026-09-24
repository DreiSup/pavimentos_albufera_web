// (g) every rendered <img> has non-empty alt (decorative images must use
// alt="" explicitly — reported as info, not a failure), and width/height or
// a `fill` container (next/image's data-nimg="fill"). This is a DIFFERENT
// layer than `apps/web/scripts/verificar-imagenes.mjs`: that script checks
// `alt`/pixel-width on the CONTENT DATA source (`packages/content/src/data/
// *.ts` literals) before anything renders; this check reads the actual
// `<img>` markup Next.js served, catching a component bug that drops or
// mismatches an `alt`/dimension on the way from data to markup. Both stay —
// see scripts/verify/README.md's overlap table.
//
// (h) tel:/wa.me link present (conversion CTA). Adapted from Pavivasa: this
// site's phone/WhatsApp are `<DatoPendiente>` — pending client data, wired
// through `NEXT_PUBLIC_TELEFONO`/`NEXT_PUBLIC_WHATSAPP` (see
// `apps/web/src/lib/config.ts`). When either is unset, EVERY tel:/wa.me
// link on EVERY page falls back to a non-CTA href (`/presupuesto/` or `#`)
// — a real, whole-build state, not a per-page bug (already gated for
// `VERCEL_ENV=production` by `apps/web/scripts/verificar-landings.mjs`,
// which this check does not duplicate — it checks link PRESENCE, not the
// reserve-placeholder TEXT verificar-landings.mjs checks).
//
// `phoneConfigured`/`whatsappConfigured` (computed once in index.mjs from
// this build's OWN pages: "does at least one page carry a real tel:/wa.me
// link") is how a whole-build gap ("no page anywhere has one — CI without
// `apps/web/.env.local`, the same situation verificar-landings.mjs only
// warns about") is told apart from a genuine per-page bug ("every other
// page has the link, this one doesn't"): a build-wide gap only informs, a
// per-page miss inside an otherwise-configured build still fails.
export function checkImagesAndCta({ pages, phoneConfigured, whatsappConfigured, reporter }) {
  reporter.startCheck('(g) images: alt present, dimensions or fill · (h) tel:/wa.me CTA present')

  for (const page of pages) {
    const { publicPath, parsed } = page

    parsed.images.forEach((img, i) => {
      const label = img.src ? img.src.slice(0, 80) : `image #${i + 1}`
      if (img.alt === undefined) {
        reporter.report({ check: 'images', code: 'missing-alt', route: publicPath, detail: label, message: `<img> has no alt attribute at all (${label})` })
      } else if (img.alt === '') {
        reporter.info(`[images:decorative] ${publicPath} — alt="" (decorative) on ${label}`)
      }
      const hasFill = img['data-nimg'] === 'fill'
      const hasDims = Boolean(img.width) && Boolean(img.height)
      if (!hasFill && !hasDims) {
        reporter.report({
          check: 'images',
          code: 'missing-dimensions',
          route: publicPath,
          detail: label,
          message: `<img> has neither width+height nor a fill container (${label})`,
        })
      }
    })

    const hasTel = parsed.links.some((l) => (l.href || '').startsWith('tel:'))
    const hasWhatsapp = parsed.links.some((l) => /wa\.me\//.test(l.href || ''))

    if (!hasTel) {
      const issue = { check: 'cta', code: 'missing-tel', route: publicPath, message: 'no tel: link found on the page' }
      if (phoneConfigured) reporter.report(issue)
      else reporter.info(`[cta:no-phone-configured] ${publicPath} — ${issue.message} (build-wide: no page has a tel: link — phone is a pending <DatoPendiente>, see apps/web/scripts/verificar-landings.mjs)`)
    }
    if (!hasWhatsapp) {
      const issue = { check: 'cta', code: 'missing-whatsapp', route: publicPath, message: 'no wa.me link found on the page' }
      if (whatsappConfigured) reporter.report(issue)
      else reporter.info(`[cta:no-whatsapp-configured] ${publicPath} — ${issue.message} (build-wide: no page has a wa.me link — WhatsApp is a pending <DatoPendiente>)`)
    }
  }

  reporter.endCheck()
}
