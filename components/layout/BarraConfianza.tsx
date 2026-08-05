const datos = [
  '17 años de oficio',
  'Garantía de 10 años con mantenimiento',
  'Valencia, Castellón y Alicante',
  'Más de 3 de cada 10 clientes vuelven a llamarnos',
]

export default function BarraConfianza() {
  return (
    <div className="bg-tinta text-fondo md:sticky md:z-20 md:[top:var(--cabecera-actual)] py-4 md:py-0 md:h-[60px] px-[18px] md:px-lat-desktop flex flex-col md:flex-row md:items-center md:gap-2">
      <span className="hidden md:inline font-mono text-d-12 tracking-[0.04em] text-acero">
        {datos.join('  ·  ')}
      </span>
      <div className="md:hidden flex flex-col">
        {datos.map((dato, i) => (
          <div key={dato} className="flex gap-3 py-2 border-t first:border-t-0 border-acero">
            <span className="font-mono text-d-11 text-acero">{String(i + 1).padStart(2, '0')}</span>
            <span className="font-mono text-d-11 tracking-[0.04em]">{dato}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
