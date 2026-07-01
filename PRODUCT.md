# Product

## Register

product

## Users

MTT poker grinders — joueurs semi-pro à pro jouant principalement sur Winamax. Ils jouent plusieurs tournois simultanément, souvent tard le soir ou la nuit. Ils suivent déjà leurs stats manuellement (Excel, Notion, logiciels lourds) et cherchent un outil taillé pour leur workflow réel : planifier leur grille, tracker en live, analyser a posteriori.

Contexte d'usage : fenêtre ouverte en background pendant une session, souvent sur un second écran. Charge cognitive élevée — ils jouent en même temps qu'ils consultent l'outil.

## Product Purpose

PokerProGrid V2 est le cockpit du grinder MTT. Il regroupe trois missions :
1. **Planification** — sélectionner les tournois du jour parmi la grille Winamax, visualiser les chevauchements, calculer le buy-in total engagé.
2. **Tracking live** — enregistrer en temps réel les statuts (inscrit, en jeu, ITM, bust), les rebuys, les cashouts.
3. **Analyse** — ROI par type de tournoi, P&L cumulé, sessions jouées, tournois les plus rentables.

Succès = un grinder ferme son tableur Excel et utilise PokerProGrid comme outil principal de suivi.

## Brand Personality

Analytique · Précis · Edge

Références positives : GTO Wizard (densité informationnelle, dark natif, aucune décoration parasite, chaque chiffre a un statut clair), Jurojin (interface pro pour trackers de résultats, orientée data, sobre).

L'outil parle à un joueur qui connaît ses VPIP, 3-bet range et EV par structure. Il ne faut ni l'éduquer ni le motiver — juste lui donner l'information la plus claire possible, aussi vite que possible.

## Anti-references

- **Dashboard SaaS générique** : cards identiques partout, hero-metric template (grand chiffre + gradient), charts Recharts bruts non stylisés, bleu clair corporate. Exactement ce que l'outil ne doit pas être.
- **App mobile gamifiée** : badges, streaks, confettis, XP, paliers de progression. Infantilisant pour un grinder qui joue pour des résultats réels, pas des récompenses fictives.
- **Lobby de salle de poker** : vert fluo, rouge, iconographie casino, ambiance bookmaker. Associé à des produits consommateur mass-market, pas à un outil pro.

## Design Principles

1. **Data avant tout** — les chiffres sont le produit. Tout ce qui entoure un nombre doit le servir, pas le décorer. Hiérarchie typographique stricte : mono pour les valeurs, sans pour les labels.
2. **Lisible à charge cognitive élevée** — l'utilisateur joue en parallèle. Contraste maximal, états visuels clairs (ITM vert, bust rouge, en jeu bleu), scan immédiat sans lecture.
3. **Dark natif** — pas un thème, une condition. L'interface existe exclusivement en mode sombre. Aucun compromis pour un hypothétique mode clair.
4. **Économie d'éléments** — si un élément ne porte pas d'information ou d'action utile, il n'est pas là. Pas de transitions décoratives, pas d'illustrations, pas d'icônes sans fonction.
5. **Confiance professionnelle** — l'outil suppose que l'utilisateur sait ce qu'il fait. Pas de confirmation sur chaque action mineure, pas de tooltips pour chaque terme poker. Comportement power-user par défaut.

## Accessibility & Inclusion

WCAG AA minimum sur les contrastes texte/fond — critique car l'usage se fait souvent dans des conditions d'éclairage réduites (nuit, bureau sombre). Reduced motion respecté. Pas de dépendance exclusive à la couleur pour les statuts — les labels texte accompagnent toujours les codes couleur.
