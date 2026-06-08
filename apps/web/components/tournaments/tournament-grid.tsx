'use client'

import { TournamentCard } from './tournament-card'
import type { Tournament } from '@/types'

function SkeletonCard() {
  return (
    <div className="card-surface p-4 animate-pulse space-y-3">
      <div className="flex justify-between gap-2">
        <div className="space-y-1.5 flex-1">
          <div className="h-4 bg-surface-container rounded w-3/4" />
          <div className="h-3 bg-surface-container rounded w-1/4" />
        </div>
        <div className="flex gap-1">
          <div className="h-5 w-14 bg-surface-container rounded" />
          <div className="h-5 w-14 bg-surface-container rounded" />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="h-8 w-16 bg-surface-container rounded" />
        <div className="h-8 w-16 bg-surface-container rounded" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-border">
        <div className="h-3 w-12 bg-surface-container rounded" />
        <div className="h-6 w-20 bg-surface-container rounded" />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="text-4xl mb-4">🎯</div>
      <p className="text-on-surface font-semibold mb-1">Aucun tournoi trouvé</p>
      <p className="text-sm text-muted-foreground">Essayez d&apos;ajuster vos filtres</p>
    </div>
  )
}

interface TournamentGridProps {
  tournaments: Tournament[]
  total: number
  isLoading: boolean
  limit: number
  offset: number
  onOffsetChange: (offset: number) => void
}

export function TournamentGrid({
  tournaments,
  total,
  isLoading,
  limit,
  offset,
  onOffsetChange,
}: TournamentGridProps) {
  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-4">
      {/* Count */}
      {!isLoading && (
        <p className="text-xs text-muted-foreground font-mono">
          {total} tournoi{total !== 1 ? 's' : ''}
          {total > limit && ` — page ${page}/${totalPages}`}
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : tournaments.length === 0
            ? <EmptyState />
            : tournaments.map((t) => <TournamentCard key={t.id} tournament={t} />)}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            disabled={offset === 0}
            onClick={() => onOffsetChange(Math.max(0, offset - limit))}
            className="px-3 py-1.5 text-xs rounded border border-border text-on-surface-variant hover:text-on-surface hover:border-electric-blue/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Précédent
          </button>
          <span className="text-xs font-mono text-muted-foreground">
            {page} / {totalPages}
          </span>
          <button
            disabled={offset + limit >= total}
            onClick={() => onOffsetChange(offset + limit)}
            className="px-3 py-1.5 text-xs rounded border border-border text-on-surface-variant hover:text-on-surface hover:border-electric-blue/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  )
}
