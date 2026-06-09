import { IsString } from 'class-validator'

export class AddTournamentDto {
  @IsString()
  tournamentId: string
}
