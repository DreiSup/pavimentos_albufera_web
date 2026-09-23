/**
 * Zod shape of the public (`NEXT_PUBLIC_*`) environment. Kept separate from
 * `env.ts` on purpose — see that file's own comment: `env.ts` is reachable
 * from client components (through the legacy adapter
 * `apps/web/src/lib/config.ts`, imported by `Cabecera.tsx`,
 * `MenuMovil.tsx`, `Consentimiento.tsx`…), and a `z.object(...)` here would
 * pull the zod runtime into that bundle for no reason: `env.ts`'s plain
 * reads already express this shape at runtime. Nothing in the
 * client-reachable graph imports this file — it exists for its inferred
 * type only, this phase (no `check-env` script wired yet).
 *
 * Env var NAMES are this repo's own (D9 — not renamed to match Pavivasa):
 * `NEXT_PUBLIC_ADS_ID`/`NEXT_PUBLIC_ADS_ETIQUETA_LLAMADA`, not
 * `NEXT_PUBLIC_GOOGLE_ADS_ID`/`NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL`. They are
 * an external contract (already set in Vercel's dashboard for the live
 * site) and stay exactly as-is.
 */
import { z } from 'zod'

export const PublicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url('must be an absolute URL, e.g. "https://pavimentos-albufera.com"').optional(),
  NEXT_PUBLIC_TELEFONO: z.string().optional(),
  NEXT_PUBLIC_WHATSAPP: z.string().optional(),
  NEXT_PUBLIC_DIRECCION: z.string().optional(),
  // Permissive on purpose, matching Pavivasa's own schema — catches an
  // obviously wrong value (a pasted URL, a stray label), not every valid id.
  NEXT_PUBLIC_GA_ID: z
    .string()
    .regex(/^(G|GT|UA)-[A-Za-z0-9-]+$/, 'expected a GA4/Google tag id like "G-XXXXXXXXXX" (or legacy "UA-…", "GT-…")')
    .optional(),
  NEXT_PUBLIC_ADS_ID: z.string().regex(/^AW-\d+$/, 'expected a Google Ads id like "AW-XXXXXXXXX"').optional(),
  NEXT_PUBLIC_ADS_ETIQUETA_LLAMADA: z.string().optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().regex(/^\d{5,20}$/, 'expected a numeric Meta Pixel id').optional(),
})

export type PublicEnv = z.infer<typeof PublicEnvSchema>
