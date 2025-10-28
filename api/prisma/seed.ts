import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create demo game
  const runnerGame = await prisma.game.upsert({
    where: { slug: 'runner' },
    update: {},
    create: {
      slug: 'runner',
      title: 'Runner',
      engine: 'pixi-runner',
      defaultConfig: {
        timeLimit: 60,
        difficulty: 1
      }
    }
  })

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { username: 'demo_creator' },
    update: {},
    create: {
      username: 'demo_creator',
      email: 'demo@example.com',
      role: 'CREATOR'
    }
  })

  // Create demo level
  await prisma.level.upsert({
    where: { id: 'demo-level-1' },
    update: {},
    create: {
      id: 'demo-level-1',
      gameId: runnerGame.id,
      creatorId: demoUser.id,
      title: 'Demo Runner Level',
      description: 'A simple demo level for the Runner game',
      data: {
        obstacles: [],
        seed: 12345
      },
      publishedAt: new Date()
    }
  })

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })