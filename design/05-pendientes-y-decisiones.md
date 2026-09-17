# 05 · Pendientes y decisiones

Dos listas: lo que falta por parte del cliente, y lo que decidí yo al no tener respuesta.
Ambas son revocables; la segunda, sin coste si se cambia antes de implementar.

---

## A. Inventario de `[corchetes]`

Cada corchete del prototipo es un dato que el cliente **no ha confirmado**. Están visibles y
atenuados a propósito: el diseño no finge tener información que no tiene. Al sustituirlos, se
quita el subrayado punteado.

### A1 · Bloqueantes — sin esto no se publica

| Dato | Dónde aparece | Estado |
|---|---|---|
| **Teléfono único** `[+34 6XX XXX XXX]` / `[96X XXX XXX]` | Cabecera, pie, barra fija, todos los CTA, schema | La web actual tiene **4 teléfonos** |
| **Dirección** `[CALLE Y NÚMERO]` | Pie, schema `LocalBusiness` | La web actual tiene **2 direcciones** |
| **Reseñas reales** | Home §09 | **Cero.** Es el vacío más grave de toda la web |
| **Rangos de precio** `[28-38]`, `[35-48]`, `[30-45]`, `[22-35]`, `[55-85]`, `[30-42]` | Home §06, servicio §05, precios | Coherentes con el mercado 2026, pero tienen que ser suyos |
| ~~**Originales fotográficos** a 2400 px~~ **a 1600 px** | Toda imagen a sangre | **Ya no es bloqueante de publicación.** Superado por la decisión 13 de §C. De las 35 fotos publicadas, 16 llegan a 1600 y 19 no; el mínimo duro es 800 y lo verifica el build |

Sobre las reseñas: con 15-20 reales el sitio cambia de categoría. Hace falta Google Business
Profile activo y pedirlas a los clientes de los últimos 12 meses. Hasta entonces, la sección
queda en estado vacío y **no se marca `AggregateRating`**, porque marcarlo sin reseñas es una
penalización segura.

### A2 · Datos de obra

| Dato | Dónde |
|---|---|
| `[180]` m² de Moncada y los `[m²]` de las 8 obras restantes | Fichas, tarjetas, muestrario |
| `[año]` de 7 obras | Tarjetas y fichas |
| `[X días]` de plazo de ejecución | Ficha de obra |
| `[municipio]` de manta gris, sillería grande, piedra sillería, piedra rodena, microcemento | Muestrario, fichas de acabado |
| Narrativa `EL ENCARGO` y `LA EJECUCIÓN` de cada obra | Ficha de proyecto |
| `[ANTES]` — foto del estado previo | Galería de proyecto |

### A3 · Datos de empresa y proceso

| Dato | Dónde |
|---|---|
| `[48 horas]` de plazo de entrega del presupuesto | Home §07, servicio, precios, presupuesto |
| `[Equipo propio]` — ¿se ejecuta con equipo propio o se subcontrata? | Home §07, empresa. **Cambia uno de los cinco mensajes núcleo** |
| `[2009]` año exacto de fundación | Empresa |
| `[X.000]` m² totales ejecutados en 17 años | Empresa. Dato con mucha fuerza |
| `[100]` m² mínimos del anillo 2 | Home §11, zonas |
| `[16-25]` m² entre juntas de dilatación · `[2]` manos de sellado | Ficha técnica de servicio |
| Nombre fiscal y CIF | Textos legales y schema |

---

## B. Decisiones que tomé yo

No hubo respuesta a las preguntas iniciales, así que decidí y lo dejé por escrito en la propia
lámina de sistema para que sea revocable.

| # | Cuestión | Decisión | Por qué |
|---|---|---|---|
| 1 | El §8.2 pide máximo dos ocres por pantalla, pero la home tiene 4+ botones de acción | **Dos roles, no dos apariciones:** un CTA primario y el estado activo, con un chip marcado por grupo de selección | Contar apariciones prohíbe marcar dos filtros a la vez, que es información necesaria. Contar roles conserva el significado «aquí se actúa» |
| 2 | En móvil compiten el CTA del hero y la barra fija | **La barra fija se queda el ocre**; los CTA del hero y del cierre bajan a contorno | Es la acción persistente y la que de verdad convierte en móvil |
| 3 | Dos elementos fijos a la vez en móvil | **Solo uno:** la barra de contacto. La barra de confianza pasa con el scroll y se ancla únicamente en escritorio | Dos barras fijas en 390 px se comen la pantalla |
| 4 | No hay ni una reseña | **Estado vacío honesto** con la estructura de la tarjeta, más el dato del 30 % que repite | Inventar testimonios es la única cosa que rompería la tesis del proyecto |
| 5 | El muestrario necesitaba un inventario que el documento no traía | **16 acabados**, 8 con obra documentada y 8 con municipio entre corchetes | Ya sustituido por el catálogo real de 8 modelos × 7 colores |
| 6 | La calculadora no tenía fórmula | Rango derivado de la tabla × multiplicador de terreno (× 1,00 / 1,15 / 1,30), **con el aviso de dato sin validar a la vista** | Es mejor una calculadora honesta que ninguna, y mejor un aviso que un número inventado sin marcar |
| 7 | Faltaba copy para 5 de las 9 secciones de la página de servicio | **Reutilizar literal el §7.1 filtrado al servicio.** Cero texto nuevo | El copy nuevo lo escribe el cliente, no el diseño |
| 8 | Nombres de archivo visibles en las maquetas | **Fuera de pantalla.** Son anotación de producción y SEO de imagen | Metadato de producción colado en una pantalla de cliente |
| 9 | La escala del §8.3 no incluye 76 px, y dos H1 lo usaban | **Bajados a 64**, el valor del sistema | La escala es cerrada; si un titular no cabe, se acorta el titular |
| 10 | La monoespaciada bajaba de 12 px en varios sitios | **Tres niveles declarados** —12 antetítulo, 11 dato en escritorio, 10 dato en móvil— y suelo absoluto en 10 | Mejor declarar la escala real que fingir un suelo que no se respeta |
| 11 | Filtros con 4 ejes y 16 municipios en 390 px | **Hoja inferior**, no acordeón ni carriles | Cuatro carriles deslizantes se navegan a ciegas y un acordeón empuja la rejilla fuera de pantalla |
| 12 | El submenú de servicio no sigue el scroll en el prototipo | Marca **el ancla pulsada**, y la anotación lo dice | El entorno de previsualización no entrega eventos de scroll. En producción **sí debe seguirlo** con `IntersectionObserver` |

---

## C. Decisiones que siguen abiertas y condicionan la arquitectura

Del §11 del documento maestro. Las cinco primeras hay que cerrarlas antes de empezar a
implementar; la última afecta al copy de todo el sitio.

| # | Decisión | Impacto si no se cierra |
|---|---|---|
| 5 | ¿La versión francesa se elimina o pasa a dominio propio? | 1 redirección comodín `/fr/*` y páginas huérfanas indexadas |
| 6 | ¿Los pavimentos de caucho se mantienen como «Obra pública» o se retiran? | Existe o no `/obra-publica/`, y a dónde apunta su 301 |
| 7 | ¿URLs de servicio simplificadas o riesgo cero? | 4 redirecciones y el historial SEO de las URLs con antigüedad |
| 8 | ¿Quién edita el contenido después? | MDX en el repositorio (barato, rápido) frente a Sanity/Payload (necesario si el perfil no es técnico) |
| 9 | ¿«Tú» o «usted»? | Todo el copy. **Asumido «tú»** en el diseño |
| 10 | ¿Equipo propio o subcontrata? | Uno de los cinco mensajes núcleo |

### 13 · El mínimo fotográfico baja de 2400 px a tres umbrales — 2026-08-29

**Decidida, no abierta. Supersede al §11 del documento maestro** (`rediseno-pavimentos-albufera.md`
línea 735, *«resolución mínima de 2400 px de ancho»*), que no se edita: es la fuente, y las
decisiones se supersedan, no se reescriben encima.

**El motivo es material, no de criterio.** De las 164 fotos de la mediateca de la web viva, **una
sola supera los 2400 px y es un fondo de plantilla**. De las 35 que la web publica hoy, **ninguna**.
Un requisito que ningún original existente puede cumplir no es un listón: es una publicación
indefinidamente aplazada, y la web ya está publicando con ese material.

**Un solo número tampoco vale**, porque una foto no se ve igual a lo ancho de la ventana que en una
muestra de 1 : 1 dentro de una rejilla de cuatro columnas. Así que son tres, y los verifica
`scripts/verificar-imagenes.mjs` en cada build:

| Umbral | Valor | A qué se aplica | Si no se cumple |
|---|---|---|---|
| **Suelo** | 800 px | Toda foto publicada | 🔴 **Falla el build** |
| **A sangre** | 1600 px | La imagen servida a `sizes="100vw"` — hoy los `imagenHero` de `content/servicios.tsx` | 🔴 **Falla el build** |
| **Objetivo** | 1600 px | Lo que se pide a toda foto nueva | Se informa en una línea, no falla |

⚠️ **El objetivo no falla el build a propósito, y hay que entender por qué:** 19 de las 35 no llegan,
y **son las de obra documentada**. Convertirlo en error hoy dejaría la web sin galería de obra, que
es exactamente el maquillaje que este proyecto no hace — solo que al revés: en lugar de fingir una
foto que no hay, escondería una que sí hay. El aviso mantiene la deuda a la vista en cada build.

✅ **La puerta de a sangre sí muerde hoy y no bloquea:** los seis `imagenHero` miden 2048, 1600,
2048, 2048, 1600 y 1600. Está verificada contra un hero estrecho: falla con código 1.

---

## D. Riesgos

| Riesgo | Gravedad | Mitigación |
|---|---|---|
| **La obra documentada es la peor fotografiada** | Alta | 🔴 **Las 8 fotos de proyecto se sirven a sangre (`sizes="100vw"`, 21/9) y miden 898-1200 px, salvo Deniá a 2048.** Las de 1600+ son todas de `_sin-atribuir/`, que no se pueden fechar ni situar. O sea: la foto que mejor se ve es la que menos se puede afirmar. Mitigación real: sesión nueva en 2-3 obras recientes, a 1600 px o más. El reescalado con IA sigue sin ser admisible |
| **No llegan las reseñas** | Alta | El sitio se publica con el estado vacío. Recuperable después, pero es la pieza que más falta |
| **Precios sin validar** | Alta | Se publican entre corchetes o se retira la página de precios. Publicar cifras inventadas sin marcar sería peor que no publicarlas |
| **Se pierde posicionamiento en la migración** | Media | Comprobar las 30 redirecciones una a una antes de mover DNS, y vigilar 404 durante 8 semanas |
| **Contenido duplicado heredado** | Media | El mismo bloque de texto está repetido en 5 páginas de la web actual. No arrastrarlo: cada servicio con copy propio |
| **Páginas de zona sin obra real** | Media | Google penaliza las *doorway pages*. Solo se genera zona con proyecto documentado; la regla está en el modelo de datos |
