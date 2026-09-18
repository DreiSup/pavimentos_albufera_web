import type { ReactNode } from 'react'
import Aparece from '@/components/ui/Aparece'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Boton from '@/components/ui/Boton'
import { EnlaceEtiqueta } from '@/components/ui/EnlaceEtiqueta'
import Foto from '@/components/contenido/Foto'
import DatoPendiente from '@/components/datos/DatoPendiente'
import EtiquetaTecnica from '@/components/datos/EtiquetaTecnica'
import TablaFichaTecnica from '@/components/datos/TablaFichaTecnica'
import MuestraAcabado from '@/components/contenido/MuestraAcabado'
import TarjetaProyecto, { TAMANOS_TARJETA_PROYECTO } from '@/components/contenido/TarjetaProyecto'
import EstadoVacio from '@/components/ui/EstadoVacio'
import Migas from '@/components/layout/Migas'
import SubmenuServicio from '@/components/secciones/SubmenuServicio'
import Acordeon from '@/components/secciones/Acordeon'
import FormularioPresupuesto from '@/components/secciones/FormularioPresupuesto'
import { JsonLd, schemaFAQ, schemaServicio } from '@/lib/schema'
import { acabadosPorServicio, proyectosPorServicio } from '@/lib/datos'
import { nap } from '@/lib/config'
import type { Ubicacion } from '@/lib/eventos'
import { PASOS } from '@/content/servicios'
import type { SeccionServicio, Servicio } from '@/content/servicios'

/**
 * Plantilla única de las seis páginas de servicio.
 *
 * `04-desarrollo-y-deploy.md` §2: «un componente por concepto de diseño, no por
 * pantalla». Antes esto vivía copiado dentro de `/hormigon-impreso/`, y clonarlo
 * cinco veces habría garantizado que las seis divergieran en un mes.
 *
 * Las secciones que no tienen contenido **no se renderizan a medias**: el
 * numerado y el submenú se construyen a partir de lo que existe de verdad. Y
 * las que dependen de datos del cliente (muestrario, obra) caen a `EstadoVacio`
 * en lugar de fingir un catálogo — es la misma decisión que `design/05` §B4 tomó
 * con las reseñas.
 */

type Seccion = { id: SeccionServicio; texto: string }

/** Fondo de una banda del cuerpo. `tinta` es el de `Cuándo NO`, a página completa. */
type Fondo = 'base' | 'alt' | 'tinta'

/**
 * Las bandas del cuerpo, en el orden en que se pintan. Son las secciones
 * numeradas más las dos que no llevan número ni ancla: la FAQ y el cierre.
 */
type Banda = SeccionServicio | 'faq' | 'cierre'

/**
 * Literales enteros, nunca compuestos: Tailwind solo ve las clases que estén
 * escritas tal cual en el archivo. Un `bg-${x}` compila limpio, pasa los cinco
 * gates y llega a producción con la banda sin fondo ninguno.
 */
const CLASE_FONDO: Record<Fondo, string> = {
  base: '',
  alt: 'bg-fondo-alt',
  tinta: 'sobre-oscuro bg-tinta text-fondo',
}

/** El reparto de partida, el mismo que la plantilla tenía escrito a mano. */
const FONDO_DE_BANDA: Record<Banda, Fondo> = {
  'seccion-aplicaciones': 'base',
  'seccion-muestrario': 'alt',
  'seccion-ficha': 'base',
  'seccion-cuando-no': 'tinta',
  'seccion-como': 'alt',
  'seccion-obra': 'base',
  faq: 'alt',
  cierre: 'base',
}

/**
 * **El fondo alterno lo da la posición, no la sección** — `design/02` §A1, que
 * lo dejó escrito el 2026-09-17 cuando retirar Precios de la home dejó tres
 * bloques base seguidos: «el alterno se reparte otra vez».
 *
 * Aquí lo mismo lo abre la retirada de la calculadora del 2026-09-18.
 * `seccion-precio` iba en fondo base entre `Muestrario` y `Cómo trabajamos`,
 * que son las dos alternas, y al irse quedan pegadas en la única página donde
 * nada más las separa: `/lp/hormigon-lavado/`, que esconde la ficha técnica por
 * `ocultarSecciones` y no tiene `Cuándo NO`. Medido a 390 px, 1029 px seguidos
 * de `#DADCD6` sin costura.
 *
 * La regla es local: **ninguna banda comparte fondo con la que tiene encima.**
 * `Cuándo NO` va en `--tinta` y separa por sí misma, así que no colisiona nunca
 * y `Muestrario · tinta · Cómo trabajamos` se queda tal cual — es lo que pintan
 * hoy `/lp/hormigon-impreso/` y `/lp/hormigon-pulido/`, y no se toca.
 *
 * Se recorre **de abajo arriba y cede el alterno la banda de arriba**, no la de
 * abajo. No es indiferente: hacia abajo el reparto arrastraría a `Obra
 * ejecutada`, cuyas tarjetas van en `--fondo-alt` (`01` §3.12) y desaparecerían
 * sobre una banda alterna, y acabaría moviendo también el cierre.
 */
function repartirFondos(bandas: Banda[]): (b: Banda) => Fondo {
  const fondos = bandas.map((b) => FONDO_DE_BANDA[b])
  for (let i = fondos.length - 1; i > 0; i--) {
    if (fondos[i] === fondos[i - 1]) fondos[i - 1] = fondos[i - 1] === 'alt' ? 'base' : 'alt'
  }
  const mapa = new Map<Banda, Fondo>(bandas.map((b, i) => [b, fondos[i]]))
  return (b) => mapa.get(b) ?? 'base'
}

/**
 * Llamada y WhatsApp, en `tinta`/`contorno` — nunca en ocre. Es el mismo par
 * que cierra la home, recompuesto: aquí no se escribe copy nuevo.
 *
 * ⚠️ Sin `NEXT_PUBLIC_TELEFONO` ni `NEXT_PUBLIC_WHATSAPP` los dos href caen a
 * `/presupuesto/` y el botón no tiene número que anunciar. Una landing de
 * campaña así **no se despliega**: reproduce el problema de cero caminos de
 * contacto que la ola 1 existe para cerrar. Dos cosas lo sostienen y hacen
 * falta las dos. Una, la reserva va en `<DatoPendiente>`, porque un número
 * inventado en el CTA de mayor intención comercial del sitio es exactamente lo
 * que CLAUDE.md prohíbe maquillar; la clase `sobre-oscuro` es para que los corchetes
 * mantengan contraste AA sobre el botón de tinta. Y dos,
 * `scripts/verificar-landings.mjs` rompe el build en un despliegue de
 * producción si la reserva llega al HTML: un comentario no impide desplegar.
 */
function CtaContacto({ ubicacion }: { ubicacion: Ubicacion }) {
  return (
    /**
     * ⚠️ **El par pasa a fila en `cabecera-ancha` (1180 px), no en `md` (768).**
     *
     * Medido en `/lp/hormigon-impreso/`, con el aviso de cookies en pantalla y
     * el teléfono real puesto. En `md:flex-row` los dos botones se reparten una
     * columna que a 800 px mide 320 px, y como ninguno puede encoger por debajo
     * de su palabra más larga, el que encoge el rótulo es el de llamar:
     * `Llamar al 627 663 146` se partía en **tres líneas** y la fila pasaba de
     * 56 a **78,8 px** en toda la banda 776–847. Contrastado quitando el
     * `<svg>` del DOM: sin icono, a 800 y a 824 la misma fila mide 56 px, así
     * que el coste es del icono y no de la fila. Desde 848 px ya cabía con
     * icono, y a 768–775 falla con icono y sin él.
     *
     * A 1180 los dos rótulos caben **enteros**, sin partir ninguna línea:
     * 222,7 + 260,6 de botón más 12 de `gap` son 495,3 sobre los 510 px de
     * columna. Por debajo de ahí el par va apilado y cada botón ocupa el ancho
     * completo, que es exactamente lo que ya hacía en móvil. Así no hay ni una
     * anchura en la que un rótulo se parta: o caben los dos al lado, o van uno
     * encima de otro.
     *
     * Es el mismo punto en el que la cabecera despliega su fila completa y se
     * apaga la barra fija (`design/01` §4.1 y §4.3), y por la misma razón: es
     * donde deja de haber que estrechar nada para que quepa.
     */
    <div className="flex flex-col cabecera-ancha:flex-row gap-3">
      <Boton
        variante="tinta"
        href={nap.telefonoHref ?? '/presupuesto/'}
        data-ubicacion={ubicacion}
        className="sobre-oscuro"
      >
        Llamar al {nap.telefono ?? <DatoPendiente>{nap.telefonoMostrado}</DatoPendiente>}
      </Boton>
      <Boton
        variante="contorno"
        href={nap.whatsappHref ?? '/presupuesto/'}
        data-ubicacion={ubicacion}
      >
        Escribir por WhatsApp
      </Boton>
    </div>
  )
}

/**
 * El cierre es el bloque de conversión, y es el único de los nueve `<Aparece>`
 * del cuerpo que la landing exime: así no depende de que hidrate un
 * `IntersectionObserver` para verse. El hero no entra en la cuenta —ya es un
 * `<section>` normal—, así que ahí no había nada que desactivar.
 */
function Cierre({
  sinAparece,
  clase,
  children,
}: {
  sinAparece?: boolean
  clase: string
  children: ReactNode
}) {
  return sinAparece ? (
    <section className={clase}>{children}</section>
  ) : (
    <Aparece as="section" className={clase}>
      {children}
    </Aparece>
  )
}

export default function PaginaServicio({ servicio }: { servicio: Servicio }) {
  const acabados = acabadosPorServicio(servicio.id)
  const proyectos = proyectosPorServicio(servicio.id).slice(0, 3)

  // Una muestra del muestrario y una tarjeta de obra pueden ser la MISMA foto:
  // `corbera-fratasado-arena.jpg` sale en las dos secciones de
  // `/hormigon-fratasado/`. Con dos `sizes` distintos son dos peticiones a
  // `/_next/image?` del mismo JPEG. Gana el `sizes` de la tarjeta, que es el
  // hueco más ancho: pedir una vez el archivo grande cuesta menos que pedir el
  // grande y además el pequeño. El hero no entra —su foto no se repite abajo—.
  const fotosDeObra = new Set(proyectos.map((p) => p.imagenes[0]?.src).filter(Boolean))

  // El numerado sigue el orden real de las secciones presentes. Un servicio sin
  // `aplicaciones` o sin `cuandoNo` no deja hueco vacío ni número saltado.
  //
  // ⚠️ **Aquí ya no hay sección de precio, y es decisión del dueño**, la misma
  // que retiró `/precios/` el 2026-09-17 y que el 2026-09-18 alcanza también a
  // la calculadora: no quiere precios en la web. No es que falte el rango, es
  // que no se pone. Reponer esta entrada exige que lo pida él. → `design/02` §A5
  const todas: (Seccion | null)[] = [
    servicio.aplicaciones ? { id: 'seccion-aplicaciones', texto: 'Aplicaciones' } : null,
    { id: 'seccion-muestrario', texto: 'Muestrario' },
    { id: 'seccion-ficha', texto: 'Ficha técnica' },
    servicio.cuandoNo ? { id: 'seccion-cuando-no', texto: 'Cuándo NO' } : null,
    { id: 'seccion-como', texto: 'Cómo trabajamos' },
    { id: 'seccion-obra', texto: 'Obra ejecutada' },
  ]

  // `ocultarSecciones` se aplica aquí y en ningún otro sitio: filtrando esta
  // lista, el submenú, el numerado y el cuerpo cuentan lo mismo. Si se
  // comprobara sección por sección, ocultar la ficha técnica dejaría un número
  // saltado y un ancla del submenú apuntando a un id que no existe.
  const secciones = todas.filter(
    (s): s is Seccion => s !== null && !(servicio.ocultarSecciones ?? []).includes(s.id),
  )

  const monta = (id: SeccionServicio) => secciones.some((s) => s.id === id)
  const numero = (id: SeccionServicio) =>
    String(secciones.findIndex((s) => s.id === id) + 1).padStart(2, '0')
  const anclas = secciones.map((s) => ({ id: s.id, texto: `${numero(s.id)} · ${s.texto}` }))

  // El reparto del fondo alterno se hace sobre las bandas que esta página pinta
  // de verdad, FAQ y cierre incluidos: son bandas del mismo ritmo aunque no
  // lleven número ni ancla. El hero no entra —es la cabeza de la página, no una
  // banda: §A2 lo lista sin número, igual que las migas—.
  const llevaFaq = Boolean(servicio.faq && servicio.faq.length > 0)
  const bandas: Banda[] = [...secciones.map((s) => s.id), ...(llevaFaq ? (['faq'] as const) : []), 'cierre']
  const fondo = repartirFondos(bandas)
  const claseBanda = (b: Banda) =>
    `${CLASE_FONDO[fondo(b)]} px-[18px] md:px-lat-desktop py-9 md:py-22`.trim()

  // `ctaContacto` solo lo declara la recomposición de campaña, así que es
  // también lo que separa el tráfico de pago del orgánico en los informes: sin
  // él `lp_close` no se emitiría nunca.
  const ubicacionCierre: Ubicacion = servicio.ctaContacto ? 'lp_close' : 'service_close'

  return (
    <>
      <JsonLd data={schemaServicio(servicio.id, servicio.nombre, servicio.ruta)} />
      <Migas items={[{ nombre: 'Servicios' }, { nombre: servicio.nombre }]} />

      {/*
        Hero. `1fr 560px` con el H1 a 64 px es el hero de escritorio de
        `design/02` §A2, y **necesita 1278 px de ancho de contenido**: medido, la
        columna izquierda no puede bajar de la palabra más larga del H1 —558 px
        en `/microcemento/`, 472 en `/hormigon-desactivado/`, 374 en las otras
        cuatro— y a eso hay que sumarle los 64 px de hueco, los 560 de la foto y
        los 96 de gutter. Encendido en `md` (768) el `1fr` no podía encoger por
        debajo de esa palabra —`1fr` es `minmax(auto, 1fr)`— y empujaba la
        página entera: 100 px de scroll horizontal del documento a 960 px en
        cuatro de las seis páginas, 198 en desactivado y 285 en microcemento.

        Así que el hero de escritorio empieza en `xl`, igual que la cabecera, y
        entre 768 y 1279 se reparte en dos mitades con el H1 a 46 px —el mismo
        valor que usa en móvil, de la escala cerrada del §2.4—, que a 960 px
        deja dos columnas de 392 px. `grid-cols-2` es `minmax(0,1fr)` en
        Tailwind, así que en esa banda el track ya no puede forzar el desborde.
        `design/02` §A2, enmendado.
      */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_560px] gap-8 md:gap-16 px-[18px] md:px-lat-desktop pb-8 md:pb-14">
        <div className="flex flex-col justify-center gap-5 order-2 md:order-1">
          <h1 className="font-display font-extrabold fs-hero text-46 xl:text-64 leading-[1.05] m-0">
            {servicio.h1}
          </h1>
          <p className="text-16 md:text-20 text-tinta-media max-w-[52ch] m-0">{servicio.entradilla}</p>
          {/* En la landing el hero llama y escribe; en la página de servicio pide
              presupuesto. Nunca las dos cosas: cuatro botones en un hero no son
              dos roles de ocre, son ninguno. */}
          {servicio.ctaContacto ? (
            <CtaContacto ubicacion="lp_hero" />
          ) : (
            <div className="flex flex-col md:flex-row gap-3">
              <Boton variante="primario" href="/presupuesto/">
                Pedir presupuesto
              </Boton>
              <Boton variante="contorno" href="#seccion-muestrario">
                Ver acabados
              </Boton>
            </div>
          )}
        </div>
        <div className="order-1 md:order-2">
          {/* Tres tramos porque el grid tiene tres: la pista fija de 560 px
              desde `xl` —con `50vw` el navegador pedía w=1920 en 1920 a DPR 2,
              donde 1200 ya cubre los 560×2—, media ventana entre 768 y 1279, y
              `100vw` apilado en móvil. ⚠️ Es el **segundo** punto de ruptura que
              entra en un `sizes` del repo: `design/07` daba por hecho que 768
              era el único, y ese análisis —el que justifica `deviceSizes: 1536`
              como 768×2— iba del hero a sangre de `/proyectos/[slug]/`, que
              sigue a `100vw` y no cambia. Aquí el tramo nuevo pide menos, no
              más. El `100vw` se queda, y con él el `PATRON_HERO` de las
              verificaciones. */}
          <Foto
            imagen={servicio.imagenHero}
            proporcion="4/3"
            prioridad
            tamanos="(min-width: 1280px) 560px, (min-width: 768px) 50vw, 100vw"
            etiqueta={<EtiquetaTecnica lineas={servicio.etiquetaHero} />}
          />
        </div>
      </section>

      <SubmenuServicio anclas={anclas} />

      {servicio.aplicaciones && monta('seccion-aplicaciones') ? (
        <Aparece as="section" id="seccion-aplicaciones" className={claseBanda('seccion-aplicaciones')}>
          <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
            <div className="flex flex-col gap-4">
              <AntetituloSeccion numero={numero('seccion-aplicaciones')}>Aplicaciones</AntetituloSeccion>
              <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">
                Dónde tiene sentido ponerlo
              </h2>
              <p className="text-16 text-tinta-media m-0">{servicio.aplicaciones.intro}</p>
            </div>
            <div className="flex flex-col">
              {/* La pista de 300 px es fija igual que los 340 de la ficha
                  técnica, y con el mismo efecto: la fila no medía menos de
                  440 px, la sección es `380px 1fr` y 380 + 64 + 440 + 96 son
                  980 px de ancho de contenido. Se apila hasta `xl`, que es
                  donde el `380px 1fr` de la sección tiene sitio de verdad. */}
              {/* El filete que separa las filas por debajo de `xl` es el fondo
                  alterno sobre banda base; si el reparto le da a esta sección
                  la banda alterna, se invierte —`01` §3.12 hace lo mismo con la
                  tarjeta de proyecto— o desaparecería sobre su propio fondo. */}
              {servicio.aplicaciones.lista.map((a) => (
                <div
                  key={a.nombre}
                  className={`grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)] gap-2 xl:gap-6 py-4 border-t ${
                    fondo('seccion-aplicaciones') === 'alt' ? 'border-fondo' : 'border-fondo-alt'
                  } first:border-t-0 xl:first:border-t xl:border-t-tinta-media`}
                >
                  <h3 className="font-display font-bold fs-h3 text-20 md:text-26 m-0">{a.nombre}</h3>
                  {a.texto ? <p className="text-16 text-tinta-media m-0">{a.texto}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </Aparece>
      ) : null}

      {/* Muestrario del servicio */}
      {monta('seccion-muestrario') ? (
        <Aparece as="section" id="seccion-muestrario" className={claseBanda('seccion-muestrario')}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <AntetituloSeccion numero={numero('seccion-muestrario')}>Muestrario del servicio</AntetituloSeccion>
              {acabados.length > 0 ? (
                <EnlaceEtiqueta href={`/acabados/?tecnica=${servicio.id}`}>
                  Ver todos los acabados de {servicio.nombre.toLowerCase()} →
                </EnlaceEtiqueta>
              ) : null}
            </div>
            {acabados.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px_10px] md:gap-[32px_24px]">
                {acabados.map((a) => (
                  <MuestraAcabado
                    key={a.slug}
                    acabado={a}
                    tamanos={
                      a.muestra?.src && fotosDeObra.has(a.muestra.src)
                        ? TAMANOS_TARJETA_PROYECTO
                        : undefined
                    }
                  />
                ))}
              </div>
            ) : (
              <EstadoVacio
                titulo="Todavía no hemos subido el muestrario de este acabado"
                texto="Solo enseñamos acabados con obra ejecutada de verdad. Pregúntanos y te enseñamos las muestras que tenemos."
              />
            )}
          </div>
        </Aparece>
      ) : null}

      {/* Ficha técnica */}
      {monta('seccion-ficha') ? (
        <Aparece as="section" id="seccion-ficha" className={claseBanda('seccion-ficha')}>
          <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
            <AntetituloSeccion numero={numero('seccion-ficha')}>Ficha técnica</AntetituloSeccion>
            <TablaFichaTecnica filas={servicio.fichaTecnica} />
          </div>
        </Aparece>
      ) : null}

      {servicio.cuandoNo && monta('seccion-cuando-no') ? (
        <Aparece
          as="section"
          id="seccion-cuando-no"
          className={claseBanda('seccion-cuando-no')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div className="flex flex-col gap-4">
              <AntetituloSeccion numero={numero('seccion-cuando-no')} sobreOscuro>
                {servicio.cuandoNo.titulo}
              </AntetituloSeccion>
              <p className="text-16 md:text-20 text-sobre-tinta m-0">{servicio.cuandoNo.texto}</p>
            </div>
            <div className="flex flex-col gap-3 justify-center">
              {servicio.cuandoNo.alternativas.map((alt) => (
                <Boton key={alt.href} variante="contorno" sobreOscuro href={alt.href}>
                  {alt.texto}
                </Boton>
              ))}
            </div>
          </div>
        </Aparece>
      ) : null}

      {/* Cómo trabajamos */}
      {monta('seccion-como') ? (
        <Aparece as="section" id="seccion-como" className={claseBanda('seccion-como')}>
          <div className="flex flex-col gap-8">
            <AntetituloSeccion numero={numero('seccion-como')}>Cómo trabajamos</AntetituloSeccion>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
              {PASOS.map((p) => (
                <div key={p.numero} className="flex md:flex-col gap-4">
                  <span className="font-display font-bold fs-h2 text-26 md:text-34 text-acero w-[42px] md:w-auto shrink-0 md:border-t md:border-tinta md:pt-4">
                    {p.numero}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display font-bold fs-h3 text-20 m-0">{p.titulo}</h3>
                    <p className="text-14 md:text-16 text-tinta-media m-0">{p.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Aparece>
      ) : null}

      {/* Obra ejecutada */}
      {monta('seccion-obra') ? (
        <Aparece as="section" id="seccion-obra" className={claseBanda('seccion-obra')}>
          <div className="flex flex-col gap-6">
            <AntetituloSeccion numero={numero('seccion-obra')}>Obra ejecutada</AntetituloSeccion>
            {proyectos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* La tarjeta invierte su fondo respecto a la banda, `01` §3.12:
                    si el reparto le da a `Obra ejecutada` la alterna, las nueve
                    tarjetas se fundirían con ella. */}
                {proyectos.map((p) => (
                  <TarjetaProyecto
                    key={p.slug}
                    proyecto={p}
                    fondo={fondo('seccion-obra') === 'alt' ? 'base' : 'alt'}
                  />
                ))}
              </div>
            ) : (
              <EstadoVacio
                titulo="Todavía no hemos publicado obra de este acabado"
                texto="Lo hemos ejecutado, pero aún no tenemos la ficha con fotos propias montada. Pídenos referencias y te las pasamos."
              />
            )}
          </div>
        </Aparece>
      ) : null}

      {/* FAQ — solo las preguntas que aplican a ESTE servicio. Si no hay
          ninguna, no se renderiza sección vacía ni marcado `FAQPage` de más. */}
      {llevaFaq && servicio.faq ? (
        <Aparece as="section" className={claseBanda('faq')}>
          <JsonLd data={schemaFAQ(servicio.faq)} />
          <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-8 md:gap-16">
            <AntetituloSeccion numero={String(secciones.length + 1).padStart(2, '0')}>
              Preguntas frecuentes
            </AntetituloSeccion>
            <Acordeon preguntas={servicio.faq} />
          </div>
        </Aparece>
      ) : null}

      {/* Cierre */}
      <Cierre sinAparece={servicio.sinAparece} clase={claseBanda('cierre')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="flex flex-col gap-6">
            <h2 className="font-display font-bold fs-hero text-34 md:text-64 m-0">
              Cuéntanos qué quieres hacer
            </h2>
            <p className="text-16 md:text-20 text-tinta-media m-0">
              Te llamamos, vamos a verlo y te damos un precio cerrado. Sin coste y sin compromiso.
            </p>
            {servicio.ctaContacto ? (
              <>
                <CtaContacto ubicacion="lp_close" />
                <p className="text-14 text-tinta-media m-0">
                  O déjanos tus datos y te llamamos nosotros.
                </p>
              </>
            ) : null}
          </div>
          <FormularioPresupuesto variante="corto" origen={ubicacionCierre} />
        </div>
      </Cierre>
    </>
  )
}
