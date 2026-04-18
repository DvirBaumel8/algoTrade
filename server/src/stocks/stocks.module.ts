import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

@Module({
  controllers: [StocksController],
  providers: [StocksService, CacheService],
  exports: [StocksService],
})
export class StocksModule {}
