'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { api } from '@/lib/api-client'
import type { UserStats } from '@/types'

export function useGetStats() {
  const { data: session } = useSession()

  return useQuery({
    queryKey: ['stats'],
    queryFn: () => api.get<UserStats>('/users/me/stats', session?.accessToken),
    enabled: !!session?.accessToken,
  })
}
