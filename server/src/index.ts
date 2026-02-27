import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import { initializeDatabase } from "./db.js"
import authRoutes from "./routes/auth.routes.js"
import testimonialRoutes from "./routes/testimonials.routes.js"

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

// ── Routes ──────────────────────────────────────────────────────
app.use("/api/auth", authRoutes)
app.use("/api/testimonials", testimonialRoutes)

// ── Health check ────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// ── Start ───────────────────────────────────────────────────────
async function start() {
    try {
        await initializeDatabase()
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`)
            console.log(
                `📦 Database: ${process.env.NODE_ENV === "production" ? "PostgreSQL" : "SQLite"}`
            )
        })
    } catch (error) {
        console.error("❌ Failed to start server:", error)
        process.exit(1)
    }
}

start()
