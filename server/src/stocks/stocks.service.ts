import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import yahooFinance from 'yahoo-finance2';
import { CacheService } from './cache.service';
import { CompanyProfile } from './dto/company-profile.dto';

const PROFILE_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

@Injectable()
export class StocksService {
  constructor(private readonly cacheService: CacheService) {}

  validateSymbol(symbol: string): string {
    const cleaned = symbol.trim().toUpperCase();
    if (!cleaned || cleaned.length > 10) {
      throw new BadRequestException(`Invalid symbol: ${symbol}`);
    }
    return cleaned;
  }

  async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    const validated = this.validateSymbol(symbol);
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
      if (error instanceof BadRequestException) throw error;
      throw new BadGatewayException(
        `Failed to fetch company profile for ${validated}: ${(error as Error).message}`,
      );
    }
  }
}
