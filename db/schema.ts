import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  plaidId: text('plaid_id'),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
});

export const insertAccountSchema = createInsertSchema(accounts);
