import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

const assets: FastifyPluginAsync = async (fastify, opts) => {
  // Get presigned URL for asset upload
  fastify.post('/assets/presign', async (request, reply) => {
    const schema = z.object({
      filename: z.string(),
      size: z.number(),
      contentType: z.string(),
      levelId: z.string().optional()
    })

    const { filename, size, contentType, levelId } = schema.parse(request.body)

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(contentType)) {
      return reply.code(400).send({ error: 'Invalid file type' })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (size > maxSize) {
      return reply.code(400).send({ error: 'File too large' })
    }

    // Generate unique asset ID
    const assetId = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // TODO: Generate presigned S3 URL
    const mockPresignedUrl = `https://mock-s3-url.com/upload/${assetId}`

    // TODO: Store asset metadata in database

    return {
      assetId,
      presignedUrl: mockPresignedUrl,
      publicUrl: `https://cdn.example.com/assets/${assetId}`
    }
  })

  // Confirm asset upload
  fastify.post('/assets/confirm/:assetId', async (request, reply) => {
    const { assetId } = request.params as { assetId: string }

    // TODO: Verify upload with S3 headObject
    // TODO: Generate thumbnail if image
    // TODO: Update asset status in database

    return { success: true }
  })

  // Get asset metadata
  fastify.get('/assets/:assetId', async (request, reply) => {
    const { assetId } = request.params as { assetId: string }

    // TODO: Get from database
    const mockAsset = {
      id: assetId,
      filename: 'image.png',
      size: 1024000,
      contentType: 'image/png',
      url: `https://cdn.example.com/assets/${assetId}`,
      thumbnailUrl: `https://cdn.example.com/thumbnails/${assetId}`
    }

    return { asset: mockAsset }
  })
}

export default assets