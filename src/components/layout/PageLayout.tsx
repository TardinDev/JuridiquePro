import { Outlet, useLocation } from "react-router-dom"
import { Header } from "./Header"
import { Footer } from "./Footer"
import { SmoothScroll } from "@/components/effects/SmoothScroll"
import { CustomCursor } from "@/components/effects/CustomCursor"
import { ScrollProgress } from "@/components/effects/ScrollProgress"
import { PageTransition } from "@/components/effects/PageTransition"
import { useEffect } from "react"

export function PageLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <SmoothScroll>
      <CustomCursor />
      <ScrollProgress />
      <Header />
      <main className="min-h-screen">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </SmoothScroll>
  )
}
