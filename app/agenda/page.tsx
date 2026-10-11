import type { Metadata } from "next"
import { AgendaPage } from "@/modules/agenda"

export const metadata: Metadata = { title: "Clases" }

export default function Page() {
  return <AgendaPage />
}
