import type { Metadata } from "next"
import { ConversacionesPage } from "@/modules/conversaciones"

export const metadata: Metadata = { title: "Conversaciones" }

export default function Page() {
  return <ConversacionesPage />
}
