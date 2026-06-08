import { Module } from '@nestjs/common'
import { TournamentsController } from './tournaments.controller'
import { TournamentsService } from './tournaments.service'
import { ScoringService } from './scoring/scoring.service'

@Module({
  controllers: [TournamentsController],
  providers: [TournamentsService, ScoringService],
  exports: [TournamentsService, ScoringService],
})
export class TournamentsModule {}
