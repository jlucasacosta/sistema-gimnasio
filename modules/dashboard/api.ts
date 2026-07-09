// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// El dashboard es el COMANDO DE RECEPCION: aforo del club en vivo (hero-number),
// el Termometro de Cupos (estrella) y la curva de check-ins por hora (linea-area).
// Sin grilla de 4 stat-tiles (ver DISENO.md §9, componente eliminado).

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
  return { ocupados: 84, cupo: 120, delta: 11 }
}

// Bloque actual: 7 clases apiladas. Estados mezclados: una ya COMPLETA con
// waitlist, otras casi llenas, otras con espacio. Es lo que se graba.
export async function getTermometro(): Promise<ClaseCupo[]> {
  await sleep(280)
  return [
    { id: "t1", clase: "Spinning Ride", coach: "Nadia Ferrer", hora: "18:00", sala: "Cycle · Sala C", ocupados: 21, cupo: 22, waitlist: 0 },
    { id: "t2", clase: "Funcional Metcon", coach: "Bruno Salas", hora: "18:00", sala: "Box · Sala A", ocupados: 18, cupo: 20, waitlist: 0 },
    { id: "t3", clase: "HIIT Express", coach: "Mara Quiroga", hora: "18:15", sala: "Sala B", ocupados: 15, cupo: 18, waitlist: 0 },
    { id: "t4", clase: "Boxeo Tecnico", coach: "Ivan Otero", hora: "18:30", sala: "Ring · Sala A", ocupados: 12, cupo: 16, waitlist: 0 },
    { id: "t5", clase: "Yoga Flow", coach: "Lucia Vega", hora: "18:30", sala: "Estudio", ocupados: 8, cupo: 20, waitlist: 0 },
    { id: "t6", clase: "Fuerza Pesada", coach: "Diego Roldan", hora: "18:45", sala: "Weight Room", ocupados: 13, cupo: 14, waitlist: 2 },
    { id: "t7", clase: "Pilates Reformer", coach: "Lucia Vega", hora: "19:00", sala: "Estudio", ocupados: 6, cupo: 12, waitlist: 0 },
  ]
}

export async function getCurvaCheckins(): Promise<CheckinHora[]> {
  await sleep(300)
  return [
    { hora: "06", checkins: 41, ahora: false },
    { hora: "08", checkins: 78, ahora: false },
    { hora: "10", checkins: 52, ahora: false },
    { hora: "12", checkins: 63, ahora: false },
    { hora: "14", checkins: 38, ahora: false },
    { hora: "16", checkins: 57, ahora: false },
    { hora: "18", checkins: 96, ahora: true },
    { hora: "20", checkins: 71, ahora: false },
    { hora: "22", checkins: 24, ahora: false },
  ]
}

export async function getTicker(): Promise<TickerItem[]> {
  await sleep(250)
  return [
    { id: "1", label: "Check-ins hoy", valor: "412", tono: "accent" },
    { id: "2", label: "Socios activos", valor: "1.284", tono: "fg" },
    { id: "3", label: "Clases hoy", valor: "19", tono: "info" },
    { id: "4", label: "No-shows", valor: "7", tono: "warning" },
    { id: "5", label: "Waitlist total", valor: "23", tono: "info" },
    { id: "6", label: "MRR", valor: "$ 4.86M", tono: "success" },
    { id: "7", label: "Debitos rechazados", valor: "9", tono: "danger" },
    { id: "8", label: "Ocupacion media", valor: "78%", tono: "accent" },
  ]
}
