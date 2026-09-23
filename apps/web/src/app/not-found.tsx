import Link from 'next/link'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'

const salidas = [
  { href: '/hormigon-impreso/', titulo: 'Servicios', texto: 'Hormigón impreso, pulido, lavado y microcemento.' },
  { href: '/proyectos/', titulo: 'Proyectos', texto: 'Obra real ejecutada, con ficha técnica de cada trabajo.' },
  { href: '/presupuesto/', titulo: 'Pedir presupuesto', texto: 'Cuéntanos qué quieres pavimentar y te llamamos.' },
]

export default function NotFound() {
  return (
    <section className="px-[18px] md:px-lat-desktop py-14 md:py-22 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <AntetituloSeccion>Error 404</AntetituloSeccion>
        <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
          Esta página ya no está aquí
        </h1>
        <p className="text-16 md:text-20 text-tinta-media max-w-[52ch] m-0">
          Hemos rehecho la web y algunas direcciones antiguas han cambiado. Prueba con una de estas.
        </p>
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
