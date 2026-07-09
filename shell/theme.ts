// theme.ts · Forja Athletic Club (sistema gimnasio)
// LA PALANCA DE DISEÑO. Nada se hardcodea: todo lee de aca.
// Lenguaje visual: tech / SaaS oscuro (sala de pesas de noche). Marca: grafito + lima electrico.

export type Theme = {
  brand: { name: string; logo?: string }
  colors: {
    primary: string
    accent: string
    bg: string
    surface: string
    fg: string
    muted: string
    border: string
    subtle: string
  }
  font: { heading: string; body: string }
  radius: "sharp" | "soft" | "round"
  density: "comfortable" | "compact"
}

export const forja: Theme = {
  brand: { name: "Forja Athletic Club" },
  colors: {
    primary: "#ccff33",
    accent: "#ff6b35",
    bg: "#0d0f12",
    surface: "#171a1f",
    fg: "#f1f3f5",
    muted: "#868f99",
    border: "#262b33",
    subtle: "#1f242b",
  },
  font: { heading: "Inter", body: "Inter" },
  radius: "round",
  density: "comfortable",
}

export const theme: Theme = forja
