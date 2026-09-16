'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type Filtros<C extends string> = Record<C, string | null>

/**
 * Filtrado en cliente sobre una rejilla que **ya viene renderizada del servidor**.
 *
 * Por qué no `useSearchParams()`: leerlo en render saca a todo el subárbol `<Suspense>`
 * del prerenderizado estático, y la rejilla desaparecía del HTML generado —`/acabados/`
 * y `/proyectos/` llegaban sin una sola tarjeta ni un solo enlace interno—. Aquí la URL
 * se lee **después de montar** y se escribe con `history.replaceState`, nunca con
 * `router.push`: `push` es un viaje al servidor, y el handoff pide «sin salto de red,
 * sin estado de carga» (README §7).
 *
 * Contrapartida asumida a propósito: al abrir `/acabados/?tecnica=impreso&color=117`
 * se ven todas las muestras durante un instante, hasta que hidrata y se aplica el filtro
 * de la URL. Es el precio de servir el HTML estático completo. No se tapa con un estado
 * de carga: lo que se ve ya es contenido bueno, solo sobra una parte.
 *
 * El filtro no monta ni desmonta nada: oculta con el atributo `hidden` los envoltorios
 * `[data-filtrable]` que el servidor ya pintó, y devuelve cuántos quedan visibles para
 * el resumen (`N ACABADOS` / `N OBRAS`) y para el estado vacío.
 */
export function useFiltrosDeRejilla<C extends string>(claves: readonly C[], total: number) {
  const vacios = useMemo(
    () => Object.fromEntries(claves.map((clave) => [clave, null])) as Filtros<C>,
    [claves],
  )

  const [filtros, setFiltros] = useState<Filtros<C>>(vacios)
  const [visibles, setVisibles] = useState(total)
  const rejilla = useRef<HTMLDivElement>(null)

  // La URL solo se mira tras montar: en render rompería el prerenderizado.
  useEffect(() => {
    function sincronizar() {
      const params = new URLSearchParams(window.location.search)
      const leidos = {} as Filtros<C>
      for (const clave of claves) leidos[clave] = params.get(clave)
      setFiltros(leidos)
    }
    sincronizar()
    window.addEventListener('popstate', sincronizar)
    return () => window.removeEventListener('popstate', sincronizar)
  }, [claves])

  // Aplica el filtro sobre los nodos que ya están en el DOM. Los ejes combinan con AND.
  useEffect(() => {
    const nodos = rejilla.current?.querySelectorAll<HTMLElement>('[data-filtrable]')
    if (!nodos) return
    const activos = claves
      .map((clave) => [clave, filtros[clave]] as const)
      .filter((par): par is readonly [C, string] => Boolean(par[1]))

    let cuenta = 0
    nodos.forEach((nodo) => {
      const encaja = activos.every(([clave, valor]) => nodo.dataset[clave] === valor)
      nodo.hidden = !encaja
      if (encaja) cuenta += 1
    })
    setVisibles(cuenta)
  }, [claves, filtros])

  // `replaceState` en vez de `router.push`: cambia la URL para que el estado sea
  // compartible, sin pedirle nada al servidor y sin apilar una entrada por chip.
  const escribir = useCallback((mutar: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(window.location.search)
    mutar(params)
    const cadena = params.toString()
    window.history.replaceState(null, '', cadena ? `?${cadena}` : window.location.pathname)
  }, [])

  const actualizar = useCallback(
    (clave: C, valor: string | null) => {
      setFiltros((previos) => ({ ...previos, [clave]: valor }))
      escribir((params) => {
        if (valor) params.set(clave, valor)
        else params.delete(clave)
      })
    },
    [escribir],
  )

  const quitar = useCallback(() => {
    setFiltros(vacios)
    escribir((params) => {
      for (const clave of claves) params.delete(clave)
    })
  }, [claves, escribir, vacios])

  const numFiltros = claves.filter((clave) => filtros[clave]).length

  return { filtros, actualizar, quitar, rejilla, visibles, numFiltros }
}
