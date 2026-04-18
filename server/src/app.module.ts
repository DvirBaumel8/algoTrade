import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './db/database.module';
import { StocksModule } from './stocks/stocks.module';

@Module({
  imports: [DatabaseModule, StocksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
