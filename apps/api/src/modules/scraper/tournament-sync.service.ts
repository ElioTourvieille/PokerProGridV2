import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'
import { TournamentsService } from '../tournaments/tournaments.service'
import { ScoringService } from '../tournaments/scoring/scoring.service'

interface RawTournament {
  external_id: string
  room: string
  name: string
  type: string
  structure: string
  buy_in: number
  rake: number
  guaranteed: number
  start_time: string
  late_reg_ends_at: string | null
  max_players: number | null
  registered_players: number
  status: string
}

@Injectable()
export class TournamentSyncService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TournamentSyncService.name)
  private subscriber: Redis

  constructor(
    private readonly config: ConfigService,
    private readonly tournamentsService: TournamentsService,
    private readonly scoringService: ScoringService,
  ) {}

  onModuleInit() {
    const redisUrl = this.config.get<string>('REDIS_URL', 'redis://localhost:6379')

    this.subscriber = new Redis(redisUrl, {
      // No limit on retries for subscribe commands — needed for auto-reconnect
      maxRetriesPerRequest: null,
      // Retry with increasing backoff, give up logging after first attempt
      retryStrategy: (times) => {
        if (times === 1) this.logger.warn('Redis unavailable — will retry silently until it comes back')
        // Never stop retrying: keep trying until Docker/Redis starts
        return Math.min(times * 200, 5_000)
      },
    })

    // Handle errors explicitly so ioredis doesn't emit an unhandled error event
    this.subscriber.on('error', (err: Error) => {
      if (!err.message.includes('ECONNREFUSED') && !err.message.includes('ENOTFOUND')) {
        this.logger.error(`Redis error: ${err.message}`)
      }
    })

    this.subscriber.on('ready', () => {
      this.logger.log('Redis connected — subscribing to tournaments:updated')
    })

    this.subscriber.subscribe('tournaments:updated', (err) => {
      if (err) this.logger.error(`Redis subscribe error: ${err.message}`)
    })

    this.subscriber.on('message', (_channel: string, room: string) => {
      this.logger.log(`Received update signal for room: ${room}`)
      this.syncRoom(room).catch((e: Error) => this.logger.error(`Sync failed for ${room}: ${e.message}`))
    })
  }

  async onModuleDestroy() {
    await this.subscriber.quit()
  }

  private async syncRoom(room: string) {
    const redisUrl = this.config.get<string>('REDIS_URL', 'redis://localhost:6379')
    const dataClient = new Redis(redisUrl, { maxRetriesPerRequest: 3 })
    dataClient.on('error', (err: Error) => this.logger.error(`Redis data error: ${err.message}`))

    try {
      const raw = await dataClient.get(`${room}:tournaments`)
      if (!raw) {
        this.logger.warn(`No cached data for ${room}:tournaments`)
        return
      }

      const tournaments: RawTournament[] = JSON.parse(raw)
      this.logger.log(`Upserting ${tournaments.length} ${room} tournaments`)

      const prepared = tournaments.map((t) => {
        const partial = {
          externalId: t.external_id,
          room: t.room,
          name: t.name,
          type: t.type,
          structure: t.structure,
          buyIn: t.buy_in,
          rake: t.rake,
          guaranteed: t.guaranteed,
          startTime: new Date(t.start_time),
          lateRegEndsAt: t.late_reg_ends_at ? new Date(t.late_reg_ends_at) : null,
          maxPlayers: t.max_players,
          registeredPlayers: t.registered_players,
          status: t.status,
        }

        const scores = this.scoringService.score({
          ...partial,
          id: '',
          evScore: null,
          overlayAmount: null,
          rawData: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          room: partial.room as never,
          type: partial.type as never,
          structure: partial.structure as never,
          status: partial.status as never,
        })

        return { ...partial, ...scores }
      })

      await this.tournamentsService.upsertFromScraper(prepared)
      this.logger.log(`Sync complete for ${room}: ${prepared.length} tournaments`)
    } finally {
      await dataClient.quit()
    }
  }
}
