import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const vocabsTable = pgTable('vocabs', {
  id: serial('id').primaryKey(),
  dialect: text('dialect').notNull(),
  meaning: text('meaning').notNull(),
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
