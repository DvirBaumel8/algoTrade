import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import yahooFinance from 'yahoo-finance2';
import { CacheService } from './cache.service';
import { CompanyProfile } from './dto/company-profile.dto';
import { StocksRepository } from './stocks.repository';

const PROFILE_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

@Injectable()
export class StocksService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly stocksRepository: StocksRepository,
  ) {}

  async validateSymbol(symbol: string): Promise<{ exists: boolean; data: any }> {
    const stock = await this.stocksRepository.findBySymbol(symbol);
    if (!stock) {
      throw new NotFoundException(`Symbol not found: ${symbol.toUpperCase()}`);
    }
    return { exists: true, data: stock };
  }

  async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    const validated = symbol.trim().toUpperCase();
    const cacheKey = `profile:${validated}`;

    const cached = this.cacheService.get<CompanyProfile>(cacheKey);
    if (cached) return cached;

    try {
      const result = await yahooFinance.quoteSummary(validated, {
        modules: ['assetProfile', 'summaryProfile'],
      });

      const profile = result.assetProfile ?? result.summaryProfile ?? {};

      const companyProfile: CompanyProfile = {
        sector: (profile as any).sector ?? null,
        industry: (profile as any).industry ?? null,
        longBusinessSummary: (profile as any).longBusinessSummary ?? null,
        website: (profile as any).website ?? null,
      };

      this.cacheService.set(cacheKey, companyProfile, PROFILE_CACHE_TTL_MS);
      return companyProfile;
    } catch (error) {
      throw new BadGatewayException(
        `Failed to fetch company profile for ${validated}: ${(error as Error).message}`,
      );
    }
  }
}
