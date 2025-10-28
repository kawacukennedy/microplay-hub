import { FastifyPluginAsync } from 'fastify'

const auth: FastifyPluginAsync = async (fastify, opts) => {
  fastify.post('/auth/guest', async (request, reply) => {
    // TODO: Implement guest session creation
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const token = 'guest_token_placeholder'

    return {
      guestId,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
  })
}

export default auth