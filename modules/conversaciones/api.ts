// PATRON MOCK. Misma firma que la query real. Reetiquetado para gimnasio.
// Master-detail: consultas entrantes de socios. Alimenta, no gobierna.
export type Thread = { id: string; name: string; last: string; time: string; unread: number }
export type Message = { id: string; from: "socio" | "vos"; text: string; time: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getThreads(): Promise<Thread[]> {
  await sleep(300)
  return [
    { id: "1", name: "Camila Ordonez", last: "Queda lugar en Spinning de las 18?", time: "17:24", unread: 2 },
    { id: "2", name: "Ramiro Escalante", last: "Como congelo la membresia un mes?", time: "16:58", unread: 0 },
    { id: "3", name: "Yamila Prado", last: "Me rebota el debito, lo reintento?", time: "16:31", unread: 1 },
    { id: "4", name: "Ezequiel Toledo", last: "El pase estudiante cubre las clases?", time: "15:47", unread: 3 },
    { id: "5", name: "Brenda Salcedo", last: "A que hora es Fuerza Pesada manana?", time: "15:10", unread: 0 },
    { id: "6", name: "Ignacio Bravo", last: "Puedo llevar un invitado el sabado?", time: "14:38", unread: 1 },
    { id: "7", name: "Rocio Miranda", last: "Quiero pasarme a Full Anual", time: "13:55", unread: 0 },
    { id: "8", name: "Tobias Herrero", last: "Hay lockers disponibles a la manana?", time: "13:20", unread: 0 },
    { id: "9", name: "Malena Ibarra", last: "Cuando vence mi congelamiento?", time: "12:44", unread: 1 },
    { id: "10", name: "Franco Aldao", last: "Se puede entrar antes de las 6?", time: "12:05", unread: 0 },
    { id: "11", name: "Josefina Luro", last: "Reservo Yoga Flow de las 18:30", time: "11:32", unread: 0 },
    { id: "12", name: "Antonella Vidal", last: "Me anoto en waitlist de Cycle?", time: "10:58", unread: 2 },
    { id: "13", name: "Lautaro Peralta", last: "Gracias! Excelente la clase de hoy", time: "Ayer", unread: 0 },
    { id: "14", name: "Sabrina Godoy", last: "El coach Ivan da boxeo los martes?", time: "Ayer", unread: 0 },
  ]
}

const conversaciones: Record<string, Message[]> = {
  "1": [
    { id: "1", from: "socio", text: "Hola! Queria saber si queda lugar en el Spinning de las 18", time: "17:10" },
    { id: "2", from: "vos", text: "Hola Camila! Esa clase esta completa, pero hay waitlist con 3 personas", time: "17:16" },
    { id: "3", from: "socio", text: "Y en el Cycle Power de las 17?", time: "17:19" },
    { id: "4", from: "vos", text: "Ese tiene 3 cupos. Te reservo ahi?", time: "17:22" },
    { id: "5", from: "socio", text: "Queda lugar en Spinning de las 18?", time: "17:24" },
  ],
  "3": [
    { id: "1", from: "socio", text: "Hola, me llego que reboto el debito de la cuota", time: "16:12" },
    { id: "2", from: "vos", text: "Hola Yamila! Si, el banco lo rechazo. Podes reintentar desde la app", time: "16:20" },
    { id: "3", from: "socio", text: "Con la misma tarjeta o cambio?", time: "16:26" },
    { id: "4", from: "vos", text: "Podes reintentar con la misma o cargar otra. La membresia sigue activa 48hs", time: "16:29" },
    { id: "5", from: "socio", text: "Me rebota el debito, lo reintento?", time: "16:31" },
  ],
  "4": [
    { id: "1", from: "socio", text: "Buenas! El pase estudiante da acceso a las clases?", time: "15:30" },
    { id: "2", from: "vos", text: "Hola Ezequiel! Si, incluye 8 clases al mes + sala de aparatos", time: "15:38" },
    { id: "3", from: "socio", text: "Y si quiero mas clases?", time: "15:43" },
    { id: "4", from: "vos", text: "Podes pasar a Class Pass 12 o Full. Te paso los valores?", time: "15:45" },
    { id: "5", from: "socio", text: "El pase estudiante cubre las clases?", time: "15:47" },
  ],
  "12": [
    { id: "1", from: "socio", text: "Hola! El Cycle de las 20 esta completo?", time: "10:40" },
    { id: "2", from: "vos", text: "Hola Antonella! Si, 22/22. Te anoto en la waitlist?", time: "10:48" },
    { id: "3", from: "socio", text: "Dale, y si se libera me avisan?", time: "10:53" },
    { id: "4", from: "vos", text: "Exacto, te llega notificacion apenas se libere un lugar", time: "10:56" },
    { id: "5", from: "socio", text: "Me anoto en waitlist de Cycle?", time: "10:58" },
  ],
}

const generico: Message[] = [
  { id: "1", from: "socio", text: "Hola! Consulta rapida sobre el gimnasio", time: "09:10" },
  { id: "2", from: "vos", text: "Hola! Contame, te ayudo", time: "09:14" },
  { id: "3", from: "socio", text: "Que horario tienen de atencion?", time: "09:20" },
  { id: "4", from: "vos", text: "Abrimos de 6 a 22hs, de lunes a sabado", time: "09:26" },
  { id: "5", from: "socio", text: "Perfecto, gracias!", time: "09:31" },
]

export async function getMessages(threadId: string): Promise<Message[]> {
  await sleep(200)
  return conversaciones[threadId] ?? generico
}
