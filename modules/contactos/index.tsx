"use client"
import { useEffect, useState } from "react"
import { getContacts, type Contact } from "./api"

const badge: Record<Contact["status"], string> = {
  "al dia": "bg-success/15 text-success",
  nuevo: "bg-info/15 text-info",
  "por vencer": "bg-warning/15 text-warning",
  vencido: "bg-danger/15 text-danger",
}

const avatar: Record<Contact["status"], string> = {
  "al dia": "bg-success/15 text-success",
  nuevo: "bg-info/15 text-info",
  "por vencer": "bg-warning/15 text-warning",
  vencido: "bg-danger/15 text-danger",
}

const iniciales = (n: string) =>
  n
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")

export function ContactosPage() {
  const [rows, setRows] = useState<Contact[]>([])
  useEffect(() => {
    getContacts().then(setRows)
  }, [])

  const vencidos = rows.filter((r) => r.status === "vencido").length

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold">Socios</h1>
        <div className="flex gap-2">
          <span className="rounded-lg bg-surface px-3 py-1.5 text-sm shadow-sm">
            <span className="font-semibold">{rows.length}</span> <span className="text-muted">en total</span>
          </span>
          <span className="rounded-lg bg-surface px-3 py-1.5 text-sm shadow-sm">
            <span className="font-semibold text-danger">{vencidos}</span> <span className="text-muted">con cuota vencida</span>
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-surface shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-muted">
            <tr>
              <th className="p-4 font-medium">Nombre</th>
              <th className="p-4 font-medium">Telefono</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Plan</th>
              <th className="p-4 font-medium">Cuota</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border transition-colors last:border-0 hover:bg-subtle">
                <td className="p-4">
                  <span className="flex items-center gap-3">
                    <span
                      className={
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold " +
                        avatar[r.status]
                      }
                    >
                      {iniciales(r.name)}
                    </span>
                    <span className="font-medium">{r.name}</span>
                  </span>
                </td>
                <td className="p-4 text-muted">{r.phone}</td>
                <td className="p-4 text-muted">{r.email}</td>
                <td className="p-4 text-muted">{r.plan}</td>
                <td className="p-4">
                  <span className={"whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs " + badge[r.status]}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
