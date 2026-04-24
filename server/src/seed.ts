import bcrypt from "bcryptjs"
import { dbAll, dbGet, dbRun } from "./db.js"

interface DefaultContent {
    type: "announcement" | "promotion" | "partner_ad"
    title: string
    description: string | null
    image_url: string | null
    link_url: string | null
    link_text: string
    position: "after-hero" | "after-services" | "after-stats" | "after-testimonials"
    display_order: number
}

const DEFAULT_HOMEPAGE_CONTENT: DefaultContent[] = [
    {
        type: "announcement",
        title: "Première consultation offerte",
        description:
            "Profitez d'un premier échange gratuit de 30 minutes avec l'un de nos juristes pour évaluer votre dossier.",
        image_url: null,
        link_url: "/contact",
        link_text: "Réserver ma consultation",
        position: "after-hero",
        display_order: 0,
    },
    {
        type: "promotion",
        title: "Accompagnement entreprise",
        description:
            "Forfait mensuel adapté aux TPE/PME : conseils juridiques illimités, rédaction de contrats et veille réglementaire.",
        image_url: null,
        link_url: "/services",
        link_text: "Découvrir le forfait",
        position: "after-services",
        display_order: 0,
    },
]

// ── Seed admin from environment variables ─────────────────────
async function seedAdmin(): Promise<void> {
    const email = process.env.ADMIN_SEED_EMAIL
    const password = process.env.ADMIN_SEED_PASSWORD
    const fullName = process.env.ADMIN_SEED_NAME || "Admin"

    if (!email || !password) {
        return
    }

    const existingAdmin = await dbGet<{ id: number }>(
        "SELECT id FROM users WHERE role = ? LIMIT 1",
        ["admin"]
    )
    if (existingAdmin) {
        return
    }

    const existingUser = await dbGet<{ id: number; role: string }>(
        "SELECT id, role FROM users WHERE email = ?",
        [email]
    )

    if (existingUser) {
        if (existingUser.role !== "admin") {
            await dbRun("UPDATE users SET role = ? WHERE id = ?", ["admin", existingUser.id])
            console.log(`[seed] User ${email} promoted to admin`)
        }
        return
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await dbRun(
        "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
        [fullName, email, passwordHash, "admin"]
    )
    console.log(`[seed] Admin account created: ${email}`)
}

// ── Seed homepage content if empty ────────────────────────────
async function seedHomepageContent(): Promise<void> {
    if (process.env.SEED_HOMEPAGE_CONTENT === "false") {
        return
    }

    const existing = await dbAll<{ id: number }>("SELECT id FROM homepage_content LIMIT 1")
    if (existing.length > 0) {
        return
    }

    for (const item of DEFAULT_HOMEPAGE_CONTENT) {
        await dbRun(
            "INSERT INTO homepage_content (type, title, description, image_url, link_url, link_text, position, display_order, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                item.type,
                item.title,
                item.description,
                item.image_url,
                item.link_url,
                item.link_text,
                item.position,
                item.display_order,
                1,
            ]
        )
    }
    console.log(`[seed] Homepage content seeded (${DEFAULT_HOMEPAGE_CONTENT.length} entries)`)
}

export async function runSeed(): Promise<void> {
    try {
        await seedAdmin()
        await seedHomepageContent()
    } catch (error) {
        console.error("[seed] Error during seeding:", error)
    }
}
