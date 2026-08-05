import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

const clases =
  'inline-flex items-center min-h-tactil font-mono text-d-12 tracking-[0.05em] uppercase no-underline border-b-2 border-tinta w-fit'

export function EnlaceEtiqueta({
  href,
  children,
  className = '',
  ...resto
}: { href: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link href={href} className={`${clases} ${className}`} {...resto}>
      {children}
    </Link>
  )
}

export function BotonEtiqueta({
  children,
  className = '',
  ...resto
}: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`${clases} ${className}`} {...resto}>
      {children}
    </button>
  )
}
