import { Link, useLocation } from "react-router-dom"
import { X } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useNavigationStore } from "@/store/useNavigationStore"
import { NAV_LINKS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useNavigationStore()
  const location = useLocation()

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={closeMobileMenu}>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0 border-none">
        <div className="flex h-full flex-col bg-background">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <span className="font-accent text-2xl font-bold text-foreground">
              Juridique <span className="text-royal">Pro</span>
            </span>
            <button
              onClick={closeMobileMenu}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center rounded-xl px-4 py-3.5 text-base font-medium transition-all",
                  location.pathname === link.href
                    ? "bg-royal/10 text-royal"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-border px-6 py-6">
            <Link to="/contact" onClick={closeMobileMenu}>
              <Button className="w-full bg-royal hover:bg-royal-dark text-white rounded-full py-6 text-base font-medium shadow-lg shadow-royal/20">
                Consultation gratuite
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
