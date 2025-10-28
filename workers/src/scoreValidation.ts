import { Job } from 'bullmq'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function scoreValidationWorker(job: Job) {
  const { scoreId, replayData } = job.data

  // TODO: Implement replay validation logic
  // For now, just mark as validated

  await prisma.score.update({
    where: { id: scoreId },
    data: {
      isValidated: true,
      validationInfo: { validatedAt: new Date() }
    }
  })

  console.log(`Validated score ${scoreId}`)
}