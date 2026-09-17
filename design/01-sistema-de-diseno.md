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
que la enseña. La excepción **empieza y acaba en `public/marca/`**: ningún texto, borde, fondo ni
estado del sitio puede usar esos valores.

De ahí sale un tercer valor derivado, también exclusivo del logotipo: **`#8FB4D6`**, el azul de
la variante clara. Existe porque `#000D2A` mide **1,1 : 1** contra `--tinta` —sobre el pie el
logotipo original desaparece— y hace falta un par claro que conserve el contraste entre las dos
palabras. El detalle de cómo se derivan las variantes está en `public/README.md`.

### 2.2 La regla del ocre

**Dos roles por pantalla, no dos apariciones:**

1. **Un único CTA primario** — el del hero o el del cierre, nunca los dos.
2. **El estado activo** — un chip marcado por cada grupo de selección. Una pantalla con dos
   grupos de filtros muestra dos marcas, y eso es correcto.

Todos los demás botones son de contorno o de relleno en tinta. Cualquier ocre que no cumpla
uno de esos dos roles, sobra. En móvil, la acción primaria persistente es la barra fija
inferior, así que **los CTA del hero y del cierre bajan a contorno** para no competir con ella.

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

## 3. Componentes base

Los 14 componentes con los que se compone todo el sitio. Cualquier pantalla nueva se construye
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

Variante sobre fondo oscuro (calculadora de precios): inactivo con
`border: 1px solid #DADCD6; color: #E9EAE6`; activo igual que arriba.

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

**Esta cabecera empieza en 1280 px, no en 768. Enmienda del 2026-09-17, medida sobre el DOM.**
Los tres bloques de la fila suman **1011,8 px** de ancho natural —logotipo 276 + nav 416,6 +
teléfono 99 + hueco 20 + botón 200— y los 48 px de gutter ponen 96 más: hacen falta **1108 px de
ancho de contenido** para que quepan pegados y ~1164 para que respiren. Encendida en 768 px el
resultado medido era el logotipo aplastado de 276 a 36 px —una imagen de caja fija que al
encogerse se deforma—, el teléfono en tres líneas y el botón en dos. **1024 px tampoco llega**:
928 px de contenido para 1011,8 de hijos, 84 px de déficit. A 1280 el contenido es 1265 px y
sobran 157 para los dos huecos.

Entre 768 y 1279 vale **la cabecera de móvil**: logotipo + hamburguesa, con `MenuMovil` y la
barra fija de §4.3, que se esconde en el mismo punto. No es una banda sin navegación: es el
estado de móvil, completo y ya diseñado, en una ventana más ancha. **Punto de ruptura del nav
(1280) y altura de la caja (768) son dos cosas distintas** y no se mueven juntas.

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

**Se esconde en 1280 px, no en 768** (enmienda del 2026-09-17): sigue a la cabecera de §4.1,
que empieza donde de verdad cabe. Moverla sola dejaría la banda 768–1279 sin nav visible y sin
barra de contacto a la vez.

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
