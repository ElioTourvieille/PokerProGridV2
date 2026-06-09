'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Header } from '@/components/layout/header'
import { useGetStats } from '@/hooks/use-stats'
import { cn } from '@/lib/utils'

const TYPE_LABEL: Record<string, string> = {
  CLASSIC: 'Classique',
  KNOCKOUT: 'KO',
  PROGRESSIVE_KNOCKOUT: 'PKO',
  FLIGHT: 'Flight',
}

function StatCard({ label, value, sub, positive }: { label: string; value: string; sub?: string; positive?: boolean }) {
  return (
    <div className="bg-surface-card border border-border rounded-lg px-5 py-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className={cn('text-2xl font-mono font-bold', positive === undefined ? 'text-on-surface' : positive ? 'text-success' : 'text-destructive')}>
        {value}
      </p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PlTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-card border border-border rounded px-3 py-2 text-xs">
      <p className="text-muted-foreground mb-1">{payload[0]?.payload?.date ? new Date(payload[0].payload.date).toLocaleDateString('fr-FR') : ''}</p>
      <p className={cn('font-mono font-bold', payload[0]?.value >= 0 ? 'text-success' : 'text-destructive')}>
        Cumulé : {payload[0]?.value >= 0 ? '+' : ''}{(payload[0]?.value as number).toFixed(2)}€
      </p>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RoiTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const roi = payload[0]?.value as number
  return (
    <div className="bg-surface-card border border-border rounded px-3 py-2 text-xs">
      <p className={cn('font-mono font-bold', roi >= 0 ? 'text-success' : 'text-destructive')}>
        ROI : {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
      </p>
      <p className="text-muted-foreground">{payload[0]?.payload?.count} tournoi{payload[0]?.payload?.count !== 1 ? 's' : ''}</p>
    </div>
  )
}

export default function StatisticsPage() {
  const { data, isLoading } = useGetStats()

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Statistiques" />
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground animate-pulse">
          Chargement…
        </div>
      </div>
    )
  }

  const noData = !data || data.sessionCount === 0

  return (
    <div className="flex flex-col h-full">
      <Header title="Statistiques" />
      <div className="flex-1 p-6 overflow-auto space-y-6">

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="ROI global"
            value={noData ? '—' : `${(data.roi >= 0 ? '+' : '')}${data.roi.toFixed(1)}%`}
            sub={noData ? undefined : `${data.sessionCount} session${data.sessionCount !== 1 ? 's' : ''}`}
            positive={noData ? undefined : data.roi >= 0}
          />
          <StatCard
            label="Profit / Perte"
            value={noData ? '—' : `${data.profitLoss >= 0 ? '+' : ''}${data.profitLoss.toFixed(2)}€`}
            positive={noData ? undefined : data.profitLoss >= 0}
          />
          <StatCard
            label="Sessions jouées"
            value={noData ? '0' : String(data.sessionCount)}
          />
          <StatCard
            label="Buy-in total"
            value={noData ? '—' : `${data.totalBuyIn.toFixed(2)}€`}
          />
        </div>

        {noData ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-sm">Aucune session complétée pour l'instant</p>
            <p className="text-xs mt-1">Terminez des sessions pour voir vos statistiques apparaître ici</p>
          </div>
        ) : (
          <>
            {/* Cumulative P&L chart */}
            <div className="bg-surface-card border border-border rounded-lg p-5">
              <h2 className="text-sm font-semibold text-on-surface mb-4">P&L cumulé dans le temps</h2>
              {data.plOverTime.length < 2 ? (
                <p className="text-xs text-muted-foreground text-center py-8">Pas assez de données (2 sessions minimum)</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={data.plOverTime} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v: string) => new Date(v).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(0)}€`}
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                      width={64}
                    />
                    <Tooltip content={<PlTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="cumulative"
                      stroke="#2563EB"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: '#2563EB' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* ROI by type */}
            <div className="bg-surface-card border border-border rounded-lg p-5">
              <h2 className="text-sm font-semibold text-on-surface mb-4">ROI par type de tournoi</h2>
              {data.roiByType.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">Aucune donnée</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={data.roiByType.map((r) => ({ ...r, name: TYPE_LABEL[r.type] ?? r.type }))}
                    margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(0)}%`}
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                      width={56}
                    />
                    <Tooltip content={<RoiTooltip />} />
                    <Bar
                      dataKey="roi"
                      radius={[4, 4, 0, 0]}
                      fill="#2563EB"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Most played */}
            {data.mostPlayedTournaments.length > 0 && (
              <div className="bg-surface-card border border-border rounded-lg p-5">
                <h2 className="text-sm font-semibold text-on-surface mb-3">Tournois les plus joués</h2>
                <div className="space-y-2">
                  {data.mostPlayedTournaments.map(({ name, count }, i) => (
                    <div key={name} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                      <span className="flex-1 text-sm text-on-surface truncate">{name}</span>
                      <span className="text-xs font-mono text-on-surface-variant">{count}×</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
