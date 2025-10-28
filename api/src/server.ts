import Fastify from 'fastify'
import { Server } from 'socket.io'
import { createServer } from 'http'

const fastify = Fastify({
  logger: true
})

const server = createServer(fastify.server)

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

// Register routes
fastify.register(import('./routes/auth'))
fastify.register(import('./routes/levels'))
fastify.register(import('./routes/scores'))

// Health check
fastify.get('/health', async () => {
  return { status: 'ok' }
})

// Socket.IO namespace
io.of('/ws').on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('joinLeaderboard', (data) => {
    // TODO: Implement leaderboard subscription
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

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