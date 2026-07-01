import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser, type RequestUser } from '../auth/decorators/current-user.decorator'
import { SessionsService } from './sessions.service'
import { AddTournamentDto } from './dto/add-tournament.dto'
import { CreateSessionDto } from './dto/create-session.dto'
import { GetSessionsDto } from './dto/get-sessions.dto'
import { UpdateSessionDto } from './dto/update-session.dto'
import { UpdateSessionTournamentDto } from './dto/update-session-tournament.dto'

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateSessionDto) {
    return this.sessionsService.create(user.id, dto)
  }

  @Get()
  findAll(@CurrentUser() user: RequestUser, @Query() dto: GetSessionsDto) {
    return this.sessionsService.findAll(user.id, dto)
  }

  @Get(':id')
  findOne(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.sessionsService.findById(user.id, id)
  }

  @Patch(':id')
  update(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: UpdateSessionDto) {
    return this.sessionsService.update(user.id, id, dto)
  }

  @Post(':id/tournaments')
  addTournament(
    @CurrentUser() user: RequestUser,
    @Param('id') sessionId: string,
    @Body() dto: AddTournamentDto,
  ) {
    return this.sessionsService.addTournament(user.id, sessionId, dto)
  }

  @Patch(':id/tournaments/:tid')
  updateTournament(
    @CurrentUser() user: RequestUser,
    @Param('id') sessionId: string,
    @Param('tid') tournamentId: string,
    @Body() dto: UpdateSessionTournamentDto,
  ) {
    return this.sessionsService.updateSessionTournament(user.id, sessionId, tournamentId, dto)
  }

  @Post(':id/complete')
  complete(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.sessionsService.complete(user.id, id)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.sessionsService.remove(user.id, id)
  }
}
