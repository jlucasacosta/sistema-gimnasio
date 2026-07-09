"use client"
import { useEffect, useMemo, useState } from "react"
import {
  getAforoClub,
  getTermometro,
  getCurvaCheckins,
  getTicker,
  type AforoClub,
  type ClaseCupo,
  type CheckinHora,
  type TickerItem,
} from "./api"
import { theme } from "@/shell/theme"
import { nivelDeAforo, estaCompleta, pct, rellenoAforo, textoAforo, chipAforo } from "@/shell/aforo"

// Comando de recepcion. Hero-number de aforo arriba; el Termometro de Cupos
// full-width (estrella); la curva de check-ins (linea-area) al pie.

const tonoTicker: Record<TickerItem["tono"], string> = {
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  fg: "text-fg",
}

function Ticker({ items }: { items: TickerItem[] }) {
  if (!items.length) return <div className="h-14 animate-pulse rounded bg-subtle" />
  const tira = [...items, ...items]
  return (
    <div className="ticker-mask surface-card overflow-hidden py-3">
      <div className="ticker-track">
        {tira.map((t, i) => (
          <div key={i} className="flex shrink-0 items-baseline gap-2.5 border-r border-border px-7">
            <span className="text-[10px] uppercase tracking-widest text-muted">{t.label}</span>
            <span className={"dato text-2xl font-bold " + tonoTicker[t.tono]}>{t.valor}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- COMPONENTE ESTRELLA: Termometro de Cupos ----
// Una fila por clase del bloque actual. Contador hero + barra gorda (28px) cuyo
// relleno y color salen de shell/aforo.ts por umbral. Al tope: chip COMPLETO latiendo.
function FilaTermometro({ c }: { c: ClaseCupo }) {
  const nivel = nivelDeAforo(c.ocupados, c.cupo)
  const completa = estaCompleta(c.ocupados, c.cupo)
  const p = pct(c.ocupados, c.cupo)

  return (
    <div className="flex items-center gap-4 border-b border-border py-3 last:border-b-0">
      <div className="w-40 shrink-0">
        <p className="truncate font-heading text-sm font-bold">{c.clase}</p>
        <p className="dato truncate text-[11px] text-muted">
          {c.hora} · {c.coach}
        </p>
        <p className="truncate text-[10px] uppercase tracking-wider text-muted">{c.sala}</p>
      </div>

      <div className="flex w-24 shrink-0 items-baseline justify-end gap-1">
        <span className={"dato text-4xl font-bold " + (completa ? "text-danger" : "text-fg")}>{c.ocupados}</span>
        <span className="dato text-lg text-muted">/{c.cupo}</span>
      </div>

      <div className="flex-1">
        <div className={"barra h-7 " + (completa ? "completa" : "")}>
          <div className={"barra-fill " + rellenoAforo[nivel]} style={{ width: p * 100 + "%" }} />
        </div>
      </div>

      <div className="w-28 shrink-0 text-right">
        {completa ? (
          <div className="space-y-1">
            <span className="chip bg-danger/20 font-bold text-danger">COMPLETO</span>
            {c.waitlist > 0 && <p className="dato text-[11px] text-danger">+{c.waitlist} waitlist</p>}
          </div>
        ) : (
          <span className={"chip " + chipAforo[nivel]}>{Math.round(p * 100)}%</span>
        )}
      </div>
    </div>
  )
}

// ---- Linea-area: curva de check-ins por hora, SVG a mano (sin librerias) ----
function LineaCheckins({ curva }: { curva: CheckinHora[] }) {
  const W = 640
  const H = 160
  const pad = 8
  const max = Math.max(...curva.map((c) => c.checkins), 1)
  const stepX = (W - pad * 2) / (curva.length - 1)
  const puntos = curva.map((c, i) => ({
    x: pad + i * stepX,
    y: H - pad - (c.checkins / max) * (H - pad * 2),
    c,
  }))
  const linea = puntos.map((p, i) => (i === 0 ? "M" : "L") + p.x.toFixed(1) + " " + p.y.toFixed(1)).join(" ")
  const area = `${linea} L ${puntos[puntos.length - 1].x.toFixed(1)} ${H} L ${puntos[0].x.toFixed(1)} ${H} Z`
  const ahora = puntos.find((p) => p.c.ahora)

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H + 22}`} className="h-48 w-full min-w-[520px]" preserveAspectRatio="none">
        {/* zona bajo la curva: cobalto como FILL (nunca texto) */}
        <path d={area} fill="rgb(var(--primary) / 0.22)" />
        <path d={linea} fill="none" stroke="rgb(var(--accent))" strokeWidth={2.5} strokeLinejoin="round" />
        {ahora && (
          <g>
            <line x1={ahora.x} y1={pad} x2={ahora.x} y2={H} stroke="rgb(var(--accent) / 0.5)" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={ahora.x} cy={ahora.y} r={5} fill="rgb(var(--accent))" />
          </g>
        )}
        {puntos.map((p) => (
          <text key={p.c.hora} x={p.x} y={H + 16} textAnchor="middle" className="dato" fontSize={11} fill={p.c.ahora ? "rgb(var(--accent))" : "rgb(var(--muted))"}>
            {p.c.hora}
          </text>
        ))}
      </svg>
    </div>
  )
}

export function DashboardPage() {
  const [aforo, setAforo] = useState<AforoClub | null>(null)
  const [clases, setClases] = useState<ClaseCupo[]>([])
  const [curva, setCurva] = useState<CheckinHora[]>([])
  const [ticker, setTicker] = useState<TickerItem[]>([])

  useEffect(() => {
    getAforoClub().then(setAforo)
    getTermometro().then(setClases)
    getCurvaCheckins().then(setCurva)
    getTicker().then(setTicker)
  }, [])

  // Movimiento en vivo: cada 3.5s entra un socio a una clase con espacio.
  // Las barras crecen solas y una flipea a COMPLETO en camara (frame-firma).
  useEffect(() => {
    const t = setInterval(() => {
      setClases((prev) => {
        const candidatas = prev.filter((c) => c.ocupados < c.cupo)
        if (!candidatas.length) return prev
        const elegida = candidatas[Math.floor(Math.random() * candidatas.length)]
        return prev.map((c) => (c.id === elegida.id ? { ...c, ocupados: c.ocupados + 1 } : c))
      })
      setAforo((a) => (a && a.ocupados < a.cupo ? { ...a, ocupados: a.ocupados + 1 } : a))
    }, 3500)
    return () => clearInterval(t)
  }, [])

  const heroNivel = useMemo(() => (aforo ? nivelDeAforo(aforo.ocupados, aforo.cupo) : "espacio"), [aforo])
  const completas = clases.filter((c) => estaCompleta(c.ocupados, c.cupo)).length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Panel general</h1>
        <span className="chip bg-accent/15 text-accent">bloque 18:00 – 19:00</span>
      </div>

      <Ticker items={ticker} />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Hero-number: el aforo del club, gigante, respirando. UN numero manda. */}
        <div className="surface-card flex flex-col justify-center p-6">
          <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-muted">Ocupacion del club</h2>
          {aforo && (
            <>
              <div className="mt-3 flex items-baseline gap-2">
                <span className={"dato respira text-7xl font-bold " + textoAforo[heroNivel]}>{aforo.ocupados}</span>
                <span className="dato text-3xl text-muted">/{aforo.cupo}</span>
              </div>
              <div className="mt-4">
                <div className="barra h-2.5">
                  <div className={"barra-fill " + rellenoAforo[heroNivel]} style={{ width: pct(aforo.ocupados, aforo.cupo) * 100 + "%" }} />
                </div>
              </div>
              <span className="chip mt-4 self-start bg-success/15 text-success">+{aforo.delta}% vs ayer a esta hora</span>
            </>
          )}
        </div>

        {/* COMPONENTE ESTRELLA: Termometro de Cupos */}
        <section className="surface-card p-5 lg:col-span-2">
          <header className="mb-1 flex items-baseline justify-between">
            <h2 className="font-heading text-xs font-bold uppercase tracking-widest">Ocupacion de clases</h2>
            <span className="dato text-[11px] text-muted">
              {completas > 0 ? `${completas} completas` : "sin clases completas"}
            </span>
          </header>
          <div>
            {clases.length === 0
              ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="my-3 h-7 animate-pulse rounded bg-subtle" />)
              : clases.map((c) => <FilaTermometro key={c.id} c={c} />)}
          </div>
        </section>
      </div>

      {/* Linea-area: la curva del dia, con marcador "ahora". */}
      <section className="surface-card p-5">
        <header className="mb-4 flex items-baseline justify-between">
          <h2 className="font-heading text-xs font-bold uppercase tracking-widest">Check-ins por franja</h2>
          <span className="dato text-[11px] text-muted">
            meta <span className="text-fg">{theme.checkinObjetivo}</span>/dia
          </span>
        </header>
        {curva.length > 0 ? <LineaCheckins curva={curva} /> : <div className="h-48 animate-pulse rounded bg-subtle" />}
      </section>
    </div>
  )
}
