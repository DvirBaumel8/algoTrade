import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const stocks = pgTable('stocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  symbol: varchar('symbol', { length: 20 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
  exchange: varchar('exchange', { length: 50 }),
  tradable: boolean('tradable').default(true),
  last_updated: timestamp('last_updated').defaultNow(),
});

export type InsertStock = InferInsertModel<typeof stocks>;
export type SelectStock = InferSelectModel<typeof stocks>;
