# 02 · Pantallas

Dos anchos normativos: **390 px** (móvil) y **1440 px** (escritorio). No son la misma pantalla
reflowed; donde hay decisiones distintas están marcadas. Entre ambos, el diseño es fluido: los
componentes mantienen sus métricas y las rejillas reducen columnas (4 → 2 → 1).

Todas las páginas comparten cabecera (`01 §4.1`), pie (`§4.4`) y, en móvil, barra fija
inferior (`§4.3`).

---

# A. Pantallas maquetadas

Estas seis están en el prototipo con estado interactivo real. Reprodúcelas exactamente.

## A1 · Home — `/`

**11 secciones numeradas. Enmienda del 2026-09-17, por decisión del dueño.** Eran 13. Copy
literal del §7.1 del documento maestro.

| # | Sección | Escritorio | Móvil |
|---|---|---|---|
| 01 | Hero | `1fr 1fr`. Titular 88 px a la izquierda, **carrusel** a sangre a la derecha con etiqueta técnica abajo. Alto mínimo del bloque: 660 px. Sin velo: el titular no pisa la foto | **Carrusel** `3/4` con el titular a 46 px **dentro, sobre el velo** (`01 §2.8`), y la etiqueta técnica abajo a la derecha. Debajo, entradilla y 2 botones a ancho completo |
| 02 | Barra de confianza | Anclada, una línea, 4 datos | No anclada, 4 filas numeradas |
| 03 | Por dónde empezar | `380px 1fr` + rejilla de 3×2 con imagen `4/3` | Rejilla de **2 columnas** con imagen `4/3` a ancho de celda y el texto debajo |
| 04 | Servicios | Fondo `--fondo-alt`. Rejilla de 3×2, imagen `16/10`, título 26 px | Columna, imagen `16/10`, título 20 px |
| 05 | Muestrario | Antetítulo + enlace-etiqueta a la derecha. Chips en una fila. Rejilla de 4 | Chips en carril deslizante. Rejilla de 2×2 con 4 muestras. Enlace-etiqueta al final |
| 06 | Cómo trabajamos | Fondo `--fondo-alt`. 4 columnas, numeral 34 px en `--acero` sobre `border-top` | 4 filas, numeral 26 px en columna fija de 42 px |
| 07 | Proyectos | Rejilla de 3×3, **las 9 obras documentadas** | Carrusel horizontal de tarjetas de 220 px, las 9 |
| 08 | Garantía | Fondo `--tinta`, `1fr 1fr`: titular a la izquierda, 2 párrafos a la derecha separados por `border-top` | Apilado, mismo fondo |
| 09 | Zonas | `380px 1fr` + 3 anillos en columnas. El tercero cierra con un enlace-etiqueta `CONSÚLTANOS →` a `/presupuesto/` | 3 anillos en filas con `border-top` |
| 10 | FAQ | `380px 1fr` + acordeón de 5 | Acordeón de 5, filas de 56 px |
| 11 | Cierre | `1fr 1fr`: titular 64 px + 2 botones a la izquierda, formulario corto a la derecha | Titular 34 px, 2 botones, formulario corto |

**El fondo alterno lo da la posición, no la sección.** Al retirar Precios e intercambiar
Servicios y Muestrario quedaban tres bloques base seguidos, así que el alterno se reparte otra
vez para que el ritmo de `01 §2.1` siga siendo el de antes.

**Ocre en escritorio:** CTA del hero + chip activo del muestrario.
**Ocre en móvil:** barra fija `Llamar` + chip activo del muestrario **+ el CTA del hero**, que
por decisión del dueño del 2026-09-17 se queda en ocre y **no baja a contorno**. La excepción y
su porqué están en `01 §2.2`. El CTA del cierre sí sigue la regla.

### Lo que se retiró de esta pantalla el 2026-09-17

Las dos por decisión del dueño, y **retiradas del árbol, no ocultas con `display:none`**: lo que
no se pinta tampoco se descarga ni se indexa.

- **Precios** (era la 06). Los rangos de €/m² y la tabla salen de la portada; el dueño no quiere
  precios en la web. Con ella se fue el único enlace a `/precios/` que quedaba dentro del
  `<main>` de la home. ⚠️ **La cabecera sigue enlazando `/precios/`** — `components/layout/
  Cabecera.tsx`, fuera del alcance de esta pantalla.
- **Reseñas** (era la 09). Pintaba tres tarjetas con `[texto de la reseña]` y `[NOMBRE] ·
  [MUNICIPIO] · [AÑO]`: estado vacío honesto, pero vacío. El dueño traerá reseñas reales.
  **No se pierde copy:** el dato del 30 % que repite, que era lo único real de la sección,
  ya estaba literal en Garantía. Sigue **prohibido inventar testimonios** y sigue sin
  `AggregateRating` mientras no haya reseñas verificables.

Formulario corto del cierre: nombre, teléfono, email y desplegable de espacio. El formulario
completo vive en `/presupuesto/`.

El **email es opcional en las dos variantes**, igual que en la tabla de §B1. Entra en la corta
porque el dueño pide nombre, teléfono y correo en todo formulario de contacto, y opcional
porque un campo obligatorio de más en el cierre de la home cuesta conversión. **Que pase a
obligatorio sigue siendo decisión del dueño** —`design/06`, decisión 7—, y hasta que la conteste
Enhanced Conversions solo puede contar con los leads que lo dejen por su cuenta.

## A2 · Servicio — `/hormigon-impreso/`

**Plantilla de los 6 servicios.** 8 secciones. Copy de las 4 primeras del §7.2; las restantes
reutilizan literal el §7.1 filtrado a este servicio. Cero texto nuevo.

| # | Sección | Notas |
|---|---|---|
| — | Migas | `INICIO / SERVICIOS / HORMIGÓN IMPRESO` |
| — | Hero | `1fr 560px`. H1 a 64 px, entradilla, CTA ocre + contorno. Bloque de foto `4/3` con ficha |
| — | Submenú | Anclado a 80 px, **6 anclas como máximo**. Solo escritorio |
| 01 | Aplicaciones | `380px 1fr`. Filas `300px 1fr`: nombre de aplicación en Archivo 26 px y matiz a la derecha |
| 02 | Muestrario del servicio | Rejilla de 4 con los acabados de esta técnica, filtrados del inventario |
| 03 | Ficha técnica | `380px 1fr` + tabla (`01 §3.8`, tercera variante). **Las 8 filas eran el máximo, no la cifra: hoy van de 7 a 2, ver abajo** |
| 04 | Cuándo NO elegir impreso | **Fondo `--tinta` a página completa.** `1fr 1fr`. 2 botones de contorno claro a los otros servicios |
| 05 | Cómo trabajamos | 4 columnas, idéntico a la home |
| 06 | Obra ejecutada | 3 tarjetas de proyecto de esta técnica |
| 07 | FAQ | Acordeón de 4 en `/hormigon-impreso/`, de 5 en `/microcemento/` y de 3 en el resto. Específicas del servicio |
| 08 | Cierre | `1fr 1fr` con formulario de 3 campos |

⛔ **La FAQ de esta plantilla pierde una pregunta el 2026-09-18, y la cifra de la fila 07
baja.** El dueño contesta expresamente que se retire «¿Qué pasa si el presupuesto que tengo es
de 18 €/m²?»: es el último precio que quedaba en el sitio y viajaba además dentro del JSON-LD de
`FAQPage`. El catálogo de `content/faq.ts` se queda en **5 preguntas**, así que las cifras de
esta tabla y la de la fila 10 de §A1 **no se pueden volver a cumplir sin copy nuevo**, que según
`design/05` §B7 lo escribe el cliente. Se bajan a lo que hay en vez de rellenar el acordeón con
una pregunta inventada. Cuentas exactas: home 6 → 5, `/hormigon-impreso/` 5 → 4, y las cuatro
que comparten `FAQ_SOLERA` 4 → 3 —**esas ya iban con 4 contra un 5 especificado antes de este
cambio**—. `/zonas/[municipio]/` sigue con 3, que es lo suyo.

✅ **Enmienda del mismo 2026-09-18, más tarde: `/microcemento/` ya tiene FAQ, y son 5.** El
párrafo de arriba decía que seguía sin ella. El dueño autoriza expresamente copy nuevo para ese
material —«escribe información verdadera sobre microcemento, si hace falta busca en otras
webs»—, y con eso se escriben cinco preguntas suyas: soporte, espesor, juntas, humedad y
limpieza. **La autorización es del material, no del negocio**: se puede afirmar a qué espesor va
el microcemento, con fuente de fabricante citada en el commit, y no cuántas manos da esta
empresa, en cuántos días ni con qué garantía. Cuentas de hoy: portada 5, `/hormigon-impreso/` 4,
`/microcemento/` 5, las cuatro de `FAQ_SOLERA` 3 y `/zonas/[municipio]/` 3.

🔴 **Y el hueco de la portada no se cierra con esto, a propósito.** Las cinco nuevas son de
microcemento y no pueden entrar ni en `faqHome` ni en `FAQ_SOLERA` sin afirmar de otro material
algo que no es cierto. La portada se queda en 5 contra las 6 de §A1 fila 10. Escribir una sexta
pregunta genérica para cuadrar la tabla sería copy inventado, que es lo único que el dueño **no**
ha autorizado.

⛔ **La sección de Precio, que era la 05, se retira el 2026-09-18.** Misma decisión del dueño
que retiró `/precios/` el día antes —no quiere precios en la web—, extendida ahora a la
calculadora, que era todo lo que esa sección contenía. Detalle en §A5. Las secciones ya eran
condicionales y se renumeran solas: el numerado, el submenú y el cuerpo siguen contando lo
mismo, medido a 390, 768, 1024 y 1366 px en las seis páginas y en las cuatro landings, sin un
número saltado, sin un ancla huérfana y sin scroll horizontal. La numeración de esta tabla **no
es fija**: un servicio sin `aplicaciones` o sin `cuandoNo` empieza y sigue con otros números.

✅ **Enmienda del mismo 2026-09-18: ya no hay ninguna página de servicio corta.** Esa última
frase decía que `/hormigon-fratasado/` y `/hormigon-desactivado/` llevaban cuatro secciones desde
que existen. Con la misma autorización de copy que le dio FAQ a `/microcemento/`, las dos reciben
`aplicaciones` y `Cuándo NO`, y `/hormigon-lavado/` —que ya tenía `aplicaciones`— recibe su
`Cuándo NO`. **Las seis páginas de servicio montan hoy las seis secciones**, que es también el
tope de anclas del submenú, con el numerado corrido de 01 a 06 y sin ancla huérfana, medido a
390, 768 y 1366 px.

**Filas de la ficha técnica, servicio a servicio, después de retirar las que no tenían dato**
(fila 03 de la tabla de arriba): impreso 7 · pulido 5 · lavado 5 · fratasado 4 · desactivado 4 ·
**microcemento 2**. La de microcemento es el suelo del que no se puede bajar: con una sola fila
la sección no es una ficha, y con cero `PaginaServicio` pintaría el título sobre una tabla vacía.

⚠️ **Lo que sí quedó: el fondo alterno. Enmienda del 2026-09-18, medida.** Este párrafo decía
«no quedó hueco que recomponer», y lo decía midiendo solo `/hormigon-impreso/`, donde la ficha
técnica y el `Cuándo NO` separan las dos bandas alternas de la plantilla. `Precio` iba en fondo
base **justo entre ellas**, y hay una página donde no queda nada en medio: `/lp/hormigon-lavado/`
es la única que esconde la ficha técnica por `ocultarSecciones` y además no tiene `Cuándo NO`.
Muestrario y `Cómo trabajamos` quedaban pegadas: **1029 px seguidos de `#DADCD6` sin costura a
390 px** (410 + 619), y 482 + 573 a 768.

⚠️ **Ese caso concreto deja de existir ese mismo día: `/hormigon-lavado/` ya tiene `Cuándo NO`,
así que su landing también.** La banda `--tinta` vuelve a separar las dos alternas y no queda
ninguna página con dos alternas seguidas. **La regla de abajo no se toca por eso**: es la que
reparte el alterno por posición, y sigue siendo la que evita que la próxima sección que se caiga
o se oculte repita el problema. Lo que caduca es el ejemplo, no el remedio.

El remedio es el de §A1, del día anterior y por la misma causa: **el fondo alterno lo da la
posición, no la sección**, y cuando se cae una banda el alterno se reparte otra vez. La regla es
local —ninguna banda comparte fondo con la que tiene encima— y se recorre de abajo arriba:
**cede el alterno la banda de arriba**, porque hacia abajo el reparto arrastraría a `Obra
ejecutada`, cuyas tarjetas van en `--fondo-alt` (`01` §3.12), y al cierre. `Cuándo NO` va en
`--tinta` y separa por sí misma, así que nunca colisiona: `alterna · tinta · alterna` es
correcto y no se mueve.

**Siete de las diez páginas salen idénticas.** Cambian tres:

| Página | Qué cambia |
|---|---|
| `/lp/hormigon-lavado/` | Aplicaciones toma la alterna y Muestrario la base |
| `/microcemento/` y `/lp/microcemento/` | `Cómo trabajamos` toma la base y `Obra ejecutada` la alterna |

⚠️ **El par de microcemento no lo abrió la calculadora.** Son las dos únicas sin FAQ
—`/microcemento/` no lleva porque ninguna pregunta del catálogo le aplica sin reescribirla—, así
que `Obra ejecutada` y el cierre ya eran dos bandas base pegadas antes del 2026-09-18. Sale
gratis de la misma regla y se arregla con ella.

Dos hijos invierten ahora su fondo con su banda, que es lo que `01` §3.12 ya hacía con la
tarjeta de proyecto: el filete que separa las filas de Aplicaciones por debajo de `xl` y las
propias tarjetas de obra. Sin eso, en `/lp/hormigon-lavado/` desaparecían los tres filetes.

La sección 04 es la que más vende de toda la web y **ninguna competencia la tiene**: decirle al
cliente cuándo no contratar este servicio. Va en negro a página completa por eso.

En móvil no hay submenú: solo la barra de contacto. La ficha técnica se apila en pares.

**Las pistas fijas de esta plantilla empiezan en 1280 px. Enmienda del 2026-09-17, medida.**
`1fr 560px` con el H1 a 64 px necesita **1278 px de ancho de contenido**: la columna izquierda
no puede bajar de la palabra más larga del H1 —558 px en `/microcemento/`, 472 en
`/hormigon-desactivado/`, 374 en las otras cuatro— y hay que sumarle 64 de hueco, 560 de foto y
96 de gutter. Encendido en 768 px el `1fr` no podía encoger por debajo de esa palabra y empujaba
la página: **100 px de scroll horizontal del documento a 960 px en cuatro de las seis páginas,
198 en desactivado y 285 en microcemento**. Lo mismo, por lo mismo, en las otras pistas
fijas de la plantilla:

| Pista | Dónde | Ancho de contenido que pide |
|---|---|---|
| `1fr 560px`, H1 64 px | Hero | 1278 px |
| `1fr 340px` | Ficha técnica dentro del `380px 1fr` de su sección | 986 px |
| `300px 1fr` | Filas de Aplicaciones, dentro del mismo `380px 1fr` | 980 px |
| 6 anclas que no parten | Submenú (`01 §4.6`) | 1135 px |

Por debajo de 1280 px cada una usa **su propio tratamiento apilado, el de móvil**, que ya estaba
descrito: el hero se reparte en dos mitades con el H1 a 46 px, la ficha técnica se apila «en
pares» como dice el párrafo de arriba, las aplicaciones apilan nombre y matiz y **el submenú no
se pinta**, que es lo que ya dice «Solo escritorio» dos párrafos más arriba.

⚠️ **Dos filas de esa tabla cambian el 2026-09-18 y el punto de ruptura NO se mueve.** La de la
calculadora (`1fr 1fr` con chips de uso, ~960 px) desaparece con el componente. Y el submenú
pasa de 7 anclas a 6 —se va `Precio`—, así que su carril de anclas mide **1039 px medidos a
1366 px en `/hormigon-impreso/`, `/hormigon-pulido/` y `/microcemento/`**, que con los 96 px de
gutter piden 1135 px de ventana en vez de 1259. **Los 1280 px se quedan donde están**: quien
fija ese umbral es el hero, que sigue pidiendo 1278 px de contenido y no ha cambiado. Bajar el
`xl` de la plantilla porque ahora quepa el submenú devolvería los 100–285 px de scroll
horizontal que esta enmienda quitó.

⚠️ Estos 1280 px **ya no coinciden** con la cabecera: desde el 2026-09-17 la de escritorio y la
barra de contacto de móvil se mueven en `cabecera-ancha` = 1180 px (`01 §4.1` y §4.3), porque
esa fila cabe ahí y estas pistas no —la del hero pide 1278 px de contenido y la del submenú
1259—. Entre 1180 y 1279 se ve, a propósito, **nav de escritorio con la plantilla apilada**: son
dos medidas distintas de dos cosas distintas, y forzar una a la otra rompe la que no cabe.

⚠️ **Y una regla que esto rompe, sin arreglar en esta pasada.** Con la barra de contacto visible
hasta 1279, entre 768 y 1279 hay **dos ocres de acción** en las seis páginas de servicio: el
`Llamar` de la barra y el `Pedir presupuesto` del hero. Es la regla del ocre de `01 §2.2`, y el
remedio ya está escrito en §A1 —«los CTA del hero y del cierre bajan a contorno» en móvil—, pero
`Boton` no sabe cambiar de variante por punto de ruptura: hay que duplicar el par por
breakpoint, como hace `app/presupuesto/page.tsx`. **Ya pasaba por debajo de 768**; lo que cambia
es que ahora pasa en 512 px más de ancho.

## A3 · Muestrario — `/acabados/`

El elemento firma. 16 acabados en el catálogo; **desde el 2026-09-17 se publican los 10 que
tienen muestra fotográfica**, 7 de ellos con obra documentada.

- **Solo se pinta el acabado que tiene foto.** Enmienda del 2026-09-17, por encargo del dueño.
  Los seis sin muestra salían con el bloque de posición (`01 §3.12`), y seis huecos rayados
  entre diez fotos son, en la rejilla de dos de móvil, media pantalla de nada. Se buscó original
  para los seis en la mediateca y **ninguno hizo match**: la muestra lleva el código de color
  impreso al lado, así que exige una foto que enseñe ese modelo **en ese color**, y eso solo lo
  sostiene el dato, no el parecido. Queda anotado en `public/obras/INVENTARIO.md`.
  Es un filtro de presentación, **no un borrado**: las seis entradas siguen en
  `content/acabados.json` y `/acabados/[modelo]/` sigue generando sus rutas —`piedra-silleria` y
  `piedra-rodena` cuelgan solo de ellas—. El día que llegue la foto, vuelven solas.
- **Y la regla no es de esta pantalla: es del catálogo.** Enmienda del 2026-09-18. Se aplicó
  primero solo aquí, y los seis huecos siguieron saliendo en otras nueve rutas. **Reparto medido
  sobre el HTML prerenderizado, 19 bloques:** 6 en `/hormigon-impreso/` —6 de sus 12 tarjetas—,
  6 en `/lp/hormigon-impreso/`, 1 en cada una de las 6 fichas de modelo y 1 en `/zonas/denia/`.
  Una sola página de servicio y una sola landing, **no las seis y las cuatro**: los seis acabados
  sin muestra son todos de impreso, así que ninguna otra técnica los pedía. Ahora el origen es
  `acabadosPublicados` en `lib/datos.ts`, y de él salen `acabadosPorServicio`, `acabadosPorModelo`,
  `acabadosPorProyectos` y `tecnicasEnUso`: **ninguna pantalla vuelve a decidir esto**. Para contar
  lo publicado hay `recuentoAcabadosPublicados()`, que devuelve 10 y 7 —no 16 y 8—.
- **Hero:** `1fr 420px`, H1 64 px, contador `10 ACABADOS · 7 CON OBRA DOCUMENTADA` en el
  antetítulo. **El contador es real, no decorativo**: cuenta lo que se pinta, con la regla de
  `03-modelo-de-contenido.md §1.1` —documentada = proyecto con municipio confirmado—. No vale
  `proyectos.length > 0`: eso daría 9 y contradiría al diseño.
- **Barra de filtros anclada** a `top: 80px`, con `border-top` y `border-bottom` en `--tinta`:
  - Fila 1: `TÉCNICA` — TODAS · IMPRESO · PULIDO · MICROCEMENTO · LAVADO · FRATASADO · DESACTIVADO
  - ~~Fila 2: `COLOR` — TODOS · 117 · 113 · 109 · 107 · GRIS · ARENA · CREMA~~
    **Retirada el 2026-09-17, por encargo del dueño.** El muestrario es la pantalla a la que se
    entra para ver qué colores hay, y filtrar por pigmento pedía de entrada el dato que el
    visitante viene a buscar. El color no desaparece del catálogo: sigue impreso en cada muestra
    (`C-117`, `GRIS`…) y en la ficha de `/acabados/[modelo]/`. Con él se van su estado, su
    parámetro de URL y su mitad del resumen.
  - Fila 2 (antes fila 3): resumen del filtro en mono 12 (`6 ACABADOS · IMPRESO`) y, si hay filtro
    aplicado, `QUITAR FILTROS ×`.
  - La etiqueta de cada fila ocupa una columna fija de 84 px, alta 44 px, alineada con la
    **primera** línea de chips.
  - **Los chips de escritorio envuelven; no hay carril.** Enmienda del 2026-09-17: el carril
    estaba puesto también en escritorio y de 768 px para arriba pintaba una barra de scroll
    clásica de 15 px bajo cada fila (medido a 960 px: 1093 px de chips en una caja de 849). A
    partir de 768 px la fila envuelve con `flex-wrap` y el mismo `gap`, así que en el lienzo de
    1344 px sigue siendo la fila única que pide este párrafo y por debajo se apila en vez de
    esconderse. El carril deslizante se queda **solo en móvil**, que es donde lo pide la línea
    de abajo y donde la barra de scroll es superpuesta y no ocupa alto.
- **Rejilla de 4** con las muestras (`01 §3.10`). Desde el 2026-09-17 solo queda un eje, así que
  ya no hay combinación que cruzar.
- **Estado vacío** (`01 §3.13`). ⚠️ **Corregido el 2026-09-18: un solo eje no bastaba.** Esta
  línea afirmaba que ya no era alcanzable porque las opciones salen del mismo catálogo que se
  pinta, y era falso: la otra puerta es la URL. Medido, `/acabados/?tecnica=desactivado` servía
  «0 ACABADOS · DESACTIVADO» con la rejilla vacía —`desactivado` tiene página de servicio y ni un
  acabado con muestra—. `FiltrosAcabados` lee `?tecnica=` al montar, así que **la URL es interfaz
  aunque el chip no exista**. Ahora valida contra las mismas opciones que recibe la barra y, si no
  está, ni lo aplica ni lo deja en la URL. El componente se queda por el único caso que sí manda
  el contenido: que ningún acabado del catálogo tenga muestra.
- **Al reescribir la URL se conserva el resto de la query.** El filtro toca su propio parámetro y
  nada más. Reconstruirla desde `pathname` se llevaba por delante el `gclid` de una visita de
  pago antes de que `Atribucion.tsx` lo hubiera guardado en cookie.
- **Bloque «Cómo se lee un código»** en `--tinta`, `1fr 1fr`: a la izquierda el argumento, a la
  derecha `IMPRESO / ESPIGA / C-117` en mono 20 px con las barras en `--acero`, y las tres
  definiciones (técnica, modelo, color) en 3 columnas. Cierra con la advertencia honesta:
  *el color final varía con la luz, el árido y el sellado; la muestra orienta, la obra manda*.
- **Cierre** a una línea: titular + 2 botones.

En móvil: un carril de chips deslizante anclado arriba —eran dos hasta el 2026-09-17—, rejilla de
2, resumen y `QUITAR ×` en la misma fila.

El estado del filtro se refleja en la URL (`?tecnica=impreso`) para que sea compartible y para que
Google pueda indexar la técnica con obra real. Es además el enlace con el que cada página de
servicio manda aquí (`PaginaServicio`, «Ver todos los acabados de…»). `?color=` ya no se lee.

## A4 · Ficha de proyecto — `/proyectos/[slug]/`

Maquetada con la obra de Moncada. **Plantilla de las 11 obras.**

- **Galería:** imagen principal `21/9` a ancho de contenido, y debajo 4 miniaturas `4/3` en
  rejilla de 4 con `gap: 8px`. La seleccionada lleva `outline: 2px solid #1B1E1C` con
  `outline-offset: -2px` (contorno en tinta, **no ocre**: no sumamos un tercer ocre).
  La última miniatura es el `ANTES [pendiente]`.
- **Cuerpo:** `1fr 420px`.
  - Izquierda: H1 64 px y los dos bloques de narrativa, `EL ENCARGO` y `LA EJECUCIÓN`.
  - Derecha: **ficha de obra anclada** (`position: sticky; top: 100px`) con 8 filas —
    municipio, provincia, servicio, modelo, color, superficie, año, plazo — y debajo la tarjeta
    del acabado empleado, que enlaza a `/acabados/[modelo]/`.
- **Proyectos similares:** 3 tarjetas de la misma técnica, fondo `--fondo-alt`.
- **Cierre:** titular + 2 botones, con el CTA ocre.

**En móvil la ficha sube por delante de la narrativa**: quien entra a una obra busca el dato
—modelo, color, m²— antes que el relato. El orden es H1 → ficha → encargo → ejecución.

Los dos bloques de narrativa no existen como copy. Se maquetan con su estructura y longitud
reales dentro de un `border: 1px dashed #5C625E`, indicando qué debe contar cada uno:
`EL ENCARGO` = qué había antes, qué problema tenía y con qué condición llegó el cliente;
`LA EJECUCIÓN` = qué se hizo y qué dificultad concreta tuvo esta obra.

## A5 · Precios — `/precios/` · ⛔ RETIRADA EL 2026-09-17

**Esta pantalla ya no existe en el sitio.** Decisión del dueño, en sus palabras: retirarla por
completo; no quiere precios en la web. Se ha borrado `app/precios/`, su enlace del nav de
`01 §4.1` y su entrada de `app/sitemap.ts`. Ninguna de las 33 redirecciones 301 de la migración
apuntaba aquí —era una ruta nueva del rediseño, no una de la web vieja—, así que no hubo nada
que repuntar.

⛔ **Y la calculadora también, el 2026-09-18.** Al retirar la página, la calculadora se quedó
viviendo dentro de las cuatro páginas de servicio que declaraban `usosCalculadora` y, por
herencia de la plantilla, dentro de las cuatro landings de `/lp/`. Preguntado expresamente, el
dueño contestó que fuera también: **el sitio no da un precio en ningún sitio.** Medido antes de
retirarla, en `/hormigon-impreso/` a 390 px, escribir `80` en el campo de metros llevaba el
bloque de resultado de «—» a «2240–3040 €».

**Lo que ya no existe en código:** `components/secciones/Calculadora.tsx`, el campo
`usosCalculadora` de `content/servicios.tsx` con sus cuatro rangos de €/m², y el miembro
`seccion-precio` de la unión `SeccionServicio`. Ninguna pantalla monta nada de eso.

**Dónde queda el dato, entonces.** La especificación de abajo **se conserva como histórico y no
describe nada que se pinte hoy**: es el único sitio, junto con la tabla de multiplicadores de
`03 §5`, donde quedan escritos los rangos y la fórmula. Se guarda para que reponerlos sea leer y
no reinventar, y se lee en pasado. Volver a pintarlos exige que lo pida el dueño.

⚠️ **Lo que esta retirada NO ha tocado, y sigue prometiendo precio:** las `description` de
`/hormigon-impreso/`, `/hormigon-pulido/`, `/microcemento/` y `/hormigon-lavado/` en
`content/servicios.tsx` siguen diciendo «consulta el precio por m²», «Precio por m²», «Precio y
proyectos» y «precio orientativo». No se ven en la página, pero son lo que Google enseña en el
resultado de búsqueda, y ahora prometen algo que la página ya no tiene. Reescribirlas es copy
nuevo —`05 §B7`—, así que es decisión del dueño y está pendiente.

- **Hero** `1fr 520px`, H1 64 px, antetítulo `PRECIOS ORIENTATIVOS · SIN IVA`.
- **Tabla completa**, rejilla `1fr 300px 300px` con cabecera en mono 11
  (`SERVICIO · USO · RANGO HABITUAL`). 8 filas. El rango en mono 20 px, entre corchetes
  mientras no esté validado.
- **Calculadora** en `--tinta`, `1fr 1fr`:
  - Izquierda: argumento + **aviso de dato sin confirmar** en `border: 1px dashed #41535C`.
  - Derecha: campo numérico de superficie (mono 20 px) + `input[type=range]` de 10 a 400 con
    paso de 5 y `accent-color: #D9A441`; chips de `USO` (peatonal / vehículos / industrial) y
    de `ESTADO DEL TERRENO` (limpio / con pavimento / sin preparar); resultado en Archivo 64 px
    y detalle del cálculo en mono 12; CTA ocre.
  - **Fórmula:** `superficie × [mín–máx del uso] × multiplicador del terreno`, redondeado a la
    decena. Devuelve **siempre un rango**, nunca una cifra exacta, y con superficie 0 muestra
    `—` y *«Escribe una superficie para ver el rango»*.
- **Incluido siempre / se presupuesta aparte:** `1fr 1fr` de listas con separadores.
- **Aviso de los 18 €/m²** en tarjeta `--fondo-alt`: el argumento comercial más fuerte de la
  página. Explica por qué una oferta baja no incluye la solera completa.
- **Cierre** sobre `--fondo-alt`.

**Ocre:** chips activos de la calculadora + su CTA. La tabla no lleva ocre.

## A6 · Lámina de sistema

No es una página del sitio: es la referencia de tokens y componentes. Mantenerla actualizada
cuando se añada un componente nuevo.

---

# B. Pantallas especificadas, pendientes de maquetar

No requieren decisiones de diseño nuevas. Se componen con los componentes de `01` y el copy
indicado. Si al implementarlas un componente no aguanta, **no improvises**: dilo.

## B1 · Presupuesto — `/presupuesto/`

La pantalla que cierra el embudo. Copy del §7.4.

**Escritorio**, `1fr 1fr`:
- Izquierda, columna anclada (`sticky; top: 100px`): H1 64 px *«Pide presupuesto»*, entradilla
  *«Cuéntanos qué quieres pavimentar. Vamos a verlo sin coste y te damos un precio cerrado en
  `[48 horas]`.»*, los 4 datos de confianza en formato de etiqueta técnica sobre `--tinta`, y
  los dos accesos directos: `Llamar al [96X XXX XXX]` (relleno en tinta) y `WhatsApp` (contorno).
- Derecha, formulario en una sola columna con `gap: 16px`. Campos en el orden del §7.4:

| Campo | Tipo | Obligatorio |
|---|---|---|
| Nombre y apellidos | texto | sí |
| Teléfono | tel | sí |
| Email | email | no |
| ¿Qué quieres pavimentar? | desplegable de 7 opciones | sí |
| Superficie aproximada en m² | numérico, admite «no lo sé» | sí |
| Municipio | texto | sí |
| Cuéntanos algo más | textarea | no |
| Sube una foto del espacio | archivo | no |
| Acepto la política de privacidad | casilla | sí |

Nombre y teléfono comparten fila; el resto ocupa el ancho.
Botón de envío ocre a ancho completo: `Enviar y que me llamen`.

⚠️ **Enmienda del 2026-09-18: la fila de nombre y teléfono se reparte por el ancho de su
columna, no por el de la ventana.** Decía `1fr 1fr` y se implementaba con `md:grid-cols-2`,
que mira el documento; pero este formulario se monta en ocho sitios y en la variante corta
cae dentro de media columna. Medido a 768 px en la portada, en `/presupuesto/` y en
`/hormigon-impreso/`: columna de **296,5 px** → pistas de **140,3 px** → la etiqueta
`NOMBRE Y APELLIDOS *`, que mide **167,2 px** de ancho intrínseco, parte en dos líneas y baja
su input **20,9 px** respecto al del teléfono. Ahora es
`grid-cols-[repeat(auto-fit,minmax(180px,1fr))]`: una sola pista por debajo de **376 px** de
columna y dos por encima. A 1024 px las pistas siguen midiendo **204,3 px**, como antes.

**Microcopy literal**, sin reescribir. Esta lista es cerrada: **todo mensaje que el formulario
pueda pintar está aquí, y lo que no está aquí no se pinta.**

- Ayuda de superficie: *Un cálculo aproximado nos vale. Largo × ancho.*
- Ayuda de la foto: *Con una foto podemos darte un rango antes incluso de la visita.
  Máximo 4 MB.*
- Enviando: *Enviando…*
- Confirmación: *Recibido. Te llamamos hoy mismo si nos escribes antes de las 18:00, y mañana a
  primera hora si no.*
- Error de nombre: *Escribe tu nombre.*
- Error de teléfono: *Escribe un número de 9 cifras para que podamos llamarte.*
- Error de correo: *Escribe un correo electrónico válido para que podamos escribirte, o deja el
  campo vacío.*
- Error del desplegable: *Selecciona qué quieres pavimentar.*
- Error de la casilla de privacidad: *Tienes que aceptar la política de privacidad.*
- Error de tipo de la foto: *La foto tiene que ser una imagen.*
- Error de tamaño de la foto, en servidor: *La foto no puede pasar de 4 MB.*
- Error de tamaño de la foto, en cliente: *Esta foto pasa de 4 MB. Elige otra o redúcela antes
  de enviarla.*
- Límite de envíos: *Demasiados envíos seguidos. Llámanos o escríbenos por WhatsApp.*
- Error de envío: *No hemos podido enviarlo. Llámanos al `[teléfono]` o escríbenos por WhatsApp
  y lo resolvemos ahora.*
- Aviso del adjunto perdido, tras un rechazo del servidor: *Vuelve a adjuntar la foto: por
  seguridad, el navegador no conserva el archivo.*

⚠️ **Enmienda del 2026-09-18: los doce mensajes nuevos de esta lista son transcripción, no copy
nuevo.** Ya se pintaban desde `app/presupuesto/actions.ts` y desde el propio componente, y
ninguno estaba escrito aquí: la lista se declaraba autoritativa siendo falsa sobre casi todo lo
que el formulario dice. El **error de correo** es el que trajo la revisión, y describe el estado
real desde que el campo es opcional en las dos variantes —se rechaza el formato inválido, nunca
el campo vacío—.

⚠️ **`[teléfono]` del error de envío es microcopy, no un dato pendiente.** Sale literal del
Server Action y lo sustituye `FormularioPresupuesto` por el número de configuración al pintarlo.
Se había perdido del mensaje en código y el `.replace()` del componente era código muerto sobre
un camino vivo.

✅ **Corrección del mismo día: el marcador sí lleva tratamiento de corchete cuando no hay número
que poner, y esa era la mitad que faltaba.** El sustituto era
`nap.telefono ?? nap.telefonoMostrado`, y `telefonoMostrado` **nunca** es indefinido —vale
`96X XXX XXX` mientras `NEXT_PUBLIC_TELEFONO` esté sin rellenar—, así que la sustitución siempre
encontraba algo y en ese entorno el visitante leía «Llámanos al 96X XXX XXX» **en un mensaje de
error de verdad**: un número inventado presentado como real, que es peor que el hueco. Ahora es
`nap.telefono ?? <DatoPendiente>{nap.telefonoMostrado}</DatoPendiente>`, exactamente como
`app/page.tsx:603` y `app/presupuesto/page.tsx:48`. **El microcopy no cambia ni una letra**: con
teléfono se lee «Llámanos al 961 000 000» y sin él «Llámanos al `[96X XXX XXX]`» con el punteado
de `01 §3.9`. Los mensajes sin marcador —el del límite de envíos— pasan tal cual. Medido en
`/presupuesto/` a 390 px con la variable puesta y vacía, forzando el fallo de envío con una clave
de Resend inválida.

⚠️ **Y el mismo defecto, una palabra más allá, sin arreglar:** la frase sigue diciendo «o
escríbenos por WhatsApp» cuando `NEXT_PUBLIC_WHATSAPP` vacío no pinta un solo `wa.me` en toda la
web. Arreglarlo es reescribir la frase, y eso es copy nuevo: **es del dueño**, que en producción
tiene las dos variables.

**Los cuatro estados:**

1. **Vacío.** Bordes de campo en `#5C625E`. Botón activo.
2. **Error de teléfono.** El campo pasa a `border: 2px solid #8C3A2B`, mensaje debajo en
   `#8C3A2B` 600, `aria-invalid="true"`, **`aria-describedby` apuntando a ese mensaje** y foco
   movido al campo. El resto de campos conserva lo escrito. Se valida al enviar, no al teclear.
   ⚠️ **Enmienda del 2026-09-18:** faltaba el `aria-describedby`, y sin él mover el foco por
   programa anuncia «Teléfono, inválido» sin decir por qué. Lo pone `01 §3.7` para todos los
   campos a la vez, no esta pantalla.
   ✅ **«El resto de campos conserva lo escrito» se cumple desde el 2026-09-18.** Antes no: tras
   rechazar `juan@empresa` en `/presupuesto/` a 390 px volvían vacíos los siete campos y la
   casilla. No era el Server Action —React resetea los campos no controlados en cuanto la acción
   resuelve—, y dolía justo aquí, porque el correo es el único campo donde `type="email"` acepta
   lo que zod rechaza: el rechazo más probable se llevaba por delante el formulario entero, y en
   un móvil quien acaba de teclear nombre, teléfono, superficie y municipio no lo vuelve a
   escribir. Ahora la acción devuelve lo enviado en `EstadoEnvio.valores` —**los valores crudos
   del `FormData`**, no los analizados, o el `.transform()` del teléfono le devolvería
   `961000000` a quien escribió `+34 961 000 000`— y cada control lo declara como `defaultValue`.
   Siguen sin ser campos controlados: no hay `value` ni `onChange`, así que teclear no repinta
   nada. **Se devuelve en los cinco caminos de error**, incluido el fallo de envío. Medido a 390,
   768 y 1366 px, en la variante larga y en la corta de la portada.

   ⚠️ **El desplegable necesita además un `key`, y es el único.** El reseteo de React 19.0.0 es
   un `form.reset()` nativo, que devuelve cada control a su valor por defecto del DOM. En un
   `<input>` y en un `<textarea>` React reescribe ese valor por defecto en cada repintado, así
   que el reseteo ya encuentra el nuevo; en un `<select>`, `defaultValue` solo marca
   `defaultSelected` **en el montaje**, y sin remontar el desplegable volvía a «Entrada de
   garaje» con los otros seis campos intactos. `key={escrito?.espacio}` lo remonta, y el
   remontaje ocurre antes del reseteo dentro del mismo *commit*.

   🔴 **El adjunto no vuelve, y no hay forma de que vuelva:** ninguna página puede colocar un
   archivo en el `<input type="file">` de quien la visita. Así que no se finge —el adjunto se
   perdería en silencio y el correo diría «Foto adjunta: no»—: cuando el envío rechazado traía
   foto, el campo pinta el aviso de la lista de microcopy por el hueco de `error` de `Campo`,
   que es el único que `01 §3.7` anuncia y asocia con `aria-describedby`. Los dos errores de foto
   rechazada mandan sobre él: describen un archivo que además no valía.
3. **Enviando.** Botón en estado deshabilitado (`01 §3.4`) con el texto *Enviando…*; los campos
   en `readonly`. Sin *spinner*: la web no tiene animaciones de carga.
4. **Confirmación.** El formulario se sustituye por un bloque en `--tinta` con el antetítulo
   `RECIBIDO`, el mensaje de confirmación en 26 px, la etiqueta técnica con el resumen de lo
   enviado (espacio, superficie, municipio) y dos salidas: `Ver el muestrario` y
   `Ver proyectos`. **No se vuelve a pedir nada.**
   ⚠️ **Enmienda del 2026-09-18: el resumen enseña lo que esa variante recoge, y nada más.**
   La corta no pide superficie ni municipio, y el panel pintaba sus dos líneas como `— m²` y
   `—`. El guion de relleno no era solo un hueco vacío: el componente reenvía ese mismo resumen
   a GA4 y al Pixel, así que **todos los leads de la portada y de las seis páginas de servicio
   declaraban `—` como `municipality`**. Una dimensión personalizada de GA4 no se rellena hacia
   atrás. El Server Action devuelve la cadena vacía y decide quien pinta.

**Móvil:** todo en una columna, formulario primero después de la entradilla, datos de confianza
al final. La barra fija inferior sigue presente: es la vía alternativa si el formulario asusta.

Implementación: Server Action + Resend, honeypot oculto, límite de envíos por IP, validación
de teléfono también en servidor. Adjunto: **máximo 4 MB**, tipos de imagen; si excede, error
inline sin perder el resto del formulario. ⚠️ **Enmienda del 2026-09-18:** decía 10 MB, igual
que `design/04` §6. El tope real lo pone Vercel, que corta el cuerpo de una función en 4,5 MB, y
los Server Actions se ejecutan como función; ya estaba en CLAUDE.md y en el código, solo faltaba
aquí. Por eso la ayuda de la foto dice «Máximo 4 MB».

## B2 · Ficha de acabado — `/acabados/[modelo]/`

Genera una página indexable por modelo. Ejemplo: `/acabados/espiga/`.

- Migas `INICIO / ACABADOS / ESPIGA`.
- **Muestra ampliada** a ancho de contenido en `4/3` (o `21/9` si la foto lo permite), con la
  etiqueta técnica del modelo sobrepuesta.
- **Cuerpo `1fr 420px`:** a la izquierda H1 *«Modelo espiga»* + descripción del dibujo del
  molde y para qué espacios funciona; a la derecha ficha técnica anclada del modelo —técnica,
  colores disponibles, espesor recomendado, antideslizamiento, usos.
- **Colores disponibles en este modelo:** rejilla de 4 con la misma muestra en cada color
  **publicado** de ese modelo, cada una con su código. Si un color no tiene obra ejecutada, la
  muestra va con el municipio entre corchetes.
  ⚠️ **Enmienda del 2026-09-18.** Decía «cada color del catálogo que exista», y eso era la orden
  de repintar aquí los seis huecos que el §A3 acababa de quitar del muestrario. Sale de
  `acabadosPorModelo`, que ya solo devuelve publicados.
  **Y la sección entera desaparece cuando no queda ninguno**: `/acabados/piedra-silleria/` y
  `/acabados/piedra-rodena/` cuelgan solo de variantes sin muestra, y un H2 que promete colores
  sobre una rejilla vacía es peor que el hueco rayado. **Las dos fichas se quedan** —tienen su
  hero de molde en `content/modelos.ts`, `app/sitemap.ts` las declara y ningún gate del
  `postbuild` contrasta el sitemap contra las rutas generadas, así que un 404 ahí no lo vería
  nadie—. Ninguna 301 apunta a `/acabados/`: comprobado en `next.config.ts`, cero coincidencias.
- **Obras donde se ha ejecutado:** 3 tarjetas de proyecto filtradas por este modelo. Si no hay
  ninguna documentada, el estado vacío del `01 §3.13` con el texto adaptado.
- **Enlace cruzado:** enlace-etiqueta al artículo del blog que explica la técnica, si existe.
- Cierre con CTA ocre.
- Enlace de vuelta al índice `/acabados/` en las migas y al final.

## B3 · Índice de proyectos — `/proyectos/`

> 🔴 **Sin filtros desde el 2026-09-17, por decisión del dueño.** Esta pantalla ya no lleva barra
> anclada, ni los cuatro grupos de chips, ni hoja inferior, ni resumen `9 OBRAS`, ni estado en
> query params: se sirve la rejilla entera con las 9 obras. Todo lo que sigue —incluida la
> enmienda de los chips que envuelven, de esta misma fecha— queda **descrito para el registro,
> no vigente**. Lo que sí sigue siendo normativo de esta pantalla: el hero con H1 de 64 px y su
> **contador real de obras** —el antetítulo `9 OBRAS DOCUMENTADAS`, que es el que queda— y la
> rejilla de 3 con tarjetas de proyecto.
>
> Consecuencias, para que no haya que descubrirlas leyendo el código:
>
> - La entradilla decía «Filtra por servicio, modelo, municipio o año» y la `description` del
>   `<head>` «Filtra por acabado, espacio o municipio». **Se han borrado las dos frases**, no
>   sustituido: copy nuevo no se inventa. Las dos entradillas se quedan cortas a la espera de
>   texto del dueño.
> - Un enlace antiguo con `?servicio=…` no rompe: llega a la misma URL y ve todas las obras.
> - `components/secciones/FiltrosProyectos.tsx` se borra. Con él desaparece la **única
>   implementación en el repo del componente `01 §3.15`, la hoja inferior de filtros**:
>   `FiltrosAcabados` nunca tuvo hoja, solo chips que envuelven. Si `/acabados/` también pierde
>   sus filtros, `3.15` se queda sin uso y hay que retirarlo de la lámina.
> - Esta pantalla ya no tiene ni un componente de cliente propio.

Misma mecánica que el muestrario, con **cuatro ejes** en vez de dos.

- Hero con H1 64 px y contador real de obras.
- **Barra de filtros anclada** a `top: 80px`. Cuatro grupos:
  `SERVICIO` · `MODELO` · `MUNICIPIO` · `AÑO`. Cada uno con su `TODOS`.
- Rejilla de 3 con tarjetas de proyecto. Resumen del filtro + `QUITAR FILTROS ×`.
- Estado vacío del `01 §3.13`.
- Estado de los filtros en query params.

- **Los chips envuelven, y la barra de chips empieza en 1280 px.** Enmienda del 2026-09-17,
  medida: los cuatro grupos llevaban carril, y el de `MODELO` desbordaba incluso a 1366 px
  —1699 px de chips en una caja de 1255—, con su barra de scroll clásica bajo cada fila.
  Envolviendo, la barra anclada mide **310 px de 1280 px para arriba** (solo envuelve `MODELO`)
  y **466 px entre 768 y 1279**. Medio viewport de barra fija sobre la rejilla que el visitante
  quiere comparar es justo lo que rechaza la decisión de abajo, y su motivo —«hasta 16
  municipios no caben»— sigue siendo cierto a 960 px. Así que **por debajo de 1280 px manda la
  hoja inferior**. ⚠️ Desde el 2026-09-17 este umbral **ya no coincide** con el de la cabecera
  (`cabecera-ancha` = 1180, `01 §4.1` y §4.3): entre 1180 y 1279 se ve nav de escritorio con la
  hoja inferior de filtros. Los dos estados están diseñados y el botón `FILTRAR` sigue a la
  vista; lo que no cabe a ese ancho es la barra de chips, no el nav.

**Decisión de filtros en móvil: hoja inferior, no acordeón ni chips.**
Cuatro grupos con hasta 16 municipios no caben en carriles deslizantes —el usuario tendría que
deslizar cuatro carriles a ciegas— y un acordeón empuja la rejilla fuera de pantalla justo
cuando quiere comparar obras. Por eso:

- En móvil, la barra anclada se reduce a **una sola fila**: botón de contorno
  `FILTRAR (2)` —con el número de filtros activos— y el resumen `12 OBRAS`.
- Al pulsarlo se abre una **hoja inferior** a pantalla casi completa (`--fondo`, sin radio,
  `border-top: 1px solid #1B1E1C`), con los cuatro grupos de chips apilados y espacio para
  respirar. Cabecera de la hoja con el título `FILTRAR` y una `×` de 44 px.
  Pie de la hoja fijo con dos botones: `Quitar filtros` (contorno) y `Ver 12 obras` (ocre).
- La hoja se cierra al aplicar, y la rejilla ya está filtrada al volver.
- La hoja atrapa el foco mientras está abierta, se cierra con `Esc` y devuelve el foco al botón
  que la abrió. `body` con `overflow: hidden` mientras está abierta.

Este es el único componente nuevo de la segunda tanda. **Añádelo a la lámina de sistema** como
componente 3.15, `hoja inferior de filtros`.

## B4 · Página de zona — `/zonas/[municipio]/`

**Solo donde haya obra ejecutada y documentada.** Sin obra no se crea la página: Google penaliza
las *doorway pages*, y con 17 años de trabajos hay material real de sobra.

Ejemplo normativo: **`/zonas/moraira/`** (impreso, adoquín pequeño, color arena, 2025). Es un
municipio con perfil de cliente extranjero y segunda residencia, distinto al del área
metropolitana, y el copy debe reflejarlo sin inventar datos.

Estructura:
- Migas `INICIO / ZONAS / MORAIRA`.
- Hero `1fr 1fr`: H1 *«Pavimentos de hormigón en Moraira»*, entradilla con las obras reales
  ejecutadas allí, y bloque de foto de la obra del municipio con su ficha.
- **Obras en este municipio:** rejilla de 3 con las tarjetas reales. Es el contenido que
  justifica la página.
- **Servicios prestados aquí:** solo los que se han ejecutado de verdad en la zona, con enlace
  a la página de servicio.
- **Acabados usados en la zona:** rejilla de 4 con las muestras correspondientes.
- Bloque de zona de servicio: distancia, si hay recargo de desplazamiento, y a partir de qué
  superficie se atiende.
- FAQ de 3, reutilizando las de la home.
- **CTA local:** *«¿Quieres algo parecido en Moraira?»* con el CTA ocre.

## B5 · Empresa — `/empresa/`

Copy literal del §7.3.

- H1 *«17 años poniendo hormigón en la Comunidad Valenciana»* a 64 px.
- Entradilla con `[2009]` y `[X.000]` m² entre corchetes.
- **Cómo trabajamos** — `[Equipo propio.]` El párrafo de la preparación del soporte va destacado:
  es el argumento técnico. `1fr 1fr` con bloque de foto de obra en ejecución.
- **Por qué nos vuelven a llamar** — el 30 % de repetición, sobre `--tinta` a página completa.
- **También construimos pistas de pádel y pickleball** — enlace externo a padelalbufera.com,
  como enlace-etiqueta, sin darle peso de sección propia.
- Sin fotos de equipo mientras no las haya. **Cero stock.**

## B6 · Blog — `/blog/` y `/blog/[slug]/`

**La decisión de contenido más importante de la migración.** Las entradas actuales mezclan dos
cosas que no son lo mismo:

| Tipo | Ejemplo | Destino |
|---|---|---|
| **Parte de obra** | «Hormigón impreso en modelo espiga y color 117, proyecto en Moncada» | `/proyectos/[slug]/` con la plantilla de A4 |
| **Artículo divulgativo** | «Hormigón desactivado con piedra vista: estética y funcionalidad» | `/blog/[slug]/` |

Los partes de obra **no son artículos**: son fichas de proyecto y llevan ficha técnica y
galería. El índice del blog se diseña asumiendo esa separación, así que solo contiene artículos.

**Índice `/blog/`:**
- H1 64 px, entradilla que explica qué se publica aquí.
- Rejilla de 3 con tarjetas de artículo: imagen `16/10`, antetítulo con la técnica de la que
  trata en mono 11, título en Archivo 26 px, entradilla de 2 líneas y fecha en mono 11.
- **Bloque de enlace cruzado al final del índice**, sobre `--fondo-alt`: *«¿Buscas obra
  ejecutada, no artículos?»* con enlace-etiqueta a `/proyectos/`. Resuelve visualmente que un
  visitante que llega buscando obras no se quede en el blog.

**Artículo `/blog/[slug]/`:**
- Migas + H1 a 64 px + fecha y técnica en mono 11.
- Imagen de apertura `21/9`.
- **Cuerpo `1fr 320px`:** columna de texto con `max-width: 68ch` y **sumario anclado** a la
  derecha (`sticky; top: 100px`) con los `h2` del artículo, marcando el activo en ocre. Es el
  mismo componente que el submenú de servicio, en vertical.
- Cuerpo del texto a 20 px con `line-height: 1.6`. `h2` a 34 px con `border-top` de separación.
  Imágenes intercaladas a ancho de columna con pie en mono 11.
- **Enlace cruzado, obligatorio en todo artículo:** tras el cuerpo, un bloque con las 3 tarjetas
  de proyecto de la técnica que explica el artículo, con el antetítulo
  `ESTA TÉCNICA, EJECUTADA`. Un artículo sobre desactivado lleva a los proyectos de desactivado.
- CTA de cierre con el ocre.
- En móvil el sumario se convierte en un bloque plegado al principio del artículo, no anclado.

**La otra dirección del cruce:** la ficha de proyecto (A4) ya tiene la tarjeta del acabado
empleado en su barra lateral; se le añade, debajo, un enlace-etiqueta al artículo que explica
la técnica cuando exista. Es el mismo componente, con el antetítulo `CÓMO SE HACE`.

## B7 · Legal — plantilla común

Una sola plantilla para aviso legal, privacidad y cookies.

- Sin hero. Migas, H1 a 46 px, y fecha de última actualización en mono 11.
- Columna única de `max-width: 68ch` centrada, texto a 16 px, `h2` a 26 px con `border-top`.
- Índice de secciones al principio como lista de enlaces-etiqueta.
- Sin CTA, sin imágenes, sin ocre. Es la única página del sitio sin acento.
- Pie normal.

## B8 · Error 404

- Antetítulo `ERROR 404`, H1 *«Esta página ya no está aquí»* a 64 px.
- Explicación breve: la web se ha rehecho y algunas direcciones antiguas han cambiado.
- **Tres salidas útiles** en rejilla de 3, con el componente de tarjeta: `Servicios`,
  `Proyectos` y `Pedir presupuesto`, cada una con una línea de descripción.
- Buscador no: el sitio tiene 20 páginas.
- Registrar los 404 en analítica para vigilar redirecciones olvidadas durante 8 semanas.

## B9 · Cabecera: estado con scroll y menú de móvil

El estado inicial de la cabecera, el pie completo y la barra fija de móvil **ya están
resueltos** en las pantallas de la sección A. Aquí van los otros dos estados, los dos ya
implementados:

**Estado tras hacer scroll.** La cabecera se ancla y cambia de aspecto, pero **no de tamaño**.
Enmendado el 2026-08-31; deroga las tres cláusulas que animaban la altura:

- **La altura es constante: 70 px en móvil y 84 px desde 768 px.** ~~`height: 84px → 60px`~~.
  Animar `height` sobre un elemento sticky que está en el flujo era la única animación no
  compuesta del sitio y tenía dos costes medidos: CLS en cada scroll, porque los 24 px empujan
  todo lo que hay debajo; y un salto al aterrizar con `#ancla` —el caso de un anuncio—, porque
  el HTML llega expandido, el efecto ve el scroll ya hecho y la sección anclada se mueve bajo
  el cursor.
- ~~El logo pasa de dos líneas a una: `PAVIMENTOS ALBUFERA`, mono 12 en versalitas. Las dos
  variantes se apilan en la misma celda de rejilla y se cruzan por `opacity`.~~ **Derogado el
  2026-09-01: el logotipo no cambia con el scroll.** Desde que es una imagen (`01 §4.1`) su caja
  es fija, así que el problema que resolvía el cruce —que el ancho del logotipo se moviera al
  comprimirse la barra y desplazara la navegación— no llega a plantearse. Se queda una sola
  imagen, idéntica con scroll y sin él.
- El teléfono desaparece **por `visibility`**, que conserva su hueco —`display:none` movería el
  botón— y lo saca del orden de tabulación. ~~El botón de contorno pasa a `min-height: 44px`~~:
  **se queda en `min-height: 56px`**. Los 44 px existían para caber en una barra de 60 px, y la
  barra ya no se comprime.
- Aparece `border-bottom: 1px solid #1B1E1C` y fondo `--fondo` opaco (nunca translúcido).
- Los 150 ms y el `ease-out` se conservan, ahora sobre `opacity` y `visibility`.
  `prefers-reduced-motion: reduce` los anula desde el bloque global de `app/globals.css`, sin
  nada que declarar aquí.
- La barra de confianza, el submenú de servicio y las dos barras de filtro se anclan **debajo**
  de ella leyendo `--cabecera-actual`. ~~Recalcular sus `top` a 60 px~~: esa variable ya no la
  reescribe ningún efecto, la fija una media query en `app/globals.css` —70 px hasta 768 px,
  84 px a partir de ahí— y espeja el `h-[70px] md:h-cabecera` del `<header>`. **Si se cambia la
  altura de la cabecera hay que cambiarla también ahí**, o los sticky se pegan por debajo del
  borde y el contenido corre por la franja. El `scroll-margin-top` de las secciones se queda en
  150 px: el peor caso es escritorio con submenú, 84 + 56 = 140.

**Menú desplegado en móvil.** Panel a pantalla completa, no deslizante lateral:
- Fondo `--tinta` a pantalla completa, `padding: 18px`.
- Cabecera del panel con el logo —`/marca/logo-texto-claro.png`, 20 px de alto— y una `×` de
  44 px a la derecha.
- Enlaces principales en Archivo 700 / 115 % a 34 px, uno por línea, `min-height: 56px`,
  separados por `border-top: 1px solid #41535C`.
- Debajo, en mono 11 color `#DADCD6`: el NAP completo y los enlaces legales.
- Al pie del panel, los dos botones de contacto a ancho completo (`Llamar` ocre + `WhatsApp`
  contorno claro).
- Atrapa el foco, se cierra con `Esc`, `body` con `overflow: hidden`, y devuelve el foco al
  botón de hamburguesa. Sin animación de deslizamiento: aparece y desaparece.
