import { create } from 'zustand'

export interface Person {
  id: number
  name: string
  ageInHours: number | null
  /** Path relative to BASE_URL (e.g. "avatars/1.png"), or null for the generic fallback. */
  avatarUrl: string | null
}

interface AppState {
  people: Person[]
  minimumAgeInMonths: number | null
  updatePersonAge: (id: number, ageInHours: number | null) => void
  setMinimumAgeInMonths: (months: number | null) => void
}

export const useStore = create<AppState>((set) => ({
  people: [
    { id: 1, name: 'Alice', ageInHours: 262800, avatarUrl: 'avatars/alice.png' },
    { id: 2, name: 'Bob', ageInHours: 350400, avatarUrl: 'avatars/bob.png' },
    { id: 3, name: 'Charlie', ageInHours: 219000, avatarUrl: 'avatars/charlie.png' },
  ],
  minimumAgeInMonths: null,
  updatePersonAge: (id, ageInHours) =>
    set((state) => ({
      people: state.people.map((p) => (p.id === id ? { ...p, ageInHours } : p)),
    })),
  setMinimumAgeInMonths: (months) => set({ minimumAgeInMonths: months }),
}))
