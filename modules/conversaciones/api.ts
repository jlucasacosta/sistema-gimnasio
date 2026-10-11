// PATRON MOCK. Misma firma que la query real. Reetiquetado para gimnasio.
// Master-detail: consultas entrantes de socios. Alimenta, no gobierna.
// Data en ./data.json (solo lectura; F5 restaura).
import raw from "./data.json"

export type Thread = { id: string; name: string; last: string; time: string; unread: number }
export type Message = { id: string; from: "socio" | "vos"; text: string; time: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getThreads(): Promise<Thread[]> {
  await sleep(300)
  return structuredClone(raw.threads) as Thread[]
}

const conversaciones = raw.conversaciones as Record<string, Message[]>
const generico = raw.generico as Message[]

export async function getMessages(threadId: string): Promise<Message[]> {
  await sleep(200)
  return structuredClone(conversaciones[threadId] ?? generico)
}
