import { Router } from "express"
import { z } from "zod"
import { dbAll, dbRun } from "../db.js"
import { authenticateToken, type AuthenticatedRequest } from "../auth.js"

const router = Router()

// ── Validation ──────────────────────────────────────────────────
const submitTestimonialSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    role: z.string().min(2, "Le rôle/entreprise doit contenir au moins 2 caractères"),
    content: z
        .string()
        .min(20, "Le témoignage doit contenir au moins 20 caractères")
        .max(500, "Le témoignage ne doit pas dépasser 500 caractères"),
    rating: z.number().int().min(1).max(5),
})

// ── GET /api/testimonials ───────────────────────────────────────
// Public — returns approved testimonials only
router.get("/", async (_req, res) => {
    try {
        const testimonials = await dbAll<{
            id: number
            name: string
            role: string
            content: string
            rating: number
            created_at: string
        }>(
            "SELECT id, name, role, content, rating, created_at FROM testimonials WHERE status = ? ORDER BY created_at DESC",
            ["approved"]
        )

        res.json({ testimonials })
    } catch (error) {
        console.error("Get testimonials error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── POST /api/testimonials ──────────────────────────────────────
// Authenticated — submit a new testimonial (pending by default)
router.post("/", authenticateToken, async (req, res) => {
    try {
        const authReq = req as AuthenticatedRequest

        const parsed = submitTestimonialSchema.safeParse(req.body)
        if (!parsed.success) {
            res.status(400).json({
                error: "Données invalides",
                details: parsed.error.flatten().fieldErrors,
            })
            return
        }

        const { name, role, content, rating } = parsed.data

        const result = await dbRun(
            "INSERT INTO testimonials (user_id, name, role, content, rating) VALUES (?, ?, ?, ?, ?)",
            [authReq.user!.userId, name, role, content, rating]
        )

        res.status(201).json({
            message: "Témoignage soumis avec succès ! Il sera visible après validation.",
            testimonial: {
                id: result.lastId,
                name,
                role,
                content,
                rating,
                status: "pending",
            },
        })
    } catch (error) {
        console.error("Submit testimonial error:", error)
        res.status(500).json({ error: "Erreur serveur lors de la soumission" })
    }
})

export default router
