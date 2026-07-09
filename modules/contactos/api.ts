// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// CONTACTOS (socios) = el roster. Recepcion escanea/ordena cientos de socios
// por estado y vencimiento. Tabla densa + barra de busqueda dominante arriba.
// Emails 100% ficticios, patron VARIADO (5 proveedores). Telefonos variados.

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export type EstadoSocio = "activo" | "por-vencer" | "vencido" | "congelado"

export type Socio = {
  id: string
  nombre: string
  documento: string
  plan: string
  estado: EstadoSocio
  ultimoCheckin: string
  vencimiento: string
  email: string
  telefono: string
}

export async function getSocios(): Promise<Socio[]> {
  await sleep(300)
  return [
    { id: "S-201", nombre: "Agustina Real", documento: "38.204.117", plan: "Full Anual", estado: "vencido", ultimoCheckin: "hace 8d", vencimiento: "02 jul", email: "agustina.real@gmail.com", telefono: "+54 9 351 418 2093" },
    { id: "S-202", nombre: "Federico Nunes", documento: "40.117.882", plan: "Full Mensual", estado: "vencido", ultimoCheckin: "hace 5d", vencimiento: "06 jul", email: "fnunes82@mail.com", telefono: "+54 9 11 6274 3319" },
    { id: "S-203", nombre: "Camila Ordonez", documento: "37.556.201", plan: "Class Pass 12", estado: "por-vencer", ultimoCheckin: "ayer", vencimiento: "10 jul", email: "cami.ordonez@outlook.com", telefono: "+54 9 261 553 7742" },
    { id: "S-204", nombre: "Ramiro Escalante", documento: "35.882.410", plan: "Premium Trim.", estado: "por-vencer", ultimoCheckin: "hoy", vencimiento: "11 jul", email: "r.escalante@proton.me", telefono: "+54 9 341 209 6650" },
    { id: "S-205", nombre: "Yamila Prado", documento: "41.330.775", plan: "Full Mensual", estado: "por-vencer", ultimoCheckin: "hoy", vencimiento: "13 jul", email: "yamila_prado@ejemplo.com", telefono: "+54 9 223 447 1108" },
    { id: "S-206", nombre: "Ezequiel Toledo", documento: "39.771.028", plan: "Estudiante", estado: "por-vencer", ultimoCheckin: "hace 2d", vencimiento: "14 jul", email: "eze.toledo@gmail.com", telefono: "+54 9 381 662 5540" },
    { id: "S-207", nombre: "Brenda Salcedo", documento: "36.019.554", plan: "Full Anual", estado: "activo", ultimoCheckin: "hoy", vencimiento: "18 jul", email: "bsalcedo@mail.com", telefono: "+54 9 299 314 8827" },
    { id: "S-208", nombre: "Ignacio Bravo", documento: "34.771.903", plan: "Pase Libre", estado: "activo", ultimoCheckin: "ayer", vencimiento: "20 jul", email: "nacho.bravo@outlook.com", telefono: "+54 9 11 5583 2076" },
    { id: "S-209", nombre: "Rocio Miranda", documento: "42.008.661", plan: "Class Pass 8", estado: "vencido", ultimoCheckin: "hace 11d", vencimiento: "08 jul", email: "rocio.miranda@ejemplo.com", telefono: "+54 9 351 774 3391" },
    { id: "S-210", nombre: "Tobias Herrero", documento: "38.665.012", plan: "Full Mensual", estado: "activo", ultimoCheckin: "hoy", vencimiento: "23 jul", email: "t.herrero@proton.me", telefono: "+54 9 264 401 9928" },
    { id: "S-211", nombre: "Malena Ibarra", documento: "37.220.884", plan: "Congelado", estado: "congelado", ultimoCheckin: "hace 24d", vencimiento: "29 jul", email: "malena.ibarra@gmail.com", telefono: "+54 9 387 553 6614" },
    { id: "S-212", nombre: "Franco Aldao", documento: "35.110.447", plan: "Premium Trim.", estado: "por-vencer", ultimoCheckin: "hoy", vencimiento: "12 jul", email: "franco.aldao@mail.com", telefono: "+54 9 341 668 2203" },
    { id: "S-213", nombre: "Josefina Luro", documento: "40.552.019", plan: "Full Anual", estado: "activo", ultimoCheckin: "ayer", vencimiento: "31 jul", email: "jose.luro@outlook.com", telefono: "+54 9 11 4429 7735" },
    { id: "S-214", nombre: "Damian Correa", documento: "33.994.208", plan: "Class Pass 12", estado: "vencido", ultimoCheckin: "hace 14d", vencimiento: "01 jul", email: "dami.correa@ejemplo.com", telefono: "+54 9 221 336 8850" },
    { id: "S-215", nombre: "Antonella Vidal", documento: "41.887.335", plan: "Full Mensual", estado: "por-vencer", ultimoCheckin: "hoy", vencimiento: "15 jul", email: "anto.vidal@gmail.com", telefono: "+54 9 358 220 4471" },
    { id: "S-216", nombre: "Lautaro Peralta", documento: "38.031.776", plan: "Estudiante", estado: "activo", ultimoCheckin: "hoy", vencimiento: "26 jul", email: "lautaro.peralta@proton.me", telefono: "+54 9 299 667 1152" },
    { id: "S-217", nombre: "Sabrina Godoy", documento: "36.774.550", plan: "Pase Libre", estado: "por-vencer", ultimoCheckin: "ayer", vencimiento: "11 jul", email: "sabri.godoy@mail.com", telefono: "+54 9 351 903 6628" },
    { id: "S-218", nombre: "Matias Rivas", documento: "34.220.991", plan: "Full Mensual", estado: "vencido", ultimoCheckin: "hace 19d", vencimiento: "27 jun", email: "matias.rivas@outlook.com", telefono: "+54 9 11 6612 0084" },
    { id: "S-219", nombre: "Guadalupe Sena", documento: "42.551.107", plan: "Congelado", estado: "congelado", ultimoCheckin: "hace 31d", vencimiento: "08 ago", email: "guada.sena@ejemplo.com", telefono: "+54 9 261 774 3390" },
    { id: "S-220", nombre: "Nicolas Almada", documento: "37.009.663", plan: "Full Anual", estado: "activo", ultimoCheckin: "hoy", vencimiento: "05 ago", email: "nico.almada@gmail.com", telefono: "+54 9 381 220 7716" },
    { id: "S-221", nombre: "Paula Cabrera", documento: "39.446.208", plan: "Class Pass 8", estado: "activo", ultimoCheckin: "ayer", vencimiento: "17 jul", email: "paula.cabrera@proton.me", telefono: "+54 9 341 558 9903" },
    { id: "S-222", nombre: "Emiliano Duarte", documento: "35.667.114", plan: "Premium Trim.", estado: "por-vencer", ultimoCheckin: "hace 3d", vencimiento: "10 jul", email: "emi.duarte@mail.com", telefono: "+54 9 223 990 4417" },
    { id: "S-223", nombre: "Victoria Lascano", documento: "40.880.552", plan: "Full Mensual", estado: "activo", ultimoCheckin: "hoy", vencimiento: "21 jul", email: "vicky.lascano@outlook.com", telefono: "+54 9 11 5074 6628" },
    { id: "S-224", nombre: "Santiago Ferreyra", documento: "33.771.209", plan: "Pase Libre", estado: "vencido", ultimoCheckin: "hace 9d", vencimiento: "07 jul", email: "santi.ferreyra@ejemplo.com", telefono: "+54 9 351 447 2295" },
    { id: "S-225", nombre: "Milagros Quinteros", documento: "41.552.880", plan: "Estudiante", estado: "activo", ultimoCheckin: "ayer", vencimiento: "28 jul", email: "mili.quinteros@gmail.com", telefono: "+54 9 387 220 6613" },
    { id: "S-226", nombre: "Joaquin Bustos", documento: "36.330.774", plan: "Full Anual", estado: "por-vencer", ultimoCheckin: "hoy", vencimiento: "12 jul", email: "joaco.bustos@proton.me", telefono: "+54 9 264 668 1140" },
    { id: "S-227", nombre: "Carla Montenegro", documento: "38.997.201", plan: "Class Pass 12", estado: "activo", ultimoCheckin: "hoy", vencimiento: "24 jul", email: "carla.mont@mail.com", telefono: "+54 9 341 003 7729" },
    { id: "S-228", nombre: "Bautista Leiva", documento: "39.118.665", plan: "Full Mensual", estado: "activo", ultimoCheckin: "ayer", vencimiento: "16 jul", email: "bauti.leiva@outlook.com", telefono: "+54 9 299 774 2208" },
    { id: "S-229", nombre: "Renata Ojeda", documento: "42.330.117", plan: "Class Pass 8", estado: "por-vencer", ultimoCheckin: "hace 4d", vencimiento: "13 jul", email: "renata.ojeda@ejemplo.com", telefono: "+54 9 351 668 9930" },
    { id: "S-230", nombre: "Gonzalo Pereda", documento: "34.556.882", plan: "Pase Libre", estado: "activo", ultimoCheckin: "hoy", vencimiento: "02 ago", email: "gonza.pereda@gmail.com", telefono: "+54 9 11 6290 4471" },
  ]
}
