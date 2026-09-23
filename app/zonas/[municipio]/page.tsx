import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Aparece from '@/components/ui/Aparece'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Boton from '@/components/ui/Boton'
import Foto from '@/components/contenido/Foto'
import EtiquetaTecnica from '@/components/datos/EtiquetaTecnica'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
import MuestraAcabado from '@/components/contenido/MuestraAcabado'
import Migas from '@/components/layout/Migas'
import Acordeon from '@/components/secciones/Acordeon'
import { JsonLd, schemaFAQ } from '@/lib/schema'
import { acabadosPorProyectos, proyectosDe, zonaPorSlug, zonas } from '@/lib/datos'
import { faqZona } from '@/content/faq'
import { NOMBRE_SERVICIO, RUTA_SERVICIO } from '@/lib/tipos'

/**
 * Sin esto, un municipio inventado no da un 404 estático: invoca una función
 * en Vercel para acabar devolviendo lo mismo. `generateStaticParams` ya cubre
 * todas las zonas de `zonas`, que es la misma fuente que usa `zonaPorSlug`.
 * → `app/lp/[slug]/page.tsx`, que fue el primero en declararlo.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return zonas.map((z) => ({ municipio: z.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ municipio: string }>
}): Promise<Metadata> {
  const { municipio } = await params
  const zona = zonaPorSlug(municipio)
  if (!zona) return {}
  // Una zona sin ninguna foto de obra es lo que Google llama «doorway abuse»: la página
  // se sirve igual —es destino de 301— pero no se pide que se indexe. Los enlaces sí se
  // siguen. Se mira el conjunto de proyectos, no solo el primero: el hueco del hero no
  // basta para retirar del índice una zona que sí tiene obra fotografiada más abajo.
  const sinFoto = !proyectosDe(zona.proyectos).some((p) => p.imagenes.length > 0)
  return {
    title: `Pavimentos de hormigón en ${zona.municipio}`,
    description: `Obra real de hormigón ejecutada en ${zona.municipio}, ${zona.provincia}. Servicios, acabados y proyectos documentados.`,
    alternates: { canonical: `/zonas/${zona.slug}/` },
    ...(sinFoto ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function PaginaZona({ params }: { params: Promise<{ municipio: string }> }) {
  const { municipio } = await params
  const zona = zonaPorSlug(municipio)
  if (!zona) notFound()

  const proyectos = proyectosDe(zona.proyectos)
  // Publicados, no catálogo: `denia` ejecuta `piedra-inglesa` en gris y en
  // crema, y la de crema no tiene muestra. Filtrando aquí por su cuenta, esta
  // pantalla pintaba su bloque de posición al lado de la foto de la de gris.
  const acabadosZona = acabadosPorProyectos(zona.proyectos)
  const primerProyecto = proyectos[0]

  // El hero de la zona es la primera foto del primer proyecto, y esa MISMA foto
  // vuelve a salir más abajo en su tarjeta de obra y —cuando el acabado la usa
  // de muestra— en el muestrario. Con tres `sizes` distintos son tres
  // peticiones a `/_next/image?` del mismo JPEG en la misma pantalla. Los dos
  // huecos de abajo adoptan el `sizes` del hero, que ya se descarga con
  // `prioridad`: salen de su caché en vez de abrir una descarga propia. Nunca al
  // revés — degradar el `sizes` del hero serviría 1080 px en una caja de 1440
  // sobre el LCP de estas ocho rutas.
  const TAMANOS_HERO = '(min-width: 768px) 50vw, 100vw'
  const fotoHero = primerProyecto?.imagenes[0]?.src

  return (
    <>
      <JsonLd data={schemaFAQ(faqZona)} />
      <Migas items={[{ nombre: 'Zonas' }, { nombre: zona.municipio }]} />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 px-[18px] md:px-lat-desktop pb-8 md:pb-14">
        <div className="flex flex-col justify-center gap-4">
          <AntetituloSeccion>{zona.provincia}</AntetituloSeccion>
          <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
            Pavimentos de hormigón en {zona.municipio}
          </h1>
          <p className="text-16 md:text-20 text-tinta-media max-w-[52ch] m-0">
            Obra real ejecutada en {zona.municipio}: {zona.servicios.map((s) => NOMBRE_SERVICIO[s]).join(', ').toLowerCase()}.
          </p>
        </div>
        <Foto
          imagen={primerProyecto?.imagenes[0]}
          proporcion="4/3"
          prioridad
          tamanos={TAMANOS_HERO}
          etiqueta={
            primerProyecto ? (
              <EtiquetaTecnica lineas={[`${zona.municipio.toUpperCase()} · ${zona.provincia.toUpperCase()}`]} />
            ) : undefined
          }
        />
      </section>

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-6">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            Obras en {zona.municipio}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proyectos.map((p) => (
              <TarjetaProyecto
                key={p.slug}
                proyecto={p}
                tamanos={p.imagenes[0]?.src === fotoHero ? TAMANOS_HERO : undefined}
              />
            ))}
          </div>
        </div>
      </Aparece>

      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-6">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            Servicios prestados aquí
          </h2>
          <div className="flex flex-wrap gap-3">
            {zona.servicios.map((s) => (
              <a
                key={s}
                href={RUTA_SERVICIO[s]}
                className="min-h-tactil inline-flex items-center px-4 border border-tinta font-sans text-16 no-underline"
              >
                {NOMBRE_SERVICIO[s]}
              </a>
            ))}
          </div>
        </div>
      </Aparece>

      {acabadosZona.length > 0 ? (
        <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
          <div className="flex flex-col gap-6">
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
              Acabados usados en la zona
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px_10px] md:gap-[32px_24px]">
              {acabadosZona.map((a) => (
                <MuestraAcabado
                  key={a.slug}
                  acabado={a}
                  tamanos={a.muestra?.src === fotoHero ? TAMANOS_HERO : undefined}
                />
              ))}
            </div>
          </div>
        </Aparece>
      ) : null}

      <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col gap-2">
          <h2 className="font-display font-bold fs-h3 text-26 m-0">Zona de servicio</h2>
          <p className="text-16 text-tinta-media m-0">
            {zona.provincia} está en el anillo 1 de cobertura: cualquier superficie, sin recargo
            de desplazamiento.
          </p>
        </div>
      </Aparece>

      <Aparece as="section" className="px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
          <AntetituloSeccion>Preguntas frecuentes</AntetituloSeccion>
          <Acordeon preguntas={faqZona} />
        </div>
      </Aparece>

      <Aparece as="section" className="sobre-oscuro bg-tinta text-fondo px-[18px] md:px-lat-desktop py-9 md:py-22">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
            ¿Quieres algo parecido en {zona.municipio}?
          </h2>
          <Boton variante="primario" href="/presupuesto/">
            Pedir presupuesto
          </Boton>
        </div>
      </Aparece>
    </>
  )
}
