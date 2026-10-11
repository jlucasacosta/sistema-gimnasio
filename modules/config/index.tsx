"use client"
import { useId, useState } from "react"
import { ChevronDown } from "lucide-react"
import { theme } from "@/shell/theme"
import { etiquetaAforo, chipAforo, type NivelAforo } from "@/shell/aforo"
import { LeyendaAforo } from "@/shell/leyenda-aforo"
import { useCarga, ErrorCarga } from "@/shell/carga"
import { getConfigClub } from "./api"

// ACORDEON: secciones colapsables. Distinto de los paneles fijos de otros
// modulos: dentro del mismo sistema no se repite un arquetipo. Todo lo que se
// muestra sale de shell/theme.ts: un archivo muta el sistema entero.

function Fila({ label, value, swatch }: { label: string; value: string; swatch?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted">{label}</span>
      <span className="dato flex items-center gap-2 text-sm font-medium">
        {swatch && <span aria-hidden="true" className="h-4 w-4 rounded border border-border" style={{ background: value }} />}
        {value}
      </span>
    </div>
  )
}

function Seccion({ titulo, children, abierta }: { titulo: string; children: React.ReactNode; abierta?: boolean }) {
  const [open, setOpen] = useState(!!abierta)
  const id = useId()
  // Patron acordeon WAI-ARIA: el h2 contiene al boton (no al reves) y el boton expone su estado.
  return (
    <section className="surface-card overflow-hidden">
      <h2>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={id}
          className="flex min-h-11 w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-subtle"
        >
          <span className="font-heading text-sm font-bold uppercase tracking-widest">{titulo}</span>
          <ChevronDown
            size={18}
            strokeWidth={1.25}
            aria-hidden="true"
            className={"text-muted " + (open ? "rotate-180" : "")}
          />
        </button>
      </h2>
      {open && (
        <div id={id} role="region" aria-label={titulo} className="border-t border-border px-5 py-4">
          {children}
        </div>
      )}
    </section>
  )
}

const niveles: NivelAforo[] = ["espacio", "casi", "lleno"]

export function ConfigPage() {
  const c = theme.colors
  const { data, error, cargando, reintentar } = useCarga(getConfigClub)
  // Mientras llegan los datos (o si la carga falla) los valores del club llevan "—", nunca un cero falso.
  const dato = (v: string | number | undefined) => (v === undefined || cargando ? "—" : String(v))
  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Configuración</h1>

      {error && <ErrorCarga onReintentar={reintentar} />}

      <div aria-busy={cargando} className="space-y-3">
        <Seccion titulo="Marca" abierta>
          <Fila label="Nombre" value={theme.brand.name} />
          <Fila label="Títulos" value={theme.font.heading} />
          <Fila label="Cuerpo / dato" value={theme.font.body} />
        </Seccion>

        <Seccion titulo="Forma">
          <Fila label="Modo" value={theme.mode} />
          <Fila label="Navegación" value={theme.nav} />
          <Fila label="Elevación" value={theme.elevation} />
          <Fila label="Bordes" value={theme.radius} />
          <Fila label="Densidad" value={theme.density} />
          <Fila label="Chips" value={theme.badge} />
        </Seccion>

        <Seccion titulo="Ocupación (dominio)">
          <Fila label="Umbral casi lleno" value={`${Math.round(theme.aforo.casi * 100)}%`} />
          <Fila label="Umbral últimos lugares" value={`${Math.round(theme.aforo.lleno * 100)}%`} />
          <Fila label="Meta check-ins / día" value={String(theme.checkinObjetivo)} />
          <Fila label="Capacidad del club" value={dato(data?.cupo)} />
          <LeyendaAforo className="pt-3" />
          <p className="pt-2 text-xs text-muted">
            La ocupación de clases se pinta con estos umbrales. Cambiá el de «últimos lugares» y toda la app cambia cuando se pone en magenta.
          </p>
        </Seccion>

        <Seccion titulo="Paleta">
          <Fila label="Cobalto (fill)" value={c.primary} swatch />
          <Fila label="Volt-lime (logro)" value={c.accent} swatch />
          <Fila label="Espacio / cian" value={c.info} swatch />
          <Fila label="Casi lleno / volt" value={c.warning} swatch />
          <Fila label="Lleno-vencido / magenta" value={c.danger} swatch />
          <Fila label="Cobrado / teal" value={c.success} swatch />
        </Seccion>

        <Seccion titulo="Horarios y salas">
          <Fila label="Apertura" value={dato(data?.apertura)} />
          <Fila label="Cierre" value={dato(data?.cierre)} />
          <Fila label="Salas" value={dato(data?.salas)} />
        </Seccion>

        <Seccion titulo="Coaches">
          <Fila label="Activos" value={dato(data?.coachesActivos)} />
          <Fila label="Head coach" value={dato(data?.headCoach)} />
        </Seccion>

        <Seccion titulo="Integraciones">
          <Fila label="Cobros" value="mock (sin backend)" />
          <Fila label="WhatsApp" value="mock (sin backend)" />
          <Fila label="Molinete / check-in" value="mock (sin backend)" />
        </Seccion>

        <Seccion titulo="Estados">
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="chip bg-success/15 text-success">activo</span>
            <span className="chip bg-warning/15 text-warning">por vencer</span>
            <span className="chip bg-danger/15 text-danger">vencido</span>
            <span className="chip bg-info/15 text-info">congelado</span>
            {niveles.map((n) => (
              <span key={n} className={"chip " + chipAforo[n]}>
                {etiquetaAforo[n]}
              </span>
            ))}
            <span className="chip bg-danger/15 font-bold text-danger">COMPLETO</span>
          </div>
          <p className="pt-3 text-xs text-muted">Todo esto sale de shell/theme.ts. Cambiás un archivo y muta el sistema entero.</p>
        </Seccion>
      </div>
    </div>
  )
}
