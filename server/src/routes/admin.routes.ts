import { Router } from "express"
import { dbAll, dbGet, dbRun } from "../db.js"
import { authenticateToken, requireAdmin, type AuthenticatedRequest } from "../auth.js"

const router = Router()

// All routes require admin auth
router.use(authenticateToken, requireAdmin)

// ── GET /api/admin/stats ──────────────────────────────────────
router.get("/stats", async (_req, res) => {
    try {
        const [users, testimonials, contacts, posts] = await Promise.all([
            dbGet<{ count: number }>("SELECT COUNT(*) as count FROM users"),
            dbGet<{ count: number }>("SELECT COUNT(*) as count FROM testimonials WHERE status = ?", ["pending"]),
            dbGet<{ count: number }>("SELECT COUNT(*) as count FROM contact_messages WHERE status = ?", ["unread"]),
            dbGet<{ count: number }>("SELECT COUNT(*) as count FROM blog_posts"),
        ])

        res.json({
            stats: {
                totalUsers: users?.count || 0,
                pendingTestimonials: testimonials?.count || 0,
                unreadMessages: contacts?.count || 0,
                totalPosts: posts?.count || 0,
            },
        })
    } catch (error) {
        console.error("Admin stats error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── GET /api/admin/testimonials ───────────────────────────────
router.get("/testimonials", async (_req, res) => {
    try {
        const testimonials = await dbAll<{
            id: number
            name: string
            role: string
            content: string
            rating: number
            status: string
            created_at: string
        }>(
            "SELECT id, name, role, content, rating, status, created_at FROM testimonials ORDER BY created_at DESC"
        )
        res.json({ testimonials })
    } catch (error) {
        console.error("Admin testimonials error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── PATCH /api/admin/testimonials/:id ─────────────────────────
router.patch("/testimonials/:id", async (req, res) => {
    try {
        const { status } = req.body
        if (!["approved", "rejected"].includes(status)) {
            res.status(400).json({ error: "Statut invalide (approved ou rejected)" })
            return
        }

        const existing = await dbGet<{ id: number }>(
            "SELECT id FROM testimonials WHERE id = ?",
            [req.params.id]
        )
        if (!existing) {
            res.status(404).json({ error: "Témoignage non trouvé" })
            return
        }

        await dbRun(
            "UPDATE testimonials SET status = ? WHERE id = ?",
            [status, req.params.id]
        )
        res.json({ message: `Témoignage ${status === "approved" ? "approuvé" : "rejeté"}` })
    } catch (error) {
        console.error("Update testimonial error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── DELETE /api/admin/testimonials/:id ────────────────────────
router.delete("/testimonials/:id", async (req, res) => {
    try {
        const existing = await dbGet<{ id: number }>(
            "SELECT id FROM testimonials WHERE id = ?",
            [req.params.id]
        )
        if (!existing) {
            res.status(404).json({ error: "Témoignage non trouvé" })
            return
        }

        await dbRun("DELETE FROM testimonials WHERE id = ?", [req.params.id])
        res.json({ message: "Témoignage supprimé" })
    } catch (error) {
        console.error("Delete testimonial error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── GET /api/admin/recent-activity ──────────────────────────
router.get("/recent-activity", async (_req, res) => {
    try {
        const [recentMessages, recentTestimonials] = await Promise.all([
            dbAll<{
                id: number
                name: string
                subject: string
                status: string
                created_at: string
            }>("SELECT id, name, subject, status, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5"),
            dbAll<{
                id: number
                name: string
                content: string
                rating: number
                status: string
                created_at: string
            }>("SELECT id, name, content, rating, status, created_at FROM testimonials ORDER BY created_at DESC LIMIT 5"),
        ])
        res.json({ recentMessages, recentTestimonials })
    } catch (error) {
        console.error("Recent activity error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── GET /api/admin/users ────────────────────────────────────
router.get("/users", async (_req, res) => {
    try {
        const users = await dbAll<{
            id: number
            full_name: string
            email: string
            role: string
            created_at: string
        }>("SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC")
        res.json({ users })
    } catch (error) {
        console.error("Admin users error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── PATCH /api/admin/users/:id/role ─────────────────────────
router.patch("/users/:id/role", async (req, res) => {
    try {
        const authReq = req as AuthenticatedRequest
        const { role } = req.body

        if (!["user", "admin"].includes(role)) {
            res.status(400).json({ error: "Rôle invalide (user ou admin)" })
            return
        }

        if (String(authReq.user!.userId) === req.params.id) {
            res.status(400).json({ error: "Impossible de modifier votre propre rôle" })
            return
        }

        const existing = await dbGet<{ id: number }>(
            "SELECT id FROM users WHERE id = ?",
            [req.params.id]
        )
        if (!existing) {
            res.status(404).json({ error: "Utilisateur non trouvé" })
            return
        }

        await dbRun("UPDATE users SET role = ? WHERE id = ?", [role, req.params.id])
        res.json({ message: `Rôle mis à jour: ${role}` })
    } catch (error) {
        console.error("Update user role error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── DELETE /api/admin/users/:id ─────────────────────────────
router.delete("/users/:id", async (req, res) => {
    try {
        const authReq = req as AuthenticatedRequest

        if (String(authReq.user!.userId) === req.params.id) {
            res.status(400).json({ error: "Impossible de supprimer votre propre compte" })
            return
        }

        const existing = await dbGet<{ id: number }>(
            "SELECT id FROM users WHERE id = ?",
            [req.params.id]
        )
        if (!existing) {
            res.status(404).json({ error: "Utilisateur non trouvé" })
            return
        }

        // Delete related testimonials first (foreign key constraint)
        await dbRun("DELETE FROM testimonials WHERE user_id = ?", [req.params.id])
        // Nullify blog post author references
        await dbRun("UPDATE blog_posts SET author_id = NULL WHERE author_id = ?", [req.params.id])
        // Delete the user
        await dbRun("DELETE FROM users WHERE id = ?", [req.params.id])

        res.json({ message: "Utilisateur supprimé" })
    } catch (error) {
        console.error("Delete user error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

export default router
