'use client'

import { RotateCcw } from 'lucide-react'
import { useFiltersStore } from '@/store/filters.store'
import type { TournamentType, TournamentStructure } from '@/types'

const TYPES: { value: TournamentType; label: string }[] = [
  { value: 'CLASSIC', label: 'Classic' },
  { value: 'KNOCKOUT', label: 'KO' },
  { value: 'PROGRESSIVE_KNOCKOUT', label: 'PKO' },
  { value: 'FLIGHT', label: 'Flight' },
]

const STRUCTURES: { value: TournamentStructure; label: string }[] = [
  { value: 'NORMAL', label: 'Normal' },
  { value: 'DEEP_STACK', label: 'Deepstack' },
  { value: 'TURBO', label: 'Turbo' },
  { value: 'HYPER_TURBO', label: 'Hyper' },
]

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
      {children}
    </div>
  )
}

function CheckChip({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: () => void
}) {
  return (
    <button
      onClick={onChange}
      className={`text-xs px-2.5 py-1 rounded border transition-colors font-medium ${
        checked
          ? 'bg-electric-blue/15 border-electric-blue/40 text-primary'
          : 'bg-surface-container border-border text-on-surface-variant hover:border-border-subtle hover:text-on-surface'
      }`}
    >
      {label}
    </button>
  )
}

export function TournamentFilters() {
  const store = useFiltersStore()

  return (
    <aside className="w-56 shrink-0 space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface">Filtres</p>
        <button
          onClick={store.reset}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-on-surface transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Réinitialiser
        </button>
      </div>

      {/* Buy-in range */}
      <FilterSection title="Buy-in">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-on-surface-variant">
            <span>{store.buyInMin}€</span>
            <span>{store.buyInMax}€</span>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              max={store.buyInMax}
              value={store.buyInMin}
              onChange={(e) => store.setBuyInRange(Number(e.target.value), store.buyInMax)}
              className="w-full bg-surface-card border border-border rounded px-2 py-1 text-xs font-mono text-on-surface focus:border-electric-blue outline-none"
              placeholder="Min"
            />
            <input
              type="number"
              min={store.buyInMin}
              max={1000}
              value={store.buyInMax}
              onChange={(e) => store.setBuyInRange(store.buyInMin, Number(e.target.value))}
              className="w-full bg-surface-card border border-border rounded px-2 py-1 text-xs font-mono text-on-surface focus:border-electric-blue outline-none"
              placeholder="Max"
            />
          </div>
        </div>
      </FilterSection>

      {/* Type */}
      <FilterSection title="Type">
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map(({ value, label }) => (
            <CheckChip
              key={value}
              label={label}
              checked={store.types.includes(value)}
              onChange={() => store.toggleType(value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Structure */}
      <FilterSection title="Structure">
        <div className="flex flex-wrap gap-1.5">
          {STRUCTURES.map(({ value, label }) => (
            <CheckChip
              key={value}
              label={label}
              checked={store.structures.includes(value)}
              onChange={() => store.toggleStructure(value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Date */}
      <FilterSection title="Date">
        <input
          type="date"
          value={store.date}
          onChange={(e) => store.setDate(e.target.value)}
          className="w-full bg-surface-card border border-border rounded px-2 py-1 text-xs font-mono text-on-surface focus:border-electric-blue outline-none"
        />
      </FilterSection>

      {/* Sort */}
      <FilterSection title="Trier par">
        <select
          value={store.sortBy}
          onChange={(e) => store.setSortBy(e.target.value as never)}
          className="w-full bg-surface-card border border-border rounded px-2 py-1.5 text-xs text-on-surface focus:border-electric-blue outline-none"
        >
          <option value="startTime">Heure de départ</option>
          <option value="buyIn">Buy-in</option>
          <option value="evScore">Score EV</option>
          <option value="overlayAmount">Overlay</option>
        </select>
      </FilterSection>
    </aside>
  )
}
