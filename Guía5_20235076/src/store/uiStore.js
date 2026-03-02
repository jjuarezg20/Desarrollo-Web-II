import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      sidebarOpen: false,
      toggleTheme: () =>
        set({
          theme: get().theme === 'light' ? 'dark' : 'light',
        }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: 'task-manager-ui',
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
)
