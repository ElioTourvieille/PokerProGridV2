import { Header } from '@/components/layout/header'
import { SessionBuilder } from '@/components/session/session-builder'

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" />
      <div className="flex-1 p-6">
        <SessionBuilder />
      </div>
    </div>
  )
}
