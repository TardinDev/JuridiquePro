import { useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/useAuthStore"
import { apiGetAdminStats, type AdminStats } from "@/lib/api"
import { useSEO } from "@/hooks/useSEO"
import { MessageSquare, Star, FileText, Users } from "lucide-react"

export default function AdminDashboard() {
  useSEO({ title: "Administration" })
  const user = useAuthStore((s) => s.user)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGetAdminStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />
  }

  const cards = [
    {
      label: "Témoignages en attente",
      value: stats?.pendingTestimonials ?? 0,
      icon: Star,
      href: "/admin/temoignages",
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      label: "Messages non lus",
      value: stats?.unreadMessages ?? 0,
      icon: MessageSquare,
      href: "/admin/messages",
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      label: "Articles de blog",
      value: stats?.totalPosts ?? 0,
      icon: FileText,
      href: "/admin/blog",
      color: "text-green-500 bg-green-500/10",
    },
    {
      label: "Utilisateurs inscrits",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      href: "/admin",
      color: "text-purple-500 bg-purple-500/10",
    },
  ]

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="noise absolute inset-0" />
        <div className="container-custom relative z-10 text-center">
          <Badge variant="secondary" className="mb-6 border-border bg-card text-muted-foreground">
            Administration
          </Badge>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Dashboard
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-card border border-border" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map((card) => (
                <Link
                  key={card.label}
                  to={card.href}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-royal/20 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}>
                      <card.icon className="h-5 w-5" />
                    </div>
                    <span className="text-3xl font-bold text-foreground">{card.value}</span>
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {card.label}
                  </p>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <Link
              to="/admin/temoignages"
              className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-royal/20 hover:shadow-md"
            >
              <Star className="mx-auto mb-3 h-8 w-8 text-royal" />
              <h3 className="font-heading font-bold text-foreground">Témoignages</h3>
              <p className="mt-1 text-sm text-muted-foreground">Modérer les témoignages</p>
            </Link>
            <Link
              to="/admin/messages"
              className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-royal/20 hover:shadow-md"
            >
              <MessageSquare className="mx-auto mb-3 h-8 w-8 text-royal" />
              <h3 className="font-heading font-bold text-foreground">Messages</h3>
              <p className="mt-1 text-sm text-muted-foreground">Voir les messages de contact</p>
            </Link>
            <Link
              to="/admin/blog"
              className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-royal/20 hover:shadow-md"
            >
              <FileText className="mx-auto mb-3 h-8 w-8 text-royal" />
              <h3 className="font-heading font-bold text-foreground">Blog</h3>
              <p className="mt-1 text-sm text-muted-foreground">Gérer les articles</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
