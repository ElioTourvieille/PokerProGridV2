'use client'

import { useState } from 'react'
import { AlertTriangle, Check, Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSessionStore } from '@/store/session.store'
import { useCreateSession } from '@/hooks/use-sessions'
import { cn } from '@/lib/utils'

// Timeline config: 6h → 24h (18 hours = 1080 min), 1.5px/min
const TIMELINE_START_H = 6
const PX_PER_MIN = 1.5
const ESTIMATED_DURATION_MIN = 180 // 3h per tournament
const TIMELINE_WIDTH = (24 - TIMELINE_START_H) * 60 * PX_PER_MIN

function timeToOffset(isoTime: string): number {
  const d = new Date(isoTime)
  const minutes = d.getHours() * 60 + d.getMinutes()
  return Math.max(0, (minutes - TIMELINE_START_H * 60) * PX_PER_MIN)
}

const TYPE_ABBR: Record<string, string> = {
  CLASSIC: 'CL', KNOCKOUT: 'KO', PROGRESSIVE_KNOCKOUT: 'PKO', FLIGHT: 'FL',
}

export function SessionBuilder() {
  const { items, removeItem, clearSession, totalBuyIn, overlappingIds } = useSessionStore()
  const createSession = useCreateSession()
  const router = useRouter()
  const overlaps = overlappingIds()
  const [sessionName, setSessionName] = useState('')

  if (items.length === 0) {
    return (
      <div className="card-surface p-8 text-center space-y-2">
        <p className="text-3xl">🃏</p>
        <p className="text-sm font-semibold text-on-surface">Grille vide</p>
        <p className="text-xs text-muted-foreground">
          Ajoutez des tournois depuis la page Tournois
        </p>
      </div>
    )
  }

  const handleValidate = () => {
    createSession.mutate(
      { name: sessionName.trim() || undefined, tournamentIds: items.map((i) => i.id) },
      {
        onSuccess: (session) => {
          clearSession()
          setSessionName('')
          router.push(`/sessions/${session.id}`)
        },
      },
    )
  }

  return (
    <div className="card-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-on-surface">Grille en cours</h2>
          <span className="text-xs font-mono text-muted-foreground">
            {items.length} tournoi{items.length !== 1 ? 's' : ''} ·{' '}
            <span className="text-on-surface">{totalBuyIn().toFixed(2)}€</span>
          </span>
          {overlaps.size > 0 && (
            <span className="flex items-center gap-1 text-xs text-warning">
              <AlertTriangle className="w-3 h-3" />
              {overlaps.size} chevauchement{overlaps.size !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button onClick={clearSession} className="text-xs text-muted-foreground hover:text-danger transition-colors flex items-center gap-1">
          <Trash2 className="w-3 h-3" /> Vider
        </button>
      </div>

      {/* Timeline */}
      <div className="px-4 py-3 border-b border-border overflow-x-auto">
        <div className="relative" style={{ width: TIMELINE_WIDTH, height: 60 + items.length * 28 }}>
          {/* Hour ticks */}
          {Array.from({ length: 24 - TIMELINE_START_H + 1 }, (_, i) => {
            const h = TIMELINE_START_H + i
            return (
              <div
                key={h}
                className="absolute top-0 bottom-0 border-l border-border"
                style={{ left: i * 60 * PX_PER_MIN }}
              >
                <span className="absolute -top-0.5 left-1 text-xs font-mono text-muted-foreground whitespace-nowrap">
                  {h < 24 ? `${String(h).padStart(2, '0')}h` : '00h'}
                </span>
              </div>
            )
          })}

          {/* Tournament bars */}
          {items.map((item, idx) => {
            const left = timeToOffset(item.startTime)
            const width = ESTIMATED_DURATION_MIN * PX_PER_MIN
            const top = 24 + idx * 28
            const isOverlap = overlaps.has(item.id)
            return (
              <div
                key={item.id}
                className={cn(
                  'absolute flex items-center px-2 rounded text-xs font-medium truncate select-none',
                  isOverlap
                    ? 'bg-warning/20 border border-warning/50 text-warning'
                    : 'bg-electric-blue/15 border border-electric-blue/30 text-primary',
                )}
                style={{ left, width: Math.max(width, 60), height: 22, top }}
                title={`${item.name} — ${new Date(item.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
              >
                <span className="opacity-60 mr-1">{TYPE_ABBR[item.type]}</span>
                {item.name}
              </div>
            )
          })}
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-border max-h-64 overflow-y-auto">
        {items.map((item) => {
          const isOverlap = overlaps.has(item.id)
          const timeStr = new Date(item.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
          return (
            <div key={item.id} className={cn('flex items-center justify-between px-4 py-2.5', isOverlap && 'bg-warning/5')}>
              <div className="flex items-center gap-3 min-w-0">
                {isOverlap ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                )}
                <span className="text-sm text-on-surface truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-2">
                <span className="font-mono text-xs text-muted-foreground">{timeStr}</span>
                <span className="font-mono text-xs font-semibold text-on-surface">{item.buyIn.toFixed(2)}€</span>
                <button onClick={() => removeItem(item.id)} className="p-1 rounded hover:bg-danger/15 text-muted-foreground hover:text-danger transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-4 py-3 border-t border-border bg-surface-elevated">
        <div className="text-sm font-mono shrink-0">
          <span className="text-muted-foreground">Total : </span>
          <span className="font-bold text-on-surface">{totalBuyIn().toFixed(2)}€</span>
        </div>
        <input
          type="text"
          placeholder="Nom de la session (optionnel)"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
          className="flex-1 text-sm bg-surface-container border border-border rounded px-3 py-1.5 text-on-surface placeholder:text-muted-foreground focus:outline-none focus:border-electric-blue min-w-0"
        />
        <button
          onClick={handleValidate}
          disabled={createSession.isPending}
          className="shrink-0 bg-electric-blue text-white text-sm font-semibold px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {createSession.isPending ? 'Création…' : 'Valider la session'}
        </button>
      </div>
    </div>
  )
}
