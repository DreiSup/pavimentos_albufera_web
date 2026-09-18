# Handoff — Pavimentos Albufera · rediseño y migración WordPress → Next.js

## 1. Qué es esto

Paquete de entrega para implementar el rediseño completo de **pavimentos-albufera.com** en un
repositorio nuevo, desplegado en GitHub + Vercel. Contiene la especificación de diseño,
el modelo de datos con el catálogo real de la empresa, el mapa de redirecciones 301 de la
migración y las instrucciones de despliegue.

**Objetivo del proyecto:** convertir un folleto de servicios en un catálogo de obra documentada.
Cada trabajo con su ficha —modelo, color, m², municipio, año— y un muestrario navegable que
responde a la única pregunta que importa: *¿cómo va a quedar lo mío?*

## 2. Sobre los archivos de diseño

`Pavimentos Albufera.dc.html` es una **referencia de diseño creada en HTML**: un prototipo que
muestra aspecto y comportamiento previstos. **No es código de producción y no debe copiarse.**
Ábrelo en el navegador y úsalo como fuente de verdad visual mientras implementas.

La tarea es **recrear esos diseños en Next.js 15 con App Router y Tailwind**, siguiendo la
especificación de este paquete. El prototipo está escrito con estilos en línea por motivos de
la herramienta con la que se hizo; en producción los estilos van con clases de Tailwind
apoyadas en los tokens de `tokens.css`.

Cómo leer el prototipo:

- La barra negra superior conmuta entre pantallas: `01 SISTEMA`, `02 HOME`, `03 MUESTRARIO`,
  `04 SERVICIO`, `05 PROYECTO`, `06 PRECIOS`.
- A la derecha, el conmutador `390 / 1440` cambia entre la maqueta móvil y la de escritorio.
  **Las dos son normativas**: no son la misma pantalla reflowed, hay decisiones distintas
  documentadas en `02-pantallas.md`.
- `01 SISTEMA` es la lámina de tokens y componentes. Empieza por ahí.
- Interacciones reales que puedes probar: filtros del muestrario (incluido el estado
  «sin resultados»), acordeón de FAQ, submenú de la página de servicio y la calculadora
  de precios. ⚠️ **La calculadora solo existe en el prototipo**: se retiró del sitio el
  2026-09-18 (§7 y `02-pantallas.md §A5`). El prototipo no se reescribe hacia atrás.

## 3. Fidelidad

**Alta fidelidad (hi-fi).** Colores, tipografías, escala, espaciado y estados son definitivos.
Reprodúcelos exactamente: los valores están en `01-sistema-de-diseno.md` con hex y píxeles.

Dos avisos:

- **Radio de borde 0 en todo el sitio.** Ni tarjetas, ni botones, ni campos, ni imágenes.
  Es una decisión de identidad, no un olvido.
- **Una sola sombra en todo el sitio**: la de la barra fija de móvil. Nada más lleva sombra.

## 4. Estado del diseño: qué está maquetado y qué se deriva

| Pantalla | Ruta | Estado |
|---|---|---|
| Home | `/` | ✅ Maquetada, móvil y escritorio |
| Servicio (impreso) | `/hormigon-impreso/` | ✅ Maquetada. **Plantilla** de los otros 5 servicios |
| Muestrario | `/acabados/` | ✅ Maquetada, con filtros y estado vacío |
| Ficha de proyecto | `/proyectos/[slug]/` | ✅ Maquetada (Moncada). **Plantilla** de las 11 obras |
| ~~Precios~~ | ~~`/precios/`~~ | ⛔ **Retirada del sitio el 2026-09-17**, decisión del dueño: no quiere precios en la web. Ver `02-pantallas.md §A5` |
| Lámina de sistema | — | ✅ Tokens y componentes base |
| Presupuesto | `/presupuesto/` | 📐 Especificada en `02-pantallas.md §B1`, sin maquetar |
| Ficha de acabado | `/acabados/[modelo]/` | 📐 Especificada en `§B2` |
| Índice de proyectos | `/proyectos/` | 📐 Especificada en `§B3` |
| Página de zona | `/zonas/[municipio]/` | 📐 Especificada en `§B4` |
| Empresa | `/empresa/` | 📐 Especificada en `§B5` |
| Blog e artículo | `/blog/`, `/blog/[slug]/` | 📐 Especificada en `§B6` |
| Legal | `/aviso-legal/` etc. | 📐 Especificada en `§B7` |
| 404 | — | 📐 Especificada en `§B8` |

Las pantallas marcadas 📐 **no requieren decisiones de diseño nuevas**: se componen con los
componentes ya aprobados y su copy está en el documento maestro. `02-pantallas.md` da para
cada una la rejilla, los componentes que la forman y el copy literal.

Fuera de alcance de esta entrega, por decisión del cliente: `/obra-publica/` (pavimentos de
caucho) y las 5 páginas de servicio restantes, que se derivan de la plantilla de impreso.

## 5. Archivos de este paquete

| Archivo | Contenido |
|---|---|
| `README.md` | Este documento. Empieza aquí |
| `CLAUDE.md` | Instrucciones para el repositorio. Cópialo a la raíz del repo nuevo |
| `01-sistema-de-diseno.md` | Tokens, escala tipográfica y los 14 componentes base con valores exactos |
| `02-pantallas.md` | Especificación pantalla por pantalla, móvil y escritorio |
| `03-modelo-de-contenido.md` | Tipos TypeScript, catálogo real y datos de las obras |
| `04-desarrollo-y-deploy.md` | Estructura Next.js, redirecciones 301, schema, GitHub y Vercel |
| `05-pendientes-y-decisiones.md` | Datos sin confirmar y decisiones de diseño tomadas |
| `06-plan-rendimiento-y-medicion.md` | 🆕 Plan ejecutable de velocidad, GA4/Meta/Ads y landings de campaña, por olas |
| `07-auditoria-decisiones-y-veredictos.md` | 🆕 El porqué del 06: las 8 decisiones arbitradas y los veredictos de landings |
| `tokens.css` | Variables CSS listas para pegar |
| `tailwind.config.ts` | Configuración de Tailwind con los tokens |
| `data/acabados.json` | 16 acabados del muestrario, con obra asociada |
| `data/proyectos.json` | Las obras documentadas |
| `data/zonas.json` | Municipios con obra ejecutada |
| `Pavimentos Albufera.dc.html` | El prototipo. Referencia visual, no código |
| `rediseno-pavimentos-albufera.md` | Documento maestro original del cliente |

## 6. Stack (del §9.1 del documento maestro)

| Pieza | Elección |
|---|---|
| Framework | Next.js 15, App Router |
| Renderizado | SSG + ISR |
| Estilos | Tailwind con los tokens de `tokens.css` |
| Contenido | MDX en el repositorio (los JSON de `data/` como punto de partida) |
| Imágenes | `next/image`, AVIF/WebP |
| Formularios | Server Actions + Resend, honeypot y límite de envíos |
| Despliegue | Vercel |
| Analítica | GA4 + Search Console con consentimiento RGPD |

Objetivos de rendimiento, no negociables: **LCP < 2,0 s en 4G · CLS < 0,05 · INP < 200 ms ·
JS inicial ≤ 112 kB brotli q11 por ruta** —techo duro; objetivo 105 kB. La unidad y el ámbito,
en `CLAUDE.md`. La web actual está muy lejos; es la ganancia más automática de la migración.
Cualquier dependencia que ponga en riesgo el presupuesto de JS se descarta.

## 7. Interacciones y comportamiento

Recogido en detalle en `02-pantallas.md`. Resumen:

- **Filtro del muestrario.** ⚠️ Corregido el 2026-09-18: aquí decía «filtros del muestrario y del
  índice de proyectos, dos ejes combinables», y ya no queda ni una de las tres cosas.
  `/proyectos/` no tiene filtros —se retiraron—, y al muestrario le queda **un solo eje**, el de
  técnica, desde el 2026-09-17 (`02` §A3). Filtra en cliente sobre datos ya cargados: sin salto de
  red, sin estado de carga. El filtro aplicado se refleja en la URL como query param para que el
  estado sea compartible, y **la URL se valida contra las mismas opciones que la barra**: un
  `?tecnica=` que no está entre los chips no se aplica. Con cero resultados aparece el estado
  vacío, que **no es un error**: dice que solo se enseñan acabados ejecutados de verdad y ofrece
  quitar filtros o preguntar.
- **Acordeón de FAQ.** Uno abierto de inicio, el resto cerrados. Al abrir uno se cierra el
  anterior. Implementar con `<details>`/`<summary>` o con botón + `aria-expanded`.
- **Submenú de la página de servicio.** Anclado bajo la cabecera en escritorio. Marca en ocre
  la sección seleccionada. **En producción debe seguir el scroll** con un IntersectionObserver
  (`rootMargin: '-150px 0px -55% 0px'`): en el prototipo solo responde al clic por una
  limitación del entorno de previsualización, no por diseño.
- ~~**Calculadora de precios.**~~ ⛔ **Retirada del sitio el 2026-09-18**, decisión del dueño:
  no quiere precios en la web, ni en una página propia ni dentro de las de servicio. El
  componente ya no existe. Su especificación, en pasado, en `02-pantallas.md §A5`.
- **Formulario de presupuesto.** Cuatro estados: vacío, error de teléfono, enviando y
  confirmación. Validación de teléfono a 9 cifras en cliente y en servidor.
- **Movimiento** (§8.6): aparición suave de secciones al entrar en pantalla, una sola vez;
  transición de la rejilla al filtrar; sombra de la barra fija de móvil al despegarse del hero.
  Nada más. `prefers-reduced-motion: reduce` desactiva todo lo anterior.

## 8. Estado de la aplicación

Casi todo es estático. El estado de cliente es local a cada pantalla:

| Pantalla | Estado | Persistencia |
|---|---|---|
| Muestrario | `tecnica`, `color` | Query params en la URL |
| Índice de proyectos | `servicio`, `modelo`, `municipio`, `anio` | Query params |
| Servicio | `seccionActiva` (submenú), `faqAbierta` | Ninguna |
| Presupuesto | `campos`, `errores`, `estadoEnvio` | Ninguna |
| Global | `menuMovilAbierto` | Ninguna |

Sin gestor de estado global. Sin cliente de datos: todo llega por props desde el servidor.

## 9. Accesibilidad — suelo de calidad (§8.7)

- Diseño móvil primero. La mayoría del tráfico del sector llega desde el móvil.
- **Objetivos táctiles de 44 px mínimo**, incluidos enlaces del pie y migas de pan.
- **Foco de teclado visible** en todo elemento interactivo: `outline: 2px solid #D9A441;
  outline-offset: 2px` sobre fondo claro, y `#D9A441` sobre oscuro. Nunca `outline: none`.
- **Contraste AA.** El ocre `#D9A441` **no cumple** sobre fondo claro en texto pequeño: solo
  como relleno de botón con texto en `--tinta`, en superficies grandes o sobre fondo oscuro.
- Un solo `<h1>` por página. Jerarquía de encabezados sin saltos.
- Los campos de formulario llevan `<label>` real, no `placeholder` como etiqueta.
- Errores de formulario con `aria-live="polite"` y `aria-invalid` en el campo.

## 10. Fotografía — regla innegociable (§8.5)

**Cero fotos de stock de personas.** Solo entra: obra terminada a 1600 px mínimo de ancho
(suelo duro 800 px — `design/05` §C #13, que supersede los 2400 px del documento maestro),
obra en ejecución, detalle macro de textura para el muestrario, y equipo real si están dispuestos.

Mientras no lleguen los originales, **no se usan imágenes provisionales**: se usa el
componente *bloque de posición* (`01-sistema-de-diseno.md §3.11`), un sólido en `--fondo-alt`
con trama diagonal y la ficha del trabajo sobrepuesta. Cuando entre la foto buena, la ficha
se queda exactamente donde está.

Nomenclatura de archivo obligatoria: `municipio-servicio-modelo-color-año.jpg` →
`moncada-impreso-espiga-117-2025.jpg`. **El nombre de archivo no se muestra nunca en pantalla**:
es anotación de producción y SEO de imagen, no contenido.

⚠️ **Bloqueante de calendario:** las imágenes en producción están a 500×400 px. Sin originales
a resolución completa el muestrario no funciona. Resolver antes de maquetar.

## 11. Cómo empezar (con Claude Code)

```bash
# 1. Repo nuevo
npx create-next-app@latest pavimentos-albufera --ts --tailwind --app --eslint
cd pavimentos-albufera

# 2. Copia el paquete de handoff dentro del repo
cp -r <ruta>/design_handoff_pavimentos_albufera ./design
cp ./design/CLAUDE.md ./CLAUDE.md
cp ./design/data/*.json ./content/
cp ./design/tokens.css ./app/tokens.css

# 3. Abre Claude Code y dale el orden de trabajo de CLAUDE.md
claude
```

Orden de implementación recomendado, cada paso desplegable y revisable:

1. **Fundamentos** — tokens, fuentes, `layout.tsx`, cabecera, pie, barra fija de móvil.
2. **Modelo de datos** — tipos, carga de los JSON de `content/`, utilidades de filtrado.
3. **Home** — es la pantalla con más componentes distintos; los deja todos construidos.
4. **Muestrario + ficha de acabado** — el elemento firma del sitio.
5. **Servicio de impreso**, y de ahí los 5 servicios restantes con la misma plantilla.
6. **Índice de proyectos + ficha de proyecto**, con las 11 obras.
7. **Presupuesto** — Server Action, Resend, honeypot, los cuatro estados.
8. ~~**Precios**, con la calculadora.~~ Paso retirado entero. La página se borró el 2026-09-17 y
   la calculadora el 2026-09-18, cuando el dueño extendió la misma decisión al componente: **el
   sitio no da un precio en ninguna pantalla.** No queda nada de este paso por construir.
9. **Empresa, zonas, blog, legales, 404.**
10. **SEO técnico** — las redirecciones 301, sitemap generado, robots, canónicas, schema.
11. **Analítica y consentimiento**, y la lista de comprobación del §12.

## 12. Comprobaciones antes de publicar

- [ ] Todos los `[corchetes]` de `05-pendientes-y-decisiones.md` sustituidos por datos reales
- [ ] Un solo teléfono y una sola dirección en todo el sitio
- [ ] Las 30 redirecciones responden 301, no 302 ni 404 — comprobadas una a una
- [ ] Ninguna página huérfana de la versión francesa sigue indexada
- [ ] Sitemap generado por Next.js, no manual
- [ ] **Sin `AggregateRating` mientras no haya reseñas reales verificables** (penalización segura)
- [ ] Formulario probado: envío correcto, error de teléfono, spam y adjunto pesado
- [ ] WhatsApp abre con mensaje predefinido
- [ ] `trailingSlash` fijo en `next.config`
- [ ] Prueba real en un móvil de gama media con 4G
- [ ] Ningún nombre de archivo de imagen visible en pantalla
- [ ] Foco de teclado visible en toda la web, navegando solo con tabulador
