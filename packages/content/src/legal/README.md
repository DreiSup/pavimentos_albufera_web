# Legal source texts — not rendered

These 5 files (`git mv`'d unchanged from `apps/web/src/lib/legal/`) are the
owner's own source material for the three legal pages: the review
instructions (`09-instrucciones-legales.md`), a plain-text note
(`LEEME.txt`), and the three drafted documents themselves. **No runtime
code reads this folder.** The text that actually ships on
`/aviso-legal/`, `/politica-de-privacidad/` and `/cookies/` is authored
directly as JSX in `apps/web/src/content/legal.tsx` (plain-string facts of
it now live in `../data/legal.ts`, read through `../queries/legal.ts` —
see D6 in the migration's `docs/migration/DECISIONS.md`); these `.md`/`.txt` files were
never imported by that file or any other module before this move, and
still aren't.

They move here — instead of staying untracked working material, or being
dropped — because `git ls-files` confirms they are tracked in this repo
(unlike the equivalent Pavivasa folder, whose `README.md` describes its
own files as genuinely untracked, unverified source documents; that
description does not apply here). Keeping them under `packages/content/`
mirrors Pavivasa's `src/legal/` location for the same kind of material,
even though — unlike Pavivasa — this repo's *rendered* legal copy is a
verified, structured content model, not a straight rendering of these
`.md` files.

If a future revision moves the legal pages' authored copy to read from
here instead of `content/legal.tsx`'s hand-written JSX, that's new work,
not implied by this move.
