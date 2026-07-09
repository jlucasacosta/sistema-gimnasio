"use client"
import { useEffect, useState } from "react"
import { getClasesHoy, type ClaseAgenda, type EstadoClase } from "./api"
import { nivelDeAforo, estaCompleta, pct, rellenoAforo, chipAforo } from "@/shell/aforo"

// TIMELINE: eje horario vertical del dia. Cada clase es un bloque posicionado
// por hora, con coach, sala y su barra de aforo. Es el corazon de la agenda:
// el mismo lenguaje del Termometro, pero ordenado por HORA.

const estadoChip: Record<EstadoClase, string> = {
  programada: "bg-subtle text-muted",
  "en-curso": "bg-accent/20 text-accent",
  cancelada: "bg-danger/15 text-danger",
}
const estadoLabel: Record<EstadoClase, string> = {
  programada: "programada",
  "en-curso": "en curso",
  cancelada: "cancelada",
}

function BloqueClase({ c }: { c: ClaseAgenda }) {
  const cancelada = c.estado === "cancelada"
  const nivel = nivelDeAforo(c.ocupados, c.cupo)
  const completa = estaCompleta(c.ocupados, c.cupo) && !cancelada
  const p = pct(c.ocupados, c.cupo)

  return (
    <div className="flex gap-4">
      {/* eje horario a la izquierda */}
      <div className="flex w-14 shrink-0 flex-col items-end pt-1">
        <span className="dato text-lg font-bold text-fg">{c.hora}</span>
        <span className="dato text-[11px] text-muted">{c.fin}</span>
      </div>

      {/* riel: punto + linea */}
      <div className="relative flex w-4 shrink-0 flex-col items-center">
        <span
          className={
            "z-10 mt-2 h-3 w-3 rounded-full border-2 " +
            (cancelada
              ? "border-danger bg-bg"
              : c.estado === "en-curso"
                ? "border-accent bg-accent"
                : "border-border bg-surface")
          }
        />
        <span className="w-px flex-1 bg-border" />
      </div>

      {/* bloque de la clase */}
      <div className={"surface-card mb-3 flex-1 p-4 " + (cancelada ? "opacity-55" : "")}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={"font-heading text-base font-bold " + (cancelada ? "line-through" : "")}>{c.clase}</p>
            <p className="dato text-[11px] text-muted">
              {c.coach} · {c.sala}
            </p>
          </div>
          <span className={"chip " + estadoChip[c.estado]}>{estadoLabel[c.estado]}</span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex w-20 shrink-0 items-baseline gap-1">
            <span className={"dato text-3xl font-bold " + (completa ? "text-danger" : cancelada ? "text-muted" : "text-fg")}>
              {c.ocupados}
            </span>
            <span className="dato text-base text-muted">/{c.cupo}</span>
          </div>
          <div className="flex-1">
            <div className={"barra h-6 " + (completa ? "completa" : "")}>
              <div
                className={"barra-fill " + (cancelada ? "bg-border" : rellenoAforo[nivel])}
                style={{ width: (cancelada ? 0 : p * 100) + "%" }}
              />
            </div>
          </div>
          <div className="w-24 shrink-0 text-right">
            {completa ? (
              <div className="space-y-1">
                <span className="chip bg-danger/20 font-bold text-danger">COMPLETO</span>
                {c.waitlist > 0 && <p className="dato text-[11px] text-danger">+{c.waitlist} waitlist</p>}
              </div>
            ) : cancelada ? (
              <span className="dato text-[11px] text-muted">sin cupo</span>
            ) : (
              <span className={"chip " + chipAforo[nivel]}>{Math.round(p * 100)}%</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AgendaPage() {
  const [clases, setClases] = useState<ClaseAgenda[]>([])

  useEffect(() => {
    getClasesHoy().then(setClases)
  }, [])

  const completas = clases.filter((c) => estaCompleta(c.ocupados, c.cupo) && c.estado !== "cancelada").length
  const ordenadas = [...clases].sort((a, b) => a.hora.localeCompare(b.hora))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Riel de clases · hoy</h1>
        <div className="flex gap-2">
          <span className="chip bg-accent/15 text-accent">{clases.length} clases</span>
          <span className="chip bg-danger/15 text-danger">{completas} completas</span>
        </div>
      </div>

      <div className="surface-card p-5">
        {ordenadas.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="mb-3 h-20 animate-pulse rounded bg-subtle" />)
        ) : (
          <div>
            {ordenadas.map((c) => (
              <BloqueClase key={c.id} c={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
