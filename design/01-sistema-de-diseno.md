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
**125 %** (hero y H1), **120 %** (H2), **118 %** (logo, H2 de móvil) y **115 %** (H3 y títulos
de tarjeta). No inventar otros valores.

En Tailwind: `font-display`, `font-sans`, `font-mono` (ver `tailwind.config.ts`).

### 2.4 Escala tipográfica

Escala cerrada del §8.3: **12 / 14 / 16 / 20 / 26 / 34 / 46 / 64 / 88**. No hay valores
intermedios; si un titular no cabe, se acorta el titular.

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

Excepción consciente y acotada a «no añadir colores» del §2.1: el logotipo de la empresa
es azul, y el logotipo no es interfaz. Los azules **solo los usa el logotipo**. Ningún
botón, enlace, borde, fondo ni estado de la web es azul: el único color de acción sigue
siendo el ocre, y la regla del §2.2 no cambia.

Escala cerrada de ocho pasos, del frente al fondo del camino de baldosas. No hay valores
intermedios, igual que en la escala tipográfica.

```
marca-900  #0C2450     marca-500  #1C7CC6
marca-800  #123B6F     marca-400  #2C92DD
marca-700  #15508C     marca-300  #5CAAE8
marca-600  #1866A8     marca-200  #8FC6F0
```

**Cada baldosa lleva un solo azul plano.** El degradado ocurre entre baldosas, nunca
dentro de una: no hay un solo gradiente en la marca, como no lo hay en el resto del sitio.

**Sobre fondo oscuro la rampa sube dos pasos.** Los azules del frente (`marca-900`,
`marca-800`) son casi negros y se perderían contra `--tinta`. La variante `sobreOscuro`
de la marca desplaza el índice de cada baldosa, sin cambiar el dibujo.

El nombre va en texto vivo, no en trazado: «PAVIMENTOS» en `--tinta` (o `--sobre-tinta`
sobre oscuro) y «ALBUFERA» en `marca-600` (o `marca-300` sobre oscuro).

Fuente única de la escala: `lib/marca.ts`. La importan `tailwind.config.ts`, que la expone
como `text-marca-*`, y `components/layout/MarcaSvg.tsx`, que rellena las baldosas.

**Estado: recreación.** El dibujo actual es una reconstrucción geométrica del logotipo a
partir de una imagen de referencia, no el original vectorial de la empresa, y la
tipografía del nombre es la display del sitio, no la del logotipo. El bloque no incluye la
línea «HORMIGÓN IMPRESO | PULIDO | LAVADO» del original, que nombra tres de los seis
servicios que hoy tiene la web. Cuando llegue el original, se sustituye `MarcaSvg.tsx` y
nada más.

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

### 3.6 Chip de filtro

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

### 3.11 Bloque de posición de foto

Sustituye a cualquier imagen provisional mientras no haya originales.

```
background: #DADCD6
background-image: repeating-linear-gradient(45deg,
  rgba(27,30,28,0.05) 0 8px, transparent 8px 18px)     ← 0 6px / 6px 14px en bloques pequeños
etiqueta  Martian Mono 11px · color: #5C625E · letter-spacing: 0.05em
          texto:  PENDIENTE · ORIGINAL A 2400 PX
+ etiqueta técnica (3.8) sobrepuesta cuando el bloque representa una obra concreta
```

Proporciones: `21/9` galería principal de proyecto · `4/3` tarjetas y hero de servicio ·
`16/10` tarjetas de servicio · `16/9` genérico · `1` muestras · `3/4` hero de móvil.

**El nombre de archivo no aparece nunca.** Es anotación de producción.

### 3.12 Tarjeta de proyecto

```
fondo: #DADCD6 sobre --fondo, o #E9EAE6 sobre --fondo-alt
imagen 4/3 (bloque de posición)
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
título      Archivo 700 / 118 % · 34px (escritorio) / 26px (móvil)
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
logo     Archivo 800 / 118 % · 16px · letter-spacing: 0.02em · dos líneas: PAVIMENTOS / ALBUFERA
nav      Instrument Sans 500 16px · gap: 28px · cada enlace min-height: 44px
activo   font-weight: 600 + border-bottom: 2px solid #1B1E1C
derecha  teléfono en Martian Mono 12px color #5C625E  +  botón de contorno «Pedir presupuesto»
```

**Pendiente de maquetar** (`02-pantallas.md §B9`): estado compacto tras hacer scroll y menú
desplegado en móvil. El estado inicial y la barra fija de móvil ya están resueltos.

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

### 4.4 Pie de página

```
background: #1B1E1C · color: #E9EAE6 · padding: 56px 48px 40px
grid-template-columns: repeat(4, 1fr) · gap: 40px
col 1  logo
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
