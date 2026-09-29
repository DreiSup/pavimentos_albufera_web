# Tareas pendientes para una sesión local

Estas tareas **no se pueden hacer desde la sesión web**:
- La red del contenedor bloquea `www.pavimentos-albufera.com`, `vercel.com` y `developers.google.com`.
- DataForSEO, OpenSEO, mcp-gsc y geo-optimizer solo están instaladas en tu equipo.

Cada tarea dice qué hacer, con qué, qué resultado es bueno y a qué riesgo de [`00-reconocimiento.md`](00-reconocimiento.md) alimenta.

**Cómo retomar en local:** `git fetch && git checkout claude/jolly-bohr-5om2p1`, y pídele a Claude: «lee `docs/seo/00-reconocimiento.md` y `docs/seo/pendientes-sesion-local.md` y ejecuta las tareas L1–L7». Anota los resultados al final de este archivo, en «Resultados».

---

## L1 · Herramientas SEO: ¿cuáles responden de verdad? (cierra la Parte 0)

- **Qué:** `claude mcp list`, y una llamada mínima a cada herramienta:
  - **DataForSEO:** volumen de «hormigón impreso» en España.
  - **OpenSEO:** una consulta cualquiera.
  - **mcp-gsc:** listar propiedades.
  - **geo-optimizer:** auditoría de `https://www.pavimentos-albufera.com/`.
- **Bueno:** las cuatro responden. Se anota cuál falla y por qué (credenciales, cuota, versión).
- **Para:** Partes 3 y 5. El revisor usa geo-optimizer.

## L2 · Valor real de `NEXT_PUBLIC_SITE_URL` y variables públicas en Vercel

- **Qué:** Vercel → proyecto `pavimentos-albufera-web` → Settings → Environment Variables (Production), o `vercel env ls production`. Mira solo los nombres y los valores públicos:
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_TELEFONO`
  - `NEXT_PUBLIC_WHATSAPP`
  - `NEXT_PUBLIC_DIRECCION`
  - `NEXT_PUBLIC_GA_ID`
  - `NEXT_PUBLIC_ADS_ID`
  - `NEXT_PUBLIC_META_PIXEL_ID`
- También si **existen**, sin mirar sus valores: `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `EMAIL_DESTINO` y `META_CAPI_ACCESS_TOKEN`.
- **Bueno:** `NEXT_PUBLIC_SITE_URL = https://www.pavimentos-albufera.com` y dirección definida.
- **Malo:** sin definir o con el dominio sin www, porque canonical y sitemap apuntarían a una URL que redirige. También es malo que falten Resend y Telegram, porque los leads se perderían en silencio.
- **Para:** R05, R15, R16.

## L3 · Producción con curl

```bash
curl -sIL https://pavimentos-albufera.com/            # repetir con .es, www.pavimentos-albufera.es, pavimentos-albufera-web.vercel.app
curl -s https://www.pavimentos-albufera.com/ | grep -o '<link rel="canonical"[^>]*>'
curl -s https://www.pavimentos-albufera.com/robots.txt
curl -s https://www.pavimentos-albufera.com/sitemap.xml | head -20
curl -sI -A 'AdsBot-Google' https://www.pavimentos-albufera.com/lp/hormigon-impreso/
curl -sIL https://www.pavimentos-albufera.com/hormigon-impreso-en-moraira/   # y unas cuantas de las 33 redirecciones antiguas, con y sin barra final
curl -sI https://pruebapavi.vercel.app/                                       # ¿copia pública del sitio?
```

- **Bueno:**
  - Un solo salto 308 a www.
  - canonical y `<loc>` en www, con respuesta 200.
  - AdsBot recibe 200 sin `x-robots-tag`.
  - `pruebapavi.vercel.app` protegido o con noindex.
- **Malo:** canonical o sitemap sin www, cadenas de más de un salto o algún destino que dé 404.
- **Para:** R05, R11, R21, R24.

## L4 · Search Console (mcp-gsc o panel)

- **Qué:**
  - Tipo de propiedad: dominio o prefijo.
  - Estado del sitemap e informe «Páginas».
  - Inspección de `/`, `/hormigon-impreso/`, `/zonas/moraira/` y `/lp/hormigon-impreso/`.
  - Core Web Vitals de campo.
  - **Exportar las URLs con impresiones de los últimos 16 meses**, que incluyen las del WordPress antiguo.
- **Bueno:** sitemap «Correcto», las `/lp/` como «Excluida por noindex» y ninguna URL antigua con impresiones que dé 404.
- **Para:**
  - R05 y R11: las 2 URLs antiguas sin regla y la cobertura de las 301.
  - Parte 3: las consultas reales.

## L5 · Rendimiento real en producción

- **Qué:** PageSpeed Insights o `npx lighthouse <url>` en móvil, 3 tiradas, sobre:
  - `/`
  - `/hormigon-impreso/`
  - `/zonas/moraira/`
  - `/lp/hormigon-impreso/`
  - `/proyectos/moraira-impreso-adoquin-arena/`
  - `/proyectos/`
- **Bueno:** LCP ≤ 2,5 s, CLS ≤ 0,1 y TBT ≤ 200 ms con GA y Pixel cargados.
- **Punto de comparación:** en localhost simulado, el LCP de la home fue 5,0 s y el del pilar 4,1 s.
- **Para:** R17.

## L6 · Datos estructurados

- **Qué:** Rich Results Test y Schema Markup Validator sobre `/`, `/hormigon-impreso/`, `/zonas/moraira/` y una obra.
- **Bueno:** sin errores, con el teléfono real.
- **Esperado:** aviso en las migas, porque les falta la URL en el tramo intermedio.
- **Para:** R14.

## L7 · Git local

- **Qué:** `git show 09af74a --stat` y `git branch -a --contains 09af74a`.
- **Para qué:** ARCHITECTURE.md dice que ahí hay un índice `/zonas/` que no está en GitHub.
- **Para:** R20. Si existe, decidir si se sube.

## L8 · Prueba en iPhone real (tarea 1.25 de design/06)

- **Qué:** en Safari con red lenta, abrir `/lp/hormigon-impreso/?gclid=TEST` y pulsar teléfono y WhatsApp antes de que cargue el JS.
- **Comprobar:** si llegan el evento y la atribución (GA4 DebugView), y si el banner de cookies (226 px en móvil) tapa el CTA.
- **Para:** R04. Es un requisito antes de gastar en Ads.

## Para las partes siguientes (no hacer ahora)

- **Parte 2 (fotos):** instalar `exiftool` en el equipo donde estén las fotos originales. En el repo hay 125 fotos de la mediateca del WordPress: 14 atribuidas y 111 sin atribuir. Solo 5 tienen EXIF y 2 tienen GPS.
- **Parte 3 (keywords):** entera en local, con DataForSEO, OpenSEO y mcp-gsc (L1). WebSearch solo da resultados de EE. UU.: no sirve para la SERP local.

---

## Resultados

_(rellenar al ejecutar)_
