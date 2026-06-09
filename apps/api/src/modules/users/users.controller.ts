import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser, type RequestUser } from '../auth/decorators/current-user.decorator'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: RequestUser) {
    return this.usersService.getMe(user.id)
  }

  @Patch('me')
  updateMe(@CurrentUser() user: RequestUser, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(user.id, dto)
  }

  @Get('me/preferences')
  getPreferences(@CurrentUser() user: RequestUser) {
    return this.usersService.getPreferences(user.id)
  }

  @Patch('me/preferences')
  updatePreferences(
    @CurrentUser() user: RequestUser,
    @Body() dto: Pick<UpdateUserDto, 'defaultBuyIn' | 'favoriteStructures'>,
  ) {
    return this.usersService.updatePreferences(user.id, dto)
  }

  @Get('me/stats')
  getStats(@CurrentUser() user: RequestUser) {
    return this.usersService.getStats(user.id)
  }
}
