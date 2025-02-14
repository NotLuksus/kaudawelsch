import { relations } from 'drizzle-orm';
import { integer, pgTable, real, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const vocabsTable = pgTable('vocabs', {
  id: serial('id').primaryKey(),
  dialect: text('dialect').notNull(),
  meaning: text('meaning').notNull(),
  lastReviewed: timestamp('last_reviewed').defaultNow(),
  nextReview: timestamp('next_review').defaultNow(),
  easeFactor: real('ease_factor').notNull().default(2.5),
  interval: integer('interval').default(1),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
});

export const vocabsRelations = relations(vocabsTable, ({ one }) => ({
  user: one(user, {
    fields: [vocabsTable.userId],
    references: [user.id],
  }),
}));
