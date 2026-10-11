import { LayoutDashboard, MessageSquare, Dumbbell, CreditCard, Users, Settings, type LucideIcon } from "lucide-react"

export type NavItem = { label: string; href: string; icon: LucideIcon }

export const nav: NavItem[] = [
  { label: "Panel", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clases", href: "/agenda", icon: Dumbbell },
  { label: "Conversaciones", href: "/conversaciones", icon: MessageSquare },
  { label: "Membresías", href: "/ventas", icon: CreditCard },
  { label: "Socios", href: "/contactos", icon: Users },
  { label: "Configuración", href: "/config", icon: Settings },
]
