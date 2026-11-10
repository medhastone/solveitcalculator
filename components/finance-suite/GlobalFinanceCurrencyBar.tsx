'use client';

import React, { useState } from 'react';
import {
  Coins,
  ArrowLeftRight,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Radio,
} from 'lucide-react';
import {
  GLOBAL_CURRENCIES,
  EXTENDED_CURRENCIES,
  formatExchangeRate,
  useCurrency,
  type GlobalCurrencyCode,
  type ExtendedCurrencyCode,
} from '@/lib/currency';

export default function GlobalFinanceCurrencyBar({
  compact = false,
}: {
  compact?: boolean;
}) {
  const {
    currency,
    symbol,
    rates,
    liveMarketRates,
    extendedRates,
    applyExchangeRate,
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
    convertBetween,
  } = useCurrency();

  const [showAssumptionsPanel, setShowAssumptionsPanel] = useState(false);
  const [converterAmount, setConverterAmount] = useState<number>(1000);
  const [fromCode, setFromCode] = useState<ExtendedCurrencyCode>('USD');
  const [toCode, setToCode] = useState<ExtendedCurrencyCode>('INR');

  const activeRate = rates[currency] ?? 1.0;

  const formatSample = (code: GlobalCurrencyCode, valUSD: number) => {
    const meta =
      GLOBAL_CURRENCIES.find((c) => c.code === code) || GLOBAL_CURRENCIES[0];
    const converted = valUSD * (rates[code] ?? 1.0);
    const locale = code === 'INR' ? 'en-IN' : 'en-US';
    return `${meta.symbol}${converted.toLocaleString(locale, {
      minimumFractionDigits: converted < 100 ? 2 : 0,
      maximumFractionDigits: converted < 100 ? 2 : 0,
    })}`;
  };

  const fromMeta =
    EXTENDED_CURRENCIES.find((c) => c.code === fromCode) ||
    EXTENDED_CURRENCIES[0];
  const toMeta =
    EXTENDED_CURRENCIES.find((c) => c.code === toCode) ||
    EXTENDED_CURRENCIES[3];

  const convertedOutput = convertBetween(converterAmount, fromCode, toCode);
  const unitPairRate = convertBetween(1, fromCode, toCode);
  const inversePairRate = unitPairRate > 0 ? 1 / unitPairRate : 0;

  const handleSwapPair = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  const shortUpdatedDate = lastUpdatedUtc
    ? lastUpdatedUtc.replace(/:\d{2}\s+\+0000$/, ' UTC')
    : 'Live Mid-Market';

  return (
    <section
      aria-label="Global Finance Currency Switcher and Live Exchange Rate Changer"
      className={`w-full bg-white border-b border-[#E2E8F0] shadow-2xs ${
        compact ? 'rounded-2xl border mb-5' : ''
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-2.5">
          {/* Left: Label + 4-Currency Toggle Buttons (USD, EUR, GBP, INR) + Live Status Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#152238] uppercase tracking-wider">
              <span className="w-6 h-6 rounded-lg bg-[#EEF3FF] text-[#2457D6] flex items-center justify-center shrink-0">
                <Coins className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
              <span>Display Currency:</span>
            </div>

            <div
              role="group"
              aria-label="Select display currency (USD, EUR, GBP, INR)"
              className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#F1F5F9] border border-[#CBD5E1]"
            >
              {GLOBAL_CURRENCIES.map((item) => {
                const isActive = currency === item.code;
                const itemRate = rates[item.code] ?? 1.0;
                return (
                  <button
                    key={item.code}
                    type="button"
                    data-compact="true"
                    onClick={() => setCurrency(item.code)}
                    aria-pressed={isActive}
                    title={`Switch to ${item.name} (${item.symbol}) — Live Rate: 1 USD = ${item.symbol}${formatExchangeRate(item.code, itemRate)}`}
                    className={`compact-control inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] ${
                      isActive
                        ? 'bg-[#2457D6] text-white shadow-2xs'
                        : 'text-[#152238] hover:bg-white hover:text-[#2457D6]'
                    }`}
                  >
                    <span aria-hidden="true">{item.flag}</span>
                    <span>{item.code}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#E2E8F0]/80 text-[#475569]'
                      }`}
                    >
                      {item.symbol}
                      {item.code !== 'USD' && (
                        <span className="ml-0.5 text-[10px] opacity-90">
                          {formatExchangeRate(item.code, itemRate)}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Market Status Badge & Refresh Button */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] font-bold text-[#065F46]">
              <span
                className={`w-2 h-2 rounded-full ${
                  isCustomRates
                    ? 'bg-amber-500'
                    : isLiveRates
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-blue-500'
                }`}
                aria-hidden="true"
              />
              <span>
                {isCustomRates
                  ? 'Custom FX Scenario'
                  : isLiveRates
                  ? 'LIVE FX'
                  : 'Market FX'}
              </span>
              <button
                type="button"
                data-compact="true"
                onClick={() => refreshLiveRates()}
                disabled={isLoadingRates}
                title={`Sync live exchange rates (${rateProvider} · ${shortUpdatedDate})`}
                className="compact-control inline-flex items-center gap-1 ml-1 pl-1.5 border-l border-[#A7F3D0] text-[#047857] hover:text-[#065F46] cursor-pointer"
              >
                <RefreshCw
                  className={`w-3 h-3 ${isLoadingRates ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">
                  {isLoadingRates ? 'Syncing...' : 'Refresh'}
                </span>
              </button>
            </div>
          </div>

          {/* Right: Live Exchange Rate Readout + Mode Switch + Currency Changer Drawer Toggle */}
          <div className="flex flex-wrap items-center justify-between xl:justify-end gap-2 text-xs">
            {/* Active Rate Assumption Pill */}
            <div className="inline-flex flex-wrap items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#152238]">
              <ArrowLeftRight
                className="w-3.5 h-3.5 text-[#2457D6] shrink-0"
                aria-hidden="true"
              />
              <span className="font-semibold text-[#475569]">Live Rate:</span>
              {currency === 'USD' ? (
                <span className="font-mono font-bold text-[#152238]">
                  1 USD = €{formatExchangeRate('EUR', rates.EUR)} · £
                  {formatExchangeRate('GBP', rates.GBP)} · ₹
                  {formatExchangeRate('INR', rates.INR)}
                </span>
              ) : (
                <span className="font-mono font-bold text-[#2457D6]">
                  1 USD = {symbol}
                  {formatExchangeRate(currency, activeRate)} {currency}{' '}
                  <span className="text-[#64748B] font-normal">
                    (1 {currency} = ${(1 / activeRate).toFixed(4)} USD)
                  </span>
                </span>
              )}
            </div>

            {/* FX Conversion vs Symbol-Only Toggle */}
            <button
              type="button"
              data-compact="true"
              onClick={() => setApplyExchangeRate(!applyExchangeRate)}
              aria-pressed={applyExchangeRate}
              title={
                applyExchangeRate
                  ? 'Outputs scale by the live exchange rate. Click to switch to 1:1 Symbol-Only mode.'
                  : '1:1 Symbol-Only mode active. Click to scale outputs by live exchange rates.'
              }
              className={`compact-control inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                applyExchangeRate
                  ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
                  : 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>
                {applyExchangeRate
                  ? `FX Rate Scaling (${symbol}${formatExchangeRate(currency, activeRate)}×)`
                  : `Symbol Only (${symbol} 1:1)`}
              </span>
            </button>

            {/* Expand / Collapse Live Currency Changer & FX Rates Editor */}
            <button
              type="button"
              data-compact="true"
              onClick={() => setShowAssumptionsPanel(!showAssumptionsPanel)}
              aria-expanded={showAssumptionsPanel}
              className="compact-control inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EEF3FF] hover:bg-[#DCE7FF] text-[#2457D6] border border-[#BFDBFE] text-xs font-bold transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Currency Changer &amp; Live FX</span>
              {showAssumptionsPanel ? (
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Live Currency Changer & Exchange Rate Assumptions Drawer */}
        {showAssumptionsPanel && (
          <div className="mt-3 pt-3 border-t border-[#E2E8F0] grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch bg-[#F8FAFC] rounded-xl p-3.5 border">
            {/* Left Column (6 cols): Interactive Live Currency Changer / Converter */}
            <div className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] p-3.5 space-y-3 flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-extrabold text-[#152238] uppercase tracking-wider">
                    Live Currency Changer &amp; Converter
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#64748B]">
                  {rateProvider} · {shortUpdatedDate}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                {/* Amount Input */}
                <div className="sm:col-span-4">
                  <label
                    htmlFor="live-fx-converter-amount"
                    className="block text-[11px] font-bold text-[#475569] mb-1"
                  >
                    Amount ({fromMeta.symbol})
                  </label>
                  <input
                    id="live-fx-converter-amount"
                    type="number"
                    min={0}
                    step="any"
                    value={converterAmount}
                    onChange={(e) =>
                      setConverterAmount(Math.max(0, Number(e.target.value)))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-sm font-mono font-bold text-[#152238] focus:outline-none focus:border-[#2457D6]"
                  />
                </div>

                {/* From Currency */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="live-fx-from-select"
                    className="block text-[11px] font-bold text-[#475569] mb-1"
                  >
                    From
                  </label>
                  <select
                    id="live-fx-from-select"
                    value={fromCode}
                    onChange={(e) =>
                      setFromCode(e.target.value as ExtendedCurrencyCode)
                    }
                    className="w-full px-2.5 py-2 rounded-lg border border-[#CBD5E1] bg-white text-xs font-bold text-[#152238]"
                  >
                    {EXTENDED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} ({c.symbol.trim()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <div className="sm:col-span-2 flex justify-center">
                  <button
                    type="button"
                    data-compact="true"
                    onClick={handleSwapPair}
                    title="Swap From and To currencies"
                    className="compact-control w-full sm:w-auto px-3 py-2 rounded-lg bg-[#EEF3FF] hover:bg-[#DCE7FF] text-[#2457D6] border border-[#BFDBFE] text-xs font-bold inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span className="sm:hidden">Swap</span>
                  </button>
                </div>

                {/* To Currency */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="live-fx-to-select"
                    className="block text-[11px] font-bold text-[#475569] mb-1"
                  >
                    To
                  </label>
                  <select
                    id="live-fx-to-select"
                    value={toCode}
                    onChange={(e) => {
                      const next = e.target.value as ExtendedCurrencyCode;
                      setToCode(next);
                      if (
                        next === 'USD' ||
                        next === 'EUR' ||
                        next === 'GBP' ||
                        next === 'INR'
                      ) {
                        setCurrency(next);
                      }
                    }}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#CBD5E1] bg-white text-xs font-bold text-[#152238]"
                  >
                    {EXTENDED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} ({c.symbol.trim()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Converted Output Banner */}
              <div className="p-3 rounded-xl bg-[#EEF3FF] border border-[#BFDBFE] flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] font-semibold text-[#475569]">
                    {fromMeta.symbol}
                    {converterAmount.toLocaleString('en-US')} {fromCode} equals:
                  </div>
                  <div className="text-lg font-extrabold font-mono text-[#2457D6]">
                    {toMeta.symbol}
                    {convertedOutput.toLocaleString(
                      toCode === 'INR' ? 'en-IN' : 'en-US',
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}{' '}
                    {toCode}
                  </div>
                </div>
                <div className="text-right text-[11px] font-mono text-[#475569]">
                  <div>
                    1 {fromCode} = {toMeta.symbol}
                    {unitPairRate.toFixed(toCode === 'INR' ? 2 : 4)} {toCode}
                  </div>
                  <div>
                    1 {toCode} = {fromMeta.symbol}
                    {inversePairRate.toFixed(fromCode === 'INR' ? 2 : 4)}{' '}
                    {fromCode}
                  </div>
                </div>
              </div>

              {/* 4 Global Currencies Quick Equivalent Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center">
                {GLOBAL_CURRENCIES.map((item) => {
                  const eqVal = convertBetween(
                    converterAmount,
                    fromCode,
                    item.code
                  );
                  return (
                    <button
                      key={item.code}
                      type="button"
                      data-compact="true"
                      onClick={() => setCurrency(item.code)}
                      className={`compact-control px-2 py-1.5 rounded-lg border text-xs cursor-pointer transition ${
                        currency === item.code
                          ? 'bg-[#2457D6] text-white border-[#2457D6] font-extrabold'
                          : 'bg-[#F8FAFC] text-[#152238] border-[#E2E8F0] hover:border-[#2457D6] font-semibold'
                      }`}
                    >
                      <div className="text-[10px] opacity-80">
                        {item.flag} {item.code}
                      </div>
                      <div className="font-mono truncate">
                        {item.symbol}
                        {eqVal.toLocaleString(
                          item.code === 'INR' ? 'en-IN' : 'en-US',
                          {
                            maximumFractionDigits: eqVal < 100 ? 2 : 0,
                          }
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column (6 cols): Live Exchange Rate Assumptions & Custom Scenario Override */}
            <div className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] p-3.5 space-y-3 flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#F1F5F9]">
                <div>
                  <h3 className="text-xs font-extrabold text-[#152238] uppercase tracking-wider">
                    Active FX Rate Assumptions (Per 1.00 USD)
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Synced with live mid-market FX rates. You can also type custom rates to stress-test scenarios.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {isCustomRates && (
                    <button
                      type="button"
                      data-compact="true"
                      onClick={resetRatesToDefault}
                      className="compact-control inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] font-bold text-[#065F46] hover:bg-[#D1FAE5] cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore Live Market Rates</span>
                    </button>
                  )}
                  <button
                    type="button"
                    data-compact="true"
                    onClick={() => refreshLiveRates()}
                    disabled={isLoadingRates}
                    className="compact-control inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EEF3FF] border border-[#BFDBFE] text-[11px] font-bold text-[#2457D6] hover:bg-[#DCE7FF] cursor-pointer"
                  >
                    <RefreshCw
                      className={`w-3 h-3 ${isLoadingRates ? 'animate-spin' : ''}`}
                    />
                    <span>Sync Live FX</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {GLOBAL_CURRENCIES.map((item) => {
                  const isUSD = item.code === 'USD';
                  const currentRate = rates[item.code] ?? 1.0;
                  const liveRate = liveMarketRates[item.code] ?? currentRate;
                  return (
                    <div
                      key={item.code}
                      className={`p-2.5 rounded-xl border ${
                        currency === item.code
                          ? 'bg-[#EEF3FF] border-[#2457D6]'
                          : 'bg-[#F8FAFC] border-[#E2E8F0]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#152238] mb-1">
                        <span>
                          {item.flag} 1 USD → {item.code}
                        </span>
                        <span className="font-mono text-[#2457D6]">
                          {item.symbol}
                        </span>
                      </div>
                      {isUSD ? (
                        <div className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono font-bold text-[#475569]">
                          $1.0000 (Base)
                        </div>
                      ) : (
                        <input
                          type="number"
                          aria-label={`Exchange rate for ${item.code} per 1 USD`}
                          min={0.0001}
                          step={item.code === 'INR' ? 0.05 : 0.0001}
                          value={currentRate}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (val > 0) setCustomRate(item.code, val);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-xs font-mono font-bold text-[#152238] focus:outline-none focus:border-[#2457D6]"
                        />
                      )}
                      <div className="mt-1 text-[10px] font-mono text-[#64748B] flex items-center justify-between">
                        <span>Live: {formatExchangeRate(item.code, liveRate)}</span>
                        {!isUSD && (
                          <span>
                            $10k = {formatSample(item.code, 10000)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Extended International Tax Currencies Reference Strip (CAD, AUD, SGD, AED) */}
              <div className="pt-2 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#475569]">
                <span className="font-bold text-[#152238]">
                  Live International Tax Benchmarks (per 1 USD):
                </span>
                <div className="flex flex-wrap items-center gap-2 font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#F1F5F9]">
                    🇨🇦 CAD: CA${extendedRates.CAD.toFixed(4)}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#F1F5F9]">
                    🇦🇺 AUD: A${extendedRates.AUD.toFixed(4)}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#F1F5F9]">
                    🇸🇬 SGD: S${extendedRates.SGD.toFixed(4)}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#F1F5F9]">
                    🇦🇪 AED: {extendedRates.AED.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
