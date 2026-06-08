import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username?: string

  @IsOptional()
  @IsUrl()
  avatarUrl?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  bankroll?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultBuyIn?: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoriteStructures?: string[]
}
