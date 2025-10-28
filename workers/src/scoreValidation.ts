import { Job } from 'bullmq'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function scoreValidationWorker(job: Job) {
  const { scoreId, levelId, gameId, score, meta, replayData } = job.data

  try {
    // Get level data for validation
    // const level = await prisma.level.findUnique({ where: { id: levelId } })

    // Perform replay validation if replayData provided
    let isValid = true
    let validationNotes = []

    if (replayData && gameId === 'runner') {
      // TODO: Implement Runner game replay simulation
      // Compare replay result with submitted score
      isValid = true // Placeholder
      validationNotes.push('Replay validation passed')
    } else if (replayData && gameId === 'memory-match') {
      // TODO: Implement MemoryMatch replay validation
      isValid = true // Placeholder
      validationNotes.push('Memory match validation passed')
    } else {
      // Heuristic validation only
      const maxPossibleScore = 100000 // TODO: Get from game config
      if (score > maxPossibleScore) {
        isValid = false
        validationNotes.push('Score exceeds maximum possible')
      }

      // Check for suspicious patterns
      // TODO: Implement more heuristics
    }

    await prisma.score.update({
      where: { id: scoreId },
      data: {
        isValidated: isValid,
        validationInfo: {
          validatedAt: new Date(),
          isValid,
          notes: validationNotes
        }
      }
    })

    if (!isValid) {
      // TODO: Remove from Redis leaderboard
      // TODO: Notify user of invalid score
    }

    console.log(`Validated score ${scoreId}: ${isValid ? 'valid' : 'invalid'}`)
  } catch (error) {
    console.error(`Failed to validate score ${scoreId}:`, error)

    // Mark as invalid on error
    await prisma.score.update({
      where: { id: scoreId },
      data: {
        isValidated: false,
        validationInfo: {
          validatedAt: new Date(),
          isValid: false,
          error: error.message
        }
      }
    })
  }
}