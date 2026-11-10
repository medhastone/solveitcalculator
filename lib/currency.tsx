'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

export type GlobalCurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR';
export type ExtendedCurrencyCode =
  | GlobalCurrencyCode
  | 'CAD'
  | 'AUD'
  | 'SGD'
  | 'AED';

export interface GlobalCurrencyMeta {
  code: GlobalCurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  defaultRateFromUSD: number;
  locale: string;
  rateDecimals: number;
}

export interface ExtendedCurrencyMeta {
  code: ExtendedCurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  defaultRateFromUSD: number;
  locale: string;
  rateDecimals: number;
}

export const GLOBAL_CURRENCIES: GlobalCurrencyMeta[] = [
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    defaultRateFromUSD: 1.0,
    locale: 'en-US',
    rateDecimals: 2,
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    defaultRateFromUSD: 0.8924,
    locale: 'de-DE',
    rateDecimals: 4,
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    defaultRateFromUSD: 0.7447,
    locale: 'en-GB',
    rateDecimals: 4,
  },
  {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    defaultRateFromUSD: 93.93,
    locale: 'en-IN',
    rateDecimals: 2,
  },
];

export const EXTENDED_CURRENCIES: ExtendedCurrencyMeta[] = [
  ...GLOBAL_CURRENCIES,
  {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    flag: '🇨🇦',
    defaultRateFromUSD: 1.4113,
    locale: 'en-CA',
    rateDecimals: 4,
  },
  {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    flag: '🇦🇺',
    defaultRateFromUSD: 1.448,
    locale: 'en-AU',
    rateDecimals: 4,
  },
  {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    flag: '🇸🇬',
    defaultRateFromUSD: 1.2795,
    locale: 'en-SG',
    rateDecimals: 4,
  },
  {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    flag: '🇦🇪',
    defaultRateFromUSD: 3.6725,
    locale: 'en-AE',
    rateDecimals: 4,
  },
];

export const DEFAULT_RATES_FROM_USD: Record<GlobalCurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.8924,
  GBP: 0.7447,
  INR: 93.93,
};

export const DEFAULT_EXTENDED_RATES_FROM_USD: Record<ExtendedCurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.8924,
  GBP: 0.7447,
  INR: 93.93,
  CAD: 1.4113,
  AUD: 1.448,
  SGD: 1.2795,
  AED: 3.6725,
};

const SOURCE_BASELINE_RATES_FROM_USD: Record<string, number> = {
  USD: 1.0,
  '$': 1.0,
  EUR: 0.8924,
  '€': 0.8924,
  GBP: 0.7447,
  '£': 0.7447,
  INR: 93.93,
  '₹': 93.93,
  CAD: 1.4113,
  'CA$': 1.4113,
  'C$': 1.4113,
  AUD: 1.448,
  'AU$': 1.448,
  'A$': 1.448,
  SGD: 1.2795,
  'SG$': 1.2795,
  'S$': 1.2795,
  AED: 3.6725,
  'AED ': 3.6725,
};

const STORAGE_CODE_KEY = 'solveit_currency_code';
const STORAGE_SYMBOL_KEY = 'solveit_currency_symbol';
// Versioned key for user-customized rates so stale static defaults never block live market rates
const STORAGE_CUSTOM_RATES_KEY = 'solveit_currency_custom_rates_v2';
const STORAGE_APPLY_FX_KEY = 'solveit_currency_apply_fx';

export function formatExchangeRate(
  code: string,
  rate: number,
  includeSymbol = false
): string {
  if (!Number.isFinite(rate) || rate <= 0) return '1.00';
  const meta = EXTENDED_CURRENCIES.find((c) => c.code === code);
  const decimals = meta ? meta.rateDecimals : code === 'INR' ? 2 : 4;
  const formatted =
    code === 'USD'
      ? '1.00'
      : rate.toLocaleString('en-US', {
          minimumFractionDigits: decimals === 4 ? 2 : 2,
          maximumFractionDigits: decimals,
        });
  return includeSymbol && meta ? `${meta.symbol}${formatted}` : formatted;
}

// Module-level snapshot so pure formatting helpers stay in sync with React state
interface GlobalCurrencySnapshot {
  currency: GlobalCurrencyCode;
  symbol: string;
  locale: string;
  rates: Record<GlobalCurrencyCode, number>;
  extendedRates: Record<ExtendedCurrencyCode, number>;
  applyExchangeRate: boolean;
}

let activeSnapshot: GlobalCurrencySnapshot = {
  currency: 'USD',
  symbol: '$',
  locale: 'en-US',
  rates: { ...DEFAULT_RATES_FROM_USD },
  extendedRates: { ...DEFAULT_EXTENDED_RATES_FROM_USD },
  applyExchangeRate: true,
};

export function getGlobalCurrencySnapshot(): GlobalCurrencySnapshot {
  return activeSnapshot;
}

export function resolveSourceRateFromUSD(
  sourceCurrencyOrSymbol: string = 'USD',
  customRates: Record<GlobalCurrencyCode, number> = activeSnapshot.rates,
  extendedRates: Record<ExtendedCurrencyCode, number> = activeSnapshot.extendedRates
): number {
  const normalized = sourceCurrencyOrSymbol.trim().toUpperCase();
  if (normalized === 'USD' || normalized === '$') return 1.0;
  if (normalized === 'EUR' || normalized === '€')
    return customRates.EUR || extendedRates.EUR || DEFAULT_RATES_FROM_USD.EUR;
  if (normalized === 'GBP' || normalized === '£')
    return customRates.GBP || extendedRates.GBP || DEFAULT_RATES_FROM_USD.GBP;
  if (normalized === 'INR' || normalized === '₹')
    return customRates.INR || extendedRates.INR || DEFAULT_RATES_FROM_USD.INR;
  if (normalized === 'CAD' || normalized === 'CA$' || normalized === 'C$')
    return extendedRates.CAD || DEFAULT_EXTENDED_RATES_FROM_USD.CAD;
  if (normalized === 'AUD' || normalized === 'AU$' || normalized === 'A$')
    return extendedRates.AUD || DEFAULT_EXTENDED_RATES_FROM_USD.AUD;
  if (normalized === 'SGD' || normalized === 'SG$' || normalized === 'S$')
    return extendedRates.SGD || DEFAULT_EXTENDED_RATES_FROM_USD.SGD;
  if (normalized === 'AED')
    return extendedRates.AED || DEFAULT_EXTENDED_RATES_FROM_USD.AED;

  return (
    SOURCE_BASELINE_RATES_FROM_USD[sourceCurrencyOrSymbol.trim()] ??
    SOURCE_BASELINE_RATES_FROM_USD[normalized] ??
    1.0
  );
}

export function convertCurrencyValue(
  amount: number,
  fromCurrencyOrSymbol: string = 'USD',
  targetCurrency: GlobalCurrencyCode = activeSnapshot.currency,
  rates: Record<GlobalCurrencyCode, number> = activeSnapshot.rates,
  applyExchangeRate: boolean = activeSnapshot.applyExchangeRate
): number {
  if (!Number.isFinite(amount)) return 0;
  if (!applyExchangeRate) return amount;
  const fromRate = resolveSourceRateFromUSD(
    fromCurrencyOrSymbol,
    rates,
    activeSnapshot.extendedRates
  );
  const toRate = rates[targetCurrency] ?? 1.0;
  if (fromRate <= 0) return amount;
  return amount * (toRate / fromRate);
}

export function convertBetweenAnyCurrencies(
  amount: number,
  fromCodeOrSymbol: string,
  toCodeOrSymbol: string,
  rates: Record<GlobalCurrencyCode, number> = activeSnapshot.rates,
  extendedRates: Record<ExtendedCurrencyCode, number> = activeSnapshot.extendedRates
): number {
  if (!Number.isFinite(amount)) return 0;
  const fromRate = resolveSourceRateFromUSD(fromCodeOrSymbol, rates, extendedRates);
  const toRate = resolveSourceRateFromUSD(toCodeOrSymbol, rates, extendedRates);
  if (fromRate <= 0) return amount;
  return amount * (toRate / fromRate);
}

export function formatWithGlobalCurrency(
  amount: number,
  options?: {
    fromCurrency?: string;
    decimals?: number;
    skipConversion?: boolean;
    overrideCurrency?: GlobalCurrencyCode;
  }
): string {
  const snap = activeSnapshot;
  const targetCode = options?.overrideCurrency ?? snap.currency;
  const meta =
    GLOBAL_CURRENCIES.find((c) => c.code === targetCode) || GLOBAL_CURRENCIES[0];
  const decimals = options?.decimals ?? 0;

  if (!Number.isFinite(amount)) {
    return `${meta.symbol}0`;
  }

  const shouldConvert = !options?.skipConversion && snap.applyExchangeRate;
  const converted = shouldConvert
    ? convertCurrencyValue(
        amount,
        options?.fromCurrency ?? 'USD',
        targetCode,
        snap.rates,
        true
      )
    : amount;

  const isNeg = converted < 0;
  const absVal = Math.abs(converted);
  const numLocale = targetCode === 'INR' ? 'en-IN' : 'en-US';
  const formattedNumber = absVal.toLocaleString(numLocale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${isNeg ? '-' : ''}${meta.symbol}${formattedNumber}`;
}

export function formatCompactWithGlobalCurrency(
  amount: number,
  options?: {
    fromCurrency?: string;
    skipConversion?: boolean;
    overrideCurrency?: GlobalCurrencyCode;
  }
): string {
  const snap = activeSnapshot;
  const targetCode = options?.overrideCurrency ?? snap.currency;
  const meta =
    GLOBAL_CURRENCIES.find((c) => c.code === targetCode) || GLOBAL_CURRENCIES[0];

  if (!Number.isFinite(amount)) {
    return `${meta.symbol}0`;
  }

  const shouldConvert = !options?.skipConversion && snap.applyExchangeRate;
  const converted = shouldConvert
    ? convertCurrencyValue(
        amount,
        options?.fromCurrency ?? 'USD',
        targetCode,
        snap.rates,
        true
      )
    : amount;

  const isNeg = converted < 0;
  const sign = isNeg ? '-' : '';
  const absVal = Math.abs(converted);

  if (targetCode === 'INR') {
    if (absVal >= 10_000_000) {
      return `${sign}${meta.symbol}${(absVal / 10_000_000).toFixed(2)} Cr`;
    }
    if (absVal >= 100_000) {
      return `${sign}${meta.symbol}${(absVal / 100_000).toFixed(2)} L`;
    }
    if (absVal >= 1_000) {
      return `${sign}${meta.symbol}${(absVal / 1_000).toFixed(1)}k`;
    }
    return `${sign}${meta.symbol}${Math.round(absVal).toLocaleString('en-IN')}`;
  }

  if (absVal >= 1_000_000_000) {
    return `${sign}${meta.symbol}${(absVal / 1_000_000_000).toFixed(2)}B`;
  }
  if (absVal >= 1_000_000) {
    return `${sign}${meta.symbol}${(absVal / 1_000_000).toFixed(2)}M`;
  }
  if (absVal >= 1_000) {
    return `${sign}${meta.symbol}${(absVal / 1_000).toFixed(0)}k`;
  }
  return `${sign}${meta.symbol}${Math.round(absVal).toLocaleString('en-US')}`;
}

export interface CurrencyContextValue {
  currency: GlobalCurrencyCode;
  symbol: string;
  currencyMeta: GlobalCurrencyMeta;
  rates: Record<GlobalCurrencyCode, number>;
  liveMarketRates: Record<GlobalCurrencyCode, number>;
  extendedRates: Record<ExtendedCurrencyCode, number>;
  applyExchangeRate: boolean;
  rateFromUSD: number;
  assumptionSummary: string;
  isLiveRates: boolean;
  isLoadingRates: boolean;
  isCustomRates: boolean;
  lastUpdatedUtc: string | null;
  rateProvider: string;
  setCurrency: (code: GlobalCurrencyCode) => void;
  setCustomRate: (code: GlobalCurrencyCode, rate: number) => void;
  resetRatesToDefault: () => void;
  refreshLiveRates: () => Promise<void>;
  setApplyExchangeRate: (apply: boolean) => void;
  convertFromUSD: (amountUSD: number) => number;
  convertAmount: (amount: number, fromCurrency?: string) => number;
  convertBetween: (
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ) => number;
  formatAmount: (
    amount: number,
    options?: {
      fromCurrency?: string;
      decimals?: number;
      skipConversion?: boolean;
    }
  ) => string;
  formatCompact: (
    amount: number,
    options?: {
      fromCurrency?: string;
      skipConversion?: boolean;
    }
  ) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<GlobalCurrencyCode>('USD');
  const [rates, setRatesState] = useState<Record<GlobalCurrencyCode, number>>({
    ...DEFAULT_RATES_FROM_USD,
  });
  const [liveMarketRates, setLiveMarketRates] = useState<
    Record<GlobalCurrencyCode, number>
  >({
    ...DEFAULT_RATES_FROM_USD,
  });
  const [extendedRates, setExtendedRates] = useState<
    Record<ExtendedCurrencyCode, number>
  >({
    ...DEFAULT_EXTENDED_RATES_FROM_USD,
  });
  const [applyExchangeRate, setApplyExchangeRateState] = useState<boolean>(true);
  const [isLiveRates, setIsLiveRates] = useState<boolean>(false);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(true);
  const [isCustomRates, setIsCustomRates] = useState<boolean>(false);
  const [lastUpdatedUtc, setLastUpdatedUtc] = useState<string | null>(null);
  const [rateProvider, setRateProvider] = useState<string>(
    'ExchangeRate-API (Live Mid-Market)'
  );

  const currencyMeta = useMemo(
    () =>
      GLOBAL_CURRENCIES.find((c) => c.code === currency) || GLOBAL_CURRENCIES[0],
    [currency]
  );

  // Sync module-level snapshot immediately during render so child formatters see the latest state
  activeSnapshot = {
    currency,
    symbol: currencyMeta.symbol,
    locale: currencyMeta.locale,
    rates,
    extendedRates,
    applyExchangeRate,
  };

  const fetchLiveExchangeRates = useCallback(
    async (forceRefresh = false, overrideCustom = false) => {
      setIsLoadingRates(true);
      try {
        const res = await fetch(
          `/api/exchange-rates${forceRefresh ? '?refresh=1' : ''}`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error('Failed to fetch exchange rates');
        const data = await res.json();
        if (data && data.rates) {
          const nextLive: Record<GlobalCurrencyCode, number> = {
            USD: 1.0,
            EUR: Number(data.rates.EUR) > 0 ? Number(data.rates.EUR) : DEFAULT_RATES_FROM_USD.EUR,
            GBP: Number(data.rates.GBP) > 0 ? Number(data.rates.GBP) : DEFAULT_RATES_FROM_USD.GBP,
            INR: Number(data.rates.INR) > 0 ? Number(data.rates.INR) : DEFAULT_RATES_FROM_USD.INR,
          };
          const nextExtended: Record<ExtendedCurrencyCode, number> = {
            ...nextLive,
            CAD: Number(data.rates.CAD) > 0 ? Number(data.rates.CAD) : DEFAULT_EXTENDED_RATES_FROM_USD.CAD,
            AUD: Number(data.rates.AUD) > 0 ? Number(data.rates.AUD) : DEFAULT_EXTENDED_RATES_FROM_USD.AUD,
            SGD: Number(data.rates.SGD) > 0 ? Number(data.rates.SGD) : DEFAULT_EXTENDED_RATES_FROM_USD.SGD,
            AED: Number(data.rates.AED) > 0 ? Number(data.rates.AED) : DEFAULT_EXTENDED_RATES_FROM_USD.AED,
          };

          setLiveMarketRates(nextLive);
          setExtendedRates(nextExtended);
          setIsLiveRates(Boolean(data.isLive));
          if (data.lastUpdatedUtc) setLastUpdatedUtc(data.lastUpdatedUtc);
          if (data.provider) setRateProvider(data.provider);

          let hasStoredCustom = false;
          if (!overrideCustom) {
            try {
              hasStoredCustom = Boolean(
                localStorage.getItem(STORAGE_CUSTOM_RATES_KEY)
              );
            } catch {
              hasStoredCustom = false;
            }
          }

          if (!hasStoredCustom || overrideCustom) {
            setRatesState(nextLive);
            setIsCustomRates(false);
            activeSnapshot = {
              ...activeSnapshot,
              rates: nextLive,
              extendedRates: nextExtended,
            };
            if (overrideCustom) {
              try {
                localStorage.removeItem(STORAGE_CUSTOM_RATES_KEY);
              } catch {
                // Ignore
              }
            }
          }
        }
      } catch {
        // Keep current fallback rates
      } finally {
        setIsLoadingRates(false);
      }
    },
    []
  );

  // Load saved preferences from localStorage, clean up legacy static cache, and fetch live FX rates
  useEffect(() => {
    try {
      // Remove legacy static rate storage key so old hardcoded 83.5/0.92/0.78 rates don't persist
      localStorage.removeItem('solveit_currency_rates');

      const savedCode = localStorage.getItem(
        STORAGE_CODE_KEY
      ) as GlobalCurrencyCode | null;
      const savedSymbol = localStorage.getItem(STORAGE_SYMBOL_KEY);
      const savedCustomRates = localStorage.getItem(STORAGE_CUSTOM_RATES_KEY);
      const savedApplyFx = localStorage.getItem(STORAGE_APPLY_FX_KEY);

      if (savedCustomRates) {
        const parsedRates = JSON.parse(savedCustomRates);
        if (parsedRates && typeof parsedRates === 'object') {
          setRatesState((prev) => ({
            USD: 1.0,
            EUR: Number(parsedRates.EUR) > 0 ? Number(parsedRates.EUR) : prev.EUR,
            GBP: Number(parsedRates.GBP) > 0 ? Number(parsedRates.GBP) : prev.GBP,
            INR: Number(parsedRates.INR) > 0 ? Number(parsedRates.INR) : prev.INR,
          }));
          setIsCustomRates(true);
        }
      }

      if (savedApplyFx !== null) {
        setApplyExchangeRateState(savedApplyFx !== 'false');
      }

      if (savedCode && GLOBAL_CURRENCIES.some((c) => c.code === savedCode)) {
        setCurrencyState(savedCode);
      } else if (savedSymbol) {
        const matchBySymbol = GLOBAL_CURRENCIES.find(
          (c) => c.symbol === savedSymbol
        );
        if (matchBySymbol) {
          setCurrencyState(matchBySymbol.code);
        }
      }
    } catch {
      // Ignore storage read errors
    }

    // Fetch live exchange rates from /api/exchange-rates immediately
    fetchLiveExchangeRates(false, false);

    const handleExternalCurrency = (e: Event) => {
      const customEvent = e as CustomEvent<{
        code?: GlobalCurrencyCode;
        symbol?: string;
      }>;
      if (customEvent?.detail?.code) {
        const match = GLOBAL_CURRENCIES.find(
          (c) => c.code === customEvent.detail.code
        );
        if (match) {
          setCurrencyState(match.code);
          return;
        }
      }
      if (customEvent?.detail?.symbol) {
        const match = GLOBAL_CURRENCIES.find(
          (c) => c.symbol === customEvent.detail.symbol
        );
        if (match) {
          setCurrencyState(match.code);
        }
      }
    };

    window.addEventListener('solveit_currency_change', handleExternalCurrency);
    return () => {
      window.removeEventListener(
        'solveit_currency_change',
        handleExternalCurrency
      );
    };
  }, [fetchLiveExchangeRates]);

  const setCurrency = useCallback((nextCode: GlobalCurrencyCode) => {
    const meta =
      GLOBAL_CURRENCIES.find((c) => c.code === nextCode) || GLOBAL_CURRENCIES[0];
    setCurrencyState(meta.code);
    activeSnapshot = {
      ...activeSnapshot,
      currency: meta.code,
      symbol: meta.symbol,
      locale: meta.locale,
    };
    try {
      localStorage.setItem(STORAGE_CODE_KEY, meta.code);
      localStorage.setItem(STORAGE_SYMBOL_KEY, meta.symbol);
      window.dispatchEvent(
        new CustomEvent('solveit_currency_change', {
          detail: { code: meta.code, symbol: meta.symbol },
        })
      );
    } catch {
      // Ignore storage errors
    }
  }, []);

  const setCustomRate = useCallback(
    (code: GlobalCurrencyCode, newRate: number) => {
      if (code === 'USD' || !Number.isFinite(newRate) || newRate <= 0) return;
      setIsCustomRates(true);
      setRatesState((prev) => {
        const next = { ...prev, [code]: newRate };
        activeSnapshot = { ...activeSnapshot, rates: next };
        try {
          localStorage.setItem(STORAGE_CUSTOM_RATES_KEY, JSON.stringify(next));
          window.dispatchEvent(
            new CustomEvent('solveit_currency_change', {
              detail: {
                code: activeSnapshot.currency,
                symbol: activeSnapshot.symbol,
              },
            })
          );
        } catch {
          // Ignore
        }
        return next;
      });
    },
    []
  );

  const resetRatesToDefault = useCallback(() => {
    const synced = { ...liveMarketRates };
    setRatesState(synced);
    setIsCustomRates(false);
    activeSnapshot = { ...activeSnapshot, rates: synced };
    try {
      localStorage.removeItem(STORAGE_CUSTOM_RATES_KEY);
      window.dispatchEvent(
        new CustomEvent('solveit_currency_change', {
          detail: {
            code: activeSnapshot.currency,
            symbol: activeSnapshot.symbol,
          },
        })
      );
    } catch {
      // Ignore
    }
  }, [liveMarketRates]);

  const refreshLiveRates = useCallback(async () => {
    await fetchLiveExchangeRates(true, true);
  }, [fetchLiveExchangeRates]);

  const setApplyExchangeRate = useCallback((apply: boolean) => {
    setApplyExchangeRateState(apply);
    activeSnapshot = { ...activeSnapshot, applyExchangeRate: apply };
    try {
      localStorage.setItem(STORAGE_APPLY_FX_KEY, String(apply));
      window.dispatchEvent(
        new CustomEvent('solveit_currency_change', {
          detail: {
            code: activeSnapshot.currency,
            symbol: activeSnapshot.symbol,
          },
        })
      );
    } catch {
      // Ignore
    }
  }, []);

  const rateFromUSD = rates[currency] ?? 1.0;

  const assumptionSummary = useMemo(() => {
    if (currency === 'USD') {
      return `1 USD = €${formatExchangeRate('EUR', rates.EUR)} | £${formatExchangeRate('GBP', rates.GBP)} | ₹${formatExchangeRate('INR', rates.INR)}`;
    }
    const inverse = 1 / rateFromUSD;
    return `1 USD = ${currencyMeta.symbol}${formatExchangeRate(currency, rateFromUSD)} ${currency} (1 ${currency} = $${inverse.toFixed(4)} USD)`;
  }, [currency, currencyMeta.symbol, rateFromUSD, rates]);

  const convertFromUSD = useCallback(
    (amountUSD: number) => {
      if (!Number.isFinite(amountUSD)) return 0;
      return applyExchangeRate ? amountUSD * rateFromUSD : amountUSD;
    },
    [applyExchangeRate, rateFromUSD]
  );

  const convertAmount = useCallback(
    (amount: number, fromCurrency: string = 'USD') => {
      return convertCurrencyValue(
        amount,
        fromCurrency,
        currency,
        rates,
        applyExchangeRate
      );
    },
    [currency, rates, applyExchangeRate]
  );

  const convertBetween = useCallback(
    (amount: number, fromCurrency: string, toCurrency: string) => {
      return convertBetweenAnyCurrencies(
        amount,
        fromCurrency,
        toCurrency,
        rates,
        extendedRates
      );
    },
    [rates, extendedRates]
  );

  const formatAmount = useCallback(
    (
      amount: number,
      options?: {
        fromCurrency?: string;
        decimals?: number;
        skipConversion?: boolean;
      }
    ) => {
      return formatWithGlobalCurrency(amount, {
        ...options,
        overrideCurrency: currency,
      });
    },
    [currency, rates, extendedRates, applyExchangeRate]
  );

  const formatCompact = useCallback(
    (
      amount: number,
      options?: {
        fromCurrency?: string;
        skipConversion?: boolean;
      }
    ) => {
      return formatCompactWithGlobalCurrency(amount, {
        ...options,
        overrideCurrency: currency,
      });
    },
    [currency, rates, extendedRates, applyExchangeRate]
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      symbol: currencyMeta.symbol,
      currencyMeta,
      rates,
      liveMarketRates,
      extendedRates,
      applyExchangeRate,
      rateFromUSD,
      assumptionSummary,
      isLiveRates,
      isLoadingRates,
      isCustomRates,
      lastUpdatedUtc,
      rateProvider,
      setCurrency,
      setCustomRate,
      resetRatesToDefault,
      refreshLiveRates,
      setApplyExchangeRate,
      convertFromUSD,
      convertAmount,
      convertBetween,
      formatAmount,
      formatCompact,
    }),
    [
      currency,
      currencyMeta,
      rates,
      liveMarketRates,
      extendedRates,
      applyExchangeRate,
      rateFromUSD,
      assumptionSummary,
      isLiveRates,
      isLoadingRates,
      isCustomRates,
      lastUpdatedUtc,
      rateProvider,
      setCurrency,
      setCustomRate,
      resetRatesToDefault,
      refreshLiveRates,
      setApplyExchangeRate,
      convertFromUSD,
      convertAmount,
      convertBetween,
      formatAmount,
      formatCompact,
    ]
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    const snap = getGlobalCurrencySnapshot();
    const meta =
      GLOBAL_CURRENCIES.find((c) => c.code === snap.currency) ||
      GLOBAL_CURRENCIES[0];
    return {
      currency: snap.currency,
      symbol: snap.symbol,
      currencyMeta: meta,
      rates: snap.rates,
      liveMarketRates: snap.rates,
      extendedRates: snap.extendedRates,
      applyExchangeRate: snap.applyExchangeRate,
      rateFromUSD: snap.rates[snap.currency] ?? 1.0,
      assumptionSummary: `1 USD = ${snap.symbol}${formatExchangeRate(snap.currency, snap.rates[snap.currency] ?? 1.0)} ${snap.currency}`,
      isLiveRates: true,
      isLoadingRates: false,
      isCustomRates: false,
      lastUpdatedUtc: null,
      rateProvider: 'ExchangeRate-API (Live Mid-Market)',
      setCurrency: () => {},
      setCustomRate: () => {},
      resetRatesToDefault: () => {},
      refreshLiveRates: async () => {},
      setApplyExchangeRate: () => {},
      convertFromUSD: (val) =>
        snap.applyExchangeRate ? val * (snap.rates[snap.currency] ?? 1.0) : val,
      convertAmount: (val, from = 'USD') =>
        convertCurrencyValue(
          val,
          from,
          snap.currency,
          snap.rates,
          snap.applyExchangeRate
        ),
      convertBetween: (val, from, to) =>
        convertBetweenAnyCurrencies(val, from, to, snap.rates, snap.extendedRates),
      formatAmount: (val, opts) => formatWithGlobalCurrency(val, opts),
      formatCompact: (val, opts) => formatCompactWithGlobalCurrency(val, opts),
    };
  }
  return ctx;
}
