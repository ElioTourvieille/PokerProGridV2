import Link from 'next/link'
import { LayoutGrid } from 'lucide-react'

const links = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border-subtle bg-surface-card px-6 py-8">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Logo + copyright */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-electric-blue">
            <LayoutGrid className="h-3.5 w-3.5 text-white" strokeWidth={2} />
          </div>
          <span className="text-sm font-semibold text-on-surface">PokerProGrid</span>
          <span className="hidden sm:inline text-xs text-on-surface-variant">
            · © {year} PokerProGrid Analytics. All rights reserved.
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
