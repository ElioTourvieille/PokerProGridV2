'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ChevronLeft, Trophy } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { useGetSession, useUpdateSessionTournament, useCompleteSession } from '@/hooks/use-sessions'
import { cn } from '@/lib/utils'
import type { SessionTournamentStatus, SessionTournament } from '@/types'

const STATUS_LABEL: Record<SessionTournamentStatus, string> = {
  PLANNED:    'Prévu',
  REGISTERED: 'Inscrit',
  PLAYING:    'En jeu',
  ITM:        'ITM',
  BUST:       'Bust',
  FINISHED:   'Terminé',
}

const STATUS_CLASS: Record<SessionTournamentStatus, string> = {
  PLANNED:    'text-muted-foreground bg-muted/40',
  REGISTERED: 'text-on-surface-variant bg-surface-container',
  PLAYING:    'text-electric-blue bg-electric-blue/10',
  ITM:        'text-success bg-success/10',
  BUST:       'text-destructive bg-destructive/10',
  FINISHED:   'text-success bg-success/15',
}

const TRANSITIONS: Record<SessionTournamentStatus, SessionTournamentStatus[]> = {
  PLANNED:    ['REGISTERED', 'PLAYING'],
  REGISTERED: ['PLAYING'],
  PLAYING:    ['ITM', 'BUST'],
  ITM:        ['FINISHED'],
  BUST:       [],
  FINISHED:   [],
}

function TournamentRow({ st, sessionId }: { st: SessionTournament & { tournament?: { name: string; startTime: string; buyIn: number } }; sessionId: string }) {
  const update = useUpdateSessionTournament()
  const [cashout, setCashout] = useState(st.cashout.toString())
  const [editing, setEditing] = useState(false)

  const next = TRANSITIONS[st.status]
  const time = st.tournament?.startTime
    ? new Date(st.tournament.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : '—'

  function transition(status: SessionTournamentStatus) {
    update.mutate({ sessionId, tournamentId: st.tournamentId, data: { status } })
  }

  function saveCashout() {
    const v = parseFloat(cashout)
    if (!isNaN(v)) {
      update.mutate({ sessionId, tournamentId: st.tournamentId, data: { cashout: v } })
    }
    setEditing(false)
  }

  return (
    <tr className="border-b border-border">
      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{time}</td>
      <td className="px-4 py-3 text-sm text-on-surface max-w-xs truncate">{st.tournament?.name ?? '—'}</td>
      <td className="px-4 py-3 font-mono text-sm text-on-surface-variant text-right">{st.buyIn.toFixed(2)}€</td>
      <td className="px-4 py-3 text-right">
        {st.status === 'ITM' || st.status === 'FINISHED' ? (
          editing ? (
            <input
              autoFocus
              type="number"
              min={0}
              step={0.01}
              value={cashout}
              onChange={(e) => setCashout(e.target.value)}
              onBlur={saveCashout}
              onKeyDown={(e) => e.key === 'Enter' && saveCashout()}
              className="w-24 text-right font-mono text-sm bg-surface-container border border-electric-blue rounded px-2 py-0.5 focus:outline-none text-on-surface"
            />
          ) : (
            <button onClick={() => setEditing(true)} className="font-mono text-sm text-success hover:underline">
              {st.cashout.toFixed(2)}€
            </button>
          )
        ) : (
          <span className="font-mono text-sm text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <span className={cn('inline-block text-xs font-medium px-2 py-0.5 rounded-full', STATUS_CLASS[st.status])}>
          {STATUS_LABEL[st.status]}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-1.5">
          {next.map((s) => (
            <button
              key={s}
              onClick={() => transition(s)}
              disabled={update.isPending}
              className={cn(
                'text-xs px-2 py-1 rounded border transition-colors disabled:opacity-50',
                s === 'ITM' && 'border-success/40 text-success hover:bg-success/10',
                s === 'BUST' && 'border-destructive/40 text-destructive hover:bg-destructive/10',
                s === 'PLAYING' && 'border-electric-blue/40 text-electric-blue hover:bg-electric-blue/10',
                s === 'REGISTERED' && 'border-border text-on-surface-variant hover:bg-surface-container',
                s === 'FINISHED' && 'border-success/40 text-success hover:bg-success/10',
              )}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </td>
    </tr>
  )
}

export default function ActiveSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: session, isLoading } = useGetSession(id)
  const complete = useCompleteSession()

  async function handleComplete() {
    await complete.mutateAsync(id)
    router.push('/sessions')
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <Header />
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground animate-pulse">
          Chargement…
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col h-full">
        <Header />
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Session introuvable
        </div>
      </div>
    )
  }

  const totalBuyIn = session.tournaments.reduce((s, t) => s + t.buyIn, 0)
  const totalCashout = session.tournaments.reduce((s, t) => s + t.cashout, 0)
  const profitLoss = totalCashout - totalBuyIn
  const roi = totalBuyIn > 0 ? (profitLoss / totalBuyIn) * 100 : 0

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push('/sessions')}
            className="text-muted-foreground hover:text-on-surface transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-on-surface">{session.name ?? 'Session sans nom'}</h1>
            {session.startedAt && (
              <p className="text-xs text-muted-foreground">
                {new Date(session.startedAt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            )}
          </div>
          {session.status !== 'COMPLETED' && (
            <button
              onClick={handleComplete}
              disabled={complete.isPending}
              className="ml-auto flex items-center gap-2 text-sm px-3 py-1.5 bg-success/15 text-success border border-success/30 rounded hover:bg-success/25 disabled:opacity-50 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Terminer la session
            </button>
          )}
        </div>

        {session.tournaments.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucun tournoi dans cette session</p>
            <p className="text-xs mt-1">Les tournois ajoutés depuis le Dashboard apparaîtront ici</p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-border overflow-hidden mb-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container border-b border-border">
                    {['Heure', 'Tournoi', 'Buy-in', 'Cashout', 'Statut', 'Actions'].map((h) => (
                      <th key={h} className={cn('px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground', ['Buy-in','Cashout','Statut','Actions'].includes(h) && 'text-right')}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {session.tournaments.map((st) => (
                    <TournamentRow key={st.id} st={st} sessionId={session.id} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Buy-in total',  value: `${totalBuyIn.toFixed(2)}€`,  neutral: true },
                { label: 'Cashout total', value: `${totalCashout.toFixed(2)}€`, neutral: true },
                { label: 'P&L',           value: `${profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}€`, positive: profitLoss >= 0 },
                { label: 'ROI',           value: `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`, positive: roi >= 0 },
              ].map(({ label, value, neutral, positive }) => (
                <div key={label} className="bg-surface-card border border-border rounded-lg px-4 py-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                  <p className={cn('text-lg font-mono font-bold', neutral ? 'text-on-surface' : positive ? 'text-success' : 'text-destructive')}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
