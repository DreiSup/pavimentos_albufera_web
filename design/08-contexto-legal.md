# 08 · Contexto legal del sitio

**Para qué es este documento.** Es el expediente que necesita una investigación a fondo sobre qué
deben decir las tres páginas legales de pavimentos-albufera.com: `/aviso-legal/`,
`/politica-de-privacidad/` y `/politica-de-cookies/`. Reúne lo que la empresa es, lo que la web
hace de verdad con los datos de las personas, y lo que los documentos publicados dicen hoy.

**Está escrito para que otra sesión pueda trabajar sin leerse el repo entero.** Todo dato de la
sección 3 en adelante está verificado leyendo el código, con su archivo y su línea: si algo aquí se
contradice con el código, manda el código y hay que corregir este documento.

🔴 **Nada de lo que hay aquí es asesoramiento jurídico, y la investigación que salga de aquí
tampoco lo será.** Es material técnico para que el dueño y una asesoría decidan. Un texto legal
publicado responde ante un organismo que sanciona.

---

## 1 · La empresa

| | |
|---|---|
| **Razón social** | Pavimentos Albufera Sociedad Limitada |
| **CIF** | B02882090 |
| **Domicilio social** | 🔴 **Sin confirmar.** El sitio muestra Sollana (46430, Valencia) como municipio, pero la calle y el número no los ha dado nadie |
| **Correo** | comercial@pavimentos-albufera.com |
| **Teléfono** | Sale de la variable de entorno `NEXT_PUBLIC_TELEFONO`. No está en el código |
| **Actividad** | Pavimentos de hormigón: impreso, pulido, lavado, fratasado, desactivado y microcemento |
| **Ámbito** | Valencia, Castellón y Alicante sin desplazamiento; Murcia, Albacete, Almería, Tarragona y Teruel a partir de 100 m² |
| **Antigüedad** | Desde 2009 |

**Datos registrales:** no constan en el repo. Si la LSSI los exige, hay que pedírselos al dueño.

---

## 2 · Qué es la web, y qué no es

- **Next.js 15** (App Router), **52 rutas, todas estáticas** salvo un route handler. Desplegada en
  **Vercel**.
- **No vende online.** No hay carrito, ni pasarela de pago, ni precios: el dueño los retiró del
  sitio entero el 2026-09-18.
- **No hay cuentas de usuario**, ni registro, ni área privada, ni newsletter.
- **Lo único que capta son contactos**, por tres vías: un formulario, un enlace `tel:` y un enlace
  `wa.me` de WhatsApp.
- Hay **cuatro landings de campaña** en `/lp/`, pensadas para Google Ads.

---

## 3 · Qué datos personales se recogen, y dónde

**El formulario tiene dos variantes**, la misma pieza (`components/secciones/FormularioPresupuesto.tsx`):

| | Variante corta | Variante larga |
|---|---|---|
| Dónde | Cierre de la portada | `/presupuesto/` y el cierre de las seis páginas de servicio |
| Campos | Nombre y apellidos · teléfono · correo (opcional) · casilla de privacidad | Todo lo anterior + qué quiere pavimentar · superficie en m² · municipio · mensaje libre · **foto adjunta** |

- La **foto** admite cualquier imagen hasta **4 MB**.
- Campos ocultos que viajan con el envío: `evento_id`, `origen` (la página desde la que se envía) y
  un *honeypot* antispam.
- **Hay casilla de privacidad y se valida también en servidor**, no solo en el navegador.

Además, cada visitante recibe un **`reference_code` de 6 caracteres** que se inyecta en el mensaje
prellenado de WhatsApp junto con la página de origen.

---

## 4 · A dónde van esos datos  🔴 lo más importante del documento

Todo ocurre en el Server Action `app/presupuesto/actions.ts`.

| Destino | Qué recibe | ¿Exige consentimiento? |
|---|---|---|
| **Resend** (correo, EE. UU.) | Todo el formulario **incluida la foto**, la referencia, el estado de consentimiento y la atribución | **No** — `actions.ts:372` |
| **Telegram** (Telegram FZ-LLC, Dubái) | Nombre · teléfono · correo · qué pavimentar · municipio · origen · referencia · atribución | **No** — `actions.ts:290` |
| **Meta CAPI** | SHA-256 de teléfono (con prefijo `34`), correo y municipio · país `es` · `external_id` · **y en claro: IP, user-agent, URL, `_fbp`, `_fbc`** | **Sí** — solo si `pa_consent === 'aceptado'`, `actions.ts:335` |
| **Google** (GA4 y Ads) | 🔴 **Los eventos se envían aunque se RECHACE.** Ver abajo | **No** (solo cambian los permisos) |
| **Meta Pixel** | Bloqueo duro: no se carga sin consentimiento | Sí |
| **Vercel** | Alojamiento y logs de servidor | — |

**Cuatro hechos que la investigación tiene que atender:**

1. **Resend y Telegram reciben datos personales sin ninguna puerta de consentimiento.** La
   justificación escrita en el código es que son la ejecución del servicio que la persona ha pedido,
   no publicidad. Eso hay que contrastarlo con la base jurídica que corresponda. *(Matiz que apareció
   en la revisión: Resend, Telegram y Vercel no son «cesiones» sino **encargados del tratamiento**
   —art. 28 RGPD—, y a un encargado no se le legitima con el consentimiento del interesado sino con
   un contrato del art. 28.3.)*
2. **Telegram FZ-LLC está en Dubái y Resend en Estados Unidos.** Son transferencias fuera del EEE, y
   el documento publicado hoy afirma exactamente lo contrario (§6).
3. 🔴 **Rechazar el banner NO impide que los eventos lleguen a Google.** `window.gtag` se define
   incondicionalmente (`app/layout.tsx:96`) y `gtag.js` se inyecta con la única condición de que haya
   identificador configurado (`app/layout.tsx:103`). `registrarEvento` (`lib/eventos.ts:189`) llama a
   `window.gtag?.(...)` sin mirar el consentimiento. **Con el banner rechazado —y mientras está sin
   contestar— sí se transmiten** `generate_lead`, `phone_click`, `whatsapp_click`, `email_click`,
   `scroll_depth`, `faq_open` y `samples_filter`, con `page_path`, `device_type`, `click_location` y,
   en el lead, **`municipality` (texto libre tal como lo tecleó el visitante) y `reference_code`**. Lo
   que cambia al rechazar son los cuatro permisos de Consent Mode, **no el envío**. Qué hace Google
   después con un ping denegado no es legible en este repo.
4. 🔴 **`pa_ref` se escribe SIEMPRE**, antes y al margen de cualquier decisión de consentimiento
   (`app/api/atribucion/route.ts:146`). Es un identificador de 90 días que además viaja a Google
   dentro de `reference_code`. Que una cookie no exenta se escriba sin consentimiento previo es
   justo el supuesto del art. 22.2 de la LSSI.

---

## 5 · Cookies y consentimiento

Verificado en `lib/cookies.ts`, `components/layout/Consentimiento.tsx`,
`app/api/atribucion/route.ts` y `app/layout.tsx`.

| Cookie | Quién la pone | Para qué | Duración |
|---|---|---|---|
| `pa_consent` | Este sitio | Guarda si se aceptó o se rechazó | **180 días** |
| `pa_ref` | Este sitio (route handler) | El código de referencia de 6 caracteres | **90 días** |
| `pa_attr` | Este sitio (route handler) | Atribución: `gclid`, `gbraid`, `wbraid`, `utm_*`. Gana el primer toque | **90 días** |
| `_fbc` | Este sitio, con el valor que trae Meta en la URL | Identificador de clic de Facebook | **90 días** |
| `_fbp`, y las de Google y Meta | Terceros | Sus nombres y duraciones no los controla este repo | — |

Las cuatro propias son **accesibles por JavaScript** (`httpOnly: false`) y `sameSite: lax`.

**Cómo funciona el consentimiento hoy:**

- Los cuatro permisos de Consent Mode v2 arrancan en **`denied`**. El Pixel de Meta tiene bloqueo
  duro, porque no tiene equivalente de Consent Mode.
- El estado vive en **cookie de primera parte**, no en `localStorage`, porque el Server Action tiene
  que poder leerlo.
- 🔴 **No existe ninguna forma de retirar el consentimiento desde la web.** La decisión dura 180
  días y el aviso no vuelve a aparecer. Hoy la única salida es borrar la cookie a mano en el
  navegador. **Esto no se arregla escribiendo un texto: exige código nuevo.**

---

## 6 · Qué dicen hoy los tres documentos, y de dónde salieron

El dueño los copió de la web anterior, hecha por otro desarrollador. Sus palabras: *«no tengo ni
idea, lo he copiado de la versión antigua»*. Los originales están en `lib/legal/` (tres `.md`) y lo
publicado sale de `content/legal.tsx`.

**Problemas ya detectados y verificados contra fuente:**

1. **La política de privacidad se apoya en la LOPD de 1999** (Ley Orgánica 15/1999) y en su
   reglamento. La LO 3/2018, disposición derogatoria única, la deroga expresamente.
2. **Promete que los datos «serán incorporados en los ficheros declarados ante la AEPD».** Ese
   registro de ficheros ya no existe.
3. **Solo enumera los derechos ARCO.** Faltan supresión, limitación, portabilidad, retirada del
   consentimiento y reclamación ante la autoridad de control.
4. 🔴 **Afirma que «sus datos personales no serán cedidos a terceras organizaciones».** Es falso:
   §4 de este documento enumera cuatro destinos, dos de ellos fuera del EEE.
5. **Dice que las cookies «desaparecen al terminar la sesión del usuario».** Es falso: duran 90 y
   180 días (§5).
6. **Dice que el usuario acepta las cookies por el mero hecho de usar la web.** La web no funciona
   así, y hay que comprobar si eso es siquiera admisible hoy.
7. **El documento de cookies no enumera ni una cookie concreta.** El propio dueño escribió dentro
   del archivo que había que añadirlas.
8. El texto afirma que la web está hecha «con Next.js y **shadcn**». **Este repo no usa shadcn**: es
   Tailwind con `class-variance-authority`. No se copió esa frase a la página publicada.

**La fecha de «Última actualización» es el 18 de septiembre de 2026**, puesta a petición del dueño
sabiendo que el texto de debajo es todavía el heredado. Vive en `content/legal.tsx`
(`ultimaRevisionLegal`) y se mueve cuando se revise el contenido.

---

---

## 6 bis · Lo que ya dictaminó la primera revisión (2026-09-18)

Antes de este documento se hizo una revisión con verificación adversarial: unos agentes leyeron la
ley, otros el código, y dos más intentaron **refutar** cada cita contra el BOE, el DOUE y los PDF de
la AEPD. Lo que sobrevivió a esa refutación:

**Veredicto de los tres documentos: hay que REHACERLOS.** No corregirlos.

- **Aviso legal**: le faltan cuatro datos que el art. 10.1 de la LSSI-CE exige, y ocho de sus frases
  contradicen lo que hace el sitio. Sobra entera su sección de protección de datos.
- **Política de cookies**: diez incumplimientos de la **Guía sobre el uso de las cookies de la AEPD,
  versión de MAYO 2024** — entre ellos, no poder retirar el consentimiento, no tener panel por
  finalidad, y no identificar a los terceros que operan de verdad.
- **Política de privacidad**: catorce puntos obligatorios del art. 13 del RGPD sin cubrir, y nueve
  contradicciones, cinco de ellas marcadas como bloqueantes.

**Una obligación nueva que apareció al confirmarse la razón social:** al ser **sociedad limitada**,
el art. 10.1.b) de la LSSI pasa de «depende» a **obligatorio**, y hay que publicar los **datos de
inscripción en el Registro Mercantil**. Hoy la tabla de identificación no tiene ninguna fila para
eso, y el dato no existe en el repo.

**Dos afirmaciones se cayeron en la refutación, y conviene no repetirlas:** el RGPD **no** obliga a
informar en la política del plazo de un mes de respuesta ni de la gratuidad del ejercicio de
derechos (arts. 12.3 y 12.5 obligan a *cumplirlo*, no a *informarlo*); y el campo
`estatus_derogacion` de la API del BOE **no sirve** para decidir si una norma está derogada, porque
devuelve lo mismo para la LO 15/1999, que sí lo está.

---

## 7 · Lo que NO está confirmado

- **Domicilio social** de la empresa.
- **Datos registrales**, si son exigibles.
- **Las finalidades del tratamiento**: la política tiene un hueco literal, «…y otras finalidades
  (INDICAR)». El dueño no sabe qué va ahí; por eso se encargó esta investigación.
- **Plazos de conservación**: el repo no define ninguno para los datos del formulario.
- **Los contratos de encargado del tratamiento** (art. 28.3 RGPD) con Resend, Telegram, Vercel,
  Google y Meta: nadie ha comprobado si existen.
- **Los datos de inscripción en el Registro Mercantil**, obligatorios por ser S.L. (§6 bis).
- **Prueba del consentimiento del formulario**: la casilla se valida, pero no queda registro de
  fecha, ni de versión del texto aceptado, ni de nada que sirva para demostrarlo después.

---

## 8 · Qué tiene que responder la investigación

1. **Documento por documento, qué es obligatorio y qué es costumbre.** El dueño necesita saber en
   qué merece la pena gastar asesoría. Separar siempre las dos cosas.
2. **Aviso legal**: qué exige el art. 10 de la LSSI-CE para una sociedad limitada con web de
   captación, punto por punto, y si aplica algo más por el tipo de actividad.
3. **Privacidad**: la lista del art. 13 del RGPD aplicada a este caso concreto; la **base jurídica**
   de cada uno de los cuatro destinos del §4 —que no es la misma para contestar un presupuesto que
   para enviar datos a Meta—; el plazo de conservación; los derechos completos; las cesiones; y las
   **transferencias internacionales**, comprobando cuál es el marco **en vigor** para Estados Unidos
   y no uno anulado.
4. **Cookies**: el art. 22.2 de la LSSI y la **versión vigente** de la guía de cookies de la AEPD.
   Qué cookies necesitan consentimiento y cuáles están exentas; si el mero uso de la web puede valer
   como aceptación; qué exige la norma sobre **poder retirar** el consentimiento y con qué
   facilidad; y cuánto puede durar el consentimiento antes de volver a pedirlo — los 180 días de
   `pa_consent` son un número que nadie ha contrastado con la guía.
5. **Qué falta, qué sobra y qué se contradice** en cada uno de los tres textos heredados, citando la
   frase exacta.
6. **Qué exige tocar código y no solo texto.** La retirada del consentimiento es el caso claro.

---

## 9 · Cómo hay que trabajar esto

- **Fuentes oficiales o nada**: AEPD, BOE, EUR-Lex, Comité Europeo de Protección de Datos. No valen
  blogs de agencias ni generadores de textos legales: de ahí salió justo el documento que estamos
  auditando.
- **Cada afirmación legal, con su cita**: norma, artículo y enlace. Lo que no se pueda verificar, se
  dice que no se ha podido verificar.
- **Comprobar la vigencia**, no solo la existencia. En esta materia hay normas derogadas y marcos de
  transferencia internacional anulados que siguen circulando por internet como si valieran.
- **No redactar el texto final como si fuera a publicarse tal cual.** El entregable es material para
  decidir.

---

## 10 · Dónde está cada cosa en el repo

| Qué | Dónde |
|---|---|
| Textos originales del dueño | `lib/legal/` (tres `.md`) |
| Contenido publicado y ficha del titular | `content/legal.tsx` |
| Plantilla de las tres páginas | `components/secciones/PlantillaLegal.tsx` |
| Las tres rutas | `app/aviso-legal/`, `app/politica-de-privacidad/`, `app/politica-de-cookies/` |
| Formulario y su Server Action | `components/secciones/FormularioPresupuesto.tsx`, `app/presupuesto/actions.ts` |
| Cookies | `lib/cookies.ts`, `components/layout/Consentimiento.tsx`, `app/api/atribucion/route.ts` |
| Consent Mode v2 y carga de `gtag.js` | `app/layout.tsx` (última línea, a propósito) |
| Hasheo para la CAPI de Meta | `lib/meta-capi.ts` |
| NAP único del sitio | `lib/config.ts` |
