// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// VENTAS (membresias) = cola de vencimientos y recupero de morosos.
// Arquetipo lista-ticket: cada fila es un comprobante monoespaciado con estado
// de cobro. Ordenable por urgencia (dias para vencer). Se mira 3 veces al dia.

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export type EstadoMembresia = "activo" | "por-vencer" | "vencido" | "congelado"
export type EstadoCobro = "cobrado" | "pendiente" | "rechazado"

export type Ticket = {
  id: string
  socio: string
  plan: string
  monto: number // MRR mensual, en pesos
  dias: number // dias para vencer (negativo = vencido hace X)
  estado: EstadoMembresia
  cobro: EstadoCobro
}

// 28 membresias. Estados mezclados: debitos rechazados, cuotas vencidas,
// congelados y por vencer. La bandeja se ve como un dia real de cobranza.
export async function getMembresias(): Promise<Ticket[]> {
  await sleep(300)
  return [
    { id: "M-1042", socio: "Agustina Real", plan: "Full Anual", monto: 15900, dias: -6, estado: "vencido", cobro: "rechazado" },
    { id: "M-1043", socio: "Federico Nunes", plan: "Full Mensual", monto: 12500, dias: -3, estado: "vencido", cobro: "rechazado" },
    { id: "M-1044", socio: "Camila Ordonez", plan: "Class Pass 12", monto: 9800, dias: 1, estado: "por-vencer", cobro: "pendiente" },
    { id: "M-1045", socio: "Ramiro Escalante", plan: "Premium Trimestral", monto: 21400, dias: 2, estado: "por-vencer", cobro: "pendiente" },
    { id: "M-1046", socio: "Yamila Prado", plan: "Full Mensual", monto: 12500, dias: 4, estado: "por-vencer", cobro: "pendiente" },
    { id: "M-1047", socio: "Ezequiel Toledo", plan: "Estudiante", monto: 7200, dias: 5, estado: "por-vencer", cobro: "cobrado" },
    { id: "M-1048", socio: "Brenda Salcedo", plan: "Full Anual", monto: 15900, dias: 9, estado: "activo", cobro: "cobrado" },
    { id: "M-1049", socio: "Ignacio Bravo", plan: "Pase Libre", monto: 18600, dias: 11, estado: "activo", cobro: "cobrado" },
    { id: "M-1050", socio: "Rocio Miranda", plan: "Class Pass 8", monto: 6900, dias: -1, estado: "vencido", cobro: "rechazado" },
    { id: "M-1051", socio: "Tobias Herrero", plan: "Full Mensual", monto: 12500, dias: 14, estado: "activo", cobro: "cobrado" },
    { id: "M-1052", socio: "Malena Ibarra", plan: "Congelado", monto: 0, dias: 20, estado: "congelado", cobro: "pendiente" },
    { id: "M-1053", socio: "Franco Aldao", plan: "Premium Trimestral", monto: 21400, dias: 3, estado: "por-vencer", cobro: "pendiente" },
    { id: "M-1054", socio: "Josefina Luro", plan: "Full Anual", monto: 15900, dias: 22, estado: "activo", cobro: "cobrado" },
    { id: "M-1055", socio: "Damian Correa", plan: "Class Pass 12", monto: 9800, dias: -8, estado: "vencido", cobro: "rechazado" },
    { id: "M-1056", socio: "Antonella Vidal", plan: "Full Mensual", monto: 12500, dias: 6, estado: "por-vencer", cobro: "cobrado" },
    { id: "M-1057", socio: "Lautaro Peralta", plan: "Estudiante", monto: 7200, dias: 17, estado: "activo", cobro: "cobrado" },
    { id: "M-1058", socio: "Sabrina Godoy", plan: "Pase Libre", monto: 18600, dias: 2, estado: "por-vencer", cobro: "pendiente" },
    { id: "M-1059", socio: "Matias Rivas", plan: "Full Mensual", monto: 12500, dias: -12, estado: "vencido", cobro: "rechazado" },
    { id: "M-1060", socio: "Guadalupe Sena", plan: "Congelado", monto: 0, dias: 30, estado: "congelado", cobro: "pendiente" },
    { id: "M-1061", socio: "Nicolas Almada", plan: "Full Anual", monto: 15900, dias: 27, estado: "activo", cobro: "cobrado" },
    { id: "M-1062", socio: "Paula Cabrera", plan: "Class Pass 8", monto: 6900, dias: 8, estado: "activo", cobro: "cobrado" },
    { id: "M-1063", socio: "Emiliano Duarte", plan: "Premium Trimestral", monto: 21400, dias: 1, estado: "por-vencer", cobro: "rechazado" },
    { id: "M-1064", socio: "Victoria Lascano", plan: "Full Mensual", monto: 12500, dias: 12, estado: "activo", cobro: "cobrado" },
    { id: "M-1065", socio: "Santiago Ferreyra", plan: "Pase Libre", monto: 18600, dias: -2, estado: "vencido", cobro: "rechazado" },
    { id: "M-1066", socio: "Milagros Quinteros", plan: "Estudiante", monto: 7200, dias: 19, estado: "activo", cobro: "cobrado" },
    { id: "M-1067", socio: "Joaquin Bustos", plan: "Full Anual", monto: 15900, dias: 3, estado: "por-vencer", cobro: "pendiente" },
    { id: "M-1068", socio: "Carla Montenegro", plan: "Class Pass 12", monto: 9800, dias: 15, estado: "activo", cobro: "cobrado" },
    { id: "M-1069", socio: "Bautista Leiva", plan: "Full Mensual", monto: 12500, dias: 7, estado: "activo", cobro: "cobrado" },
  ]
}
