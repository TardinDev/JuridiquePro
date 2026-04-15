import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const initialized = useAuthStore((s) => s.initialized)
  const location = useLocation()

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-royal border-t-transparent" />
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/connexion" state={{ from: location }} replace />
  }

  return <>{children}</>
}
