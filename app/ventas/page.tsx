import type { Metadata } from "next"
import { VentasPage } from "@/modules/ventas"

export const metadata: Metadata = { title: "Membresías" }

export default function Page() {
  return <VentasPage />
}
