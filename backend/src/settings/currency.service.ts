import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CurrencyService {
    private readonly logger = new Logger(CurrencyService.name);
    private readonly API_URL = 'https://open.er-api.com/v6/latest/AUD';
    private cachedRates: any = null;
    private lastFetchTime: number = 0;
    private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    async getRates() {
        const now = Date.now();
        if (this.cachedRates && (now - this.lastFetchTime < this.CACHE_TTL)) {
            return this.cachedRates;
        }

        try {
            this.logger.log('Fetching fresh exchange rates from API...');
            const response = await fetch(this.API_URL);
            if (!response.ok) {
                throw new Error(`Failed to fetch rates: ${response.statusText}`);
            }
            const data = await response.json();

            if (data && data.rates) {
                this.cachedRates = {
                    USD: data.rates.USD || 0.65,
                    PGK: data.rates.PGK || 2.6,
                    AUD: 1,
                    lastUpdate: data.time_last_update_utc
                };
                this.lastFetchTime = now;
                this.logger.log('Rates updated successfully');
                return this.cachedRates;
            }
        } catch (error) {
            this.logger.error('Error fetching exchange rates:', error);
            // Fallback to defaults if API fails and no cache exists
            if (!this.cachedRates) {
                return {
                    USD: 0.65,
                    PGK: 2.6,
                    AUD: 1,
                    isFallback: true
                };
            }
        }

        return this.cachedRates;
    }
}
