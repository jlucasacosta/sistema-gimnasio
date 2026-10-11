// aforo.ts · El termometro del gimnasio, en un solo lugar.
// Una clase se llena por ocupacion: cian (hay espacio) -> volt (casi lleno)
// -> magenta (lleno/completo). Los umbrales viven en theme.aforo.
// Ningun componente inventa un numero magico ni escribe un color: pide la clase.
import { theme } from "./theme"

export type NivelAforo = "espacio" | "casi" | "lleno"

export function nivelDeAforo(ocupados: number, cupo: number): NivelAforo {
  const pct = cupo <= 0 ? 0 : ocupados / cupo
  if (pct >= theme.aforo.lleno) return "lleno"
  if (pct >= theme.aforo.casi) return "casi"
  return "espacio"
}

// Una clase esta COMPLETA cuando llego al tope. El chip pasa a COMPLETO (magenta, anillo fijo).
export function estaCompleta(ocupados: number, cupo: number): boolean {
  return cupo > 0 && ocupados >= cupo
}

export function pct(ocupados: number, cupo: number): number {
  return cupo <= 0 ? 0 : Math.min(ocupados / cupo, 1)
}

// Mapas literales: Tailwind no ve clases armadas por concatenacion.
export const rellenoAforo: Record<NivelAforo, string> = {
  espacio: "bg-info", // cian
  casi: "bg-accent", // volt-lime
  lleno: "bg-danger", // magenta
}
export const textoAforo: Record<NivelAforo, string> = {
  espacio: "text-info",
  casi: "text-accent",
  lleno: "text-danger",
}
export const bordeAforo: Record<NivelAforo, string> = {
  espacio: "border-info",
  casi: "border-accent",
  lleno: "border-danger",
}
export const chipAforo: Record<NivelAforo, string> = {
  espacio: "bg-info/15 text-info",
  casi: "bg-accent/15 text-accent",
  lleno: "bg-danger/15 text-danger",
}

// Rotulo de cada nivel (se muestra como texto en el chip: el color nunca es la unica senal).
// "lleno" arranca en theme.aforo.lleno; COMPLETO es solo cuando se llego al tope.
export const etiquetaAforo: Record<NivelAforo, string> = {
  espacio: "con lugar",
  casi: "casi lleno",
  lleno: "últimos lugares",
}

const pctTexto = (f: number) => `${Math.round(f * 100)}%`

// Regla de cada nivel, leida del theme (nunca numeros a mano). La usa la leyenda.
export function reglaAforo(nivel: NivelAforo): string {
  if (nivel === "espacio") return `menos de ${pctTexto(theme.aforo.casi)}`
  if (nivel === "casi") return `${pctTexto(theme.aforo.casi)} a ${pctTexto(theme.aforo.lleno)}`
  return `${pctTexto(theme.aforo.lleno)} o más`
}
