"use client"
import { useEffect, useMemo, useState } from "react"
import { getMembresias, type Ticket, type EstadoMembresia, type EstadoCobro } from "./api"

// LISTA-TICKET: tira tipo comprobante, monoespaciada. Cada fila = un socio +
// plan + dias para vencer + chip de estado + MRR. Ordenable por urgencia.
// Los rechazados y vencidos son la plata que se fuga: se ven primero.

const estadoChip: Record<EstadoMembresia, string> = {
  activo: "bg-success/15 text-success",
  "por-vencer": "bg-warning/15 text-warning",
  vencido: "bg-danger/15 text-danger",
  congelado: "bg-info/15 text-info",
}
const cobroChip: Record<EstadoCobro, string> = {
  cobrado: "bg-success/15 text-success",
  pendiente: "bg-warning/15 text-warning",
  rechazado: "bg-danger/20 text-danger",
}

const fmt = (n: number) => "$ " + n.toLocaleString("es-AR")

function venceLabel(dias: number) {
  if (dias < 0) return `vencio hace ${Math.abs(dias)}d`
  if (dias === 0) return "vence hoy"
  return `vence en ${dias}d`
}

type Orden = "urgencia" | "monto"

export function VentasPage() {
  const [rows, setRows] = useState<Ticket[]>([])
  const [orden, setOrden] = useState<Orden>("urgencia")
  const [filtro, setFiltro] = useState<EstadoMembresia | "todos">("todos")

  useEffect(() => {
    getMembresias().then(setRows)
  }, [])

  const visibles = useMemo(() => {
    const f = filtro === "todos" ? rows : rows.filter((r) => r.estado === filtro)
    return [...f].sort((a, b) => (orden === "urgencia" ? a.dias - b.dias : b.monto - a.monto))
  }, [rows, filtro, orden])

  const mrr = rows.filter((r) => r.cobro === "cobrado").reduce((s, r) => s + r.monto, 0)
  const enRiesgo = rows.filter((r) => r.cobro === "rechazado").reduce((s, r) => s + r.monto, 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Membresias</h1>
        <div className="flex gap-2">
          <span className="chip bg-success/15 text-success">MRR cobrado {fmt(mrr)}</span>
          <span className="chip bg-danger/15 text-danger">en riesgo {fmt(enRiesgo)}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["todos", "vencido", "por-vencer", "activo", "congelado"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFiltro(t)}
              className={"chip transition-colors " + (filtro === t ? "bg-primary text-fg" : "bg-subtle text-muted hover:text-fg")}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(["urgencia", "monto"] as const).map((o) => (
            <button
              key={o}
              onClick={() => setOrden(o)}
              className={"chip transition-colors " + (orden === o ? "bg-accent/20 text-accent" : "bg-subtle text-muted hover:text-fg")}
            >
              orden: {o}
            </button>
          ))}
        </div>
      </div>

      {/* la tira de comprobantes */}
      <div className="surface-card divide-y divide-border">
        {visibles.length === 0
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-14 animate-pulse bg-subtle" />)
          : visibles.map((t) => (
              <div
                key={t.id}
                className={
                  "flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-subtle " +
                  (t.cobro === "rechazado" ? "border-l-2 border-danger" : "border-l-2 border-transparent")
                }
              >
                <span className="dato w-20 shrink-0 text-xs text-muted">{t.id}</span>
                <div className="min-w-[9rem] flex-1">
                  <p className="font-heading text-sm font-bold">{t.socio}</p>
                  <p className="dato text-[11px] text-muted">{t.plan}</p>
                </div>
                <span className="dato w-28 shrink-0 text-xs text-muted">{venceLabel(t.dias)}</span>
                <span className={"chip w-24 shrink-0 justify-center " + estadoChip[t.estado]}>{t.estado}</span>
                <span className={"chip w-24 shrink-0 justify-center " + cobroChip[t.cobro]}>{t.cobro}</span>
                <span className="dato w-24 shrink-0 text-right text-base font-bold text-fg">{fmt(t.monto)}</span>
              </div>
            ))}
      </div>
    </div>
  )
}
