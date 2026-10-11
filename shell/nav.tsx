"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { nav } from "./nav-config"
import { theme } from "./theme"

// Tres chasis sobre el mismo nav-config. La palanca `theme.nav` decide (sidebar).
// Iconos lucide-FINO: strokeWidth 1.25, linea atletica. El cobalto solo como
// FILL (pill activo), nunca como texto sobre near-black.
// Debajo de `md` la sidebar y el riel se reemplazan por una barra superior con
// scroll horizontal (mismos items): el chasis de escritorio no cambia.

const STROKE = 1.25

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

// --- sidebar: mostrador. Etiquetas siempre visibles, navegacion fija. ---
function Sidebar({ path }: { path: string }) {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-surface p-[var(--pad)] md:flex">
      <div className="mb-8 px-1 pt-1">
        <Marca />
      </div>
      <nav aria-label="Principal" className="space-y-1">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = path === href
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
      <div className="mt-auto px-3 pt-6 text-[10px] uppercase tracking-widest text-muted">demo · mock data</div>
    </aside>
  )
}

// --- topbar: consulta rapida. Pestañas arriba, lienzo ancho. ---
// `className` permite mostrarla solo en mobile (md:hidden) cuando el chasis es sidebar/rail.
function Topbar({ path, className = "" }: { path: string; className?: string }) {
  return (
    <header className={"sticky top-0 z-10 border-b border-border bg-surface " + className}>
      <div className="flex flex-col gap-1 px-[var(--pad)] py-2 md:flex-row md:items-center md:gap-8 md:py-3">
        <Marca />
        <nav aria-label="Principal" className="flex w-full items-center gap-1 overflow-x-auto md:w-auto md:flex-1">
          {nav.map(({ label, href, icon: Icon }) => {
            const active = path === href
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={
                  "flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 py-2 text-sm transition-colors " +
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
      </div>
    </header>
  )
}

// --- rail: solo iconos. Maxima superficie para el tablero. ---
function Rail({ path }: { path: string }) {
  return (
    <aside className="hidden w-16 shrink-0 flex-col items-center gap-2 border-r border-border bg-surface py-4 md:flex">
      <div className="mb-6">
        <Marca compact />
      </div>
      <nav aria-label="Principal" className="flex flex-col items-center gap-2">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = path === href
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
