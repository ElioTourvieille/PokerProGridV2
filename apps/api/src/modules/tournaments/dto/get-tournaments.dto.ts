import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { TournamentType, TournamentStructure, TournamentStatus, Room } from '@prisma/client'

export class GetTournamentsDto {
  @IsOptional()
  @IsEnum(Room)
  room?: Room

  @IsOptional()
  @IsEnum(TournamentType)
  type?: TournamentType

  @IsOptional()
  @IsEnum(TournamentStructure)
  structure?: TournamentStructure

  @IsOptional()
  @IsEnum(TournamentStatus)
  status?: TournamentStatus

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  buyInMin?: number

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  buyInMax?: number

  @IsOptional()
  @IsString()
  date?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 50

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0

  @IsOptional()
  @IsEnum(['startTime', 'buyIn', 'evScore', 'overlayAmount'])
  @Transform(({ value }) => value ?? 'startTime')
  sortBy?: 'startTime' | 'buyIn' | 'evScore' | 'overlayAmount' = 'startTime'

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'asc'
}
