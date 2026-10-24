---
title: "Estudio de Keywords — Pavimentos Albufera (IOSIF)"
tags: [seo, keywords, hormigon-impreso, pavimentos-albufera, iosif]
proyecto: IOSIF
sitio: pavimentos-albufera.com
depende_de: "[[SEO-Local-Contexto-Claude-Code]]"
fecha: 2026-09-23
estado: borrador-para-revision
---

# Estudio de Keywords — Pavimentos Albufera

> [!IMPORTANT] Cómo usar este documento (dirigido al agente de Claude Code)
> Este documento es NORMATIVO. Antes de tocar nada:
> 1. Lee primero [[SEO-Local-Contexto-Claude-Code]] (los raíles). Recuerda: 60-70% de contenido único por página de localidad, mínimo 3 bloques con material real (fotos propias, m², color/modelo, municipio), publicar por tandas de 5-10 páginas, NAP desde fuente única `lib/business.ts`, schema `HomeAndConstructionBusiness` + `Service`, SIN `AggregateRating` de terceros.
> 2. Antes de crear CADA página nueva, explica a Ysst qué keyword ataca y por qué, y espera confirmación.
> 3. NUNCA decides arquitectura ni rutas nuevas por tu cuenta. Lo que no esté cerrado va marcado como **DECISIÓN ABIERTA**.
> 4. Los volúmenes de búsqueda de este documento son ESTIMACIONES (no hay datos públicos verificables). Están marcados con nivel Alta/Media/Baja/Muy baja. No los presentes como cifras exactas a Ysst.

---

## 0. Limitaciones y fiabilidad de los datos

- **Volúmenes**: no existen cifras públicas y verificables de volumen mensual para "hormigón impreso", "hormigón pulido" o "microcemento" en España. Se confirmó tras búsqueda dedicada que estas cifras viven detrás de herramientas de pago (Semrush, Ahrefs, Ubersuggest, Keyword Planner) y ningún artículo público las cita en abierto para estas keywords. **Todos los volúmenes aquí son estimaciones cualitativas** basadas en: número y agresividad de competidores, densidad de páginas programáticas, presencia de portales de leads, y señales de demanda. Como señal indirecta de demanda, Habitissimo declara **+2.181 opiniones verificadas** en la categoría hormigón impreso y **+24.431 solicitudes de presupuesto** en hormigón pulido — útil como termómetro relativo, no como volumen de búsqueda. **DECISIÓN ABIERTA**: si Ysst tiene acceso a Semrush/Ahrefs, volcar volúmenes reales España + provincia y sustituir estimaciones.
- **Estacionalidad**: no hay export numérico de Google Trends publicado para el sector, pero fuentes del sector coinciden en el patrón (ver §3).
- **SERP**: análisis basado en las SERP observadas en el momento de redacción. Las SERP cambian; reverificar antes de publicar cada tanda.
- **Verificado vs estimado**: marco cada dato. "✓ verificado" = observado directamente en web/fuente citada. "≈ estimación" = juicio del analista.

---

## 1. Contexto del negocio

**Empresa**: Pavimentos Albufera S.L. (NIF B02882090), constituida ~2021, domicilio fiscal Calle Holanda, Pol. Industrial Olivarons, Sollana (46430), Valencia. CNAE 4101/revocamiento. 3 empleados (2024), 2 administradores. ✓ verificado (Axesor/eInforma/Empresite).

**Servicios (rutas actuales web nueva)** ✓ verificado:
- `/hormigon-impreso/` — el más pedido para exterior
- `/hormigon-pulido/` — nave industrial a salón
- `/hormigon-fratasado/` — fino, mate, económico
- `/hormigon-lavado/` — árido visto, antideslizante
- `/hormigon-desactivado/` — piedra vista
- `/microcemento/` — sobre azulejo/gres sin picar
- `/acabados/` y `/acabados/[modelo]/` — muestrario (espiga C-117, adoquin-irregular C-107, adoquin-pequeno ARENA, manta GRIS)
- `/proyectos/[slug]/`, `/empresa/`, `/blog/`, `/presupuesto/`

**Diferenciales** (argumentario de la home) ✓ verificado:
- 17 años de oficio
- Obra con equipo propio
- Garantía de 10 años con mantenimiento (resellado) incluido
- Más de 3 de cada 10 clientes repiten\[1\]
- Posicionamiento de ticket alto: la FAQ argumenta contra presupuestos de 18 €/m² ("a ese precio no salen los materiales de una solera de 10 cm con mallazo y fibra")\[1\]

**Cobertura declarada** ✓ verificado:
- Sin desplazamiento: Valencia, Castellón, Alicante
- Con desplazamiento (a partir de 100 m²): Murcia, Albacete, Almería, Tarragona, Teruel
- Resto de España: proyectos de volumen

**Tabla de proyectos documentados (web nueva)** ✓ verificado:

| Proyecto (slug) | Municipio | Provincia | Servicio | Modelo/Color | m² | Año |
|---|---|---|---|---|---|---|
| moncada-impreso-espiga-117 | Moncada | Valencia | Impreso | Espiga · C-117 | 180 | 2025 |
| alzira-impreso-adoquin-irregular-107 | Alzira | Valencia | Impreso | Adoquín irregular · C-107 | ? | ? |
| moraira-impreso-adoquin-arena | Moraira (Teulada) | Alicante | Impreso | Adoquín pequeño · Arena | ? | 2025 |
| denia-impreso-piedra-inglesa | Dénia | Alicante | Impreso | Piedra inglesa · gris y crema | ? | ? |
| corbera-fratasado-arena | Corbera | Valencia | Fratasado | Arena | ? | ? |
| impreso-manta-gris | ? (sin municipio) | ? | Impreso | Manta roca montaña · gris | ? | ? |
| ribarroja-pulido | Riba-roja de Túria | Valencia | Pulido | Gris (planta aparcamiento) | ? | ? |
| xabia-pulido | Xàbia | Alicante | Pulido/fratasado | Crema 117 | 120 | ?\[2\] |
| godella-lavado-arido-visto | Godella | Valencia | Lavado | Gris (árido visto) | ? | ? |

Proyectos adicionales en web antigua / pavivasa.com ✓ verificado: **Llíria** (impreso sillería C-107), **Calpe**, **Olocau**, **Benissa** (adoquín belga gris oscuro), **Montaberner** (piedra inglesa). Los `?` deben pedirse a Ysst (m² y año reales) antes de completar cada ficha — no inventar.

**Home organizada por espacios** (tarjetas que NO enlazan a página propia) ✓ verificado: entrada de garaje, porche y terraza, contorno de piscina, interior de vivienda, patio y jardín, nave/parking/local. → Oportunidad de cluster "soluciones por espacio" (§4.3).

---

## 2. Bloqueantes previos (TANDA 0 — resolver antes de crear contenido nuevo)

### 2.1 Marcadores de plantilla visibles en producción ✓ verificado
En la home aparecen literalmente: `[180] m²`, `[m²]`, `[año]`, `[municipio]`, `[provincia]`, `[48 horas]`, `[Equipo propio]`, `[100] m²`, y `PENDIENTE · ORIGINAL A 1600 PX` (proyecto Xàbia).

**Acción**: sustituir todos por valores reales pedidos a Ysst, o por copy neutro si el dato no existe. Ningún corchete `[...]` puede quedar en producción.

**Comando de verificación** (ejecutar en el repo antes de cada deploy):
```bash
# Marcadores de plantilla en el código fuente
grep -rnE "\[(m²|año|municipio|provincia|[0-9]+ ?(horas|m²)?|Equipo propio)\]" src/ app/ content/ 2>/dev/null
grep -rn "PENDIENTE\|ORIGINAL A 1600\|Lorem ipsum\|lorem ipsum" src/ app/ content/ 2>/dev/null
# Verificación en producción (repetir por cada ruta clave)
curl -s https://www.pavimentos-albufera.com/ | grep -oE "\[[a-zA-Z0-9 ²]+\]" | sort -u
```

### 2.2 Canibalización entre tres dominios del mismo negocio ✓ verificado
Mismo negocio (misma dirección Sollana, mismos proyectos Dénia/Moraira/Llíria/Calpe/Benissa), tres dominios:
- **pavimentos-albufera.com** — web nueva Next.js (activa, la buena). NAP: 643 647 915, comercial@pavimentos-albufera.com.
- **pavivasa.com** — WordPress antiguo, marca Pavivasa. NAP: 627 66 31 46, gabriel.pavivasa@gmail.com, Calle Blasco Ibáñez 16. Cubre: /hormigon-impreso (ficha Benissa), /hormigon-pulido-xabia/, /hormigon-lavado (Godella), /hormigon-impreso-denia/, categoría /hormigon-impreso/ (Llíria, Benissa, Montaberner), /servicios/pavimentos-de-hormigon-pulido/.
- **hormigon-impreso-valencia.es** — WordPress casi idéntico a pavivasa.com (mismas fichas Denia, mismo NAP 627 66 31 46). Cubre servicios genéricos + fichas de municipio.

**Problema**: los tres compiten por las mismas keywords y diluyen autoridad. Contenido casi duplicado entre pavivasa.com y hormigon-impreso-valencia.es.

**Acción recomendada** (DECISIÓN ABIERTA — requiere confirmación de Ysst sobre propiedad de dominios y acceso a hosting/DNS):
1. Elegir pavimentos-albufera.com como dominio canónico único.
2. Migrar el contenido con obra real (fichas Denia, Moraira, Llíria, Calpe, Benissa, Montaberner, Godella, Xàbia) a proyectos/fichas del dominio nuevo.
3. Redirección 301 dominio-a-dominio: pavivasa.com/* y hormigon-impreso-valencia.es/* → equivalentes en pavimentos-albufera.com (mapa en §2.3). Mientras no se migren, 301 a la home o al servicio equivalente.
4. **No** dejar los tres indexables simultáneamente.

### 2.3 URLs antiguas de WordPress indexadas → mapa de 301
URLs antiguas detectadas (site: y navegación) ✓ verificado parcialmente. Varias siguen respondiendo 200 en pavimentos-albufera.com (WordPress viejo aún servido en algunas rutas: /contacto/, /galeria/, /pavimentos-de-caucho/, fichas antiguas). **Mapa propuesto de 301** (revisar/confirmar destino con Ysst):

| URL antigua | 301 → destino |
|---|---|
| /pavimentos-de-hormigon-impreso/ | /hormigon-impreso/ |
| /pavimentos-de-hormigon-pulido/ | /hormigon-pulido/ |
| /pavimentos-de-hormigon-lavado/ | /hormigon-lavado/ |
| /microcemento-decorativo/ | /microcemento/ |
| /pavimentos-de-hormigon-valencia/ | /empresa/ |
| /contacto/ | /presupuesto/ |
| /galeria/ | /proyectos/ |
| /pavimentos-de-hormigon-impreso-en-denia/ | /proyectos/denia-impreso-piedra-inglesa/ |
| /hormigon-pulido-en-xabia/ | /proyectos/xabia-pulido/ |
| /hormigon-impreso-en-modelo-espiga-y-color-117-proyecto-en-moncada-valencia/ | /proyectos/moncada-impreso-espiga-117/ |
| /hormigon-impreso-en-moraira/ | /proyectos/moraira-impreso-adoquin-arena/ |
| /hormigon-impreso-en-color-gris-modelo-manta-imitacion-roca-de-montana/ | /proyectos/impreso-manta-gris/ |
| /pavimentos-de-caucho/ | **NO redirigir a un servicio** → 301 a /empresa/ o 410 (fuera de dominio, §4.10) |
| /pistas-de-padel-y-pickleball/ | 301 a padelalbufera.com (dominio distinto del cliente) o 410 |
| /fr/... | 301 a equivalente ES o 410 si no habrá versión FR |

**Comando de verificación de 301** (por cada fila):
```bash
curl -sI https://www.pavimentos-albufera.com/pavimentos-de-hormigon-impreso/ | grep -iE "HTTP/|location"
# Esperado: HTTP/2 301  +  location: https://www.pavimentos-albufera.com/hormigon-impreso/
```
Además: generar/verificar `sitemap.xml` sin URLs antiguas y `robots.txt` correcto; revisar Search Console → Cobertura para detectar URLs WordPress aún indexadas.

### 2.4 NAP inconsistente ✓ verificado
Teléfonos dispersos: **643 647 915** (web nueva), 627 66 31 46 (pavivasa/WordPress), 672 44 94 46, 614 207 633, 622 067 884 (directorios/registro). Direcciones: Calle Blasco Ibáñez 16 y Calle Holanda / Calle Irlanda (Pol. Olivarons), ambas en Sollana. Emails: comercial@pavimentos-albufera.com, pavialbufera@gmail.com, gabriel.pavivasa@gmail.com.

**Acción**:
1. Definir NAP canónico ÚNICO en `lib/business.ts` (DECISIÓN ABIERTA: confirmar con Ysst; probablemente 643 647 915 + comercial@ + dirección fiscal Calle Holanda).
2. Toda la web consume de esa fuente. Schema `HomeAndConstructionBusiness` con ese NAP.
3. Homogeneizar NAP en Google Business Profile, Facebook y directorios (Empresite, Axesor, eInforma, infoisinfo, directoriocys, Habitissimo). El GBP es prioritario para el Local Pack.

### 2.5 Canibalización interna: lavado vs desactivado vs árido visto ✓ verificado
"Hormigón lavado", "hormigón desactivado" y "árido visto" son sinónimos comerciales en el sector. La web tiene DOS páginas separadas (`/hormigon-lavado/` y `/hormigon-desactivado/`) que competirán entre sí.

**Acción recomendada** (DECISIÓN ABIERTA): consolidar en una sola página pilar (p. ej. `/hormigon-lavado/` como principal, tratando "árido visto" y "desactivado" como secundarias dentro), y 301 de la otra. Alternativa si Ysst quiere mantener ambas: diferenciar intención (lavado = técnica de lavado del árido; desactivado = con retardante/desactivante) con 60-70% de contenido único cada una y enlace cruzado explícito. No dejar dos páginas casi iguales.

---

## 3. Mapa del mercado de búsqueda

### Hallazgos clave
1. **SERP de servicio+provincia ("hormigón impreso Valencia") muy competida** por: dominios de coincidencia exacta antiguos (hormigonimpresovalencia.es, hormigonimpresovalencia.eu, impresovalencia.es), fabricante Topciment (delegación Valencia), portales de leads (Habitissimo, Milanuncios) y agregadores (infoisinfo, laguiavalencia.com). Dificultad ≈ Alta.
2. **SERP de servicio+municipio pequeño MUCHO más débil** ✓ verificado (hipótesis confirmada): dominada por páginas programáticas de empresas de otras zonas (generalpavimentos.com, paviadri.com, pavimentoindustrial.pro, hormigondecor.es, pavicost.com), blogs gratuitos antiguos (WordPress, jimdofree) y directorios. **Ninguna tiene obra real documentada en el municipio.** → Una ficha con foto propia + m² + color + municipio gana con relativa facilidad. Es la mayor oportunidad.
3. **Portales de leads** (Habitissimo, Cronoshare, Reformundo) capturan mucha intención transaccional y venden el lead a varias empresas. Difícil desbancarlos; mejor capturar la búsqueda antes (contenido propio) o competir en municipio/nicho donde no rankean fuerte.
4. **Fabricantes** (Topciment, Grupo Puma/Weber vía CYPE Generador de Precios) rankean en informacional y precio, no en "contratar en X municipio".
5. **SERP features**: precio y "cuánto cuesta" disparan **AI Overview** y **People Also Ask**; "empresa/servicio + municipio" disparan **Local Pack** (de ahí la importancia del GBP); "modelos/colores" disparan **imágenes** y Pinterest. Los vídeos tienen poca presencia.

### Estacionalidad (para calendario de publicación)
No hay export numérico de Google Trends publicado, pero fuentes del sector coinciden: **la demanda de pavimentación exterior se concentra en primavera y verano** ("Todos quieren su obra lista para el verano"; se recomienda contratar en febrero-marzo para ejecutar en abril). Patrón: pico de interés de marzo a junio, sostenido en verano; valle en otoño-invierno (noviembre-febrero).

**Regla de calendario para el agente**:
- Publicar/reforzar clusters de **impreso exterior, piscina, terraza, jardín** entre **enero y abril** (el SEO tarda 2-3 meses en madurar; hay que adelantarse a la demanda de verano).
- **Microcemento e interior/industrial** son menos estacionales → rellenan otoño-invierno.
- Mantenimiento/resellado tiene pico secundario en primavera (preparar para verano).

---

## 4. Clusters de keywords → páginas

Intención: **T**=transaccional, **C**=comercial (investiga antes de contratar), **I**=informacional, **L**=local. Volumen y dificultad son ≈ estimaciones salvo indicación. Prioridad P1 (ya) → P4 (largo plazo).

### 4.1 Pilares de servicio (OPTIMIZAR, no crear)

| Keyword principal | Secundarias | Int. | Vol. ≈ | Dif. ≈ | Página destino | Prio |
|---|---|---|---|---|---|---|
| hormigón impreso | cemento impreso, hormigón estampado, pavimento impreso | C/T | Alta | Alta | /hormigon-impreso/ (existe) | P1 |
| hormigón pulido | cemento pulido, pulido industrial | C/T | Alta | Alta | /hormigon-pulido/ (existe) | P1 |
| microcemento | microcemento suelos/paredes/baños | C/T | Alta | Alta | /microcemento/ (existe) | P1 |
| hormigón fratasado | solera fratasada, hormigón raseado | C | Media | Media | /hormigon-fratasado/ (existe) | P2 |
| hormigón lavado | árido visto, hormigón desactivado, lavado de árido | C | Media | Media | /hormigon-lavado/ (consolidar §2.5) | P2 |

**Acción**: optimizar, no crear. Cada pilar necesita title/H1 con keyword, secciones de proceso, ventajas, dónde se usa, precio orientativo, FAQ, y enlaces a proyectos reales de ese servicio + soluciones por espacio + acabados.

### 4.2 Precio (imán de tráfico + AI Overview)

| Keyword principal | Secundarias | Int. | Vol. ≈ | Dif. ≈ | Página destino | Prio |
|---|---|---|---|---|---|---|
| precio hormigón impreso m2 | cuánto cuesta hormigón impreso, presupuesto hormigón impreso | C/T | Alta | Media-Alta | Sección precio en /hormigon-impreso/ o artículo blog | P1 |
| precio hormigón pulido m2 | hormigón pulido exterior precio | C | Media | Media | /hormigon-pulido/ + blog | P2 |
| precio microcemento m2 | cuánto cuesta microcemento | C | Media | Media | /microcemento/ + blog | P2 |
| precio hormigón impreso Valencia | — | C/L | Baja-Media | Media | Bloque en pilar/hub Valencia | P2 |

**Rangos de mercado 2026 (referencia, NO precios de la empresa)** ✓ verificado con fuentes nombradas:
- **Hormigón impreso: 20-35 €/m²** para proyectos residenciales estándar según Pavimentos España (guía 2026): *"El precio medio del hormigón impreso en España para 2026 oscila entre los 20€ y 35€ por metro cuadrado"* (incluye material, mano de obra y resina de sellado). Cronoshare fija la franja más habitual en *"20 €/m2 y 25 €/m2"* (rango total 15-30 €/m²). En superficies pequeñas (<50 m²) o diseños complejos otras fuentes suben hasta 55-75 €/m².
- **Aviso de mercado (refuerza el argumentario anti-18€/m² de la empresa)**: confirmado por Impresol/HormigónPro (2026): *"En 2026, solo el hormigón de planta (H-200) cuesta ya entre 10 y 13 €/m² al aplicarlo a 10 cm de espesor. Un presupuesto de 20 €/m² o menos casi no cubre ni los materiales."*
- **Hormigón pulido**: Habitissimo (guía 2026): *"una solera de 10 cm de grosor de hormigón pulido puede costar de media alrededor de 32 €/m²"*; Durasol sitúa la instalación completa en *"entre 20 € y 45 €/m²"* (media nacional 28-32 €/m²).
- **Fratasado y lavado/desactivado**: generalmente por debajo del impreso (más económicos); rango medio.
- **Microcemento aplicado**: Habitissimo: *"El precio del microcemento por m² se sitúa entre los 50 € y 120 € por metro cuadrado"*; Cronoshare: *"oscila entre los 35 y los 100 €/m2"* (habitual 50-60 €/m²).
- **Encimeras de microcemento**: por metro lineal, no por m². Reforma Integrales Las Rozas: *"pueden costar fácilmente más de 120€ por metro lineal"* (algunas fuentes citan 180-350 €/ml para acabados premium — reverificar antes de publicar).
- **Resellado/mantenimiento**: ≈ 6-10 €/m² (referencia de mercado).
- **Referencia técnica de unidad de obra** (CYPE Generador de Precios, formigó imprès exterior 10 cm): **≈ 33-44 €/m²** según fabricante (Weber ~33 €/m², otras variantes hasta ~44 €/m²). Es la referencia más precisa y neutra del documento.

**Regla para el agente**: presentar SIEMPRE como "precio de mercado orientativo, no es nuestra tarifa; damos precio cerrado tras visita". Usar el argumentario anti-18€/m² con la cita de Impresol/HormigónPro. Ideal para captar AI Overview con tabla clara + `FAQPage`.

### 4.3 Soluciones por espacio (NUEVO — enlazar desde las tarjetas de la home)

Ruta propuesta: `/soluciones/[espacio]/`. Las tarjetas de la home ya existen pero no enlazan; deben enlazar aquí. **DECISIÓN ABIERTA**: confirmar con Ysst el prefijo `/soluciones/` (alternativa `/para/[espacio]/`).

| Espacio (slug) | Keyword principal | Secundarias | Int. | Vol. ≈ | Dif. ≈ | Prio |
|---|---|---|---|---|---|---|
| entrada-garaje | hormigón impreso entrada garaje | rampa garaje hormigón, acceso coche | C | Media | Baja-Media | P2 |
| porche-terraza | hormigón impreso terraza | suelo terraza exterior, pavimento porche | C | Media-Alta | Media | P1 |
| piscina | hormigón impreso piscina | pavimento antideslizante piscina, contorno piscina | C | Media-Alta | Media | P1 |
| interior-vivienda | microcemento suelo interior | hormigón pulido salón, suelo continuo interior | C | Media | Media | P2 |
| patio-jardin | hormigón impreso jardín | pavimento patio, camino jardín | C | Media | Baja-Media | P2 |
| nave-parking-local | pavimento nave industrial | solera nave, suelo parking, hormigón pulido nave | C/T | Media | Media | P2 (ver §4.9) |

Cada página de espacio: contenido único, fotos propias de ese uso, qué acabado recomienda la empresa, ventajas específicas (antideslizante en piscina, resistencia a coches en garaje), enlace a pilares + proyectos reales de ese espacio + presupuesto.

### 4.4 Servicio + municipio (la gran oportunidad — reglas estrictas)

**Regla de decisión (anti-doorway, cumplir raíles):**
- **1 proyecto real en el municipio** → optimizar la FICHA de proyecto existente para "servicio + municipio" (no crear hub). Ej.: Moncada, Alzira, Corbera, Riba-roja, Godella, Dénia, Moraira, Xàbia.
- **2+ proyectos reales O demanda validada** → crear hub `/hormigon-impreso/[localidad]/` con mínimo 3 bloques de material real (proyectos, m², colores, fotos). Hoy **ningún municipio tiene 2+ proyectos documentados** → de momento NO se crea ningún hub hasta que Ysst aporte más obra o valide demanda.
- Nunca páginas de municipio sin obra ni material real (doorway → penalización).

**Tiers de municipios** (por cercanía a Sollana / Ribera + obra existente):

- **Tier 1 (núcleo Ribera Baixa/Alta, base operativa — prioridad L)**: Sollana (sede), Sueca, Cullera, Alzira ✓obra, Algemesí, Silla, Almussafes, Benifaió, Corbera ✓obra. → Empezar optimizando fichas con obra; Sollana/Sueca/Cullera merecen contenido aunque haya que pedir obra a Ysst.
- **Tier 2 (Horta + Camp de Túria, obra dispersa)**: Torrent, Moncada ✓obra, Godella ✓obra, Riba-roja ✓obra, Llíria ✓obra(antigua), Paterna, Bétera, Picassent.
- **Tier 3 (Marina Alta, Alicante — obra real, ticket alto)**: Dénia ✓obra, Xàbia ✓obra, Moraira/Teulada ✓obra, Calpe ✓obra(antigua), Benissa ✓obra(antigua). → Alto valor (chalets, mercado internacional).
- **Tier 4 (resto con desplazamiento)**: Gandia, Ontinyent, Xàtiva y núcleos turísticos. Solo con demanda validada.

| Patrón keyword | Int. | Vol. ≈ | Dif. ≈ | Página destino | Prio |
|---|---|---|---|---|---|
| hormigón impreso + [municipio Tier1/3 con obra] | L/T | Baja | Baja | Ficha proyecto optimizada | P1 |
| hormigón impreso Sueca / Cullera / Sollana | L/T | Baja | Baja | Hub futuro (pedir obra) | P2 |
| hormigón impreso Dénia / Xàbia / Moraira | L/T | Baja-Media | Baja-Media | Ficha proyecto optimizada | P1 |
| hormigón pulido + [municipio con obra] | L | Muy baja | Baja | Ficha proyecto | P3 |

**Variantes valencianas**: "formigó imprès", "paviment de formigó" tienen volumen muy bajo (la mayoría busca en castellano incluso en zona valencianoparlante). No crear páginas propias en valenciano; sí incluir el término una vez en el cuerpo de las páginas de municipio valencianoparlante (Sueca, Cullera, Xàbia) como señal semántica.

### 4.5 Mantenimiento (separar CONTRATAR servicio vs comprar resina DIY)

| Keyword principal | Secundarias | Int. | Vol. ≈ | Dif. ≈ | Página destino | Prio |
|---|---|---|---|---|---|---|
| resellado hormigón impreso | mantenimiento hormigón impreso, cada cuánto resellar | C/T | Media | Baja-Media | Nueva /hormigon-impreso/mantenimiento/ o servicio | P2 |
| restaurar/reparar hormigón impreso | hormigón impreso descolorido, blanco, agrietado, resbala | C/I | Media | Baja | Artículo blog + CTA servicio | P2 |
| recuperar color hormigón impreso | hormigón impreso descolorido solución | I/C | Media | Baja | Blog → CTA | P3 |

**Regla crítica**: la SERP de reparación está llena de tiendas que venden **resina para hacerlo uno mismo** (resinahormigonimpreso.com, berkiclean, microcementosonline, resinatuhormigonimpreso). La empresa NO vende resina; ofrece el SERVICIO. El contenido debe captar al que quiere CONTRATAR ("te lo reseramos nosotros, incluido en garantía") y NO competir por "comprar resina hormigón impreso" (excluir, §5). Enganchar con el diferencial: "el mantenimiento también es nuestro".

### 4.6 Acabados / modelos / colores

| Keyword principal | Secundarias | Int. | Vol. ≈ | Dif. ≈ | Página destino | Prio |
|---|---|---|---|---|---|---|
| modelos hormigón impreso | moldes hormigón impreso | C/I | Media | Media | /acabados/ (existe) | P2 |
| hormigón impreso imitación madera | efecto madera | C | Media | Media | /acabados/[modelo madera] (crear ficha) | P2 |
| hormigón impreso piedra inglesa | — | C | Baja | Baja | /acabados/piedra-inglesa/ | P2 |
| hormigón impreso espiga | ladrillo espiga | C | Baja | Baja | /acabados/espiga/ (existe) | P3 |
| hormigón impreso adoquín | adoquín belga/irregular | C | Baja | Baja | /acabados/adoquin-*/ (existe) | P3 |
| colores hormigón impreso | carta colores, color arena, gris | C/I | Media | Baja-Media | /acabados/ + guía color | P2 |

**Nota**: los modelos con demanda (madera, piedra inglesa, pizarra) merecen ficha `/acabados/[modelo]/` con obra real cuando exista. La imitación madera es de las más buscadas.\[3\] Enlazar cada acabado a los proyectos que lo usan.

### 4.7 Informacional / blog (para convertir)

| Keyword principal | Int. | Vol. ≈ | Dif. ≈ | Página destino | Prio |
|---|---|---|---|---|---|
| hormigón impreso o baldosa | I/C | Media | Baja | Blog comparativa | P2 |
| hormigón impreso vs pulido exterior | I | Baja-Media | Baja | Blog | P3 |
| por qué se agrieta el hormigón impreso | I | Media | Baja | Blog → CTA (refuerza "bien ejecutado no se agrieta") | P2 |
| cuánto dura el hormigón impreso | I | Media | Baja | Blog | P2 |
| cada cuánto resellar hormigón impreso | I | Baja | Baja | Blog/FAQ | P3 |
| microcemento en exterior | I/C | Media | Baja-Media | Blog + /microcemento/ | P3 |
| hormigón impreso sobre suelo existente | I | Baja | Baja | FAQ/blog | P3 |

**Regla**: cada artículo termina con CTA a presupuesto y enlaza al pilar/servicio relevante. "Por qué se agrieta / cuánto dura" son ideales para reforzar el argumentario de calidad frente a los baratos y captar AI Overview (respuesta directa arriba).

### 4.8 Inglés Marina Alta (DECISIÓN ABIERTA)

Mercado real: Xàbia/Jávea, Dénia, Moraira, Calpe, Benissa, Altea — muchos propietarios internacionales, ticket alto, y la empresa YA tiene obra allí (Dénia, Xàbia, Moraira, Calpe, Benissa).

| Keyword | Int. | Vol. ≈ | Dif. ≈ | Prio |
|---|---|---|---|---|
| stamped concrete Javea / Costa Blanca | C/T | Baja-Media | Media | DECISIÓN ABIERTA |
| pattern imprinted concrete Costa Blanca | C | Baja | Media | DECISIÓN ABIERTA |
| polished concrete / microcement Costa Blanca | C | Baja | Media | DECISIÓN ABIERTA |

Competidores en inglés ✓ verificado: PB Paving (pbpavingspain.com), Costa Reno, Bombeos de Hormigón Costa Blanca, Creative Concrete. Hay hueco pero exige versión EN bien hecha (no traducción automática) y decidir arquitectura i18n (Next.js App Router soporta `/en/`). **DECISIÓN ABIERTA**: ¿se abre subcarpeta `/en/` con 3-5 páginas (home, stamped concrete, pool surrounds, projects Marina Alta) o se pospone? Implica mantenimiento bilingüe; no decidir sin Ysst.

### 4.9 Industrial B2B (alto ticket, menos estacional)

| Keyword principal | Secundarias | Int. | Vol. ≈ | Dif. ≈ | Página destino | Prio |
|---|---|---|---|---|---|
| pavimento industrial Valencia | suelo industrial, pavimento continuo | C/T | Media | Alta | Nueva /pavimento-industrial/ o sección /hormigon-pulido/ | P3 |
| hormigón pulido nave industrial | solera nave, suelo nave | C/T | Media | Media-Alta | /soluciones/nave-parking-local/ | P2 |
| suelo parking comunitario | pavimento garaje comunidad | C/T | Baja | Media | Blog/solución + CTA B2B | P3 |

Competidores ✓ verificado: Becosan, Serlival, industrialespavimentos.es, pavimentoindustrial.pro, suelosepoxi3d.es. Difícil pero alto valor. La FAQ ya dice que trabajan para empresas/constructoras. Aprovechar el proyecto real de Riba-roja (pulido en planta de aparcamiento) como caso B2B.

### 4.10 Fuera del dominio (NO atacar desde esta web)
- **Pádel/pickleball**: pertenece a **padelalbufera.com** (otro dominio del cliente). 301/410 la URL antigua; no crear contenido aquí.
- **Pavimentos de caucho / parques infantiles**: la web nueva NO lo ofrece. Eliminar de la web nueva; 301/410.

---

## 5. Keywords que NO se atacan (y por qué)

- **"hormigón impreso barato / precio económico"**: choca con el posicionamiento de ticket alto. Atrae clientes que buscan 18 €/m².
- **"comprar resina hormigón impreso / resina para reparar"**: intención DIY/producto; la empresa vende servicio, no material.
- **"hormigón impreso bricolaje / cómo hacer hormigón impreso"**: DIY, no cliente.
- **"empleo / trabajo hormigón impreso / se busca oficial"**: intención laboral.
- **Provincias/municipios sin obra ni desplazamiento** (Castellón salvo justificación, Barcelona, Madrid, etc.): sin obra documentada en Castellón → no crear páginas de municipio allí (riesgo doorway). Castellón solo como mención de cobertura, no páginas dedicadas.
- **Pistas de pádel / pickleball / caucho**: fuera del dominio (§4.10).
- **"impreso vertical / revestimiento fachada"**: la web nueva no lo destaca; no priorizar salvo que Ysst confirme que se ofrece.

---

## 6. Especificación por tipo de página

Convenciones comunes: NAP desde `lib/business.ts`. Schema `HomeAndConstructionBusiness` (global, en layout) + `Service` por página de servicio. SIN `AggregateRating` de terceros. Breadcrumbs con `BreadcrumbList`. Imágenes propias con `alt` descriptivo (municipio + acabado + color). CTA doble: llamar 643 647 915 + WhatsApp + formulario.

### 6.1 Pilar de servicio (`/hormigon-impreso/` etc.)
- **Title**: `Hormigón impreso en Valencia | Pavimentos Albufera` (patrón: `[Servicio] en Valencia | Pavimentos Albufera`).
- **H1**: `Hormigón impreso`.
- **Secciones obligatorias**: qué es y para qué / ventajas / dónde se usa (enlaza a soluciones por espacio) / proceso (visita, presupuesto cerrado, ejecución equipo propio, garantía 10 años) / precio orientativo de mercado + argumentario anti-18€ / modelos y colores (enlaza a /acabados/) / proyectos reales del servicio / FAQ / CTA.
- **Schema**: `Service` (serviceType, areaServed = provincias, provider = el negocio).
- **Enlazado interno**: → soluciones por espacio, → acabados, → 3-4 proyectos del servicio, → presupuesto.
- **Datos a pedir a Ysst**: precio orientativo a mostrar (o solo rango de mercado), foto de portada real.

### 6.2 Solución por espacio (`/soluciones/[espacio]/`)
- **Title**: `Hormigón para [espacio] en Valencia | Pavimentos Albufera`.
- **H1**: `[Espacio]: qué pavimento le va mejor`.
- **Secciones**: problema del espacio / acabado recomendado y por qué / ventajas específicas / proyectos reales de ese espacio / FAQ del espacio / CTA.
- **Schema**: `Service`.
- **Enlazado**: ← tarjeta de la home; → servicio(s) recomendado(s); → proyectos; → presupuesto.
- **Datos a pedir a Ysst**: qué acabado recomienda por espacio; fotos por espacio.

### 6.3 Ficha de proyecto (`/proyectos/[slug]/`)
- **Title**: `[Servicio] en [Municipio] · [modelo/color] | Pavimentos Albufera`.
- **H1**: `[Servicio] en [Municipio]`.
- **Secciones obligatorias (mín. 3 bloques de material real)**: datos de obra (municipio, m², año, modelo, color) / galería de fotos propias / reto y solución / acabado usado (enlaza a /acabados/[modelo]/) / servicio (enlaza al pilar) / CTA "¿quieres algo así en [municipio]?".
- **Schema**: `Service` o `CreativeWork`/`Photograph` para la galería; ubicación con `areaServed`.
- **Optimización municipio**: H1 y title incluyen municipio → captura "servicio + municipio" (§4.4).
- **Datos a pedir a Ysst**: m² y año reales de cada obra con `?` (§1); NO inventar.

### 6.4 Acabado/modelo (`/acabados/[modelo]/`)
- **Title**: `Hormigón impreso [modelo] · [color] | Pavimentos Albufera`.
- **H1**: `[Modelo]`.
- **Secciones**: descripción del modelo / código de color / obra(s) donde se ha usado / espacios recomendados / CTA.
- **Enlazado**: → proyectos que lo usan, → pilar impreso.

### 6.5 Precio (sección en pilar o artículo)
- **Title**: `Precio del hormigón impreso por m² en 2026 (Valencia)`.
- **Secciones**: tabla de rangos de mercado (con fuentes) / qué incluye un precio correcto / por qué desconfiar de <20€/m² (cita Impresol) / cómo damos precio (visita + cerrado) / FAQ precio / CTA.
- **Schema**: `FAQPage`.

### 6.6 Blog informacional
- **Title**: pregunta natural (`¿Por qué se agrieta el hormigón impreso?`).
- **Secciones**: respuesta directa arriba (para AI Overview) / desarrollo / cómo lo evita la empresa / CTA.
- **Schema**: `Article` + `FAQPage` si aplica.

### 6.7 Diagrama de enlazado interno

```
                         [Home]
        ┌──────────┬───────┴────────┬───────────────┐
   (tarjetas    (servicios)     (proyectos)      (acabados)
    espacio)        │                │                │
        ▼           ▼                ▼                ▼
 /soluciones/   /hormigon-      /proyectos/     /acabados/
   [espacio]  ─▶ impreso/  ◀──▶  [slug]   ─────▶  [modelo]
      │        /hormigon-         │  ▲                │
      │         pulido/           │  │                │
      │        /microcemento/     │  └────────────────┘
      │            │              │
      └────────────┼──────────────┴──────────▶ [/presupuesto/]
                   ▼
             [precio / blog] ──▶ CTA presupuesto
```
Regla: toda página termina llevando a `/presupuesto/`. Proyectos ↔ acabados enlazan en ambos sentidos. Soluciones por espacio enlazan a servicios y a proyectos de ese espacio.

---

## 7. Orden de ejecución por tandas

- **TANDA 0 — Bloqueantes (obligatoria, antes de nada)**: eliminar marcadores `[...]` y "PENDIENTE"; NAP único en `lib/business.ts`; mapa de 301 (§2.3) + sitemap/robots; decisión sobre los tres dominios (§2.2); consolidar lavado/desactivado (§2.5); limpiar caucho/pádel de la web nueva.
- **TANDA 1 — Lo existente, bien hecho (P1)**: optimizar los 6 pilares de servicio + completar las 9 fichas de proyecto con datos reales (pedir m²/año a Ysst) + optimizar cada ficha para "servicio + municipio".
- **TANDA 2 — Soluciones por espacio (P1/P2)**: crear `/soluciones/[espacio]/` (5-6 páginas) y enlazarlas desde las tarjetas de la home. Empezar por porche-terraza y piscina (estacional, publicar ene-abr).
- **TANDA 3 — Precio + informacional clave (P2)**: sección/artículo de precio con tabla y argumentario; artículos "o baldosa", "por qué se agrieta", "cuánto dura".
- **TANDA 4 — Acabados/modelos + mantenimiento (P2)**: fichas de modelo con obra (madera, piedra inglesa); página de resellado/mantenimiento.
- **TANDA 5 — Municipios con demanda validada (P2/P3)**: solo hubs `/hormigon-impreso/[localidad]/` donde haya 2+ obras o demanda validada; empezar por Ribera Baixa (Sueca, Cullera) y Marina Alta si Ysst aporta más obra. Tandas de 5-10.
- **TANDA 6 — B2B industrial (P3)** y **DECISIÓN ABIERTA inglés Marina Alta**.

Publicar siempre en tandas de 5-10 páginas; medir a 8-12 semanas antes de la siguiente (§8).

---

## 8. Medición por página

- **Search Console**: por URL, seguir impresiones, clics, CTR y posición media de la keyword objetivo. Revisar Cobertura (que las URLs viejas dejen de indexarse y las nuevas entren). Comprobar que las 301 no generan errores.
- **GA4**: eventos personalizados obligatorios en cada página: `phone_call` (clic en tel:), `whatsapp_click` (clic en wa.me), `form_submit` (envío del formulario). Segmentar conversiones por página de aterrizaje.
- **Local Pack / GBP**: seguir llamadas y solicitudes de ruta desde Google Business Profile.
- **Criterios de revisión a 8-12 semanas por página**:
  - Top 10 para su keyword objetivo + genera eventos → mantener y replicar patrón.
  - Impresiona pero no clica (posición 11-30) → mejorar title/contenido/enlazado.
  - No impresiona nada a las 12 semanas → revisar intención/keyword o canibalización con otra página propia.
- **Umbral que cambia la estrategia**: si un tier de municipio genera formularios/llamadas reales, subir prioridad y crear hub; si un cluster (p. ej. inglés) no convierte tras 3 meses, congelar.

---

## 9. Decisiones abiertas (checklist)

- [ ] Confirmar NAP canónico (teléfono, dirección, email) para `lib/business.ts`.
- [ ] Confirmar propiedad y acceso DNS/hosting de pavivasa.com y hormigon-impreso-valencia.es → plan de 301 y consolidación.
- [ ] Aprobar mapa de 301 (§2.3) y destinos dudosos (caucho, /fr/).
- [ ] Decidir consolidación lavado/desactivado (§2.5).
- [ ] Confirmar prefijo de ruta para soluciones por espacio (`/soluciones/` vs otro).
- [ ] Aportar m² y año reales de las fichas con `?` (§1) y municipio del proyecto "manta".
- [ ] Decidir si se abre versión inglés `/en/` para Marina Alta (§4.8).
- [ ] Decidir si se crea `/pavimento-industrial/` propio o se integra en pulido (§4.9).
- [ ] Confirmar si la empresa ofrece impreso vertical/fachada (incluir o excluir).
- [ ] ¿Hay acceso a Semrush/Ahrefs para sustituir estimaciones de volumen por datos reales?
- [ ] Priorizar municipios Tier 1/3 donde pedir obra nueva para justificar hubs.

---

## Notas sobre fuentes

- **Web propia y dominios hermanos**: pavimentos-albufera.com (home, /contacto/, /empresa/, /galeria/, fichas), pavivasa.com, hormigon-impreso-valencia.es — verificados directamente.
- **Registro mercantil / NAP**: Axesor, eInforma, Empresite (elEconomista), infoisinfo, directoriocys.
- **Precio de mercado (fuentes nombradas)**: Pavimentos España (20-35 €/m² impreso 2026), Cronoshare (20-25 €/m² impreso; 35-100 €/m² microcemento), Impresol/HormigónPro (coste base 10-13 €/m² solo hormigón), Habitissimo (32 €/m² pulido; 50-120 €/m² microcemento), Durasol (20-45 €/m² pulido), Reformas Integrales Las Rozas (encimeras >120 €/ml), y CYPE Generador de Precios (formigó imprès exterior ~33-44 €/m² según fabricante). Son rangos de mercado, NO tarifas de la empresa.
- **SERP y competidores**: observados en búsquedas (Habitissimo, Topciment, hormigonimpresovalencia.es/.eu, generalpavimentos, paviadri, pavimentoindustrial.pro, Becosan, Serlival, PB Paving, Costa Reno).
- **Estacionalidad**: patrón primavera-verano corroborado por fuentes del sector; no hay export numérico de Google Trends publicado.
- **Volúmenes**: NO verificables públicamente; todas las cifras son estimaciones cualitativas marcadas. Confirmado tras búsqueda dedicada.

## Fuentes

1. [Pavimentos de hormigón - Pavimentos Albufera](https://www.pavimentos-albufera.com/)
2. [Hormigón pulido en Xàbia - Pavimentos Albufera](https://www.pavimentos-albufera.com/hormigon-pulido-en-xabia/)
3. [¿Cuál es el precio del hormigón impreso por m² en España? 2026](https://pavimentosespana.com/cual-es-el-precio-del-hormigon-impreso-por-m%C2%B2-en-espana-guia-2026/)
