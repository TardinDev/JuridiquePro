import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { PageLayout } from "@/components/layout/PageLayout"

const Home = lazy(() => import("@/pages/Home"))
const ServicesPage = lazy(() => import("@/pages/ServicesPage"))
const About = lazy(() => import("@/pages/About"))
const Blog = lazy(() => import("@/pages/Blog"))
const ContactPage = lazy(() => import("@/pages/ContactPage"))
const NotFound = lazy(() => import("@/pages/NotFound"))

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-royal border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<PageLayout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="a-propos" element={<About />} />
            <Route path="blog" element={<Blog />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
