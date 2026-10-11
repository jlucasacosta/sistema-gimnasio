"use client"
import { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { getSocios, type Socio, type EstadoSocio } from "./api"
import { theme } from "@/shell/theme"
import { useCarga, Esqueleto, ErrorCarga } from "@/shell/carga"
import { FichaLateral, DatoFicha, AvisoDemo, botonPrimario, botonSecundario } from "@/shell/ficha-lateral"

// TABLA-DENSA con BARRA-BUSQUEDA-DOMINANTE: el gesto #1 del mostrador es
// encontrar al socio al instante por nombre o documento. La barra manda la
// pantalla; abajo, el roster en filas compactas ordenables por estado.
// Cada fila abre la ficha del socio (el nombre es el boton; el clic en la fila es un extra).
// Rojo/magenta SOLO para "vencido". Un socio congelado no tiene vencimiento corriendo: lleva "—".

const estadoChip: Record<EstadoSocio, string> = {
  activo: "bg-success/15 text-success",
  "por-vencer": "bg-warning/15 text-warning",
  vencido: "bg-danger/15 text-danger",
  congelado: "bg-info/15 text-info",
}

const estados = ["todos", "activo", "por-vencer", "vencido", "congelado"] as const

// Acciones segun el estado del socio. Ninguna guarda nada: la primera es la principal.
function accionesDe(s: Socio): { label: string; aviso: string }[] {
  const renovar = { label: "Renovar membresía", aviso: `En el sistema real se renovaría el plan ${s.plan} de ${s.nombre}.` }
  const recordatorio = { label: "Enviar recordatorio de pago", aviso: `En el sistema real se enviaría un aviso por WhatsApp a ${s.nombre}.` }
  const reservar = {
    label: "Reservar clase",
    aviso: `En el sistema real se llama a reservar_clase para ${s.nombre}: respeta el cupo y devuelve reservada o lista de espera.`,
  }
  if (s.estado === "vencido") return [renovar, recordatorio]
  if (s.estado === "por-vencer") return [renovar, recordatorio, reservar]
  if (s.estado === "congelado")
    return [
      { label: "Descongelar", aviso: `En el sistema real se reactivarían el cobro y el vencimiento de ${s.nombre}.` },
      { label: "Avisar la fecha de reactivación", aviso: `En el sistema real se enviaría un mensaje a ${s.nombre} con la fecha en que se descongela.` },
    ]
  return [reservar, { label: "Congelar", aviso: `En el sistema real se pausarían el cobro y el vencimiento de ${s.nombre}.` }]
}

function FichaSocio({ s, onCerrar }: { s: Socio | null; onCerrar: () => void }) {
  const [aviso, setAviso] = useState<string | null>(null)
  useEffect(() => setAviso(null), [s])

  return (
    <FichaLateral
      abierta={!!s}
      titulo={s?.nombre ?? ""}
      subtitulo={s ? `${s.id} · ${s.plan}` : undefined}
      onCerrar={onCerrar}
      acciones={
        s &&
        accionesDe(s).map((a, i) => (
          <button key={a.label} type="button" className={i === 0 ? botonPrimario : botonSecundario} onClick={() => setAviso(`Demo: no se guardó nada. ${a.aviso}`)}>
            {a.label}
          </button>
        ))
      }
    >
      {s && (
        <>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            <DatoFicha etiqueta="Código">
              <span className="dato">{s.id}</span>
            </DatoFicha>
            <DatoFicha etiqueta="Documento">
              <span className="dato">{s.documento}</span>
            </DatoFicha>
            <DatoFicha etiqueta="Plan">{s.plan}</DatoFicha>
            <DatoFicha etiqueta="Estado">
              <span className={"chip " + estadoChip[s.estado]}>{s.estado.replace("-", " ")}</span>
            </DatoFicha>
            <DatoFicha etiqueta="Último check-in">
              <span className="dato">{s.ultimoCheckin}</span>
            </DatoFicha>
            <DatoFicha etiqueta={s.vencimiento ? "Vence" : "Se descongela"}>
              <span className="dato">{s.vencimiento ?? s.descongela ?? "—"}</span>
            </DatoFicha>
            <DatoFicha etiqueta="Teléfono">
              <span className="dato">{s.telefono}</span>
            </DatoFicha>
            <DatoFicha etiqueta="Email">
              <span className="dato break-all">{s.email}</span>
            </DatoFicha>
          </dl>
          <AvisoDemo texto={aviso} />
        </>
      )}
    </FichaLateral>
  )
}

export function ContactosPage() {
  const { data, error, cargando, reintentar } = useCarga(getSocios)
  const [q, setQ] = useState("")
  const [filtro, setFiltro] = useState<EstadoSocio | "todos">("todos")
  const [sel, setSel] = useState<Socio | null>(null)

  const rows = useMemo(() => data ?? [], [data])
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
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Socios</h1>
        <span role="status" className="dato text-xs text-muted">
          {cargando ? "—" : visibles.length} / {cargando ? "—" : rows.length} socios
        </span>
      </div>

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

      <div className="space-y-2">
        <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
          {estados.map((t) => (
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
        <p className="text-xs text-muted">
          Por vencer: faltan {theme.porVencerDias} días o menos. Congelado: sin vencimiento mientras dure.
        </p>
      </div>

      {error ? (
        <ErrorCarga onReintentar={reintentar} />
      ) : (
        <div role="region" aria-label="Tabla de socios (desplazable)" aria-busy={cargando} tabIndex={0} className="surface-card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">Socios del club con plan, estado, último check-in y vencimiento</caption>
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-widest text-muted">
                <th scope="col" className="px-4 py-2 font-medium">Socio</th>
                <th scope="col" className="px-4 py-2 font-medium">Documento</th>
                <th scope="col" className="px-4 py-2 font-medium">Plan</th>
                <th scope="col" className="px-4 py-2 font-medium">Estado</th>
                <th scope="col" className="px-4 py-2 font-medium">Último check-in</th>
                <th scope="col" className="px-4 py-2 font-medium">Vence</th>
              </tr>
            </thead>
            <tbody>
              {cargando
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} aria-hidden="true" className="border-b border-border last:border-b-0">
                      <td colSpan={6} className="px-4 py-2.5">
                        <Esqueleto className="h-9" />
                      </td>
                    </tr>
                  ))
                : visibles.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => setSel(s)}
                      className="cursor-pointer border-b border-border transition-colors last:border-b-0 hover:bg-bg"
                    >
                      <td className="px-4 py-2.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSel(s)
                          }}
                          aria-label={`Abrir ficha de ${s.nombre}, ${s.id}`}
                          className="text-left font-heading font-bold hover:underline"
                        >
                          {s.nombre}
                        </button>
                        <p className="dato text-xs text-muted">
                          {s.id} · {s.email}
                        </p>
                      </td>
                      <td className="dato px-4 py-2.5 text-muted">{s.documento}</td>
                      <td className="dato px-4 py-2.5">{s.plan}</td>
                      <td className="px-4 py-2.5">
                        <span className={"chip " + estadoChip[s.estado]}>{s.estado.replace("-", " ")}</span>
                      </td>
                      <td className="dato px-4 py-2.5 text-muted">{s.ultimoCheckin}</td>
                      <td className="dato px-4 py-2.5">
                        {s.vencimiento ?? (
                          <>
                            <span aria-hidden="true">—</span>
                            <span className="sr-only">sin vencimiento mientras esté congelado</span>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
              {!cargando && visibles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted">
                    {q.trim() ? <>Sin socios para &quot;{q}&quot;</> : "No hay socios en este estado."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <FichaSocio s={sel} onCerrar={() => setSel(null)} />
    </div>
  )
}
