# 04 · Desarrollo y despliegue

## 1. Estructura de rutas

`trailingSlash: true` **fijo** en `next.config.ts`. Es lo que elimina de raíz los tres pares de
URLs duplicadas indexables que tiene la web actual.

```
app/
├── layout.tsx                        cabecera, pie, barra fija móvil, fuentes, JSON-LD global
├── page.tsx                          /
├── globals.css                       tokens.css + capas de Tailwind
│
├── hormigon-impreso/page.tsx         plantilla de servicio
├── hormigon-pulido/page.tsx
├── microcemento/page.tsx
├── hormigon-lavado/page.tsx
├── hormigon-fratasado/page.tsx       NUEVA
├── hormigon-desactivado/page.tsx     NUEVA
│
├── acabados/
│   ├── page.tsx                      muestrario con filtros
│   └── [modelo]/page.tsx             ficha de acabado
│
├── proyectos/
│   ├── page.tsx                      índice con 4 filtros
│   └── [slug]/page.tsx               ficha de obra
│
├── zonas/[municipio]/page.tsx        solo donde haya obra documentada
│
├── precios/page.tsx
├── empresa/page.tsx
├── presupuesto/
│   ├── page.tsx
│   └── actions.ts                    Server Action del formulario
│
├── blog/
│   ├── page.tsx
│   └── [slug]/page.tsx
│
├── aviso-legal/page.tsx              las tres comparten plantilla
├── politica-de-privacidad/page.tsx
├── politica-de-cookies/page.tsx
│
├── not-found.tsx                     404
├── sitemap.ts                        generado, nunca manual
└── robots.ts

components/
├── layout/          Cabecera · Pie · BarraMovil · BarraConfianza · Migas
├── ui/              Boton · Chip · Campo · EnlaceEtiqueta · EstadoVacio · HojaFiltros
├── datos/           EtiquetaTecnica · FichaObra · TablaFichaTecnica · DatoPendiente
├── contenido/       BloquePosicion · MuestraAcabado · TarjetaProyecto · TarjetaArticulo
└── secciones/       Acordeon · SubmenuServicio · Calculadora · FormularioPresupuesto

content/             acabados.json · proyectos.json · zonas.json · blog/*.mdx
lib/                 datos.ts (carga y filtros) · schema.ts (JSON-LD) · config.ts (NAP)
```

Rutas generadas estáticamente con `generateStaticParams` desde los JSON de `content/`.
Todo SSG; ISR solo si más adelante entra un CMS.

## 2. Componentes: dos reglas

**Un componente por concepto de diseño, no por pantalla.** `TarjetaProyecto` es la misma en la
home, en el índice, en la ficha de obra y en la página de zona. Si hace falta variar, es una
prop (`fondo="alt"`), no un componente nuevo.

**El dato pendiente es un componente, no un `if`.** `<DatoPendiente>180</DatoPendiente>`
renderiza `[180]` con el subrayado punteado. Cuando el cliente confirme el dato, se cambia la
llamada por el valor y desaparece el tratamiento visual en todo el sitio de una vez.

## 3. Redirecciones 301

Las 30 redirecciones de la migración, en `next.config.ts` con `permanent: true`.
**Comprobar una a una tras el despliegue: deben responder 301, no 302 ni 404.**

```ts
// next.config.ts
const redirects = async () => [
  // Servicios — URLs largas y redundantes de la web actual
  { source: '/pavimentos-de-hormigon-impreso', destination: '/hormigon-impreso/', permanent: true },
  { source: '/pavimentos-de-hormigon-pulido',  destination: '/hormigon-pulido/',  permanent: true },
  { source: '/pavimentos-de-hormigon-lavado',  destination: '/hormigon-lavado/',  permanent: true },
  { source: '/microcemento-decorativo',        destination: '/microcemento/',     permanent: true },
  { source: '/pavimentos-de-caucho',           destination: '/obra-publica/',     permanent: true }, // o '/' si se retira

  // Institucional y conversión
  { source: '/pavimentos-de-hormigon-valencia', destination: '/empresa/',     permanent: true },
  { source: '/contacto',                        destination: '/presupuesto/', permanent: true },
  { source: '/galeria',                         destination: '/proyectos/',   permanent: true },

  // Blog e índices
  { source: '/category/blog',         destination: '/blog/',    permanent: true },
  { source: '/category/blog/page/2',  destination: '/blog/',    permanent: true },
  { source: '/fr/category/blog',      destination: '/blog/',    permanent: true },
  { source: '/author/pavadmin',       destination: '/empresa/', permanent: true }, // + noindex
  { source: '/author/pavadmin/page/2',destination: '/empresa/', permanent: true },

  // Entradas de proyecto → /proyectos/[slug]/
  { source: '/hormigon-impreso-en-modelo-espiga-y-color-117-proyecto-en-moncada-valencia',
    destination: '/proyectos/moncada-impreso-espiga-117/', permanent: true },
  { source: '/hormigon-impreso-en-color-gris-modelo-manta-imitacion-roca-de-montana',
    destination: '/proyectos/impreso-manta-gris/', permanent: true },
  { source: '/hormigon-impreso-en-adoquin-pequeno-y-color-arena-proyecto-en-moraira',
    destination: '/proyectos/moraira-impreso-adoquin-arena/', permanent: true },
  { source: '/hormigon-fratasado-en-color-arena-trabajo-realizado-en-corbera-valencia',
    destination: '/proyectos/corbera-fratasado-arena/', permanent: true },
  { source: '/hormigon-impreso-en-color-107-y-modelo-adoquin-irregular-trabajo-realizado-en-alzira',
    destination: '/proyectos/alzira-impreso-adoquin-irregular-107/', permanent: true },

  // Entradas que en realidad eran páginas de técnica o de zona
  { source: '/hormigon-desactivado-con-piedra-vista-estetica-y-funcionalidad-en-un-solo-material',
    destination: '/hormigon-desactivado/', permanent: true },
  { source: '/hormigon-fratasado-fino-decorativo-en-viviendas',
    destination: '/hormigon-fratasado/', permanent: true },
  { source: '/hormigon-impreso-en-moraira',            destination: '/zonas/moraira/',   permanent: true },
  { source: '/hormigon-pulido-en-ribarroja-del-turia', destination: '/zonas/ribarroja/', permanent: true },
  { source: '/hormigon-pulido-en-xabia',               destination: '/zonas/xabia/',     permanent: true },
  { source: '/hormigon-pulido-en-alicante',            destination: '/zonas/alicante/',  permanent: true },
  { source: '/pavimentos-de-hormigon-impreso-en-denia',destination: '/zonas/denia/',     permanent: true },
  { source: '/hormigon-lavado-en-valencia-godella',    destination: '/zonas/godella/',   permanent: true },
  { source: '/microcemento-alicante-2021',             destination: '/zonas/alicante/',  permanent: true },

  // Artículos divulgativos → /blog/
  { source: '/pavimentos-de-hormigon-impreso-innovacion-y-estilo-para-tus-espacios',
    destination: '/blog/hormigon-impreso-innovacion-y-estilo/', permanent: true },
  { source: '/brillo-y-elegancia-explorando-el-hormigon-pulido',
    destination: '/blog/guia-hormigon-pulido/', permanent: true },
  { source: '/descubriendo-la-elegancia-y-durabilidad-del-hormigon-impreso-en-valencia',
    destination: '/blog/hormigon-impreso-valencia-guia/', permanent: true },

  // Vertical de pádel — 301 externo
  { source: '/pistas-de-padel-y-pickleball', destination: 'https://padelalbufera.com/', permanent: true },

  // Versión francesa, si se elimina (decisión 5 del §11)
  { source: '/fr/:path*', destination: '/', permanent: true },

  // Legales
  { source: '/cookies', destination: '/politica-de-cookies/', permanent: true },
]
```

Las URLs de proyecto e índice con `?` de filtro no se redirigen: no existían.

⚠️ Decisión 7 del §11 aún abierta: si el cliente prefiere **riesgo cero**, las cuatro URLs de
servicio se mantienen tal cual y se eliminan las cuatro primeras líneas de este bloque. Las
actuales tienen antigüedad e historial; simplificarlas es una mejora, pero no gratis.

## 4. Metadatos

Del §7.5. `title` ≤ 60 caracteres, `description` ≤ 155.

| Ruta | Title |
|---|---|
| `/` | Pavimentos de hormigón en Valencia \| Pavimentos Albufera |
| `/hormigon-impreso/` | Hormigón impreso Valencia \| Precio y acabados |
| `/hormigon-pulido/` | Hormigón pulido Valencia \| Interior e industrial |
| `/microcemento/` | Microcemento en Valencia \| Sin obra ni escombros |
| `/hormigon-lavado/` | Hormigón lavado y árido visto en Valencia |
| `/acabados/` | Muestrario de acabados de hormigón impreso |
| `/precios/` | Precio del hormigón impreso por m² en 2026 |
| `/proyectos/` | Proyectos ejecutados \| Pavimentos Albufera |
| `/empresa/` | Quiénes somos \| Pavimentos Albufera |
| `/presupuesto/` | Pide presupuesto sin compromiso |

Las descripciones completas están en el §7.5 del documento maestro. Para las rutas generadas
(`[slug]`, `[modelo]`, `[municipio]`) se construyen desde los datos, sin plantilla vacía:
`Hormigón impreso en Moraira · adoquín pequeño color arena | Pavimentos Albufera`.

Canónica absoluta en todas las páginas. `noindex` en `/author/*` y en las páginas huérfanas de
la versión francesa.

## 5. Datos estructurados

Hoy no hay ninguno. Todos en JSON-LD.

| Tipo | Dónde |
|---|---|
| `LocalBusiness` / `HomeAndConstructionBusiness` | En todas las páginas, desde `layout.tsx`. NAP único, horario, `areaServed`, coordenadas |
| `Service` | Cada página de servicio |
| `FAQPage` | Home y cada servicio, generado del mismo array que renderiza el acordeón |
| `BreadcrumbList` | Todo el sitio, desde el componente de migas |
| `ImageObject` | Fichas de proyecto |
| `AggregateRating` | **Solo cuando haya reseñas reales verificables.** Marcarlo sin ellas es penalización segura |

El `FAQPage` y el acordeón deben leer la **misma** fuente de datos. Si divergen, Google detecta
marcado que no está en la página.

## 6. Formulario de presupuesto

```ts
// app/presupuesto/actions.ts
'use server'

export async function enviarPresupuesto(prev: Estado, formData: FormData): Promise<Estado> {
  // 1. Honeypot: campo oculto con nombre plausible. Si viene relleno → éxito falso, sin enviar
  // 2. Límite por IP: 3 envíos / hora
  // 3. Validación con zod. Teléfono: 9 dígitos exactos tras limpiar espacios y prefijo +34
  // 4. Adjunto: máx 10 MB, solo image/*
  // 5. Resend → comercial@pavimentos-albufera.com, con reply-to del cliente
  // 6. Devolver estado para los 4 estados de UI de 02-pantallas §B1
}
```

Usar `useActionState` para los estados. Sin librería de formularios: son 9 campos.
Progressive enhancement: el `<form>` con `action` funciona sin JS.

WhatsApp con mensaje predefinido:
`https://wa.me/34XXXXXXXXX?text=Hola%2C%20quiero%20presupuesto%20para%20...`

## 7. Imágenes

- `next/image` con AVIF y WebP. Sustituye a ShortPixel.
- `sizes` explícito en cada uso; las de la rejilla del muestrario no deben descargarse a ancho
  completo.
- `priority` **solo** en la imagen del hero de cada página.
- `alt` descriptivo obligatorio: *«Entrada de garaje en Moncada con hormigón impreso modelo
  espiga en color 117»*. Nunca el nombre del archivo.
- Originales a 2400 px de ancho mínimo. **Bloqueante:** los de producción están a 500×400.
- Mientras falten, `<BloquePosicion>` — no imágenes provisionales de stock.

## 8. Rendimiento

Objetivos: **LCP < 2,0 s en 4G · CLS < 0,05 · INP < 200 ms · JS inicial < 100 KB comprimido.**

- Componentes de servidor por defecto. `'use client'` solo en: filtros del muestrario y del
  índice, acordeón, calculadora, formulario, menú móvil, hoja de filtros y submenú anclado.
- Fuentes con `next/font` y `display: swap`, subconjunto latino. Las tres familias son
  variables: un archivo por familia.
- Sin librería de animación. Las tres transiciones del §8.6 se hacen con CSS y un
  `IntersectionObserver` de 20 líneas.
- Sin librería de iconos: los pocos que hay (hamburguesa, ×, flecha) son SVG en línea o
  caracteres.
- `CLS`: toda imagen y todo bloque de posición con proporción declarada. Las barras ancladas
  reservan su alto.

## 9. Analítica y consentimiento

GA4 + Search Console. Hoy no se detecta ninguno de los dos.

Banner de consentimiento conforme al RGPD: **nada se carga antes de aceptar**. El banner es un
componente sobrio en `--tinta` con los mismos botones del sistema, anclado abajo en escritorio
y por encima de la barra fija en móvil. Sin sombra, sin radio, sin animación de entrada.

Eventos mínimos: envío de formulario, clic en `Llamar`, clic en `WhatsApp`, uso de la
calculadora, y filtro aplicado en el muestrario (dice qué acabados interesan de verdad).

## 10. Despliegue en GitHub y Vercel

```bash
# 1. Repositorio
git init
git add -A
git commit -m "Sistema de diseño y fundamentos"
gh repo create pavimentos-albufera --private --source=. --push

# 2. Vercel
vercel link
vercel env add RESEND_API_KEY production
vercel env add NEXT_PUBLIC_GA_ID production
vercel env add TELEFONO_CONTACTO production
vercel --prod
```

Variables de entorno:

| Variable | Uso |
|---|---|
| `RESEND_API_KEY` | Envío del formulario |
| `EMAIL_DESTINO` | comercial@pavimentos-albufera.com |
| `NEXT_PUBLIC_GA_ID` | GA4 |
| `NEXT_PUBLIC_TELEFONO` | NAP único, usado en cabecera, pie, barra y schema |
| `NEXT_PUBLIC_WHATSAPP` | Número para el enlace `wa.me` |
| `NEXT_PUBLIC_SITE_URL` | Canónicas y sitemap |

Ramas: `main` → producción; cada rama de trabajo genera su *preview* en Vercel, que es lo que se
manda a revisar en lugar de capturas.

**Comprobación previa a apuntar el dominio:**

1. Desplegar en el dominio de Vercel y validar las 30 redirecciones contra el dominio antiguo.
2. Lighthouse móvil ≥ 95 en rendimiento y 100 en accesibilidad.
3. Rich Results Test de Google en home, un servicio y una ficha de proyecto.
4. Solo entonces cambiar los DNS, y enviar el sitemap nuevo en Search Console.
5. Vigilar 404 y posiciones durante 8 semanas.

## 11. Orden de trabajo sugerido

Cada paso es desplegable y revisable por separado:

1. Fundamentos: tokens, fuentes, `layout`, cabecera, pie, barra fija.
2. Modelo de datos y utilidades de filtrado desde `content/`.
3. Home — deja construidos casi todos los componentes.
4. Muestrario y ficha de acabado.
5. Servicio de impreso, y de ahí los otros cinco.
6. Índice y ficha de proyecto.
7. Presupuesto, con la Server Action y sus cuatro estados.
8. Precios y calculadora.
9. Empresa, zonas, blog, legales, 404.
10. SEO técnico: redirecciones, sitemap, robots, canónicas, JSON-LD.
11. Analítica, consentimiento y la lista de comprobación del README §12.
