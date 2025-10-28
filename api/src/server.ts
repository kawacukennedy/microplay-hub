import Fastify from 'fastify'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { authenticate, optionalAuth } from './lib/auth'

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
})

// Register routes
fastify.register(import('./routes/auth'))
fastify.register(import('./routes/levels'))
fastify.register(import('./routes/scores'))
fastify.register(import('./routes/assets'))
fastify.register(import('./routes/shortlinks'))
fastify.register(import('./routes/share'))
fastify.register(import('./routes/keys'))
fastify.register(import('./routes/moderation'))

// Add hooks
fastify.addHook('preHandler', optionalAuth)

// Socket.IO namespace
io.of('/ws').on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('joinLeaderboard', (data: { levelId: string; period: 'alltime' | 'weekly' }) => {
    const { levelId, period } = data
    const room = `leaderboard:${levelId}:${period}`

    socket.join(room)
    console.log(`User ${socket.id} joined leaderboard room: ${room}`)

    // TODO: Send current leaderboard data
    // socket.emit('leaderboardData', { levelId, period, entries: [] })
  })

  socket.on('leaveLeaderboard', (data: { levelId: string; period: 'alltime' | 'weekly' }) => {
    const { levelId, period } = data
    const room = `leaderboard:${levelId}:${period}`

    socket.leave(room)
    console.log(`User ${socket.id} left leaderboard room: ${room}`)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Function to broadcast leaderboard updates
export function broadcastLeaderboardUpdate(
  levelId: string,
  period: 'alltime' | 'weekly',
  updates: any[]
) {
  const room = `leaderboard:${levelId}:${period}`
  io.of('/ws').to(room).emit('leaderboardUpdate', {
    levelId,
    period,
    updates,
    timestamp: Date.now()
  })
}

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' })
    console.log('Server listening on http://localhost:3001')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()