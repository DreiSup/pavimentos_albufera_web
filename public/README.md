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
- `marca/` — cinco archivos, todos recortados del mismo original de 1881 × 836 px que entregó
  el dueño. **No hay `logo.svg`**: el original es un mapa de bits con degradados en cada elipse
  de la senda, y vectorizarlo lo redibujaría.

  | Archivo | Qué lleva | Dónde se pinta |
  |---|---|---|
  | `logo.png` | bloque completo: senda, wordmark y claim | Solo el campo `logo` del JSON-LD (`lib/schema.tsx`). Es el único sitio donde el claim se lee, porque no lo escala ninguna caja de la interfaz |
  | `logo-marca-fila.png` | senda + wordmark **en fila**, color de marca | `Cabecera` |
  | `logo-texto.png` | wordmark, color de marca | **Sin uso desde el 2026-09-18**, cuando la cabecera pasó al de arriba. Se queda, no se borra: es el único derivado que aísla el wordmark en color de marca, y borrarlo obligaría a rehacerlo desde el original la próxima vez que haga falta |
  | `logo-texto-claro.png` | wordmark, variante clara | `MenuMovil` |
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
  recortes directos (cajas de 276, 230 y 222 px CSS) y **1004 px** el de la cabecera, cuya caja
  mayor son 334,7 px. `logo.png` conserva los 1818 px del original recortado.

  **Pesos.** `logo-marca-fila.png` pesa **13,8 kB** contra los 9,1 del `logo-texto.png` que
  releva: **+4,6 kB**, una sola petición, cacheada, compartida por las 52 rutas. Son bytes de
  imagen, no de JS: el presupuesto de `design/06` no se entera. El salto es la senda, que no
  cuantiza bien —por eso el del pie, con la senda al triple de ancho, pesa 27,0.

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
