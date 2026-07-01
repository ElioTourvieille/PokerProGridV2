---
timestamp: 2026-07-01T16-04-55Z
slug: apps-web-app-app-dashboard-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Button shows "Création…" but no spinner, no success confirmation before redirect; zero freshness signal for tournament data |
| 2 | Match System / Real World | 3 | "Grille du jour" and "chevauchement" are correct domain vocabulary; TYPE_ABBR codes (CL/KO/PKO/FL) undocumented |
| 3 | User Control and Freedom | 2 | "Vider" fires instantly with no confirmation or undo; no draft persistence across refresh |
| 4 | Consistency and Standards | 3 | font-mono on numbers is consistent; two h2 labels with different styles on same page |
| 5 | Error Prevention | 2 | Overlap detection works; no maxLength on name input; "Vider" is unguarded destructive action |
| 6 | Recognition Rather Than Recall | 2 | TYPE_ABBR codes require memorization; no legend; no current-time cursor forces mental math |
| 7 | Flexibility and Efficiency | 1 | Zero keyboard shortcuts beyond Enter-to-submit; no saved grid templates; no batch remove; mouse-only |
| 8 | Aesthetic and Minimalist Design | 3 | Layout is controlled and dense-appropriate; emoji in empty state breaks register; dual "Grille" labels are redundant |
| 9 | Error Recovery | 1 | No onError handler on createSession.mutate; silent failure on API error, user gets no feedback |
| 10 | Help and Documentation | 2 | title tooltip on timeline bars only (non-discoverable); no legend for type codes; overlap warning has no resolution guidance |
| **Total** | | **21/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict

**LLM assessment:** Partially slop, better than average. The 🃏 emoji in the empty state is the single largest tell. The session name input is an afterthought: optional field wedged next to the primary CTA, generic placeholder. max-h-64 scroll truncation is an arbitrary-number-of-pixels solution to a layout design problem. What doesn't read as slop: the timeline is a genuine domain insight; consistent font-mono on numbers; no gradient cards or hero-metric template.

**Deterministic scan (Assessment B):** Clean — exit code 0, zero findings. No gradient text, no eyebrow patterns, no absolute-ban violations at the code level.

**Visual overlays:** Not attempted — no browser automation in this session.

## Overall Impression

The core insight — a temporal timeline for planning the grinder's evening — is sound and domain-correct. The problem is everything around it: the flow from planning to committing a session feels like filling out a form, not launching competition. Two P0 silent failures, zero keyboard affordances, no undo on destructive action.

## What's Working

1. **The timeline is the right domain model.** Temporal mapping with overlap detection is non-obvious and correct.
2. **Information density is controlled.** Compact list rows, font-mono on numbers throughout, correct semantic color usage.
3. **Genuine domain vocabulary.** "Grille du jour", "chevauchement", 6h–24h axis — not a generic tracker with poker coat of paint.

## Priority Issues

**[P0] Silent failure on session creation error**
- What: createSession.mutate has no onError handler. API 4xx/5xx = silent button revert.
- Why it matters: Real money decisions. Silent financial tool failures destroy trust.
- Fix: Add onError toast + inline error below footer CTA. Do not clear form on failure.
- Suggested command: /impeccable harden

**[P0] "Vider" clears instantly with no undo**
- What: clearSession fires immediately. 12-tournament grid gone with one click.
- Why it matters: "Vider" button at same visual level as info content in header. Accidentally triggered under cognitive load.
- Fix: Cache previous items in lastGrid ref. Show 5s undo toast. Commit clear on timeout.
- Suggested command: /impeccable harden

**[P1] No current-time cursor on the timeline**
- What: No "now" indicator on 6h–24h timeline. Mental math required to find current moment.
- Why it matters: Real-time planning without temporal context is broken.
- Fix: Absolute 1px vertical line in electric-blue at current time offset. 4px circle cap. Mount on load.
- Suggested command: /impeccable polish

**[P1] TYPE_ABBR codes undocumented**
- What: CL, KO, PKO, FL in timeline bars with no legend.
- Why it matters: Recall over recognition. Violates "data first" principle.
- Fix: Always-visible legend row below timeline: "CL Classic · KO Knockout · PKO Progressive KO · FL Flight".
- Suggested command: /impeccable clarify

**[P2] Electric-blue shared between data bars and primary CTA**
- What: Timeline bars and Valider button both use electric-blue. CTA loses hierarchy signal.
- Why it matters: Per DESIGN.md, electric-blue reserved for interactive elements only.
- Fix: Shift bars to bg-white/8 border border-white/15 text-on-surface-variant. Keep amber for overlaps.
- Suggested command: /impeccable colorize

## Persona Red Flags

**Alex (Power User / MTT Grinder Pro):** Zero keyboard shortcuts. Scroll-trap at 8+ tournaments (max-h-64). No saved grid templates — starts from scratch every session. "Vider" reachable accidentally.

**Riley (Stress Tester):** 15 tournaments → ~900px card height. Fixed ESTIMATED_DURATION_MIN=180 means 4h tournaments overflow past 24h boundary. No maxLength → 200-char session name → silent API failure.

**The Regularist (Semi-pro, same daily grid):** No grid memory, no templates, no "repeat last session". Zustand store has no persist middleware — grid lost on refresh. Highest-friction workflow for highest-frequency user behavior.

## Minor Observations

- py-2.5 on list rows is generous; py-2 matches GTO Wizard density
- hover:opacity-90 on CTA reduces text contrast on hover; use brightness-110 instead
- Outer "Grille du jour" heading in DashboardPage redundant with "Grille en cours" inside SessionBuilder
- No aria-label on icon-only remove buttons (X per row)

## Questions to Consider

1. Is the timeline answering the question users have at planning time? It shows when tournaments start (info they already know). What about reentry windows, estimated duration variance?
2. Why does the session have a name? If used downstream for analytics filtering, require it with smart default. If not used, remove it.
3. Should "Valider la session" be end of planning or start of competition? The redirect to live tracking makes this the moment buy-ins are committed. Should it feel that way?
