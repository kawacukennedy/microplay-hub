import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

const moderation: FastifyPluginAsync = async (fastify, opts) => {
  // Get pending levels for moderation
  fastify.get('/moderation/levels', async (request, reply) => {
    const schema = z.object({
      limit: z.string().transform(Number).optional(),
      offset: z.string().transform(Number).optional()
    })

    const { limit = 20, offset = 0 } = schema.parse(request.query)

    // TODO: Query database for levels with publishedAt = null (pending moderation)
    const mockPendingLevels = [
      {
        id: 'level-1',
        title: 'New Runner Level',
        creator: {
          id: 'user-123',
          username: 'creator1'
        },
        data: { /* level data */ },
        assets: [],
        tags: ['easy', 'runner'],
        createdAt: new Date('2024-01-25'),
        thumbnailUrl: null
      }
    ]

    return { levels: mockPendingLevels, total: mockPendingLevels.length }
  })

  // Approve level
  fastify.post('/moderation/levels/:id/approve', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { moderatorId, notes } = request.body as {
      moderatorId: string
      notes?: string
    }

    // TODO: Update level publishedAt to now
    // TODO: Log moderation action
    // TODO: Send notification to creator

    return { success: true, action: 'approved' }
  })

  // Reject level
  fastify.post('/moderation/levels/:id/reject', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { moderatorId, reason, notes } = request.body as {
      moderatorId: string
      reason: string
      notes?: string
    }

    // TODO: Mark level as rejected
    // TODO: Log moderation action
    // TODO: Send notification to creator

    return { success: true, action: 'rejected' }
  })

  // Get flagged items
  fastify.get('/moderation/flagged', async (request, reply) => {
    // TODO: Query database for flagged levels/scores
    const mockFlaggedItems = [
      {
        id: 'flag-1',
        type: 'level',
        itemId: 'level-2',
        reason: 'Inappropriate content',
        reportedBy: 'user-456',
        flaggedAt: new Date('2024-01-24'),
        status: 'pending'
      }
    ]

    return { items: mockFlaggedItems }
  })

  // Resolve flagged item
  fastify.post('/moderation/flagged/:id/resolve', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { action, moderatorId, notes } = request.body as {
      action: 'dismiss' | 'remove'
      moderatorId: string
      notes?: string
    }

    // TODO: Handle resolution based on action
    // TODO: Log moderation action

    return { success: true }
  })
}

export default moderation