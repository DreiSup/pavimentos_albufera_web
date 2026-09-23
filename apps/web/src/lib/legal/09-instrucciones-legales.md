# 09 · Instrucciones para rehacer las tres páginas legales

**Para quién es este documento.** Para la sesión que va a reescribir `/aviso-legal/`,
`/politica-de-privacidad/` y `/politica-de-cookies/` de pavimentos-albufera.com. Es la
continuación de `08 · Contexto legal del sitio`: ese documento dice qué hace el sitio, este dice
qué tiene que decir cada página y por qué.

**Toda afirmación legal de aquí está verificada** contra el BOE consolidado, el PDF publicado por
la AEPD y la sentencia del Tribunal General. Lleva norma, artículo y enlace. Lo que no se pudo
verificar está marcado como tal.

🔴 **Nada de esto es asesoramiento jurídico.** Es material técnico para que el dueño y una
asesoría decidan. Un texto legal publicado responde ante un organismo que sanciona.

---

## 0 · Reglas de trabajo para esta sesión

1. **No inventes ningún dato del titular.** Los datos que faltan van como marcador literal
   `[PENDIENTE: …]` dentro del texto publicado, visible, para que el dueño los vea y los rellene.
   Nunca rellenes un domicilio, un tomo registral o un plazo de conservación "de ejemplo".
2. **No toques código de consentimiento ni de tracking en esta tarea.** La sección 6 enumera lo que
   hay que cambiar en código: es un encargo distinto, con aprobación distinta. Esta tarea es texto.
3. **Los tres documentos se rehacen, no se corrigen.** El texto heredado contiene afirmaciones
   falsas sobre lo que hace el sitio. Parchearlas deja contradicciones.
4. **No prometas en el texto nada que el código no haga.** Es el error que trajo hasta aquí: la
   política actual promete que no hay cesiones y hay cuatro destinos. Antes de escribir una frase
   sobre comportamiento del sitio, compruébala en el repo.
5. **Si una decisión es del dueño, no la tomes.** Plazos de conservación, finalidades y qué
   proveedores se mantienen son decisiones suyas. Déjalas como marcador y avisa.

---

## 1 · Datos del titular

| Campo | Valor |
|---|---|
| Razón social | Pavimentos Albufera Sociedad Limitada |
| CIF | B02882090 |
| Domicilio social | 🔴 `[PENDIENTE: calle, número, CP y municipio]` — el sitio muestra Sollana (46430, Valencia), pero calle y número no los ha dado nadie |
| Datos registrales | 🔴 `[PENDIENTE: Registro Mercantil, tomo, folio, hoja, inscripción]` — sale de la escritura de constitución o de una nota simple |
| Correo | comercial@pavimentos-albufera.com |
| Teléfono | Vive en `NEXT_PUBLIC_TELEFONO`. Úsalo desde `lib/config.ts`, no lo escribas a mano |
| Actividad | Pavimentos de hormigón: impreso, pulido, lavado, fratasado, desactivado y microcemento |
| Dominio | pavimentos-albufera.com |
| Alojamiento | Vercel |

---

## 2 · Aviso legal

### 2.1 Lo obligatorio: artículo 10.1 de la LSSI

Ley 34/2002, texto consolidado, última modificación 23 de enero de 2025.
<https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758>

El prestador está obligado a disponer de los medios que permitan acceder por medios electrónicos,
de forma permanente, fácil, directa y gratuita, a:

| Letra | Qué exige | ¿Aplica? |
|---|---|---|
| a) | Denominación social; domicilio; correo electrónico; y cualquier otro dato que permita comunicación directa y efectiva | **Sí.** El teléfono entra por esta vía |
| b) | Los datos de su inscripción en el Registro Mercantil en el que, en su caso, se encuentren inscritos | **Sí, obligatorio.** El "en su caso" no exime: una S.L. adquiere personalidad jurídica por la inscripción, luego está inscrita |
| c) | Datos de autorización administrativa previa | No. La actividad no la requiere |
| d) | Profesión regulada: colegio, número, título | No |
| e) | Número de identificación fiscal | **Sí** — B02882090 |
| f) | Cuando el servicio haga referencia a precios, información clara y exacta sobre el precio, indicando si incluye impuestos | **Hoy no.** Los precios se retiraron del sitio el 2026-09-18. Si vuelven a publicarse precios, esta letra vuelve a ser exigible |
| g) | Códigos de conducta a los que esté adherido y cómo consultarlos | Solo si el dueño está adherido a alguno. `[PENDIENTE: confirmar. Si no, se omite la fila entera, no se escribe "ninguno"]` |

**Nota sobre el artículo 9.** El texto heredado y buena parte de internet citan el art. 10.1.b)
como "los datos de su inscripción en el Registro a que se refiere el artículo 9". Ese artículo 9
figura hoy como **(Sin contenido)** en el consolidado: fue suprimido por la Ley 56/2007. La
redacción vigente nombra directamente al Registro Mercantil. Cita la vigente.

**Sanciones, para calibrar el riesgo.** No informar de b), c), d), e) o g) es infracción **leve**,
multa de hasta 30.000 euros (art. 38.4.b y 39.1.c). El incumplimiento significativo de a) o f) es
**grave**, de 30.001 a 150.000 euros (art. 38.3.b y 39.1.b).

### 2.2 Lo que es costumbre, no obligación

Se puede incluir y es razonable, pero el art. 10 no lo pide. Decidlo así al dueño para que sepa
dónde gastar asesoría:

- Propiedad intelectual e industrial del sitio y su contenido.
- Condiciones de uso y conducta del usuario.
- Exclusión de responsabilidad por enlaces a terceros.
- Ley aplicable y fuero.

### 2.3 Lo que sobra

**La sección de protección de datos dentro del aviso legal se elimina entera.** Duplica la política
de privacidad y hoy la contradice. El aviso legal identifica al titular; la privacidad explica el
tratamiento. Un enlace entre ambas basta.

Elimina también cualquier frase heredada que describa el sitio y no sea cierta. En particular, la
que dice que la web está hecha con Next.js y **shadcn**: este repo usa Tailwind con
`class-variance-authority`. Esa frase no debe aparecer en ninguna página publicada.

---

## 3 · Política de privacidad

### 3.1 Errores del texto heredado que hay que hacer desaparecer

No los corrijas: el documento se reescribe. Están aquí para que compruebes que ninguno sobrevive.

1. Se apoya en la **Ley Orgánica 15/1999 (LOPD)** y su reglamento. La LO 3/2018, disposición
   derogatoria única, la deroga expresamente. <https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673>
2. Promete que los datos serán incorporados a **ficheros declarados ante la AEPD**. Ese registro
   de ficheros no existe desde el RGPD.
3. Enumera **solo los derechos ARCO**. Faltan cinco.
4. Afirma que **los datos no serán cedidos a terceras organizaciones**. Es falso: hay cuatro
   destinos, dos fuera del EEE.
5. Dice que las cookies **desaparecen al terminar la sesión**. Es falso: duran 90 y 180 días.

### 3.2 La lista del artículo 13 del RGPD, aplicada

Reglamento (UE) 2016/679. <https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32016R0679>

| Art. 13 | Qué poner |
|---|---|
| 13.1.a | Identidad y datos de contacto del responsable: Pavimentos Albufera S.L., CIF, domicilio, correo |
| 13.1.b | Delegado de protección de datos: `[PENDIENTE: confirmar si hay. Probablemente no procede; el art. 37 RGPD solo lo exige en tres supuestos y ninguno encaja]` |
| 13.1.c | Fines del tratamiento **y base jurídica de cada uno** — ver 3.3 |
| 13.1.d | Interés legítimo, si se invoca alguno |
| 13.1.e | Destinatarios o categorías de destinatarios — ver 3.4 |
| 13.1.f | Transferencias internacionales, con el mecanismo concreto — ver 3.5 |
| 13.2.a | Plazo de conservación, o criterios para determinarlo — ver 3.6 |
| 13.2.b | Derechos: acceso, rectificación, supresión, limitación, oposición, portabilidad |
| 13.2.c | Derecho a retirar el consentimiento en cualquier momento, sin que afecte a la licitud del tratamiento previo |
| 13.2.d | Derecho a reclamar ante la AEPD, con enlace a <https://www.aepd.es> |
| 13.2.e | Si los datos son requisito legal o contractual, si hay obligación de facilitarlos y las consecuencias de no hacerlo |
| 13.2.f | Decisiones automatizadas y elaboración de perfiles. `[PENDIENTE: decidir cómo describir el envío de datos a Meta y Google para segmentación publicitaria]` |

**Lo que el RGPD NO obliga a informar,** y que muchas plantillas meten por inercia: el plazo de un
mes para responder y la gratuidad del ejercicio de derechos. Los arts. 12.3 y 12.5 obligan a
*cumplirlos*, no a *informarlos*. No los pongas como obligación; si se incluyen, que sea como
cortesía.

### 3.3 Base jurídica por finalidad — el punto que hay que acertar

**Atender la solicitud de presupuesto → artículo 6.1.b del RGPD**, medidas precontractuales
adoptadas a petición del interesado.

🔴 **La casilla de privacidad del formulario NO es la base jurídica.** Es cumplimiento del deber de
información del art. 13. Si se documenta como consentimiento, el usuario puede retirarlo y la
empresa pierde la legitimación para contestar su propio presupuesto. Redáctalo como 6.1.b.

**Meta Pixel, Meta CAPI, Google Ads y GA4 → artículo 6.1.a**, consentimiento. Son dos capas
distintas y hay que decirlo así: el consentimiento del art. 22.2 LSSI para escribir y leer cookies
en el dispositivo, y el consentimiento del art. 6.1.a RGPD para tratar los datos que salen de ahí.

### 3.4 Destinatarios: encargados, no cesiones

**Corrección de encuadre importante.** Resend, Telegram, Vercel, Google y Meta no son "cesiones a
terceras organizaciones". Son **encargados del tratamiento** (art. 28 RGPD) o, en el caso de Meta
y Google para publicidad, posibles corresponsables. La diferencia práctica: un encargado se
legitima con un **contrato del art. 28.3**, no con el consentimiento del interesado. La política
los informa como destinatarios; no pide consentimiento "para ellos".

| Destino | Qué recibe | Encuadre |
|---|---|---|
| Resend (EE. UU.) | Todo el formulario, incluida la foto | Encargado. Entrega del correo |
| Telegram FZ-LLC (Dubái) | Nombre, teléfono, correo, servicio, municipio, origen, referencia | Encargado. Aviso interno |
| Vercel (EE. UU.) | Alojamiento y logs | Encargado |
| Meta | Hashes de teléfono, correo y municipio; en claro IP, user-agent, URL, `_fbp`, `_fbc` | Publicidad. Consentimiento |
| Google (GA4 y Ads) | Eventos de navegación y de lead | Analítica y publicidad. Consentimiento |

🔴 `[PENDIENTE: nadie ha comprobado si existen contratos del art. 28.3 con ninguno de los cinco.]`
Resend, Vercel, Google y Meta publican DPA estándar que se aceptan en su panel. **Telegram no
ofrece DPA para la Bot API.** Eso no se arregla redactando: o se firma algo, o Telegram sale del
flujo de datos personales. Marca esto al dueño como decisión, no lo resuelvas escribiendo.

### 3.5 Transferencias internacionales — el marco en vigor

Comprobado el 2026-09-18. Aquí es donde circula más información caducada por internet, así que el
estado es este:

**Estados Unidos.** La decisión de adecuación de 10 de julio de 2023, el EU-US Data Privacy
Framework, **está en vigor**. El Tribunal General desestimó el recurso de Philippe Latombe el 3 de
septiembre de 2025 (asunto T-553/23) y confirmó su validez. Latombe recurrió el 31 de octubre de
2025 ante el Tribunal de Justicia, asunto **C-703/25 P**, pendiente. Ningún tribunal la ha anulado.

- Decisión: <https://eur-lex.europa.eu/eli/dec_impl/2023/1795/oj>
- Lista de decisiones de adecuación de la Comisión: <https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en>

🔴 **El DPF solo cubre a proveedores certificados.** Hay que comprobar cada uno en la lista del
Departamento de Comercio, <https://www.dataprivacyframework.gov/list>. El que no aparezca no está
cubierto y necesita Cláusulas Contractuales Tipo del art. 46. `[PENDIENTE: comprobar Resend,
Vercel, Google y Meta uno a uno y anotar el resultado aquí]`

**Emiratos Árabes Unidos (Telegram FZ-LLC).** **No hay decisión de adecuación.** Las vigentes son
Andorra, Argentina, Canadá, Islas Feroe, Guernsey, Isla de Man, Israel, Jersey, Nueva Zelanda,
Suiza, Uruguay, Estados Unidos, Reino Unido, Corea del Sur y Japón. Emiratos no está. La
transferencia necesita garantías del art. 46 o una excepción del art. 49.

En el texto publicado, **nombra el país y el mecanismo concreto**, no la frase genérica. La guía de
la AEPD lo exige así: hay que especificar el artículo del RGPD que permite la transferencia,
identificar los terceros países e indicar dónde consultar la decisión de adecuación o las
garantías.

### 3.6 Plazos de conservación

No hay plazo legal para leads comerciales. El art. 13.2.a obliga a fijarlo o a dar los criterios.

`[PENDIENTE: decisión del dueño.]` Ancla razonable para proponerle, no para aplicar por tu cuenta:
cinco años del art. 1964 del Código Civil, plazo de prescripción de las acciones personales, para
los datos del presupuesto. La foto adjunta pesa mucho más en riesgo y en almacenamiento: conviene
un plazo más corto y separado. Presenta ambas como propuesta y espera respuesta.

### 3.7 Lo que hay que decir del formulario

- Los dos variantes y sus campos, incluida la foto de hasta 4 MB.
- Que viajan campos ocultos: `evento_id`, `origen` y un honeypot antispam. La transparencia del
  art. 13 no distingue entre lo que el usuario teclea y lo que el sitio añade.
- El `reference_code` de 6 caracteres que se inyecta en el mensaje de WhatsApp.
- Que el contacto por `tel:` y por `wa.me` sale del sitio: lo que pase en WhatsApp lo rige la
  política de Meta, no esta.

---

## 4 · Política de cookies

### 4.1 La norma y la guía vigentes

**Art. 22.2 de la LSSI**, texto consolidado. La exención es estrecha y literal: el almacenamiento o
acceso de índole técnica al solo fin de efectuar la transmisión de una comunicación, o, en la
medida que resulte estrictamente necesario, para la prestación de un servicio de la sociedad de la
información expresamente solicitado por el destinatario.

**Guía sobre el uso de las cookies de la AEPD, versión de mayo de 2024.** Es la vigente; no hay
posterior publicada. <https://www.aepd.es/guias/guia-cookies.pdf>

**Guía sobre el uso de cookies para herramientas de medición de audiencia**, 11 de enero de 2024.
<https://www.aepd.es/guias/guia-cookies-analiticas-externas.pdf>

### 4.2 Clasificación de las cookies del sitio

| Cookie | Quién | Duración | ¿Exenta del art. 22.2? |
|---|---|---|---|
| `pa_consent` | Propia | 180 días | **Sí.** Guardar la decisión es la ejecución del propio 22.2 |
| `pa_ref` | Propia | 90 días | **No.** Identificador único de seguimiento que además viaja a Google dentro de `reference_code` |
| `pa_attr` | Propia | 90 días | **No.** `gclid`, `gbraid`, `wbraid`, `utm_*` son atribución publicitaria |
| `_fbc` | Propia, con valor de Meta | 90 días | **No.** Identificador de clic de Facebook |
| `_fbp` y las de Google y Meta | Terceros | No las controla el repo | **No.** Enlazar a las políticas de cada tercero |

**GA4 no entra en la exención analítica.** La guía de medición de audiencia la condiciona a cuatro
cosas: finalidad estrictamente limitada a medir la audiencia del sitio, tratamiento en nombre
exclusivo del editor, datos estadísticos anónimos únicamente, y sin cotejo con otros tratamientos
ni transmisión a terceros. GA4 incumple las cuatro. Requiere consentimiento.

### 4.3 Respuestas a las preguntas que quedaron abiertas

**¿El mero uso de la web vale como aceptación?** No. El CEPD ha establecido que seguir navegando no
es forma válida de prestar el consentimiento, y la mera inactividad del usuario no lo implica en
ningún caso. La frase heredada que dice lo contrario se elimina; no se matiza.

**¿Cuánto puede durar el consentimiento?** La AEPD considera buena práctica que no supere los **24
meses**, conservando la selección durante ese tiempo sin volver a preguntar. Los 180 días de
`pa_consent` están holgadamente dentro. **Ese número no es un problema** — el documento 08 lo
marcaba como no contrastado; queda contrastado y correcto.

**¿Qué exige la retirada?** Que sea tan fácil como fue prestar el consentimiento. La guía da el
criterio operativo: se cumple cuando el usuario tiene acceso sencillo y permanente al sistema de
gestión o configuración de cookies. Hoy no existe. **Exige código, no texto** — ver sección 6.

**¿Y el banner?** Primera capa con tres mecanismos: botón de aceptar; botón de rechazar del mismo
tipo, al mismo nivel y con la misma visibilidad, sin remitir a otra capa; y un acceso a un panel
que permita elegir de forma granular, al menos por finalidad. Ninguna opción premarcada.

### 4.4 Contenido obligatorio de la página

La guía enumera lo que debe llevar la política, en su apartado 3.1.1:

1. Definición y función genérica de las cookies.
2. Tipos de cookies que se utilizan y su finalidad.
3. Quién las utiliza: si solo el editor o también terceros, **identificándolos** por su nombre o
   marca conocida, con enlace a su información. Aquí hay que nombrar a Google y a Meta.
4. Cómo aceptar, denegar y **revocar** el consentimiento, y cómo eliminarlas.
5. Transferencias a terceros países, con el artículo del RGPD que las permite.
6. Perfilado con decisiones automatizadas, si lo hubiera.
7. **Periodo de conservación** de los datos para cada fin.
8. Para el resto del art. 13, remisión a la política de privacidad.

Incluye además, por transparencia, una mención genérica a las cookies exentas. La guía lo
recomienda y no cuesta nada.

Recomendación de la guía que conviene seguir: el panel de configuración debe estar integrado en la
propia política de cookies, o la política debe llevar un enlace que lleve directamente al panel.

---

## 5 · Frases heredadas que no pueden sobrevivir

Checklist de verificación al terminar. Ninguna de estas ideas puede aparecer en ninguna de las tres
páginas:

- [ ] Cualquier mención a la Ley Orgánica 15/1999 o a su reglamento.
- [ ] Ficheros declarados o inscritos ante la AEPD.
- [ ] Derechos limitados a acceso, rectificación, cancelación y oposición.
- [ ] Que los datos no se ceden a terceros.
- [ ] Que las cookies desaparecen al terminar la sesión.
- [ ] Que navegar por la web implica aceptar las cookies.
- [ ] Que no hay transferencias internacionales.
- [ ] La mención a shadcn.
- [ ] Una política de cookies que no enumere ni una cookie concreta.
- [ ] Protección de datos dentro del aviso legal.

---

## 6 · Lo que exige código y no se arregla escribiendo

**No lo implementes en esta tarea.** Queda listado para que el dueño sepa que el texto, por sí
solo, no le deja conforme. Cada punto es un encargo con aprobación propia.

1. **Retirada del consentimiento.** No existe ninguna forma de retirarlo desde la web. Hace falta
   un acceso permanente al panel, tan fácil como fue aceptar. Es el incumplimiento más claro.
2. **Google recibe eventos con el banner rechazado.** `window.gtag` se define incondicionalmente
   (`app/layout.tsx:96`) y `gtag.js` se inyecta con la única condición de que haya identificador
   (`app/layout.tsx:103`). `registrarEvento` (`lib/eventos.ts:189`) no mira el consentimiento.
   Matiz jurídico que conviene tener claro: el art. 22.2 LSSI regula *almacenar y recuperar en el
   terminal*, así que un evento sin cookie no cae bajo ese artículo — pero **sí es tratamiento de
   datos personales** bajo RGPD, porque el ping lleva IP, user-agent, URL, `municipality` en texto
   libre y `reference_code`. Con el banner rechazado no hay base jurídica para ese tratamiento.
3. **`pa_ref` se escribe siempre**, antes de cualquier decisión (`app/api/atribucion/route.ts:146`).
   Cookie no exenta escrita sin consentimiento previo: supuesto exacto del art. 22.2.
4. **Panel granular por finalidad.** Analítica y publicidad deben poder aceptarse por separado.
5. **Prueba del consentimiento del formulario.** La casilla se valida en servidor pero no queda
   registro de fecha ni de versión del texto aceptado. Sin eso no hay forma de demostrarlo después.

**Riesgo de los puntos 1 a 4.** Utilizar dispositivos de almacenamiento y recuperación de datos sin
información ni consentimiento en los términos del art. 22.2 es infracción leve (art. 38.4.g),
multa de hasta 30.000 euros, y **sanciona la AEPD**, no el Ministerio: el art. 43.1 de la LSSI le
atribuye expresamente esas infracciones.

---

## 7 · Fuera de alcance, pero apuntado

**Accesibilidad.** La Ley 11/2023, de 8 de mayo, que traspone la Directiva (UE) 2019/882, es
exigible desde el 28 de junio de 2025. Las microempresas están exentas. Hay que comprobar plantilla
y facturación de la S.L. antes de decidir si aplica. `[PENDIENTE: comprobar]`
<https://www.boe.es/buscar/act.php?id=BOE-A-2023-11022>

---

## 8 · Dónde escribir

| Qué | Dónde |
|---|---|
| Textos originales del dueño | `lib/legal/` (tres `.md`) |
| Contenido publicado y ficha del titular | `content/legal.tsx` |
| Plantilla de las tres páginas | `components/secciones/PlantillaLegal.tsx` |
| Las tres rutas | `app/aviso-legal/`, `app/politica-de-privacidad/`, `app/politica-de-cookies/` |
| NAP y teléfono | `lib/config.ts` |
| Fecha de última revisión | `ultimaRevisionLegal` en `content/legal.tsx` |

`[PENDIENTE: decidir si el contenido nuevo vive en `lib/legal/*.md` y se importa, o directamente en
`content/legal.tsx`. Hoy conviven las dos cosas y no está claro cuál manda.]`

**La fecha de última revisión se mueve al día en que se publique el texto nuevo**, no antes. Hoy
marca 18 de septiembre de 2026 sobre contenido heredado, que es lo peor de los dos mundos: aparenta
revisión reciente sobre un texto de 1999.

---

## 9 · Orden de trabajo sugerido

1. **Aviso legal.** El más mecánico. Solo bloquea en domicilio y datos registrales.
2. **Política de privacidad.** Depende de las finalidades y los plazos, que decide el dueño.
3. **Política de cookies.** Va la última porque debe describir lo que el código hace de verdad, y
   parte de eso va a cambiar con la sección 6.

Al terminar cada una, para y enseña el resultado antes de seguir con la siguiente.
