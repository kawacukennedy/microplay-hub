import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

const shortlinks: FastifyPluginAsync = async (fastify, opts) => {
  // Create short link
  fastify.post('/shortlinks', async (request, reply) => {
    const schema = z.object({
      targetUrl: z.string().url(),
      expiresAt: z.string().optional()
    })

    const { targetUrl, expiresAt } = schema.parse(request.body)

    // Generate short slug (base62, 6-8 chars)
    const slug = generateShortSlug()

    // TODO: Store in database
    const shortlink = {
      id: `link_${Date.now()}`,
      slug,
      targetUrl,
      shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/s/${slug}`,
      createdAt: new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : null
    }

    return { shortlink }
  })

  // Redirect short link
  fastify.get('/s/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string }

    // TODO: Get from database
    const mockTargetUrl = 'https://microplay-hub.com/levels/level-1'

    // TODO: Log click event for analytics

    return reply.redirect(mockTargetUrl)
  })

  // Get short link stats
  fastify.get('/shortlinks/:id/stats', async (request, reply) => {
    const { id } = request.params as { id: string }

    // TODO: Get click stats from database
    const mockStats = {
      clicks: 42,
      clicksByDate: [
        { date: '2024-01-01', clicks: 10 },
        { date: '2024-01-02', clicks: 15 }
      ]
    }

    return { stats: mockStats }
  })
}

function generateShortSlug(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default shortlinks