import { Module } from '@nestjs/common'
import { TournamentSyncService } from './tournament-sync.service'
import { TournamentsModule } from '../tournaments/tournaments.module'

@Module({
  imports: [TournamentsModule],
  providers: [TournamentSyncService],
})
export class ScraperModule {}
