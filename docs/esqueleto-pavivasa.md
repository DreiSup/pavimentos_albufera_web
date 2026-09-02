# Esqueleto replicable — Pavivasa

Documento de arranque para crear la web de **Pavivasa** con la misma arquitectura que
pavimentos-albufera.com. Contiene el análisis del repositorio original, el árbol mínimo
funcional, el código íntegro de cada archivo del esqueleto y los pasos para levantarlo.

El esqueleto que describe este documento **se ha construido y verificado**: `npm run build`
pasa sin avisos (11 rutas, 103 KB de JS compartido) y `npm run lint` no da errores.

---

## 1. Qué es la arquitectura original

El repositorio de Pavimentos Albufera es un sitio Next.js 15 (App Router) + React 19 +
Tailwind 3 + TypeScript estricto, 100 % estático (SSG), con cuatro capas:

| Capa | Carpeta | Qué contiene |
|---|---|---|
| Configuración | raíz | `next.config.ts` (trailingSlash, redirecciones 301), `tailwind.config.ts` (tokens), `tsconfig.json`, `.env.example` |
| Datos | `lib/` + `content/` | NAP único (`config.ts`), tipos del catálogo (`tipos.ts`), acceso a JSON (`datos.ts`), JSON-LD (`schema.tsx`), tracking (`eventos.ts`, `meta-capi.ts`) |
| Componentes | `components/` | `layout/` (cabecera, pie, barra móvil, migas, consentimiento, eventos globales), `ui/` (botón, campo, chip…), `datos/` (etiquetas técnicas, dato pendiente), `contenido/` (tarjetas), `secciones/` (formulario, acordeón, filtros, calculadora) |
| Rutas | `app/` | `layout.tsx` global, home, servicios, catálogo, proyectos, zonas, blog, precios, empresa, presupuesto (con Server Action), legales, 404, `sitemap.ts`, `robots.ts` |

Principios que sostienen todo:

- **Un componente por concepto, no por pantalla.** La misma tarjeta se usa en la home, en el índice y en la ficha.
- **Componentes de servidor por defecto.** `'use client'` solo en: cabecera, menú móvil, consentimiento, eventos globales, formulario, filtros, acordeón, calculadora.
- **Un solo NAP.** Teléfono, WhatsApp, dirección y email salen de `lib/config.ts` y de variables de entorno. Nunca escritos a mano en una plantilla.
- **El dato pendiente es un componente.** `<DatoPendiente>` pinta `[valor]` con subrayado punteado. Sin maquillar datos que no existen.
- **Rutas generadas desde `content/*.json`** con `generateStaticParams`. El sitemap se genera, nunca se escribe a mano.
- **Tracking con consentimiento previo.** Nada se carga hasta aceptar. Un único punto de salida de eventos (`registrarEvento`) hacia GA4, Google Ads y Meta Pixel; el Lead se duplica al servidor por Meta CAPI con `event_id` compartido.

---

## 2. Arquitectura de tracking (lo que hay que conservar tal cual)

```
Navegador                                            Servidor (Server Action)
─────────                                            ────────────────────────
Consentimiento.tsx
  └─ localStorage 'pv-consentimiento'
     ├─ aceptado → carga gtag.js (GA4 + Google Ads, mismo script)
     │            carga fbevents.js (Meta Pixel)  → PageView
     └─ rechazado / pendiente → no carga nada

EventosGlobales.tsx (delegación de clic en todo el documento)
  ├─ href tel:      → registrarEvento('clic_llamar',   { metaEstandar: 'Contact' })
  └─ href wa.me     → registrarEvento('clic_whatsapp', { metaEstandar: 'Contact' })

FormularioPresupuesto.tsx
  ├─ genera evento_id (crypto.randomUUID) y lo manda como campo oculto ──────┐
  ├─ envía el <form> por useActionState ──────────────────────────────────►  enviarPresupuesto()
  └─ al recibir estado 'enviado':                                            ├─ honeypot
       registrarEvento('envio_formulario', {                                 ├─ zod
         metaEstandar: 'Lead',                                               ├─ límite 3/h por IP
         metaEventId: evento_id,        ◄── mismo id ──────────────────────  ├─ Resend (email)
         conversionAds: true })                                              ├─ Telegram (aviso)
                                                                             └─ Meta CAPI 'Lead'
lib/eventos.ts → registrarEvento()                                              con event_id, ph/em
  ├─ gtag('event', nombre, params)                 → GA4                        hasheados, fbp/fbc
  ├─ gtag('event', 'conversion', { send_to })      → Google Ads (si conversionAds)
  └─ fbq('track' | 'trackCustom', evento, params, { eventID })  → Meta Pixel
```

Cada integración es **opcional por variable de entorno**: sin ID no se carga el script, sin
token no se llama a la API, y nunca se rompe el envío del formulario por un fallo de terceros.

Diferencia respecto al original: el esqueleto añade `NEXT_PUBLIC_GOOGLE_ADS_ID` y
`NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL`. El original solo configura GA4 en gtag; para Google Ads
había que añadir el `config` del ID `AW-…` y el evento `conversion`. Aquí ya está hecho.

---

## 3. Qué se copia, qué se parametriza, qué se deja fuera

| Archivo original | Decisión | Motivo |
|---|---|---|
| `next.config.ts` | **Parametrizar** | Se conserva `trailingSlash` e `images`; las 30 redirecciones 301 son de Albufera, se vacía la lista |
| `tailwind.config.ts`, `app/globals.css` | **Copiar** | Nombres de tokens que usan todos los componentes. Cambiar valores cuando Pavivasa tenga paleta |
| `tsconfig.json`, `postcss.config.mjs`, `.eslintrc.json`, `.gitignore` | **Copiar** | Sin cambios |
| `package.json` | **Parametrizar** | Solo el nombre. Mismas 4 dependencias de runtime (next, react, react-dom, zod) |
| `.env.example` | **Parametrizar** | Mismas variables + las dos de Google Ads |
| `lib/config.ts` | **Parametrizar** | Nombre, email, municipio, provincia. Estructura idéntica |
| `lib/eventos.ts` | **Copiar (+ Ads)** | Añadida la opción `conversionAds` |
| `lib/meta-capi.ts` | **Copiar** | Sin cambios |
| `lib/schema.tsx` | **Parametrizar** | `areaServed` sale del NAP en vez de estar escrito |
| `lib/tipos.ts` | **Reducir** | Se deja el patrón (`ServicioId`, `Proyecto`, `NOMBRE_SERVICIO`, `RUTA_SERVICIO`) con valores de relleno. Modelos, colores, acabados y zonas son del catálogo de Albufera |
| `lib/datos.ts` | **Reducir** | Solo `proyectos` y tres funciones de acceso. Ampliar según catálogo |
| `content/*.json` | **Vaciar** | `proyectos.json` = `[]`. El resto es contenido de Albufera |
| `app/layout.tsx`, `fuentes.ts`, `robots.ts`, `sitemap.ts`, `not-found.tsx` | **Copiar** | Nombres de fuentes neutros (`display`, `texto`, `mono`) |
| `app/page.tsx` | **Reducir** | Hero + formulario corto. El resto de secciones eran copy de Albufera |
| `app/presupuesto/*` | **Copiar** | Server Action completa. Campos `superficie` y `foto` quitados por ser específicos de pavimentos |
| `app/proyectos/*` | **Reducir** | Se deja como **patrón de ruta dinámica** con `generateStaticParams` y `generateMetadata` |
| `app/aviso-legal`, `politica-de-*` | **Copiar** | Comparten `PlantillaLegal` |
| `components/layout/*` | **Copiar** | Salvo `BarraConfianza` (datos de Albufera). Logo sale de `nap.nombre` |
| `components/ui/Boton`, `Campo`, `AntetituloSeccion` | **Copiar** | Base del sistema |
| `components/datos/DatoPendiente` | **Copiar** | |
| `components/secciones/FormularioPresupuesto`, `PlantillaLegal` | **Copiar** | Opciones del desplegable como relleno |
| `app/hormigon-impreso`, `acabados`, `zonas`, `blog`, `precios`, `empresa` | **Fuera** | Contenido y catálogo de Albufera. Reproducir el patrón cuando toque |
| `components/ui/Chip`, `EnlaceEtiqueta`, `EstadoVacio`, `Aparece` | **Fuera** | Solo los usan filtros y secciones de catálogo. Recuperar del original al añadir filtros |
| `components/datos/EtiquetaTecnica`, `FichaObra`, `TablaFichaTecnica` | **Fuera** | Ídem |
| `components/contenido/*` | **Fuera** | Tarjetas ligadas al catálogo de Albufera |
| `components/secciones/Acordeon`, `Calculadora`, `Filtros*`, `SubmenuServicio` | **Fuera** | Recuperar cuando haga falta; el código del original es reutilizable tal cual |
| `design/` | **Fuera** | Paquete de handoff de Albufera. Pavivasa necesitará el suyo |

---

## 4. Árbol del esqueleto

```
pavivasa-web/
├── .env.example
├── .eslintrc.json
├── .gitignore
├── CLAUDE.md
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
│
├── app/
│   ├── layout.tsx                    cabecera, pie, barra móvil, consentimiento, JSON-LD global
│   ├── page.tsx                      / (home mínima)
│   ├── fuentes.ts                    next/font: display, texto, mono
│   ├── globals.css                   tokens + reglas base
│   ├── not-found.tsx                 404
│   ├── robots.ts
│   ├── sitemap.ts                    generado desde content/
│   ├── presupuesto/
│   │   ├── page.tsx
│   │   └── actions.ts                Server Action: honeypot, zod, rate limit, Resend, Telegram, CAPI
│   ├── proyectos/
│   │   ├── page.tsx                  índice (patrón de listado)
│   │   └── [slug]/page.tsx           ficha (patrón de ruta generada)
│   ├── aviso-legal/page.tsx
│   ├── politica-de-privacidad/page.tsx
│   └── politica-de-cookies/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Cabecera.tsx              'use client' · navegación, scroll, menú móvil
│   │   ├── MenuMovil.tsx             'use client' · diálogo con foco atrapado
│   │   ├── Pie.tsx
│   │   ├── BarraMovil.tsx            Llamar / WhatsApp fija en móvil
│   │   ├── Migas.tsx                 migas + BreadcrumbList
│   │   ├── Consentimiento.tsx        'use client' · banner RGPD, carga gtag y Pixel
│   │   └── EventosGlobales.tsx       'use client' · clics tel:/wa.me → eventos
│   ├── ui/
│   │   ├── Boton.tsx
│   │   ├── Campo.tsx
│   │   └── AntetituloSeccion.tsx
│   ├── datos/
│   │   └── DatoPendiente.tsx
│   └── secciones/
│       ├── FormularioPresupuesto.tsx 'use client' · useActionState + evento Lead
│       └── PlantillaLegal.tsx
│
├── content/
│   └── proyectos.json                []
├── lib/
│   ├── config.ts                     NAP + IDs de tracking desde .env
│   ├── eventos.ts                    registrarEvento → GA4 / Ads / Pixel
│   ├── meta-capi.ts                  Lead servidor → Meta CAPI
│   ├── schema.tsx                    JSON-LD: negocio, servicio, FAQ, migas
│   ├── tipos.ts                      modelo de contenido
│   └── datos.ts                      acceso a content/
└── public/
    └── .gitkeep
```

---

## 5. Variables de entorno

| Variable | Uso | Sin ella |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canónicas, sitemap, JSON-LD, CAPI | Usa `https://pavivasa.com` |
| `NEXT_PUBLIC_TELEFONO` | NAP: cabecera, pie, barra, schema | Se muestra `[9XX XXX XXX]` pendiente |
| `NEXT_PUBLIC_WHATSAPP` | Enlace `wa.me` | Botones WhatsApp llevan a `/presupuesto/` |
| `NEXT_PUBLIC_DIRECCION` | NAP y schema | Se muestra dirección pendiente |
| `RESEND_API_KEY` | Email del formulario | No se envía email (el resto sigue) |
| `EMAIL_DESTINO` | Destinatario y email público | `info@pavivasa.com` |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Aviso instantáneo de lead | No se avisa |
| `NEXT_PUBLIC_GA_ID` | GA4 (`G-…`) | No se carga gtag para GA4 |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Google Ads (`AW-…`) | No se configura Ads |
| `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL` | Etiqueta de conversión de Ads | No se dispara la conversión |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel y CAPI | No se carga Pixel ni se llama a CAPI |
| `META_CAPI_ACCESS_TOKEN` | Meta CAPI | No se llama a CAPI |

---

## 6. Cómo levantarlo

```bash
# 1. Crear la carpeta y pegar los archivos de la sección 7 en su ruta
mkdir pavivasa-web && cd pavivasa-web

# 2. Instalar y comprobar
npm install
cp .env.example .env.local
npm run build      # debe pasar sin warnings
npm run lint
npm run dev

# 3. Repositorio y despliegue
git init && git add -A && git commit -m "Esqueleto base Pavivasa"
# crear el repo en GitHub y hacer push
# en Vercel: importar el repo y cargar las variables de .env.example
```

Orden de trabajo sugerido a partir del esqueleto:

1. Tokens de Pavivasa en `tailwind.config.ts` y `globals.css` (mismos nombres, otros valores). Fuentes en `app/fuentes.ts`.
2. NAP real en `lib/config.ts` y `.env`.
3. Catálogo en `lib/tipos.ts`: servicios reales, campos de obra. Rellenar `content/proyectos.json`.
4. Páginas de servicio: una carpeta por servicio con la ruta de `RUTA_SERVICIO`.
5. Home con el copy real. Recuperar del original `Acordeon`, `Chip`, tarjetas y filtros cuando haga falta.
6. Redirecciones 301 en `next.config.ts` si migra de una web anterior.
7. Textos legales de asesoría en las tres páginas legales.
8. Cargar los IDs de GA4, Google Ads y Meta en Vercel y comprobar en cada consola que llegan `PageView`, `Contact` y `Lead`.

---

## 7. Código de cada archivo

Cada bloque va precedido de su ruta. Copiar tal cual.

### `package.json`

```json
{
  "name": "pavivasa-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.5.22",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.7",
    "@types/react": "^19.0.7",
    "@types/react-dom": "^19.0.3",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.18.0",
    "eslint-config-next": "15.5.22",
    "postcss": "^8.5.1",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3"
  }
}
```

### `next.config.ts`

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Barra final fija: una sola URL canónica por página. No cambiar.
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    // Redirecciones 301 de la web anterior (si la hay). Con trailingSlash:true
    // cada `source` tiene que llevar barra final para coincidir.
    return [
      // { source: '/contacto/', destination: '/presupuesto/', permanent: true },
    ]
  },
}

export default nextConfig
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "design"]
}
```

### `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss'

/**
 * Pavivasa — tokens de diseño.
 * Los NOMBRES de los tokens los usan todos los componentes: no cambiarlos.
 * Los VALORES son los de arranque: sustituir por la paleta y escala de Pavivasa.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}', './content/**/*.mdx'],
  theme: {
    // Se reemplaza la paleta por defecto de Tailwind: solo existen estos colores.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      fondo: '#E9EAE6',
      'fondo-alt': '#DADCD6',
      tinta: '#1B1E1C',
      'tinta-media': '#5C625E',
      pigmento: '#D9A441',
      'pigmento-hover': '#C6902F',
      acero: '#41535C',
      'sobre-tinta': '#DADCD6',
      'pendiente-oscuro': '#9AA09B',
      error: '#8C3A2B',
    },
    borderRadius: { none: '0', DEFAULT: '0' },
    boxShadow: {
      none: 'none',
      // La única sombra del sitio: barra fija de móvil
      barra: '0 -6px 18px rgba(27,30,28,0.18)',
    },
    fontFamily: {
      display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
    },
    fontSize: {
      // Datos (monoespaciada). 10 es el suelo absoluto.
      'd-10': ['10px', { lineHeight: '1.8', letterSpacing: '0.03em' }],
      'd-11': ['11px', { lineHeight: '1.9', letterSpacing: '0.03em' }],
      'd-12': ['12px', { lineHeight: '1.7', letterSpacing: '0.05em' }],
      'd-14': ['14px', { lineHeight: '1.7', letterSpacing: '0.03em' }],
      // Texto
      14: ['14px', { lineHeight: '1.6' }],
      16: ['16px', { lineHeight: '1.6' }],
      20: ['20px', { lineHeight: '1.6' }],
      // Display
      26: ['26px', { lineHeight: '1.25' }],
      34: ['34px', { lineHeight: '1.15' }],
      46: ['46px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      64: ['64px', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
      88: ['88px', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
    },
    extend: {
      minHeight: { tactil: '44px', campo: '48px', boton: '56px' },
      spacing: {
        'lat-movil': '18px',
        'lat-desktop': '48px',
        cabecera: '84px',
        'cabecera-scroll': '60px',
      },
      maxWidth: { lectura: '68ch', contenido: '1344px' },
      transitionDuration: { cabecera: '150ms' },
    },
  },
  plugins: [],
}

export default config
```

### `postcss.config.mjs`

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config
```

### `.eslintrc.json`

```json
{
  "extends": "next/core-web-vitals"
}
```

### `.env.example`

```text
# --- Sitio ---
NEXT_PUBLIC_SITE_URL=https://pavivasa.com
NEXT_PUBLIC_TELEFONO=
NEXT_PUBLIC_WHATSAPP=
NEXT_PUBLIC_DIRECCION=

# --- Formulario de presupuesto ---
RESEND_API_KEY=
EMAIL_DESTINO=info@pavivasa.com
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# --- Analítica y publicidad (nada se carga sin consentimiento) ---
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=
NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=
NEXT_PUBLIC_META_PIXEL_ID=
META_CAPI_ACCESS_TOKEN=
```

### `.gitignore`

```text
# dependencies
/node_modules

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# typescript
*.tsbuildinfo
next-env.d.ts

# vercel
.vercel
```

### `CLAUDE.md`

```markdown
# CLAUDE.md — Pavivasa

Web de Pavivasa en Next.js 15 (App Router) + Tailwind. Esqueleto derivado de la
arquitectura de pavimentos-albufera.com. Ver `docs/` para la especificación cuando exista.

## Reglas de este proyecto

**Diseño**

- Tokens en `tailwind.config.ts` y `app/globals.css`. Cambiar valores, no nombres.
  No añadir colores fuera de la paleta.
- `border-radius: 0` en todo. Una sola sombra: la barra fija de móvil.
- Escala tipográfica cerrada: 12 / 14 / 16 / 20 / 26 / 34 / 46 / 64 / 88.
- Tres familias: display, texto y datos (monoespaciada). Suelo de la mono: 10 px.
- Color de acento (`pigmento`): un CTA primario y el estado activo por pantalla. Nada más.
- Layout siempre con flex/grid y `gap`. Nunca márgenes por elemento.

**Contenido**

- Copy solo del documento maestro. No inventar texto, datos, testimonios ni reseñas.
- Dato sin confirmar → `<DatoPendiente>`; se ve entre corchetes atenuados.
- Un solo teléfono y una sola dirección en todo el sitio, desde `lib/config.ts`.

**Técnica**

- Componentes de servidor por defecto. `'use client'` solo donde hay estado real.
- Presupuesto de JS inicial: 100 KB comprimido. Sin librerías de animación, iconos ni formularios.
- `trailingSlash: true` fijo.
- Sin `AggregateRating` mientras no haya reseñas verificables.
- 44 px de objetivo táctil, foco visible, contraste AA, `prefers-reduced-motion` respetado.
- Analítica y publicidad solo tras consentimiento (`components/layout/Consentimiento.tsx`).
- Todo evento sale por `registrarEvento` (`lib/eventos.ts`). Nunca `gtag`/`fbq` directos.

## Comandos

```bash
npm run dev
npm run build       # debe pasar sin warnings antes de cada commit
npm run lint
```
```

### `lib/config.ts`

```ts
/**
 * NAP único del sitio (nombre, dirección, teléfono). Ningún componente escribe
 * un teléfono o una dirección a mano: todo sale de aquí. Lo que aún no esté
 * confirmado llega vacío por variable de entorno y se muestra con <DatoPendiente>.
 */

const telefonoEnv = process.env.NEXT_PUBLIC_TELEFONO?.trim() || undefined
const whatsappEnv = process.env.NEXT_PUBLIC_WHATSAPP?.trim() || undefined
const direccionEnv = process.env.NEXT_PUBLIC_DIRECCION?.trim() || undefined

export const nap = {
  nombre: 'Pavivasa',
  email: process.env.EMAIL_DESTINO ?? 'info@pavivasa.com',
  telefono: telefonoEnv,
  telefonoMostrado: telefonoEnv ?? '9XX XXX XXX',
  telefonoHref: telefonoEnv ? `tel:+34${telefonoEnv.replace(/\D/g, '')}` : undefined,
  whatsapp: whatsappEnv,
  whatsappHref: whatsappEnv
    ? `https://wa.me/34${whatsappEnv.replace(/\D/g, '')}?text=${encodeURIComponent(
        'Hola, quiero presupuesto para ',
      )}`
    : undefined,
  direccion: direccionEnv,
  direccionMostrada: direccionEnv ?? 'CALLE Y NÚMERO · MUNICIPIO · CP',
  municipio: 'MUNICIPIO',
  codigoPostal: '00000',
  provincia: 'PROVINCIA',
  pais: 'ES',
}

export const sitio = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pavivasa.com',
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  googleAdsLeadLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL,
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
}
```

### `lib/eventos.ts`

```ts
import { sitio } from './config'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

type OpcionesEvento = {
  params?: Record<string, unknown>
  /** Nombre de evento estándar de Meta (Lead, Contact...). Sin esto, se manda como trackCustom. */
  metaEstandar?: string
  /** Para deduplicar con Meta CAPI en el mismo evento (event_id compartido). */
  metaEventId?: string
  /** Si es true, además dispara la conversión de Google Ads configurada en .env. */
  conversionAds?: boolean
}

/**
 * Único punto de salida de eventos hacia GA4, Google Ads y Meta Pixel.
 * No-op seguro si el script no cargó (sin consentimiento o sin ID).
 */
export function registrarEvento(nombre: string, opciones?: OpcionesEvento) {
  if (typeof window === 'undefined') return

  window.gtag?.('event', nombre, opciones?.params)

  if (opciones?.conversionAds && sitio.googleAdsId && sitio.googleAdsLeadLabel) {
    window.gtag?.('event', 'conversion', {
      send_to: `${sitio.googleAdsId}/${sitio.googleAdsLeadLabel}`,
    })
  }

  const evento = opciones?.metaEstandar ?? nombre
  const metodo = opciones?.metaEstandar ? 'track' : 'trackCustom'
  if (opciones?.metaEventId) {
    window.fbq?.(metodo, evento, opciones?.params ?? {}, { eventID: opciones.metaEventId })
  } else {
    window.fbq?.(metodo, evento, opciones?.params)
  }
}
```

### `lib/meta-capi.ts`

```ts
import { createHash } from 'crypto'

function hash(valor: string) {
  return createHash('sha256').update(valor.trim().toLowerCase()).digest('hex')
}

type EventoCAPI = {
  eventoId: string
  telefono: string
  email?: string
  ip: string
  userAgent: string
  url: string
  fbp?: string
  fbc?: string
}

/**
 * Manda el evento Lead a Meta Conversions API, deduplicado con el Pixel del
 * navegador vía el mismo event_id. Sin credenciales, no hace nada y no falla.
 */
export async function enviarEventoCAPI(evento: EventoCAPI) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const token = process.env.META_CAPI_ACCESS_TOKEN
  if (!pixelId || !token) return

  const userData: Record<string, unknown> = {
    ph: [hash(evento.telefono)],
    client_ip_address: evento.ip,
    client_user_agent: evento.userAgent,
  }
  if (evento.email) userData.em = [hash(evento.email)]
  if (evento.fbp) userData.fbp = evento.fbp
  if (evento.fbc) userData.fbc = evento.fbc

  try {
    await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [
          {
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            event_id: evento.eventoId,
            action_source: 'website',
            event_source_url: evento.url,
            user_data: userData,
          },
        ],
      }),
      signal: AbortSignal.timeout(8000),
    })
  } catch {
    // No bloquea el envío del presupuesto por un fallo de Meta.
  }
}
```

### `lib/schema.tsx`

```tsx
import { nap, sitio } from './config'
import type { ServicioId } from './tipos'

export function schemaNegocioLocal() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: nap.nombre,
    url: sitio.url,
    email: nap.email,
    ...(nap.telefonoHref ? { telephone: nap.telefonoHref.replace('tel:', '') } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: nap.direccion ?? undefined,
      addressLocality: nap.municipio,
      postalCode: nap.codigoPostal,
      addressRegion: nap.provincia,
      addressCountry: nap.pais,
    },
    areaServed: [{ '@type': 'AdministrativeArea', name: nap.provincia }],
  }
}

export function schemaServicio(servicio: ServicioId, nombre: string, ruta: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: nombre,
    provider: { '@type': 'HomeAndConstructionBusiness', name: nap.nombre },
    areaServed: [nap.provincia],
    url: `${sitio.url}${ruta}`,
  }
}

export function schemaFAQ(preguntas: { pregunta: string; respuesta: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: preguntas.map((p) => ({
      '@type': 'Question',
      name: p.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: p.respuesta },
    })),
  }
}

export function schemaMigas(items: { nombre: string; ruta?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.nombre,
      ...(item.ruta ? { item: `${sitio.url}${item.ruta}` } : {}),
    })),
  }
}

export function JsonLd({ data }: { data: object }) {
  return (
    // eslint-disable-next-line react/no-danger
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
```

### `lib/tipos.ts`

```ts
/**
 * Modelo de contenido. Aquí se define el catálogo de la empresa: qué servicios
 * ofrece y qué datos tiene cada obra. Ampliar según el negocio de Pavivasa.
 */

export type ServicioId = 'servicio-a' | 'servicio-b'

export type Imagen = {
  src: string
  alt: string
}

export type Proyecto = {
  slug: string
  titulo: string
  municipio: string | null
  servicio: ServicioId
  superficie?: number | null
  anio?: number | null
  imagenes: Imagen[]
  destacado: boolean
}

export const NOMBRE_SERVICIO: Record<ServicioId, string> = {
  'servicio-a': 'Servicio A',
  'servicio-b': 'Servicio B',
}

export const RUTA_SERVICIO: Record<ServicioId, string> = {
  'servicio-a': '/servicio-a/',
  'servicio-b': '/servicio-b/',
}
```

### `lib/datos.ts`

```ts
import proyectosJson from '@/content/proyectos.json'
import type { Proyecto, ServicioId } from './tipos'

/** Toda lectura de contenido pasa por aquí. Las páginas nunca importan JSON directamente. */
export const proyectos = proyectosJson as unknown as Proyecto[]

export function proyectoPorSlug(slug: string): Proyecto | undefined {
  return proyectos.find((p) => p.slug === slug)
}

export function proyectosPorServicio(servicio: ServicioId, excluir?: string): Proyecto[] {
  return proyectos.filter((p) => p.servicio === servicio && p.slug !== excluir)
}

export function proyectosDestacados(): Proyecto[] {
  return proyectos.filter((p) => p.destacado)
}
```

### `content/proyectos.json`

```json
[]
```

### `app/fuentes.ts`

```ts
import { Archivo, Instrument_Sans, Martian_Mono } from 'next/font/google'

/** Tres familias: display, texto y datos. Cambiar aquí; los componentes usan las variables CSS. */
export const display = Archivo({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-display',
})

export const texto = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-sans',
})

export const mono = Martian_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
})
```

### `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Pavivasa — tokens. Mismos valores que tailwind.config.ts: cambiar en los dos sitios. */
:root {
  --fondo: #e9eae6;
  --fondo-alt: #dadcd6;
  --tinta: #1b1e1c;
  --tinta-media: #5c625e;
  --pigmento: #d9a441;
  --acero: #41535c;

  --pigmento-hover: #c6902f;
  --sobre-tinta: #dadcd6;
  --pendiente-oscuro: #9aa09b;
  --error: #8c3a2b;

  --cabecera: 84px;
  --cabecera-scroll: 60px;
  --ancla-offset: 150px;
  --cabecera-actual: 84px;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--fondo);
  color: var(--tinta);
  font-size: 16px;
  line-height: 1.6;
  text-wrap: pretty;
}

a {
  color: inherit;
}

::selection {
  background: var(--pigmento);
  color: var(--tinta);
}

/* Foco visible en todo elemento interactivo. Nunca outline: none. */
:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: 2px solid var(--pigmento);
  outline-offset: 2px;
}
:where(.btn-primario):focus-visible {
  outline: 2px solid var(--tinta);
  outline-offset: 3px;
}

/* Radio 0 en todo el sitio */
:where(button, input, select, textarea, img, video, figure, article, aside) {
  border-radius: 0;
}

/* Dato sin confirmar por el cliente */
.pendiente {
  color: var(--tinta-media);
  border-bottom: 1px dotted var(--tinta-media);
}
.sobre-oscuro .pendiente {
  color: var(--pendiente-oscuro);
  border-bottom-color: var(--pendiente-oscuro);
}

/* Secciones destino de anclas */
[id^='seccion-'] {
  scroll-margin-top: var(--ancla-offset);
}

/* Movimiento contenido, y desactivable */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Eje de anchura de la display. Ajustar a la fuente elegida. */
.fs-hero {
  font-stretch: 125%;
}
.fs-h2 {
  font-stretch: 120%;
}
.fs-h3 {
  font-stretch: 115%;
}
.fs-logo {
  font-stretch: 118%;
}
```

### `app/layout.tsx`

```tsx
import type { Metadata } from 'next'
import { nap, sitio } from '@/lib/config'
import { JsonLd, schemaNegocioLocal } from '@/lib/schema'
import Cabecera from '@/components/layout/Cabecera'
import Pie from '@/components/layout/Pie'
import BarraMovil from '@/components/layout/BarraMovil'
import Consentimiento from '@/components/layout/Consentimiento'
import EventosGlobales from '@/components/layout/EventosGlobales'
import { display, texto, mono } from './fuentes'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(sitio.url),
  title: {
    default: `${nap.nombre}`,
    template: `%s | ${nap.nombre}`,
  },
  description: 'Descripción del sitio pendiente.',
  alternates: { canonical: '/' },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#E9EAE6',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${texto.variable} ${mono.variable}`}>
      <body className="font-sans text-tinta bg-fondo min-h-dvh flex flex-col">
        <JsonLd data={schemaNegocioLocal()} />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-fondo focus:px-4 focus:py-2 focus:border focus:border-tinta"
        >
          Saltar al contenido
        </a>
        <Cabecera />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Pie />
        <BarraMovil />
        <Consentimiento />
        <EventosGlobales />
      </body>
    </html>
  )
}
```

### `app/page.tsx`

```tsx
import type { Metadata } from 'next'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Boton from '@/components/ui/Boton'
import DatoPendiente from '@/components/datos/DatoPendiente'
import FormularioPresupuesto from '@/components/secciones/FormularioPresupuesto'
import { nap } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Descripción de la home pendiente.',
  alternates: { canonical: '/' },
}

export default function Home() {
  return (
    <>
      <section className="px-[18px] md:px-lat-desktop py-14 md:py-24 flex flex-col gap-6">
        <AntetituloSeccion>{nap.nombre}</AntetituloSeccion>
        <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0 max-w-[16ch]">
          Titular principal <DatoPendiente>pendiente</DatoPendiente>
        </h1>
        <p className="text-16 md:text-20 text-tinta-media m-0 max-w-[52ch]">
          Subtítulo de la home. Sustituir por el copy real del documento maestro.
        </p>
        <div className="flex flex-wrap gap-3">
          <Boton variante="primario" href="/presupuesto/">
            Pedir presupuesto
          </Boton>
          <Boton variante="contorno" href="/proyectos/">
            Ver proyectos
          </Boton>
        </div>
      </section>

      <section className="bg-fondo-alt px-[18px] md:px-lat-desktop py-14 md:py-24">
        <div className="max-w-contenido mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="flex flex-col gap-4">
            <AntetituloSeccion>Presupuesto</AntetituloSeccion>
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">Cuéntanos qué necesitas</h2>
          </div>
          <FormularioPresupuesto variante="corto" />
        </div>
      </section>
    </>
  )
}
```

### `app/not-found.tsx`

```tsx
import Link from 'next/link'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'

const salidas = [
  { href: '/', titulo: 'Inicio', texto: 'Vuelve a la portada.' },
  { href: '/proyectos/', titulo: 'Proyectos', texto: 'Obra ejecutada.' },
  { href: '/presupuesto/', titulo: 'Pedir presupuesto', texto: 'Cuéntanos qué necesitas.' },
]

export default function NotFound() {
  return (
    <section className="px-[18px] md:px-lat-desktop py-14 md:py-24 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <AntetituloSeccion>Error 404</AntetituloSeccion>
        <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
          Esta página no existe
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {salidas.map((s) => (
          <Link key={s.href} href={s.href} className="flex flex-col gap-2 bg-fondo-alt p-5 no-underline">
            <h2 className="font-display font-bold fs-h3 text-20 md:text-26 text-tinta m-0">{s.titulo}</h2>
            <p className="text-14 md:text-16 text-tinta-media m-0">{s.texto}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

### `app/robots.ts`

```ts
import type { MetadataRoute } from 'next'
import { sitio } from '@/lib/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${sitio.url}/sitemap.xml`,
  }
}
```

### `app/sitemap.ts`

```ts
import type { MetadataRoute } from 'next'
import { sitio } from '@/lib/config'
import { proyectos } from '@/lib/datos'

/** Generado, nunca manual. Añadir aquí cada ruta estática nueva. */
const rutasEstaticas = [
  '/',
  '/proyectos/',
  '/presupuesto/',
  '/aviso-legal/',
  '/politica-de-privacidad/',
  '/politica-de-cookies/',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...rutasEstaticas.map((ruta) => ({ url: `${sitio.url}${ruta}` })),
    ...proyectos.map((p) => ({ url: `${sitio.url}/proyectos/${p.slug}/` })),
  ]
}
```

### `app/presupuesto/page.tsx`

```tsx
import type { Metadata } from 'next'
import Boton from '@/components/ui/Boton'
import Migas from '@/components/layout/Migas'
import FormularioPresupuesto from '@/components/secciones/FormularioPresupuesto'
import { nap } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Pide presupuesto sin compromiso',
  description: 'Cuéntanos qué necesitas y te llamamos.',
  alternates: { canonical: '/presupuesto/' },
}

export default function Presupuesto() {
  return (
    <>
      <Migas items={[{ nombre: 'Presupuesto' }]} />
      <section className="px-[18px] md:px-lat-desktop py-9 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="flex flex-col gap-6 md:sticky md:top-[100px] md:self-start">
            <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
              Pide presupuesto
            </h1>
            <p className="text-16 md:text-20 text-tinta-media m-0">Cuéntanos qué necesitas y te llamamos.</p>
            <div className="flex flex-col gap-3">
              <Boton variante="tinta" href={nap.telefonoHref ?? '#'}>
                Llamar al {nap.telefono ?? nap.telefonoMostrado}
              </Boton>
              <Boton variante="contorno" href={nap.whatsappHref ?? '#'}>
                WhatsApp
              </Boton>
            </div>
          </div>
          <FormularioPresupuesto variante="completo" />
        </div>
      </section>
    </>
  )
}
```

### `app/presupuesto/actions.ts`

```ts
'use server'

import { z } from 'zod'
import { cookies, headers } from 'next/headers'
import { enviarEventoCAPI } from '@/lib/meta-capi'
import { nap, sitio } from '@/lib/config'

export type EstadoEnvio = {
  estado: 'inicial' | 'error' | 'enviando' | 'enviado'
  errores: Record<string, string>
  resumen?: { espacio: string; municipio: string }
}

const esquema = z.object({
  nombre: z.string().min(1, 'Escribe tu nombre.'),
  telefono: z
    .string()
    .transform((v) => v.replace(/[\s+]/g, '').replace(/^34/, ''))
    .refine((v) => /^\d{9}$/.test(v), 'Escribe un número de 9 cifras para que podamos llamarte.'),
  email: z.string().email().optional().or(z.literal('')),
  espacio: z.string().min(1, 'Selecciona una opción.'),
  municipio: z.string().optional().default(''),
  mensaje: z.string().optional().default(''),
  privacidad: z.string().optional(),
  evento_id: z.string().optional().default(''),
})

// Límite de envíos por IP: 3 / hora. En memoria — se reinicia con cada despliegue.
const envios = new Map<string, number[]>()
const LIMITE = 3
const VENTANA_MS = 60 * 60 * 1000

function limitePorIp(ip: string) {
  const ahora = Date.now()
  const previos = (envios.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS)
  if (previos.length >= LIMITE) return false
  previos.push(ahora)
  envios.set(ip, previos)
  return true
}

export async function enviarPresupuesto(_prev: EstadoEnvio, formData: FormData): Promise<EstadoEnvio> {
  // 1. Honeypot: campo oculto con nombre plausible. Si viene relleno, éxito falso sin enviar.
  const honeypot = formData.get('empresa_web')
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return { estado: 'enviado', errores: {} }
  }

  // 2. Validación
  const analizado = esquema.safeParse(Object.fromEntries(formData.entries()))
  if (!analizado.success) {
    const errores: Record<string, string> = {}
    for (const issue of analizado.error.issues) {
      errores[String(issue.path[0])] = issue.message
    }
    return { estado: 'error', errores }
  }

  // 3. Límite por IP
  const listaCabeceras = await headers()
  const ip = listaCabeceras.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonimo'
  if (!limitePorIp(ip)) {
    return { estado: 'error', errores: { form: 'Demasiados envíos seguidos. Llámanos o escríbenos por WhatsApp.' } }
  }

  const { nombre, telefono, email, espacio, municipio, mensaje, evento_id: eventoId } = analizado.data

  // 4. Email con Resend (si hay clave)
  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `${nap.nombre} <presupuesto@${new URL(sitio.url).hostname}>`,
          to: nap.email,
          reply_to: email || undefined,
          subject: `Presupuesto — ${nombre} · ${espacio}`,
          text: [
            `Nombre: ${nombre}`,
            `Teléfono: ${telefono}`,
            `Email: ${email || '—'}`,
            `Espacio: ${espacio}`,
            `Municipio: ${municipio || '—'}`,
            `Mensaje: ${mensaje || '—'}`,
          ].join('\n'),
        }),
      })
    } catch {
      return {
        estado: 'error',
        errores: { form: 'No hemos podido enviarlo. Llámanos o escríbenos por WhatsApp.' },
      }
    }
  }

  // 5. Aviso por Telegram (si hay credenciales)
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChat = process.env.TELEGRAM_CHAT_ID
  if (telegramToken && telegramChat) {
    try {
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChat,
          text: ['🔔 Nuevo presupuesto', `${nombre} · ${telefono}`, espacio, municipio || '—'].join('\n'),
        }),
        signal: AbortSignal.timeout(8000),
      })
    } catch {
      // No bloquea el envío por un fallo de Telegram.
    }
  }

  // 6. Meta CAPI, deduplicado con el Pixel por evento_id
  const listaCookies = await cookies()
  await enviarEventoCAPI({
    eventoId,
    telefono,
    email: email || undefined,
    ip,
    userAgent: listaCabeceras.get('user-agent') ?? '',
    url: `${sitio.url}/presupuesto/`,
    fbp: listaCookies.get('_fbp')?.value,
    fbc: listaCookies.get('_fbc')?.value,
  })

  return { estado: 'enviado', errores: {}, resumen: { espacio, municipio: municipio || '—' } }
}
```

### `app/proyectos/page.tsx`

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Migas from '@/components/layout/Migas'
import { proyectos } from '@/lib/datos'
import { NOMBRE_SERVICIO } from '@/lib/tipos'

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Obra ejecutada.',
  alternates: { canonical: '/proyectos/' },
}

export default function Proyectos() {
  return (
    <>
      <Migas items={[{ nombre: 'Proyectos' }]} />
      <section className="px-[18px] md:px-lat-desktop py-9 md:py-14 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <AntetituloSeccion>Proyectos</AntetituloSeccion>
          <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
            Obra ejecutada
          </h1>
        </div>

        {proyectos.length === 0 ? (
          <p className="text-16 text-tinta-media m-0">
            Sin proyectos todavía. Añádelos en <code>content/proyectos.json</code>.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proyectos.map((p) => (
              <Link key={p.slug} href={`/proyectos/${p.slug}/`} className="flex flex-col gap-2 bg-fondo-alt p-5 no-underline">
                <h2 className="font-display font-bold fs-h3 text-20 text-tinta m-0">{p.titulo}</h2>
                <span className="font-mono text-d-11 text-acero">{NOMBRE_SERVICIO[p.servicio]}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
```

### `app/proyectos/[slug]/page.tsx`

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Migas from '@/components/layout/Migas'
import DatoPendiente from '@/components/datos/DatoPendiente'
import { proyectoPorSlug, proyectos } from '@/lib/datos'
import { NOMBRE_SERVICIO } from '@/lib/tipos'

/** Patrón de ruta generada desde content/. Todo SSG. */
export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const proyecto = proyectoPorSlug(slug)
  if (!proyecto) return {}
  return {
    title: proyecto.titulo,
    description: `${proyecto.titulo}. ${NOMBRE_SERVICIO[proyecto.servicio]}.`,
    alternates: { canonical: `/proyectos/${proyecto.slug}/` },
  }
}

export default async function FichaProyecto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const proyecto = proyectoPorSlug(slug)
  if (!proyecto) notFound()

  return (
    <>
      <Migas items={[{ nombre: 'Proyectos', href: '/proyectos/' }, { nombre: proyecto.titulo }]} />
      <section className="px-[18px] md:px-lat-desktop py-9 md:py-14 flex flex-col gap-6">
        <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
          {proyecto.titulo}
        </h1>
        <p className="font-mono text-d-12 text-acero m-0">
          {NOMBRE_SERVICIO[proyecto.servicio]}
          {' · '}
          {proyecto.municipio ?? <DatoPendiente>municipio</DatoPendiente>}
          {' · '}
          {proyecto.anio ?? <DatoPendiente>año</DatoPendiente>}
        </p>
      </section>
    </>
  )
}
```

### `app/aviso-legal/page.tsx`

```tsx
import type { Metadata } from 'next'
import PlantillaLegal from '@/components/secciones/PlantillaLegal'

export const metadata: Metadata = {
  title: 'Aviso legal',
  alternates: { canonical: '/aviso-legal/' },
}

export default function AvisoLegal() {
  return (
    <PlantillaLegal
      titulo="Aviso legal"
      ultimaActualizacion="pendiente"
      secciones={[
        'Datos identificativos',
        'Objeto',
        'Condiciones de uso',
        'Propiedad intelectual',
        'Legislación aplicable y jurisdicción',
      ]}
    />
  )
}
```

### `app/politica-de-privacidad/page.tsx`

```tsx
import type { Metadata } from 'next'
import PlantillaLegal from '@/components/secciones/PlantillaLegal'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  alternates: { canonical: '/politica-de-privacidad/' },
}

export default function PoliticaPrivacidad() {
  return (
    <PlantillaLegal
      titulo="Política de privacidad"
      ultimaActualizacion="pendiente"
      secciones={[
        'Responsable del tratamiento',
        'Datos que recogemos',
        'Finalidad y base legal',
        'Conservación',
        'Derechos de la persona usuaria',
      ]}
    />
  )
}
```

### `app/politica-de-cookies/page.tsx`

```tsx
import type { Metadata } from 'next'
import PlantillaLegal from '@/components/secciones/PlantillaLegal'

export const metadata: Metadata = {
  title: 'Política de cookies',
  alternates: { canonical: '/politica-de-cookies/' },
}

export default function PoliticaCookies() {
  return (
    <PlantillaLegal
      titulo="Política de cookies"
      ultimaActualizacion="pendiente"
      secciones={['Qué son las cookies', 'Cookies que usa este sitio', 'Cómo gestionar el consentimiento']}
    />
  )
}
```

### `components/layout/Cabecera.tsx`

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { nap } from '@/lib/config'
import Boton from '../ui/Boton'
import MenuMovil from './MenuMovil'

/** Navegación principal. Un solo sitio para cambiarla: aquí. */
const enlaces = [
  { href: '/proyectos/', texto: 'Proyectos' },
]

export default function Cabecera() {
  const pathname = usePathname()
  const [conScroll, setConScroll] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const onScroll = () => setConScroll(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--cabecera-actual', conScroll ? '60px' : '84px')
  }, [conScroll])

  useEffect(() => {
    setMenuAbierto(false)
  }, [pathname])

  return (
    <header
      className={`sticky top-0 z-30 bg-fondo border-b border-tinta transition-[height] duration-cabecera ease-out flex items-center px-[18px] md:px-lat-desktop ${
        conScroll ? 'h-[60px]' : 'h-[70px] md:h-cabecera'
      }`}
    >
      <div className="flex items-center justify-between w-full max-w-contenido mx-auto">
        <Link href="/" className="no-underline text-tinta">
          <span className="font-display font-extrabold fs-logo text-16 tracking-[0.02em] leading-[1.15] block uppercase">
            {nap.nombre}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {enlaces.map((enlace) => {
            const activo = pathname?.startsWith(enlace.href)
            return (
              <Link
                key={enlace.href}
                href={enlace.href}
                className={`min-h-tactil inline-flex items-center font-sans text-16 no-underline ${
                  activo ? 'font-semibold border-b-2 border-tinta' : 'font-medium'
                }`}
              >
                {enlace.texto}
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          {!conScroll && (
            <a href={nap.telefonoHref ?? '#'} className="font-mono text-d-12 text-tinta-media no-underline">
              {nap.telefono ?? `[${nap.telefonoMostrado}]`}
            </a>
          )}
          <Boton variante="contorno" href="/presupuesto/" className={conScroll ? '!min-h-tactil' : ''}>
            Pedir presupuesto
          </Boton>
        </div>

        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto(true)}
          className="md:hidden inline-flex items-center justify-center min-w-tactil min-h-tactil"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {menuAbierto ? <MenuMovil onCerrar={() => setMenuAbierto(false)} enlaces={enlaces} /> : null}
    </header>
  )
}
```

### `components/layout/MenuMovil.tsx`

```tsx
'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { nap } from '@/lib/config'
import Boton from '../ui/Boton'

export default function MenuMovil({
  onCerrar,
  enlaces,
}: {
  onCerrar: () => void
  enlaces: { href: string; texto: string }[]
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCerrar()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const focables = panelRef.current.querySelectorAll<HTMLElement>('a, button')
      if (focables.length === 0) return
      const primero = focables[0]
      const ultimo = focables[focables.length - 1]
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onCerrar])

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      className="fixed inset-0 z-40 bg-tinta text-fondo p-[18px] flex flex-col overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <span className="font-display font-extrabold fs-logo text-16 tracking-[0.02em] text-fondo uppercase">
          {nap.nombre}
        </span>
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onCerrar}
          className="inline-flex items-center justify-center min-w-tactil min-h-tactil"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-col mt-8">
        {enlaces.map((enlace) => (
          <Link
            key={enlace.href}
            href={enlace.href}
            onClick={onCerrar}
            className="font-display font-bold fs-h3 text-34 min-h-[56px] flex items-center border-t border-acero text-fondo no-underline"
          >
            {enlace.texto}
          </Link>
        ))}
      </nav>

      <div className="mt-8 font-mono text-d-11 text-sobre-tinta leading-[2.2] flex flex-col gap-1">
        <span>{nap.direccionMostrada}</span>
        <span>{nap.telefono ?? nap.telefonoMostrado}</span>
        <span>{nap.email}</span>
        <div className="flex gap-4 mt-2">
          <Link href="/aviso-legal/" onClick={onCerrar} className="text-sobre-tinta no-underline">
            Aviso legal
          </Link>
          <Link href="/politica-de-privacidad/" onClick={onCerrar} className="text-sobre-tinta no-underline">
            Privacidad
          </Link>
          <Link href="/politica-de-cookies/" onClick={onCerrar} className="text-sobre-tinta no-underline">
            Cookies
          </Link>
        </div>
      </div>

      <div className="mt-auto pt-8 flex flex-col gap-[1px]">
        <Boton variante="primario" href={nap.telefonoHref ?? '/presupuesto/'} anchoCompleto>
          Llamar
        </Boton>
        <Boton variante="contorno" sobreOscuro href={nap.whatsappHref ?? '/presupuesto/'} anchoCompleto>
          WhatsApp
        </Boton>
      </div>
    </div>
  )
}
```

### `components/layout/Pie.tsx`

```tsx
import Link from 'next/link'
import { nap } from '@/lib/config'
import { NOMBRE_SERVICIO, RUTA_SERVICIO } from '@/lib/tipos'

const servicios = Object.entries(NOMBRE_SERVICIO) as [keyof typeof NOMBRE_SERVICIO, string][]

export default function Pie() {
  const anio = new Date().getFullYear()

  return (
    <footer className="bg-tinta text-fondo px-[18px] py-10 md:px-lat-desktop md:py-14 md:pb-10">
      <div className="max-w-contenido mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
        <div>
          <span className="font-display font-extrabold fs-logo text-16 tracking-[0.02em] leading-[1.15] block uppercase">
            {nap.nombre}
          </span>
        </div>

        <div className="font-mono text-d-11 leading-[2.2] text-sobre-tinta flex flex-col">
          <span>{nap.direccionMostrada}</span>
          <a href={nap.telefonoHref ?? '#'} className="text-sobre-tinta no-underline">
            {nap.telefono ?? `[${nap.telefonoMostrado}]`}
          </a>
          <a href={`mailto:${nap.email}`} className="text-sobre-tinta no-underline">
            {nap.email}
          </a>
        </div>

        <nav className="hidden md:flex flex-col font-sans text-16 text-sobre-tinta">
          {servicios.map(([id, nombre]) => (
            <Link key={id} href={RUTA_SERVICIO[id]} className="min-h-tactil flex items-center text-sobre-tinta no-underline">
              {nombre}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-row md:flex-col flex-wrap gap-x-6 font-sans text-14 md:text-16 text-sobre-tinta">
          <Link href="/aviso-legal/" className="min-h-tactil flex items-center text-sobre-tinta no-underline">
            Aviso legal
          </Link>
          <Link href="/politica-de-privacidad/" className="min-h-tactil flex items-center text-sobre-tinta no-underline">
            Política de privacidad
          </Link>
          <Link href="/politica-de-cookies/" className="min-h-tactil flex items-center text-sobre-tinta no-underline">
            Política de cookies
          </Link>
        </nav>
      </div>

      <p className="max-w-contenido mx-auto mt-8 font-mono text-d-11 text-acero">
        © {anio} {nap.nombre}
      </p>
    </footer>
  )
}
```

### `components/layout/BarraMovil.tsx`

```tsx
import { nap } from '@/lib/config'

/** Barra fija inferior en móvil. Único elemento con sombra en todo el sitio. */
export default function BarraMovil() {
  return (
    <div className="md:hidden sticky bottom-0 z-20 grid grid-cols-2 gap-[1px] bg-tinta shadow-barra">
      <a
        href={nap.telefonoHref ?? '/presupuesto/'}
        className="min-h-boton flex items-center justify-center bg-pigmento text-tinta font-sans font-semibold text-16 no-underline"
      >
        Llamar
      </a>
      <a
        href={nap.whatsappHref ?? '/presupuesto/'}
        className="min-h-boton flex items-center justify-center bg-tinta text-fondo font-sans font-semibold text-16 no-underline"
      >
        WhatsApp
      </a>
    </div>
  )
}
```

### `components/layout/Migas.tsx`

```tsx
import Link from 'next/link'
import { schemaMigas, JsonLd } from '@/lib/schema'

export type Miga = { nombre: string; href?: string }

/** Migas de pan visibles + BreadcrumbList JSON-LD desde la misma fuente. */
export default function Migas({ items }: { items: Miga[] }) {
  const todas: Miga[] = [{ nombre: 'Inicio', href: '/' }, ...items]

  return (
    <nav aria-label="Migas de pan" className="px-[18px] md:px-lat-desktop py-4">
      <JsonLd data={schemaMigas(todas.map((m) => ({ nombre: m.nombre, ruta: m.href })))} />
      <ol className="flex flex-wrap items-center gap-2 font-mono text-d-10 md:text-d-11 tracking-[0.05em] text-acero list-none p-0 m-0">
        {todas.map((item, i) => {
          const esUltimo = i === todas.length - 1
          return (
            <li key={item.nombre} className="flex items-center gap-2 min-h-tactil">
              {esUltimo || !item.href ? (
                <span className="text-tinta uppercase">{item.nombre}</span>
              ) : (
                <Link href={item.href} className="text-acero uppercase no-underline">
                  {item.nombre}
                </Link>
              )}
              {!esUltimo ? <span aria-hidden="true">/</span> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
```

### `components/layout/Consentimiento.tsx`

```tsx
'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { sitio } from '@/lib/config'
import Boton from '../ui/Boton'

const CLAVE = 'pv-consentimiento'

/**
 * Banner RGPD. Nada de analítica ni publicidad se carga antes de aceptar.
 * Con consentimiento carga gtag (GA4 + Google Ads sobre el mismo script) y Meta Pixel,
 * cada uno solo si su ID está en las variables de entorno.
 */
export default function Consentimiento() {
  const [estado, setEstado] = useState<'pendiente' | 'aceptado' | 'rechazado'>('pendiente')

  useEffect(() => {
    const guardado = window.localStorage.getItem(CLAVE)
    if (guardado === 'aceptado' || guardado === 'rechazado') setEstado(guardado)
  }, [])

  function decidir(valor: 'aceptado' | 'rechazado') {
    window.localStorage.setItem(CLAVE, valor)
    setEstado(valor)
  }

  const gtagId = sitio.gaId ?? sitio.googleAdsId
  const configs = [sitio.gaId, sitio.googleAdsId].filter(Boolean) as string[]

  return (
    <>
      {estado === 'aceptado' && gtagId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${configs.map((id) => `gtag('config', '${id}');`).join('\n')}`}
          </Script>
        </>
      ) : null}

      {estado === 'aceptado' && sitio.metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${sitio.metaPixelId}');
            fbq('track', 'PageView');`}
        </Script>
      ) : null}

      {estado === 'pendiente' ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-tinta text-fondo px-[18px] py-4 md:px-lat-desktop md:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-[56px] md:mb-0">
          <p className="text-14 md:text-16 text-sobre-tinta m-0 max-w-[68ch]">
            Usamos analítica y publicidad para entender cómo se usa esta web y mostrarte anuncios
            relevantes. No se carga nada hasta que aceptas.
          </p>
          <div className="flex gap-3 shrink-0">
            <Boton variante="contorno" sobreOscuro type="button" onClick={() => decidir('rechazado')}>
              Rechazar
            </Boton>
            <Boton variante="primario" type="button" onClick={() => decidir('aceptado')}>
              Aceptar
            </Boton>
          </div>
        </div>
      ) : null}
    </>
  )
}
```

### `components/layout/EventosGlobales.tsx`

```tsx
'use client'

import { useEffect } from 'react'
import { registrarEvento } from '@/lib/eventos'

/**
 * Delegación de clic sobre tel:/wa.me en todo el documento. Así BarraMovil,
 * Cabecera y Pie siguen siendo componentes de servidor y aun así se miden.
 */
export default function EventosGlobales() {
  useEffect(() => {
    function alClic(evento: MouseEvent) {
      const enlace = (evento.target as HTMLElement).closest('a')
      if (!enlace) return
      const href = enlace.getAttribute('href') ?? ''
      if (href.startsWith('tel:')) {
        registrarEvento('clic_llamar', { metaEstandar: 'Contact' })
      } else if (href.includes('wa.me')) {
        registrarEvento('clic_whatsapp', { metaEstandar: 'Contact' })
      }
    }
    document.addEventListener('click', alClic)
    return () => document.removeEventListener('click', alClic)
  }, [])

  return null
}
```

### `components/ui/Boton.tsx`

```tsx
import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variante = 'primario' | 'contorno' | 'tinta'

type Comun = {
  variante?: Variante
  sobreOscuro?: boolean
  anchoCompleto?: boolean
  children: ReactNode
  className?: string
}

const base =
  'inline-flex items-center justify-center min-h-campo md:min-h-boton px-6 md:px-[30px] font-sans font-semibold text-16 no-underline transition-colors'

function clasesVariante(variante: Variante, sobreOscuro?: boolean) {
  if (variante === 'primario') {
    return 'btn-primario bg-pigmento text-tinta border border-pigmento hover:bg-pigmento-hover'
  }
  if (variante === 'tinta') {
    return 'bg-tinta text-fondo border border-tinta hover:bg-acero'
  }
  return sobreOscuro
    ? 'bg-transparent text-fondo border border-sobre-tinta hover:bg-fondo hover:text-tinta'
    : 'bg-transparent text-tinta border border-tinta hover:bg-tinta hover:text-fondo'
}

type ComoBoton = Comun & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type ComoEnlace = Comun & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; disabled?: boolean }

/** Un solo botón para todo el sitio. Con `href` es un enlace; sin él, un <button>. */
export default function Boton(props: ComoBoton | ComoEnlace) {
  const { variante = 'primario', sobreOscuro, anchoCompleto, children, className = '', ...resto } = props
  const clases = `${base} ${clasesVariante(variante, sobreOscuro)} ${anchoCompleto ? 'w-full' : ''} ${
    resto.disabled ? '!bg-fondo-alt !text-tinta-media !border-fondo-alt !cursor-not-allowed' : ''
  } ${className}`

  if ('href' in props && props.href) {
    const { href, ...anchorRest } = resto as ComoEnlace
    return (
      <Link href={href} className={clases} {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    )
  }

  return (
    <button className={clases} {...(resto as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
```

### `components/ui/Campo.tsx`

```tsx
import type { ReactNode } from 'react'

export const claseInput =
  'min-h-campo w-full px-[14px] bg-transparent border border-tinta-media font-sans text-16 text-tinta focus-visible:border-tinta aria-[invalid=true]:border-2 aria-[invalid=true]:border-error'

type Props = {
  etiqueta: string
  htmlFor: string
  obligatorio?: boolean
  ayuda?: string
  error?: string
  children: ReactNode
  className?: string
}

/** Envoltorio de campo de formulario: etiqueta, control, ayuda y error. */
export default function Campo({ etiqueta, htmlFor, obligatorio, ayuda, error, children, className = '' }: Props) {
  return (
    <div className={`flex flex-col gap-[6px] ${className}`}>
      <label htmlFor={htmlFor} className="font-mono text-d-11 tracking-[0.06em] uppercase text-acero">
        {etiqueta}
        {obligatorio ? ' *' : ''}
      </label>
      {children}
      {ayuda ? <p className="font-sans text-14 text-tinta-media">{ayuda}</p> : null}
      {error ? (
        <p className="font-sans text-14 font-semibold text-error" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  )
}
```

### `components/ui/AntetituloSeccion.tsx`

```tsx
export default function AntetituloSeccion({
  numero,
  children,
  sobreOscuro,
  className = '',
}: {
  numero?: string
  children: React.ReactNode
  sobreOscuro?: boolean
  className?: string
}) {
  return (
    <p
      className={`font-mono text-d-11 md:text-d-12 tracking-[0.08em] uppercase ${
        sobreOscuro ? 'text-sobre-tinta' : 'text-acero'
      } ${className}`}
    >
      {numero ? `${numero} · ` : ''}
      {children}
    </p>
  )
}
```

### `components/datos/DatoPendiente.tsx`

```tsx
import type { ReactNode } from 'react'

/**
 * Dato sin confirmar por el cliente. Se pinta entre corchetes con subrayado
 * punteado. Al llegar el dato real, se sustituye la llamada por el valor literal
 * y el tratamiento visual desaparece solo.
 */
export default function DatoPendiente({ children }: { children: ReactNode }) {
  return <span className="pendiente">[{children}]</span>
}
```

### `components/secciones/FormularioPresupuesto.tsx`

```tsx
'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { enviarPresupuesto, type EstadoEnvio } from '@/app/presupuesto/actions'
import Campo, { claseInput } from '../ui/Campo'
import Boton from '../ui/Boton'
import { registrarEvento } from '@/lib/eventos'

const estadoInicial: EstadoEnvio = { estado: 'inicial', errores: {} }

/** Opciones del desplegable principal. Adaptar al negocio. */
const ESPACIOS = ['Opción 1', 'Opción 2', 'Opción 3', 'Otro']

export default function FormularioPresupuesto({ variante = 'completo' }: { variante?: 'completo' | 'corto' }) {
  const [estado, accion, enviando] = useActionState(enviarPresupuesto, estadoInicial)
  const telefonoRef = useRef<HTMLInputElement>(null)
  const [eventoId, setEventoId] = useState('')
  const eventoDisparado = useRef(false)

  // event_id compartido entre Pixel (navegador) y CAPI (servidor) para deduplicar el Lead.
  useEffect(() => {
    setEventoId(crypto.randomUUID())
  }, [])

  useEffect(() => {
    if (estado.estado === 'error' && estado.errores.telefono) telefonoRef.current?.focus()
  }, [estado])

  useEffect(() => {
    if (estado.estado === 'enviado' && !eventoDisparado.current) {
      eventoDisparado.current = true
      registrarEvento('envio_formulario', {
        metaEstandar: 'Lead',
        metaEventId: eventoId,
        conversionAds: true,
        params: { espacio: estado.resumen?.espacio, municipio: estado.resumen?.municipio },
      })
    }
  }, [estado, eventoId])

  if (estado.estado === 'enviado') {
    return (
      <div className="sobre-oscuro bg-tinta text-fondo p-[26px] flex flex-col gap-5">
        <p className="font-mono text-d-11 tracking-[0.08em] uppercase text-sobre-tinta m-0">Recibido</p>
        <p className="font-display font-bold fs-h2 text-26 m-0">Te llamamos lo antes posible.</p>
        <div className="font-mono text-d-11 leading-[1.9] text-sobre-tinta">
          <p className="m-0">{estado.resumen?.espacio}</p>
          <p className="m-0">{estado.resumen?.municipio}</p>
        </div>
      </div>
    )
  }

  return (
    <form action={accion} className="flex flex-col gap-4" aria-busy={enviando}>
      {estado.errores.form ? (
        <p className="font-sans text-14 font-semibold text-error" aria-live="polite">
          {estado.errores.form}
        </p>
      ) : null}

      {/* Honeypot: oculto para personas, visible para bots */}
      <input type="text" name="empresa_web" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="evento_id" value={eventoId} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Campo etiqueta="Nombre y apellidos" htmlFor="nombre" obligatorio>
          <input id="nombre" name="nombre" type="text" required readOnly={enviando} className={claseInput} />
        </Campo>
        <Campo etiqueta="Teléfono" htmlFor="telefono" obligatorio error={estado.errores.telefono}>
          <input
            ref={telefonoRef}
            id="telefono"
            name="telefono"
            type="tel"
            required
            readOnly={enviando}
            aria-invalid={Boolean(estado.errores.telefono)}
            className={claseInput}
          />
        </Campo>
      </div>

      {variante === 'completo' ? (
        <Campo etiqueta="Email" htmlFor="email">
          <input id="email" name="email" type="email" readOnly={enviando} className={claseInput} />
        </Campo>
      ) : null}

      <Campo etiqueta="¿Qué necesitas?" htmlFor="espacio" obligatorio>
        <select id="espacio" name="espacio" required disabled={enviando} className={claseInput}>
          {ESPACIOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </Campo>

      {variante === 'completo' ? (
        <>
          <Campo etiqueta="Municipio" htmlFor="municipio" obligatorio>
            <input id="municipio" name="municipio" type="text" required readOnly={enviando} className={claseInput} />
          </Campo>
          <Campo etiqueta="Cuéntanos algo más" htmlFor="mensaje">
            <textarea id="mensaje" name="mensaje" rows={4} readOnly={enviando} className={claseInput} />
          </Campo>
          <label className="flex items-start gap-3 font-sans text-14 text-tinta-media">
            <input type="checkbox" name="privacidad" required disabled={enviando} className="mt-1" />
            <span>
              He leído y acepto la{' '}
              <Link href="/politica-de-privacidad/" className="text-tinta">
                política de privacidad
              </Link>
              . *
            </span>
          </label>
        </>
      ) : null}

      <Boton type="submit" variante="primario" anchoCompleto disabled={enviando}>
        {enviando ? 'Enviando…' : 'Enviar y que me llamen'}
      </Boton>
    </form>
  )
}
```

### `components/secciones/PlantillaLegal.tsx`

```tsx
import Migas from '../layout/Migas'

/** Las tres páginas legales comparten esta plantilla. El texto llega de asesoría. */
export default function PlantillaLegal({
  titulo,
  ultimaActualizacion,
  secciones,
}: {
  titulo: string
  ultimaActualizacion: string
  secciones: string[]
}) {
  return (
    <>
      <Migas items={[{ nombre: titulo }]} />

      <section className="px-[18px] md:px-lat-desktop pb-8 flex flex-col items-center">
        <div className="w-full max-w-lectura flex flex-col gap-2">
          <h1 className="font-display font-bold fs-h2 text-46 m-0">{titulo}</h1>
          <span className="font-mono text-d-11 text-tinta-media">Última actualización: {ultimaActualizacion}</span>
        </div>
      </section>

      <section className="px-[18px] md:px-lat-desktop py-9 flex flex-col items-center">
        <div className="w-full max-w-lectura flex flex-col gap-8">
          {secciones.map((s, i) => (
            <div key={s} id={`seccion-${i}`} className="flex flex-col gap-3 border-t border-tinta pt-6">
              <h2 className="font-display font-bold fs-h3 text-26 m-0">{s}</h2>
              <div className="border border-dashed border-tinta-media p-4">
                <p className="pendiente text-16 m-0">[Texto legal pendiente de redacción y revisión por asesoría.]</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
```

### `public/.gitkeep`

Archivo vacío. Aquí van favicon, logo y `og-image` cuando existan.

---

## 8. Lo que el esqueleto no decide por ti

- **Paleta y tipografías de Pavivasa.** Arranca con los valores de Albufera para que compile. Cambiar solo los valores.
- **Catálogo.** `ServicioId` lleva `servicio-a` y `servicio-b` de relleno. Sustituir por los servicios reales antes de crear páginas.
- **Copy.** Todo texto del esqueleto es de relleno y está marcado como tal. No inventar contenido.
- **Redirecciones.** Vacías. Si Pavivasa migra de otra web, inventariar sus URLs primero.
- **Reseñas.** Sin `AggregateRating` mientras no haya reseñas verificables.
