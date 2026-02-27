import { useEffect, useState } from "react"
import { Navigate, Link } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"
import {
  apiGetAdminContacts,
  apiUpdateContactStatus,
  type ApiContactMessage,
} from "@/lib/api"
import { useSEO } from "@/hooks/useSEO"
import { toast } from "sonner"
import { ArrowLeft, Mail, MailOpen, Archive, Phone, Clock } from "lucide-react"

export default function AdminMessages() {
  useSEO({ title: "Admin — Messages" })
  const user = useAuthStore((s) => s.user)
  const [messages, setMessages] = useState<ApiContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "archived">("all")

  const fetchMessages = () => {
    setLoading(true)
    apiGetAdminContacts()
      .then(setMessages)
      .catch(() => toast.error("Erreur lors du chargement"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchMessages() }, [])

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />
  }

  const handleStatus = async (id: number, status: "read" | "archived") => {
    try {
      await apiUpdateContactStatus(id, status)
      fetchMessages()
    } catch {
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const filtered = filter === "all"
    ? messages
    : messages.filter((m) => m.status === filter)

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
            Messages de contact
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="mb-8 flex flex-wrap gap-2">
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
                {f === "all" ? "Tous" : f === "unread" ? "Non lus" : f === "read" ? "Lus" : "Archivés"}
                {f !== "all" && (
                  <span className="ml-1.5 text-xs">
                    ({messages.filter((m) => m.status === f).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-card border border-border" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <Mail className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">Aucun message dans cette catégorie</p>
            </div>
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
                            toast.success("Message archivé")
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="Archiver"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                      )}
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
                          <Mail className="h-3.5 w-3.5" /> Répondre
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
        </div>
      </section>
    </>
  )
}
