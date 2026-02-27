import dotenv from "dotenv"
dotenv.config()

import pg from "pg"

const isProduction = process.env.NODE_ENV === "production"

// ── PostgreSQL (Production — Render) ────────────────────────────
let pgPool: pg.Pool | null = null

if (isProduction && process.env.DATABASE_URL) {
    pgPool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    })
}

// ── SQLite (Development — Local) ─────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sqliteDb: any = null

if (!isProduction) {
    const Database = (await import("better-sqlite3")).default
    const fs = await import("fs")
    const path = await import("path")
    const dbPath = new URL("../data/juridiquepro.db", import.meta.url)
    const dataDir = path.dirname(new URL(dbPath).pathname)
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
    }
    sqliteDb = new Database(new URL(dbPath).pathname)
    sqliteDb.pragma("journal_mode = WAL")
    sqliteDb.pragma("foreign_keys = ON")
}

// ── Schema ───────────────────────────────────────────────────────
const PG_SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
`

const SQLITE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`

// ── Initialize database ─────────────────────────────────────────
export async function initializeDatabase() {
    if (isProduction && pgPool) {
        await pgPool.query(PG_SCHEMA)
        console.log("PostgreSQL tables initialized")
    } else if (sqliteDb) {
        sqliteDb.exec(SQLITE_SCHEMA)
        console.log("SQLite tables initialized")
    }
}

// ── Unified query interface ─────────────────────────────────────
export interface DbRow {
    [key: string]: unknown
}

export async function dbRun(
    query: string,
    params: unknown[] = []
): Promise<{ lastId?: number }> {
    if (isProduction && pgPool) {
        let pgQuery = query
        let idx = 0
        pgQuery = pgQuery.replace(/\?/g, () => `$${++idx}`)
        const result = await pgPool.query(pgQuery + " RETURNING id", params)
        return { lastId: result.rows[0]?.id }
    } else if (sqliteDb) {
        const stmt = sqliteDb.prepare(query)
        const result = stmt.run(...params)
        return { lastId: Number(result.lastInsertRowid) }
    }
    throw new Error("No database configured")
}

export async function dbGet<T = DbRow>(
    query: string,
    params: unknown[] = []
): Promise<T | undefined> {
    if (isProduction && pgPool) {
        let pgQuery = query
        let idx = 0
        pgQuery = pgQuery.replace(/\?/g, () => `$${++idx}`)
        const result = await pgPool.query(pgQuery, params)
        return result.rows[0] as T | undefined
    } else if (sqliteDb) {
        const stmt = sqliteDb.prepare(query)
        return stmt.get(...params) as T | undefined
    }
    throw new Error("No database configured")
}

export async function dbAll<T = DbRow>(
    query: string,
    params: unknown[] = []
): Promise<T[]> {
    if (isProduction && pgPool) {
        let pgQuery = query
        let idx = 0
        pgQuery = pgQuery.replace(/\?/g, () => `$${++idx}`)
        const result = await pgPool.query(pgQuery, params)
        return result.rows as T[]
    } else if (sqliteDb) {
        const stmt = sqliteDb.prepare(query)
        return stmt.all(...params) as T[]
    }
    throw new Error("No database configured")
}
