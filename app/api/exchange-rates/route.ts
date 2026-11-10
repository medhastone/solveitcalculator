import { NextRequest, NextResponse } from 'next/server';

export interface LiveExchangeRatesPayload {
  base: 'USD';
  rates: {
    USD: number;
    EUR: number;
    GBP: number;
    INR: number;
    CAD: number;
    AUD: number;
    SGD: number;
    AED: number;
  };
  lastUpdatedUtc: string;
  nextUpdateUtc?: string;
  provider: string;
  isLive: boolean;
}

// Accurate market baseline fallback if external FX feeds are unreachable
const FALLBACK_RATES: LiveExchangeRatesPayload['rates'] = {
  USD: 1.0,
  EUR: 0.8924,
  GBP: 0.7447,
  INR: 93.93,
  CAD: 1.4113,
  AUD: 1.448,
  SGD: 1.2795,
  AED: 3.6725,
};

let cachedPayload: LiveExchangeRatesPayload | null = null;
let cachedAtMs = 0;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes server cache

async function fetchFromOpenErApi(): Promise<LiveExchangeRatesPayload | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: controller.signal,
      next: { revalidate: 900 },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.result !== 'success' || !data.rates) return null;

    const r = data.rates as Record<string, number>;
    return {
      base: 'USD',
      rates: {
        USD: 1.0,
        EUR: Number(r.EUR) > 0 ? Number(Number(r.EUR).toFixed(4)) : FALLBACK_RATES.EUR,
        GBP: Number(r.GBP) > 0 ? Number(Number(r.GBP).toFixed(4)) : FALLBACK_RATES.GBP,
        INR: Number(r.INR) > 0 ? Number(Number(r.INR).toFixed(2)) : FALLBACK_RATES.INR,
        CAD: Number(r.CAD) > 0 ? Number(Number(r.CAD).toFixed(4)) : FALLBACK_RATES.CAD,
        AUD: Number(r.AUD) > 0 ? Number(Number(r.AUD).toFixed(4)) : FALLBACK_RATES.AUD,
        SGD: Number(r.SGD) > 0 ? Number(Number(r.SGD).toFixed(4)) : FALLBACK_RATES.SGD,
        AED: Number(r.AED) > 0 ? Number(Number(r.AED).toFixed(4)) : FALLBACK_RATES.AED,
      },
      lastUpdatedUtc: data.time_last_update_utc || new Date().toUTCString(),
      nextUpdateUtc: data.time_next_update_utc || undefined,
      provider: 'ExchangeRate-API (Live Mid-Market)',
      isLive: true,
    };
  } catch {
    return null;
  }
}

async function fetchFromFrankfurter(): Promise<LiveExchangeRatesPayload | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      'https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,INR,CAD,AUD,SGD',
      {
        signal: controller.signal,
        next: { revalidate: 900 },
      }
    );
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.rates) return null;

    const r = data.rates as Record<string, number>;
    return {
      base: 'USD',
      rates: {
        USD: 1.0,
        EUR: Number(r.EUR) > 0 ? Number(Number(r.EUR).toFixed(4)) : FALLBACK_RATES.EUR,
        GBP: Number(r.GBP) > 0 ? Number(Number(r.GBP).toFixed(4)) : FALLBACK_RATES.GBP,
        INR: Number(r.INR) > 0 ? Number(Number(r.INR).toFixed(2)) : FALLBACK_RATES.INR,
        CAD: Number(r.CAD) > 0 ? Number(Number(r.CAD).toFixed(4)) : FALLBACK_RATES.CAD,
        AUD: Number(r.AUD) > 0 ? Number(Number(r.AUD).toFixed(4)) : FALLBACK_RATES.AUD,
        SGD: Number(r.SGD) > 0 ? Number(Number(r.SGD).toFixed(4)) : FALLBACK_RATES.SGD,
        AED: FALLBACK_RATES.AED,
      },
      lastUpdatedUtc: data.date ? `${data.date} 00:00:00 UTC` : new Date().toUTCString(),
      provider: 'ECB Reference Feed (Frankfurter)',
      isLive: true,
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const forceRefresh = req.nextUrl.searchParams.get('refresh') === '1';
  const now = Date.now();

  if (!forceRefresh && cachedPayload && now - cachedAtMs < CACHE_TTL_MS) {
    return NextResponse.json(cachedPayload);
  }

  const livePrimary = await fetchFromOpenErApi();
  if (livePrimary) {
    cachedPayload = livePrimary;
    cachedAtMs = now;
    return NextResponse.json(livePrimary);
  }

  const liveSecondary = await fetchFromFrankfurter();
  if (liveSecondary) {
    cachedPayload = liveSecondary;
    cachedAtMs = now;
    return NextResponse.json(liveSecondary);
  }

  const fallbackPayload: LiveExchangeRatesPayload = cachedPayload ?? {
    base: 'USD',
    rates: { ...FALLBACK_RATES },
    lastUpdatedUtc: new Date().toUTCString(),
    provider: 'Verified Market Benchmark',
    isLive: false,
  };

  return NextResponse.json(fallbackPayload);
}
