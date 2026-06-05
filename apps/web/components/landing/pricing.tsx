import Link from 'next/link'
import { Check, X } from 'lucide-react'

const plans = [
  {
    name: 'Plan Découverte',
    tier: 'free',
    price: '0€',
    period: '/mois',
    description: 'Pour commencer à tracker',
    cta: 'Choisir Gratuit',
    ctaHref: '/register',
    popular: false,
    features: [
      { label: 'Import 10 sessions / mois', included: true },
      { label: 'Filtres de base', included: true },
      { label: 'Grille standard', included: true },
      { label: 'Statistiques avancées', included: false },
      { label: 'Alertes late reg', included: false },
      { label: 'IA coach', included: false },
    ],
  },
  {
    name: 'Plan Grinder',
    tier: 'pro',
    price: '8€',
    period: '/mois',
    description: 'Pour les grinders sérieux',
    cta: 'Démarrer Pro',
    ctaHref: '/register?plan=pro',
    popular: true,
    features: [
      { label: 'Sessions illimitées', included: true },
      { label: 'Filtres avancés personnalisés', included: true },
      { label: 'Dashboard multi-rooms', included: true },
      { label: 'Statistiques complètes', included: true },
      { label: 'Alertes late reg', included: true },
      { label: 'IA coach', included: false },
    ],
  },
  {
    name: 'Plan Élite',
    tier: 'premium',
    price: '20€',
    period: '/mois',
    description: 'Analyse IA post-session',
    cta: 'Accès Élite',
    ctaHref: '/register?plan=premium',
    popular: false,
    features: [
      { label: 'Tout le contenu Pro', included: true },
      { label: 'Analyse IA post-session', included: true },
      { label: 'Scoring EV avancé', included: true },
      { label: 'Export PDF / ICS', included: true },
      { label: 'Recommandations personnalisées', included: true },
      { label: 'Support prioritaire', included: true },
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="mx-auto max-w-[1440px]">
        <h2 className="mb-3 text-center text-3xl font-semibold tracking-tight text-on-surface sm:text-4xl">
          Prêt à dominer la variance ?
        </h2>
        <p className="mb-16 text-center text-sm text-on-surface-variant">
          Choisissez le plan qui correspond à votre volume de jeu.
        </p>

        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`relative flex flex-col rounded-xl border p-6 transition-all ${
                plan.popular
                  ? 'border-electric-blue bg-surface-card glow-blue-sm'
                  : 'border-border-subtle bg-surface-card hover:border-electric-blue/30'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-electric-blue px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    Populaire
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  {plan.name}
                </p>
                <div className="flex items-end gap-1">
                  <span className="font-mono text-4xl font-bold text-on-surface">
                    {plan.price}
                  </span>
                  <span className="mb-1 text-sm text-on-surface-variant">{plan.period}</span>
                </div>
                <p className="mt-1 text-xs text-on-surface-variant">{plan.description}</p>
              </div>

              {/* Features list */}
              <ul className="mb-8 flex flex-col gap-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature.label} className="flex items-center gap-2.5">
                    {feature.included ? (
                      <Check className="h-4 w-4 shrink-0 text-success" strokeWidth={2.5} />
                    ) : (
                      <X className="h-4 w-4 shrink-0 text-border-subtle" strokeWidth={2} />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? 'text-on-surface' : 'text-on-surface-variant/50'
                      }`}
                    >
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`rounded-md px-4 py-2.5 text-center text-sm font-medium transition-all ${
                  plan.popular
                    ? 'bg-electric-blue text-white hover:bg-blue-500 hover:glow-blue'
                    : 'border border-border-subtle text-on-surface hover:bg-surface-container'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
