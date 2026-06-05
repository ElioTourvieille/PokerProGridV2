export enum Room {
  WINAMAX = 'WINAMAX',
  POKERSTARS = 'POKERSTARS',
  PMU = 'PMU',
  COINPOKER = 'COINPOKER',
  UNIBET = 'UNIBET',
}

export enum TournamentType {
  CLASSIC = 'CLASSIC',
  KNOCKOUT = 'KNOCKOUT',
  PROGRESSIVE_KNOCKOUT = 'PROGRESSIVE_KNOCKOUT',
  FLIGHT = 'FLIGHT',
}

export enum TournamentStructure {
  NORMAL = 'NORMAL',
  DEEP_STACK = 'DEEP_STACK',
  TURBO = 'TURBO',
  HYPER_TURBO = 'HYPER_TURBO',
}

export interface Tournament {
  id: string
  externalId: string
  room: Room
  name: string
  type: TournamentType
  structure: TournamentStructure
  buyIn: number
  rake: number
  guaranteed: number
  startTime: Date
  lateRegEndsAt: Date | null
  maxPlayers: number | null
  registeredPlayers: number
  status: TournamentStatus
  evScore: number | null
  overlayAmount: number | null
  createdAt: Date
  updatedAt: Date
}

export enum TournamentStatus {
  UPCOMING = 'UPCOMING',
  REGISTERING = 'REGISTERING',
  LATE_REG = 'LATE_REG',
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export interface TournamentFilters {
  rooms?: Room[]
  types?: TournamentType[]
  structures?: TournamentStructure[]
  buyInMin?: number
  buyInMax?: number
  guaranteedMin?: number
  startAfter?: Date
  startBefore?: Date
}
