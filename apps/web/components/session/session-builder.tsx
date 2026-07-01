'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Check, Layers, Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useSessionStore } from '@/store/session.store'
import { useCreateSession } from '@/hooks/use-sessions'
import { cn } from '@/lib/utils'

const TIMELINE_START_H = 6
const PX_PER_MIN = 1.5
const ESTIMATED_DURATION_MIN = 180
const TIMELINE_WIDTH = (24 - TIMELINE_START_H) * 60 * PX_PER_MIN

function timeToOffset(isoTime: string): number {
  const d = new Date(isoTime)
  const minutes = d.getHours() * 60 + d.getMinutes()
  return Math.max(0, (minutes - TIMELINE_START_H * 60) * PX_PER_MIN)
}

function nowToOffset(): number | null {
  const now = new Date()
  const minutes = now.getHours() * 60 + now.getMinutes()
  const offset = (minutes - TIMELINE_START_H * 60) * PX_PER_MIN
  if (offset < 0 || offset > TIMELINE_WIDTH) return null
  return offset
}

const TYPE_ABBR: Record<string, string> = {
  CLASSIC: 'CL', KNOCKOUT: 'KO', PROGRESSIVE_KNOCKOUT: 'PKO', FLIGHT: 'FL',
}

const TYPE_LEGEND = [
  { abbr: 'CL', label: 'Classic' },
  { abbr: 'KO', label: 'Knockout' },
  { abbr: 'PKO', label: 'Progressive KO' },
  { abbr: 'FL', label: 'Flight' },
]

export function SessionBuilder() {
  const { items, lastGrid, addItem, removeItem, clearSession, saveLastGrid, restoreLastGrid, totalBuyIn, overlappingIds } = useSessionStore()
  const createSession = useCreateSession()
  const router = useRouter()
  const overlaps = overlappingIds()
  const [sessionName, setSessionName] = useState('')
  const [nowOffset, setNowOffset] = useState<number | null>(() => nowToOffset())

  useEffect(() => {
    const timer = setInterval(() => setNowOffset(nowToOffset()), 60_000)
    return () => clearInterval(timer)
  }, [])

  if (items.length === 0) {
    return (
      <div className="card-surface p-8 text-center space-y-2">
        <Layers className="w-8 h-8 mx-auto text-muted-foreground opacity-30" />
        <p className="text-sm font-semibold text-on-surface">Grille vide</p>
        <p className="text-xs text-muted-foreground">
          Ajoutez des tournois depuis la page Tournois
        </p>
        {lastGrid.length > 0 && (
          <button
            onClick={restoreLastGrid}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-electric-blue hover:underline"
          >
            Répéter la dernière grille ({lastGrid.length} tournoi{lastGrid.length !== 1 ? 's' : ''})
          </button>
        )}
      </div>
    )
  }

  function handleClear() {
    const snapshot = [...items]
    clearSession()
    toast('Grille vidée', {
      action: { label: 'Annuler', onClick: () => snapshot.forEach(addItem) },
      duration: 5000,
    })
  }

  function handleValidate() {
    createSession.mutate(
      { name: sessionName.trim() || undefined, tournamentIds: items.map((i) => i.id) },
      {
        onSuccess: (session) => {
          saveLastGrid()
          clearSession()
          setSessionName('')
          router.push(`/sessions/${session.id}`)
        },
        onError: () => {
          toast.error('Erreur lors de la création de la session')
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
        <button
          onClick={handleClear}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" /> Vider
        </button>
      </div>

      {/* Timeline */}
      <div className="px-4 pt-3 pb-2 border-b border-border overflow-x-auto">
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

          {/* Current-time cursor */}
          {nowOffset !== null && (
            <div
              className="absolute top-0 bottom-0 pointer-events-none z-10"
              style={{ left: nowOffset }}
            >
              <div className="absolute top-[13px] w-2 h-2 rounded-full bg-electric-blue -translate-x-1/2" />
              <div className="absolute top-[21px] bottom-0 w-px bg-electric-blue/50 -translate-x-px" />
            </div>
          )}

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
                    : 'bg-surface-container-high border border-border text-on-surface-variant',
                )}
                style={{ left, width: Math.max(width, 60), height: 22, top }}
                title={`${item.name} — ${new Date(item.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
              >
                <span className="opacity-50 mr-1">{TYPE_ABBR[item.type] ?? item.type}</span>
                {item.name}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 pt-2">
          {TYPE_LEGEND.map(({ abbr, label }) => (
            <span key={abbr} className="text-xs font-mono text-muted-foreground">
              <span className="text-on-surface-variant">{abbr}</span> {label}
            </span>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-border max-h-64 overflow-y-auto">
        {items.map((item) => {
          const isOverlap = overlaps.has(item.id)
          const timeStr = new Date(item.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
          return (
            <div key={item.id} className={cn('flex items-center justify-between px-4 py-2', isOverlap && 'bg-warning/5')}>
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
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label={`Retirer ${item.name}`}
                  className="p-1 rounded hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors"
                >
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
          maxLength={100}
          className="flex-1 text-sm bg-surface-container border border-border rounded px-3 py-1.5 text-on-surface placeholder:text-muted-foreground focus:outline-none focus:border-electric-blue min-w-0"
        />
        <button
          onClick={handleValidate}
          disabled={createSession.isPending}
          className="shrink-0 bg-electric-blue text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#1d4ed8] disabled:opacity-50 transition-colors"
        >
          {createSession.isPending ? 'Création…' : 'Valider la session'}
        </button>
      </div>
    </div>
  )
}
