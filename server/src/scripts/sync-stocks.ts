import 'dotenv/config';
import Alpaca from '@alpacahq/alpaca-trade-api';
import { pool, db } from '../db';
import { stocks } from '../db/schema';
import { sql } from 'drizzle-orm';

async function syncStocks() {
  const alpaca = new Alpaca({
    keyId: process.env.ALPACA_KEY!,
    secretKey: process.env.ALPACA_SECRET!,
    paper: true,
  });

  console.log('Fetching assets from Alpaca...');

  let assets: any[] = [];
  try {
    assets = await alpaca.getAssets({ status: 'active', asset_class: 'us_equity' });
  } catch (err) {
    console.error('Failed to fetch assets from Alpaca:', err);
    await pool.end();
    process.exit(1);
  }

  const filtered = assets.filter(
    (a: any) => a.tradable === true && a.exchange !== 'OTC',
  );

  console.log(`Fetched ${assets.length} assets, ${filtered.length} after filtering.`);

  console.log('Truncating stocks table...');
  await db.execute(sql`TRUNCATE TABLE stocks`);

  const CHUNK_SIZE = 500;
  let inserted = 0;

  for (let i = 0; i < filtered.length; i += CHUNK_SIZE) {
    const chunk = filtered.slice(i, i + CHUNK_SIZE).map((a: any) => ({
      symbol: a.symbol,
      name: a.name,
      exchange: a.exchange,
      tradable: a.tradable,
    }));

    await db.insert(stocks).values(chunk);
    inserted += chunk.length;
    console.log(`Inserted ${inserted}/${filtered.length}`);
  }

  console.log('Sync complete.');
  await pool.end();
}

syncStocks().catch(async (err) => {
  console.error('Sync failed:', err);
  await pool.end();
  process.exit(1);
});
