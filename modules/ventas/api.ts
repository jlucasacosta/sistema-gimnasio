// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
export type Venta = {
  id: string
  fecha: string
  socio: string
  plan: string
  medio: "efectivo" | "tarjeta" | "debito automatico"
  estado: "cobrado" | "pendiente" | "rechazado"
  total: string
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getVentas(): Promise<Venta[]> {
  await sleep(300)
  return [
    { id: "1", fecha: "Hoy 09:40", socio: "Camila Duarte", plan: "Full Anual", medio: "debito automatico", estado: "cobrado", total: "$ 198.000" },
    { id: "2", fecha: "Hoy 09:12", socio: "Joaquin Bentancor", plan: "Musculacion mensual", medio: "tarjeta", estado: "cobrado", total: "$ 16.900" },
    { id: "3", fecha: "Hoy 08:55", socio: "Ariadna Pesce", plan: "Musculacion mensual", medio: "debito automatico", estado: "rechazado", total: "$ 16.900" },
    { id: "4", fecha: "Hoy 08:30", socio: "Bruno Lattanzio", plan: "Full mensual", medio: "tarjeta", estado: "cobrado", total: "$ 21.500" },
    { id: "5", fecha: "Hoy 08:02", socio: "Selena Ojeda", plan: "Clases 8 sesiones", medio: "efectivo", estado: "cobrado", total: "$ 13.200" },
    { id: "6", fecha: "Ayer 20:45", socio: "Renata Villalba", plan: "Full mensual", medio: "debito automatico", estado: "cobrado", total: "$ 21.500" },
    { id: "7", fecha: "Ayer 19:55", socio: "Facundo Ibarra", plan: "Pase libre trimestral", medio: "tarjeta", estado: "cobrado", total: "$ 58.000" },
    { id: "8", fecha: "Ayer 19:10", socio: "Milena Sarti", plan: "Clases 8 sesiones", medio: "efectivo", estado: "cobrado", total: "$ 13.200" },
    { id: "9", fecha: "Ayer 18:20", socio: "Tomas Escalante", plan: "Full mensual", medio: "debito automatico", estado: "rechazado", total: "$ 21.500" },
    { id: "10", fecha: "Ayer 17:40", socio: "Priscila Godoy", plan: "Full Anual", medio: "tarjeta", estado: "cobrado", total: "$ 198.000" },
    { id: "11", fecha: "Ayer 16:05", socio: "Nahuel Zabala", plan: "Musculacion mensual", medio: "efectivo", estado: "cobrado", total: "$ 16.900" },
    { id: "12", fecha: "Ayer 15:30", socio: "Ivana Cardozo", plan: "Pase libre trimestral", medio: "debito automatico", estado: "pendiente", total: "$ 58.000" },
    { id: "13", fecha: "Ayer 12:15", socio: "Gaston Uriarte", plan: "Full mensual", medio: "tarjeta", estado: "cobrado", total: "$ 21.500" },
    { id: "14", fecha: "Ayer 11:00", socio: "Delfina Roldan", plan: "Clases 8 sesiones", medio: "efectivo", estado: "cobrado", total: "$ 13.200" },
    { id: "15", fecha: "Ayer 09:25", socio: "Ramiro Aguirre", plan: "Musculacion mensual", medio: "debito automatico", estado: "cobrado", total: "$ 16.900" },
    { id: "16", fecha: "Lun 20:10", socio: "Ludmila Ferrari", plan: "Full mensual", medio: "efectivo", estado: "cobrado", total: "$ 21.500" },
    { id: "17", fecha: "Lun 19:35", socio: "Emanuel Prieto", plan: "Full Anual", medio: "debito automatico", estado: "cobrado", total: "$ 198.000" },
    { id: "18", fecha: "Lun 18:50", socio: "Sofia Maidana", plan: "Clases 8 sesiones", medio: "tarjeta", estado: "pendiente", total: "$ 13.200" },
    { id: "19", fecha: "Lun 17:30", socio: "Alan Corvalan", plan: "Musculacion mensual", medio: "debito automatico", estado: "cobrado", total: "$ 16.900" },
    { id: "20", fecha: "Lun 16:12", socio: "Julieta Naranjo", plan: "Pase libre trimestral", medio: "tarjeta", estado: "cobrado", total: "$ 58.000" },
    { id: "21", fecha: "Lun 14:45", socio: "Ezequiel Barrios", plan: "Full mensual", medio: "efectivo", estado: "cobrado", total: "$ 21.500" },
    { id: "22", fecha: "Lun 12:20", socio: "Mora Cantero", plan: "Musculacion mensual", medio: "debito automatico", estado: "rechazado", total: "$ 16.900" },
    { id: "23", fecha: "Lun 10:05", socio: "Ignacio Rivarola", plan: "Full Anual", medio: "tarjeta", estado: "cobrado", total: "$ 198.000" },
    { id: "24", fecha: "Dom 19:15", socio: "Abril Sanguinetti", plan: "Clases 8 sesiones", medio: "efectivo", estado: "cobrado", total: "$ 13.200" },
    { id: "25", fecha: "Dom 17:50", socio: "Lisandro Moyano", plan: "Full mensual", medio: "debito automatico", estado: "cobrado", total: "$ 21.500" },
    { id: "26", fecha: "Dom 16:30", socio: "Guadalupe Tessa", plan: "Musculacion mensual", medio: "tarjeta", estado: "cobrado", total: "$ 16.900" },
    { id: "27", fecha: "Dom 15:00", socio: "Benicio Lauria", plan: "Pase libre trimestral", medio: "efectivo", estado: "pendiente", total: "$ 58.000" },
    { id: "28", fecha: "Dom 13:40", socio: "Antonella Prado", plan: "Full mensual", medio: "debito automatico", estado: "cobrado", total: "$ 21.500" },
    { id: "29", fecha: "Dom 11:25", socio: "Valentin Ocampo", plan: "Clases 8 sesiones", medio: "tarjeta", estado: "cobrado", total: "$ 13.200" },
    { id: "30", fecha: "Dom 10:10", socio: "Micaela Sandoval", plan: "Full Anual", medio: "debito automatico", estado: "cobrado", total: "$ 198.000" },
  ]
}
