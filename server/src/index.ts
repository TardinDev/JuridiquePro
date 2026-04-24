import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { initializeDatabase } from "./db.js"
import { runSeed } from "./seed.js"
import authRoutes from "./routes/auth.routes.js"
import testimonialRoutes from "./routes/testimonials.routes.js"
import contactRoutes from "./routes/contact.routes.js"
import blogRoutes from "./routes/blog.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import uploadRoutes from "./routes/upload.routes.js"
import contentRoutes from "./routes/content.routes.js"
import backupRoutes from "./routes/backup.routes.js"

const app = express()
const PORT = parseInt(process.env.PORT || "3001", 10)

// ── Middleware ───────────────────────────────────────────────────
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "https://projuridique.com",
    "https://www.projuridique.com",
]

app.use(
    cors({
        origin(origin, callback) {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true)
            if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
                return callback(null, true)
            }
            callback(new Error("Not allowed by CORS"))
        },
        credentials: true,
    })
)
app.use(express.json())

// ── Serve uploaded files ─────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.resolve(__dirname, "../uploads")
app.use("/uploads", express.static(uploadsDir))

// ── Routes ──────────────────────────────────────────────────────
app.use("/api/auth", authRoutes)
app.use("/api/testimonials", testimonialRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/blog", blogRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/backup", backupRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/content", contentRoutes)

// ── Health check ────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// ── Start ───────────────────────────────────────────────────────
async function start() {
    try {
        await initializeDatabase()
        await runSeed()
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
            console.log(
                `Database: ${process.env.NODE_ENV === "production" ? "PostgreSQL" : "SQLite"}`
            )
        })
    } catch (error) {
        console.error("Failed to start server:", error)
        process.exit(1)
    }
}

start()
