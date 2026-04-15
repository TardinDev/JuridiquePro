import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  apiGetAdminTestimonials,
  apiUpdateTestimonialStatus,
  apiDeleteTestimonial,
  type ApiTestimonial,
} from "@/lib/api"
import { useSEO } from "@/hooks/useSEO"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { AdminEmptyState } from "@/components/admin/AdminEmptyState"
import { ListRowSkeleton } from "@/components/admin/AdminSkeleton"
import { toast } from "sonner"
import { Check, X, Trash2, Star, Clock } from "lucide-react"

export default function AdminTestimonials() {
  useSEO({ title: "Admin — Temoignages" })
  const [testimonials, setTestimonials] = useState<ApiTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchTestimonials = () => {
    setLoading(true)
    apiGetAdminTestimonials()
      .then(setTestimonials)
      .catch(() => toast.error("Erreur lors du chargement"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTestimonials() }, [])

  const handleStatus = async (id: number, status: "approved" | "rejected") => {
    try {
      await apiUpdateTestimonialStatus(id, status)
      toast.success(status === "approved" ? "Temoignage approuve" : "Temoignage rejete")
      fetchTestimonials()
    } catch {
      toast.error("Erreur lors de la mise a jour")
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await apiDeleteTestimonial(deleteId)
      toast.success("Temoignage supprime")
      fetchTestimonials()
    } catch {
      toast.error("Erreur lors de la suppression")
    } finally {
      setDeleting(false)
      setDeleteId(null)
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
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Approuve</Badge>
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-600 border-red-200">Rejete</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Temoignages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {testimonials.length} temoignage{testimonials.length > 1 ? "s" : ""} au total
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
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
            {f === "all" ? "Tous" : f === "pending" ? "En attente" : f === "approved" ? "Approuves" : "Rejetes"}
            {f !== "all" && (
              <span className="ml-1.5 text-xs">
                ({testimonials.filter((t) => t.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <ListRowSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          icon={Clock}
          title="Aucun temoignage"
          description="Aucun temoignage dans cette categorie pour le moment."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-sm"
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
                    onClick={() => setDeleteId(t.id)}
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

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer ce temoignage ?"
        description="Cette action est irreversible. Le temoignage sera definitivement supprime."
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
