"use client"
import { useEffect, useState } from "react"
import { getVentas, type Venta } from "./api"

const medioBadge: Record<Venta["medio"], string> = {
  efectivo: "bg-subtle text-fg",
  tarjeta: "bg-primary text-bg",
  "debito automatico": "bg-subtle text-accent",
}

export function VentasPage() {
  const [rows, setRows] = useState<Venta[]>([])
  useEffect(() => {
    getVentas().then(setRows)
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-semibold">Membresias</h1>
      <div className="overflow-hidden rounded-xl bg-surface shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-muted">
            <tr>
              <th className="p-4 font-medium">Fecha</th>
              <th className="p-4 font-medium">Socio</th>
              <th className="p-4 font-medium">Plan</th>
              <th className="p-4 font-medium">Medio</th>
              <th className="p-4 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.id} className="border-b border-border transition-colors last:border-0 hover:bg-subtle">
                <td className="p-4 text-muted">{v.fecha}</td>
                <td className="p-4 font-medium">{v.socio}</td>
                <td className="p-4 text-muted">{v.plan}</td>
                <td className="p-4">
                  <span className={"rounded-full px-2.5 py-0.5 text-xs " + medioBadge[v.medio]}>{v.medio}</span>
                </td>
                <td className="p-4 text-right font-semibold">{v.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
