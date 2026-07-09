// PATRON MOCK. Misma firma que la query real. Reetiquetado para gimnasio.
export type Tone = "primary" | "accent" | "success" | "warning" | "danger" | "info"
export type Kpi = { label: string; value: string; delta: number; tone: Tone }
export type SalesPoint = { label: string; value: number }
export type Activity = { id: string; text: string; time: string; tone: Tone }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getKpis(): Promise<Kpi[]> {
  await sleep(300)
  return [
    { label: "Socios activos", value: "412", delta: 6, tone: "primary" },
    { label: "Check-ins hoy", value: "184", delta: 13, tone: "info" },
    { label: "Cuota promedio", value: "$ 18.500", delta: 4, tone: "success" },
    { label: "Bajas del mes", value: "9", delta: -3, tone: "danger" },
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
    { id: "1", text: "Nueva alta: Camila Duarte tomo el plan Full Anual", time: "hace 6 min", tone: "success" },
    { id: "2", text: "Clase de Funcional 19:00 completo (20/20)", time: "hace 32 min", tone: "info" },
    { id: "3", text: "Boxeo 18:30 cancelado: el coach aviso por lesion", time: "hace 48 min", tone: "danger" },
    { id: "4", text: "Cuota vencida: recordatorio enviado a 7 socios", time: "hace 1 h", tone: "warning" },
    { id: "5", text: "Coach Vera cargo la rutina de fuerza del bloque 3", time: "hace 2 h", tone: "primary" },
    { id: "6", text: "Debito automatico acreditado: 23 membresias", time: "hace 3 h", tone: "success" },
    { id: "7", text: "Renata Villalba pidio congelar el plan 2 semanas", time: "hace 4 h", tone: "warning" },
    { id: "8", text: "Se libero 1 cupo en Spinning 08:30", time: "hace 5 h", tone: "info" },
    { id: "9", text: "Reseña nueva: 5 estrellas por la sala de pesas", time: "hace 6 h", tone: "accent" },
    { id: "10", text: "Baja confirmada: Tomas Escalante (Full mensual)", time: "hace 8 h", tone: "danger" },
    { id: "11", text: "Stock bajo: quedan 4 bandas de resistencia", time: "ayer", tone: "warning" },
    { id: "12", text: "Nueva clase publicada: Core & abdomen 20:15", time: "ayer", tone: "primary" },
  ]
}
