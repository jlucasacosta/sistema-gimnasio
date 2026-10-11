"use client"
import { useEffect, useState } from "react"
import { getClasesHoy, type ClaseAgenda, type EstadoClase } from "./api"
import { nivelDeAforo, estaCompleta, pct, rellenoAforo, chipAforo, etiquetaAforo } from "@/shell/aforo"
import { LeyendaAforo } from "@/shell/leyenda-aforo"
import { useCarga, Esqueleto, ErrorCarga } from "@/shell/carga"
import { FichaLateral, DatoFicha, AvisoDemo, botonPrimario, botonSecundario } from "@/shell/ficha-lateral"

// TIMELINE: eje horario vertical del dia. Cada clase es un bloque posicionado
// por hora, con coach, sala y su barra de aforo. Es el corazon de la agenda:
// el mismo lenguaje del Termometro, pero ordenado por HORA. Cada bloque abre su ficha.

// Estados de la clase. Rojo/magenta NO se usa aca: es de vencido/rechazado.
// programada = contorno, en curso = relleno cobalto, finalizada y cancelada = neutros con rotulo
// (excepcion documentada en DISENO.md: texto muted sobre subtle 4.63:1).
const estadoChip: Record<EstadoClase, string> = {
  programada: "border border-border text-fg",
  "en-curso": "bg-primary text-fg",
  finalizada: "bg-subtle text-muted",
  cancelada: "bg-subtle text-muted",
}
const estadoLabel: Record<EstadoClase, string> = {
  programada: "programada",
  "en-curso": "en curso",
  finalizada: "finalizada",
  cancelada: "cancelada",
}

function BloqueClase({ c, onAbrir }: { c: ClaseAgenda; onAbrir: (c: ClaseAgenda) => void }) {
  const cancelada = c.estado === "cancelada"
  const cerrada = cancelada || c.estado === "finalizada"
  const nivel = nivelDeAforo(c.ocupados, c.cupo)
  const completa = estaCompleta(c.ocupados, c.cupo) && !cerrada
  const p = pct(c.ocupados, c.cupo)

  return (
    <li className="flex gap-4">
      {/* eje horario a la izquierda */}
      <div className="flex w-14 shrink-0 flex-col items-end pt-1">
        <span className="dato text-lg font-bold text-fg">{c.hora}</span>
        <span className="dato text-xs text-muted">{c.fin}</span>
      </div>

      {/* riel: punto + linea */}
      <div className="relative flex w-4 shrink-0 flex-col items-center">
        <span
          className={
            "z-10 mt-2 h-3 w-3 rounded-full border-2 " +
            (cancelada
              ? "border-muted bg-bg"
              : c.estado === "en-curso"
                ? "border-primary bg-primary"
                : c.estado === "finalizada"
                  ? "border-border bg-border"
                  : "border-border bg-surface")
          }
        />
        <span className="w-px flex-1 bg-border" />
      </div>

      {/* bloque de la clase: el nombre es el boton que abre la ficha; el clic en todo el bloque es un extra */}
      <div className="surface-card mb-3 min-w-0 flex-1 cursor-pointer p-4 transition-colors hover:bg-bg" onClick={() => onAbrir(c)}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onAbrir(c)
              }}
              aria-label={`Abrir ficha de ${c.clase} de las ${c.hora}`}
              className={"text-left font-heading text-base font-bold hover:underline " + (cancelada ? "text-muted line-through" : "")}
            >
              {c.clase}
            </button>
            <p className="dato text-xs text-muted">
              {c.coach} · {c.sala}
            </p>
          </div>
          <span className={"chip " + estadoChip[c.estado]}>{estadoLabel[c.estado]}</span>
        </div>

        {cancelada ? (
          <p className="mt-3 text-xs text-muted">
            <span className="dato">—</span> sin cupo · {c.ocupados} inscriptos para avisar
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 sm:flex-nowrap">
            <div className="order-1 flex w-20 shrink-0 items-baseline gap-1">
              <span className={"dato text-3xl font-bold " + (completa ? "text-danger" : cerrada ? "text-muted" : "text-fg")}>{c.ocupados}</span>
              <span className="dato text-base text-muted">/{c.cupo}</span>
            </div>
            <div className="order-3 w-full sm:order-2 sm:w-auto sm:flex-1">
              <div
                role="meter"
                aria-label={`${c.clase} ${c.hora}: ${c.ocupados} de ${c.cupo} lugares`}
                aria-valuemin={0}
                aria-valuemax={c.cupo}
                aria-valuenow={c.ocupados}
                className={"barra h-6 " + (completa ? "completa" : "")}
              >
                <div className={"barra-fill " + (cerrada ? "bg-border" : rellenoAforo[nivel])} style={{ transform: `scaleX(${p})` }} />
              </div>
            </div>
            <div className="order-2 ml-auto text-right sm:order-3 sm:ml-0 sm:w-32 sm:shrink-0">
              {cerrada ? (
                <span className="dato text-xs text-muted">asistencia final</span>
              ) : completa ? (
                <div className="space-y-1">
                  <span className="chip bg-danger/15 font-bold text-danger">COMPLETO</span>
                  {c.waitlist > 0 && <p className="dato text-xs text-danger">+{c.waitlist} waitlist</p>}
                </div>
              ) : (
                <span className={"chip " + chipAforo[nivel]}>{etiquetaAforo[nivel]}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </li>
  )
}

// Ficha de la clase: todos los datos de la fila, mas lo derivable (lugares libres, ocupacion).
function FichaClase({ c, onCerrar }: { c: ClaseAgenda | null; onCerrar: () => void }) {
  const [aviso, setAviso] = useState<string | null>(null)
  useEffect(() => setAviso(null), [c])

  const cerrada = !!c && (c.estado === "cancelada" || c.estado === "finalizada")
  const completa = !!c && estaCompleta(c.ocupados, c.cupo) && !cerrada
  const demo = (que: string) => setAviso(`Demo: no se guardó nada. ${que}`)

  return (
    <FichaLateral
      abierta={!!c}
      titulo={c?.clase ?? ""}
      subtitulo={c ? `${c.hora} – ${c.fin} · ${c.coach}` : undefined}
      onCerrar={onCerrar}
      acciones={
        c && (
          <>
            {c.estado === "cancelada" ? (
              <>
                <button type="button" className={botonPrimario} onClick={() => demo(`En el sistema real se avisaría a los ${c.ocupados} inscriptos.`)}>
                  Avisar a los {c.ocupados} inscriptos
                </button>
                <button type="button" className={botonSecundario} onClick={() => demo("En el sistema real se crearía la clase en otro horario.")}>
                  Reprogramar clase
                </button>
              </>
            ) : c.estado === "finalizada" ? (
              <button type="button" className={botonPrimario} onClick={() => demo("En el sistema real se crearía la misma clase para mañana.")}>
                Repetir mañana
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className={botonPrimario}
                  onClick={() => demo("En el sistema real se llama a reservar_clase, que respeta el cupo y devuelve reservada o lista de espera.")}
                >
                  {completa ? "Anotar en lista de espera" : "Reservar clase"}
                </button>
                {c.waitlist > 0 && (
                  <button
                    type="button"
                    className={botonSecundario}
                    onClick={() => demo(`En el sistema real se avisaría a los ${c.waitlist} de la lista de espera.`)}
                  >
                    Avisar a la lista de espera
                  </button>
                )}
                <button
                  type="button"
                  className={botonSecundario}
                  onClick={() => demo(`En el sistema real se cancelaría la clase y se avisaría a los ${c.ocupados} inscriptos.`)}
                >
                  Cancelar clase
                </button>
              </>
            )}
          </>
        )
      }
    >
      {c && (
        <>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            <DatoFicha etiqueta="Horario">
              <span className="dato">
                {c.hora} – {c.fin}
              </span>
            </DatoFicha>
            <DatoFicha etiqueta="Estado">
              <span className={"chip " + estadoChip[c.estado]}>{estadoLabel[c.estado]}</span>
            </DatoFicha>
            <DatoFicha etiqueta="Coach">{c.coach}</DatoFicha>
            <DatoFicha etiqueta="Sala">{c.sala}</DatoFicha>
            <DatoFicha etiqueta="Cupo">
              <span className="dato">{c.cupo}</span>
            </DatoFicha>
            <DatoFicha etiqueta={c.estado === "cancelada" ? "Inscriptos al cancelar" : c.estado === "finalizada" ? "Asistencia final" : "Inscriptos"}>
              <span className="dato">{c.ocupados}</span>
            </DatoFicha>
            <DatoFicha etiqueta="Lugares libres">
              <span className="dato">{cerrada ? "—" : Math.max(c.cupo - c.ocupados, 0)}</span>
            </DatoFicha>
            <DatoFicha etiqueta="Ocupación">
              <span className="dato">{cerrada ? "—" : `${Math.round(pct(c.ocupados, c.cupo) * 100)}%`}</span>
            </DatoFicha>
            <DatoFicha etiqueta={c.estado === "finalizada" ? "En lista de espera al cierre" : "Lista de espera"}>
              <span className="dato">{c.estado === "cancelada" ? "—" : c.waitlist}</span>
            </DatoFicha>
          </dl>
          <AvisoDemo texto={aviso} />
        </>
      )}
    </FichaLateral>
  )
}

export function AgendaPage() {
  const { data, error, cargando, reintentar } = useCarga(getClasesHoy)
  const [sel, setSel] = useState<ClaseAgenda | null>(null)

  const clases = data ?? []
  const activas = clases.filter((c) => c.estado !== "cancelada")
  const completas = clases.filter((c) => (c.estado === "programada" || c.estado === "en-curso") && estaCompleta(c.ocupados, c.cupo)).length
  const canceladas = clases.length - activas.length
  const ordenadas = [...clases].sort((a, b) => a.hora.localeCompare(b.hora))
  const dash = (n: number) => (cargando ? "—" : String(n))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Clases</h1>
        <div className="flex flex-wrap gap-2">
          <span className="chip bg-accent/15 text-accent">hoy · {dash(activas.length)} clases</span>
          <span className="chip bg-danger/15 text-danger">{dash(completas)} completas</span>
          {(cargando || canceladas > 0) && <span className="chip bg-subtle text-muted">
              {dash(canceladas)} {canceladas === 1 ? "cancelada" : "canceladas"}
            </span>}
        </div>
      </div>

      {error ? (
        <ErrorCarga onReintentar={reintentar} />
      ) : (
        <section aria-busy={cargando} aria-label="Clases de hoy ordenadas por hora" className="surface-card p-5">
          <LeyendaAforo className="mb-4" />
          {cargando ? (
            Array.from({ length: 6 }).map((_, i) => <Esqueleto key={i} className="mb-3 h-24" />)
          ) : (
            <ol>
              {ordenadas.map((c) => (
                <BloqueClase key={c.id} c={c} onAbrir={setSel} />
              ))}
            </ol>
          )}
        </section>
      )}

      <FichaClase c={sel} onCerrar={() => setSel(null)} />
    </div>
  )
}
