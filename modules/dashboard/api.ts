// PATRON MOCK. Misma firma que la query real. Reetiquetado para gimnasio.
export type Kpi = { label: string; value: string; delta: number }
export type SalesPoint = { label: string; value: number }
export type Activity = { id: string; text: string; time: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getKpis(): Promise<Kpi[]> {
  await sleep(300)
  return [
    { label: "Socios activos", value: "412", delta: 6 },
    { label: "Check-ins hoy", value: "184", delta: 13 },
    { label: "Cuota promedio", value: "$ 18.500", delta: 4 },
    { label: "Bajas del mes", value: "9", delta: -3 },
  ]
}

export async function getSales(): Promise<SalesPoint[]> {
  await sleep(300)
  return [
    { label: "Lun", value: 196 },
    { label: "Mar", value: 174 },
    { label: "Mie", value: 205 },
    { label: "Jue", value: 168 },
    { label: "Vie", value: 221 },
    { label: "Sab", value: 132 },
    { label: "Dom", value: 61 },
  ]
}

export async function getActivity(): Promise<Activity[]> {
  await sleep(300)
  return [
    { id: "1", text: "Nueva alta: plan Full Anual (12 meses)", time: "hace 6 min" },
    { id: "2", text: "Clase de Funcional 19:00 completo (20/20)", time: "hace 32 min" },
    { id: "3", text: "Cuota vencida: recordatorio enviado a 7 socios", time: "hace 2 h" },
    { id: "4", text: "Coach Vera cargo la rutina de fuerza del bloque 3", time: "hace 4 h" },
  ]
}
