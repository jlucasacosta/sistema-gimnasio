// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// La AGENDA es la pantalla que manda: el riel de clases del dia como timeline
// vertical. Cada clase es un recipiente con capacidad dura, coach y sala.
// Ordena por HORA pero el ojo lee LLENADO (barra de aforo desde shell/aforo.ts).

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export type EstadoClase = "programada" | "en-curso" | "cancelada"

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

// 19 clases de 06:00 a 21:00. Estados mezclados: en-curso, completas con
// waitlist, una cancelada, otras con espacio de sobra.
export async function getClasesHoy(): Promise<ClaseAgenda[]> {
  await sleep(300)
  return [
    { id: "c1", hora: "06:00", fin: "06:45", clase: "Early Grind", coach: "Bruno Salas", sala: "Box · Sala A", ocupados: 12, cupo: 16, waitlist: 0, estado: "programada" },
    { id: "c2", hora: "07:00", fin: "07:45", clase: "Spinning Ride", coach: "Nadia Ferrer", sala: "Cycle · Sala C", ocupados: 22, cupo: 22, waitlist: 3, estado: "programada" },
    { id: "c3", hora: "08:00", fin: "08:50", clase: "Fuerza Pesada", coach: "Diego Roldan", sala: "Weight Room", ocupados: 14, cupo: 14, waitlist: 1, estado: "programada" },
    { id: "c4", hora: "09:00", fin: "09:45", clase: "Yoga Flow", coach: "Lucia Vega", sala: "Estudio", ocupados: 7, cupo: 20, waitlist: 0, estado: "programada" },
    { id: "c5", hora: "10:00", fin: "10:45", clase: "HIIT Express", coach: "Mara Quiroga", sala: "Sala B", ocupados: 16, cupo: 18, waitlist: 0, estado: "programada" },
    { id: "c6", hora: "11:00", fin: "11:50", clase: "Pilates Reformer", coach: "Lucia Vega", sala: "Estudio", ocupados: 9, cupo: 12, waitlist: 0, estado: "programada" },
    { id: "c7", hora: "12:00", fin: "12:45", clase: "Lunch Metcon", coach: "Bruno Salas", sala: "Box · Sala A", ocupados: 13, cupo: 20, waitlist: 0, estado: "programada" },
    { id: "c8", hora: "13:00", fin: "13:45", clase: "Movilidad", coach: "Tomas Bianchi", sala: "Estudio", ocupados: 4, cupo: 16, waitlist: 0, estado: "cancelada" },
    { id: "c9", hora: "16:00", fin: "16:45", clase: "Boxeo Tecnico", coach: "Ivan Otero", sala: "Ring · Sala A", ocupados: 11, cupo: 16, waitlist: 0, estado: "programada" },
    { id: "c10", hora: "17:00", fin: "17:45", clase: "Cycle Power", coach: "Nadia Ferrer", sala: "Cycle · Sala C", ocupados: 19, cupo: 22, waitlist: 0, estado: "programada" },
    { id: "c11", hora: "18:00", fin: "18:45", clase: "Spinning Ride", coach: "Nadia Ferrer", sala: "Cycle · Sala C", ocupados: 21, cupo: 22, waitlist: 0, estado: "en-curso" },
    { id: "c12", hora: "18:00", fin: "18:50", clase: "Funcional Metcon", coach: "Bruno Salas", sala: "Box · Sala A", ocupados: 18, cupo: 20, waitlist: 0, estado: "en-curso" },
    { id: "c13", hora: "18:30", fin: "19:15", clase: "Boxeo Tecnico", coach: "Ivan Otero", sala: "Ring · Sala A", ocupados: 12, cupo: 16, waitlist: 0, estado: "programada" },
    { id: "c14", hora: "18:30", fin: "19:20", clase: "Yoga Flow", coach: "Lucia Vega", sala: "Estudio", ocupados: 8, cupo: 20, waitlist: 0, estado: "programada" },
    { id: "c15", hora: "18:45", fin: "19:30", clase: "Fuerza Pesada", coach: "Diego Roldan", sala: "Weight Room", ocupados: 13, cupo: 14, waitlist: 2, estado: "programada" },
    { id: "c16", hora: "19:00", fin: "19:45", clase: "HIIT Express", coach: "Mara Quiroga", sala: "Sala B", ocupados: 17, cupo: 18, waitlist: 0, estado: "programada" },
    { id: "c17", hora: "19:30", fin: "20:15", clase: "Core & Abs", coach: "Tomas Bianchi", sala: "Sala B", ocupados: 10, cupo: 18, waitlist: 0, estado: "programada" },
    { id: "c18", hora: "20:00", fin: "20:45", clase: "Cycle Power", coach: "Nadia Ferrer", sala: "Cycle · Sala C", ocupados: 22, cupo: 22, waitlist: 5, estado: "programada" },
    { id: "c19", hora: "21:00", fin: "21:45", clase: "Stretch & Recover", coach: "Lucia Vega", sala: "Estudio", ocupados: 6, cupo: 20, waitlist: 0, estado: "programada" },
  ]
}
