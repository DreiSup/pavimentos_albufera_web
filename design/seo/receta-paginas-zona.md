# Receta: páginas de zona que posicionan sin ser doorway pages

Sesión del 2026-10-21. Orden explícita del dueño: aplicar las mejoras SEO de las páginas
`/zonas/[municipio]/`. Este documento recoge **qué se investigó, qué se decidió y por qué**, y lo
que queda en manos del dueño. Lee antes `estado-y-decisiones.md` y `analisis-gsc-2026-10.md`.

Marcas: **VERIFICADO** = comprobado (código, build, Google ES vía Nimble). **INFERIDO** = no se
pudo comprobar.

---

## 1. Lo que dice Google, en corto

**Doorway abuse** (políticas antispam de Google, «Spam policies for Google web search»): páginas
creadas para posicionar por búsquedas concretas y parecidas que llevan al usuario a páginas
intermedias menos útiles que el destino final. Entre los ejemplos que pone Google: páginas
orientadas a regiones o ciudades que embudan hacia una sola página, y **«páginas sustancialmente
similares, más cercanas a resultados de búsqueda que a una jerarquía navegable claramente
definida»**. VERIFICADO el texto vía buscador (el dominio de Google Developers no resuelve desde el
contenedor, así que la página no se leyó directamente).

**Scaled content abuse** (marzo de 2024): generar muchas páginas con el propósito principal de
manipular el ranking y no de ayudar, da igual si las escribe una persona o una IA.

Traducido a este sitio, una página de zona es **legítima** cuando:

1. Enseña algo que no está en ninguna otra página: **obra real en ese municipio**, con sus fotos,
   su técnica, su molde y su color.
2. Su texto **no es la plantilla con el nombre del pueblo cambiado**. Si se quita el nombre del
   municipio y el párrafo vale para cualquier otro, es relleno.
3. **Está enlazada** desde una jerarquía navegable (índice, obras, pie). Una página que nadie
   enlaza y que solo existe para una búsqueda es la huella típica de una doorway.
4. **No repite bloques idénticos** en todas las zonas (FAQ de plantilla, párrafo genérico).

El dueño ya decidió que las zonas **se mantienen aunque tengan una sola obra**. Es defendible
precisamente porque cumplen el punto 1: cada zona tiene una obra fotografiada que no está en otra
página. El umbral de «≥3 obras» de `arquitectura-y-estrategia.md` es una regla interna prudente, no
de Google; aquí se sustituye por «≥1 obra con foto + texto propio + enlazada».

## 2. Lo que enseña Google España (Nimble, país ES, 2026-10-21) — VERIFICADO

| Consulta | Lo que sale en el top 9 | Lectura |
|---|---|---|
| hormigón impreso denia | pavimpreso.com (Alicante, genérica), denia.com (portal local), un WordPress gratuito de 2013, Facebook de Pavivasa, directorio infoisinfo, una constructora local, otro WordPress de 2013, denia.com otra vez, generalpavimentos (página de **Elda**, programática). 6 anuncios arriba y abajo. Ficha local: Hormimpres | Ninguna página enseña obra real en Dénia con modelo y color. Rivales muy débiles |
| hormigón impreso moraira | Un post de grupo de Facebook, un jimdo, un WordPress de Novelda de 2015, **un Instagram de Pavimentos Albufera**, Impresval (página de Finestrat, programática), Pavigroup (trabajos y tag), einforma, microartjavea (zona Jávea) | Ni una página sobre Moraira. Es el hueco más claro |
| hormigon pulido ribarroja | Facebook (dos veces la misma página), galería de Pavicor, empresite, Páginas Amarillas ×2, otro Facebook, pulidoslevante (Valencia), otro Facebook | Igual: nadie tiene obra en Riba-roja publicada |

Conclusión: en «técnica + municipio pequeño» compiten **portales, redes sociales y páginas
programáticas de otros pueblos**. Una página con obra propia, fotos, modelo y color del municipio
gana con relativa facilidad *si Google la encuentra y la entiende*. Por eso lo que más mueve aquí
no es escribir más, sino **que la página esté enlazada y que su title/H1 digan la consulta**.

Las preguntas relacionadas que enseña Google (precio por m², impreso o baldosa, qué lleva el
impreso) son **genéricas, no locales**: van a la página de servicio y al blog, no a la zona.

Search Console (18-09 → 19-10): «hormigón impreso en denia» pos 6,6; «hormigón impreso en moraira»
11,7; «pavimentos de hormigón pulido en moraira» 14,3; `/zonas/denia/` 19,4; `/zonas/ribarroja/`
6,7; `/zonas/godella/` 5. Las URLs viejas `/hormigon-impreso-en-moraira/` (pos 15,4) y
`/hormigon-pulido-en-ribarroja-del-turia/` (pos 10) redirigen ya a su zona.

No se pudo ver lo que tenían las URLs viejas de zona: la Wayback Machine está bloqueada por el proxy
del contenedor (403) y el dominio propio también. INFERIDO.

## 3. Decisiones, una a una

| Palanca | Decisión | Por qué |
|---|---|---|
| **Title y H1** | `«Técnica» en «Municipio»` (`Hormigón impreso en Moraira`), derivado de los servicios de la zona | Es literalmente la consulta que trae impresiones. El genérico «Pavimentos de hormigón en X» no coincidía con ninguna |
| **Meta description** | Una por zona, escrita a mano en el dato (`ServiceArea.description`), 108–156 caracteres | Antes era la misma frase con el nombre cambiado en las ocho |
| **Texto propio** | `lead` + `body` por zona, en `packages/content/src/data/service-areas.ts` | Solo hechos: lo que enseñan las fotos, modelo, color, año si consta, la ficha de Dénia, y la comarca (verificable). Ningún m², precio, año inventado ni afirmación sobre el municipio que no se pueda comprobar |
| **FAQ** | **Retirada** de las zonas (y su `FAQPage`) | Eran las mismas tres preguntas en las ocho, ninguna local. Google dejó de mostrar el resultado enriquecido de FAQ en mayo de 2026. Un bloque idéntico en ocho URLs es justo la huella de doorway. Volverá zona a zona si el dueño da preguntas locales reales |
| **Enlazado** | Índice nuevo `/zonas/`; pie («Zonas de trabajo», en todas las rutas); obra → su zona con ancla «Hormigón impreso en Moraira →»; zona → otras zonas; `/proyectos/` → `/zonas/`; miga «Zonas» enlazada | Las zonas eran huérfanas. Whitespark 2026 pone las keywords en el ancla de enlaces internos entre los factores orgánicos locales |
| **Índice `/zonas/`** | Sí. Tarjetas por provincia solo para zonas con foto; el resto de municipios con obra, **en texto y sin enlace** | Da la «jerarquía navegable» que pide Google y dice la verdad sobre dónde más se ha trabajado sin crear páginas vacías |
| **Schema** | `Service` por zona con `areaServed` = `City` (dentro de su provincia) y `provider` → `#negocio`; `BreadcrumbList` con la miga «Zonas» enlazada | Ayuda a entender la entidad; no da resultado enriquecido. Sin `AggregateRating` |
| **Xàbia** | Sigue `noindex, follow` (sin foto); **fuera del sitemap** y fuera del índice y de los enlaces entre zonas | Un sitemap solo debe listar URLs canónicas e indexables. `pnpm verify` ahora falla si una página `noindex` vuelve al sitemap |
| **Alt de fotos** | Describen la foto, no el proyecto. Las nuevas igual | Es el atributo de imagen que Google dice que más pesa; las keywords en metadatos de imagen casi no cuentan |
| **Segunda obra de Moraira** | Añadida: sillería grande C-113, contorno de piscina, 3 fotos | Ver §4 |
| **Description de las obras** | Lleva los datos de la ficha (técnica, modelo, color, año, provincia) | Antes era «Título. Técnica ejecutado por Pavimentos Albufera.» en las diez |

### Antes → después (title · H1 · description)

Antes, en las ocho: title `Pavimentos de hormigón en {Municipio} | Pavimentos Albufera`, H1 igual
sin marca, description `Obra real de hormigón ejecutada en {Municipio}, {Provincia}. Servicios,
acabados y proyectos documentados.`

| Zona | Title nuevo (+ «\| Pavimentos Albufera») | Description nueva |
|---|---|---|
| Moraira | Hormigón impreso en Moraira | Hormigón impreso en Moraira (Teulada): un contorno de piscina en sillería grande C-113 y una rampa de acceso en adoquín pequeño color arena. Fotos reales. |
| Denia | Hormigón impreso en Denia | Hormigón impreso en Denia: piedra inglesa en gris mate y en crema en la misma vivienda, con la ficha de ejecución completa (HM-20, 10 cm, mallazo y fibra). |
| Ribarroja | Hormigón pulido en Ribarroja | Hormigón pulido en Riba-roja de Túria: solera pulida en gris en la planta cubierta de un aparcamiento, entre pilares. Fotos de la obra y presupuesto. |
| Godella | Hormigón lavado en Godella | Hormigón lavado con árido visto en Godella: el entorno de una fuente y un paseo entre césped, con superficie antideslizante de clase 3. Fotos de la obra. |
| Moncada | Hormigón impreso en Moncada | Hormigón impreso en Moncada: despiece en espiga, color C-117, ejecutado en 2025 ante un bloque de viviendas y con alcorque para el arbolado. Fotos reales. |
| Alzira | Hormigón impreso en Alzira | Hormigón impreso en Alzira: adoquín irregular color C-107, de tono rojizo, en una explanada entre pinos y un camino junto a un muro de piedra. Fotos reales. |
| Corbera | Hormigón fratasado en Corbera | Hormigón fratasado color arena en Corbera: un patio alrededor de un olivo y un paso junto a la fachada de piedra de una masía. Fotos de la obra. |
| Xàbia (noindex) | Hormigón pulido en Xàbia | Obra de hormigón pulido en Xàbia, en la Marina Alta. Todavía sin fotografía publicable de la obra terminada. |

«Pavimentos de hormigón pulido en moraira» (pos 14,3) **no se persigue**: en Moraira no hay obra
de pulido documentada, y posicionar una técnica que allí no se ha hecho sería afirmar algo falso.

## 4. Obras nuevas: qué entra y qué no

**Entra `moraira-impreso-silleria-grande-113`** («Contorno de piscina en Moraira»). Municipio, modelo
y color salen del `title` de la mediateca de WordPress, el mismo dato que desde agosto sostiene la
muestra `silleria-grande-113`, que es una de estas fotos (`INVENTARIO.md`). Sin m² ni año: no
constan. Tres fotos; una cuarta se deja fuera porque sale un operario. El acabado `silleria-grande-113`
queda vinculado a la obra, así que cuenta como «con obra documentada» y sale en `/zonas/moraira/`.

**Dénia +2 fotos** de la misma casa (ya en la mediateca con «denia» en el nombre).

**No entran, y por qué** (detalle en `apps/web/public/obras/INVENTARIO.md`, 2026-10-21):

- **Catadau** (piedra rodena 107) y **Carlet** (piedra sillería gris): hay fotos identificadas, pero
  todas son verticales de 1536 px. La primera foto de una obra se sirve a sangre y el build exige
  1600 px. Hace falta **una foto horizontal de ≥1600 px** de cada una. Con ella, cada una abre su
  obra y su zona nueva (Ribera Alta) con la misma receta.
- **Turís, Alfafar, Ollería, Vedat de Torrent**: el manifiesto con los `title` de la mediateca está
  fuera de git, así que **no se sabe qué archivo es de qué obra**. Hay candidatas a ojo, sin
  confirmar. Asignarlas por parecido sería inventar el municipio.
- **Una posible tercera obra en Moraira** (`hormigon-impreso-moraira-chale-piscina*.jpeg`): el
  municipio está en el nombre del archivo, pero no el modelo ni el color, y son de 900 px.

Todas siguen nombradas en texto, sin enlace, en «También hemos trabajado en…» de `/zonas/`.

## 5. Privacidad: GPS

`hormigon-impreso-denia-chalet.jpg` y `microcemento-4.jpg` eran las dos únicas fotos con
coordenadas (escaneadas las 123 JPEG). Se han quitado los segmentos EXIF y XMP **sin recomprimir**
(perfil de color y datos de imagen intactos). Geoetiquetar fotos no aporta SEO (Mueller; test de
Sterling Sky) y sí expone la casa del cliente.

## 6. Para las páginas de servicio (NO tocado: lo reescribe otro agente)

Propuesta concreta para `PaginaServicio.tsx` / `packages/content/src/data/services.ts`:

- Una sección **«Dónde lo hemos hecho»** al final de las obras del servicio, con un enlace por zona
  indexable que tenga ese servicio: `zonasIndexables.filter(z => z.servicios.includes(id))`, ancla
  `serviciosDeZona(z) + ' en ' + z.municipio` (las dos ya existen en `apps/web/src/lib/datos.ts`).
  - `/hormigon-impreso/` → Moraira, Denia, Moncada, Alzira.
  - `/hormigon-pulido/` → Ribarroja.
  - `/hormigon-lavado/` → Godella.
  - `/hormigon-fratasado/` → Corbera.
  - `/microcemento/`, `/hormigon-desactivado/` → ninguna (no hay obra documentada).
- Más un `EnlaceEtiqueta` «Todas las zonas →» a `/zonas/`.
- **No** meter en la página de servicio una lista de municipios sin obra: eso es keyword stuffing.

Es el enlace de más valor que falta: la página de servicio es la de más autoridad del silo, y hoy
no enlaza a ninguna zona.

## 7. Lo que tiene que aportar el dueño

1. **Confirmar la obra de Moraira C-113**: municipio, modelo, color (salen de su web antigua), y si
   puede, año y m².
2. **Una foto horizontal ≥1600 px** de Catadau y de Carlet → dos obras y dos zonas nuevas.
3. **Qué fotos son de Turís, Alfafar, Ollería y Vedat de Torrent** (o el manifiesto
   `fotos-origen/manifiesto.json`, que está fuera de git).
4. **Moraira, chalé con piscina** (`hormigon-impreso-moraira-chale-piscina*`): ¿es obra suya?,
   ¿qué modelo y color?
5. **Dénia**: cuál de las fotos es el acabado gris mate y cuál el crema (la de la raíz, llamada
   «gris», se ve cálida).
6. **Moncada**: el título dice «Entrada y porche», pero las fotos enseñan una plaza con calzada y
   acera ante un bloque de viviendas. ¿Cuál es?
7. **Xàbia**: una foto, aunque sea una, para quitar el `noindex`.
8. **Preguntas que de verdad hacen los clientes de cada zona** (p. ej. de Moraira: segunda
   residencia, plazos estando fuera), si quiere FAQ local. Sin eso, no hay FAQ.
9. Datos de cualquier obra futura: municipio, m², año, modelo, color, fotos horizontales ≥1600 px
   sin personas ni matrículas, y consentimiento del propietario.

## 8. Cómo añadir una zona nueva (la receta)

1. Que exista **al menos una obra con foto** en el municipio (`packages/content/src/data/projects.ts`),
   con la primera foto horizontal y ≥1600 px.
2. Añadir la zona en `service-areas.ts` con `region`, `description` (≤160), `lead` y `body`
   **escritos desde esa obra**. Prueba de fuego: si quitas el nombre del pueblo y el párrafo sirve
   para otra zona, reescríbelo.
3. Quitar el municipio de `unconfirmedServiceAreaTowns.towns`.
4. Nada más: el índice, el sitemap, los enlaces entre zonas y el enlace desde la obra salen solos.
5. Gates: `content:validate → lint → typecheck → build → verify`. `verify` fallará con
   `metadata:missing-og-url` en la ruta nueva: hay que añadirla a `scripts/verify/known-issues.json`
   (es el hueco de `og:url` de todo el sitio, ver `scripts/verify/README.md`).
6. En Search Console: Inspección de URL → Solicitar indexación de la zona y de `/zonas/`.
