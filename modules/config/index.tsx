"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { theme } from "@/shell/theme"

// ACORDEON: secciones colapsables. Distinto de los paneles fijos de otros
// modulos: dentro del mismo sistema no se repite un arquetipo. Todo lo que se
// muestra sale de shell/theme.ts: un archivo muta el sistema entero.

function Fila({ label, value, swatch }: { label: string; value: string; swatch?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted">{label}</span>
      <span className="dato flex items-center gap-2 text-sm font-medium">
        {swatch && <span className="h-4 w-4 rounded border border-border" style={{ background: value }} />}
        {value}
      </span>
    </div>
  )
}

function Seccion({ titulo, children, abierta }: { titulo: string; children: React.ReactNode; abierta?: boolean }) {
  const [open, setOpen] = useState(!!abierta)
  return (
    <section className="surface-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-subtle"
      >
        <h2 className="font-heading text-sm font-bold uppercase tracking-widest">{titulo}</h2>
        <ChevronDown size={18} strokeWidth={1.25} className={"text-muted transition-transform " + (open ? "rotate-180" : "")} />
      </button>
      {open && <div className="border-t border-border px-5 py-4">{children}</div>}
    </section>
  )
}

export function ConfigPage() {
  const c = theme.colors
  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Configuracion</h1>

      <div className="space-y-3">
        <Seccion titulo="Marca" abierta>
          <Fila label="Nombre" value={theme.brand.name} />
          <Fila label="Titulos" value={theme.font.heading} />
          <Fila label="Cuerpo / dato" value={theme.font.body} />
        </Seccion>

        <Seccion titulo="Forma">
          <Fila label="Modo" value={theme.mode} />
          <Fila label="Navegacion" value={theme.nav} />
          <Fila label="Elevacion" value={theme.elevation} />
          <Fila label="Bordes" value={theme.radius} />
          <Fila label="Densidad" value={theme.density} />
          <Fila label="Chips" value={theme.badge} />
        </Seccion>

        <Seccion titulo="Ocupacion (dominio)">
          <Fila label="Umbral casi lleno" value={`${Math.round(theme.aforo.casi * 100)}%`} />
          <Fila label="Umbral completo" value={`${Math.round(theme.aforo.lleno * 100)}%`} />
          <Fila label="Meta check-ins / dia" value={String(theme.checkinObjetivo)} />
          <Fila label="Capacidad del club" value={String(theme.cupoClub)} />
          <p className="pt-2 text-xs text-muted">
            La Ocupacion de clases se pinta con estos umbrales. Cambia "completo" y toda la app cambia cuando se pone en magenta.
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
          <Fila label="Apertura" value="06:00" />
          <Fila label="Cierre" value="22:00" />
          <Fila label="Salas" value="Box · Cycle · Estudio · Weight" />
        </Seccion>

        <Seccion titulo="Coaches">
          <Fila label="Activos" value="7" />
          <Fila label="Head coach" value="Nadia Ferrer" />
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
            <span className="chip bg-accent/15 text-accent">casi lleno</span>
            <span className="chip bg-danger/20 font-bold text-danger">COMPLETO</span>
          </div>
          <p className="pt-3 text-xs text-muted">Todo esto sale de shell/theme.ts. Cambias un archivo y muta el sistema entero.</p>
        </Seccion>
      </div>
    </div>
  )
}
