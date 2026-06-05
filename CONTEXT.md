# PokerProGrid V2 — Contexte Projet Complet

> Dernière mise à jour : 2026-06-05  
> Stack cible : Next.js 15 · NestJS · Python · PostgreSQL · Redis  
> Nom du design system : **Grid Velocity**

---

## 1. Vision Produit

**PokerProGrid** est une plateforme SaaS pour grinders MTT (Multi-Table Tournament) en ligne qui permet de :

1. **Agréger et filtrer** les tournois de plusieurs rooms poker en temps réel
2. **Construire sa grille** de session personnalisée avec détection d'overlaps
3. **Tracker ses sessions** (ajout/validation de tournois joués + résultats)
4. **Analyser ses performances** (ROI, stats par type de tournoi, progression)
5. **Recevoir des recommandations IA** basées sur son profil et son historique

### Problème résolu
Les grinders MTT jonglent manuellement entre 3-4 lobbys (Winamax, PokerStars, PMU, CoinPoker) pour construire leur grille du jour. Aucun outil centralisé, pas de stats de session propres, pas de scoring EV.

### Marché initial
France, Suisse, Belgique — Langue MVP : Français (i18n préparé dès le départ).

---

## 2. Modèle Commercial

| Tier | Prix | Features clés |
|------|------|---------------|
| **Free** | 0€/mois | Grille basique, Winamax uniquement, filtres simples, 10 sessions/mois |
| **Pro** | 14€/mois | Toutes les rooms, filtres avancés, sessions illimitées, stats complètes, alertes late reg |
| **Premium** | 25€/mois | Tout Pro + IA coach, scoring EV avancé, export PDF/ICS, recommandations personnalisées |

---

## 3. Stack Technique

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS** avec le design system Grid Velocity
- **shadcn/ui** comme base de composants
- **Recharts** ou **Tremor** pour les graphiques
- **Zustand** pour le state management client

### Backend
- **NestJS** (API principale — REST + WebSocket pour live data)
- **Python** (scraping + scoring EV algorithmique)
- **PostgreSQL** (données relationnelles)
- **Redis** (cache tournois, sessions temps réel)

### Auth
- **NextAuth.js** (email/password + OAuth Google)

### Paiement
- **Stripe** (abonnements SaaS)

---

## 4. Architecture des Pages (Maquettes validées)

### Landing Page (`/`)
- Hero : "Construisez votre grille parfaite." avec screenshot produit
- Features : Filtres avancés · Grille personnalisée · Session tracker
- Pricing : 3 tiers (Découverte / Grinder / Élite)
- Navigation : Features | Pricing | About | CTA "Commencer gratuitement"

### Auth (`/login`, `/register`)
- Design card centré sur fond dark avec gradient bleu
- Email/password + OAuth Google
- "Se souvenir de moi", "Mot de passe oublié ?"
- Status bar en bas : SERVEUR OPÉRATIONNEL · AES-256 CHIFFRÉ

### Dashboard (`/dashboard`)
- Sidebar fixe gauche : Dashboard · Tournaments · Sessions · Statistics · AI Debrief · Settings
- Vue principale : grille du jour (timeline horizontal d'overlaps) + liste tournois paginée
- Filtres rapides : KO / PKO / Classic / Turbo / Deep
- CTA flottant en bas : "+ Build Session"

### Tournaments (`/tournaments`)
- Sidebar filtres : Buy-in slider · Type (Classic/KO/PKO/Flight) · Structure (Normal/Deep/Turbo) · Garantie minimum
- Grid de cards tournois avec : nom, badge overlay/value, prix, garantie, fill bar, countdown, inscrits/max, score EV, bouton "+"
- Toggle vue grid/liste · Sort par overlay/EV/heure
- Section verrouillée "PRO ACCESS ONLY" pour filtres avancés

### Session Active (`/sessions/[id]`)
- Header : date, statut EN COURS, timer, PAUSE / TERMINER
- KPIs : Buy-in engagé · Cashout actuel · P&L Total · ROI actuel
- Tableau tournois : nom, buy-in, statut (ITM/JOUÉ/BUST/PLANIFIÉ), position, cashout, actions
- Bottom bar : Live Tracking Active · Ajouter un tournoi · Terminer la session

### Session Terminée (`/sessions/[id]/results`)
- Net Session Profit (chiffre principal)
- ROI + nombre tournois
- Graphiques : Performance par tournoi (bar) · Distribution ITM (donut)
- Section AI Post-Game Analysis (blurred si pas Premium)

### Statistics (`/statistics`)
- Sélecteur période : 30 Derniers Jours / etc.
- KPIs : Sessions · Tournois · ROI Global · Profit Net · ITM Rate
- Graphique P&L Cumulé (line chart, vu sessions/temps)
- ROI par type (bars) · ROI par jour (bar chart) · Perf horaire BB/100 (barre horizontale)
- Tableau "Meilleurs Tournois" paginé

### Settings (`/settings`)
- Profile : Username · Avatar · Bankroll actuelle
- Game Preferences : Default Buy-in slider · Favorite Structures (chips multi-select)
- Subscription Plans : 3 tiers avec plan actuel highlighted
- Billing : carte CB masquée · historique paiements · prochaine échéance

---

## 5. Design System Grid Velocity

### Philosophie
**High-Fidelity Fintech** : densité data, scan rapide, focus psychologique.  
Inspiré des outils dev et plateformes de trading. Dark Mode Only.

### Couleurs principales
```
background / surface:     #131318
surface-card:             #0F1117
surface-elevated:         #13151F
border-subtle:            #1E2030
on-surface:               #e4e1e9
on-surface-variant:       #c3c6d7

primary (Electric Blue):  #b4c5ff  (text)
primary-container:        #2563eb  (boutons, accents)
on-primary:               #002a78

secondary:                #bdc2ff
tertiary:                 #ffb596

success:                  #10B981
danger:                   #EF4444
warning:                  #F59E0B

grid-pattern:             #1A1A2E (4% opacity sur background)
```

### Typographie
- **Inter** — navigation, headers, texte descriptif
- **JetBrains Mono** — toutes les données numériques (ROI, buy-ins, P&L, positions)

| Token | Font | Size | Weight |
|-------|------|------|--------|
| display-lg | Inter | 32px | 600 |
| headline-md | Inter | 20px | 600 |
| body-base | Inter | 14px | 400 |
| body-sm | Inter | 12px | 400 |
| data-mono | JetBrains Mono | 13px | 500 |
| data-mono-lg | JetBrains Mono | 18px | 600 |
| label-caps | Inter | 11px | 700 / tracking 0.05em |

### Spacing & Layout
- Base unit : 4px
- Gutter : 16px — Margin : 24px — Container max : 1440px
- Grid overlay 4% opacity en background pour effet "snap"
- Breakpoints : Desktop 1200px+ (12 cols) · Tablet 768px (8 cols) · Mobile (1 col)

### Élévation (tonal layers)
- Level 0 (base) : #0A0A0F + grid pattern
- Level 1 (cards) : #0F1117 + border 1px #1E2030
- Level 2 (menus/modals) : #13151F
- Focus/hover : Electric Blue glow `box-shadow: 0 0 20px #2563EB40`

### Radii
- Cards/modules : 8px
- Boutons : 6px
- Inputs/tags : 4px
- Nav active indicator : pill vertical (60% hauteur item)

### Composants clés
**Boutons**
- Primary : bg #2563EB, white, 6px radius — hover : blue glow
- Secondary : transparent + 1px #1E2030 — hover : bg #1E2030
- Ghost : no border — hover : text white

**Data Tables**
- Header : #11131A bg, 11px uppercase Inter
- Cells : 13px JetBrains Mono pour les chiffres
- Row hover : bg #13151F + 2px Electric Blue left-border

**Inputs**
- Default : bg #0F1117, 1px #1E2030, 4px radius
- Focus : 1px #2563EB + glow 4px bleu

**Chips/Badges**
- 4px radius, 11px semi-bold, fill low-opacity (ex: #10B98115) + texte high-opacity

**Progress Bars**
- Track : #1E2030 — Fill : #2563EB gradient horizontal
- Heights : 4px ou 8px selon importance

---

## 6. MVP Scope (Phase 1 — Winamax First)

### Inclus MVP
- [ ] Landing page
- [ ] Auth (email + Google)
- [ ] Tournois Winamax (scraping + affichage)
- [ ] Filtres basiques (buy-in, type de tournoi)
- [ ] Grille personnalisée (timeline overlaps)
- [ ] Session tracker (ajout mandat + résultats)
- [ ] Stats basiques (ROI, P&L cumulé)
- [ ] Subscription Free / Pro (Stripe)

### Post-MVP (Phase 2)
- [ ] Multi-rooms (PokerStars, PMU, CoinPoker)
- [ ] Scoring EV avancé
- [ ] AI Post-Game Analysis (Premium)
- [ ] Export PDF/ICS
- [ ] Alertes late reg
- [ ] Mobile optimisation

---

## 7. Structure Dossiers Cible

```
poker-progridV2/
├── apps/
│   ├── web/          # Next.js 15 frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── ui/           # Composants partagés (design system)
│   ├── types/        # Types TypeScript partagés
│   └── config/       # Config partagée (tailwind, eslint)
├── services/
│   └── scraper/      # Python scraper Winamax
└── CONTEXT.md        # Ce fichier
```

---

## 8. Conventions de Dev

- Commits en anglais, conventionnal commits (`feat:`, `fix:`, `chore:`)
- Langue UI : Français (MVP)
- Pas de commentaires inutiles dans le code
- Tailwind en priorité sur CSS custom
- Données numériques toujours en JetBrains Mono via classe utilitaire `font-mono`
