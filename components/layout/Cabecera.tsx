'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { nap } from '@/lib/config'
import Boton from '../ui/Boton'
import MenuMovil from './MenuMovil'

/**
 * Cuatro enlaces desde el 2026-09-17: `/precios/` se retira del sitio entero
 * por decisión del dueño («no quiero precios en la web»), así que sale también
 * de aquí. Esta lista es la única del proyecto: `MenuMovil` la recibe como
 * prop, no la duplica.
 */
const enlaces = [
  { href: '/acabados/', texto: 'Acabados' },
  { href: '/proyectos/', texto: 'Proyectos' },
  { href: '/empresa/', texto: 'Empresa' },
  { href: '/blog/', texto: 'Blog' },
]

/**
 * 01-sistema-de-diseno.md §4.1 y 02-pantallas.md §B9.
 *
 * **La altura es fija y no se anima.** El estado compacto se pintaba antes
 * animando `height` sobre un elemento sticky que está en el flujo: la única
 * animación no compuesta del sitio, con dos costes medidos. Uno, CLS en cada
 * scroll, porque los 84 → 60 px empujan todo lo que hay debajo. Y dos, un salto
 * en hidratación al aterrizar con `#ancla` —el caso de un anuncio—: el HTML
 * llega expandido, el efecto ve el scroll ya hecho y la sección anclada se
 * mueve bajo el cursor del visitante.
 *
 * Ahora la caja mide siempre lo mismo y el único cambio de estado que queda
 * viaja por `visibility`: el teléfono se oculta conservando su hueco
 * —`display:none` movería el botón— y sale del orden de tabulación. El
 * logotipo ya no cruza dos variantes por `opacity`: desde que es una imagen de
 * caja fija (`design/02` §B9, enmendado) no hay nada que comprimir, así que se
 * queda igual con scroll y sin él. Los 150 ms y el `ease-out` de §B9 se
 * conservan; `prefers-reduced-motion` ya los anula en `app/globals.css`, sin
 * nada que añadir aquí.
 *
 * Consecuencia: `--cabecera-actual` es constante y se queda en el valor de
 * `app/globals.css`. Ya no hay efecto que lo reescriba, y por eso los cinco
 * `sticky` que se cuelgan de él dejan de saltar al hidratar.
 *
 * **La cabecera de escritorio empieza en `cabecera-ancha` (1180 px), no en `md`
 * ni en `xl`.** El punto de ruptura es propio —`tailwind.config.ts`,
 * `extend.screens`— porque ninguno de los de serie cae donde esta fila cabe.
 * Medido sobre el DOM, ya sin el enlace de `/precios/`: los tres bloques suman
 * **928,4 px** de ancho natural —logotipo 276 + nav 333,3 + teléfono 99 y
 * botón 200,1 con su hueco de 20—, y los `px-lat-desktop` ponen 96 más. Con la
 * barra de scroll de escritorio (15 px) el suelo a hueco cero son **1039,4 px
 * de ventana**.
 *
 * Por qué 1180 y no 1024, medido a los dos anchos encendiendo la fila a la
 * fuerza:
 *
 * - **1024 no cabe.** Deja 913 px de contenido para 928,4 de hijos: los tres
 *   bloques quedan pegados —0 px entre logotipo y nav, 0 px entre nav y
 *   teléfono— y el botón se come 15,4 px del gutter derecho. El logotipo y el
 *   teléfono aguantan (276 px y una línea) porque llevan `shrink-0` y
 *   `whitespace-nowrap`, así que no se ve roto: se ve apretado, que es peor de
 *   detectar. No hay scroll horizontal porque el desbordamiento se lo traga el
 *   padding.
 * - **1180 cabe con holgura:** 1069 px de contenido, **70,3 px de hueco a cada
 *   lado**, logotipo a sus 276 px, teléfono en una línea, botón en una línea y
 *   los 48 px de gutter intactos. Es el ancho del iPad en horizontal.
 *
 * Por debajo de 1180 vale la cabecera de móvil —logotipo + hamburguesa— con su
 * `MenuMovil` y su `BarraMovil`, que es un estado completo y ya diseñado
 * (`design/01` §4.3, `design/02` §B9), no un hueco sin navegación. Por eso
 * `BarraMovil` esconde en `cabecera-ancha`, el mismo punto: si se moviera solo
 * el nav, la banda de en medio se quedaría sin nav Y sin barra de CTA.
 * → `design/01` §4.1, enmendado.
 *
 * ⚠️ `cabecera-ancha` nombra esta fila y nada más. Los `xl:` que quedan en
 * `SubmenuServicio`, `FiltrosProyectos`, `PaginaServicio`, `Calculadora` y
 * `TablaFichaTecnica` responden a pistas de rejilla propias —el submenú, por
 * ejemplo, pide 1259 px de contenido según `design/02`— y no siguen a la
 * cabecera.
 *
 * ⚠️ La ALTURA no se mueve de `md`: `design/02` §B9 la fija en «70 px en móvil
 * y 84 px desde 768 px» y de ella cuelgan por `--cabecera-actual` los cinco
 * `sticky`. Altura y punto de ruptura del nav son dos cosas distintas.
 */
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
    setMenuAbierto(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-30 bg-fondo border-b border-tinta h-[70px] md:h-cabecera flex items-center px-[18px] md:px-lat-desktop">
      <div className="flex items-center justify-between w-full max-w-contenido mx-auto">
        {/* El logotipo es una sola imagen y no cambia con el scroll. Las dos
            variantes tipográficas —dos líneas y una línea— existían para que el
            ancho no se moviera al comprimirse la cabecera; con una imagen de
            caja fija ese problema no llega a plantearse. Va el wordmark solo:
            el bloque completo mete la senda de losas encima y el claim debajo,
            y en una barra de 70-84 px eso deja las palabras a 6-8 px de altura
            de mayúscula. El bloque completo vive en el pie, que sí tiene sitio.
            `design/01` §4.1 y `design/02` §B9. */}
        {/* `min-h-tactil` y no la altura de la imagen: el enlace medía 24 px de
            alto, que es lo que mide el wordmark, y es el enlace a la home desde
            las 53 rutas. La imagen no cambia de tamaño; lo que crece es el área
            de toque, centrada en una barra que ya mide 70-84 px. */}
        <Link href="/" className="no-underline text-tinta flex items-center min-h-tactil">
          {/* `<img>` y no `next/image`, medido: la cabecera y el pie viven en el
              layout, así que meter el componente de imagen aquí lo mete en las
              49 rutas. Cuesta **+5,1 kB brotli** en las que hoy no lo cargan
              —las tres legales pasan de 97,7 a 102,8— y sube el máximo del sitio
              de 108,2 a 109,3 kB, o sea la mitad del margen que queda hasta el
              techo de 112. A cambio no da nada: el logotipo es de caja fija, no
              tiene `srcset` que resolver, y el archivo ya está servido al ancho
              que se pinta. El original de 1881 px vive en `logo.png`, que es el
              del JSON-LD; este pesa 8,9 kB. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/marca/logo-texto.png"
            alt="Pavimentos Albufera"
            width={276}
            height={24}
            /* Sobre el pliegue en las 49 rutas, así que no es perezosa. */
            loading="eager"
            decoding="async"
            /* `shrink-0` no es decorativo: es una imagen de caja fija con `width`
               y `height` declarados, y como ítem de flex se encogía hasta 36 px
               a 768. Con las dos medidas puestas, encoger no recorta: deforma. */
            className="h-[20px] w-[230px] shrink-0 md:h-[24px] md:w-[276px]"
          />
        </Link>

        <nav className="hidden cabecera-ancha:flex items-center gap-7">
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

        <div className="hidden cabecera-ancha:flex items-center gap-5">
          {/* `visibility` y no `display`: el hueco se conserva y el botón no se
              mueve. La transición declara las dos propiedades para que el número
              se desvanezca en vez de irse de golpe, y durante esos 150 ms sigue
              siendo visible: de ahí el `aria-hidden` y el `tabIndex`, que lo
              retiran del lector y del tabulador desde el primer fotograma. */}
          <a
            href={nap.telefonoHref ?? '#'}
            data-ubicacion="header"
            aria-hidden={conScroll}
            tabIndex={conScroll ? -1 : undefined}
            /* Un teléfono es un dato, no un párrafo: no parte nunca. Sin esto
               se rompía en tres líneas en cuanto la fila iba justa. */
            /* `min-h-tactil` por lo mismo que el logotipo: es un `tel:`, o sea
               el enlace que más se toca del sitio, y medía 20 px de alto. Como
               ítem de flex la altura mínima sí le aplica, y el `items-center`
               del contenedor lo deja donde estaba. */
            className={`font-mono text-d-12 text-tinta-media whitespace-nowrap no-underline min-h-tactil inline-flex items-center transition-[opacity,visibility] duration-cabecera ease-out ${
              conScroll ? 'invisible opacity-0' : 'opacity-100'
            }`}
          >
            {nap.telefono ?? `[${nap.telefonoMostrado}]`}
          </a>
          {/* El botón ya no encoge: los 44 px de §B9 existían para caber en una
              barra de 60 px, y la barra ya no se comprime. `min-h-boton` (56 px)
              está por encima del objetivo táctil, y así desaparece el último
              cambio de caja que el scroll provocaba en la cabecera. */}
          {/* `whitespace-nowrap` aquí y no en el `cva` de `Boton`: en la base lo
              heredarían los `anchoCompleto` del menú y del formulario, que a
              390 px sí necesitan partir. El `className` es el escape ya
              sancionado del componente (`!min-h-tactil`, `flex-1`, `border-b-0`). */}
          <Boton variante="contorno" href="/presupuesto/" className="whitespace-nowrap">
            Pedir presupuesto
          </Boton>
        </div>

        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto(true)}
          className="cabecera-ancha:hidden inline-flex items-center justify-center min-w-tactil min-h-tactil"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="#1B1E1C" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {menuAbierto ? <MenuMovil onCerrar={() => setMenuAbierto(false)} enlaces={enlaces} /> : null}
    </header>
  )
}
