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

    const contentType = res.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
        throw new Error("Le serveur est temporairement indisponible. Veuillez réessayer.")
    }

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
    role?: string
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
    status?: string
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

// ── Contact API ─────────────────────────────────────────────────

export async function apiSubmitContact(data: {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
}): Promise<{ message: string }> {
    return apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify(data),
    })
}

// ── Blog API ────────────────────────────────────────────────────

export interface ApiBlogPost {
    id: number
    title: string
    slug: string
    excerpt: string
    content?: string
    category: string
    read_time: string
    author_name?: string
    status?: string
    published_at: string | null
    created_at?: string
}

export async function apiGetBlogPosts(): Promise<ApiBlogPost[]> {
    const data = await apiFetch<{ posts: ApiBlogPost[] }>("/blog")
    return data.posts
}

export async function apiGetBlogPost(slug: string): Promise<ApiBlogPost> {
    const data = await apiFetch<{ post: ApiBlogPost }>(`/blog/${slug}`)
    return data.post
}

// ── Admin API ───────────────────────────────────────────────────

export interface AdminStats {
    totalUsers: number
    pendingTestimonials: number
    unreadMessages: number
    totalPosts: number
}

export async function apiGetAdminStats(): Promise<AdminStats> {
    const data = await apiFetch<{ stats: AdminStats }>("/admin/stats")
    return data.stats
}

export async function apiGetAdminTestimonials(): Promise<ApiTestimonial[]> {
    const data = await apiFetch<{ testimonials: ApiTestimonial[] }>("/admin/testimonials")
    return data.testimonials
}

export async function apiUpdateTestimonialStatus(
    id: number,
    status: "approved" | "rejected"
): Promise<void> {
    await apiFetch(`/admin/testimonials/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    })
}

export async function apiDeleteTestimonial(id: number): Promise<void> {
    await apiFetch(`/admin/testimonials/${id}`, { method: "DELETE" })
}

export interface ApiContactMessage {
    id: number
    name: string
    email: string
    phone: string | null
    subject: string
    message: string
    status: string
    created_at: string
}

export async function apiGetAdminContacts(): Promise<ApiContactMessage[]> {
    const data = await apiFetch<{ messages: ApiContactMessage[] }>("/contact")
    return data.messages
}

export async function apiUpdateContactStatus(
    id: number,
    status: "read" | "archived"
): Promise<void> {
    await apiFetch(`/contact/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    })
}

// Admin blog
export async function apiGetAdminBlogPosts(): Promise<ApiBlogPost[]> {
    const data = await apiFetch<{ posts: ApiBlogPost[] }>("/blog/admin/all")
    return data.posts
}

export async function apiCreateBlogPost(post: {
    title: string
    slug: string
    excerpt: string
    content: string
    category: string
    read_time?: string
    status?: string
}): Promise<{ post: { id: number } }> {
    return apiFetch("/blog", {
        method: "POST",
        body: JSON.stringify(post),
    })
}

export async function apiUpdateBlogPost(
    id: number,
    post: {
        title: string
        slug: string
        excerpt: string
        content: string
        category: string
        read_time?: string
        status?: string
    }
): Promise<void> {
    await apiFetch(`/blog/${id}`, {
        method: "PUT",
        body: JSON.stringify(post),
    })
}

export async function apiDeleteBlogPost(id: number): Promise<void> {
    await apiFetch(`/blog/${id}`, { method: "DELETE" })
}
