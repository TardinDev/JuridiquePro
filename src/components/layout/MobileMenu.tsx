import { Link, useLocation, useNavigate } from "react-router-dom"
import { X, LogIn, LogOut, User } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useNavigationStore } from "@/store/useNavigationStore"
import { useAuthStore } from "@/store/useAuthStore"
import { NAV_LINKS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useNavigationStore()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={closeMobileMenu}>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0 border-none">
        <div className="flex h-full flex-col bg-background">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Juridique Pro"
                className="h-10 w-auto"
              />
              <span className="font-accent text-2xl font-bold text-foreground">
                Juridique <span className="text-royal">Pro</span>
              </span>
            </div>
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

          <div className="border-t border-border px-6 py-6 space-y-3">
            {user ? (
              <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-royal/10 text-royal">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); closeMobileMenu(); navigate("/") }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
                  aria-label="Se déconnecter"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link to="/connexion" onClick={closeMobileMenu}>
                <Button variant="outline" className="w-full rounded-full py-6 text-base font-medium border-border">
                  <LogIn className="mr-2 h-4 w-4" />
                  Se connecter
                </Button>
              </Link>
            )}
            <Link to="/contact" onClick={closeMobileMenu} className="block">
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
