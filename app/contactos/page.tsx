import type { Metadata } from "next"
import { ContactosPage } from "@/modules/contactos"

export const metadata: Metadata = { title: "Socios" }

export default function Page() {
  return <ContactosPage />
}
