# Encargo para Claude Design — Hero de la home con carrusel

> Pégalo entero como prompt. Está escrito para que el diseño resultante entre en el código
> existente sustituyendo un único bloque, sin tocar nada más.

---

## 1. Qué eres y qué te pido

Eres el diseñador de **Pavimentos Albufera**, una empresa de pavimentos de hormigón de Valencia
(impreso, pulido, lavado, fratasado, desactivado y microcemento). La web ya está construida en
Next.js 15 con un sistema de diseño cerrado y aprobado. **No estás diseñando una web nueva ni
puedes ampliar el sistema.**

Te pido **una sola pantalla: la sección 01 · Hero de la home (`/`)**, rediseñada, con la imagen
convertida en **carrusel**. Todo lo demás de la home se queda exactamente como está.

Entrega dos artboards en el mismo lienzo: **390 px (móvil)** y **1440 px (escritorio)**. Las dos
son normativas: no son la misma pantalla reajustada, pueden tomar decisiones distintas.

---

## 2. Dirección de diseño (no negociable)

El material manda. Un pavimento se juzga por su textura, su color y cómo le da la luz, así que la
web se comporta como **un muestrario de material y una ficha técnica**, no como un folleto de
servicios. Todo dato del oficio —modelo, color, m², año, municipio— vive en monoespaciada, en
versalitas, con formato de etiqueta de especificación. El ocre no decora: señala dónde se actúa.

Se evita deliberadamente el registro de «estudio de arquitectura» (fondo crema, serif de alto
contraste, acento terracota). Aquí se compite por **credibilidad de obra**, no por sofisticación
editorial.

---

## 3. Tokens exactos — no añadas ni un valor más

### Color

| Token | Hex | Uso |
|---|---|---|
| `--fondo` | `#E9EAE6` | Fondo general. Gris de cemento curado, ligeramente frío |
| `--fondo-alt` | `#DADCD6` | Bloques alternos, tarjetas y bloques de posición de foto |
| `--tinta` | `#1B1E1C` | Texto y fondos oscuros |
| `--tinta-media` | `#5C625E` | Texto secundario y pies de foto |
| `--pigmento` | `#D9A441` | Acento único (ocre) |
| `--acero` | `#41535C` | Fichas técnicas, tablas y estados informativos |

Auxiliares: hover del botón ocre `#C6902F` · texto y separadores sobre tinta `#DADCD6` ·
corchete pendiente sobre tinta `#9AA09B` · error `#8C3A2B`.

**No existe ningún otro color.** Ni blanco puro, ni negro puro, ni grises intermedios, ni
transparencias de color que produzcan un tono nuevo.

### La regla del ocre — dos roles por pantalla, no dos apariciones

1. **Un único CTA primario.**
2. **El estado activo** — una marca por grupo de selección.

En **escritorio** la home ya gasta sus dos roles: el CTA primario del hero y el chip activo del
muestrario (sección 04, más abajo, fuera de tu encargo). En **móvil** la acción persistente es la
barra fija inferior, que se queda el ocre; por eso **los CTA del hero en móvil son de contorno,
nunca ocre**.

El ocre nunca como texto pequeño sobre fondo claro: no cumple AA. Solo como relleno de botón con
texto en `--tinta`, en superficies grandes, o sobre fondo oscuro.

### Tipografía

| Rol | Fuente | Pesos |
|---|---|---|
| Display | **Archivo** (eje de anchura) | 700–800 |
| Texto | **Instrument Sans** | 400–600 |
| Datos | **Martian Mono** | 400–500 |

Anchuras de Archivo: solo `125%` (hero), `120%` (h2), `115%` (h3), `118%` (logo). Ninguna otra.

**Escala tipográfica cerrada.** Solo estos tamaños, nada intermedio:
`10 / 11 / 12 / 14 / 16 / 20 / 26 / 34 / 46 / 64 / 88`.
La monoespaciada tiene tres niveles declarados: **12** antetítulo, **11** dato en escritorio,
**10** dato en móvil. **10 px es el suelo absoluto.**

### Forma y espacio

- **`border-radius: 0` en absolutamente todo.** Botones, tarjetas, imágenes, campos, indicadores
  del carrusel. Es identidad, no olvido.
- **Una sola sombra en toda la web** y no es tuya: la de la barra fija de móvil. El hero no lleva
  ninguna sombra, ni un degradado decorativo, ni un borde redondeado, ni un glassmorphism.
- Layout siempre con flex/grid y `gap`. Nunca márgenes por elemento.
- Padding lateral: **18 px en móvil**, **48 px en escritorio**.
- Objetivo táctil mínimo **44 px** en todo lo pulsable, indicadores del carrusel incluidos.

---

## 4. El contrato de encaje — lo que hace que esto sea sustituible sin romper nada

Tu diseño sustituye **un único `<section>`** del archivo `app/page.tsx`: el primero, marcado
`{/* 01 · Hero */}`. Todo lo que hay antes y después se queda intacto. Para que el reemplazo sea
limpio, respeta estas fronteras:

1. **Arriba**, fuera de tu sección, hay una cabecera que pasa de **84 px a 60 px al hacer scroll**.
   El hero empieza justo debajo, en flujo normal. **El hero no es sticky, no es `position: fixed`,
   no ocupa `100vh`** y no usa `z-index` por encima de `20`.
2. **Justo debajo**, fuera de tu sección, va una barra de confianza oscura que en escritorio queda
   **anclada bajo la cabecera** al hacer scroll. Tu hero no puede tapar ese anclaje ni crear un
   contexto de apilamiento que lo rompa: nada de `transform`, `filter` ni `will-change` en el
   contenedor raíz de la sección.
3. **En móvil**, fuera de tu sección, hay una **barra fija inferior de contacto**. El hero no debe
   competir con ella ni quedar tapado por ella.
4. **Un solo `<h1>` en toda la página**, y es el del hero. Diséñalo para que se renderice una sola
   vez y cambie de tamaño por breakpoint, no como dos titulares distintos.
5. **Ancho:** la sección ocupa el ancho completo con el padding lateral indicado. No introduzcas
   un contenedor centrado de otra anchura.
6. **Sin dependencias nuevas.** Nada de librerías de carrusel, de animación, de iconos ni de
   gestos. Si necesitas un icono (flechas), es un **SVG en línea, trazo `currentColor`**, y como
   mucho dos.
7. **Presupuesto de JavaScript.** La web entera va justa: 103 KB comprimidos de JS inicial contra
   un techo de 100 KB. El carrusel será **la única pieza interactiva nueva del hero** y tiene que
   caber en unos 2 KB comprimidos. Diseña algo que se pueda implementar con **scroll-snap de CSS
   más un puñado de líneas de JS**. Si tu propuesta necesita medir, animar por frames o sincronizar
   varios elementos, no cabe: simplifícala.

---

## 5. Contenido — copy literal, prohibido inventar

Este es el copy aprobado. **Úsalo exactamente. No escribas ni una frase nueva**, no inventes
reclamos, cifras, sellos, testimonios ni reseñas.

- **H1:** «Hormigón que se ve bien 20 años después»
- **Entradilla:** «Pavimentos de hormigón impreso, pulido, lavado y microcemento en Valencia,
  Castellón y Alicante. 17 años ejecutando obra propia, con 10 años de garantía y mantenimiento
  incluido.»
- **CTA 1:** «Ver acabados» → `/acabados/`
- **CTA 2:** «Pedir presupuesto» → `/presupuesto/`

Tamaños actuales, que puedes reconsiderar **dentro de la escala cerrada**: H1 a 88 en escritorio y
46 en móvil; entradilla a 20 en escritorio y 16 en móvil.

### Datos sin confirmar: el tratamiento del corchete

Hay datos que el cliente **todavía no ha dado**. Se pintan **entre corchetes, en `--tinta-media`,
con subrayado punteado** (sobre fondo oscuro, en `#9AA09B`). Es intencionado: el diseño no finge
tener información que no tiene, y al llegar el dato real el corchete y el subrayado desaparecen.

En el hero esto afecta a **los m² y el año de casi todas las obras**. Tu diseño tiene que verse
bien en los dos extremos: con la línea completa `[180] m² · 2025` y con la línea totalmente
pendiente `[m²] · [año]`.

---

## 6. El carrusel — el encargo nuevo

Hoy el hero muestra **una** imagen fija de la obra de Moncada. Pasa a ser un **carrusel de obras**.

### Contenido de cada diapositiva

Cada diapositiva es **una obra real** y lleva su **etiqueta técnica** de tres líneas, en
monoespaciada, sobre bloque `--tinta` con texto `--fondo`, anclada **abajo a la derecha** de la
imagen:

```
MUNICIPIO · PROVINCIA
SERVICIO · MODELO X · COLOR Y
[m²] m² · [año]
```

Las cuatro obras destacadas que entran en el carrusel, con sus datos reales:

| # | Obra | Línea 1 | Línea 2 | Línea 3 |
|---|---|---|---|---|
| 1 | Moncada | `MONCADA · VALENCIA` | `IMPRESO · MODELO ESPIGA · COLOR 117` | `[180] m² · 2025` |
| 2 | Moraira | `MORAIRA · ALICANTE` | `IMPRESO · ADOQUÍN PEQUEÑO · COLOR ARENA` | `[m²] · 2025` |
| 3 | Alzira | `ALZIRA · VALENCIA` | `IMPRESO · ADOQUÍN IRREGULAR · COLOR 107` | `[m²] · [año]` |
| 4 | Denia | `DENIA · ALICANTE` | `IMPRESO · PIEDRA INGLESA · COLOR GRIS` | `[m²] · [año]` |

Diséñalo para **entre 3 y 6 diapositivas**, no para exactamente 4: la lista se edita después desde
un archivo de datos y tiene que aguantar que crezca o mengüe.

### Los dos estados de imagen — **diseña obligatoriamente los dos**

Esto es lo más importante del encargo y donde fallan la mayoría de los rediseños de hero:

**Hoy no existe ni una sola fotografía utilizable.** En producción están a 500×400 px y el mínimo
exigido es 2400 px de ancho. La regla del proyecto es tajante: mientras no lleguen los originales
**no se usan imágenes provisionales ni fotos de stock**. En su lugar va el **bloque de posición**:
un sólido en `--fondo-alt` con **trama diagonal** (líneas a 45°, `rgba(27,30,28,0.05)`, 8 px de
trazo cada 18 px), la anotación `PENDIENTE · ORIGINAL A 2400 PX` en monoespaciada de 11 px en
`--tinta-media` arriba a la izquierda, y la etiqueta técnica abajo a la derecha.

Por tanto el carrusel tiene que funcionar y verse bien **en las dos situaciones**:

- **Estado A — sin foto (el de hoy):** todas las diapositivas son bloques de posición con trama.
  Un carrusel de cuatro tramas idénticas es un problema de diseño real: resuélvelo de forma que
  pasar de una a otra siga teniendo sentido y no parezca que está roto. La etiqueta técnica es lo
  único que cambia, y ahí está la respuesta.
- **Estado B — con foto (el de mañana):** la misma estructura, con la fotografía a sangre. Cuando
  entre la foto buena, **la etiqueta se queda exactamente donde estaba**.

Dibuja los dos estados. Para el estado B, no uses fotos de stock de personas: en el artboard basta
con un sólido neutro rotulado como fotografía de obra.

**El nombre de archivo de una imagen no aparece nunca en pantalla.** Es anotación de producción,
no contenido.

### Comportamiento

- **Avance automático** entre 5 y 7 segundos por diapositiva, en bucle.
- **Se detiene** al pasar el ratón por encima, al recibir el foco de teclado y cuando el usuario
  interactúa a mano.
- **Se puede navegar a mano**: indicadores pulsables y, si lo defiendes, flechas. Todo con objetivo
  táctil de 44 px.
- En móvil debe poder **arrastrarse con el dedo** (scroll-snap nativo, sin librería de gestos).
- **`prefers-reduced-motion: reduce` desactiva el avance automático por completo** y deja la
  primera diapositiva quieta, navegable a mano. Diseña también esa versión estática.
- La transición entre diapositivas es **sobria**: un deslizamiento o un fundido corto. Nada de
  Ken Burns, paralaje, zoom ni rebotes.
- **Sin salto de layout (CLS).** La caja del carrusel tiene una proporción fija y reservada:
  `3/4` en móvil y `4/3` con **660 px de alto mínimo** en escritorio son los valores actuales;
  puedes proponer otros de la misma familia, pero tienen que ser fijos.

### El indicador activo y el ocre

Aquí hay una decisión que **tienes que tomar y justificar en una nota del lienzo**: el indicador de
la diapositiva activa es un «estado activo», que es uno de los dos roles legítimos del ocre, pero
en escritorio el hero ya gasta el ocre en su CTA primario.

**Por defecto: los indicadores van en `--tinta` (activo) y `--tinta-media` o `--fondo-alt`
(inactivos), no en ocre.** Si crees que deben ser ocre, dilo y explica de qué rol lo sacas.

---

## 7. Accesibilidad — suelo de calidad, no aspiración

- Contraste **AA** en todo. Recuerda que el ocre no cumple sobre fondo claro en texto pequeño.
- **Foco de teclado visible siempre**: `outline: 2px solid #D9A441; outline-offset: 2px` sobre
  fondo claro. Nunca `outline: none`. Dibuja el estado de foco de los indicadores y de los CTA.
- El carrusel se maneja **entero con teclado**: los indicadores son botones reales, alcanzables con
  tabulador, con nombre accesible («Ver obra de Moraira», no «2»).
- El cambio de diapositiva se anuncia a lectores de pantalla de forma discreta; el bloque de
  imagen no es contenido esencial: **el H1, la entradilla y los CTA nunca dependen del carrusel**.
  Si el JavaScript no llega a cargar, el hero tiene que seguir siendo un hero completo con la
  primera obra visible.
- Un solo `<h1>`, jerarquía de encabezados sin saltos.

---

## 8. Qué quiero ver entregado

En un mismo lienzo:

1. **Artboard 390 px** — hero completo en estado A (sin foto), diapositiva 1.
2. **Artboard 1440 px** — hero completo en estado A (sin foto), diapositiva 1.
3. **Artboard 1440 px** — misma pantalla en estado B (con foto), diapositiva 2, para comprobar que
   la etiqueta técnica no se mueve.
4. **Detalle** de los controles del carrusel a tamaño real: reposo, activo, hover y foco de
   teclado, con la retícula de 44 px visible.
5. Una **nota corta** con: la decisión sobre el ocre en los indicadores, la duración y la
   transición elegidas, y cualquier cosa del sistema que hayas tenido que estirar.

Si algo del sistema aprobado no aguanta en este contexto, **no improvises una excepción**: dilo en
la nota, propón la pieza en el mismo lenguaje y márcala como ampliación del sistema para que se
documente.

---

## 9. Errores que invalidan la entrega

- Añadir un color, un tamaño de letra o una fuente que no estén en las listas de arriba.
- Cualquier esquina redondeada, cualquier sombra, cualquier degradado decorativo.
- Ocre en móvil en los CTA del hero, u ocre en texto pequeño sobre fondo claro.
- Copy, cifras, sellos o testimonios inventados.
- Fotos de stock de personas, o fotografía provisional en lugar del bloque de posición.
- Un hero a `100vh`, sticky o que tape la barra de confianza.
- Un carrusel que necesite una librería, que salte al cargar o que no se pueda usar con teclado.
- Diseñar solo el estado con foto: hoy no hay fotos, y ese es el estado que se publica.
