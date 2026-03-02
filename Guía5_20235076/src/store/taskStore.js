import { create } from 'zustand'

export const useTaskStore = create((set) => ({
  tasks: [],
  loading: true,
  currentFilter: 'all',
  currentCategory: 'all',
  setTasks: (tasks) => set({ tasks, loading: false }),
  setLoading: (loading) => set({ loading }),
  setFilter: (currentFilter) => set({ currentFilter }),
  setCategory: (currentCategory) => set({ currentCategory }),
  clearTasks: () =>
    set({
      tasks: [],
      loading: false,
      currentFilter: 'all',
      currentCategory: 'all',
    }),
}))
