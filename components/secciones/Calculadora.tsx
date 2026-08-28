'use client'

import { useEffect, useMemo, useState } from 'react'
import Chip from '../ui/Chip'
import Boton from '../ui/Boton'
import { EVENTOS, registrarEvento } from '@/lib/eventos'

export type OpcionUso = { id: string; etiqueta: string; rango: [number, number] }

const TERRENOS = [
  { id: 'limpio', etiqueta: 'Limpio', multiplicador: 1.0 },
  { id: 'con-pavimento', etiqueta: 'Con pavimento a demoler', multiplicador: 1.15 },
  { id: 'sin-preparar', etiqueta: 'Sin preparar', multiplicador: 1.3 },
] as const

function redondearDecena(n: number) {
  return Math.round(n / 10) * 10
}

export default function Calculadora({ usos, reducida = false }: { usos: OpcionUso[]; reducida?: boolean }) {
  const [m2, setM2] = useState('')
  const [usoId, setUsoId] = useState(usos[0]?.id)
  const [terrenoId, setTerrenoId] = useState<(typeof TERRENOS)[number]['id']>('limpio')

  const superficie = Number(m2)
  const uso = usos.find((u) => u.id === usoId) ?? usos[0]
  const terreno = TERRENOS.find((t) => t.id === terrenoId) ?? TERRENOS[0]

  const rango = useMemo(() => {
    if (!superficie || superficie <= 0 || !uso) return null
    const min = redondearDecena(superficie * uso.rango[0] * terreno.multiplicador)
    const max = redondearDecena(superficie * uso.rango[1] * terreno.multiplicador)
    return { min, max }
  }, [superficie, uso, terreno])

  useEffect(() => {
    if (!rango) return
    const espera = setTimeout(() => {
      registrarEvento(EVENTOS.calculatorUse, {
        params: {
          surface_m2: superficie,
          use_case: uso?.id,
          ground_state: terreno.id,
          estimate_min: rango.min,
          estimate_max: rango.max,
        },
      })
    }, 800)
    return () => clearTimeout(espera)
  }, [rango, superficie, uso, terreno])

  return (
    <div className="sobre-oscuro bg-tinta text-fondo px-[18px] py-8 md:px-lat-desktop md:py-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[72px]">
      <div className="flex flex-col gap-4">
        <h3 className="font-display font-bold fs-h2 text-26 md:text-34 m-0">
          Calcula tu presupuesto orientativo
        </h3>
        <p className="text-16 md:text-20 text-sobre-tinta m-0">
          Superficie × rango del uso × estado del terreno. El resultado es siempre un rango, nunca
          una cifra exacta.
        </p>
        <div className="border border-dashed border-acero px-4 py-3">
          <p className="font-mono text-d-11 text-pendiente-oscuro m-0">
            Los multiplicadores de terreno son una estimación de diseño, sin validar por el cliente.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="calc-m2" className="font-mono text-d-11 tracking-[0.06em] uppercase text-sobre-tinta">
            Superficie en m²
          </label>
          <input
            id="calc-m2"
            type="number"
            min={0}
            inputMode="numeric"
            value={m2}
            onChange={(e) => setM2(e.target.value)}
            className="font-mono text-20 bg-transparent border border-sobre-tinta text-fondo min-h-campo px-[14px] w-full md:w-48"
            placeholder="Ej. 80"
          />
          <input
            type="range"
            min={10}
            max={400}
            step={5}
            value={superficie || 10}
            onChange={(e) => setM2(e.target.value)}
            className="w-full"
            aria-label="Superficie en m² (control deslizante)"
          />
        </div>

        {!reducida ? (
          <div className="flex flex-col gap-2">
            <span className="font-mono text-d-11 tracking-[0.06em] uppercase text-sobre-tinta">Uso</span>
            <div className="flex flex-wrap gap-2">
              {usos.map((u) => (
                <Chip key={u.id} activo={u.id === usoId} sobreOscuro onClick={() => setUsoId(u.id)}>
                  {u.etiqueta}
                </Chip>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <span className="font-mono text-d-11 tracking-[0.06em] uppercase text-sobre-tinta">
            Estado del terreno
          </span>
          <div className="flex flex-wrap gap-2">
            {TERRENOS.map((t) => (
              <Chip key={t.id} activo={t.id === terrenoId} sobreOscuro onClick={() => setTerrenoId(t.id)}>
                {t.etiqueta}
              </Chip>
            ))}
          </div>
        </div>

        <div className="border-t border-acero pt-5 flex flex-col gap-2">
          <span className="font-display font-bold fs-hero text-46 md:text-64">
            {rango ? `${rango.min}–${rango.max} €` : '—'}
          </span>
          {rango ? (
            <span className="font-mono text-d-12 text-sobre-tinta">
              {superficie} m² · {uso?.etiqueta} · {terreno.etiqueta} · sin IVA
            </span>
          ) : (
            <span className="font-mono text-d-12 text-sobre-tinta">
              Escribe una superficie para ver el rango
            </span>
          )}
        </div>

        <Boton variante="primario" href="/presupuesto/">
          Pedir presupuesto cerrado
        </Boton>
      </div>
    </div>
  )
}
