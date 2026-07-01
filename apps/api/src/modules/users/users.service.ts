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

  async getStats(userId: string) {
    const sessions = await this.prisma.session.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { endedAt: 'asc' },
      include: {
        tournaments: {
          select: {
            buyIn: true,
            cashout: true,
            rebuys: true,
            status: true,
            tournament: { select: { type: true, name: true } },
          },
        },
      },
    })

    let totalBuyIn = 0
    let totalCashout = 0
    const byType: Record<string, { buyIn: number; cashout: number; count: number }> = {}
    const nameCounts: Record<string, number> = {}

    for (const s of sessions) {
      for (const st of s.tournaments) {
        const effectiveBuyIn = st.buyIn * (1 + st.rebuys)
        totalBuyIn += effectiveBuyIn
        totalCashout += st.cashout
        const type = st.tournament.type
        byType[type] ??= { buyIn: 0, cashout: 0, count: 0 }
        byType[type].buyIn += effectiveBuyIn
        byType[type].cashout += st.cashout
        byType[type].count++
        nameCounts[st.tournament.name] = (nameCounts[st.tournament.name] ?? 0) + 1
      }
    }

    const profitLoss = totalCashout - totalBuyIn
    const roi = totalBuyIn > 0 ? (profitLoss / totalBuyIn) * 100 : 0

    let cumulative = 0
    const plOverTime = sessions.map((s) => {
      const sbi = s.tournaments.reduce((sum, st) => sum + st.buyIn * (1 + st.rebuys), 0)
      const sco = s.tournaments.reduce((sum, st) => sum + st.cashout, 0)
      cumulative += sco - sbi
      return { date: (s.endedAt ?? s.createdAt).toISOString(), profitLoss: sco - sbi, cumulative }
    })

    const roiByType = Object.entries(byType).map(([type, { buyIn, cashout, count }]) => ({
      type,
      roi: buyIn > 0 ? ((cashout - buyIn) / buyIn) * 100 : 0,
      count,
    }))

    const mostPlayedTournaments = Object.entries(nameCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return { sessionCount: sessions.length, totalBuyIn, totalCashout, profitLoss, roi, plOverTime, roiByType, mostPlayedTournaments }
  }
}
