import { nap, sitio } from './config'
import type { ServicioId } from './tipos'

export function schemaNegocioLocal() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: nap.nombre,
    url: sitio.url,
    email: nap.email,
    ...(nap.telefonoHref ? { telephone: nap.telefonoHref.replace('tel:', '') } : {}),
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
    serviceType: nombre,
    provider: { '@type': 'HomeAndConstructionBusiness', name: nap.nombre },
    areaServed: ['Valencia', 'Castellón', 'Alicante'],
    url: `${sitio.url}${ruta}`,
  }
}

export function schemaFAQ(preguntas: { pregunta: string; respuesta: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: preguntas.map((p) => ({
      '@type': 'Question',
      name: p.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: p.respuesta },
    })),
  }
}

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
