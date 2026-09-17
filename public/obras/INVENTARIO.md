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

✅ **El umbral se revisó el 2026-08-29 y ya no es bloqueante de publicación.** `design/05` §C #13
sustituye los 2400 px por tres umbrales —suelo 800, a sangre 1600, objetivo 1600— y
`scripts/verificar-imagenes.mjs` los comprueba **midiendo el archivo**, no leyendo el nombre.

**Ninguna de las 164 llega a los 2400 px de antes.** Solo una lo supera, y es un fondo de plantilla.
El reparto de las 164 originales:

| Ancho | Nº |
|---|---|
| ≥ 2400 px | 1 (fondo de plantilla, no es obra) |
| 1600 – 2400 px | 43 |
| 1200 – 1600 px | 40 |
| < 1200 px | 77 |

⚠️ **Ese reparto engaña, porque no es el de las que se publican.** De las **125 copiadas a `public/`**,
38 llegan a 1600 px y **ninguna a 2400**; de las **35 que la web cita de verdad**, 16 llegan a 1600 y
19 no. Medido con el mismo lector de cabeceras que usa el build.

🔴 **Y el dato que importa no es cuántas, sino cuáles.** Las 19 que no llegan son **las de obra
documentada**, que son precisamente las que van a sangre:

| Foto de proyecto | Ancho |
|---|---|
| `denia-impreso-piedra-inglesa-gris.jpg` | 2048 |
| `moncada-impreso-espiga-117-2025{,-2,-3}.jpg` · `alzira-…-107-2.jpg` · `impreso-manta-gris-2.jpg` | 1200 |
| `ribarroja-pulido-gris.jpg` | 960 |
| `moraira-…-2025.jpg` · `godella-lavado-gris{,-2}.jpg` · `alzira-…-107.jpg` · `corbera-…-2.jpg` · `impreso-manta-gris.jpg` | 900 |
| `corbera-fratasado-arena.jpg` | 898 |

`app/proyectos/[slug]/page.tsx:61` las sirve a `sizes="100vw"` en 21/9. **Las de 1600 px o más son
casi todas de `_sin-atribuir/`**, o sea que la foto que mejor se ve es la que menos se puede afirmar,
y la que sí se puede fechar y situar es la que peor se ve.

**Eso es lo que justifica la sesión fotográfica nueva que `design/05` §D prevé**, y le da objetivo
concreto: las 8 obras documentadas, a 1600 px o más. No es «faltan fotos» — es que sobran fotos
anónimas y faltan las de las obras que sí se pueden nombrar.

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

✅ **Y ya no chocan contra un umbral inalcanzable:** el de 2400 px se retiró el 2026-08-29
(`design/05` §C #13). Siguen por debajo del **objetivo** de 1600 px, que el build informa sin fallar;
lo que no pueden es bajar del suelo de 800 ni ir a sangre por debajo de 1600, y eso sí falla.

## 2026-09-17 — se buscó muestra para los seis acabados sin foto: ninguna

Encargo del dueño: si una foto del repositorio hace match con la descripción de un acabado, se
aplica; si no hay match, el acabado se oculta del muestrario. Se revisaron las **96 usables** de
`_sin-atribuir/` —descontando las 15 del apartado anterior— más las 14 de la raíz.

**El criterio, y por qué es este.** Una muestra se pinta con el código de color impreso al lado
(`Adoquín irregular · GRIS`), así que afirma **modelo y color**. El modelo se puede reconocer a
ojo comparando con una foto de referencia; **el color no**: `109` es un pigmento de catálogo, y
en la mediateca `109` (Turís) sale gris claro, `113` (Moraira) dorado y `117` (Alfafar) beige
grisáceo. Un código de pigmento solo lo sostiene el dato de origen, nunca el parecido. Lo mismo
que ya decía el apartado anterior sobre las cuatro fotos que se usan como hero de modelo.

Lo que hay para cada uno de los seis, con el `title` de la mediateca citado literal:

| Acabado | Lo más cercano que hay | Por qué no es match |
|---|---|---|
| `espiga-113` | «hormigón impreso en modelo espiga moncada valencia 2025» | Es el modelo, pero esa obra es la 117, que ya tiene muestra. Ninguna foto dice espiga + 113 |
| `adoquin-irregular-gris` | «hormigón impreso adoquín irregular alzira 2025» (color 107) y varias de impreso gris sin modelo declarado | Las grises no declaran modelo, y abiertas a tamaño completo su despiece **no se distingue del adoquín pequeño**: el mismo archivo valdría para `adoquin-pequeno-109`. Si dudas, no es match |
| `adoquin-pequeno-109` | «hormigón impreso en adoquín pequenio y color arena Moraira 2025» | Es arena, y arena ya tiene su muestra |
| `piedra-silleria-109` | «Trabajo realizado en Carlet en color gris y modelo piedra sillería» | Mismo modelo, **otro color**: gris, no 109 |
| `piedra-rodena-117` | «Trabajo realizado en catadau en color 107 y modelo piedra rodena» | Mismo modelo, **otro color**: 107, no 117 |
| `piedra-inglesa-crema` | «Trabajo realizado en Alfafar en color 117 y modelo piedra engleza» | Mismo modelo, **otro color**: 117, no crema |

Las de Carlet, Catadau y Alfafar sí sostienen el **modelo**, y por eso ya son el hero de
`/acabados/piedra-silleria/`, `/piedra-rodena/` y `/piedra-inglesa/` en `content/modelos.ts`.
Esa pantalla afirma solo el modelo; la muestra afirma también el color, y ahí se paran.

**Material que cerraría cuatro de los seis, y es una pregunta al dueño, no una foto que falte:**
confirmar el color de las obras de Carlet, Catadau, Alfafar y Turís convertiría tres de estas
fotos en muestra —de `piedra-silleria-gris`, `piedra-rodena-107` y `piedra-inglesa-117`, que hoy
no existen como acabado— en vez de las variantes de color que el catálogo enumera.

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
