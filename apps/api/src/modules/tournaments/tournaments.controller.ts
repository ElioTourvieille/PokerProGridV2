import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { TournamentsService } from './tournaments.service'
import { GetTournamentsDto } from './dto/get-tournaments.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('tournaments')
@UseGuards(JwtAuthGuard)
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
  findAll(@Query() dto: GetTournamentsDto) {
    return this.tournamentsService.findAll(dto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findById(id)
  }
}
