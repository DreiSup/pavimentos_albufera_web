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
- `marca/` — `logo.svg` (uso general) y `logo.png` (campo `logo` del JSON-LD, que no admite SVG
  de forma fiable).

## Reglas

- **El nombre del archivo nunca aparece en pantalla.** El `alt` es descriptivo y obligatorio:
  describe lo que se ve en la foto, no los datos del proyecto que la origina.
  `scripts/verificar-imagenes.mjs` falla el build si falta.
- Originales a 2400 px de ancho mínimo. Se sube el original; `next/image` genera AVIF y WebP.
  ⚠️ Ninguna de las 125 fotos heredadas de la web viva lo cumple. Ver `obras/INVENTARIO.md`.
- Sin fotos de stock. Mientras falte el original, la pantalla usa `<BloquePosicion>`.
- El logotipo **no** sustituye al del sitio: la cabecera y el pie lo componen con tipografía
  (`design/01-sistema-de-diseno.md §logo`).
