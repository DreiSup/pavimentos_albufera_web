import type { ColorCatalogEntry } from '../schemas/color.ts'

/**
 * The 7 factory colors this catalog names, in `ColorId` order. Values from
 * `lib/tipos.ts`'s `CODIGO_COLOR` (pre-migration) — unchanged, see
 * `schemas/color.ts`'s doc comment for why this is a separate catalog from
 * `Finish.code`.
 */
export const colorCatalog: ColorCatalogEntry[] = [
  { id: '117', code: 'C-117' },
  { id: '113', code: 'C-113' },
  { id: '109', code: 'C-109' },
  { id: '107', code: 'C-107' },
  { id: 'gris', code: 'GRIS' },
  { id: 'arena', code: 'ARENA' },
  { id: 'crema', code: 'CREMA' },
]
