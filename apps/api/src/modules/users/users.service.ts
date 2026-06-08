import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'

const PUBLIC_FIELDS = {
  id: true,
  email: true,
  username: true,
  avatarUrl: true,
  bankroll: true,
  subscriptionTier: true,
  subscriptionExpiresAt: true,
  defaultBuyIn: true,
  favoriteStructures: true,
  createdAt: true,
} as const

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: PUBLIC_FIELDS,
    })
    if (!user) throw new NotFoundException()
    return user
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: PUBLIC_FIELDS,
    })
  }

  async getPreferences(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { defaultBuyIn: true, favoriteStructures: true },
    })
    if (!user) throw new NotFoundException()
    return user
  }

  async updatePreferences(userId: string, dto: Pick<UpdateUserDto, 'defaultBuyIn' | 'favoriteStructures'>) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { defaultBuyIn: true, favoriteStructures: true },
    })
  }
}
