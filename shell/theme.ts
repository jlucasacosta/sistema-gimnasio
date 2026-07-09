// theme.ts · Forja Athletic Club (sistema gimnasio)
// LA PALANCA DE DISEÑO. Nada se hardcodea: todo lee de aca.
// Ficha de Diseño: ver DISENO.md. Cliche rechazado: el gimnasio-gasolinera
// (negro sobre verde-neon "beast mode"). Esto es telemetria de rendimiento:
// dark FRIO de acero, numeros de marcador de estadio, aire negativo.

export type Theme = {
  brand: { name: string; logo?: string }
  mode: "light" | "dark"
  nav: "sidebar" | "topbar" | "rail"
  elevation: "raised" | "outlined" | "flat"
  badge: "pill" | "square"
  radius: "sharp" | "soft" | "round"
  density: "compact" | "comfortable"
  font: { heading: string; body: string }
  colors: {
    primary: string
    accent: string
    bg: string
    surface: string
    fg: string
    muted: string
    border: string
    subtle: string
    success: string
    warning: string
    danger: string
    info: string
  }
  // Constantes de dominio del gimnasio. Umbrales de aforo (fraccion 0-1) y la
  // meta de check-ins del dia. Ningun componente inventa un numero magico:
  // shell/aforo.ts los traduce a clases. Cambiar `lleno` cambia cuando toda
  // la app se pone en magenta. Eso es lo que se graba.
  aforo: { casi: number; lleno: number }
  checkinObjetivo: number
  cupoClub: number
}

export const forja: Theme = {
  brand: { name: "Forja Athletic Club" },
  mode: "dark",
  nav: "sidebar",
  elevation: "outlined",
  badge: "pill",
  radius: "sharp",
  density: "compact",
  font: { heading: "Space Grotesk", body: "IBM Plex Mono" },
  colors: {
    // cobalto-ultramar: SOLO fill (barras, zonas, pill activo). Nunca texto
    // sobre near-black: no llega a 4.5:1 y queda turbio.
    primary: "#2547E6",
    // volt-lime: acento de LOGRO. Se enciende cuando algo se llena o se cumple.
    accent: "#C6F24E",
    bg: "#0B0E13", // grafito / negro-acero frio
    surface: "#151B24", // en dark, surface va MAS claro que bg
    fg: "#E8EDF5", // near-white frio
    muted: "#7E8A9C", // gris acero
    border: "#242D3B", // marco de acero a 1px
    subtle: "#1A212B",
    success: "#2DD4BF", // teal frio: cobrado / activo (sin verde-tierra)
    warning: "#C6F24E", // volt-lime: casi lleno / por vencer
    danger: "#EC3B8A", // magenta: lleno / vencido (pulsa)
    info: "#22D3EE", // cian: espacio / recuperado
  },
  aforo: { casi: 0.6, lleno: 0.85 },
  checkinObjetivo: 520,
  cupoClub: 120,
}

export const theme: Theme = forja
