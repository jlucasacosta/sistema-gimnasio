// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// El dashboard es el COMANDO DE RECEPCION: aforo del club en vivo (hero-number),
// el Termometro de Cupos (estrella) y la curva de check-ins por hora (linea-area).
// Sin grilla de 4 stat-tiles (ver DISENO.md §9, componente eliminado).
// Data en ./data.json (solo lectura; F5 restaura).

import raw from "./data.json"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Hero-number: aforo del club ahora vs capacidad fisica.
export type AforoClub = { ocupados: number; cupo: number; delta: number }

// Cada clase del bloque actual = una fila del Termometro.
export type ClaseCupo = {
  id: string
  clase: string
  coach: string
  hora: string
  sala: string
  ocupados: number
  cupo: number
  waitlist: number
}

// Curva de check-ins por franja horaria (linea-area SVG).
export type CheckinHora = { hora: string; checkins: number; ahora: boolean }

export type TickerItem = {
  id: string
  label: string
  valor: string
  tono: "accent" | "success" | "warning" | "danger" | "info" | "fg"
}

export async function getAforoClub(): Promise<AforoClub> {
  await sleep(200)
  return structuredClone(raw.aforo) as AforoClub
}

// Bloque actual: 7 clases apiladas. Estados mezclados: una ya COMPLETA con
// waitlist, otras casi llenas, otras con espacio. Es lo que se graba.
export async function getTermometro(): Promise<ClaseCupo[]> {
  await sleep(280)
  return structuredClone(raw.termometro) as ClaseCupo[]
}

export async function getCurvaCheckins(): Promise<CheckinHora[]> {
  await sleep(300)
  return structuredClone(raw.curva) as CheckinHora[]
}

export async function getTicker(): Promise<TickerItem[]> {
  await sleep(250)
  return structuredClone(raw.ticker) as TickerItem[]
}
