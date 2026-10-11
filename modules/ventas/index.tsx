"use client"
import { useEffect, useMemo, useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { getMembresias, type Ticket, type EstadoMembresia, type EstadoCobro } from "./api"
import { theme } from "@/shell/theme"
import { useCarga, Esqueleto, ErrorCarga } from "@/shell/carga"
import { FichaLateral, DatoFicha, AvisoDemo, botonPrimario, botonSecundario } from "@/shell/ficha-lateral"

// LISTA-TICKET: tira tipo comprobante, monoespaciada. Cada fila = un socio +
// plan + dias para vencer + chip de estado + MRR. Ordenable por urgencia.
// Los rechazados y vencidos son la plata que se fuga: se ven primero.
// Cada fila abre su ficha (el nombre es el boton; el clic en la fila es un extra).
// Rojo/magenta SOLO para "vencido" y "rechazado". Una membresia congelada no muestra
// dias para vencer ni cobro: lleva "—".

const estadoChip: Record<EstadoMembresia, string> = {
  activo: "bg-success/15 text-success",
  "por-vencer": "bg-warning/15 text-warning",
  vencido: "bg-danger/15 text-danger",
  congelado: "bg-info/15 text-info",
}
const cobroChip: Record<EstadoCobro, string> = {
  cobrado: "bg-success/15 text-success",
  pendiente: "bg-warning/15 text-warning",
  rechazado: "bg-danger/15 text-danger",
}

const fmt = (n: number) => "$ " + n.toLocaleString("es-AR")

function venceLabel(dias: number | null) {
  if (dias === null) return "—"
  if (dias < 0) return `venció hace ${Math.abs(dias)} d`
  if (dias === 0) return "vence hoy"
  return `vence en ${dias} d`
}

type Orden = "urgencia" | "monto"
const etiquetaOrden: Record<Orden, string> = { urgencia: "más urgentes primero", monto: "mayor monto primero" }
const estados = ["todos", "vencido", "por-vencer", "activo", "congelado"] as const

// Acciones segun el estado del ticket. Ninguna guarda nada: la primera es la principal.
function accionesDe(t: Ticket): { label: string; aviso: string }[] {
  const out: { label: string; aviso: string }[] = []
  if (t.cobro === "rechazado") out.push({ label: "Reintentar cobro", aviso: `En el sistema real se reintentaría el débito de ${t.id}.` })
  if (t.cobro === "pendiente") out.push({ label: "Registrar pago", aviso: `En el sistema real se marcaría ${t.id} como cobrada.` })
  if (t.estado === "vencido" || t.estado === "por-vencer") out.push({ label: "Renovar membresía", aviso: `En el sistema real se renovaría ${t.id} por un nuevo período.` })
  if (t.cobro === "rechazado" || t.cobro === "pendiente") out.push({ label: "Enviar recordatorio de pago", aviso: `En el sistema real se enviaría un aviso por WhatsApp a ${t.socio}.` })
  if (t.estado === "activo" || t.estado === "por-vencer") out.push({ label: "Congelar", aviso: `En el sistema real se pausarían el cobro y el vencimiento de ${t.id}.` })
  if (t.estado === "congelado") {
    out.push({ label: "Descongelar", aviso: `En el sistema real se reactivarían el cobro y el vencimiento de ${t.id}.` })
    out.push({ label: "Avisar la fecha de reactivación", aviso: `En el sistema real se enviaría un mensaje a ${t.socio} con la fecha en que se descongela.` })
  }
  if (t.estado === "activo" && out.length === 1) out.unshift({ label: "Renovar membresía", aviso: `En el sistema real se renovaría ${t.id} por un nuevo período.` })
  return out.slice(0, 3)
}

function FichaMembresia({ t, onCerrar }: { t: Ticket | null; onCerrar: () => void }) {
  const [aviso, setAviso] = useState<string | null>(null)
  useEffect(() => setAviso(null), [t])
  const congelada = !!t && t.estado === "congelado"

  return (
    <FichaLateral
      abierta={!!t}
      titulo={t?.socio ?? ""}
      subtitulo={t ? `${t.id} · ${t.plan}` : undefined}
      onCerrar={onCerrar}
      acciones={
        t &&
        accionesDe(t).map((a, i) => (
          <button key={a.label} type="button" className={i === 0 ? botonPrimario : botonSecundario} onClick={() => setAviso(`Demo: no se guardó nada. ${a.aviso}`)}>
            {a.label}
          </button>
        ))
      }
    >
      {t && (
        <>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            <DatoFicha etiqueta="Código">
              <span className="dato">{t.id}</span>
            </DatoFicha>
            <DatoFicha etiqueta="Socio">{t.socio}</DatoFicha>
            <DatoFicha etiqueta="Plan">{t.plan}</DatoFicha>
            <DatoFicha etiqueta="Cuota mensual">
              <span className="dato">{congelada ? "—" : fmt(t.monto)}</span>
            </DatoFicha>
            <DatoFicha etiqueta="Estado">
              <span className={"chip " + estadoChip[t.estado]}>{t.estado.replace("-", " ")}</span>
            </DatoFicha>
            <DatoFicha etiqueta="Cobro">
              {t.cobro ? <span className={"chip " + cobroChip[t.cobro]}>{t.cobro}</span> : <span className="dato">—</span>}
            </DatoFicha>
            <DatoFicha etiqueta="Vencimiento">
              <span className="dato">{venceLabel(t.dias)}</span>
            </DatoFicha>
            {t.descongela && (
              <DatoFicha etiqueta="Se descongela">
                <span className="dato">{t.descongela}</span>
              </DatoFicha>
            )}
          </dl>
          <AvisoDemo texto={aviso} />
        </>
      )}
    </FichaLateral>
  )
}

export function VentasPage() {
  const { data, error, cargando, reintentar } = useCarga(getMembresias)
  const [orden, setOrden] = useState<Orden>("urgencia")
  const [filtro, setFiltro] = useState<EstadoMembresia | "todos">("todos")
  const [sel, setSel] = useState<Ticket | null>(null)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

  const rows = useMemo(() => data ?? [], [data])
  const visibles = useMemo(() => {
    const f = filtro === "todos" ? rows : rows.filter((r) => r.estado === filtro)
    return [...f].sort((a, b) =>
      orden === "urgencia" ? (a.dias ?? Infinity) - (b.dias ?? Infinity) : b.monto - a.monto,
    )
  }, [rows, filtro, orden])

  const cobrado = rows.filter((r) => r.cobro === "cobrado").reduce((s, r) => s + r.monto, 0)
  const rechazados = rows.filter((r) => r.cobro === "rechazado")
  const enRiesgo = rechazados.reduce((s, r) => s + r.monto, 0)
  const filtrosActivos = orden !== "urgencia" ? 1 : 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Membresías</h1>
        <div className="flex flex-wrap gap-2">
          <span className="chip bg-success/15 text-success">cobrado {cargando ? "—" : fmt(cobrado)}</span>
          <span className="chip bg-danger/15 text-danger">
            {cargando ? "—" : rechazados.length} débitos rechazados · {cargando ? "—" : fmt(enRiesgo)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
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

        {/* Escritorio: el orden va a la vista. Celular: el orden se esconde detras de "Filtros" para que la lista arranque arriba. */}
        <div role="group" aria-label="Ordenar la lista" className="hidden gap-2 md:flex">
          {(["urgencia", "monto"] as const).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOrden(o)}
              aria-pressed={orden === o}
              className={"chip tap transition-colors " + (orden === o ? "bg-accent/20 text-accent" : "bg-subtle text-muted hover:text-fg")}
            >
              orden: {o}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setFiltrosAbiertos(true)}
          className="chip tap gap-1.5 bg-subtle text-fg md:hidden"
        >
          <SlidersHorizontal size={14} strokeWidth={1.25} aria-hidden="true" />
          Filtros{filtrosActivos > 0 ? ` (${filtrosActivos})` : ""}
        </button>
      </div>

      <p className="text-xs text-muted">
        Por vencer: faltan {theme.porVencerDias} días o menos. Una membresía congelada no tiene cobro ni vencimiento mientras dure.
      </p>

      {error ? (
        <ErrorCarga onReintentar={reintentar} />
      ) : (
        /* la tira de comprobantes */
        <ul aria-label="Membresías" aria-busy={cargando} className="surface-card divide-y divide-border">
          {cargando ? (
            Array.from({ length: 8 }).map((_, i) => (
              <li key={i} aria-hidden="true" className="p-3">
                <Esqueleto className="h-14" />
              </li>
            ))
          ) : visibles.length === 0 ? (
            <li className="px-4 py-10 text-center text-sm text-muted">No hay membresías en este estado.</li>
          ) : (
            visibles.map((t) => {
              const congelada = t.estado === "congelado"
              return (
                <li
                  key={t.id}
                  onClick={() => setSel(t)}
                  className={
                    "grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-3 transition-colors hover:bg-bg md:flex " +
                    (t.cobro === "rechazado" ? "border-l-2 border-danger" : "border-l-2 border-transparent")
                  }
                >
                  <span className="dato hidden w-20 shrink-0 text-xs text-muted md:block">{t.id}</span>
                  <div className="min-w-0 md:min-w-[9rem] md:flex-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSel(t)
                      }}
                      aria-label={`Abrir ficha de ${t.socio}, ${t.id}`}
                      className="text-left font-heading text-sm font-bold hover:underline"
                    >
                      {t.socio}
                    </button>
                    <p className="dato text-xs text-muted">
                      <span className="md:hidden">{t.id} · </span>
                      {t.plan}
                    </p>
                  </div>
                  <span className="dato text-right text-base font-bold text-fg md:order-last md:w-24 md:shrink-0">
                    {congelada ? (
                      <>
                        <span aria-hidden="true">—</span>
                        <span className="sr-only">sin cuota mientras esté congelada</span>
                      </>
                    ) : (
                      fmt(t.monto)
                    )}
                  </span>
                  <div className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-1 md:contents">
                    <span className="dato w-28 shrink-0 text-xs text-muted">
                      {t.dias === null ? (
                        <>
                          <span aria-hidden="true">—</span>
                          <span className="sr-only">sin vencimiento mientras esté congelada</span>
                        </>
                      ) : (
                        venceLabel(t.dias)
                      )}
                    </span>
                    <span className={"chip w-24 shrink-0 justify-center " + estadoChip[t.estado]}>{t.estado.replace("-", " ")}</span>
                    {t.cobro ? (
                      <span className={"chip w-24 shrink-0 justify-center " + cobroChip[t.cobro]}>{t.cobro}</span>
                    ) : (
                      <span className="dato w-24 shrink-0 text-center text-xs text-muted">
                        <span aria-hidden="true">—</span>
                        <span className="sr-only">sin cobro mientras esté congelada</span>
                      </span>
                    )}
                  </div>
                </li>
              )
            })
          )}
        </ul>
      )}

      <FichaMembresia t={sel} onCerrar={() => setSel(null)} />

      <FichaLateral abierta={filtrosAbiertos} titulo="Filtros" subtitulo="Cómo se ordena la lista" onCerrar={() => setFiltrosAbiertos(false)}>
        <div role="group" aria-label="Ordenar la lista" className="flex flex-col gap-2">
          {(["urgencia", "monto"] as const).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOrden(o)}
              aria-pressed={orden === o}
              className={"tap rounded-[var(--radius)] border px-3 py-2 text-left text-sm " + (orden === o ? "border-accent bg-accent/15 text-accent" : "border-border text-fg")}
            >
              {etiquetaOrden[o]}
            </button>
          ))}
        </div>
      </FichaLateral>
    </div>
  )
}
