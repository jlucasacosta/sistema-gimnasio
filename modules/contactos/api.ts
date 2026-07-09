// PATRON MOCK. Misma firma que la query real. Reetiquetado para gimnasio.
export type Contact = {
  id: string
  name: string
  phone: string
  email: string
  plan: string
  status: "al dia" | "nuevo" | "vencido"
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getContacts(): Promise<Contact[]> {
  await sleep(300)
  return [
    { id: "1", name: "Camila Duarte", phone: "+54 11 5555 4102", email: "camila@mail.com", plan: "Full Anual", status: "al dia" },
    { id: "2", name: "Joaquin Bentancor", phone: "+54 11 5555 8830", email: "joaquin@mail.com", plan: "Musculacion mensual", status: "al dia" },
    { id: "3", name: "Renata Villalba", phone: "+54 11 5555 2274", email: "renata@mail.com", plan: "Full mensual", status: "al dia" },
    { id: "4", name: "Facundo Ibarra", phone: "+54 11 5555 6619", email: "facundo@mail.com", plan: "Pase libre trimestral", status: "nuevo" },
    { id: "5", name: "Milena Sarti", phone: "+54 11 5555 3387", email: "milena@mail.com", plan: "Clases 8 sesiones", status: "nuevo" },
    { id: "6", name: "Tomas Escalante", phone: "+54 11 5555 9945", email: "tomas@mail.com", plan: "Full mensual", status: "vencido" },
    { id: "7", name: "Ariadna Pesce", phone: "+54 11 5555 1508", email: "ariadna@mail.com", plan: "Musculacion mensual", status: "vencido" },
  ]
}
