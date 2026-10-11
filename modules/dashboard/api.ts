// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// El dashboard es el COMANDO DE RECEPCION: aforo del club en vivo (hero-number),
// el Termometro de Cupos (estrella) y la curva de check-ins por hora (linea-area).
// Sin grilla de 4 stat-tiles (ver DISENO.md §9, componente eliminado).
// Data en ./data.json (solo lectura; F5 restaura). Dos datos NO se duplican aca:
//   - la capacidad del club sale de config (club_config.cupo_club en el backend),
//   - las clases del Termometro salen de la agenda (las del bloque horario de data.json).

import raw from "./data.json"
import agenda from "../agenda/data.json"
import config from "../config/data.json"

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
  return { ...structuredClone(raw.aforo), cupo: config.club.cupo }
}

// Clases que empiezan dentro del bloque (ahora y proximas), sin las canceladas ni las ya terminadas.
// Estados mezclados: una COMPLETA con waitlist, otras casi llenas, otras con espacio.
export async function getTermometro(): Promise<ClaseCupo[]> {
  await sleep(280)
  return agenda.clases
    .filter(
      (c) =>
        (c.estado === "programada" || c.estado === "en-curso") &&
        c.hora >= raw.bloque.desde &&
        c.hora <= raw.bloque.hasta,
    )
    .map(({ id, clase, coach, hora, sala, ocupados, cupo, waitlist }) => ({ id, clase, coach, hora, sala, ocupados, cupo, waitlist }))
}

export async function getCurvaCheckins(): Promise<CheckinHora[]> {
  await sleep(300)
  return structuredClone(raw.curva) as CheckinHora[]
}

// Telemetria del dia: lista estatica de cifras (no se desplaza sola).
export async function getTicker(): Promise<TickerItem[]> {
  await sleep(250)
  return structuredClone(raw.ticker) as TickerItem[]
}
