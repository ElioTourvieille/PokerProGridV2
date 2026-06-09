import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'
import { SessionStatus } from '@prisma/client'

export class UpdateSessionDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus
}
