import { Controller, Get, Param } from '@nestjs/common';
import { CompanyProfile } from './dto/company-profile.dto';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('validate/:symbol')
  validateSymbol(@Param('symbol') symbol: string) {
    return this.stocksService.validateSymbol(symbol);
  }

  @Get('profile/:symbol')
  getCompanyProfile(@Param('symbol') symbol: string): Promise<CompanyProfile> {
    return this.stocksService.getCompanyProfile(symbol);
  }
}
