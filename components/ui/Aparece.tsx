'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/** Aparición suave de secciones al entrar en pantalla, una sola vez (§8.6). */
export default function Aparece({
  children,
  className = '',
  as: Componente = 'div',
  id,
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'section'
  id?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const nodo = ref.current
    if (!nodo) return
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true)
          observador.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observador.observe(nodo)
    return () => observador.disconnect()
  }, [])

  const Tag = Componente as 'div'

  return (
    <Tag ref={ref} id={id} className={`aparece ${visible ? 'aparece--visible' : ''} ${className}`}>
      {children}
    </Tag>
  )
}
