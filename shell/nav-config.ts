import { LayoutDashboard, MessageSquare, Dumbbell, CreditCard, Users, Settings, type LucideIcon } from "lucide-react"

export type NavItem = { label: string; href: string; icon: LucideIcon }

export const nav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clases", href: "/agenda", icon: Dumbbell },
  { label: "Conversaciones", href: "/conversaciones", icon: MessageSquare },
  { label: "Membresias", href: "/ventas", icon: CreditCard },
  { label: "Socios", href: "/contactos", icon: Users },
  { label: "Configuracion", href: "/config", icon: Settings },
]
