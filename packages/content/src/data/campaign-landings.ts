import type { ServiceId } from '../schemas/service.ts'

/**
 * The `/lp/<slug>/` landings are a pure function of `data/services.ts` plus
 * this fixed list — from `content/landings.ts`'s `DE_CAMPANA`. Adding or
 * removing a landing is an explicit owner decision, not derived from any
 * other field, so it's kept here as a literal, not computed. `fratasado`
 * and `desactivado` are deliberately absent — see `queries/services.ts`'s
 * `getLandingService` for the recomposition itself.
 */
export const CAMPAIGN_SERVICE_IDS: ServiceId[] = ['impreso', 'pulido', 'lavado', 'microcemento']
