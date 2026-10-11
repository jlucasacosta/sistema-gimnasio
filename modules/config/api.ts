// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// CONFIG del club: capacidad, horarios, salas y coaches. La capacidad (cupo) es la UNICA
// fuente del aforo: el dashboard la lee de aca (en el backend es club_config.cupo_club).
// Data en ./data.json (solo lectura; F5 restaura).

import raw from "./data.json"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export type ConfigClub = {
  cupo: number // capacidad fisica del club
  apertura: string
  cierre: string
  salas: string
  headCoach: string
  coachesActivos: number
}

export async function getConfigClub(): Promise<ConfigClub> {
  await sleep(200)
  return structuredClone(raw.club) as ConfigClub
}
