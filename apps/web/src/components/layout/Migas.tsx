import Link from 'next/link'
import { schemaMigas, JsonLd } from '@/lib/schema'

export type Miga = { nombre: string; href?: string }

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
