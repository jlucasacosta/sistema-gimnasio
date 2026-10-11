"use client"
import { useEffect, useState } from "react"
import { Send } from "lucide-react"
import { getThreads, getMessages, type Thread, type Message } from "./api"

// Master-detail: bandeja de consultas de socios. Estados en pill, como todo
// el sistema. El cobalto solo como fill (burbuja propia), nunca como texto.

const iniciales = (n: string) =>
  n
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")

const tints = [
  "bg-info/15 text-info",
  "bg-success/15 text-success",
  "bg-accent/15 text-accent",
  "bg-warning/15 text-warning",
  "bg-danger/15 text-danger",
]
const tintOf = (id: string) => tints[Number(id) % tints.length]

export function ConversacionesPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [msgs, setMsgs] = useState<Message[]>([])

  useEffect(() => {
    getThreads().then((t) => {
      setThreads(t)
      setActive(t[0]?.id ?? null)
    })
  }, [])

  useEffect(() => {
    if (active) getMessages(active).then(setMsgs)
  }, [active])

  const actual = threads.find((t) => t.id === active)

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Conversaciones</h1>

      {/* Mobile: lista arriba (alto acotado) y conversacion abajo. Desde md: master-detail lado a lado. */}
      <div className="flex flex-col gap-4 md:h-[calc(100vh-8rem)] md:flex-row">
        <div className="surface-card max-h-64 w-full shrink-0 overflow-y-auto p-2 md:max-h-none md:w-80">
          {threads.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-current={active === t.id ? "true" : undefined}
              onClick={() => setActive(t.id)}
              className={
                "flex w-full items-start gap-3 rounded p-3 text-left transition-colors " +
                (active === t.id ? "bg-subtle" : "hover:bg-subtle")
              }
            >
              <span className={"dato flex h-10 w-10 shrink-0 items-center justify-center rounded font-bold " + tintOf(t.id)}>
                {iniciales(t.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-sm font-bold">{t.name}</p>
                <p className="truncate text-xs text-muted">{t.last}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="dato text-[11px] text-muted">{t.time}</span>
                {t.unread > 0 && (
                  <span className="chip dato bg-accent px-1.5 font-bold text-bg">
                    {t.unread}
                    <span className="sr-only"> sin leer</span>
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="surface-card flex min-h-[28rem] min-w-0 flex-1 flex-col overflow-hidden md:min-h-0">
          {actual && (
            <div className="flex items-center gap-3 border-b border-border px-6 py-4">
              <span className={"dato flex h-10 w-10 items-center justify-center rounded font-bold " + tintOf(actual.id)}>
                {iniciales(actual.name)}
              </span>
              <div>
                <p className="font-heading font-bold">{actual.name}</p>
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-success" />
                  en linea
                </p>
              </div>
            </div>
          )}
          <div
            role="log"
            tabIndex={0}
            aria-label={actual ? `Mensajes con ${actual.name}` : "Mensajes"}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 md:p-6"
          >
            {msgs.map((m) => (
              <div
                key={m.id}
                className={
                  "max-w-[85%] rounded px-4 py-2 text-sm md:max-w-[70%] " + (m.from === "vos" ? "ml-auto bg-primary text-fg" : "bg-subtle")
                }
              >
                {m.text}
                <span className={"dato mt-1 block text-[11px] " + (m.from === "vos" ? "text-fg/85" : "text-muted")}>{m.time}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-border p-4">
            <label htmlFor="mensaje" className="sr-only">
              Escribir un mensaje
            </label>
            <input
              id="mensaje"
              autoComplete="off"
              placeholder="Escribi un mensaje..."
              className="w-full rounded border border-muted bg-subtle px-4 py-2.5 text-sm placeholder:text-muted"
            />
            <button
              type="button"
              aria-label="Enviar mensaje"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-primary text-fg transition-opacity hover:opacity-90"
            >
              <Send size={18} strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
