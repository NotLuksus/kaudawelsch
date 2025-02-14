'use server'

import { db } from '@/server/db'
import { vocabsTable } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

interface UpdateVocabParams {
  vocabId: string
  quality: number // 0-5 rating of how well the user remembered
}

export async function updateVocab({ vocabId, quality }: UpdateVocabParams) {
  const vocab = await db.query.vocabsTable.findFirst({
    where: eq(vocabsTable.id, vocabId)
  })

  if (!vocab) return null

  // Implementation of SuperMemo 2 algorithm
  const easeFactor = Math.max(
    1.3,
    vocab.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  let interval
  if (quality < 3) {
    interval = 1 // Reset interval if answer was wrong
  } else if (vocab.interval === 1) {
    interval = 6
  } else {
    interval = Math.round(vocab.interval * easeFactor)
  }

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)

  await db.update(vocabsTable)
    .set({
      easeFactor,
      interval,
      lastReviewed: new Date(),
      nextReview,
    })
    .where(eq(vocabsTable.id, vocabId))

  return { easeFactor, interval, nextReview }
} 