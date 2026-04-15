import { Router, type Request, type Response } from "express"
import multer, { type FileFilterCallback } from "multer"
import path from "path"
import crypto from "crypto"
import { authenticateToken, requireAdmin } from "../auth.js"

const router = Router()

// Storage configuration
const storage = multer.diskStorage({
    destination(_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, path.resolve(import.meta.dirname, "../../uploads"))
    },
    filename(_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        const ext = path.extname(file.originalname).toLowerCase()
        const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`
        cb(null, uniqueName)
    },
})

// File filter: images only
const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (allowed.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Type de fichier non autorisé. Utilisez JPG, PNG, WebP ou GIF."))
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
})

// ── POST /api/upload (admin only) ───────────────────────────
router.post("/", authenticateToken, requireAdmin, (req: Request, res: Response) => {
    upload.single("image")(req, res, (err: unknown) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                res.status(400).json({ error: "L'image ne doit pas dépasser 5 Mo" })
                return
            }
            res.status(400).json({ error: err.message })
            return
        }
        if (err instanceof Error) {
            res.status(400).json({ error: err.message })
            return
        }

        const file = (req as Request & { file?: Express.Multer.File }).file
        if (!file) {
            res.status(400).json({ error: "Aucun fichier envoyé" })
            return
        }

        const url = `/uploads/${file.filename}`
        res.json({ url })
    })
})

export default router
