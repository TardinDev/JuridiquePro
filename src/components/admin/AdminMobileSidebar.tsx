import { Link, useLocation } from "react-router-dom"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAdminStats } from "./AdminStatsContext"
import { NAV_ITEMS } from "./AdminSidebar"
import { ExternalLink } from "lucide-react"

interface AdminMobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminMobileSidebar({ open, onOpenChange }: AdminMobileSidebarProps) {
  const location = useLocation()
  const stats = useAdminStats()

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin"
    return location.pathname.startsWith(path)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Pro Juridique" className="h-8 w-8 object-contain" />
            <span className="font-accent text-lg font-bold leading-none tracking-tight text-foreground">
              <span className="text-royal">Pro</span> Juridique
            </span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path)
            const badgeCount = item.badgeKey && stats ? stats[item.badgeKey] : 0

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-royal/10 text-royal"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", active && "text-royal")} />
                <span className="flex-1">{item.label}</span>
                {badgeCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-royal px-1.5 text-[10px] font-bold text-white">
                    {badgeCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            to="/"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
          >
            <ExternalLink className="h-5 w-5 shrink-0" />
            <span>Retour au site</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
