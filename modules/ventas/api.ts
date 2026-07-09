// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
export type Venta = {
  id: string
  fecha: string
  socio: string
  plan: string
  medio: "efectivo" | "tarjeta" | "debito automatico"
  total: string
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getVentas(): Promise<Venta[]> {
  await sleep(300)
  return [
    { id: "1", fecha: "Hoy 09:40", socio: "Camila Duarte", plan: "Full Anual", medio: "debito automatico", total: "$ 198.000" },
    { id: "2", fecha: "Hoy 08:15", socio: "Joaquin Bentancor", plan: "Musculacion mensual", medio: "tarjeta", total: "$ 16.900" },
    { id: "3", fecha: "Ayer 19:55", socio: "Renata Villalba", plan: "Full mensual", medio: "debito automatico", total: "$ 21.500" },
    { id: "4", fecha: "Ayer 18:20", socio: "Facundo Ibarra", plan: "Pase libre trimestral", medio: "tarjeta", total: "$ 58.000" },
    { id: "5", fecha: "Ayer 11:05", socio: "Milena Sarti", plan: "Clases 8 sesiones", medio: "efectivo", total: "$ 13.200" },
    { id: "6", fecha: "Lun 20:10", socio: "Tomas Escalante", plan: "Full mensual", medio: "efectivo", total: "$ 21.500" },
    { id: "7", fecha: "Lun 17:30", socio: "Ariadna Pesce", plan: "Musculacion mensual", medio: "debito automatico", total: "$ 16.900" },
  ]
}
