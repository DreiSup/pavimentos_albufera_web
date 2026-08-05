# Pavimentos Albufera — Documento maestro de rediseño

**Proyecto:** rediseño y migración WordPress → Next.js
**Dominio:** pavimentos-albufera.com
**Alcance:** España (mercado único, idioma único)
**Fecha del análisis:** 26 de julio de 2026
**Fuentes:** rastreo completo de las 38 URLs del sitemap, web hermana padelalbufera.com, análisis de 8 competidores directos y del panorama de precios del sector.

---

## 0. Resumen ejecutivo

La web actual no está rota: está desactualizada, desordenada y desalineada con cómo compra hoy un particular. Tiene tres activos reales —17 años de trayectoria, garantía de 10 años y un archivo fotográfico de obra propia— y los tres están mal explotados.

**Los diez hallazgos que condicionan el rediseño:**

1. **Cuatro teléfonos distintos y dos direcciones distintas** conviven en la misma web. Es el problema más grave: destruye la confianza del visitante y el SEO local.
2. **No hay ni una sola prueba social.** Cero reseñas, cero testimonios, cero nombres de cliente, cero logos. En un sector donde el miedo dominante es "que me lo hagan mal y no pueda arreglarlo", esto es el mayor freno a la conversión.
3. **No hay ni una mención al precio.** La competencia rankea con páginas de "precio m²", calculadoras y simuladores. Albufera no aparece en esa conversación, que es donde está la intención de compra más alta.
4. **El catálogo de acabados no existe como tal.** La empresa habla en su día a día de "modelo espiga, color 117", "adoquín irregular, color 107", "sillería grande, color 113" —el lenguaje real del oficio— pero la web nunca lo muestra de forma navegable. Es la pregunta número uno del particular: *¿cómo va a quedar mi patio?*
5. **Las fotos son el activo más fuerte y están tratadas como el más débil:** resolución de 500×400 px, nombres de archivo tipo `WhatsApp-Image-2023-08-22`, sin contexto ni ficha técnica.
6. **La versión francesa está huérfana y contamina la española.** El menú español enlaza al blog francés (`/fr/category/blog/`) y la cuenta de Instagram enlazada es `@revetementsalbufera`. Si el foco es España, la vertical francesa debe desaparecer o separarse por completo.
7. **Enlaces cruzados rotos en la home:** la tarjeta de pistas de pádel enlaza a hormigón lavado; la imagen de pavimentos de caucho enlaza a hormigón impreso.
8. **Duplicación de URLs por barra final:** `/contacto` y `/contacto/`, `/galeria` y `/galeria/`, `/aviso-legal` y `/aviso-legal/` están las dos versiones en el sitemap.
9. **El copy actual está mal escrito.** Párrafos de 90 palabras sin un solo punto, y faltas visibles en producción: "ipermeabilidad", "estensa", "elegente", "Javia", "Mutcxamel", "Ontinient", "proporcinamos".
10. **La vertical de pádel está a caballo entre dos webs.** Vive dentro de pavimentos-albufera.com y a la vez tiene dominio propio (padelalbufera.com). Hay que decidir y ejecutar la separación limpia.

**La tesis del rediseño:** convertir un folleto corporativo genérico en un catálogo de obra documentada. Cada trabajo con su ficha técnica —modelo, color, superficie, municipio, año— y un muestrario de acabados navegable. Eso responde a la pregunta real del cliente, diferencia frente a toda la competencia local y genera contenido indexable de forma natural.

---

## 1. Contexto de negocio

### 1.1 Ficha de empresa

| Dato | Valor |
|---|---|
| Nombre comercial | Pavimentos Albufera |
| Actividad | Pavimentos y revestimientos de hormigón, obra civil y edificación |
| Trayectoria | 17 años (declarado; en una página se contradice con "más de 15 años") |
| Sede | Sollana (46430), Valencia |
| Garantía | 10 años en todos los trabajos, con mantenimiento incluido |
| Cliente objetivo | Particulares (prioritario), empresas y profesionales del sector |
| Conversión objetivo | Llamada telefónica y WhatsApp |
| Idioma | Castellano (única versión a mantener) |

### 1.2 Datos de contacto — conflicto a resolver antes de empezar

Esto es lo primero que hay que cerrar. La web actual muestra, en páginas distintas:

| Ubicación en la web | Teléfono(s) | Dirección |
|---|---|---|
| Cabecera (todas las páginas) | +34 614 207 633 | Calle Blasco Ibáñez, 16, Sollana |
| Pie de páginas de servicio | +34 672 44 94 46 / +34 627 66 31 46 | Calle Blasco Ibáñez, 16, Sollana |
| Página de contacto | +34 627 66 31 46 / +34 622 06 78 84 | Calle Holanda, Sollana |
| Email | comercial@pavimentos-albufera.com | — |

Cuatro números y dos direcciones. Además, el +34 614 207 633 es también el teléfono de padelalbufera.com, lo que sugiere que es el número central.

**Acción requerida:** definir un único NAP (nombre, dirección, teléfono) y usarlo idéntico en la web, Google Business Profile, redes y facturación. Sin esto, el SEO local no despega.

### 1.3 Redes sociales — también inconsistentes

- Cabecera → Facebook (perfil personal `profile.php?id=61581949963833`) e Instagram `@revetementsalbufera` (handle francés).
- Pie → Facebook `/GabrielPavivasa/` y Twitter `/GabrielPavivasa` (otra marca).

**Acción requerida:** consolidar en un perfil de empresa por red, con handle en castellano, y eliminar Twitter si está inactivo.

### 1.4 Servicios

Todo lo relacionado con el hormigón. Orden de prioridad comercial propuesto:

1. **Hormigón impreso** — el motor del negocio. Volumen de búsqueda más alto, ticket accesible, cliente particular.
2. **Hormigón pulido** — segundo pilar. Doble mercado: industrial (naves, parkings) y residencial de interior.
3. **Microcemento** — mayor margen, cliente de reforma, decisión más estética.
4. **Hormigón lavado / árido visto** — nicho, muy vinculado a piscinas y zonas peatonales.
5. **Hormigón fratasado y desactivado** — actualmente solo aparecen en el blog, sin página propia. **Recomiendo crearlas:** hay proyectos reales documentados y son términos de búsqueda con competencia baja.
6. **Pavimentos de caucho** — encaja mal con el resto (cliente municipal/institucional, no particular). Ver decisión en §4.3.

### 1.5 Cobertura geográfica — un aviso importante

La web actual declara Valencia, Castellón, Alicante, Murcia, Albacete y Almería, y lista municipios en un bloque de texto sin formato al pie ("Valencia Castellon Gandia denia Teulada Moraira Javia Benitachell...").

Tu indicación es "sobre todo Comunidad Valenciana, alrededores y toda España". Te recomiendo un **modelo por anillos** en lugar de reclamar cobertura nacional:

- **Anillo 1 — núcleo:** Valencia, Castellón, Alicante. Obra de cualquier tamaño, desplazamiento sin recargo.
- **Anillo 2 — extendido:** Murcia, Albacete, Almería, Tarragona, Teruel. A partir de un mínimo de superficie.
- **Anillo 3 — resto de España:** solo proyectos de volumen, bajo consulta.

**Por qué:** Google penaliza las *doorway pages* (páginas locales clonadas sin contenido real). Solo debe crearse una página de zona donde haya obra ejecutada que enseñar. Con 17 años de trabajos en Valencia, Alicante y Castellón hay material real de sobra; inventar páginas para Lugo o Badajoz sería contraproducente y además dañaría la credibilidad ante un cliente local.

---

## 2. Auditoría de la web actual

### 2.1 Inventario de contenido

| URL | Título actual | Tipo | Destino en la web nueva |
|---|---|---|---|
| `/` | Pavimentos de hormigón | Home | Rehacer por completo |
| `/pavimentos-de-hormigon-valencia/` | Empresa | Institucional | → `/empresa/` (301) |
| `/pavimentos-de-hormigon-impreso/` | Pavimentos de hormigón impreso | Servicio | Mantener URL, rehacer contenido |
| `/pavimentos-de-hormigon-pulido/` | Pavimentos de hormigón pulido | Servicio | Mantener URL, rehacer contenido |
| `/pavimentos-de-hormigon-lavado/` | Pavimentos de hormigón lavado | Servicio | Mantener URL, rehacer contenido |
| `/microcemento-decorativo/` | Microcemento decorativo | Servicio | Mantener URL, rehacer contenido |
| `/pavimentos-de-caucho/` | Pavimentos de caucho | Servicio | Decisión pendiente (§4.3) |
| `/pistas-de-padel-y-pickleball/` | Pistas de Pádel y Pickleball | Servicio | → 301 a padelalbufera.com |
| `/galeria/` | Galería | Galería | → `/proyectos/` |
| `/contacto/` | Contacto | Conversión | → `/presupuesto/` |
| `/category/blog/` | Blog | Índice | → `/blog/` |
| 11 entradas de proyecto | Obras concretas | Post | → `/proyectos/[slug]/` |
| 3 artículos divulgativos | Contenido | Post | → `/blog/[slug]/` |
| `/author/pavadmin/` (×2) | Autor | Sistema | Eliminar, `noindex` |
| `/aviso-legal/`, `/cookies/`, `/politica-de-privacidad/` | Legales | Legal | Mantener, revisar con asesoría |

**Total real: 10 páginas de contenido + 14 entradas.** Una web pequeña, lo cual es una ventaja: la migración es abarcable y permite rehacer todo el contenido sin excusas.

### 2.2 Problemas técnicos

| Problema | Gravedad | Detalle |
|---|---|---|
| NAP inconsistente | **Crítica** | 4 teléfonos, 2 direcciones |
| Enlaces rotos en home | Alta | 2 tarjetas apuntan al servicio equivocado |
| Menú ES → blog FR | Alta | `/fr/category/blog/` desde la navegación castellana |
| Duplicados con/sin barra | Alta | 3 pares de URLs duplicadas indexables |
| Sitemap manual y obsoleto | Media | Generado con xml-sitemaps.com, `lastmod` de junio 2025, no incluye `/pistas-de-padel-y-pickleball/` |
| Imágenes de baja resolución | Alta | Servidas a 500×400 px vía ShortPixel |
| Sin datos estructurados | Alta | Ni `LocalBusiness`, ni `Service`, ni `FAQPage`, ni `AggregateRating` |
| Elementor + tema Bizberg | Media | Peso y CLS elevados; se resuelve con la migración |
| Footer "Copyright ©2026" | Baja | Año quemado en plantilla |
| Sin analítica visible | Alta | No se detecta GA4 ni consentimiento configurado |

### 2.3 Análisis del copy actual

**Lo que está bien y hay que conservar como argumento:**
- La garantía de 10 años **con mantenimiento incluido**. Es un diferencial real y potente, y está enterrado en el tercio inferior de las páginas.
- El dato de que más del 30 % de los trabajos son de clientes repetidores. Es la mejor prueba social que tienen y solo aparece como frase suelta.
- La ficha técnica del hormigón lavado (HA-25, fibra de polipropileno, norma EHE-08, clase 3 Rd>45). Es el único punto donde la web demuestra conocimiento técnico real. **Este registro hay que extenderlo a todos los servicios**, no eliminarlo.

**Lo que hay que tirar:**
- Párrafos de 80-100 palabras sin puntuación interna. Ilegibles en móvil, que es donde está el 70-80 % del tráfico de este sector.
- Superlativos sin sustento: "calidad inmejorable", "queremos ser los mejores", "líderes en confianza". Todo el mundo lo dice, nadie lo cree.
- Faltas de ortografía en producción: *ipermeabilidad, estensa, elegente, proporcinamos, Javia, Mutcxamel, Ontinient, Mora irá* (por Moraira).
- Bloques de texto idénticos repetidos en cinco páginas ("Una de las opciones decorativas más resistentes en la actualidad" con la misma lista de viñetas). Google lo lee como contenido duplicado interno.
- El listado de municipios sin formato al pie de la home. Es *keyword stuffing* de 2012.

**Tratamiento del ángulo del cliente objetivo:** el copy actual está escrito para un cliente indefinido, con un "usted" formal y vocabulario de obra civil. Si el foco son particulares —gente que quiere arreglar la entrada del garaje, el porche o el contorno de la piscina— hay que hablar de espacios, no de sistemas constructivos.

### 2.4 SEO: dónde está el hueco

Palabras clave donde la competencia está fuerte y Albufera ausente:

| Consulta | Intención | Estado actual |
|---|---|---|
| hormigón impreso precio m2 | Transaccional alta | Sin página |
| cuánto cuesta hormigón impreso | Transaccional alta | Sin página |
| hormigón impreso imitación madera | Comercial | Sin página |
| hormigón pulido exterior precio | Transaccional | Sin página |
| hormigón impreso o pulido cuál elegir | Comparativa | Sin página |
| hormigón fratasado | Informativa | Solo entradas de blog |
| hormigón desactivado | Informativa | Solo entrada de blog |
| microcemento sobre azulejo | Long tail | Mencionado, sin página |

Los competidores mejor posicionados (hormigonimpresovalencia.es, pavitrif.com, impresovalencia.es) atacan precio de forma explícita —Pavitrif publica "a partir de 9 €/m²"— y varios operan calculadoras de presupuesto. El rango de mercado 2026 se sitúa en **20-45 €/m² instalado** para impreso estándar en la Comunidad Valenciana, con proyectos de 80-120 m² en la franja de 28-35 €/m².

**Conclusión estratégica:** publicar precios orientativos es incómodo pero es la mayor oportunidad del proyecto. Quien da un rango honesto y explica qué incluye gana la comparación frente a quien esconde el precio y frente a quien anuncia 15 €/m² sin mallazo.

---

## 3. Mapa competitivo

| Competidor | Posicionamiento | Fortaleza | Debilidad explotable |
|---|---|---|---|
| **hormigonimpresovalencia.es** | "30 años, pionera y líder en la Comunidad Valenciana" | Antigüedad de dominio, cobertura de municipios | Web anticuada, sin proyectos documentados |
| **pavitrif.com** | Precio agresivo, "desde 9 €/m²" | Transparencia de precio, cubre 3 provincias | Precio de reclamo poco creíble; sin fichas de obra |
| **impresovalencia.es** | Catálogo amplio de servicios + blog | Blog activo con contenido de compra, reseñas | Sin identidad visual propia |
| **Topciment (delegación Valencia)** | Fabricante, sello PYME Innovadora | Autoridad de marca, red de aplicadores | No ejecutan ellos: "no disponemos de instaladores propios" |
| **hormigonestampadobambu.es** | Generalista local | — | Web muy básica |
| **Habitissimo / Cronoshare** | Marketplaces | Dominan las búsquedas de "empresas de..." | Se llevan el lead y lo revenden a 4 competidores |

**El hueco:** nadie en Valencia enseña la obra terminada como un catálogo consultable, con modelo, color y municipio. Todos publican galerías amontonadas sin contexto. Albufera ya tiene ese material —solo que lo trata como decoración en lugar de como argumento de venta.

**El segundo hueco:** Topciment, que es quien más autoridad tiene, **no ejecuta**. Albufera sí. "Lo hacemos nosotros, no subcontratamos" es un mensaje directo contra el líder de categoría, si es cierto. *(Confirmar antes de usarlo.)*

---

## 4. Estrategia de la nueva web

### 4.1 Posicionamiento

> **La empresa que te enseña exactamente cómo va a quedar antes de empezar.**

No compite por ser la más barata ni la más grande. Compite por ser la única que reduce la incertidumbre del cliente: catálogo real de acabados, obras documentadas con su ficha, precios orientativos honestos y una garantía de 10 años con mantenimiento.

### 4.2 Mensajes núcleo, por orden de aparición

1. **17 años y garantía de 10 años con mantenimiento incluido.** El argumento más fuerte que ya poseen.
2. **Elige el acabado antes de decidir.** Muestrario navegable de modelos y colores sobre obra real.
3. **Ejecución propia.** El equipo que presupuesta es el que trabaja *(pendiente de confirmar)*.
4. **Precio claro desde el principio.** Rangos publicados y qué incluye cada uno.
5. **Más del 30 % de los clientes repiten.** El dato de fidelidad convertido en prueba social.

### 4.3 Tres decisiones a tomar antes de diseñar

**Decisión 1 — La vertical de pádel sale de esta web.**
Actualmente vive en los dos sitios. Recomendación: eliminarla de pavimentos-albufera.com, redirigir `/pistas-de-padel-y-pickleball/` a padelalbufera.com y dejar en la web de pavimentos solo una mención discreta en "Empresa" con enlace. Dos públicos distintos (particular vs. club/promotora) no comparten home.

**Decisión 2 — La versión francesa desaparece.**
Si el negocio es España, mantener `/fr/` diluye el dominio, genera problemas de hreflang y confunde a Google. Opciones: (a) eliminarla y redirigir todo a la home española, o (b) moverla a un dominio propio si aún genera negocio en Francia. **Necesito tu confirmación**, porque hay tráfico e historial en juego.

**Decisión 3 — Los pavimentos de caucho.**
Es el único servicio cuyo cliente no es un particular: son ayuntamientos y colegios (parques infantiles, normativa EN 1176/1177). Opciones: (a) mantenerlo como servicio secundario en un apartado "Obra pública", o (b) retirarlo. Si genera facturación, la (a); si es residual, la (b) simplifica el mensaje. **Necesito tu criterio.**

### 4.4 Tratamiento del tono

Cambio de **"usted" a "tú"**. El cliente objetivo es un particular reformando su casa, y el registro formal del sitio actual crea distancia. Todo el copy de la §7 está escrito en "tú". Si prefieres mantener el "usted" por perfil de cliente, es una conversión mecánica del texto — dímelo y lo ajusto.

---

## 5. Arquitectura de la nueva web

### 5.1 Sitemap

```
/                                   Home
│
├── /hormigon-impreso/              ← mantiene URL antigua vía 301
├── /hormigon-pulido/               ← mantiene URL antigua vía 301
├── /microcemento/                  ← mantiene URL antigua vía 301
├── /hormigon-lavado/               ← mantiene URL antigua vía 301
├── /hormigon-fratasado/            NUEVA
├── /hormigon-desactivado/          NUEVA
├── /obra-publica/                  NUEVA (absorbe caucho, si se mantiene)
│
├── /acabados/                      NUEVA — el muestrario. Elemento firma.
│   └── /acabados/[modelo]/         p. ej. /acabados/espiga/
│
├── /proyectos/                     Sustituye a /galeria/
│   ├── /proyectos/[slug]/          Ficha de obra
│   └── filtros por servicio, modelo, municipio y año
│
├── /precios/                       NUEVA — la página que falta
│   └── calculadora de presupuesto orientativo
│
├── /zonas/                         NUEVA
│   └── /zonas/[municipio]/         solo donde haya obra real documentada
│
├── /empresa/                       ← 301 desde /pavimentos-de-hormigon-valencia/
├── /presupuesto/                   ← 301 desde /contacto/
├── /blog/
│   └── /blog/[slug]/
│
└── legales: /aviso-legal/ /politica-de-privacidad/ /politica-de-cookies/
```

### 5.2 Plantillas necesarias en Next.js

| Plantilla | Rutas | Notas |
|---|---|---|
| `Home` | `/` | Única |
| `Servicio` | 7 rutas | Componible por bloques |
| `Acabado` | `/acabados/[modelo]` | Generada desde datos |
| `ÍndiceProyectos` | `/proyectos` | Filtrable en cliente |
| `Proyecto` | `/proyectos/[slug]` | Generada desde datos |
| `Zona` | `/zonas/[municipio]` | Generada desde datos |
| `Precios` | `/precios` | Con calculadora interactiva |
| `Artículo` | `/blog/[slug]` | MDX |
| `Institucional` | `/empresa` | Única |
| `Conversión` | `/presupuesto` | Única |
| `Legal` | 3 rutas | MDX |

### 5.3 Plan de redirecciones 301

Criterio: **no tocar las URLs de servicio que ya tienen antigüedad e historial salvo mejora clara.** He optado por simplificarlas porque las actuales son largas y redundantes (`/pavimentos-de-hormigon-impreso/` → `/hormigon-impreso/`), pero si prefieres riesgo cero, se mantienen tal cual y se eliminan estas cuatro líneas.

```
# Servicios
/pavimentos-de-hormigon-impreso/     → /hormigon-impreso/
/pavimentos-de-hormigon-pulido/      → /hormigon-pulido/
/pavimentos-de-hormigon-lavado/      → /hormigon-lavado/
/microcemento-decorativo/            → /microcemento/
/pavimentos-de-caucho/               → /obra-publica/     (o /  si se retira)

# Institucional y conversión
/pavimentos-de-hormigon-valencia/    → /empresa/
/contacto/                           → /presupuesto/
/contacto                            → /presupuesto/
/galeria/                            → /proyectos/
/galeria                             → /proyectos/

# Blog y proyectos
/category/blog/                      → /blog/
/category/blog/page/2/               → /blog/
/fr/category/blog/                   → /blog/
/author/pavadmin/                    → /empresa/          + noindex
/author/pavadmin/page/2/             → /empresa/          + noindex

# Entradas de proyecto (11) → /proyectos/[slug-simplificado]/
/hormigon-impreso-en-modelo-espiga-y-color-117-proyecto-en-moncada-valencia/
                                     → /proyectos/moncada-impreso-espiga-117/
/hormigon-impreso-en-color-gris-modelo-manta-imitacion-roca-de-montana/
                                     → /proyectos/impreso-manta-gris/
/hormigon-impreso-en-adoquin-pequeno-y-color-arena-proyecto-en-moraira/
                                     → /proyectos/moraira-impreso-adoquin-arena/
/hormigon-fratasado-en-color-arena-trabajo-realizado-en-corbera-valencia/
                                     → /proyectos/corbera-fratasado-arena/
/hormigon-impreso-en-color-107-y-modelo-adoquin-irregular-trabajo-realizado-en-alzira/
                                     → /proyectos/alzira-impreso-adoquin-irregular-107/
/hormigon-desactivado-con-piedra-vista-estetica-y-funcionalidad-en-un-solo-material/
                                     → /hormigon-desactivado/
/hormigon-fratasado-fino-decorativo-en-viviendas/
                                     → /hormigon-fratasado/
/hormigon-impreso-en-moraira/        → /zonas/moraira/
/hormigon-pulido-en-ribarroja-del-turia/ → /zonas/ribarroja/
/hormigon-pulido-en-xabia/           → /zonas/xabia/
/hormigon-pulido-en-alicante/        → /zonas/alicante/
/pavimentos-de-hormigon-impreso-en-denia/ → /zonas/denia/
/hormigon-lavado-en-valencia-godella/ → /zonas/godella/
/microcemento-alicante-2021/         → /zonas/alicante/

# Artículos divulgativos → /blog/
/pavimentos-de-hormigon-impreso-innovacion-y-estilo-para-tus-espacios/
                                     → /blog/hormigon-impreso-innovacion-y-estilo/
/la-magia-del-hormigon-impreso-en-piscinas-de-valencia-y-alicante-.../
                                     → /blog/hormigon-impreso-en-piscinas/
/brillo-y-elegancia-explorando-el-hormigon-pulido/
                                     → /blog/guia-hormigon-pulido/
/descubriendo-la-elegancia-y-durabilidad-del-hormigon-impreso-en-valencia/
                                     → /blog/hormigon-impreso-valencia-guia/
/hormigon-pulido-alicante-transformando-espacios-.../
                                     → /zonas/alicante/

# Vertical de pádel
/pistas-de-padel-y-pickleball/       → https://padelalbufera.com/  (301 externo)

# Versión francesa (pendiente de decisión)
/fr/*                                → /   (si se elimina)

# Legales
/aviso-legal                         → /aviso-legal/
/cookies/                            → /politica-de-cookies/
```

**Configuración obligatoria en Next.js:** `trailingSlash: true` (o `false`, pero fijo) para eliminar de raíz la duplicación con y sin barra.

---

## 6. Wireframes — sección a sección

Notación: cada bloque numerado es una sección de página completa en scroll vertical.

### 6.1 Home

```
┌──────────────────────────────────────────────────────────┐
│ 01  HERO — obra, no eslogan                              │
│                                                          │
│  Fotografía a sangre de un pavimento terminado real.     │
│  Sobre ella, arriba a la izquierda, el titular.          │
│  Abajo a la derecha, en monoespaciada, la ficha:         │
│                                                          │
│  ┌─ MONCADA · VALENCIA ─────────────┐                   │
│  │ IMPRESO / MODELO ESPIGA / C-117  │                   │
│  │ 180 m²  ·  2025                  │                   │
│  └──────────────────────────────────┘                   │
│                                                          │
│  [Ver acabados]  [Pedir presupuesto]                     │
├──────────────────────────────────────────────────────────┤
│ 02  BARRA DE CONFIANZA (sticky al hacer scroll)          │
│  17 años · Garantía 10 años · Valencia, Castellón,       │
│  Alicante · 30 % de clientes repiten                     │
├──────────────────────────────────────────────────────────┤
│ 03  ¿QUÉ NECESITAS PAVIMENTAR?                           │
│  Entrada de garaje · Porche y terraza · Contorno de      │
│  piscina · Interior de vivienda · Nave o parking         │
│  (Entrada por espacio, NO por técnica. El cliente no     │
│   sabe si quiere impreso o fratasado; sabe que tiene     │
│   un porche feo.)                                        │
├──────────────────────────────────────────────────────────┤
│ 04  MUESTRARIO — el elemento firma                       │
│  Rejilla de acabados sobre obra real. Cada muestra con   │
│  su código en monoespaciada.                             │
│  ┌────┐┌────┐┌────┐┌────┐                              │
│  │ESPI││ADOQ││SILL││MANT│  ← filtro por modelo          │
│  │C117││C107││C113││GRIS│                               │
│  └────┘└────┘└────┘└────┘                              │
│  [Ver el muestrario completo →]                          │
├──────────────────────────────────────────────────────────┤
│ 05  SERVICIOS (6 tarjetas, foto real + una línea)        │
├──────────────────────────────────────────────────────────┤
│ 06  PRECIOS ORIENTATIVOS                                 │
│  Tabla de tres rangos + "qué incluye / qué no incluye"   │
│  [Calcular mi presupuesto →]                             │
├──────────────────────────────────────────────────────────┤
│ 07  CÓMO TRABAJAMOS (4 pasos, numerados — aquí sí,       │
│     porque es una secuencia real con plazos)             │
├──────────────────────────────────────────────────────────┤
│ 08  PROYECTOS RECIENTES (6 fichas + enlace al índice)    │
├──────────────────────────────────────────────────────────┤
│ 09  RESEÑAS                                              │
│  ⚠ BLOQUEANTE: no existe ninguna. Ver §11.               │
├──────────────────────────────────────────────────────────┤
│ 10  GARANTÍA DE 10 AÑOS — bloque destacado               │
├──────────────────────────────────────────────────────────┤
│ 11  ZONAS — mapa de los tres anillos                     │
├──────────────────────────────────────────────────────────┤
│ 12  FAQ (6 preguntas, con schema FAQPage)                │
├──────────────────────────────────────────────────────────┤
│ 13  CIERRE — teléfono, WhatsApp, formulario corto        │
└──────────────────────────────────────────────────────────┘
     BARRA FIJA EN MÓVIL: [Llamar] [WhatsApp]
```

### 6.2 Plantilla de servicio

```
01  Hero: foto del acabado + H1 + una frase + CTA doble
02  Para qué sirve (aplicaciones por espacio, con foto por cada una)
03  Acabados disponibles para este servicio (muestrario filtrado)
04  Ficha técnica (espesores, resistencias, normativa, tiempos de curado)
    ← aquí va el registro técnico que hoy solo tiene el hormigón lavado
05  Precio orientativo de ESTE servicio + qué incluye
06  Proyectos ejecutados con este servicio (filtro automático)
07  Mantenimiento y garantía
08  FAQ específica del servicio (schema FAQPage)
09  Comparativa: cuándo elegir este y cuándo otro
    ← contenido de alto valor y baja competencia
10  CTA de cierre
```

### 6.3 Ficha de proyecto

```
01  Galería a pantalla completa (antes / después si existe)
02  Ficha técnica en monoespaciada:
    Municipio · Servicio · Modelo · Color · Superficie · Año · Plazo
03  El encargo: 2-3 frases sobre qué pedía el cliente
04  La ejecución: qué se hizo, qué dificultad hubo
05  Acabado empleado → enlaza a /acabados/[modelo]
06  Proyectos similares
07  CTA: "¿Quieres algo parecido?"
```

### 6.4 Página de precios

```
01  H1 + explicación honesta de por qué el precio varía
02  Tabla por servicio y por uso (peatonal / vehículos / industrial)
03  Calculadora: superficie + tipo de uso + estado del terreno → rango
04  Qué incluye siempre / qué se factura aparte
05  Señales de alarma: por qué desconfiar de un presupuesto por debajo
    de 20 €/m²  ← genera confianza y desmonta al competidor barato
06  CTA a presupuesto cerrado
```


---

## 7. Copy completo

> Todo el texto está listo para pegar. Escrito en "tú". Los `[corchetes]` marcan datos que debes confirmar antes de publicar.

### 7.1 Home

**01 · Hero**

> H1: **Hormigón que se ve bien 20 años después**
>
> Pavimentos de hormigón impreso, pulido, lavado y microcemento en Valencia, Castellón y Alicante. 17 años ejecutando obra propia, con 10 años de garantía y mantenimiento incluido.
>
> `[Ver acabados]` `[Pedir presupuesto]`
>
> *Ficha sobre la imagen:* `MONCADA · VALENCIA / IMPRESO · MODELO ESPIGA · COLOR 117 / [180] m² · 2025`

**02 · Barra de confianza**

> 17 años de oficio · Garantía de 10 años con mantenimiento · Valencia, Castellón y Alicante · Más de 3 de cada 10 clientes vuelven a llamarnos

**03 · ¿Qué necesitas pavimentar?**

> ### Empieza por el espacio, no por el material
> Cada superficie pide un acabado distinto. Dinos qué quieres resolver y te decimos qué le va mejor.
>
> - **Entrada de garaje** — Aguanta el paso de coches sin agrietarse.
> - **Porche y terraza** — El acabado que más piden nuestros clientes.
> - **Contorno de piscina** — Antideslizante y frío al sol.
> - **Interior de vivienda** — Continuo, sin juntas, fácil de limpiar.
> - **Patio y jardín** — Integrado con el entorno, sin mantenimiento.
> - **Nave, parking o local** — Resistente al tránsito pesado y a los ácidos.

**04 · Muestrario**

> ### Elige el acabado antes de que empecemos
> Estos no son renders. Cada muestra es una obra que hemos ejecutado, con su modelo y su color. Míralos, guárdate el código y dínoslo cuando hablemos.
>
> `[Abrir el muestrario completo →]`

**05 · Servicios**

> ### Todo lo que se puede hacer con hormigón
>
> **Hormigón impreso** — Textura de piedra, adoquín o madera sobre una solera continua. El más pedido para exteriores.
> **Hormigón pulido** — Superficie lisa y brillante. De la nave industrial al salón de casa.
> **Microcemento** — Renueva suelos y paredes sin levantar lo que ya tienes.
> **Hormigón lavado** — Árido visto, antideslizante. Ideal para zonas de paso y piscinas.
> **Hormigón fratasado** — Acabado fino y mate. Sobrio, moderno y económico.
> **Hormigón desactivado** — Piedra vista con la resistencia de una solera.

**06 · Precios**

> ### Te decimos lo que cuesta antes de que preguntes
> El precio de un pavimento depende de la superficie, del uso que le vayas a dar y del estado en que esté el terreno. Estos son nuestros rangos habituales en la Comunidad Valenciana, con material y mano de obra incluidos, sin IVA.
>
> | Trabajo | Rango habitual |
> |---|---|
> | Hormigón impreso, uso peatonal (patios, porches, jardines) | `[28-38]` €/m² |
> | Hormigón impreso, paso de vehículos (entradas, rampas) | `[35-48]` €/m² |
> | Hormigón pulido, interior | `[30-45]` €/m² |
> | Hormigón pulido, nave o parking | `[22-35]` €/m² |
> | Microcemento sobre suelo existente | `[55-85]` €/m² |
> | Hormigón lavado | `[30-42]` €/m² |
>
> **Incluido siempre:** preparación del soporte, mallazo, fibra de polipropileno, hormigón de 10 cm, molde, pigmento, desmoldeante y sellado final.
> **Se presupuesta aparte:** demolición del pavimento anterior, movimiento de tierras, drenajes y rebajes de acceso difícil.
>
> `[Calcular mi presupuesto orientativo →]`

**07 · Cómo trabajamos**

> ### Cuatro pasos, sin sorpresas
>
> **01 · Visita y medición** — Vamos a verlo. Sin coste y sin compromiso. Medimos, comprobamos el estado del terreno y el acceso para el camión.
> **02 · Presupuesto cerrado** — Te lo enviamos en `[48 horas]`, desglosado. Lo que pone es lo que se paga.
> **03 · Ejecución** — `[Equipo propio]`. Una superficie de 80-100 m² se ejecuta en 2 o 3 días. Después necesita entre 24 y 48 horas sin pisar y 28 días para curar del todo.
> **04 · Garantía y mantenimiento** — 10 años. Y volvemos a resellar cuando toque.

**08 · Proyectos**

> ### Obra hecha, no catálogo de proveedor
> Todas las fotos de esta web son trabajos nuestros. Puedes filtrarlos por acabado, por tipo de espacio o por municipio.
>
> `[Ver todos los proyectos →]`

**09 · Reseñas**

> ### Lo que dicen quienes ya nos han contratado
> *(Bloque pendiente de contenido real — ver §11)*

**10 · Garantía**

> ### 10 años de garantía. Y el mantenimiento, también nuestro.
> No es solo que respondamos si algo falla. Es que volvemos a resellar el pavimento cuando le toca, porque un hormigón impreso bien mantenido dura décadas y uno abandonado se ve viejo a los cinco años.
>
> Más de 3 de cada 10 trabajos que hacemos son para clientes que ya nos habían contratado antes. Es el único indicador que nos importa.

**11 · Zonas**

> ### Dónde trabajamos
> **Sin desplazamiento:** Valencia, Castellón y Alicante. Cualquier superficie.
> **Con desplazamiento:** Murcia, Albacete, Almería, Tarragona y Teruel, a partir de `[100]` m².
> **Resto de España:** proyectos de volumen, consúltanos.

**12 · FAQ**

> **¿Cuánto tarda en poder pisarse?**
> Entre 24 y 48 horas para pisar y una semana para muebles o coches. El curado completo del hormigón son 28 días, pero puedes hacer vida normal mucho antes.
>
> **¿Se agrieta el hormigón impreso?**
> Bien ejecutado, no. Las grietas aparecen cuando falta mallazo, cuando la solera tiene menos de 10 cm o cuando no se han hecho las juntas de dilatación. Nosotros hacemos las tres cosas siempre.
>
> **¿Se puede poner encima del suelo que ya tengo?**
> En hormigón impreso, no lo recomendamos: la adherencia y el espesor no quedan garantizados. En microcemento sí, y ahí está su gran ventaja: se aplica sobre azulejo, terrazo o gres sin picar nada.
>
> **¿Cada cuánto hay que resellar?**
> Cada 2 o 3 años en entradas de coche y zonas de piscina. Cada 5 o 6 en terrazas y jardines de uso peatonal. Nosotros te avisamos.
>
> **¿Qué pasa si el presupuesto que tengo es de 18 €/m²?**
> Que revises qué incluye. A ese precio no salen los materiales de una solera de 10 cm con mallazo y fibra. Normalmente falta el hormigón, el armado o el sellado, y aparece en la factura final.
>
> **¿Trabajáis para empresas y constructoras?**
> Sí. Naves industriales, parkings, urbanizaciones y obra civil. `[Pídenos referencias del sector.]`

**13 · Cierre**

> ### Cuéntanos qué quieres hacer
> Te llamamos, vamos a verlo y te damos un precio cerrado. Sin coste y sin compromiso.
>
> `[Llamar al 96X XXX XXX]` `[Escribir por WhatsApp]`
> O déjanos tus datos y te llamamos nosotros.

---

### 7.2 Hormigón impreso

> **H1: Hormigón impreso en Valencia, Castellón y Alicante**
>
> Textura de piedra natural, adoquín o madera sobre una solera continua. Sin juntas donde crezca la hierba, sin baldosas que se levanten y con un mantenimiento que se reduce a barrer.
>
> ### Dónde tiene sentido ponerlo
> El impreso es el acabado que mejor funciona en exterior. Es impermeable, aguanta el paso de coches, resiste manchas de grasa y aceite y no se decolora con el sol si lleva el sellado adecuado.
>
> - **Entradas de garaje y rampas** — con espesor y armado reforzados
> - **Porches, patios y terrazas** — el uso más habitual
> - **Contornos de piscina** — con acabado antideslizante
> - **Caminos y accesos de parcela**
> - **Muros y fachadas** — la misma técnica en vertical, con la misma gama
>
> ### Ficha técnica
> | | |
> |---|---|
> | Espesor uso peatonal | 10 cm |
> | Espesor paso de vehículos | 12-15 cm |
> | Armado | Mallazo electrosoldado + fibra de polipropileno |
> | Hormigón | HA-25 según EHE-08 |
> | Juntas de dilatación | Cada `[16-25]` m² |
> | Sellado | Resina acrílica, `[2]` manos |
> | Tránsito peatonal | 24-48 h |
> | Curado completo | 28 días |
>
> ### Cuándo NO elegir impreso
> Preferimos decírtelo antes. Si vas a pavimentar un interior, el pulido o el microcemento quedan mejor y son más fáciles de mantener. Si el terreno tiene humedades sin resolver o raíces de arbolado grande cerca, primero hay que solucionar eso: el mejor pavimento del mundo se agrieta sobre una base que se mueve.

*(Estructura equivalente para pulido, microcemento, lavado, fratasado y desactivado. El texto completo de cada uno lo desarrollo en la siguiente iteración, una vez confirmes los datos entre corchetes.)*

---

### 7.3 Empresa

> **H1: 17 años poniendo hormigón en la Comunidad Valenciana**
>
> Empezamos en Sollana en `[2009]`. Desde entonces hemos ejecutado `[X.000]` metros cuadrados de pavimento entre Valencia, Castellón y Alicante: entradas de casas, porches, contornos de piscina, naves, parkings y urbanizaciones enteras.
>
> ### Cómo trabajamos
> `[Equipo propio.]` El que va a verte es el que mide, y el que mide es del equipo que ejecuta. No subcontratamos la obra a terceros, y por eso podemos dar 10 años de garantía sin letra pequeña.
>
> Cuidamos especialmente la parte que no se ve: la preparación del soporte. Es donde se decide si un pavimento aguanta 20 años o empieza a fisurarse en dos. Compactación, nivelación, drenaje y armado antes de que llegue el primer camión de hormigón.
>
> ### Por qué nos vuelven a llamar
> Más de 3 de cada 10 trabajos que hacemos son para clientes que ya nos habían contratado. Alguien que te llama por segunda vez es la única recomendación que no se puede comprar.
>
> ### También construimos pistas de pádel y pickleball
> Con la misma base técnica: solera, drenaje y superficie deportiva. Lo hacemos desde `[Pádel & Pickleball Albufera →]`

---

### 7.4 Presupuesto

> **H1: Pide presupuesto**
>
> Cuéntanos qué quieres pavimentar. Vamos a verlo sin coste y te damos un precio cerrado en `[48 horas]`.
>
> **Formulario:**
> - Nombre y apellidos *
> - Teléfono *
> - Email
> - ¿Qué quieres pavimentar? *  → *(desplegable: entrada de garaje / porche o terraza / contorno de piscina / interior de vivienda / patio o jardín / nave, parking o local / otro)*
> - Superficie aproximada en m² *  → *(campo numérico; "no lo sé" es una opción válida)*
> - Municipio *
> - Cuéntanos algo más  → *(texto libre)*
> - Sube una foto del espacio  → *(opcional; acelera muchísimo el presupuesto)*
> - ☐ He leído y acepto la política de privacidad *
>
> `[Enviar y que me llamen]`
>
> **Microcopy:**
> - Ayuda del campo de superficie: *Un cálculo aproximado nos vale. Largo × ancho.*
> - Ayuda de la foto: *Con una foto podemos darte un rango antes incluso de la visita.*
> - Estado de envío: *Enviando…*
> - Confirmación: *Recibido. Te llamamos hoy mismo si nos escribes antes de las 18:00, y mañana a primera hora si no.*
> - Error de teléfono: *Escribe un número de 9 cifras para que podamos llamarte.*
> - Error de envío: *No hemos podido enviarlo. Llámanos al `[teléfono]` o escríbenos por WhatsApp y lo resolvemos ahora.*

---

### 7.5 Metadatos

| Ruta | Title (≤60 car.) | Meta description (≤155 car.) |
|---|---|---|
| `/` | Pavimentos de hormigón en Valencia \| Pavimentos Albufera | Hormigón impreso, pulido, lavado y microcemento en Valencia, Castellón y Alicante. 17 años de obra propia y 10 de garantía. Presupuesto sin compromiso. |
| `/hormigon-impreso/` | Hormigón impreso Valencia \| Precio y acabados | Hormigón impreso para patios, entradas y piscinas. Mira los acabados reales, consulta el precio por m² y pide presupuesto sin compromiso. |
| `/hormigon-pulido/` | Hormigón pulido Valencia \| Interior e industrial | Hormigón pulido para naves, parkings, garajes e interiores de vivienda. Precio por m², ficha técnica y obras ejecutadas. |
| `/microcemento/` | Microcemento en Valencia \| Sin obra ni escombros | Renueva suelos, baños y paredes sin picar lo que ya tienes. Microcemento aplicado sobre azulejo, terrazo o gres. Precio y proyectos. |
| `/hormigon-lavado/` | Hormigón lavado y árido visto en Valencia | Pavimento antideslizante de clase 3 para zonas peatonales, piscinas y accesos. Ficha técnica, acabados y precio orientativo. |
| `/acabados/` | Muestrario de acabados de hormigón impreso | Modelos y colores sobre obra real: espiga, adoquín, sillería, manta y pizarra. Elige el acabado antes de pedir presupuesto. |
| `/precios/` | Precio del hormigón impreso por m² en 2026 | Rangos reales en la Comunidad Valenciana, qué incluye cada presupuesto y por qué desconfiar de una oferta por debajo de 20 €/m². |
| `/proyectos/` | Proyectos ejecutados \| Pavimentos Albufera | Obras de hormigón impreso, pulido y microcemento en Valencia, Alicante y Castellón. Filtra por acabado, espacio o municipio. |
| `/empresa/` | Quiénes somos \| Pavimentos Albufera | 17 años pavimentando en la Comunidad Valenciana. Equipo propio, garantía de 10 años y más de un 30 % de clientes que repiten. |
| `/presupuesto/` | Pide presupuesto sin compromiso | Cuéntanos qué quieres pavimentar. Vamos a verlo sin coste y te damos un precio cerrado en 48 horas. |

---

## 8. Sistema de diseño

### 8.1 Dirección

El material manda. Un pavimento de hormigón se juzga por su textura, su color y cómo le da la luz — así que la web debe comportarse como un muestrario de material, no como un folleto de servicios. Fotografía grande, tipografía firme y un lenguaje de fichas técnicas tomado directamente del oficio: los códigos de modelo y color que la empresa ya usa a diario.

Deliberadamente **evitamos** el registro visual de "estudio de arquitectura" (fondo crema, serif de alto contraste, acento terracota): es el acabado por defecto de cualquier web de construcción bonita en 2026, y aquí competimos por credibilidad de obra, no por sofisticación editorial.

### 8.2 Color

Tomado del propio material: hormigón fresco, hormigón curado, y el pigmento como único color saturado.

| Token | Hex | Uso |
|---|---|---|
| `--fondo` | `#E9EAE6` | Fondo general. Gris cemento curado, ligeramente frío. |
| `--fondo-alt` | `#DADCD6` | Bloques alternos y tarjetas. |
| `--tinta` | `#1B1E1C` | Texto y fondos oscuros. Negro con matiz verde de losa húmeda. |
| `--tinta-media` | `#5C625E` | Texto secundario, pies de foto. |
| `--pigmento` | `#D9A441` | **Acento único.** Ocre de la gama de pigmentos reales. CTAs, códigos activos, subrayados. |
| `--acero` | `#41535C` | Fichas técnicas, tablas, estados informativos. |

Un solo acento, usado con avaricia. Si el ocre aparece en más de dos elementos por pantalla, deja de significar "aquí se actúa".

### 8.3 Tipografía

| Rol | Fuente | Por qué |
|---|---|---|
| Display | **Archivo Expanded**, 700-800 | Grotesca ancha, de señalética industrial. Firme sin ser agresiva. |
| Texto | **Instrument Sans**, 400-600 | Legible, neutra, buena en párrafos largos en móvil. |
| Datos | **Martian Mono**, 400-500 | Para códigos de modelo y color, m², años y fichas técnicas. |

La monoespaciada es la decisión de identidad: convierte `MODELO ESPIGA · C-117 · 180 m²` en una etiqueta de especificación. Es el lenguaje real del oficio elevado a elemento gráfico, y ningún competidor lo usa.

**Escala:** 12 / 14 / 16 / 20 / 26 / 34 / 46 / 64 / 88 px. Interlineado 1,15 en display y 1,6 en texto.

### 8.4 Elemento firma

**El muestrario.** Una rejilla de acabados filtrable por modelo y color, donde cada muestra es un recorte de obra real ampliable a pantalla completa, etiquetado en monoespaciada y enlazado al proyecto donde se ejecutó. Es a la vez la mejor herramienta de venta, el mejor generador de páginas indexables y lo único que ninguna web del sector en Valencia tiene.

### 8.5 Fotografía — regla innegociable

**Cero fotos de stock de personas.** La web hermana de pádel usa retratos genéricos de banco de imágenes (`portrait-of-attractive-young-arab-man`, `black-carefree-woman-laughing`) y es lo que más resta credibilidad a un negocio de construcción. Aquí solo entra:

1. Obra terminada, a resolución mínima de 2400 px de ancho.
2. Obra en ejecución (encofrado, extendido, impresión con molde). Este material vende más de lo que se cree: demuestra que se ejecuta de verdad.
3. Detalle macro de textura para el muestrario.
4. Fotos del equipo real, si están dispuestos.

**Nomenclatura de archivo obligatoria:** `municipio-servicio-modelo-color-año.jpg` → `moncada-impreso-espiga-117-2025.jpg`. Sirve de SEO de imagen y de sistema de archivo interno.

### 8.6 Movimiento

Contenido. Aparición suave de secciones al hacer scroll (una vez, sin repetir), transición de la rejilla del muestrario al filtrar, y sombra de la barra fija en móvil al despegarse del hero. Nada más. `prefers-reduced-motion` respetado.

### 8.7 Suelo de calidad

- Diseño móvil primero: la mayoría del tráfico del sector llega desde el móvil.
- Barra fija inferior con `Llamar` y `WhatsApp` en móvil, siempre visible.
- Foco de teclado visible en todos los elementos interactivos.
- Contraste mínimo AA. El ocre `#D9A441` **no** cumple sobre fondo claro para texto pequeño: usarlo solo en fondos oscuros, en superficies grandes o como color de relleno de botón con texto en `--tinta`.
- Objetivos táctiles de 44 px mínimo.

---

## 9. Especificación técnica

### 9.1 Stack

| Pieza | Elección | Motivo |
|---|---|---|
| Framework | Next.js 15, App Router | Lo que ya usáis |
| Renderizado | SSG + ISR | Web casi estática; velocidad máxima y coste mínimo |
| Estilos | Tailwind con tokens propios | Los tokens de §8.2 como variables CSS |
| Contenido | MDX en repositorio, o Sanity/Payload si el cliente edita | Ver decisión en §11 |
| Imágenes | `next/image` + AVIF/WebP | Sustituye a ShortPixel |
| Formularios | Server Actions + Resend + honeypot y límite de envíos | Sin plugins |
| Despliegue | Vercel | Coherente con la infraestructura actual |
| Analítica | GA4 + Search Console + consentimiento conforme al RGPD | Hoy no hay nada |

### 9.2 Modelo de datos

```ts
type Proyecto = {
  slug: string
  titulo: string
  municipio: string
  provincia: 'Valencia' | 'Castellón' | 'Alicante' | string
  servicio: ServicioId
  modelo?: string      // 'espiga' | 'adoquin-irregular' | 'silleria' | 'manta' | ...
  color?: string       // '117' | '107' | '113' | 'arena' | 'gris'
  superficie?: number  // m²
  anio: number
  plazoDias?: number
  encargo: string
  ejecucion: string
  imagenes: { src: string; alt: string; tipo: 'final' | 'proceso' | 'detalle' }[]
  destacado: boolean
}

type Acabado = {
  slug: string
  modelo: string
  color: string
  servicio: ServicioId
  muestra: string        // imagen de detalle
  proyectos: string[]    // slugs
}
```

Con estos dos tipos se generan automáticamente `/proyectos/[slug]`, `/acabados/[modelo]`, `/zonas/[municipio]` y los filtros. Los datos de cada obra ya existen: están en los títulos de las entradas actuales.

### 9.3 Datos estructurados (hoy inexistentes)

- `LocalBusiness` / `HomeAndConstructionBusiness` en todas las páginas: NAP único, horario, zona de servicio, coordenadas.
- `Service` en cada página de servicio.
- `FAQPage` en home y en cada servicio.
- `BreadcrumbList` en todo el sitio.
- `ImageObject` en las fichas de proyecto.
- `AggregateRating` **solo cuando haya reseñas reales verificables**. Marcarlo sin ellas es una penalización segura.

### 9.4 Rendimiento — objetivos

LCP < 2,0 s en 4G · CLS < 0,05 · INP < 200 ms · JS inicial < 100 KB comprimido.
La web actual, con Elementor y tema Bizberg, está muy lejos de esto. Es la ganancia más automática de la migración.

### 9.5 Migración de imágenes — bloqueante

Las imágenes en producción están a 500×400 px. Para el nuevo diseño hacen falta **los originales de cámara o de WhatsApp sin comprimir**. Si no existen, hay dos caminos: reescalado con IA (resultado desigual, no recomendable para el muestrario) o una sesión fotográfica nueva en `[2-3]` obras recientes. Esto condiciona el calendario: conviene resolverlo antes de empezar a maquetar.

---

## 10. Plan de ejecución

| Fase | Trabajo | Depende de |
|---|---|---|
| **0. Prerrequisitos** | Cerrar NAP único, decidir francés / pádel / caucho, reunir originales fotográficos, activar Google Business Profile y pedir reseñas | **Tú** |
| **1. Contenido** | Copy definitivo de los 6 servicios, fichas de las 11 obras existentes, rangos de precio validados | Fase 0 |
| **2. Diseño** | Sistema de tokens, maquetas de home, servicio y proyecto, muestrario | Fase 0 |
| **3. Desarrollo** | Next.js, modelo de datos, plantillas, formulario, schema | Fases 1-2 |
| **4. SEO técnico** | Redirecciones, sitemap generado, robots, canónicas, `trailingSlash` | Fase 3 |
| **5. Lanzamiento** | Comprobación de las 301 una a una, GA4, Search Console, envío de sitemap | Fase 4 |
| **6. Seguimiento** | Vigilar posiciones y errores 404 durante 8 semanas | Post |

### Comprobaciones antes de publicar

- [ ] Las `[casillas]` del copy están todas rellenas con datos reales
- [ ] Un solo teléfono y una sola dirección en todo el sitio
- [ ] Las 30 redirecciones responden 301 y no 302 ni 404
- [ ] Ninguna página huérfana de la versión francesa sigue indexada
- [ ] Sitemap generado por Next.js, no manual
- [ ] Sin `AggregateRating` si no hay reseñas verificables
- [ ] Formulario probado: envío correcto, error, spam y adjunto pesado
- [ ] WhatsApp abre con mensaje predefinido
- [ ] Prueba real en un móvil de gama media con 4G

---

## 11. Lo que necesito de ti para cerrar el documento

**Bloqueantes** — sin esto no se puede publicar:

1. **NAP definitivo.** Un teléfono, una dirección, un email.
2. **Reseñas.** Es el vacío más grave de toda la web. Necesitas Google Business Profile activo y pedir reseña a los clientes de los últimos 12 meses. Con 15-20 reseñas reales el sitio cambia de categoría.
3. **Originales fotográficos** a resolución completa.
4. **Validación de los rangos de precio** de §7.1. Los que he puesto son coherentes con el mercado 2026 en la Comunidad Valenciana, pero tienen que ser vuestros.

**Decisiones** — condicionan la arquitectura:

5. ¿La versión francesa se elimina o se traslada a dominio propio?
6. ¿Los pavimentos de caucho se mantienen como "Obra pública" o se retiran?
7. ¿Se mantienen las URLs de servicio actuales (riesgo cero) o se simplifican como propongo?
8. ¿Quién edita el contenido después? Si es un perfil no técnico, hace falta CMS (Sanity o Payload); si lo lleváis vosotros, MDX en el repositorio sale más barato y más rápido.
9. ¿"Tú" o "usted"?

**Datos que faltan** — mejoran el resultado:

10. ¿Ejecución con equipo propio o se subcontrata? Cambia uno de los cinco mensajes núcleo.
11. Metros cuadrados totales ejecutados en 17 años, aunque sea aproximado. Es un dato con mucha fuerza.
12. Año exacto de fundación.
13. Plazo real de entrega de presupuesto.
14. Nombre fiscal y CIF para los textos legales y el schema.
15. Municipios donde hay obra ejecutada y documentada, para decidir qué páginas de zona se crean.

Con los puntos 1, 4, 5, 6, 9 y 10 cerrados puedo completar el copy íntegro de los seis servicios y dejar el documento listo para pasar a diseño y desarrollo.
