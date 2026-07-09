// PATRON MOCK. Misma firma que la query real. Reetiquetado para gimnasio.
export type Thread = { id: string; name: string; last: string; time: string; unread: number }
export type Message = { id: string; from: "cliente" | "vos"; text: string; time: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getThreads(): Promise<Thread[]> {
  await sleep(300)
  return [
    { id: "1", name: "Camila Duarte", last: "Listo, reservo Funcional 19:00", time: "16:12", unread: 1 },
    { id: "2", name: "Facundo Ibarra", last: "El pase libre incluye clases?", time: "15:47", unread: 2 },
    { id: "3", name: "Milena Sarti", last: "Puedo congelar el plan dos semanas?", time: "14:30", unread: 0 },
    { id: "4", name: "Tomas Escalante", last: "Me quedo la cuota vencida, como pago?", time: "13:58", unread: 3 },
    { id: "5", name: "Renata Villalba", last: "A que hora abre el sabado?", time: "13:12", unread: 0 },
    { id: "6", name: "Ivana Cardozo", last: "Se puede pasar de mensual a trimestral?", time: "12:40", unread: 1 },
    { id: "7", name: "Nahuel Zabala", last: "Hay lugar en Crossfit del mediodia?", time: "12:05", unread: 0 },
    { id: "8", name: "Sofia Maidana", last: "Cuantas sesiones me quedan del pack?", time: "11:22", unread: 0 },
    { id: "9", name: "Bruno Lattanzio", last: "Necesito el comprobante de pago", time: "10:48", unread: 1 },
    { id: "10", name: "Julieta Naranjo", last: "Traigo a una amiga de invitada?", time: "10:15", unread: 0 },
    { id: "11", name: "Gaston Uriarte", last: "El coach Ivo da fuerza los martes?", time: "09:40", unread: 0 },
    { id: "12", name: "Mora Cantero", last: "Mi debito volvio a rebotar", time: "09:05", unread: 2 },
    { id: "13", name: "Delfina Roldan", last: "Los lockers tienen candado propio?", time: "Ayer", unread: 0 },
    { id: "14", name: "Emanuel Prieto", last: "Gracias! Nos vemos el lunes", time: "Ayer", unread: 0 },
  ]
}

const conversaciones: Record<string, Message[]> = {
  "1": [
    { id: "1", from: "cliente", text: "Hola! Queda lugar en Funcional de la tarde?", time: "15:52" },
    { id: "2", from: "vos", text: "Hola Camila! Quedan 4 cupos en la de 19:00 con Dante", time: "15:58" },
    { id: "3", from: "cliente", text: "Genial. Llevo calzado de entrenamiento nomas?", time: "16:04" },
    { id: "4", from: "vos", text: "Si, eso y toalla. Las bandas las ponemos nosotros", time: "16:08" },
    { id: "5", from: "cliente", text: "Listo, reservo Funcional 19:00", time: "16:12" },
  ],
  "2": [
    { id: "1", from: "cliente", text: "Buenas! Estoy mirando el pase libre trimestral", time: "15:30" },
    { id: "2", from: "vos", text: "Hola Facundo! Son $ 58.000 los 3 meses, sala + clases", time: "15:35" },
    { id: "3", from: "cliente", text: "Todas las clases o algunas?", time: "15:41" },
    { id: "4", from: "vos", text: "Todas, salvo Pilates reformer que va por pack aparte", time: "15:44" },
    { id: "5", from: "cliente", text: "El pase libre incluye clases?", time: "15:47" },
  ],
  "4": [
    { id: "1", from: "cliente", text: "Hola, me llego un aviso de cuota vencida", time: "13:30" },
    { id: "2", from: "vos", text: "Hola Tomas! El debito de septiembre rebota hace 2 intentos", time: "13:38" },
    { id: "3", from: "cliente", text: "Cambie de banco y no avise, mea culpa", time: "13:44" },
    { id: "4", from: "vos", text: "Sin drama. Podes pagar en recepcion o por transferencia", time: "13:50" },
    { id: "5", from: "cliente", text: "Me quedo la cuota vencida, como pago?", time: "13:58" },
  ],
  "12": [
    { id: "1", from: "cliente", text: "Otra vez me rebota el debito", time: "08:40" },
    { id: "2", from: "vos", text: "Hola Mora, lo veo. Es la tarjeta vencida en el sistema", time: "08:52" },
    { id: "3", from: "cliente", text: "La cambie el mes pasado", time: "08:58" },
    { id: "4", from: "vos", text: "Pasame los ultimos 4 digitos y la actualizo hoy", time: "09:01" },
    { id: "5", from: "cliente", text: "Mi debito volvio a rebotar", time: "09:05" },
  ],
}

const generico: Message[] = [
  { id: "1", from: "cliente", text: "Hola! Consulta rapida sobre el gimnasio", time: "09:10" },
  { id: "2", from: "vos", text: "Hola! Contame, te ayudo", time: "09:14" },
  { id: "3", from: "cliente", text: "Queria saber los horarios de la sala de pesas", time: "09:20" },
  { id: "4", from: "vos", text: "De lunes a viernes 6 a 23, sabados 8 a 18, domingos 9 a 14", time: "09:26" },
  { id: "5", from: "cliente", text: "Perfecto, gracias!", time: "09:31" },
]

export async function getMessages(threadId: string): Promise<Message[]> {
  await sleep(200)
  return conversaciones[threadId] ?? generico
}
