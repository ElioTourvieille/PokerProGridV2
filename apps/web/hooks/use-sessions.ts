'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { api } from '@/lib/api-client'
import type { Session, SessionTournament } from '@/types'

export function useGetSession(id: string) {
  const { data: session } = useSession()

  return useQuery({
    queryKey: ['session', id],
    queryFn: () => api.get<Session>(`/sessions/${id}`, session?.accessToken),
    enabled: !!session?.accessToken && !!id,
  })
}

export function useGetSessions() {
  const { data: session } = useSession()

  return useQuery({
    queryKey: ['sessions'],
    queryFn: () => api.get<{ sessions: Session[] }>('/sessions', session?.accessToken),
    enabled: !!session?.accessToken,
  })
}

export function useCreateSession() {
  const { data: session } = useSession()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: { name?: string; tournamentIds: string[] }) =>
      api.post<Session>('/sessions', data, session?.accessToken),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sessions'] }),
  })
}

export function useAddTournamentToSession() {
  const { data: session } = useSession()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, tournamentId, buyIn }: { sessionId: string; tournamentId: string; buyIn: number }) =>
      api.post<SessionTournament>(
        `/sessions/${sessionId}/tournaments`,
        { tournamentId, buyIn },
        session?.accessToken,
      ),
    onSuccess: (_data, { sessionId }) => {
      qc.invalidateQueries({ queryKey: ['session', sessionId] })
    },
  })
}

export function useUpdateSessionTournament() {
  const { data: session } = useSession()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      sessionId,
      tournamentId,
      data,
    }: {
      sessionId: string
      tournamentId: string
      data: Partial<Pick<SessionTournament, 'status' | 'position' | 'totalPlayers' | 'cashout' | 'rebuys' | 'addOns' | 'notes'>>
    }) =>
      api.patch<SessionTournament>(
        `/sessions/${sessionId}/tournaments/${tournamentId}`,
        data,
        session?.accessToken,
      ),
    onSuccess: (_data, { sessionId }) => {
      qc.invalidateQueries({ queryKey: ['session', sessionId] })
    },
  })
}
