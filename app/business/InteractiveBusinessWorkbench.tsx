'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Percent,
  Scale,
  Rocket,
  Flame,
  BarChart3,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  TrendingUp,
  DollarSign,
  Info,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

type SolverMode = 'margin-markup' | 'breakeven' | 'saas' | 'runway' | 'dupont';

export default function InteractiveBusinessWorkbench() {
  const [mode, setMode] = useState<SolverMode>('margin-markup');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 1. Margin & Markup State
  const [cost, setCost] = useState<number>(45);
  const [price, setPrice] = useState<number>(100);

  // 2. Break-Even State
  const [fixedCosts, setFixedCosts] = useState<number>(15000);
  const [unitPrice, setUnitPrice] = useState<number>(85);
  const [unitVariableCost, setUnitVariableCost] = useState<number>(35);
  const [targetProfit, setTargetProfit] = useState<number>(10000);
  const [expectedSalesUnits, setExpectedSalesUnits] = useState<number>(500);

  // 3. SaaS Unit Economics State
  const [arpu, setArpu] = useState<number>(120);
  const [saasGrossMargin, setSaasGrossMargin] = useState<number>(80);
  const [monthlyChurn, setMonthlyChurn] = useState<number>(2.5);
  const [cac, setCac] = useState<number>(950);

  // 4. Cash Runway & Burn State
  const [cashBalance, setCashBalance] = useState<number>(500000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(45000);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(15000);
  const [monthlyRevGrowth, setMonthlyRevGrowth] = useState<number>(5);

  // 5. DuPont ROE State
  const [netIncome, setNetIncome] = useState<number>(180000);
  const [annualRevenue, setAnnualRevenue] = useState<number>(1500000);
  const [totalAssets, setTotalAssets] = useState<number>(2200000);
  const [shareholdersEquity, setShareholdersEquity] = useState<number>(1100000);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatCurrency = useCallback((val: number, decimals = 2): string => {
    if (isNaN(val) || !isFinite(val)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(val);
  }, []);

  const formatPercent = useCallback((val: number, decimals = 1): string => {
    if (isNaN(val) || !isFinite(val)) return '0.0%';
    return `${val.toFixed(decimals)}%`;
  }, []);

  // --- Calculations ---

  // 1. Margin & Markup Calculations
  const marginResults = useMemo(() => {
    const grossProfit = price - cost;
    const marginPct = price > 0 ? (grossProfit / price) * 100 : 0;
    const markupPct = cost > 0 ? (grossProfit / cost) * 100 : 0;
    const keystonePrice = cost * 2;
    const target70Price = cost / (1 - 0.7);

    return {
      grossProfit,
      marginPct,
      markupPct,
      keystonePrice,
      target70Price,
    };
  }, [cost, price]);

  // 2. Break-Even Calculations
  const breakevenResults = useMemo(() => {
    const unitContributionMargin = unitPrice - unitVariableCost;
    const contributionMarginRatio = unitPrice > 0 ? unitContributionMargin / unitPrice : 0;
    const breakevenUnits = unitContributionMargin > 0 ? fixedCosts / unitContributionMargin : 0;
    const breakevenRevenue = breakevenUnits * unitPrice;
    const targetProfitUnits = unitContributionMargin > 0 ? (fixedCosts + targetProfit) / unitContributionMargin : 0;
    const targetProfitRevenue = targetProfitUnits * unitPrice;
    const expectedRevenue = expectedSalesUnits * unitPrice;
    const marginOfSafetyUnits = expectedSalesUnits - breakevenUnits;
    const marginOfSafetyRevenue = expectedRevenue - breakevenRevenue;
    const marginOfSafetyPct = expectedRevenue > 0 ? (marginOfSafetyRevenue / expectedRevenue) * 100 : 0;

    return {
      unitContributionMargin,
      contributionMarginRatio,
      breakevenUnits: Math.ceil(breakevenUnits),
      breakevenRevenue,
      targetProfitUnits: Math.ceil(targetProfitUnits),
      targetProfitRevenue,
      marginOfSafetyUnits: Math.round(marginOfSafetyUnits),
      marginOfSafetyRevenue,
      marginOfSafetyPct,
    };
  }, [fixedCosts, unitPrice, unitVariableCost, targetProfit, expectedSalesUnits]);

  // 3. SaaS Unit Economics Calculations
  const saasResults = useMemo(() => {
    const monthlyGrossProfitPerUser = arpu * (saasGrossMargin / 100);
    const churnDecimal = monthlyChurn / 100;
    const averageCustomerLifespanMonths = churnDecimal > 0 ? 1 / churnDecimal : 0;
    const ltv = churnDecimal > 0 ? monthlyGrossProfitPerUser / churnDecimal : 0;
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;
    const cacPaybackMonths = monthlyGrossProfitPerUser > 0 ? cac / monthlyGrossProfitPerUser : 0;

    let healthStatus = 'Poor';
    let healthColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900';
    if (ltvCacRatio >= 4) {
      healthStatus = 'Exceptional';
      healthColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';
    } else if (ltvCacRatio >= 3) {
      healthStatus = 'Healthy Benchmark';
      healthColor = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900';
    } else if (ltvCacRatio >= 1.5) {
      healthStatus = 'Moderate Risk';
      healthColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';
    }

    return {
      monthlyGrossProfitPerUser,
      averageCustomerLifespanMonths,
      ltv,
      ltvCacRatio,
      cacPaybackMonths,
      healthStatus,
      healthColor,
    };
  }, [arpu, saasGrossMargin, monthlyChurn, cac]);

  // 4. Cash Runway & Burn Calculations
  const runwayResults = useMemo(() => {
    const currentNetBurn = Math.max(0, monthlyExpenses - monthlyRevenue);
    const simpleRunwayMonths = currentNetBurn > 0 ? cashBalance / currentNetBurn : 999;

    // Dynamic growth runway simulation
    let remainingCash = cashBalance;
    let currentRev = monthlyRevenue;
    let monthsElapsed = 0;
    const maxSimMonths = 120;

    while (remainingCash > 0 && monthsElapsed < maxSimMonths) {
      const netMonthBurn = Math.max(0, monthlyExpenses - currentRev);
      if (netMonthBurn <= 0) {
        // Cash flow positive reached!
        break;
      }
      remainingCash -= netMonthBurn;
      currentRev *= 1 + monthlyRevGrowth / 100;
      monthsElapsed++;
    }

    const dynamicRunwayMonths = monthsElapsed >= maxSimMonths ? '> 10 Years' : `${monthsElapsed.toFixed(1)} Mos`;

    const zeroDate = new Date();
    zeroDate.setMonth(zeroDate.getMonth() + Math.floor(simpleRunwayMonths));
    const zeroCashDateStr = simpleRunwayMonths > 120 ? 'Cash Flow Positive / Indefinite' : zeroDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    let runwayColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';
    let runwayStatus = 'Strong Runway';
    if (simpleRunwayMonths < 6) {
      runwayColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900';
      runwayStatus = 'Critical Need for Funding';
    } else if (simpleRunwayMonths < 12) {
      runwayColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';
      runwayStatus = 'Moderate Runway';
    }

    return {
      currentNetBurn,
      simpleRunwayMonths,
      dynamicRunwayMonths,
      zeroCashDateStr,
      runwayColor,
      runwayStatus,
    };
  }, [cashBalance, monthlyExpenses, monthlyRevenue, monthlyRevGrowth]);

  // 5. DuPont ROE Calculations
  const dupontResults = useMemo(() => {
    const netProfitMargin = annualRevenue > 0 ? (netIncome / annualRevenue) * 100 : 0;
    const assetTurnover = totalAssets > 0 ? annualRevenue / totalAssets : 0;
    const financialLeverage = shareholdersEquity > 0 ? totalAssets / shareholdersEquity : 0;
    const roe = shareholdersEquity > 0 ? (netIncome / shareholdersEquity) * 100 : 0;
    const calculatedRoe = (netProfitMargin / 100) * assetTurnover * financialLeverage * 100;

    return {
      netProfitMargin,
      assetTurnover,
      financialLeverage,
      roe,
      calculatedRoe,
    };
  }, [netIncome, annualRevenue, totalAssets, shareholdersEquity]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-12">
      {/* Top Header Bar */}
      <div className="bg-slate-900 text-white px-6 py-5 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Multi-Metric Business Analytics Workbench
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Engine
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-0.5">
                Real-time financial modeling, margin optimization, break-even simulation, and SaaS unit economics
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setCost(45);
              setPrice(100);
              setFixedCosts(15000);
              setUnitPrice(85);
              setUnitVariableCost(35);
              setTargetProfit(10000);
              setExpectedSalesUnits(500);
              setArpu(120);
              setSaasGrossMargin(80);
              setMonthlyChurn(2.5);
              setCac(950);
              setCashBalance(500000);
              setMonthlyExpenses(45000);
              setMonthlyRevenue(15000);
              setNetIncome(180000);
              setAnnualRevenue(1500000);
              setTotalAssets(2200000);
              setShareholdersEquity(1100000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>

        {/* Solver Mode Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setMode('margin-markup')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              mode === 'margin-markup'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Percent className="w-4 h-4" />
            1. Margin & Markup
          </button>

          <button
            onClick={() => setMode('breakeven')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              mode === 'breakeven'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            2. Break-Even & CVP
          </button>

          <button
            onClick={() => setMode('saas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              mode === 'saas'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Rocket className="w-4 h-4" />
            3. SaaS & LTV:CAC
          </button>

          <button
            onClick={() => setMode('runway')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              mode === 'runway'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            4. Cash Runway & Burn
          </button>

          <button
            onClick={() => setMode('dupont')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
              mode === 'dupont'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            5. DuPont ROE Analyzer
          </button>
        </div>
      </div>

      {/* Main Interactive Workbench Body */}
      <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-900/50">
        {/* =========================================================================
            MODE 1: MARGIN & MARKUP
        ========================================================================= */}
        {mode === 'margin-markup' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Product Cost & Selling Price Inputs
                </h3>

                {/* Cost of Goods Sold Slider & Input */}
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between items-center text-sm">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Cost of Goods Sold (COGS)
                    </label>
                    <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(cost)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="500"
                    step="1"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Direct Entry ($):</span>
                    <input
                      type="number"
                      min="0.01"
                      step="1"
                      value={cost}
                      onChange={(e) => setCost(Math.max(0.01, Number(e.target.value)))}
                      className="w-32 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-mono tabular-nums"
                    />
                  </div>
                </div>

                {/* Selling Price Slider & Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Target Selling Price
                    </label>
                    <span className="font-mono tabular-nums font-bold text-blue-600 dark:text-blue-400 text-base">
                      {formatCurrency(price)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="1000"
                    step="5"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Direct Entry ($):</span>
                    <input
                      type="number"
                      min="0.01"
                      step="1"
                      value={price}
                      onChange={(e) => setPrice(Math.max(0.01, Number(e.target.value)))}
                      className="w-32 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-mono tabular-nums"
                    />
                  </div>
                </div>

                {/* Quick Markup Presets */}
                <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
                    Quick Pricing Presets
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPrice(Number((cost * 1.3333).toFixed(2)))}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                    >
                      25% Margin (+33% Markup)
                    </button>
                    <button
                      onClick={() => setPrice(Number((cost * 2).toFixed(2)))}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 transition"
                    >
                      50% Keystone (100% Markup)
                    </button>
                    <button
                      onClick={() => setPrice(Number((cost / (1 - 0.7)).toFixed(2)))}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                    >
                      70% SaaS Margin (+233% Markup)
                    </button>
                  </div>
                </div>
              </div>

              {/* Mathematical Explanation */}
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300">
                  <Info className="w-4 h-4" />
                  Margin vs Markup Relationship
                </div>
                <p>
                  <strong>Gross Profit Margin</strong> is calculated against the <em>Selling Price</em>:{' '}
                  <code className="font-mono text-blue-800 dark:text-blue-300 font-semibold">
                    (Price - Cost) / Price
                  </code>
                  .
                </p>
                <p>
                  <strong>Markup</strong> is calculated against the <em>Cost of Goods Sold</em>:{' '}
                  <code className="font-mono text-blue-800 dark:text-blue-300 font-semibold">
                    (Price - Cost) / Cost
                  </code>
                  .
                </p>
              </div>
            </div>

            {/* Calculated Output Display Cards */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Gross Profit Margin Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative group">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Gross Profit Margin
                    </span>
                    <button
                      onClick={() => copyToClipboard(`${marginResults.marginPct.toFixed(2)}%`, 'margin')}
                      className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                      title="Copy value"
                    >
                      {copiedKey === 'margin' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="mt-2 text-3xl font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                    {formatPercent(marginResults.marginPct, 1)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    of every revenue dollar is kept as gross profit
                  </div>
                  {/* Progress bar visual */}
                  <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, marginResults.marginPct))}%` }}
                    />
                  </div>
                </div>

                {/* Markup Percentage Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative group">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Markup on Cost
                    </span>
                    <button
                      onClick={() => copyToClipboard(`${marginResults.markupPct.toFixed(2)}%`, 'markup')}
                      className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                      title="Copy value"
                    >
                      {copiedKey === 'markup' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="mt-2 text-3xl font-extrabold font-mono tabular-nums text-blue-600 dark:text-blue-400">
                    {formatPercent(marginResults.markupPct, 1)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    added on top of COGS to reach selling price
                  </div>
                </div>
              </div>

              {/* Gross Dollar Profit Summary */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Gross Dollar Profit (Per Unit)
                  </span>
                  <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                    {formatCurrency(marginResults.grossProfit)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Standard Keystone Price (50% Margin):</span>
                    <span className="font-mono tabular-nums font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {formatCurrency(marginResults.keystonePrice)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">SaaS Target Price (70% Margin):</span>
                    <span className="font-mono tabular-nums font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {formatCurrency(marginResults.target70Price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 2: BREAK-EVEN & CVP
        ========================================================================= */}
        {mode === 'breakeven' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Cost-Volume-Profit Parameters
                </h3>

                {/* Fixed Costs */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Monthly Fixed Costs (Rent, Salaries, Software)</span>
                    <span className="font-mono tabular-nums">{formatCurrency(fixedCosts, 0)}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={fixedCosts}
                    onChange={(e) => setFixedCosts(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Unit Selling Price */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Selling Price Per Unit</span>
                    <span className="font-mono tabular-nums">{formatCurrency(unitPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Unit Variable Cost */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Variable Cost Per Unit (COGS, Shipping, Commissions)</span>
                    <span className="font-mono tabular-nums">{formatCurrency(unitVariableCost)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="300"
                    step="1"
                    value={unitVariableCost}
                    onChange={(e) => setUnitVariableCost(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Expected Sales Forecast Units */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Forecasted Sales Volume (Units)</span>
                    <span className="font-mono tabular-nums">{expectedSalesUnits.toLocaleString()} units</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="3000"
                    step="25"
                    value={expectedSalesUnits}
                    onChange={(e) => setExpectedSalesUnits(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Break-Even Results */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Break-Even Units
                  </span>
                  <div className="mt-2 text-3xl font-extrabold font-mono tabular-nums text-blue-600 dark:text-blue-400">
                    {breakevenResults.breakevenUnits.toLocaleString()}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    units required per month to cover all costs
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Break-Even Revenue
                  </span>
                  <div className="mt-2 text-3xl font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(breakevenResults.breakevenRevenue, 0)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    minimum monthly dollar turnover
                  </div>
                </div>
              </div>

              {/* Margin of Safety Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Margin of Safety Buffer
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    breakevenResults.marginOfSafetyPct > 20
                      ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                  }`}>
                    {breakevenResults.marginOfSafetyPct.toFixed(1)}% Cushion
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Based on expected monthly sales of {expectedSalesUnits.toLocaleString()} units, revenue can decline by{' '}
                  <strong className="text-slate-900 dark:text-slate-100">
                    {formatCurrency(breakevenResults.marginOfSafetyRevenue, 0)}
                  </strong>{' '}
                  ({breakevenResults.marginOfSafetyUnits} units) before operations run at a net loss.
                </p>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                  <span>Unit Contribution Margin: {formatCurrency(breakevenResults.unitContributionMargin)}</span>
                  <span>CM Ratio: {(breakevenResults.contributionMarginRatio * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 3: SAAS & LTV:CAC
        ========================================================================= */}
        {mode === 'saas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  SaaS Cohort & Economics Inputs
                </h3>

                {/* ARPU */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Average Revenue Per User (Monthly ARPU)</span>
                    <span className="font-mono tabular-nums">{formatCurrency(arpu, 0)}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="2000"
                    step="10"
                    value={arpu}
                    onChange={(e) => setArpu(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Gross Margin */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Subscription Gross Margin % (After AWS/Support)</span>
                    <span className="font-mono tabular-nums">{saasGrossMargin}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="95"
                    step="1"
                    value={saasGrossMargin}
                    onChange={(e) => setSaasGrossMargin(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Monthly Logo Churn */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Monthly Customer Logo Churn %</span>
                    <span className="font-mono tabular-nums">{monthlyChurn.toFixed(1)}%/mo</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="10.0"
                    step="0.1"
                    value={monthlyChurn}
                    onChange={(e) => setMonthlyChurn(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Customer Acquisition Cost (CAC) */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Blended Customer Acquisition Cost (CAC)</span>
                    <span className="font-mono tabular-nums">{formatCurrency(cac, 0)}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="15000"
                    step="50"
                    value={cac}
                    onChange={(e) => setCac(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* SaaS Metrics Outputs */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* LTV */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Customer Lifetime Value (LTV)
                  </span>
                  <div className="mt-2 text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                    {formatCurrency(saasResults.ltv, 0)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    avg lifetime: {saasResults.averageCustomerLifespanMonths.toFixed(1)} months
                  </div>
                </div>

                {/* LTV / CAC Ratio */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      LTV to CAC Ratio
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${saasResults.healthColor}`}>
                      {saasResults.healthStatus}
                    </span>
                  </div>
                  <div className="mt-2 text-3xl font-extrabold font-mono tabular-nums text-blue-600 dark:text-blue-400">
                    {saasResults.ltvCacRatio.toFixed(2)}x
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    benchmark target: 3.0x – 4.0x
                  </div>
                </div>
              </div>

              {/* CAC Payback Period */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    CAC Payback Period
                  </span>
                  <span className="text-xl font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                    {saasResults.cacPaybackMonths.toFixed(1)} Months
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  It takes <strong>{saasResults.cacPaybackMonths.toFixed(1)} months</strong> of gross profit ($
                  {saasResults.monthlyGrossProfitPerUser.toFixed(2)}/mo per account) to fully recover the ${cac.toLocaleString()} CAC.
                </p>

                {/* Progress bar visual for 12 mo benchmark */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>0 Mo (Instant)</span>
                    <span>12 Mo (Benchmark)</span>
                    <span>24 Mo</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        saasResults.cacPaybackMonths <= 12 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, (saasResults.cacPaybackMonths / 24) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 4: CASH RUNWAY & BURN
        ========================================================================= */}
        {mode === 'runway' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-500" />
                  Treasury & Operating Cash Flow
                </h3>

                {/* Cash Balance */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Liquid Cash Balance in Bank ($)</span>
                    <span className="font-mono tabular-nums">{formatCurrency(cashBalance, 0)}</span>
                  </div>
                  <input
                    type="range"
                    min="25000"
                    max="3000000"
                    step="25000"
                    value={cashBalance}
                    onChange={(e) => setCashBalance(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Gross Expenses */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Monthly Operating Expenses (Gross Burn)</span>
                    <span className="font-mono tabular-nums">{formatCurrency(monthlyExpenses, 0)}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="200000"
                    step="5000"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Monthly Revenue */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Monthly Customer Revenue (Cash Receipts)</span>
                    <span className="font-mono tabular-nums">{formatCurrency(monthlyRevenue, 0)}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="2500"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Runway Outputs */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Net Monthly Burn */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Net Monthly Burn Rate
                  </span>
                  <div className="mt-2 text-3xl font-extrabold font-mono tabular-nums text-rose-600 dark:text-rose-400">
                    {formatCurrency(runwayResults.currentNetBurn, 0)}/mo
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    gross burn ${monthlyExpenses.toLocaleString()} - revenue ${monthlyRevenue.toLocaleString()}
                  </div>
                </div>

                {/* Simple Runway */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Survival Runway
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${runwayResults.runwayColor}`}>
                      {runwayResults.runwayStatus}
                    </span>
                  </div>
                  <div className="mt-2 text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                    {runwayResults.simpleRunwayMonths.toFixed(1)} Months
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    at current constant burn rate
                  </div>
                </div>
              </div>

              {/* Zero-Cash Date Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Projected Zero-Cash Date
                  </span>
                  <span className="text-base font-mono tabular-nums font-bold text-blue-600 dark:text-blue-400">
                    {runwayResults.zeroCashDateStr}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Ventures should begin fundraising rounds at least <strong>6 months</strong> prior to zero-cash dates to prevent bridge-round down valuations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 5: DUPONT ROE ANALYZER
        ========================================================================= */}
        {mode === 'dupont' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Financial Statement Components
                </h3>

                {/* Net Income */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Net Income (Annual Profit)</span>
                    <span className="font-mono tabular-nums">{formatCurrency(netIncome, 0)}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={netIncome}
                    onChange={(e) => setNetIncome(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Annual Revenue */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Annual Total Revenue</span>
                    <span className="font-mono tabular-nums">{formatCurrency(annualRevenue, 0)}</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="100000"
                    value={annualRevenue}
                    onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Total Assets */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Total Balance Sheet Assets</span>
                    <span className="font-mono tabular-nums">{formatCurrency(totalAssets, 0)}</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="100000"
                    value={totalAssets}
                    onChange={(e) => setTotalAssets(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Shareholders Equity */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Total Shareholders Equity</span>
                    <span className="font-mono tabular-nums">{formatCurrency(shareholdersEquity, 0)}</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="50000"
                    value={shareholdersEquity}
                    onChange={(e) => setShareholdersEquity(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* DuPont Breakdown Cards */}
            <div className="lg:col-span-6 space-y-4">
              {/* Master ROE Banner */}
              <div className="p-5 rounded-2xl bg-indigo-900 text-white shadow-md relative overflow-hidden">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Composite Return on Equity (ROE)
                </div>
                <div className="text-4xl font-extrabold font-mono tabular-nums mt-1 text-white">
                  {dupontResults.roe.toFixed(2)}%
                </div>
                <div className="text-xs text-indigo-200 mt-1">
                  Net Income of ${netIncome.toLocaleString()} generated on ${shareholdersEquity.toLocaleString()} equity
                </div>
              </div>

              {/* 3-Part Decomposition Table */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  3-Step DuPont Decomposition Equation
                </span>

                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                      Net Profit Margin
                    </span>
                    <span className="text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      {dupontResults.netProfitMargin.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Operating Efficiency</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                      Asset Turnover
                    </span>
                    <span className="text-lg font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
                      {dupontResults.assetTurnover.toFixed(2)}x
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Asset Utilization</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                      Equity Multiplier
                    </span>
                    <span className="text-lg font-bold font-mono tabular-nums text-purple-600 dark:text-purple-400">
                      {dupontResults.financialLeverage.toFixed(2)}x
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Financial Leverage</span>
                  </div>
                </div>

                <div className="text-center text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
                  ROE = ({dupontResults.netProfitMargin.toFixed(1)}%) × ({dupontResults.assetTurnover.toFixed(2)}) × ({dupontResults.financialLeverage.toFixed(2)}) ={' '}
                  <strong className="text-slate-900 dark:text-slate-100 font-bold">{dupontResults.calculatedRoe.toFixed(2)}%</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
