import type { Config } from 'tailwindcss'

/** Pavimentos Albufera — Tailwind con los tokens del §8.
 *  Escala cerrada a propósito: no hay valores intermedios. */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    // El catálogo vive en .tsx, no en .mdx: con el glob viejo no se escaneaba.
    './content/**/*.{ts,tsx,mdx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    // Se reemplaza la paleta por defecto: solo existen estos colores.
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
      /**
       * ⚠️ NO ES UN COLOR DEL SISTEMA. Es el verde de marca de WhatsApp, y el
       * nombre lo dice a propósito para que nadie lo tome mañana por un acento
       * propio. Segunda y última excepción a la paleta de seis, autorizada por
       * el dueño el 2026-09-18, después de la del logotipo.
       *
       * Empieza y acaba en los botones cuyo `href` es un enlace de WhatsApp
       * —`esEnlaceWhatsApp`, en `lib/config.ts`—. Ningún texto, borde, fondo,
       * estado, foco ni separador del sitio puede usarlo para nada más.
       * → `design/01` §2.1
       */
      'verde-whatsapp': '#25D366',
      /** Su `:hover`, cada canal al 87 %. Mismo gesto que `pigmento-hover`. */
      'verde-whatsapp-hover': '#20B859',
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
      screens: {
        // Punto de ruptura de «aquí ya cabe la fila entera y no hay que
        // estrechar nada». Tres usos, y los tres son eso mismo: la cabecera de
        // escritorio —logotipo + nav + teléfono + botón—, la barra fija de
        // contacto de móvil, que es su pareja y se apaga en el mismo punto, y
        // desde el 2026-09-18 el par de CTA de las landings (`CtaContacto` en
        // `PaginaServicio.tsx`), que a 1180 es donde `Llamar al 627 663 146` y
        // `Escribir por WhatsApp` caben enteros uno al lado del otro: 222,7 +
        // 260,6 + 12 de `gap` = **495,3 px sobre los 510** de su columna.
        //
        // La cifra sale del DOM, con el nav ya sin `/precios/`: logotipo 276 +
        // nav 333,3 + teléfono y botón 319,1 = **928,4 px de hijos**, más los
        // 96 px de `px-lat-desktop`. Con la barra de scroll de escritorio
        // (15 px) el suelo a hueco cero son **1039,4 px**, así que 1024 no
        // llega: deja los tres bloques pegados y se come 15,4 px del gutter
        // derecho. A 1180 quedan **70,3 px de hueco a cada lado** y el gutter
        // intacto: es el ancho del iPad en horizontal, que es el caso que
        // pedía el dueño. → `design/01` §4.1
        //
        // ⚠️ No es «el escritorio» del proyecto: el resto de la maqueta usa
        // `md` (768) para pasar a dos columnas y `xl` (1280) donde una pista de
        // rejilla concreta lo exige. Esta clave nombra un criterio, no un
        // dispositivo, y no se usa para nada que no sea ese criterio.
        'cabecera-ancha': '1180px',
      },
      minHeight: { tactil: '44px', campo: '48px', boton: '56px' },
      // El objetivo táctil también necesita ancho: `min-w-tactil` se usaba sin existir.
      minWidth: { tactil: '44px' },
      spacing: {
        // Alto de sección en escritorio (design/01 §2.5, «72–88 px arriba y abajo»).
        // No es un valor intermedio: es el par de `py-9` (36 px) en móvil.
        22: '5.5rem',
        'lat-movil': '18px',
        'lat-desktop': '48px',
        cabecera: '84px',
      },
      maxWidth: { lectura: '68ch', contenido: '1344px' },
      transitionDuration: { cabecera: '150ms' },
    },
  },
  plugins: [],
}

export default config
