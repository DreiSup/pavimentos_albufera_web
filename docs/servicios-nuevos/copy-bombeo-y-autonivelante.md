# Copy de los dos servicios nuevos: bombeo de hormigón y vertido de autonivelante

**Fecha:** 2026-10-30 · **Actualizado:** 2026-10-31 · **Estado:** borrador **pendiente de validación del cliente**.

> **2026-10-31 — ya no hay corchetes en pantalla.** Por decisión del responsable del proyecto,
> los 21 `{{…}}` de estas dos páginas (B1–B13, A1–A8) se han sustituido: los datos técnicos por
> **rangos habituales del sector**, redactados como tales («como referencia del sector», «según
> producto»), y los hechos de la empresa **no se afirman**: la frase se ha reescrito para ser
> verdad sin ellos, llevando la respuesta a la visita o al presupuesto. Qué había, qué hay, de
> qué fuente sale y qué falta confirmar con el cliente: [`datos-investigados.md`](datos-investigados.md).
> Cuando el cliente dé su dato, se sustituye el rango por su cifra.

El responsable del proyecto autorizó redactar copy nuevo para estas dos páginas. El cliente solo
ha confirmado dos cosas:

1. Hacen **bombeo y vertido de hormigón con árido de 12 mm**.
2. Hacen **vertido de autonivelante**.

Todo lo demás es de dos tipos:

- **Técnica explicada en general**: cómo funciona un bombeo, qué es un autonivelante, qué pide
  el soporte. Son datos del oficio, no compromisos de la empresa, y van sin cifras.
- **Compromisos de la empresa** (alcance, caudal, volumen mínimo, producto, espesores, plazos,
  precios, si la bomba es propia): iban como `{{dato pendiente}}` y en pantalla salían como
  `<DatoPendiente>`, entre corchetes atenuados. Desde el 2026-10-31 no queda ninguno: ver el aviso
  de arriba y `datos-investigados.md`.

Lo que **no** hay, a propósito: precios, obras, fotos, testimonios, reseñas, m², municipios ni
años. No hay ningún proyecto de estos dos servicios en `projects.ts`, así que la página no monta
«Obra ejecutada» hasta que haya uno. Sin foto de hero, la plantilla pinta `<BloquePosicion>`.

**Nombre del segundo servicio.** El usuario no quiere que se llame «mortero autonivelante». El
servicio es **«Vertido de autonivelante»** en nombre, title, H1, ruta, enlaces y CTA. La palabra
«mortero» aparece una sola vez en estas páginas, en la primera frase de la banda «Qué es», para
decir qué material es.

**Fuente en el código:** `packages/content/src/data/services.ts` (entradas `bombeo` y
`autonivelante`) y `packages/content/src/data/faq.ts` (claves `pump*` y `selfLevel*`). El texto de
abajo sale de esos archivos. Si se cambia una cosa, se cambia en las dos.

---

## Bombeo de hormigón — `/bombeo-de-hormigon/`

### Metadatos y hero

| Campo | Texto |
|---|---|
| `name` | Bombeo de hormigón |
| `title` (46 car., la plantilla añade «\| Pavimentos Albufera») | Bombeo de hormigón en Valencia: árido de 12 mm |
| `description` (151 car.) | Bombeo y vertido de hormigón con árido de 12 mm hasta el patio, la parcela o la planta a la que no llega el camión. Cómo funciona y cuándo no compensa. |
| `h1` | Bombeo de hormigón en Valencia, Castellón y Alicante |
| `intro` (entradilla) | Llevamos el hormigón por manguera hasta donde la cuba no llega: el patio de atrás, la parcela sin entrada o la planta de arriba. Bombeo y vertido con árido de 12 mm. |
| `heroLabelLines` | `BOMBEO Y VERTIDO` / `ÁRIDO MÁXIMO 12 MM` |
| `cardText` (tarjeta de la home) | Hormigón por manguera hasta donde no llega el camión. Árido de 12 mm. |
| `hasFinishes` | `false` (sin muestrario ni botón «Ver acabados») |

### Banda «Qué es» — H2: Qué es el bombeo de hormigón

Es mover el hormigón desde la cuba hasta el sitio donde se vierte por una manguera, empujado por una bomba. Hace falta cuando el camión no puede acercarse: un patio trasero, una parcela con la entrada estrecha, un sótano o una planta alta. El hormigón llega al tajo sin carretillas ni cubos.

#### Por qué árido de 12 mm

El árido es la piedra que lleva dentro el hormigón. Con un tamaño máximo de 12 mm, la mezcla pasa por una manguera de menos diámetro, que pesa menos y se mueve a mano: por un pasillo, por una puerta o por encima de una tapia.

Ese tamaño encaja con soleras y capas de poco espesor, donde una piedra gruesa no tiene sitio. Si tu obra tiene proyecto y pide un árido mayor, dínoslo antes de pedir el hormigón: una piedra más grande pide una tubería más gruesa, y eso cambia la bomba.

#### Cómo se organiza el día del vertido

La cuba descarga en la tolva de la bomba y la bomba empuja el hormigón hasta la boca de la manguera. Para que eso funcione hacen falta tres cosas: un sitio para la bomba al que la cuba pueda llegar, un recorrido libre para la manguera y la zona de vertido preparada —base, encofrado y armado— antes de que llegue el camión.

Hay dos tipos de bomba. La autobomba lleva una pluma articulada sobre el camión y deja el hormigón desde arriba, por encima del tejado o de la tapia; necesita sitio en la calle para apoyar los estabilizadores. La bomba de tubería va en un remolque junto a la cuba y empuja el hormigón por un tubo tendido por el suelo, que acaba en una manguera: entra por un pasillo, un garaje o una escalera.

Como referencia del sector, una pluma llega de 20 a 60 metros, según el camión. Una bomba de tubería lleva el hormigón de 80 a 200 metros, según el equipo, y las pequeñas mueven en torno a 15-20 m³ por hora. Cuál va en tu obra se decide al ver el acceso: con la medida del recorrido delante te decimos si se llega y con qué.

El hormigón llega de planta en cuba, con la resistencia que pide la obra y árido de 12 mm. Para bombearlo tiene que venir con una consistencia mínima, porque una masa seca atasca la tubería, y eso se fija con la planta al hacer el pedido. Quién lo pide y qué hormigón lleva lo hablamos al preparar el presupuesto.

#### En casa y en obra

Si vas a hacer una solera en el patio de atrás y el camión no entra por la calle, el bombeo es lo que evita meter el hormigón a carretilla por el garaje o por el salón.

Si eres constructor o reformista, es el vertido con la manguera hasta el tajo. Si además necesitas que se extienda, se reglee o se fratase, dínoslo al pedir el presupuesto y te decimos qué entra.

#### Bomba, canaleta o carretilla

Son tres maneras de llevar el hormigón al sitio. La canaleta es la del propio camión: si la cuba se arrima al tajo, descarga directa y no hace falta nada más. La carretilla sirve para poco volumen y poca distancia, a costa de viajes y de tiempo con el hormigón fraguando. La bomba es para cuando la cuba no llega y el volumen ya no se mueve a mano.

Desde qué volumen compensa la bomba no tiene una cifra fija. Depende de los metros cúbicos, del recorrido y de lo que costaría hacerlo de otra manera: con esos tres datos lo vemos contigo.

#### Del bombeo al pavimento

La solera que se bombea puede quedarse como base o terminar en un pavimento: [fratasada](/hormigon-fratasado/), [impresa](/hormigon-impreso/) o [pulida](/hormigon-pulido/). Si ya sabes cuál quieres, dilo al pedir el presupuesto: el espesor y el armado de la solera se plantean pensando en él.

Si lo que hay que nivelar es un suelo interior antes de la tarima o el vinílico, no hace falta hormigón: eso es [vertido de autonivelante](/vertido-de-autonivelante/).

### Aplicaciones

El bombeo resuelve un problema de acceso, no de acabado: lo que cambia es por dónde llega el hormigón hasta el sitio.

- **Patio trasero sin acceso para el camión** — La manguera cruza el garaje o la casa, y el hormigón no pasa por la carretilla.
- **Parcela con la entrada estrecha o en cuesta** — El camión se queda en la calle; la manguera hace el resto.
- **Planta alta, ático o azotea** — Sin subir el hormigón a cubos.
- **Sótano o planta baja interior** — Vertido dentro, con el camión fuera.
- **Obra de constructor o reformista** — Soleras y capas de poco espesor, con la manguera hasta el tajo.

### Ficha técnica

| Etiqueta | Valor |
|---|---|
| TAMAÑO MÁXIMO DE ÁRIDO | 12 mm |
| TIPO DE BOMBA | Pluma o tubería, según el acceso |
| ALCANCE | Pluma 20-60 m · tubería 80-200 m · según equipo |
| CAUDAL | Bomba de tubería pequeña: 15-20 m³/h · según equipo |
| EN OBRA | Sitio para la bomba y paso libre para la manguera |
| HORMIGÓN | De planta · árido 12 mm · resistencia según obra |
| DÍA DEL VERTIDO | Cuba y bomba a la misma hora, con la zona preparada |

(Las filas VOLUMEN MÍNIMO y ANTELACIÓN DE RESERVA se sustituyeron por EN OBRA y DÍA DEL VERTIDO el
2026-10-31: solo tenían sentido con el dato de la empresa. Ver B10, B11 y B13 en
`datos-investigados.md`.)

### Cuándo NO hace falta bombear

Si el camión se puede arrimar y descargar con su canaleta, la bomba es un gasto que no necesitas. Para muy poco hormigón —un escalón, un hueco, una arqueta— tampoco suele compensar: a veces sale mejor la carretilla. Si lo que buscas es un suelo interior plano para la tarima, no es hormigón bombeado: es autonivelante. Y el bombeo no es un acabado: lo que se ve al final es la solera, fratasada o impresa.

- [Ver vertido de autonivelante](/vertido-de-autonivelante/)
- [Ver hormigón fratasado](/hormigon-fratasado/)
- [Ver hormigón impreso](/hormigon-impreso/)

### Preguntas frecuentes

**¿Cuándo hace falta bombear el hormigón?** · `pumpWhen` · tema `proceso`

Cuando la cuba no puede acercarse a donde va el hormigón: un patio trasero, una parcela sin entrada para el camión, un sótano o una planta alta. Si el camión llega al sitio, descarga con su canaleta y la bomba sobra.

**¿Qué ventaja tiene bombear con árido de 12 mm?** · `pumpAggregate` · tema `proceso`

Con una piedra más pequeña, el hormigón pasa por una manguera más estrecha. Pesa menos y se maneja a mano, así que entra por sitios donde una manguera gruesa no cabe. Va bien en soleras y capas de poco espesor. Si tu obra tiene proyecto y pide un árido mayor, cuéntanoslo antes de pedir el hormigón.

**¿Qué tiene que estar listo el día del bombeo?** · `pumpSetup` · tema `terreno`

Un hueco para la bomba al que llegue la cuba, un paso libre para la manguera y la zona de vertido terminada: la base compactada, el encofrado y el armado, si lo lleva. El hormigón fresco no espera, así que todo eso tiene que estar hecho antes de que llegue el camión.

**¿Compensa bombear poco hormigón?** · `pumpSmallVolume` · tema `precio`

Depende del acceso. Si el camión llega, no: la bomba suma un coste que no hace falta. Si no llega, la otra opción es moverlo a carretilla, y con muy poco hormigón a veces sigue siendo lo razonable. Dinos cuánto es y por dónde hay que pasar, y te decimos qué sale mejor.

**¿Cuánto cuesta bombear el hormigón?** · `pumpPrice` · tema `precio`

No publicamos precios. El del bombeo depende sobre todo de cuánto hormigón hay que mover, de la distancia y la altura que tiene que salvar la manguera y del tiempo que la bomba pasa en la obra. Con esos datos te damos un precio cerrado antes de empezar.

## Vertido de autonivelante — `/vertido-de-autonivelante/`

### Metadatos y hero

| Campo | Texto |
|---|---|
| `name` | Vertido de autonivelante |
| `title` (54 car., la plantilla añade «\| Pavimentos Albufera») | Vertido de autonivelante en Valencia: nivelar el suelo |
| `description` (152 car.) | Vertido de autonivelante para dejar el suelo interior plano antes de la tarima, el vinílico o el microcemento. Qué es, cómo se aplica y cuándo no sirve. |
| `h1` | Vertido de autonivelante en Valencia, Castellón y Alicante |
| `intro` (entradilla) | Una masa fluida que se reparte sola y deja el suelo a nivel. La base plana que piden la tarima, el vinílico o el microcemento. |
| `heroLabelLines` | `AUTONIVELANTE` / `BASE PLANA · INTERIOR` |
| `cardText` (tarjeta de la home) | Suelo interior a nivel, listo para tarima, vinílico o microcemento. |
| `hasFinishes` | `false` (sin muestrario ni botón «Ver acabados») |

### Banda «Qué es» — H2: Qué es el autonivelante

Un mortero muy fluido que, al verterlo, se reparte solo y se nivela por su propio peso. Deja una base plana y lisa para el pavimento final: tarima, laminado, vinílico, cerámica o microcemento. No es el suelo que se ve: es el que hace que el de encima quede bien.

#### Cuándo hace falta

Cuando la solera tiene desniveles, cejas o zonas hundidas que el suelo nuevo no va a perdonar. Una tarima flotante sobre una base irregular cruje y se mueve; un vinílico en lámina marca cada bache; un [microcemento](/microcemento/) repite la forma de lo que tiene debajo.

También sirve para recrecer: subir el suelo de una habitación hasta la altura de la de al lado, o dejar a cota la planta baja después de levantar el pavimento viejo.

#### Cómo se aplica

Primero, el soporte: firme, limpio y seco, sin polvo ni piezas sueltas. Encima va una imprimación, que mejora el agarre y evita que el suelo de debajo le robe el agua a la masa. Al pie de las paredes se pone una banda perimetral, para que la capa nueva no quede pegada a ellas y pueda moverse sin fisurarse.

Después se vierte y se pasa un rodillo de púas, que saca el aire y ayuda a que la masa se reparta. Se puede amasar en obra y verter a mano, o mezclar y bombear con máquina, que es lo habitual en superficies grandes. Algunos llegan ya amasados en cuba, desde planta, y se bombean. Cuál conviene en tu obra depende de los metros y del acceso.

#### Tipos, espesores y tiempos

Hay autonivelantes de base cemento y de sulfato cálcico, la anhidrita. Cada producto tiene su espesor mínimo y máximo y sus plazos. La anhidrita no lleva bien la humedad, así que en baños, cocinas y zonas que se mojan se suele preferir el de cemento.

Como referencia del sector, los de cemento van en capa fina: desde 2 o 3 mm hasta 30 o 50, según el producto. Se pisan a las 3-12 horas y, en capa fina, admiten el pavimento al día o a los dos días. Los de anhidrita van de unos 12 a 80 mm y se pisan a las 24-48 horas. Antes del pavimento necesitan de una a tres semanas de secado en capa fina, y más cuanto más gruesa.

Antes de poner la tarima o el vinílico se mide la humedad que queda en la base: decide eso, no el calendario. Cada producto lleva en su ficha su clase según la norma UNE-EN 13813: CT si es de cemento, CA si es de anhidrita, una C por la resistencia a compresión y una F por la de flexión. Lo habitual va de C20 a C30 y de F5 a F8. El producto concreto se elige con el espesor y el uso de tu obra, y sus cifras mandan sobre estas.

#### Autonivelante, microcemento o solera nueva

El microcemento es un acabado de milímetros que se queda a la vista; el autonivelante corrige la planitud y se tapa. Por eso pueden ir juntos: primero la base a nivel y, encima, el acabado continuo.

Lo que no hace es sustituir a una solera. Si no hay suelo de hormigón, o el que hay está roto, primero va una solera nueva —con [bombeo de hormigón](/bombeo-de-hormigon/) si el camión no llega—. Y si quieres ver el hormigón, esa solera puede quedar [pulida](/hormigon-pulido/) o [fratasada](/hormigon-fratasado/).

### Aplicaciones

Va en interior, entre la solera y el suelo que se ve. Casi siempre en una reforma: cuando el suelo nuevo pide una base que la que hay no da.

- **Reforma de vivienda** — Base plana después de levantar el suelo viejo.
- **Antes de tarima, laminado o vinílico** — Sin baches que crujan ni se marquen.
- **Base para microcemento** — Plano antes del acabado continuo.
- **Recrecido entre estancias** — Para igualar la altura de dos habitaciones.
- **Local comercial u oficina** — La base del pavimento que va encima.

### Ficha técnica

| Etiqueta | Valor |
|---|---|
| USO | Interior, bajo otro pavimento |
| SOPORTE | Firme, limpio y seco |
| PREPARACIÓN | Imprimación y banda perimetral |
| TIPO | Base cemento o anhidrita, según estancia y espesor |
| ESPESOR | Cemento 2-50 mm · anhidrita 12-80 mm · según producto |
| RESISTENCIA | Clase UNE-EN 13813 · habitual C20-C30, F5-F8 |
| PISABLE | Cemento 3-12 h · anhidrita 24-48 h · según producto |
| LISTO PARA EL PAVIMENTO FINAL | Cemento 1-2 días · anhidrita 1-3 semanas o más · según espesor y humedad |

### Cuándo NO elegir autonivelante

No es un suelo de exterior ni un acabado para dejarlo visto. En un patio o una terraza va una solera de hormigón con su acabado, impreso o fratasado. Si quieres el aspecto de cemento continuo dentro de casa, eso es microcemento o una solera pulida. Y si el soporte se mueve, tiene grietas vivas o humedad que sube del terreno, el autonivelante no lo arregla: lo tapa una temporada. Eso se resuelve antes.

- [Ver microcemento](/microcemento/)
- [Ver hormigón pulido](/hormigon-pulido/)
- [Ver hormigón impreso](/hormigon-impreso/)

### Preguntas frecuentes

**¿Para qué sirve el autonivelante?** · `selfLevelWhat` · tema `proceso`

Para dejar un suelo interior plano y liso antes de poner el pavimento final. Corrige los desniveles y las irregularidades de la solera, que es justo lo que necesitan la tarima, el laminado, el vinílico o el microcemento para quedar bien.

**¿Sobre qué suelo se puede verter el autonivelante?** · `selfLevelSupport` · tema `terreno`

Sobre una solera de hormigón, un recrecido o un suelo cerámico bien pegado, siempre que esté firme, limpio y seco. Antes va una imprimación que mejora la adherencia. Si el soporte se mueve, está suelto o tiene humedad, eso se arregla primero: el autonivelante no lo corrige.

**¿Se puede dejar el autonivelante visto, como suelo final?** · `selfLevelFinish` · tema `proceso`

En una casa, no es lo suyo. El autonivelante de regularización está pensado para recibir otro pavimento encima, no para quedarse a la vista y pisarse a diario. Si quieres un suelo continuo de cemento visto, eso es microcemento sobre el suelo que tienes, o una solera de hormigón pulido o fratasado.

**¿Qué diferencia hay entre autonivelante y microcemento?** · `selfLevelVsMicro` · tema `proceso`

Hacen trabajos distintos. El autonivelante es una base: endereza el suelo y queda tapado por otro. El microcemento es un acabado de 2 a 3 milímetros que se ve, y que sigue la forma de lo que tiene debajo. Por eso se combinan bien: primero se nivela y luego va el microcemento.

**¿Cuándo se puede pisar el autonivelante y poner el suelo encima?** · `selfLevelTimes` · tema `plazo`

Depende del producto y del espesor, y son dos plazos distintos. El de pisar es corto. El de poner el pavimento final es más largo, porque la tarima o el vinílico piden que la base haya secado hasta una humedad concreta. Te damos los dos con el producto y el espesor de tu obra delante.

**¿Cuánto cuesta el autonivelante por metro cuadrado?** · `selfLevelPrice` · tema `precio`

No publicamos precios. Depende de la superficie, del espesor que hace falta para dejar el suelo a nivel —que es lo que decide cuánto material entra— y del estado del soporte: si antes hay que levantar el suelo viejo, limpiarlo o reparar grietas. Lo medimos y te damos un precio cerrado.


---

## Datos pendientes del cliente

**Desde el 2026-10-31 no queda ningún `{{…}}` en estas dos páginas** (ni en `services.ts` ni en
las preguntas `pump*`/`selfLevel*` de `faq.ts`), así que en pantalla ya no sale ningún dato entre
corchetes atenuados. Los 21 pendientes que había se han resuelto así:

- **Técnicos (T)** — B4, B5, B6, A2 (espesores y plazos), A4, A5, A6, A7: rango habitual del
  sector, redactado como referencia y no como compromiso de la empresa.
- **De la empresa (E)** — B1, B2, B3, B7, B8, B9, B10, B11, B12, B13, A1, A3, A8 (y la marca de
  A2): no se afirma nada; la frase o la fila se ha reescrito para ser verdad sin el dato.

La tabla completa —texto anterior, texto nuevo, tipo, fuentes con fecha de consulta y **qué
preguntar al cliente**— está en [`datos-investigados.md`](datos-investigados.md). Las preguntas
al cliente siguen siendo las mismas que había aquí; lo que cambia es que la web ya no espera a la
respuesta para leerse entera. Cuando el cliente conteste, se sustituye el rango o la frase por su
dato: un commit por dato (regla de `CLAUDE.md`).

### Datos que valen para las dos páginas y no tienen `{{…}}`

No son corchetes del texto, pero conviene confirmarlos con el cliente antes de publicar:

| # | Qué | Dónde | Pregunta |
|---|---|---|---|
| G1 | Zona de servicio | H1 de las dos páginas («en Valencia, Castellón y Alicante», el patrón de los seis servicios) | ¿Dais bombeo y autonivelante en las tres provincias, o solo en una zona más cercana a Sollana? |
| G2 | «Cómo trabajamos» (los 4 `PASOS` de la plantilla) | Sección común de todas las páginas de servicio | Esos pasos hablan de «Equipo propio», de «80-100 m² en 2 o 3 días», de «24-48 h sin pisar, 28 días de curado» y de «10 años de garantía y resellado». Ninguno está confirmado para bombeo ni para autonivelante. Ver nota para el agente de estructura. |
| G3 | Clientes profesionales | Aplicaciones de bombeo («Obra de constructor o reformista») y guía «En casa y en obra» | ¿Dais el servicio de bombeo a constructores y reformistas, o solo dentro de vuestras propias obras? |

---

## Notas de implementación

- **Precios.** Ninguna cifra. Las dos FAQ de precio (`pumpPrice`, `selfLevelPrice`) siguen el
  mismo mecanismo que `priceFactors`: de qué depende y precio cerrado tras ver la obra. No hay
  filas de precios en `packages/content/src/data` que ampliar (`/precios/` y la calculadora se
  retiraron en septiembre de 2026).
- **Ficha técnica con `{{…}}`.** Los valores de `specs` admiten el marcado de pendiente; el agente
  de estructura amplió `SpecRow` para que la tabla lo pinte como `<DatoPendiente>`. Desde el
  2026-10-31 ninguna fila de estas dos fichas lo usa (ver `datos-investigados.md`).
- **`legal.ts`.** La fila ACTIVIDAD del aviso legal incluye desde el 2026-10-30 los dos servicios
  nuevos: «… y microcemento. Bombeo de hormigón y vertido de autonivelante». La fecha común de última
  revisión (`lastLegalReview`) pasa al 30 de octubre de 2026, a petición del dueño.
- **Landings de campaña.** Los dos servicios nuevos no tienen `/lp/`, igual que fratasado y
  desactivado.
