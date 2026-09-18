'use client'

import { useEffect, useState } from 'react'

export type AnclaSubmenu = { id: string; texto: string }

/**
 * 01-sistema-de-diseno.md §4.6. Sigue el scroll con IntersectionObserver
 * (decisión 12 de 05-pendientes-y-decisiones.md): en el prototipo solo
 * respondía al clic por una limitación del entorno de previsualización.
 *
 * **Desde `xl`, como el resto de la plantilla de servicio.** Sus anclas no
 * parten —son etiquetas—, así que de 768 a 1270 el carril pintaba una barra de
 * scroll clásica de 15 px dentro de una caja que §4.6 fija en 56 de alto, y casi
 * todas las anclas quedaban fuera de pantalla. A 1280 el ancho de contenido es
 * 1265 y entran enteras. `design/02` §A2 ya decía «Solo escritorio» y «en móvil
 * no hay submenú»; lo que cambia es dónde empieza el escritorio de esta
 * plantilla, igual que en el hero, la ficha técnica y las aplicaciones.
 * `overflow-x-auto` se queda como red: si un día una sección alarga su nombre,
 * el carril reaparece en vez de romper la página.
 *
 * ⚠️ **El máximo son 6 anclas desde el 2026-09-18**, no 7: al retirarse la
 * calculadora se fue con ella la sección `Precio`. Medido a 1366 px en
 * `/hormigon-impreso/`, `/hormigon-pulido/` y `/microcemento/`, el carril mide
 * **1039 px** de anclas —1135 con los 96 px de gutter— contra los 1259 de
 * antes. **El `xl` NO se mueve por eso**: quien fija ese umbral es el hero, que
 * sigue pidiendo 1278 px de contenido. → `design/02` §A2
 */
export default function SubmenuServicio({ anclas }: { anclas: AnclaSubmenu[] }) {
  const [activa, setActiva] = useState(anclas[0]?.id)

  useEffect(() => {
    const secciones = anclas
      .map((a) => document.getElementById(a.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (secciones.length === 0) return

    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas.find((e) => e.isIntersecting)
        if (visible) setActiva(visible.target.id)
      },
      { rootMargin: '-150px 0px -55% 0px' },
    )

    secciones.forEach((s) => observador.observe(s))
    return () => observador.disconnect()
  }, [anclas])

  return (
    <div className="hidden xl:flex sticky [top:var(--cabecera-actual)] z-10 bg-tinta h-[56px] px-lat-desktop items-center gap-1 overflow-x-auto">
      {anclas.map((ancla) => (
        <a
          key={ancla.id}
          href={`#${ancla.id}`}
          className={`min-h-tactil inline-flex items-center px-4 font-mono text-d-11 no-underline whitespace-nowrap ${
            activa === ancla.id ? 'bg-pigmento text-tinta' : 'text-sobre-tinta'
          }`}
        >
          {ancla.texto}
        </a>
      ))}
    </div>
  )
}
