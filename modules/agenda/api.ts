// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// La AGENDA es la pantalla que manda: el riel de clases del dia como timeline
// vertical. Cada clase es un recipiente con capacidad dura, coach y sala.
// Ordena por HORA pero el ojo lee LLENADO (barra de aforo desde shell/aforo.ts).
// Data en ./data.json (solo lectura; F5 restaura).

import raw from "./data.json"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export type EstadoClase = "programada" | "en-curso" | "finalizada" | "cancelada"

export type ClaseAgenda = {
  id: string
  hora: string
  fin: string
  clase: string
  coach: string
  sala: string
  ocupados: number
  cupo: number
  waitlist: number
  estado: EstadoClase
}

// 19 clases de 06:00 a 21:00. Estados coherentes con la hora (ahora son ~18:35): las de la
// manana y la tarde ya finalizaron, 4 estan en curso, el resto programadas y una cancelada.
// Hay completas con waitlist y otras con espacio de sobra.
export async function getClasesHoy(): Promise<ClaseAgenda[]> {
  await sleep(300)
  return structuredClone(raw.clases) as ClaseAgenda[]
}
