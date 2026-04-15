import { Outlet } from "react-router-dom"
import { useState } from "react"
import { AdminSidebar } from "./AdminSidebar"
import { AdminHeader } from "./AdminHeader"
import { AdminMobileSidebar } from "./AdminMobileSidebar"
import { AdminStatsProvider } from "./AdminStatsContext"

export function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <AdminStatsProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
        />

        <AdminMobileSidebar
          open={mobileSidebarOpen}
          onOpenChange={setMobileSidebarOpen}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader onMenuClick={() => setMobileSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminStatsProvider>
  )
}
