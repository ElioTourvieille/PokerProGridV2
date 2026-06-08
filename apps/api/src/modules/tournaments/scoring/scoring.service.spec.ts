import { ScoringService } from './scoring.service'

describe('ScoringService', () => {
  let service: ScoringService

  beforeEach(() => {
    service = new ScoringService()
  })

  describe('calculateOverlayAmount', () => {
    it('returns 0 when pool covers guaranteed', () => {
      // 100 players × 10€ = 1000€ collected, guaranteed 1000€ → no overlay
      expect(service.calculateOverlayAmount(1000, 100, 10)).toBe(0)
    })

    it('returns overlay when guaranteed > collected', () => {
      // 80 players × 10€ = 800€ collected, guaranteed 1000€ → 200€ overlay
      expect(service.calculateOverlayAmount(1000, 80, 10)).toBe(200)
    })

    it('returns 0 when guaranteed is 0', () => {
      expect(service.calculateOverlayAmount(0, 50, 10)).toBe(0)
    })

    it('accounts for rake in overlay calculation', () => {
      // 80 players × (10€ buyIn - 1€ rake) = 720€ net, guaranteed 1000€ → 280€ overlay
      expect(service.calculateOverlayAmount(1000, 80, 10, 1)).toBe(280)
    })
  })

  describe('calculateEvScore', () => {
    it('returns 100 at break-even (no overlay)', () => {
      expect(service.calculateEvScore(1000, 100, 10)).toBe(100)
    })

    it('returns > 100 with overlay (positive EV)', () => {
      // 80 players × 10€ = 800€ collected, 1000€ guaranteed → 125 EV score
      expect(service.calculateEvScore(1000, 80, 10)).toBe(125)
    })

    it('returns 100 when no registration data', () => {
      expect(service.calculateEvScore(0, 0, 10)).toBe(100)
    })

    it('returns < 100 when prize pool below collected (negative overlay)', () => {
      // 150 players × 10€ = 1500€ collected but only 1000€ guaranteed
      const score = service.calculateEvScore(1000, 150, 10)
      expect(score).toBeLessThan(100)
    })
  })

  describe('calculateOverallScore', () => {
    it('gives higher score to deep stack with strong overlay', () => {
      const highValue = service.calculateOverallScore({
        buyIn: 10,
        guaranteed: 2000,
        registeredPlayers: 50,
        maxPlayers: 200,
        structure: 'DEEP_STACK',
      })
      const lowValue = service.calculateOverallScore({
        buyIn: 10,
        guaranteed: 100,
        registeredPlayers: 100,
        maxPlayers: 100,
        structure: 'HYPER_TURBO',
      })
      expect(highValue).toBeGreaterThan(lowValue)
    })

    it('gives 0 EV component at break-even', () => {
      const score = service.calculateOverallScore({
        buyIn: 10,
        guaranteed: 1000,
        registeredPlayers: 100,
        maxPlayers: 100,
        structure: 'NORMAL',
      })
      // fill rate = 1 → fillComponent = 0, evComponent = 0, structureComponent = 20
      expect(score).toBeCloseTo(20, 0)
    })

    it('returns neutral fill component when maxPlayers is null', () => {
      const score = service.calculateOverallScore({
        buyIn: 10,
        guaranteed: 0,
        registeredPlayers: 0,
        maxPlayers: null,
        structure: 'NORMAL',
      })
      // evComponent = 0, fillComponent = 15 (neutral), structureComponent = 20 → 35
      expect(score).toBeCloseTo(35, 0)
    })
  })
})
