// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// VENTAS (membresias) = cola de vencimientos y recupero de morosos.
// Arquetipo lista-ticket: cada fila es un comprobante monoespaciado con estado
// de cobro. Ordenable por urgencia (dias para vencer). Se mira 3 veces al dia.
// Data en ./data.json (solo lectura; F5 restaura).

import raw from "./data.json"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export type EstadoMembresia = "activo" | "por-vencer" | "vencido" | "congelado"
export type EstadoCobro = "cobrado" | "pendiente" | "rechazado"

export type Ticket = {
  id: string
  socio: string
  plan: string
  monto: number // MRR mensual, en pesos (0 si esta congelada: no se cobra)
  dias: number | null // dias para vencer (negativo = vencido hace X). null si esta congelada
  estado: EstadoMembresia
  cobro: EstadoCobro | null // null si esta congelada: no hay cobro en curso
  descongela?: string // solo congeladas: cuando se reactiva ("29 jul")
}

// 30 membresias (las de los 30 socios). Estados mezclados: debitos rechazados, cuotas vencidas,
// congelados y por vencer. La bandeja se ve como un dia real de cobranza.
export async function getMembresias(): Promise<Ticket[]> {
  await sleep(300)
  return structuredClone(raw.membresias) as Ticket[]
}
