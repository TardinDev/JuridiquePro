import { useEffect, useState } from "react"
import {
  apiGetAdminContacts,
  apiUpdateContactStatus,
  apiDeleteContact,
  type ApiContactMessage,
} from "@/lib/api"
import { useSEO } from "@/hooks/useSEO"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { AdminEmptyState } from "@/components/admin/AdminEmptyState"
import { ListRowSkeleton } from "@/components/admin/AdminSkeleton"
import { toast } from "sonner"
import { Mail, MailOpen, Archive, Phone, Clock, Trash2 } from "lucide-react"

export default function AdminMessages() {
  useSEO({ title: "Admin — Messages" })
  const [messages, setMessages] = useState<ApiContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "archived">("all")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchMessages = () => {
    setLoading(true)
    apiGetAdminContacts()
      .then(setMessages)
      .catch(() => toast.error("Erreur lors du chargement"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchMessages() }, [])

  const handleStatus = async (id: number, status: "read" | "archived") => {
    try {
      await apiUpdateContactStatus(id, status)
      fetchMessages()
    } catch {
      toast.error("Erreur lors de la mise a jour")
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await apiDeleteContact(deleteId)
      toast.success("Message supprime")
      fetchMessages()
    } catch {
      toast.error("Erreur lors de la suppression")
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const filtered = filter === "all"
    ? messages
    : messages.filter((m) => m.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Messages de contact</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {messages.length} message{messages.length > 1 ? "s" : ""} au total
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "unread", "read", "archived"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              filter === f
                ? "border-royal bg-royal/10 text-royal"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "Tous" : f === "unread" ? "Non lus" : f === "read" ? "Lus" : "Archives"}
            {f !== "all" && (
              <span className="ml-1.5 text-xs">
                ({messages.filter((m) => m.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <ListRowSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          icon={Mail}
          title="Aucun message"
          description="Aucun message dans cette categorie pour le moment."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-2xl border bg-card p-5 transition-all cursor-pointer ${
                msg.status === "unread"
                  ? "border-royal/20 bg-royal/[0.02]"
                  : "border-border"
              }`}
              onClick={() => {
                setExpandedId(expandedId === msg.id ? null : msg.id)
                if (msg.status === "unread") handleStatus(msg.id, "read")
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    {msg.status === "unread" ? (
                      <Mail className="h-4 w-4 text-royal shrink-0" />
                    ) : (
                      <MailOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <h3 className={`font-heading font-bold ${msg.status === "unread" ? "text-foreground" : "text-foreground/80"}`}>
                      {msg.name}
                    </h3>
                    <span className="text-sm text-muted-foreground">{msg.email}</span>
                    {msg.phone && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" /> {msg.phone}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground/80 mb-1">{msg.subject}</p>
                  {expandedId !== msg.id && (
                    <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(msg.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "short",
                    })}
                  </span>
                  {msg.status !== "archived" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStatus(msg.id, "archived")
                        toast.success("Message archive")
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      title="Archiver"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteId(msg.id)
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {expandedId === msg.id && (
                <div className="mt-4 rounded-xl bg-muted/50 p-4">
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 rounded-full bg-royal px-4 py-2 text-sm font-medium text-white hover:bg-royal-dark transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5" /> Repondre
                    </a>
                    {msg.phone && (
                      <a
                        href={`tel:${msg.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" /> Appeler
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer ce message ?"
        description="Cette action est irreversible. Le message sera definitivement supprime."
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
