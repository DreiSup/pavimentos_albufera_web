import MarcaSvg from './MarcaSvg'

/**
 * El logotipo, en un único sitio.
 *
 * Antes el nombre estaba copiado a mano en cabecera, menú móvil y pie, con tres juegos
 * de clases distintos. `04-desarrollo-y-deploy.md §2` pide lo contrario: un componente
 * por concepto de diseño, y las variantes por prop.
 *
 * Bloque horizontal —marca a la izquierda, nombre a la derecha— y no vertical como el
 * original: una cabecera de 72-84 px no admite un bloque apilado sin dejar la marca por
 * debajo del umbral en que se resuelve. Sin la línea de servicios del original, que
 * nombra tres de los seis que hoy tiene la web.
 *
 * El nombre va en texto vivo, no en trazado: se lee con un lector de pantalla, se
 * selecciona, no pixela y no pesa. La marca sí es SVG en línea, sin petición extra.
 *
 * Variantes:
 *   apilado   marca + nombre en dos líneas — cabecera en reposo y pie
 *   compacto  marca reducida + nombre en monoespaciada — cabecera tras hacer scroll (§B9)
 *   linea     marca + nombre en una línea — cabecera del menú móvil
 *
 * `sobreOscuro` sube la rampa de azules y cambia la tinta del nombre: sobre `--tinta`
 * los azules del frente son casi negros y la marca se perdería contra el fondo.
 */
export type VarianteLogo = 'apilado' | 'compacto' | 'linea'

export default function Logo({
  variante = 'apilado',
  sobreOscuro = false,
  className = '',
}: {
  variante?: VarianteLogo
  sobreOscuro?: boolean
  className?: string
}) {
  const nombre = sobreOscuro ? 'text-sobre-tinta' : 'text-tinta'
  const apellido = sobreOscuro ? 'text-marca-300' : 'text-marca-600'

  if (variante === 'compacto') {
    return (
      <span className={`flex items-center gap-[10px] ${className}`}>
        <MarcaSvg variante="mini" sobreOscuro={sobreOscuro} className="h-[22px] w-auto shrink-0" />
        <span className={`font-mono text-d-12 uppercase tracking-[0.05em] ${nombre}`}>
          Pavimentos <span className={apellido}>Albufera</span>
        </span>
      </span>
    )
  }

  if (variante === 'linea') {
    return (
      <span className={`flex items-center gap-3 ${className}`}>
        <MarcaSvg sobreOscuro={sobreOscuro} className="h-[30px] w-auto shrink-0" />
        <span className={`font-display font-extrabold fs-logo text-16 tracking-[0.02em] ${nombre}`}>
          PAVIMENTOS <span className={apellido}>ALBUFERA</span>
        </span>
      </span>
    )
  }

  return (
    <span className={`flex items-center gap-3 md:gap-[14px] ${className}`}>
      <MarcaSvg
        sobreOscuro={sobreOscuro}
        className="h-[34px] md:h-[42px] w-auto shrink-0"
      />
      <span
        className={`font-display font-extrabold fs-logo text-16 tracking-[0.02em] leading-[1.15] block ${nombre}`}
      >
        PAVIMENTOS
        <br />
        <span className={apellido}>ALBUFERA</span>
      </span>
    </span>
  )
}
