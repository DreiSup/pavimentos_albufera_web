/**
 * legacy adapter, delete when a new design consumes @site/* directly
 *
 * Same Spanish function names and same JSON-LD shapes/values as before this
 * migration, now built via `@site/seo`'s builders from `./config` facts.
 * `@site/seo` has no React/Next in it (§3 of `arquitectura-plantilla-
 * monorepo.md`), so the `JsonLd` React component stays here — it's the one
 * bit of actual React in this module.
 *
 * `@site/seo`'s builders are per-repo, not a byte-for-byte port of
 * Pavivasa's own package — this site's live output differs from Pavivasa's
 * shape in several places (see each builder's own comment), and this
 * migration reproduces THAT output, not Pavivasa's:
 *   - `schemaServicio` has no `description` key at all. The old call passed
 *     the service *name* under an argument literally called `nombre` — a
 *     pre-existing gap (no real `description` ever shipped), not fixed here.
 *   - `schemaServicio`'s `areaServed` is plain province-name strings, not
 *     `AdministrativeArea` nodes like the business node below.
 *   - `schemaFAQ` always carries `publisher` and never filters/returns null.
 *   - `schemaMigas` never drops an intermediate item with no route (unlike
 *     Pavivasa's builder) — `zonas/[municipio]/page.tsx` relies on that.
 */
import {
  businessJsonLdId,
  buildLocalBusinessJsonLd,
  buildServiceJsonLd,
  buildFaqJsonLd,
  buildBreadcrumbsJsonLd,
} from '@site/seo'
import { nap, sitio } from './config'
import type { ServicioId } from './tipos'

/**
 * Ancla del grafo. `app/layout.tsx` emite `schemaNegocioLocal()` en las 52
 * rutas, así que este `@id` está siempre resuelto y el resto de bloques puede
 * referenciarlo en lugar de repetir el nombre del negocio. Sin él, cada isla
 * de JSON-LD era una empresa distinta para quien lo lee.
 */
export const ID_NEGOCIO = businessJsonLdId(sitio.url)

/**
 * Perfiles oficiales del negocio para `sameAs`. Vacío a propósito: la URL del
 * Perfil de Empresa de Google es dato del dueño y aún no ha llegado. Mientras
 * esté vacío, `sameAs` no se emite; un perfil inventado es peor que ninguno.
 */
const perfiles: string[] = []

/**
 * El bloque completo del logotipo —senda, wordmark y claim—, que es el único
 * archivo donde el claim se lee: aquí no lo escala ninguna caja de la interfaz.
 *
 * Va escrito como cadena literal a propósito, y no interpolado dentro de la
 * plantilla de abajo: el `PATRON` de `scripts/verificar-imagenes.mjs` busca
 * `'/marca/…'` entre comillas, así que así el archivo entra en el verificador y
 * el build falla si alguien lo mueve o lo borra. Dentro de un `${}` no lo vería.
 */
const RUTA_LOGO = '/marca/logo.png'

/** Provincias publicadas en `areaServed`: literal, no derivado de proyectos. Ver DECISIONS.md D10. */
const PROVINCIAS_SERVIDAS = ['Valencia', 'Castellón', 'Alicante']

export function schemaNegocioLocal() {
  return buildLocalBusinessJsonLd({
    siteUrl: sitio.url,
    name: nap.nombre,
    logo: `${sitio.url}${RUTA_LOGO}`,
    email: nap.email,
    phoneHref: nap.telefonoHref,
    address: {
      streetAddress: nap.direccion,
      town: nap.municipio,
      postalCode: nap.codigoPostal,
      province: nap.provincia,
      country: nap.pais,
    },
    areaServed: PROVINCIAS_SERVIDAS,
    sameAs: perfiles,
  })
}

export function schemaServicio(servicio: ServicioId, nombre: string, ruta: string) {
  return buildServiceJsonLd({
    siteUrl: sitio.url,
    route: ruta,
    name: nombre,
    // Referencia al nodo del layout, no una copia. Antes esto era un
    // `HomeAndConstructionBusiness` inline con solo el nombre: un segundo
    // negocio, sin dirección ni teléfono, compitiendo con el de verdad.
    businessId: ID_NEGOCIO,
    areaServed: PROVINCIAS_SERVIDAS,
  })
}

export function schemaFAQ(preguntas: { pregunta: string; respuesta: string }[]) {
  return buildFaqJsonLd(
    ID_NEGOCIO,
    preguntas.map((p) => ({ question: p.pregunta, answer: p.respuesta })),
  )
}

/**
 * **Sin `@id`, y es una decisión, no un olvido.** Un `BreadcrumbList` no tiene
 * ninguna arista natural hacia el negocio —colgarle un `provider` sería marcado
 * inventado—, así que lo único que podría enlazarlo al grafo es un `@id` de
 * página, y ese dato solo lo conoce quien renderiza. El único punto de uso es
 * `components/layout/Migas.tsx`, y por él pasan también las cuatro rutas
 * `/lp/`, que recomponen un `Servicio` cuya `ruta` es la **canónica**: pasarle
 * esa ruta ancla el fragmento `#migas` a una URL que no es la de la página que
 * lo sirve, que es peor que no emitirlo. Google no exige `@id` en
 * `BreadcrumbList`. Si algún día una pantalla necesita el `@id`, que lo emita
 * quien conozca su propia URL.
 */
export function schemaMigas(items: { nombre: string; ruta?: string }[]) {
  return buildBreadcrumbsJsonLd(
    sitio.url,
    items.map((item) => ({ name: item.nombre, route: item.ruta })),
  )
}

export function JsonLd({ data }: { data: object }) {
  return (
    // eslint-disable-next-line react/no-danger
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
