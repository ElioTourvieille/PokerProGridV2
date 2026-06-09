import { IsInt, IsOptional, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class GetSessionsDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  limit: number = 20

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset: number = 0
}
