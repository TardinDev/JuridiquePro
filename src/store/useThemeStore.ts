import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ThemeStore {
  isDark: boolean
  toggle: () => void
  setDark: (value: boolean) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,
      toggle: () =>
        set((state) => {
          const next = !state.isDark
          document.documentElement.classList.toggle("dark", next)
          return { isDark: next }
        }),
      setDark: (value) =>
        set(() => {
          document.documentElement.classList.toggle("dark", value)
          return { isDark: value }
        }),
    }),
    {
      name: "jp-theme",
      onRehydrateStorage: () => (state) => {
        if (state?.isDark) {
          document.documentElement.classList.add("dark")
        }
      },
    }
  )
)
