# @site/seo

Constructores de JSON-LD, sitemap/robots y canonical/alternates. No React,
no Next — todo toma datos ya resueltos y devuelve objetos/strings planos.
Solo reexports nombrados explícitos (`index.ts`), sin `export * from`,
igual que el barrel de `@site/content`.

## Layout

```
src/
  json-ld/
    business.ts     Nodo local-business, @id estable (#negocio) — businessJsonLdId, buildLocalBusinessJsonLd
    service.ts       Nodo Service — buildServiceJsonLd
    faq.ts           Nodo FAQPage — buildFaqJsonLd
    breadcrumbs.ts   Nodo BreadcrumbList — buildBreadcrumbsJsonLd
  sitemap.ts         buildSitemapEntries
  robots.ts          buildRobots
  routes.ts          DEFAULT_ROUTES / RoutePrefixes — prefijos de ruta públicos, con override opcional
  canonical.ts       buildCanonical / buildAlternates (sin enganchar, para un futuro con locales)
  index.ts           reexports nombrados explícitos, nada de `export * from`
```

Enganchado a `apps/web` vía el adaptador legacy `apps/web/src/lib/schema.tsx`
y `apps/web/src/app/{sitemap,robots}.ts`.

## Adaptado de Pavivasa, no copiado

Este paquete sigue la forma de `pavivasa/packages/seo`, pero la salida real
de cada builder es la de este sitio, confirmada leyendo el `schemaNegocioLocal()`
pre-migración en su totalidad — no un port byte a byte:

- **`business.ts` tiene `logo`** (Pavivasa no lo tiene en su nodo), incluye
  `telephone` solo cuando hay un `tel:` configurado, `sameAs` solo si hay al
  menos un perfil, y `areaServed` en la forma
  `{'@type': 'AdministrativeArea', name}` — la que este sitio ya emitía
  antes de migrar.
- **`service.ts` no lleva `description`**: el sitio pre-migración nunca la
  mandaba, y esta fase reproduce esa salida sin corregirla — ver
  `packages/seo/src/json-ld/service.ts`'s cabecera. `areaServed` aquí sale
  como cadenas de provincia planas, no como el objeto `AdministrativeArea`
  de `business.ts` — mismo campo, dos formas, en dos nodos distintos del
  mismo sitio (ver "Reportado, no corregido" abajo).
- **`faq.ts` lleva `publisher`** (`{'@id': businessId}`), un añadido de
  este sitio frente al `FAQPage` de Pavivasa.
- **`breadcrumbs.ts` NO filtra los tramos intermedios sin `route`** —al
  revés que Pavivasa—: `apps/web/src/components/layout/Migas.tsx` depende
  de eso a propósito (`/zonas/[municipio]/` pasa un primer tramo sin href,
  y tiene que conservar `position: 1`).
- **`robots.ts` emite una única agrupación `User-agent: *`** con su propio
  `disallow` (`/author/`, ver `apps/web/src/app/robots.ts`) — Pavivasa
  además da a cada rastreador de IA (GPTBot, ClaudeBot…) su propia
  agrupación nombrada; este sitio no la tiene (D10 de la migración: fase
  mecánica, sin ese añadido).

## `routes.ts` — prefijos de ruta configurables (D28b)

`buildSitemapEntries` toma los prefijos de las 4 colecciones dinámicas
(acabados, proyectos, zonas, artículos) por un campo `routes` opcional y
cae a `DEFAULT_ROUTES` cuando no se pasa —
`apps/web/src/app/sitemap.ts` no lo pasa, así que sigue construyendo
exactamente las mismas URLs que antes de este cambio. Un caller distinto
pasa su propio `routes` en vez de bifurcar el builder. Nótese que `zonas`
no tiene página índice (`/zonas/` no existe, solo `/zonas/[municipio]/`);
`DEFAULT_ROUTES.serviceAreas` (`/zonas/`) es solo el prefijo para componer
cada URL de detalle, `buildSitemapEntries` no genera una entrada para el
propio prefijo.

## Reportado, no corregido (D27/D10)

La migración reproduce el comportamiento previo byte a byte; estas
divergencias de SEO ya existían antes de migrar y se documentan aquí para
que no se confundan con una regresión de esta fase — no se arreglan en esta
migración:

- `Service` sin `description`.
- `areaServed` en dos formas distintas según el nodo (`Service` vs. el
  negocio).
- `BreadcrumbList` sin filtrar tramos intermedios sin ruta.
- `FAQPage` con `publisher` (esto es un añadido respecto a Pavivasa, no un
  defecto, pero tampoco estaba especificado).

## `html` — nota de identidad byte a byte

El orden de claves de cada builder de JSON-LD importa: el toolkit de
comparación de esta migración diferencia el `<script
type="application/ld+json">` crudo byte a byte, no un resumen con claves
ordenadas. Mantener el orden de inserción de claves de cada builder tal
cual está escrito (p. ej. `item` después de `name` en breadcrumbs,
`telephone` derivado con `.replace('tel:', '')`) — no "ordenar" nada.
