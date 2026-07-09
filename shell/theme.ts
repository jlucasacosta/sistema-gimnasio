// theme.ts · Forja Athletic Club (sistema gimnasio)
// LA PALANCA DE DISEÑO. Nada se hardcodea: todo lee de aca.
// Lenguaje visual: tech / SaaS oscuro (sala de pesas de noche).
// Color de nicho: lima electrico (energia) + naranja (esfuerzo).
// Los 4 semanticos dan vida a estados, badges y metricas.

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
    // Semanticos: SIEMPRE los cuatro. Estados y badges leen de aca.
    success: string
    warning: string
    danger: string
    info: string
  }
  font: { heading: string; body: string }
  radius: "sharp" | "soft" | "round"
  density: "comfortable" | "compact"
}

export const forja: Theme = {
  brand: { name: "Forja Athletic Club" },
  colors: {
    primary: "#c3f53c",
    accent: "#ff7a1a",
    bg: "#0d0f12",
    surface: "#171a1f",
    fg: "#f1f3f5",
    muted: "#8b939d",
    border: "#272c34",
    subtle: "#1f242b",
    success: "#34d399",
    warning: "#fbbf24",
    danger: "#fb7185",
    info: "#38bdf8",
  },
  font: { heading: "Inter", body: "Inter" },
  radius: "round",
  density: "comfortable",
}

export const theme: Theme = forja
