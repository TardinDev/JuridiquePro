import { useEffect, useState } from "react"
import { Navigate, Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/useAuthStore"
import {
  apiGetAdminTestimonials,
  apiUpdateTestimonialStatus,
  apiDeleteTestimonial,
  type ApiTestimonial,
} from "@/lib/api"
import { useSEO } from "@/hooks/useSEO"
import { toast } from "sonner"
import { ArrowLeft, Check, X, Trash2, Star, Clock } from "lucide-react"

export default function AdminTestimonials() {
  useSEO({ title: "Admin — Témoignages" })
  const user = useAuthStore((s) => s.user)
  const [testimonials, setTestimonials] = useState<ApiTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  const fetchTestimonials = () => {
    setLoading(true)
    apiGetAdminTestimonials()
      .then(setTestimonials)
      .catch(() => toast.error("Erreur lors du chargement"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTestimonials() }, [])

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />
  }

  const handleStatus = async (id: number, status: "approved" | "rejected") => {
    try {
      await apiUpdateTestimonialStatus(id, status)
      toast.success(status === "approved" ? "Témoignage approuvé" : "Témoignage rejeté")
      fetchTestimonials()
    } catch {
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce témoignage définitivement ?")) return
    try {
      await apiDeleteTestimonial(id)
      toast.success("Témoignage supprimé")
      fetchTestimonials()
    } catch {
      toast.error("Erreur lors de la suppression")
    }
  }

  const filtered = filter === "all"
    ? testimonials
    : testimonials.filter((t) => t.status === filter)

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">En attente</Badge>
      case "approved":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Approuvé</Badge>
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-600 border-red-200">Rejeté</Badge>
      default:
        return null
    }
  }

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="noise absolute inset-0" />
        <div className="container-custom relative z-10">
          <Link to="/admin" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground">
            Témoignages
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="mb-8 flex flex-wrap gap-2">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  filter === f
                    ? "border-royal bg-royal/10 text-royal"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "Tous" : f === "pending" ? "En attente" : f === "approved" ? "Approuvés" : "Rejetés"}
                {f !== "all" && (
                  <span className="ml-1.5 text-xs">
                    ({testimonials.filter((t) => t.status === f).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-card border border-border" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <Clock className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">Aucun témoignage dans cette catégorie</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-heading font-bold text-foreground">{t.name}</h3>
                        <span className="text-sm text-muted-foreground">{t.role}</span>
                        {statusBadge(t.status!)}
                      </div>
                      <div className="flex items-center gap-0.5 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        "{t.content}"
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground/60">
                        {new Date(t.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {t.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatus(t.id, "approved")}
                            className="bg-green-500 hover:bg-green-600 text-white rounded-full"
                          >
                            <Check className="mr-1 h-3.5 w-3.5" /> Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatus(t.id, "rejected")}
                            className="rounded-full border-red-200 text-red-500 hover:bg-red-50"
                          >
                            <X className="mr-1 h-3.5 w-3.5" /> Rejeter
                          </Button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
