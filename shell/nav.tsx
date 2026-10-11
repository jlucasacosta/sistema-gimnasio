"use client"
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { nav } from "./nav-config"
import { theme } from "./theme"

// Tres chasis sobre el mismo nav-config. La palanca `theme.nav` decide (sidebar).
// Iconos lucide-FINO: strokeWidth 1.25, linea atletica. El cobalto solo como
// FILL (pill activo), nunca como texto sobre near-black.
// Debajo de `md` la sidebar y el riel se reemplazan por una barra superior con
// scroll horizontal (mismos items): el chasis de escritorio no cambia.
// En la tira del celular: degradé en el borde donde queda contenido por scrollear y la
// seccion activa se centra sola. La sidebar queda fija (sticky + h-dvh) y lleva la cuenta demo.

const STROKE = 1.25

const esActivo = (path: string | null, href: string) => path === href || (!!path && path.startsWith(href + "/"))

function Marca({ compact = false }: { compact?: boolean }) {
  const iniciales = theme.brand.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
  if (compact) {
    return (
      <span aria-hidden="true" className="dato flex h-9 w-9 items-center justify-center rounded bg-primary text-sm font-bold text-fg">
        {iniciales}
      </span>
    )
  }
  return (
    <div className="flex items-center gap-2.5">
      <span aria-hidden="true" className="dato flex h-8 w-8 items-center justify-center rounded bg-primary text-xs font-bold text-fg">
        {iniciales}
      </span>
      <span className="font-heading text-sm font-bold uppercase tracking-wide">{theme.brand.name}</span>
    </div>
  )
}

// Pie del menu: usuario de la demo. No hay login real; "CD" = Cuenta Demo.
function Cuenta({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span
        role="img"
        aria-label={`Cuenta demo de ${theme.brand.name}`}
        className="dato flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-fg"
      >
        CD
      </span>
    )
  }
  return (
    <div className="flex items-center gap-3 border-t border-border px-3 pt-4">
      <span aria-hidden="true" className="dato flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-fg">
        CD
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{theme.brand.name}</p>
        <p className="text-xs text-muted">Cuenta demo</p>
      </div>
    </div>
  )
}

// --- sidebar: mostrador. Etiquetas siempre visibles, navegacion fija. ---
function Sidebar({ path }: { path: string | null }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col overflow-y-auto border-r border-border bg-surface p-[var(--pad)] md:flex">
      <div className="mb-8 px-1 pt-1">
        <Marca />
      </div>
      <nav aria-label="Principal" className="space-y-1">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = esActivo(path, href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={
                "flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors " +
                (active ? "bg-primary font-medium text-fg" : "text-muted hover:bg-subtle hover:text-fg")
              }
            >
              <Icon size={18} strokeWidth={STROKE} aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto pt-6">
        <Cuenta />
      </div>
    </aside>
  )
}

// --- topbar: consulta rapida. Pestañas arriba, lienzo ancho. ---
// `className` permite mostrarla solo en mobile (md:hidden) cuando el chasis es sidebar/rail.
function Topbar({ path, className = "" }: { path: string | null; className?: string }) {
  const tira = useRef<HTMLElement>(null)
  const [fade, setFade] = useState({ izq: false, der: false })

  const medir = useCallback(() => {
    const el = tira.current
    if (!el) return
    const izq = el.scrollLeft > 4
    const der = el.scrollWidth - el.clientWidth - el.scrollLeft > 4
    setFade((f) => (f.izq === izq && f.der === der ? f : { izq, der }))
  }, [])

  // Centra la seccion activa (solo si la tira desborda) y mide el degradé.
  useEffect(() => {
    const el = tira.current
    if (!el) return
    if (el.scrollWidth > el.clientWidth) {
      el.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({ inline: "center", block: "nearest" })
    }
    medir()
  }, [path, medir])

  useEffect(() => {
    window.addEventListener("resize", medir)
    return () => window.removeEventListener("resize", medir)
  }, [medir])

  // Degradé con mascara: solo en el borde donde queda contenido. Transparencia pura, sin colores.
  const borde = "2.5rem"
  const paradas = [
    fade.izq ? "transparent 0px" : "black 0px",
    `black ${fade.izq ? borde : "0px"}`,
    `black calc(100% - ${fade.der ? borde : "0px"})`,
    fade.der ? "transparent 100%" : "black 100%",
  ]
  const mascara = fade.izq || fade.der ? `linear-gradient(to right, ${paradas.join(", ")})` : undefined
  const estilo: CSSProperties = { WebkitMaskImage: mascara, maskImage: mascara }

  return (
    <header className={"sticky top-0 z-10 border-b border-border bg-surface " + className}>
      <div className="flex flex-col gap-1 px-[var(--pad)] py-2 md:flex-row md:items-center md:gap-8 md:py-3">
        <Marca />
        <nav
          ref={tira}
          onScroll={medir}
          style={estilo}
          aria-label="Principal"
          className="flex w-full items-center gap-1 overflow-x-auto [scrollbar-width:none] md:w-auto md:flex-1 [&::-webkit-scrollbar]:hidden"
        >
          {nav.map(({ label, href, icon: Icon }) => {
            const active = esActivo(path, href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={
                  "flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors " +
                  (active
                    ? "border-accent font-medium text-fg"
                    : "border-transparent text-muted hover:border-border hover:text-fg")
                }
              >
                <Icon size={16} strokeWidth={STROKE} aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="hidden shrink-0 md:block">
          <Cuenta compact />
        </div>
      </div>
    </header>
  )
}

// --- rail: solo iconos. Maxima superficie para el tablero. ---
function Rail({ path }: { path: string | null }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-16 shrink-0 flex-col items-center gap-2 overflow-y-auto border-r border-border bg-surface py-4 md:flex">
      <div className="mb-6">
        <Marca compact />
      </div>
      <nav aria-label="Principal" className="flex flex-col items-center gap-2">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = esActivo(path, href)
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={
                "group relative flex h-10 w-10 items-center justify-center rounded transition-colors " +
                (active ? "bg-primary text-fg" : "text-muted hover:bg-subtle hover:text-fg")
              }
            >
              <Icon size={20} strokeWidth={STROKE} aria-hidden="true" />
              <span className="pointer-events-none absolute left-12 z-20 hidden whitespace-nowrap rounded bg-fg px-2 py-1 text-xs text-bg group-hover:block group-focus-visible:block">
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto pt-4">
        <Cuenta compact />
      </div>
    </aside>
  )
}

export function Nav() {
  const path = usePathname()
  if (theme.nav === "topbar") return <Topbar path={path} />
  return (
    <>
      <Topbar path={path} className="md:hidden" />
      {theme.nav === "rail" ? <Rail path={path} /> : <Sidebar path={path} />}
    </>
  )
}
