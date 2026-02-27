import { Router } from "express"
import { dbAll, dbGet, dbRun } from "../db.js"
import { authenticateToken, requireAdmin } from "../auth.js"

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

export default router
