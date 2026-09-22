# 01 · Sistema de diseño

Referencia visual: pantalla `01 SISTEMA` del prototipo.

## 1. Dirección

El material manda. Un pavimento se juzga por su textura, su color y cómo le da la luz, así que
la web se comporta como **un muestrario de material y una ficha técnica**, no como un folleto
de servicios. Todo dato del oficio —modelo, color, m², año, municipio— vive en monoespaciada.
El ocre no decora: señala dónde se actúa.

Se evita deliberadamente el registro de «estudio de arquitectura» (fondo crema, serif de alto
contraste, acento terracota): es el acabado por defecto de cualquier web de construcción bonita
en 2026, y aquí se compite por credibilidad de obra, no por sofisticación editorial.

## 2. Tokens

### 2.1 Color

| Token | Hex | Uso |
|---|---|---|
| `--fondo` | `#E9EAE6` | Fondo general. Gris de cemento curado, ligeramente frío |
| `--fondo-alt` | `#DADCD6` | Bloques alternos, tarjetas y bloques de posición de foto |
| `--tinta` | `#1B1E1C` | Texto y fondos oscuros. Negro con matiz verde de losa húmeda |
| `--tinta-media` | `#5C625E` | Texto secundario y pies de foto |
| `--pigmento` | `#D9A441` | Acento único |
| `--acero` | `#41535C` | Fichas técnicas, tablas y estados informativos |

Valores auxiliares, derivados y no sustituibles por otros:

| Uso | Hex |
|---|---|
| Ocre en `:hover` de botón primario | `#C6902F` |
| Texto y separadores sobre `--tinta` | `#DADCD6` |
| Corchete pendiente sobre `--tinta` | `#9AA09B` |
| Error de formulario | `#8C3A2B` |

**El logotipo, y solo el logotipo, queda fuera de esta paleta.** Desde el 2026-09-01 la
identidad es un archivo entregado por el dueño y trae **dos azules que el sistema no tiene**:
`#000D2A` en «Pavimentos» y la senda cercana, y `#014BA2` en «Albufera» y la senda lejana. No se
corrigen al gris del sistema: es la marca, y una marca no se repinta para que encaje en la web
que la enseña. La excepción **empieza y acaba en los derivados de marca**: `public/marca/` y, desde
el 2026-09-17, `app/icon.png` y `app/apple-icon.png`, que son la misma marca en miniatura. Ningún
texto, borde, fondo ni estado del sitio puede usar esos valores.

De ahí sale un tercer valor derivado, también exclusivo del logotipo: **`#8FB4D6`**, el azul de
la variante clara. Existe porque `#000D2A` mide **1,1 : 1** contra `--tinta` —sobre el pie el
logotipo original desaparece— y hace falta un par claro que conserve el contraste entre las dos
palabras. El detalle de cómo se derivan las variantes está en `public/README.md`.

**El icono de pestaña, 2026-09-17.** El dueño pidió «el logotipo en miniatura» en la pestaña. Lo
que hay en la pestaña es **la senda sola**, sin wordmark, y eso no es una licencia: el bloque
completo a 16 px deja «Pavimentos Albufera» en una mancha gris de dos píxeles de alto —probado y
mirado—, así que publicarlo sería el mismo maquillaje que el claim del §`public/README.md`.

| Archivo | Lado | Recorte | Margen |
|---|---|---|---|
| `app/icon.png` | 256 px | senda de `img/logo_nuevo.png`, caja `(411, 22) → (1528, 537)` | 4 % |
| `app/apple-icon.png` | 180 px | la misma | 10 %, que es lo que pide el recorte redondeado de iOS |

Cuatro decisiones, y su porqué:

- **Fuente: `img/logo_nuevo.png`, no `public/marca/logo.png`.** El original que entregó el dueño
  está en RGBA a color real; los cuatro de `public/marca/` están cuantizados a paleta. Para
  reescalar conviene el que conserva el degradado de cada elipse. `/img/` está en `.gitignore`,
  así que la caja de recorte queda apuntada aquí: es lo único que hace falta para rehacerlo.
- **PNG, no SVG.** `public/README.md` ya cierra esta puerta —la senda son degradados por elipse y
  vectorizarla la redibuja—, y sigue cerrada en miniatura. **No existe ningún SVG en el repo.**
- **Teja opaca en `--fondo`.** Es lo único que resuelve el modo oscuro sin duplicar archivo: la
  pestaña clara y la oscura ven el mismo cuadrado. Probada la alternativa —teja `#000D2A` con la
  senda de la variante clara— y a 16 px la senda pierde el azul y se lee gris: el color, que es lo
  único que sobrevive a ese tamaño, se perdía. Por eso no hay rama `prefers-color-scheme`.
- **Un solo archivo, sin `.ico` de varios tamaños.** Comparado el reescalado del navegador desde
  los 256 px contra un mapa de bits pre-escalado a 16: la diferencia es marginal y ninguno de los
  dos resuelve las elipses. **A 16 px se ve una loma azul con la base oscura**, que es la
  perspectiva de la senda, no sus losas. Se leen a partir de 24-32 px. Es el techo del motivo, no
  del archivo.

### 2.2 La regla del ocre

**Dos roles por pantalla, no dos apariciones:**

1. **Un único CTA primario** — el del hero o el del cierre, nunca los dos.
2. **El estado activo** — un chip marcado por cada grupo de selección. Una pantalla con dos
   grupos de filtros muestra dos marcas, y eso es correcto.

Todos los demás botones son de contorno o de relleno en tinta. Cualquier ocre que no cumpla
uno de esos dos roles, sobra. En móvil, la acción primaria persistente es la barra fija
inferior, así que **los CTA del hero y del cierre bajan a contorno** para no competir con ella.

**Excepción del hero de la home, decidida por el dueño el 2026-09-17.** El `Ver acabados` del
hero de `/` es **ocre también en móvil**, así que esa pantalla enseña dos ocres de acción a la
vez: ese botón y el `Llamar` de la barra fija. El dueño lo sabe y lo elige: con los dos botones
del hero en contorno no se distinguía cuál era la acción principal, y prefiere perder la
jerarquía frente a la barra antes que perderla entre los dos botones que tiene delante.

Es **excepción de pantalla, no enmienda de la regla**: no se extiende al cierre de la home —sus
dos botones siguen en tinta y contorno— ni a ninguna otra ruta. El párrafo de arriba sigue
siendo la norma en las 50 restantes. Y no relaja nada del foco: `btn-primario` cambia el
`outline` a `--tinta`, que es el único que contrasta sobre ocre, y viene ya dentro de la
variante `primario` de `Boton`.

Los antetítulos de sección van siempre en `--acero` sobre fondo claro y en `--fondo-alt` sobre
fondo oscuro. **Nunca en ocre**: no son acciones.

### 2.3 Tipografía

| Rol | Fuente | Pesos | Uso |
|---|---|---|---|
| Display | **Archivo** (Expanded) | 700–800 | Titulares y cifras grandes |
| Texto | **Instrument Sans** | 400–600 | Párrafos, listas, formularios |
| Datos | **Martian Mono** | 400–500 | Códigos, superficies, años, municipios, fichas técnicas |

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@112..125,600..800&family=Instrument+Sans:wght@400..600&family=Martian+Mono:wght@400..500&display=swap" rel="stylesheet">
```

Archivo es una fuente variable con eje de anchura. Los `font-stretch` usados son
**125 %** (hero y H1), **120 %** (H2) y **115 %** (H3 y títulos de tarjeta). No inventar otros
valores.

~~**118 %** (logo, H2 de móvil)~~ — **retirado el 2026-09-01.** Su único consumidor era
`.fs-logo`, el logotipo tipográfico, y el logotipo es una imagen desde esa fecha (§4.1). La otra
mitad de la cláusula nunca fue cierta: los H2 de móvil usan `fs-h2` a 120 %, como los de
escritorio. La clase se borra de `app/globals.css` y el eje queda en tres valores.

En Tailwind: `font-display`, `font-sans`, `font-mono` (ver `tailwind.config.ts`).

### 2.4 Escala tipográfica

Escala cerrada del §8.3: **12 / 14 / 16 / 20 / 26 / 34 / 46 / 64 / 88**. No hay valores
intermedios; si un titular no cabe, se acorta el titular.

**Salvo cuando el titular no se puede acortar: entonces se parte por sílabas.** Enmienda del
2026-09-17. El H1 de `/microcemento/` es el nombre del servicio y el copy viene del documento
maestro: «Microcemento» a 46 px mide **404 px de palabra indivisible** y en un teléfono de
390 px el H1 dispone de 354, o sea **47 px de scroll horizontal de la página entera**, medidos.
No se sale ninguna caja: se sale la tinta de una línea. Y no hay a qué bajar, porque entre 34 y
46 la escala no tiene nada. Así que los H1 llevan `hyphens: auto` —con el `lang="es"` del
`<html>` da «Microce-mento», partición correcta en español— y `overflow-wrap: break-word` como
red por si el navegador no trae patrones. **Solo el H1**: es el único tamaño de la escala que
llega a no caber, y hay uno por página.

| px | Interlineado | Fuente | Uso |
|---|---|---|---|
| 88 | 1.02–1.05 | Archivo 800 / 125 % | Hero de la home, escritorio. `letter-spacing: -0.03em` |
| 64 | 1.05 | Archivo 800 / 125 % | H1 de página interior en escritorio; hero de móvil. `-0.025em` |
| 46 | 1.1 | Archivo 700 / 120 % | H2 de escritorio. `-0.02em` |
| 34 | 1.15 | Archivo 700 / 118–120 % | H2 de móvil, H3 de escritorio |
| 26 | 1.2–1.3 | Archivo 700 / 115 % | H3, títulos de tarjeta grandes, entradilla |
| 20 | 1.6 | Instrument Sans 400–600 | Párrafo destacado, títulos de tarjeta, filas de tabla |
| 16 | 1.6 | Instrument Sans 400–600 | Cuerpo base. **Mínimo en prosa** |
| 14 | 1.6 | Instrument Sans 400 | Secundario, pies de foto, ayuda de campo |

Monoespaciada, tres niveles con función propia. `letter-spacing` entre `0.03em` y `0.08em`,
siempre en versalitas reales (el texto se escribe en mayúsculas, no con `text-transform`
sobre minúsculas, para que el `letter-spacing` case):

| px | Uso |
|---|---|
| 12 | Antetítulo de sección, chip de filtro, ficha técnica de servicio |
| 11 | Dato de ficha en escritorio, etiqueta de campo, enlaces del pie |
| 10 | El mismo dato de ficha comprimido a 390 px. **Suelo absoluto** |

Por debajo de 10 px no hay nada. Nunca.

### 2.5 Espaciado

Ritmo de sección:

| | Escritorio (1440) | Móvil (390) |
|---|---|---|
| Margen lateral | 48 px | 18 px |
| Alto de sección | 72–88 px arriba y abajo | 36–40 px |
| Cabecera | 84 px de alto, `0 48px` | 14–16 px de padding |

Rejillas de escritorio, con el ancho de contenido a 1440 − 96 = **1344 px**:

| Uso | Rejilla |
|---|---|
| Sección con antetítulo lateral | `grid-template-columns: 380px 1fr; gap: 64px` |
| Dos columnas de peso igual | `1fr 1fr; gap: 72px` |
| Muestrario | `repeat(4, 1fr); gap: 32px 24px` |
| Proyectos y servicios | `repeat(3, 1fr); gap: 24px` |
| Proceso en 4 pasos | `repeat(4, 1fr); gap: 32px` |
| Pie | `repeat(4, 1fr); gap: 40px` |

Rejillas de móvil: una columna, salvo el muestrario (`1fr 1fr; gap: 22px 14px`). Los carruseles
de tarjetas usan `overflow-x: auto` con margen negativo lateral para sangrar a los bordes.

**Siempre flex/grid con `gap`.** Nunca márgenes por elemento ni espaciado por espacios en blanco.

### 2.6 Bordes, radios y sombras

- **`border-radius: 0` en todo el sitio.** Sin excepciones.
- Separadores: `1px solid #1B1E1C` para abrir y cerrar un grupo, `1px solid #DADCD6` o
  `#5C625E` entre filas del grupo. Sobre fondo oscuro, `1px solid #41535C`.
- Rejillas con retícula visible (la paleta de la lámina): contenedor `background: #1B1E1C`
  con `padding: 2px` y `gap: 2px`, y celdas con fondo propio. La línea es el fondo que asoma.
- **Una sola sombra en toda la web**: `box-shadow: 0 -6px 18px rgba(27,30,28,0.18)` en la barra
  fija de móvil. Ningún otro elemento lleva sombra.
- Sin gradientes de fondo. La única trama admitida es la del bloque de posición de foto.

### 2.7 Los azules de la marca

El logotipo de la empresa es azul, y esos azules **no entran en la paleta**. No hay tokens
`marca-*` en `tailwind.config.ts` ni ningún color azul declarado en el tema: el §2.1 se
cumple entero. Los azules existen únicamente dentro de los archivos de
`public/marca/*.png`, que son mapas de bits y no tokens, así que no hay forma de que se
escapen a un botón, un enlace, un borde o un estado. El único color de acción sigue siendo
el ocre, y la regla del §2.2 no cambia.

Consecuencia práctica: **el logotipo no se recolorea desde CSS.** Cada fondo tiene su
archivo —`logo-texto.png` sobre fondo claro, `logo-texto-claro.png` y `logo-marca-claro.png`
sobre tinta— y variar el color de la marca es sustituir el archivo, no tocar una clase.

Hubo hasta el 2026-09-17 una recreación vectorial del dibujo (`MarcaSvg.tsx`, `lib/marca.ts`
y una escala de ocho azules expuesta como `text-marca-*`), hecha cuando en el repositorio no
había ningún archivo del logotipo. Retirada al entrar los originales: una reconstrucción
geométrica con la tipografía display del sitio no es la marca de la empresa, y mantenerla
obligaba a abrir una excepción en la paleta que ya no hace falta. Queda en el historial por
si algún día se quiere un logotipo que sí escale y se recoloree.

### 2.8 El velo

**Pieza nueva del sistema, 2026-09-17.** Hasta esta fecha el sistema **no tenía velo**, y por eso
un comentario de `app/page.tsx` justificaba haber sacado el titular de encima de la foto del
hero: sobre fotografía real el contraste deja de ser comprobable. El dueño ha decidido que el
titular vuelva a ir encima. La decisión no se cumple pintando texto claro sobre una foto: se
cumple añadiendo la pieza que faltaba, con su valor medido.

| Token | Valor | Uso |
|---|---|---|
| `--velo` | `rgba(27, 30, 28, 0.68)` | Capa entre una fotografía y el texto que se pinta sobre ella |

**No es un color nuevo.** Es `--tinta` con alfa, así que la paleta de seis del §2.1 sigue
cerrada: no hay un séptimo hex en ninguna parte.

**De dónde sale el 0,68.** No de mirar una captura. Se compone el velo sobre **cada píxel** de
la foto igual que lo hace el navegador —en sRGB— y se busca el píxel que deja el contraste WCAG
de `--fondo` (`#E9EAE6`) **más bajo**, sobre el recorte `3/4` real de un teléfono de 390 px
(354 × 472 con `object-cover`). No se promedia: un promedio pasa por alto el reflejo de sol de
40 px sobre el que cae una letra.

| Fondo bajo el velo | Píxel más claro | Contraste de `--fondo` |
|---|---|---|
| **Blanco puro `#FFFFFF`** — el peor fondo que puede existir | — | **4,79 : 1** |
| Moncada, impreso espiga 117 | `#FFFFFF` | 4,79 : 1 |
| Denia, piedra inglesa gris | `#FFFFFF` | 4,79 : 1 |
| Alzira, adoquín irregular 107 | `#FFFFFF` | 4,79 : 1 |
| Corbera, fratasado arena | `rgb(255,247,220)` | 4,98 : 1 |
| Negro puro | — | 15,26 : 1 |

**Vuelta a medir el 2026-09-18, con el hero a pantalla completa** (§3.15). El recorte manda, y
el recorte ha cambiado: ya no hay un `3/4` de 354 × 472, hay una sección que ocupa casi todo el
alto útil a cualquier ancho. Mismo método, mismo peor píxel, tres recortes reales medidos:

| Recorte | Moncada | Denia | Alzira | Corbera |
|---|---|---|---|---|
| **354 × 472** — el `3/4` de móvil que midió la tabla de arriba | 4,79 | 4,79 | 4,79 | 4,98 |
| **390 × 632** — teléfono de 390, sección a pantalla completa | 4,79 | 4,79 | 4,79 | **4,93** |
| **768 × 778** — tableta | 4,79 | 4,79 | 4,79 | **5,01** |
| **1366 × 602** — portátil | 4,79 | 4,79 | 4,79 | **4,94** |

La primera fila reproduce exacta la tabla de arriba, y eso es lo que prueba que el método no ha
derivado. **`--velo` se queda en 0,68**: las tres fotos con cielo quemado siguen tocando el peor
caso absoluto lo recorte quien lo recorte, y Corbera, que no lo toca, solo puede mejorar.

⚠️ **Sobre el velo no puede ir `--sobre-tinta`.** Medido en los mismos recortes, ese gris da
**4,19 : 1**, por debajo del 4,5 que AA pide a texto normal, aunque sea el token del texto sobre
`--tinta` opaco en el resto del sitio. Lo que va encima del velo es `--fondo` y solo `--fondo`;
el botón de contorno usa por eso su variante `sobreOscuro`, que ya lo trae.

El número que manda es el primero, y las tres filas siguientes explican por qué: **tres de las
cuatro fotos del carrusel tienen cielo quemado a blanco puro**, así que su peor caso real *es*
el peor caso absoluto. Diseñar el velo contra `#FFFFFF` no es pesimismo de laboratorio, es
describir lo que hay en pantalla — y de paso deja la garantía AA sin depender de qué foto se
ponga mañana.

Por debajo de `0,67` esa garantía se pierde (4,48 : 1 medido a 0,66). Con `0,68` quedan 0,29
puntos de margen sobre el 4,5 : 1 que AA pide a texto normal —el titular es texto grande y le
bastaría 3 : 1—, y la foto conserva el 32 % de su luz, suficiente para que se lea la textura,
que es lo único que un muestrario de material tiene que enseñar.

El cálculo se reproduce con cualquier implementación de la fórmula de luminancia relativa de
WCAG 2.1; lo que no se puede cambiar sin rehacer la tabla es el recorte —`3/4` a 390 px— porque
`object-cover` decide qué parte de la foto se ve y, con ella, cuál es el píxel más claro.

**Dónde se usa, y dónde no.** Solo donde un texto del sitio se pinta encima de una fotografía.
Hoy eso es un sitio: **el hero de la home, a todos los anchos** desde el 2026-09-18.

🔴 **Hasta esa fecha este § decía «por debajo de 768 px» y que en escritorio el velo se retiraba
con `md:hidden`.** Era cierto mientras el titular tuvo su propia columna al lado de la foto. Con
el hero a pantalla completa (§3.15) el titular, la entradilla y los dos botones se pintan encima
de la foto también en escritorio, así que el velo va con ellos. No es una excepción nueva: es la
misma regla —velo donde hay texto sobre foto— aplicada a una pantalla que cambió.

Sigue sin ser un tratamiento estético reutilizable: un velo que aparece donde no hace falta es
una foto oscurecida sin motivo.

La etiqueta técnica (§3.8) **no necesita velo y no cuenta como excepción**: trae su propio fondo
`--tinta` opaco, y el velo compuesto sobre `--tinta` da exactamente `--tinta`.

## 3. Componentes base

Los 15 componentes con los que se compone todo el sitio. Cualquier pantalla nueva se construye
con estos; si hace falta uno nuevo, se crea en este mismo lenguaje y se añade aquí.

### 3.1 Botón primario (ocre)

```
min-height: 56px (escritorio) / 48px (móvil)
padding: 0 30px (escritorio) / 0 24px (móvil)
background: #D9A441 · color: #1B1E1C · border: none · radius: 0
font: Instrument Sans 600 16px
:hover  background: #C6902F
:focus  outline: 2px solid #1B1E1C; outline-offset: 3px
```

Uno por pantalla como máximo.

### 3.2 Botón de contorno

```
igual métrica que 3.1
background: transparent · color: #1B1E1C · border: 1px solid #1B1E1C
:hover  background: #1B1E1C; color: #E9EAE6
:focus  outline: 2px solid #D9A441; outline-offset: 3px
```

Sobre fondo oscuro: `border: 1px solid #DADCD6; color: #E9EAE6`, y en `:hover` invierte a
`background: #E9EAE6; color: #1B1E1C`.

### 3.3 Botón de relleno en tinta

```
background: #1B1E1C · color: #E9EAE6 · border: none
:hover  background: #41535C
```

Para la acción secundaria de peso: *Llamar al …*, *Escribir por WhatsApp*.

### 3.4 Estado deshabilitado

```
background: #DADCD6 · color: #5C625E · cursor: not-allowed
```

### 3.5 Enlace-etiqueta

Para «ver todo» y navegación lateral.

```
min-height: 48px · display: inline-flex; align-items: center
font: Martian Mono 12px · letter-spacing: 0.05em · text-decoration: none
border-bottom: 2px solid #1B1E1C
texto en mayúsculas terminado en →     p. ej.  VER TODOS LOS PROYECTOS →
```

### 3.6 Chip de filtro y de dato

Con acción es un `<button aria-pressed>`; **sin acción es un `<span>`** con el mismo aspecto y
el mismo estado activo. La variante sin acción existe para los recuentos que no filtran nada
—«Todas (16)» en la home—: un botón que no hace nada es una promesa falsa para el teclado y el
lector de pantalla, y además arrastraba el componente entero al paquete de cliente de la home.

```
min-height: 44px · padding: 0 18px (escritorio) / 0 14px (móvil)
font: Martian Mono 12px (escritorio) / 11px (móvil) · letter-spacing: 0.05em
white-space: nowrap
inactivo  background: transparent · color: #1B1E1C · border: 1px solid #5C625E
activo    background: #D9A441 · color: #1B1E1C · border: 1px solid #D9A441
:focus    outline: 2px solid #D9A441; outline-offset: 2px
```

Variante sobre fondo oscuro: inactivo con `border: 1px solid #DADCD6; color: #E9EAE6`; activo
igual que arriba. ⚠️ **Sin consumidor desde el 2026-09-18**: su único uso eran los chips de la
calculadora de precios, retirada del sitio (`02-pantallas.md §A5`). La variante **se queda
especificada y en el código de `Chip`** —es un estado del componente, no código muerto de una
pantalla— y el siguiente bloque sobre `--tinta` que necesite chips la encuentra escrita.

### 3.7 Campo de formulario

```
etiqueta   Martian Mono 11px · letter-spacing: 0.06em · color: #41535C · mayúsculas · sufijo * si obligatorio
campo      min-height: 48px · padding: 0 14px · background: transparent
           border: 1px solid #5C625E · font: Instrument Sans 16px · color: #1B1E1C · radius 0
:focus     outline: 2px solid #D9A441; outline-offset: 2px · border-color: #1B1E1C
relleno    border-color: #1B1E1C
ayuda      Instrument Sans 14px · color: #5C625E, debajo del campo
error      border: 2px solid #8C3A2B  +  mensaje Instrument Sans 600 14px color #8C3A2B
```

Nunca `placeholder` como etiqueta. El `placeholder` solo se usa como ejemplo de formato
(«Largo × ancho»). Sobre fondo oscuro, el borde es `#DADCD6` y el texto `#E9EAE6`.

**El mensaje de error va colgado del campo con `aria-describedby`**, y lo pone el componente,
no cada llamada. Un `aria-invalid="true"` con `aria-describedby` a `null` anuncia «inválido» y
se calla el motivo, que es lo único que sirve para corregirlo. La ayuda se asocia igual. Solo se
listan los `id` que se pintan de verdad, y si el control ya traía su propio `aria-describedby`
el suyo va primero. `components/ui/Campo.tsx`.

**Casilla de verificación** — la única del sitio es la de privacidad del formulario:

```
casilla    el control nativo, sin repintar: 13 × 13 px en el navegador
objetivo   el <label> que la envuelve, min-height: 44px · display: flex · align-items: center · gap: 12px
texto      Instrument Sans 14px · color: #5C625E, con enlace en #1B1E1C
```

El objetivo táctil de 44 px es el del label, no el de la casilla: el label ya recibe el toque,
y agrandarlo no repinta el control. Sin la altura mínima se quedaba en **22,4 px** cuando el
texto cabía en una línea. `align-items: center` y no `flex-start`: con altura mínima, alinear
arriba deja 21 px muertos bajo un texto de una línea y se lee como un `gap` mal puesto.

### 3.8 Etiqueta técnica

La firma del sistema. Tres variantes:

**Sobre imagen o como bloque destacado**

```
background: #1B1E1C · color: #E9EAE6 · padding: 14px 18px
font: Martian Mono 11–12px · line-height: 1.9 · letter-spacing: 0.03em
una línea por dato:   MONCADA · VALENCIA
                      IMPRESO · MODELO ESPIGA · C-117
                      180 m² · 2025
```

**Ficha de obra completa** (barra lateral de la ficha de proyecto)

```
background: #1B1E1C · color: #E9EAE6 · padding: 26px
título     Martian Mono 11px · letter-spacing: 0.08em · color: #DADCD6 · padding-bottom: 14px
fila       display: flex; justify-content: space-between; gap: 16px; padding: 11px 0
           border-top: 1px solid #41535C
etiqueta   color: #DADCD6      valor  color: #E9EAE6
```

**Tabla de ficha técnica sobre fondo claro** (página de servicio)

```
font: Martian Mono 14px · letter-spacing: 0.03em
fila     grid-template-columns: 1fr 340px; gap: 24px; padding: 16px 0
         border-bottom: 1px solid #DADCD6   (la última, #1B1E1C)
etiqueta color: #41535C        valor  color: #1B1E1C
```

En móvil esta tabla **no se comprime**: se apila en pares etiqueta (mono 10) sobre valor
(mono 12), con `border-bottom` entre pares.

### 3.9 Dato pendiente entre corchetes

```
sobre fondo claro   color: #5C625E · border-bottom: 1px dotted #5C625E
sobre fondo oscuro  color: #9AA09B · border-bottom: 1px dotted #9AA09B  (o #DADCD6)
```

Se escribe con los corchetes visibles: `[180] m²`, `[28-38] €/m²`, `[96X XXX XXX]`.
**Nunca se maquillan como validados.** Al sustituirlos por el dato real, se quita el subrayado
punteado y el color pasa al del texto que lo rodea. Inventario completo en `05-pendientes`.

### 3.10 Muestra de acabado

```
cuadrada (aspect-ratio: 1) · sin sombra · sin radio
etiqueta FUERA de la muestra, debajo, para no tapar textura:
  nombre  Archivo 700 / 115 % · 20px (escritorio) / 16px (móvil) · line-height 1.15
  código  Martian Mono 11px (escritorio) / 10px (móvil) · color: #41535C
  obra    Martian Mono 11px / 10px · color: #1B1E1C
gap entre imagen y etiqueta: 14px (escritorio) / 10px (móvil)
seleccionada  outline: 2px solid #D9A441; outline-offset: -2px
```

### 3.11 Fotografía de obra, y su bloque de posición

Son un solo componente con dos estados. La pantalla nunca decide entre uno y otro: pide la
foto y, si no la hay, sale el bloque. Así la ausencia de original sigue siendo visible y no se
tapa con nada.

**Estado con foto.** Sin tratamiento: ni filtro, ni velo, ni sombra, ni radio, ni marco.

```
recorte: object-fit: cover, centrado, dentro de la proporción del hueco
fondo mientras carga: #DADCD6
alt obligatorio y descriptivo — describe lo que se ve, no el proyecto que la origina
+ etiqueta técnica (3.8) sobrepuesta cuando la foto representa una obra concreta
```

**Nada de texto sobre la foto.** El sistema no tiene velo ni degradado, así que sobre una
imagen el contraste deja de poder comprobarse. Los titulares van delante o detrás de la foto,
nunca encima. La etiqueta técnica (3.8) es la única excepción: lleva su propio fondo opaco.

**Estado sin foto.** Sustituye a cualquier imagen provisional mientras no haya originales.

```
background: #DADCD6
background-image: repeating-linear-gradient(45deg,
  rgba(27,30,28,0.05) 0 8px, transparent 8px 18px)     ← 0 6px / 6px 14px en bloques pequeños
etiqueta  Martian Mono 11px · color: #5C625E · letter-spacing: 0.05em
          texto:  PENDIENTE · ORIGINAL A 1600 PX
+ etiqueta técnica (3.8) sobrepuesta cuando el bloque representa una obra concreta
```

Proporciones: `21/9` galería principal de proyecto · `4/3` tarjetas y hero de servicio ·
`16/10` tarjetas de servicio · `16/9` genérico · `1` muestras · `3/4` hero de móvil.

**El nombre de archivo no aparece nunca.** Es anotación de producción.

### 3.12 Tarjeta de proyecto

```
fondo: #DADCD6 sobre --fondo, o #E9EAE6 sobre --fondo-alt
imagen 4/3 (fotografía de obra, 3.11)
padding del cuerpo: 18px 20px 22px (escritorio) / 12px 14px 16px (móvil)
título  Archivo 700 / 115 % · 20px (escritorio) / 16px (móvil) · line-height 1.2
ficha   Martian Mono 11px / 10px · line-height 1.9 · color: #41535C
        MUNICIPIO · PROVINCIA
        SERVICIO · MODELO · COLOR
        [m²] · [año]
toda la tarjeta es un enlace, sin subrayado
```

### 3.13 Estado vacío

No es un error: es una afirmación de honestidad. Se usa igual en el muestrario y en el índice
de proyectos.

```
border: 1px dashed #5C625E · padding: 56px 40px (escritorio) / 28px 20px (móvil)
antetítulo  Martian Mono 11px · letter-spacing: 0.06em · color: #41535C   SIN RESULTADOS
título      Archivo 700 / 120 % · 34px (escritorio) / 26px (móvil)
texto       20px / 16px · color: #5C625E
2 botones de contorno: «Quitar filtros» y «Preguntar por un acabado»
```

### 3.14 Antetítulo de sección

```
Martian Mono 12px (escritorio) / 11px (móvil) · letter-spacing: 0.08em
color: #41535C sobre claro · #DADCD6 sobre oscuro
formato:  04 · MUESTRARIO      (numeral de dos cifras, punto medio, nombre en mayúsculas)
```

La numeración es continua dentro de la página y sirve al lector como índice implícito.

### 3.15 Carrusel de fotografía de obra

**Componente nuevo, 2026-09-17.** Decisión del dueño: el hero de la home enseña varias fotos
que cambian solas, sin gesto táctil. `components/contenido/CarruselFotos.tsx`.

```
marco       relative · overflow: hidden · fondo --fondo-alt · la proporción del hueco, SI
            la tiene: el hero de la home no la pasa y llena la celda. radius 0, sin sombra
capa 1      las 4 fotos · absolute inset-0 · una <Image fill object-cover> por diapositiva
velo        lo que le pase el hero como `children` (§2.8, a todos los anchos)
capa 2      las 4 etiquetas técnicas (§3.8) · inset-x-0 bottom-0, alineadas a la derecha,
            44 px reservados a su izquierda · pointer-events: none · cada una se funde CON
            su foto, no con el carrusel
control     pausa · 44×44 · abajo a la izquierda, en la banda reservada. <input> el PRIMER
            hijo del marco (lo exige el `~`), <label> el ÚLTIMO y con z-index: 20 —ser el
            último lo pinta encima DENTRO del marco, y el hero apila texto por fuera—
pase        ciclo 24 s · 4 diapositivas · 6 s cada una · animation-delay NEGATIVO: el turno
            de cada una, menos una vuelta entera. DOS @keyframes de opacidad + visibility,
            uno por capa, con el mismo reparto y distinta forma de relevarse:
              `carrusel`           fotos     · CRUZAN · 3 puntos porcentuales (≈0,72 s)
              `carrusel-etiqueta`  etiquetas · RELEVAN · 1,5 + 1,5 puntos, sin solaparse
estado base opacity: 0 + visibility: hidden · la PRIMERA, `.carrusel__paso--primera`, visible
```

Lo que define el componente, y nada de ello es decorativo:

- **Todo el componente es de servidor y cuesta cero bytes de JavaScript.** El proyecto no
  admite librerías de animación y aquí no hace falta ninguna: el pase es CSS, y desde el
  2026-09-18 el control de pausa también. Nada del hero hidrata.
- **Las fotos cruzan; las etiquetas se relevan.** El mismo `@keyframes` para las dos capas
  pintaba **dos etiquetas monoespaciadas superpuestas** durante el cruce —medido en el build de
  producción a 390 px: opacidades 0,83 y 0,17, y en pantalla se leía «C‑117SA · GRIS», dos obras
  distintas encima—. Una foto sobre otra es un fundido; un dato sobre otro es un dato falso. La
  capa de etiquetas baja a 0 en el 23,5 % del ciclo y la siguiente no empieza a subir hasta el
  98,5 %, que es **ese mismo instante**: 0,36 s de bajada, 0,36 s de subida, dentro de la misma
  ventana que el cruce de las fotos, así que la etiqueta sigue pegada a su foto.
  Verificado barriendo un ciclo entero sobre el build de producción, **1.201 muestras
  deterministas cada 20 ms** (fijando `currentTime` de las ocho animaciones) más **1.501 en vivo
  con `requestAnimationFrame`**: **cero muestras con dos etiquetas por encima de 0,05**, cero por
  encima de 0 siquiera, y como máximo **una** con `visibility: visible`. Las fotos siguen
  cruzando: la suma de sus cuatro opacidades no baja de **0,9999996**.
- **El estado base es la portada correcta, no un apilamiento.** Con `prefers-reduced-motion:
  reduce`, o en un navegador que no anime, lo que queda es una sola foto fija. La animación
  entera vive dentro de un `@media (prefers-reduced-motion: no-preference)`; **no se delega en
  el `@media reduce` global** de `globals.css`, que solo recorta duración e iteraciones y
  dejaría los `animation-delay` vivos — «no autopasa» tiene que ser una declaración, no un
  efecto secundario. Verificado emulando la media feature: 0 animaciones `carrusel`.
- **Dos capas de pasadas, con el velo en medio.** El velo tiene que oscurecer la FOTO, no el
  texto que va sobre ella. Con la etiqueta dentro de la misma pasada que su foto, el velo —que
  llega como `children` y por tanto después— le caía encima y la dejaba en **2,64 : 1** en
  móvil, contra los 4,5 que pide AA y los 13,9 que marcaba entonces en escritorio, donde
  todavía no había velo. Desde el 2026-09-18 lo hay a los dos anchos, y por eso el orden de
  pintado dejó de ser un detalle de móvil.
  Sacándola a una capa propia por encima del velo, las cuatro miden **13,91 : 1**: la etiqueta
  es `bg-tinta` opaco, así que el píxel de debajo es el mismo pase quien pase.
- **El índice va en `--carrusel-i` y el estado activo en una clase, nunca en `:nth-child`.**
  Del marco cuelgan cinco clases de hijo —interruptor, fotos, velo, etiquetas y la caja del
  control—, y cualquier selector posicional cuenta lo que no debe. Por eso la diapositiva activa
  por defecto es `.carrusel__paso--primera` y no `:first-child`: la primera etiqueta es el
  séptimo hijo, y desde que el interruptor abre la lista ni la primera foto es la primera.
- **El retardo es negativo, y por eso la primera vuelta cruza.** Con el retardo positivo, las
  tres que esperaban no tenían animación viva durante su espera y aparecían de golpe: medidos
  pausando `document.getAnimations()`, **tres huecos en los primeros 24 s** —5,30-5,95 s,
  11,30-11,95 y 17,30-17,95— con la suma de opacidades en **0,069**. Restando una vuelta entera
  las cuatro arrancan en marcha, cada una en su fase, y la suma **no baja de 1** en ningún
  momento del ciclo (mínimo medido 0,9999998, cero huecos).
- **`visibility` viaja con `opacity`, y retira del árbol de accesibilidad.** `opacity: 0` no
  retira nada: un lector de pantalla recorría los cuatro textos alternativos y las cuatro
  etiquetas técnicas seguidos, con o sin movimiento reducido. Con `visibility` en el estado base
  y en el `@keyframes`, el árbol del hero pasa de **101 nodos y 4 imágenes a 30 nodos y 1**.
  Durante los 0,72 s del cruce hay dos FOTOS, que es exactamente lo que hay en pantalla. En la
  capa de etiquetas nunca hay dos: su ventana es más estrecha y entra la siguiente en el mismo
  instante en que sale la anterior. Medido: máximo **una** con `visibility: visible`.
- **Solo la primera foto es prioritaria, y las otras tres pesan menos.** La primera es la
  candidata a LCP, la única precargada y la única a calidad 75. Las tres que esperan salen
  perezosas —para no disputarle la cola— y a `quality={60}`: están dentro del viewport inicial,
  así que el navegador las pide igual, y no hay forma en CSS de aplazar una imagen que sí está
  en el viewport. Medido en un móvil de 390 px a DPR 1, las cuatro fotos del hero pasan de
  **238,1 kB a 156,8 kB (−81,3 kB, −34,2 %)** y la portada entera de 429,8 a 349,2 kB, con el
  mismo ancho servido en las cuatro. ⚠️ Toda calidad nueva hay que declararla en
  `images.qualities` de `next.config.ts`.
- 🔴 **El control lleva `z-index: 20`, y desde el 2026-09-18 no es prescindible.** Ser el último
  hijo lo pinta por encima de las dos capas de pasadas, pero solo dentro del marco. El hero a
  pantalla completa apila su columna de texto ENCIMA del carrusel, con `z-10`, y esa columna
  llega hasta el fondo de la sección en cuanto el contenido crece —a 360×640 basta—: sin el
  `z-20` su caja tapaba los 44×44 del control y el toque no llegaba. Medido con
  `elementFromPoint` sobre el centro del control: con `z-20` responde el control, sin él
  responde la columna de texto. Un pase automático que no se puede parar es literalmente lo que
  prohíbe la WCAG 2.2.2, que es lo que este § se reescribió para poder cumplir.
- **El `@keyframes` está escrito para cuatro diapositivas.** CSS no sabe repartir «1/n» sin
  JavaScript. Con otro número se escribe el `@keyframes` de ese número; fingir que el
  componente es genérico sería mentir sobre lo que hace.

#### El hero a pantalla completa

**Enmienda del 2026-09-18, decisión del dueño.** El carrusel del hero deja de ser un hueco con
proporción dentro de una rejilla y pasa a ser **la sección entera, con el texto encima**, a los
dos anchos. `app/page.tsx` + `.hero-pantalla` de `app/globals.css`.

```
alto      min-height: calc(--hero-util * --hero-asomo)
--hero-util  100svh − --cabecera-actual − --barra-movil − --banda-consentimiento
          --hero-asomo 0,88 · --barra-movil 56px, y 0 a partir de cabecera-ancha (1180 px)
          --banda-consentimiento 0, y 184/148/104 px mientras el aviso de cookies está puesto
capas     carrusel y columna de texto en la MISMA celda de rejilla, el texto con z-10
texto     titular 46/88 px, entradilla y 2 botones, todo en --fondo sobre el velo
          self-start y pb-20: la caja acaba donde acaba el texto y reserva la banda de abajo
          tamaños y espacios por VARIABLE, no por utilidad: se compactan en ventana baja
```

- **«Casi todo el alto, dejando ver el corte», contestado expresamente por el dueño.** No el
  100 %: un hero que llena la pantalla exacta esconde que existe el resto de la página. Medido a
  390×844: sección de 632 px y **86 px de asomo** hasta la barra fija, de los que los últimos 46
  ya son la barra de confianza en tinta.
- 🔴 **`min-height`, no `height`.** A 360×640 el contenido del hero mide 637 px y el alto útil son
  514: con `height` el recorte se lo llevaba el segundo botón. Así la sección crece, se pierde
  el asomo —que es un adorno— y no un CTA, que no lo es.
- 🔴 **`svh`, no `vh` ni `dvh`.** `vh` es el viewport con las barras del navegador retraídas y se
  pasa de largo justo al cargar, que es cuando se mira el hero; `dvh` acierta pero cambia de
  valor al hacer scroll y redimensionaría el elemento que decide el LCP. El respaldo va en
  `@supports (height: 100svh)` y **no en dos declaraciones seguidas**: la declaración lleva
  `var()`, así que un navegador que no conozca la unidad la da por válida, gana la cascada y
  falla al calcular el valor, cayendo en `min-height: auto` y no en la línea anterior.
- **El alto útil no es el de la ventana.** Hay dos barras montadas encima y ninguna está en el
  flujo por debajo del hero: la cabecera `sticky top-0` y la barra de contacto `sticky bottom-0`.
  Son 126 px en móvil.
- **Sin `proporcion`.** Es lo que la hace opcional en el componente: con una `aspect-ratio` viva
  y la anchura en `auto`, el navegador deduce la anchura de la altura —el cálculo que ya devolvió
  scroll horizontal dos veces—. Comprobado `scrollWidth === clientWidth` a 390, 768 y 1366.
- **`sizes` es `(min-width: 1200px) 1200px, 100vw`.** Hasta 1200 px de ventana es `100vw` y a
  390 no cambia nada (ya lo era, y `fill` elige el candidato por la anchura). El tope de 1200
  se añade el 2026-09-18 porque ahí se acaban los originales: las cuatro fotos del pase miden
  1200, 2048, 1200 y 898 px.
  🔴 **Y el tope NO abarata el LCP, que es lo que parecía.** `sharp` no amplía: para el original
  de Moncada, 1200×900, `w=1200`, `w=1536` y `w=2048` devuelven el MISMO archivo de 222.109 B
  (216,9 kB). Los 216,9 kB no son un candidato inflado, son el original entero, y el salto desde
  los 101,6 kB de `50vw` es el precio real de un hueco que pasó de media pantalla a pantalla
  completa —con 750 px se estaba ampliando 1,82×—. Lo que el tope sí ahorra son **40,8 kB, el
  7,6 % del pase**, todos en la diapositiva de Denia, la única con 2048 px de origen. Medido con
  `curl` contra `next start`, `Accept: image/avif`, a 1366×768 y DPR 1.
  **La calidad de la primera se queda en 75.** A 60 serían 147.159 B, −73,2 kB, pero el peldaño
  de 1200 solo lo pide un escritorio: en móvil sigue siendo `w=640`, 73.585 B, q75, sin un byte
  de diferencia. → `design/05` §C #14

#### El hero en la primera visita, con el aviso de cookies puesto

**Cierre del 2026-09-18.** El apartado de arriba se midió con la cookie de consentimiento ya
aceptada, y esa es otra web. Mientras nadie ha decidido, `Consentimiento.tsx` ocupa la parte
baja de la ventana con un bloque `fixed bottom-0 z-50` —181,6 px hasta 500 px de ancho, 96 a
partir de 1024—, y ahí es justo donde el hero a pantalla completa pone **el control de pausa,
la etiqueta técnica y el corte**. Medido a 390×844 antes de esto: borde inferior del hero en
701,8 px, aviso empezando en 606,4. Un pase automático cuyo botón de pausa queda debajo de una
capa incumple la WCAG 2.2.2 igual que si el botón no existiera.

- **`--banda-consentimiento` se resta al alto útil**, y vale 0 en cuanto hay decisión. Tres
  escalones —**184 / 148 / 104 px** en `<768`, `768–1023` y `≥1024`— que **espejan la altura
  medida del aviso** a 21 anchos, redondeando siempre hacia arriba: pasarse solo agranda el
  asomo, quedarse corto vuelve a enterrar el control. Es la misma clase de espejo que
  `--barra-movil`, y se vuelve a medir si se toca el texto del aviso o su tipografía.
- 🔴 **La marca la pone un `<script>` en línea de `app/layout.tsx`, antes del primer pintado.**
  Dejársela al efecto de `Consentimiento.tsx` encoge el hero DESPUÉS de pintarlo, que es el
  mismo redimensionado del elemento del LCP por el que este § rechazó `dvh`. Medido sin el
  script: **CLS 0,156 a 390×844**. Con él, **0,000 en los seis tamaños**. El efecto sigue
  existiendo solo para mantener la marca al día cuando el visitante decide.
- **El alto útil pasa a `--hero-util`, con la rama `@supports` del `svh` dentro.** Así
  `.hero-pantalla` tiene UNA sola declaración de `min-height` viva: una segunda regla plana en
  cualquier parte del archivo anulaba en silencio el `@supports` y devolvía el sitio a `vh`.
- **El contenido se compacta en ventana baja**, porque `--hero-asomo` es un mínimo y nunca es
  él quien se come el corte: se lo come un contenido más alto que el mínimo. Dos escalones por
  alto de ventana, con sus gemelos para cuando el aviso está puesto, todos dentro de la escala
  cerrada del §2.4. El titular de 64 px solo llega hasta 1179 px de ancho: de ahí en adelante
  sobra alto y se queda en 88, porque un titular que se pinta a 64 en la primera visita y salta
  a 88 al aceptar es peor que un asomo de menos.
- ⚠️ **El interletraje viaja con el tamaño.** La escala de `tailwind.config.ts` lo lleva dentro
  de cada peldaño —46 a −0,02em, 64 a −0,025, 88 a −0,03—; al pasar de `text-88` a una
  variable se perdía y el titular ganaba una línea entera, de 359 a 448,8 px a 768×1024.
- ⚠️ **`--hero-pb` no baja de 80 px en móvil.** La etiqueta técnica mide 69,8 px y va a sangre
  abajo, donde los botones son de ancho completo: recortar ese hueco no ahorra alto, encima un
  texto sobre otro. En escritorio los botones son de ancho automático y el suelo lo pone el
  control de pausa, 44 px.

- **Un tercer escalón por debajo de 600 px de alto** —titular 26, entradilla 14, `pt` 16,
  `gap` 12—, que es el que hace existir el asomo en un teléfono de 320×568. Se aplica en los
  **dos** estados, no solo con el aviso decidido, por la misma razón que el titular de 64 px no
  pasa de 1179: un titular que salta de tamaño al tocar «Aceptar» es peor que un asomo de menos.
  Especificidad 0,4,0 —un `:root` más que el escalón del aviso— para que gane por peso y no por
  orden, porque el bloque vive al final del archivo y el final del archivo es donde otra rama
  puede añadir.
- **El foco del control de pausa lleva `scroll-margin-bottom`** con esas mismas dos variables,
  `--banda-consentimiento` + `--barra-movil`. El «llévalo a la vista» del navegador solo conoce
  el viewport y no las dos capas que se le montan encima, así que dejaba el control tapado tras
  tabular hasta él: eso pasa la WCAG 2.2.2 —el pase se puede parar— y **falla la 2.4.11, «Focus
  Not Obscured», que es AA en WCAG 2.2**. Medido a 360×640 en primera visita, donde ocurría.

**El asomo se mide contra lo que tapa la ventana, no contra la ventana.** Abajo hay siempre una
capa opaca fuera del flujo: el aviso mientras nadie decide, y `BarraMovil` —56 px, `sticky
bottom-0`— hasta 1180 px de ancho. Restar solo el aviso y olvidar la barra es el mismo error a
menor escala, y era el de la primera redacción de este apartado: daba 142,2 · 162,1 · 131,4 px
de asomo con la decisión tomada, que son los 56 px de la barra de más en los tres tamaños en que
la barra existe.

Medido en el build de producción, los seis tamaños × dos estados. Control alcanzable con el
puntero y con el tabulador —y **sin tapar** tras tabular—, clic y barra espaciadora marcando el
interruptor, etiqueta entera visible, ni texto recortado ni scroll horizontal nuevo:

    tamaño     primera visita        decidido
    320×568    no cabe (−161,4)      asomo  20,2   ← lo arregla el escalón de 600 px
    360×640    no cabe (−146,6)      asomo  35,0
    390×844    asomo  66,5           asomo  86,2
    768×1024   asomo  30,6           asomo 106,1
    1024×768   asomo  67,4           asomo  75,4   ← no existía
    1366×768   asomo  50,0           asomo  82,1

🔴 **Lo que no cabe es la PRIMERA VISITA de los dos teléfonos pequeños, y solo eso.** La primera
redacción dio 320×568 por imposible entero; era media verdad, y la otra media se perdió dentro
de ella. A 320×568 y 360×640 el aviso mide 181,6 px, la barra 56 y la cabecera 70: quedan 260 y
332 px de ventana, y el suelo de este hero son ~427 px con el texto más pequeño de la escala que
no lo recorta. Ahí no cabe por aritmética —ni bajando el titular a 20 px: −121,5— y el control
sigue alcanzable por scroll y por tabulador, que es lo que la WCAG 2.2.2 pide.

Con la decisión tomada sí cabía, y lo que faltaba era bajar un peldaño más. Medido a 320×568,
ventana útil de 442 px:

    titular   entradilla   otros            columna    asomo
    34 px     16 px        —                514,7 px   −72,7   ← no había corte que ver
    26 px     16 px        —                453,9 px   −11,9
    26 px     14 px        —                437,8 px    +4,2
    26 px     14 px        pt 16 · gap 12   421,8 px   +20,2   ← el escalón

⚠️ El umbral son 600 px de alto y no los 660 que también cogerían un 360×640: ahí el titular ya
cabe en tres líneas y el asomo existe —35 px medidos—, así que compactar sería cobrar un titular
más pequeño por un problema que ese tamaño no tiene.

#### Control de pausa

**Pieza nueva, 2026-09-18.** La WCAG 2.2.2, nivel A, exige poder parar todo contenido que se
mueva solo durante más de cinco segundos, y un pase de 24 s en bucle infinito lo es;
`prefers-reduced-motion` cubre a quien lo lleva activado, que no es lo mismo. **Decisión del
dueño, contestada expresamente: el pase sigue siendo automático y se añade un control pequeño y
discreto sobre la foto.**

🔴 **Enmendado el mismo 2026-09-18: era un botón de cliente y ahora no es JavaScript.** Vive
dentro de `components/contenido/CarruselFotos.tsx`; `BotonPausaCarrusel.tsx` se retira.

```
control  <input type="checkbox" role="switch"> recortado a 1×1, PRIMER hijo del marco
         + <label for> de 44×44, ÚLTIMO hijo. Lo que se ve y se toca es el <label>
caja     44×44 (min-w-tactil/min-h-tactil) · absolute bottom-0 left-0 dentro del marco
color    sobre-oscuro bg-tinta text-fondo — el mismo recuadro opaco de la etiqueta §3.8
glifo    SVG en línea, currentColor: ‖ mientras pasa, ▶ en pausa. Los DOS van en el HTML
         y los alterna `:checked`. Sin librería de iconos
foco     outline ocre de 2 px con offset −2, hacia DENTRO, sobre el <label>
estado   `:checked` del input → `~ .carrusel__paso { animation-play-state: paused }`
nombre   fijo: «Pausa del pase de fotos». El estado lo pone `checked`, no el nombre
```

- **El estado se entiende sin color:** lo dice la forma del glifo, no el pigmento. El control es
  siempre tinta sobre foto, y el glifo mide **13,91 : 1** contra su propio fondo, así que el
  contraste no depende de qué foto haya debajo ni de que exista el velo.
- 🔴 **Sí es un `<input type="checkbox">`, y la versión anterior de este § decía lo contrario.**
  Se rechazaba porque «un interruptor no admite `aria-pressed`». Esa razón pesaba la restricción
  equivocada: un interruptor lleva su estado en `aria-checked`, que es exactamente lo mismo, y a
  cambio el botón de cliente costaba algo que no se puede pagar. **El pase arranca en el primer
  pintado, porque es CSS; el botón no existía hasta hidratar, y con el JavaScript desactivado no
  existía nunca.** En esa ventana había movimiento automático que no se podía parar, que es
  literalmente lo que prohíbe la 2.2.2. Verificado con la ejecución de scripts desactivada por
  CDP: el pase corre —dos capturas a 6,5 s de distancia son distintas— y **el clic en el control
  lo para** —las dos siguientes son idénticas byte a byte—. Cero JavaScript en el hero entero.
- 🔴 **El nombre es un sustantivo, no un verbo, y no cambia.** Antes combinaba `aria-pressed` con
  un `aria-label` que se reescribía, y un lector llegaba a decir «pausar el pase de fotos,
  pulsado». Los dos patrones válidos eran nombre fijo con estado, o nombre que describe la acción
  siguiente sin estado; se toma el primero, porque un interruptor nativo trae el estado puesto.
  «Pausar/Reanudar el pase de fotos» habría repetido la contradicción en otra forma
  —«pausar…, desactivado»—, así que se reordenan las mismas palabras a **«Pausa del pase de
  fotos»**. Comprobado en el árbol de accesibilidad, no leyendo el JSX:
  `{role: switch, name: "Pausa del pase de fotos", checked: false}` → `{… checked: true}`.
- **El `~` en vez de `:has()`.** `:has()` no es universal, y un control de pausa que en algún
  navegador no pare nada es peor promesa que no tenerlo. Eso es lo que obliga a que el `<input>`
  sea el primer hijo del marco: el combinador solo mira hacia delante. Verificado: con el
  interruptor marcado el reloj de la animación avanza **17 ms en 2.000**, y al desmarcarlo
  vuelve a 2.000 de 2.000. Con ratón y con la barra espaciadora.
- 🔴 **El anillo de foco va hacia dentro.** El marco es `overflow: hidden` y el control se apoya
  en su esquina inferior izquierda: con el `outline-offset: 2` global se recortaban **dos de sus
  cuatro lados**, y al llegar con el tabulador se veía media escuadra. Con `outline-offset: -2px`
  el anillo se dibuja dentro de los 44 px. No se mueve el control adentro porque su esquina es
  la banda que la capa de etiquetas ya le reserva. Verificado tabulando —cuatro pulsaciones desde
  el principio del documento— y midiendo los cuatro lados contra el rectángulo del marco.
- **El interruptor se recorta, no se oculta.** `clip-path: inset(50%)` sobre 1×1: `display: none`
  y `visibility: hidden` lo sacarían del orden de tabulación, y es el elemento que recibe el
  foco. El recorte se lleva por delante su propio anillo, que es lo que se quiere.
- 🔴 **Y va anclado a la MISMA esquina que su caja** (`bottom: 0; left: 0`), aunque no se vea.
  Separar «el que recibe el foco» de «el que pinta el anillo» rompe la garantía que traía de
  serie el `<button>`: el navegador lleva a la vista el elemento enfocado, y si el interruptor se
  queda en su posición estática —la esquina SUPERIOR izquierda del marco—, que ya está a la
  vista, no hay scroll y el anillo se pinta fuera de la pantalla. **A 768 px el marco mide
  1.184 px de alto en un viewport de 1.024**: medido con la misma tabulación, la caja arrancaba
  en y=1.280 —**256 px por debajo del pliegue, anillo invisible**— y con el anclaje el navegador
  deja `scrollY` en 811 y la caja en y=469. A 390 y 1366 px salía bien por casualidad, porque
  ahí el marco cabe entero en la pantalla; eso es exactamente lo que hace peligrosa la
  comprobación a un solo ancho.
- **Con movimiento reducido el control se retira entero** (`display: none` sobre `.carrusel__pausa`
  **y sobre `.carrusel__interruptor`**, que son dos piezas y la tabulable es la segunda). No hay
  pase que parar, y así sale también del orden de tabulación en vez de dejar un foco que no hace
  nada. Verificado emulando la media feature: 0 animaciones, una foto y una etiqueta visibles, y
  el tabulador no alcanza el control.
- ⚠️ **Un `id` es único por documento, así que el componente es de uno por página.** Hoy lo es:
  solo lo usa el hero de la home. Si algún día hacen falta dos en la misma página, el `id` pasa a
  ser una prop obligatoria; se deja como constante documentada en vez de fingir una generalidad
  que nadie usa, igual que el `@keyframes` de cuatro diapositivas.
- ⚠️ **Ya no se puede medir el uso de la pausa** sin volver a cruzar la frontera de cliente.
  Nadie lo había pedido; queda dicho porque era gratis con el botón anterior y ahora no lo es.
- **La etiqueta técnica le reserva su banda.** `pl-11` sobre la capa de etiquetas: a 768 px, la
  única anchura del sitio en que pasaba, la columna del carrusel mide 304 px y la etiqueta los
  llenaba enteros, así que el botón se le montaba encima. Se le quita sitio a la etiqueta, que
  se reparte en una línea más; el control no cambia de esquina según el ancho. Medido a 390,
  768, 1024 y 1366: sin solapes y sin scroll horizontal.

**Límite medido: por debajo de 360 px el titular llena el marco.** A 390, 375 y 360 px quedan
175, 64 y 44 px libres entre la última línea del titular y la etiqueta técnica. A 320 px el
titular ocupa los 374 px del marco entero y la etiqueta **se le monta encima**. 320 está por
debajo del ancho normativo de `02-pantallas.md` (390) y esa pantalla ya tenía scroll horizontal
por otro motivo, así que no se ha tapado con un número inventado: si algún día hay que sostener
320, la pieza que falta es reservar la banda de la etiqueta, no encoger el titular —la escala
está cerrada y entre 34 y 46 no hay nada.

### 3.16 Enlace en prosa

Nuevo el **2026-09-18**. Es la pieza número dieciséis: un enlace **dentro de un párrafo**.

El sistema tenía §3.5 para navegar y los botones para los CTA, y no le hacía falta nada más
mientras ninguna pantalla tuvo prosa larga. Las tres páginas legales la tienen, y sus 22 enlaces
se escribieron con la utilidad `text-tinta` sobre el `a { color: inherit }` de `globals.css`:
**medido a 390 px, `rgb(27, 30, 28)` y `text-decoration: none` en los 22.** Del color exacto del
texto que los rodea, sin subrayado. Invisibles.

No es una minucia. Lo invisible eran el `mailto:` para ejercer los derechos, la reclamación ante
la AEPD, los saltos entre las tres páginas, la decisión de adecuación en EUR-Lex y la lista del
Data Privacy Framework: **las vías que la ley obliga a ofrecer.** Y fallaba el criterio 1.4.1 de
las WCAG, que prohíbe que el color sea el único indicador de un enlace — aquí no había ni eso.

```
color: hereda el del texto (#1B1E1C sobre #E9EAE6 → 14,5 : 1)
text-decoration: underline
text-decoration-color: #41535C · text-decoration-thickness: 1px
text-underline-offset: 3px
:hover   text-decoration-color: currentColor · text-decoration-thickness: 2px
:focus   el de §8 global, outline: 2px solid #D9A441; offset 2px. No se redeclara
```

**El arreglo es el subrayado, no el color.** La paleta está cerrada y el ocre no puede ser texto
pequeño sobre fondo claro (§2.2), así que el color se queda donde está y lo que entra es la
línea: cumple 1.4.1 sin depender de la vista de colores de nadie, y conserva el contraste máximo.

Se distingue del dato pendiente de §3.9, que también lleva línea inferior, por la línea misma:
**punteada y atenuada = dato que falta; continua = sitio al que ir.**

**Se aplica por dos vías, y las dos comparten el mismo declarado:**

- `.texto-legal a` — los tres documentos de golpe. Esa clase la pone `PlantillaLegal` sobre la
  entradilla y sobre el cuerpo de cada sección, así que alcanza también las fichas de cookies que
  se montan dentro, y **deja fuera el índice de la propia plantilla**, que es §3.5.
- `.enlace-prosa` — el enlace suelto que vive fuera de esa clase. **Un solo consumidor hoy**, y no
  es decorativo: el enlace a la política de privacidad de la casilla del formulario, que tenía el
  mismo defecto que los 22 y es el peor sitio donde tenerlo. La casilla dice «He leído la política
  de privacidad», y esa frase solo es verdad si la política se alcanza desde donde se afirma
  haberla leído.

⚠️ La regla se generaliza **añadiendo la clase, nunca copiando el declarado.**

## 4. Elementos transversales

### 4.1 Cabecera de escritorio

```
height: 84px · padding: 0 48px · border-bottom: 1px solid #1B1E1C · background: #E9EAE6
logo     imagen /marca/logo-texto.png · 24px de alto (20 en móvil) · sin cambio con el scroll
nav      Instrument Sans 500 16px · gap: 28px · cada enlace min-height: 44px
activo   font-weight: 600 + border-bottom: 2px solid #1B1E1C
derecha  teléfono en Martian Mono 12px color #5C625E  +  botón de contorno «Pedir presupuesto»
```

**El logotipo es una imagen desde el 2026-09-01, y va el wordmark solo.** El bloque completo
apila la senda de losas encima y el claim debajo: en una barra de 70-84 px eso deja las palabras
a 6-8 px de altura de mayúscula y el claim en 3-4 px. El bloque completo se pinta en el pie
(§4.4), que es el único sitio del sitio con alto para él.

**Esta cabecera empieza en `cabecera-ancha` = 1180 px, no en 768. Enmienda del 2026-09-17,
medida sobre el DOM.** Es un punto de ruptura **propio del proyecto**, declarado en
`tailwind.config.ts` (`extend.screens`), porque ninguno de los de serie cae donde esta fila cabe:
`lg` (1024) se queda corto y `xl` (1280) deja fuera al iPad en horizontal, que es tráfico real.

Las cifras, con el nav ya sin `/precios/` (4 enlaces):

| Ancho de ventana | Contenido útil | Hijos | Hueco a cada lado | Veredicto |
|---|---|---|---|---|
| 1024 | 913 px | 928,4 px | **0 px** | ❌ Los tres bloques pegados, y 15,4 px robados al gutter derecho |
| **1180** | **1069 px** | 928,4 px | **70,3 px** | ✅ Logotipo a 276 px, teléfono y botón en una línea, gutter intacto |
| 1280 | 1169 px | 928,4 px | 120,3 px | ✅ |

Los **928,4 px de hijos** son logotipo 276 + nav 333,3 + (teléfono 99 + hueco 20 + botón 200,1);
el contenido útil descuenta los 96 px de gutter y los 15 de la barra de scroll de escritorio. El
suelo aritmético —hueco cero— son 1039,4 px de ventana, y **caber al byte no es caber**: a 1024
nada se rompe visiblemente, porque el logotipo lleva `shrink-0` y el teléfono `white-space:
nowrap`, así que el fallo no se ve roto, se ve apretado.

Por debajo de 1180 vale **la cabecera de móvil**: logotipo + hamburguesa, con `MenuMovil` y la
barra fija de §4.3, que se esconde en el mismo punto. No es una banda sin navegación: es el
estado de móvil, completo y ya diseñado, en una ventana más ancha. **Punto de ruptura del nav
(1180) y altura de la caja (768) son dos cosas distintas** y no se mueven juntas.

⚠️ `cabecera-ancha` nombra esta fila y la barra de §4.3, y nada más. Los `xl:` que quedan en el
repo —submenú de servicio, filtros, hero de servicio, ficha técnica— responden a pistas de
rejilla propias, con su propia cifra en `02-pantallas.md`, y no siguen a la cabecera. El de la
calculadora se fue con ella el 2026-09-18.

En móvil la caja mide 70 px, y `--cabecera-actual` de `tokens.css` lo espeja con una media
query: es el `top` del que cuelgan la barra de confianza, el submenú de servicio y las dos
barras de filtro. **La altura no se anima nunca** (`02-pantallas.md §B9`): el estado compacto
tras hacer scroll oculta el teléfono por `visibility`, y el botón de contorno se queda en 56 px.
~~El logotipo cruza dos variantes por `opacity`~~: **derogado el 2026-09-01**. Las dos variantes
tipográficas existían para que el ancho no se moviera al comprimirse la barra; una imagen de caja
fija no se comprime, así que el logotipo se queda igual con scroll y sin él. El menú desplegado en móvil está en
`02-pantallas.md §B9`.

### 4.2 Barra de confianza

```
background: #1B1E1C · color: #E9EAE6 · height: 60px · padding: 0 48px
position: sticky; top: 80px    ← se ancla al hacer scroll, solo en ESCRITORIO
font: Martian Mono 12px · letter-spacing: 0.04em
4 datos separados por · en color #41535C:
  17 AÑOS DE OFICIO · GARANTÍA DE 10 AÑOS CON MANTENIMIENTO ·
  VALENCIA, CASTELLÓN Y ALICANTE · MÁS DE 3 DE CADA 10 CLIENTES VUELVEN A LLAMARNOS
```

En **móvil no se ancla**: pasa con el scroll y se apila en 4 filas numeradas `01`–`04` con el
numeral en `#41535C`. Solo un elemento fijo en móvil, y es la barra de contacto.

### 4.3 Barra fija inferior de móvil

```
position: sticky; bottom: 0 · z-index: 20
grid-template-columns: 1fr 1fr · gap: 1px · background: #1B1E1C   (la línea entre botones)
box-shadow: 0 -6px 18px rgba(27,30,28,0.18)
[Llamar]    min-height: 56px · background: #D9A441 · color: #1B1E1C · 16px/600
[WhatsApp]  min-height: 56px · background: #1B1E1C · color: #E9EAE6 · 16px/600
```

Siempre visible en móvil, en todas las páginas. **Es el CTA primario de móvil**, y por eso
consume el único ocre de acción de la pantalla.

**Se esconde en `cabecera-ancha` = 1180 px, no en 768** (enmienda del 2026-09-17): sigue a la
cabecera de §4.1, que empieza donde de verdad cabe. Las dos se mueven juntas, siempre: mover
una sola deja una banda de anchos sin nav visible y sin barra de contacto a la vez.

### 4.4 Pie de página

```
background: #1B1E1C · color: #E9EAE6 · padding: 56px 48px 40px
grid-template-columns: repeat(4, 1fr) · gap: 40px
col 1  logo: /marca/logo-marca-claro.png · 222px de ancho (190 en móvil) · senda + wordmark,
       sin el claim, en variante clara. Es el único sitio donde se pinta la senda de losas
col 2  NAP en Martian Mono 11px · line-height: 2.2
col 3  servicios · Instrument Sans 16px · color: #DADCD6 · cada enlace min-height: 44px
col 4  legales · igual
```

En móvil: una columna, logo + NAP, y los enlaces legales en fila con `min-height: 44px`.
El año del copyright se calcula, no se escribe.

### 4.5 Migas de pan

```
Martian Mono 11px (escritorio) / 10px (móvil) · letter-spacing: 0.05em · color: #41535C
cada elemento con min-height: 44px, incluidas las barras separadoras
último elemento en #1B1E1C, sin enlace
INICIO / SERVICIOS / HORMIGÓN IMPRESO
```

Acompañar siempre de `BreadcrumbList` en JSON-LD.

### 4.6 Submenú de página de servicio

```
position: sticky; top: 80px · background: #1B1E1C · height: 56px · padding: 0 48px
chips Martian Mono 11px · min-height: 44px · padding: 0 16px
inactivo color: #DADCD6 · activo background: #D9A441; color: #1B1E1C
```

Solo en escritorio. Las secciones destino llevan `scroll-margin-top: 150px` para que el
antetítulo no quede debajo de la cabecera.
