export const vocabsTable = pgTable('vocabs', {
  lastReviewed: timestamp('last_reviewed').defaultNow(),
  nextReview: timestamp('next_review').defaultNow(),
  easeFactor: real('ease_factor').default(2.5),
  interval: integer('interval').default(1),
}); 