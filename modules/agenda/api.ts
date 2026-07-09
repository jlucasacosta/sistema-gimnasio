// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
export type Clase = {
  id: string
  clase: string
  hora: string
  coach: string
  sala: string
  inscriptos: number
  cupo: number
  estado: "abierta" | "completa" | "cancelada"
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getClases(): Promise<Clase[]> {
  await sleep(300)
  return [
    { id: "1", clase: "Funcional", hora: "06:30", coach: "Vera Quiroga", sala: "Sala A", inscriptos: 12, cupo: 20, estado: "abierta" },
    { id: "2", clase: "Spinning", hora: "07:00", coach: "Dante Peralta", sala: "Sala Ciclo", inscriptos: 24, cupo: 24, estado: "completa" },
    { id: "3", clase: "Fuerza guiada", hora: "07:45", coach: "Vera Quiroga", sala: "Sala Pesas", inscriptos: 9, cupo: 14, estado: "abierta" },
    { id: "4", clase: "HIIT express", hora: "08:30", coach: "Marcos Ferrero", sala: "Sala A", inscriptos: 18, cupo: 20, estado: "abierta" },
    { id: "5", clase: "Yoga movilidad", hora: "09:15", coach: "Nadia Fontana", sala: "Sala B", inscriptos: 11, cupo: 18, estado: "abierta" },
    { id: "6", clase: "Pilates reformer", hora: "10:00", coach: "Nadia Fontana", sala: "Sala B", inscriptos: 8, cupo: 8, estado: "completa" },
    { id: "7", clase: "Crossfit WOD", hora: "10:45", coach: "Marcos Ferrero", sala: "Sala Box", inscriptos: 15, cupo: 18, estado: "abierta" },
    { id: "8", clase: "Fuerza guiada", hora: "11:30", coach: "Ivo Mansilla", sala: "Sala Pesas", inscriptos: 6, cupo: 14, estado: "abierta" },
    { id: "9", clase: "Zumba", hora: "12:15", coach: "Lorena Bazan", sala: "Sala B", inscriptos: 22, cupo: 25, estado: "abierta" },
    { id: "10", clase: "Spinning", hora: "13:00", coach: "Dante Peralta", sala: "Sala Ciclo", inscriptos: 5, cupo: 24, estado: "cancelada" },
    { id: "11", clase: "Funcional", hora: "15:30", coach: "Vera Quiroga", sala: "Sala A", inscriptos: 14, cupo: 20, estado: "abierta" },
    { id: "12", clase: "Boxeo", hora: "16:15", coach: "Marcos Ferrero", sala: "Sala Ring", inscriptos: 13, cupo: 16, estado: "abierta" },
    { id: "13", clase: "Yoga movilidad", hora: "17:30", coach: "Nadia Fontana", sala: "Sala B", inscriptos: 18, cupo: 18, estado: "completa" },
    { id: "14", clase: "Boxeo", hora: "18:30", coach: "Ivo Mansilla", sala: "Sala Ring", inscriptos: 6, cupo: 16, estado: "cancelada" },
    { id: "15", clase: "Funcional", hora: "19:00", coach: "Dante Peralta", sala: "Sala A", inscriptos: 20, cupo: 20, estado: "completa" },
    { id: "16", clase: "Crossfit WOD", hora: "19:45", coach: "Marcos Ferrero", sala: "Sala Box", inscriptos: 17, cupo: 18, estado: "abierta" },
    { id: "17", clase: "Spinning", hora: "20:00", coach: "Lorena Bazan", sala: "Sala Ciclo", inscriptos: 21, cupo: 24, estado: "abierta" },
    { id: "18", clase: "Core & abdomen", hora: "20:15", coach: "Nadia Fontana", sala: "Sala B", inscriptos: 13, cupo: 18, estado: "abierta" },
    { id: "19", clase: "Fuerza guiada", hora: "21:00", coach: "Ivo Mansilla", sala: "Sala Pesas", inscriptos: 10, cupo: 14, estado: "abierta" },
    { id: "20", clase: "Stretching", hora: "21:45", coach: "Vera Quiroga", sala: "Sala B", inscriptos: 7, cupo: 18, estado: "abierta" },
  ]
}
