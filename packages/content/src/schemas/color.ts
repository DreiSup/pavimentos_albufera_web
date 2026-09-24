import type { ColorId } from './finish.ts'

/**
 * The factory color catalog (D24): a `ColorId` → printed color code lookup,
 * the general/default code shown wherever a color is named without a
 * specific `Finish` in hand (e.g. a project's own `COLOR` spec row —
 * `apps/web/src/lib/tipos.ts`'s `CODIGO_COLOR`, pre-migration). NOT the
 * same value as `Finish.code`: a finish's own printed code is authored
 * per-entry (`data/finishes.ts`) and can legitimately diverge from this
 * catalog's default for its color (e.g. one finish prints `'GRIS MATE'`
 * where the catalog's default for `'gris'` is `'GRIS'`) — this catalog is
 * never read to fill in `Finish.code`, only to resolve a bare `ColorId`
 * that has no finish attached.
 */
export type ColorCatalogEntry = {
  id: ColorId
  /** Printed color code, e.g. `'C-117'`, `'GRIS'`. */
  code: string
}
