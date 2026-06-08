'use client'

import { Clock, Plus, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSessionStore } from '@/store/session.store'
import type { Tournament } from '@/types'

const TYPE_LABEL: Record<string, string> = {
  CLASSIC: 'Classic',
  KNOCKOUT: 'KO',
  PROGRESSIVE_KNOCKOUT: 'PKO',
  FLIGHT: 'Flight',
}

const STRUCTURE_LABEL: Record<string, string> = {
  NORMAL: 'Normal',
  DEEP_STACK: 'Deep',
  TURBO: 'Turbo',
  HYPER_TURBO: 'Hyper',
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return null
  const color =
    score >= 60
      ? 'bg-success/15 text-success'
      : score >= 40
        ? 'bg-warning/15 text-warning'
        : 'bg-danger/15 text-danger'
  return (
    <span className={cn('text-xs font-mono font-semibold px-2 py-0.5 rounded shrink-0', color)}>
      {score.toFixed(0)}
    </span>
  )
}

function FillBar({ registered, max }: { registered: number; max: number | null }) {
  if (!max || registered === 0) return null
  const pct = Math.min((registered / max) * 100, 100)
  const color = pct >= 90 ? 'bg-danger' : pct >= 70 ? 'bg-warning' : 'bg-electric-blue'
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span className="font-mono">{registered}/{max}</span>
        <span className="font-mono">{pct.toFixed(0)}%</span>
      </div>
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const { addItem, removeItem, hasItem } = useSessionStore()
  const inSession = hasItem(tournament.id)

  const startTime = new Date(tournament.startTime)
  const timeStr = startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const handleToggle = () => {
    if (inSession) {
      removeItem(tournament.id)
    } else {
      addItem({
        id: tournament.id,
        name: tournament.name,
        room: tournament.room,
        buyIn: tournament.buyIn,
        startTime: tournament.startTime,
        type: tournament.type,
        structure: tournament.structure,
      })
    }
  }

  return (
    <div
      className={cn(
        'card-surface p-4 hover:border-electric-blue/30 transition-colors group',
        inSession && 'border-electric-blue/40 glow-blue-sm',
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-on-surface truncate">{tournament.name}</p>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">{tournament.room}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
            {TYPE_LABEL[tournament.type] ?? tournament.type}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
            {STRUCTURE_LABEL[tournament.structure] ?? tournament.structure}
          </span>
        </div>
      </div>

      {/* Buy-in + guarantee row */}
      <div className="flex items-center gap-4 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Buy-in</p>
          <p className="font-mono font-semibold text-on-surface">
            {tournament.buyIn.toFixed(2)}€
          </p>
        </div>
        {tournament.guaranteed > 0 && (
          <div>
            <p className="text-xs text-muted-foreground">Garantie</p>
            <p className="font-mono font-semibold text-on-surface">
              {(tournament.guaranteed / 1000).toFixed(0)}k€
            </p>
          </div>
        )}
        {tournament.overlayAmount !== null && tournament.overlayAmount > 0 && (
          <div>
            <p className="text-xs text-muted-foreground">Overlay</p>
            <p className="font-mono font-semibold text-success">
              +{(tournament.overlayAmount / 1000).toFixed(1)}k€
            </p>
          </div>
        )}
      </div>

      <FillBar registered={tournament.registeredPlayers} max={tournament.maxPlayers} />

      {/* Footer row */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="font-mono">{timeStr}</span>
          </span>
          {tournament.registeredPlayers > 0 && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span className="font-mono">{tournament.registeredPlayers}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ScoreBadge score={tournament.evScore} />
          <button
            onClick={handleToggle}
            className={cn(
              'flex items-center gap-1 text-xs px-2.5 py-1 rounded transition-colors font-medium',
              inSession
                ? 'bg-electric-blue/20 text-primary hover:bg-electric-blue/30'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
            )}
          >
            <Plus className={cn('w-3 h-3 transition-transform', inSession && 'rotate-45')} />
            {inSession ? 'Ajouté' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}
