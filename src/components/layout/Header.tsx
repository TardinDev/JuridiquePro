import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "./MobileMenu"
import { useNavigationStore } from "@/store/useNavigationStore"
import { NAV_LINKS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import gsap from "gsap"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { openMobileMenu } = useNavigationStore()
  const location = useLocation()

  const headerRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)

  const useLight = !isScrolled

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      tl.fromTo(
        headerRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "expo.out" }
      )
        .fromTo(
          logoRef.current,
          { x: -20, opacity: 0, scale: 0.95 },
          { x: 0, opacity: 1, scale: 1, duration: 0.8 },
          "-=0.5"
        )
        .fromTo(
          navRef.current?.children
            ? Array.from(navRef.current.children)
            : [],
          { y: -15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.06 },
          "-=0.4"
        )
        .fromTo(
          actionsRef.current,
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7 },
          "-=0.5"
        )
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "glass dark:glass-dark header-glow py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="container-custom flex items-center justify-between">
          {/* Logo LC */}
          <Link
            ref={logoRef}
            to="/"
            className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <span
              className={cn(
                "font-accent text-2xl font-bold leading-none tracking-tight transition-colors duration-500",
                useLight ? "text-white" : "text-foreground"
              )}
            >
              Juridique <span className="text-royal">Pro</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav ref={navRef} className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "relative px-5 py-2 text-sm font-medium transition-colors duration-300 rounded-lg",
                  location.pathname === link.href
                    ? useLight ? "text-white" : "text-royal"
                    : useLight
                      ? "text-white/70 hover:text-white hover:bg-white/5"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.label}
                {location.pathname === link.href && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-royal" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div ref={actionsRef} className="flex items-center gap-2">
            <Link to="/contact" className="hidden lg:block">
              <Button className="bg-royal hover:bg-royal-dark text-white rounded-full px-6 font-medium shadow-lg shadow-royal/20 transition-all hover:shadow-xl hover:shadow-royal/30">
                Consultation gratuite
              </Button>
            </Link>

            <button
              onClick={openMobileMenu}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl lg:hidden transition-colors duration-300",
                useLight ? "text-white" : "text-foreground"
              )}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu />
    </>
  )
}
