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

// ── Contact Delete ─────────────────────────────────────────────

export async function apiDeleteContact(id: number): Promise<void> {
    await apiFetch(`/contact/${id}`, { method: "DELETE" })
}

// ── Recent Activity ────────────────────────────────────────────

export interface RecentActivity {
    recentMessages: Array<{
        id: number
        name: string
        subject: string
        status: string
        created_at: string
    }>
    recentTestimonials: Array<{
        id: number
        name: string
        content: string
        rating: number
        status: string
        created_at: string
    }>
}

export async function apiGetRecentActivity(): Promise<RecentActivity> {
    return apiFetch<RecentActivity>("/admin/recent-activity")
}

// ── User Management ────────────────────────────────────────────

export interface ApiUser {
    id: number
    full_name: string
    email: string
    role: string
    created_at: string
}

export async function apiGetAdminUsers(): Promise<ApiUser[]> {
    const data = await apiFetch<{ users: ApiUser[] }>("/admin/users")
    return data.users
}

export async function apiUpdateUserRole(
    id: number,
    role: "user" | "admin"
): Promise<void> {
    await apiFetch(`/admin/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
    })
}

export async function apiDeleteUser(id: number): Promise<void> {
    await apiFetch(`/admin/users/${id}`, { method: "DELETE" })
}

// ── Image Upload ───────────────────────────────────────────────

export async function apiUploadImage(file: File): Promise<string> {
    const token = localStorage.getItem("jp_token")
    const formData = new FormData()
    formData.append("image", file)

    const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Erreur lors de l'upload")
    return data.url as string
}

// ── Homepage Content ───────────────────────────────────────────

export interface HomepageContentItem {
    id: number
    type: "announcement" | "promotion" | "partner_ad"
    title: string
    description: string | null
    image_url: string | null
    link_url: string | null
    link_text: string | null
    position: string
    display_order: number
    active: number | boolean
    created_at: string
}

export async function apiGetHomepageContent(): Promise<Record<string, HomepageContentItem[]>> {
    const data = await apiFetch<{ content: Record<string, HomepageContentItem[]> }>("/content")
    return data.content
}

export async function apiGetAdminContent(): Promise<HomepageContentItem[]> {
    const data = await apiFetch<{ content: HomepageContentItem[] }>("/content/admin")
    return data.content
}

export async function apiCreateContent(content: {
    type: string
    title: string
    description?: string
    image_url?: string
    link_url?: string
    link_text?: string
    position: string
    display_order?: number
    active?: boolean
}): Promise<{ id: number }> {
    return apiFetch("/content/admin", {
        method: "POST",
        body: JSON.stringify(content),
    })
}

export async function apiUpdateContent(
    id: number,
    content: {
        type: string
        title: string
        description?: string
        image_url?: string
        link_url?: string
        link_text?: string
        position: string
        display_order?: number
        active?: boolean
    }
): Promise<void> {
    await apiFetch(`/content/admin/${id}`, {
        method: "PUT",
        body: JSON.stringify(content),
    })
}

export async function apiToggleContent(id: number): Promise<{ active: boolean }> {
    return apiFetch(`/content/admin/${id}/toggle`, { method: "PATCH" })
}

export async function apiDeleteContent(id: number): Promise<void> {
    await apiFetch(`/content/admin/${id}`, { method: "DELETE" })
}

// ── Backup API ──────────────────────────────────────────────

export interface BackupSummary {
    counts: {
        users: number
        testimonials: number
        contact_messages: number
        blog_posts: number
        homepage_content: number
    }
}

export async function apiGetBackupSummary(): Promise<BackupSummary> {
    return apiFetch("/backup/summary")
}

export async function apiDownloadBackup(): Promise<void> {
    const token = getToken()
    const res = await fetch(`${API_BASE}/backup/export`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) {
        throw new Error("Échec de l'export du backup")
    }
    const blob = await res.blob()
    const disposition = res.headers.get("content-disposition") || ""
    const match = disposition.match(/filename="?([^"]+)"?/)
    const filename = match?.[1] || `juridiquepro-backup-${new Date().toISOString().slice(0, 10)}.json`

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}

export async function apiRestoreBackup(
    payload: unknown,
    replace: boolean
): Promise<{ inserted: Record<string, number>; skipped: Record<string, number>; message: string }> {
    return apiFetch("/backup/import", {
        method: "POST",
        body: JSON.stringify({ payload, replace }),
    })
}
