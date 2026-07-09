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
      <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Bandeja</h1>

      <div className="flex h-[calc(100vh-8rem)] gap-4">
        <div className="surface-card w-80 shrink-0 overflow-y-auto p-2">
          {threads.map((t) => (
            <button
              key={t.id}
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
                {t.unread > 0 && <span className="chip dato bg-accent px-1.5 font-bold text-bg">{t.unread}</span>}
              </div>
            </button>
          ))}
        </div>

        <div className="surface-card flex flex-1 flex-col overflow-hidden">
          {actual && (
            <div className="flex items-center gap-3 border-b border-border px-6 py-4">
              <span className={"dato flex h-10 w-10 items-center justify-center rounded font-bold " + tintOf(actual.id)}>
                {iniciales(actual.name)}
              </span>
              <div>
                <p className="font-heading font-bold">{actual.name}</p>
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  en linea
                </p>
              </div>
            </div>
          )}
          <div className="flex-1 space-y-3 overflow-y-auto p-6">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={
                  "max-w-[70%] rounded px-4 py-2 text-sm " + (m.from === "vos" ? "ml-auto bg-primary text-fg" : "bg-subtle")
                }
              >
                {m.text}
                <span className="dato mt-1 block text-[11px] opacity-60">{m.time}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-border p-4">
            <input
              placeholder="Escribi un mensaje..."
              className="w-full rounded bg-subtle px-4 py-2.5 text-sm outline-none"
            />
            <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary text-fg transition-opacity hover:opacity-90">
              <Send size={18} strokeWidth={1.25} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
