import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Aparece from '@/components/ui/Aparece'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Boton from '@/components/ui/Boton'
import { EnlaceEtiqueta } from '@/components/ui/EnlaceEtiqueta'
import Foto from '@/components/contenido/Foto'
import EtiquetaTecnica from '@/components/datos/EtiquetaTecnica'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
import MuestraAcabado from '@/components/contenido/MuestraAcabado'
import Migas from '@/components/layout/Migas'
import { JsonLd, schemaServicioZona } from '@/lib/schema'
import {
  acabadosPorProyectos,
  proyectosDe,
  serviciosDeZona,
  zonaIndexable,
  zonaPorSlug,
  zonas,
  zonasIndexables,
} from '@/lib/datos'
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

/*
 * 2026-10-21 — receta anti-doorway (`design/seo/receta-paginas-zona.md`).
 * Lo que distingue esta página de «la misma plantilla con el nombre cambiado»
 * sale todo del dato de la zona, no de aquí: entradilla, cuerpo y description
 * propios, obras con sus fotos y acabados. La plantilla solo pone el orden.
 *
 * - Title y H1 nombran la técnica que de verdad se hizo en el municipio
 *   («Hormigón impreso en Moraira»), que es la consulta que Search Console
 *   enseña, en vez del genérico «Pavimentos de hormigón en X».
 * - Sin FAQ: eran las mismas tres preguntas en las ocho zonas, ninguna sobre el
 *   municipio, y Google dejó de pintar el resultado enriquecido de FAQ en mayo
 *   de 2026. Un bloque idéntico en ocho URLs es justo la huella de una doorway.
 * - Enlaces a las demás zonas con obra y al índice `/zonas/`: una página que
 *   nadie enlaza es la otra huella.
 */
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
  // siguen. La regla vive en `zonaIndexable` (`lib/datos.ts`), la misma que saca la zona
  // del sitemap y del índice.
  return {
    title: `${serviciosDeZona(zona)} en ${zona.municipio}`,
    description: zona.descripcion,
    alternates: { canonical: `/zonas/${zona.slug}/` },
    ...(zonaIndexable(zona) ? {} : { robots: { index: false, follow: true } }),
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
  const servicios = serviciosDeZona(zona)
  const ruta = `/zonas/${zona.slug}/`
  const otrasZonas = zonasIndexables.filter((z) => z.slug !== zona.slug)

  // El hero de la zona es la primera foto del primer proyecto, y esa MISMA foto
  // vuelve a salir más abajo en su tarjeta de obra y —cuando el acabado la usa
  // de muestra— en el muestrario. Con tres `sizes` distintos son tres
  // peticiones a `/_next/image?` del mismo JPEG en la misma pantalla. Los dos
  // huecos de abajo adoptan el `sizes` del hero, que ya se descarga con
  // `prioridad`: salen de su caché en vez de abrir una descarga propia. Nunca al
  // revés — degradar el `sizes` del hero serviría 1080 px en una caja de 1440
  // sobre el LCP de estas rutas.
  const TAMANOS_HERO = '(min-width: 768px) 50vw, 100vw'
  const fotoHero = primerProyecto?.imagenes[0]?.src

  return (
    <>
      <JsonLd data={schemaServicioZona(servicios, ruta, zona.municipio, zona.provincia)} />
      <Migas items={[{ nombre: 'Zonas', href: '/zonas/' }, { nombre: zona.municipio }]} />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 px-[18px] md:px-lat-desktop pb-8 md:pb-14">
        <div className="flex flex-col justify-center gap-4">
          <AntetituloSeccion>
            {zona.comarca} · {zona.provincia}
          </AntetituloSeccion>
          <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
            {servicios} en {zona.municipio}
          </h1>
          <p className="text-16 md:text-20 text-tinta-media max-w-[52ch] m-0">{zona.entradilla}</p>
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

      {zona.cuerpo.length > 0 ? (
        <Aparece as="section" className="bg-fondo-alt px-[18px] md:px-lat-desktop py-9 md:py-22">
          <div className="flex flex-col gap-4 max-w-lectura">
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
              Qué hemos hecho en {zona.municipio}
            </h2>
            {zona.cuerpo.map((parrafo) => (
              <p key={parrafo} className="text-16 md:text-20 text-tinta-media m-0">
                {parrafo}
              </p>
            ))}
          </div>
        </Aparece>
      ) : null}

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
              Acabados usados en {zona.municipio}
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
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
          <div className="flex flex-col gap-2">
            <h2 className="font-display font-bold fs-h3 text-26 m-0">Zona de servicio</h2>
            <p className="text-16 text-tinta-media m-0">
              {zona.provincia} está en el anillo 1 de cobertura: cualquier superficie, sin recargo
              de desplazamiento.
            </p>
          </div>
          {otrasZonas.length > 0 ? (
            <nav aria-labelledby="otras-zonas" className="flex flex-col gap-4">
              <h2 id="otras-zonas" className="font-display font-bold fs-h3 text-26 m-0">
                Otras zonas con obra documentada
              </h2>
              <ul className="flex flex-wrap gap-3 list-none p-0 m-0">
                {otrasZonas.map((z) => (
                  <li key={z.slug}>
                    <Link
                      href={`/zonas/${z.slug}/`}
                      className="min-h-tactil inline-flex items-center px-4 border border-tinta font-sans text-16 no-underline"
                    >
                      {serviciosDeZona(z)} en {z.municipio}
                    </Link>
                  </li>
                ))}
              </ul>
              <EnlaceEtiqueta href="/zonas/">Todas las zonas →</EnlaceEtiqueta>
            </nav>
          ) : null}
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
