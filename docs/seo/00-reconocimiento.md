# Parte 0 — Reconocimiento

- **Fecha:** 2026-09-29
- **Rama y commit:** `claude/jolly-bohr-5om2p1`, sobre `cf10b8f`, que es el mismo commit que `origin/main` y que producción.
- **Cómo se hizo:** 54 agentes (Sonnet), en solo lectura.
  - 7 lectores y un crítico de completitud, que añadió 3 lectores de segunda ronda.
  - Los 20 riesgos de severidad alta y media los revisaron 2 verificadores cada uno, con un tercero cuando no coincidían.
  - El orquestador comprobó los datos clave a mano.
- **Base de la auditoría:** un build local con el entorno del CI (`NEXT_PUBLIC_SITE_URL=https://pavimentos-albufera.com`, teléfono ficticio), servido en `localhost:3000`, más Vercel en solo lectura. La red de esta sesión **bloquea `www.pavimentos-albufera.com`**, así que nada de producción se ha visto en vivo (→ [`pendientes-sesion-local.md`](pendientes-sesion-local.md)).
- **Puertas del repo:** `content:validate`, `lint`, `typecheck`, `build` y `verify` terminan con exit 0. `verify` da 0 fallos y 54 entradas en la lista de excepciones.

---

## 1. Resumen

1. **La base técnica es sana.** Las 52 rutas HTML son estáticas y tienen un solo h1. Cada página tiene su propio canonical, con barra final. Una URL que no existe devuelve un 404 real. Las 33 redirecciones antiguas llegan a un 200 en un salto. robots.txt no bloquea AdsBot.
2. **La estructura prevista choca con tres reglas vigentes del repo:**
   - el frontend está congelado;
   - la política documentada dice «no crear ruta de zona sin obra con foto»;
   - las fichas de obra viven en `/proyectos/`, no en `/obras/`.

   Ninguna es técnica, pero hay que decidirlas antes de la Parte 4 (§8).
3. **Hay poca obra real que respalde páginas:**
   - 9 obras, 8 zonas con una obra cada una, y 0 obras de microcemento o de desactivado.
   - Solo **7 de las 48** combinaciones servicio × zona tienen obra con foto.
   - Hay 111 fotos sin atribuir a ninguna obra.
4. **Host canónico sin confirmar.** El código y el CI construyen con el dominio sin www (`pavimentos-albufera.com`), pero en Vercel el dominio principal es `www`. No se ha podido leer el valor real de producción (§7, R05).
5. **Las conversiones de Google Ads no están definidas en el código.** Las llamadas y los WhatsApp se miden solo después de que cargue el JavaScript. No hay ninguna conversión de Ads configurada (§7, R04).
6. **Ninguna de las cuatro herramientas SEO está disponible en esta sesión**: DataForSEO, OpenSEO, mcp-gsc y geo-optimizer. La Parte 3 tiene que hacerse en tu sesión local.

---

## 2. Estructura del repo y configuración central

Es un monorepo pnpm 9.15.9 + Turborepo, con Next.js 15.5.22 (App Router).

| Pieza | Qué contiene |
|---|---|
| `apps/web` | La web. Rutas en `src/app/`. Adaptadores legacy en `src/lib/` y `src/content/`. Cinco verificadores encadenados en el build (`scripts/verificar-*.mjs`) |
| `packages/content` | **Todos los datos del negocio**, en `src/data/*.ts`, con esquemas Zod en `src/schemas/`, consultas en `src/queries/` y validación en `scripts/validate.ts` |
| `packages/config` | Entorno público y URL del sitio: `src/site.ts`, `src/env.ts`, `server-env.schema.ts` |
| `packages/seo` | Generadores de JSON-LD, sitemap, robots y prefijos de ruta. Solo lo usa `apps/web` |
| `packages/tracking` | GA4, Meta Pixel y CAPI, Consent Mode v2, atribución |
| `scripts/verify` | Verificadores posteriores al build (sitemap, metadatos, JSON-LD, robots, número de páginas, enlaces). Tienen una lista de excepciones en `known-issues.json` |

**No hay un `site-config` único. La configuración está en tres capas:**

1. `@site/config` guarda la URL del sitio y el entorno público.
2. `@site/content` guarda los datos: `business`, `services`, `serviceCatalog`, `serviceAreas`, `projects`, `articles`, `faq`, `finishes`, `models`, `legal`.
3. `apps/web/src/lib/config.ts` (`nap`) es el adaptador que usan los componentes.

**Datos de contacto (NAP) en el repo hoy**

| Dato | De dónde sale | Estado |
|---|---|---|
| Nombre comercial | `business.name` = «Pavimentos Albufera» | En el repo. Además aparece escrito a mano en 6–8 archivos |
| Razón social / NIF | `legal.ts`: «Pavimentos Albufera Sociedad Limitada», B02882090 | En el repo |
| Teléfono y WhatsApp | Solo por variable de entorno (`NEXT_PUBLIC_TELEFONO` / `_WHATSAPP`) | No está en el repo. El build de producción falla si sale el teléfono de reserva |
| Calle y número | Solo por variable (`NEXT_PUBLIC_DIRECCION`) | No está en el repo. Si falta la variable, se pinta entre corchetes y **no rompe el build** |
| Municipio / CP / provincia | `business.ts`: Sollana · 46430 · Valencia | En el repo |
| Email público | `business.email` = comercial@pavimentos-albufera.com | En el repo |
| Horario | **No existe** ni hay campo para él | — |
| Perfil de Empresa de Google (`sameAs`) | **No existe** (`perfiles = []`) | — |

---

## 3. Rutas existentes

- Hay 52 rutas HTML: 51 páginas y el 404.
- La única ruta dinámica es `/api/atribucion/`.
- No hay middleware, `vercel.json`, `headers()` ni `revalidate`.
- `trailingSlash: true`.
- Las 5 rutas con segmento variable tienen `dynamicParams = false`, así que un slug inventado da 404.

| Ruta | Número | Indexable | En el sitemap |
|---|---|---|---|
| `/` | 1 | sí | sí |
| `/hormigon-impreso/`, `/hormigon-pulido/`, `/hormigon-lavado/`, `/hormigon-fratasado/`, `/hormigon-desactivado/`, `/microcemento/` | 6 | sí | sí |
| `/zonas/[municipio]/` | 8 | 7 (`xabia` es **noindex**) | **las 8** |
| `/proyectos/` y `/proyectos/[slug]/` | 1 + 9 | sí | sí |
| `/acabados/` y `/acabados/[modelo]/` | 1 + 12 | sí | sí |
| `/blog/` y `/blog/[slug]/` | 1 + 3 | sí (los 3 artículos están **vacíos**) | sí |
| `/lp/[slug]/` (impreso, pulido, lavado, microcemento) | 4 | **noindex** | no |
| `/empresa/`, `/presupuesto/`, 3 páginas legales | 5 | sí | sí |

**No existen** (dan 404): `/zonas/`, `/obras/…`, ningún `/[servicio]/[zona]/`, `/lp/hormigon-fratasado/` ni `/lp/hormigon-desactivado/`.

**Redirecciones:**
- Son 33 reglas en `apps/web/next.config.ts`. Todas son permanentes y responden **308, no 301** (Google trata las dos igual).
- Una URL antigua sin barra final tarda **2 saltos**.
- El build comprueba que cada destino existe. No comprueba cadenas ni que el destino sea indexable.
- En Vercel no hay reglas propias: el plan Hobby no admite redirecciones masivas.

**Dominios en Vercel** (proyecto `pavimentos-albufera-web`):
- `www.pavimentos-albufera.com` es el principal.
- El dominio sin www, `pavimentos-albufera.es`, `www.pavimentos-albufera.es` y `pavimentos-albufera-web.vercel.app` redirigen a él con 308.
- Producción está desplegada desde `main` en `cf10b8f` (2026-09-26).

---

## 4. Servicios y zonas definidos en el código

**Servicios** (`packages/content/src/data/service-catalog.ts`)

| id | Ruta | Obras documentadas | Landing `/lp/` |
|---|---|---|---|
| impreso | `/hormigon-impreso/` | 5 (una sin municipio) | sí |
| pulido | `/hormigon-pulido/` | 2 (Xàbia sin foto) | sí |
| lavado | `/hormigon-lavado/` | 1 | sí |
| fratasado | `/hormigon-fratasado/` | 1 | no |
| microcemento | `/microcemento/` | **0** | sí |
| desactivado | `/hormigon-desactivado/` | **0** | no |

**Zonas** (`packages/content/src/data/service-areas.ts`). Las 8 están en el anillo 1 y tienen una sola obra cada una.

| Slug | Municipio | Provincia | Obra | Servicio |
|---|---|---|---|---|
| moraira | Moraira | Alicante | moraira-impreso-adoquin-arena | impreso |
| denia | Denia | Alicante | denia-impreso-piedra-inglesa | impreso |
| xabia | Xàbia | Alicante | xabia-pulido (**0 fotos → noindex**) | pulido |
| ribarroja | Ribarroja | Valencia | ribarroja-pulido | pulido |
| godella | Godella | Valencia | godella-lavado-arido-visto | lavado |
| moncada | Moncada | Valencia | moncada-impreso-espiga-117 | impreso |
| alzira | Alzira | Valencia | alzira-impreso-adoquin-irregular-107 | impreso |
| corbera | Corbera | Valencia | corbera-fratasado-arena | fratasado |

- **Municipios con obra citada y sin obra documentada (sin ruta):** Torrent (Vedat), Ollería, Carlet, Catadau, Turís, Alfafar, Benissa y Sollana, que es la sede.
- **Castellón:** ninguna zona ni obra.
- **Combinaciones servicio × zona con obra real y foto: 7 de 48.** Son impreso en Moncada, Alzira, Moraira y Denia; fratasado en Corbera; pulido en Ribarroja; y lavado en Godella.

---

## 5. Contenido, esquemas y SEO técnico actual

**Contenido y Zod**
- `content:validate` comprueba la forma de todos los datos, que las referencias entre ellos existan (obra→servicio, zona→obra, landing→servicio…), que los slugs sean únicos, que las imágenes existan y que las notas internas `_*` no se publiquen.
- **No comprueba nada de SEO:** ni longitud o unicidad de title, description y h1, ni indexabilidad, ni contenido mínimo, ni corchetes pendientes.
- Corre en el CI y como dependencia de `turbo run build`. No corre con `pnpm --filter web build` a secas.
- **No existen** estos campos: indexabilidad, demanda, bloque local, horario ni testimonios. **Hay 0 reseñas.**

**Blog**
- Los 3 artículos no tienen cuerpo, entradilla ni fecha, y enseñan «[Contenido… pendiente de redacción]».
- Además, el adaptador descarta el cuerpo (`cuerpo: null`), así que aunque se rellene no se vería en la web.

**FAQ**
- Hay 10 preguntas en total.
- Pulido, lavado, fratasado, desactivado y las 8 zonas comparten **las mismas 3 preguntas**, cada bloque con su propio `FAQPage`.

**Sitemap**
- Tiene 47 URLs, todas en el dominio sin www, sin `lastmod` y sin las `/lp/`.
- **Incluye `/zonas/xabia/`, que es noindex.** El generador no filtra por indexabilidad y ningún verificador lo detecta.

**robots.txt**
- Un solo grupo `User-Agent: *`, con `Allow: /`, `Disallow: /author/` y la línea `Sitemap`.
- AdsBot no queda bloqueado.
- El `Disallow: /author/` impide a Google seguir dos redirecciones antiguas a `/empresa/`.

**Metadatos**
- Título, descripción, canonical y robots salen en el HTML del servidor.
- `lang="es"`, sin hreflang.
- **Ninguna página tiene `og:url`**. Todas comparten la misma `og:image`.
- 25 de las 47 URLs del sitemap tienen un título de más de 60 caracteres.
- Las 3 páginas legales repiten la descripción de la home.
- Cada `/lp/` repite el título y la descripción de su pilar, que es lo esperado en una página noindex.
- El layout raíz fija `canonical: '/'`: una ruta nueva que no declare el suyo se canonicaliza a la home.

**JSON-LD**
- El negocio va como `HomeAndConstructionBusiness` en todas las páginas, sin calle, horario, `geo`, `sameAs` ni imagen.
- Hay `Service` (sin `description`) en servicios y `/lp/`, `FAQPage` en home, servicios y zonas, y `BreadcrumbList` en todo el sitio. En las migas, los tramos intermedios «Servicios» y «Zonas» no llevan URL.
- No hay `Article` ni tipo propio para las obras.
- **No hay `AggregateRating`**, como marca la regla.

**Enlazado interno**
- **Ninguna página enlaza a `/zonas/*`.** Solo llegan por el sitemap y por 5 redirecciones.
- Tampoco reciben enlaces `/acabados/piedra-rodena/` ni `/acabados/piedra-silleria/`.
- Ningún enlace interno pasa por una redirección ni da 404.

**Rendimiento** (laboratorio en localhost, sin CDN ni etiquetas de terceros; orientativo)
- LCP móvil simulado: home 5,0 s · pilar 4,1 s · `/lp/` y obra 3,5 s · zona 3,7 s.
- Sin limitar la red, el LCP está entre 0,2 y 0,3 s. CLS 0.
- JS: máximo 108,7 kB brotli frente a un tope de 112 kB, así que quedan unos **3,3 kB de margen**.

---

## 6. Herramientas: qué hay de verdad en esta sesión

| Herramienta | Estado aquí | Nota |
|---|---|---|
| DataForSEO · OpenSEO · mcp-gsc · geo-optimizer | ❌ No disponibles | Instaladas en tu equipo local. No hay `.mcp.json` en el repo ni son conectores de claude.ai → [pendientes](pendientes-sesion-local.md) |
| GitHub (MCP) | ✅ | — |
| Vercel (MCP) | ⚠️ Parcial | Dominios, alias, logs de build, rutas y firewall: OK. Variables de entorno: **403**. Firewall: 404, porque no hay configuración guardada. Redirecciones masivas: 403 (plan Hobby) |
| WebFetch | ❌ para el dominio | `EGRESS_BLOCKED` en www.pavimentos-albufera.com. También están bloqueados vercel.com y developers.google.com |
| WebSearch | Disponible, no usado | Solo da resultados de EE. UU.: no sirve para la SERP local |
| Nimble | Disponible, no usado | Podría llegar a producción, pero sería saltarse el bloqueo de red. No se ha usado |
| Google Drive | Conectado, no usado | Posible origen de las fotos (Parte 2) |
| Playwright + Chromium 141 · Lighthouse 12.6.1 | ✅ | Mediciones de laboratorio en local |
| exiftool | ❌ No instalado | Hace falta para la Parte 2. `sharp` sí está disponible (exporta a WebP sin EXIF) |
| Canva · Tavily | Piden autorización | Sin uso previsto |

---

## 7. Riesgos técnicos

La severidad es la que dieron los verificadores. «2-0» significa que dos de dos lo confirmaron. «Parte» indica dónde se trata.

| ID | Riesgo | Sev. | Verif. | Parte |
|---|---|---|---|---|
| R01 | Frontend congelado (`apps/web/src/app/**`, `components/**`): ninguna ruta nueva cabe sin levantar la regla | media | 2-1 | 4 · decisión |
| R02 | «Crear todas las combinaciones» choca con la política documentada de no crear zona sin obra con foto. Solo 7 de 48 pares tienen obra | media | 2-1 | 1, 2, 4 |
| R03 | No hay modelo de datos para servicio × zona ni un único criterio de indexabilidad. Hoy se decide en 3 sitios sin conexión (sitemap, zonas, `/lp/`) | media | 2-0 | 4 |
| R04 | Conversiones de Ads: teléfono y WhatsApp se miden solo tras cargar el JS (el `ping` de design/06 no existe). No hay conversión de Ads, desvío de llamadas (DNI) ni Enhanced Conversions. La única vía es GA4 → Ads, con paneles sin crear | media | 2-0 | 7 |
| R05 | Host canónico: canonical, sitemap, JSON-LD y robots se construyen con el dominio sin www y el principal es www. El valor en Vercel no se ha podido leer. **Sube a alta si producción usa el dominio sin www** | media | 2-0 | local |
| R06 | El sitemap incluye `/zonas/xabia/` (noindex). No hay filtro ni verificador para «solo indexables» | media | 2-0 | 4 |
| R07 | Las 8 zonas (y 2 acabados) no reciben ningún enlace interno. `/zonas/` no existe | media | 2-0 | 4 |
| R11 | Redirecciones de WordPress: 2 URLs antiguas (con el slug cortado en el documento maestro) sin regla, y la cobertura no se puede demostrar sin Search Console. Algunos destinos no equivalen (xabia noindex; caucho y `/fr/*` → home) | media | 2-0 | local, 7 |
| R12 | Páginas delgadas indexables: 3 artículos vacíos, `xabia-pulido` sin foto y fichas de obra de 40–101 palabras | media | 2-0 | 4, 6 |
| R13 | Contenido de plantilla: 8 zonas con el mismo texto base y la misma FAQ. Cada `/lp/` coincide en un 73–80 % con su pilar | media | 2-0 | 4, 5 |
| R14 | JSON-LD: migas sin URL en los tramos intermedios (18 páginas); sin Article ni tipo para obras; negocio sin calle, horario ni `sameAs` | media | 2-0 | 4 |
| R15 | NAP incompleto: la calle solo por variable, sin control en el build; sin horario ni Perfil de Empresa; 17 `[PENDIENTE]` en las páginas legales | media | 2-0 | 1 |
| R16 | Un lead puede perderse y contarse igual como conversión si faltan las variables de Resend o Telegram. No hay copia del lead en ninguna base de datos. `gclid` y UTM solo se guardan si el visitante acepta cookies | media | 2-0 | 7 |
| R17 | LCP móvil de laboratorio por encima de 2,5 s en las plantillas que se van a replicar, y ~3,3 kB de margen de JS. Sin medir con GA/Pixel reales | media | 2-0 | local, 4 |
| R18 | Las comprobaciones del repo no cubren la calidad SEO del contenido, ni «noindex fuera del sitemap», ni Consent Mode. La lista de excepciones de `verify` va ruta a ruta (51 `missing-og-url`) y no escala a rutas nuevas | media | 2-0 | 4 |
| R19 | Producción comercial con Ads en un equipo Vercel **Hobby**, que Vercel define como no comercial (esa condición no se ha podido comprobar en esta sesión) | media | 2-0 | 7 · decisión |
| R08 | Canonical heredado `'/'`: una ruta nueva sin canonical propio apuntaría a la home. `verify` lo detecta, pero no bloquea el deploy | baja | 2-0 | 4 |
| R10 | Pasar `/proyectos/` a `/obras/` obliga a repuntar 6 redirecciones y unos 12 enlaces y canonicals | baja | 2-0 | 4 · decisión |
| R20 | Documentación desfasada: CLAUDE.md y design/06 dan por pendientes fallos ya corregidos. ARCHITECTURE.md cita un commit `09af74a` que no está en GitHub | baja | 2-0 | — |
| R09 | ~~Colisión de `/[servicio]/[zona]` con las rutas dinámicas~~ **Refutado 0-2.** Es una lista de comprobación para la Parte 4 (`dynamicParams=false`, solo pares válidos, `notFound()`), no un riesgo | — | 0-2 | 4 |

**De severidad baja, sin verificar:**
- **R21.** Redirecciones 308 y doble salto sin barra final; el `Disallow: /author/` bloquea dos redirecciones.
- **R22.** `public/` publica `/README.md`, `/obras/INVENTARIO.md` y 15 fotos que no se usan, entre ellas de stock y de pádel.
- **R23.** Títulos de más de 60 caracteres y sin `og:url`.
- **R24.** Segundo proyecto Vercel (`prueba_pavi` → `pruebapavi.vercel.app`) conectado al mismo repo, sin redirección: posible copia del sitio.
- **R25.** `next lint` desaparece en Next 16.
- **R26.** Contraste de 2,09:1 en el pie.
- **R27.** Nombre de marca y email de destino escritos a mano en varios archivos.

---

## 8. Choques con las decisiones ya tomadas

Te aviso sin reabrirlas. Son problemas reales que hay que resolver antes de implementar.

1. **Frontend congelado (R01).** CLAUDE.md y ARCHITECTURE.md prohíben tocar `apps/web/src/app/**` y `components/**` hasta el rediseño. La estructura prevista solo se puede construir si **levantas la congelación de forma expresa**, al menos para rutas nuevas, y se actualizan esas reglas.
2. **`/obras/[slug]` frente a `/proyectos/[slug]` (R10).** Hoy existen 9 fichas en `/proyectos/`, destino de 6 redirecciones antiguas. O se mantiene `/proyectos/`, o se renombra con redirecciones nuevas. No hay choque técnico con la carpeta `public/obras/`.
3. **«Se crean todas las combinaciones» (R02).** El repo documenta en seis sitios «no generar ruta sin obra con foto».
   - Tu plan lo resuelve con `noindex` y dejándolas fuera del sitemap, que es la medida habitual contra las *doorway pages*.
   - Pero hay que **anular esa política por escrito**.
   - Y decidir si «demanda + bloque local», sin obra real, basta para indexar, que es más laxo que la regla actual.
4. **Hub de zona `/zonas/[zona]`.** Ya existe como `/zonas/[municipio]/`: cambiar el nombre del parámetro es mecánico. Pero **no existe el índice `/zonas/`**, las zonas no reciben enlaces y solo hay 8, cada una con una obra.
5. **«Sitemap solo con `indexable: true`».** Hoy no se cumple (xabia) y no hay verificador que lo compruebe. Se resuelve en la Parte 4.
6. **Blog informacional.** Además de escribir los textos, hay que rehacer la plantilla que los pinta: la actual descarta el cuerpo.

---

## 9. Pendiente de comprobar fuera de esta sesión

La lista completa, con comandos y el criterio de bueno o malo, está en [`pendientes-sesion-local.md`](pendientes-sesion-local.md). Lo más urgente:

1. El valor real de `NEXT_PUBLIC_SITE_URL` en Vercel (R05).
2. Producción con curl: canonical, sitemap, robots y redirecciones.
3. Qué herramientas SEO responden de verdad en tu equipo.
4. Search Console: propiedad, cobertura y URLs antiguas.

---

## 10. Dudas abiertas de esta parte

Las de negocio van en la entrevista de la Parte 1.

1. ¿Levantas la congelación del frontend para la estructura SEO? ¿Solo para rutas nuevas, o también para arreglar lo existente: migas, `og:url`, enlazado a zonas, blog?
2. ¿`/obras/` o te quedas con `/proyectos/`?
3. ¿Qué es el proyecto Vercel `prueba_pavi` y debe seguir público?
4. ¿Existe en tu equipo el commit `09af74a` (índice `/zonas/`) que cita ARCHITECTURE.md?
5. Plan de Vercel: ¿Hobby a sabiendas, o se pasa a Pro antes de lanzar Ads?
