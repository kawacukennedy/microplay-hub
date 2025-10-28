import { FastifyPluginAsync } from 'fastify'
import crypto from 'crypto'

const keys: FastifyPluginAsync = async (fastify, opts) => {
  // Get ephemeral key for client signing
  fastify.get('/keys/ephemeral', async (request, reply) => {
    // Generate ephemeral key
    const ephemeralKey = crypto.randomBytes(32).toString('hex')
    const sessionId = crypto.randomBytes(16).toString('hex')

    // TODO: Store in Redis with TTL (30 seconds)
    // For now, just return the key

    return {
      ephemeralKey,
      sessionId,
      expiresAt: Date.now() + 30000 // 30 seconds
    }
  })

  // Validate ephemeral key (for debugging)
  fastify.post('/keys/validate', async (request, reply) => {
    const { sessionId, ephemeralKey } = request.body as {
      sessionId: string
      ephemeralKey: string
    }

    // TODO: Check if key exists in Redis and is valid

    return { valid: true }
  })
}

export default keys