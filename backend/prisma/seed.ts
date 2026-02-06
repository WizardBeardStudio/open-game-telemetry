import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seeding...')

  // Create some initial Game Events as fixtures
  const event1 = await prisma.gameEvent.create({
    data: {
      gameName: "Cyber Sprint",
      gameType: "Racing",
      gameVersion: "1.0.0",
      eventType: "SESSION_START",
      payload: { map: "Neo-Tokyo", players: 8 }
    },
  })

  const event2 = await prisma.gameEvent.create({
    data: {
      gameName: "Cyber Sprint",
      gameType: "Racing",
      gameVersion: "1.0.0",
      eventType: "LAP_COMPLETE",
      payload: { lapTime: 45.5, player: "SpeedRacer" }
    },
  })

  console.log({ event1, event2 })
  console.log('✅ Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    throw e; 
  });
