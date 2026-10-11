import type { Metadata } from "next"
import { DashboardPage } from "@/modules/dashboard"

export const metadata: Metadata = { title: "Panel general" }

export default function Page() {
  return <DashboardPage />
}
