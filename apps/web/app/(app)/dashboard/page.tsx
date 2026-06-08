import { Header } from '@/components/layout/header'
import { SessionBuilder } from '@/components/session/session-builder'

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" />
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Grille du jour
          </h2>
          <SessionBuilder />
        </div>
      </div>
    </div>
  )
}
