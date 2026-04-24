import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useAdminStats } from "./AdminStatsContext"
import {
  LayoutDashboard,
  Star,
  MessageSquare,
  FileText,
  Users,
  Image,
  Database,
  PanelLeftClose,
  PanelLeft,
  ExternalLink,
} from "lucide-react"

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin", badgeKey: null },
  { label: "Contenu", icon: Image, path: "/admin/contenu", badgeKey: null },
  { label: "Temoignages", icon: Star, path: "/admin/temoignages", badgeKey: "pendingTestimonials" as const },
  { label: "Messages", icon: MessageSquare, path: "/admin/messages", badgeKey: "unreadMessages" as const },
  { label: "Blog", icon: FileText, path: "/admin/blog", badgeKey: null },
  { label: "Utilisateurs", icon: Users, path: "/admin/utilisateurs", badgeKey: null },
  { label: "Sauvegardes", icon: Database, path: "/admin/sauvegardes", badgeKey: null },
]

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation()
  const stats = useAdminStats()

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin"
    return location.pathname.startsWith(path)
  }

  return (
    <aside
      className={cn(
        "hidden h-screen flex-col border-r border-border bg-card transition-all duration-300 lg:flex",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-4">
        <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
          <img src="/images/logo.png" alt="Pro Juridique" className="h-8 w-8 shrink-0 object-contain" />
          {!collapsed && (
            <span className="font-accent text-lg font-bold leading-none tracking-tight text-foreground whitespace-nowrap">
              <span className="text-royal">Pro</span> Juridique
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path)
          const badgeCount = item.badgeKey && stats ? stats[item.badgeKey] : 0

          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-royal/10 text-royal"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", active && "text-royal")} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {badgeCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-royal px-1.5 text-[10px] font-bold text-white">
                      {badgeCount}
                    </span>
                  )}
                </>
              )}
              {collapsed && badgeCount > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-royal" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-border p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
          title={collapsed ? "Retour au site" : undefined}
        >
          <ExternalLink className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Retour au site</span>}
        </Link>
        <button
          onClick={onToggle}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
        >
          {collapsed ? (
            <PanelLeft className="h-5 w-5 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="h-5 w-5 shrink-0" />
              <span>Reduire</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}

export { NAV_ITEMS }
