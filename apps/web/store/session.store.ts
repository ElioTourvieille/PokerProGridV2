'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TournamentType, TournamentStructure } from '@/types'

export interface SessionItem {
  id: string
  name: string
  room: string
  buyIn: number
  startTime: string
  type: TournamentType
  structure: TournamentStructure
}

const ESTIMATED_DURATION_MS = 3 * 60 * 60 * 1000 // 3 hours

function hasOverlap(a: SessionItem, b: SessionItem): boolean {
  const aStart = new Date(a.startTime).getTime()
  const aEnd = aStart + ESTIMATED_DURATION_MS
  const bStart = new Date(b.startTime).getTime()
  const bEnd = bStart + ESTIMATED_DURATION_MS
  return aStart < bEnd && bStart < aEnd
}

interface SessionStore {
  items: SessionItem[]
  lastGrid: SessionItem[]
  addItem: (item: SessionItem) => void
  removeItem: (id: string) => void
  clearSession: () => void
  saveLastGrid: () => void
  restoreLastGrid: () => void
  totalBuyIn: () => number
  overlappingIds: () => Set<string>
  hasItem: (id: string) => boolean
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      items: [],
      lastGrid: [],

      addItem: (item) =>
        set((s) => {
          if (s.items.find((i) => i.id === item.id)) return s
          return { items: [...s.items, item] }
        }),

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      clearSession: () => set({ items: [] }),

      saveLastGrid: () => set((s) => ({ lastGrid: [...s.items] })),

      restoreLastGrid: () => set((s) => ({ items: [...s.lastGrid] })),

      totalBuyIn: () => get().items.reduce((sum, i) => sum + i.buyIn, 0),

      overlappingIds: () => {
        const items = get().items
        const ids = new Set<string>()
        for (let i = 0; i < items.length; i++) {
          for (let j = i + 1; j < items.length; j++) {
            if (hasOverlap(items[i], items[j])) {
              ids.add(items[i].id)
              ids.add(items[j].id)
            }
          }
        }
        return ids
      },

      hasItem: (id) => get().items.some((i) => i.id === id),
    }),
    { name: 'pokerprogrid-session' },
  ),
)
