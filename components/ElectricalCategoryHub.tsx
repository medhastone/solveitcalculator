'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  Zap,
  ShieldCheck,
  RotateCcw,
  Layers,
  ChevronRight,
  Compass,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  HelpCircle,
  Sparkles,
  Sliders,
  DollarSign,
  Cpu,
  Home
} from 'lucide-react';
import { CANONICAL_TOOLS } from '@/lib/registry';

type ElectricalSubcategory = 'all' | 'home-wiring' | 'circuits' | 'energy-cost' | 'electronics-conversions';

interface TabItem {
  id: ElectricalSubcategory;
  label: string;
  icon: React.ElementType;
  count: number;
}

// AWG Circular Mils lookup (NEC Chapter 9 Table 8)
const AWG_CM: Record<string, { cm: number; maxAmpsCopper: number; maxAmpsAlum: number }> = {
  '14': { cm: 4110, maxAmpsCopper: 15, maxAmpsAlum: 0 },
  '12': { cm: 6530, maxAmpsCopper: 20, maxAmpsAlum: 15 },
  '10': { cm: 10380, maxAmpsCopper: 30, maxAmpsAlum: 25 },
  '8': { cm: 16510, maxAmpsCopper: 40, maxAmpsAlum: 30 },
  '6': { cm: 26240, maxAmpsCopper: 55, maxAmpsAlum: 40 },
  '4': { cm: 41740, maxAmpsCopper: 70, maxAmpsAlum: 55 },
  '2': { cm: 66360, maxAmpsCopper: 95, maxAmpsAlum: 75 },
  '1/0': { cm: 105600, maxAmpsCopper: 125, maxAmpsAlum: 100 },
  '2/0': { cm: 133100, maxAmpsCopper: 145, maxAmpsAlum: 115 },
  '4/0': { cm: 211600, maxAmpsCopper: 195, maxAmpsAlum: 150 },
};

export default function ElectricalCategoryHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ElectricalSubcategory>('all');
  const [activeWorkbench, setActiveWorkbench] = useState<'wire' | 'power' | 'cost' | 'resistor'>('wire');

  // --- WORKBENCH 1: Wire Sizing & Voltage Drop State ---
  const [wireVoltage, setWireVoltage] = useState<number>(120);
  const [wirePhase, setWirePhase] = useState<'1' | '3'>('1');
  const [wireMaterial, setWireMaterial] = useState<'copper' | 'aluminum'>('copper');
  const [wireAmps, setWireAmps] = useState<number>(16);
  const [wireDistance, setWireDistance] = useState<number>(100);
  const [selectedGauge, setSelectedGauge] = useState<string>('12');

  const wireCalcResults = useMemo(() => {
    const k = wireMaterial === 'copper' ? 12.9 : 21.2;
    const cm = AWG_CM[selectedGauge]?.cm || 6530;
    const multiplier = wirePhase === '3' ? Math.sqrt(3) : 2;
    const voltageDrop = (multiplier * k * wireAmps * wireDistance) / cm;
    const dropPercentage = (voltageDrop / wireVoltage) * 100;
    const endVoltage = Math.max(0, wireVoltage - voltageDrop);
    const isSafe = dropPercentage <= 3.0;

    // Find recommended gauge for <= 3% drop
    const minCmNeeded = (multiplier * k * wireAmps * wireDistance) / (wireVoltage * 0.03);
    let recommendedGauge = '4/0';
    for (const [gauge, data] of Object.entries(AWG_CM)) {
      if (data.cm >= minCmNeeded && (wireMaterial === 'copper' ? data.maxAmpsCopper >= wireAmps : data.maxAmpsAlum >= wireAmps)) {
        recommendedGauge = gauge;
        break;
      }
    }

    return {
      voltageDrop: Number(voltageDrop.toFixed(2)),
      dropPercentage: Number(dropPercentage.toFixed(2)),
      endVoltage: Number(endVoltage.toFixed(1)),
      isSafe,
      recommendedGauge,
    };
  }, [wireVoltage, wirePhase, wireMaterial, wireAmps, wireDistance, selectedGauge]);

  // --- WORKBENCH 2: Power, Current & Breaker Sizer State ---
  const [calcWatts, setCalcWatts] = useState<number>(1500);
  const [calcVolts, setCalcVolts] = useState<number>(120);

  const powerCalcResults = useMemo(() => {
    const amps = calcVolts > 0 ? calcWatts / calcVolts : 0;
    const resistance = amps > 0 ? calcVolts / amps : 0;
    const continuousBreakerRating = amps * 1.25;

    let standardBreaker = 15;
    if (continuousBreakerRating > 30) standardBreaker = 50;
    else if (continuousBreakerRating > 20) standardBreaker = 30;
    else if (continuousBreakerRating > 15) standardBreaker = 20;

    const max15AWattage = 15 * 0.8 * calcVolts;
    const max20AWattage = 20 * 0.8 * calcVolts;

    return {
      amps: Number(amps.toFixed(2)),
      resistance: Number(resistance.toFixed(2)),
      continuousAmpsNeeded: Number(continuousBreakerRating.toFixed(2)),
      standardBreaker,
      max15AWattage: Number(max15AWattage.toFixed(0)),
      max20AWattage: Number(max20AWattage.toFixed(0)),
    };
  }, [calcWatts, calcVolts]);

  // --- WORKBENCH 3: Electricity Cost State ---
  const [costWatts, setCostWatts] = useState<number>(1200);
  const [costHoursPerDay, setCostHoursPerDay] = useState<number>(4);
  const [kwhRate, setKwhRate] = useState<number>(0.16);

  const electricityCostResults = useMemo(() => {
    const dailyKwh = (costWatts * costHoursPerDay) / 1000;
    const monthlyKwh = dailyKwh * 30.416;
    const yearlyKwh = dailyKwh * 365;

    const dailyCost = dailyKwh * kwhRate;
    const monthlyCost = monthlyKwh * kwhRate;
    const yearlyCost = yearlyKwh * kwhRate;

    return {
      dailyKwh: Number(dailyKwh.toFixed(2)),
      monthlyKwh: Number(monthlyKwh.toFixed(1)),
      yearlyKwh: Number(yearlyKwh.toFixed(0)),
      dailyCost: Number(dailyCost.toFixed(2)),
      monthlyCost: Number(monthlyCost.toFixed(2)),
      yearlyCost: Number(yearlyCost.toFixed(2)),
    };
  }, [costWatts, costHoursPerDay, kwhRate]);

  // --- WORKBENCH 4: Resistor & LED Helper State ---
  const [ledSupplyV, setLedSupplyV] = useState<number>(12);
  const [ledForwardV, setLedForwardV] = useState<number>(2.2);
  const [ledTargetMa, setLedTargetMa] = useState<number>(20);

  const [r1, setR1] = useState<number>(100);
  const [r2, setR2] = useState<number>(100);

  const resistorResults = useMemo(() => {
    const vDrop = Math.max(0, ledSupplyV - ledForwardV);
    const iAmps = ledTargetMa / 1000;
    const ledResistorOhms = iAmps > 0 ? vDrop / iAmps : 0;
    const ledResistorWatts = (vDrop * iAmps);

    const seriesR = r1 + r2;
    const parallelR = (r1 > 0 && r2 > 0) ? (r1 * r2) / (r1 + r2) : 0;

    return {
      ledResistorOhms: Number(ledResistorOhms.toFixed(0)),
      ledResistorWatts: Number(ledResistorWatts.toFixed(3)),
      suggestedWattRating: ledResistorWatts > 0.5 ? '1 Watt' : ledResistorWatts > 0.25 ? '½ Watt' : '¼ Watt',
      seriesR: Number(seriesR.toFixed(1)),
      parallelR: Number(parallelR.toFixed(1)),
    };
  }, [ledSupplyV, ledForwardV, ledTargetMa, r1, r2]);

  // --- Electrical Tools Filter ---
  const electricalTools = useMemo(() => {
    return CANONICAL_TOOLS.filter((t) => t.category === 'electrical' || t.canonicalPath.startsWith('/electrical'));
  }, []);

  const tabCounts = useMemo(() => {
    return {
      all: electricalTools.length,
      'home-wiring': electricalTools.filter((t) => t.subcategory === 'home-wiring').length,
      circuits: electricalTools.filter((t) => t.subcategory === 'circuits').length,
      'energy-cost': electricalTools.filter((t) => t.subcategory === 'energy-cost').length,
      'electronics-conversions': electricalTools.filter((t) => t.subcategory === 'electronics-conversions').length,
    };
  }, [electricalTools]);

  const tabs: TabItem[] = [
    { id: 'all', label: 'All Tools', icon: Layers, count: tabCounts.all },
    { id: 'home-wiring', label: 'Home Wiring & Cables', icon: Home, count: tabCounts['home-wiring'] },
    { id: 'circuits', label: 'Circuits & Fundamentals', icon: Zap, count: tabCounts.circuits },
    { id: 'energy-cost', label: 'Energy & Utility Costs', icon: DollarSign, count: tabCounts['energy-cost'] },
    { id: 'electronics-conversions', label: 'Electronics & Conversions', icon: Cpu, count: tabCounts['electronics-conversions'] },
  ];

  const filteredTools = useMemo(() => {
    let list = electricalTools;
    if (activeTab !== 'all') {
      list = list.filter((t) => t.subcategory === activeTab);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((t) => {
        const titleMatch = t.title.toLowerCase().includes(q) || t.name?.toLowerCase().includes(q);
        const descMatch = t.desc.toLowerCase().includes(q);
        const keywordMatch = t.keywords?.some((k) => k.toLowerCase().includes(q));
        return titleMatch || descMatch || keywordMatch;
      });
    }
    return list;
  }, [electricalTools, activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased selection:bg-primary/20 selection:text-primary transition-colors duration-200">
      {/* 1. HERO HEADER */}
      <header className="relative border-b border-outline-variant/40 bg-surface-container-low/60 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-on-surface-variant">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <ChevronRight className="w-4 h-4 text-outline-variant" />
                <span className="text-on-surface font-semibold" aria-current="page">
                  Electrical Calculators
                </span>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Zap className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>24+ Free &amp; Easy Electrical Solvers</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight mb-4">
                Electrical Calculators &amp; Sizing Tools
              </h1>
              <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-3xl mb-8">
                Free, easy-to-use electrical calculators for wire thickness, voltage loss, electricity bills, circuit breaker safety, and component values. Instant step-by-step math based on National Electrical Code (NEC) guidelines.
              </p>

              {/* Omnisearch Box */}
              <div className="relative max-w-2xl">
                <label htmlFor="electrical-search" className="sr-only">
                  Search electrical tools
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                  <input
                    id="electrical-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search wire size, voltage drop, watts to amps, electricity bill, LED resistor..."
                    className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base shadow-sm transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
                      aria-label="Clear search"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <div className="mt-2 text-xs text-primary font-medium flex items-center justify-between">
                    <span>Showing {filteredTools.length} matching tools</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-on-surface-variant hover:text-on-surface underline cursor-pointer"
                    >
                      Reset search
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Verified Standards Card */}
            <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Standards</span>
              </h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-on-surface-variant">Total Free Tools</dt>
                  <dd className="text-xl font-bold text-on-surface mt-0.5">{electricalTools.length} Sizing &amp; Calculation Tools</dd>
                </div>
                <div className="pt-2 border-t border-outline-variant/30">
                  <dt className="text-on-surface-variant">Code Guidelines</dt>
                  <dd className="text-xs text-on-surface font-medium mt-1 bg-surface-container-low p-2 rounded border border-outline-variant/40">
                    National Electrical Code (NEC / NFPA 70) &amp; IEEE
                  </dd>
                </div>
                <div className="pt-2 border-t border-outline-variant/30">
                  <dt className="text-on-surface-variant">Key Safety Rules</dt>
                  <dd className="text-xs text-amber-900 dark:text-amber-300 mt-0.5 font-semibold">
                    3% Max Voltage Drop · 80% Breaker Continuous Load
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* 2. FOUR INTERACTIVE LIVE WORKBENCHES */}
        <section aria-labelledby="live-workbenches-heading" className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-outline-variant/30">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-1">
                <Sliders className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>Instant In-Browser Solvers</span>
              </div>
              <h2 id="live-workbenches-heading" className="text-2xl font-bold text-on-surface">
                Live Electrical Workbenches
              </h2>
              <p className="text-sm text-on-surface-variant mt-0.5">
                Calculate wire size, breaker loads, electricity bills, and LED resistors instantly.
              </p>
            </div>

            {/* Workbench Selector Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-surface-container-low rounded-xl border border-outline-variant/40">
              <button
                onClick={() => setActiveWorkbench('wire')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeWorkbench === 'wire'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                1. Wire &amp; Voltage Loss
              </button>
              <button
                onClick={() => setActiveWorkbench('power')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeWorkbench === 'power'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                2. Power &amp; Breakers
              </button>
              <button
                onClick={() => setActiveWorkbench('cost')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeWorkbench === 'cost'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                3. Electricity Bills
              </button>
              <button
                onClick={() => setActiveWorkbench('resistor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeWorkbench === 'resistor'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                4. Resistors &amp; LEDs
              </button>
            </div>
          </div>

          {/* WORKBENCH 1: Wire Sizing & Voltage Drop */}
          {activeWorkbench === 'wire' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Source Voltage</label>
                    <select
                      value={wireVoltage}
                      onChange={(e) => setWireVoltage(Number(e.target.value))}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value={120}>120V (Standard Wall Outlet)</option>
                      <option value={240}>240V (Dryer / EV Charger)</option>
                      <option value={208}>208V (Commercial 3-Phase)</option>
                      <option value={480}>480V (Industrial 3-Phase)</option>
                      <option value={12}>12V (Low Voltage / Solar)</option>
                      <option value={24}>24V (Battery Bank)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Phase</label>
                    <select
                      value={wirePhase}
                      onChange={(e) => setWirePhase(e.target.value as '1' | '3')}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="1">1-Phase (Residential)</option>
                      <option value="3">3-Phase (Commercial)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Conductor Wire</label>
                    <select
                      value={wireMaterial}
                      onChange={(e) => setWireMaterial(e.target.value as 'copper' | 'aluminum')}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="copper">Copper (Standard)</option>
                      <option value="aluminum">Aluminum</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Current (Amps)</label>
                    <input
                      type="number"
                      min={1}
                      max={400}
                      value={wireAmps}
                      onChange={(e) => setWireAmps(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-sm text-on-surface font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">One-Way Distance (Feet)</label>
                    <input
                      type="number"
                      min={1}
                      max={2000}
                      value={wireDistance}
                      onChange={(e) => setWireDistance(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-sm text-on-surface font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Wire Gauge (AWG)</label>
                    <select
                      value={selectedGauge}
                      onChange={(e) => setSelectedGauge(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="14">14 AWG (15A Circuit)</option>
                      <option value="12">12 AWG (20A Circuit)</option>
                      <option value="10">10 AWG (30A Circuit)</option>
                      <option value="8">8 AWG (40A-50A)</option>
                      <option value="6">6 AWG (55A-65A)</option>
                      <option value="4">4 AWG (70A-85A)</option>
                      <option value="2">2 AWG (95A-115A)</option>
                      <option value="1/0">1/0 AWG (125A-150A)</option>
                      <option value="2/0">2/0 AWG (145A-175A)</option>
                      <option value="4/0">4/0 AWG (200A Service)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Wire Results Panel */}
              <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant/50 p-5 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Calculation Results</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      wireCalcResults.isSafe
                        ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                        : 'bg-rose-100 dark:bg-rose-500/15 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30'
                    }`}
                  >
                    {wireCalcResults.isSafe ? '✓ Safe (≤ 3% Drop)' : '⚠ High Voltage Loss (> 3%)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/40">
                    <div className="text-[11px] text-on-surface-variant">Voltage Drop</div>
                    <div className="text-xl font-bold font-mono text-on-surface mt-0.5">
                      {wireCalcResults.voltageDrop} <span className="text-xs text-on-surface-variant font-sans">Volts</span>
                    </div>
                  </div>
                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/40">
                    <div className="text-[11px] text-on-surface-variant">Percentage Lost</div>
                    <div className={`text-xl font-bold font-mono mt-0.5 ${wireCalcResults.isSafe ? 'text-emerald-800 dark:text-emerald-400' : 'text-rose-800 dark:text-rose-400'}`}>
                      {wireCalcResults.dropPercentage}%
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-on-surface-variant border-t border-outline-variant/30 pt-3">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Delivered Voltage:</span>
                    <span className="font-mono font-semibold text-on-surface">{wireCalcResults.endVoltage} V</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Recommended Gauge for ≤3%:</span>
                    <span className="font-mono font-bold text-amber-950 dark:text-amber-300">{wireCalcResults.recommendedGauge} AWG {wireMaterial}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WORKBENCH 2: Power, Current & Breaker Sizer */}
          {activeWorkbench === 'power' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Appliance Power (Watts)</label>
                    <input
                      type="number"
                      min={1}
                      max={25000}
                      value={calcWatts}
                      onChange={(e) => setCalcWatts(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-sm text-on-surface font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => setCalcWatts(1500)} className="text-[11px] text-on-surface-variant hover:text-on-surface bg-surface-container px-2 py-0.5 rounded font-medium">1500W (Heater)</button>
                      <button onClick={() => setCalcWatts(1200)} className="text-[11px] text-on-surface-variant hover:text-on-surface bg-surface-container px-2 py-0.5 rounded font-medium">1200W (Microwave)</button>
                      <button onClick={() => setCalcWatts(7200)} className="text-[11px] text-on-surface-variant hover:text-on-surface bg-surface-container px-2 py-0.5 rounded font-medium">7200W (EV Charger)</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Voltage (Volts)</label>
                    <select
                      value={calcVolts}
                      onChange={(e) => setCalcVolts(Number(e.target.value))}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-sm text-on-surface font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value={120}>120 Volts (Standard Wall Plug)</option>
                      <option value={240}>240 Volts (Heavy Duty / Oven / EV)</option>
                      <option value={208}>208 Volts (Commercial)</option>
                      <option value={12}>12 Volts (Automotive / Solar)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Power Results Panel */}
              <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant/50 p-5 rounded-xl shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Electrical Load &amp; Sizing</div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/40">
                    <div className="text-[11px] text-on-surface-variant">Current Flow</div>
                    <div className="text-xl font-bold font-mono text-amber-950 dark:text-amber-300 mt-0.5">
                      {powerCalcResults.amps} <span className="text-xs text-on-surface-variant font-sans">Amps</span>
                    </div>
                  </div>
                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/40">
                    <div className="text-[11px] text-on-surface-variant">Min. Breaker Size</div>
                    <div className="text-xl font-bold font-mono text-emerald-800 dark:text-emerald-400 mt-0.5">
                      {powerCalcResults.standardBreaker} <span className="text-xs text-on-surface-variant font-sans">Amp Breaker</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-on-surface-variant border-t border-outline-variant/30 pt-3">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Continuous 80% Safe Limit (15A):</span>
                    <span className="font-mono font-semibold text-on-surface">{powerCalcResults.max15AWattage} W</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Continuous 80% Safe Limit (20A):</span>
                    <span className="font-mono font-semibold text-on-surface">{powerCalcResults.max20AWattage} W</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Circuit Resistance:</span>
                    <span className="font-mono font-semibold text-on-surface">{powerCalcResults.resistance} Ω</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WORKBENCH 3: Electricity Cost */}
          {activeWorkbench === 'cost' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Appliance Watts</label>
                    <input
                      type="number"
                      min={1}
                      max={30000}
                      value={costWatts}
                      onChange={(e) => setCostWatts(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-sm text-on-surface font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Hours Used Per Day</label>
                    <input
                      type="number"
                      min={0.1}
                      max={24}
                      step={0.5}
                      value={costHoursPerDay}
                      onChange={(e) => setCostHoursPerDay(Math.min(24, Math.max(0.1, Number(e.target.value))))}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-sm text-on-surface font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Electricity Rate ($/kWh)</label>
                    <input
                      type="number"
                      min={0.01}
                      max={2.0}
                      step={0.01}
                      value={kwhRate}
                      onChange={(e) => setKwhRate(Math.max(0.01, Number(e.target.value)))}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-sm text-on-surface font-mono focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Cost Results Panel */}
              <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant/50 p-5 rounded-xl shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Power Bill Breakdown</div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/40">
                    <div className="text-[11px] text-on-surface-variant">Monthly Running Cost</div>
                    <div className="text-xl font-bold font-mono text-emerald-800 dark:text-emerald-400 mt-0.5">
                      ${electricityCostResults.monthlyCost}
                    </div>
                  </div>
                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/40">
                    <div className="text-[11px] text-on-surface-variant">Yearly Running Cost</div>
                    <div className="text-xl font-bold font-mono text-on-surface mt-0.5">
                      ${electricityCostResults.yearlyCost}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-on-surface-variant border-t border-outline-variant/30 pt-3">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Daily Energy Used:</span>
                    <span className="font-mono font-semibold text-on-surface">{electricityCostResults.dailyKwh} kWh/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Monthly Energy:</span>
                    <span className="font-mono font-semibold text-on-surface">{electricityCostResults.monthlyKwh} kWh/mo</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WORKBENCH 4: Resistor & LED Helper */}
          {activeWorkbench === 'resistor' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-2">LED Series Resistor Sizer</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">Power Supply (V)</label>
                      <input
                        type="number"
                        min={1}
                        max={48}
                        value={ledSupplyV}
                        onChange={(e) => setLedSupplyV(Number(e.target.value))}
                        className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2 text-xs text-on-surface font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">LED Forward (V)</label>
                      <input
                        type="number"
                        min={0.5}
                        max={10}
                        step={0.1}
                        value={ledForwardV}
                        onChange={(e) => setLedForwardV(Number(e.target.value))}
                        className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2 text-xs text-on-surface font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">Desired Current (mA)</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={ledTargetMa}
                        onChange={(e) => setLedTargetMa(Number(e.target.value))}
                        className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2 text-xs text-on-surface font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Series / Parallel Equivalent Resistance</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">Resistor 1 (Ω)</label>
                      <input
                        type="number"
                        min={1}
                        value={r1}
                        onChange={(e) => setR1(Number(e.target.value))}
                        className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2 text-xs text-on-surface font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">Resistor 2 (Ω)</label>
                      <input
                        type="number"
                        min={1}
                        value={r2}
                        onChange={(e) => setR2(Number(e.target.value))}
                        className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2 text-xs text-on-surface font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Resistor Results */}
              <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant/50 p-5 rounded-xl shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Calculated Values</div>
                <div className="space-y-3">
                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/40 flex justify-between items-center">
                    <div>
                      <div className="text-[11px] text-on-surface-variant">LED Ballast Resistor</div>
                      <div className="text-lg font-bold font-mono text-amber-950 dark:text-amber-300">{resistorResults.ledResistorOhms} Ω</div>
                    </div>
                    <span className="text-xs bg-surface-container px-2.5 py-1 rounded text-on-surface font-semibold">{resistorResults.suggestedWattRating}</span>
                  </div>

                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/40 flex justify-between items-center">
                    <div>
                      <div className="text-[11px] text-on-surface-variant">Series Resistance (R1 + R2)</div>
                      <div className="text-lg font-bold font-mono text-on-surface">{resistorResults.seriesR} Ω</div>
                    </div>
                  </div>

                  <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/40 flex justify-between items-center">
                    <div>
                      <div className="text-[11px] text-on-surface-variant">Parallel Resistance (R1 || R2)</div>
                      <div className="text-lg font-bold font-mono text-emerald-800 dark:text-emerald-400">{resistorResults.parallelR} Ω</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 3. FOUR TOPIC TABS & COMPLETE 24+ TOOL DIRECTORY */}
        <section aria-labelledby="catalog-heading">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-outline-variant/40">
            <div>
              <h2 id="catalog-heading" className="text-2xl font-bold text-on-surface flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>Electrical Calculators Directory</span>
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Browse our complete catalog of {electricalTools.length} free electrical and power calculators.
              </p>
            </div>
            <div className="text-xs text-on-surface-variant font-mono bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/50 self-start sm:self-auto">
              Total: {filteredTools.length} Calculators
            </div>
          </div>

          {/* Subcategory Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-outline-variant/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tool Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <article
                key={tool.id}
                className="group relative bg-surface-container-lowest border border-outline-variant/50 hover:border-primary/60 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
                      {tool.badge || 'Verified'}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-mono">
                      {tool.calculationStandard ? 'Standard Model' : 'Formula Verified'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-2">
                    <Link href={tool.canonicalPath} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {tool.name || tool.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 leading-relaxed font-normal">
                    {tool.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                  {tool.formulaDisplay ? (
                    <code className="text-[11px] text-amber-950 dark:text-amber-300 font-mono font-semibold truncate max-w-[200px]">
                      {tool.formulaDisplay}
                    </code>
                  ) : (
                    <span className="text-on-surface-variant">Step-by-step solver</span>
                  )}
                  <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Calculate <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4. GOAL-BASED SELECTOR */}
        <section aria-labelledby="goals-heading" className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Goal Selector</span>
            </div>
            <h2 id="goals-heading" className="text-2xl font-bold text-on-surface mb-2">
              What do you want to calculate?
            </h2>
            <p className="text-sm text-on-surface-variant">
              Pick your practical goal below to jump straight to the easiest calculator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 mb-2 inline-block">
                  Conductor Sizing
                </span>
                <h3 className="text-sm font-semibold text-on-surface mb-1">
                  Prevent power loss over long wire runs
                </h3>
                <p className="text-xs text-on-surface-variant mb-3">
                  Check voltage loss over 50–500 ft runs to sheds, garages, or outdoor pumps.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveWorkbench('wire');
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                className="text-xs text-primary font-semibold hover:text-primary/80 flex items-center gap-1 pt-2 border-t border-outline-variant/30 cursor-pointer"
              >
                Use Wire Sizer <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 mb-2 inline-block">
                  Breaker Safety
                </span>
                <h3 className="text-sm font-semibold text-on-surface mb-1">
                  Check if an appliance trips your circuit
                </h3>
                <p className="text-xs text-on-surface-variant mb-3">
                  Convert watts to amps and verify the 80% continuous safety limit.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveWorkbench('power');
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1 pt-2 border-t border-outline-variant/30 cursor-pointer"
              >
                Use Breaker Tool <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/30 mb-2 inline-block">
                  Energy Bill
                </span>
                <h3 className="text-sm font-semibold text-on-surface mb-1">
                  Estimate monthly power running costs
                </h3>
                <p className="text-xs text-on-surface-variant mb-3">
                  Calculate the exact cost of running space heaters, AC units, and electronics.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveWorkbench('cost');
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                className="text-xs text-primary font-semibold hover:text-primary/80 flex items-center gap-1 pt-2 border-t border-outline-variant/30 cursor-pointer"
              >
                Use Cost Estimator <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>

        {/* 5. STEP-BY-STEP PRACTICAL GUIDES */}
        <section aria-labelledby="guides-heading">
          <div className="mb-6 pb-2 border-b border-outline-variant/40">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Step-by-Step Guides</span>
            </div>
            <h2 id="guides-heading" className="text-2xl font-bold text-on-surface">
              How Electrical Calculations Work: Real Examples
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Clear formulas, practical examples, and common wiring mistakes to avoid.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <article className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-xl font-bold text-on-surface mb-3">
                  How to Prevent Voltage Loss over Long Wires
                </h3>

                <div className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-4 mb-4">
                  <div className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">
                    How It Is Calculated
                  </div>
                  <code className="text-sm sm:text-base text-amber-950 dark:text-amber-300 font-mono block font-bold overflow-x-auto pb-1">
                    Voltage Lost = (2 × 12.9 × Amps × Distance in Feet) / Circular Mils Area
                  </code>
                  <p className="text-xs text-on-surface-variant mt-2 italic">
                    Keeping voltage loss under 3% ensures motors start smoothly and prevents wires from heating up.
                  </p>
                </div>

                <div className="mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>How It Works</span>
                  </h4>
                  <ol className="space-y-1.5 text-xs text-on-surface-variant list-decimal list-inside">
                    <li>Electricity meets slight resistance as it travels through copper or aluminum cables.</li>
                    <li>The longer the cable run and the higher the amperage, the more voltage is lost along the way.</li>
                    <li>If voltage drops more than 3%, equipment runs inefficiently and motors can burn out.</li>
                    <li>Using a thicker gauge wire (lower AWG number) restores full voltage delivery.</li>
                  </ol>
                </div>

                <div className="bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/60 rounded-xl p-4 mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200 mb-2">
                    Real Example: 16A Table Saw 100 ft Away on 12-Gauge Wire
                  </h4>
                  <p className="text-xs text-on-surface font-medium mb-2">
                    Calculation: (2 × 12.9 × 16 × 100) / 6,530 = 6.32V lost (5.27% drop).
                  </p>
                  <div className="text-xs text-emerald-800 dark:text-emerald-300 font-bold pt-1 border-t border-amber-300/60 dark:border-amber-800/40">
                    Solution: Step up to thicker 10 AWG wire (3.31V drop / 2.76%) for safe operation.
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/30 flex items-start gap-2 text-xs text-amber-950 dark:text-amber-100 bg-amber-100/80 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-300/80 dark:border-amber-800/60">
                <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-800 dark:text-amber-400" />
                <div>
                  <span className="font-bold">Helpful Tip: </span>
                  Always upsize by one wire thickness when running cables underground to a detached garage or pump house.
                </div>
              </div>
            </article>

            <article className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-xl font-bold text-on-surface mb-3">
                  How Watts, Volts, and Amps Work Together
                </h3>

                <div className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-4 mb-4">
                  <div className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">
                    How It Is Calculated
                  </div>
                  <code className="text-sm sm:text-base text-amber-950 dark:text-amber-300 font-mono block font-bold overflow-x-auto pb-1">
                    Power (Watts) = Voltage (Volts) × Current (Amps)
                  </code>
                  <p className="text-xs text-on-surface-variant mt-2 italic">
                    Watts measures total electrical power, Volts is electrical pressure, and Amps is the rate of flow.
                  </p>
                </div>

                <div className="mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>How It Works</span>
                  </h4>
                  <ol className="space-y-1.5 text-xs text-on-surface-variant list-decimal list-inside">
                    <li>Divide appliance wattage by your wall voltage (120V) to find how many amps it draws.</li>
                    <li>For safety, continuous loads running for 3+ hours should not exceed 80% of circuit capacity.</li>
                    <li>A standard 15-amp circuit has a continuous safety limit of 12 Amps (1,440 Watts).</li>
                  </ol>
                </div>

                <div className="bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/60 rounded-xl p-4 mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200 mb-2">
                    Real Example: 1,500W Space Heater
                  </h4>
                  <p className="text-xs text-on-surface font-medium mb-2">
                    Calculation: 1,500 Watts ÷ 120 Volts = 12.5 Amps.
                  </p>
                  <div className="text-xs text-emerald-800 dark:text-emerald-300 font-bold pt-1 border-t border-amber-300/60 dark:border-amber-800/40">
                    Result: 12.5 Amps uses 104% of a 15A continuous limit. Run heavy heaters on a 20A circuit.
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/30 flex items-start gap-2 text-xs text-amber-950 dark:text-amber-100 bg-amber-100/80 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-300/80 dark:border-amber-800/60">
                <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-800 dark:text-amber-400" />
                <div>
                  <span className="font-bold">Helpful Tip: </span>
                  Never plug two 1,500W heaters or a microwave and coffee maker into the same wall circuit simultaneously.
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* 6. RESPONSIVE 2-COLUMN FAQ GRID */}
        <section aria-labelledby="faqs-heading" className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Questions &amp; Answers</span>
            </div>
            <h2 id="faqs-heading" className="text-2xl font-bold text-on-surface mb-2">
              Electrical Calculators FAQ
            </h2>
            <p className="text-sm text-on-surface-variant">
              Clear answers to common questions about using our electrical calculators and safety guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-outline-variant/40 rounded-xl p-5 bg-surface-container-low flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div>
                <div className="flex items-start gap-3 mb-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 text-xs font-bold shrink-0 mt-0.5">
                    Q
                  </span>
                  <h3 className="text-sm font-semibold text-on-surface leading-snug">
                    What is the 3% voltage drop rule and why is it important?
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed pl-9">
                  Standard electrical safety guidelines recommend keeping voltage drop on any branch circuit under 3%. If voltage drops too much over long distances, electric motors run hot and burn out faster, lights dim, and battery chargers take much longer.
                </p>
              </div>
            </div>

            <div className="border border-outline-variant/40 rounded-xl p-5 bg-surface-container-low flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div>
                <div className="flex items-start gap-3 mb-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 text-xs font-bold shrink-0 mt-0.5">
                    Q
                  </span>
                  <h3 className="text-sm font-semibold text-on-surface leading-snug">
                    Why should I only use 80% of a circuit breaker’s capacity?
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed pl-9">
                  For appliances that run continuously for 3 hours or more (such as space heaters, EV chargers, or servers), electrical safety standards require sizing the circuit at 125% of the load. This ensures the breaker stays at or below 80% capacity to avoid nuisance trips from internal heat buildup.
                </p>
              </div>
            </div>

            <div className="border border-outline-variant/40 rounded-xl p-5 bg-surface-container-low flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div>
                <div className="flex items-start gap-3 mb-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 text-xs font-bold shrink-0 mt-0.5">
                    Q
                  </span>
                  <h3 className="text-sm font-semibold text-on-surface leading-snug">
                    What is the difference between copper and aluminum wiring?
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed pl-9">
                  Copper conducts electricity more easily and has lower resistance than aluminum, meaning you can use a thinner copper wire for the same electrical load. Aluminum is lighter and less expensive for large service entrance cables, but requires a thicker gauge.
                </p>
              </div>
            </div>

            <div className="border border-outline-variant/40 rounded-xl p-5 bg-surface-container-low flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div>
                <div className="flex items-start gap-3 mb-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 text-xs font-bold shrink-0 mt-0.5">
                    Q
                  </span>
                  <h3 className="text-sm font-semibold text-on-surface leading-snug">
                    How do I convert Watts to Amps?
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed pl-9">
                  Divide Watts by Volts. For example, a 1,200W hair dryer plugged into a standard 120V outlet draws: 1,200 ÷ 120 = 10 Amps.
                </p>
              </div>
            </div>

            <div className="border border-outline-variant/40 rounded-xl p-5 bg-surface-container-low flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div>
                <div className="flex items-start gap-3 mb-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 text-xs font-bold shrink-0 mt-0.5">
                    Q
                  </span>
                  <h3 className="text-sm font-semibold text-on-surface leading-snug">
                    What is the difference between 120V, 240V, and 3-Phase power?
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed pl-9">
                  120V is standard for everyday household wall plugs (lamps, TVs, laptops). 240V is used for high-power home appliances like electric dryers, ovens, water heaters, and EV chargers. 3-Phase power is used in commercial buildings and factories for heavy industrial machinery.
                </p>
              </div>
            </div>

            <div className="border border-outline-variant/40 rounded-xl p-5 bg-surface-container-low flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div>
                <div className="flex items-start gap-3 mb-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 text-xs font-bold shrink-0 mt-0.5">
                    Q
                  </span>
                  <h3 className="text-sm font-semibold text-on-surface leading-snug">
                    Do these online calculators replace an electrician inspection?
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed pl-9">
                  No. Our calculators provide accurate mathematical formulas and reference guidelines for planning your projects. For physical installations, panel upgrades, and permitted work, always consult your local municipal codes and a licensed electrician.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. TRUST & ACCURACY METHODOLOGY */}
        <section aria-labelledby="trust-heading" className="bg-surface-container-low/70 border border-outline-variant/40 rounded-2xl p-6 sm:p-8">
          <div className="max-w-3xl mb-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Safety Standards &amp; Guidelines</span>
            </div>
            <h2 id="trust-heading" className="text-2xl font-bold text-on-surface mb-2">
              How We Ensure Electrical Accuracy &amp; Safety
            </h2>
            <p className="text-sm text-on-surface-variant">
              SolveItCalculator uses standard formulas from the National Electrical Code (NEC / NFPA 70), IEEE recommendations, and NIST reference constants so you can plan projects safely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-on-surface-variant">
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-sm">
                <h3 className="font-bold text-on-surface text-sm mb-1">Formulas &amp; Sizing Models</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  National Electrical Code (NEC 2023 edition), IEEE Standard 141 (Red Book), Ohm’s Law, and standard conductor resistivity formulas ($K = 12.9$ for copper, $K = 21.2$ for aluminum).
                </p>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-sm">
                <h3 className="font-bold text-on-surface text-sm mb-2">Official Reference Sources</h3>
                <ul className="space-y-1 text-on-surface-variant list-disc list-inside">
                  <li>National Fire Protection Association (NFPA 70) National Electrical Code</li>
                  <li>IEEE Standard 141: Recommended Practice for Power Distribution</li>
                  <li>NIST Physical Reference Data: Electrical Resistivity of Conductors</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-sm">
                <h3 className="font-bold text-on-surface text-sm mb-2">Standard Assumptions</h3>
                <ul className="space-y-1 text-on-surface-variant list-disc list-inside">
                  <li>Conductors assume 75°C standard insulation terminal rating.</li>
                  <li>AC single-phase systems assume standard 60 Hz 120V/240V supply.</li>
                  <li>Conduit fill calculations assume maximum 40% fill limit for 3+ wires.</li>
                </ul>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-sm">
                <h3 className="font-bold text-on-surface text-sm mb-2">Safety Disclaimers</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  These calculators are designed for planning, estimation, and educational purposes. For final installations, permitted work, and main panel upgrades, always comply with local municipal building codes and hire a licensed master electrician.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
