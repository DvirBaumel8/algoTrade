import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import * as schema from '../db/schema';
import { SelectStock } from '../db/schema';

@Injectable()
export class StocksRepository {
  constructor(
    @Inject('DRIZZLE')
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findBySymbol(symbol: string): Promise<SelectStock | null> {
    const result = await this.db
      .select()
      .from(schema.stocks)
      .where(sql`lower(${schema.stocks.symbol}) = lower(${symbol})`)
      .limit(1);

    return result[0] ?? null;
  }
}
