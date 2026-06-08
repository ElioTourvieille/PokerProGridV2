import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { GetTournamentsDto } from './dto/get-tournaments.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class TournamentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(dto: GetTournamentsDto) {
    const where: Prisma.TournamentWhereInput = {}

    if (dto.room) where.room = dto.room
    if (dto.type) where.type = dto.type
    if (dto.structure) where.structure = dto.structure
    if (dto.status) where.status = dto.status

    if (dto.buyInMin !== undefined || dto.buyInMax !== undefined) {
      where.buyIn = {}
      if (dto.buyInMin !== undefined) where.buyIn.gte = dto.buyInMin
      if (dto.buyInMax !== undefined) where.buyIn.lte = dto.buyInMax
    }

    if (dto.date) {
      const start = new Date(dto.date)
      const end = new Date(dto.date)
      end.setDate(end.getDate() + 1)
      where.startTime = { gte: start, lt: end }
    }

    const [total, tournaments] = await Promise.all([
      this.prisma.tournament.count({ where }),
      this.prisma.tournament.findMany({
        where,
        orderBy: { [dto.sortBy ?? 'startTime']: dto.order ?? 'asc' },
        take: dto.limit ?? 50,
        skip: dto.offset ?? 0,
      }),
    ])

    return { total, tournaments }
  }

  async findById(id: string) {
    return this.prisma.tournament.findUnique({ where: { id } })
  }

  async upsertFromScraper(
    data: {
      externalId: string
      room: string
      name: string
      type: string
      structure: string
      buyIn: number
      rake: number
      guaranteed: number
      startTime: Date
      lateRegEndsAt?: Date | null
      maxPlayers?: number | null
      registeredPlayers: number
      status: string
      evScore: number
      overlayAmount: number
    }[],
  ) {
    const ops = data.map((t) =>
      this.prisma.tournament.upsert({
        where: { room_externalId: { room: t.room as any, externalId: t.externalId } },
        create: {
          externalId: t.externalId,
          room: t.room as any,
          name: t.name,
          type: t.type as any,
          structure: t.structure as any,
          buyIn: t.buyIn,
          rake: t.rake,
          guaranteed: t.guaranteed,
          startTime: t.startTime,
          lateRegEndsAt: t.lateRegEndsAt ?? null,
          maxPlayers: t.maxPlayers ?? null,
          registeredPlayers: t.registeredPlayers,
          status: t.status as any,
          evScore: t.evScore,
          overlayAmount: t.overlayAmount,
        },
        update: {
          name: t.name,
          registeredPlayers: t.registeredPlayers,
          status: t.status as any,
          evScore: t.evScore,
          overlayAmount: t.overlayAmount,
          guaranteed: t.guaranteed,
          lateRegEndsAt: t.lateRegEndsAt ?? null,
        },
      }),
    )

    return this.prisma.$transaction(ops)
  }
}
