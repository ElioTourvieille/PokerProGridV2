export type TournamentRoom = 'WINAMAX' | 'POKERSTARS' | 'PMU' | 'COINPOKER' | 'UNIBET'
export type TournamentType = 'CLASSIC' | 'KNOCKOUT' | 'PROGRESSIVE_KNOCKOUT' | 'FLIGHT'
export type TournamentStructure = 'NORMAL' | 'DEEP_STACK' | 'TURBO' | 'HYPER_TURBO'
export type TournamentStatus = 'UPCOMING' | 'REGISTERING' | 'LATE_REG' | 'RUNNING' | 'FINISHED' | 'CANCELLED'

export interface Tournament {
  id: string
  externalId: string
  room: TournamentRoom
  name: string
  type: TournamentType
  structure: TournamentStructure
  buyIn: number
  rake: number
  guaranteed: number
  startTime: string
  lateRegEndsAt: string | null
  maxPlayers: number | null
  registeredPlayers: number
  status: TournamentStatus
  evScore: number | null
  overlayAmount: number | null
}

export interface TournamentsResponse {
  total: number
  tournaments: Tournament[]
}

export type SessionStatus = 'PLANNED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED'
export type SessionTournamentStatus = 'PLANNED' | 'REGISTERED' | 'PLAYING' | 'ITM' | 'BUST' | 'FINISHED'

export interface Session {
  id: string
  userId: string
  name: string | null
  status: SessionStatus
  startedAt: string | null
  endedAt: string | null
  notes: string | null
  tournaments: SessionTournament[]
}

export interface SessionTournament {
  id: string
  sessionId: string
  tournamentId: string
  status: SessionTournamentStatus
  buyIn: number
  position: number | null
  totalPlayers: number | null
  cashout: number
  rebuys: number
  addOns: number
  notes: string | null
  tournament?: Tournament
}

export interface SessionSummary {
  id: string
  userId: string
  name: string | null
  status: SessionStatus
  startedAt: string | null
  endedAt: string | null
  notes: string | null
  tournamentCount: number
  totalBuyIn: number
  totalCashout: number
  profitLoss: number
  roi: number
}

export interface SessionsResponse {
  sessions: SessionSummary[]
  total: number
}

export interface PlDataPoint {
  date: string
  profitLoss: number
  cumulative: number
}

export interface RoiByType {
  type: TournamentType
  roi: number
  count: number
}

export interface UserStats {
  sessionCount: number
  totalBuyIn: number
  totalCashout: number
  profitLoss: number
  roi: number
  plOverTime: PlDataPoint[]
  roiByType: RoiByType[]
  mostPlayedTournaments: { name: string; count: number }[]
}

export type SubscriptionTier = 'FREE' | 'PRO' | 'PREMIUM'

export interface UserProfile {
  id: string
  email: string
  username: string | null
  avatarUrl: string | null
  bankroll: number
  subscriptionTier: SubscriptionTier
  subscriptionExpiresAt: string | null
  defaultBuyIn: number
  favoriteStructures: string[]
}
