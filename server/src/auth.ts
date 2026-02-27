import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"
import { dbGet } from "./db.js"

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production"
const JWT_EXPIRES_IN = "7d"

export interface JwtPayload {
    userId: number
    email: string
}

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload
}

export function signToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
}

export function authenticateToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

    if (!token) {
        res.status(401).json({ error: "Token d'authentification requis" })
        return
    }

    try {
        const decoded = verifyToken(token)
        req.user = decoded
        next()
    } catch {
        res.status(403).json({ error: "Token invalide ou expiré" })
        return
    }
}

export async function requireAdmin(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user = await dbGet<{ role: string }>(
            "SELECT role FROM users WHERE id = ?",
            [req.user!.userId]
        )

        if (!user || user.role !== "admin") {
            res.status(403).json({ error: "Accès réservé aux administrateurs" })
            return
        }

        next()
    } catch {
        res.status(500).json({ error: "Erreur serveur" })
    }
}
