// ── API Helper for JuridiquePro ─────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "/api"

function getToken(): string | null {
    return localStorage.getItem("jp_token")
}

export function setToken(token: string) {
    localStorage.setItem("jp_token", token)
}

export function removeToken() {
    localStorage.removeItem("jp_token")
}

async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken()

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue")
    }

    return data as T
}

// ── Auth API ────────────────────────────────────────────────────

export interface AuthUser {
    id: number
    fullName: string
    email: string
}

interface AuthResponse {
    token: string
    user: AuthUser
}

interface MeResponse {
    user: AuthUser & { createdAt: string }
}

export async function apiRegister(
    fullName: string,
    email: string,
    password: string
): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password }),
    })
}

export async function apiLogin(
    email: string,
    password: string
): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    })
}

export async function apiGetMe(): Promise<MeResponse> {
    return apiFetch<MeResponse>("/auth/me")
}

// ── Testimonials API ────────────────────────────────────────────

export interface ApiTestimonial {
    id: number
    name: string
    role: string
    content: string
    rating: number
    created_at: string
}

interface TestimonialsResponse {
    testimonials: ApiTestimonial[]
}

export async function apiGetTestimonials(): Promise<ApiTestimonial[]> {
    const data = await apiFetch<TestimonialsResponse>("/testimonials")
    return data.testimonials
}

export async function apiSubmitTestimonial(testimonial: {
    name: string
    role: string
    content: string
    rating: number
}): Promise<{ message: string }> {
    return apiFetch("/testimonials", {
        method: "POST",
        body: JSON.stringify(testimonial),
    })
}
