// aforo.ts · El termometro del gimnasio, en un solo lugar.
// Una clase se llena por ocupacion: cian (hay espacio) -> volt (casi lleno)
// -> magenta (lleno/completo, pulsa). Los umbrales viven en theme.aforo.
// Ningun componente inventa un numero magico ni escribe un color: pide la clase.
import { theme } from "./theme"

export type NivelAforo = "espacio" | "casi" | "lleno"

export function nivelDeAforo(ocupados: number, cupo: number): NivelAforo {
  const pct = cupo <= 0 ? 0 : ocupados / cupo
  if (pct >= theme.aforo.lleno) return "lleno"
  if (pct >= theme.aforo.casi) return "casi"
  return "espacio"
}

// Una clase esta COMPLETA cuando llego al tope. El chip flipea a magenta latiendo.
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
