import { Injectable } from '@nestjs/common'
import { Tournament } from '@prisma/client'

interface TournamentForScoring {
  buyIn: number
  guaranteed: number
  registeredPlayers: number
  maxPlayers: number | null
  structure: string
}

@Injectable()
export class ScoringService {
  /**
   * Absolute overlay: prize pool contributed by the house.
   * Positive = house subsidises the pool (value for players).
   */
  calculateOverlayAmount(
    guaranteed: number,
    registeredPlayers: number,
    buyIn: number,
    rake = 0,
  ): number {
    if (guaranteed <= 0) return 0
    const collected = registeredPlayers * (buyIn - rake)
    return Math.max(0, guaranteed - collected)
  }

  /**
   * EV score: expected value as % above break-even (100 = break-even, 120 = +20% EV).
   * When there is no registration data, defaults to 100.
   */
  calculateEvScore(
    guaranteed: number,
    registeredPlayers: number,
    buyIn: number,
    rake = 0,
  ): number {
    const totalCost = registeredPlayers * buyIn
    if (totalCost <= 0 || guaranteed <= 0) return 100
    const net = registeredPlayers * (buyIn - rake)
    if (net <= 0) return 100
    return Number(((guaranteed / net) * 100).toFixed(2))
  }

  /**
   * Overall score 0–100 for surface-level tournament ranking.
   *
   * Weights:
   *   40% — EV score (capped at +50% overlay = full points)
   *   30% — Fill rate (lower fill = more overlay risk, higher value)
   *   30% — Structure bonus (DEEP_STACK > NORMAL > TURBO > HYPER_TURBO)
   */
  calculateOverallScore(tournament: TournamentForScoring): number {
    const { buyIn, guaranteed, registeredPlayers, maxPlayers, structure } = tournament

    // EV component (0–40)
    const evScore = this.calculateEvScore(guaranteed, registeredPlayers, buyIn)
    const evNormalized = Math.min((evScore - 100) / 50, 1) // 0 at break-even, 1 at +50% overlay
    const evComponent = Math.max(0, evNormalized) * 40

    // Fill rate component (0–30): empty = full points, full = 0 points
    let fillComponent = 15 // neutral when data unavailable
    if (maxPlayers && maxPlayers > 0 && registeredPlayers >= 0) {
      const fillRate = registeredPlayers / maxPlayers
      fillComponent = Math.max(0, (1 - fillRate)) * 30
    }

    // Structure component (0–30)
    const structureScores: Record<string, number> = {
      DEEP_STACK: 30,
      NORMAL: 20,
      TURBO: 10,
      HYPER_TURBO: 5,
    }
    const structureComponent = structureScores[structure] ?? 20

    return Number((evComponent + fillComponent + structureComponent).toFixed(1))
  }

  /**
   * Compute and attach all scores to a tournament record.
   * Returns partial update object ready for Prisma upsert.
   */
  score(t: Tournament): { evScore: number; overlayAmount: number } {
    return {
      overlayAmount: this.calculateOverlayAmount(t.guaranteed, t.registeredPlayers, t.buyIn, t.rake),
      evScore: this.calculateOverallScore({
        buyIn: t.buyIn,
        guaranteed: t.guaranteed,
        registeredPlayers: t.registeredPlayers,
        maxPlayers: t.maxPlayers,
        structure: t.structure,
      }),
    }
  }
}
