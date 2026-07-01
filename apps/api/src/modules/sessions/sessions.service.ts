import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { AddTournamentDto } from './dto/add-tournament.dto'
import { CreateSessionDto } from './dto/create-session.dto'
import { GetSessionsDto } from './dto/get-sessions.dto'
import { UpdateSessionDto } from './dto/update-session.dto'
import { UpdateSessionTournamentDto } from './dto/update-session-tournament.dto'

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateSessionDto) {
    return this.prisma.$transaction(async (tx) => {
      const session = await tx.session.create({
        data: {
          userId,
          status: 'ACTIVE',
          startedAt: new Date(),
          name: dto.name,
          notes: dto.notes,
        },
      })

      if (dto.tournamentIds?.length) {
        const tournaments = await tx.tournament.findMany({
          where: { id: { in: dto.tournamentIds } },
          select: { id: true, buyIn: true },
        })
        await tx.sessionTournament.createMany({
          data: tournaments.map((t) => ({
            sessionId: session.id,
            tournamentId: t.id,
            buyIn: t.buyIn,
            status: 'PLANNED' as const,
          })),
        })
      }

      return tx.session.findUnique({
        where: { id: session.id },
        include: { tournaments: { include: { tournament: true }, orderBy: { createdAt: 'asc' } } },
      })
    })
  }

  async findAll(userId: string, dto: GetSessionsDto) {
    const [sessions, total] = await this.prisma.$transaction([
      this.prisma.session.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: dto.offset,
        take: dto.limit,
        include: {
          tournaments: { select: { buyIn: true, cashout: true, rebuys: true } },
        },
      }),
      this.prisma.session.count({ where: { userId } }),
    ])

    const enriched = sessions.map((s) => {
      const totalBuyIn = s.tournaments.reduce((sum, t) => sum + t.buyIn * (1 + t.rebuys), 0)
      const totalCashout = s.tournaments.reduce((sum, t) => sum + t.cashout, 0)
      const profitLoss = totalCashout - totalBuyIn
      const roi = totalBuyIn > 0 ? (profitLoss / totalBuyIn) * 100 : 0
      const { tournaments: _, ...rest } = s
      return { ...rest, tournamentCount: s.tournaments.length, totalBuyIn, totalCashout, profitLoss, roi }
    })

    return { sessions: enriched, total }
  }

  async findById(userId: string, id: string) {
    const session = await this.prisma.session.findFirst({
      where: { id, userId },
      include: {
        tournaments: {
          include: { tournament: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    })
    if (!session) throw new NotFoundException('Session introuvable')
    return session
  }

  async update(userId: string, id: string, dto: UpdateSessionDto) {
    const session = await this.prisma.session.findFirst({ where: { id, userId } })
    if (!session) throw new NotFoundException('Session introuvable')
    return this.prisma.session.update({ where: { id }, data: dto })
  }

  async addTournament(userId: string, sessionId: string, dto: AddTournamentDto) {
    const session = await this.prisma.session.findFirst({ where: { id: sessionId, userId } })
    if (!session) throw new NotFoundException('Session introuvable')

    const existing = await this.prisma.sessionTournament.findUnique({
      where: { sessionId_tournamentId: { sessionId, tournamentId: dto.tournamentId } },
    })
    if (existing) throw new ConflictException('Tournoi déjà dans la session')

    const tournament = await this.prisma.tournament.findUnique({ where: { id: dto.tournamentId } })
    if (!tournament) throw new NotFoundException('Tournoi introuvable')

    return this.prisma.sessionTournament.create({
      data: { sessionId, tournamentId: dto.tournamentId, buyIn: tournament.buyIn, status: 'PLANNED' },
      include: { tournament: true },
    })
  }

  async updateSessionTournament(
    userId: string,
    sessionId: string,
    tournamentId: string,
    dto: UpdateSessionTournamentDto,
  ) {
    const session = await this.prisma.session.findFirst({ where: { id: sessionId, userId } })
    if (!session) throw new NotFoundException('Session introuvable')

    const st = await this.prisma.sessionTournament.findUnique({
      where: { sessionId_tournamentId: { sessionId, tournamentId } },
    })
    if (!st) throw new NotFoundException('Entrée introuvable')

    return this.prisma.sessionTournament.update({
      where: { id: st.id },
      data: dto,
      include: { tournament: true },
    })
  }

  async remove(userId: string, id: string) {
    const session = await this.prisma.session.findFirst({ where: { id, userId } })
    if (!session) throw new NotFoundException('Session introuvable')
    await this.prisma.session.delete({ where: { id } })
  }

  async complete(userId: string, sessionId: string) {
    const session = await this.findById(userId, sessionId)
    const totalBuyIn = session.tournaments.reduce((sum, st) => sum + st.buyIn * (1 + st.rebuys), 0)
    const totalCashout = session.tournaments.reduce((sum, st) => sum + st.cashout, 0)
    const profitLoss = totalCashout - totalBuyIn
    const roi = totalBuyIn > 0 ? (profitLoss / totalBuyIn) * 100 : 0

    const updated = await this.prisma.session.update({
      where: { id: sessionId },
      data: { status: 'COMPLETED', endedAt: new Date() },
    })

    return { ...updated, totalBuyIn, totalCashout, profitLoss, roi }
  }
}
