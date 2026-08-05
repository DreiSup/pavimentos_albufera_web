export default function AntetituloSeccion({
  numero,
  children,
  sobreOscuro,
  className = '',
}: {
  numero?: string
  children: React.ReactNode
  sobreOscuro?: boolean
  className?: string
}) {
  return (
    <p
      className={`font-mono text-d-11 md:text-d-12 tracking-[0.08em] uppercase ${
        sobreOscuro ? 'text-sobre-tinta' : 'text-acero'
      } ${className}`}
    >
      {numero ? `${numero} · ` : ''}
      {children}
    </p>
  )
}
