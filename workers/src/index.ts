import { Worker } from 'bullmq'
import { scoreValidationWorker } from './scoreValidation'
import { shareImageWorker } from './shareImage'

const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
}

// Score validation worker
const scoreValidation = new Worker('score-validation', scoreValidationWorker, {
  connection: redisConnection,
})

// Share image generation worker
const shareImage = new Worker('share-image', shareImageWorker, {
  connection: redisConnection,
})

console.log('Workers started')

// Graceful shutdown
process.on('SIGTERM', async () => {
  await scoreValidation.close()
  await shareImage.close()
  process.exit(0)
})