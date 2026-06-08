'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { api } from '@/lib/api-client'
import type { FiltersState } from '@/store/filters.store'
import type { TournamentsResponse } from '@/types'

function filtersToQuery(f: Partial<FiltersState>): string {
  const p = new URLSearchParams()
  if (f.room) p.set('room', f.room)
  if (f.types?.length) f.types.forEach((t) => p.append('type', t))
  if (f.structures?.length) f.structures.forEach((s) => p.append('structure', s))
  if (f.buyInMin && f.buyInMin > 0) p.set('buyInMin', String(f.buyInMin))
  if (f.buyInMax && f.buyInMax < 500) p.set('buyInMax', String(f.buyInMax))
  if (f.date) p.set('date', f.date)
  if (f.sortBy) p.set('sortBy', f.sortBy)
  if (f.order) p.set('order', f.order)
  return p.toString()
}

export function useGetTournaments(filters: Partial<FiltersState> = {}) {
  const { data: session } = useSession()
  const qs = filtersToQuery(filters)

  return useQuery({
    queryKey: ['tournaments', filters],
    queryFn: () =>
      api.get<TournamentsResponse>(
        `/tournaments${qs ? `?${qs}` : ''}`,
        session?.accessToken,
      ),
    enabled: !!session?.accessToken,
    staleTime: 30_000,
  })
}

export function useGetTournament(id: string) {
  const { data: session } = useSession()

  return useQuery({
    queryKey: ['tournament', id],
    queryFn: () => api.get(`/tournaments/${id}`, session?.accessToken),
    enabled: !!session?.accessToken && !!id,
  })
}
