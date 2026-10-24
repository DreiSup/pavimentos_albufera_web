# SEO · Estado, hallazgos y decisiones (sesión 2026-10-21)

Resumen de la sesión de SEO del 2026-10-21 para retomar el trabajo sin perder contexto.
Fuentes de referencia en esta misma carpeta:

- `estudio-de-keywords.md` — clusters de keywords, tandas, umbrales, keywords que no se atacan.
- `arquitectura-y-estrategia.md` — arquitectura, plantillas de página, SOP de obra, legal.
- `borradores/articulo-1-por-que-se-agrieta.md` — borrador del primer artículo del blog.

Lo marcado **VERIFICADO** se comprobó en código, Vercel o Google ES (vía Nimble, país ES).
Lo marcado **INFERIDO** no se pudo comprobar. Desde el contenedor de la sesión no se llega al
dominio por HTTP (proxy 403 / DNS), así que el HTML en vivo no se ha visto directamente.

---

## 1. Objetivo del dueño

Mejorar el SEO de pavimentos-albufera.com para captar más leads orgánicos **y aprender SEO**:
quiere que se le guíe y se le explique el porqué de cada paso. Nada se ejecuta sin su orden
explícita; cada página nueva se le explica antes (qué keyword ataca y por qué).

## 2. Decisiones del dueño (firmes)

| Tema | Decisión |
|---|---|
| Marcas y dominios | Tres webs independientes, **no se fusionan**: **pavimentos-albufera.com** = marca general (particulares y empresas); **pavivasa.com** = marca para particulares, captación por redes (sobre todo Facebook Ads), web propia con repo propio (`DreiSup/pavivasa_web`, proyecto Vercel `pavivasa-web`); **padelalbufera.com** = más adelante (las 8 fotos de pádel del repo son suyas). hormigon-impreso-valencia.es: el dueño no tiene acceso |
| Obras repetidas entre marcas (Dénia, Xàbia, Moraira) | **Descartado** repartirlas entre marcas. Se dejan como están |
| Páginas de zona | **Se mantienen aunque tengan una sola obra.** Cuando haya una segunda obra en el municipio, se añade |
| Datos de obras existentes (m², año…) | No se pueden conseguir. Sí se pedirán todos los datos de las **obras futuras** |
| NAP en Vercel | El dueño confirma que las variables de entorno están bien puestas (el build lo corrobora: ninguna ruta sirve el teléfono de reserva) |
| Lavado vs desactivado | El dueño prefiere **dos páginas** (ver §6) |
| Precios | Sin precios en la web (decisión previa: «no quiero precios en la web») |
| Search Console | Tiene acceso. Google Business Profile: ahora mismo no |
| Ejecución | Pendiente de su orden. Primero quiere tenerlo todo claro |

Malentendido aclarado: el dueño **nunca** pidió «crear una página con solamente una web» ni
consolidar dominios. La idea de consolidar venía del `estudio-de-keywords.md` §2.2 (marcada
allí como DECISIÓN ABIERTA) y queda descartada.

## 3. Producción (VERIFICADO vía Vercel)

- Proyecto Vercel `pavimentos-albufera-web`, repo `DreiSup/pavimentos_albufera_web`.
- Canónico `www.pavimentos-albufera.com`; redirigen a él (308) el dominio raíz, `.es`, `www.….es`
  y `pavimentos-albufera-web.vercel.app`. DNS en sered.net.
- Producción servía el commit **`8e4f311` (2026-10-01)**: **7 commits por detrás** de `main`
  (`b8a978e`, 07–08/10: zonas de lead por CP, filtro y aviso del formulario, tarjeta de proyecto).
  Ninguno toca SEO. Falta saber por qué no se desplegó main.

## 4. Hallazgos SEO (por prioridad)

1. **Blog vacío indexable.** Los 3 artículos (`hormigon-desactivado-piedra-vista`,
   `hormigon-fratasado-fino-en-viviendas`, `guia-hormigon-pulido`) muestran «[Contenido del
   artículo pendiente de redacción…]», están en el sitemap y reciben enlaces «Cómo se hace →»
   desde acabados y proyectos. La plantilla fuerza `cuerpo: null` (`apps/web/src/lib/datos.ts:112`).
2. **Zonas** (8, una obra cada una): huérfanas (nada enlaza a `/zonas/`), cuerpo de plantilla y
   las mismas 3 FAQ. Xàbia es `noindex` (sin foto) pero está en el sitemap. Con la decisión del
   dueño de mantenerlas, el trabajo es **darles texto propio y enlaces** desde su obra y servicio.
3. **301 que faltan** (URLs indexadas en Google, hoy 404 — INFERIDO el 404):
   `/revetements-en-beton-imprime/`,
   `/hormigon-pulido-alicante-transformando-espacios-con-elegancia-y-durabilidad/`,
   `/la-magia-del-hormigon-impreso-en-piscinas-…/` (slug exacto por confirmar en Search Console).
   Además: `/brillo-y-elegancia-explorando-el-hormigon-pulido/` → artículo vacío;
   `/hormigon-pulido-en-xabia/` → zona `noindex`.
4. **GPS en EXIF** de 2 fotos: `_sin-atribuir/microcemento-4.jpg` (usada en `/microcemento/`) y
   `_sin-atribuir/hormigon-impreso-denia-chalet.jpg` (sin usar). Privacidad del cliente.
5. **Norma derogada:** «HA-25 según EHE-08» en `packages/content/src/data/services.ts` l.15, 48,
   103, 235. La EHE-08 la derogó el Código Estructural (RD 470/2021).
6. **Title viejo en Google** de `/hormigon-impreso/` («…consulta el precio por m²», retirado el
   18-09): pedir indexación en Search Console.
7. **URLs WordPress aún en el índice** (`/microcemento-decorativo/`, `/contacto/`, `/galeria/`,
   `/pavimentos-de-hormigon-valencia/`, `/pavimentos-de-hormigon-pulido/`): tienen 301, Google
   las irá soltando.
8. **Corchetes en legales:** Registro Mercantil, códigos de conducta, cookies de Google/Meta.
9. Fichas de obra muy cortas (40–100 palabras); ninguna obra con m², solo 2 con año.
10. Lo que está bien: canonical en todas, `HomeAndConstructionBusiness` sin `AggregateRating`,
    `Service` + `BreadcrumbList`, `/lp/` en `noindex` y fuera del sitemap, todas las 301 de
    `next.config.ts` apuntan a rutas existentes, páginas estáticas, presupuesto de JS con techo.

## 5. Inventario de fotos y páginas posibles

125 fotos de obra en `apps/web/public/obras/` (ver `INVENTARIO.md`). 35 en uso, 90 sin usar;
de esas, **72 aprovechables** (fuera: 6 stock, 8 pádel, 1 collage, 3 caucho).

Reparto aproximado de las 72 por espacio (clasificadas a ojo): piscina ~16 (5 imitación madera),
patio/jardín/caminos ~20 (6 árido visto), porche/terraza ~12, entrada/garaje/rampa ~10–12,
interior/baño ~7–8 (4 baños de microcemento), nave/parking/vía pública ~3.

Siete obras identificables por los metadatos de la mediateca WordPress (municipio, modelo, color;
sin año ni m²): **Turís** (sillería grande 109), **Vedat de Torrent** (6 fotos), **Ollería**
(manta gris, 2048 px), **Moraira** (sillería grande 113), **Catadau** (piedra rodena 107),
**Alfafar** (piedra inglesa 117), **Carlet** (piedra sillería gris).

| Páginas candidatas | Nº | Bloqueo |
|---|---|---|
| Obras nuevas (las 7 de arriba) | 7 | Visto bueno del dueño a usar los datos de su web antigua |
| Zonas nuevas de esas obras (Turís, Torrent, Ollería, Catadau, Alfafar, Carlet) | 6 | Igual |
| Soluciones por espacio: piscina, patio-jardín, porche-terraza, entrada-garaje, interior | 5 | Texto (el maestro solo tiene una línea por espacio) |
| Ficha de acabado imitación madera | 1 | Modelo/color, o mostrarla sin código de color |
| Opcional: `/microcemento/banos/` | 1 | Texto |
| Opcional: obra y zona de Benissa (pulido con piscina) | 2 | Confirmar que es de Albufera |

**Total: 19 con material claro, hasta 22 con opcionales.** No es posible: página de nave/parking
(1 foto), fotos para `xabia-pulido`, obras antiguas de Llíria/Calpe/Montaberner/Olocau (sin fotos).
Además, las fotos sin usar pueden reforzar páginas existentes (Dénia +3, Moraira +2, pulido ~8,
árido visto 5).

## 6. Lavado vs desactivado

- Google ES (Nimble, top 6): **0 URLs compartidas**, pero 4 de 6 resultados de «lavado» son
  páginas de «desactivado» y la AI Overview dice «hormigón lavado (o desactivado)». Dato no
  concluyente.
- Técnicamente: desactivado = retardante superficial + lavado a presión a las 12–24 h; lavado
  estricto = cepillado/lavado del hormigón fresco sin retardante. Mismo resultado (árido visto).
- En el repo comparten ~45–55 % del texto (mismas FAQ, mismos pasos); desactivado sin obra.
- **Recomendación aceptable con la decisión del dueño:** dos páginas, pero diferenciadas de verdad
  (proceso con/sin retardante, obra y FAQ propias). Necesita que el dueño explique cómo hacen cada
  técnica.

## 7. Blog (informe del subagente especialista)

- **Retirar los 3 artículos actuales con 301 a su servicio** (responden «qué es el hormigón X»,
  que es la intención de las páginas de servicio; pavivasa.com ya publica esos tres temas).
  Repuntar `/brillo-y-elegancia…/` directo a `/hormigon-pulido/`. Quitar los enlaces «Cómo se
  hace →». Si no hay artículo nuevo en el mismo despliegue, `/blog/` en `noindex`.
- **Estrategia:** blog pequeño, solo preguntas/problemas/comparativas, nunca «qué es X»; cada
  artículo enlaza a un servicio y termina en `/presupuesto/`. 1 artículo/mes de noviembre a
  abril. Cada artículo necesita ~15 min de respuestas del dueño, 2–3 fotos propias y una firma
  real con cargo (E-E-A-T).
- **Plan (10 temas):** por qué se agrieta el impreso · cada cuánto resellar · qué debe incluir un
  presupuesto (sin €) · impreso o baldosa · cuánto dura · impreso descolorido/blanco · impreso vs
  desactivado vs lavado · microcemento en exterior · pulido en exterior ¿resbala? · licencia para
  pavimentar un patio (baja prioridad). Ninguno coincide con pavivasa.
- **Artículo 1:** «¿Por qué se agrieta el hormigón impreso?» — borrador en `borradores/`.
- **Decisiones pendientes del dueño:** (1) permitir texto nuevo con fuente citada y visto bueno
  por artículo (choca con «copy solo del documento maestro»); (2) separación real de juntas (el
  maestro dice [16–25] m² sin confirmar; NRMCA recomienda ~3 m para losa de 10 cm); (3) la
  plantilla del blog no puede publicar cuerpo, enlaces, tablas, autor ni fecha: hay que ampliarla
  y documentar los bloques en `design/01`.

## 8. Restricción técnica clave

`CLAUDE.md` § Monorepo: **frontend congelado** (`apps/web/src/app/**`, `apps/web/src/components/**`)
mientras dure la fase de monorepo; salida pública byte-idéntica. Crear páginas nuevas exige
levantar ese congelado. Un **rediseño** encaja: la arquitectura prevé que un diseño nuevo consuma
`@site/*` directamente y retire los adaptadores legacy.

## 9. Dirección actual: prototipo y posible rediseño

El dueño quiere montar un **prototipo** de las páginas nuevas con las fotos sin usar, y se plantea
**rediseñar la web** para que se vea mejor y esté ultra optimizada para SEO y velocidad.
Propuesta hecha: prototipo primero fuera del código de producción (página privada en claude.ai),
y después rama con preview en Vercel. Preguntas abiertas al dueño:

- Qué no le gusta de la web actual; webs de referencia.
- ¿Se mantiene el sistema de diseño (tokens, tipografías, ángulos rectos) o cambia la identidad?
- ¿El prototipo puede llevar texto provisional marcado como borrador?

## 10. Primera tanda técnica propuesta (sin datos del dueño; pendiente de su orden)

1. Retirar los 3 artículos vacíos con 301 (y quitar enlaces «Cómo se hace →»).
2. Añadir las 3 redirecciones que faltan.
3. Quitar el GPS de las 2 fotos.
4. Corregir EHE-08 → Código Estructural.
5. Investigar por qué `main` no está desplegado.
6. Sacar `/zonas/xabia/` (noindex) del sitemap.

Choca con el congelado del frontend en los puntos que tocan `apps/web/src/**`; resolverlo con el
dueño antes de ejecutar.

## 11. Siguiente paso inmediato

El dueño va a enviar un **CSV de Google Search Console** con el rendimiento de
pavimentos-albufera.com. Analizarlo contra todo lo anterior: consultas y páginas con impresiones,
posiciones 4–20 (oportunidad), CTR bajo, URLs antiguas que aún reciben tráfico, consultas por
municipio, y canibalización (consultas con 2+ URLs).
