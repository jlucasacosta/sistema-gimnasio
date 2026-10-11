import type { Metadata } from "next"
import { DashboardPage } from "@/modules/dashboard"

export const metadata: Metadata = { title: "Panel" }

export default function Page() {
  return <DashboardPage />
}
