import { create } from "zustand"
import {
    apiLogin,
    apiRegister,
    apiGetMe,
    setToken,
    removeToken,
    type AuthUser,
} from "@/lib/api"

interface AuthState {
    user: AuthUser | null
    loading: boolean
    initialized: boolean

    login: (email: string, password: string) => Promise<void>
    register: (fullName: string, email: string, password: string) => Promise<void>
    logout: () => void
    checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: false,
    initialized: false,

    login: async (email, password) => {
        set({ loading: true })
        try {
            const { token, user } = await apiLogin(email, password)
            setToken(token)
            set({ user, loading: false })
        } catch (error) {
            set({ loading: false })
            throw error
        }
    },

    register: async (fullName, email, password) => {
        set({ loading: true })
        try {
            const { token, user } = await apiRegister(fullName, email, password)
            setToken(token)
            set({ user, loading: false })
        } catch (error) {
            set({ loading: false })
            throw error
        }
    },

    logout: () => {
        removeToken()
        set({ user: null })
    },

    checkAuth: async () => {
        const token = localStorage.getItem("jp_token")
        if (!token) {
            set({ initialized: true })
            return
        }

        try {
            const { user } = await apiGetMe()
            set({ user, initialized: true })
        } catch {
            removeToken()
            set({ user: null, initialized: true })
        }
    },
}))
