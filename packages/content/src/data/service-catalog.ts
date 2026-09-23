import type { ServiceId } from '../schemas/service.ts'
import type { Localized } from '../schemas/localized.ts'

export type ServiceCatalogEntry = { id: ServiceId; path: Localized<string>; name: Localized<string> }

/**
 * Light per-service lookup (id, path, name), deliberately without the heavy
 * content — for client-reachable code (menus, header, footer) that needs
 * only these two fields (`lib/tipos.ts`'s `NOMBRE_SERVICIO`/`RUTA_SERVICIO`
 * today). Duplicates a slice of `data/services.ts` on purpose, same
 * bundle-size reason as Pavivasa's own `service-catalog.ts` — kept in sync
 * by `content:validate`, not derived from `services.ts` at runtime.
 */
export const serviceCatalog: ServiceCatalogEntry[] = [
  { id: 'impreso', path: { es: '/hormigon-impreso/' }, name: { es: 'Hormigón impreso' } },
  { id: 'pulido', path: { es: '/hormigon-pulido/' }, name: { es: 'Hormigón pulido' } },
  { id: 'microcemento', path: { es: '/microcemento/' }, name: { es: 'Microcemento' } },
  { id: 'lavado', path: { es: '/hormigon-lavado/' }, name: { es: 'Hormigón lavado' } },
  { id: 'fratasado', path: { es: '/hormigon-fratasado/' }, name: { es: 'Hormigón fratasado' } },
  { id: 'desactivado', path: { es: '/hormigon-desactivado/' }, name: { es: 'Hormigón desactivado' } },
]
