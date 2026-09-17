/**
 * Escala de azules de la marca.
 *
 * Excepción consciente a la regla «no añadir colores» de CLAUDE.md: son los colores
 * del logotipo de la empresa, no de la interfaz. Viven aquí, se documentan en
 * `design/01-sistema-de-diseno.md §2.7` y **solo los usa el logotipo**. Ningún botón,
 * enlace, borde ni fondo de la web usa azul: la paleta de interfaz sigue siendo la de
 * siempre, con el ocre como único color de acción.
 *
 * Cerrada a propósito, igual que la escala tipográfica: ocho pasos del frente al
 * fondo del camino, y nada intermedio. Cada baldosa toma **un solo paso**; el
 * degradado ocurre entre baldosas, nunca dentro de una.
 *
 * Fuente única: `tailwind.config.ts` la importa para exponerla como `text-marca-*`,
 * y `components/layout/MarcaSvg.tsx` la usa para rellenar las baldosas.
 */
export const AZULES_MARCA = [
  '#0C2450',
  '#123B6F',
  '#15508C',
  '#1866A8',
  '#1C7CC6',
  '#2C92DD',
  '#5CAAE8',
  '#8FC6F0',
] as const

/** El azul del nombre sobre fondo claro y sobre fondo oscuro. */
export const AZUL_NOMBRE = AZULES_MARCA[3]
export const AZUL_NOMBRE_OSCURO = AZULES_MARCA[6]
