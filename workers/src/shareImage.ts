import { Job } from 'bullmq'
import sharp from 'sharp'

export async function shareImageWorker(job: Job) {
  const { score, username, levelTitle } = job.data

  // TODO: Generate share image using Sharp
  // For now, just a placeholder

  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#0F172A"/>
      <text x="600" y="200" text-anchor="middle" fill="white" font-size="48" font-family="Inter">${levelTitle}</text>
      <text x="600" y="300" text-anchor="middle" fill="#0EA5A4" font-size="36">${username}</text>
      <text x="600" y="400" text-anchor="middle" fill="white" font-size="32">Score: ${score}</text>
    </svg>
  `

  const buffer = await sharp(Buffer.from(svg)).png().toBuffer()

  // TODO: Upload to S3 and return URL

  console.log(`Generated share image for ${username}`)
  return { imageUrl: 'placeholder_url' }
}