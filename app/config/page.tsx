import type { Metadata } from "next"
import { ConfigPage } from "@/modules/config"

export const metadata: Metadata = { title: "Configuración" }

export default function Page() {
  return <ConfigPage />
}
