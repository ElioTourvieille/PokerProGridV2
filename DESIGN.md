# Design

## Theme

Dark-only. Single color scheme, no light mode. The visual language was designed for night-time use at low ambient light. Background `#131318` — near-black with a subtle cool-violet undertone (not pure black, not warm). Micro dot grid pattern on body (`radial-gradient` 24px repeat, `#1A1A2E`) adds depth without chrome.

## Color Palette

Grid Velocity — Electric Blue system.

| Token | Value | Role |
|---|---|---|
| `--background` | `#131318` | App canvas |
| `--surface-card` | `#0F1117` | Card backgrounds (darker than canvas) |
| `--surface-elevated` | `#13151F` | Popovers, dropdowns, floating elements |
| `--surface-container` | `#1F1F25` | Inputs, secondary surfaces, hover states |
| `--surface-container-high` | `#2A292F` | Strongest container, tertiary surface |
| `--on-surface` | `#e4e1e9` | Primary text |
| `--on-surface-variant` | `#c3c6d7` | Secondary text, labels |
| `--muted-foreground` | `#8d90a0` | Placeholder, timestamps, tertiary info |
| `--border` | `#1E2030` | All dividers and strokes |
| `--electric-blue` | `#2563eb` | Primary action, active indicators, links |
| `--primary` | `#b4c5ff` | Lighter blue for interactive text on dark surfaces |
| `--success` | `#10B981` | ITM, profit, positive P&L |
| `--destructive` / `--danger` | `#EF4444` | Bust, loss, error |
| `--warning` | `#F59E0B` | Overlap, rebuy, caution |

### Semantic status classes

```css
.status-itm    { background: #10B98115; color: #10B981; }
.status-bust   { background: #EF444415; color: #EF4444; }
.status-warning { background: #F59E0B15; color: #F59E0B; }
.status-blue   { background: #2563eb15; color: #b4c5ff; }
```

## Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| UI / labels | Inter | 400–600 | `--font-sans` |
| Display / headings | Inter | 600–700 | Same family, differentiated by weight |
| Data / numbers | JetBrains Mono | 400–700 | `--font-mono`, all financial values, times, IDs |

- All monetary values: monospace, right-aligned
- All times: monospace `font-mono text-xs`
- Page titles: `text-sm font-semibold` (deliberately small — this is a tool, not a landing page)
- Section headers: `text-sm font-semibold text-on-surface`
- Labels: `text-xs text-muted-foreground uppercase tracking-wider`

## Radii

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Inputs, tags, status badges |
| `--radius-md` | 6px | Buttons |
| `--radius` / `--radius-lg` | 8px | Cards, panels |
| `--radius-xl` | 12px | Large surfaces |
| `--radius-full` | 9999px | Pills, indicators |

## Spacing & Layout

App shell: fixed sidebar (224px, `w-56`) + full-height scroll area. Header sticky at 56px (`h-14`). Page content: `p-6` with `overflow-auto`.

No nested cards. Tables for list data (sessions, tournaments), not card grids.

## Components

### Sidebar

`bg-sidebar` (`#0F1117`), 224px wide, sticky. Active link: `bg-sidebar-accent` + left indicator bar `w-0.5 bg-electric-blue h-[60%]`. Icon turns `text-electric-blue` when active.

### Header

`h-14 bg-surface-card/60 backdrop-blur-sm sticky top-0 z-10`. Contains plan badge (tier), user email, logout. No page title by default — passed as prop when needed.

### Card surface

`.card-surface` = `bg-surface-card border border-border-subtle rounded-lg`
`.card-elevated` = `bg-surface-elevated border border-border-subtle rounded-lg`

### Tables

Standard structure: `border border-border rounded-lg overflow-hidden`. `thead`: `bg-surface-container border-b border-border`. Column headers: `text-xs font-semibold uppercase tracking-wider text-muted-foreground`. Rows: `border-b border-border hover:bg-surface-container/50`. Financial columns: always right-aligned, monospace.

### Status badges

`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full` + semantic color class.

### Action buttons (status transitions)

`text-xs px-2 py-1 rounded border transition-colors`. Color per action: ITM/success → `border-success/40 text-success hover:bg-success/10`, Bust → `border-destructive/40 text-destructive hover:bg-destructive/10`, Playing → `border-electric-blue/40 text-electric-blue hover:bg-electric-blue/10`.

### Primary CTA

`bg-electric-blue text-white text-sm font-semibold px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity`

### Glow utilities

`.glow-blue` = `box-shadow: 0 0 20px #2563eb40` (cards, active focus rings)
`.glow-blue-sm` = `box-shadow: 0 0 8px #2563eb30` (subtle elements)

## Motion

Minimal and functional. `transition-colors` on interactive elements (buttons, links, rows). No entrance animations currently implemented. `backdrop-blur-sm` on sticky header for depth.

## Iconography

Lucide React. Size convention: `w-4 h-4` for nav/actions, `w-3.5 h-3.5` for inline, `w-3 h-3` for status/micro. Color always inherits from parent or set explicitly with semantic color tokens.

## Empty States

Centered icon (`opacity-30`) + `text-sm` message + `text-xs mt-1` sub-message with actionable link. Icon size `w-10 h-10`. No illustration, no large typography.
