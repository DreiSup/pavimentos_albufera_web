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
archivo de Next 15 y van en `app/` (`icon.svg`, `apple-icon.png`, `opengraph-image.png`).

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
- `marca/` — cuatro archivos, todos recortados del mismo original de 1881 × 836 px que entregó
  el dueño. **No hay `logo.svg`**: el original es un mapa de bits con degradados en cada elipse
  de la senda, y vectorizarlo lo redibujaría.

  | Archivo | Qué lleva | Dónde se pinta |
  |---|---|---|
  | `logo.png` | bloque completo: senda, wordmark y claim | Solo el campo `logo` del JSON-LD (`lib/schema.tsx`). Es el único sitio donde el claim se lee, porque no lo escala ninguna caja de la interfaz |
  | `logo-texto.png` | wordmark, color de marca | `Cabecera` |
  | `logo-texto-claro.png` | wordmark, variante clara | `MenuMovil` |
  | `logo-marca-claro.png` | senda + wordmark, variante clara | `Pie` |

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

  **Anchos.** Los tres de interfaz son de **900 px**, que es 3× la mayor caja en que se pintan
  (276, 230 y 222 px CSS). `logo.png` conserva los 1818 px del original recortado.

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
- El logotipo **no** sustituye al del sitio: la cabecera y el pie lo componen con tipografía
  (`design/01-sistema-de-diseno.md §logo`).
