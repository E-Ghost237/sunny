import { Injectable, computed, effect, signal } from '@angular/core';

export type MarketRegion = 'us' | 'ca' | 'eu';

export interface Market {
  code: MarketRegion;
  label: string;
  flag: string;
  note: string;
}

export const MARKETS: Market[] = [
  { code: 'us', label: 'United States', flag: '🇺🇸', note: 'Pickup + shipping in licensed states' },
  { code: 'ca', label: 'Canada', flag: '🇨🇦', note: 'Shipping to every province' },
  { code: 'eu', label: 'Europe', flag: '🇪🇺', note: 'Shipping to selected EU countries' },
];

const STORAGE_KEY = 'delight-market';

function load(): MarketRegion {
  try {
    const v = localStorage.getItem(STORAGE_KEY) as MarketRegion | null;
    return v === 'us' || v === 'ca' || v === 'eu' ? v : 'us';
  } catch {
    return 'us';
  }
}

/** The shopper's selected market (drives shipping options and currency copy). */
@Injectable({ providedIn: 'root' })
export class MarketService {
  private readonly _market = signal<MarketRegion>(load());
  readonly market = this._market.asReadonly();
  readonly current = computed(() => MARKETS.find((m) => m.code === this._market()) ?? MARKETS[0]);
  readonly markets = MARKETS;

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, this._market());
      } catch {
        /* storage unavailable */
      }
    });
  }

  set(code: MarketRegion): void {
    this._market.set(code);
  }
}
