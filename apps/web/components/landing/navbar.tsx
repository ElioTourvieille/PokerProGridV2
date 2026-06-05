'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutGrid, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Tarifs', href: '#pricing' },
  { label: 'À propos', href: '#about' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle bg-surface-card/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-electric-blue">
            <LayoutGrid className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <span className="text-sm font-semibold tracking-tight text-on-surface">
            PokerProGrid
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-electric-blue px-4 py-2 text-sm font-medium text-white transition-all hover:glow-blue hover:bg-blue-500"
          >
            Commencer gratuitement
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-on-surface-variant hover:text-on-surface"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border-subtle bg-surface-card px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-on-surface-variant hover:text-on-surface"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/register"
            className="mt-2 rounded-md bg-electric-blue px-4 py-2 text-center text-sm font-medium text-white"
            onClick={() => setOpen(false)}
          >
            Commencer gratuitement
          </Link>
        </div>
      )}
    </header>
  )
}
