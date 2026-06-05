import { SlidersHorizontal, LayoutGrid, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: SlidersHorizontal,
    title: 'Filtres avancés',
    description:
      'Isolez chaque session par buy-in, format ou durée. Créez des vues personnalisées pour vos objectifs de volume quotidiens.',
  },
  {
    icon: LayoutGrid,
    title: 'Grille personnalisée',
    description:
      "Organisez votre lobby virtuel avec un drag-and-drop intuitif. Visualisez l'overlay et le field en temps réel sans quitter l'app.",
  },
  {
    icon: TrendingUp,
    title: 'Session tracker',
    description:
      'Analysez votre ROI et votre variance avec des graphiques haute précision. Importez vos mains Winamax automatiquement.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="mx-auto max-w-[1440px]">
        {/* Section label */}
        <div className="mb-4 flex justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Fonctionnalités
          </span>
        </div>

        <h2 className="mb-16 text-center text-3xl font-semibold tracking-tight text-on-surface sm:text-4xl">
          La puissance de l'analyse
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group rounded-lg border border-border-subtle bg-surface-card p-6 transition-all hover:border-electric-blue/30 hover:glow-blue-sm"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-surface-elevated">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-base font-semibold text-on-surface">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
