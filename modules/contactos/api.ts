// PATRON MOCK. Misma firma que la query real. Reetiquetado para gimnasio.
// Datos ficticios con forma realista: emails de patron VARIADO (ver CLAUDE.md §8),
// telefonos AR con prefijos de distintas ciudades.
export type Contact = {
  id: string
  name: string
  phone: string
  email: string
  plan: string
  status: "al dia" | "nuevo" | "por vencer" | "vencido"
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getContacts(): Promise<Contact[]> {
  await sleep(300)
  return [
    { id: "1", name: "Camila Duarte", phone: "+54 9 11 4783-2610", email: "camila.duarte@gmail.com", plan: "Full Anual", status: "al dia" },
    { id: "2", name: "Joaquin Bentancor", phone: "+54 9 11 6294-1187", email: "jbentancor@outlook.com", plan: "Musculacion mensual", status: "al dia" },
    { id: "3", name: "Renata Villalba", phone: "+54 9 11 3126-8074", email: "villalba.renata@hotmail.com", plan: "Full mensual", status: "al dia" },
    { id: "4", name: "Facundo Ibarra", phone: "+54 9 11 5840-3962", email: "facu.ibarra90@gmail.com", plan: "Pase libre trimestral", status: "nuevo" },
    { id: "5", name: "Milena Sarti", phone: "+54 9 11 2957-6431", email: "milena_sarti@yahoo.com", plan: "Clases 8 sesiones", status: "nuevo" },
    { id: "6", name: "Tomas Escalante", phone: "+54 9 11 7013-5528", email: "tomiescalante88@gmail.com", plan: "Full mensual", status: "vencido" },
    { id: "7", name: "Ariadna Pesce", phone: "+54 9 11 4406-9173", email: "ari_pesce23@hotmail.com", plan: "Musculacion mensual", status: "vencido" },
    { id: "8", name: "Bruno Lattanzio", phone: "+54 9 11 6672-2049", email: "brunolattanzio@gmail.com", plan: "Full mensual", status: "al dia" },
    { id: "9", name: "Selena Ojeda", phone: "+54 9 11 3390-7715", email: "sojeda.fit@gmail.com", plan: "Clases 8 sesiones", status: "nuevo" },
    { id: "10", name: "Priscila Godoy", phone: "+54 9 11 5217-4486", email: "pris.godoy@outlook.com", plan: "Full Anual", status: "al dia" },
    { id: "11", name: "Nahuel Zabala", phone: "+54 9 351 620-1934", email: "nzabala94@hotmail.com", plan: "Musculacion mensual", status: "por vencer" },
    { id: "12", name: "Ivana Cardozo", phone: "+54 9 11 8842-3057", email: "cardozo.ivana@gmail.com", plan: "Pase libre trimestral", status: "por vencer" },
    { id: "13", name: "Gaston Uriarte", phone: "+54 9 11 4550-7268", email: "guriarte@outlook.com", plan: "Full mensual", status: "al dia" },
    { id: "14", name: "Delfina Roldan", phone: "+54 9 11 6134-8890", email: "delfi.roldan@gmail.com", plan: "Clases 8 sesiones", status: "al dia" },
    { id: "15", name: "Ramiro Aguirre", phone: "+54 9 341 902-6614", email: "ramiroaguirre77@yahoo.com", plan: "Musculacion mensual", status: "al dia" },
    { id: "16", name: "Ludmila Ferrari", phone: "+54 9 11 2117-4903", email: "lu_ferrari@gmail.com", plan: "Full mensual", status: "al dia" },
    { id: "17", name: "Emanuel Prieto", phone: "+54 9 11 7446-2085", email: "prieto.emanuel@hotmail.com", plan: "Full Anual", status: "al dia" },
    { id: "18", name: "Sofia Maidana", phone: "+54 9 11 3852-6640", email: "sofimaidana@gmail.com", plan: "Clases 8 sesiones", status: "por vencer" },
    { id: "19", name: "Alan Corvalan", phone: "+54 9 11 5739-1264", email: "acorvalan@outlook.com", plan: "Musculacion mensual", status: "al dia" },
    { id: "20", name: "Julieta Naranjo", phone: "+54 9 11 2965-8317", email: "juli.naranjo01@gmail.com", plan: "Pase libre trimestral", status: "nuevo" },
    { id: "21", name: "Ezequiel Barrios", phone: "+54 9 11 6708-4429", email: "eze_barrios@yahoo.com", plan: "Full mensual", status: "al dia" },
    { id: "22", name: "Mora Cantero", phone: "+54 9 11 5240-9976", email: "moracantero@gmail.com", plan: "Musculacion mensual", status: "vencido" },
    { id: "23", name: "Ignacio Rivarola", phone: "+54 9 261 801-7352", email: "nacho.rivarola@hotmail.com", plan: "Full Anual", status: "al dia" },
    { id: "24", name: "Abril Sanguinetti", phone: "+54 9 11 3623-5108", email: "asanguinetti@gmail.com", plan: "Clases 8 sesiones", status: "nuevo" },
    { id: "25", name: "Lisandro Moyano", phone: "+54 9 11 9584-2731", email: "lisandro.moyano@gmail.com", plan: "Full mensual", status: "al dia" },
    { id: "26", name: "Guadalupe Tessa", phone: "+54 9 11 1439-6650", email: "guada_tessa@outlook.com", plan: "Musculacion mensual", status: "por vencer" },
    { id: "27", name: "Benicio Lauria", phone: "+54 9 11 7062-3384", email: "benilauria@gmail.com", plan: "Pase libre trimestral", status: "al dia" },
    { id: "28", name: "Antonella Prado", phone: "+54 9 11 2851-9047", email: "prado.antonella@hotmail.com", plan: "Full mensual", status: "al dia" },
    { id: "29", name: "Valentin Ocampo", phone: "+54 9 11 6395-1720", email: "vocampo85@yahoo.com", plan: "Clases 8 sesiones", status: "vencido" },
    { id: "30", name: "Micaela Sandoval", phone: "+54 9 11 4718-8562", email: "mica.sandoval@gmail.com", plan: "Full Anual", status: "al dia" },
  ]
}
