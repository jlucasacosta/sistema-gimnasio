"use client"
import { useEffect, useState } from "react"
import { Clock, Users } from "lucide-react"
import { getClases, type Clase } from "./api"

const estadoBadge: Record<Clase["estado"], string> = {
  abierta: "bg-success/15 text-success",
  completa: "bg-info/15 text-info",
  cancelada: "bg-danger/15 text-danger",
}

const horaTint: Record<Clase["estado"], string> = {
  abierta: "bg-success/10 text-success",
  completa: "bg-info/10 text-info",
  cancelada: "bg-danger/10 text-danger",
}

function ocupacionColor(pct: number) {
  if (pct >= 1) return "bg-info"
  if (pct >= 0.75) return "bg-warning"
  return "bg-primary"
}

export function AgendaPage() {
  const [rows, setRows] = useState<Clase[]>([])
  useEffect(() => {
    getClases().then(setRows)
  }, [])

  const activas = rows.filter((c) => c.estado !== "cancelada")
  const completas = rows.filter((c) => c.estado === "completa")

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold">Clases de hoy</h1>
        <div className="flex gap-2">
          <span className="rounded-lg bg-surface px-3 py-1.5 text-sm shadow-sm">
            <span className="font-semibold text-success">{activas.length}</span>{" "}
            <span className="text-muted">en agenda</span>
          </span>
          <span className="rounded-lg bg-surface px-3 py-1.5 text-sm shadow-sm">
            <span className="font-semibold text-info">{completas.length}</span>{" "}
            <span className="text-muted">completas</span>
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((c) => {
          const pct = c.inscriptos / c.cupo
          return (
            <div
              key={c.id}
              className={
                "flex items-center gap-5 rounded-xl bg-surface p-4 shadow-card transition-shadow hover:shadow-pop " +
                (c.estado === "cancelada" ? "opacity-60" : "")
              }
            >
              <div className={"flex w-16 shrink-0 flex-col items-center rounded-lg py-2 " + horaTint[c.estado]}>
                <Clock size={16} />
                <span className="mt-1 text-sm font-semibold">{c.hora}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{c.clase}</p>
                <p className="text-sm text-muted">
                  {c.coach} · {c.sala}
                </p>
              </div>
              <div className="hidden w-40 sm:block">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-subtle">
                  <div
                    className={"h-full rounded-full transition-all " + ocupacionColor(pct)}
                    style={{ width: Math.min(pct, 1) * 100 + "%" }}
                  />
                </div>
              </div>
              <span className="flex w-16 items-center justify-end gap-1.5 text-sm text-muted">
                <Users size={13} />
                {c.inscriptos}/{c.cupo}
              </span>
              <span className={"w-24 shrink-0 rounded-full px-2.5 py-0.5 text-center text-xs " + estadoBadge[c.estado]}>
                {c.estado}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
