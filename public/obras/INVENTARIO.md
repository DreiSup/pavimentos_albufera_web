# Inventario de fotografía de obra

Origen: la mediateca de WordPress de la web viva (`/wp-json/wp/v2/media`), descargada el
2026-08-27. Se bajó siempre el **original** de `/wp-content/uploads/`, nunca la copia
redimensionada del CDN de ShortPixel.

De las **164** imágenes de la mediateca quedan **125** aquí. Se descartaron:

| Motivo | Nº |
|---|---|
| Plantilla y marca del tema de WordPress (logos, favicons, `pexels-*`, `client-logo-*`, fondos, SVG) | 22 |
| Duplicados byte a byte, subidos dos veces | 8 |
| Variantes SEO por provincia a 461×461 px | 6 |
| Menos de 700 px de ancho | 3 |

## Organización

- **Raíz** — fotos atribuidas a un proyecto de `content/proyectos.json`, renombradas según
  `public/README.md` (`municipio-servicio-modelo-color-año.jpg`). Están enlazadas desde el campo
  `imagenes[]` de su proyecto.
- **`_sin-atribuir/`** — el resto, con el nombre original intacto. Hay obra buena aquí; lo que no
  hay es certeza de a qué proyecto pertenece. **No se renombran hasta que alguien las mire.**

## 🔴 Lo que hay que saber antes de usarlas

**Ninguna cumple el mínimo de 2400 px que fija `design/05` §A1 como bloqueante de publicación.**
De las 164 originales solo una lo supera, y es un fondo de plantilla. El reparto real por ancho:

| Ancho | Nº |
|---|---|
| ≥ 2400 px | 1 (fondo de plantilla, no es obra) |
| 1600 – 2400 px | 43 |
| 1200 – 1600 px | 40 |
| < 1200 px | 77 |

O se revisa ese umbral, o se ejecuta la alternativa que el propio `design/05` §D ya prevé: sesión
fotográfica nueva en 2-3 obras recientes.

**`xabia-pulido` no tiene ninguna foto.** Se buscó «xabia», «xàbia», «javea» y «jábea» en nombre,
`title` y `alt` de las 164: cero coincidencias. El proyecto está publicado en el sitemap igualmente.

**Los `alt` de la raíz están compuestos con los datos del propio proyecto** —servicio, modelo,
color y municipio, ya confirmados en `proyectos.json`— y **no describen lo que sale en la foto,
porque nadie las ha abierto todavía**. Igual que `tipo: "final"`, que es el supuesto por defecto:
alguna puede ser de proceso o de detalle. Las dos cosas hay que repasarlas a ojo.

## Material que abre trabajo

**Siete obras identificables que no son ninguno de los 9 proyectos**, con municipio, modelo y color
en los metadatos de WordPress: Turís (sillería grande 109), Vedat de Torrent (6 fotos), Ollería
(manta gris, 2048 px), Moraira (sillería grande 113), Catadau (piedra rodena 107), Alfafar (piedra
inglesa 117) y Carlet (piedra sillería gris).

⚠️ **Seis de esos municipios están en `_sinDocumentar` de `content/zonas.json`**, cuya regla es *no
generar ruta hasta que tengan al menos un proyecto con foto*. Ahora la tienen. Pero el municipio, el
modelo y el año salen del `alt` de WordPress, no del dueño: **hay que confirmárselos antes de
convertirlos en proyectos**.

**Siete archivos de 2025-09-26 sin metadatos** (`WhatsApp-Image-2025-09-26-at-*`), los más nuevos de
la mediateca. Uno se titula «pista de padel». No son atribuibles por metadatos y hay que abrirlos a
ojo: son el único material que podría cubrir `xabia-pulido`.

El manifiesto completo, con dimensiones, `alt` y `title` originales de las 164, está en
`fotos-origen/manifiesto.json` — fuera de git, en la máquina de trabajo.
