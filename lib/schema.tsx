import { nap, sitio } from './config'
import type { ServicioId } from './tipos'

/**
 * Ancla del grafo. `app/layout.tsx` emite `schemaNegocioLocal()` en las 45
 * rutas, así que este `@id` está siempre resuelto y el resto de bloques puede
 * referenciarlo en lugar de repetir el nombre del negocio. Sin él, cada isla
 * de JSON-LD era una empresa distinta para quien lo lee.
 *
 * `sitio.url` no lleva barra final y el sitio sí (`trailingSlash: true`), así
 * que la barra va escrita aquí: el nodo cuelga de la home.
 */
export const ID_NEGOCIO = `${sitio.url}/#negocio`

/**
 * Perfiles oficiales del negocio para `sameAs`. Vacío a propósito: la URL del
 * Perfil de Empresa de Google es dato del dueño y entra por la tarea 2.9 de
 * `design/06-plan-rendimiento-y-medicion.md`. Mientras esté vacío, `sameAs` no
 * se emite; un perfil inventado es peor que ninguno.
 */
const perfiles: string[] = []

export function schemaNegocioLocal() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': ID_NEGOCIO,
    name: nap.nombre,
    url: sitio.url,
    email: nap.email,
    ...(nap.telefonoHref ? { telephone: nap.telefonoHref.replace('tel:', '') } : {}),
    ...(perfiles.length > 0 ? { sameAs: perfiles } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: nap.direccion ?? undefined,
      addressLocality: nap.municipio,
      postalCode: nap.codigoPostal,
      addressRegion: nap.provincia,
      addressCountry: nap.pais,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Valencia' },
      { '@type': 'AdministrativeArea', name: 'Castellón' },
      { '@type': 'AdministrativeArea', name: 'Alicante' },
    ],
  }
}

export function schemaServicio(servicio: ServicioId, nombre: string, ruta: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${sitio.url}${ruta}#servicio`,
    serviceType: nombre,
    // Referencia al nodo del layout, no una copia. Antes esto era un
    // `HomeAndConstructionBusiness` inline con solo el nombre: un segundo
    // negocio, sin dirección ni teléfono, compitiendo con el de verdad.
    provider: { '@id': ID_NEGOCIO },
    areaServed: ['Valencia', 'Castellón', 'Alicante'],
    url: `${sitio.url}${ruta}`,
  }
}

export function schemaFAQ(preguntas: { pregunta: string; respuesta: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    // Quién responde. Es el único enlace honesto de un `FAQPage` al negocio:
    // `publisher` es propiedad de `CreativeWork` y el nodo del layout es una
    // `Organization`. No lleva `@id` propio porque la función no recibe la
    // ruta de la página y no hay de dónde derivarla.
    publisher: { '@id': ID_NEGOCIO },
    mainEntity: preguntas.map((p) => ({
      '@type': 'Question',
      name: p.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: p.respuesta },
    })),
  }
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
 * `BreadcrumbList`. Antes había aquí un parámetro `ruta` opcional que ningún
 * punto de llamada pasaba: era código muerto que invitaba a creer que ya
 * funcionaba. Si algún día una pantalla necesita el `@id`, que lo emita quien
 * conozca su propia URL.
 */
export function schemaMigas(items: { nombre: string; ruta?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.nombre,
      ...(item.ruta ? { item: `${sitio.url}${item.ruta}` } : {}),
    })),
  }
}

export function JsonLd({ data }: { data: object }) {
  return (
    // eslint-disable-next-line react/no-danger
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
