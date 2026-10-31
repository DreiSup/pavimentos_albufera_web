# Datos investigados: bombeo de hormigón y vertido de autonivelante

**Fecha:** 2026-10-31 · **Páginas:** `/bombeo-de-hormigon/` y `/vertido-de-autonivelante/` ·
**Código:** `packages/content/src/data/services.ts` (entradas `bombeo` y `autonivelante`).

> ⚠️ **Aviso. Nada de esto es un dato del cliente.**
>
> - Los pendientes marcados **T** (técnicos) se han rellenado con el **rango habitual del sector**,
>   sacado de fichas técnicas de fabricantes y de proveedores, y redactado como tal: «como
>   referencia del sector», «según producto», «según equipo». **No son compromisos de Pavimentos
>   Albufera.** Cuando el cliente dé su producto, su bomba o sus plazos, se sustituye el rango por
>   su cifra.
> - Los marcados **E** (hechos de la empresa: bomba propia o contratada, quién pide el hormigón,
>   volumen mínimo, antelación, marca, alcance del servicio, suelo radiante…) **no se han
>   investigado ni afirmado**. La frase o la fila se ha reescrito para que sea verdad sin ese
>   dato, llevando la respuesta a la visita o al presupuesto.
> - Decisión del responsable del proyecto (2026-10-31): rellenar ya, para que la página se lea
>   sin corchetes hasta que el cliente conteste. **Desde hoy no queda ningún `{{…}}` en estas dos
>   páginas** ni en sus preguntas de `faq.ts`.

**Cómo se ha investigado, y su límite.** Búsqueda web el 2026-10-31. En esta sesión la descarga
directa de páginas estaba bloqueada por la red (fallaron `es.weber`, `esp.sika.com` y
`aparejadoresmadrid.es`), así que **las cifras salen de los extractos que devuelve el buscador**
para cada PDF o página, no de abrir el PDF entero. Cada cifra publicada se apoya en al menos dos
fuentes independientes. Antes de dar los rangos por definitivos, conviene abrir a mano las fichas
marcadas con ⚠ abajo.

---

## Fuentes

Todas consultadas el **2026-10-31**.

### Autonivelante

| # | Fuente | Qué dice (lo usado) |
|---|---|---|
| S1 | Sika España — ficha Sikafloor-200 Level · <https://esp.sika.com/dam/dms/es01/k/sikafloor-200-leveles.pdf> | Base cemento, **CT-C25-F6** (EN 13813). Capa de **3–50 mm**. Revestimientos: **>24 h** cerámica y LVT con capa >10 mm, **>48 h** resina. |
| S2 | Sika — Sikafloor-200 Level, fichas de otros mercados · <https://moz.sika.com/dms/getdocument.get/d98aec18-e1f4-478a-8282-cc7d3f158307/pds-sikafloor-200levelza.pdf> · <https://pry.sika.com/content/dam/dms/py01/l/sikafloor-200-level.pdf> | Tránsito peatonal a **~4 h** (Mozambique) y **~6 h** (Paraguay). |
| S3 | Grupo Puma — Niveland 10 (ficha) · <https://www.grupopuma.com/services/pdf/9160> ⚠ | **CT C25 F5**, **2–10 mm**. Transitable **8–12 h**. Cerámica a **12–24 h**, parquet o sintético a **24–48 h**. Tiempos a 23 °C y 50 % HR (nota de Niveland 5). |
| S4 | Grupo Puma — DoP Niveland 30R · <https://www.grupopuma.com/uploads/adjuntos/361d6-dop.-niveland-30r-26.pdf> | Base cemento, **2–30 mm**. |
| S5 | Weber España — weberfloor FLUID · <https://www.es.weber/files/es/2025-12/weberfloor_FLUID.pdf> | Tráfico peatonal a **3 h**. |
| S6 | Weber — weberfloor light · <https://cdn.shopify.com/s/files/1/2316/0819/files/Ficha_Tecnica_weberfloor_light.pdf> | **CT-C20-F5**. |
| S7 | Weber España — weberfloor radiante · <https://www.es.weber/files/es/2020-12/weberfloor_radiante.pdf> ⚠ | Para recrecidos de **3–8 cm** sobre sistemas radiantes (la tabla dice «3 cm máximo»: contradicción en el propio extracto). Admite cerámica, PVC, vinilo, tarima, madera o microcemento tras el secado de ficha. |
| S8 | Topeca — Nivel S · <https://pt.topeca.pt/en/product/autonivelante-nivel-s> | **CT-C20-F5**, **1–3 mm**, circular a **3–4 h**. |
| S9 | Mapei — Ultraplan Eco 20 (México) · <https://icce.com.mx/Fichas-Tecnicas/Materiales/Mapei/ULTRAPLAN%20ECO%2020.pdf> · Ultraplan Maxi (Portugal) · <https://live-place.com/siteimg/Ficheiros%20de%20Produtos/Ficheiros/CERTIFICADOS%20-%20FICHAS%20TECNICAS/LUSOMAPEI/FT/M149125_ultraplanmaxi_FT.pdf> | Eco 20: **CT-C20-F5**, **1–10 mm**. Maxi: **3–40 mm**. |
| S10 | Leroy Merlin (Adeo) — autonivelante 20–50 mm · <https://media.adeo.com/media/4539019/media.pdf> | Base cemento, **CT-C30-F7**, **20–50 mm**. |
| S11 | Holcim España — Agilia Suelo Excellence · <https://www.holcim.es/sites/spain/files/documents/ficha_tecnica_hormigon_agilia_suelo_excellence_202107.pdf> ⚠ | Anhidrita, **CA-C30-F6**, **12–30 mm**. Transitable a **24–48 h** (20 ± 2 °C). Tabla de secado por espesor para humedad residual 1 % y 0,5 %: la lectura del extracto da **1, 2 y 3 semanas para 12, 20 y 30 mm** al 1 % (tabla desordenada en el extracto: comprobar). |
| S12 | Holcim España — Agilia Suelo A · <https://www.holcim.es/sites/spain/files/2023-04/agilia-suelo-a.pdf> | Anhidrita, espesores de **30 a 60 mm** con tabla de secado por espesor (los valores no salieron en el extracto). |
| S13 | Holcim España — Agilia Suelo A Térmico · <https://www.holcim.es/sites/spain/files/2023-04/agilia-suelo-a-termico.pdf> | Anhidrita, **CA-C25-F5**. Transitable a **24–48 h**. Se bombea. Capa de **2 cm por encima de los tubos** de suelo radiante. Tabla de secado de 20 a 50 mm. |
| S14 | Holcim España — TectorFloor 452 CA Thermionivel A+ · <https://www.holcim.es/sites/spain/files/documents/thermionivel_a.pdf> | Anhidrita, **CA C25 F6**, **25–80 mm**, interior. Con suelo radiante, **poner en marcha la calefacción antes de colocar el suelo**. Secado según espesor, soporte, agua y clima. |
| S15 | Construible — entrevista al director técnico de Anhydritec (Anhivel) · <https://www.construible.es/2024/09/03/inaki-isusi-director-tecnico-anhydritec-slu-anhivel-morteros> · ficha de empresa <https://www.construible.es/empresas/anhivel-morteros-anhydritec> | Thermio Max (anhidrita, **C30-F8**) para suelo radiante con **1,5 cm sobre el tubo**. Excelio, recrecido fino desde **10 mm**. La tecnología SA reduce el secado. |
| S16 | ANFAPA — guía de morteros autonivelantes (Colegio de Aparejadores de Madrid) · <https://www.aparejadoresmadrid.es/documents/d/aparejadores/anfapa_morteros-autonivelantes-pdf> · puesta en obra <https://www.aparejadoresmadrid.es/documents/d/aparejadores/anfapa_morteros-autonivelantes-puesta-en-obra-pdf> | Capa fina de **2 a 30 mm**; capa gruesa desde **35 mm**. CA = sulfato cálcico según EN 13813. Antes de cualquier revestimiento, **pruebas de humedad residual**. Banda perimetral de ~8 mm. |
| S17 | Habitissimo — aplicador de mortero autonivelante · <https://www.habitissimo.es/pro/mortero-autonivelante-y-pavimentos> | Esperar **7–21 días** antes de colocar pavimento, según mortero y obra. |
| S18 | Molins — M-Autonivelante · <https://www.molins.es/hormigon-y-aridos/wp-content/uploads/sites/5/2024/03/M-Autonivelante_ES.pdf> | Llega en **camión hormigonera** y se coloca **mediante bombeo**, por personal especializado. |
| S19 | Fichas de autonivelante de cemento (Sika y otros, en el extracto del buscador sobre aplicación) · p. ej. <https://chl.sika.com/dms/getdocument.get/c825f380-5185-4a09-9a93-d1e1d8d16651/lanko-171-pumpableselfleveling.pdf> ⚠ | Aplicación **manual o con bomba**; «para grandes superficies es recomendable el bombeo de la mezcla». |
| S20 | Grupo Puma — guía de suelo radiante · <https://www.grupopuma.com/services/pdf/5801> ⚠ | Respetar el secado antes de la puesta en marcha (**al menos 48 h**) y **subir la temperatura por intervalos**. Remite a UNE-EN 1264 y RITE. |

### Bombeo

| # | Fuente | Qué dice (lo usado) |
|---|---|---|
| P1 | Liebherr España — camiones-bomba de hormigón · <https://www.liebherr.com/es-es/tecnica-del-hormigon/bombas-de-hormig%C3%B3n/camiones-bomba-de-hormig%C3%B3n/camiones-bomba-de-hormigon-4606217> | Alcances verticales de la gama: **23,7 m** (24 XH, el más pequeño) a **49,1 m**. |
| P2 | Páginas Amarillas — proveedor de autobombas (Reycan Plus) · <https://www.paginasamarillas.es/a/autobomba/> · <https://www.paginasamarillas.es/a/bomba-de-hormigon/sevilla/> | Autobombas **hasta 60 m** de alcance; bombeo en estático con mangueras **hasta 200 m**. |
| P3 | Ayuntamiento de Zaragoza — pliego de contratación · <https://zaragoza.es/sede/portal/contratacion-publica/servicio/fehaciente/52218> | Bombas de pluma de **24 m** y **36 m** como equipos tipo. (Trae precios por hora: **no se usan**.) |
| P4 | Putzmeister — bombas sobre camión hormigonera · <https://www.putzmeister.com/es/web/turk/products/-/product-navigation/truck-mixer-concrete-pumps> | Pluma de 3 segmentos con **20 m** de alcance horizontal. |
| P5 | Hispanopedia — «Bomba de hormigón» · <https://es.hispanopedia.com/wiki/Bomba_de_hormig%C3%B3n> | Pluma de 42 m: alcance horizontal 38 m; BRF 42.14: **140 m³/h**. |
| P6 | Kaiobá P2023, autobomba de 42 m (Brasil) · <https://www.aecweb.com.br/produto/autobomba-lanca-p2023-42m/21705> | **150 m³/h** teóricos, tubería de **125 mm**. |
| P7 | Carmix — PUMP15 · <https://www.carmix.com/wp-content/uploads/2026/04/Carmix_PUMP15_ESP.pdf> | Bomba compacta: **hasta 15 m³/h**, distancia de bombeo **80–90 m**, árido máx. 25 mm, manguera de 50 mm. |
| P8 | Putzmeister — P 715 · <https://www.putzmeister.com/web/european-union/product-detail/-/product/1403/p-715-te---se> · Archiexpo <https://www.archiexpo.com/prod/putzmeister/product-3547-1742204.html> · anuncio <https://www.hellopro.fr/pompe-a-beton-2010810-6087702-produit.html> | Bomba de remolque para **hormigón fino de hasta 16 mm**, autonivelante de cemento y anhidrita. **18 m³/h**. Anuncio de segunda mano: tuberías **hasta 135 m**. |
| P9 | Multiquip — folleto de bombas de hormigón · <https://www.Multiquip.com/multiquip/pdfs/folleto_de_Bombas_de_Hormig_n.pdf> | Modelo pequeño: árido **½" (12 mm) o menor**, hasta 25 yd³/h (**≈ 19 m³/h**). «Las distancias máximas, el tamaño máximo de agregado y el **asentamiento mínimo** dependen del diseño de la mezcla, del **diámetro de la tubería**»; caudal y distancia máximos no se dan a la vez. |
| P10 | Consistencia del hormigón — UPCT, práctica de dosificación · <https://ocw.bib.upct.es/pluginfile.php/6266/mod_resource/content/1/PC1_Dosificacion_y_amasado_del_hormigon.pdf> · Sika, guía rápida del Código Estructural · <https://esp.sika.com/dam/dms/es01/6/Guia%20Rapida%20Codigo%20Estructural.pdf> | Blanda 6–9 cm de asiento, fluida 10–15 cm; la designación lleva resistencia / consistencia / tamaño máximo de árido / ambiente. **No se encontró** una cifra de consistencia «para bombeo»: por eso el texto dice «una consistencia mínima» sin número. |

---

## Bombeo de hormigón — `/bombeo-de-hormigon/`

### B1 · Guía «Por qué árido de 12 mm», 2.º párrafo · **E**

- **Antes:** «Si tu obra tiene proyecto y pide un árido mayor, dínoslo antes de pedir el
  hormigón: `{{si bombeáis también hormigón con árido de más de 12 mm}}`.»
- **Ahora:** «… dínoslo antes de pedir el hormigón: una piedra más grande pide una tubería más
  gruesa, y eso cambia la bomba.»
- **Por qué así:** no se dice si la empresa bombea árido mayor. Solo se da el hecho técnico de que
  árido y diámetro de tubería van juntos.
- **Fuentes:** P9 (árido máximo según diámetro de tubería), P8 (bomba de hormigón fino hasta
  16 mm), P6 (autobomba con tubería de 125 mm).
- **Confirmar con el cliente:** ¿bombeáis solo con 12 mm, o también con árido mayor si el proyecto
  lo pide? Si dicen que sí, se puede añadir «también bombeamos con árido de X mm».

### B2 · Guía «Cómo se organiza el día del vertido», 2.º párrafo (tipo de bomba) · **E** (+ T)

- **Antes:** «La bomba que usamos: `{{propia o contratada, y de qué tipo: bomba de manguera o
  pluma sobre camión}}`. Hasta dónde llega y cuánto mueve: `{{…}}`. Con la medida del recorrido
  delante te decimos si se llega.»
- **Ahora** (párrafo nuevo, que explica los dos tipos sin decir cuál tiene la empresa): «Hay dos
  tipos de bomba. La autobomba lleva una pluma articulada sobre el camión y deja el hormigón desde
  arriba, por encima del tejado o de la tapia; necesita sitio en la calle para apoyar los
  estabilizadores. La bomba de tubería va en un remolque junto a la cuba y empuja el hormigón por
  un tubo tendido por el suelo, que acaba en una manguera: entra por un pasillo, un garaje o una
  escalera.»
- **Fuentes:** P1, P4 (camión con pluma); P7, P8 (bomba de remolque con tubería/manguera); P2
  (autobomba frente a bombeo en estático con mangueras).
- **Confirmar con el cliente:** ¿la bomba es vuestra o la subcontratáis? ¿Cuál usáis: pluma,
  tubería, o las dos según la obra?

### B3 · Ficha técnica · TIPO DE BOMBA · **E**

- **Antes:** `{{manguera o pluma · propia o contratada}}`
- **Ahora:** `Pluma o tubería, según el acceso`
- **Por qué así:** se quita «propia o contratada», que es de la empresa; queda la decisión técnica
  que vale para cualquiera.
- **Fuentes:** las de B2.
- **Confirmar con el cliente:** lo mismo que B2.

### B4 · Guía «Cómo se organiza el día del vertido» (alcance y caudal) · **T**

- **Antes:** «Hasta dónde llega y cuánto mueve: `{{alcance en metros de manguera o de pluma, y
  caudal en m³/h}}`. Con la medida del recorrido delante te decimos si se llega.»
- **Ahora** (párrafo propio): «Como referencia del sector, una pluma llega de 20 a 60 metros,
  según el camión. Una bomba de tubería lleva el hormigón de 80 a 200 metros, según el equipo, y
  las pequeñas mueven en torno a 15-20 m³ por hora. Cuál va en tu obra se decide al ver el acceso:
  con la medida del recorrido delante te decimos si se llega y con qué.»
- **Fuentes:** pluma 20–60 m: P1 (23,7–49,1 m vertical), P2 (hasta 60 m), P3 (24 y 36 m), P4
  (20 m horizontal). Tubería 80–200 m: P7 (80–90 m), P8 (135 m), P2 (200 m). Caudal 15–20 m³/h en
  bombas pequeñas: P7 (15), P8 (18), P9 (≈ 19).
- **Confirmar con el cliente:** metros de manguera/tubería que lleváis (horizontal y en altura) o
  metros de pluma; m³/h de vuestra bomba.

### B5 · Ficha técnica · ALCANCE · **T**

- **Antes:** `{{metros de manguera o de pluma}}`
- **Ahora:** `Pluma 20-60 m · tubería 80-200 m · según equipo`
- **Fuentes:** las de B4.
- **Confirmar con el cliente:** lo mismo que B4 (alcance).

### B6 · Ficha técnica · CAUDAL · **T**

- **Antes:** `{{m³/h}}`
- **Ahora:** `Bomba de tubería pequeña: 15-20 m³/h · según equipo`
- **Por qué así:** se da solo el rango de las bombas de tubería pequeñas, que son las que encajan
  con árido de 12 mm. Las autobombas de pluma rondan 140–150 m³/h teóricos (P5, P6), pero con dos
  fichas de 42 m no hay base para un rango «habitual» de pluma, y no se publica.
- **Fuentes:** P7, P8, P9.
- **Confirmar con el cliente:** lo mismo que B4 (caudal).

### B7 · Guía «Cómo se organiza el día del vertido», 3.er párrafo (el hormigón) · **E** (+ T)

- **Antes:** «El hormigón: `{{si lo pedís vosotros a planta o lo pide el cliente, y qué
  resistencia y consistencia servís}}`.»
- **Ahora:** «El hormigón llega de planta en cuba, con la resistencia que pide la obra y árido de
  12 mm. Para bombearlo tiene que venir con una consistencia mínima, porque una masa seca atasca la
  tubería, y eso se fija con la planta al hacer el pedido. Quién lo pide y qué hormigón lleva lo
  hablamos al preparar el presupuesto.»
- **Por qué así:** no se dice quién pide el hormigón ni qué resistencia sirve la empresa. La
  consistencia va sin número porque no se encontró una cifra «para bombeo» con dos fuentes (P10).
- **Fuentes:** P9 (la bomba exige un asentamiento mínimo según mezcla y tubería), P10
  (designación y clases de consistencia).
- **Confirmar con el cliente:** ¿el hormigón lo pedís vosotros a planta o el cliente/constructor?
  ¿Qué soléis bombear (p. ej. HA-25, consistencia blanda o fluida)?

### B8 · Ficha técnica · HORMIGÓN · **E**

- **Antes:** `{{resistencia y consistencia · quién lo pide a planta}}`
- **Ahora:** `De planta · árido 12 mm · resistencia según obra`
- **Fuentes:** las de B7. El árido de 12 mm es dato confirmado por el cliente.
- **Confirmar con el cliente:** lo mismo que B7. Con su respuesta, la fila puede pasar a algo como
  `HA-25 · consistencia blanda · lo pedimos a planta`.

### B9 · Guía «En casa y en obra», 2.º párrafo · **E**

- **Antes:** «Si eres constructor o reformista, es el vertido con la manguera hasta el tajo. Lo
  que entra además de bombear y verter: `{{si extendéis, regleáis y fratasáis, o solo bombeo y
  vertido}}`.»
- **Ahora:** «… es el vertido con la manguera hasta el tajo. Si además necesitas que se extienda,
  se reglee o se fratase, dínoslo al pedir el presupuesto y te decimos qué entra.»
- **Fuentes:** ninguna (no es investigable).
- **Confirmar con el cliente:** ¿al constructor le dais solo bombeo y vertido, o también
  extendido, regleado y fratasado? Ver también **G3** del documento de copy (si dan el servicio a
  profesionales).

### B10 · Guía «Bomba, canaleta o carretilla», 2.º párrafo · **E**

- **Antes:** «Desde qué volumen compensa traer la bomba: `{{volumen mínimo por servicio, en
  m³}}`.»
- **Ahora:** «Desde qué volumen compensa la bomba no tiene una cifra fija. Depende de los metros
  cúbicos, del recorrido y de lo que costaría hacerlo de otra manera: con esos tres datos lo vemos
  contigo.»
- **Por qué así:** no se publica un mínimo que la empresa no ha dado. Redactado distinto de la FAQ
  `pumpSmallVolume` para no repetir texto.
- **Fuentes:** ninguna con cifra comparable (los mínimos encontrados son de suministro de hormigón
  en pliegos públicos, no de bombeo).
- **Confirmar con el cliente:** ¿hay un mínimo de m³ (o de horas) por servicio de bombeo?

### B11 · Ficha técnica · VOLUMEN MÍNIMO → **EN OBRA** · **E**

- **Antes:** `VOLUMEN MÍNIMO` · `{{m³ por servicio}}`
- **Ahora:** `EN OBRA` · `Sitio para la bomba y paso libre para la manguera`
- **Por qué así:** la fila solo tenía sentido con el dato de la empresa. Se cambia por una fila
  técnica que ya estaba en la guía («un sitio para la bomba al que la cuba pueda llegar, un
  recorrido libre para la manguera») y en la FAQ `pumpSetup`.
- **Confirmar con el cliente:** si dan un mínimo, se puede recuperar la fila `VOLUMEN MÍNIMO`.

### B12 · Guía «Del bombeo al pavimento», 1.er párrafo · **E**

- **Antes:** «… [fratasada], [impresa] o [pulida]. `{{si el bombeo se presupuesta junto con el
  pavimento o como servicio aparte}}`.»
- **Ahora:** «… [fratasada](/hormigon-fratasado/), [impresa](/hormigon-impreso/) o
  [pulida](/hormigon-pulido/). Si ya sabes cuál quieres, dilo al pedir el presupuesto: el espesor
  y el armado de la solera se plantean pensando en él.»
- **Por qué así:** no se dice cómo se presupuesta. Se da un hecho técnico ya presente en la web: la
  solera de impreso cambia de espesor según el uso (10 cm peatonal, 12–15 cm con vehículos, ficha
  de `/hormigon-impreso/`).
- **Fuentes:** el propio `services.ts` (ficha de impreso).
- **Confirmar con el cliente:** ¿el bombeo va dentro del presupuesto del pavimento o aparte? ¿Dais
  bombeo suelto, sin pavimento?

### B13 · Ficha técnica · ANTELACIÓN DE RESERVA → **DÍA DEL VERTIDO** · **E**

- **Antes:** `ANTELACIÓN DE RESERVA` · `{{días}}`
- **Ahora:** `DÍA DEL VERTIDO` · `Cuba y bomba a la misma hora, con la zona preparada`
- **Por qué así:** la antelación es de la empresa (o de su proveedor) y no se encontró ninguna
  cifra publicada del sector. La fila nueva resume lo que la guía y la FAQ `pumpSetup` ya dicen:
  la cuba y la bomba coinciden, y la base, el encofrado y el armado están hechos antes.
- **Fuentes:** ninguna con cifra.
- **Confirmar con el cliente:** ¿con cuántos días hay que reservar la bomba? Si lo dan, se puede
  recuperar la fila `ANTELACIÓN DE RESERVA`.

---

## Vertido de autonivelante — `/vertido-de-autonivelante/`

### A1 · Guía «Cómo se aplica», 2.º párrafo · **E** (+ T)

- **Antes:** «Después se vierte y se pasa un rodillo de púas […]. Cómo lo vertemos nosotros:
  `{{a mano o con bomba}}`.»
- **Ahora:** «Después se vierte y se pasa un rodillo de púas, que saca el aire y ayuda a que la
  masa se reparta. Se puede amasar en obra y verter a mano, o mezclar y bombear con máquina, que es
  lo habitual en superficies grandes. Algunos llegan ya amasados en cuba, desde planta, y se
  bombean. Cuál conviene en tu obra depende de los metros y del acceso.»
- **Fuentes:** S19 (manual o con bomba; bombeo recomendado en superficies grandes), S18 (llega en
  camión hormigonera y se bombea), S13 (Agilia, «se bombea fácilmente»), P8 (bomba para
  autonivelante y anhidrita).
- **Confirmar con el cliente:** ¿lo vertéis a mano, con máquina de mezcla y bombeo, o pedís
  autonivelante de planta en cuba?

### A2 · Guía «Tipos, espesores y tiempos», 2.º párrafo · **T** (marca: **E**)

- **Antes:** «Lo que vertemos nosotros: `{{tipo y marca del autonivelante, espesor mínimo y
  máximo, y plazo para pisarlo y para poner el pavimento final}}`.»
- **Ahora** (dos párrafos):
  - «Como referencia del sector, los de cemento van en capa fina: desde 2 o 3 mm hasta 30 o 50,
    según el producto. Se pisan a las 3-12 horas y, en capa fina, admiten el pavimento al día o a
    los dos días. Los de anhidrita van de unos 12 a 80 mm y se pisan a las 24-48 horas. Antes del
    pavimento necesitan de una a tres semanas de secado en capa fina, y más cuanto más gruesa.»
  - «Antes de poner la tarima o el vinílico se mide la humedad que queda en la base: decide eso,
    no el calendario. Cada producto lleva en su ficha su clase según la norma UNE-EN 13813: CT si
    es de cemento, CA si es de anhidrita, una C por la resistencia a compresión y una F por la de
    flexión. Lo habitual va de C20 a C30 y de F5 a F8. El producto concreto se elige con el espesor
    y el uso de tu obra, y sus cifras mandan sobre estas.»
- **Por qué así:** tipo, espesores y plazos son técnicos y van como rango del sector. La marca no
  se nombra: sería afirmar qué usa la empresa.
- **Fuentes:** ver A4–A7.
- **Confirmar con el cliente:** producto que usáis (cemento o anhidrita, marca y referencia), entre
  qué espesores lo aplicáis, y sus plazos de pisado y de pavimento.

### A3 · Ficha técnica · TIPO · **E**

- **Antes:** `{{base cemento o anhidrita · marca}}`
- **Ahora:** `Base cemento o anhidrita, según estancia y espesor`
- **Por qué así:** se quita la marca. «Según estancia» recoge lo que ya decía la guía (la anhidrita
  no lleva bien la humedad: en baños y cocinas, cemento); «según espesor», que la anhidrita es de
  capa más gruesa (S16).
- **Confirmar con el cliente:** lo mismo que A2 (tipo y marca).

### A4 · Ficha técnica · ESPESOR · **T**

- **Antes:** `{{mínimo y máximo}}`
- **Ahora:** `Cemento 2-50 mm · anhidrita 12-80 mm · según producto`
- **Fuentes:** cemento: S16 (capa fina 2–30 mm), S3 (2–10), S4 (2–30), S1 (3–50), S10 (20–50),
  S9 (1–10 y 3–40), S8 (1–3). Anhidrita: S11 (12–30), S12 (30–60), S14 (25–80), S15 (desde 10),
  S16 (capa gruesa desde 35).
- **Confirmar con el cliente:** espesor mínimo y máximo con el que trabajan, en mm.

### A5 · Ficha técnica · RESISTENCIA · **T**

- **Antes:** `{{clase a compresión y a flexión}}`
- **Ahora:** `Clase UNE-EN 13813 · habitual C20-C30, F5-F8`
- **Fuentes:** CT-C20-F5 (S6, S8, S9), CT-C25-F5 (S3), CT-C25-F6 (S1), CT-C30-F7 (S10),
  CA-C25-F5 (S13), CA-C25-F6 (S14), CA-C30-F6 (S11), C30-F8 (S15). Nomenclatura CT/CA: S16.
- **Confirmar con el cliente:** la clase exacta de su producto (sale de su ficha técnica).

### A6 · Ficha técnica · PISABLE · **T**

- **Antes:** `{{horas}}`
- **Ahora:** `Cemento 3-12 h · anhidrita 24-48 h · según producto`
- **Fuentes:** cemento: S5 (3 h), S8 (3–4 h), S2 (4–6 h), S3 (8–12 h). Anhidrita: S11 y S13
  (24–48 h a 20 ± 2 °C).
- **Confirmar con el cliente:** horas de su producto. Los tiempos de ficha son a ~20–23 °C; en
  invierno se alargan (nota de S3).

### A7 · Ficha técnica · LISTO PARA EL PAVIMENTO FINAL · **T**

- **Antes:** `{{días, según espesor}}`
- **Ahora:** `Cemento 1-2 días · anhidrita 1-3 semanas o más · según espesor y humedad`
- **Fuentes:** cemento en capa fina: S3 (cerámica 12–24 h, parquet o sintético 24–48 h), S1
  (>24 h cerámica y LVT, >48 h resina, con más de 10 mm). Anhidrita: S11 (1–3 semanas para
  12–30 mm al 1 % de humedad residual ⚠), S17 (7–21 días), S12 y S13 (tablas que crecen con el
  espesor). Medir humedad antes del revestimiento: S16.
- **Ojo:** el «1-2 días» del cemento es para capa fina. En capas gruesas de cemento el plazo
  también crece; la ficha lo resume en «según espesor y humedad». Con suelo radiante y madera el
  umbral de humedad es más exigente (una fuente italiana da < 0,2 % en radiante frente a < 0,5 %
  sin él; no publicado por tener una sola fuente).
- **Confirmar con el cliente:** días hasta el pavimento final con su producto, por espesor.

### A8 · Guía «Sobre suelo radiante» · **E** (+ T)

> **2026-10-31: bloque retirado de la página a petición del responsable del proyecto.** El texto
> de abajo queda como registro; no se publica. Si el cliente confirma que trabaja sobre suelo
> radiante, se puede reponer.

- **Antes:** «Sobre los tubos de un suelo radiante, una masa fluida los envuelve […].
  `{{si vertéis autonivelante sobre suelo radiante, y con qué producto}}`.»
- **Ahora:** «… y eso ayuda a que el calor llegue parejo al pavimento. Hay productos pensados para
  eso; algunos de anhidrita piden apenas 1,5-2 cm por encima del tubo. Antes del pavimento final,
  la calefacción se pone en marcha poco a poco, con el protocolo del fabricante. Si tu obra lleva
  suelo radiante, dínoslo al pedir el presupuesto.»
- **Por qué así:** no se dice que la empresa lo haga ni con qué producto. «Dínoslo al pedir el
  presupuesto» no promete hacerlo.
- **Fuentes:** 1,5–2 cm sobre el tubo: S13 (2 cm), S15 (1,5 cm). Puesta en marcha antes del
  pavimento y gradual: S14, S20. Productos para radiante de base cemento también: S7.
- **Confirmar con el cliente:** ¿vertéis autonivelante sobre suelo radiante? ¿Con qué producto?
  **Si no lo hacen, se quita el bloque entero** (como ya decía el documento de copy).

---

## Lo que no ha cambiado

- **FAQ** (`faq.ts`, claves `pump*` y `selfLevel*`): no tenían ningún `{{…}}` en las respuestas
  (el único estaba en un comentario de código, que se ha actualizado). No se les han añadido
  cifras: una respuesta de FAQ viaja en el `FAQPage` fuera de la página, y los rangos del sector
  quedan solo en la guía y en la ficha.
- **G1–G3** del documento de copy (zona de servicio, los cuatro «Cómo trabajamos» de la plantilla,
  clientes profesionales): no eran corchetes y siguen pendientes de confirmar tal cual. **G2 pesa
  más ahora**: la sección común sigue hablando de «24-48 h sin pisar, 28 días de curado», que no
  cuadra con los plazos del autonivelante de esta misma página.
- **Nada de precios.** El pliego de Zaragoza (P3) trae precios por hora de bomba; no se han usado.
