import { lazy, Suspense, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { PageLayout } from "@/components/layout/PageLayout"
import { useAuthStore } from "@/store/useAuthStore"

const Home = lazy(() => import("@/pages/Home"))
const ServicesPage = lazy(() => import("@/pages/ServicesPage"))
const TarifsPage = lazy(() => import("@/pages/TarifsPage"))
const About = lazy(() => import("@/pages/About"))
const Blog = lazy(() => import("@/pages/Blog"))
const BlogPost = lazy(() => import("@/pages/BlogPost"))
const ContactPage = lazy(() => import("@/pages/ContactPage"))
const LoginPage = lazy(() => import("@/pages/LoginPage"))
const RegisterPage = lazy(() => import("@/pages/RegisterPage"))
const TestimonialsPage = lazy(() => import("@/pages/TestimonialsPage"))
const MentionsLegales = lazy(() => import("@/pages/MentionsLegales"))
const PolitiqueConfidentialite = lazy(() => import("@/pages/PolitiqueConfidentialite"))
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"))
const AdminTestimonials = lazy(() => import("@/pages/admin/AdminTestimonials"))
const AdminMessages = lazy(() => import("@/pages/admin/AdminMessages"))
const AdminBlog = lazy(() => import("@/pages/admin/AdminBlog"))
const NotFound = lazy(() => import("@/pages/NotFound"))

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-royal border-t-transparent" />
    </div>
  )
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((s) => s.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route element={<PageLayout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="tarifs" element={<TarifsPage />} />
              <Route path="a-propos" element={<About />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="temoignages" element={<TestimonialsPage />} />
              <Route path="connexion" element={<LoginPage />} />
              <Route path="inscription" element={<RegisterPage />} />
              <Route path="mentions-legales" element={<MentionsLegales />} />
              <Route path="politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/temoignages" element={<AdminTestimonials />} />
              <Route path="admin/messages" element={<AdminMessages />} />
              <Route path="admin/blog" element={<AdminBlog />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthInitializer>
    </BrowserRouter>
  )
}
