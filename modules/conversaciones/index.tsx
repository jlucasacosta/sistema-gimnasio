"use client"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { Send } from "lucide-react"
import { getThreads, getMessages, type Thread, type Message } from "./api"
import { useCarga, Esqueleto, ErrorCarga } from "@/shell/carga"
import { AvisoDemo } from "@/shell/ficha-lateral"

// Master-detail: bandeja de consultas de socios. Estados en pill, como todo
// el sistema. El cobalto solo como fill (burbuja propia), nunca como texto.
// El hilo ya es el detalle: no abre ficha. Lo que se escribe vive solo en pantalla (F5 lo borra).

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

// Una conversacion abierta. Se remonta al cambiar de hilo (key), asi cada hilo tiene su propia
// carga, su propio error y sus propios mensajes escritos en la demo.
function Conversacion({ thread }: { thread: Thread }) {
  const { data, error, cargando, reintentar } = useCarga(() => getMessages(thread.id))
  const [nuevos, setNuevos] = useState<Message[]>([])
  const [texto, setTexto] = useState("")
  const [aviso, setAviso] = useState<string | null>(null)
  const log = useRef<HTMLDivElement>(null)

  const msgs = [...(data ?? []), ...nuevos]

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight
  }, [msgs.length])

  function enviar(e: FormEvent) {
    e.preventDefault()
    const limpio = texto.trim()
    if (!limpio) return
    setNuevos((n) => [...n, { id: `local-${n.length + 1}`, from: "vos", text: limpio, time: "ahora" }])
    setTexto("")
    setAviso("Demo: no se guardó nada. El mensaje no sale a ningún lado y desaparece al refrescar.")
  }

  return (
    <div className="surface-card flex min-h-[28rem] min-w-0 flex-1 flex-col overflow-hidden md:min-h-0">
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <span aria-hidden="true" className={"dato flex h-10 w-10 items-center justify-center rounded font-bold " + tintOf(thread.id)}>
          {iniciales(thread.name)}
        </span>
        <div>
          <p className="font-heading font-bold">{thread.name}</p>
          <p className="text-xs text-muted">Último mensaje: {thread.time}</p>
        </div>
      </div>
      {error ? (
        <div className="p-4">
          <ErrorCarga onReintentar={reintentar} />
        </div>
      ) : (
        <div
          ref={log}
          role="log"
          tabIndex={0}
          aria-busy={cargando}
          aria-label={`Mensajes con ${thread.name}`}
          className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 md:p-6"
        >
          {cargando
            ? [0, 1, 2, 3].map((i) => <Esqueleto key={i} className={"h-12 max-w-[70%] " + (i % 2 ? "ml-auto" : "")} />)
            : msgs.map((m) => (
                <div
                  key={m.id}
                  className={
                    "max-w-[85%] rounded px-4 py-2 text-sm md:max-w-[70%] " + (m.from === "vos" ? "ml-auto bg-primary text-fg" : "bg-subtle")
                  }
                >
                  {m.text}
                  <span className={"dato mt-1 block text-xs " + (m.from === "vos" ? "text-fg/85" : "text-muted")}>{m.time}</span>
                </div>
              ))}
        </div>
      )}
      <form onSubmit={enviar} className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <label htmlFor="mensaje" className="sr-only">
            Escribir un mensaje
          </label>
          <input
            id="mensaje"
            autoComplete="off"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribí un mensaje..."
            className="w-full rounded border border-muted bg-subtle px-4 py-2.5 text-sm placeholder:text-muted"
          />
          <button
            type="submit"
            aria-label="Enviar mensaje"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-primary text-fg transition-opacity hover:opacity-90"
          >
            <Send size={18} strokeWidth={1.25} aria-hidden="true" />
          </button>
        </div>
        <AvisoDemo texto={aviso} />
      </form>
    </div>
  )
}

export function ConversacionesPage() {
  const { data, error, cargando, reintentar } = useCarga(getThreads)
  const [active, setActive] = useState<string | null>(null)

  const threads = data ?? []
  useEffect(() => {
    if (data && active === null) setActive(data[0]?.id ?? null)
  }, [data, active])

  const actual = threads.find((t) => t.id === active)

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">Conversaciones</h1>

      {error ? (
        <ErrorCarga onReintentar={reintentar} />
      ) : (
        /* Mobile: lista arriba (alto acotado) y conversacion abajo. Desde md: master-detail lado a lado. */
        <div className="flex flex-col gap-4 md:h-[calc(100vh-8rem)] md:flex-row">
          <div aria-busy={cargando} className="surface-card max-h-64 w-full shrink-0 overflow-y-auto p-2 md:max-h-none md:w-80">
            {cargando
              ? Array.from({ length: 6 }).map((_, i) => <Esqueleto key={i} className="m-1 h-16" />)
              : threads.map((t) => (
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
                    <span aria-hidden="true" className={"dato flex h-10 w-10 shrink-0 items-center justify-center rounded font-bold " + tintOf(t.id)}>
                      {iniciales(t.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-heading text-sm font-bold">{t.name}</p>
                      <p className="truncate text-xs text-muted">{t.last}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="dato text-xs text-muted">{t.time}</span>
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

          {actual ? (
            <Conversacion key={actual.id} thread={actual} />
          ) : (
            <div className="surface-card flex min-h-[28rem] min-w-0 flex-1 flex-col gap-3 p-6 md:min-h-0" aria-busy={cargando}>
              {cargando && [0, 1, 2].map((i) => <Esqueleto key={i} className={"h-12 max-w-[70%] " + (i % 2 ? "ml-auto" : "")} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
