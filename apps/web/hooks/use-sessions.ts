'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { api } from '@/lib/api-client'
import type { Session, SessionSummary, SessionsResponse, SessionTournament, SessionStatus } from '@/types'

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
    queryFn: () => api.get<SessionsResponse>('/sessions', session?.accessToken),
    enabled: !!session?.accessToken,
  })
}

export function useCreateSession() {
  const { data: session } = useSession()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: { name?: string; notes?: string; tournamentIds?: string[] }) =>
      api.post<Session>('/sessions', data, session?.accessToken),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Session créée')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useUpdateSession() {
  const { data: session } = useSession()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; notes?: string; status?: SessionStatus } }) =>
      api.patch<Session>(`/sessions/${id}`, data, session?.accessToken),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['session', id] })
      qc.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Session mise à jour')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useAddTournamentToSession() {
  const { data: session } = useSession()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, tournamentId }: { sessionId: string; tournamentId: string }) =>
      api.post<SessionTournament>(`/sessions/${sessionId}/tournaments`, { tournamentId }, session?.accessToken),
    onSuccess: (_data, { sessionId }) => {
      qc.invalidateQueries({ queryKey: ['session', sessionId] })
      toast.success('Tournoi ajouté à la session')
    },
    onError: (err: Error) => toast.error(err.message),
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
      api.patch<SessionTournament>(`/sessions/${sessionId}/tournaments/${tournamentId}`, data, session?.accessToken),
    onSuccess: (_data, { sessionId }) => {
      qc.invalidateQueries({ queryKey: ['session', sessionId] })
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useDeleteSession() {
  const { data: session } = useSession()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) =>
      api.delete(`/sessions/${sessionId}`, session?.accessToken),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Session supprimée')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useCompleteSession() {
  const { data: session } = useSession()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) =>
      api.post<SessionSummary>(`/sessions/${sessionId}/complete`, {}, session?.accessToken),
    onSuccess: (_data, sessionId) => {
      qc.invalidateQueries({ queryKey: ['session', sessionId] })
      qc.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Session terminée ! Résultats enregistrés.')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
