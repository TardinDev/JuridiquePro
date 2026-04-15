import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { apiGetAdminStats, type AdminStats } from "@/lib/api"
import { apiGetRecentActivity, type RecentActivity } from "@/lib/api"
import { useSEO } from "@/hooks/useSEO"
import { StatCardSkeleton, ListRowSkeleton } from "@/components/admin/AdminSkeleton"
import { MessageSquare, Star, FileText, Users, ArrowRight, Mail, Clock } from "lucide-react"

export default function AdminDashboard() {
  useSEO({ title: "Administration" })
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [activity, setActivity] = useState<RecentActivity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiGetAdminStats(),
      apiGetRecentActivity(),
    ])
      .then(([s, a]) => {
        setStats(s)
        setActivity(a)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    {
      label: "Temoignages en attente",
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
      href: "/admin/utilisateurs",
      color: "text-purple-500 bg-purple-500/10",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vue d'ensemble de votre activite
        </p>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent messages */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-heading text-base font-bold text-foreground">
              Derniers messages
            </h2>
            <Link
              to="/admin/messages"
              className="flex items-center gap-1 text-xs font-medium text-royal hover:text-royal-dark transition-colors"
            >
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              <div className="space-y-0 p-4">
                {[...Array(3)].map((_, i) => (
                  <ListRowSkeleton key={i} />
                ))}
              </div>
            ) : activity?.recentMessages.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="mx-auto mb-2 h-6 w-6 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Aucun message</p>
              </div>
            ) : (
              activity?.recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3 px-6 py-3">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    msg.status === "unread" ? "bg-royal/10 text-royal" : "bg-muted text-muted-foreground"
                  }`}>
                    <MessageSquare className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{msg.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{msg.subject}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground/60">
                    <Clock className="h-3 w-3" />
                    {new Date(msg.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent testimonials */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-heading text-base font-bold text-foreground">
              Derniers temoignages
            </h2>
            <Link
              to="/admin/temoignages"
              className="flex items-center gap-1 text-xs font-medium text-royal hover:text-royal-dark transition-colors"
            >
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              <div className="space-y-0 p-4">
                {[...Array(3)].map((_, i) => (
                  <ListRowSkeleton key={i} />
                ))}
              </div>
            ) : activity?.recentTestimonials.length === 0 ? (
              <div className="p-8 text-center">
                <Star className="mx-auto mb-2 h-6 w-6 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Aucun temoignage</p>
              </div>
            ) : (
              activity?.recentTestimonials.map((t) => (
                <div key={t.id} className="flex items-start gap-3 px-6 py-3">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    t.status === "pending" ? "bg-amber-500/10 text-amber-500" :
                    t.status === "approved" ? "bg-green-500/10 text-green-500" :
                    "bg-red-500/10 text-red-500"
                  }`}>
                    <Star className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{t.name}</p>
                      <Badge className={`text-[10px] ${
                        t.status === "pending" ? "bg-amber-500/10 text-amber-600 border-amber-200" :
                        t.status === "approved" ? "bg-green-500/10 text-green-600 border-green-200" :
                        "bg-red-500/10 text-red-600 border-red-200"
                      }`}>
                        {t.status === "pending" ? "En attente" : t.status === "approved" ? "Approuve" : "Rejete"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)} — {t.content.slice(0, 60)}...
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          to="/admin/temoignages"
          className="rounded-2xl border border-border bg-card p-5 text-center transition-all hover:border-royal/20 hover:shadow-md"
        >
          <Star className="mx-auto mb-2 h-7 w-7 text-royal" />
          <h3 className="font-heading text-sm font-bold text-foreground">Temoignages</h3>
          <p className="mt-1 text-xs text-muted-foreground">Moderer les temoignages</p>
        </Link>
        <Link
          to="/admin/messages"
          className="rounded-2xl border border-border bg-card p-5 text-center transition-all hover:border-royal/20 hover:shadow-md"
        >
          <MessageSquare className="mx-auto mb-2 h-7 w-7 text-royal" />
          <h3 className="font-heading text-sm font-bold text-foreground">Messages</h3>
          <p className="mt-1 text-xs text-muted-foreground">Voir les messages de contact</p>
        </Link>
        <Link
          to="/admin/blog"
          className="rounded-2xl border border-border bg-card p-5 text-center transition-all hover:border-royal/20 hover:shadow-md"
        >
          <FileText className="mx-auto mb-2 h-7 w-7 text-royal" />
          <h3 className="font-heading text-sm font-bold text-foreground">Blog</h3>
          <p className="mt-1 text-xs text-muted-foreground">Gerer les articles</p>
        </Link>
      </div>
    </div>
  )
}
