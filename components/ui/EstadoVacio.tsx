import AntetituloSeccion from './AntetituloSeccion'
import Boton from './Boton'

export default function EstadoVacio({
  titulo,
  texto,
  onQuitarFiltros,
  hrefPreguntar = '/presupuesto/',
  textoBotonQuitar = 'Quitar filtros',
  textoBotonPreguntar = 'Preguntar por un acabado',
}: {
  titulo: string
  texto: string
  onQuitarFiltros?: () => void
  hrefPreguntar?: string
  textoBotonQuitar?: string
  textoBotonPreguntar?: string
}) {
  return (
    <div className="border border-dashed border-tinta-media px-5 py-7 md:px-10 md:py-14 flex flex-col gap-4 items-start">
      <AntetituloSeccion>Sin resultados</AntetituloSeccion>
      <h3 className="font-display font-bold fs-h2 text-26 md:text-34">{titulo}</h3>
      <p className="text-16 md:text-20 text-tinta-media max-w-lectura">{texto}</p>
      <div className="flex flex-wrap gap-3 mt-2">
        {onQuitarFiltros ? (
          <Boton variante="contorno" type="button" onClick={onQuitarFiltros}>
            {textoBotonQuitar}
          </Boton>
        ) : null}
        <Boton variante="contorno" href={hrefPreguntar}>
          {textoBotonPreguntar}
        </Boton>
      </div>
    </div>
  )
}
