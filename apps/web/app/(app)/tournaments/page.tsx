'use client'

import { Suspense, useState } from 'react'
import { Header } from '@/components/layout/header'
import { TournamentFilters } from '@/components/tournaments/tournament-filters'
import { TournamentGrid } from '@/components/tournaments/tournament-grid'
import { useGetTournaments } from '@/hooks/use-tournaments'
import { useFiltersStore } from '@/store/filters.store'

const LIMIT = 30

function TournamentsContent() {
  const [offset, setOffset] = useState(0)
  const filters = useFiltersStore()

  const { data, isLoading } = useGetTournaments({
    room: filters.room || undefined,
    types: filters.types,
    structures: filters.structures,
    buyInMin: filters.buyInMin,
    buyInMax: filters.buyInMax,
    date: filters.date,
    sortBy: filters.sortBy,
    order: filters.order,
  })

  return (
    <div className="flex gap-6">
      <TournamentFilters />
      <div className="flex-1 min-w-0">
        <TournamentGrid
          tournaments={data?.tournaments ?? []}
          total={data?.total ?? 0}
          isLoading={isLoading}
          limit={LIMIT}
          offset={offset}
          onOffsetChange={setOffset}
        />
      </div>
    </div>
  )
}

export default function TournamentsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Tournois" />
      <div className="flex-1 p-6 overflow-auto">
        <Suspense>
          <TournamentsContent />
        </Suspense>
      </div>
    </div>
  )
}
