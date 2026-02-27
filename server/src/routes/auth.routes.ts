import { Router } from "express"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { dbRun, dbGet } from "../db.js"
import { signToken, authenticateToken, type AuthenticatedRequest } from "../auth.js"

const router = Router()

// ── Validation schemas ──────────────────────────────────────────
const registerSchema = z.object({
    fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Adresse email invalide"),
    password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
})

const loginSchema = z.object({
    email: z.string().email("Adresse email invalide"),
    password: z.string().min(1, "Le mot de passe est requis"),
})

// ── POST /api/auth/register ─────────────────────────────────────
router.post("/register", async (req, res) => {
    try {
        const parsed = registerSchema.safeParse(req.body)
        if (!parsed.success) {
            res.status(400).json({
                error: "Données invalides",
                details: parsed.error.flatten().fieldErrors,
            })
            return
        }

        const { fullName, email, password } = parsed.data

        // Check if email already exists
        const existingUser = await dbGet<{ id: number }>(
            "SELECT id FROM users WHERE email = ?",
            [email]
        )
        if (existingUser) {
            res.status(409).json({ error: "Cette adresse email est déjà utilisée" })
            return
        }

        // Hash password and create user
        const passwordHash = await bcrypt.hash(password, 12)
        const result = await dbRun(
            "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)",
            [fullName, email, passwordHash]
        )

        const token = signToken({ userId: result.lastId!, email })

        res.status(201).json({
            token,
            user: { id: result.lastId, fullName, email },
        })
    } catch (error) {
        console.error("Register error:", error)
        res.status(500).json({ error: "Erreur serveur lors de l'inscription" })
    }
})

// ── POST /api/auth/login ────────────────────────────────────────
router.post("/login", async (req, res) => {
    try {
        const parsed = loginSchema.safeParse(req.body)
        if (!parsed.success) {
            res.status(400).json({
                error: "Données invalides",
                details: parsed.error.flatten().fieldErrors,
            })
            return
        }

        const { email, password } = parsed.data

        const user = await dbGet<{
            id: number
            full_name: string
            email: string
            password_hash: string
        }>("SELECT id, full_name, email, password_hash FROM users WHERE email = ?", [
            email,
        ])

        if (!user) {
            res.status(401).json({ error: "Email ou mot de passe incorrect" })
            return
        }

        const validPassword = await bcrypt.compare(password, user.password_hash)
        if (!validPassword) {
            res.status(401).json({ error: "Email ou mot de passe incorrect" })
            return
        }

        const token = signToken({ userId: user.id, email: user.email })

        res.json({
            token,
            user: { id: user.id, fullName: user.full_name, email: user.email },
        })
    } catch (error) {
        console.error("Login error:", error)
        res.status(500).json({ error: "Erreur serveur lors de la connexion" })
    }
})

// ── GET /api/auth/me ────────────────────────────────────────────
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const authReq = req as AuthenticatedRequest
        const user = await dbGet<{
            id: number
            full_name: string
            email: string
            created_at: string
        }>("SELECT id, full_name, email, created_at FROM users WHERE id = ?", [
            authReq.user!.userId,
        ])

        if (!user) {
            res.status(404).json({ error: "Utilisateur non trouvé" })
            return
        }

        res.json({
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                createdAt: user.created_at,
            },
        })
    } catch (error) {
        console.error("Get me error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

export default router
