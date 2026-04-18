import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { StocksController } from './stocks.controller';
import { StocksRepository } from './stocks.repository';
import { StocksService } from './stocks.service';

@Module({
  controllers: [StocksController],
  providers: [StocksService, CacheService, StocksRepository],
  exports: [StocksService],
})
export class StocksModule {}
