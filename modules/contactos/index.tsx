"use client"
import { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { getSocios, type Socio, type EstadoSocio } from "./api"

// TABLA-DENSA con BARRA-BUSQUEDA-DOMINANTE: el gesto #1 del mostrador es
// encontrar al socio al instante por nombre o documento. La barra manda la
// pantalla; abajo, el roster en filas compactas ordenables por estado.

const estadoChip: Record<EstadoSocio, string> = {
  activo: "bg-success/15 text-success",
  "por-vencer": "bg-warning/15 text-warning",
  vencido: "bg-danger/15 text-danger",
  congelado: "bg-info/15 text-info",
}

export function ContactosPage() {
  const [rows, setRows] = useState<Socio[]>([])
  const [q, setQ] = useState("")
  const [filtro, setFiltro] = useState<EstadoSocio | "todos">("todos")

  useEffect(() => {
    getSocios().then(setRows)
  }, [])

  const visibles = useMemo(() => {
    const term = q.trim().toLowerCase()
    return rows.filter((r) => {
      const okEstado = filtro === "todos" || r.estado === filtro
      const okTerm =
        term === "" ||
        r.nombre.toLowerCase().includes(term) ||
        r.documento.replace(/\./g, "").includes(term.replace(/\./g, ""))
      return okEstado && okTerm
    })
  }, [rows, q, filtro])

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Socios</h1>

      {/* barra de busqueda dominante: ancha y protagonica */}
      <div className="relative">
        <label htmlFor="buscar-socio" className="sr-only">
          Buscar socio por nombre o documento
        </label>
        <Search size={22} strokeWidth={1.25} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          id="buscar-socio"
          type="search"
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar socio por nombre o documento..."
          className="dato w-full rounded border border-muted bg-surface py-4 pl-12 pr-4 text-lg placeholder:text-muted focus-visible:border-accent"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
          {(["todos", "activo", "por-vencer", "vencido", "congelado"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFiltro(t)}
              aria-pressed={filtro === t}
              className={"chip tap transition-colors " + (filtro === t ? "bg-primary text-fg" : "bg-subtle text-muted hover:text-fg")}
            >
              {t.replace("-", " ")}
            </button>
          ))}
        </div>
        <span role="status" className="dato text-xs text-muted">
          {visibles.length} / {rows.length} socios
        </span>
      </div>

      <div role="region" aria-label="Tabla de socios (desplazable)" tabIndex={0} className="surface-card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <caption className="sr-only">Socios del club con plan, estado, último check-in y vencimiento</caption>
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-widest text-muted">
              <th scope="col" className="px-4 py-2 font-medium">Socio</th>
              <th scope="col" className="px-4 py-2 font-medium">Documento</th>
              <th scope="col" className="px-4 py-2 font-medium">Plan</th>
              <th scope="col" className="px-4 py-2 font-medium">Estado</th>
              <th scope="col" className="px-4 py-2 font-medium">Último check-in</th>
              <th scope="col" className="px-4 py-2 font-medium">Vence</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((s) => (
              <tr key={s.id} className="border-b border-border transition-colors last:border-b-0 hover:bg-subtle">
                <td className="px-4 py-2.5">
                  <p className="font-heading font-bold">{s.nombre}</p>
                  <p className="dato text-[11px] text-muted">{s.email}</p>
                </td>
                <td className="dato px-4 py-2.5 text-muted">{s.documento}</td>
                <td className="dato px-4 py-2.5">{s.plan}</td>
                <td className="px-4 py-2.5">
                  <span className={"chip " + estadoChip[s.estado]}>{s.estado.replace("-", " ")}</span>
                </td>
                <td className="dato px-4 py-2.5 text-muted">{s.ultimoCheckin}</td>
                <td className="dato px-4 py-2.5">{s.vencimiento}</td>
              </tr>
            ))}
            {visibles.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted">
                  Sin socios para &quot;{q}&quot;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
