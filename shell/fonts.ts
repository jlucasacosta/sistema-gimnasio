// fonts.ts · La voz de Forja Athletic Club.
// Space Grotesk (display atletico-tecnico) = titulos y nombres de clase.
// IBM Plex Mono = TODO el cuerpo y TODO numero (aforo, kg, %, streak): la app
// se lee como el display de una maquina de telemetria, no como un CRM.
// Auto-hosteado por next/font: cero request a terceros.
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google"

export const headingFont = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading-src",
})

// Un solo mono alimenta body y numero (--font-number lo apunta en layout).
export const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-mono-src",
})

export const fontClass = `${headingFont.variable} ${monoFont.variable}`
