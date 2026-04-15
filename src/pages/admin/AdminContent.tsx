import { useEffect, useState, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  apiGetAdminContent,
  apiCreateContent,
  apiUpdateContent,
  apiToggleContent,
  apiDeleteContent,
  apiUploadImage,
  type HomepageContentItem,
} from "@/lib/api"
import { useSEO } from "@/hooks/useSEO"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { AdminEmptyState } from "@/components/admin/AdminEmptyState"
import { ListRowSkeleton } from "@/components/admin/AdminSkeleton"
import { toast } from "sonner"
import {
  Plus, Edit2, Trash2, X, Image as ImageIcon,
  Eye, EyeOff, Upload, Megaphone, Tag, Handshake, LayoutGrid,
} from "lucide-react"

const API_BASE = import.meta.env.VITE_API_URL || ""

const TYPE_OPTIONS = [
  { value: "announcement", label: "Annonce", icon: Megaphone },
  { value: "promotion", label: "Promotion", icon: Tag },
  { value: "partner_ad", label: "Pub partenaire", icon: Handshake },
] as const

const POSITION_OPTIONS = [
  { value: "after-hero", label: "Apres le hero (haut de page)" },
  { value: "after-services", label: "Apres les services" },
  { value: "after-stats", label: "Apres les statistiques" },
  { value: "after-testimonials", label: "Apres les temoignages" },
] as const

interface ContentForm {
  type: string
  title: string
  description: string
  image_url: string
  link_url: string
  link_text: string
  position: string
  display_order: number
  active: boolean
}

const emptyForm: ContentForm = {
  type: "announcement",
  title: "",
  description: "",
  image_url: "",
  link_url: "",
  link_text: "En savoir plus",
  position: "after-services",
  display_order: 0,
  active: true,
}

function getImageUrl(url: string | null): string | null {
  if (!url) return null
  if (url.startsWith("http")) return url
  return `${API_BASE}${url}`
}

export default function AdminContent() {
  useSEO({ title: "Admin — Contenu" })
  const [items, setItems] = useState<HomepageContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "announcement" | "promotion" | "partner_ad">("all")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<ContentForm>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchItems = () => {
    setLoading(true)
    apiGetAdminContent()
      .then(setItems)
      .catch(() => toast.error("Erreur lors du chargement"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchItems() }, [])

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const url = await apiUploadImage(file)
      setForm((f) => ({ ...f, image_url: url }))
      toast.success("Image uploadee")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'upload")
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageUpload(file)
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const data = {
        ...form,
        description: form.description || undefined,
        image_url: form.image_url || undefined,
        link_url: form.link_url || undefined,
        link_text: form.link_text || undefined,
      }
      if (editingId) {
        await apiUpdateContent(editingId, data)
        toast.success("Contenu mis a jour")
      } else {
        await apiCreateContent(data)
        toast.success("Contenu cree")
      }
      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm)
      fetchItems()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (item: HomepageContentItem) => {
    setForm({
      type: item.type,
      title: item.title,
      description: item.description || "",
      image_url: item.image_url || "",
      link_url: item.link_url || "",
      link_text: item.link_text || "En savoir plus",
      position: item.position,
      display_order: item.display_order,
      active: !!item.active,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleToggle = async (id: number) => {
    try {
      const result = await apiToggleContent(id)
      toast.success(result.active ? "Contenu active" : "Contenu desactive")
      fetchItems()
    } catch {
      toast.error("Erreur lors de la mise a jour")
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await apiDeleteContent(deleteId)
      toast.success("Contenu supprime")
      fetchItems()
    } catch {
      toast.error("Erreur lors de la suppression")
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const filtered = filter === "all"
    ? items
    : items.filter((i) => i.type === filter)

  const typeBadge = (type: string) => {
    switch (type) {
      case "announcement":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Annonce</Badge>
      case "promotion":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Promotion</Badge>
      case "partner_ad":
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">Pub partenaire</Badge>
      default:
        return null
    }
  }

  const positionLabel = (pos: string) => {
    const found = POSITION_OPTIONS.find((p) => p.value === pos)
    return found?.label || pos
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Contenu Homepage</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerez les annonces, promotions et publicites visibles sur la page d'accueil
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true) }}
            className="bg-royal hover:bg-royal-dark text-white rounded-full"
          >
            <Plus className="mr-1 h-4 w-4" /> Ajouter
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-bold text-foreground">
              {editingId ? "Modifier le contenu" : "Nouveau contenu"}
            </h2>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm) }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type selector */}
            <div>
              <Label className="mb-2 block text-sm font-medium">Type *</Label>
              <div className="flex flex-wrap gap-2">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: opt.value }))}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      form.type === opt.value
                        ? "border-royal bg-royal/10 text-royal"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <opt.icon className="h-4 w-4" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label className="mb-2 block text-sm font-medium">Titre *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Titre du contenu"
                  className="rounded-xl"
                  required
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">Position sur la page *</Label>
                <select
                  value={form.position}
                  onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                >
                  {POSITION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Description ou texte a afficher..."
                className="rounded-xl resize-none"
              />
            </div>

            {/* Image upload */}
            <div>
              <Label className="mb-2 block text-sm font-medium">Image</Label>
              {form.image_url ? (
                <div className="relative inline-block">
                  <img
                    src={getImageUrl(form.image_url) || ""}
                    alt="Preview"
                    className="h-40 rounded-xl border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white shadow-sm"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center transition-colors hover:border-royal/30 hover:bg-muted/50"
                >
                  {uploading ? (
                    <>
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-royal border-t-transparent" />
                      <p className="text-sm text-muted-foreground">Upload en cours...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Cliquez ou glissez une image
                        </p>
                        <p className="text-xs text-muted-foreground">JPG, PNG, WebP, GIF — Max 5 Mo</p>
                      </div>
                    </>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <Label className="mb-2 block text-sm font-medium">Lien URL</Label>
                <Input
                  value={form.link_url}
                  onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))}
                  placeholder="https://..."
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">Texte du bouton</Label>
                <Input
                  value={form.link_text}
                  onChange={(e) => setForm((f) => ({ ...f, link_text: e.target.value }))}
                  placeholder="En savoir plus"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">Ordre d'affichage</Label>
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm((f) => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="h-4 w-4 rounded border-border text-royal focus:ring-royal"
                />
                <span className="text-sm font-medium text-foreground">Actif (visible sur le site)</span>
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-royal hover:bg-royal-dark text-white rounded-full px-6"
              >
                {submitting ? "Enregistrement..." : editingId ? "Mettre a jour" : "Creer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm) }}
                className="rounded-full"
              >
                Annuler
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {([
          { key: "all", label: "Tous" },
          { key: "announcement", label: "Annonces" },
          { key: "promotion", label: "Promotions" },
          { key: "partner_ad", label: "Pubs partenaires" },
        ] as const).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              filter === f.key
                ? "border-royal bg-royal/10 text-royal"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
            {f.key !== "all" && (
              <span className="ml-1.5 text-xs">
                ({items.filter((i) => i.type === f.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <ListRowSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          icon={LayoutGrid}
          title="Aucun contenu"
          description="Ajoutez des annonces, promotions ou publicites pour les afficher sur la page d'accueil."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all hover:shadow-sm ${
                item.active ? "border-border" : "border-border opacity-50"
              }`}
            >
              {/* Thumbnail */}
              {item.image_url ? (
                <img
                  src={getImageUrl(item.image_url) || ""}
                  alt=""
                  className="h-16 w-24 shrink-0 rounded-xl object-cover border border-border"
                />
              ) : (
                <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-muted border border-border">
                  <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-heading font-bold text-foreground truncate">{item.title}</h3>
                  {typeBadge(item.type)}
                  {!item.active && (
                    <Badge variant="outline" className="text-[10px]">Inactif</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{positionLabel(item.position)}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                    item.active
                      ? "text-green-500 hover:bg-green-50"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                  title={item.active ? "Desactiver" : "Activer"}
                >
                  {item.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer ce contenu ?"
        description="Cette action est irreversible. Le contenu sera retire de la page d'accueil."
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
