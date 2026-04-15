import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiGetAdminStats, type AdminStats } from "@/lib/api"

const AdminStatsContext = createContext<AdminStats | null>(null)

export function AdminStatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<AdminStats | null>(null)

  useEffect(() => {
    const load = () => apiGetAdminStats().then(setStats).catch(console.error)
    load()
    const interval = setInterval(load, 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <AdminStatsContext.Provider value={stats}>
      {children}
    </AdminStatsContext.Provider>
  )
}

export function useAdminStats() {
  return useContext(AdminStatsContext)
}
