// PATRON MOCK. Misma firma que la query real. Reetiquetado para gimnasio.
export type Thread = { id: string; name: string; last: string; time: string; unread: number }
export type Message = { id: string; from: "cliente" | "vos"; text: string; time: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getThreads(): Promise<Thread[]> {
  await sleep(300)
  return [
    { id: "1", name: "Camila Duarte", last: "Listo, reservo Funcional 19:00", time: "16:12", unread: 1 },
    { id: "2", name: "Facundo Ibarra", last: "El pase libre incluye clases?", time: "14:35", unread: 2 },
    { id: "3", name: "Milena Sarti", last: "Puedo congelar el plan dos semanas?", time: "12:48", unread: 0 },
    { id: "4", name: "Tomas Escalante", last: "Me quedo la cuota vencida, como pago?", time: "11:20", unread: 0 },
    { id: "5", name: "Renata Villalba", last: "A que hora abre el sabado?", time: "09:05", unread: 0 },
  ]
}

export async function getMessages(_threadId: string): Promise<Message[]> {
  await sleep(200)
  return [
    { id: "1", from: "cliente", text: "Hola! Queda lugar en Funcional de la tarde?", time: "15:52" },
    { id: "2", from: "vos", text: "Hola Camila! Quedan 4 cupos en la de 19:00 con Dante", time: "15:58" },
    { id: "3", from: "cliente", text: "Genial. Llevo calzado de entrenamiento nomas?", time: "16:04" },
    { id: "4", from: "vos", text: "Si, eso y toalla. Las bandas las ponemos nosotros", time: "16:08" },
    { id: "5", from: "cliente", text: "Listo, reservo Funcional 19:00", time: "16:12" },
  ]
}
