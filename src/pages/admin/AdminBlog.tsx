import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  apiGetAdminBlogPosts,
  apiCreateBlogPost,
  apiUpdateBlogPost,
  apiDeleteBlogPost,
  type ApiBlogPost,
} from "@/lib/api"
import { useSEO } from "@/hooks/useSEO"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { AdminEmptyState } from "@/components/admin/AdminEmptyState"
import { ListRowSkeleton } from "@/components/admin/AdminSkeleton"
import { toast } from "sonner"
import { Plus, Edit2, Trash2, Eye, X, FileText } from "lucide-react"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

interface PostForm {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  read_time: string
  status: string
}

const emptyForm: PostForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  read_time: "5 min",
  status: "draft",
}

export default function AdminBlog() {
  useSEO({ title: "Admin — Blog" })
  const [posts, setPosts] = useState<ApiBlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<PostForm>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchPosts = () => {
    setLoading(true)
    apiGetAdminBlogPosts()
      .then(setPosts)
      .catch(() => toast.error("Erreur lors du chargement"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPosts() }, [])

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: editingId ? prev.slug : slugify(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingId) {
        await apiUpdateBlogPost(editingId, form)
        toast.success("Article mis a jour")
      } else {
        await apiCreateBlogPost(form)
        toast.success("Article cree")
      }
      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm)
      fetchPosts()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (post: ApiBlogPost) => {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content || "",
      category: post.category,
      read_time: post.read_time || "5 min",
      status: post.status || "draft",
    })
    setEditingId(post.id)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await apiDeleteBlogPost(deleteId)
      toast.success("Article supprime")
      fetchPosts()
    } catch {
      toast.error("Erreur lors de la suppression")
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {posts.length} article{posts.length > 1 ? "s" : ""}
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true) }}
            className="bg-royal hover:bg-royal-dark text-white rounded-full"
          >
            <Plus className="mr-1 h-4 w-4" /> Nouvel article
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-bold text-foreground">
              {editingId ? "Modifier l'article" : "Nouvel article"}
            </h2>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm) }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label className="mb-2 block text-sm font-medium">Titre *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Titre de l'article"
                  className="rounded-xl"
                  required
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="titre-de-l-article"
                  className="rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <Label className="mb-2 block text-sm font-medium">Categorie *</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="Creation, Juridique, etc."
                  className="rounded-xl"
                  required
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">Temps de lecture</Label>
                <Input
                  value={form.read_time}
                  onChange={(e) => setForm((f) => ({ ...f, read_time: e.target.value }))}
                  placeholder="5 min"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">Statut</Label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publie</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium">Extrait *</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                rows={2}
                placeholder="Resume court de l'article..."
                className="rounded-xl resize-none"
                required
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium">Contenu * (Markdown supporte)</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={12}
                placeholder="Contenu complet de l'article..."
                className="rounded-xl resize-y font-mono text-sm"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-royal hover:bg-royal-dark text-white rounded-full px-6"
              >
                {submitting
                  ? "Enregistrement..."
                  : editingId
                    ? "Mettre a jour"
                    : "Creer l'article"}
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

      {/* Posts list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <ListRowSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <AdminEmptyState
          icon={FileText}
          title="Aucun article"
          description="Commencez par creer votre premier article de blog."
        />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-heading font-bold text-foreground truncate">
                    {post.title}
                  </h3>
                  <Badge className={
                    post.status === "published"
                      ? "bg-green-500/10 text-green-600 border-green-200"
                      : "bg-gray-500/10 text-gray-600 border-gray-200"
                  }>
                    {post.status === "published" ? "Publie" : "Brouillon"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                {post.status === "published" && (
                  <Link
                    to={`/blog/${post.slug}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    title="Voir"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                )}
                <button
                  onClick={() => handleEdit(post)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteId(post.id)}
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
        title="Supprimer cet article ?"
        description="Cette action est irreversible. L'article sera definitivement supprime."
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
