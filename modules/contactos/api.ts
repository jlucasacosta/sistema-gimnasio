// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// CONTACTOS (socios) = el roster. Recepcion escanea/ordena cientos de socios
// por estado y vencimiento. Tabla densa + barra de busqueda dominante arriba.
// Emails 100% ficticios, patron VARIADO (5 proveedores). Telefonos variados.
// Data en ./data.json (solo lectura; F5 restaura).

import raw from "./data.json"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export type EstadoSocio = "activo" | "por-vencer" | "vencido" | "congelado"

export type Socio = {
  id: string
  nombre: string
  documento: string
  plan: string
  estado: EstadoSocio
  ultimoCheckin: string
  vencimiento: string | null // null si la membresia esta congelada: no hay vencimiento corriendo
  descongela?: string // solo congelados: cuando se reactiva ("29 jul")
  email: string
  telefono: string
}

export async function getSocios(): Promise<Socio[]> {
  await sleep(300)
  return structuredClone(raw.socios) as Socio[]
}
