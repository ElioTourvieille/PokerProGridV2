import { PrismaClient, Room, TournamentType, TournamentStructure } from '@prisma/client'

const prisma = new PrismaClient()

const SEED_TOURNAMENTS = [
  { name: 'ANDROMEDA', type: TournamentType.CLASSIC, structure: TournamentStructure.NORMAL, buyIn: 50, guaranteed: 10000, hour: 0 },
  { name: 'Déglingos', type: TournamentType.CLASSIC, structure: TournamentStructure.NORMAL, buyIn: 5, guaranteed: 1000, hour: 0 },
  { name: 'Hold\'em [180 Max]', type: TournamentType.CLASSIC, structure: TournamentStructure.NORMAL, buyIn: 5, guaranteed: 500, hour: 1, maxPlayers: 180 },
  { name: 'Monster Stack', type: TournamentType.CLASSIC, structure: TournamentStructure.DEEP_STACK, buyIn: 10, guaranteed: 2000, hour: 1 },
  { name: 'SPACE KO', type: TournamentType.KNOCKOUT, structure: TournamentStructure.NORMAL, buyIn: 1, guaranteed: 200, hour: 2 },
  { name: 'CENTAURUS', type: TournamentType.CLASSIC, structure: TournamentStructure.NORMAL, buyIn: 20, guaranteed: 5000, hour: 2 },
  { name: 'DEEPSTACK Hold\'em', type: TournamentType.CLASSIC, structure: TournamentStructure.DEEP_STACK, buyIn: 2, guaranteed: 500, hour: 3 },
  { name: 'TRIDENT SPACE KO', type: TournamentType.KNOCKOUT, structure: TournamentStructure.NORMAL, buyIn: 5, guaranteed: 1500, hour: 4 },
  { name: 'MYSTERY KO', type: TournamentType.KNOCKOUT, structure: TournamentStructure.NORMAL, buyIn: 50, guaranteed: 15000, hour: 5 },
  { name: 'MiniRoll', type: TournamentType.CLASSIC, structure: TournamentStructure.NORMAL, buyIn: 0.25, guaranteed: 100, hour: 6 },
  { name: 'PKO Deepstack 10€', type: TournamentType.PROGRESSIVE_KNOCKOUT, structure: TournamentStructure.DEEP_STACK, buyIn: 10, guaranteed: 3000, hour: 7 },
  { name: 'Turbo Hold\'em', type: TournamentType.CLASSIC, structure: TournamentStructure.TURBO, buyIn: 5, guaranteed: 500, hour: 8 },
  { name: 'Hyper Turbo 2€', type: TournamentType.CLASSIC, structure: TournamentStructure.HYPER_TURBO, buyIn: 2, guaranteed: 200, hour: 9 },
  { name: 'THE BIG ONE', type: TournamentType.CLASSIC, structure: TournamentStructure.NORMAL, buyIn: 100, guaranteed: 50000, hour: 20, registeredPlayers: 350 },
  { name: 'Sunday Special', type: TournamentType.CLASSIC, structure: TournamentStructure.NORMAL, buyIn: 30, guaranteed: 20000, hour: 20, registeredPlayers: 600 },
  { name: 'Daily Deepstack', type: TournamentType.CLASSIC, structure: TournamentStructure.DEEP_STACK, buyIn: 15, guaranteed: 5000, hour: 20, registeredPlayers: 280, overlay: true },
  { name: 'Rush & Cash KO', type: TournamentType.KNOCKOUT, structure: TournamentStructure.TURBO, buyIn: 20, guaranteed: 8000, hour: 21 },
  { name: 'Freeroll Bienvenue', type: TournamentType.CLASSIC, structure: TournamentStructure.NORMAL, buyIn: 0, guaranteed: 500, hour: 22 },
  { name: 'Midnight Turbo PKO', type: TournamentType.PROGRESSIVE_KNOCKOUT, structure: TournamentStructure.TURBO, buyIn: 25, guaranteed: 7500, hour: 23 },
  { name: 'GALAXIE', type: TournamentType.CLASSIC, structure: TournamentStructure.NORMAL, buyIn: 200, guaranteed: 100000, hour: 19, registeredPlayers: 400 },
]

async function main() {
  console.log('Seeding tournaments...')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < SEED_TOURNAMENTS.length; i++) {
    const t = SEED_TOURNAMENTS[i] as any
    const startTime = new Date(today)
    startTime.setHours(t.hour, 0, 0, 0)

    const registeredPlayers = t.registeredPlayers ?? Math.floor(Math.random() * 100) + 20
    const overlay = t.overlay
      ? Math.max(0, t.guaranteed - registeredPlayers * t.buyIn)
      : 0

    await prisma.tournament.upsert({
      where: { room_externalId: { room: Room.WINAMAX, externalId: `seed-${i + 1}` } },
      create: {
        externalId: `seed-${i + 1}`,
        room: Room.WINAMAX,
        name: t.name,
        type: t.type,
        structure: t.structure,
        buyIn: t.buyIn,
        rake: t.buyIn * 0.1,
        guaranteed: t.guaranteed,
        startTime,
        maxPlayers: t.maxPlayers ?? null,
        registeredPlayers,
        evScore: t.guaranteed > 0 ? Number(((t.guaranteed / Math.max(registeredPlayers * t.buyIn, 1)) * 100).toFixed(1)) : 100,
        overlayAmount: overlay,
      },
      update: {},
    })
  }

  console.log(`Seeded ${SEED_TOURNAMENTS.length} tournaments`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
