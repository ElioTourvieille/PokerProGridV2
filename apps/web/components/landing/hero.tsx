import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { DashboardMockup } from './dashboard-mockup'

export function Hero() {
  return (
    <section className="relative flex flex-col items-center px-6 pt-32 pb-20 text-center overflow-hidden">
      {/* Radial glow behind hero */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-10"
        style={{
          background:
            'radial-gradient(ellipse at center, #2563eb 0%, transparent 70%)',
        }}
      />

      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-card px-3 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        <span className="text-xs font-medium tracking-wide text-on-surface-variant uppercase">
          Winamax · Live data
        </span>
      </div>

      {/* Headline */}
      <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-on-surface sm:text-6xl lg:text-7xl leading-[1.1]">
        Construisez votre{' '}
        <span className="text-primary">grille parfaite.</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 max-w-lg text-base text-on-surface-variant leading-relaxed">
        Agrégez, filtrez et trackez vos tournois Winamax en un seul endroit.
        La précision chirurgicale pour le grind professionnel.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-md bg-electric-blue px-6 py-3 text-sm font-medium text-white transition-all hover:bg-blue-500 hover:glow-blue"
        >
          Essai gratuit
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="#demo"
          className="inline-flex items-center gap-2 rounded-md border border-border-subtle bg-surface-card px-6 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
        >
          <Play className="h-4 w-4 fill-on-surface-variant text-on-surface-variant" />
          Voir la démo
        </Link>
      </div>

      {/* Dashboard mockup */}
      <div className="relative mt-16 w-full max-w-5xl">
        {/* Gradient fade bottom */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 z-10"
          style={{ background: 'linear-gradient(to top, #131318 0%, transparent 100%)' }}
        />
        <div className="rounded-xl border border-border-subtle overflow-hidden shadow-2xl">
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}
