import { Router } from "express"
import { z } from "zod"
import { dbRun, dbAll, dbGet } from "../db.js"
import { authenticateToken, requireAdmin, type AuthenticatedRequest } from "../auth.js"
import { sendContactNotification, sendContactConfirmation } from "../email.js"

const router = Router()

const contactSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Adresse email invalide"),
    phone: z.string().optional(),
    subject: z.string().min(3, "Le sujet est requis"),
    message: z
        .string()
        .min(10, "Le message doit contenir au moins 10 caractères")
        .max(2000, "Le message ne doit pas dépasser 2000 caractères"),
})

// ── POST /api/contact ─────────────────────────────────────────
router.post("/", async (req, res) => {
    try {
        const parsed = contactSchema.safeParse(req.body)
        if (!parsed.success) {
            res.status(400).json({
                error: "Données invalides",
                details: parsed.error.flatten().fieldErrors,
            })
            return
        }

        const { name, email, phone, subject, message } = parsed.data

        await dbRun(
            "INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
            [name, email, phone || null, subject, message]
        )

        // Send email notifications (non-blocking)
        sendContactNotification({ name, email, phone, subject, message }).catch(console.error)
        sendContactConfirmation({ name, email, subject }).catch(console.error)

        res.status(201).json({
            message: "Message envoyé avec succès ! Nous vous répondons sous 24h.",
        })
    } catch (error) {
        console.error("Contact error:", error)
        res.status(500).json({ error: "Erreur serveur lors de l'envoi" })
    }
})

// ── GET /api/contact (admin) ──────────────────────────────────
router.get("/", authenticateToken, requireAdmin, async (_req, res) => {
    try {
        const messages = await dbAll<{
            id: number
            name: string
            email: string
            phone: string | null
            subject: string
            message: string
            status: string
            created_at: string
        }>(
            "SELECT id, name, email, phone, subject, message, status, created_at FROM contact_messages ORDER BY created_at DESC"
        )
        res.json({ messages })
    } catch (error) {
        console.error("Get contacts error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── PATCH /api/contact/:id (admin) ────────────────────────────
router.patch("/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { status } = req.body
        if (!["read", "archived"].includes(status)) {
            res.status(400).json({ error: "Statut invalide" })
            return
        }

        const existing = await dbGet<{ id: number }>(
            "SELECT id FROM contact_messages WHERE id = ?",
            [req.params.id]
        )
        if (!existing) {
            res.status(404).json({ error: "Message non trouvé" })
            return
        }

        await dbRun(
            "UPDATE contact_messages SET status = ? WHERE id = ?",
            [status, req.params.id]
        )
        res.json({ message: "Statut mis à jour" })
    } catch (error) {
        console.error("Update contact error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

export default router
