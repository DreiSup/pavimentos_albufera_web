# Copy de los dos servicios nuevos: bombeo de hormigón y vertido de autonivelante

**Fecha:** 2026-10-30 · **Estado:** borrador **pendiente de validación del cliente**.

El responsable del proyecto autorizó redactar copy nuevo para estas dos páginas. El cliente solo
ha confirmado dos cosas:

1. Hacen **bombeo y vertido de hormigón con árido de 12 mm**.
2. Hacen **vertido de autonivelante**.

Todo lo demás es de dos tipos:

- **Técnica explicada en general**: cómo funciona un bombeo, qué es un autonivelante, qué pide
  el soporte. Son datos del oficio, no compromisos de la empresa, y van sin cifras.
- **Compromisos de la empresa** (alcance, caudal, volumen mínimo, producto, espesores, plazos,
  precios, si la bomba es propia): van como `{{dato pendiente}}` y en pantalla salen como
  `<DatoPendiente>`, entre corchetes atenuados. En este documento se ven como `` `[así]` ``.

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

Ese tamaño encaja con soleras y capas de poco espesor, donde una piedra gruesa no tiene sitio. Si tu obra tiene proyecto y pide un árido mayor, dínoslo antes de pedir el hormigón: `[si bombeáis también hormigón con árido de más de 12 mm]`.

#### Cómo se organiza el día del vertido

La cuba descarga en la tolva de la bomba y la bomba empuja el hormigón hasta la boca de la manguera. Para que eso funcione hacen falta tres cosas: un sitio para la bomba al que la cuba pueda llegar, un recorrido libre para la manguera y la zona de vertido preparada —base, encofrado y armado— antes de que llegue el camión.

La bomba que usamos: `[propia o contratada, y de qué tipo: bomba de manguera o pluma sobre camión]`. Hasta dónde llega y cuánto mueve: `[alcance en metros de manguera o de pluma, y caudal en m³/h]`. Con la medida del recorrido delante te decimos si se llega.

El hormigón: `[si lo pedís vosotros a planta o lo pide el cliente, y qué resistencia y consistencia servís]`.

#### En casa y en obra

Si vas a hacer una solera en el patio de atrás y el camión no entra por la calle, el bombeo es lo que evita meter el hormigón a carretilla por el garaje o por el salón.

Si eres constructor o reformista, es el vertido con la manguera hasta el tajo. Lo que entra además de bombear y verter: `[si extendéis, regleáis y fratasáis, o solo bombeo y vertido]`.

#### Bomba, canaleta o carretilla

Son tres maneras de llevar el hormigón al sitio. La canaleta es la del propio camión: si la cuba se arrima al tajo, descarga directa y no hace falta nada más. La carretilla sirve para poco volumen y poca distancia, a costa de viajes y de tiempo con el hormigón fraguando. La bomba es para cuando la cuba no llega y el volumen ya no se mueve a mano.

Desde qué volumen compensa traer la bomba: `[volumen mínimo por servicio, en m³]`.

#### Del bombeo al pavimento

La solera que se bombea puede quedarse como base o terminar en un pavimento: [fratasada](/hormigon-fratasado/), [impresa](/hormigon-impreso/) o [pulida](/hormigon-pulido/). `[si el bombeo se presupuesta junto con el pavimento o como servicio aparte]`.

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
| TIPO DE BOMBA | `[manguera o pluma · propia o contratada]` |
| ALCANCE | `[metros de manguera o de pluma]` |
| CAUDAL | `[m³/h]` |
| VOLUMEN MÍNIMO | `[m³ por servicio]` |
| HORMIGÓN | `[resistencia y consistencia · quién lo pide a planta]` |
| ANTELACIÓN DE RESERVA | `[días]` |

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

Después se vierte y se pasa un rodillo de púas, que saca el aire y ayuda a que la masa se reparta. Cómo lo vertemos nosotros: `[a mano o con bomba]`.

#### Tipos, espesores y tiempos

Hay autonivelantes de base cemento y de sulfato cálcico, la anhidrita. Cada producto tiene su espesor mínimo y máximo y sus plazos. La anhidrita no lleva bien la humedad, así que en baños, cocinas y zonas que se mojan se suele preferir el de cemento.

Lo que vertemos nosotros: `[tipo y marca del autonivelante, espesor mínimo y máximo, y plazo para pisarlo y para poner el pavimento final]`.

#### Sobre suelo radiante

Sobre los tubos de un suelo radiante, una masa fluida los envuelve sin dejar bolsas de aire, y eso ayuda a que el calor llegue parejo al pavimento. `[si vertéis autonivelante sobre suelo radiante, y con qué producto]`.

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
| TIPO | `[base cemento o anhidrita · marca]` |
| ESPESOR | `[mínimo y máximo]` |
| RESISTENCIA | `[clase a compresión y a flexión]` |
| PISABLE | `[horas]` |
| LISTO PARA EL PAVIMENTO FINAL | `[días, según espesor]` |

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

Cada fila es un `{{…}}` del código. Cuando el cliente dé el dato, se sustituye y se quita el
tratamiento de pendiente: un commit por dato (regla de `CLAUDE.md`).

### Bombeo de hormigón (`/bombeo-de-hormigon/`)

| # | Pendiente (texto tal cual) | Dónde aparece | Qué preguntar al cliente |
|---|---|---|---|
| B1 | `si bombeáis también hormigón con árido de más de 12 mm` | Guía · «Por qué árido de 12 mm», 2.º párrafo | ¿Bombeáis solo con árido de 12 mm, o también con árido mayor si el proyecto lo pide? |
| B2 | `propia o contratada, y de qué tipo: bomba de manguera o pluma sobre camión` | Guía · «Cómo se organiza el día del vertido», 2.º párrafo | ¿La bomba es vuestra o la subcontratáis? ¿Es una bomba de manguera (remolque/estática) o un camión con pluma? |
| B3 | `manguera o pluma · propia o contratada` | Ficha técnica · TIPO DE BOMBA | Lo mismo que B2. Una sola respuesta cierra las dos. |
| B4 | `alcance en metros de manguera o de pluma, y caudal en m³/h` | Guía · «Cómo se organiza el día del vertido», 2.º párrafo | ¿Cuántos metros de manguera lleváis (o cuánto alcanza la pluma), en horizontal y en altura? ¿Cuántos m³/h mueve la bomba? |
| B5 | `metros de manguera o de pluma` | Ficha técnica · ALCANCE | Lo mismo que B4 (alcance). |
| B6 | `m³/h` | Ficha técnica · CAUDAL | Lo mismo que B4 (caudal). |
| B7 | `si lo pedís vosotros a planta o lo pide el cliente, y qué resistencia y consistencia servís` | Guía · «Cómo se organiza el día del vertido», 3.er párrafo | ¿El hormigón lo pedís vosotros a la planta o lo pide el cliente/constructor? ¿Qué hormigón soléis bombear (p. ej., resistencia HA-25, consistencia)? |
| B8 | `resistencia y consistencia · quién lo pide a planta` | Ficha técnica · HORMIGÓN | Lo mismo que B7. |
| B9 | `si extendéis, regleáis y fratasáis, o solo bombeo y vertido` | Guía · «En casa y en obra», 2.º párrafo | Al constructor o reformista, ¿le dais solo el bombeo y el vertido, o también extendéis, regleáis y fratasáis? |
| B10 | `volumen mínimo por servicio, en m³` | Guía · «Bomba, canaleta o carretilla», 2.º párrafo | ¿Hay un mínimo de m³ por servicio de bombeo? ¿Cuál? |
| B11 | `m³ por servicio` | Ficha técnica · VOLUMEN MÍNIMO | Lo mismo que B10. |
| B12 | `si el bombeo se presupuesta junto con el pavimento o como servicio aparte` | Guía · «Del bombeo al pavimento», 1.er párrafo | Si además hacéis el pavimento (fratasado, impreso…), ¿el bombeo va dentro de ese presupuesto o aparte? ¿Dais el bombeo suelto, sin pavimento? |
| B13 | `días` | Ficha técnica · ANTELACIÓN DE RESERVA | ¿Con cuántos días de antelación hay que reservar la bomba? |

### Vertido de autonivelante (`/vertido-de-autonivelante/`)

| # | Pendiente (texto tal cual) | Dónde aparece | Qué preguntar al cliente |
|---|---|---|---|
| A1 | `a mano o con bomba` | Guía · «Cómo se aplica», 2.º párrafo | ¿El autonivelante lo vertéis a mano (amasado en obra) o con bomba/máquina de mezcla? |
| A2 | `tipo y marca del autonivelante, espesor mínimo y máximo, y plazo para pisarlo y para poner el pavimento final` | Guía · «Tipos, espesores y tiempos», 2.º párrafo | ¿Qué producto usáis (base cemento o anhidrita, marca y referencia)? ¿Entre qué espesores lo aplicáis? ¿Cuándo se pisa y cuándo se puede poner encima la tarima o el vinílico? |
| A3 | `base cemento o anhidrita · marca` | Ficha técnica · TIPO | Lo mismo que A2 (tipo y marca). |
| A4 | `mínimo y máximo` | Ficha técnica · ESPESOR | Lo mismo que A2 (espesores), en mm. |
| A5 | `clase a compresión y a flexión` | Ficha técnica · RESISTENCIA | La clase del producto según su ficha técnica (p. ej., «CT-C20-F5» en uno de cemento). Basta con la ficha del fabricante. |
| A6 | `horas` | Ficha técnica · PISABLE | Horas hasta poder pisarlo, según el producto que usáis. |
| A7 | `días, según espesor` | Ficha técnica · LISTO PARA EL PAVIMENTO FINAL | Días hasta poder colocar el pavimento final, según espesor. |
| A8 | `si vertéis autonivelante sobre suelo radiante, y con qué producto` | Guía · «Sobre suelo radiante» | ¿Hacéis autonivelante sobre suelo radiante? ¿Con qué producto? Si no lo hacéis, se quita el bloque entero. |

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
- **Ficha técnica con `{{…}}`.** Los valores de `specs` usan el marcado de pendiente; el agente de
  estructura amplió `SpecRow` para que la tabla lo pinte como `<DatoPendiente>`.
- **`legal.ts`.** La fila ACTIVIDAD del aviso legal incluye desde el 2026-10-30 los dos servicios
  nuevos: «… y microcemento. Bombeo de hormigón y vertido de autonivelante». La fecha común de última
  revisión (`lastLegalReview`) pasa al 30 de octubre de 2026, a petición del dueño.
- **Landings de campaña.** Los dos servicios nuevos no tienen `/lp/`, igual que fratasado y
  desactivado.
