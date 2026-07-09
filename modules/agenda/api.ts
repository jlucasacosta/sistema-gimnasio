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
    { id: "1", clase: "Funcional", hora: "07:00", coach: "Vera Quiroga", sala: "Sala A", inscriptos: 16, cupo: 20, estado: "abierta" },
    { id: "2", clase: "Spinning", hora: "08:30", coach: "Dante Peralta", sala: "Sala Ciclo", inscriptos: 24, cupo: 24, estado: "completa" },
    { id: "3", clase: "Fuerza guiada", hora: "10:00", coach: "Vera Quiroga", sala: "Sala Pesas", inscriptos: 9, cupo: 14, estado: "abierta" },
    { id: "4", clase: "Yoga movilidad", hora: "17:30", coach: "Nadia Fontana", sala: "Sala B", inscriptos: 11, cupo: 18, estado: "abierta" },
    { id: "5", clase: "Boxeo", hora: "18:30", coach: "Marcos Ferrero", sala: "Sala Ring", inscriptos: 6, cupo: 16, estado: "cancelada" },
    { id: "6", clase: "Funcional", hora: "19:00", coach: "Dante Peralta", sala: "Sala A", inscriptos: 20, cupo: 20, estado: "completa" },
    { id: "7", clase: "Core & abdomen", hora: "20:15", coach: "Nadia Fontana", sala: "Sala B", inscriptos: 13, cupo: 18, estado: "abierta" },
  ]
}
