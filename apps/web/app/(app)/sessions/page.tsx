'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Clock, CheckCircle, Pause, Calendar } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { useGetSessions, useCreateSession } from '@/hooks/use-sessions'
import { cn } from '@/lib/utils'
import type { SessionStatus, SessionSummary } from '@/types'

const STATUS_CONFIG: Record<SessionStatus, { label: string; icon: typeof Clock; className: string }> = {
  PLANNED:   { label: 'Planifiée',  icon: Calendar,     className: 'text-muted-foreground bg-muted/40' },
  ACTIVE:    { label: 'En cours',   icon: Clock,        className: 'text-electric-blue bg-electric-blue/10' },
  PAUSED:    { label: 'En pause',   icon: Pause,        className: 'text-warning bg-warning/10' },
  COMPLETED: { label: 'Terminée',   icon: CheckCircle,  className: 'text-success bg-success/10' },
}

function PnlCell({ value }: { value: number }) {
  return (
    <span className={cn('font-mono text-sm', value >= 0 ? 'text-success' : 'text-destructive')}>
      {value >= 0 ? '+' : ''}
      {value.toFixed(2)}€
    </span>
  )
}

function SessionRow({ s, onClick }: { s: SessionSummary; onClick: () => void }) {
  const cfg = STATUS_CONFIG[s.status]
  const Icon = cfg.icon
  const date = s.startedAt ? new Date(s.startedAt).toLocaleDateString('fr-FR') : '—'

  return (
    <tr
      onClick={onClick}
      className="border-b border-border hover:bg-surface-container/50 cursor-pointer transition-colors"
    >
      <td className="px-4 py-3 text-sm text-on-surface-variant font-mono">{date}</td>
      <td className="px-4 py-3 text-sm text-on-surface font-medium">{s.name ?? 'Session sans nom'}</td>
      <td className="px-4 py-3 text-center text-sm text-on-surface-variant">{s.tournamentCount}</td>
      <td className="px-4 py-3 text-right font-mono text-sm text-on-surface-variant">{s.totalBuyIn.toFixed(2)}€</td>
      <td className="px-4 py-3 text-right font-mono text-sm text-on-surface-variant">{s.totalCashout.toFixed(2)}€</td>
      <td className="px-4 py-3 text-right"><PnlCell value={s.profitLoss} /></td>
      <td className={cn('px-4 py-3 text-right font-mono text-sm', s.roi >= 0 ? 'text-success' : 'text-destructive')}>
        {s.roi >= 0 ? '+' : ''}{s.roi.toFixed(1)}%
      </td>
      <td className="px-4 py-3">
        <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full', cfg.className)}>
          <Icon className="w-3 h-3" />
          {cfg.label}
        </span>
      </td>
    </tr>
  )
}

export default function SessionsPage() {
  const router = useRouter()
  const { data, isLoading } = useGetSessions()
  const createSession = useCreateSession()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  async function handleCreate() {
    const session = await createSession.mutateAsync({ name: name.trim() || undefined })
    router.push(`/sessions/${session.id}`)
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Sessions" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-on-surface-variant">
            {data?.total ?? 0} session{(data?.total ?? 0) !== 1 ? 's' : ''}
          </p>
          {creating ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Nom de la session (optionnel)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false) }}
                className="text-sm bg-surface-container border border-border rounded px-3 py-1.5 text-on-surface placeholder:text-muted-foreground focus:outline-none focus:border-electric-blue w-56"
              />
              <button onClick={handleCreate} disabled={createSession.isPending} className="text-sm px-3 py-1.5 bg-electric-blue text-white rounded hover:bg-electric-blue/90 disabled:opacity-50 transition-colors">
                Créer
              </button>
              <button onClick={() => setCreating(false)} className="text-sm px-3 py-1.5 text-on-surface-variant hover:text-on-surface transition-colors">
                Annuler
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 text-sm px-3 py-1.5 bg-electric-blue text-white rounded hover:bg-electric-blue/90 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Nouvelle session
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="text-sm text-muted-foreground animate-pulse">Chargement…</div>
        ) : !data?.sessions.length ? (
          <div className="text-center py-24 text-muted-foreground">
            <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucune session pour l'instant</p>
            <p className="text-xs mt-1">Créez votre première session pour commencer à tracker</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container border-b border-border">
                  {['Date', 'Nom', 'Tournois', 'Buy-in', 'Cashout', 'P&L', 'ROI', 'Statut'].map((h) => (
                    <th key={h} className={cn('px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground', h === 'Tournois' && 'text-center', ['Buy-in','Cashout','P&L','ROI'].includes(h) && 'text-right')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.sessions.map((s) => (
                  <SessionRow key={s.id} s={s} onClick={() => router.push(`/sessions/${s.id}`)} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
