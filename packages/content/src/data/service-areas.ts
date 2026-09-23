import type { ServiceArea, UnconfirmedServiceAreaTowns } from '../schemas/service-area.ts'

/** `_note` (from `content/zonas.json`'s `_nota`): editorial metadata, preserved (D5) but never exposed by `queries/`. */
export type ServiceAreaRecord = ServiceArea & { _note?: string }

/** The 8 documented `/zonas/[municipio]/` pages, from `content/zonas.json`. */
export const serviceAreas: ServiceAreaRecord[] = [
  {
    slug: 'moraira',
    town: 'Moraira',
    province: 'Alicante',
    ring: 1,
    projects: ['moraira-impreso-adoquin-arena'],
    services: ['impreso'],
    _note: 'Página de zona normativa. Perfil de cliente extranjero y segunda residencia, distinto al del área metropolitana de Valencia.',
  },
  { slug: 'denia', town: 'Denia', province: 'Alicante', ring: 1, projects: ['denia-impreso-piedra-inglesa'], services: ['impreso'] },
  { slug: 'ribarroja', town: 'Ribarroja', province: 'Valencia', ring: 1, projects: ['ribarroja-pulido'], services: ['pulido'] },
  { slug: 'xabia', town: 'Xàbia', province: 'Alicante', ring: 1, projects: ['xabia-pulido'], services: ['pulido'] },
  { slug: 'godella', town: 'Godella', province: 'Valencia', ring: 1, projects: ['godella-lavado-arido-visto'], services: ['lavado'] },
  { slug: 'moncada', town: 'Moncada', province: 'Valencia', ring: 1, projects: ['moncada-impreso-espiga-117'], services: ['impreso'] },
  {
    slug: 'alzira',
    town: 'Alzira',
    province: 'Valencia',
    ring: 1,
    projects: ['alzira-impreso-adoquin-irregular-107'],
    services: ['impreso'],
  },
  { slug: 'corbera', town: 'Corbera', province: 'Valencia', ring: 1, projects: ['corbera-fratasado-arena'], services: ['fratasado'] },
]

/**
 * `content/zonas.json`'s trailing element — see `schemas/service-area.ts`'s
 * `UnconfirmedServiceAreaTowns` doc comment. Not a `ServiceArea`, never
 * merged into `serviceAreas` above, so no runtime filter is needed to keep
 * it out of `/zonas/` pages: it's simply a different export.
 */
export const unconfirmedServiceAreaTowns: UnconfirmedServiceAreaTowns = {
  comment:
    'Municipios con obra citada por el cliente pero SIN proyecto documentado todavía. No generar ruta hasta que tengan al menos un proyecto con foto: Google lo llama «doorway abuse» y es política de spam, no una penalización discrecional. https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse',
  towns: ['Torrent (Vedat)', 'Ollería', 'Carlet', 'Catadau', 'Turís', 'Alfafar', 'Benissa', 'Sollana'],
  headquartersTown: 'Sollana',
}
