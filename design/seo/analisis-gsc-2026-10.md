# Análisis de Search Console — octubre 2026

Fuente: exportación de rendimiento de pavimentos-albufera.com, búsqueda web, «últimos 3 meses».
Aunque el filtro dice «últimos 3 meses», el gráfico diario solo cubre **del 18-09 al 19-10-2026**.
En ese periodo hubo 85 clics, 5.902 impresiones y 365 consultas. Son cifras pequeñas: cualquier
conclusión sobre una consulta concreta con menos de unas 50 impresiones es ruido.

## 1. Lectura general

| Tramo | Impresiones/día | Clics/día | Posición media |
|---|---|---|---|
| 18-09 → 01-10 | ~180 | ~3,2 | ~11 |
| 02-10 → 19-10 | ~188 | ~2,2 | ~21 |

- Las impresiones se mantienen. La posición media empeora de golpe a partir del 02-10.
- Las URLs nuevas entran muy abajo:
  - `/hormigon-impreso/`: 44,5
  - `/hormigon-pulido/`: 44,9
  - `/microcemento/`: 33
  - `/hormigon-desactivado/`: 34

  Muchas URLs viejas de WordPress, que ya redirigen, conservaban posiciones mejores. Es el patrón
  típico de una migración que aún está a medias: Google tarda semanas en pasar las señales de la
  URL vieja a la nueva por la 301.
- **Hay que confirmar la fecha exacta del cambio de WordPress a Next.js.** Si fue hacia el 01-10,
  la caída encaja con la migración.
- En ordenador la posición media es 21,2 y en móvil 9,5.
- Hay decenas de consultas conversacionales:
  - «podrías ponerme una imagen»
  - «dame más imágenes»
  - «te envío foto»

  Muy probablemente son de AI Mode de Google, que Search Console cuenta como impresiones. Eso
  explica parte de las «posición 1 con 0 clics». No son búsquedas que podamos trabajar.

## 2. Consultas en posición 5–20 (las que suman ≥ 10 impresiones)

| Consulta | Impr. | Clics | Pos. | Grupo |
|---|---|---|---|---|
| hormigon pulido valencia | 319 | 0 | 13,2 | Pulido |
| hormigon fratasado | 241 | 1 | 10,1 | Fratasado |
| hormigon pulido | 174 | 0 | 17,2 | Pulido |
| pavimentos de hormigón | 145 | 0 | 13,5 | Genérica |
| hormigon fratasado valencia | 50 | 0 | 14,8 | Fratasado |
| hormigón impreso en moraira | 46 | 0 | 11,7 | Zona |
| hormigón impreso en denia | 39 | 0 | 6,6 | Zona |
| pavimento fratasado valencia | 38 | 0 | 7,6 | Fratasado |
| suelo fratasado valencia | 37 | 1 | 9,8 | Fratasado |
| hormigón fratasado | 35 | 0 | 14,2 | Fratasado |
| hormigon fratasado colores valencia | 33 | 0 | 7,7 | Fratasado |
| hormigón pulido valencia | 33 | 0 | 11,6 | Pulido |
| pavimento fratasado | 32 | 0 | 17,6 | Fratasado |
| hormigon impreso color arena | 31 | 0 | 5,5 | Impreso |
| hormigon fratasado exterior valencia | 28 | 0 | 8,4 | Fratasado |
| pavimentos de hormigón pulido en moraira | 27 | 0 | 14,3 | Zona |
| fratasado de hormigón | 25 | 0 | 5,1 | Fratasado |
| fratasado valencia | 25 | 0 | 8,8 | Fratasado |
| hormigon pulido exterior valencia | 25 | 0 | 14,7 | Pulido |
| cemento fratasado precio valencia | 21 | 0 | 16,2 | Fratasado |
| pavimentos lavados | 21 | 0 | 18,9 | Lavado |
| pulido de hormigon valencia | 20 | 0 | 16,0 | Pulido |
| hormigón impreso color arena | 18 | 0 | 8,1 | Impreso |
| pavimentos de hormigón valencia | 18 | 0 | 17,6 | Genérica |
| presupuesto pavimentos valencia | 16 | 0 | 19,2 | Genérica |
| suelo fratasado | 14 | 0 | 14,6 | Fratasado |
| pavimentos de hormigon pulido | 13 | 0 | 20,2 | Pulido |
| fratasado hormigon | 12 | 0 | 7,3 | Fratasado |
| fratasado de hormigon | 11 | 0 | 9,7 | Fratasado |
| hormigon fratasado exterior | 11 | 0 | 19,7 | Fratasado |

Por grupos, entre las posiciones 5 y 20:

| Grupo | Impresiones |
|---|---|
| Fratasado | ~650 |
| Pulido | ~610 |
| Genérica («pavimentos de hormigón…») | ~180 |
| Zonas (Moraira, Dénia) | ~110 |
| Impreso por color | ~50 |

Fuera de ese tramo, en posición 1–2, están:

| Consulta | Impresiones |
|---|---|
| hormigon pulido exterior / hormigón pulido exterior | 315 |
| hormigon lavado / hormigón lavado | 166 |
| acabado fratasado | 55 |
| hormigon fratasado color arena | 30 |

## 3. Páginas en posición 5–20

**URLs nuevas.** Son las que hay que hacer subir:

| Página | Impr. | Clics | Pos. |
|---|---|---|---|
| /hormigon-fratasado/ | 535 | 4 | 15,6 |
| /hormigon-lavado/ | 187 | 5 | 17,5 |
| /proyectos/corbera-fratasado-arena/ | 203 | 1 | 11,6 |
| /proyectos/moraira-impreso-adoquin-arena/ | 120 | 1 | 14,1 |
| /acabados/espiga/ | 67 | 3 | 6,8 |
| /zonas/denia/ | 44 | 1 | 19,4 |
| /acabados/manta/ | 43 | 0 | 7,0 |
| /presupuesto/ | 38 | 1 | 19,6 |
| /acabados/ | 36 | 0 | 15,5 |
| /proyectos/moncada-impreso-espiga-117/ | 32 | 1 | 7,3 |
| /blog/guia-hormigon-pulido/ (vacío) | 27 | 1 | 20,7 |
| /blog/hormigon-desactivado-piedra-vista/ (vacío) | 54 | 0 | 12,1 |

**URLs viejas de WordPress.** Google todavía las muestra, y lo que importa es adónde redirigen:

| URL vieja | Impr. | Pos. | Redirige hoy a | Diagnóstico |
|---|---|---|---|---|
| /brillo-y-elegancia-explorando-el-hormigon-pulido/ | 737 | 17,1 | /blog/guia-hormigon-pulido/ | 🔴 A un artículo **vacío** |
| /hormigon-pulido-alicante-transformando-espacios-con-elegancia-y-durabilidad/ | 434 | 6,7 | — | 🔴 **404**, sin redirección |
| /hormigon-fratasado-fino-decorativo-en-viviendas/ | 427 | 5,8 | /hormigon-fratasado/ | ✅ Correcto. Era la mejor página de la web (8 clics) |
| /pavimentos-de-hormigon-valencia/ | 179 | 35,0 | /empresa/ | ⚠️ El título de `/` es «Pavimentos de hormigón en Valencia»; `/empresa/` es «Quiénes somos» |
| /pavimentos-de-caucho/ | 242 | 43,9 | / | Decisión 6 de design/05 pendiente |
| /hormigon-pulido-en-ribarroja-del-turia/ | 111 | 10,1 | /zonas/ribarroja/ | ✅ |
| /pavimentos-de-hormigon-impreso-innovacion-y-estilo-para-tus-espacios/ | 86 | 12,9 | /hormigon-impreso/ | ✅ |
| /hormigon-impreso-en-moraira/ | 65 | 15,4 | /zonas/moraira/ | ✅ |
| /precios/ | 42 | 40,0 | — | 🔴 **404**. La ruta se retiró y no se dejó redirección |

## 4. Acciones, por orden

### A. Arreglar las redirecciones que rompen la cadena (código, espera orden)

- `/brillo-y-elegancia-explorando-el-hormigon-pulido/` → `/hormigon-pulido/`.
- `/hormigon-pulido-alicante-transformando-espacios-con-elegancia-y-durabilidad/` →
  `/hormigon-pulido/`.
- `/precios/` → `/presupuesto/`.
- `/pavimentos-de-hormigon-valencia/` → `/`, en lugar de a `/empresa/`.
- Quitar los 3 artículos vacíos con una 301 a su servicio. Ya estaba propuesto en
  estado-y-decisiones §7.

**Por qué:** una 301 transfiere relevancia solo si el destino responde a la misma búsqueda.
Las dos URLs de pulido suman unas 1.170 impresiones. Ahora mismo una acaba en un artículo sin
cuerpo y la otra en un 404, así que esas señales se pierden en lugar de llegar a `/hormigon-pulido/`.

### B. Lo que puede hacer el dueño hoy, sin código

- En Search Console, usar **Inspección de URLs → Solicitar indexación** en:
  - `/hormigon-fratasado/`
  - `/hormigon-pulido/`
  - `/hormigon-impreso/`
  - `/hormigon-lavado/`
  - `/zonas/denia/`
  - `/zonas/moraira/`
- Volver a enviar el sitemap.
- Usar el informe **Páginas** para ver cuántas URLs están «Rastreadas: actualmente sin indexar».

### C. `/hormigon-fratasado/`: el grupo con más recorrido

Tiene unas 650 impresiones en posición 5–20, con muchas variantes de la misma búsqueda:
- suelo / pavimento / cemento fratasado
- Valencia
- exterior
- colores

La URL vieja ocupaba la posición 5,8 y la nueva la 15,6. Hay que comprobar que la página nueva
cubre lo mismo que la vieja:
- vivienda e interior
- exterior
- colores, con el color arena del proyecto de Corbera

Con eso basta, sin crear páginas nuevas, porque todas esas consultas tienen la misma intención.
El texto nuevo necesita la aprobación del dueño.

### D. Pulido: hay que decidir lo del exterior

- «hormigón pulido exterior» está en posición 1 con unas 315 impresiones. Esa posición la ganó
  un artículo viejo.
- La página nueva se titula «Interior e industrial» y dice que el pulido resbala en exterior con
  paso descalzo.
- Pregunta para el dueño: ¿hacéis pulido en exterior, por ejemplo garajes, rampas o porches?
  - Si la respuesta es sí: añadir una sección honesta sobre dónde sí y dónde no.
  - Si la respuesta es no: aceptar perder esa consulta. No hay que posicionar algo que no se vende.

### E. Zonas de Dénia y Moraira

- «hormigón impreso en denia» está en posición 6,6.
- «hormigón impreso en moraira» está en posición 11,7.
- «pavimentos de hormigón pulido en moraira» está en posición 14,3.

Las páginas de zona existen, pero no reciben enlaces internos y usan las FAQ de plantilla.
Para mejorarlas:
- enlazarlas desde el servicio y desde el proyecto
- escribir un texto propio para cada zona
- en Moraira, añadir la segunda obra (sillería 113, con fotos sin usar), que encaja con el
  prototipo de páginas a partir de las fotos

### F. Ficha de Google Business Profile

Para «pavimentos de hormigón (en) Valencia» y «presupuesto pavimentos valencia», Google enseña
primero el mapa. Eso se trabaja desde la ficha, no desde la web.

### Qué no perseguir

Estas consultas no se trabajan desde esta web:
- caucho y parques infantiles
- pickleball y pádel, que van a padelalbufera.com
- «packaging alicante»
- las consultas conversacionales de AI Mode
