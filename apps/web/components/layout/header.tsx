'use client'

import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const TIER_BADGE: Record<string, { label: string; className: string }> = {
  FREE: { label: 'Découverte', className: 'bg-muted text-muted-foreground' },
  PRO: { label: 'Grinder', className: 'status-blue' },
  PREMIUM: { label: 'Élite', className: 'bg-warning/15 text-warning' },
}

export function Header({ title }: { title?: string }) {
  const { data: session } = useSession()
  const tier = session?.tier ?? 'FREE'
  const badge = TIER_BADGE[tier] ?? TIER_BADGE.FREE

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-surface-card/60 backdrop-blur-sm sticky top-0 z-10">
      {title && (
        <h1 className="text-sm font-semibold text-on-surface tracking-tight">{title}</h1>
      )}
      <div className="ml-auto flex items-center gap-3">
        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded', badge.className)}>
          {badge.label}
        </span>

        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center border border-border">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:block text-xs font-medium truncate max-w-32">
            {session?.user?.email}
          </span>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="p-1.5 rounded hover:bg-surface-container text-muted-foreground hover:text-on-surface transition-colors"
          title="Se déconnecter"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
