export function DashboardMockup() {
  return (
    <div className="bg-surface-card text-left select-none">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-border-subtle px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-danger/60" />
        <span className="h-3 w-3 rounded-full bg-warning/60" />
        <span className="h-3 w-3 rounded-full bg-success/60" />
        <span className="ml-4 text-xs text-on-surface-variant font-mono">
          pokerprogrid.app/tournaments
        </span>
      </div>

      <div className="flex h-[420px] overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 border-r border-border-subtle bg-[#0a0a0f] p-4 flex flex-col gap-1">
          <div className="mb-3 flex items-center gap-2 px-2">
            <div className="h-6 w-6 rounded bg-electric-blue/20 flex items-center justify-center">
              <div className="h-3 w-3 rounded bg-electric-blue" />
            </div>
            <span className="text-xs font-semibold text-on-surface">PokerProGrid</span>
          </div>

          {['Dashboard', 'Tournaments', 'Sessions', 'Statistics', 'AI Debrief'].map((item, i) => (
            <div
              key={item}
              className={`flex items-center gap-2.5 rounded px-2 py-1.5 ${
                i === 1
                  ? 'bg-electric-blue/15 text-primary'
                  : 'text-on-surface-variant'
              }`}
            >
              <div className={`h-3.5 w-3.5 rounded-sm ${i === 1 ? 'bg-electric-blue/60' : 'bg-border-subtle'}`} />
              <span className="text-xs">{item}</span>
            </div>
          ))}

          <div className="mt-auto">
            <div className="rounded-md border border-electric-blue/20 bg-electric-blue/5 p-3">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-electric-blue">
                Build Session
              </div>
              <div className="h-1.5 w-full rounded-full bg-border-subtle">
                <div className="h-1.5 w-3/4 rounded-full bg-electric-blue" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-hidden p-5">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-on-surface">47 tournois trouvés</h2>
              <p className="text-[11px] text-on-surface-variant">Filtres appliqués: Knockout, Deep Stack</p>
            </div>
            <div className="flex gap-2">
              <div className="rounded border border-border-subtle px-3 py-1 text-[11px] text-on-surface-variant">
                Trier par: overlay ↓
              </div>
            </div>
          </div>

          {/* Tournament cards grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Monster Stack', badge: 'OVERLAY +340€', badgeColor: 'success', tag: 'TURBO KO', buyin: '€50.00', fill: 72, ev: '+12.4', time: 'Dans 1h 23min', urgency: false },
              { name: 'Night on Stars', badge: 'VALUE DETECTED', badgeColor: 'warning', tag: 'DEEP STACK', buyin: '€100.00', fill: 41, ev: '+8.1', time: 'Dans 2h 45min', urgency: false },
              { name: 'Sunday Special', badge: 'OVERLAY +1,240€', badgeColor: 'success', tag: 'PKO MAIN', buyin: '€250.00', fill: 88, ev: '+18.7', time: 'Dans 14min', urgency: true },
              { name: 'The Storm', badge: null, badgeColor: null, tag: 'CLASSIC', buyin: '€10.00', fill: 94, ev: '-2.4', time: 'Dans 4h 12min', urgency: false },
              { name: 'BigStack Hero', badge: 'LATE REG ENDING', badgeColor: 'danger', tag: 'FLIGHTED', buyin: '€20.00', fill: 102, ev: '+4.2', time: 'Termine dans 5min', urgency: true },
            ].map((t) => (
              <div key={t.name} className="rounded-lg border border-border-subtle bg-background p-3">
                <div className="mb-1.5 flex items-start justify-between gap-1">
                  <span className="text-xs font-semibold text-on-surface leading-tight">{t.name}</span>
                  {t.badge && (
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                      t.badgeColor === 'success' ? 'bg-success/15 text-success' :
                      t.badgeColor === 'warning' ? 'bg-warning/15 text-warning' :
                      'bg-danger/15 text-danger'
                    }`}>
                      {t.badge}
                    </span>
                  )}
                </div>
                <div className="mb-2 inline-block rounded bg-border-subtle px-1.5 py-0.5 text-[9px] font-medium uppercase text-on-surface-variant">
                  {t.tag}
                </div>
                <div className="mb-1 font-mono text-sm font-semibold text-on-surface">{t.buyin}</div>
                <div className="mb-1 h-1 w-full rounded-full bg-border-subtle overflow-hidden">
                  <div
                    className={`h-1 rounded-full ${t.fill > 95 ? 'bg-danger' : 'bg-electric-blue'}`}
                    style={{ width: `${Math.min(t.fill, 100)}%` }}
                  />
                </div>
                <div className={`flex items-center justify-between`}>
                  <span className={`text-[10px] ${t.urgency ? 'text-danger' : 'text-on-surface-variant'}`}>
                    {t.time}
                  </span>
                  <span className={`font-mono text-[10px] font-semibold ${
                    parseFloat(t.ev) >= 0 ? 'text-success' : 'text-danger'
                  }`}>
                    EV {t.ev}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
