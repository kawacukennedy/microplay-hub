import { FastifyPluginAsync } from 'fastify'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const auth: FastifyPluginAsync = async (fastify, opts) => {
  // Guest session creation
  fastify.post('/auth/guest', async (request, reply) => {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // TODO: Store guest session in database/cache
    const token = jwt.sign(
      { guestId, type: 'guest' },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    )

    return {
      guestId,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  // OAuth callback (simplified)
  fastify.post('/auth/oauth/callback', async (request, reply) => {
    const schema = z.object({
      provider: z.enum(['google', 'github']),
      code: z.string(),
      guestId: z.string().optional()
    })

    const { provider, code, guestId } = schema.parse(request.body)

    // TODO: Exchange code for user info from OAuth provider
    const mockUser = {
      id: `user_${Date.now()}`,
      username: `user${Date.now()}`,
      email: `user${Date.now()}@example.com`,
      avatarUrl: null
    }

    // TODO: Create or update user in database
    // TODO: Merge guest data if guestId provided

    const token = jwt.sign(
      { userId: mockUser.id, type: 'user' },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '1h' }
    )

    return {
      user: mockUser,
      token,
      refreshToken: 'refresh_token_placeholder' // TODO: Implement refresh tokens
    }
  })

  // Get current user
  fastify.get('/auth/me', async (request, reply) => {
    // TODO: Get user from JWT token
    const mockUser = {
      id: 'user_123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'USER'
    }

    return { user: mockUser }
  })
}

export default auth