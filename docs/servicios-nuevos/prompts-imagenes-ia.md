# Prompts de imagen IA provisional · Bombeo de hormigón y vertido de autonivelante

Fecha: 2026-10-30. Servicios: **Bombeo de hormigón** (`/bombeo-de-hormigon/`, id `bombeo`) y
**Vertido de autonivelante** (`/vertido-de-autonivelante/`, id `autonivelante`).

Este documento da los prompts para generar con un modelo de imagen fotos **provisionales** de los
dos servicios hasta que el cliente mande las suyas. No cambia código ni contenido.

---

## 0. Antes de generar nada: esto choca con una regla escrita

Hoy el proyecto dice, en tres sitios, que **sin original no hay imagen provisional**:

- `design/README.md` §10: «Mientras no lleguen los originales, **no se usan imágenes
  provisionales**: se usa el componente *bloque de posición*».
- `CLAUDE.md`: «Sin originales, `<BloquePosicion>`».
- `design/01-sistema-de-diseno.md` §3.11: el bloque de posición existe para que «la ausencia de
  original siga siendo visible y no se tape con nada».

Una foto generada por IA es una imagen provisional, la haga quien la haga. **Subirlas exige una
decisión del dueño y que quede escrita**: una entrada nueva en `design/05-pendientes-y-decisiones.md`
§B o §C (fecha, alcance, que solo cubre estos dos servicios y qué la hace caducar) y la enmienda
correspondiente en `design/README.md` §10. Sin esa entrada, estos dos servicios se quedan con el
`<BloquePosicion>` que ya pintan hoy, que es lo correcto.

Si la decisión se toma, este documento fija **dónde pueden ir y dónde no** para que la imagen
provisional no se convierta en una afirmación falsa.

---

## 1. Propósito, alcance y reglas de uso

### 1.1 Para qué sirven

Ilustrar **qué es el servicio**, no **dónde lo hemos hecho**. Una foto generada enseña una autobomba
o un autonivelante extendiéndose; no enseña una obra de Pavimentos Albufera, porque no existe.

### 1.2 Dónde SÍ pueden ir

| Hueco | Campo | Componente | Proporción | `sizes` |
|---|---|---|---|---|
| Hero de la página de servicio | `Service.heroImage` → `imagenHero` | `PaginaServicio.tsx` → `<Foto proporcion="4/3" prioridad>` | **4:3** | `(min-width: 1280px) 560px, (min-width: 768px) 50vw, 100vw` |
| Tarjeta del servicio en la home | `Service.cardImage` → `imagenTarjeta` | `app/page.tsx` → `<Foto proporcion="16/10">` | **16:10** | `(min-width: 768px) 30vw, 100vw` |
| Detalle | — (hoy no hay hueco, ver §1.5) | — | **4:3** | — |

### 1.3 Dónde NO pueden ir nunca

**No asociarlas jamás a un proyecto, un municipio ni una ficha de obra.** Hacerlo sería presentar
como obra real algo que no ha pasado. En concreto, nunca en:

- `Project.images` (`packages/content/src/data/projects.ts`) ni, por tanto, en `/proyectos/[slug]/`,
  en las tarjetas de obra (`TarjetaProyecto`) ni en el carrusel del hero de la home.
- Las páginas de zona (`/zonas/[municipio]/`), que derivan su foto del primer proyecto.
- El muestrario (`Finish.sample`), que afirma modelo y color. Además estos dos servicios no tienen
  muestrario (`hasFinishes: false`).
- Un artículo del blog que hable de una obra concreta.
- Con una `<EtiquetaTecnica>` de municipio, año o m². La etiqueta del hero de servicio
  (`BOMBEO · ÁRIDO 12 MM`) habla del servicio, no de una obra, y es compatible.
- Redes, Google Business Profile o anuncios como «trabajo realizado».

### 1.4 Nombres de archivo y ubicación

**No usar el patrón de la raíz `municipio-servicio-modelo-color-año.jpg`**: afirma municipio y año
de una obra (`design/README.md` §10). Prefijo `ia-`, servicio y hueco, nada más:

```
apps/web/public/obras/_ia-provisional/
  ia-bombeo-hero.jpg
  ia-bombeo-tarjeta.jpg
  ia-bombeo-detalle-pluma.jpg
  ia-bombeo-detalle-manguera-patio.jpg
  ia-bombeo-detalle-arido-mallazo.jpg
  ia-bombeo-detalle-paso-lateral.jpg
  ia-autonivelante-hero.jpg
  ia-autonivelante-tarjeta.jpg
  ia-autonivelante-detalle-vertido.jpg
  ia-autonivelante-detalle-rodillo.jpg
  ia-autonivelante-detalle-terminado.jpg
  ia-autonivelante-detalle-preparacion.jpg
```

Por qué dentro de `/obras/`: `apps/web/scripts/verificar-imagenes.mjs` solo mide las rutas que
empiezan por `/obras/`, `/acabados/`, `/blog/` o `/marca/`. Fuera de ahí el build no comprobaría ni
que el archivo existe ni sus píxeles. La subcarpeta `_ia-provisional/` las separa de la obra real,
igual que `_sin-atribuir/` separa la obra sin atribuir. El nombre de archivo no sale nunca en
pantalla.

Si se generan varias tomas del mismo hueco, solo se sube la elegida; las descartadas no entran en
el repositorio.

### 1.5 Las imágenes de «detalle» no tienen hueco hoy

`PaginaServicio.tsx` pinta **una sola foto**: la del hero. «Cómo trabajamos», la ficha técnica, la
guía y las aplicaciones van sin imagen; el muestrario no existe para estos servicios, y «Obra
ejecutada» solo aparece cuando haya una obra real (y sus fotos tienen que ser reales).

Los detalles se generan igualmente, en **4:3**, por dos razones: sirven de recambio del hero si la
toma principal no convence, y quedan listos si algún día se abre un hueco de detalle. Si se abre,
no se improvisa: se usa una de las proporciones de `PROPORCIONES` (`BloquePosicion.tsx`) y se
documenta en `design/01-sistema-de-diseno.md`, como pide `CLAUDE.md`.

⚠️ Además, a día de hoy **la rejilla de servicios de la home solo lista los seis originales**
(`apps/web/src/app/page.tsx`, `const servicios`). La tarjeta de estos dos servicios no se pinta hasta
que alguien los añada ahí; el campo `cardImage` sí existe en el esquema.

### 1.6 Cómo marcarlas en `INVENTARIO.md`

Añadir al final de `apps/web/public/obras/INVENTARIO.md` un apartado propio, fuera de los recuentos
de la mediateca (las 164 / 125 / 110 son material del cliente y estas no lo son):

```markdown
## 2026-xx-xx — Imágenes generadas por IA, provisionales

🔴 **No son obra.** Generadas con IA para ilustrar los servicios de bombeo y autonivelante
mientras el cliente no manda originales. Decisión: `design/05` §<entrada>.
Solo hero, tarjeta de servicio y detalle. **Nunca** en `Project.images`, zonas, muestrario ni
con etiqueta de municipio o año. Se borran el día que llegue el original de su hueco.

| Archivo | Servicio | Hueco | Px | Modelo y fecha | Prompt | Estado |
|---|---|---|---|---|---|---|
| `_ia-provisional/ia-bombeo-hero.jpg` | bombeo | hero 4:3 | 2000×1500 | <modelo>, 2026-xx-xx | B-1 | en uso |
| … | | | | | | |
```

La columna «Prompt» usa los códigos de este documento (B-1, A-3…). Junto al `heroImage` /
`cardImage` correspondiente en `packages/content/src/data/services.ts` conviene un comentario de una
línea que apunte a esa tabla, para que nadie la confunda con una foto de obra.

**Sustituirla por el original es un commit** que borra el archivo `ia-…`, quita su fila del
inventario y cambia el `src`, igual que cada `[corchete]` sustituido por un dato real.

### 1.7 Metadatos

- Exportar **JPEG sRGB**, calidad 80–85, sin GPS (no lo tendrán, pero comprobarlo).
- Conservar o añadir el campo IPTC `Digital Source Type = trainedAlgorithmicMedia` (y la
  credencial C2PA si el generador la incrusta). No se ve en pantalla y deja constancia del origen.
- Ningún filtro, viñeta ni velo después: `design/01` §3.11 pide la foto «sin tratamiento».

---

## 2. Guía de estilo común: que parezcan de la misma sesión

### 2.1 El registro de las fotos reales del cliente

Abiertas para calcar el registro: `denia-impreso-piedra-inglesa-gris.jpg`,
`moncada-impreso-espiga-117-2025.jpg`, `_sin-atribuir/WhatsApp-Image-2023-08-22-at-09.12.34.jpeg`,
`_sin-atribuir/hormigon-pulido-5.jpg` y `_sin-atribuir/microcemento-valencia-1.jpg`. Lo que tienen
en común:

- **Hechas con el móvil por quien hace la obra**, de pie, a la altura de los ojos (1,5–1,6 m),
  angular de móvil (~26 mm equivalente), a veces con el horizonte un pelo torcido. No son de
  fotógrafo: nadie ha puesto trípode ni ha despejado el plano.
- **El suelo ocupa los dos tercios inferiores** del encuadre; la casa y la vegetación quedan arriba,
  a menudo cortadas por el borde.
- **Luz natural sin retocar**: sol bajo de primera hora o de tarde con sombras largas de palmeras y
  cipreses, cielo azul pálido o encapotado gris; alguna alta luz quemada en el enfoscado blanco. El
  HDR del móvil se nota poco.
- **Entorno**: chalé de enfoscado blanco o crema, teja árabe, rejas de forja, celosía de bloque
  blanco, murete de mampostería, tierra rojiza, naranjos, palmeras, cipreses, pinar al fondo,
  vallas amarillas de obra, un dumper, un contenedor. En la de Moncada, plaza de pueblo con ladrillo
  caravista y naranjos en alcorque.
- **Interiores**: pared blanca lisa, carpintería de madera, luz de ventana suave, colores
  neutros y algo fríos.
- **Calidad**: JPEG de móvil, nitidez razonable, algo de ruido en sombras, color natural tirando a
  cálido con sol y a neutro con nublado. Nada de saturación de catálogo.

### 2.2 Bloque de estilo que se añade al final de CADA prompt positivo

Copiarlo tal cual detrás del prompt de cada ficha:

```
Documentary construction-site photograph taken by the contractor with a recent smartphone main
camera (26 mm equivalent, f/1.8), handheld at standing eye level unless stated otherwise,
straight-out-of-camera JPEG look. Natural Mediterranean light, realistic exposure with slightly
clipped highlights on white render and deep but readable shadows, mild sensor noise in the
shadows, natural colour, no colour grading. Province of Valencia, eastern Spain: real, lived-in,
slightly messy jobsite. Photorealistic, true-to-life scale and physics, unposed, no people facing
the camera, no visible faces. All vehicles, machines, sacks, buckets and clothing are plain and
unbranded: no logos, no lettering, no number plates, no stickers, no signage.
```

### 2.3 Prompt negativo común

Para los modelos que lo admiten (si no, añadir «Avoid: …» al final del positivo):

```
people facing camera, faces, recognisable person, portrait, smiling worker, posing, hard hat
selfie, crowd, logo, brand name, lettering, text, writing, numbers, number plate, licence plate,
watermark, signature, sticker, signage, company name on truck, printed sacks, CGI, 3D render,
illustration, painting, cartoon, plastic look, HDR, overprocessed, oversaturated, teal and orange
grading, vignette, tilt-shift, bokeh balls, lens flare, glossy magazine look, stock photo,
perfectly clean site, symmetrical showroom, futuristic machinery, impossible machinery,
deformed hands, extra fingers, melted tools, floating objects, duplicated objects, warped
perspective, wrong scale, American suburban house, wooden clapboard house, snow, tropical
jungle, desert
```

### 2.4 Tamaño, proporción y recorte

| Hueco | Proporción | Mínimo | Exportar a | Notas |
|---|---|---|---|---|
| Hero | 4:3 | **1600×1200** (el build lo trata como «a sangre» y **falla** por debajo de 1600 de ancho) | 2000×1500 | Esquina inferior derecha tapada por la etiqueta técnica |
| Tarjeta home | 16:10 | **1600×1000** (objetivo; suelo duro 800) | 2000×1250 | Sin superposición |
| Detalle | 4:3 | **1600×1200** | 2000×1500 | Sin superposición |

- **Generar ya en la proporción final** si el modelo lo permite (`--ar 4:3`, `--ar 16:10`, o el
  tamaño equivalente). Si el modelo solo da 1:1, 3:2 o 16:9, generar en el formato más próximo
  **y más ancho** y recortar a la proporción exacta, sin estirar nunca.
- La mayoría de modelos sacan 1024–1536 px de lado largo: **escalar después** con un escalador que
  no invente detalle (o uno generativo con fuerza baja) hasta 2000 px de lado largo, y revisar que
  el escalado no haya convertido la grava en una pasta.
- `<Foto>` recorta con `object-fit: cover` centrado dentro del hueco. Si la proporción del archivo
  es exacta, no recorta nada; si no lo es, corta los bordes. Por eso la proporción va exacta.
- **Hero: dejar libre la esquina inferior derecha** (≈ 40 % del ancho × 20 % del alto). Ahí
  `PaginaServicio` superpone la `<EtiquetaTecnica>` (`BOMBEO / ÁRIDO 12 MM` en bombeo). El sujeto
  principal va en el centro o en el tercio izquierdo.
- **Hero en móvil**: va a ancho completo **encima** del H1 (`order-1`), a unos 390 px CSS. Tiene que
  leerse en pequeño: un sujeto claro y grande, no una vista general con diez cosas.
- **Tarjeta**: a ~30 vw en escritorio y 100 vw en móvil. Un solo gesto reconocible a primera vista.
  El esquema pide que sea **distinta** del hero (`cardImage` «deliberately distinct»): otra toma, no
  un recorte del hero.

### 2.5 Personas

**Prohibidas las fotos de stock de personas, y una persona generada es lo mismo.** Por orden de
preferencia:

1. **Sin personas**: maquinaria, manguera, superficie y espacio. Es la opción por defecto.
2. **Solo manos, botas o guantes** en el borde del encuadre, con ropa de trabajo lisa.
3. **Operario de espaldas, a contraluz o cortado por el encuadre** (de cintura para abajo, de
   hombros para abajo), nunca de frente ni de perfil reconocible.

Cada ficha dice cuál de las tres usa. Una imagen con cara, aunque sea pequeña o desenfocada, se
descarta.

---

## 3. Bombeo de hormigón

Qué tiene que contar la imagen, según el propio contenido del servicio
(`packages/content/src/data/services.ts`): llevar el hormigón **desde la cuba hasta donde se vierte
por una manguera**, cuando **el camión no puede acercarse** (patio trasero, parcela con entrada
estrecha o en cuesta, planta alta, sótano), con **árido de 12 mm**, para **soleras finas**, y con la
zona de vertido **preparada antes de que llegue el camión: base, encofrado y armado**.

Rigor técnico que tienen que respetar todos los prompts de bombeo:

- **Árido de 12 mm**: grava menuda redondeada o machacada, visible en la masa como puntos de
  4–12 mm, nunca piedras de 20–40 mm. Mezcla gris, plástica-blanda, que fluye por la manguera y se
  queda en montón bajo antes de extenderla. No es líquida como agua ni seca como tierra.
- **Dos tipos de bomba creíbles**:
  - **Autobomba de pluma** sobre camión de 3–4 ejes, estabilizadores desplegados apoyados en
    tacos o placas de madera, pluma de 3–5 tramos sobre el tejado y **manguera final de goma**
    colgando hasta el patio. Con árido de 12 mm la manguera final puede llevar reducción a un
    diámetro menor.
  - **Bomba estacionaria / de arrastre** (remolque compacto) junto a la cuba en la calle, con
    **tubería y manguera de 2½–3″ (65–80 mm)** tendida por el suelo, tramos unidos por **abrazaderas
    rápidas**, entrando por un paso lateral estrecho o por dentro de la casa.
- **Cuba (camión hormigonera)** con el bombo girando y la canaleta descargando en la **tolva** de la
  bomba, con rejilla encima.
- **Solera preparada**: base de zahorra compactada, lámina de polietileno opcional, **mallazo
  electrosoldado** (cuadrícula de 15×15 cm, barras de 5–6 mm, color óxido) **levantado sobre
  separadores** de plástico (no tirado en el suelo), **encofrado perimetral de tablones** con
  estacas y, contra los muros, **banda de junta perimetral** de espuma.
- **Herramienta**: regla de aluminio, rastrillo de hormigonar, pala, cubos negros de goma,
  carretilla volcada a un lado (ya no hace falta), cinta de balizar roja y blanca, tablones como
  pasarela sobre el mallazo, salpicaduras grises en muros y botas.
- **Acceso difícil siempre visible**: la razón de bombear tiene que leerse en la foto.

### B-1 · Hero (4:3)

**Qué muestra:** la pluma de una autobomba pasa por encima de un chalé de una planta y baja la
manguera al patio trasero, donde el hormigón cae sobre el mallazo de una solera.

- **Uso en la web:** `Service.heroImage` de `/bombeo-de-hormigon/`. `kind: 'proceso'`.
- **Proporción y tamaño:** 4:3 · mínimo 1600×1200 · exportar 2000×1500. Esquina inferior derecha
  libre (etiqueta `BOMBEO / ÁRIDO 12 MM`).
- **Personas:** ninguna, o como mucho un par de botas y guantes cogiendo la boca de la manguera en
  el borde izquierdo.

**Prompt positivo:**

```
Back garden of a single-storey Valencian chalet with white rendered walls, terracotta Arabic
roof tiles and a forged iron window grille, photographed from the far corner of the garden.
The folded-out boom of a truck-mounted concrete pump crosses diagonally over the roof ridge
from the upper right, painted plain light grey, three articulated sections with steel pipes
clamped along them, and a thick black rubber end hose hangs vertically down into the garden.
From the end of the hose a grey concrete with small 12 mm gravel is falling in a short heavy
stream onto a prepared slab area: compacted gravel base, rusty electro-welded steel mesh
(15 x 15 cm grid) raised on small plastic spacers, timber plank formwork staked along the
edges, a strip of white foam expansion joint against the house wall. About a third of the
slab is already poured, a low grey mound spreading over the mesh, the rest still shows the
bare mesh. Details: an aluminium screed rule leaning against the wall, a concrete rake,
two black rubber buckets, a wheelbarrow pushed aside, wooden planks laid on the mesh as a
walkway, red-and-white barrier tape tied to an orange tree, grey splashes on the bottom of
the white wall. Background: neighbouring two-storey house in cream render, pine trees and a
carob tree, pale blue morning sky with thin haze.
Camera at standing eye level (1.6 m), 26 mm equivalent, slightly looking up so the boom and
the falling concrete both fit, main subject (hose and falling concrete) in the centre-left
of the frame, lower right of the frame kept simple (bare mesh and gravel) with no important
detail. Mid-morning, around 10:00, hard low sun from the left raking across the mesh and
casting long sharp shadows of the boom over the slab.
```

**Prompt negativo (además del común):**

```
boom touching the roof, boom made of one straight piece, hose spraying sideways, concrete
splashing like water, big stones, coarse 40 mm gravel, mesh lying flat on dirt, rebar cage,
skyscraper, multi-storey apartment block, crane, excavator, workers on the roof
```

**Variantes de encuadre:**

1. Desde dentro del porche trasero, con un pilar enfoscado y el canto del porche enmarcando
   arriba e izquierda, la pluma vista entre el alero y el cielo.
2. Más cerrado: solo el último tramo de pluma, la manguera y la mitad de la solera, con la
   fachada como fondo plano; útil si el modelo no resuelve bien la articulación de la pluma.

**`alt` propuesto:** «Pluma de una autobomba sobre el tejado de un chalé, con la manguera vertiendo
hormigón en la solera armada del patio trasero.»

### B-2 · Tarjeta de la home (16:10)

**Qué muestra:** la boca de la manguera vertiendo hormigón sobre el mallazo, en primer plano, con
la casa desenfocada detrás. Un gesto, legible en pequeño.

- **Uso en la web:** `Service.cardImage`. `kind: 'proceso'`.
- **Proporción y tamaño:** 16:10 · mínimo 1600×1000 · exportar 2000×1250.
- **Personas:** solo guantes de trabajo grises y la manga de una chaqueta de trabajo lisa azul
  marino sujetando la manguera, entrando desde el borde derecho. Sin brazo entero, sin cuerpo.

**Prompt positivo:**

```
Close, low three-quarter view of the black rubber end hose of a concrete pump pouring grey
concrete with visible small 12 mm gravel onto rusty electro-welded steel mesh raised on plastic
spacers. Two hands in grey work gloves and a plain navy work-jacket sleeve hold the hose from
the right edge of the frame, nothing else of the person visible. The concrete forms a soft
mound that is just starting to flow through the mesh squares, wet surface with a dull sheen,
small gravel pieces visible at the edge of the mound, a few grey splashes on the steel bars.
Background softly out of focus: the bottom of a white rendered wall with a terracotta tile
skirting, an orange tree with fruit, a timber plank formwork edge.
Camera at knee height (0.6 m), 26 mm equivalent, close focus, background naturally blurred by
distance (smartphone depth, not artificial bokeh). Hose and concrete in the left-centre third.
Late afternoon, around 17:30, warm side light from the right, long soft shadows of the mesh.
```

**Prompt negativo (además del común):**

```
full person, arm with tattoos, bare hands, extra fingers, hose made of metal, concrete like
paint, liquid splashing, big stones, rebar cage, artificial bokeh, macro lens look
```

**Variantes de encuadre:**

1. Sin manos: la manguera apoyada en un tablón, colgando, con el chorro cayendo y la solera a
   medio llenar.
2. Desde arriba (cenital a 1,6 m), el círculo de hormigón extendiéndose sobre la cuadrícula del
   mallazo; muy gráfico en pequeño.

**`alt` propuesto:** «Boca de la manguera de bombeo vertiendo hormigón de árido fino sobre el
mallazo de una solera.»

### B-3 · Detalle: la pluma sobre la vivienda (4:3)

**Qué muestra:** desde la calle de una urbanización, la autobomba con los estabilizadores
desplegados y la pluma pasando por encima de la casa, con la cuba descargando en la tolva.

- **Uso en la web:** detalle (sin hueco hoy) o recambio del hero. `kind: 'proceso'`.
- **Proporción y tamaño:** 4:3 · mínimo 1600×1200 · exportar 2000×1500.
- **Personas:** ninguna. Si el modelo pone un operario, que esté de espaldas junto a la tolva,
  cortado por la cintura y sin cara visible; mejor regenerar.

**Prompt positivo:**

```
Quiet residential street of a Valencian urbanisation on the edge of a pine wood: a plain
light-grey truck-mounted concrete pump (four axles, no markings) parked along the kerb with
its four outriggers fully extended and resting on thick timber pads on the asphalt. Its boom
unfolds upwards in four sections and arches over the terracotta-tiled roof of a two-storey
cream-rendered chalet behind a white block wall with decorative concrete lattice and a
closed dark metal gate, the end hose disappearing behind the roof. Behind the pump, a plain
white concrete mixer truck with a slowly turning drum discharges through its chute into the
grated hopper at the rear of the pump; a few grey drips on the asphalt under the hopper.
Orange-and-white plastic cones and red-and-white barrier tape around the outriggers, a
garden hose for washing out lying in the gutter, umbrella pines and a palm tree above the
walls, overhead telephone wires.
Camera across the street at standing eye level, 26 mm equivalent, horizontal composition with
the pump and boom filling the left two thirds and the house on the right. Overcast bright
sky with even soft light, no hard shadows, slightly cool tones.
```

**Prompt negativo (además del común):**

```
company name on truck, number plate, phone number on truck, red or yellow branded truck,
boom touching wires, boom through the house, truck on the pavement without outriggers,
mobile crane, fire truck, excavator, people in the street
```

**Variantes de encuadre:**

1. Desde el jardín del chalé mirando hacia la calle: por encima del muro asoma la pluma y la
   manguera baja hasta la solera del jardín delantero.
2. Plano de la tolva: la canaleta de la cuba y la rejilla de la tolva llenándose, con la
   pluma fuera de foco hacia arriba; la escala de la máquina se lee por la rueda.

**`alt` propuesto:** «Autobomba con los estabilizadores desplegados en una calle residencial,
con la pluma sobre el tejado de un chalé y una hormigonera descargando en su tolva.»

### B-4 · Detalle: la manguera en el patio (4:3)

**Qué muestra:** una manguera de bomba estacionaria recorre un paso lateral estrecho junto a la
casa hasta el patio trasero, sin carretillas ni cubos.

- **Uso en la web:** detalle. `kind: 'proceso'`.
- **Proporción y tamaño:** 4:3 · mínimo 1600×1200 · exportar 2000×1500.
- **Personas:** ninguna.

**Prompt positivo:**

```
Narrow side passage, about 90 cm wide, between the white rendered wall of a single-storey
chalet and a neighbour's boundary wall of rough stone masonry. A black and grey concrete
pump line runs along the ground through the whole passage towards the back garden: rigid
steel pipe sections about 3 inches in diameter joined by quick-release clamp couplings every
few metres, then a flexible black rubber hose continuing round the corner. The line rests on
offcuts of timber to protect a strip of old terracotta tiles. Grey concrete drips and a few
dried splashes near one coupling. At the far end, sunlit, the back garden with an orange tree,
a timber plank formwork edge and rusty steel mesh just visible. In the foreground, the open
rear gate of the plot and a bit of the street with the corner of a plain grey trailer-mounted
line pump, out of focus.
Camera at standing eye level, 26 mm equivalent, one-point perspective down the passage, the
hose leading the eye from the bottom left to the bright garden in the upper centre.
Midday, around 13:00, hard vertical sun: the passage half in deep shade, the garden at the
end overexposed slightly, exactly like a phone photo.
```

**Prompt negativo (además del común):**

```
pipe floating in the air, garden hose, fire hose, flat canvas hose, PVC drain pipe, very wide
passage, alley in a city centre, graffiti, people
```

**Variantes de encuadre:**

1. **Por dentro de la casa**: planta baja de casa de pueblo en reforma, sin solado, la manguera
   entra por la puerta de la calle (persiana alicantina de madera recogida arriba), cruza el
   pasillo sobre tablones y sale al patio del fondo.
2. **Por encima de un muro**: la manguera pasa por encima de un muro de bloque de 2 m apoyada en
   una manta vieja y un tablón, y baja al patio del otro lado.

**`alt` propuesto:** «Tubería y manguera de bombeo tendidas por un paso lateral estrecho hasta el
patio trasero de una vivienda.»

### B-5 · Detalle: árido de 12 mm sobre mallazo (4:3)

**Qué muestra:** primer plano de la masa recién vertida, con la grava fina visible, cubriendo
el mallazo apoyado en separadores.

- **Uso en la web:** detalle. `kind: 'detalle'`.
- **Proporción y tamaño:** 4:3 · mínimo 1600×1200 · exportar 2000×1500.
- **Personas:** ninguna; como mucho la puntera de una bota de agua negra salpicada en una esquina.

**Prompt positivo:**

```
Close-up, looking down at about 45 degrees, at the edge of freshly pumped concrete flowing
over rusty electro-welded steel mesh. The concrete is grey, soft and plastic, with a dull wet
sheen and clearly visible small rounded and crushed gravel pieces between 4 and 12 mm,
no larger stones. At the front edge the mix has just covered the mesh: a few steel bars still
emerge, one grey plastic spacer chair is visible holding the mesh about 4 cm above a compacted
pale gravel base. On the bare part, the 15 x 15 cm mesh grid, rust-orange with dust. A timber
formwork plank and a steel stake at the left edge, a small aluminium screed rule lying across
the plank with grey concrete on it.
Camera handheld at 1 m above the slab, 26 mm equivalent, everything sharp from front to back.
Overcast soft daylight, no direct sun, natural neutral colour.
```

**Prompt negativo (además del común):**

```
large stones, 20-40 mm gravel, smooth cement paste without gravel, dry crumbly concrete,
mesh lying directly on the soil, rebar cage, tied thick rebar, polished concrete, sand only
```

**Variantes de encuadre:**

1. Macro de la masa: solo hormigón fresco con la grava de 12 mm, una barra del mallazo
   cruzando en diagonal; textura casi abstracta.
2. La regla de aluminio pasando por encima: media solera ya reglada y lisa, media aún en
   montón sobre el mallazo.

**`alt` propuesto:** «Hormigón con árido de 12 mm recién vertido cubriendo el mallazo, apoyado en
separadores sobre la base de zahorra.»

---

## 4. Vertido de autonivelante

Qué tiene que contar la imagen, según el propio contenido del servicio: dejar un **suelo interior
plano antes de tarima, laminado o vinílico**, o **recrecer** una habitación hasta la cota de la de
al lado o la planta baja tras levantar el pavimento viejo. Material: en los prompts en inglés,
*self-leveling screed* (capas gruesas, recrecidos, bombeado) o *self-leveling compound* (capas finas
de regularización). El documento no le da otro nombre.

Rigor técnico que tienen que respetar todos los prompts de autonivelante:

- **Siempre interior, siempre reforma o vivienda en obra**: paredes enlucidas o con parches de
  yeso, rozas de instalaciones tapadas, rodapié quitado, sin puertas en los marcos, cajas de
  enchufe sin mecanismo, tubos de calefacción o desagües asomando tapados.
- **Soporte limpio e imprimado**: hormigón o recrecido viejo barrido y aspirado, con **imprimación**
  (película blanquecina-lechosa o azulada, todavía brillante o ya seca y mate).
- **Bandas perimetrales**: espuma de polietileno blanca o gris de ~8–10 mm de grueso y 10 cm de
  alto, pegada al pie de todas las paredes y pilares, con su faldón de plástico tumbado hacia
  dentro.
- **Material**: gris cemento, muy fluido, **se extiende solo** formando una lámina con borde
  redondeado; brillo húmedo al principio, **gris mate y liso** al secar. Sin piedras, sin grava.
- **Nivelación**: **trípodes de nivelación** (pequeñas patas metálicas con una punta regulable)
  repartidos por la habitación, o un **nivel láser** sobre trípode con el haz rojo/verde marcado en
  la pared.
- **Herramienta**: **rodillo de púas** de mango largo para desairear, **calzado de púas** atado a
  las botas, barra de batido, **manguera de 25–35 mm** entrando por la puerta desde una
  **mezcladora-bomba** compacta en la calle o el patio, con los sacos al lado **sin impresión
  visible** (de canto, cubiertos con una lona o fuera de cuadro).
- **Contexto valenciano interior**: planta baja de casa de pueblo con techos altos y viguetas o
  revoltones, puerta a la calle con persiana alicantina, restos de baldosa hidráulica en un umbral;
  o piso de los años 70–80 en reforma con ventanas de aluminio y persiana de lamas.

### A-1 · Hero (4:3)

**Qué muestra:** una habitación vacía en reforma con el autonivelante gris extendiéndose solo
sobre el suelo imprimado, la manguera entrando por la puerta.

- **Uso en la web:** `Service.heroImage` de `/vertido-de-autonivelante/`. `kind: 'proceso'`.
- **Proporción y tamaño:** 4:3 · mínimo 1600×1200 · exportar 2000×1500. Esquina inferior derecha
  libre (etiqueta técnica del servicio).
- **Personas:** ninguna, o un operario **de espaldas y cortado por el encuadre** (de cintura para
  abajo: pantalón de trabajo gris, botas con calzado de púas) en el fondo izquierdo.

**Prompt positivo:**

```
Empty ground-floor room of an old Valencian village house under renovation, about 5 x 4 m,
high ceiling with timber joists and small vaulted brick infill, walls freshly skimmed with
grey and white plaster patches, an empty door frame on the left, a tall street door at the back
with a wooden roll-up blind rolled up at the top and soft daylight coming in. The old floor has
been removed: the concrete base is swept clean and coated with a milky white primer, dry and
matt. White polyethylene foam edge strips about 10 cm high run along the foot of every wall
with their plastic skirt folded flat onto the floor. Small steel levelling tripods are spread
across the room in a grid. A black flexible hose about 3 cm in diameter enters through the
street door and lies across the floor; from its open end a grey self-leveling screed is
flowing out and spreading by itself into a smooth glossy liquid sheet with a rounded leading
edge, already covering the back half of the room and creeping towards the camera around the
tripods. The wet part reflects the doorway light softly. Details: a long-handled spiked roller
leaning against the wall, a bucket with grey drips, a masking tape line on the wall marking
the level, a dusty caged work light on the floor switched off.
Camera at standing eye level in the opposite doorway, 26 mm equivalent, slight downward angle,
the flowing edge in the centre of the frame, the lower right of the frame showing only dry
primed floor and a foam strip, with no important detail. Late morning, overcast outside: soft
diffuse daylight from the street door, cool neutral tones, darker corners.
```

**Prompt negativo (además del común):**

```
epoxy resin, coloured resin, glossy finished showroom floor, water flood, puddles on tiles,
paint, concrete with gravel, trowel marks, new furniture, kitchen units, people kneeling,
modern open-plan loft, polished concrete
```

**Variantes de encuadre:**

1. Piso de los años 70–80 en reforma: salón vacío con ventana de aluminio y persiana de lamas
   a media altura, luz de tarde rasante entrando por el suelo y marcando la frontera entre la
   parte vertida (brillo) y la imprimada (mate).
2. Desde la puerta de la calle hacia dentro, con la manguera en primer plano y la lámina gris
   avanzando hacia el fondo.

**`alt` propuesto:** «Autonivelante gris extendiéndose sobre el suelo imprimado de una habitación
en reforma, con bandas perimetrales y trípodes de nivelación.»

### A-2 · Tarjeta de la home (16:10)

**Qué muestra:** la mitad de una habitación con el autonivelante ya extendido, gris liso y
brillante, junto a la otra mitad aún imprimada. La diferencia se entiende en pequeño.

- **Uso en la web:** `Service.cardImage`. `kind: 'proceso'`.
- **Proporción y tamaño:** 16:10 · mínimo 1600×1000 · exportar 2000×1250.
- **Personas:** ninguna.

**Prompt positivo:**

```
Low wide view across the floor of an empty renovated bedroom: the far two thirds of the floor
is covered with freshly poured grey self-leveling screed, perfectly flat, with a soft wet
sheen reflecting the window; the near third is still bare primed concrete, slightly rough
and pale. The boundary between them is a rounded, slowly advancing liquid edge running
diagonally across the frame. White foam edge strips along the skirting line, a window with a
grey aluminium frame and a half-lowered roll-up blind on the back wall letting in low
afternoon light that rakes across the surface. A few steel levelling tripods emerge from the
wet screed.
Camera very low, about 40 cm above the floor, 26 mm equivalent, horizon in the upper third.
Late afternoon warm light from the window, soft long reflections on the wet screed, the
corners in shadow.
```

**Prompt negativo (además del común):**

```
water, flood, mirror-like lake, epoxy, colour pigment, furniture, footprints in the screed,
cracks, gravel, trowel marks
```

**Variantes de encuadre:**

1. Cenital desde 1,7 m: la lámina gris entrando por un umbral de puerta desde la habitación de
   al lado, con una franja de baldosa hidráulica antigua en el umbral sin cubrir.
2. Desde la puerta, solo suelo y zócalo: la línea de espuma perimetral y el gris líquido
   llegando a ella.

**`alt` propuesto:** «Habitación vacía con autonivelante gris recién vertido junto a la parte del
suelo aún imprimada.»

### A-3 · Detalle: vertido con manguera (4:3)

**Qué muestra:** primer plano de la boca de la manguera soltando el autonivelante fluido, y la
mezcladora-bomba fuera, en la calle, con la manguera entrando por la puerta.

- **Uso en la web:** detalle. `kind: 'proceso'`.
- **Proporción y tamaño:** 4:3 · mínimo 1600×1200 · exportar 2000×1500.
- **Personas:** solo una mano con guante de nitrilo negro sujetando la boca de la manguera desde
  el borde superior, o ninguna.

**Prompt positivo:**

```
Close-up at floor level of the open end of a black flexible hose about 3 cm in diameter,
resting on the primed floor (or held by one hand in a black nitrile glove entering from the
top edge, nothing else of the person visible), releasing a thick but very fluid grey
self-leveling screed that pours out in a smooth rope and immediately spreads into a flat
glossy pool with a rounded edge, small ripples and a few air bubbles on the surface. The pool
is flowing around the base of a steel levelling tripod. Behind, out of focus: a white foam
edge strip at the foot of a plastered wall and the open front door with daylight.
Camera at about 30 cm above the floor, 26 mm equivalent, close focus, background naturally
soft. Soft diffuse daylight from the doorway on the right, neutral grey tones.
```

**Prompt negativo (además del común):**

```
water, milk, paint, liquid metal, chocolate, splashing droplets frozen in air, garden hose,
bare hand, extra fingers, gravel in the mix, foam
```

**Variantes de encuadre:**

1. **Fuera**: en la acera de una calle de pueblo con fachadas encaladas, una mezcladora-bomba
   compacta sobre ruedas (gris, sin marcas) con una tolva, junto a un palé de sacos tapado con
   una lona azul; la manguera negra sube el escalón y entra por la puerta abierta de la casa.
   Sin personas.
2. **Umbral**: la manguera cruzando el marco de la puerta sobre un trozo de cartón, con el
   suelo gris líquido brillando dentro y la acera seca fuera.

**`alt` propuesto:** «Boca de la manguera vertiendo autonivelante fluido sobre el suelo imprimado
de una habitación.»

### A-4 · Detalle: rodillo de púas (4:3)

**Qué muestra:** el rodillo de púas pasando por el autonivelante recién vertido para sacarle el
aire; las botas con calzado de púas en el borde.

- **Uso en la web:** detalle. `kind: 'proceso'`.
- **Proporción y tamaño:** 4:3 · mínimo 1600×1200 · exportar 2000×1500.
- **Personas:** solo las **botas con calzado de púas** y el arranque del pantalón de trabajo gris,
  cortados por el borde superior. Nada por encima de las rodillas.

**Prompt positivo:**

```
Close view of a long-handled spiked roller (a plastic roller drum covered in short spikes)
being rolled through freshly poured grey self-leveling screed, leaving a faint dimpled track
that is already closing and levelling itself behind it, tiny air bubbles bursting on the
surface. At the top edge of the frame, two work boots wearing strap-on spiked soles stand in
the wet screed, grey work trousers cut off by the frame at the knee, small rings in the screed
around each spike. The roller handle goes out of the top of the frame. Background: a white
foam edge strip along a plastered wall, a steel levelling tripod emerging from the screed.
Camera at about 70 cm above the floor, 26 mm equivalent, slight downward angle, roller in the
centre. Soft light from a window on the left and a small LED work light on a tripod on the
right giving a slightly cooler secondary light and a second soft shadow.
```

**Prompt negativo (además del común):**

```
paint roller, lawn aerator, garden tool, spiked roller on grass, deep footprints, sinking
boots, upper body, face, knees, gloves on the boots, mud
```

**Variantes de encuadre:**

1. Solo el rodillo de púas, sin botas: apoyado sobre la lámina, con la estela de huecos
   cerrándose.
2. Contraluz desde el fondo de la habitación: la silueta de las piernas con el calzado de púas
   y el rodillo, recortadas por la luz de la puerta, sin cuerpo por encima de la cintura.

**`alt` propuesto:** «Rodillo de púas desaireando el autonivelante recién vertido, con calzado de
púas sobre la lámina fresca.»

### A-5 · Detalle: superficie terminada (4:3)

**Qué muestra:** la habitación con el autonivelante ya seco: gris liso y mate, plano, listo para
tarima o vinílico.

- **Uso en la web:** detalle o recambio del hero. `kind: 'final'`.
- **Proporción y tamaño:** 4:3 · mínimo 1600×1200 · exportar 2000×1500.
- **Personas:** ninguna.

**Prompt positivo:**

```
Empty renovated room with the self-leveling screed fully dry: a continuous, perfectly flat
grey floor with a fine matt surface and very subtle tonal clouding, no joints, the foam edge
strips trimmed flush at the foot of the freshly plastered white walls. Low raking daylight
from a window on the right crosses the floor and shows how flat it is, with only a faint
sheen. Waiting in the corner: a stack of boxed vinyl planks (plain brown cardboard, no print)
and a roll of white underlay, a spirit level of 2 m lying on the floor showing no gap. An
empty door frame on the left with a slightly lower old floor visible in the next room. Bare
light bulb hanging from the ceiling.
Camera at standing eye level in the doorway, 26 mm equivalent, horizontal walls kept straight,
floor occupying the lower two thirds. Mid-afternoon soft sun through the window, neutral grey
and white palette, slightly warm patch of sunlight on the floor.
```

**Prompt negativo (además del común):**

```
polished concrete, glossy floor, epoxy, microcement trowel marks, tiles, wood floor already
installed, furniture, rug, printed boxes, brand on boxes, cracks, stains of water
```

**Variantes de encuadre:**

1. Primer plano a ras de suelo: la superficie gris mate en contraluz, con la regla de 2 m
   apoyada y la luz pasando por debajo sin hueco.
2. Umbral entre dos habitaciones: las dos ya a la misma cota tras el recrecido, sin escalón,
   con el marco de la puerta en el centro.

**`alt` propuesto:** «Suelo de autonivelante seco, gris liso y mate, en una habitación vacía lista
para colocar el pavimento.»

### A-6 · Detalle: preparación del soporte (4:3)

**Qué muestra:** la habitación lista para el vertido: suelo limpio, imprimación, bandas
perimetrales y trípodes, con el nivel láser marcando la cota.

- **Uso en la web:** detalle. `kind: 'proceso'`.
- **Proporción y tamaño:** 4:3 · mínimo 1600×1200 · exportar 2000×1500.
- **Personas:** ninguna.

**Prompt positivo:**

```
Empty room in a 1970s flat under renovation, the old tiles removed, the concrete base swept
and vacuumed, half of it already coated with a milky white primer that is still slightly
glossy, the other half dry and pale. White polyethylene foam edge strips glued along the foot
of every wall and around a central pillar, their plastic skirts folded onto the floor. A grid
of small steel levelling tripods across the room. A self-levelling laser on a tripod in the
corner projects a thin green line around the walls at knee height. A plastic bucket of primer
and a short-nap roller on a tray, a broom and a dustpan against the wall, a fresh pencil
level mark on the plaster, an aluminium window with half-lowered roll-up blind.
Camera at standing eye level in the doorway, 26 mm equivalent. Morning soft daylight from the
window, cool neutral tones.
```

**Prompt negativo (además del común):**

```
red laser beams in the air, sci-fi laser grid, glowing floor, wet water floor, epoxy, tiles
still on floor, furniture, printed buckets, brand on laser
```

**Variantes de encuadre:**

1. Primer plano de la esquina: banda perimetral de espuma con su faldón y un trípode de
   nivelación a su lado sobre la imprimación.
2. Planta baja de casa de pueblo: mismo momento, con techo de viguetas y la persiana alicantina
   de la puerta de la calle.

**`alt` propuesto:** «Suelo imprimado con bandas perimetrales de espuma y trípodes de nivelación,
preparado para el vertido de autonivelante.»

---

## 5. Comprobación de cada imagen antes de subirla

Abrirla **a tamaño completo** (no en miniatura) y repasar la lista entera. Un solo fallo y se
regenera o se descarta; no se retoca para «salvarla».

### Personas

- [ ] **Ninguna cara**, ni pequeña, ni desenfocada, ni en un reflejo, ni en una ventana del fondo.
- [ ] Si hay manos: **cinco dedos**, articulaciones normales, guante que sigue la forma de la mano,
      mano conectada a un brazo coherente que sale por el borde.
- [ ] Si hay botas o piernas: dos, iguales, apoyadas en el suelo con su sombra, nada por encima
      de lo que dice la ficha.
- [ ] Nadie posa ni mira a cámara.

### Texto y marcas

- [ ] **Sin texto fantasma**: revisar camión, bombo, pluma, tolva, mezcladora, sacos, cubos, cajas,
      ropa, puertas y fachadas. Garabatos que parecen letras también cuentan.
- [ ] Sin logotipos, matrículas, números de teléfono, pegatinas ni rótulos.

### Física y técnica

- [ ] **Hormigón**: masa gris plástica con grava fina de hasta 12 mm visible; cae en chorro denso
      y forma montón, no salpica como agua ni parece pintura.
- [ ] **Autonivelante**: lámina líquida con borde redondeado que se extiende sola, sin grava;
      brillante si está fresco, **mate** si está seco. Las huellas del rodillo de púas se cierran.
- [ ] **Mallazo** con cuadrícula regular, levantado sobre separadores, no en el suelo; barras
      que no se funden entre sí.
- [ ] **Manguera continua**: no desaparece, no se bifurca, no entra en una pared sin hueco; de
      la bomba al punto de vertido sin cortes.
- [ ] **Pluma**: tramos articulados con su tubería, apoyada en un camión con estabilizadores, sin
      tocar el tejado ni cables; la manguera final cuelga por gravedad.
- [ ] **Escala**: la rueda del camión ≈ 1 m; una puerta ≈ 2,1 m; un cubo ≈ 30 cm; la manguera de
      autonivelante del grosor de una muñeca, no de un brazo.
- [ ] Bandas perimetrales y trípodes coherentes (alto, posición, repetición creíble).

### Luz y fotografía

- [ ] **Sombras coherentes**: todas en la misma dirección y con la misma dureza que el cielo
      indica; la pluma, la manguera y las herramientas proyectan la suya.
- [ ] Reflejos del líquido coherentes con ventanas y puertas de la escena.
- [ ] Aspecto de foto de móvil: sin HDR exagerado, sin halos, sin desenfoque artificial, sin
      piel de plástico en las superficies.
- [ ] Líneas verticales de muros y marcos sin ondular; ventanas y tejas sin repetirse en patrón.

### Contexto

- [ ] Arquitectura y vegetación valencianas creíbles: enfoscado, teja árabe o cubierta plana,
      naranjos, pinos, algarrobos, palmeras; nada de casas americanas, nieve ni selva.
- [ ] La foto no permite reconocer una calle, una casa o un municipio concreto reales.

### Encaje en la web

- [ ] Proporción **exacta** (4:3 o 16:10) y lado largo **≥ 1600 px** (exportada a 2000).
- [ ] En el hero, la esquina inferior derecha no tapa nada importante.
- [ ] Vista a 390 px de ancho se entiende qué servicio es.
- [ ] La tarjeta es otra toma, no un recorte del hero.
- [ ] Nombre `ia-…`, en `public/obras/_ia-provisional/`, fila añadida en `INVENTARIO.md`.
- [ ] `alt` que describe lo que se ve, sin municipio ni obra.
- [ ] Usada solo en hero, tarjeta o detalle; **nunca** en proyecto, zona ni muestrario.
- [ ] `npm run build` pasa (verificar-imagenes mide el archivo y exige 1600 al hero).
