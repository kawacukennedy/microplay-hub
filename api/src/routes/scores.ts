import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { createHMAC } from '../../../shared/src'

const scores: FastifyPluginAsync = async (fastify, opts) => {
  // Submit score
  fastify.post('/scores', async (request, reply) => {
    const schema = z.object({
      levelId: z.string(),
      value: z.number(),
      duration: z.number(),
      meta: z.record(z.any()),
      clientSignature: z.string(),
      sessionId: z.string(),
      timestamp: z.number(),
      replayData: z.any().optional()
    })

    const { levelId, value, duration, meta, clientSignature, sessionId, timestamp, replayData } = schema.parse(request.body)

    // TODO: Get ephemeral key from Redis by sessionId
    const ephemeralKey = 'mock_ephemeral_key_' + sessionId

    // Verify timestamp is recent (within 30 seconds)
    const now = Date.now()
    if (Math.abs(now - timestamp) > 30000) {
      return reply.code(400).send({ error: 'Timestamp too old' })
    }

    // Verify client signature
    const payload = JSON.stringify({ levelId, value, duration, meta, timestamp })
    const expectedSignature = createHMAC(payload, ephemeralKey)

    if (clientSignature !== expectedSignature) {
      return reply.code(400).send({ error: 'Invalid signature' })
    }

    // Quick validation heuristics
    const maxScore = 100000 // TODO: Get from level/game config
    if (value > maxScore) {
      return reply.code(400).send({ error: 'Score exceeds maximum possible' })
    }

    if (duration > 70) { // Allow some buffer
      return reply.code(400).send({ error: 'Duration too long' })
    }

    // TODO: Check recent submissions for rate limiting

    // TODO: Store score in database
    const scoreId = `score_${Date.now()}`

    // TODO: Add to Redis leaderboard optimistically
    // TODO: Queue for background validation if suspicious

    return {
      status: 'accepted',
      scoreId,
      provisionalRank: Math.floor(Math.random() * 10) + 1 // Mock rank
    }
  })

  // Get leaderboard
  fastify.get('/scores/leaderboard/:levelId', async (request, reply) => {
    const { levelId } = request.params as { levelId: string }
    const schema = z.object({
      period: z.enum(['alltime', 'weekly']).optional(),
      limit: z.string().transform(Number).optional()
    })

    const { period = 'alltime', limit = 10 } = schema.parse(request.query)

    // TODO: Get from Redis leaderboard
    const mockLeaderboard = Array.from({ length: limit }, (_, i) => ({
      userId: `user_${i + 1}`,
      username: `Player${i + 1}`,
      score: 10000 - i * 500,
      scoreId: `score_${i + 1}`,
      rank: i + 1
    }))

    return { leaderboard: mockLeaderboard }
  })

  // Get user's scores
  fastify.get('/scores/user/:userId', async (request, reply) => {
    const { userId } = request.params as { userId: string }

    // TODO: Get from database
    const mockScores = [
      {
        id: 'score_1',
        levelId: 'level_1',
        value: 8500,
        createdAt: new Date()
      }
    ]

    return { scores: mockScores }
  })
}

export default scores