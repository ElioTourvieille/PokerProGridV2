'use client'

import { create } from 'zustand'
import type { TournamentRoom, TournamentType, TournamentStructure } from '@/types'

export interface FiltersState {
  room: TournamentRoom | ''
  types: TournamentType[]
  structures: TournamentStructure[]
  buyInMin: number
  buyInMax: number
  date: string
  sortBy: 'startTime' | 'buyIn' | 'evScore' | 'overlayAmount'
  order: 'asc' | 'desc'
}

interface FiltersStore extends FiltersState {
  setRoom: (room: TournamentRoom | '') => void
  toggleType: (type: TournamentType) => void
  toggleStructure: (structure: TournamentStructure) => void
  setBuyInRange: (min: number, max: number) => void
  setDate: (date: string) => void
  setSortBy: (sortBy: FiltersState['sortBy']) => void
  setOrder: (order: FiltersState['order']) => void
  reset: () => void
  toQueryString: () => string
}

const DEFAULT: FiltersState = {
  room: '',
  types: [],
  structures: [],
  buyInMin: 0,
  buyInMax: 500,
  date: '',
  sortBy: 'startTime',
  order: 'asc',
}

export const useFiltersStore = create<FiltersStore>((set, get) => ({
  ...DEFAULT,

  setRoom: (room) => set({ room }),
  toggleType: (type) =>
    set((s) => ({
      types: s.types.includes(type) ? s.types.filter((t) => t !== type) : [...s.types, type],
    })),
  toggleStructure: (structure) =>
    set((s) => ({
      structures: s.structures.includes(structure)
        ? s.structures.filter((t) => t !== structure)
        : [...s.structures, structure],
    })),
  setBuyInRange: (min, max) => set({ buyInMin: min, buyInMax: max }),
  setDate: (date) => set({ date }),
  setSortBy: (sortBy) => set({ sortBy }),
  setOrder: (order) => set({ order }),
  reset: () => set(DEFAULT),

  toQueryString: () => {
    const s = get()
    const params = new URLSearchParams()
    if (s.room) params.set('room', s.room)
    s.types.forEach((t) => params.append('type', t))
    s.structures.forEach((s) => params.append('structure', s))
    if (s.buyInMin > 0) params.set('buyInMin', String(s.buyInMin))
    if (s.buyInMax < 500) params.set('buyInMax', String(s.buyInMax))
    if (s.date) params.set('date', s.date)
    params.set('sortBy', s.sortBy)
    params.set('order', s.order)
    return params.toString()
  },
}))
