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

## 2026-08-28 — abiertas y revisadas a ojo, las 125

Se generaron hojas de contacto de las 125 y se miraron una a una. Lo que ya no es una
suposición:

- **Los 14 `alt` de la raíz están reescritos** describiendo lo que sale en la foto, no los
  datos del proyecto. Su `tipo: "final"` queda confirmado: ninguna es de proceso ni de detalle.
- **No hay ni una sola foto de ANTES** en las 125. El hueco `ANTES` de la galería de proyecto
  se queda en bloque de posición: reetiquetar una foto de proceso como ANTES sería un dato falso.
- 🔴 **`impreso-manta-gris`: las fotos no encajan con el modelo.** Una tiene despiece
  rectangular y la otra es hormigón continuo sin estampar. Ninguna enseña la textura de roca de
  montaña que anuncia el nombre. Está anotado en `content/proyectos.json`; hay que contrastarlo
  con el dueño antes de darlo por bueno.

### 🔴 No usar — 15 archivos, y siguen aquí a propósito

No se borran: eso descuadraría los recuentos de arriba y son material del cliente. Simplemente
no se referencian desde `content/`.

| Archivos | Motivo |
|---|---|
| `career-firefighter-relaxing-job-162540.jpeg`, `construction-site-build-construction-work-159306.jpeg`, `construction_worker_concrete_hummer_vibrator_job_site_labor_task-755423.jpg`, `image-1.png`, `614ffdfdd52fa96bacb7edf2ccaf-1452223.jpg`, `testimonial.png` | **Stock.** Bombero, obra genérica, operario con vibrador, dos hombres con casco señalando planos, bodegón de maquillaje y mapamundi de plantilla. `design/03` y la regla de proyecto prohíben stock, y de personas explícitamente |
| Los 7 `WhatsApp-Image-2025-09-26-at-*` | 🔴 **Son pistas de pádel y pickleball, no pavimentos.** Uno se titula «pista de padel» en la mediateca; al abrirlos, los siete lo son. Es el negocio de **Padel Albufera**, no el de Pavimentos, y son además las fotos más nuevas de la biblioteca. Ver `padel-albufera/` en el vault: mezclar los dos negocios ya ha producido un error real |
| `image.jpg` | Bodegón de palas y pelotas de pádel/pickleball. Mismo caso |
| `pavimentos-de-hormigon-impreso.jpg` | Es un **collage** de dos fotos (piscina + pista de pádel) montado como banner de cabecera, no una fotografía |

Con esto, el material realmente utilizable de la mediateca son **110 fotos**, no 125.

### En uso hoy — 35 referencias desde `content/`

Las de `_sin-atribuir/` se citan **con su nombre original**, sin renombrar ni mover: se ha visto
qué enseñan, pero no de qué obra son, y el nombre de la raíz (`municipio-servicio-modelo-color-año`)
afirmaría un municipio y un año que nadie ha confirmado. El nombre de archivo no aparece nunca
en pantalla, así que no cuesta nada dejarlas donde están.

`scripts/verificar-imagenes.mjs` falla el build si alguna de esas 35 rutas deja de existir o se
queda sin `alt`. `next build` no lo detecta: un `src` de `next/image` mal escrito compila limpio.

**El modelo de las cuatro fotos sin proyecto que sí se usan** —sillería grande, piedra sillería,
piedra rodena y la de microcemento— sale del `title` de la mediateca de WordPress, no del dueño.
Sostiene la afirmación que hace la pantalla (solo el modelo), no más: por eso ninguna de ellas
entra como muestra de un acabado, que sí lleva el código de color impreso al lado.

⚠️ **Y siguen sin cumplir los 2400 px.** Que ahora se vean no cambia el reparto de resoluciones
de más arriba: la web se publica con fotos por debajo del umbral que `design/05` §A1 llama
bloqueante. O se revisa el umbral o hay sesión nueva. Es decisión, no código.

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
