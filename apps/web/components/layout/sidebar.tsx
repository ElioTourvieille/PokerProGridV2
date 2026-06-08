'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2, LayoutGrid, List, Settings, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/tournaments', icon: Trophy, label: 'Tournois' },
  { href: '/sessions', icon: List, label: 'Sessions' },
  { href: '/statistics', icon: BarChart2, label: 'Statistiques' },
  { href: '/settings', icon: Settings, label: 'Paramètres' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
        <LayoutGrid className="w-5 h-5 text-electric-blue" />
        <span className="font-semibold text-sm tracking-tight text-on-surface">
          PokerProGrid
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors relative',
                active
                  ? 'bg-sidebar-accent text-on-surface font-medium'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-sidebar-accent/50',
              )}
            >
              {active && (
                <span className="absolute left-0 top-[20%] h-[60%] w-0.5 rounded-full bg-electric-blue" />
              )}
              <Icon className={cn('w-4 h-4 shrink-0', active && 'text-electric-blue')} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom label */}
      <div className="px-4 py-3 border-t border-sidebar-border">
        <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
          MVP · Winamax
        </p>
      </div>
    </aside>
  )
}
