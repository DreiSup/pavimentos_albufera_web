# Arquitectura y estrategia SEO para Pavimentos Albufera (Next.js + shadcn/ui)

La estrategia más eficaz y 100 % legal para pavimentos-albufera.com es montar pocas páginas de servicio muy completas, cada una pensada para cubrir un grupo de búsquedas con la misma intención. Esas páginas se alimentan de obras reales documentadas con un SOP fijo. Las páginas de zona solo se crean cuando existen obras reales en ese municipio que les den contenido propio. Así se capta tráfico local sin caer en las "doorway pages" que las políticas antispam de Google sancionan.

## TL;DR

- **Rutas:** usa `/servicios/[servicio]`, `/zonas/[municipio]` (solo municipios con obras reales), `/obras/[slug]` (plano y permanente) y `/blog/[slug]`. Las combinaciones servicio+municipio (`/servicios/hormigon-impreso/sueca/`) solo se "ganan" cuando hay varias obras publicadas allí. Los filtros del portfolio no se indexan.
- **"Muchas keywords en una página":** es cierto, pero solo si esas keywords comparten intención (variantes, sinónimos, long-tail de un mismo tema). Según el estudio de Ahrefs sobre 3 millones de búsquedas, la página media en el puesto 1 también está en el top 10 para "casi 1.000" keywords relacionadas, con una mediana "de alrededor de 400". Meter intenciones distintas en una sola página, o repetir palabras clave, es keyword stuffing y perjudica.
- **Obras como motor:** cada obra se documenta con un formulario de recogida, fotos antes/durante/después desde las mismas posiciones y un consentimiento escrito del propietario. Nunca se publica una dirección exacta, ni caras, ni matrículas, ni metadatos GPS. Cada obra publicada alimenta automáticamente su servicio y su zona.

## Key Findings

1. **Doorway pages: la línea roja.** Las políticas antispam de Google definen el "doorway abuse" como crear sitios o páginas para posicionar por búsquedas específicas y parecidas, que llevan al usuario a páginas intermedias menos útiles que el destino final. Entre los ejemplos citan "crear páginas sustancialmente similares, más cercanas a resultados de búsqueda que a una jerarquía navegable claramente definida".\[1\] Cien páginas "Hormigón impreso en [pueblo]" que solo cambian el nombre del pueblo son justo eso.\[2\]
2. **Scaled content abuse (marzo 2024).** Google sanciona generar muchas páginas "con el propósito principal de manipular los rankings y no ayudar a los usuarios", da igual que las escriba una IA, un humano o una mezcla.\[3\] Generar páginas de zona en masa con plantillas de IA entra aquí.
3. **La página de servicio es la reina del SEO local orgánico.** El informe de Whitespark Local Search Ranking Factors 2026 (47 expertos, 187 factores) sitúa "Dedicated Page for Each Service" (página dedicada para cada servicio) como factor n.º 1 en resultados orgánicos locales, con 210 puntos frente a 163 en 2023. En el mismo informe destacan "Proper Site Architecture Organized Into Topic Areas" y "Keywords in Anchor Text of Internal Links", mientras que las keywords en los metadatos de imagen caen al puesto 182 de 187 para el local pack.
4. **Google Business Profile manda en el mapa.** En Whitespark 2026 las señales de GBP son el grupo con más peso estimado en el local pack/Maps.\[4\]\[5\] Si Pavimentos Albufera no atiende público en un local, Google exige ocultar la dirección y declarar un área de servicio.\[6\]\[7\] Mostrar la dirección siendo una empresa de área de servicio (SAB) figura entre los riesgos de suspensión, igual que declarar áreas que superen el límite de la Ayuda de GBP: hasta 20 áreas de servicio y "no más de unas 2 horas en coche" desde la base.
5. **Rich results: menos de lo que se vende.** Google dejó de mostrar los rich results de FAQ el 7 de mayo de 2026 ("FAQ rich results are no longer appearing in Google Search") y en junio de 2026 retiró su informe en Search Console y su soporte en la Prueba de resultados enriquecidos. Las estrellas de reseñas no aparecen en páginas propias con `LocalBusiness`/`Organization` porque se consideran "self-serving", y eso incluye los widgets de reseñas de Google o Facebook incrustados.\[8\]\[9\]\[10\] Los datos estructurados siguen siendo útiles para que Google entienda las entidades, pero no garantizan fragmentos enriquecidos.
6. **Geoetiquetar fotos no sirve para SEO.** John Mueller (Google) escribió en Reddit que "no hace falta geoetiquetar imágenes para SEO", y el test de Joy Hawkins (Sterling Sky) con 5 fichas de GBP en enero de 2024 no midió mejora alguna en varias semanas. En cambio, las coordenadas GPS en el EXIF de fotos de una vivienda son un riesgo de privacidad. Hay que eliminarlas siempre.
7. **Legal.** Para la AEPD, la imagen de una persona identificable es un dato personal, y una matrícula también lo es si permite identificar al titular.\[11\]\[12\]\[13\]\[14\] La AEPD multó con 5.000 € al despacho Roca & Asociados (PS/00526/2023, art. 6.1 RGPD) por publicar la foto de una trabajadora en su web sin un consentimiento acreditado: posar no equivale a consentir, y tener la foto en LinkedIn "no supone un consentimiento expreso". Además, la LO 1/1982 considera intromisión ilegítima revelar "datos privados de una persona o familia conocidos a través de la actividad profesional" (art. 7.4).\[15\] Publicar el interior de la casa de un cliente sin su permiso encaja ahí.

## Details

### 1. Arquitectura de URLs

**Principios** (guía de estructura de URLs de Google, actualizada en junio de 2025, y SEO Starter Guide):
- Palabras descriptivas en el idioma del público (español), separadas por guiones.\[16\]
- Agrupar páginas temáticamente similares en directorios.\[17\]
- Parámetros en formato `?clave=valor&clave2=valor`.\[16\]\[18\]
- Evitar filtros aditivos que generen combinaciones infinitas de URLs.\[19\]
- No usar fragmentos `#` para cambiar contenido.\[16\]

**Plano vs. anidado.** La mejor opción es un modelo híbrido:
- **Servicios y zonas anidados** en un directorio (`/servicios/…`, `/zonas/…`). Así se agrupan temáticamente, la miga de pan es clara y es fácil segmentar en Search Console.
- **Obras planas** (`/obras/[slug]`), sin anidar bajo servicio ni municipio. Una obra puede combinar dos servicios (por ejemplo, solera + resina) y reclasificarla no debe obligar a cambiar su URL. La URL de una obra es permanente.
- **Blog plano** (`/blog/[slug]`), sin fechas en la URL.

**Reglas para los slugs:**
- Minúsculas y guiones.
- Sin tildes ni eñes: `pavimentos-de-resina`, `polinya-de-xuquer`, `alfafar`. Google acepta UTF-8, pero lo codifica en porcentajes y las URLs quedan ilegibles al compartirlas.
- Eliminar stopwords solo cuando la frase siga siendo natural: `hormigon-impreso` sí, `pavimento-resina-epoxi` mejor que `pavimento-de-resina-de-tipo-epoxi`.
- Entre 3 y 6 palabras.
- Barra final coherente en todo el sitio, con `trailingSlash` fijado en `next.config`.\[20\]
- Nunca cambiar una URL sin una redirección 301.\[20\]

**Árbol de rutas recomendado** (App Router):

```
app/
├── page.tsx                                  → /  (home: propuesta, servicios, obras destacadas, zonas, CTA)
├── servicios/
│   ├── page.tsx                              → /servicios/  (hub)
│   └── [servicio]/
│       ├── page.tsx                          → /servicios/hormigon-impreso/
│       └── [municipio]/page.tsx              → /servicios/hormigon-impreso/sueca/  (SOLO si se cumple umbral)
├── zonas/
│   ├── page.tsx                              → /zonas/  (hub con mapa estático + lista de municipios)
│   └── [municipio]/page.tsx                  → /zonas/sueca/  (SOLO si se cumple umbral)
├── obras/
│   ├── page.tsx                              → /obras/  (portfolio; filtros sin indexar)
│   └── [slug]/page.tsx                       → /obras/hormigon-impreso-patio-sueca-120-m2/
├── blog/
│   ├── page.tsx                              → /blog/
│   └── [slug]/page.tsx                       → /blog/precio-hormigon-impreso-m2/
├── presupuesto/page.tsx                      → /presupuesto/
├── sobre-nosotros/page.tsx                   → /sobre-nosotros/  (equipo, años, maquinaria, E-E-A-T)
├── contacto/page.tsx
├── aviso-legal/ · privacidad/ · cookies/
├── sitemap.ts · robots.ts
```

**Servicios iniciales** (ajustar a lo que la empresa hace de verdad y a la demanda que muestren las herramientas de keywords): `hormigon-impreso`, `hormigon-pulido`, `pavimentos-de-resina` (epoxi/poliuretano; separarlo en dos páginas solo si la SERP lo separa), `suelos-industriales`, `microcemento`, `soleras-de-hormigon`, `hormigon-desactivado`.

**Municipios candidatos** (se activan solo cuando haya obras): Sueca, Cullera, Almussafes, Sollana, Silla, Catarroja, Alfafar, Albal, Alzira, Valencia (y dentro de ella, barrios o pedanías como El Palmar o El Saler solo si hay obras).

**Enlazado interno (hub-and-spoke por silos temáticos):**
- **Home** → hubs `/servicios/`, `/obras/`, `/zonas/` y las 3–6 obras más recientes.
- **Servicio** → sus obras (grid de las 6 últimas, filtradas por servicio), las zonas donde hay obras de ese servicio, 2–4 artículos del blog del mismo cluster y el CTA.
- **Obra** → su servicio o servicios (enlace con anchor descriptivo: "hormigón impreso"), su municipio (`/zonas/sueca/`), 2–3 obras similares y el artículo del blog relacionado.
- **Zona** → las obras de ese municipio y los servicios realizados allí.
- **Blog** → el servicio del que trata, en el cuerpo con anchor natural (no "haz clic aquí"), y 1–2 obras que ilustren el tema.
- Una página que no está enlazada desde ninguna otra (huérfana) es una señal típica de doorway.\[2\]\[21\] Toda página indexable debe estar en la navegación o en un hub.

**Migas de pan:** visibles en todas las páginas salvo la home, con `BreadcrumbList`. Para obras, la ruta lógica es `Inicio › Obras › [Servicio principal] › [Título obra]` aunque la URL sea plana.

**Portfolio: paginación y filtros sin contenido duplicado ni páginas pobres indexables:**
- **Paginación:** `/obras/?pagina=2` (o `/obras/pagina/2/`). Cada página con URL única, canonical a sí misma, indexable y con enlaces `<a href>` rastreables.\[22\] No hay que canonicalizar todas a la página 1.
- **Filtros** (servicio, material, municipio): la opción recomendada es filtrar en cliente sin crear URL nueva, o con parámetros `?servicio=resina&zona=sueca` marcados con `noindex, follow` y fuera del sitemap.\[23\]
- La versión "indexable" de cada filtro ya existe como página real (`/servicios/pavimentos-de-resina/`, `/zonas/sueca/`), que es la que debe posicionar.
- No bloquear los parámetros en `robots.txt` si llevan `noindex`: Google no leería la etiqueta. Tampoco combinar `noindex` y `canonical` apuntando a sitios distintos en la misma URL.\[24\]\[25\]
- El sitemap solo debe incluir URLs canónicas e indexables.\[26\]

### 2. Páginas de zona: captar clientes en un municipio sin crear doorways

**Qué hace legítima una página de zona:** que ofrezca algo que no está en ninguna otra página del sitio:
- Obras reales en ese municipio (fotos, m², material, problema resuelto).
- Testimonios de clientes de allí.
- Particularidades locales verificables: suelos arcillosos o nivel freático alto cerca de l'Albufera y de los arrozales, humedad y salinidad en la costa de Cullera y El Perelló, polígonos industriales concretos (Almussafes, Sollana).
- Qué trámites suele pedir el ayuntamiento para obras en exterior (verificarlo y enlazar la fuente municipal).
- Tiempos de desplazamiento reales.

**Umbral mínimo** (regla interna prudente, no un número oficial de Google):

| Tipo de página | Se indexa cuando… |
|---|---|
| `/zonas/[municipio]` | ≥3 obras publicadas en el municipio **y** ≥250–300 palabras de texto único específico (no plantilla) **y** idealmente 1 testimonio |
| `/servicios/[servicio]/[municipio]` | ≥3 obras de ese servicio en ese municipio **y** hay demanda de búsqueda real para "servicio + municipio" (Search Console / Keyword Planner) |
| Por debajo del umbral | No se genera la página. El municipio aparece como texto en el hub `/zonas/` ("También trabajamos en…") y en la ficha de GBP |

**Cuándo NO crear una página de zona:**
- No hay obras allí.
- El texto solo se diferencia en el nombre del pueblo.\[2\]
- El municipio no tiene demanda propia (la búsqueda la cubre la ciudad cercana).
- El municipio queda fuera del área real de servicio.
- Se va a generar en lote con IA.

**Alimentación automática desde las obras** (Next.js):
- `generateStaticParams()` de `/zonas/[municipio]` solo devuelve los municipios con `obras.filter(o => o.municipio === m).length >= 3`.
- Si un municipio baja del umbral (por ejemplo, porque un cliente retira su consentimiento y se despublica su obra), la página debe devolver 404/410 o redirigir con 301 a `/zonas/`. No hay que dejarla con `noindex` y vacía.
- Los bloques "Obras en Sueca", "Servicios realizados en Sueca", "m² ejecutados", "última obra: [fecha]" y los testimonios se construyen a partir de los datos de las obras.
- El texto introductorio único de cada zona lo escribe una persona (tú, con datos que te pase la empresa) y se guarda en `zonas/[municipio].mdx`.

**Google Business Profile (empresa de área de servicio):**
- Ocultar la dirección si no se recibe a clientes en ella. Si hay nave u oficina con horario de atención al público, mostrarla (perfil híbrido).\[6\]
- Área de servicio: municipios reales (hasta 20 áreas según la Ayuda de GBP), sin superar unas 2 horas en coche desde la base.
- Categoría principal precisa (la más cercana a "contratista de pavimentos / hormigón"; compruébalo en el selector de GBP) y secundarias reales.
- Servicios predefinidos y personalizados con los mismos nombres que las páginas `/servicios/`.
- Fotos reales de cada obra (las mismas del SOP, ya limpias), subidas de forma regular.
- Pedir reseñas tras cada obra, con enlace directo, y responderlas todas.
- El enlace web de GBP va a la home o a `/servicios/`. El nombre del negocio, sin keywords añadidas.

**NAP y citaciones en España:**
- Mismo nombre, teléfono, web y (si se muestra) dirección, carácter por carácter, en: GBP, Bing Places, Apple Business Connect, Páginas Amarillas, QDQ, Cylex, Hotfrog, Habitissimo, Houzz, Facebook e Instagram, Cámara de Comercio de Valencia y asociaciones del sector.\[27\]\[28\]
- Llevar una hoja de control con la URL de cada ficha y la fecha de alta.\[29\]
- Enlaces locales de calidad (prensa comarcal, patrocinio de un club local, proveedores de material que publican referencias). Valen más que 50 directorios de baja calidad.\[5\]\[30\]

### 3. "Indexar muchas keywords en una sola página": qué es verdad y qué no

**Lo que es verdad (a): una página, un tema, muchas consultas.**
- El estudio de Ahrefs sobre 3 millones de búsquedas encontró que la página media en el puesto 1 también está en el top 10 para "casi 1.000" keywords relacionadas, con una mediana "más de dos veces menor, de alrededor de 400".
- Posicionar a la vez para 2–3 keywords de más de 1.000 búsquedas mensuales es habitual. Hacerlo para más de una de más de 10.000 es muy raro.\[31\]\[32\]
- Además, esas keywords casi nunca son "únicas": se solapan entre sí.\[31\]

Para la empresa, eso significa que una buena página `/servicios/hormigon-impreso/` puede posicionar para "hormigón impreso", "suelo de hormigón impreso", "pavimento impreso", "hormigón impreso precio m2", "hormigón impreso para patio", "hormigón impreso Valencia", "hormigón estampado"… siempre que responda de verdad a todas esas variantes.

**Lo que es falso o dañino (b):**
- **Keyword stuffing:** repetir términos o listas de pueblos en el texto, el pie de página o el alt. Google lo trata como spam, y en Whitespark 2026 el relleno de keywords en GBP aparece como factor negativo y de riesgo de suspensión.\[33\]
- **Mezclar intenciones distintas en una URL:** "hormigón impreso", "suelo industrial epoxi" y "microcemento en baños" en la misma página. Son públicos, SERPs y decisiones de compra distintos. La página no será la mejor respuesta para ninguno.\[34\]

**Cómo decidir si agrupar o separar (clustering por SERP):**
1. Saca la lista de keywords (Search Console, Keyword Planner, Ahrefs/Semrush, autocompletado).\[35\]
2. Para cada par de keywords, compara el top 10 en Google.es (en modo incógnito y con ubicación Valencia).\[36\]
3. **Si comparten 4 o más URLs del top 10 → misma página.** Con 0–2 → páginas distintas. Entre 3 y 4, decide según la intención (informativa vs. comercial).\[35\]
4. **Intención informativa** ("cuánto tarda en secar el hormigón impreso", "epoxi vs poliuretano") → blog. **Comercial/local** ("empresa hormigón impreso Sueca", "presupuesto suelo industrial") → servicio o zona.
5. Mapa final: cada cluster = exactamente una URL.\[36\] Anótalo en una hoja (keyword principal, secundarias, URL, intención).

**Canibalización.** Ocurre cuando dos URLs propias compiten por la misma intención y se alternan en la SERP.\[37\]\[38\] Se detecta en Search Console (Rendimiento → consulta → pestaña Páginas).\[39\]
- Si las dos páginas tienen la misma intención, se fusionan en la más fuerte con 301.\[37\]
- Si las intenciones son distintas, se diferencian (título, enfoque, enlazado interno).\[40\]\[41\]
- Ahrefs documentó que sus estudios de caso canibalizaban la consulta "seo case study" hasta que los consolidó en una sola página, que posicionó mejor que todas por separado.\[42\]

**Riesgo concreto de canibalización en este sitio:** las obras tituladas "Hormigón impreso en Sueca" pueden competir con `/zonas/sueca/` y con `/servicios/hormigon-impreso/`. Para evitarlo:
- La obra se enfoca en el caso concreto (título con m², tipo de espacio y año).
- La zona y el servicio se enfocan en la oferta general.
- La obra enlaza hacia ambas con anchors claros.

### 4. Plantillas de página

**Fórmulas comunes:**
- Title de unos 50–60 caracteres, con la keyword principal al inicio y la marca al final.
- Meta description de unos 140–155 caracteres, con beneficio + prueba + CTA. Google puede reescribirla.
- Un solo H1.
- No hay un número mínimo de palabras en Google: la extensión la marca lo que hace falta para responder a la intención mejor que la competencia de la SERP.

#### (a) Página de servicio `/servicios/[servicio]/`

- **Title:** `Hormigón impreso en Valencia y la Ribera | Pavimentos Albufera`
- **Meta:** `Hormigón impreso para patios, accesos y piscinas en Valencia y l'Albufera. +[N] obras reales con fotos antes/después. Presupuesto sin compromiso.`
- **Estructura:**
  1. **H1** "Hormigón impreso en Valencia y la Ribera Baixa" + subtítulo con la propuesta de valor + CTA (WhatsApp / llamar / formulario) above the fold + foto real (LCP con `priority`).
  2. Bloque de confianza: años de experiencia, m² ejecutados, zona que cubrimos, garantía.
  3. **H2** ¿Qué es y cuándo conviene? (H3: ventajas / limitaciones, con honestidad).
  4. **H2** Acabados, colores y moldes (galería propia).
  5. **H2** Proceso paso a paso (H3 por fase: preparación y solera, mallazo, vertido, impresión, sellado).
  6. **H2** Precio orientativo por m² y de qué depende (rango y factores; alta demanda y muy alta conversión).
  7. **H2** Obras realizadas (grid automático de obras de este servicio + enlace al portfolio filtrado).
  8. **H2** Zonas donde trabajamos (municipios con obra enlazados; el resto como texto).
  9. **H2** Mantenimiento y garantía.
  10. **H2** Preguntas frecuentes (visibles; `FAQPage` opcional, sin rich result).
  11. CTA final + formulario corto (nombre, teléfono, municipio, m² aproximados, fotos opcionales, casilla de privacidad).
- **Extensión orientativa:** 900–1.600 palabras + galería.
- **E-E-A-T:** fotos propias (nunca de banco), nombre del responsable técnico con cargo y años de oficio, marcas de material que se usan, fichas técnicas enlazadas, seguro de responsabilidad civil, fecha de "última revisión".

#### (b) Artículo de blog `/blog/[slug]/`

- **Title:** `¿Cuánto cuesta el hormigón impreso por m² en 2026? | Pavimentos Albufera`
- **Estructura:**
  1. **H1** = pregunta o tema.
  2. Respuesta directa en las 2–3 primeras frases (útil para fragmentos destacados y resúmenes de IA).
  3. Autor con foto y bio (persona real del oficio), fecha de publicación y de actualización.
  4. Índice.
  5. **H2** por subpregunta del cluster (H3 para detalles).
  6. Datos propios (rangos de precios de obras reales, fotos de casos, errores vistos en obra).
  7. Bloque "Casos reales" enlazando 1–2 obras.
  8. CTA contextual hacia el servicio.
  9. Artículos relacionados del mismo cluster.
- **Extensión:** la que pida la intención (600–2.000 palabras). Un artículo por cluster informativo, no uno por variante de keyword.
- **Temas prioritarios:** precios por m² de cada servicio, comparativas (impreso vs. desactivado vs. baldosa; epoxi vs. poliuretano), problemas (grietas, humedad por capilaridad en zonas de arrozal, desgaste en naves), mantenimiento, plazos, requisitos de licencia de obra menor.

#### (c) Página de obra `/obras/[slug]/`

- **Title:** `[Servicio] en [Municipio]: [tipo de espacio] de [m²] m² | Pavimentos Albufera`. Ejemplo: `Hormigón impreso en Sueca: patio de 120 m² | Pavimentos Albufera`.
- **Slug:** `hormigon-impreso-patio-sueca-120-m2`. Si se repite, añadir el año: `-2026`.
- **Meta:** `Patio de 120 m² en Sueca con hormigón impreso color arena y molde piedra. Antes, durante y después de la obra, materiales y plazos.`
- **Estructura:**
  1. **H1** con el título de la obra + foto final destacada.
  2. **Ficha técnica** (tabla): municipio (y barrio o zona genérica), tipo de cliente (particular / comunidad / nave), servicio(s), material y marca, m², espesor, duración, mes y año.
  3. **H2** El reto: qué quería el cliente y qué problema había (humedad, grietas, pendiente, tráfico de carretillas…).
  4. **H2** Qué hicimos: proceso con fotos "durante" y decisiones técnicas justificadas.
  5. **H2** Antes y después: comparativa con slider por cada posición de cámara (P1, P2…).
  6. **H2** Resultado y recomendaciones de mantenimiento.
  7. **Testimonio** (con consentimiento; nombre de pila + municipio o iniciales).
  8. CTA: "¿Tienes un proyecto parecido en [municipio]?" + WhatsApp.
  9. Enlaces al servicio, a la zona y a 3 obras similares.
- **Extensión:** 300–700 palabras únicas + galería de 8–20 fotos.

**Texto único por obra:** escribirlo siempre a partir de los datos del formulario (reto, decisiones, incidencias, cifras), nunca con una plantilla de relleno. Dos obras del mismo servicio se distinguen por su problema, su contexto y sus decisiones. Si una obra no tiene nada distintivo (sin fotos antes/después ni reto), mejor mostrarla solo como tarjeta dentro de la galería del servicio, sin página propia indexable.

**CTAs para conversión (las tres plantillas):**
- Botón WhatsApp flotante en móvil con mensaje prellenado (`wa.me/34XXXXXXXXX?text=Hola,%20vengo%20de%20la%20obra%20de%20Sueca…`), un `tel:` clicable y un formulario corto.
- Medir cada clic como evento (con consentimiento de analítica o con una herramienta de medición exenta según la AEPD).\[43\]\[44\]
- Pedir "municipio" y "m² aproximados" en el formulario ayuda a calificar el lead.

**Imágenes:**
- **Nombres de archivo** descriptivos: `hormigon-impreso-patio-sueca-despues-p1.webp`. Google dice que el nombre da "pistas muy ligeras".\[45\]
- **Alt text:** es el atributo más importante según Google. Hay que describir lo que se ve, en contexto y sin rellenar,\[45\] por ejemplo: `Patio de hormigón impreso color arena con molde de piedra tras el sellado, vista desde la puerta de la cocina`.
- **Formatos:** AVIF/WebP vía `next/image` (`formats: ['image/avif','image/webp']` en `next.config`), con `sizes` correctos.
- **Carga:** `priority` solo en la imagen LCP; el resto con lazy loading, que viene por defecto.
- **Dimensiones:** width/height fijos para evitar CLS.
- **Sliders:** las fotos del slider deben ser `<img>` reales en el HTML (no fondos CSS) para que Google las indexe.
- **Sitemap de imágenes** opcional.
- **EXIF:** eliminar todos los metadatos al procesar las fotos, sobre todo el GPS. Mantener, si se quiere, los campos IPTC de autor y copyright (Google los puede mostrar en Google Imágenes).\[46\]

**Datos estructurados (JSON-LD):**

| Página | Tipos | Notas |
|---|---|---|
| Global (layout/home) | `HomeAndConstructionBusiness` (o array `["HomeAndConstructionBusiness","GeneralContractor"]`) con `@id` fijo, `name`, `url`, `telephone`, `logo`, `image`, `areaServed` (lista de `City`), `sameAs` (GBP, redes), `address` coherente con GBP (si la dirección está oculta: solo localidad, provincia y CP) | Google pide el subtipo más específico posible y, si hay varios, en array (`additionalType` no está soportado).\[47\] **No incluir `aggregateRating`/`review` propios.**\[8\] |
| Servicio | `Service` (`serviceType`, `provider` → `@id` del negocio, `areaServed`) + `BreadcrumbList` | No genera rich result; ayuda a entender las entidades |
| Obra | `CreativeWork` (o `WebPage` con `about` → `Service`) con `locationCreated` (`Place` → municipio), `dateCreated`, `image` (array de `ImageObject` con `creator`, `copyrightNotice`, `license`, `acquireLicensePage` si se quiere el distintivo de licencia en Imágenes) + `BreadcrumbList` | `ImageGallery` es válido en schema.org, pero Google no le da ningún trato especial |
| Blog | `BlogPosting` con `author` (`Person` con `url` a su bio), `datePublished`, `dateModified`, `image` + `BreadcrumbList` | |
| FAQ | `FAQPage` opcional | Rich result retirado desde el 7 de mayo de 2026; mantener las FAQ por el usuario |

**Implementación en Next.js (App Router):**
- **Contenido:** para una sola persona que publica, MDX en el repositorio (`content/obras/*.mdx` con frontmatter validado con Zod) es lo más simple y rápido. Si el cliente va a publicar solo, conviene un CMS headless con modelo tipado (Sanity, Payload o Keystatic). Keystatic/Payload permiten guardar las imágenes en el propio stack.
- **Modelo de datos de obra:** `slug, titulo, fecha, municipio, zonaGenerica, tipoCliente, servicios[], material, marca, m2, espesor, duracionDias, reto, solucion, resultado, testimonio{texto,firma,consentimiento}, consentimientoId, fotos[{fase:'antes'|'durante'|'despues', posicion:'P1'…, fecha, alt, src}], publicado`.
- **Generación estática:** `generateStaticParams` en `[servicio]`, `[municipio]` y `[slug]`, con `dynamicParams = false` para que las rutas no previstas devuelvan 404. Regenerar al publicar (rebuild o `revalidateTag`).
- **Metadatos:** `generateMetadata` por ruta (title, description, `alternates.canonical`, `openGraph.images`), con `metadataBase` en el layout raíz y `title.template: '%s | Pavimentos Albufera'`. Solo funciona en Server Components.\[48\]\[49\]
- **JSON-LD:** con `<script type="application/ld+json">` dentro del componente de página, no en `generateMetadata`, que solo genera etiquetas `<meta>`/`<link>`.\[50\]
- **Sitemap y robots:** `app/sitemap.ts` recorre servicios, zonas que superan el umbral, obras publicadas y posts, con `lastModified` real. `app/robots.ts` permite el rastreo y declara el sitemap. No bloquear `/_next/` ni recursos CSS/JS.
- **Filtros del portfolio:** en `/obras/page.tsx`, si llegan `searchParams` de filtro, devolver `robots: { index: false, follow: true }` en `generateMetadata`.
- **Migración:** mapear todas las URLs actuales de pavimentos-albufera.com a las nuevas con redirecciones 301 en `next.config` (`redirects()`) antes del lanzamiento.

### 5. Páginas de obra: buenas prácticas específicas

- **Por qué funcionan:** son contenido de primera mano (la "E" de Experiencia en E-E-A-T), único por definición, y posicionan para long-tail muy transaccional ("suelo epoxi nave Almussafes", "hormigón impreso piscina Cullera"). Además, alimentan Google Imágenes y la ficha de GBP.
- **Antes/después con el mismo ángulo:** el slider (por ejemplo, `react-compare-slider` o un componente propio con shadcn) mejora sobre todo la conversión y el tiempo en página. Para el SEO lo que cuenta es que existan fotos originales, con alt descriptivo y texto de contexto cerca.\[45\] Hay que mostrar también la secuencia temporal (antes → durante 1…n → después) en una galería con fecha por foto.
- **Títulos:** fórmula `[Servicio] en [Municipio]: [espacio] de [m²] m² [(material/acabado)]`. Ejemplos: `Suelo industrial de resina epoxi en Almussafes: nave de 850 m²`, `Hormigón pulido en Valencia (Ruzafa): local comercial de 95 m²`.
- **Ritmo:** es mejor 1–2 obras bien documentadas al mes que 20 pobres. Si una obra no tiene fotos "antes", se publica solo si el reto técnico o el testimonio la justifican.

### 6. SOP: documentar cada obra nueva

#### 6.1 Formulario de recogida (plantilla para enviar al cliente, es decir, a Pavimentos Albufera)

> **Ficha de obra – Pavimentos Albufera** (rellenar al terminar cada trabajo)
>
> **A. Datos básicos**
> 1. Municipio: ______ Barrio / zona genérica (opcional, nunca calle ni número): ______
> 2. Tipo de cliente: ☐ particular ☐ comunidad de vecinos ☐ empresa / nave ☐ administración
> 3. Tipo de espacio: ☐ patio ☐ acceso / rampa ☐ garaje ☐ piscina / playa de piscina ☐ nave industrial ☐ local comercial ☐ interior vivienda ☐ otro: ______
> 4. Fechas: inicio ___ / fin ___ (días de trabajo efectivo: ___)
>
> **B. El trabajo**
> 5. ¿Qué quería el cliente final? (2–4 frases, con sus palabras si puede ser)
> 6. ¿Qué problema había? (grietas, humedad, desnivel, suelo resbaladizo, desgaste, estética…)
> 7. ¿Qué hicisteis, paso a paso? (preparación, demolición, solera, mallazo, juntas, capas…)
> 8. Servicio(s): ☐ hormigón impreso ☐ pulido ☐ resina epoxi ☐ poliuretano ☐ microcemento ☐ desactivado ☐ solera ☐ otro
> 9. Materiales y marcas (producto, color, molde, sellador, espesor): ______
> 10. Superficie: ___ m² · espesor: ___ cm
> 11. ¿Algún imprevisto o decisión técnica destacable y cómo se resolvió?
> 12. Recomendaciones de mantenimiento que se le dieron al cliente.
> 13. (Opcional, uso interno o rango público) Rango de precio: ☐ <3.000 € ☐ 3–8.000 € ☐ 8–20.000 € ☐ >20.000 € · ¿Se puede publicar el rango? ☐ sí ☐ no
>
> **C. Testimonio (opcional)**
> 14. Frase del cliente final sobre el resultado: ______ · Firma pública: ☐ nombre de pila + municipio ☐ iniciales ☐ anónimo
>
> **D. Permisos (obligatorio para publicar)**
> 15. ☐ Adjunto el consentimiento firmado del propietario/titular (modelo en el apartado 7).
> 16. ☐ Confirmo que en las fotos no aparecen caras, matrículas, números de portal, nombres en buzones, documentos ni fotos familiares, o que se han tapado.
>
> **E. Fotos** (ver guía) · Enlace a la carpeta: ______

#### 6.2 Guía de fotos para el cliente (en una página, para imprimir o enviar por WhatsApp)

- **Antes de empezar, elegir de 2 a 4 posiciones fijas (P1–P4):** por ejemplo, P1 "desde la puerta de acceso", P2 "desde la esquina opuesta", P3 "detalle del problema".
- **Marcar cada posición** con cinta de carrocero en el suelo o una referencia fija (pilar, marco de puerta) y hacer una foto de referencia de "dónde me pongo".
- **Repetir exactamente las mismas posiciones** en cada fase: *Antes* (mínimo 1 por posición), *Durante* (mínimo 3 hitos: preparación/solera, aplicación o impresión, curado o sellado), *Después* (mínimo 1 por posición + 3–5 detalles de acabado y 1–2 planos generales).
- **Cómo disparar:** móvil en **horizontal**, altura del pecho (≈1,5 m), sin zoom (lente principal 1x), sin modo retrato ni filtros, resolución máxima (≥12 MP), lente limpia.
- **Luz:** misma franja horaria en todas las fases si es exterior (evitar mediodía con sombras duras; mejor a primera hora o a última de la tarde), luces encendidas si es interior, sin contraluz.
- **Qué no debe salir:** personas (o de espaldas y sin identificar, con su permiso), matrículas, números de portal o de calle, fachadas reconocibles con rótulos, buzones con nombres, documentos, fotos familiares y objetos personales.\[51\] Retirar lo que se pueda antes de disparar.
- **Vídeo opcional:** 15–30 s de recorrido lento en horizontal al terminar.
- **Nombre de archivo** (si puede): `AAAA-MM-DD_municipio_fase_P1_01.jpg`. Por ejemplo: `2026-09-12_sueca_antes_P1_01.jpg`. Si no, se renombran al recibirlas.
- **Envío:** carpeta compartida de Google Drive o OneDrive por obra, o WeTransfer. Si se envían por WhatsApp, hacerlo "como documento" o en calidad HD para que no se compriman.

#### 6.3 Flujo de publicación (de la recepción a la página publicada)

1. **Recepción y control legal:** comprobar el consentimiento firmado. Sin consentimiento → no se publica (como mucho, fotos de detalle totalmente anónimas y sin ubicación, y solo tras valorarlo). Archivar el consentimiento con un ID (`CONS-2026-014`).
2. **Organización:** carpeta `obras/AAAA-MM-municipio-servicio/`, con los originales intactos en un almacenamiento privado, fuera del repositorio público.
3. **Selección:** mejor serie antes/después por posición + 3–6 "durante" + detalles. Descartar las fotos movidas.
4. **Edición:** alinear y recortar las parejas antes/después para que coincidan, y corregir exposición y blancos. No retocar el resultado (ni ocultar defectos ni "mejorar" el acabado): eso sería engañoso.
5. **Anonimización:** difuminar caras, matrículas, números y rótulos (la AEPD recomienda difuminar los rostros captados de forma incidental).\[52\]
6. **Limpieza de metadatos:** `exiftool -all= -tagsfromfile @ -Orientation *.jpg` o un script con `sharp` al ingerir las fotos. Verificar que no queda GPS.
7. **Exportar:** 2.400 px de lado largo, calidad 80, y renombrar con la convención SEO (`servicio-espacio-municipio-fase-p1.jpg`). Next.js genera AVIF y WebP.
8. **Redacción:** escribir título, meta, ficha técnica, reto / solución / resultado y alt de cada foto a partir del formulario. Se puede usar IA como borrador, pero lo revisa y completa una persona con los datos reales, sin inventar nada.
9. **Maquetación:** crear `content/obras/[slug].mdx` (o la entrada en el CMS) con el frontmatter completo y `consentimientoId`.
10. **QA SEO** (checklist):
    - ☐ Slug sin tildes, único y definitivo · ☐ Title ≤60 caracteres con servicio + municipio + m² · ☐ Meta ≤155 · ☐ Un solo H1.
    - ☐ Ficha técnica completa · ☐ ≥300 palabras propias · ☐ Alt descriptivo en todas las imágenes · ☐ `priority` solo en la imagen principal · ☐ EXIF limpio.
    - ☐ Enlaces a servicio(s), zona y 3 obras similares · ☐ Miga de pan · ☐ JSON-LD válido (Rich Results Test / validator.schema.org).
    - ☐ Canonical correcto · ☐ Aparece en `sitemap.xml` · ☐ Core Web Vitals correctos en móvil (PageSpeed).
    - ☐ Sin dirección exacta, caras ni matrículas · ☐ Testimonio con permiso.
11. **Publicar y difundir:**
    - Inspeccionar la URL en Search Console y solicitar la indexación.
    - Subir 3–5 fotos a GBP y publicar un post en GBP con enlace a la obra.
    - Compartir en redes.
    - Enviar al cliente final el enlace a la obra junto con el enlace para dejar una reseña en Google.
12. **Mantenimiento:** si se retira el consentimiento, despublicar en un máximo de 48–72 h, eliminar las fotos de GBP y redes, devolver 410 o redirigir con 301 a la página del servicio, y recalcular los umbrales de zona.

### 7. Cumplimiento legal (España / UE)

- **Quién consiente:** el titular o propietario del inmueble (y, si es otra persona, también el ocupante). Si es una empresa, su representante. Para comunidades, el presidente o el administrador, con acuerdo si se muestran zonas comunes.
- **Cómo:** consentimiento expreso, escrito y demostrable (RGPD art. 7.1), para finalidades concretas y separadas (web, GBP, redes, folletos; LOPDGDD art. 6.2), en un documento distinto del contrato o claramente diferenciado de él (RGPD art. 7.2).\[53\]\[54\]\[55\]\[56\]
- **No se puede condicionar el contrato de obra a que el cliente acepte** (LOPDGDD art. 6.3).\[55\]
- **Retirada:** debe poder retirarse con la misma facilidad con que se dio (RGPD art. 7.3). La LO 1/1982 (art. 2.3) también permite revocarlo en cualquier momento.\[15\]\[56\]
- **¿Son datos personales las fotos de un suelo?** Una foto de un pavimento sin personas ni contexto identificable probablemente no lo es. Pero si se combina con nombre, dirección, fachada reconocible o enseres personales, puede identificar al propietario.\[51\]\[57\] Además, la intimidad del domicilio está protegida por la LO 1/1982 (art. 7.4, datos privados conocidos por la actividad profesional; art. 7.6, uso de la imagen con fines comerciales) aunque no haya datos personales.\[15\] Por eso, **consentimiento siempre**.
- **Ubicación:** publicar solo municipio y, como mucho, barrio o zona genérica ("zona norte de Sueca", "urbanización en Cullera"). Nunca la calle, el número ni el nombre del cliente sin permiso explícito. Nada de mapas con pin en la vivienda. Eliminar siempre el GPS del EXIF.
- **Personas y matrículas:** la imagen identificable es un dato personal (AEPD).\[58\]\[59\] La matrícula también, cuando permite identificar al titular\[14\] (AEPD, FAQ e informe 425/2006, aunque la Audiencia Nacional ha discrepado en algún caso).\[12\]\[60\]\[61\] Criterio práctico: difuminar siempre. En los trabajadores de la empresa aplica el mismo criterio: si salen reconocibles, necesitan su propio consentimiento escrito\[52\] (ver la sanción de 5.000 € de la AEPD a Roca & Asociados, PS/00526/2023, que además le dio 3 meses para recabar el consentimiento del resto de la plantilla).
- **Testimonios:** consentimiento para publicar el texto y la firma elegida. El texto no se edita más allá de correcciones ortográficas; si se resume, el cliente lo aprueba.
- **Derechos de autor de las fotos:** si las hace el cliente o un empleado, dejar por escrito la cesión de uso a Pavimentos Albufera para web y marketing. Si las hace un fotógrafo, una licencia por escrito.
- **Mapas y vídeos incrustados:** un iframe de Google Maps o de YouTube carga recursos de terceros que pueden instalar cookies. Según la guía de cookies de la AEPD, las cookies no exentas requieren consentimiento previo, con botón "Rechazar" al mismo nivel que "Aceptar", y seguir navegando no vale como consentimiento.\[62\]\[63\]\[64\] Solución: en las zonas, un mapa estático (imagen) del área de servicio. Para vídeos, un "click-to-load" (fachada) que no cargue el iframe hasta que el usuario acepte, y `youtube-nocookie.com`.
- **Web (LSSI-CE art. 10):** el aviso legal debe incluir nombre o razón social, domicilio, email, NIF y datos registrales si procede.\[65\]\[66\] Además: política de privacidad (RGPD art. 13) enlazada en cada formulario con una casilla no premarcada, y política de cookies con un CMP que bloquee los scripts antes del consentimiento.\[64\]\[67\]

**Cláusula modelo de consentimiento** (revisar con el asesor legal o el DPO de la empresa):

> **Autorización para la publicación de imágenes y datos de la obra**
> D./Dña. ____________, con DNI ______, como titular/propietario del inmueble situado en el municipio de ______, AUTORIZA a [Razón social de Pavimentos Albufera], con NIF ______, a captar y publicar fotografías y vídeos del trabajo realizado en dicho inmueble (antes, durante y después), junto con el municipio y, en su caso, el barrio o zona genérica, los materiales, la superficie y la descripción técnica de la obra, en: ☐ su página web ☐ su perfil de Google Business ☐ sus redes sociales ☐ material comercial impreso. ☐ Autorizo también la publicación de mi testimonio firmado como: ☐ nombre de pila + municipio ☐ iniciales ☐ anónimo.
> La empresa se compromete a no publicar la dirección exacta, a no mostrar personas, matrículas ni elementos identificativos, y a eliminar los metadatos de localización de las imágenes. Esta autorización es voluntaria, no condiciona la prestación del servicio y puede retirarse en cualquier momento escribiendo a [email], en cuyo caso el contenido se retirará en un plazo máximo de [3] días hábiles. Responsable: [Razón social]. Finalidad: difusión comercial de trabajos realizados. Base jurídica: consentimiento (art. 6.1.a RGPD). Derechos: acceso, rectificación, supresión, oposición, limitación y portabilidad en [email], y reclamación ante la AEPD (www.aepd.es). Más información: [URL política de privacidad].
> Fecha y firma: ____________

## Recommendations

**Hoja de ruta por prioridad:**

| Fase | Semanas | Qué construir |
|---|---|---|
| 0. Base | 1–2 | Inventario de URLs actuales y mapa de 301 · keyword research + clustering por SERP · modelo de contenido (Zod/CMS) · layout con JSON-LD del negocio · `sitemap.ts`, `robots.ts`, `generateMetadata`, `metadataBase` · aviso legal, privacidad, cookies y CMP · Search Console + GA4 o medición exenta |
| 1. Dinero | 2–4 | Home + 5–7 páginas de servicio completas con fotos propias · `/presupuesto/` con formulario + WhatsApp + `tel:` y eventos · GBP optimizado (SAB, servicios, fotos) y NAP unificado |
| 2. Pruebas | 3–6 | Plantilla de obra + slider · SOP operativo (formulario, guía de fotos, consentimiento) · publicar 6–10 obras retroactivas (solo con consentimiento) · `/obras/` con filtros no indexables |
| 3. Local | 6–12 | Activar `/zonas/[municipio]` automáticamente al cruzar el umbral · citaciones (Habitissimo, Páginas Amarillas, QDQ, Cylex, Hotfrog, Houzz, Bing, Apple) · rutina de reseñas tras cada obra |
| 4. Autoridad | 8+ | Blog: 2 artículos al mes de clusters informativos con datos propios · enlaces locales (prensa comarcal, proveedores, asociaciones) · combinaciones servicio+municipio solo si cumplen el umbral y tienen demanda |

**KPIs (revisión mensual):**
- **Search Console:** clics e impresiones no-marca por grupo de páginas (regex `/servicios/`, `/obras/`, `/zonas/`, `/blog/`) · consultas que contienen municipios · posición media de los 10–20 términos objetivo · páginas indexadas vs. enviadas en el sitemap · alertas de canibalización (consultas con 2 o más URLs).
- **GBP (Rendimiento):** llamadas, clics al sitio web, mensajes, búsquedas que muestran el perfil (desglose por consulta), número y ritmo de reseñas y valoración media.
- **Leads:** formularios, clics en WhatsApp y `tel:` por página de origen · % de leads que citan un municipio del área · leads cualificados → presupuestos → obras ganadas (CRM o hoja simple) · coste por lead si hay campañas.
- **Operación del SOP:** obras publicadas al mes, % de obras con serie antes/después completa, % con testimonio, días entre fin de obra y publicación (objetivo: menos de 14).

## Caveats

- No he auditado el sitio actual de pavimentos-albufera.com ni sus rankings. Antes de migrar, extrae todas sus URLs (Search Console, Screaming Frog) para no perder posicionamiento existente con la nueva estructura.
- Los umbrales (≥3 obras por zona, ≥300 palabras, 4 o más URLs compartidas en el top 10) son reglas prácticas de prudencia, no cifras publicadas por Google. Google no fija mínimos de palabras.
- El informe de Whitespark es una encuesta a expertos, no datos internos de Google.\[33\] El estudio de Ahrefs sobre "also rank for" es de 2017, aunque su conclusión (una página posiciona para cientos de variantes) sigue confirmándose en guías de Ahrefs de 2025–2026.\[68\]
- El estado de los rich results cambia a menudo: comprueba la galería de datos estructurados de Google antes de invertir en un tipo concreto.
- En materia legal, el enfoque es conservador. El criterio sobre matrículas no es unánime (AEPD frente a Audiencia Nacional),\[69\]\[70\] y el texto literal del art. 7 del RGPD y del art. 10 de la LSSI-CE consolidado conviene contrastarlo en BOE/EUR-Lex. La cláusula modelo debe revisarla un profesional antes de usarla.
- Los municipios y particularidades locales citados (suelos cercanos a l'Albufera, salinidad costera, polígonos) son ejemplos de enfoque. Cada afirmación local que se publique debe verificarla la empresa con su experiencia o con una fuente citable.

## Fuentes

1. [Spam Policies for Google Web Search](https://developers.google.com/search/docs/essentials/spam-policies)
2. [Location Pages: What Crosses the Line to Doorway Abuse & Spammy Content?](https://ricketyroo.com/blog/location-page-spam/)
3. [What web creators should know about our March 2024 core update and new spam policies](https://developers.google.com/search/blog/2024/03/core-update-spam-policies)
4. [Local SEO Ranking Factors: Why Competitors Rank Higher](https://www.stallioncognitive.com/local-seo-ranking-factors-competitor-analysis/)
5. [Local SEO Ranking Factors in 2026: What the Whitespark Data Says (With Weights)](https://w3marketinghub.com/seo/local-seo-ranking/)
6. [Guidelines for representing your business on Google - Google Business Profile Help](https://support.google.com/business/answer/3038177?hl=en)
7. [Manage your business address - Google Business Profile Help](https://support.google.com/business/answer/2853879?hl=en)
8. [Review Snippet (Review, AggregateRating) Structured Data](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
9. [Google Review Snippets for Local Businesses and Organizations is Discontinued - Wisevu](https://www.wisevu.com/blog/google-review-snippets-for-local-businesses-and-organizations-discontinued/)
10. [Google Self-Serving Reviews Rule: What You Need to Know](https://jsonschemaapp.com/blog/google-self-serving-reviews-rule/)
11. [\[:es\]Uso imagen empleados consentimiento: Evita Multas de la AEPD\[:\]](https://www.mesadvocats.com/blog/en/uso-imagen-empleados-consentimiento-aepd-multas/)
12. [¿Se considera la matrícula de un coche dato personal?](https://www.aepd.es/preguntas-frecuentes/0-conceptos-basicos/FAQ-0002-sobre-la-matricula-de-un-coche)
13. [1/9 Expediente Nº: E/03408/2013 RESOLUCIÓN DE ARCHIVO DE ACTUACIONES](https://www.aepd.es/documento/e-03408-2013.pdf)
14. <https://www.aepd.es/sites/default/files/2019-09/informe-juridico-rgpd-grabacion-de-imagenes-y-voz-proporcionalidad.pdf>
15. <https://www.boe.es/buscar/pdf/1982/BOE-A-1982-11196-consolidado.pdf>
16. [URL Structure Best Practices for Google Search](https://developers.google.com/search/docs/crawling-indexing/url-structure)
17. [SEO Starter Guide: The Basics](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
18. [Google Revises URL Parameter Best Practices](https://www.searchenginejournal.com/google-revises-url-parameter-best-practices/530814/)
19. [Google Updates URL Structure Best Practices Guidelines](https://www.medresponsive.com/blog/google-updates-url-structure-best-practices-guidelines/)
20. [URL Structure Best Practices for SEO: What Google Wants in 2026 - eSEOspace](https://eseospace.com/blog/url-structure/)
21. [How to Avoid Google's Doorway Page Spam Penalty by Finding and Fixing Orphan Pages](https://www.orbitmedia.com/blog/doorway-pages-seo/)
22. [Ecommerce URL Structure Best Practices](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites)
23. [Faceted navigation in SEO: Best practices to avoid issues](https://searchengineland.com/guide/faceted-navigation)
24. [Faceted navigation SEO for headless storefronts - Vercel](https://vercel.com/i/faceted-navigation-seo)
25. [Canonical Tag: A SEO Guide to Avoid Duplicate Content](https://www.panpan.digital/en/content/canonical-tag-comprehensive-guide-to-avoid-duplicate-content)
26. [Faceted navigation best (and 5 of the worst) practices](https://developers.google.com/search/blog/2014/02/faceted-navigation-best-and-5-of-worst)
27. [▶️ Directorios En Español Para SEO](https://altamiraweb.es/directorios-en-espanol-para-seo/)
28. [Directorios de Empresas y SEO: Guía Completa 2026](https://avantys.com/academia/marketing/directorios-empresas-seo-2026/)
29. [Top 35 directorios locales España · SEO Local — Local Max](https://localmax.es/blog/principales-directorios-locales)
30. [SEO para negocios Locales en España 2025: Claves para Ganar](https://palo-seco.com/seo-para-negocios-locales/)
31. [Study: Top-ranking page in Google ranks for a thousand other queries, too](https://searchengineland.com/ahrefs-keyword-ranking-study-274779)
32. [#1 Ranking Page Ranks For 1000 Other Relevant Keywords: Ahrefs Study! - PageTraffic Buzz - SEO, Search Marketing, News, Events, Guide](https://www.pagetrafficbuzz.com/1-ranking-page-ranks-1000-relevant-keywords-ahref-study/22705/)
33. [Whitespark's Official 2026 Local Search Ranking Factors Report: Your ultimate guide to local SEO success in 2026!](https://whitespark.ca/local-search-ranking-factors/)
34. [What Is Keyword Cannibalization?](https://growresolve.com/what-is-keyword-cannibalization/)
35. [SERP Keyword Clustering Tool: How and Why to Use](https://keywordly.ai/blog/serp-keyword-clustering-tool)
36. [Topical Cluster & Semantic Analysis for Programmatic SEO: What Actually Works](https://medium.com/@reshtei/topical-cluster-semantic-analysis-for-programmatic-seo-what-actually-works-6d48719d9a1b)
37. [Keyword Cannibalization: How to Find and Fix It (Step by Step)](https://thenicheguru.com/blogging/keyword-cannibalization/)
38. [How to Find and Fix Keyword Cannibalization - SERP Smoothie](https://www.serpsmoothie.com/blog/keyword-cannibalization/)
39. [Keyword and content cannibalization: how to identify and fix it • Yoast](https://yoast.com/keyword-cannibalization/)
40. [Keyword Duplicates in Ahrefs: Clean Up Cannibalization Before You Build Links](https://outreachfrog.com/blog/keyword-duplicate-ahrefs-clean-cannibalization-before-links)
41. [Content Cannibalization: What It Is & How to Fix It](https://nogood.io/?p=46490)
42. [The conference for marketers ready to win in 2026](https://ahrefs.com/blog/multiple-rankings-study/)
43. [Guía sobre el uso de cookies de la AEPD](https://www.cookiebot.com/es/guia-cookies-aepd/)
44. [La AEPD publica la "Guía uso de «cookies» para herramientas de medición de audiencias"](https://finreg360.com/alerta/la-aepd-publica-la-guia-uso-de-cookies-para-herramientas-de-medicion-de-audiencias/)
45. [Image SEO Best Practices](https://developers.google.com/search/docs/appearance/google-images)
46. [Photo Geotagging for Developers: EXIF GPS, Metadata Integrity, and Search-Aware Image Pipelines - DEV Community](https://dev.to/geoimagetagger/photo-geotagging-for-developers-exif-gps-metadata-integrity-and-search-aware-image-pipelines-39fd)
47. [Local Business (LocalBusiness) Structured Data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
48. [Next.js SEO: A Practical Guide for App Router and Pages Router](https://www.stewmore.dev/blog/nextjs-seo-a-practical-guide-for-app-router-and-pages-router)
49. [Next.js: Metadata API · llmbestpractices](https://llmbestpractices.com/frontend/nextjs-metadata-api)
50. [Next.js SEO with App Router: generateMetadata, Sitemap, and Robots.ts - Complete Guide](https://seo.yatna.ai/seo-academy/nextjs-seo-app-router-guide/)
51. [RGPD en inmobiliarias: errores frecuentes en portales y formularios](https://blogprofesional.fotocasa.es/rgpd-en-inmobiliarias-errores-frecuentes/)
52. <https://www.aepd.es/documento/2009-0424.pdf>
53. [Posar en una sesión fotográfica NO es un consentimiento válido para su posterior difusión en redes sociales o webs corporativas](https://www.prodat.es/blog/osar-en-una-sesion-fotografica-no-es-un-consentimiento-valido-para-su-posterior-difusion-en-redes-sociales-o-webs-corporativas/)
54. [La AEPD impone una sanción de 5.000 euros a un despacho por publicar en su página web una fotografía de un trabajador sin su consentimiento expreso - Zabía-Abogados](https://zabia-abogados.com/la-aepd-impone-una-sancion-de-5-000-euros-a-un-despacho-por-publicar-en-su-pagina-web-una-fotografia-de-un-trabajador-sin-su-consentimiento-expreso/)
55. [BOE-A-2018-16673 Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales.](https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673)
56. [Artículo 7](https://guides.gdprinfo.eu/es/es-article-7)
57. [RGPD para inmobiliarias: compradores y visitas](https://cardeseo.com/cumplimiento-legal/sector/inmobiliarias)
58. [¡MUCHO CUIDADO! Sancionada una entidad por publicar una foto de una persona oculta tras un vinilo - Prodat](https://www.prodat.es/blog/mucho-cuidado-sancionada-una-entidad-por-publicar-una-foto-de-una-persona-oculta-tras-un-vinilo/)
59. [Publican fotos tuyas sin permiso: qué hacer según la Ley de Protección de Datos - JR Abogados](https://jrabogados.es/publican-fotos-tuyas-sin-permiso-que-hacer-segun-la-ley-de-proteccion-de-datos/)
60. [¿Es un dato personal la matrícula de un vehículo?](https://lopezdelemus.com/es-un-dato-personal-la-matricula-de-un-vehiculo/)
61. [¿Es la matrícula de un vehículo un dato personal?](https://lopezdelemus.com/es-la-matricula-de-un-vehiculo-un-dato-personal/)
62. [Nuevos requisitos de cumplimiento para el uso de cookies derivados de la (última) actualización de la Guía de la AEPD](https://cms.law/es/esp/publication/nuevos-requisitos-de-cumplimiento-para-el-uso-de-cookies-derivados-de-la-ultima-actualizacion-de-la-guia-de-la-aepd)
63. [Guía de Cookies de la AEPD: cambios clave para webs - Auratech Legal](https://auratechlegal.es/guia-cookies-aepd-cambios-webs/)
64. [Guía Completa Sobre La Normativa AEPD De Cookies Para Tu Web](https://xn--diseowebbarcelona-ixb.biz/general-blog/normativa-aepd-cookies/)
65. [SuperContable.com - Artículo 10 Ley 34/2002, de 11 de Julio, de Servicios de la Sociedad de Información y de Comercio Electrónico.](https://www.supercontable.com/informacion/ley_gestion/Art.10._Ley_34-2002-_Servicios_de_la_sociedad_de_.html)
66. [BOE-A-2002-13758 Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico.](https://www.boe.es/buscar/doc.php?id=BOE-A-2002-13758)
67. [Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo](https://noticias.juridicas.com/base_datos/Privado/574082-regl-2016-679-ue-de-27-abr-proteccion-de-las-personas-fisicas-en-lo-que.html)
68. [What Are Secondary Keywords? (And How to Use Them)](https://ahrefs.com/blog/secondary-keywords/)
69. [Matrículas de vehículos. Datos de carácter personal, ¿sí o no? - Prodat](https://www.prodat.es/blog/matriculas-de-vehiculos-datos-de-caracter-personal-si-o-no/)
70. [DELERE.es - Recupera tu reputacin en Internet](http://www.delere.es/blog.php?e=17)
