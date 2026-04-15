import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"
import { Badge } from "@/components/ui/badge"
import { Menu, LogOut, ChevronRight } from "lucide-react"

interface AdminHeaderProps {
  onMenuClick: () => void
}

const BREADCRUMB_MAP: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/contenu": "Contenu",
  "/admin/temoignages": "Temoignages",
  "/admin/messages": "Messages",
  "/admin/blog": "Blog",
  "/admin/utilisateurs": "Utilisateurs",
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const currentPage = BREADCRUMB_MAP[location.pathname] || "Dashboard"
  const isSubPage = location.pathname !== "/admin"

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      {/* Left: hamburger + breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors lg:hidden"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="flex items-center gap-1.5 text-sm">
          {isSubPage && (
            <>
              <Link
                to="/admin"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            </>
          )}
          <span className="font-medium text-foreground">{currentPage}</span>
        </nav>
      </div>

      {/* Right: user info + logout */}
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-sm font-medium text-foreground">
            {user?.fullName}
          </span>
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
            Admin
          </Badge>
        </div>
        <button
          onClick={handleLogout}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Se deconnecter"
          title="Se deconnecter"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
