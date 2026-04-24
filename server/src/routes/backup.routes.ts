import { Router } from "express"
import { z } from "zod"
import { dbAll, dbGet, dbRun } from "../db.js"
import { authenticateToken, requireAdmin } from "../auth.js"

const router = Router()

router.use(authenticateToken, requireAdmin)

const BACKUP_VERSION = 1

interface BackupPayload {
    version: number
    exported_at: string
    tables: {
        users: unknown[]
        testimonials: unknown[]
        contact_messages: unknown[]
        blog_posts: unknown[]
        homepage_content: unknown[]
    }
}

// ── GET /api/admin/backup/export ──────────────────────────────
// Exports the full database content as a JSON download.
// password_hash is included so a restore can fully recover accounts.
router.get("/export", async (_req, res) => {
    try {
        const [users, testimonials, contact_messages, blog_posts, homepage_content] =
            await Promise.all([
                dbAll("SELECT * FROM users ORDER BY id ASC"),
                dbAll("SELECT * FROM testimonials ORDER BY id ASC"),
                dbAll("SELECT * FROM contact_messages ORDER BY id ASC"),
                dbAll("SELECT * FROM blog_posts ORDER BY id ASC"),
                dbAll("SELECT * FROM homepage_content ORDER BY id ASC"),
            ])

        const payload: BackupPayload = {
            version: BACKUP_VERSION,
            exported_at: new Date().toISOString(),
            tables: { users, testimonials, contact_messages, blog_posts, homepage_content },
        }

        const filename = `juridiquepro-backup-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`
        res.setHeader("Content-Type", "application/json")
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
        res.send(JSON.stringify(payload, null, 2))
    } catch (error) {
        console.error("Backup export error:", error)
        res.status(500).json({ error: "Erreur lors de l'export" })
    }
})

// ── GET /api/admin/backup/summary ─────────────────────────────
// Lightweight counts so the admin UI can display backup status.
router.get("/summary", async (_req, res) => {
    try {
        const [users, testimonials, messages, posts, content] = await Promise.all([
            dbGet<{ count: number }>("SELECT COUNT(*) as count FROM users"),
            dbGet<{ count: number }>("SELECT COUNT(*) as count FROM testimonials"),
            dbGet<{ count: number }>("SELECT COUNT(*) as count FROM contact_messages"),
            dbGet<{ count: number }>("SELECT COUNT(*) as count FROM blog_posts"),
            dbGet<{ count: number }>("SELECT COUNT(*) as count FROM homepage_content"),
        ])

        res.json({
            counts: {
                users: users?.count || 0,
                testimonials: testimonials?.count || 0,
                contact_messages: messages?.count || 0,
                blog_posts: posts?.count || 0,
                homepage_content: content?.count || 0,
            },
        })
    } catch (error) {
        console.error("Backup summary error:", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

// ── POST /api/admin/backup/import ─────────────────────────────
// Restores from a backup payload. By default, only inserts rows
// whose IDs don't already exist (safe merge). Pass { replace: true }
// to wipe existing data first.
const importSchema = z.object({
    payload: z.object({
        version: z.number(),
        exported_at: z.string().optional(),
        tables: z.object({
            users: z.array(z.record(z.string(), z.unknown())),
            testimonials: z.array(z.record(z.string(), z.unknown())),
            contact_messages: z.array(z.record(z.string(), z.unknown())),
            blog_posts: z.array(z.record(z.string(), z.unknown())),
            homepage_content: z.array(z.record(z.string(), z.unknown())),
        }),
    }),
    replace: z.boolean().optional().default(false),
})

const TABLES_ORDER = [
    "users",
    "testimonials",
    "contact_messages",
    "blog_posts",
    "homepage_content",
] as const

async function insertRow(table: string, row: Record<string, unknown>): Promise<void> {
    const columns = Object.keys(row)
    if (columns.length === 0) return
    const placeholders = columns.map(() => "?").join(", ")
    const values = columns.map((c) => row[c])
    await dbRun(
        `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`,
        values as unknown[]
    )
}

router.post("/import", async (req, res) => {
    try {
        const parsed = importSchema.safeParse(req.body)
        if (!parsed.success) {
            res.status(400).json({
                error: "Payload invalide",
                details: parsed.error.flatten().fieldErrors,
            })
            return
        }

        const { payload, replace } = parsed.data

        if (payload.version !== BACKUP_VERSION) {
            res.status(400).json({
                error: `Version de backup non supportée (attendue: ${BACKUP_VERSION}, reçue: ${payload.version})`,
            })
            return
        }

        if (replace) {
            for (const table of [...TABLES_ORDER].reverse()) {
                await dbRun(`DELETE FROM ${table}`)
            }
        }

        const inserted: Record<string, number> = {}
        const skipped: Record<string, number> = {}

        for (const table of TABLES_ORDER) {
            const rows = payload.tables[table] as Array<Record<string, unknown>>
            inserted[table] = 0
            skipped[table] = 0
            for (const row of rows) {
                if (!replace && row.id != null) {
                    const existing = await dbGet<{ id: number }>(
                        `SELECT id FROM ${table} WHERE id = ?`,
                        [row.id as number]
                    )
                    if (existing) {
                        skipped[table]++
                        continue
                    }
                }
                try {
                    await insertRow(table, row)
                    inserted[table]++
                } catch (err) {
                    console.error(`[backup import] failed to insert into ${table}:`, err)
                    skipped[table]++
                }
            }
        }

        res.json({
            message: replace ? "Restauration complète terminée" : "Import partiel terminé",
            inserted,
            skipped,
        })
    } catch (error) {
        console.error("Backup import error:", error)
        res.status(500).json({ error: "Erreur lors de l'import" })
    }
})

export default router
