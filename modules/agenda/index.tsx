"use client"
import { useEffect, useState } from "react"
import { Clock, Users } from "lucide-react"
import { getClases, type Clase } from "./api"

const estadoBadge: Record<Clase["estado"], string> = {
  abierta: "bg-primary text-bg",
  completa: "bg-subtle text-accent",
  cancelada: "bg-subtle text-muted",
}

export function AgendaPage() {
  const [rows, setRows] = useState<Clase[]>([])
  useEffect(() => {
    getClases().then(setRows)
  }, [])

  const activas = rows.filter((c) => c.estado !== "cancelada")

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold">Clases de hoy</h1>
        <span className="rounded-lg bg-surface px-3 py-1.5 text-sm shadow-sm">
          <span className="font-semibold">{activas.length}</span> <span className="text-muted">clases en agenda</span>
        </span>
      </div>

      <div className="space-y-3">
        {rows.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-5 rounded-xl bg-surface p-4 shadow-card transition-shadow hover:shadow-pop"
          >
            <div className="flex w-16 shrink-0 flex-col items-center rounded-lg bg-subtle py-2">
              <Clock size={16} className="text-muted" />
              <span className="mt-1 text-sm font-semibold">{c.hora}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{c.clase}</p>
              <p className="text-sm text-muted">
                {c.coach} · {c.sala}
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <Users size={13} />
              {c.inscriptos}/{c.cupo}
            </span>
            <span className={"rounded-full px-2.5 py-0.5 text-xs " + estadoBadge[c.estado]}>{c.estado}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
