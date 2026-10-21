# Receta SEO de las páginas de servicio (2026-10-21)

Plantilla de mejora de las seis páginas de servicio de pavimentos-albufera.com, pensada primero
para `/hormigon-fratasado/` y aplicada después a `/hormigon-impreso/`, `/hormigon-pulido/`,
`/hormigon-lavado/`, `/hormigon-desactivado/` y `/microcemento/`. Ejecutada por orden del dueño,
que levanta para esto el congelado del frontend de la fase de monorepo **solo en la plantilla de
servicio** (`PaginaServicio.tsx`).

Cada punto lleva su porqué: el dueño está aprendiendo SEO y la receta tiene que poder repetirse
sin quien la escribió.

Fuentes de esta carpeta: `analisis-gsc-2026-10.md` (los números), `estudio-de-keywords.md` y
`arquitectura-y-estrategia.md` (el marco), `estado-y-decisiones.md` (las decisiones del dueño).

---

## 1. El problema, en datos de Search Console (18-09 → 19-10-2026)

- La URL vieja `/hormigon-fratasado-fino-decorativo-en-viviendas/` estaba en **posición 5,8**
  (427 impresiones, 8 clics: la mejor página de la web vieja). Redirige a `/hormigon-fratasado/`,
  que está en **posición 15,6** (535 impresiones).
- El grupo «fratasado» suma **~650 impresiones en posiciones 5–20**: «hormigon fratasado» (241,
  pos. 10), «hormigon fratasado valencia» (50; 14,8), «pavimento fratasado valencia» (38; 7,6),
  «suelo fratasado valencia» (37; 9,8), «hormigón fratasado» (35; 14), «hormigon fratasado colores
  valencia» (33; 7,7), «pavimento fratasado» (32; 17,6), «hormigon fratasado exterior valencia»
  (28; 8,4), «fratasado de hormigón» (25; 5,1), «fratasado valencia» (25; 8,8), «cemento
  fratasado precio valencia» (21; 16), «suelo fratasado» (14), «hormigon fratasado exterior» (11;
  19,7).
- Y en **posición 1**: «acabado fratasado» (55), «hormigon fratasado color arena» (30), «suelo
  fratasado interior» (9), «hormigón fratasado exterior» (5).
- Pulido: «hormigon pulido exterior» en posición 1 (~315 impresiones, la ganó un artículo viejo) y
  «hormigon pulido valencia» en 13 (319). El title nuevo decía «Interior e industrial».

**Lectura.** Todas esas consultas tienen **la misma intención** (alguien que quiere un suelo
fratasado y busca quién se lo haga o cómo es). No piden páginas nuevas: piden que **una** página
responda a todas sus variantes —suelo / pavimento / cemento fratasado, interior, exterior,
colores— y eso es justo lo que la página nueva había dejado de hacer.

## 2. Qué tenía la web vieja, y qué se pudo comprobar

🔴 **El texto de la página vieja no se ha podido leer.** Desde el contenedor de la sesión:

- el dominio no resuelve (`getaddrinfo ENOTFOUND`) y el proxy rechaza `web.archive.org` y
  `archive.org` (403 / DNS) tanto con `curl` como con WebFetch;
- Nimble no tiene una plantilla para la Wayback Machine, y la búsqueda de Google con `site:` no la
  respeta;
- el repo no guarda ninguna copia del HTML de WordPress (buscado en todo `design/`, en
  `apps/web/public/obras/INVENTARIO.md` y en el historial de git), y el repo de pavivasa —que según
  `estado-y-decisiones.md` §7 publica esos mismos temas— no está autorizado en esta sesión.

**Lo que sí se sabe de ella**, y es lo que se ha recuperado:

| Señal | Dónde se ve | Qué se ha recuperado |
|---|---|---|
| «**fino**», «**decorativo**» y «**en viviendas**» en el propio slug y title | La URL, `next.config.ts`, el artículo vacío `hormigon-fratasado-fino-en-viviendas` | H3 «Fratasado fino, el acabado decorativo de vivienda» |
| «**suelo fratasado interior**» en posición 1 | GSC | H3 «Suelo fratasado en interior» + FAQ «¿Se puede poner dentro de casa?» |
| «**hormigón fratasado exterior**» en posición 1 | GSC | H3 «Suelo fratasado en exterior» (con el agarre en mojado, honesto) |
| «**hormigon fratasado color arena**» en posición 1 y «… colores valencia» en 7,7 | GSC | H3 «Colores del suelo fratasado», que enlaza la obra de Corbera y la ficha `/acabados/fratasado-arena/` |
| «**acabado fratasado**» en posición 1 | GSC | El intro define el fratasado como acabado de una solera, con la máquina («helicóptero») |
| «suelo / pavimento / cemento fratasado» | GSC | Variantes repartidas donde caben: title («Suelo de…»), meta, H3 y texto |

De pulido, las dos URLs viejas (`/brillo-y-elegancia-explorando-el-hormigon-pulido/` y
`/hormigon-pulido-alicante-transformando-espacios-con-elegancia-y-durabilidad/`) tampoco se han
podido leer; la señal que dejan es «**exterior**» en posición 1. Ya redirigen a `/hormigon-pulido/`
en la rama principal (otra persona; aquí no se toca `next.config.ts`). Del lavado viejo sí consta
en `design/rediseno-pavimentos-albufera.md` §2.3 su ficha técnica (HA-25, fibra, «clase 3 Rd>45»),
que ya estaba recuperada.

## 3. La SERP de Google España (Nimble, país ES, 2026-10-21)

**«hormigon fratasado»** — Pinterest, hormigonimpresozaragoza.es, grupocanto.com (qué es y usos),
pulimentosmolina.es, pavimentskonnik.es (características), **paviton.es «Diferencias entre
hormigón impreso y hormigón fratasado»**, comaceimport.com (qué es, usos, cómo fratasar). Preguntas
relacionadas: «¿Qué significa hormigón fratasado?», «¿Qué hormigón se usa para pavimento?»,
«¿Cuánto cuesta el metro de hormigón fratasado?».

**«hormigon fratasado valencia»** — AI Overview que define el proceso («se alisa con una máquina
fratasadora mecánica, conocida como "helicóptero"»), los acabados (fino, semifino,
antideslizante) y da un precio; después vídeos y posts de Facebook/Instagram, directorios y
páginas genéricas de impreso. **Ninguna página de una empresa local explica el fratasado con obra
propia.** Es una SERP débil: se gana con una página de servicio completa.

**«suelo fratasado valencia»** — pavimentospaterna.com, pavimoder.com, posts sociales,
paginasamarillas… y nuestra ficha `/proyectos/corbera-fratasado-arena/` en 7.ª posición.

**«hormigon pulido exterior»** — Topciment, YouTube, lacasadehormigon.es («interiores y
exteriores»), **hormisoldecor.es «Hormigón semipulido antideslizante»**, Bigmat. Búsquedas
relacionadas: «hormigón fratasado exterior», «hormigón pulido colores», «suelo hormigón pulido
vivienda».

**Lo que cubren las primeras y nuestra página no cubría:** qué es (definición con la máquina),
cómo se hace, interior y exterior por separado, si resbala, colores, y la comparación con el
servicio vecino (impreso, pulido). Todas tienen bastante más texto que las ~500 palabras que tenía
cada una de nuestras seis. Ninguna tiene obra propia documentada, que es lo único que nosotros sí
tenemos.

## 4. La receta (lo que lleva cada página de servicio, y por qué)

1. **Title con la búsqueda principal delante y una variante útil detrás.** `Suelo de hormigón
   fratasado en Valencia`, `Hormigón pulido en Valencia: interior y exterior`. *Por qué:* el title
   es lo que más pesa de lo que escribimos nosotros y lo que el usuario lee en Google. La plantilla
   le añade `| Pavimentos Albufera`; con la palabra clave delante, si Google corta a ~60
   caracteres corta la marca, no la búsqueda.
2. **Meta description de ~150 caracteres que diga para qué sirve, dónde y qué hay en la página.**
   *Por qué:* no posiciona por sí misma, pero decide el clic. Variantes de la búsqueda (suelo,
   pavimento, interior, exterior, colores) donde caben con naturalidad.
3. **Un solo H1, el de siempre** (`Hormigón X en Valencia, Castellón y Alicante`). *Por qué:* ya
   era correcto; cambiarlo no aporta.
4. **Banda «Qué es» justo debajo del hero**: H2 + respuesta directa en la primera frase + bloques
   H3. *Por qué:* es la intención principal de la búsqueda («¿qué es el hormigón fratasado?» sale
   en las preguntas relacionadas y en la AI Overview). Respuesta directa arriba = candidata a
   fragmento destacado y a resumen de IA. Los H3 cubren cada variante con su propio encabezado
   (interior, exterior, colores, fino/decorativo), que es como una página posiciona para cientos de
   consultas parecidas sin repetir la palabra clave (estudio de Ahrefs citado en
   `arquitectura-y-estrategia.md` §3).
5. **Honestidad técnica como argumento: dónde sí y dónde no.** Se mantiene «Cuándo NO» y la guía
   dice cuándo resbala cada acabado. *Por qué:* es lo que ninguna competencia escribe y lo que más
   confianza da (`design/02` §A2); y Google premia el contenido útil de primera mano.
6. **Comparación con el servicio vecino** («Fratasado, pulido o impreso», «Lavado o desactivado»,
   «Microcemento o hormigón pulido»). *Por qué:* la SERP la pide (paviton, enargroup) y separa
   intenciones entre nuestras propias páginas, que es lo que evita la canibalización (§6).
7. **Enlaces internos dentro del texto, con texto descriptivo**: a otros servicios, a la obra real
   (proyectos), a la ficha de acabado y a la zona. *Por qué:* «keywords in anchor text of internal
   links» y «site architecture by topic» están entre los factores locales de Whitespark 2026; y una
   página que nadie enlaza es señal de doorway. Nunca «haz clic aquí».
8. **«Dónde lo hemos hecho»: un enlace por zona con obra fotografiada de esa técnica**, con el
   municipio en el texto del enlace (`Hormigón fratasado en Corbera →`). *Por qué:* conecta la
   búsqueda general con la local y da a las páginas de zona el enlace que no tenían
   (`analisis-gsc-2026-10.md` §4.E). Solo zonas con foto: las demás van en `noindex` y no se
   enlaza lo que se pide no indexar. Se calcula de los datos: si una zona gana obra, aparece sola.
9. **FAQ visible con las preguntas propias de la técnica**, más una de precio sin precio
   («¿Cuánto cuesta el metro cuadrado?» → de qué depende y cómo damos precio cerrado). *Por qué:*
   las preguntas relacionadas de Google son literalmente esas; la de precio captura «cemento
   fratasado precio valencia» sin publicar un euro, que el dueño no quiere. El marcado `FAQPage` se
   mantiene, pero ya no da resultado enriquecido (retirado el 7-5-2026): sirve por el usuario.
10. **Datos estructurados `Service` con `name` y `description`.** *Por qué:* antes el nodo no
    tenía descripción (lo apuntaba `ARCHITECTURE.md` §15). No genera resultado enriquecido; ayuda a
    que Google entienda qué servicio es la página. Sin `AggregateRating`, como siempre.
11. **Imágenes: alt que describe la foto** (qué se ve, técnica, color si se sabe), no la palabra
    clave. *Por qué:* es el atributo de imagen que Google lee; el relleno de alt es spam. Los alt de
    las seis páginas ya cumplían, así que no se han tocado. Las fotos nuevas por técnica (interior
    fratasado, pulido en exterior) esperan a material del dueño.
12. **Ficha técnica con la norma vigente.** `HA-25 según Código Estructural` (RD 470/2021), no
    EHE-08, que está derogada. *Por qué:* es la parte que más demuestra oficio; citar una norma
    derogada lo resta.
13. **Lo que no se hace, a propósito:** ni precios (decisión del dueño), ni párrafos que repitan
    «hormigón fratasado en Valencia», ni listas de pueblos, ni páginas nuevas por variante. Las
    landings `/lp/` (tráfico de pago, `noindex`) no muestran la banda nueva.

## 5. Cambios por página

| Página | Title antes → después | Meta description (después) | Añadido |
|---|---|---|---|
| `/hormigon-fratasado/` | Hormigón fratasado en Valencia → **Suelo de hormigón fratasado en Valencia** | Suelo de hormigón fratasado fino y mate, interior y exterior: patios, porches, garajes y naves. Colores como el arena, obra real y visita sin coste. | «Qué es» con 5 bloques (fino/decorativo de vivienda · exterior · interior · colores · fratasado vs pulido vs impreso); aplicación «Interior de vivienda»; fila ACABADO en la ficha; zona Corbera; FAQ +4 (resbala, dentro de casa, sobre suelo existente, precio) |
| `/hormigon-pulido/` | Hormigón pulido Valencia \| Interior e industrial → **Hormigón pulido en Valencia: interior y exterior** | Hormigón pulido para naves, garajes, viviendas y terrazas. Dónde funciona en exterior y dónde resbala, ficha técnica y obra real. Presupuesto sin compromiso. | «Qué es» con 4 bloques (interior · **exterior: dónde sí** · **y dónde no** · pulido vs fratasado); aplicación «Terraza, porche y patio»; entradilla con exterior; zona Ribarroja; FAQ +2 (pulido en exterior, precio) |
| `/hormigon-impreso/` | Hormigón impreso Valencia \| Acabados y obra ejecutada → **Hormigón impreso en Valencia: modelos y colores** | Hormigón impreso para patios, entradas de garaje y piscinas: modelos de piedra, adoquín y espiga, colores y obras reales. Visita y presupuesto sin compromiso. | «Cómo se hace» con 3 bloques (proceso · modelos y colores con enlaces a cada ficha y al arena de Moraira · mantenimiento); zonas Moraira, Denia, Moncada, Alzira; FAQ +1 (precio) |
| `/hormigon-lavado/` | sin cambio (Hormigón lavado y árido visto en Valencia, ya en pos. 1–2 para «hormigón lavado») | Hormigón lavado con árido visto, antideslizante de clase 3, para piscinas, patios y caminos. Cómo se hace, en qué se diferencia del desactivado y obra real. | «Qué es» con 3 bloques (en fresco y **sin retardante** · lavado o desactivado · el color lo pone la piedra); zona Godella; FAQ +2 (lavado vs desactivado, precio) |
| `/hormigon-desactivado/` | Hormigón desactivado en Valencia → **Hormigón desactivado en Valencia: piedra vista** | Hormigón desactivado con piedra vista para caminos, patios y bordes de piscina. Qué es, cómo se hace con retardante y en qué se diferencia del lavado. | «Qué es» con 3 bloques (**por qué con retardante** · desactivado o lavado · piedra vista: el árido manda); el texto de proceso pasa a la guía y Aplicaciones habla de usos; FAQ +2 (lavado vs desactivado, precio). Sin zona: no hay obra documentada |
| `/microcemento/` | sin cambio | Renueva suelos, baños y paredes sin picar lo que ya tienes: microcemento de 2 a 3 mm, continuo y sin juntas, aplicado sobre azulejo, terrazo o gres. | «Qué es» con 2 bloques (suelos, paredes y baños · microcemento o hormigón pulido). Sin zona ni FAQ nueva |

Palabras de texto visible en `<main>` (medidas en el HTML del build): fratasado 524 → 1.168 ·
pulido 517 → 946 · impreso 679 → 1.042 · lavado 517 → 914 · desactivado 571 → 902 · microcemento
615 → 762. Encabezados H2/H3: fratasado 11 → 18.

### Pulido en exterior

El dueño confirma que hacen pulido en exterior. La página lo dice («También lo hacemos fuera:
terrazas, porches, patios y accesos de vivienda donde se anda con calzado») y mantiene, en un
bloque propio, **dónde no**: donde se anda descalzo y mojado (borde de piscina, ducha de jardín) y
rampas que se mojan. Cómo dejan el acabado fuera (grado de pulido, tratamiento antideslizante) es
dato del dueño y va pendiente. El title deja de decir «Interior e industrial», que contradecía la
consulta que más impresiones tenía en posición 1.

### Lavado y desactivado, diferenciados (no más parecidos)

| | Lavado | Desactivado |
|---|---|---|
| Cómo se descubre el árido | En fresco, el mismo día, con agua y cepillo, **sin retardante** | **Con retardante de superficie** pulverizado; lavado a presión después |
| Lo que se cuenta en su guía | El oficio de acertar el momento; el color lo pone la piedra | Por qué el retardante: margen en superficies grandes y profundidad pareja |
| Title | Hormigón lavado y árido visto | Hormigón desactivado: piedra vista |
| Obra | Godella | — |

Las dos comparten **una** pregunta («¿Qué diferencia hay entre el hormigón lavado y el
desactivado?»), con la misma respuesta, y cada guía enlaza a la otra con el nombre de la técnica.
Eso le dice a Google que son dos cosas distintas y relacionadas, en vez de dos páginas que
compiten por lo mismo. ⚠️ La distinción con/sin retardante es la técnica de manual
(`estado-y-decisiones.md` §6); **falta que el dueño confirme que así es como trabajan ellos**.

## 6. Datos que tiene que aportar el dueño

Se ven en la web entre corchetes atenuados (`<DatoPendiente>`), no se han inventado:

| Dato | Dónde aparece |
|---|---|
| Cómo dejan el pulido en exterior (grado de pulido o tratamiento antideslizante) | `/hormigon-pulido/` → «Hormigón pulido en exterior: dónde sí» |
| Tratamiento o sellado que aplican al fratasado en interior | `/hormigon-fratasado/` → «Suelo fratasado en interior» |
| Carta de colores disponible para fratasado (además del arena) | `/hormigon-fratasado/` → «Colores del suelo fratasado» |
| Áridos con los que trabajan en lavado (tamaños y colores) | `/hormigon-lavado/` → «El color lo pone la piedra» |
| Áridos con los que trabajan en desactivado (tamaños y colores) | `/hormigon-desactivado/` → «Piedra vista: el árido manda» |

Y estas afirmaciones nuevas, escritas como técnica general, que el dueño debe **confirmar o
corregir** (están publicadas sin corchete porque son correctas como técnica, pero son suyas):

- Que hacen fratasado **en interior de vivienda** (lo sugieren el slug viejo «en viviendas» y la
  consulta «suelo fratasado interior» en posición 1).
- Que su **lavado es sin retardante** y su **desactivado con retardante**.
- Que el fratasado puede ir **en color** además del gris (consta el arena de Corbera).
- Que en el borde de piscina recomiendan lavado/desactivado antes que fratasado o pulido. Ojo: la
  foto de tarjeta de fratasado de la home es un contorno de piscina fratasado; si lo hacen con un
  fratasado menos cerrado, conviene decirlo.

## 7. Qué no se ha hecho, y por qué

- **Precios:** ninguno. La FAQ de precio explica de qué depende y remite a la visita.
- **Fotos nuevas en la guía:** no hay originales identificados de fratasado en interior ni de
  pulido en exterior más allá de los que ya se usan. El modelo admite añadirlas en cuanto lleguen.
- **H2 en las secciones con antetítulo** (Muestrario, Ficha técnica, Obra, FAQ): siguen siendo
  etiquetas, no encabezados. Convertirlas cambia el diseño de las seis páginas; no hacía falta
  para esta receta.
- **Titles por encima de 60 caracteres** con la marca: pulido 70, impreso 69, desactivado 68. La
  parte que importa va delante; si Google corta, corta «| Pavimentos Albufera».
- **Blog, zonas, redirecciones:** fuera de este encargo (otros agentes / otra decisión).

## 8. Cómo medirlo

En Search Console, a las **8–12 semanas** de desplegar, filtrando por página:

- `/hormigon-fratasado/`: posición media de «hormigon fratasado», «hormigon fratasado valencia»,
  «suelo fratasado valencia», «pavimento fratasado valencia», «hormigon fratasado colores
  valencia», «hormigon fratasado exterior». Objetivo: que la página nueva recupere el 5,8 que tenía
  la vieja y suba por encima de él.
- `/hormigon-pulido/`: «hormigon pulido exterior» (que vuelva a salir esta URL) y «hormigon pulido
  valencia».
- `/hormigon-lavado/` y `/hormigon-desactivado/`: que **cada consulta tenga una sola URL**
  (pestaña Páginas de cada consulta). Si «hormigón lavado» empieza a sacar las dos, hay
  canibalización y hay que diferenciarlas más.
- Al desplegar: **Inspección de URLs → Solicitar indexación** de las seis.

## 9. Cómo se aplica a una página nueva (la receta como lista)

1. Busca en GSC las consultas de la página en posición 5–20 y agrúpalas por intención.
2. Mira el top 5 de Google ES para la principal: qué secciones y preguntas tienen.
3. Title: búsqueda principal + variante útil; meta de ~150 con para qué, dónde y qué hay.
4. Escribe en `packages/content/src/data/services.ts` el `guide` del servicio: `intro` con la
   respuesta directa, y un bloque H3 por variante (interior, exterior, colores…) más uno de
   comparación con el servicio vecino. Enlaces con `[texto](/ruta/)`; lo que solo sabe el dueño,
   `{{qué falta}}`.
5. Añade a `faqRefs` las preguntas propias (pool en `data/faq.ts`) y `priceFactors`.
6. `pnpm content:validate` comprueba que los enlaces de la guía apuntan a páginas que existen.
7. Gates: `content:validate → lint → typecheck → build → verify`.
