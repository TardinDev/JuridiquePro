import { Router } from "express"
import { z } from "zod"
import { dbAll, dbGet, dbRun } from "../db.js"
import { authenticateToken, requireAdmin, type AuthenticatedRequest } from "../auth.js"

const router = Router()

const blogPostSchema = z.object({
    title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
    slug: z.string().min(3, "Le slug est requis"),
    excerpt: z.string().min(10, "L'extrait doit contenir au moins 10 caractères"),
    content: z.string().min(50, "Le contenu doit contenir au moins 50 caractères"),
    category: z.string().min(2, "La catégorie est requise"),
    read_time: z.string().optional(),
})

// ── GET /api/blog ─────────────────────────────────────────────
// Public — returns published posts only
router.get("/", async (_req, res) => {
    try {
        const posts = await dbAll<{
            id: number
            title: string
            slug: string
            excerpt: string
            category: string
            read_time: string
            published_at: string
        }>(
            "SELECT id, title, slug, excerpt, category, read_time, published_at FROM blog_posts WHERE status = ? ORDER BY published_at DESC",
            ["published"]
        )
        res.json({ posts })
    } catch (error) {
        console.error("Get blog posts error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── GET /api/blog/:slug ───────────────────────────────────────
// Public — returns a single published post
router.get("/:slug", async (req, res) => {
    try {
        const post = await dbGet<{
            id: number
            title: string
            slug: string
            excerpt: string
            content: string
            category: string
            read_time: string
            author_name: string
            published_at: string
        }>(
            "SELECT id, title, slug, excerpt, content, category, read_time, author_name, published_at FROM blog_posts WHERE slug = ? AND status = ?",
            [req.params.slug, "published"]
        )

        if (!post) {
            res.status(404).json({ error: "Article non trouvé" })
            return
        }

        res.json({ post })
    } catch (error) {
        console.error("Get blog post error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── GET /api/blog/admin/all (admin) ───────────────────────────
router.get("/admin/all", authenticateToken, requireAdmin, async (_req, res) => {
    try {
        const posts = await dbAll<{
            id: number
            title: string
            slug: string
            excerpt: string
            category: string
            status: string
            read_time: string
            published_at: string | null
            created_at: string
        }>(
            "SELECT id, title, slug, excerpt, category, status, read_time, published_at, created_at FROM blog_posts ORDER BY created_at DESC"
        )
        res.json({ posts })
    } catch (error) {
        console.error("Admin get blog posts error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── POST /api/blog (admin) ────────────────────────────────────
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const authReq = req as AuthenticatedRequest
        const parsed = blogPostSchema.safeParse(req.body)
        if (!parsed.success) {
            res.status(400).json({
                error: "Données invalides",
                details: parsed.error.flatten().fieldErrors,
            })
            return
        }

        const { title, slug, excerpt, content, category, read_time } = parsed.data
        const status = req.body.status === "published" ? "published" : "draft"
        const publishedAt = status === "published" ? new Date().toISOString() : null

        // Get author name
        const author = await dbGet<{ full_name: string }>(
            "SELECT full_name FROM users WHERE id = ?",
            [authReq.user!.userId]
        )

        const result = await dbRun(
            "INSERT INTO blog_posts (title, slug, excerpt, content, category, read_time, status, author_id, author_name, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [title, slug, excerpt, content, category, read_time || "5 min", status, authReq.user!.userId, author?.full_name || "Juridique Pro", publishedAt]
        )

        res.status(201).json({
            message: "Article créé avec succès",
            post: { id: result.lastId, title, slug, status },
        })
    } catch (error) {
        console.error("Create blog post error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── PUT /api/blog/:id (admin) ─────────────────────────────────
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const parsed = blogPostSchema.safeParse(req.body)
        if (!parsed.success) {
            res.status(400).json({
                error: "Données invalides",
                details: parsed.error.flatten().fieldErrors,
            })
            return
        }

        const existing = await dbGet<{ id: number; status: string }>(
            "SELECT id, status FROM blog_posts WHERE id = ?",
            [req.params.id]
        )
        if (!existing) {
            res.status(404).json({ error: "Article non trouvé" })
            return
        }

        const { title, slug, excerpt, content, category, read_time } = parsed.data
        const status = req.body.status === "published" ? "published" : "draft"
        const publishedAt = status === "published" && existing.status !== "published"
            ? new Date().toISOString()
            : undefined

        if (publishedAt) {
            await dbRun(
                "UPDATE blog_posts SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, read_time = ?, status = ?, published_at = ? WHERE id = ?",
                [title, slug, excerpt, content, category, read_time || "5 min", status, publishedAt, req.params.id]
            )
        } else {
            await dbRun(
                "UPDATE blog_posts SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, read_time = ?, status = ? WHERE id = ?",
                [title, slug, excerpt, content, category, read_time || "5 min", status, req.params.id]
            )
        }

        res.json({ message: "Article mis à jour" })
    } catch (error) {
        console.error("Update blog post error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── DELETE /api/blog/:id (admin) ──────────────────────────────
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const existing = await dbGet<{ id: number }>(
            "SELECT id FROM blog_posts WHERE id = ?",
            [req.params.id]
        )
        if (!existing) {
            res.status(404).json({ error: "Article non trouvé" })
            return
        }

        await dbRun("DELETE FROM blog_posts WHERE id = ?", [req.params.id])
        res.json({ message: "Article supprimé" })
    } catch (error) {
        console.error("Delete blog post error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

export default router
