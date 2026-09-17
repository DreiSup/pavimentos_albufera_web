import type { Config } from 'tailwindcss'
import { AZULES_MARCA } from './lib/marca'

/** Pavimentos Albufera — Tailwind con los tokens del §8.
 *  Escala cerrada a propósito: no hay valores intermedios. */
const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}', './content/**/*.mdx'],
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
      // Azules del logotipo, y solo del logotipo (lib/marca.ts, §2.6).
      // La interfaz no los usa: el único color de acción sigue siendo el ocre.
      marca: {
        900: AZULES_MARCA[0],
        800: AZULES_MARCA[1],
        700: AZULES_MARCA[2],
        600: AZULES_MARCA[3],
        500: AZULES_MARCA[4],
        400: AZULES_MARCA[5],
        300: AZULES_MARCA[6],
        200: AZULES_MARCA[7],
      },
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
