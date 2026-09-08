'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';

const popularTools = [
  { id: 1, category: 'ev', title: 'EV Charging Cost & Range', icon: 'ev_station', iconBg: 'bg-secondary-fixed text-secondary', badge: 'Trending • 98k/mo', badgeBg: 'bg-secondary-container/20 text-on-secondary-container', desc: 'Compute AC Level 1/2 vs DC Supercharging speeds, time to 80%, home electrical rate vs charging station fees.', version: 'v4.8 • Exact kWh', link: '#' },
  { id: 2, category: 'loans', title: 'Auto Loan & Lease Payoff', icon: 'credit_card', iconBg: 'bg-surface-container-high text-primary', badge: 'Most Used', badgeBg: 'bg-primary-fixed text-on-primary-fixed', desc: 'Amortization with sales tax, title, trade-in equity, dealer discount fees, and early payoff schedules.', version: 'Schedule Engine', link: '#' },
  { id: 3, category: 'fuel', title: 'Gas Mileage & Fuel Efficiency', icon: 'speed', iconBg: 'bg-tertiary-fixed text-tertiary', badge: 'Verified Formula', badgeBg: 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant', desc: 'MPG & L/100km conversion, accurate highway/city splits, trip cost calculator, and tank distance forecast.', version: 'EPA Standard', link: '#' },
  { id: 4, category: 'tires', title: 'Tire Size & Speedo Calibrator', icon: 'donut_large', iconBg: 'bg-surface-container-high text-on-surface', badge: '4.9 ★★★★★', badgeBg: 'bg-secondary-fixed text-on-secondary-fixed', desc: 'Visual side-by-side diameter delta, revs per mile, ground clearance change, and indicated speedometer error.', version: 'Metric & Imperial', link: '#' },
  { id: 5, category: 'engine', title: 'Horsepower, Torque & 1/4 Mile', icon: 'electric_meter', iconBg: 'bg-primary-fixed text-primary', badge: 'Track Calibrated', badgeBg: 'bg-surface-container-high text-on-surface', desc: 'Power-to-weight ratios, trap speed projections, quarter-mile ET, and engine volumetric efficiency solver.', version: 'Dyno Validated', link: '#' },
  { id: 6, category: 'finance', title: 'Depreciation & TCO Calculator', icon: 'trending_down', iconBg: 'bg-surface-container-high text-secondary', badge: 'Finance Suite', badgeBg: 'bg-secondary-fixed-dim text-on-secondary-fixed-variant', desc: '5-year residual value curves, insurance costs, scheduled servicing, and total cost per ownership month.', version: '5-Year Curves', link: '#' },
  { id: 7, category: 'powertrain', title: 'Gear Ratio & Speed at RPM', icon: 'settings', iconBg: 'bg-surface-container text-on-surface', badge: 'Powertrain', badgeBg: 'bg-surface-container-highest text-on-surface', desc: 'Transmission stepping, final drive ratios, tire circumferences, and top speed theoretical limits per gear.', version: 'RPM Mapping', link: '/engine-rpm-calculator' },
  { id: 8, category: 'maintenance', title: 'Maintenance Interval Forecaster', icon: 'build_circle', iconBg: 'bg-tertiary-fixed text-tertiary', badge: 'Fleet Ready', badgeBg: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', desc: 'Synthetic oil countdowns, brake pad wear rates, transmission fluid lifecycle, and climate severity factors.', version: 'Mileage Predictor', link: '#' },
];

const subcategories = [
  { id: 1, title: 'Engine & Performance', icon: '🏎️', count: '9 Tools', countBg: 'bg-surface-container-high', desc: 'Dyno WHP, Boost CFM, Compression Ratio, Air-Fuel Stoich.' },
  { id: 2, title: 'Fuel Economy & Trip', icon: '⛽', count: '8 Tools', countBg: 'bg-surface-container-high', desc: 'MPG to L/100km, Gas Trip Estimator, Commute Fuel Cost.' },
  { id: 3, title: 'Electric Vehicle (EV)', icon: '⚡', count: '7 Tools', countBg: 'bg-secondary-fixed text-on-secondary-fixed', desc: 'kWh per Mile, Supercharging Duration, Cold Range Loss.' },
  { id: 4, title: 'Vehicle Loans & Leasing', icon: '💳', count: '6 Tools', countBg: 'bg-surface-container-high', desc: 'Auto Loan Amortization, Lease vs Buy, Early Payoff Savings.' },
  { id: 5, title: 'Tires, Wheels & Offset', icon: '🔘', count: '5 Tools', countBg: 'bg-surface-container-high', desc: 'Offset Wheel Delta, Rim Width Sizing, Metric Tire Sizer.' },
  { id: 6, title: 'Automotive Conversions', icon: '🔄', count: '6 Tools', countBg: 'bg-surface-container-high', desc: 'PSI to Bar, HP to Kilowatts, Torque Nm to lb-ft, cc to Liters.' },
  { id: 7, title: 'Maintenance & Wear', icon: '🔧', count: '5 Tools', countBg: 'bg-surface-container-high', desc: 'Brake Pad Longevity, Fluid Capacities, Total Ownership Cost.' },
  { id: 8, title: 'Fleet & Logistics', icon: '🗺️', count: '6 Tools', countBg: 'bg-surface-container-high', desc: 'Cost Per Mile (CPM), Cargo Payload, Fuel Tax IFTA Calculator.' },
];

const directoryCards = [
  { id: 1, category: 'ev', tag: 'EV Suite', tagBg: 'bg-secondary-fixed text-on-secondary-fixed', updated: 'Updated 2 days ago', title: 'EV Home vs Public Charging Cost', desc: 'Calculates financial parity between residential Level 2 rates ($/kWh) and commercial DC fast charging network subscriptions.', rating: '4.9 (14.2k)' },
  { id: 2, category: 'loans', tag: 'Finance', tagBg: 'bg-surface-container-high text-on-surface', updated: 'Updated this week', title: 'Lease Residual Value vs Buyout', desc: 'Analyzes lease contract residual ratios against real secondary market valuation to advise on disposition vs lease buyout equity.', rating: '4.8 (21.5k)' },
  { id: 3, category: 'tires', tag: 'Tires & Wheels', tagBg: 'bg-surface-container-high text-on-surface', updated: 'Updated 4 days ago', title: 'Wheel Offset & Backspacing Delta', desc: 'Computes suspension strut inner clearance reduction and outer fender poke when upgrading rim width and millimeter offset (ET).', rating: '4.9 (34.0k)' },
  { id: 4, category: 'fuel', tag: 'Fuel & MPG', tagBg: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', updated: 'Updated yesterday', title: 'Fuel Cost Per Mile & Trip Budget', desc: 'Multi-stop road trip fuel projector accommodating variable fuel prices by state and highway vs city efficiency metrics.', rating: '5.0 (88.9k)' },
  { id: 5, category: 'engine', tag: 'Engine', tagBg: 'bg-surface-container-high text-on-surface', updated: 'Updated 1 wk ago', title: 'Displacement, Bore & Stroke Solver', desc: 'Accurately solves cylinder sweep volume, total cubic inches (CID) and liters (cc) for customized crankshaft stroke specifications.', rating: '4.7 (12.1k)' },
  { id: 6, category: 'maintenance', tag: 'Maintenance', tagBg: 'bg-surface-container-high text-tertiary', updated: 'Updated 3 days ago', title: 'Brake Stopping Distance & Energy', desc: 'Reaction time lag plus dynamic friction deceleration based on dry asphalt, wet tarmac, or icy road conditions.', rating: '4.8 (19.8k)' },
  { id: 7, category: 'ev', tag: 'EV Suite', tagBg: 'bg-secondary-fixed text-on-secondary-fixed', updated: 'Updated 5 days ago', title: 'Battery Degradation & Lifecycle', desc: 'Models NMC and LFP battery chemistry degradation curves across temperature profiles and frequent 100% DC charging habits.', rating: '4.9 (27.4k)' },
  { id: 8, category: 'loans', tag: 'Finance', tagBg: 'bg-surface-container-high text-on-surface', updated: 'Updated this week', title: 'Bi-Weekly Loan Payoff Accelerator', desc: 'Demonstrates exact interest compression achieved by executing 26 bi-weekly half-payments instead of 12 standard monthly payments.', rating: '4.8 (18.2k)' },
  { id: 9, category: 'engine', tag: 'Engine', tagBg: 'bg-surface-container-high text-on-surface', updated: 'Updated 2 wks ago', title: 'Turbocharger CFM & Pressure Ratio', desc: 'Maps target target manifold boost (PSI) and engine volumetric flow against compressor surge and choke lines.', rating: '4.9 (16.5k)' },
  { id: 10, category: 'maintenance', tag: 'Maintenance', tagBg: 'bg-surface-container-high text-tertiary', updated: 'Updated 1 wk ago', title: 'Coolant Mix & Freeze Protection', desc: 'Ethylene glycol vs distilled water balance solving freeze point protection down to -40°F and boiling point elevation.', rating: '4.6 (9.4k)' },
  { id: 11, category: 'fuel', tag: 'Fuel & MPG', tagBg: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', updated: 'Updated 6 days ago', title: 'E85 vs Premium 93 Cost Delta', desc: 'Factors the ~28% lower stoichiometric energy density of ethanol against pump discounts to deduce true cost-per-mile.', rating: '4.9 (22.1k)' },
  { id: 12, category: 'tires', tag: 'Tires', tagBg: 'bg-surface-container-high text-on-surface', updated: 'Updated 3 days ago', title: 'Speed Rating & Load Index Decoder', desc: 'Standardized load capacity indices (Q, H, V, W, Y, (Y)) mapped against axle gross weight distribution tolerances.', rating: '4.8 (11.4k)' },
];

const trendingCards = [
  { id: 1, title: 'EV Cold Weather Range Reducer', growth: '+42%', runs: '48,120 runs', desc: 'Sub-zero cabin resistive heating impact and pack internal resistance model down to -20°F.', tag: 'Thermal Suite' },
  { id: 2, title: 'Used Car APR vs Dealer Financing', growth: '+28%', runs: '36,400 runs', desc: 'Calculates cash rebate tradeoffs against promotional APR terms and total finance charge differences.', tag: 'Finance Delta' },
  { id: 3, title: 'Plus-Sizing Tire Rim & Clearance', growth: '+19%', runs: '24,900 runs', desc: 'Plus-1 and Plus-2 wheel fitments ensuring original overall rolling circumference within 1.5% tolerance.', tag: 'Fitment Geometry' },
  { id: 4, title: 'Turbo Boost CFM to Horsepower', growth: '+15%', runs: '19,850 runs', desc: 'Estimates actual flywheel vs wheel horsepower production based on atmospheric pressure and manifold air density.', tag: 'Aero Induction' },
];

const recentCards = [
  { id: 1, title: 'NACS vs CCS1 Port Speed Estimator', version: 'v2.4', date: 'Feb 2025', desc: 'Calculates adapter thermal throttling limits between 400V and 800V native vehicle architectures.' },
  { id: 2, title: 'Hybrid Battery Replacement ROI', version: 'v2.4', date: 'Jan 2025', desc: 'Weighs OEM replacement pack cost vs reconditioned modules against fuel economy regain.' },
  { id: 3, title: 'Cargo Payload & Axle Distribution', version: 'v2.3', date: 'Jan 2025', desc: 'Solves center of gravity leverage preventing front/rear axle GVWR exceedances for cargo vans.' },
  { id: 4, title: 'E85 Octane Rating Blender', version: 'v2.2', date: 'Dec 2024', desc: 'Calculates exact pump volume additions of E85 to pump 91/93 to achieve target AKI octane (e.g. E30/96 AKI).' },
];

const guides = [
  { id: 1, title: 'How EV Charging Curves Really Work: Peak kW vs Sustained Taper', meta: '8 min read • Technical', desc: 'Why your EV only hits 250 kW for 4 minutes: battery cell internal resistance, C-rate caps, and thermal management models.', author: 'Dr. Lucas Vance' },
  { id: 2, title: 'The Math of Tire Diameter: Why a 3% Change Throws Off Transmission Shifts', meta: '6 min read • Powertrain', desc: 'How modifying tire outer diameter affects ABS wheel speed sensors, torque converter lockup thresholds, and odometer drift.', author: 'Marcus Sterling, PE' },
  { id: 3, title: 'Lease Residual Value vs Market Price: End-of-Term Buyout Strategy', meta: '10 min read • Finance', desc: 'Formulas to model money factor conversion (APR = MF × 2400), acquisition fee amortizations, and equity buyout arbitrage.', author: 'Priya Patel, CFA' },
  { id: 4, title: 'EPA Testing Protocols: Why Real-World Highway MPG Rarely Matches Window Stickers', meta: '7 min read • Standards', desc: 'Dissecting the 5-cycle dynamometer test, aero drag exponentially scaling with velocity, and rolling resistance.', author: 'Elena Rostova' },
];

const relatedCats = [
  { id: 1, title: 'Finance & Banking', icon: 'account_balance', iconBg: 'bg-surface-container-high text-primary group-hover:bg-primary group-hover:text-on-primary', desc: 'Mortgages, compound interest, rate buy-downs, and capital expenditure amortization.', tools: '420+', linkColor: 'text-primary' },
  { id: 2, title: 'Travel & Logistics', icon: 'flight', iconBg: 'bg-surface-container-high text-secondary group-hover:bg-secondary group-hover:text-on-secondary', desc: 'Flight durations, geodesic distances, road trip fuel stops, and nautical miles.', tools: '95+', linkColor: 'text-secondary' },
  { id: 3, title: 'Electrical Engineering', icon: 'electrical_services', iconBg: 'bg-surface-container-high text-primary-container group-hover:bg-primary-container group-hover:text-on-primary-container', desc: "Wire gauge ampacity, Ohm's law, 3-phase AC voltage drop, and capacitor discharge.", tools: '115+', linkColor: 'text-primary-container' },
  { id: 4, title: 'Physics & Mechanics', icon: 'science', iconBg: 'bg-surface-container-high text-tertiary group-hover:bg-tertiary group-hover:text-on-tertiary', desc: 'Kinetic energy, centrifugal acceleration, terminal velocity, and fluid friction.', tools: '175+', linkColor: 'text-tertiary' },
];

const faqs = [
  { id: 1, q: 'How do SolveIt Calculator automotive calculators compute real-world fuel and electricity costs?', a: 'Our calculators blend real-time regional fuel pricing APIs (EIA and AAA averages) with SAE and EPA J1711 standard dynamometer test metrics. For EVs, we factor charging efficiency loss (typically ~10-15% for Level 2 AC and ~5-8% for DC Fast Chargers) rather than simply multiplying battery gross capacity by the flat utility kilowatt-hour tariff.' },
  { id: 2, q: 'Are auto loan and leasing formulas accurate for all 50 US states and international markets?', a: 'Yes. Our auto financing calculator allows users to toggle state-specific tax methodologies (e.g., states where trade-in equity reduces taxable purchase amount vs states like California or Virginia that tax gross purchase prices). It also supports Canadian GST/PST, European VAT schemes, and customized compounding intervals (e.g. Canadian semi-annual compounding vs US monthly simple interest).' },
  { id: 3, q: 'How is tire size diameter and speedometer error mathematically determined?', a: 'We use the standard metric tire formula: Overall Diameter = (Rim Diameter × 25.4) + 2 × (Section Width × Aspect Ratio / 100). Speedometer error is computed as: Speedometer Ratio = Old Diameter / New Diameter. Indicated speed is multiplied by this ratio to calculate the actual ground speed, alongside accurate revolutions-per-mile delta calculations based on static loaded tire radius.' },
  { id: 4, q: 'Can I save vehicle configurations, tire specs, or loan schedules for later comparison?', a: 'Yes! SolveIt Calculator offers zero-login browser local storage persistence. Click the bookmark icon on any calculator workbench to freeze your parameters, vehicle trim specs, and results. You can also generate encrypted instant URL share-links or download full amortization and maintenance matrices as CSV or PDF documents.' },
  { id: 5, q: 'Are SolveIt Calculator automotive calculation algorithms open and transparent?', a: 'Every calculator workbench features an explicit "Formula Breakdown" drawer detailing the mathematical formula, variable unit transformations, and academic or SAE/ISO standard citations used. All calculations run strictly client-side with full source inspectability.' },
];

export default function AutomotivePage() {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState('popular');
  const [favStates, setFavStates] = useState<{[key: number]: boolean}>({});
  const [showCopied, setShowCopied] = useState(false);

  const toggleFav = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setFavStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2500);
  };

  const filteredCards = directoryCards.filter(card => {
    const matchesCat = currentFilter === 'all' || card.category === currentFilter;
    const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sortOrder === 'az') return a.title.localeCompare(b.title);
    if (sortOrder === 'recent') return b.id - a.id;
    return 0;
  });

  return (
    <>
      <Header />
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-64px)]">
        <div className="flex flex-col w-full">
          {/* SECTION 1: CATEGORY HERO & SEARCH BENCH */}
          <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low/60 via-surface to-surface pb-space-2xl pt-space-lg">
            <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/2 left-10 w-80 h-80 rounded-full bg-primary-container/5 blur-3xl pointer-events-none"></div>
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop relative z-10">
              <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs text-body-sm font-body-sm text-outline mb-space-md">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span>Home</span>
                </Link>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface font-medium">Automotive Calculators</span>
              </nav>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                <div className="lg:col-span-7 flex flex-col gap-space-md">
                  <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-surface-container-lowest shadow-sm w-fit">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-container"></span>
                    </span>
                    <span className="font-data-mono text-data-mono text-on-surface text-[12px]">🚗 Automotive Computational Suite • 52 Verified Calculators</span>
                  </div>
                  <h1 className="font-headline-lg lg:font-display-hero text-headline-lg lg:text-display-hero text-on-surface tracking-tight font-bold">
                    Automotive Calculators &amp; Estimators
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                    Calculate fuel costs, loan amortizations, EV charging dynamics, tire size deltas, mileage schedules, and mechanical tolerances with sub-0.02s verified precision.
                  </p>

                  <div className="mt-space-sm relative flex flex-col gap-space-sm">
                    <div className="relative flex items-center bg-surface-container-lowest shadow-md rounded-xl p-1.5 focus-within:shadow-xl transition-all">
                      <span className="material-symbols-outlined text-outline ml-3 text-[22px]">search</span>
                      <input 
                        className="w-full bg-transparent px-3 py-2.5 text-on-surface font-body-md text-body-md outline-none placeholder:text-outline/70" 
                        placeholder="Search automotive calculators, formulas..." 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div className="hidden sm:flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-lg mr-1 text-outline font-data-mono text-[11px]">
                        <span>⌘</span><span>K</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                      {[
                        { id: 'all', label: 'All (52)' },
                        { id: 'ev', label: '⚡ EV & Battery' },
                        { id: 'fuel', label: '⛽ Fuel & MPG' },
                        { id: 'loans', label: '💳 Auto Loans' },
                        { id: 'tires', label: '📏 Tires & Wheels' },
                        { id: 'engine', label: '🏎️ Engine & Power' },
                        { id: 'maintenance', label: '🔧 Maintenance' },
                      ].map(filter => (
                        <button 
                          key={filter.id}
                          className={`px-3.5 py-1.5 rounded-lg font-label-caps text-label-caps whitespace-nowrap transition-all shadow-sm ${currentFilter === filter.id ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'}`}
                          onClick={() => setCurrentFilter(filter.id)}
                          type="button"
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-space-md w-full mt-4 lg:mt-0">
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[20px]">bolt</span>
                        <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-bold">Real-Time EV Trip Metric</span>
                      </div>
                      <span className="font-data-mono text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">Live Model</span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                      <div>
                        <div className="font-numerical-display text-numerical-display text-primary tracking-tight">$8.98</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">280 mi Highway Trip Cost</div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-data-mono text-[12px] font-semibold">
                          Save $38.40 vs Gas
                        </span>
                        <div className="font-data-mono text-[11px] text-outline mt-1">64.2 kWh @ $0.14/kWh</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 bg-surface-container-low/40 rounded-lg p-3">
                      <div className="flex justify-between items-center text-[12px] font-data-mono text-outline mb-1.5">
                        <span>Charge State: 20% → 80%</span>
                        <span className="text-primary font-bold">31 min Supercharge</span>
                      </div>
                      <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
                        <div className="bg-primary-container h-full rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-tertiary text-[20px]">local_gas_station</span>
                        <span className="font-label-caps text-label-caps uppercase tracking-wider text-tertiary font-bold">Fuel Commute Baseline</span>
                      </div>
                      <span className="font-data-mono text-[11px] text-outline">US Avg: $3.45/gal</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-1">
                      <div className="bg-surface-container-low p-2.5 rounded-lg text-center">
                        <div className="font-data-mono text-[16px] font-bold text-on-surface">32.4</div>
                        <div className="font-label-caps text-[10px] text-outline-variant uppercase">MPG Combined</div>
                      </div>
                      <div className="bg-surface-container-low p-2.5 rounded-lg text-center">
                        <div className="font-data-mono text-[16px] font-bold text-on-surface">$112.80</div>
                        <div className="font-label-caps text-[10px] text-outline-variant uppercase">Monthly Spend</div>
                      </div>
                      <div className="bg-surface-container-low p-2.5 rounded-lg text-center">
                        <div className="font-data-mono text-[16px] font-bold text-primary">10.6¢</div>
                        <div className="font-label-caps text-[10px] text-outline-variant uppercase">Cost Per Mile</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: POPULAR TOOLS */}
          <section className="py-space-2xl bg-surface-container-low/40">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps mb-2 uppercase">
                    Curated Algorithms
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    Popular Automotive Tools
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    The most utilized calculators, auto-calibrated for current 2025 rates and vehicle models.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 font-data-mono text-data-mono text-outline text-[13px] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                  <span>Verified IEEE 754 Floats</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {popularTools.map(tool => (
                  <div key={tool.id} className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`p-2 rounded-lg flex items-center justify-center ${tool.iconBg}`}>
                          <span className="material-symbols-outlined text-[20px]">{tool.icon}</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-label-caps text-[10px] font-semibold ${tool.badgeBg}`}>
                          {tool.badge}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-[18px] text-on-surface font-semibold group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-normal">
                        {tool.desc}
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t-0 bg-surface-container-low/50 -mx-space-md -mb-space-md p-space-md rounded-b-xl flex items-center justify-between">
                      <span className="font-data-mono text-[11px] text-outline">{tool.version}</span>
                      <Link href={tool.link} className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-on-primary-fixed-variant transition-all flex items-center gap-1">
                        Launch <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 3: SUBCATEGORY EXPLORER */}
          <section className="py-space-2xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-space-xl">
                <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">Modular Architecture</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold mt-1">
                  Explore by Subcategory
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Navigate 52 distinct calculation systems organized by automotive discipline.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {subcategories.map(sub => (
                  <Link key={sub.id} href="#directory-section" className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all block group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{sub.icon}</span>
                      <span className={`px-2 py-0.5 rounded text-on-surface font-data-mono text-[11px] ${sub.countBg}`}>{sub.count}</span>
                    </div>
                    <h3 className="font-headline-md text-[17px] font-semibold text-on-surface group-hover:text-primary transition-colors">{sub.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{sub.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4: CALCULATORS DIRECTORY */}
          <section className="py-space-2xl bg-surface-container-low/30" id="directory-section">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md mb-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-sm w-full md:w-auto">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">Calculators Directory</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high font-data-mono text-[12px] text-on-surface-variant">
                    {filteredCards.length} Shown
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="relative flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg flex-1 md:w-60">
                    <span className="material-symbols-outlined text-[18px] text-outline mr-2">filter_alt</span>
                    <input 
                      className="bg-transparent text-body-sm font-body-sm text-on-surface outline-none w-full" 
                      placeholder="Filter tools in list..." 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg text-body-sm font-body-sm text-on-surface-variant">
                    <span className="text-outline">Sort:</span>
                    <select 
                      className="bg-transparent font-medium text-on-surface outline-none cursor-pointer"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="popular">Most Popular</option>
                      <option value="recent">Recently Updated</option>
                      <option value="az">Alphabetical (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              {filteredCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {filteredCards.map(card => (
                    <div key={card.id} className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-label-caps text-[11px] px-2 py-0.5 rounded font-semibold ${card.tagBg}`}>{card.tag}</span>
                          <span className="font-data-mono text-[11px] text-outline">{card.updated}</span>
                        </div>
                        <h3 className="font-headline-md text-[18px] font-semibold text-on-surface">{card.title}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                          {card.desc}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low/40 -mx-space-md -mb-space-md p-space-md rounded-b-xl">
                        <div className="flex items-center gap-2 text-outline">
                          <button onClick={(e) => toggleFav(e, card.id)} className={`hover:text-error transition-colors ${favStates[card.id] ? 'text-error' : ''}`} title="Add to favorites">
                            <span className="material-symbols-outlined text-[18px]">{favStates[card.id] ? 'favorite' : 'favorite_border'}</span>
                          </button>
                          <button onClick={handleShare} className="hover:text-primary transition-colors" title="Share tool">
                            <span className="material-symbols-outlined text-[18px]">share</span>
                          </button>
                          <span className="font-data-mono text-[11px]">{card.rating}</span>
                        </div>
                        <button className="px-3 py-1 rounded-lg bg-primary text-on-primary font-body-sm text-[13px] font-medium hover:bg-on-primary-fixed-variant transition-all">
                          Launch ↗
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-space-xl">
                  <span className="material-symbols-outlined text-[48px] text-on-surface-variant">search_off</span>
                  <h3 className="font-headline-md text-[18px] text-on-surface mt-2">No calculators found</h3>
                  <button onClick={() => { setSearchQuery(''); setCurrentFilter('all'); }} className="mt-4 px-4 py-2 rounded-lg bg-primary text-on-primary text-body-sm font-semibold">Clear Filters</button>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 5: TRENDING CALCULATORS */}
          <section className="py-space-2xl bg-surface overflow-hidden">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex items-center justify-between mb-space-lg">
                <div>
                  <span className="font-label-caps text-label-caps px-2.5 py-1 rounded bg-secondary-container/20 text-on-secondary-container font-semibold uppercase">
                    Algorithmic Velocity
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold mt-1">
                    Trending This Week
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button aria-label="Previous trending" className="w-9 h-9 rounded-lg bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface transition-colors" type="button" onClick={() => document.getElementById('trending-track')?.scrollBy({ left: -320, behavior: 'smooth' })}>
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button aria-label="Next trending" className="w-9 h-9 rounded-lg bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface transition-colors" type="button" onClick={() => document.getElementById('trending-track')?.scrollBy({ left: 320, behavior: 'smooth' })}>
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="flex gap-space-md overflow-x-auto no-scrollbar scroll-smooth pb-4" id="trending-track">
                {trendingCards.map(card => (
                  <div key={card.id} className="w-80 shrink-0 bg-surface-container-lowest p-space-md rounded-xl shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1 font-data-mono text-[12px] text-primary font-bold">
                          <span className="material-symbols-outlined text-[16px]">trending_up</span> {card.growth}
                        </span>
                        <span className="font-data-mono text-[11px] text-outline">{card.runs}</span>
                      </div>
                      <h3 className="font-headline-md text-[17px] font-semibold text-on-surface">{card.title}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">{card.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 flex items-center justify-between border-t-0 bg-surface-container-low p-2.5 rounded-lg">
                      <span className="font-label-caps text-[10px] text-outline uppercase font-semibold">{card.tag}</span>
                      <a className="text-primary font-medium text-body-sm hover:underline flex items-center text-[13px]" href="#">Explore <span className="material-symbols-outlined text-[14px]">chevron_right</span></a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 6: RECENTLY ADDED */}
          <section className="py-space-2xl bg-surface-container-low/50">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex items-center gap-3 mb-space-lg">
                <span className="w-3 h-3 rounded-full bg-primary animate-ping"></span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Recently Added Calculators
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {recentCards.map(card => (
                  <div key={card.id} className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-data-mono text-[11px] font-bold">New • {card.version}</span>
                      <span className="font-data-mono text-[11px] text-outline">{card.date}</span>
                    </div>
                    <h3 className="font-headline-md text-[16px] font-semibold text-on-surface">{card.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 leading-normal">
                      {card.desc}
                    </p>
                    <a className="inline-flex items-center gap-1 text-primary text-[13px] font-medium mt-3 hover:underline" href="#">
                      Test Algorithm →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 7: GUIDES */}
          <section className="py-space-2xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-space-xl">
                <span className="font-label-caps text-label-caps text-secondary font-bold uppercase tracking-wider">Engineering Documentation</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold mt-1">
                  Technical Guides &amp; Mathematical Derivations
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Peer-reviewed automotive physics, thermodynamic modeling, and financial formulas powering our calculators.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {guides.map(guide => (
                  <div key={guide.id} className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col justify-between group">
                    <div className="p-space-md">
                      <div className="flex items-center gap-2 text-outline font-data-mono text-[11px] mb-2">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        <span>{guide.meta}</span>
                      </div>
                      <h3 className="font-headline-md text-[17px] font-semibold text-on-surface group-hover:text-primary transition-colors">
                        {guide.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                        {guide.desc}
                      </p>
                    </div>
                    <div className="p-space-md pt-0 bg-surface-container-low/30">
                      <div className="pt-3 border-t-0 flex items-center justify-between text-[12px] font-body-sm text-outline">
                        <span className="font-medium text-on-surface">{guide.author}</span>
                        <span className="text-primary font-semibold group-hover:underline">Read Derivation →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 8: RELATED CATEGORIES */}
          <section className="py-space-2xl bg-surface-container-low/40">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-space-xl">
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Related Computational Disciplines
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Cross-examine automotive outputs with our interconnected mathematical domains.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {relatedCats.map(cat => (
                  <a key={cat.id} className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between" href="#">
                    <div>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${cat.iconBg}`}>
                        <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                      </div>
                      <h3 className="font-headline-md text-[17px] font-semibold text-on-surface">{cat.title}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">
                        {cat.desc}
                      </p>
                    </div>
                    <div className={`mt-4 pt-2 font-data-mono text-[12px] font-medium flex items-center gap-1 ${cat.linkColor}`}>
                      {cat.tools} Tools <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 9: FAQ */}
          <section className="py-space-2xl bg-surface">
            <div className="max-w-3xl mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="text-center mb-space-xl">
                <span className="font-label-caps text-label-caps text-primary font-bold uppercase tracking-wider">Help &amp; Precision FAQ</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold mt-1">
                  Frequently Asked Questions
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Everything you need to know about our automotive modeling formulas and data sources.
                </p>
              </div>
              <div className="space-y-space-sm">
                {faqs.map(faq => (
                  <div key={faq.id} className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                    <button 
                      className="w-full p-space-md text-left flex items-center justify-between font-headline-md text-[17px] font-semibold text-on-surface focus:outline-none"
                      onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                      type="button"
                    >
                      <span>{faq.q}</span>
                      <span className={`material-symbols-outlined text-outline transition-transform duration-200 ${openFaq === faq.id ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    {openFaq === faq.id && (
                      <div className="px-space-md pb-space-md font-body-md text-body-md text-on-surface-variant animate-in fade-in slide-in-from-top-1">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 10: BOTTOM CTA */}
          <section className="py-space-2xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low relative overflow-hidden">
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop text-center relative z-10">
              <div className="max-w-3xl mx-auto flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">directions_car</span>
                </div>
                <h2 className="font-headline-lg lg:font-display-hero text-headline-lg lg:text-[42px] font-bold text-on-surface tracking-tight">
                  Run High-Precision Automotive Calculations Anywhere
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm max-w-2xl">
                  Instantly calibrate vehicle economics and mechanics without paywalls, email forms, or tracking scripts. Fully compatible with offline PWA modes.
                </p>
                <div className="mt-space-lg flex flex-wrap items-center justify-center gap-space-sm">
                  <Link href="#directory-section" className="px-6 py-3 rounded-lg bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-on-primary-fixed-variant transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                    <span>Explore All 52 Calculators</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                  </Link>
                  <button onClick={handleShare} className="px-6 py-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md font-medium hover:bg-surface-bright transition-all shadow-sm flex items-center gap-2" type="button">
                    <span className="material-symbols-outlined text-[18px]">share</span>
                    <span>Share Hub</span>
                  </button>
                </div>
                <div className="mt-space-2xl pt-space-md grid grid-cols-2 md:grid-cols-4 gap-space-md w-full border-t-0 bg-surface-container-lowest/60 backdrop-blur-md p-space-md rounded-xl shadow-sm">
                  <div className="flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-primary text-[24px]">speed</span>
                    <span className="font-headline-md text-[16px] font-bold text-on-surface mt-1">&lt;0.02s Speed</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Real-time local CPU execution</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-secondary text-[24px]">lock</span>
                    <span className="font-headline-md text-[16px] font-bold text-on-surface mt-1">100% Client Private</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Zero server telemetry of inputs</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-primary-container text-[24px]">offline_bolt</span>
                    <span className="font-headline-md text-[16px] font-bold text-on-surface mt-1">Offline PWA Ready</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Functions in garage without WiFi</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-tertiary text-[24px]">verified</span>
                    <span className="font-headline-md text-[16px] font-bold text-on-surface mt-1">SAE &amp; EPA Standards</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Formulas calibrated to code</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        {showCopied && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-on-surface text-surface shadow-lg text-body-sm font-medium transition-all">
            <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
            <span>Link copied to clipboard!</span>
          </div>
        )}
      </main>
      <DarkFooter />
    </>
  );
}

function DarkFooter() {
  return (
    <footer className="w-full bg-inverse-surface text-inverse-on-surface pt-space-2xl pb-space-xl">
      <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-space-xl mb-space-2xl">
          <div className="col-span-2">
            <div className="flex items-center gap-space-xs mb-space-md">
              <span className="material-symbols-outlined text-primary-fixed-dim text-[28px]">calculate</span>
              <span className="font-headline-md text-headline-md tracking-tight text-surface-lowest">SolveIt Calculator</span>
            </div>
            <p className="font-body-sm text-body-sm text-outline-variant max-w-sm mb-space-lg">
              Precision computational workbench calibrated for financial analysts, engineers, and researchers requiring instantaneous mathematical verification.
            </p>
            <div className="flex flex-wrap items-center gap-space-xs">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low/10 text-inverse-on-surface font-label-caps text-label-caps">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>Sub-0.02s Speed
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low/10 text-inverse-on-surface font-label-caps text-label-caps">
                <span className="material-symbols-outlined text-[14px] text-secondary-container">verified</span>IEEE 754 Compliant
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-label-caps text-label-caps text-outline-variant mb-space-md uppercase tracking-wider">Automotive</h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm">
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">Loan &amp; Lease</Link></li>
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">Horsepower to Torque</Link></li>
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">Fuel Economy MPG</Link></li>
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">Brake Stopping Distance</Link></li>
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">EV Battery Range</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-label-caps text-label-caps text-outline-variant mb-space-md uppercase tracking-wider">Finance</h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm">
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">Compound Interest</Link></li>
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">Mortgage Amortization</Link></li>
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">401(k) Retirement Track</Link></li>
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">Capital Gains Tax</Link></li>
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">Options Black-Scholes</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-label-caps text-label-caps text-outline-variant mb-space-md uppercase tracking-wider">Health &amp; Body</h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm">
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">BMR &amp; TDEE Macro</Link></li>
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">Body Fat Navy Method</Link></li>
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">Target Heart Rate</Link></li>
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">GFR Kidney Function</Link></li>
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">Water Intake Baseline</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-label-caps text-label-caps text-outline-variant mb-space-md uppercase tracking-wider">Math &amp; Physics</h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm">
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">Matrix Inversion</Link></li>
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">Eigenvalues &amp; Vectors</Link></li>
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">Kinematic Vectors</Link></li>
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">Quadratic Roots</Link></li>
              <li><Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors">Scientific Notation</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-space-lg border-t border-outline/20 flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="font-body-sm text-body-sm text-outline-variant">
            © 2025 SolveItCalculator.com. All computational outputs are estimates provided without warranty.
          </div>
          <div className="flex items-center gap-space-lg font-body-sm text-body-sm text-outline-variant">
            <Link href="#" className="hover:text-inverse-on-surface transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-inverse-on-surface transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-inverse-on-surface transition-colors">Accuracy Disclaimers</Link>
            <Link href="#" className="hover:text-inverse-on-surface transition-colors">API Integration</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
