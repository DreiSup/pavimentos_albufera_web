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
- `acabados/` — el `slug` del acabado: `espiga-117.jpg`.
- `blog/` — el `slug` del artículo: `guia-hormigon-pulido.jpg`.
- `marca/` — `logo.svg` (uso general) y `logo.png` (campo `logo` del JSON-LD, que no admite SVG
  de forma fiable).

## Reglas

- **El nombre del archivo nunca aparece en pantalla.** El `alt` es descriptivo y obligatorio.
- Originales a 2400 px de ancho mínimo. Se sube el original; `next/image` genera AVIF y WebP.
- Sin fotos de stock. Mientras falte el original, la pantalla usa `<BloquePosicion>`.
- El logotipo **no** sustituye al del sitio: la cabecera y el pie lo componen con tipografía
  (`design/01-sistema-de-diseno.md §logo`).
