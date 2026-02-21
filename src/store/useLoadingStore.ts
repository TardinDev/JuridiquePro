import { create } from "zustand"

interface LoadingStore {
  isLoading: boolean
  isFirstLoad: boolean
  setLoading: (value: boolean) => void
  setFirstLoad: (value: boolean) => void
}

export const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: true,
  isFirstLoad: true,
  setLoading: (value) => set({ isLoading: value }),
  setFirstLoad: (value) => set({ isFirstLoad: value }),
}))
