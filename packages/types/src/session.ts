import type { Tournament } from './tournament'

export enum SessionStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

export enum SessionTournamentStatus {
  PLANNED = 'PLANNED',
  REGISTERED = 'REGISTERED',
  PLAYING = 'PLAYING',
  ITM = 'ITM',
  BUST = 'BUST',
  FINISHED = 'FINISHED',
}

export interface Session {
  id: string
  userId: string
  name: string | null
  status: SessionStatus
  startedAt: Date | null
  endedAt: Date | null
  totalBuyIn: number
  totalCashout: number
  notes: string | null
  tournaments: SessionTournament[]
  createdAt: Date
  updatedAt: Date
}

export interface SessionTournament {
  id: string
  sessionId: string
  tournamentId: string
  tournament?: Tournament
  status: SessionTournamentStatus
  buyIn: number
  position: number | null
  totalPlayers: number | null
  cashout: number
  rebuys: number
  addOns: number
  notes: string | null
}

export interface SessionStats {
  totalBuyIn: number
  totalCashout: number
  profit: number
  roi: number
  itmCount: number
  itmRate: number
  tournamentCount: number
  avgPosition: number | null
}
