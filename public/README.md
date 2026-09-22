# public/ — activos estáticos

Se sirven tal cual desde la raíz del dominio: `public/obras/x.jpg` → `/obras/x.jpg`.
Una carpeta por concepto del modelo de contenido (`design/03-modelo-de-contenido.md`),
igual que `content/` tiene un JSON por tipo.

```
public/
├── marca/       logotipo y variantes de la identidad
├── obras/       fotografías de proyectos ejecutados → Proyecto.imagenes[].src
├── acabados/    muestras macro del muestrario        → Acabado.muestra
└── blog/        imágenes de apertura de artículos    → Articulo.imagenApertura
```

Los iconos de pestaña y las imágenes de compartición **no viven aquí**: son convenciones de
archivo de Next 15 y van en `app/` (`icon.png`, `apple-icon.png`, `opengraph-image.png`).
Decían `icon.svg` y nunca lo fueron: en este repo no hay un solo SVG. Los dos iconos son la
senda del logotipo recortada del original; la caja de recorte y el porqué de cada decisión están
en `design/01-sistema-de-diseno.md` §2.1.

## Nomenclatura

- `obras/` — `municipio-servicio-modelo-color-año.jpg`, en minúsculas y sin acentos.
  Ej.: `moncada-impreso-espiga-117-2025.jpg`. El sufijo `-antes`, `-proceso` o `-detalle`
  cuando la foto no sea el resultado final: `moncada-impreso-espiga-117-2025-proceso.jpg`.
- `obras/_sin-atribuir/` — fotos de obra reales de las que **no se sabe el municipio ni el año**.
  Conservan el nombre original de la mediateca de WordPress, y se referencian así desde `content/`.
  Renombrarlas al patrón de arriba afirmaría datos que nadie ha confirmado. Suben a la raíz solo
  cuando el dueño confirme a qué obra pertenecen.
- `acabados/` — el `slug` del acabado: `espiga-117.jpg`.
- `blog/` — el `slug` del artículo: `guia-hormigon-pulido.jpg`.
- `marca/` — seis archivos, todos derivados del mismo original de 1881 × 836 px que entregó
  el dueño. **No hay `logo.svg`**: el original es un mapa de bits con degradados en cada elipse
  de la senda, y vectorizarlo lo redibujaría. Hay un vectorial fuera del repo, `img/logo.svg`, y
  se ha medido: el veredicto está al final de esta sección.

  | Archivo | Qué lleva | Dónde se pinta |
  |---|---|---|
  | `logo.png` | bloque completo: senda, wordmark y claim | Solo el campo `logo` del JSON-LD (`lib/schema.tsx`). Es el único sitio donde el claim se lee, porque no lo escala ninguna caja de la interfaz |
  | `logo-marca-fila.png` | senda + wordmark **en fila**, color de marca | `Cabecera` |
  | `logo-marca-fila-claro.png` | senda + wordmark **en fila**, variante clara | `MenuMovil` |
  | `logo-texto.png` | wordmark, color de marca | **Sin uso desde el 2026-09-18**, cuando la cabecera pasó al de arriba. Se queda, no se borra: es el único derivado que aísla el wordmark en color de marca, y borrarlo obligaría a rehacerlo desde el original la próxima vez que haga falta |
  | `logo-texto-claro.png` | wordmark, variante clara | **Sin uso desde el 2026-09-18**, cuando el menú de móvil pasó al de la fila. Se queda por lo mismo que su hermano: es el único que aísla el wordmark en variante clara |
  | `logo-marca-claro.png` | senda + wordmark **apilados**, variante clara | `Pie` |

  **Cómo se compone `logo-marca-fila.png`**, que es el único que no es un recorte directo. Del
  original se recortan dos piezas —senda `(411, 21) → (1528, 537)`, o sea 1117 × 516; wordmark
  `(32, 551) → (1850, 709)`, o sea 1818 × 158— y se montan en una fila:

  1. la senda se escala a **1,7 × el alto del wordmark** (269 px) y se alinean **por la base**;
  2. entre las dos van **0,55 × ese alto** de hueco (87 px). Tinta: 2487 × 269.
  3. Debajo se añaden **125 px de relleno transparente**. No es aire decorativo: sin él el
     centroide de tinta cae 62,5 px por debajo del centro de la caja —el tercio de arriba es la
     cola lejana de la senda, casi sin tinta— y el conjunto se lee hundido en la barra. Con el
     relleno, `items-center` centra tinta y no caja. Lienzo final: 2487 × 394.
  4. Se reduce a **1004 × 159** y se cuantiza a 256 colores, como los demás.

  Los tres números que justifican el 1,7: es el que deja la senda claramente legible —77 px de
  ancho en escritorio, cuando `design/01` §2.1 la da por legible a partir de 24-32— sin comerse
  el wordmark, que se queda en el 73 % del ancho del conjunto. Bajar a 1,2 le devuelve al texto
  1,1 px de mayúscula y deja la senda en un icono; subir a 2,0 le quita 1,9.

  **Cómo se compone `logo-marca-fila-claro.png`.** La misma receta, pero **sobre las piezas de la
  variante clara que ya existían**, no sobre el original a color: así no hay que volver a derivar
  la inversión de luminancia de la senda —que no es un umbral, ver más abajo— y el resultado
  coincide con el que ya se ve en el pie. Las dos piezas:

  1. wordmark: `logo-texto-claro.png` entero, 900 × 78;
  2. senda: recorte `(187, 0) → (741, 256)` de `logo-marca-claro.png`, o sea 554 × 256. Su
     proporción, 2,164, es la misma que la del recorte del original (1117 / 516 = 2,165).

  Se montan con los mismos factores —senda a 1,7 × el alto del wordmark (133 px), hueco de
  0,55 (43 px), alineadas por la base, y 125/269 de relleno transparente debajo (62 px)—: lienzo
  de **1231 × 195**, proporción 6,313 contra los 6,312 del de la cabecera. Se reduce a
  **1004 × 159**, las mismas medidas exactas que `logo-marca-fila.png`, para que los dos ocupen
  la misma caja al mismo `height`. Cuantizado a 256 colores por octree, que es el que conserva el
  canal alfa.

  **Pesa 7.538 B**, o sea **1,9 kB MENOS que los 9.487 del `logo-texto-claro.png`** que releva, y
  la mitad que el de la cabecera: la variante clara cuantiza mejor porque la senda invertida tiene
  menos saltos de tono. Y no entra en ninguna carga inicial: `MenuMovil` solo se monta al pulsar la
  hamburguesa. Medida la mayúscula del wordmark en los dos archivos de la fila: **60 px de archivo,
  o sea 14,34 px CSS en la caja de 38** — idénticos, que es justo lo que se buscaba. Los 18,72 px
  del wordmark solo que había antes en el menú se pierden, pero se pierden **a favor de enseñar la
  misma marca que la barra**, y siguen por encima de los 11 px de la mayúscula del texto de 16.

  **Por qué hay variante clara.** El navy del original (`#000D2A`) mide **1,1 : 1** contra
  `--tinta`: sobre el pie o el menú móvil el logotipo no se ve poco, no se ve. La variante clara
  lleva el wordmark a `--fondo` con el azul en `#8FB4D6` —tinte derivado, solo del logotipo,
  anotado en `design/01` §2.1—, y **la senda invierte su luminancia de forma continua**, no por
  umbral: la losa cercana pasa a lo más claro y la lejana se apaga, así que la profundidad se
  conserva leída desde un fondo oscuro. Con un umbral binario cada elipse se parte en manchas.

  **Por qué el claim no se pinta en la interfaz.** `HORMIGÓN IMPRESO | PULIDO | LAVADO` necesita
  que el bloque completo mida **336 px de ancho** para que esa línea llegue a los 10 px que
  `design/01` §2.4 fija como suelo absoluto de la monoespaciada. En la cabecera sale a 3-4 px y
  en el pie a 9,3. Publicarlo borroso sería maquillar un dato ilegible, que es justo lo que este
  repo no hace en ningún otro sitio.

  **Anchos.** Todos los de interfaz van a **3× la mayor caja en que se pintan**: 900 px los tres
  recortes directos (cajas de 276, 230 y 222 px CSS) y **1004 px** los dos de la fila, cuya caja
  mayor son 334,7 px —el claro nunca se pinta por encima de 239,94, porque el menú solo existe por
  debajo de `cabecera-ancha`, pero comparte medidas con el otro a propósito—. `logo.png` conserva
  los 1818 px del original recortado.

  **Pesos.** `logo-marca-fila.png` pesa **13,8 kB** contra los 9,1 del `logo-texto.png` que
  releva: **+4,6 kB**, una sola petición, cacheada, compartida por las 52 rutas. Son bytes de
  imagen, no de JS: el presupuesto de `design/06` no se entera. El salto es la senda, que no
  cuantiza bien —por eso el del pie, con la senda al triple de ancho, pesa 27,0. El claro de la
  fila va al revés: **7,4 kB contra los 9,3 del wordmark claro** que releva, y solo se pide al
  abrir el menú.

  ---

  **`img/logo.svg`: medido el 2026-09-18, y el PNG se queda.** El dueño aportó ese día un
  vectorial que no existía cuando se compuso la fila. Está fuera del control de versiones, igual
  que el resto de `/img/`. La evaluación, en los tres ejes que importaban:

  - **Fidelidad — es donde se cae, y no por poco.** No son «degradados por elipse»: son 97
    trazados dentro de **un solo `<g>` con un único `<linearGradient>` compartido**, 0
    `radialGradient`, 0 `<text>`, 0 `<image>`. Consecuencia medida, tinta media en RGB sobre el
    original compuesto y sobre el SVG rasterizado a 1881 × 836:

    | Zona | Original | SVG |
    |---|---|---|
    | «Pavimentos» | 8,7 · 21,2 · 48,5 | 2,5 · 88,1 · 163,0 |
    | «Albufera» | 7,6 · 80,0 · 164,5 | 2,7 · 80,9 · 156,9 |
    | Losa cercana | 5,7 · 41,6 · 90,6 | 2,5 · 71,8 · 148,7 |
    | Losa lejana | 71,3 · 151,4 · 235,1 | 6,5 · 81,1 · 164,9 |

    O sea: **el wordmark de dos azules se queda en uno solo** —`#000D2A` y `#014BA2` son la
    identidad, `design/01` §2.1— y **la senda pierde la profundidad**, que es lo único que dibuja
    la perspectiva: en el original la losa lejana es mucho más clara que la cercana y en el SVG
    son la misma. En la banda de las losas lejanas el trazado pone **5.146 píxeles de tinta
    oscura donde el original tiene 1.676**: no está calcado, está redibujado. Y el degradado
    introduce **`#00D9FF`**, un cian que no es ninguno de los tres valores que §2.1 autoriza.
  - **Nitidez a 2× — no hay nada que ganar.** `logo-marca-fila.png` son 1004 px para una caja de
    334,7, o sea **3,0×**: a densidad 2 sobran un 50 % de píxeles y a densidad 3 va 1:1. El
    vectorial no recupera resolución que falte, porque no falta.
  - **Peso — aquí el SVG gana, y se dice.** 41.045 B crudos pero **8.788 B en brotli q11**, contra
    los 13.826 del PNG, que ya viene comprimido y no baja. Serían **≈5,0 kB menos** en una
    petición, cacheada, compartida por las 52 rutas. No compensa: son bytes de imagen, no de JS,
    el presupuesto de `design/06` no los cuenta, y lo que se compra con ellos es una marca que ya
    no es la marca.

  Rehacer los 97 rellenos a mano para devolverle los dos azules y la profundidad **es redibujar el
  logotipo**, que es exactamente lo que este archivo lleva prohibiendo desde el principio. El
  vectorial se queda en `/img/`, sin uso, por si algún día llega uno del estudio que hizo la marca.

## Reglas

- **El nombre del archivo nunca aparece en pantalla.** El `alt` es descriptivo y obligatorio:
  describe lo que se ve en la foto, no los datos del proyecto que la origina.
  `scripts/verificar-imagenes.mjs` falla el build si falta.
- **Anchos mínimos, verificados en el build** (`design/05` §C #13):
  **suelo 800 px** y **1600 px si la imagen va a sangre** —hoy los `imagenHero` de
  `content/servicios.tsx`— fallan el build. **Objetivo 1600 px** para toda foto nueva: no falla,
  se informa. Se sube el original; `next/image` genera AVIF y WebP.
  ⚠️ 19 de las 35 publicadas no llegan al objetivo, y son las de obra. Ver `obras/INVENTARIO.md`.
- Sin fotos de stock. Mientras falte el original, la pantalla usa `<BloquePosicion>`.
- ~~El logotipo **no** sustituye al del sitio: la cabecera y el pie lo componen con tipografía~~
  **Caduco desde el 2026-09-01**, cuando la identidad pasó a ser el archivo del dueño: la cabecera
  y el pie pintan **imagen**, no tipografía. `design/01` §2.1 y §4.1.
