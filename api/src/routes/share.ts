import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import sharp from 'sharp'

const share: FastifyPluginAsync = async (fastify, opts) => {
  // Generate share image
  fastify.post('/share/generate', async (request, reply) => {
    const schema = z.object({
      score: z.number(),
      levelTitle: z.string(),
      username: z.string().optional()
    })

    const { score, levelTitle, username } = schema.parse(request.body)

    // Generate SVG template
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0EA5A4;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg)"/>
        <rect x="50" y="50" width="1100" height="530" fill="#0F172A" rx="20"/>
        <text x="600" y="150" text-anchor="middle" fill="white" font-size="48" font-family="Inter">MicroPlay Hub</text>
        <text x="600" y="220" text-anchor="middle" fill="#0EA5A4" font-size="36" font-family="Inter">${levelTitle}</text>
        ${username ? `<text x="600" y="280" text-anchor="middle" fill="white" font-size="28" font-family="Inter">Played by ${username}</text>` : ''}
        <text x="600" y="350" text-anchor="middle" fill="white" font-size="32" font-family="Inter">Score: ${score.toLocaleString()}</text>
        <text x="600" y="420" text-anchor="middle" fill="#7C3AED" font-size="24" font-family="Inter">Can you beat this?</text>
        <text x="600" y="480" text-anchor="middle" fill="white" font-size="20" font-family="Inter">microplay-hub.com</text>
      </svg>
    `

    // Convert SVG to PNG
    const buffer = await sharp(Buffer.from(svg)).png().toBuffer()

    // TODO: Upload to S3 and return URL
    const mockImageUrl = `https://cdn.example.com/shares/${Date.now()}.png`

    return { imageUrl: mockImageUrl }
  })
}

export default share