import type { Metadata } from "next"
import { VentasPage } from "@/modules/ventas"

export const metadata: Metadata = { title: "Membresias" }

export default function Page() {
  return <VentasPage />
}
