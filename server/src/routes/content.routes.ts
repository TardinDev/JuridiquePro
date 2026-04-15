import { Router } from "express"
import { z } from "zod"
import { dbAll, dbGet, dbRun } from "../db.js"
import { authenticateToken, requireAdmin } from "../auth.js"

const router = Router()

const contentSchema = z.object({
    type: z.enum(["announcement", "promotion", "partner_ad"]),
    title: z.string().min(1, "Le titre est requis"),
    description: z.string().optional(),
    image_url: z.string().optional(),
    link_url: z.string().optional(),
    link_text: z.string().optional(),
    position: z.enum(["after-hero", "after-services", "after-stats", "after-testimonials"]),
    display_order: z.number().int().default(0),
    active: z.union([z.boolean(), z.number()]).default(true),
})

interface ContentRow {
    id: number
    type: string
    title: string
    description: string | null
    image_url: string | null
    link_url: string | null
    link_text: string | null
    position: string
    display_order: number
    active: number | boolean
    created_at: string
}

// ── GET /api/content (public) ───────────────────────────────
// Returns active content grouped by position
router.get("/", async (_req, res) => {
    try {
        const rows = await dbAll<ContentRow>(
            "SELECT * FROM homepage_content WHERE active = 1 ORDER BY display_order ASC, created_at DESC"
        )
        // Group by position
        const grouped: Record<string, ContentRow[]> = {}
        for (const row of rows) {
            if (!grouped[row.position]) grouped[row.position] = []
            grouped[row.position].push(row)
        }
        res.json({ content: grouped })
    } catch (error) {
        console.error("Get content error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── GET /api/content/admin (admin) ──────────────────────────
// Returns all content (active + inactive)
router.get("/admin", authenticateToken, requireAdmin, async (_req, res) => {
    try {
        const content = await dbAll<ContentRow>(
            "SELECT * FROM homepage_content ORDER BY display_order ASC, created_at DESC"
        )
        res.json({ content })
    } catch (error) {
        console.error("Admin get content error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── POST /api/content/admin (admin) ─────────────────────────
router.post("/admin", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const parsed = contentSchema.safeParse(req.body)
        if (!parsed.success) {
            res.status(400).json({
                error: "Données invalides",
                details: parsed.error.flatten().fieldErrors,
            })
            return
        }

        const { type, title, description, image_url, link_url, link_text, position, display_order, active } = parsed.data
        const activeVal = active ? 1 : 0

        const result = await dbRun(
            "INSERT INTO homepage_content (type, title, description, image_url, link_url, link_text, position, display_order, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [type, title, description || null, image_url || null, link_url || null, link_text || "En savoir plus", position, display_order, activeVal]
        )

        res.status(201).json({ message: "Contenu créé", id: result.lastId })
    } catch (error) {
        console.error("Create content error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── PUT /api/content/admin/:id (admin) ──────────────────────
router.put("/admin/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const existing = await dbGet<{ id: number }>(
            "SELECT id FROM homepage_content WHERE id = ?",
            [req.params.id]
        )
        if (!existing) {
            res.status(404).json({ error: "Contenu non trouvé" })
            return
        }

        const parsed = contentSchema.safeParse(req.body)
        if (!parsed.success) {
            res.status(400).json({
                error: "Données invalides",
                details: parsed.error.flatten().fieldErrors,
            })
            return
        }

        const { type, title, description, image_url, link_url, link_text, position, display_order, active } = parsed.data
        const activeVal = active ? 1 : 0

        await dbRun(
            "UPDATE homepage_content SET type = ?, title = ?, description = ?, image_url = ?, link_url = ?, link_text = ?, position = ?, display_order = ?, active = ? WHERE id = ?",
            [type, title, description || null, image_url || null, link_url || null, link_text || "En savoir plus", position, display_order, activeVal, req.params.id]
        )

        res.json({ message: "Contenu mis à jour" })
    } catch (error) {
        console.error("Update content error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── PATCH /api/content/admin/:id/toggle (admin) ─────────────
router.patch("/admin/:id/toggle", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const existing = await dbGet<{ id: number; active: number }>(
            "SELECT id, active FROM homepage_content WHERE id = ?",
            [req.params.id]
        )
        if (!existing) {
            res.status(404).json({ error: "Contenu non trouvé" })
            return
        }

        const newActive = existing.active ? 0 : 1
        await dbRun(
            "UPDATE homepage_content SET active = ? WHERE id = ?",
            [newActive, req.params.id]
        )

        res.json({ message: newActive ? "Contenu activé" : "Contenu désactivé", active: !!newActive })
    } catch (error) {
        console.error("Toggle content error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── DELETE /api/content/admin/:id (admin) ────────────────────
router.delete("/admin/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const existing = await dbGet<{ id: number }>(
            "SELECT id FROM homepage_content WHERE id = ?",
            [req.params.id]
        )
        if (!existing) {
            res.status(404).json({ error: "Contenu non trouvé" })
            return
        }

        await dbRun("DELETE FROM homepage_content WHERE id = ?", [req.params.id])
        res.json({ message: "Contenu supprimé" })
    } catch (error) {
        console.error("Delete content error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

export default router
