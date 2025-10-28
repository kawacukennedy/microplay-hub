import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

const levels: FastifyPluginAsync = async (fastify, opts) => {
  // Get levels with filtering
  fastify.get('/levels', async (request, reply) => {
    const schema = z.object({
      gameId: z.string().optional(),
      creatorId: z.string().optional(),
      published: z.string().transform(val => val === 'true').optional(),
      limit: z.string().transform(Number).optional(),
      offset: z.string().transform(Number).optional()
    })

    const { gameId, creatorId, published, limit = 20, offset = 0 } = schema.parse(request.query)

    // TODO: Query database with filters
    const mockLevels = [
      {
        id: 'level-1',
        gameId: 'runner',
        creatorId: 'user-123',
        title: 'My First Level',
        description: 'A simple level',
        thumbnailUrl: null,
        publishedAt: new Date(),
        playsCount: 42,
        likesCount: 5
      }
    ]

    return { levels: mockLevels, total: mockLevels.length }
  })

  // Get single level
  fastify.get('/levels/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    // TODO: Query database
    const mockLevel = {
      id,
      gameId: 'runner',
      creatorId: 'user-123',
      title: 'Sample Level',
      data: { /* level data */ },
      publishedAt: new Date()
    }

    return { level: mockLevel }
  })

  // Create/update level
  fastify.post('/levels', async (request, reply) => {
    const schema = z.object({
      gameId: z.string(),
      title: z.string(),
      description: z.string().optional(),
      data: z.record(z.any()),
      assets: z.record(z.any()).optional(),
      tags: z.array(z.string()).optional(),
      publish: z.boolean().optional()
    })

    const levelData = schema.parse(request.body)

    // TODO: Validate level data
    // TODO: Store in database
    // TODO: If publish=true, queue for moderation

    const levelId = `level_${Date.now()}`

    return {
      levelId,
      status: levelData.publish ? 'pending_moderation' : 'draft_saved'
    }
  })

  // Update level
  fastify.put('/levels/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const schema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      data: z.record(z.any()).optional(),
      publish: z.boolean().optional()
    })

    const updates = schema.parse(request.body)

    // TODO: Update in database
    // TODO: Handle publishing logic

    return { success: true }
  })

  // Delete level
  fastify.delete('/levels/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    // TODO: Delete from database

    return { success: true }
  })
}

export default levels