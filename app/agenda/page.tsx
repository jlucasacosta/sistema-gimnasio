import type { Metadata } from "next"
import { AgendaPage } from "@/modules/agenda"

export const metadata: Metadata = { title: "Clases de hoy" }

export default function Page() {
  return <AgendaPage />
}
