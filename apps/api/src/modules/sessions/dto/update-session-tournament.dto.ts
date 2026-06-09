import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { SessionTournamentStatus } from '@prisma/client'

export class UpdateSessionTournamentDto {
  @IsOptional()
  @IsEnum(SessionTournamentStatus)
  status?: SessionTournamentStatus

  @IsOptional()
  @IsNumber()
  @Min(0)
  cashout?: number

  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  totalPlayers?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  rebuys?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  addOns?: number

  @IsOptional()
  @IsString()
  @IsOptional()
  notes?: string
}
